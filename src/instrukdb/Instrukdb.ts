
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

  export interface TimeStamp {
    hour: number,
    minute: number,
    second: number
  }

  export interface ScheduleDays {
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean,
  }

  export interface ScheduleSchedule {
    from: TimeStamp,
    to: TimeStamp,
    days: ScheduleDays,
  }

  export interface ScheduleDataElement {
    id: number,
    name: string,
    instrukdbCheckinId: number | null,
    instrukdbCheckinName: string,
    schedule: ScheduleSchedule,
  }

  export interface ScheduleElement extends ScheduleDataElement {
    description: string,
    priority: boolean,
  }

  export interface CheckedinPhpDataElement extends ScheduleDataElement {}

  export interface API {

    getEmployee(id: number): Promise<Employee>;
    getEmployeeList(): Promise<ListEmployee[]>;
    getAllEmployees(): Promise<Employee[]>
    isEmployeeCheckedIn(id: Number): Promise<boolean>

    changeStatus(id: number, timestamp: string, option: string): Promise<void>;

    getSchedule(): Promise<ScheduleElement[]>;
    getCheckinPhpData(): Promise<CheckedinPhpDataElement[]>;
  
  }
  
}
