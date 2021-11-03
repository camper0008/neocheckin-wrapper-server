import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { Task, TaskStatus } from "../models/Task";
import { TaskRunner } from "./TaskRunner";
import { synchronizeTaskTypes } from "./taskTypes";

const getMockTask = (): Task => ({
  id: 0,
  name: 'test task',
  employeeRfid: '0123456789',
  date: new Date(),
  taskTypeId: 0,
  systemIdentifier: 'test-system',
  systemIp: '10.0.80.70',
  highLevelApiKey: '0123456789',
  status: TaskStatus.WAITING,
});

const setupMocks = async () => {
  const {db, idb} = {db: new MockMemoryDB(), idb: new MockInstrukdb()};
  const task = getMockTask();
  await synchronizeTaskTypes(db, idb);
  return {task, db, idb};
}

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
    expect(idb.postCheckinLastCall?.timestamp).toBe(task.date.getTime());
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

});
