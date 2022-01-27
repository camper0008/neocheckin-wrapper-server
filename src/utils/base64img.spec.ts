import { readFile } from "fs/promises";
import { base64FromBinaryString, base64hash } from "./base64img";

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

describe('base64hash', () => {
  const hash1 = base64hash('ZnVja2VkIHlvdXIgbW9t');
  const hash2 = base64hash('SSdkIGp1c3QgbGlrZSB0byBpbnRlcmplY3QgZm9yIGEgbW9tZW50LiBXaGF0IHlvdSdyZSByZWZlcnJpbmcgdG8gYXMgTGludXgsIGlzIGluIGZhY3QsIEdOVS9MaW51eCwgb3IgYXMgSSd2ZSByZWNlbnRseSB0YWtlbiB0byBjYWxsaW5nIGl0LCBHTlUgcGx1cyBMaW51eC4=');
  expect(hash1).not.toBe(hash2);
});
