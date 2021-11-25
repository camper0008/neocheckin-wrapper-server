import { Database } from "../database/Database";
import { Logger } from "../logs/Logger";
import { Task, TaskStatus } from "../models/Task";
import { getDateFromDateOrString } from "../utils/timedate";

export interface AddTaskRequest {
  name: string,
  taskTypeId: number,
  date?: Date | string,
  systemIdentifier: string,
  systemIp: string,
  employeeRfid: string,
  highLevelApiKey: string,
}

export const addTask = async (request: AddTaskRequest, db: Database, logger?: Logger): Promise<Task> => {
  checkTaskName(request, logger);
  const {id, date} = await getTaskDetails(request, db);
  const task = makeTask(request, id, date);
  const insert = await db.insertTask(task);
  await logger?.logAddTaskSuccess(request);
  return insert;
}


const checkTaskName = (request: AddTaskRequest, logger?: Logger) => {
  if (invalidTaskName(request.name))
    failTaskNameEmpty(request, logger);
}

const invalidTaskName = (name: string) => {
  return name === '';
}

const failTaskNameEmpty = (request: AddTaskRequest, logger?: Logger) => {
  logger?.logAddTaskError(request);
  throw new Error('name empty');
}

const getTaskDetails = async (request: AddTaskRequest, db: Database) => {
  const id = await db.getUniqueTaskId();
  const date = getDateFromDateOrString(request.date);
  return {id, date};
}

const makeTask = (request: AddTaskRequest, id: number, date: Date) => {
  const status = TaskStatus.WAITING;
  const taskTypeId = request.taskTypeId;
  return {...request, date, id, status, taskTypeId};
}
