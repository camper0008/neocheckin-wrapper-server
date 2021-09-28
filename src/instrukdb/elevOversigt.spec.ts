import { readFile, writeFile } from "fs/promises";
import { Elev } from "../models/Elev";
import { clearAttributes, clearSpaceBefore, getForms, getRows } from "../utils/htmlScrapers";
import { getCells, getFormName, scrapeElevOversigt } from "./elevOversigt";

const loadHtmlSample = async () => (await readFile('./samples/test.html')).toString();
const loadSampleData = async () => JSON.parse((await readFile('./samples/test.json')).toString()) as Elev[];

describe('getRows', () => {

  it('should have length of 14', async () => {
    const html = await loadHtmlSample();
    expect(getRows(html)!.length).toBe(14);
  });

  it('should return content of a row', async () => {
    const html = await loadHtmlSample();
    expect(getRows(html)![0].trim().replace(/\s+/g, '')).toBe(/*html*/ `
      <tr>
        <td style="border:1px  solid white;border-color:#4f8da8;margin:0;text-align:center;"><b>IT-SUPPORT</b><br>
          &nbsp</td>
        <td style="border:1px solid white;border-color:#4f8da8;margin:0;text-align:center"><b>FLEX</b><br> &nbsp</td>
        <td style="border:1px solid white;border-color:#4f8da8;margin:0;text-align:center"><b>FERIE</b><br> &nbsp</td>
      </tr>
    `.trim().replace(/\s+/g, ''));
  });

});

describe('getFormName', () => {

  it('should return null', () => {
    expect(getFormName('')).toEqual({});
  });

  it(`should return 'IT-SUPPORT'`, async () => {
    const html = await loadHtmlSample();
    expect(getFormName(html)['name']).toBe('IT-SUPPORT');
  });

});

const getRowHtml = async () => {
  let html = await loadHtmlSample();
  html = clearAttributes(clearSpaceBefore(html));
  return getRows(getForms(html)![0])![1];
}

describe('getCells', () => {

  it(`should return 'Alexander Victor Foli'`, async () => {
    const html = await getRowHtml();
    expect(getCells(html)['name']).toBe('Alexander Victor Foli');
  });

  it(`should return '-02:16'`, async () => {
    const html = await getRowHtml();
    expect(getCells(html)['flex']).toBe('-02:16');
  });

  it('should get vacation', async () => {
    const html = await getRowHtml();
    expect(getCells(html)['vacUsed']).toBe('0');
  });

});

describe('scrapeElevOversigt', () => {

  it('should return empty array', () => {
    expect(scrapeElevOversigt('')).toEqual([]);
  });

  it('should match the sample data', async () => {
    const html = await loadHtmlSample();
    const data = await loadSampleData();
    expect(scrapeElevOversigt(html)).toEqual(data);
  });

});
