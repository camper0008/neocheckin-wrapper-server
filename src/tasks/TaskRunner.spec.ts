import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { Task, TaskStatus } from "../models/Task";
import { TaskRunner } from "./TaskRunner";

const getMockTask = (): Task => ({
  id: 0,
  name: 'test task',
  employeeRfid: '0123456789',
  date: new Date(),
  taskTypeId: 0,
  systemIdentifier: 'test-system',
  highLevelApiKey: '0123456789',
  status: TaskStatus.WAITING,
});

describe('TaskRunner', () => {

  it('should change status to processing', () => {

  });

});
