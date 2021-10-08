import { Employee } from "../models/Employee";
import { Team } from "../models/Team";
import { Option } from "../models/Option";

export abstract class Database {

  public abstract getAllEmployees: () => Promise<Employee[]>;
  public abstract getEmployeeById: (id: number) => Promise<Employee | null>;
  public abstract getEmployeeByRfid: (rfid: string) => Promise<Employee | null>;
  public abstract updateEmployeeById: (id: number, update: Partial<Employee>) => Promise<Employee | null>;
  public abstract replaceEmployeeById: (replace: Employee, upsert: boolean) => Promise<Employee | null>;

  public abstract getTeamById: (id: number) => Promise<Team | null>;
  public abstract replaceTeamById: (replace: Team, upsert: boolean) => Promise<Team | null>;

  public abstract addOptions: (option: Option) => Promise<Option | null>;
  public abstract getAllActiveOptions: () => Promise<Option[]>;

}
