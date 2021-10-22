import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { getTaskTypes, synchronizeTaskTypes } from "./taskTypes";

describe('synchronizeTaskTypes', () => {

  it('should call Instrukdb.getSchedule once', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    await synchronizeTaskTypes(db, idb);
    expect(idb.getScheduleCalls).toBe(1);
  });

  it('should call db.replaceTaskTypes once', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    await synchronizeTaskTypes(db, idb);
    expect(db.replaceTaskTypesCalls).toBe(1);
  });

  it('should change tasktypes in db', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    await synchronizeTaskTypes(db, idb);
    expect(await db.getTaskTypes()).toEqual(await idb.getSchedule());
  });

  it('should return error "could not connect to Instrukdb"', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    idb.connected = false;
    try {
      await synchronizeTaskTypes(db, idb);
      throw new Error('didnt throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error.message).toBe('could not connect to Instrukdb');
    }
  });

});

describe('getTaskTypes', () => {

  it('should call db.getTaskTypes once', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    await getTaskTypes(db, idb);
    expect(db.getTaskTypesCalls).toBe(1);
  });

});
