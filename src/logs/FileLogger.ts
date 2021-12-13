import { writeFile } from "fs/promises";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task } from "../models/Task";
import { AddTaskRequest } from "../tasks/addTasks";
import { formatFileFriendly } from "../utils/timedate";
import { formatTask, formatTaskRequest } from "./formatLogs";
import { Logger } from "./Logger";
import { LogItem, LogStatus } from "./LogItem";

export class FileLogger implements Logger {

  private logs: LogItem[] = [];
  
  public async read(): Promise<LogItem[]> {
    return [...this.logs];
  }
  public async write(msg: LogItem): Promise<void> {
    this.logs.push(msg);
    await this.save();
    return;
  }

  private async logAddTask(task: AddTaskRequest, status: LogStatus): Promise<void> {
    const item = new LogItem('add task', status, formatTaskRequest(task, status));
    await this.write(item);
  }

  public async logAddTaskSuccess(task: AddTaskRequest): Promise<void> {
    this.logAddTask(task, LogStatus.success);
  }

  public async logAddTaskError(task: AddTaskRequest): Promise<void> {
    this.logAddTask(task, LogStatus.error);
  }


  
  private async logRunTask(task: Task, status: LogStatus, response: Instrukdb.StatusRes): Promise<void> {
    const item = new LogItem('run task', status, formatTask(task, response, status));
    return await this.write(item);
  }

  public async logRunTaskSuccess(task: Task, response: Instrukdb.StatusRes): Promise<void> {
    return this.logRunTask(task, LogStatus.success, response);
  }

  public async logRunTaskError(task: Task, response: Instrukdb.StatusRes): Promise<void> {
    return this.logRunTask(task, LogStatus.error, response);
  }

  private async save(): Promise<void> {
    await writeFile('./logs/log_' + formatFileFriendly(new Date()) + '.txt', JSON.stringify(this.logs));
    await writeFile('./logs/log_latest.txt', JSON.stringify(this.logs));
  }
}