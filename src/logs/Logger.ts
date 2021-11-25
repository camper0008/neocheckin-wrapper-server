import { Task } from "../models/Task";
import { AddTaskRequest } from "../tasks/addTasks";
import { LogItem } from "./LogItem";
import { Instrukdb } from "../instrukdb/Instrukdb";

export interface Logger {
  read():                                              Promise<LogItem[]>
  write(msg: LogItem):                                 Promise<void>
  
  logAddTaskSuccess(task: AddTaskRequest): Promise<void>
  logAddTaskError(task: AddTaskRequest): Promise<void>

  logRunTaskSuccess(task: Task, response: Instrukdb.StatusRes): Promise<void>
  logRunTaskError(task: Task, response: Instrukdb.StatusRes): Promise<void>
}