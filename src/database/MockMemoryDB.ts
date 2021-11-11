import { Task } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { MemoryDB } from "./MemoryDB";

export class MockMemoryDB extends MemoryDB {

  public connected = true;

  public constructor () {
    super();
  }

  private checkConnection() {
    if (!this.connected)
      throw new Error('not connected');
    return true;
  }

  public getUniqueTaskIdCalls: number = 0;
  public async getUniqueTaskId(): Promise<number> {
    this.checkConnection()
    this.getUniqueTaskIdCalls++;
    return super.getUniqueTaskId();
  }

  public getUniqueRfidId() {
    this.checkConnection();
    return super.getUniqueRfidId();
  }

  public getUniqueErrorId() {
    this.checkConnection();
    return super.getUniqueErrorId();
  }



  public getTaskCountCalls: number = 0;
  public async getTaskCount(): Promise<number> {
    this.checkConnection()
    this.getTaskCountCalls++;
    return super.getTaskCount();
  }

  public getTasksCalls: number = 0;
  public async getTasks(): Promise<Task[]> {
    this.checkConnection()
    this.getTasksCalls++;
    return super.getTasks();
  }

    

  public insertTaskCalls: number = 0;
  public async insertTask(task: Task): Promise<Task> {
    this.checkConnection()
    this.insertTaskCalls++;
    return super.insertTask(task);
  }

  public getTaskTypesCalls = 0;
  public async getTaskTypes(): Promise<TaskType[]> {
    this.checkConnection()
    this.getTaskTypesCalls++;
    return super.getTaskTypes();
  }

  public getTaskTypeCalls = 0;
  public async getTaskType(id: number): Promise<TaskType> {
    this.checkConnection()
    this.getTaskTypeCalls++;
    return super.getTaskType(id);
  }

  public replaceTaskTypesCalls = 0;
  public async replaceTaskTypes(taskTypes: TaskType[]): Promise<number> {
    this.checkConnection()
    this.replaceTaskTypesCalls++;
    return super.replaceTaskTypes(taskTypes);
  }



  public getUniqueTaskId(): Promise<number>;
  public getUniqueRfidId(): Promise<number>;
  public getUniqueErrorId(): Promise<number>
  
  public getTaskCount(): Promise<number>;
  public getTasks(): Promise<Task[]>;
  public getTasksWithStatus(status: TaskStatus): Promise<Task[]>;
  public insertTask(task: Task): Promise<Task>;
  public updateTaskStatus(id: number, status: TaskStatus): Promise<Task>;

  public getTaskTypes(): Promise<TaskType[]>;
  public getTaskType(id: number): Promise<TaskType>;
  public replaceTaskTypes(taskTypes: TaskType[]): Promise<number>;

  public getAltRfidByEmployeeId(employeeId: number): Promise<AltRfid>;
  public getAltRfidByRfid(rfid: string): Promise<AltRfid>;
  public insertAltRfid(rfid: AltRfid): Promise<AltRfid>;

  public getErrorCount(): Promise<number>;
  public getErrors(): Promise<LoggedError[]>;
  public insertError(error: LoggedError): Promise<LoggedError>;


}
