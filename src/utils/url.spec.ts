import { insureUrlPathEnd, paramString } from './url';

describe('insureUrlPathEnd', () => {

  it('should add / to the end', () => {
    expect(insureUrlPathEnd('https://instrukdb/api')).toBe('https://instrukdb/api/');
  });
  
  it('should add not / to the end', () => {
    expect(insureUrlPathEnd('https://instrukdb/api/')).toBe('https://instrukdb/api/');
  });

});

describe('paramString', () => {

  it('should return empty', () => {
    expect(paramString({})).toBe('');
  });

  it('should return data as param string', () => {
    const data = {name: 'foo'};
    expect(paramString(data)).toBe('?name=foo');
  });

});
