import { clearAttributes, clearSpaceBefore, getForms, getRows } from './htmlScrapers';

describe('htmlScrapers', () => {

  it('should clear whitespace at the start of an non-strict html string', () => {
    const html = '    <div></div>';
    expect(clearSpaceBefore(html)).toBe('<div></div>');
  });

  it('should return empty string', () => {
    const html = '';
    expect(clearSpaceBefore(html)).toBe('');
  })

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

  it('should have length of 14', async () => {
    const html = /*html*/ `
      <table>
        <tr>
          <td></td>
        </tr>
        <tr>
          <td></td>
        </tr>
      </table>
    `;
    expect(getRows(html)!.length).toBe(2);
  });

  it('should return content of a row', async () => {
    const html = /*html*/ `
      <table>
        <tr>
          <td>
            <h1>Hello world</h1>
          </td>
        </tr>
        <tr>
          <td></td>
        </tr>
      </table>
    `;
    expect(getRows(html)![0].trim().replace(/\s+/g, '')).toBe(/*html*/ `
      <tr>
        <td>
          <h1>Hello world</h1>
        </td>
      </tr>
    `.trim().replace(/\s+/g, ''));
  });

});

