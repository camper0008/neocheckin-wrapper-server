import { TaskType } from "../models/TaskType";
import type { BinaryString } from "../utils/base64img";
import { insureUrlPathEnd, paramString } from "../utils/url";
import { Instrukdb } from "./Instrukdb";
import { Agent as HttpsAgent, AgentOptions } from "https";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class InstrukdbClient implements Instrukdb.API {
  
  private url: string;
  private lowLevelApiKey: string;

  public constructor (url: string, lowLevelApiKey: string) {
    this.url = insureUrlPathEnd(url);
    this.lowLevelApiKey = lowLevelApiKey;
  }

  public async getOneEmployee(id: number): Promise<Instrukdb.Employee> {
    const res = await this.httpGet<Instrukdb.Employee>(
      'employee/one.php',
      {id: id.toString(), token: this.lowLevelApiKey}
    );
    return res.data;
  }

  public async getEmployeeList(): Promise<Instrukdb.ListEmployee[]> {
    const res = await this.httpGet<Instrukdb.ListEmployee[]>(
      'employee/list.php',
      {token: this.lowLevelApiKey}
    );
    return res.data;
  }

  public async getAllEmployees(): Promise<Instrukdb.Employee[]> {
    const res = await this.httpGet<Instrukdb.Employee[]>(
      'employee/all.php',
      {token: this.lowLevelApiKey}
    );
    return res.data;
  }

  public async postCheckin(request: Instrukdb.PostCheckinRequest): Promise<Instrukdb.StatusRes> {
    try {
      const config: AxiosRequestConfig<Instrukdb.PostCheckinRequest> = this.httpsConfig();
      type Req = Instrukdb.PostCheckinRequest;
      type Res = Instrukdb.StatusRes;
      type Opt = AxiosRequestConfig<Res>
      const res = await axios.post<Res, Opt, Req>(
        'employee/checkin.php',
        request,
        config
      );
      if (res.data === undefined)
        throw new Error('could not retrieve data from Instrukdb');
      if (res.data.statusCode === 400)
        throw new Error('bad request to Instrukdb');
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  
  public async getSchedule(): Promise<TaskType[]> {
    const res = await this.httpGet<TaskType[]>('lib/schedule.php', {});
    return res.data;
  }

  public async getCheckinPhpData(): Promise<Instrukdb.CheckedinPhpDataElement[]> {
    const res = await this.httpGet<Instrukdb.CheckedinPhpDataElement[]>('lib/schedule.php', {});
    return res.data;
  }

  public async getEmployeeImage(id: number): Promise<BinaryString> {
    const url = `https://instrukdb/elevbilled.php?id=${id}`;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      httpsAgent: new HttpsAgent({rejectUnauthorized: false}),
    });
    return response.data as BinaryString;
  }

  private httpsConfig(): AxiosRequestConfig {
    const config: AgentOptions = {rejectUnauthorized: false};
    const httpsAgent = new HttpsAgent(config);
    return {
      httpsAgent,
    };
  }
  
  private async httpGet<T = any>(path: string, data: Record<string, string>): Promise<AxiosResponse<T, any>> {
    try {
      const params = paramString(data);
      const url = this.url + path + params;
      const res = await axios.get<T>(url, this.httpsConfig());
      return res;
    } catch (err) {
      console.error(err);
      throw new Error('could not send GET to Instrukdb');
    }
  }

}
