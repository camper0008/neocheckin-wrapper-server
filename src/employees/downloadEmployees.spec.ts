import { readFile } from "fs/promises";
import { MemoryDB } from "../database/MemoryDB";
import {MockMemoryDB} from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { downloadAllEmployees, downloadAllEmployeesWithImages, downloadEmployeeImageBase64 } from "./downloadEmployees";


describe('getEmployeeImageBase64', () => {

  it('should return base64 of image', async () => {
    const idb = new MockInstrukdb();
    const result = await downloadEmployeeImageBase64(1, idb);
    const base64sample = (await readFile('./samples/employee_1_img.base64')).toString()
    expect(result).toBe(base64sample);
  });

});

describe('getAllEmployees', () => {
  it('should not error', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    await downloadAllEmployees(db, idb);
  });
  it('should call idb.getAllEmployees once', async () => {
    const db = new MemoryDB();
    const idb = new MockInstrukdb();
    await downloadAllEmployeesWithImages(db, idb);
    expect(idb.getAllEmployeesCalls).toBe(1);
  });
});

describe('getAllEmployeesWithImages', () => {
  it('should give employees photos', async () => {
    const db = new MemoryDB();
    const idb = new MockInstrukdb();
    const employees = await downloadAllEmployeesWithImages(db, idb);
    expect(employees[0].photo).not.toBe(null);
  });

});
