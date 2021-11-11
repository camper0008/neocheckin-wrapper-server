import { LoggedError } from "../models/LoggedError";
import { AltRfid } from "../models/Rfid";
import { Task, TaskStatus } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { Database } from "./Database";

export class MemoryDB extends Database {

  private idCounter: {[key: string]: number} = {};
  private tasks: Task[] = [];
  private taskTypes: TaskType[] = [];
  private rfids: AltRfid[] = [];
  private errors: LoggedError[] = [];

  public constructor () {
    super ();
    this.idCounter['tasks'] = 0;
    this.idCounter['rfids'] = 0;
    this.idCounter['errors'] = 0;
  }

  public async getUniqueTaskId(): Promise<number> {
    return this.idCounter['tasks']++;
  }

  public async getUniqueRfidId(): Promise<number> {
    return this.idCounter['rfids']++;
  }

  public async getUniqueErrorId(): Promise<number> {
    return this.idCounter['errors']++;
  }



  public async getTaskCount(): Promise<number> {
    return this.tasks.length;
  }

  public async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  public async getTasksWithStatus(status: TaskStatus): Promise<Task[]> {
    return this.tasks.filter(task => task.status === status);
  }

  public async insertTask(task: Task): Promise<Task> {
    for (let i in this.tasks)
      if (this.tasks[i].id === task.id)
        throw new Error('id must be unique');
    this.tasks.push(task);
    return task;
  };

  public async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    for (let i in this.tasks)
      if (this.tasks[i].id === id) {
        this.tasks[i].status = status;
        return this.tasks[i];
      }
    throw new Error('not found');
  }



  public async getTaskType(id: number): Promise<TaskType> {
    for (let i in this.taskTypes)
      if (this.taskTypes[i].id === id)
        return this.taskTypes[i];
    throw new Error('not found');
  }

  public async getTaskTypes(): Promise<TaskType[]> {
    return this.taskTypes;
  }
  
  public async replaceTaskTypes(taskTypes: TaskType[]): Promise<number> {
    this.taskTypes = taskTypes;
    return taskTypes.length;
  }



  public async getAltRfidByEmployeeId(employeeId: number): Promise<AltRfid> {
    for (let i in this.rfids)
      if (this.rfids[i].employeeId === employeeId)
        return this.rfids[i];
    throw new Error("not found");
  }

  public async getAltRfidByRfid(rfid: string): Promise<AltRfid> {
    for (let i in this.rfids)
      if (this.rfids[i].rfid === rfid)
        return this.rfids[i];
    throw new Error("not found");
  }

  public async insertAltRfid(rfid: AltRfid): Promise<AltRfid> {
    for (let i in this.rfids)
      if (this.rfids[i].id === rfid.id)
        throw new Error('id must be unique');
    this.rfids.push(rfid);
    return rfid;
  }



  public async getErrorCount(): Promise<number> {
    return this.errors.length;
  }

  public async getErrors(): Promise<LoggedError[]> {
    return this.errors;
  }

  public async insertError(error: LoggedError): Promise<LoggedError> {
    for (let i in this.errors)
      if (this.errors[i].id === error.id)
        throw new Error('id must be unique');
    this.errors.push(error);
    return error;
  }


}
