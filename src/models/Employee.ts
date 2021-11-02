import { Identifiable } from "../database/Identifyable";

export interface Employee extends Identifiable {
  name: string,
  flex: number,
  working: boolean,
  department: string,
  rfid: string,
}
