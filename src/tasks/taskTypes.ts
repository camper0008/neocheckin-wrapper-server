import { readFile } from "fs/promises";
import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { TaskType } from "../models/TaskType";

export const synchronizeTaskTypesWithSample = async (db: Database, idb?: Instrukdb.API) => {
  const text = (await readFile('./samples/schedule.json')).toString();
  const schedule: TaskType[] = JSON.parse(text);
  await db.replaceTaskTypes(schedule);
}

export const getTaskTypes = async (db: Database, idb: Instrukdb.API): Promise<TaskType[]> => {
  return await db.getTaskTypes();
}
