import { writeFile } from "fs/promises";
import { getElevOversigtHtml, scrapeElevOversigt } from "../instrukdb/elevOversigt";
import { fetchTeamsHtml, scrapeTeams } from "../instrukdb/teams";

export const updateCache = async () => {
  const [
    elevOversigtHtml,
    teamsHtml
  ] = await Promise.all([
    getElevOversigtHtml(),
    fetchTeamsHtml()
  ]);

  const elevOversigtData = scrapeElevOversigt(elevOversigtHtml);
  const teamsData = scrapeTeams(teamsHtml);
  writeFile('./samples/teams_test.json', JSON.stringify(teamsData, null, 2));
}
