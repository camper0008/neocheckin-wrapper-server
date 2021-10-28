import { readFile } from "fs/promises";
import { MemoryDB } from "../database/MemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { getAllEmployees, getEmployeeImageBase64 } from "./getEmployees";


describe('getEmployeeImageBase64', () => {

  it('should return base64 of image', async () => {
    const idb = new MockInstrukdb();
    const result = await getEmployeeImageBase64(1, idb);
    const base64sample = (await readFile('./samples/employee_1_img.base64')).toString()
    expect(result).toBe(base64sample);
  });

});

describe('getAllEmployees', () => {

  it('should call idb.getAllEmployees once', async () => {
    const db = new MemoryDB();
    const idb = new MockInstrukdb();
    await getAllEmployees(db, idb);
    expect(idb.getAllEmployeesCalls).toBe(1);
  });

});