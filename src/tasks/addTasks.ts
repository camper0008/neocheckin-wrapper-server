import { Database } from "../database/Database";
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
  if (date instanceof Date) return date;
  if (typeof date === 'string') return new Date(date);
  return new Date();
}

export const addTask = async (task: AddTaskRequest, db: Database): Promise<Task> => {
  const {name, date} = task;
  if (name === '')
    throw new Error('name empty');
  const id = await db.getUniqueTaskId();
  const insert = await db.insertTask({
    ...task,
    date: getDateFromDateOrString(date),
    id,
    status: TaskStatus.WAITING,
    taskTypeId: task.taskTypeId
  });
  return insert;
}
