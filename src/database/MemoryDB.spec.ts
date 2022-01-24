import { LoggedError } from "../models/LoggedError";
import { Task, TaskStatus } from "../models/Task";
import { Schedule, TaskType } from "../models/TaskType";
import { MemoryDB } from "./MemoryDB";

const getMockTask = (id = 0, status: TaskStatus = TaskStatus.WAITING) => ({
  id,
  name: 'my task',
  taskTypeId: 0,
  date: new Date(),
  systemIdentifier: 'test-suit',
  systemIp: '10.0.80.70',
  employeeRfid: '',
  highLevelApiKey: '',
  status
});

const mockTask: Task = getMockTask();

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

  it('should return matching tasks', async () => {
    const db = new MemoryDB();
    const tasks = [
      getMockTask(0, TaskStatus.WAITING),
      getMockTask(1, TaskStatus.PROCESSING),
      getMockTask(2, TaskStatus.PROCESSING),
    ]; 
    await Promise.all(tasks.map(async (task) => await db.insertTask(task)));
    expect(await db.getTasksWithStatus(TaskStatus.PROCESSING)).toEqual(tasks.slice(1))
  });

  it('should return empty array', async () => {
    const db = new MemoryDB();
    const task = getMockTask(0, TaskStatus.WAITING);
    db.insertTask(task)
    expect(await db.getTasksWithStatus(TaskStatus.PROCESSING)).toEqual([]);
  });

  it('should update task status', async () => {
    const db = new MemoryDB();
    const task = getMockTask();
    await db.insertTask(task);
    await db.updateTaskStatus(task.id, TaskStatus.SUCCEEDED);
    expect(task.status).toBe(TaskStatus.SUCCEEDED);
  });

  it('should throw "not found"', async () => {
    const db = new MemoryDB();
    try {
      await db.updateTaskStatus(1000, TaskStatus.SUCCEEDED);
      throw new Error('did not throw')
    } catch (e) {
      expect((e as Error).message).toBe('not found');
    }
  });

});

const mockTaskType: TaskType = {
  id: 0,
  name: '1',
  description: '',
  displayName: 'Very gud',
  priority: false,
  instrukdbCheckinId: 0,
  instrukdbCheckinName: '1',
  instrukdbIdentifier: null,
  category: 'check out',
  exclusiveLocations: null,
  schedule: {
    from: {hour: 0, minute: 0, second: 0},
    to: {hour: 0, minute: 0, second: 0},
    days: {
      monday: true, 
      tuesday: true, 
      wednesday: true, 
      thursday: true, 
      friday: true, 
      saturday: true, 
      sunday: true
    },
  }
};

describe('TaskType', () => {

  it('should return empty array', async () => {
    const db = new MemoryDB();
    expect(await db.getTaskTypes()).toEqual([]);
  });

  it('should return 2 as the new length', async () => {
    const db = new MemoryDB();
    const result = await db.replaceTaskTypes([
      {...mockTaskType},
      {...mockTaskType, id: 1, name: '2'}
    ]);
    expect(result).toBe(2);
  });

  it('should return tasktypes', async () => {
    const db = new MemoryDB();
    const types = [{...mockTaskType}, {...mockTaskType, id: 1, name: '2'}];
    await db.replaceTaskTypes(types);
    expect(await db.getTaskTypes()).toBe(types);
  });

  it('should return tasktype', async () => {
    const db = new MemoryDB();
    await db.replaceTaskTypes([mockTaskType]);
    expect(await db.getTaskType(0)).toEqual(mockTaskType);
  });

  it('should throw error "not found"', async () => {
    const db = new MemoryDB();
    try {
      await db.getTaskType(1);
      throw new Error('didnt throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error).toEqual(new Error('not found'));
    }
  });

});

describe('Rfid', () => {

  it('should return 3', async () => {
    const db = new MemoryDB();
    for (let i in ' '.repeat(3).split(''))
      await db.getUniqueRfidId();
    expect(await db.getUniqueRfidId()).toBe(3);
  });

  it('should throw error "not found"', async () => {
    const db = new MemoryDB();
    try {
      await db.getAltRfidByRfid('ABCDEFG');
      throw new Error('didnt throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error).toEqual(new Error('not found')); 
    }
  });

  it('should return rfid', async () => {
    const db = new MemoryDB();
    const rfid = {id: await db.getUniqueRfidId(), rfid: 'ABCDEFG', employeeId: 0};
    await db.insertAltRfid(rfid)
    const res = await db.getAltRfidByRfid('ABCDEFG');
    expect(res).toEqual(rfid);
  });

  it('should throw error "not found"', async () => {
    const db = new MemoryDB();
    try {
      await db.getAltRfidByEmployeeId(0);
      throw new Error('didnt throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error).toEqual(new Error('not found')); 
    }
  });

  it('should return rfid', async () => {
    const db = new MemoryDB();
    const rfid = {id: await db.getUniqueRfidId(), rfid: 'ABCDEFG', employeeId: 0};
    await db.insertAltRfid(rfid)
    const res = await db.getAltRfidByEmployeeId(0);
    expect(res).toEqual(rfid);
  });

  it('should throw error "id must be unique"', async () => {
    const db = new MemoryDB();
    const rfid = {id: await db.getUniqueRfidId(), rfid: 'ABCDEFG', employeeId: 0};
    await db.insertAltRfid(rfid);
    try {
      await db.insertAltRfid(rfid);
      throw new Error('didnt throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error).toEqual(new Error('id must be unique')); 
    }
  });

});

describe('LoggedError', () => {

  it('should count 0', async () => {
    const db = new MemoryDB();
    const res = await db.getErrorCount();
    expect(res).toBe(0);
  });

  it('should count 1', async () => {
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

