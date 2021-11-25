import { AddTaskRequest } from "../tasks/addTasks";
import { LogItem, LogStatus } from "./LogItem";

export interface Logger {
  read():                                              Promise<LogItem[]>
  write(msg: LogItem):                                 Promise<void>
  logAddTaskSuccess(task: AddTaskRequest): Promise<void>
  logAddTaskError(task: AddTaskRequest): Promise<void>
}