import { Employee } from "../models/Employee";

export abstract class Database {

  public abstract getEmployeeById: (id: number) => Promise<Employee | null>; 

}
