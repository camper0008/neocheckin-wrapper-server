import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { Employee } from "../models/Employee";

export const getEmployees = async (db: Database, idb: Instrukdb.API, logger?: Logger): Promise<Employee[]> => {
  return (await db.getEmployees()).sort((a, b) => a.name.localeCompare(b.name));
}

export const getEmployeesWithImages = async (db: Database, idb: Instrukdb.API, logger?: Logger): Promise<(Employee & {photo: string})[]> => {
  const resolvers = (await db.getEmployees()).map(async (e) => ({
    ...e,
    photo: (await db.getProfilePictureByEmployeeId(e.id)).base64
  }));
  return (await Promise.all(resolvers)).sort((a, b) => a.name.localeCompare(b.name));
}
