import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { TestLogger } from "../logs/TestLogger";
import { Task, TaskStatus } from "../models/Task";
import { runTask } from "./runTask";
import { syncTaskTypesWithSample } from "./taskTypes";

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

describe('runTask', () => {

  it('should error on invalidate task type id', async () => {
    expect.assertions(1);
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    const task: Task = {...getMockTask(), taskTypeId: -343};
    try {
      await runTask(task, db, idb);
    } catch (c) {
      expect((c as Error).message).toBe(`invalid task type id '-343'`);
    }
  });

  it('should use valid task type id', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask(), taskTypeId: 5};
    try {
      await runTask(task, db, idb)
    } catch (c) {
      fail();
    }
  });

  it('should call postCheckin', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    await runTask(task, db, idb);
    expect(idb.postCheckinCalls).toBe(1);
  });

  it('should call with the token', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    await runTask(task, db, idb);
    expect(idb.postCheckinLastCall?.token).toBe(task.highLevelApiKey);
  });

  it('should call with the timestamp', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    await runTask(task, db, idb);
    expect(idb.postCheckinLastCall?.timestamp).toBe(Math.floor(task.date.getTime() / 1000));
  });

  it('should call with the rfid as a number', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    await runTask(task, db, idb);
    expect(idb.postCheckinLastCall?.rfid).toBe(parseInt(task.employeeRfid));
  });

  it('should call with the downstream ip', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    await runTask(task, db, idb);
    expect(idb.postCheckinLastCall?.ip).toBe(task.systemIp);
  });

  it('should set status to failed', async () => {
    expect.assertions(1);
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    idb.connected = false;
    try {
      await runTask(task, db, idb);
    } catch (c) {
      expect((c as Error).message).toMatch(/^Instrukdb error: /);
    }
  });

  it('should use task type option', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask(), taskTypeId: 2};
    const taskType = await db.getTaskType(task.taskTypeId);
    await runTask(task, db, idb);
    expect(idb.postCheckinLastCall?.option).toBe(taskType.name);
  });

  it('should send details', async () => {
    const [db, idb] = [new MockMemoryDB(), new MockInstrukdb()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    await runTask(task, db, idb);
    const isoDateRegex = '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?-\d{2}:\d{2}|Z?';
    const regex = new RegExp('^neocheckin ' + isoDateRegex);
    expect(idb.postCheckinLastCall?.details).toMatch(regex);
  });

  it('should log success', async () => {
    const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    await runTask(task, db, idb, logger);
    expect(logger.logRunTaskSuccessCalls).toBe(1);
    expect(logger.logRunTaskErrorCalls).toBe(0);
  });

  it('should log true', async () => {
    expect.assertions(2);
    const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
    await syncTaskTypesWithSample(db);
    const task: Task = {...getMockTask()};
    idb.connected = false;
    try {
      await runTask(task, db, idb, logger);
    } catch (c) {
      expect(logger.logRunTaskSuccessCalls).toBe(0);
      expect(logger.logRunTaskErrorCalls).toBe(1);
    }
  });

  it('should check with "bibliotek-helpdesk viborg" as instrukdbIdentifier', async () => {
    const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
    await syncTaskTypesWithSample(db);
    const task = {...getMockTask(), taskTypeId: 3} as Task;
    await runTask(task, db, idb, logger);
    expect(idb.postCheckinLastCall?.option).toBe('bibliotek-helpdesk viborg');
  });

});
