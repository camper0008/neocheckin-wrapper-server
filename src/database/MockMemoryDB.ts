import { CheckTask } from "../models/CheckTask";
import { MemoryDB } from "./MemoryDB";

export class MockMemoryDB extends MemoryDB {

  public constructor () {
    super();
  }

  public getUniqueTaskIdCalls: number = 0;
  public getUniqueTaskId = async (): Promise<number> => {
    this.getUniqueTaskIdCalls++;
    return await this.getUniqueTaskId_();
  }

  public getCheckInTaskCountCalls: number = 0;
  public getCheckTaskCount = async (): Promise<number> => {
    this.getCheckInTaskCountCalls++;
    return this.getCheckInTaskCount_();
  }

  public insertCheckInTaskCalls: number = 0;
  public insertCheckTask = async (task: CheckTask): Promise<CheckTask> => {
    this.insertCheckInTaskCalls++;
    return this.insertCheckInTask_(task);
  }

}
