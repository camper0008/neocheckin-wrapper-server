import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task } from "../models/Task";
import { AddTaskRequest } from "../tasks/addTasks";
import { formatTask, formatTaskRequest } from "./formatLogs";
import { Logger } from "./Logger";
import { LogItem, LogStatus } from "./LogItem";

export class TestLogger implements Logger {
  
  private logs: LogItem[] = [];
  
  public async read(): Promise<LogItem[]> {
    return [...this.logs];
  }

  public async write(msg: LogItem): Promise<void> {
    this.logs.push(msg);
    return;
  }

  private async logAddTask(task: AddTaskRequest, status: LogStatus): Promise<void> {
    const item = new LogItem('add task', status, formatTaskRequest(task, status));
    await this.write(item);
  }
  
  public async logAddTaskSuccess(task: AddTaskRequest): Promise<void> {
    return this.logAddTask(task, LogStatus.success);
  }

  public async logAddTaskError(task: AddTaskRequest): Promise<void> {
    return this.logAddTask(task, LogStatus.error);
  }

  private async logRunTask(task: Task, status: LogStatus, response: Instrukdb.StatusRes): Promise<void> {
    const item = new LogItem('run task', status, formatTask(task, response, status));
    return await this.write(item);
  }

  public logRunTaskSuccessCalls = 0; 
  public async logRunTaskSuccess(task: Task, response: Instrukdb.StatusRes): Promise<void> {
    this.logRunTaskSuccessCalls++;
    return this.logRunTask(task, LogStatus.success, response);
  }

  public logRunTaskErrorCalls = 0; 
  public async logRunTaskError(task: Task, request: Instrukdb.StatusRes): Promise<void> {
    this.logRunTaskErrorCalls++;
    return this.logRunTask(task, LogStatus.error, request);
  }

}