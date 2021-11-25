import { AddTaskRequest } from "../tasks/addTasks";
import { formatTask } from "./formatLogs";
import { LogStatus } from "./LogItem";

describe('formatTask', () => {
  const now: Date = new Date();

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

    const res = formatTask({...mockTask, date: now}, LogStatus.success);
    expect(res).toBe(expected);
  });

  it('should format correctly on error', async () => {
    const expected = "Task could not be added\n"
    + `name: ${mockTask.name}\n`
    + `task-id: ${mockTask.taskTypeId}\n`
    + `system-id: ${mockTask.systemIdentifier}\n`
    + `rfid: ${mockTask.employeeRfid}\n`
    + `task-timestamp: ${now.toISOString()}`

    const res = formatTask(mockTask, LogStatus.error);
    expect(res).toBe(expected);
  });

  it('should include "(no date given)" if date is null', async () => {
    const res = formatTask({...mockTask, date: undefined}, LogStatus.error);
    expect(res.indexOf('(no date given)')).not.toBe(-1);
  });

  it('should error if unexpected behaviour', async () => {
    expect.assertions(1);
    try {
      //@ts-expect-error
      const res = formatTask(mockTask, "abcdefghijkl");
    } catch(error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }

  });

});
