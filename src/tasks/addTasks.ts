import { Database } from "../database/Database";
import { CheckTask } from "../models/CheckTask";

export interface AddCheckInTaskRequest {
  name: string,
  actionId: number,
  date?: Date,
  authorName: string,
  authorEmail: string,
}

export const addCheckTask = async (task: AddCheckInTaskRequest, db: Database): Promise<CheckTask> => {
  const {name, date} = task;
  if (name === '')
    throw new Error('name empty');
  const id = await db.getUniqueTaskId();
  const insert = await db.insertCheckTask({...task, date: date || new Date(), id});
  return insert;
}
