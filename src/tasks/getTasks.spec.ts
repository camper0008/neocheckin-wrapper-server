import { MockMemoryDB } from "../database/MockMemoryDB";
import { Task } from "../models/Task";
import { getTasks } from "./getTasks";

describe('getTasks', () => {

  it('should call call db.getTasks once', async () => {
    const db = new MockMemoryDB();
    await getTasks(db);
    expect(db.getTasksCalls).toBe(1);
  });

  it('should return inserted task', async () => {
    const db = new MockMemoryDB();
    const task: Task = {
      id: await db.getUniqueTaskId(),
      date: new Date(),
      name: 'Name',
      employeeRfid: '',
      highLevelApiKey: '',
      systemIdentifier: '',
      taskId: 0
    };
    await db.insertTask(task);
    expect(await getTasks(db)).toEqual([task]);
  })

});
