import { LoggedError } from "../models/LoggedError";
import { AltRfid } from "../models/Rfid";
import { Task, TaskStatus } from "../models/Task";
import { TaskType } from "../models/TaskType";

export abstract class Database {

  public abstract getUniqueTaskId(): Promise<number>;
  public abstract getUniqueRfidId(): Promise<number>;
  public abstract getUniqueErrorId(): Promise<number>
  
  public abstract getTaskCount(): Promise<number>;
  public abstract getTasks(): Promise<Task[]>;
  public abstract getTasksWithStatus(status: TaskStatus): Promise<Task[]>;
  public abstract insertTask(task: Task): Promise<Task>;
  public abstract updateTaskStatus(id: number, status: TaskStatus): Promise<Task>;

  public abstract getTaskTypes(): Promise<TaskType[]>;
  public abstract getTaskType(id: number): Promise<TaskType>;
  public abstract replaceTaskTypes(taskTypes: TaskType[]): Promise<number>;

  public abstract getAltRfidByEmployeeId(employeeId: number): Promise<AltRfid>;
  public abstract getAltRfidByRfid(rfid: string): Promise<AltRfid>;
  public abstract insertAltRfid(rfid: AltRfid): Promise<AltRfid>;

  public abstract getErrorCount(): Promise<number>;
  public abstract getErrors(): Promise<LoggedError[]>;
  public abstract insertError(error: LoggedError): Promise<LoggedError>;

}
