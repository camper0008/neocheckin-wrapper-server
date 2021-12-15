import { TaskType } from "../models/TaskType";
import type { BinaryString } from "../utils/base64img";
import { insureUrlPathEnd, paramString } from "../utils/url";
import { Instrukdb } from "./Instrukdb";
import { Agent as HttpsAgent, AgentOptions } from "https";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class InstrukdbClient implements Instrukdb.API {
  
  private lowLevelApiKey: string;
  // private readonly hostname = 'https://instrukdb';
  private readonly hostname = 'http://192.168.112.117:80';

  public constructor (lowLevelApiKey: string) {
    this.lowLevelApiKey = lowLevelApiKey;
  }

  public async getOneEmployee(id: number): Promise<Instrukdb.Employee> {
    const res = await this.httpGet<Instrukdb.Employee>(
      this.hostname + '/api/employee/one.php',
      {id: id.toString(), token: this.lowLevelApiKey}
    );
    return res.data;
  }

  public async getEmployeeList(): Promise<Instrukdb.ListEmployee[]> {
    const res = await this.httpGet<Instrukdb.ListEmployee[]>(
      this.hostname + '/api/employee/list.php',
      {token: this.lowLevelApiKey}
    );
    return res.data;
  }

  public async getAllEmployees(): Promise<Instrukdb.Employee[]> {
    const res = await this.httpGet<Instrukdb.Employee[]>(
      this.hostname + '/api/employee/all.php',
      {token: this.lowLevelApiKey}
    );
    return res.data;
  }

  private logPostCheckinRequest(request: Instrukdb.PostCheckinRequest, res: Instrukdb.StatusRes) {
    const d = new Date();
    console.log(
      `\nRequest sendt to Instrukdb\n`
      + `    time:\t${d.toLocaleTimeString().replace(/\./g, ':')}  ${d.toLocaleDateString().replace(/\//g, '-')}\n` 
      + `    request:\t${JSON.stringify(request).replace(/\n/g, '\n    ')}\n`
      + `    response:\t${JSON.stringify(res).replace(/\n/g, '\n    ')}\n`
    );
  }

  public async postCheckin(request: Instrukdb.PostCheckinRequest): Promise<Instrukdb.StatusRes> {
    try {
      const config: AxiosRequestConfig<Instrukdb.PostCheckinRequest> = this.httpsConfig();
      type Req = Instrukdb.PostCheckinRequest;
      type Res = Instrukdb.StatusRes;
      type Opt = AxiosRequestConfig<Res>;
      const res = await axios.post<Res, Opt, Req>(
        this.hostname + '/api/employee/checkin.php?token=' + request.token,
        request,
	{...config, headers: {"token": request.token}}
      );
      this.logPostCheckinRequest(request, res.data!);
      if (res.data === undefined)
        throw new Error('could not retrieve data from Instrukdb');
      return res.data;
    } catch (err) {
      return {statusCode: 400, message: (err as Error).message}
      // console.error(err);
      // throw err;
    }
  }
  
  public async getCheckinPhpData(): Promise<Instrukdb.CheckedinPhpDataElement[]> {
    const res = await this.httpGet<Instrukdb.CheckedinPhpDataElement[]>(this.hostname + '/lib/check_data.json', {});
    return res.data;
  }

  public async getEmployeeImage(id: number): Promise<BinaryString> {
    const url = `${this.hostname}/elevbilled.php?id=${id}`;
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
      const url = path + params;
      const res = await axios.get<T>(url, this.httpsConfig());
      return res;
    } catch (err) {
      console.error(err);
      throw new Error('could not send GET to Instrukdb');
    }
  }

}
