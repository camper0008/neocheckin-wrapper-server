import { Identifiable } from "../database/Identifyable";

export interface Rfid extends Identifiable {
  rfid: string,
  employeeId: number,
}
