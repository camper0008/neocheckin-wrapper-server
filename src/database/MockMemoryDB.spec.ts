import { Task, TaskStatus } from "../models/Task";
import { MockMemoryDB } from "./MockMemoryDB";

const getMockTask = (id: number = 0, status: TaskStatus = TaskStatus.WAITING): Task => ({
  id,
  name: 'test task',
  employeeRfid: '0123456789',
  date: new Date(),
  taskTypeId: 0,
  systemIdentifier: 'test-system',
  systemIp: '10.0.80.70',
  highLevelApiKey: '0123456789',
  status,
});

describe('getUniqueTaskId', () => {

  it('should count number of calls', async () => {
    const db = new MockMemoryDB();
    await db.getUniqueTaskId();
    await db.getUniqueTaskId();
    await db.getUniqueTaskId();
    expect(db.getUniqueTaskIdCalls).toBe(3);
  });

  it('should return task', async () => {
    const db = new MockMemoryDB();
    const task = getMockTask();
    await db.insertTask(task);
    expect(await db.getTasks()).toEqual([task])
  });

  it('should throw "not connected"', async () => {
    expect.assertions(1);
    const db = new MockMemoryDB();
    db.connected = false;
    const task = getMockTask();
    try {
      await db.insertTask(task);
    } catch (e) {
      expect((e as Error).message).toBe('not connected')
    }
  });

});
