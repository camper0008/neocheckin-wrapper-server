import { readFile } from "fs/promises";
import { TaskType } from "../models/TaskType";
import { BinaryString } from "../utils/base64img";
import { Instrukdb } from "./Instrukdb"

export class MockInstrukdb implements Instrukdb.API {

  public employees: (Instrukdb.Employee & {rfid: number})[] = [
    {
      id: 1,
      rfid: 1,
      name: 'Person one',
      flex: 195621,
      location: "viborg",
      activity: "SKP",
      checkedIn: true,
    },
    {
      id: 2,
      rfid: 2,
      name: 'Person Two',
      flex: 195621,
      location: "viborg",
      activity: "SKP",
      checkedIn: true
    },
    {
      id: 3,
      rfid: 3,
      name: 'Person Three',
      flex: 195621,
      location: "viborg",
      activity: "SKP",
      checkedIn: false,
    },
  ];

  public connected = true;

  public constructor () {
  
  }

  private checkConnection() {
    if (!this.connected)
      throw new Error('could not connect to Instrukdb')
  }

  public async getOneEmployee(id: number): Promise<Instrukdb.Employee> {
    this.checkConnection();
    return this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})();
  }

  public async getEmployeeList(): Promise<Instrukdb.ListEmployee[]> {
    this.checkConnection();
    return this.employees;
  }

  public getAllEmployeesCalls = 0;
  public async getAllEmployees(): Promise<Instrukdb.Employee[]> {
    this.getAllEmployeesCalls++;
    this.checkConnection();
    return this.employees;
  }

  public async getEmployeeStatus(id: Number) {
    this.checkConnection();
    return (this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})()).checkedIn;
  }

  public postCheckinCalls = 0;
  public postCheckinLastCall?: Instrukdb.PostCheckinRequest;
  public async postCheckin(req: Instrukdb.PostCheckinRequest): Promise<Instrukdb.StatusRes> {
    const {option, rfid} = req;
    this.postCheckinLastCall = req;
    this.postCheckinCalls++;
    try {
      this.checkConnection();
    } catch (err) {
      return {statusCode: 400};
    }
    const employee = this.employees.find(e => e.rfid == rfid);
    if (option === 'checkin') {
      employee!.checkedIn = true;
    } else if (option === 'checkout') {
      employee!.checkedIn = false;
    }
    return {statusCode: 200};
  }

  public async getCheckinPhpData(): Promise<Instrukdb.CheckedinPhpDataElement[]> {
    this.checkConnection();
    return JSON.parse((await readFile('./samples/checkin_php_data.json')).toString());
  }

  public async getEmployeeImage(id: number): Promise<BinaryString> {
    const read = await readFile(`./samples/employee_1_img.png`); // `./samples/employee_${id}_img.png`
    const binaryString = read.toString('binary');
    return binaryString;
  }

}
