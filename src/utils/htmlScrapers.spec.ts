import { readFile } from 'fs/promises';
import { clearAttributes, clearSpaceBefore, getForms, getRows } from './htmlScrapers';

describe('clearWhiteSpace', () => {

  it('should clear whitespace at the start of an non-strict html string', () => {
    const html = '    <div></div>';
    expect(clearSpaceBefore(html)).toBe('<div></div>');
  });

  it('should return empty string', () => {
    const html = '';
    expect(clearSpaceBefore(html)).toBe('');
  })

});

describe('clearAttributes', () => {

  it('should return an attributeless htmlstring', () => {
    const html = '<div color="red"></div>';
    expect(clearAttributes(html)).toBe('<div></div>');
  });

  it('should return an attributeless htmlstring and not error', () => {
    const html = '<div color=red></div>';
    expect(clearAttributes(html)).toBe('<div></div>');
  });

  it('should return only an attributeless opening tag', () => {
    const html = '<div color="red" />';
    expect(clearAttributes(html)).toBe('<div>');
  });

  it('should return an attributeless htmlstring and not error', () => {
    const html = '<br class="a" >';
    expect(clearAttributes(html)).toBe('<br>');
  });

});


describe('getForms', () => {

  it('should not be null', () => {
    const html = '<form></form>';
    expect(getForms(html)).not.toBe(null);
  });

  it('should have length of 1', () => {
    const html = '<form></form>';
    expect(getForms(html)!.length).toBe(1);
  });

  it('should have length of 2', () => {
    const html = '<form></form><form></form>';
    expect(getForms(html)!.length).toBe(2);
  });

  it('should return a RegexpMatchArray', () => {
    const html = '<form></form><form></form>';
    expect(Array.isArray(getForms(html))).toBeTruthy();
  });

  it('should return the form', () => {
    const html = '<form></form>';
    expect(getForms(html)![0]).toBe('<form></form>');
  })

  it('should return 1 form', () => {
    const html = '<form></form></form>';
    expect(getForms(html)![0]).toBe('<form></form>');
  });

  it('should keep the content of the form', () => {
    const html = '<form><h1>Hello, World!</h1></form>';
    expect(getForms(html)![0]).toBe('<form><h1>Hello, World!</h1></form>');
  });

});

describe('getRows', () => {

  it('should have length of 14', async () => {
    const html = (await readFile('./samples/test.html')).toString();
    expect(getRows(html)!.length).toBe(14);
  });

  it('should return content of a row', async () => {
    const html = (await readFile('./samples/test.html')).toString();
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

