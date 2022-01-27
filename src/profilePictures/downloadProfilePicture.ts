import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { ProfilePicture } from "../models/ProfilePicture";
import { base64FromBinaryString, base64hash } from "../utils/base64img";

export const downloadProfilePicture = async (employeeId: number, db: Database, idb:  Instrukdb.API, logger?: Logger): Promise<ProfilePicture> => {
  const binaryString = await idb.getEmployeeImage(employeeId);
  const base64 = base64FromBinaryString(binaryString);
  return {
    id: await db.getUniqueProfilePictureId(),
    base64,
    checksum: base64hash(base64),
    employeeId,
  };
}
