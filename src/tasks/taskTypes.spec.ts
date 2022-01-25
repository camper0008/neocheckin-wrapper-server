import { readFile } from "fs/promises";
import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { getTaskTypes, syncTaskTypesWithSample } from "./taskTypes";

describe('synchronizeTaskTypesWithSample', () => {

  it('should call db.replaceTaskTypes once', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    await syncTaskTypesWithSample(db, idb);
    expect(db.replaceTaskTypesCalls).toBe(1);
  });

  it('should change tasktypes in db', async () => {
    const db = new MockMemoryDB();
    const idb = new MockInstrukdb();
    await syncTaskTypesWithSample(db, idb);
    expect(await db.getTaskTypes()).toEqual(JSON.parse((await readFile('./samples/schedule.json')).toString()));
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
