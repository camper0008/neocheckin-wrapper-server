import { writeFile } from "fs/promises";
import { AddTaskRequest } from "../tasks/addTasks";
import { formatFileFriendly } from "../utils/timedate";
import { formatTask } from "./formatLogs";
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
    const item = new LogItem('add task', status, formatTask(task, status));
    await this.write(item);
  }

  public async logAddTaskSuccess(task: AddTaskRequest): Promise<void> {
    this.logAddTask(task, LogStatus.success);
  }

  public async logAddTaskError(task: AddTaskRequest): Promise<void> {
    this.logAddTask(task, LogStatus.error);
  }

  private async save(): Promise<void> {
    await writeFile('./logs/log_' + formatFileFriendly(new Date()) + '.txt', JSON.stringify(this.logs));
    await writeFile('./logs/log_latest.txt', JSON.stringify(this.logs));
  }
}