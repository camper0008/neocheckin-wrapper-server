import { Database } from "../database/Database";
import { Task } from "../models/Task";

export const getTaskTypes = async (db: Database): Promise<Task[]> => {

  // TODO synchronize with instrukdb

  return await db.getTasks();
}
