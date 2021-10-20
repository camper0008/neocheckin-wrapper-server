import { Identifiable } from "../database/Identifyable";

export interface Task extends Identifiable {
  name: string,
  taskId: number,
  date: Date,
  systemIdentifier: string,
  employeeRfid: string,
  highLevelApiKey: string,
}
