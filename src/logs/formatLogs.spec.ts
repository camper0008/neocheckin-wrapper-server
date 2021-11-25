import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task, TaskStatus } from "../models/Task";
import { AddTaskRequest } from "../tasks/addTasks";
import { formatTask, formatTaskRequest } from "./formatLogs";
import { LogStatus } from "./LogItem";

const now: Date = new Date();

describe('formatTaskRequest', () => {
  

  const mockTask: AddTaskRequest = {
    name: 'my task',
    taskTypeId: 0,
    date: now,
    systemIdentifier: 'test-suit',
    systemIp: '10.0.80.70',
    employeeRfid: '1234',
    highLevelApiKey: 'test-system',
  };

  it('should format correctly on success', async () => {
    const expected = "Task added\n"
    + `name: ${mockTask.name}\n`
    + `task-id: ${mockTask.taskTypeId}\n`
    + `system-id: ${mockTask.systemIdentifier}\n`
    + `rfid: ${mockTask.employeeRfid}\n`
    + `task-timestamp: ${now.toISOString()}`

    const res = formatTaskRequest({...mockTask, date: now}, LogStatus.success);
    expect(res).toBe(expected);
  });

  it('should format correctly on error', async () => {
    const expected = "Task could not be added\n"
    + `name: ${mockTask.name}\n`
    + `task-id: ${mockTask.taskTypeId}\n`
    + `system-id: ${mockTask.systemIdentifier}\n`
    + `rfid: ${mockTask.employeeRfid}\n`
    + `task-timestamp: ${now.toISOString()}`

    const res = formatTaskRequest(mockTask, LogStatus.error);
    expect(res).toBe(expected);
  });

  it('should include "(no date given)" if date is null', async () => {
    const res = formatTaskRequest({...mockTask, date: undefined}, LogStatus.error);
    expect(res.indexOf('(no date given)')).not.toBe(-1);
  });

  it('should error if unexpected behaviour', async () => {
    expect.assertions(1);
    try {
      //@ts-expect-error
      const res = formatTaskRequest(mockTask, "abcdefghijkl");
    } catch(error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }

  });

});

describe('formatTask', () => {
  it('should format correctly on success', async () => {
    const task: Task = {
      id: 0,
      date: new Date,
      employeeRfid: '1234567890',
      name: 'Instruk Debe',
      highLevelApiKey: 'abcd',
      status: TaskStatus.WAITING,
      systemIdentifier: 'bruh',
      systemIp: '::1',
      taskTypeId: 0,
    };
    const sres = {statusCode: 200, message: 'Ok'} as Instrukdb.StatusRes
    const expected = "Task sent\n"
      + `id: ${task.id}\n`
      + `name: ${task.name}\n`
      + `runner-status: ${task.status}\n`
      + `task-id: ${task.taskTypeId}\n`
      + `system-id: ${task.systemIdentifier}\n`
      + `system-ip: ${task.systemIp}\n`
      + `rfid: ${task.employeeRfid}\n`
      + `task-timestamp: ${now.toISOString()}\n`
      + `response-code: ${sres.statusCode}\n`
      + `response-message: ${sres.message ?? '<no message>'}`

    const res = formatTask({...task, date: now}, sres, LogStatus.success);
    expect(res).toBe(expected);
  });
});
