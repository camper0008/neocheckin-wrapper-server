import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { Employee } from "../models/Employee";
import { ProfilePicture } from "../models/ProfilePicture";
import { Base64, base64FromBinaryString, base64hash, BinaryString } from "../utils/base64img";

export const downloadProfilePictures = async (db: Database, idb: Instrukdb.API, logger?: Logger): Promise<Omit<ProfilePicture, 'id'>[]> => {
  const employees = await db.getEmployees();
  const imagesWithIds = await getImagesWithIds(employees, idb);
  const base64sWithIds = convertImagesToBase64(imagesWithIds);
  const profilePictures = addChecksumHashes(base64sWithIds);
  return profilePictures;
}

const getImagesWithIds = async (employees: Employee[], idb: Instrukdb.API): Promise<{id: number, image: BinaryString}[]> => {
  const imageResolvers = employees.map(({id}) => async () => ({id, image: await idb.getEmployeeImage(id)}));
  const imagesWithIdsPromises = imageResolvers.map(resolver => resolver());
  const imagesWithIds = await Promise.all(imagesWithIdsPromises);
  return imagesWithIds;
}

const convertImagesToBase64 = (imagesWithIds: {id: number, image: BinaryString}[]): Pick<ProfilePicture, 'base64'|'employeeId'>[] => {
  return imagesWithIds.map(({id, image}) => ({employeeId: id, base64: base64FromBinaryString(image)}));
}

type AddChecksumHashesReq = Pick<ProfilePicture, 'base64'|'employeeId'>[];
type AddChecksumHashesRes = Pick<ProfilePicture, 'base64'|'employeeId'|'checksum'>[];

const addChecksumHashes = (base64WithIds: AddChecksumHashesReq): AddChecksumHashesRes => {
  return base64WithIds.map(({employeeId, base64}) => ({
    base64, employeeId,
    checksum: base64hash(base64),
  }))
}
