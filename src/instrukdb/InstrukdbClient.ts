import { insureUrlPathEnd } from "../utils/url";
import { Instrukdb } from "./Instrukdb"

export class InstrukdbClient implements Instrukdb.API {
  
  private url: string;

  public constructor (url: string) {
    this.url = insureUrlPathEnd(url);
  }

  public async getEmployee(id: number): Promise<Instrukdb.Employee> {
    throw new Error('not implemented');
  }

  public async getEmployeeList(): Promise<Instrukdb.ListEmployee[]> {
    throw new Error('not implemented');
  }

  public async getAllEmployees(): Promise<Instrukdb.Employee[]> {
    throw new Error('not implemented');
  }

  public async isEmployeeCheckedIn(id: Number): Promise<boolean> {
    throw new Error('not implemented');
  }

  public async changeStatus(id: number, timestamp: string, option: string): Promise<void> {
    throw new Error('not implemented');
  }
  
  public async getSchedule(): Promise<Instrukdb.ScheduleElement[]> {
    throw new Error("Method not implemented.");
  }

  public async getCheckinPhpData(): Promise<Instrukdb.CheckedinPhpDataElement[]> {
    throw new Error("Method not implemented.");
  }

}
