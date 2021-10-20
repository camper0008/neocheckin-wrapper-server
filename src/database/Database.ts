import { LoggedError } from "../models/LoggedError";
import { Task } from "../models/Task";

export abstract class Database {

  public abstract getUniqueTaskId(): Promise<number>;
  public abstract getUniqueErrorId(): Promise<number>
  
  public abstract getTaskCount(): Promise<number>;
  public abstract getTasks(): Promise<Task[]>;
  public abstract insertTask(task: Task): Promise<Task>;

  public abstract getErrorCount(): Promise<number>;
  public abstract getErrors(): Promise<LoggedError[]>;
  public abstract insertError(error: LoggedError): Promise<LoggedError>;

}
