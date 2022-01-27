import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { ProfilePicture } from "../models/ProfilePicture";
import { downloadProfilePictures } from "./downloadProfilePictures";

export const syncProfilePictures = async (db: Database, idb: Instrukdb.API, logger?: Logger): Promise<void> => {
  const profilePicturesWithoutIds = await downloadProfilePictures(db, idb, logger);
  const ppWithoutDuplicates = await removeDuplicates(profilePicturesWithoutIds, db);
  const profilePictures = await addUniqueIds(ppWithoutDuplicates, db);
  await insertIntoDatabase(profilePictures, db);
}

const removeDuplicates = async (profilePictures: Omit<ProfilePicture, "id">[], db: Database): Promise<Omit<ProfilePicture, "id">[]> => {
  const isDuplicateResolvers = profilePictures.map(async (pp) =>
  ({...pp, isDuplicate: await db.checkProfilePictureByChecksum(pp.checksum, pp.employeeId)}));
  const ppWithIsDuplicate = await Promise.all(isDuplicateResolvers);
  const ppWithoutDuplicates = ppWithIsDuplicate.filter(({isDuplicate}) => !isDuplicate);
  return ppWithoutDuplicates
}

const addUniqueIds = async (profilePictures: Omit<ProfilePicture, "id">[], db: Database): Promise<ProfilePicture[]> => {
  const profilePictureResolvers = profilePictures.map(async (pp) =>
  ({...pp, id: await db.getUniqueProfilePictureId()}));
  const profilePicturesWithIds = await Promise.all(profilePictureResolvers);
  return profilePicturesWithIds;
}

const insertIntoDatabase = async (profilePictures: ProfilePicture[], db: Database) => {
  const insertResolvers = profilePictures.map(async (pp) => await db.insertProfilePicture(pp));
  await Promise.all(insertResolvers);
}
