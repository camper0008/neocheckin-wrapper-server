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
  public async logAddTask(task: AddTaskRequest, status: LogStatus): Promise<void> {
    const item = new LogItem('add task', status, formatTask(task, status));
    await this.write(item);
  }

  private async save(): Promise<void> {
    await writeFile('./logs/log_' + formatFileFriendly(new Date()), JSON.stringify(this.logs));
  }
}