import { TaskType } from "../models/TaskType";
import type { BinaryString } from "../utils/base64img";
import { insureUrlPathEnd, paramString } from "../utils/url";
import { Instrukdb } from "./Instrukdb";
import { Agent as HttpsAgent, AgentOptions } from "https";
import axios, { AxiosRequestConfig } from "axios";

export class InstrukdbClient implements Instrukdb.API {
  
  private url: string;
  private lowLevelApiKey: string;

  public constructor (url: string, lowLevelApiKey: string) {
    this.url = insureUrlPathEnd(url);
    this.lowLevelApiKey = lowLevelApiKey;
  }

  public async getEmployee(id: number): Promise<Instrukdb.Employee> {
    const res = await this.httpGet('employee/one.php', {id: id.toString(), token: this.lowLevelApiKey});
    
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
    const response = await axios.get(url, this.httpsConfig());
    return response.data as BinaryString;
  }

  private httpsConfig<T = any>(): AxiosRequestConfig<T> {
    const config: AgentOptions = {rejectUnauthorized: false};
    const httpsAgent = new HttpsAgent(config);
    return {httpsAgent};
  }
  
  private async httpGet(path: string, data: Record<string, string>) {
    const params = paramString(data);
    const url = this.url + path + params;
    const res = await axios.get(url, this.httpsConfig());
    res.data
    return res;
  }

}
