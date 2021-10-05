import { readFile } from 'fs/promises';
import { getTeamInfoFromTable, getTeamsHtml, getTeamTableHtml, scrapeTeams } from './teams'

const readSampleTeamsProHtml = async () => {
  const html = (await readFile('./samples/teams_pro_test.html')).toString();
  return html;
}

describe('teams', () => {

  it('should return an array with a length of 6', async () => {
    expect(getTeamTableHtml(await readSampleTeamsProHtml()).length).toBe(6);
  });

  it('should return the contents', () => {
    const html = '<table><tr>  <td colspan="1">this is the contents<td></tr></table>';
    expect(getTeamTableHtml(html)[0]).toBe(html);
  });

  it('should return "Team 21"', async () => {
    const teamTable = getTeamTableHtml(await readSampleTeamsProHtml())[0];
    expect(getTeamInfoFromTable(teamTable).name).toBe('Team 21');
  });

});
