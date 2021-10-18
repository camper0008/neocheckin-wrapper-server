import { MemoryDB } from "./MemoryDB";

const mockTask = {
  id: 0,
  name: 'my task',
  actionId: 0,
  date: new Date(),
  authorName: 'John Doe',
  authorEmail: 'johndoe@mail.com'
};

describe('getUniqueTaskId', () => {

  it('it should return two unique ids', async () => {
    const db = new MemoryDB();
    const id1 = await db.getUniqueTaskId();
    const id2 = await db.getUniqueTaskId();
    expect(id1).not.toBe(id2);
  });

});

describe('CheckInTask', () => {

  it('it should count 0', async () => {
    const db = new MemoryDB();
    const res = await db.getCheckTaskCount();
    expect(res).toBe(0);
  });

  it('it should count 1', async () => {
    const db = new MemoryDB();
    await db.insertCheckTask(mockTask);
    const res = await db.getCheckTaskCount();
    expect(res).toBe(1);
  });

  it('it should throw "id must be unique" error', async () => {
    const db = new MemoryDB();
    await db.insertCheckTask({id: 0, actionId: 0, date: new Date(), name: 'a', authorName: 'a', authorEmail: 'a'});
    try {
      await db.insertCheckTask({id: 0, actionId: 0, date: new Date(), name: 'b', authorName: 'b', authorEmail: 'b'});
      throw new Error('did not throw');
    } catch (catched) {
      const error = catched as Error;
      expect(error.message).toBe('id must be unique');
    }
  });

});

