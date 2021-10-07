import { Database, OperationStatus } from "../database/Database";
import { getElevId } from "../instrukdb/elevOversigt";
import { Employee } from "../models/Employee";

export const addElev = async (database: Database, elev: Employee) => {
  const idValidRes = await database.isElevIdValid(elev);
  if (idValidRes.status !== OperationStatus.Ok)
    throw idValidRes.error || idValidRes.catched;
  if (idValidRes.data)
    return await database.addElev(elev);
  else
    throw new Error('Elev with same id already exists')
}

export const getElev = async (database: Database, elevId: number) => {
  const getElevRes = await database.getElev(elevId);
  if (getElevRes.status === OperationStatus.Ok)
    return getElevRes.data;
  else
    if (getElevRes.status === OperationStatus.Empty)
      throw new Error('Elev not found');
    else
      throw getElevRes.error || getElevRes.catched;
}

export const updateElev = async (database: Database, elevId: number, data: Employee) => {

}
