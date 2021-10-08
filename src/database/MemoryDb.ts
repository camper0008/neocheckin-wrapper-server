import { Employee } from "../models/Employee";
import { Team } from "../models/Team";
import { Database } from "./Database";

export class MemoryDb extends Database {
  
  private employees: Employee[] = [];
  private teams: Team[] = [];

  public getEmployeeById = async (id: number) => {
    for (let i in this.employees)
      if (this.employees[i].id === id)
        return this.employees[i];
    return null;
  };

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

}
