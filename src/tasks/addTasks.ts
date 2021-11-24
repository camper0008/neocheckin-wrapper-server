import { Database } from "../database/Database";
import { Logger } from "../logs/Logger";
import { LogStatus } from "../logs/LogItem";
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
  const id = await db.getUniqueTaskId();
  const date = getDateFromDateOrString(request.date);
  const task = makeTask(request, id, date);
  const insert = await db.insertTask(task);
  logger?.logAddTask(request, LogStatus.success);
  return insert;
}

const checkTaskName = (request: AddTaskRequest, logger?: Logger) => {
  if (invalidTaskName(request.name))
    failTaskNameEmpty(request, logger);
}

const invalidTaskName = (name: string) => {
  return name === ''
}

const failTaskNameEmpty = (request: AddTaskRequest, logger: Logger | undefined) => {
  logger?.logAddTask(request, LogStatus.error);
  throw new Error('name empty');
}

const makeTask = (request: AddTaskRequest, id: number, date: Date) => {
  return {
    ...request,
    date,
    id,
    status: TaskStatus.WAITING,
    taskTypeId: request.taskTypeId
  }
}
