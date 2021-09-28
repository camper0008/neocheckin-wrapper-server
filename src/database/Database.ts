import { Elev } from "../models/Elev";

export enum OperationStatus {
  Ok,
  BadRequest,
  DbError,
  ServerError
}

export interface SingleOperationResult <Data>{
  status: OperationStatus,
  data?: Data,
  error?: Error,
  catched?: unknown,
}

export abstract class Database {

  public abstract isElevIdValid: (elev: Elev) => Promise<SingleOperationResult<boolean>>;
  public abstract addElev: (elev: Elev) => Promise<SingleOperationResult<Elev>>;

}
