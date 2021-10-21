import { readFile } from "fs/promises";
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

  public constructor () {
  
  }

  public async getEmployee(id: number): Promise<Instrukdb.Employee> {
    return this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})();
  }

  public async getEmployeeList(): Promise<Instrukdb.ListEmployee[]> {
    return this.employees;
  }

  public async getAllEmployees(): Promise<Instrukdb.Employee[]> {
    return this.employees;
  }

  public async isEmployeeCheckedIn(id: Number) {
    return (this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})()).checkedIn;
  }

  public async changeStatus(id: number, timestamp: string, option: string) {
    const employee = this.employees.find(e => e.id == id);
    if (option === 'checkin') {
      employee!.status = 'Logget ind';
      employee!.checkedIn = true;
    } else if (option === 'checkout') {
      employee!.status = 'Ikke Logget ind';
      employee!.checkedIn = false;
    }
  }

  public async getSchedule(): Promise<Instrukdb.ScheduleElement[]> {
    return JSON.parse((await readFile('./samples/schedule.json')).toString());
  }

  public async getCheckinPhpData(): Promise<Instrukdb.CheckedinPhpDataElement[]> {
    return JSON.parse((await readFile('./samples/checkin_php_data.json')).toString());
  }

}
