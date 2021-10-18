import { addCheckTask } from './addTasks'
import { MockMemoryDB } from '../database/MockMemoryDB'

describe('addCheckInTask', () => {

  const mockTask = {
    name: 'my task',
    actionId: 0,
    date: new Date(),
    authorName: 'John Doe',
    authorEmail: 'johndoe@mail.com'
  };

  const mockTask2 = {
    name: 'my other task',
    actionId: 1,
    date: new Date(),
    authorName: 'Foo Bar',
    authorEmail: 'foo@b.ar'
  };

  it('should throw error', async () => {
    const db = new MockMemoryDB();
    try {
      await addCheckTask(mockTask, db)
    } catch (catched) {
      const error = catched as Error;
      expect(error.message).toMatch('name empty')
    }
  });

  it('should call `db.getUniqueTaskId()` once', async () => {
    const db = new MockMemoryDB();
    await addCheckTask(mockTask, db);
    expect(db.getUniqueTaskIdCalls).toBe(1);
  });

  it('should call `db.getUniqueTaskId()` twice', async () => {
    const db = new MockMemoryDB();
    await addCheckTask(mockTask, db);
    await addCheckTask(mockTask2, db);
    expect(db.getUniqueTaskIdCalls).toBe(2);
  });

  it('should not have matching ids', async () => {
    const db = new MockMemoryDB();
    const t1 = await addCheckTask(mockTask, db);
    const t2 = await addCheckTask(mockTask2, db);
    expect(t1.id).not.toBe(t2.id);
  });

  it('should call `insertCheckInTask` once', async () => {
    const db = new MockMemoryDB();
    await addCheckTask(mockTask, db);
    expect(db.insertCheckInTaskCalls).toBe(1);
  });

  it('should return input unchanged', async () => {
    const db = new MockMemoryDB();
    const res = await addCheckTask(mockTask, db);
    expect(res).toMatchObject(mockTask);
  });

  it('should use `Date.now`', async () => {
    const db = new MockMemoryDB();
    const before = new Date();
    const res = await addCheckTask({...mockTask, date: undefined}, db);
    const after = new Date();
    expect(res.date.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(res.date.getTime()).toBeLessThanOrEqual(after.getTime());
  });

});

