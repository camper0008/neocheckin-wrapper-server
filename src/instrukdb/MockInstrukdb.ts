import { readFile } from "fs/promises";
import { TaskType } from "../models/TaskType";
import { BinaryString } from "../utils/base64img";
import { Instrukdb } from "./Instrukdb"

export class MockInstrukdb implements Instrukdb.API {

  public employees: Instrukdb.Employee[] = [
    {
      id: 1,
      name: 'Person One',
      status: 'Ikke logget ind',
      checkedIn: false,
      flexString: '-12:34',
      flexSeconds: -45240,
      location: 'HCA',
    },
    {
      id: 2,
      name: 'Person Two',
      status: 'Logget ind',
      checkedIn: true,
      flexString: '12:34',
      flexSeconds: 45240,
      location: 'EUX',
    },
    {
      id: 3,
      name: 'Person Three',
      status: 'Fucking forsvundet',
      checkedIn: false,
      flexString: '00:00',
      flexSeconds: 0,
      location: 'idk',
    },
  ];

  public connected = true;

  public constructor () {
  
  }

  private checkConnection() {
    if (!this.connected)
      throw new Error('could not connect to Instrukdb')
  }

  public async getEmployee(id: number): Promise<Instrukdb.Employee> {
    this.checkConnection();
    return this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})();
  }

  public async getEmployeeList(): Promise<Instrukdb.ListEmployee[]> {
    this.checkConnection();
    return this.employees;
  }

  public async getAllEmployees(): Promise<Instrukdb.Employee[]> {
    this.checkConnection();
    return this.employees;
  }

  public async isEmployeeCheckedIn(id: Number) {
    this.checkConnection();
    return (this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})()).checkedIn;
  }

  public async changeStatus(id: number, timestamp: string, option: string) {
    this.checkConnection();
    const employee = this.employees.find(e => e.id == id);
    if (option === 'checkin') {
      employee!.status = 'Logget ind';
      employee!.checkedIn = true;
    } else if (option === 'checkout') {
      employee!.status = 'Ikke Logget ind';
      employee!.checkedIn = false;
    }
  }

  public getScheduleCalls = 0;
  public async getSchedule(): Promise<TaskType[]> {
    this.getScheduleCalls++;
    this.checkConnection();
    return JSON.parse((await readFile('./samples/schedule.json')).toString());
  }

  public async getCheckinPhpData(): Promise<Instrukdb.CheckedinPhpDataElement[]> {
    this.checkConnection();
    return JSON.parse((await readFile('./samples/checkin_php_data.json')).toString());
  }

  public async getEmployeeImage(id: number): Promise<BinaryString> {
    const read = await readFile('./samples/employee_1_img.png');
    const binaryString = read.toString();
    return binaryString;
  }

}
