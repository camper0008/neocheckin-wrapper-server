import axios from "axios";
import https from "https";
import { Elev, FlexTime } from "../models/Elev";

const clearWhiteSpace = (str: string) => str.replace(/^\s+/gm, '');
const clearAttributes = (str: string) => str.replace(/<(\w+)[\s][^>]+>/g, '<$1>');
const getForms = (str: string)        => str.match(/<form>.*?<\/form>/gs);
const getFormName = (row: string)     => row.match(/(?:<b>(?<name>.*?)<\/b>)/s)?.groups ?? {};
const getRows = (form: string)        => form.match(/<tr>.*?<\/tr>/gs)
const getCells = (row: string)        => row.match(new RegExp(
  '<td>.*?<a>(?<name>.*)</a>.*</td>.*?' +
  '<td>.*?<font>(?<flex>\\-?\\d+:\\d+)</font>.*</td>.*?' +
  '<td>.*?Brugt:(?<vacUsed>\\-?\\d+).*?Planlagt:(?<vacPlanned>\\-?\\d+).*?Tilgode:.*?<font>.*?(?<vacLeft>\\-?\\d+).*?</font>.*?</td>'
, 's')
)?.groups ?? {};

const flexTimeFromString = (flex: string): FlexTime => {
  let [hoursString, minutesString] = [flex.split(':')[0], flex.split(':')[1]];
  
  let isNegative = false;
  if (hoursString.slice(0, 1) === '-') {
    isNegative = true;
    hoursString = hoursString.slice(1);
  }

  const [hoursPartial, minutesPartial] = [parseInt(hoursString), parseInt(minutesString)]
  const secondsTotal = hoursPartial * minutesPartial * 60**3;
  
  return {
    secondsTotal,
    hoursPartial,
    minutesPartial,
    isNegative,
  };
}

export const scrapeElevOversigtHtml = (html: string) => {
  const students: Elev[] = [];

  html = clearWhiteSpace(html);
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

const getElevOversigtHtml = async () => {
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

const elevOversigt = async () => {
  const html = await getElevOversigtHtml();
  if (html) {
    const students = scrapeElevOversigtHtml(html);
    console.log(students);
  }
}

elevOversigt();