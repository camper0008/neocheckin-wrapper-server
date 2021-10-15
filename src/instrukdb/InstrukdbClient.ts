import { insureUrlPathEnd } from "../utils/url";
import { Instrukdb } from "./Instrukdb"

export class InstrukdbClient implements Instrukdb.API {
  
  private url: string;

  public constructor (url: string) {
    this.url = insureUrlPathEnd(url);
  }

  public getEmployee = async (id: number) => {
    throw 'not implemented';
  }

  public getEmployeeList = async () => {
    throw 'not implemented';
  }

  public getAllEmployees = async () => {
    throw 'not implemented';
  }

  public isEmployeeCheckedIn = async (id: Number) => {
    throw 'not implemented';
  }

  public changeStatus = async (id: number, timestamp: string, option: string) => {
    throw 'not implemented';
  }

}
