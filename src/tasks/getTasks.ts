import { Database } from "../database/Database";
import { Task } from "../models/Task";

export const getTasks = async (db: Database): Promise<Task[]> => {
  return db.getTasks();
}
