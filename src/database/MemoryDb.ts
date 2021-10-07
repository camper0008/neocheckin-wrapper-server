import { Employee } from "../models/Employee";
import { Database } from "./Database";

export class MemoryDb extends Database {
  
  private employees: Employee[] = [];

  public getEmployeeById = async (id: number) => {
    for (let i in this.employees)
      if (this.employees[i].id === id)
        return this.employees[i];
    return null;
  };

}
