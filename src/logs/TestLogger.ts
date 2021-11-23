import { AddTaskRequest } from "../tasks/addTasks";
import { formatTask } from "./formatLogs";
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
  public async logAddTask(task: AddTaskRequest, status: LogStatus): Promise<void> {
    const item = new LogItem('add task', status, formatTask(task, status));
    await this.write(item);
  }
}