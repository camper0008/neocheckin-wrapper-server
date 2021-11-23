import { tasksRoutes } from "../api/tasks";
import { Database } from "../database/Database";
import { formatTask } from "../logs/formatLogs";
import { Logger } from "../logs/Logger";
import { LogItem, LogStatus } from "../logs/LogItem";
import { Task, TaskStatus } from "../models/Task";

export interface AddTaskRequest {
  name: string,
  taskTypeId: number,
  date?: Date | string,
  systemIdentifier: string,
  systemIp: string,
  employeeRfid: string,
  highLevelApiKey: string,
}

export const getDateFromDateOrString = (date?: Date | string) => {
  if (date instanceof Date) 
    return date;
  else 
    if (typeof date === 'string') return new Date(date);
  else 
    return new Date();
}

export const addTask = async (task: AddTaskRequest, db: Database, logger?: Logger): Promise<Task> => {
  const {date} = task;
  checkTaskName(task, logger);
  const id = await db.getUniqueTaskId();
  const insert = await db.insertTask({
    ...task,
    date: getDateFromDateOrString(date),
    id,
    status: TaskStatus.WAITING,
    taskTypeId: task.taskTypeId
  });
  logger?.logAddTask(task, LogStatus.success);
  return insert;
}

const invalidTaskName = (name: string) => {
  return name === ''
}

function checkTaskName(task: AddTaskRequest, logger: Logger | undefined) {
  if (invalidTaskName(task.name)) {
    logger?.logAddTask(task, LogStatus.error);
    throw new Error('name empty');
  }
}

