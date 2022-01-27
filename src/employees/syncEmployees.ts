import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { Employee } from "../models/Employee";
import { downloadEmployees } from "./downloadEmployees";

export const syncEmployees = async (db: Database, idb: Instrukdb.API, logger?: Logger): Promise<void> => {
  const employees = await downloadEmployees(db, idb);
  const existingInDbPromises = employees.map(e => existingInDbPromise(e, db));
  const existingInDb = await Promise.all(existingInDbPromises);
  for (const pair of existingInDb)
    await updateOrInsertEmployee(pair, employees, db);
}

type EmployeeIdExistPair = {id: number, exists: boolean}; 

const existingInDbPromise = async (employee: Employee, db: Database): Promise<EmployeeIdExistPair> => {
  return {
    id: employee.id,
    exists: await db.checkEmployee(employee.id),
  };
}

const updateOrInsertEmployee = async ({id, exists}: EmployeeIdExistPair, employees: Employee[], db: Database) => {
  const employee = employeeById(employees, id);
  if (exists)
      await db.updateEmployee(id, employee);
    else
      await db.insertEmployee(employee);
}

const employeeById = (employees: Employee[], id: number): Employee => {
  // although employees.find returns Employee | undefined, we know all employees are there, hence '!' at the end
  return employees.find(e => e.id === id)!;
}

