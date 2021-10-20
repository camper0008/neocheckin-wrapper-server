import { Task } from "../models/Task";
import { MemoryDB } from "./MemoryDB";

export class MockMemoryDB extends MemoryDB {

  public constructor () {
    super();
  }

  public getUniqueTaskIdCalls: number = 0;
  public async getUniqueTaskId(): Promise<number> {
    this.getUniqueTaskIdCalls++;
    return super.getUniqueTaskId();
  }

  public getTaskCountCalls: number = 0;
  public async getTaskCount(): Promise<number> {
    this.getTaskCountCalls++;
    return super.getTaskCount();
  }

  public getTasksCalls: number = 0;
  public async getTasks(): Promise<Task[]> {
    this.getTasksCalls++;
    return super.getTasks();
  }

  public insertTaskCalls: number = 0;
  public async insertTask(task: Task): Promise<Task> {
    this.insertTaskCalls++;
    return super.insertTask(task);
  }

}
