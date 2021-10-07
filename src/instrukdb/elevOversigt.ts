import axios from "axios";
import { Agent as HttpsAgent } from "https";
import { Employee, FlexTime, Vacation } from "../models/Employee";
import { flexTimeFromString } from "../utils/timeUtils";
import { clearSpaceBefore, clearAttributes, getForms, getRows } from "../utils/htmlScrapers";
import { readFile, writeFile } from "fs/promises";

export interface ElevOversigtEmployeeScrape {
  id: number,
  name: string,
  department: string,
  flex: FlexTime,
  vacation: Vacation,
}

export const getFormName = (row: string) => row.match(/(?:<b>(?<name>.*?)<\/b>)/s)?.groups ?? {};

export const getCells = (row: string) => {
  return row.match(
    new RegExp(
      '<td>.*?<a>(?<name>.*)</a>.*</td>.*?'
      + '<td>.*?<font>(?<flex>\\-?\\d+:\\d+)</font>.*</td>.*?'
      + '<td>.*?Brugt:(?<vacUsed>\\-?\\d+).*?Planlagt:(?<vacPlanned>\\-?\\d+).*?Tilgode:.*?<font>.*?(?<vacLeft>\\-?\\d+).*?</font>.*?</td>'
    , 's')
  )?.groups ?? {};
}

export const getElevId = (nonModHtml: string, name: string) => {
  const result = nonModHtml.match(new RegExp(`<a.*?href="elev_visning\\.php\\?elevid=(?<id>\\d+)">${'\\' + name}.*?</a>`, 's'));
  if (result === null || typeof result.groups === undefined)
    throw new Error(`Could not scrape id of Elev: '${name}', #0`);
  const idString = result.groups!['id'];
  if (typeof idString !== 'string' || idString.length === 0)
    throw new Error(`Could not scrape id of Elev: '${name}', #1`);
  const id = parseInt(idString);
  if (typeof id !== 'number' || id === 0)
    throw new Error(`Could not scrape id of Elev: '${name}', #2`);
  return id;
}

const getRowDetails = (rows: RegExpMatchArray, students: ElevOversigtEmployeeScrape[], html: string) => {
  let department: string | null = null;
    for (let j = 0; j < rows.length; ++j) {
      if (j === 0) {
        const name = getFormName(rows[j]).name;
        if (name) {
          department = name.replace('\n', ' ');
        }
      } else {
        const cellValues = getCells(rows[j]);
        if (cellValues.name && department !== null) {
          students.push({
            id: getElevId(html, cellValues.name),
            department: department,
            name: cellValues.name,
            flex: flexTimeFromString(cellValues.flex),
            vacation: {
              planned: parseInt(cellValues.vacPlanned),
              left: parseInt(cellValues.vacLeft),
              used: parseInt(cellValues.vacUsed),
            }
          })
        }
      }
    }
}

export const scrapeElevOversigt = (html: string) => {
  const students: ElevOversigtEmployeeScrape[] = [];

  let htmlMod = clearSpaceBefore(html);
  htmlMod = clearAttributes(htmlMod);

  const forms = getForms(htmlMod) ?? [];
  for (let i = 0; i < forms.length; ++i) {
    const rows = getRows(forms[i]) ?? [];
    getRowDetails(rows, students, html);
  }

  return students;
}

export const getElevOversigtHtml = async () => {
  try {
    const result = (await axios.get('https://instrukdb/elev_oversigt.html', {
      httpsAgent: new HttpsAgent({ rejectUnauthorized: false })
    }));

    const data = result.data;
  
    if (typeof data !== 'string')
      throw new Error('could not fetch elev_oversigt.html')
  
    return data as string;

  } catch(err: any) {
    console.error(err.toString());
  }
}

export const makeElevOversigtSampleData = async () => {
  const html = await readFile('./samples/elev_oversigt_test.html');
  await writeFile('./samples/elev_oversigt_test.json', JSON.stringify(scrapeElevOversigt(html.toString())));
}

