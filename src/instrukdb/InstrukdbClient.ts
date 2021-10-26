import { TaskType } from "../models/TaskType";
import type { BinaryString } from "../utils/base64img";
import { insureUrlPathEnd } from "../utils/url";
import { Instrukdb } from "./Instrukdb";
import { Agent as HttpsAgent } from "https";
import axios, { AxiosRequestConfig } from "axios";

export class InstrukdbClient implements Instrukdb.API {
  
  private url: string;
  private lowLevelApiKey: string;

  public constructor (url: string, lowLevelApiKey: string) {
    this.url = insureUrlPathEnd(url);
    this.lowLevelApiKey = lowLevelApiKey;
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
  
  public async getSchedule(): Promise<TaskType[]> {
    throw new Error("Method not implemented.");
  }

  public async getCheckinPhpData(): Promise<Instrukdb.CheckedinPhpDataElement[]> {
    throw new Error("Method not implemented.");
  }

  public async getEmployeeImage(id: number): Promise<BinaryString> {
    const url = `https://instrukdb/elevbilled.php?id=${id}`;
    const config: AxiosRequestConfig<any> = {
      responseType: 'arraybuffer',
      httpsAgent: new HttpsAgent({rejectUnauthorized: false})
    }
    const response = await axios.get(url, config);
    return response.data as BinaryString;
  }

}
