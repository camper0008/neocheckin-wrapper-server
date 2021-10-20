import { insureUrlPathEnd } from "../utils/url";
import { Instrukdb } from "./Instrukdb"

export class InstrukdbClient implements Instrukdb.API {
  
  private url: string;

  public constructor (url: string) {
    this.url = insureUrlPathEnd(url);
  }

  public async getEmployee(id: number): Promise<Instrukdb.Employee> {
    throw 'not implemented';
  }

  public async getEmployeeList(): Promise<Instrukdb.ListEmployee[]> {
    throw 'not implemented';
  }

  public async getAllEmployees(): Promise<Instrukdb.Employee[]> {
    throw 'not implemented';
  }

  public async isEmployeeCheckedIn(id: Number): Promise<boolean> {
    throw 'not implemented';
  }

  public async changeStatus(id: number, timestamp: string, option: string): Promise<void> {
    throw 'not implemented';
  }

}
