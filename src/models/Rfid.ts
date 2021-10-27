import { Identifiable } from "../database/Identifyable";

export interface AltRfid extends Identifiable {
  rfid: string,
  employeeId: number,
}
