import { Employee } from "../models/Employee";

export enum OperationStatus {
  Ok,
  Empty,
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

  public abstract isElevIdValid: (elev: Employee) => Promise<SingleOperationResult<boolean>>;
  public abstract addElev: (elev: Employee) => Promise<SingleOperationResult<Employee>>;
  public abstract getElev: (id: number) => Promise<SingleOperationResult<Employee>>;

}
