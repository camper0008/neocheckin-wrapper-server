import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Employee } from "../models/Employee";
import { base64FromBinaryString, BinaryString } from "../utils/base64img";
import { padRfid, padString } from "../utils/strings";

export const getEmployeeImageBase64 = async (id: number, idb: Instrukdb.API) => {
  const binaryString = await idb.getEmployeeImage(id);
  const base64 = base64FromBinaryString(binaryString);
  return base64;
}

export const getAllEmployees = async (db: Database, idb: Instrukdb.API): Promise<Employee[]> => {
  const idbEmployees = await idb.getAllEmployees();
  const employees = idbEmployees.map<Employee>((e) => ({
    id:         e.id,
    name:       e.name,
    working:    e.checkedIn,
    flex:       e.flex,
    department: e.location,
    rfid:       padRfid(e.rfid)
  }));
  return employees;
}

export const getAllEmployeesWithImages = async (db: Database, idb: Instrukdb.API): Promise<(Employee & {photo: string})[]> => {
  const employeesWithoutImage = await getAllEmployees(db, idb);
  const employees = employeesWithoutImage.map<(Employee & {photo: string | null})>((e) => ({...e, photo: null}));
  const employeeImageUpdates = employees.map(async ({id}, i) => (employees[i].photo = await getEmployeeImageBase64(id, idb)));
  await Promise.all(employeeImageUpdates);
  addDevelopmentUser(employees);
  return employees as (Employee & {photo: string})[];
}

const addDevelopmentUser = (employees: (Employee & {photo: string | null;})[]) => {
  const soelberg = 407;
  const photo = employees.find(employee => employee.id === soelberg)?.photo ?? '';
  employees.push({
    name: 'Test Bruger',
    department: 'EUX',
    flex: 3600,
    id: 10000,
    photo,
    rfid: '1234567890',
    working: false
  });
}
