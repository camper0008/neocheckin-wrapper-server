import axios from "axios";
import https from "https";
import { Elev, FlexTime } from "../models/Elev";
import { flexTimeFromString } from "../utils/flexTime";
import { clearSpaceBefore, clearAttributes, getForms, getRows } from "../utils/htmlScrapers";

export const getFormName = (row: string)     => row.match(/(?:<b>(?<name>.*?)<\/b>)/s)?.groups ?? {};
export const getCells = (row: string) => {
  return row.match(
    new RegExp(
      '<td>.*?<a>(?<name>.*)</a>.*</td>.*?'
      + '<td>.*?<font>(?<flex>\\-?\\d+:\\d+)</font>.*</td>.*?'
      + '<td>.*?Brugt:(?<vacUsed>\\-?\\d+).*?Planlagt:(?<vacPlanned>\\-?\\d+).*?Tilgode:.*?<font>.*?(?<vacLeft>\\-?\\d+).*?</font>.*?</td>'
    , 's')
  )?.groups ?? {};
}

export const scrapeElevOversigt = (html: string) => {
  const students: Elev[] = [];

  html = clearSpaceBefore(html);
  html = clearAttributes(html);

  const forms = getForms(html) ?? [];
  for (let i = 0; i < forms.length; ++i) {
    const rows = getRows(forms[i]) ?? [];

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
            id: 0,
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

  return students;
}

export const getElevOversigtHtml = async () => {
  try {
    const result = (await axios.get('https://instrukdb/elev_oversigt.html', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    }));

    const data = result.data;
  
    if (typeof data !== 'string')
      throw new Error('could not fetch elev_oversigt.html')
  
    return data as string;

  } catch(err: any) {
    console.error(err.toString());
  }
}
