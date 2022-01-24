import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { Task } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { getRfidAsNumber } from "../utils/strings";
import { getUnixTimestamp } from "../utils/timedate";

export const runTask = async (task: Task, db: Database, idb: Instrukdb.API, logger?: Logger): Promise<void> => {
  const taskType = await validTaskType(task, db);

  const request = makeRequest(task, taskType);

  if (isDevelopmentUser(task)) return undefined;

  const response = await idb.postCheckin(request);

  await checkResponse(response, task, logger);
}

const makeRequest = (task: Task, taskType: TaskType): Instrukdb.PostCheckinRequest => {
  return {
    ip: task.systemIp,
    option: taskType.instrukdbIdentifier ?? taskType.name,
    rfid: getRfidAsNumber(task.employeeRfid),
    timestamp: getUnixTimestamp(task.date),
    token: task.highLevelApiKey,
    details: `neocheckin ${new Date().toISOString()}`,
  }
}

const checkResponse = async (response: Instrukdb.StatusRes, task: Task, logger?: Logger) => {
  if (failed(response))
    await throwAndLogError(response, task, logger);
  else
    await logSuccess(response, task, logger);
}

const failed = (response: Instrukdb.StatusRes) => {
  return response.statusCode !== 200;
}

const throwAndLogError = async (response: Instrukdb.StatusRes, task: Task, logger?: Logger) => {
  await logger?.logRunTaskError(task, response);
  throw new Error('Instrukdb error: ' + response.message ?? '');
}

const logSuccess = async (response: Instrukdb.StatusRes, task: Task, logger?: Logger) => {
  await logger?.logRunTaskSuccess(task, response);
}

const validTaskType = async (task: Task, db: Database) => {
  try {
    return await db.getTaskType(task.taskTypeId);
  } catch (c) {
    if ((c as Error).message === 'not found')
      throw new Error(`invalid task type id '${task.taskTypeId}'`);
    else
      throw c;
  }
}

const isDevelopmentUser = (task: Task) => {
  return task.employeeRfid === '1234567890';
}
