import { LoggedError } from "../models/LoggedError";
import { AltRfid } from "../models/Rfid";
import { Task, TaskStatus } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { Employee } from "../models/Employee";
import { ProfilePicture } from "../models/ProfilePicture";
import { Md5Hash } from "../utils/base64img";

export abstract class Database {

  public abstract getUniqueTaskId(): Promise<number>;
  public abstract getUniqueRfidId(): Promise<number>;
  public abstract getUniqueProfilePictureId(): Promise<number>;
  public abstract getUniqueErrorId(): Promise<number>
  
  public abstract getTaskCount(): Promise<number>;
  public abstract getTasks(): Promise<Task[]>;
  public abstract getTasksWithStatus(status: TaskStatus): Promise<Task[]>;
  public abstract insertTask(task: Task): Promise<Task>;
  public abstract updateTaskStatus(id: number, status: TaskStatus): Promise<Task>;

  public abstract getTaskTypes(): Promise<TaskType[]>;
  public abstract getTaskType(id: number): Promise<TaskType>;
  public abstract replaceTaskTypes(taskTypes: TaskType[]): Promise<number>;

  public abstract getAltRfidByEmployeeId(employeeId: number): Promise<AltRfid>;
  public abstract getAltRfidByRfid(rfid: string): Promise<AltRfid>;
  public abstract insertAltRfid(rfid: AltRfid): Promise<AltRfid>;

  public abstract checkEmployee(id: number): Promise<boolean>;
  public abstract getEmployee(id: number): Promise<Employee>;
  public abstract getEmployees(): Promise<Employee[]>;
  public abstract insertEmployee(employee: Employee): Promise<Employee>;
  public abstract updateEmployee(id: number, update: Partial<Omit<Employee, 'id'>>): Promise<Employee>;

  public abstract checkProfilePictureByChecksum(hash: Md5Hash, employeeId?: number): Promise<boolean>;
  public abstract getProfilePictureByEmployeeId(id: number): Promise<ProfilePicture>;
  public abstract insertProfilePicture(profilePicture: ProfilePicture): Promise<ProfilePicture>;

  public abstract getErrorCount(): Promise<number>;
  public abstract getErrors(): Promise<LoggedError[]>;
  public abstract insertError(error: LoggedError): Promise<LoggedError>;

}
