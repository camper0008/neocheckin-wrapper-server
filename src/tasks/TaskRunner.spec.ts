import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { Task, TaskStatus } from "../models/Task";
import { TaskRunner } from "./TaskRunner";
import { synchronizeTaskTypesWithSample } from "./taskTypes";
import { setInterval } from "timers";

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

const getMockDbs = async () => {
  const {db, idb} = {db: new MockMemoryDB(), idb: new MockInstrukdb()};
  await synchronizeTaskTypesWithSample(db, idb);
  return {db, idb};
};

const setupMocks = async () => ({task: getMockTask(), ... await getMockDbs()});

describe('TaskRunner', () => {

  it('should change status to not waiting', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb);
    await t.run(task);
    expect(task.status).not.toBe(TaskStatus.WAITING);
  });

  it('should call idb.postCheckin once', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb);
    await t.run(task);
    expect(idb.postCheckinCalls).toBe(1);
  });

  it('should call with the option prefix', async () => {
    const {task, db, idb} = await setupMocks();
    const taskType = await db.getTaskType(task.taskTypeId);
    const t = new TaskRunner(db, idb, 'test-');
    await t.run(task);
    expect(idb.postCheckinLastCall?.option).toBe('test-' + taskType.name);
  });

  it('should call with the token', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    await t.run(task);
    expect(idb.postCheckinLastCall?.token).toBe(task.highLevelApiKey);
  });

  it('should call with the timestamp', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    await t.run(task);
    expect(idb.postCheckinLastCall?.timestamp).toBe(Math.round(task.date.getTime() / 1000));
  });

  it('should call with the rfid as a number', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    await t.run(task);
    expect(idb.postCheckinLastCall?.rfid).toBe(parseInt(task.employeeRfid));
  });

  it('should call with the downstream ip', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    await t.run(task);
    expect(idb.postCheckinLastCall?.ip).toBe(task.systemIp);
  });

  it('should call db.getTaskType once', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    await t.run(task);
    expect(db.getTaskTypeCalls).toBe(1);
  });

  it('should set status to succeeded', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    await t.run(task);
    expect(task.status).toBe(TaskStatus.SUCCEEDED);
  });

  it('should set status to failed', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    task.taskTypeId = 99999;
    await t.run(task);
    expect(task.status).toBe(TaskStatus.FAILED);
    expect(task.statusMsg).toBe(`could not find task with id '${task.taskTypeId}'`);
  });

  it('should set status to failed', async () => {
    const {task, db, idb} = await setupMocks();
    const t = new TaskRunner(db, idb, 'test-');
    idb.connected = false;
    await t.run(task);
    expect(task.status).toBe(TaskStatus.FAILED);
    expect(task.statusMsg).toBe('failed to send request to Instrukdb')
  });

  it('should set all waiting tasks to processing', async () => {
    const {db, idb} = await getMockDbs();
    const t = new TaskRunner(db, idb, 'test-');
    await db.insertTask(getMockTask(0, TaskStatus.WAITING));
    await db.insertTask(getMockTask(1, TaskStatus.SUCCEEDED));
    await t.runAllTasks();
    expect(await db.getTasksWithStatus(TaskStatus.WAITING)).toEqual([]);
  });

  it('should only set waiting tasks to processing', async () => {
    const {db, idb} = await getMockDbs();
    const t = new TaskRunner(db, idb, 'test-');
    const [task1, task2] = [getMockTask(0, TaskStatus.WAITING), getMockTask(1, TaskStatus.SUCCEEDED)];
    await db.insertTask(task1);
    await db.insertTask(task2);
    await t.runAllTasks();
    expect((await db.getTasksWithStatus(TaskStatus.SUCCEEDED)).length).toBeGreaterThan(0);
  });

  it('should not be undefined', async () => {
    const {db, idb} = await getMockDbs();
    const t = new TaskRunner(db, idb, 'test-');
    t.startInterval();
    expect(t.getIntervalTimer()).not.toBe(undefined);
    t.stopInterval();
  });

  it('should be undefined', async () => {
    const {db, idb} = await getMockDbs();
    const t = new TaskRunner(db, idb, 'test-');
    t.startInterval();
    t.stopInterval();
    expect(t.getIntervalTimer()).toBe(undefined);
  });

});
