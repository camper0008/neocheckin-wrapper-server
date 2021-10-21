import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task } from "../models/Task";

export const synchronizeTaskTypes = async (db: Database, idb: Instrukdb.API) => {
  const schedule = await idb.getSchedule();
  await db.replaceTaskTypes(schedule);
}

export const getTaskTypes = async (db: Database): Promise<Task[]> => {

  // TODO synchronize with instrukdb

  return await db.getTasks();
}
