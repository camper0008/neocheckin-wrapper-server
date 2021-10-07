import axios from "axios";
import { writeFile } from "fs/promises";
import { Agent as HttpsAgent } from "https";
import { FlexTime, Time } from "../models/Employee";
import { iteratorToArray } from "../utils/iteratorUtils";

export interface TeamsTeamScrape {
  name: string;
  location: string;
  instructer: string;
  instructerMail: string;
}

export interface TeamsTeamEmployeeScrape {
  id: string;
  bgColor: string;
  nameShort: string;
  nameLong: string;
  flexColor: string;
  flexString: string;
  projectName: string;
  workTimeString: string;
  locationLong: string;
  locationShort: string;
}

export interface TeamsEmployeeScrape {
  department: string;
  team: TeamsTeamScrape;
  employee: TeamsTeamEmployeeScrape;
}

export enum TeamsPages {
  ItSupport = '',
  Programmør = 'pro',
  Infrastruktur = 'infra',
  Stab = 'stab'
}

export interface TeamsPagesHtml {
  itSupport: string;
  programmør: string;
  infrastruktur: string;
  stab: string;
}

export const fetchTeamsPageHtml = async (page: TeamsPages) => {
  const res = await axios.get(
    `https://instrukdb/teams.php?${page === TeamsPages.ItSupport ? '' : `showteam=${page}`}`,
    {httpsAgent: new HttpsAgent({ rejectUnauthorized: false })}
  );
  const html = res.data as string;
  // await writeFile(`samples/teams_${page === TeamsPages.ItSupport ? 'itsup' : page}_test.html`, html);
  return html;
}

export const fetchTeamsHtml = async () => {
  const [
    itSupport,
    programmør,
    infrastruktur,
    stab
  ] = await Promise.all([
    fetchTeamsPageHtml(TeamsPages.ItSupport),
    fetchTeamsPageHtml(TeamsPages.Programmør),
    fetchTeamsPageHtml(TeamsPages.Infrastruktur),
    fetchTeamsPageHtml(TeamsPages.Stab)
  ])

  return {itSupport, programmør, infrastruktur, stab} as TeamsPagesHtml;
}

export const getTeamTableHtml = (html: string): string[] => {
  const matchesIterator = html.matchAll(/(<table><tr>\s*<td colspan="1">.*?<td><\/tr><\/table>)/gs);
  const matches = iteratorToArray(matchesIterator);
  const teams: string[] = [];
  for (let i in matches)
    teams.push(matches[i][1]);
  return teams;
}

export const getTeamInfoFromTable = (html: string): TeamsTeamScrape => {
  const match = html.match(
    /<td colspan="1"><strong>(.*)<\/strong><\/td><td><strong>(.*)<img (?:.*)><\/strong>.*<a href="mailto:(\w+@\w+\.\w+)">\((\w+)\)<\/a><\/td>/
  );
  if (!match || !match[1])
    throw new Error('Team name could not be scraped');
  
  return {
    name: match[1],
    location: match[2],
    instructer: match[3],
    instructerMail: match[4],
  };
}

export const getEmployeesFromTable = (html: string): TeamsTeamEmployeeScrape[] => {
  const matchesIterator = html.matchAll(new RegExp(
    '<tr><td.*?><img src="elevbilled\\.php\\?id=(?<imageId>\\d+)".*?><\\/td><td.*?bgcolor="'
    + '\\s*?(?<bgColor>[^\\s]*?)">\\s*?<table.*?>\\s*?<tr>'
    + '\\s*?<td.*?>\\s*?<div.*?>\\s*?\t*(?<nameShort>.+?)\\s*?<span.*?>'
    + '\\s*?\t*(?<nameLong>.+?)\\s*?<\\/span>\\s*?<font '
    + 'color=(?<flexColor>(?:#90EE90)|(?:red)).*?onclick="parent\\.large_info_page'
    + '\\(\'elev_ferie2\\.php\\?elevid=(?<ferie2Id>\\d+)\'\\)".*?>'
    + '(?<flexTime>\\-?\\d+:\\d+)<\\/font>\\s*?<\\/div>\\s*?<\\/td>\\s*?<\\/tr>'
    + '\\s*?<tr>\\s*?<td.*?>\\s*?\t*(?<projectName>.*?)\\s*?<\\/td>\\s*?'
    + '<\\/tr>\\s*?<tr>\\s*?<td>\\s*?\t*(?<workTime>.*?)\\s*?<\\/td>\\s*?<\\/tr>\\s*?'
    + '<tr>\\s*?<td.*?>\\s*?<div.*?>\\s*?\t*(?<locationShort>.*?)\\s*?'
    + '<span.*?>\\s*?\t*(?<locationLong>.*?)\\s*?<\\/span>\\s*?<\\/div>\\s*?<\\/td>'
    + '\\s*?<\\/tr>\\s*?<\\/table>\\s*?<td><\\/tr>',
    'gm'
  ));
  const matches: RegExpMatchArray[] = iteratorToArray(matchesIterator);
  const employees: TeamsTeamEmployeeScrape[] = [];
  for (let i in matches) {
    employees.push({
      id: matches[i].groups!['imageId'],
      bgColor: matches[i].groups!['bgColor'],
      nameShort: matches[i].groups!['nameShort'],
      nameLong: matches[i].groups!['nameLong'],
      flexColor: matches[i].groups!['flexColor'],
      flexString: matches[i].groups!['flexTime'],
      projectName: matches[i].groups!['projectName'],
      workTimeString: matches[i].groups!['workTime'],
      locationLong: matches[i].groups!['locationLong'],
      locationShort: matches[i].groups!['locationShort'],
    });
  }
    
  return employees;
}

export const getTeamsPageDepartment = (page: TeamsPages) => {
  switch (page) {
    case TeamsPages.ItSupport: return 'Itsupporter';
    case TeamsPages.Programmør: return 'Programmør';
    case TeamsPages.Infrastruktur: return 'Infrastruktur';
    case TeamsPages.Stab: return 'Stab';
  }
}

export const scrapeTeamsTeam = (html: string, page: TeamsPages): TeamsEmployeeScrape[] => {
  const employees: TeamsEmployeeScrape[] = [];
  const teamTablesHtml = getTeamTableHtml(html);
  const department = getTeamsPageDepartment(page);
  for (let i in teamTablesHtml) {
    const team = getTeamInfoFromTable(teamTablesHtml[i]);
    const teamEmployees = getEmployeesFromTable(teamTablesHtml[i]);
    for (let i in teamEmployees)
      employees.push({department, team, employee: teamEmployees[i]});
  }
  return employees;
}

export const scrapeTeams = (pagesHtml: TeamsPagesHtml): TeamsEmployeeScrape[] => {
  return [
    ...scrapeTeamsTeam(pagesHtml.itSupport, TeamsPages.ItSupport),
    ...scrapeTeamsTeam(pagesHtml.programmør, TeamsPages.Programmør),
    ...scrapeTeamsTeam(pagesHtml.infrastruktur, TeamsPages.Infrastruktur),
    ...scrapeTeamsTeam(pagesHtml.stab, TeamsPages.Stab),
  ];
}
