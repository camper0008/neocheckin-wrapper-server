import { Database, OperationStatus } from "../database/Database";
import { Elev } from "../models/Elev";

export const addElev = async (database: Database, elev: Elev) => {
  const idValidRes = await database.isElevIdValid(elev);
  if (idValidRes.status !== OperationStatus.Ok)
    throw idValidRes.catched;
  if ((await database.isElevIdValid(elev)).data)
    return await database.addElev(elev);
  else
    throw new Error('Elev with same id already exists')
}
