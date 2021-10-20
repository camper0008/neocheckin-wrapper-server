import { Database } from "../database/Database";
import { Task } from "../models/Task";

export interface AddTaskRequest {
  name: string,
  taskId: number,
  date?: Date,
  systemIdentifier: string,
  employeeRfid: string,
  highLevelApiKey: string,
}

export const addTask = async (task: AddTaskRequest, db: Database): Promise<Task> => {
  const {name, date} = task;
  if (name === '')
    throw new Error('name empty');
  const id = await db.getUniqueTaskId();
  const insert = await db.insertTask({...task, date: date || new Date(), id});
  return insert;
}
