import { TaskType } from "../models/TaskType";
import type { BinaryString } from "../utils/base64img";

export namespace Instrukdb {

  export interface StatusRes {
    statusCode: number,
  }

  export interface Employee {
    id: number,
    name: string,
    flex: number,
    location: string,
    activity: string,
    checkedIn: boolean,
  }

  export type ListEmployee = Pick<Employee, 'id' | 'name' | 'activity' | 'checkedIn'>;

  export type CheckedinPhpDataElement = Omit<TaskType, 'description' | 'priority'>;

  export interface PostCheckinRequest {
    token: string,
    rfid: number,
    timestamp: number,
    option: string,
    ip: string
  }

  export interface API {

    getOneEmployee(id: number): Promise<Employee>;
    getEmployeeList(): Promise<ListEmployee[]>;
    getAllEmployees(): Promise<Employee[]>

    postCheckin(request: PostCheckinRequest): Promise<StatusRes>;

    getSchedule(): Promise<TaskType[]>;
    getCheckinPhpData(): Promise<CheckedinPhpDataElement[]>;

    getEmployeeImage(id: number): Promise<BinaryString>;
  
  }
  
}
