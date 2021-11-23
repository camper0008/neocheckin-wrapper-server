import { AddTaskRequest } from "../tasks/addTasks";
import { LogItem, LogStatus } from "./LogItem";

export interface Logger {
  read():                                              Promise<LogItem[]>
  write(msg: LogItem):                                 Promise<void>
  logAddTask(task: AddTaskRequest, status: LogStatus): Promise<void>
}