import { readFile } from "fs/promises";
import { base64FromBinaryString } from "./base64img";

const pngData = (async () => (await readFile('./samples/employee_1_img.png')).toString())();

describe('base64FromBinaryString', () => {

  it('should return a base64 string', async () => {
    const res = base64FromBinaryString(await pngData);
    expect(res).toMatch(/=$/)
  });

  // https://stackoverflow.com/questions/8571501/how-to-check-whether-a-string-is-base64-encoded-or-not
  it('should match a base64 encoding', async () => {
    const res = base64FromBinaryString(await pngData);
    expect(res).toMatch(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/);
  })

});
