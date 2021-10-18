import { Identifiable } from "../database/Identifyable";

export interface CheckTask extends Identifiable {

  name: string,
  actionId: number;
  date: Date,
  authorName: string,
  authorEmail: string,

}
