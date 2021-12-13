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

export const getAllEmployees = async (db: Database, idb: Instrukdb.API): Promise<(Employee & {photo: string})[]> => {
  const idbEmployees = await idb.getAllEmployees();
  const employees = idbEmployees.map<(Employee & {photo: string | null})>((e) => ({
    id:         e.id,
    name:       e.name,
    working:    e.checkedIn,
    flex:       e.flex,
    department: e.location,
    rfid:       padRfid(e.rfid),
    photo:      null
  }));
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
