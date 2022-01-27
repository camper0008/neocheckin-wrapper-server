import { Employee } from "../models/Employee";
import { LoggedError } from "../models/LoggedError";
import { ProfilePicture } from "../models/ProfilePicture";
import { AltRfid } from "../models/Rfid";
import { Task, TaskStatus } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { Md5Hash } from "../utils/base64img";
import { Database } from "./Database";

export class MemoryDB extends Database {

  private idCounter: {[key: string]: number} = {};
  private tasks: Task[] = [];
  private taskTypes: TaskType[] = [];
  private rfids: AltRfid[] = [];
  private employees: Employee[] = [];
  private profilePictures: ProfilePicture[] = [];
  private errors: LoggedError[] = [];

  public constructor () {
    super ();
    this.idCounter['tasks'] = 0;
    this.idCounter['rfids'] = 0;
    this.idCounter['profilePictures'] = 0;
    this.idCounter['errors'] = 0;
  }

  public async getUniqueTaskId(): Promise<number> {
    return this.idCounter['tasks']++;
  }

  public async getUniqueRfidId(): Promise<number> {
    return this.idCounter['rfids']++;
  }

  public async getUniqueProfilePictureId(): Promise<number> {
    return this.idCounter['profilePictures']++;
  }

  public async getUniqueErrorId(): Promise<number> {
    return this.idCounter['errors']++;
  }


  public async getTaskCount(): Promise<number> {
    return this.tasks.length;
  }

  public async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  public async getTasksWithStatus(status: TaskStatus): Promise<Task[]> {
    return this.tasks.filter(task => task.status === status);
  }

  public async insertTask(task: Task): Promise<Task> {
    for (let i in this.tasks)
      if (this.tasks[i].id === task.id)
        throw new Error('id must be unique');
    this.tasks.push(task);
    return task;
  };

  public async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    for (let i in this.tasks)
      if (this.tasks[i].id === id) {
        this.tasks[i].status = status;
        return this.tasks[i];
      }
    throw new Error('not found');
  }



  public async getTaskType(id: number): Promise<TaskType> {
    for (let i in this.taskTypes)
      if (this.taskTypes[i].id === id)
        return this.taskTypes[i];
    throw new Error('not found');
  }

  public async getTaskTypes(): Promise<TaskType[]> {
    return this.taskTypes;
  }
  
  public async replaceTaskTypes(taskTypes: TaskType[]): Promise<number> {
    this.taskTypes = taskTypes;
    return taskTypes.length;
  }



  public async getAltRfidByEmployeeId(employeeId: number): Promise<AltRfid> {
    for (let i in this.rfids)
      if (this.rfids[i].employeeId === employeeId)
        return this.rfids[i];
    throw new Error("not found");
  }

  public async getAltRfidByRfid(rfid: string): Promise<AltRfid> {
    for (let i in this.rfids)
      if (this.rfids[i].rfid === rfid)
        return this.rfids[i];
    throw new Error("not found");
  }

  public async insertAltRfid(rfid: AltRfid): Promise<AltRfid> {
    for (let i in this.rfids)
      if (this.rfids[i].id === rfid.id)
        throw new Error('id must be unique');
    this.rfids.push(rfid);
    return rfid;
  }

  public async checkEmployee(id: number): Promise<boolean> {
    return this.employees.find(e => e.id === id) !== undefined;
  }

  public async getEmployee(id: number): Promise<Employee> {
    for (const v of this.employees)
      if (v.id === id)
        return v;
    throw new Error("not found");
  }

  public async getEmployees(): Promise<Employee[]> {
      return this.employees;
  }

  public async insertEmployee(employee: Employee): Promise<Employee> {
      for (const v of this.employees)
        if (v.id === employee.id)
          throw new Error('id must be unique');
      this.employees.push(employee);
      return employee;
  }

  public async updateEmployee(id: number, update: Partial<Omit<Employee, 'id'>>): Promise<Employee> {
    const employee = await this.getEmployee(id);
    update['id'] = undefined;
    for (const i in update)
      if (update[i] !== undefined)
        employee[i] = update[i];
    return employee;
  }

  public async checkProfilePictureByChecksum(hash: Md5Hash, employeeId?: number): Promise<boolean> {
    for (const v of this.profilePictures)
      if (employeeId !== undefined)
        if (v.checksum === hash && v.employeeId === employeeId)
          return true
        else {}
      else if (v.checksum === hash)
        return true;
    return false;
  }

  public async getProfilePictureByEmployeeId(id: number): Promise<ProfilePicture> {
    for (const v of this.profilePictures)
      if (v.employeeId === id)
        return v;
    throw new Error('not found');
  }

  public async insertProfilePicture(profilePicture: ProfilePicture): Promise<ProfilePicture> {
    for (const v of this.profilePictures)
        if (v.id === profilePicture.id)
          throw new Error('id must be unique');
    this.profilePictures.push(profilePicture);
    return profilePicture;
  }

  public async getErrorCount(): Promise<number> {
    return this.errors.length;
  }

  public async getErrors(): Promise<LoggedError[]> {
    return this.errors;
  }

  public async insertError(error: LoggedError): Promise<LoggedError> {
    for (let i in this.errors)
      if (this.errors[i].id === error.id)
        throw new Error('id must be unique');
    this.errors.push(error);
    return error;
  }


}
