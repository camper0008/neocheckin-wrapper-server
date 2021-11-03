import { Task } from "../models/Task";
import { TaskType } from "../models/TaskType";
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

  public getTaskTypesCalls = 0;
  public async getTaskTypes(): Promise<TaskType[]> {
    this.getTaskTypesCalls++;
    return super.getTaskTypes();
  }

  public getTaskTypeCalls = 0;
  public async getTaskType(id: number): Promise<TaskType> {
    this.getTaskTypeCalls++;
    return super.getTaskType(id);
  }

  public replaceTaskTypesCalls = 0;
  public async replaceTaskTypes(taskTypes: TaskType[]): Promise<number> {
    this.replaceTaskTypesCalls++;
    return super.replaceTaskTypes(taskTypes);
  }

}
