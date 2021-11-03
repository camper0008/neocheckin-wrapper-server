import { TaskType } from "../models/TaskType";
import type { BinaryString } from "../utils/base64img";

export namespace Instrukdb {

  export interface StatusRes {
    statusCode: number,
    message?: string,
  }

  export interface Employee {
    id: number,
    name: string,
    flex: number,
    location: string,
    activity: string,
    checkedIn: boolean,
    rfid: number,
  }

  export type ListEmployee = Pick<Employee, 'id' | 'name' | 'activity' | 'checkedIn'>;

  export type CheckedinPhpDataElement = Omit<TaskType, 'description' | 'priority'>;

  export interface PostCheckinRequest {
    token: string,
    rfid: number,
    timestamp: number,
    option: string,
    details: string,
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
