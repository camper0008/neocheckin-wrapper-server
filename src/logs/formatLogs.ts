import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task } from "../models/Task";
import { AddTaskRequest } from "../tasks/addTasks";
import { LogStatus } from "./LogItem";

const getFormattedDate = (date: Date | string | undefined): string => {
  if (date instanceof Date)
    return date.toISOString();
  
  if (typeof date === "string")
    return new Date(date).toISOString();

  return new Date().toISOString() + ' (no date given)';
}

const formatTaskRequestStatusMsg = (status: LogStatus, success: string, error: string) => {
  switch (status) {
    case LogStatus.success: return success;
    case LogStatus.error:   return error;
    default:
      throw new Error(`Unexhausted LogStatus ${status}`);
  }
}

export const formatTaskRequest = (request: AddTaskRequest, status: LogStatus): string => {
  
  const info = `name: ${request.name}\n`
    + `task-id: ${request.taskTypeId}\n`
    + `system-id: ${request.systemIdentifier}\n`
    + `rfid: ${request.employeeRfid}\n`
    + `task-timestamp: ${getFormattedDate(request.date)}`
  
  return formatTaskRequestStatusMsg(status, 'Task added', 'Task could not be added') + '\n' + info;
}


export const formatTask = (task: Task, response: Instrukdb.StatusRes, status: LogStatus) => {
  
  const info = ''
    + `id: ${task.id}\n`
    + `name: ${task.name}\n`
    + `runner-status: ${task.status}\n`
    + `task-id: ${task.taskTypeId}\n`
    + `system-id: ${task.systemIdentifier}\n`
    + `system-ip: ${task.systemIp}\n`
    + `rfid: ${task.employeeRfid}\n`
    + `task-timestamp: ${getFormattedDate(task.date)}\n`
    + `response-code: ${response.statusCode}\n`
    + `response-message: ${response.message ?? '<no message>'}`

    return formatTaskRequestStatusMsg(status, 'Task sent', 'Task could not be sent') + '\n' + info;
  }
