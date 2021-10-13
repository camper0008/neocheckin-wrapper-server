import { Employee } from "../models/Employee";
import { Option } from "../models/Option";
import { Team } from "../models/Team";
import { Database } from "./Database";

export class MemoryDb extends Database {
  
  private employees: Employee[] = [];
  private teams: Team[] = [];
  private options: Option[] = [];

  public getAllEmployees = async () => {
    return this.employees;
  };

  public getEmployeeById = async (id: number) => {
    for (let i in this.employees)
      if (this.employees[i].id === id)
        return this.employees[i];
    return null;
  };

  public getEmployeeByRfid = async (rfid: string) => {
    for (let i in this.employees)
      if (this.employees[i].rfid === rfid)
        return this.employees[i];
    return null;
  };

  public updateEmployeeById = async (id: number, update: Partial<Employee>) => {
    const employee = await this.getEmployeeById(id);
    if (!employee) return employee;
    for (let i in update)
      employee[i] = update[i];
    return employee;
  }

  public replaceEmployeeById = async (update: Employee, upsert: boolean) => {
    const employee = await this.getEmployeeById(update.id);
    if (employee)
      for (let i in employee)
      employee[i] = update[i];
    else if (upsert)
      this.employees.push(update);
    return employee || update;
  }; 

  public getTeamById = async (id: number) => {
    for (let i in this.teams)
      if (this.teams[i].id === id)
        return this.teams[i];
    return null;
  };
  
  public replaceTeamById = async (update: Team, upsert: boolean) => {
    const team = await this.getTeamById(update.id);
    if (team)
      for (let i in team)
        team[i] = update[i];
    else if (upsert)
      this.teams.push(update);
    return team || update;
  };

  public addOptions = async (option: Option) => {
    this.options.push(option);
    return option;
  }

  public getAllActiveOptions = async () => {
    const options: Option[] = [];
    for (let i in this.options)
      if (this.options[i].active)
        options.push(this.options[i]);
    return options;
  }

}
