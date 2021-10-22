import { Identifiable } from "../database/Identifyable";

export interface LoggedError extends Identifiable {
  name: string,
  msg: string,
  stack?: string,
}
