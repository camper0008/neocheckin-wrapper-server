
export namespace Instrukdb {

  // TODO implement new json files

  export interface Employee {
    id: number          // instrukdb id
    name: string,       // fulde navn
    status: string,     // logget ind/ud, sygemeldt, afspadsering?
    checkedIn: boolean, // logget ind eller ej
    flexString: string, // flex tid som string?
    flexSeconds: number,// flex tid som seconder?
    location: string,   // lokation
  }

  export type ListEmployee = Pick<Employee, 'id' | 'name' | 'status'>;

  export interface API {

    getEmployee(id: number): Promise<Employee>;
    getEmployeeList(): Promise<ListEmployee[]>;
    getAllEmployees(): Promise<Employee[]>
    isEmployeeCheckedIn(id: Number): Promise<boolean>

    changeStatus(id: number, timestamp: string, option: string): Promise<void>;
  
  }
  
}
