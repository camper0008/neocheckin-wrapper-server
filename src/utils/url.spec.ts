import { insureUrlPathEnd } from './url';

it('should add / to the end', () => {
  expect(insureUrlPathEnd('https://instrukdb/api')).toBe('https://instrukdb/api/');
});

it('should add not / to the end', () => {
  expect(insureUrlPathEnd('https://instrukdb/api/')).toBe('https://instrukdb/api/');
});
