import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { Employee } from "../models/Employee";
import { downloadProfilePicture } from "../profilePictures/downloadProfilePicture";

export const addDevEmployee = async (db: Database, idb: Instrukdb.API, logger?: Logger): Promise<void> => {
  const devUser: Employee = {
    name: 'Test Bruger',
    department: 'EUX',
    flex: 3600,
    id: 10000,
    rfid: '1234567890',
    working: false
  }
  if (await db.checkEmployee(devUser.id))
    return undefined;
  await db.insertEmployee(devUser);
  const picture = downloadProfilePicture(407, db, idb, logger);
}
