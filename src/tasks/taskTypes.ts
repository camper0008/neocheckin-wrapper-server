import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task } from "../models/Task";
import { TaskType } from "../models/TaskType";

export const synchronizeTaskTypes = async (db: Database, idb: Instrukdb.API) => {
  const schedule = await idb.getSchedule();
  await db.replaceTaskTypes(schedule);
}

export const getTaskTypes = async (db: Database, idb: Instrukdb.API): Promise<TaskType[]> => {
  await synchronizeTaskTypes(db, idb);
  return await db.getTaskTypes();
}
