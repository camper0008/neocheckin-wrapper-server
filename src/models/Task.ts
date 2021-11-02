import { Identifiable } from "../database/Identifyable";

export enum TaskStatus {
  WAITING     = 'waiting',
  PROCESSING  = 'processing',
  SUCCEEDED   = 'succeeded',
  FAILED      = 'failed',
}

export interface Task extends Identifiable {
  name: string,
  taskTypeId: number,
  date: Date,
  systemIdentifier: string,
  employeeRfid: string,
  highLevelApiKey: string,
  status: TaskStatus,
}
