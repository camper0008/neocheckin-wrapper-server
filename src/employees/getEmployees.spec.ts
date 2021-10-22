import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { Rfid } from "../models/Rfid";
import { getEmployees, getEmployeesWithRfid, hasEmployeesWithoutRfid, removeEmployeesWithoutRfid, removeEmployeesWithRfid } from "./getEmployees";

describe('getEmployees', () => {

  it('should return array with same length as Instrukdb', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const result = await getEmployees(db, idb);
    expect(result.length).toBe(idb.employees.length)
  });

});

describe('getEmployeesWithRfid', () => {

  it('should have an rfid', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const result = await getEmployeesWithRfid(db, idb);
    expect(result[0].rfid).not.toBe(undefined);
  });

  it('should return stored rfid', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const rfid: Rfid = {id: await db.getUniqueRfidId(), employeeId: 1, rfid: 'foobar'};
    db.insertRfid(rfid);
    const result = await getEmployeesWithRfid(db, idb);
    expect(result[0].rfid).toBe('foobar');
  });

  it('should return null as rfid', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const result = await getEmployeesWithRfid(db, idb);
    expect(result[0].rfid).toBe(null);
  });

});

describe('removeEmployeesWithoutRfid', () => {

  it('should return empty array', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const employees = await getEmployeesWithRfid(db, idb);
    const ewor = removeEmployeesWithoutRfid(employees);
    expect(ewor).toEqual([]);
  });

  it('should return array with one employee', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const rfid: Rfid = {id: await db.getUniqueRfidId(), employeeId: 1, rfid: 'foobar'};
    db.insertRfid(rfid);
    const e = await getEmployeesWithRfid(db, idb);
    const ewr = removeEmployeesWithoutRfid(e);
    expect(ewr.length).toBe(1);
  });

});

describe('removeEmployeesWithRfid', () => {

  it('should return empty array', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const employees = await getEmployeesWithRfid(db, idb);
    const ewor = removeEmployeesWithRfid(employees);
    expect(ewor.length).toBe(idb.employees.length);
  });

  it('should return array with 2 employees', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const rfid: Rfid = {id: await db.getUniqueRfidId(), employeeId: 1, rfid: 'foobar'};
    db.insertRfid(rfid);
    const ewr = await getEmployeesWithRfid(db, idb);
    const ewor = removeEmployeesWithRfid(ewr);
    expect(ewor.length).toBe(2);
  });

});

describe('removeEmployeesWithRfid', () => {

  it('should return true', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    const employees = await getEmployeesWithRfid(db, idb);
    const res = hasEmployeesWithoutRfid(employees);
    expect(res).toBe(true);
  });

  it('should return false', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    db.insertRfid({id: await db.getUniqueRfidId(), employeeId: 1, rfid: 'foobar'});
    db.insertRfid({id: await db.getUniqueRfidId(), employeeId: 2, rfid: 'foobar'});
    db.insertRfid({id: await db.getUniqueRfidId(), employeeId: 3, rfid: 'foobar'});
    const employees = await getEmployeesWithRfid(db, idb);
    const res = hasEmployeesWithoutRfid(employees);
    expect(res).toBe(false);
  });

});
