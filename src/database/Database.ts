import { Employee } from "../models/Employee";
import { Team } from "../models/Team";

export abstract class Database {

  public abstract getEmployeeById: (id: number) => Promise<Employee | null>;
  public abstract replaceEmployeeById: (replace: Employee, upsert: boolean) => Promise<Employee | null>;

  public abstract getTeamById: (id: number) => Promise<Team | null>;
  public abstract replaceTeamById: (replace: Team, upsert: boolean) => Promise<Team | null>;

}
