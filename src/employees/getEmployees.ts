import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Employee } from "../models/Employee";
import { base64FromBinaryString } from "../utils/base64img";

export const getEmployeeImageBase64 = async (id: number, idb: Instrukdb.API) => {
  const binaryString = await idb.getEmployeeImage(id);
  const base64 = base64FromBinaryString(binaryString);
  return base64;
}

// export const syncronizeEmployees = async (db: Database, idb: Instrukdb.API) => {
//   await idb.getAllEmployees();
// }

export const getAllEmployees = async (db: Database, idb: Instrukdb.API): Promise<(Employee & {photo: string})[]> => {
  const idbEmployees = await idb.getAllEmployees(); 
  const employees = Array<(Employee & {photo: string})>(500);
  for (let i in idbEmployees) {
    const {
      id, name, checkedIn, flex, location, rfid
    } = idbEmployees[i];
    employees.push({
      id, name, working: checkedIn, flex, department: location, rfid, photo: '' // TODO very todo
    });
  }
  
  return employees;
}
