import { AddTaskRequest } from "../tasks/addTasks";
import { LogStatus } from "./LogItem";

const getFormattedDate = (date: Date | string | undefined): string => {
  if (date instanceof Date)
    return date.toISOString();
  
  if (typeof date === "string")
    return new Date(date).toISOString();

  return new Date().toISOString() + ' (no date given)';
}

export const formatTask = (task: AddTaskRequest, status: LogStatus): string => {
  const info = `name: ${task.name}\n`
    + `task-id: ${task.taskTypeId}\n`
    + `system-id: ${task.systemIdentifier}\n`
    + `rfid: ${task.employeeRfid}\n`
    + `task-timestamp: ${getFormattedDate(task.date)}`

  if (status === LogStatus.success)
    return "Task added\n" + info;
  else if (status === LogStatus.error)
    return "Task could not be added\n" + info;
  else
    throw new Error(`Unexpected LogStatus ${status}`);
}