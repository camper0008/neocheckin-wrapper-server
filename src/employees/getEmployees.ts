import axios from "axios";
import { Agent as HttpsAgent } from "https";
import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Employee } from "../models/Employee";

export const getEmployeeImageBase64 = async (id: number) => {
  const response = await axios.get(
    `https://instrukdb/elevbilled.php?id=${id}`,
    {
      responseType: 'arraybuffer',
      httpsAgent: new HttpsAgent({rejectUnauthorized: false})
    }
  );
  const buffer = Buffer.from(response.data as string, 'binary');
  return buffer.toString('base64');
}

export const getEmployees = async (db: Database, idb: Instrukdb.API): Promise<Employee[]> => {
  const employees: Employee[] = [];
  
  const iEmployees = await idb.getAllEmployees();
  for (let i in iEmployees) {
    const {
      id,
      name,
      location,
      flexSeconds,
      checkedIn
    } = iEmployees[i];
    employees.push({
      id,
      name,
      department: location,
      flex: flexSeconds,
      photo: await getEmployeeImageBase64(id),
      working: checkedIn,
    });
  }

  return employees;
}

export type EmployeeWithRfid = Employee & {rfid: string | null};

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

export const removeEmployeesWithoutRfid = (employees: EmployeeWithRfid[]): EmployeeWithRfid[] => {
  const employeesWRfid: EmployeeWithRfid[] = []
  for (let i in employees)
    if (employees[i].rfid !== null)
      employeesWRfid.push(employees[i]);
  return employeesWRfid;
}

export const removeEmployeesWithRfid = (employees: EmployeeWithRfid[]): EmployeeWithRfid[] => {
  const eo: EmployeeWithRfid[] = [];
  for (let i in employees)
    if (employees[i].rfid === null)
      eo.push(employees[i]);
  return eo;
}

export const hasEmployeesWithoutRfid = (employees: EmployeeWithRfid[]): boolean => {
  for (let i in employees)
    if (employees[i].rfid === null)
      return true;
  return false;
}
