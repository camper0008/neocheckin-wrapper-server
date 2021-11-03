import { addTask, AddTaskRequest } from './addTasks'
import { MockMemoryDB } from '../database/MockMemoryDB'

describe('addTask', () => {

  const mockTask: AddTaskRequest = {
    name: 'my task',
    taskTypeId: 0,
    date: new Date(),
    systemIdentifier: 'test-suit',
    systemIp: '10.0.80.70',
    employeeRfid: '',
    highLevelApiKey: '',
  };

  const mockTask2: AddTaskRequest = {
    name: 'my other task',
    taskTypeId: 1,
    date: new Date(),
    systemIdentifier: 'test-suit',
    systemIp: '10.0.80.71',
    employeeRfid: '',
    highLevelApiKey: '',
  };

  it('should throw "name empty" error', async () => {
    const db = new MockMemoryDB();
    try {
      await addTask({...mockTask, name: ''}, db)
      throw new Error('did not throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error.message).toMatch('name empty')
    }
  })

  it('should call `db.getUniqueTaskId()` once', async () => {
    const db = new MockMemoryDB();
    await addTask(mockTask, db);
    expect(db.getUniqueTaskIdCalls).toBe(1);
  });

  it('should call `db.getUniqueTaskId()` twice', async () => {
    const db = new MockMemoryDB();
    await addTask(mockTask, db);
    await addTask(mockTask2, db);
    expect(db.getUniqueTaskIdCalls).toBe(2);
  });

  it('should not have matching ids', async () => {
    const db = new MockMemoryDB();
    const t1 = await addTask(mockTask, db);
    const t2 = await addTask(mockTask2, db);
    expect(t1.id).not.toBe(t2.id);
  });

  it('should call `insertTask` once', async () => {
    const db = new MockMemoryDB();
    await addTask(mockTask, db);
    expect(db.insertTaskCalls).toBe(1);
  });

  it('should return input unchanged', async () => {
    const db = new MockMemoryDB();
    const res = await addTask(mockTask, db);
    expect(res).toMatchObject(mockTask);
  });

  it('should use `Date.now`', async () => {
    const db = new MockMemoryDB();
    const before = new Date();
    const res = await addTask({...mockTask, date: undefined}, db);
    const after = new Date();
    expect(res.date.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(res.date.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should use specified date', async () => {
    const db = new MockMemoryDB();
    const date = "2021-10-21T08:49:16.642Z";
    const res = await addTask({...mockTask, date}, db);
    expect(res.date).toEqual(new Date(date));
  });

});

