import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { Employee } from "../models/Employee";

export const getEmployees = async (db: Database, idb: Instrukdb.API, logger?: Logger): Promise<Employee[]> => {
  return await db.getEmployees();
}
