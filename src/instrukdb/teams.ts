import axios from "axios";
import { writeFile } from "fs/promises";
import { Agent as HttpsAgent } from "https";
import { FlexTime, Time } from "../models/Elev";

export interface TeamsTeamInfo {
  name: string;
  location: string;
  instructer: string;
}

export interface TeamsElevInfo {
  firstname: string;
  fullname: string;
  flextime: FlexTime;
  teamsInfo: TeamsTeamInfo[];
  project?: string;
  checkedIn: boolean;
  checkInTime: Time;
  checkOutTime: Time;
  instrukdbImgId: number;
  instrukdbImgSource: string;
}

export enum TeamsPages {
  ItSupport = '',
  Programmør = 'pro',
  Infrastruktur = 'infra',
  Stab = 'stab'
}

export const getTeamsHtml = async (page: TeamsPages) => {

  const res = await axios.get(
    `https://instrukdb/teams.php?${page === TeamsPages.ItSupport ? '' : `showteam=${page}`}`,
    {
      httpsAgent: new HttpsAgent({ rejectUnauthorized: false })
    }
  );
  const html = res.data as string;

  await writeFile(`samples/teams_${page === TeamsPages.ItSupport ? 'itsup' : page}_test.html`, html);

  return html;
}

export const getTeamTableHtml = (html: string): string[] => {
  const matches = html.matchAll(/(<table><tr>\s*<td colspan="1">.*?<td><\/tr><\/table>)/gs);

  const teams: string[] = [];
  
  let match = matches.next();
  while (!match.done) {
    teams.push(match.value[1]);
    match = matches.next();
  }

  return teams;
}

export const getTeamInfoFromTable = (html: string): TeamsTeamInfo => {
  const match = html.match(
    /<td colspan="1"><strong>(.*)<\/strong><\/td><td><strong>(.*)<img (?:.*)><\/strong>.*<a href="mailto:(\w+@\w+\.\w+)">\((\w+)\)<\/a><\/td>/
  );
  if (!match || !match[1])
    throw new Error('Team name could not be scraped');
  
  return {
    name: match[1],
    location: match[2],
    instructer: match[3]
  };
}

export const getEleverFromTable = (html: string) => {
  
}

export const scrapeTeams = () => {}
