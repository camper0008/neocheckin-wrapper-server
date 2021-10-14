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

  public getEmployee = async (id: number): Promise<Instrukdb.Employee> => {
    return this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})();
  }

  public getEmployeeList = async (): Promise<Instrukdb.ListEmployee[]> => {
    return this.employees;
  }

  public getAllEmployees = async (): Promise<Instrukdb.Employee[]> => {
    return this.employees;
  }

  public isEmployeeCheckedIn = async (id: Number) => {
    return (this.employees.find((e) => (e.id === id)) || (() => {throw new Error('not found')})()).checkedIn;
  }

  public changeCheckInState = async (id: number, timestamp: string, option: string) => {
    const employee = this.employees.find(e => e.id == id);
    if (option === 'checkin') {
      
    }
  }

}
