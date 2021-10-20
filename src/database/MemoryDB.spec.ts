import { LoggedError } from "../models/LoggedError";
import { MemoryDB } from "./MemoryDB";

const mockTask = {
  id: 0,
  name: 'my task',
  taskId: 0,
  date: new Date(),
  systemIdentifier: 'test-suit',
  employeeRfid: '',
  highLevelApiKey: '',
};

const mockError: LoggedError = {id: 0, name: 'Error', msg:'This is an error'};

describe('getUnique_Id', () => {

  it('it should return two unique ids', async () => {
    const db = new MemoryDB();
    const id1 = await db.getUniqueTaskId();
    const id2 = await db.getUniqueTaskId();
    expect(id1).not.toBe(id2);
  });

  it('it should return two unique ids', async () => {
    const db = new MemoryDB();
    const id1 = await db.getUniqueErrorId();
    const id2 = await db.getUniqueErrorId();
    expect(id1).not.toBe(id2);
  });

});

describe('Task', () => {

  it('it should count 0', async () => {
    const db = new MemoryDB();
    const res = await db.getTaskCount();
    expect(res).toBe(0);
  });

  it('it should count 1', async () => {
    const db = new MemoryDB();
    await db.insertTask(mockTask);
    const res = await db.getTaskCount();
    expect(res).toBe(1);
  });

  it('it should throw "id must be unique" error', async () => {
    const db = new MemoryDB();
    await db.insertTask(mockTask);
    try {
      await db.insertTask({...mockTask, name: 'b', systemIdentifier: 'b'});
      throw new Error('did not throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error.message).toBe('id must be unique');
    }
  });

  it('should return empty array', async () => {
    const db = new MemoryDB();
    const result = await db.getTasks();
    expect(result).toEqual([]);
  });

  it('should return array with the inserted', async () => {
    const db = new MemoryDB();
    await db.insertTask(mockTask);
    const result = await db.getTasks();
    expect(result).toEqual([mockTask]);
  });

});

describe('LoggedError', () => {

  it('it should count 0', async () => {
    const db = new MemoryDB();
    const res = await db.getErrorCount();
    expect(res).toBe(0);
  });

  it('it should count 1', async () => {
    const db = new MemoryDB();
    await db.insertError(mockError);
    const res = await db.getErrorCount();
    expect(res).toBe(1);
  });

  it('should return empty array', async () => {
    const db = new MemoryDB();
    const result = await db.getErrors();
    expect(result).toEqual([]);
  });

  it('should return inserted', async () => {
    const db = new MemoryDB();
    await db.insertError(mockError);
    const result = await db.getErrors();
    expect(result).toEqual([mockError]);
  });
  
  it('it should throw "id must be unique" error', async () => {
    const db = new MemoryDB();
    await db.insertError(mockError);
    try {
      await db.insertError({...mockError, name: 'b', msg: 'b'});
      throw new Error('did not throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error.message).toBe('id must be unique');
    }
  });

});

