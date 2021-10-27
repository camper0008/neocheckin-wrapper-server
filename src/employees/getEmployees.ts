import axios from "axios";
import { Agent as HttpsAgent } from "https";
import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Employee } from "../models/Employee";
import { base64FromBinaryString, BinaryString } from "../utils/base64img";

// TODO refactor away to instrukdb and utils/base64img

export const getEmployeeImageBase64 = async (id: number, idb: Instrukdb.API) => {
  const binaryString = await idb.getEmployeeImage(id);
  const base64 = base64FromBinaryString(binaryString);
  return base64;
}

export const getEmployees = async (db: Database, idb: Instrukdb.API): Promise<Employee[]> => {
  const employees: Employee[] = [];
  
  const iEmployees = await idb.getAllEmployees();
  for (let i in iEmployees) {
    const {
      id,
      name,
      location,
      flex,
      checkedIn
    } = iEmployees[i];
    employees.push({
      id,
      name,
      department: location,
      flex,
      photo: await getEmployeeImageBase64(id, idb), // TODO get images a smarter way
      working: checkedIn,
    });
  }

  return employees;
}

export type EmployeeWithRfid = Employee & {rfid: string | null};

// TODO refactor
export const getEmployeesWithRfid = async (db: Database, idb: Instrukdb.API): Promise<EmployeeWithRfid[]> => {
  const employees = await getEmployees(db, idb);
  const employeesWithRfid: EmployeeWithRfid[] = [];
  for (let i in employees) {
    try {
      const {rfid} = await db.getRfidByEmployeeId(employees[i].id);
      employeesWithRfid.push({...employees[i], rfid});
    } catch (catched) {
      employeesWithRfid.push({...employees[i], rfid: null});
    }
  }
  return employeesWithRfid;
}

// TODO query instead
export const removeEmployeesWithoutRfid = (employees: EmployeeWithRfid[]): EmployeeWithRfid[] => {
  const employeesWRfid: EmployeeWithRfid[] = []
  for (let i in employees)
    if (employees[i].rfid !== null)
      employeesWRfid.push(employees[i]);
  return employeesWRfid;
}

// TODO query instead
export const removeEmployeesWithRfid = (employees: EmployeeWithRfid[]): EmployeeWithRfid[] => {
  const eo: EmployeeWithRfid[] = [];
  for (let i in employees)
    if (employees[i].rfid === null)
      eo.push(employees[i]);
  return eo;
}

// TODO should use database
export const hasEmployeesWithoutRfid = (employees: EmployeeWithRfid[]): boolean => {
  for (let i in employees)
    if (employees[i].rfid === null)
      return true;
  return false;
}
