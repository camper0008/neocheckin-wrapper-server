import { Database } from "../database/Database";
import { ElevOversigtEmployeeScrape, getElevOversigtHtml, scrapeElevOversigt } from "../instrukdb/elevOversigt";
import { fetchTeamsHtml, scrapeTeams, TeamsEmployeeScrape } from "../instrukdb/teams";
import { Team } from "../models/Team";

export const updateTeams = async (teams: Team[], database: Database) => {
  for (let i in teams)
    await database.replaceTeamById(teams[i], true);
}

export const updateEmployeesByElevOversigt = async (elevOversigtData: ElevOversigtEmployeeScrape[], database: Database) => {
  for (let i in elevOversigtData)
    await database.replaceEmployeeById({
      ...elevOversigtData[i],
      workTimeString: '',
      location: '',
      projectName: '',
      nameShort: '',
      locationShort: '',
      teamId: -1,
    }, true);
}

export const updateEmployeesByTeams = async (teamsData: TeamsEmployeeScrape[], database: Database) => {
  for (let i in teamsData) {
    const employee = await database.getEmployeeById(teamsData[i].employee.id);
    await database.replaceEmployeeById({
      id: employee?.id || teamsData[i].employee.id,
      name: employee?.name || teamsData[i].employee.nameLong,
      department: teamsData[i].department,
      flex: teamsData[i].employee.flex,
      vacation: employee?.vacation || {used: 0, left: 0, planned: 0},
      workTimeString: teamsData[i].employee.workTimeString,
      location: teamsData[i].employee.locationLong,
      projectName: teamsData[i].employee.projectName,
      nameShort: teamsData[i].employee.nameShort,
      locationShort: teamsData[i].employee.locationShort,
      teamId: teamsData[i].team.id,
    }, true);
  }
  
}

export const updateCache = async (database: Database) => {
  const [elevOversigtHtml, teamsHtml] = await Promise.all([
    getElevOversigtHtml(),
    fetchTeamsHtml()
  ]);

  const [elevOversigtData, teamsData] = await Promise.all([
    scrapeElevOversigt(elevOversigtHtml),
    scrapeTeams(teamsHtml)
  ]);

  const teams: Team[] = [];
  for (let i in teamsData) {
    let unique = true;
    for (let j in teams)
      if (teams[j].id === teamsData[j].team.id)
        unique = false;
    if (unique)
      teams.push({department: teamsData[i].department, ...teamsData[i].team});
  }

  
      
  await updateTeams(teams, database);
  await updateEmployeesByElevOversigt(elevOversigtData, database);
  await updateEmployeesByTeams(teamsData, database);
}

export class CacheUpdater {

  private updateInterval?: NodeJS.Timer;
  private database: Database;

  public constructor (database: Database) {
    this.database = database;
  }

  public start = (delayMs: number) => {
    this.updateInterval = setInterval(() => updateCache(this.database), delayMs);
    updateCache(this.database);
  }

  public stop = () => {
    if (!this.updateInterval) return;
    clearInterval(this.updateInterval);
  }

}
