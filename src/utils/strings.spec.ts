import { padRfid, padString, padStringBehind } from "./strings";


describe('padString', () => {

  it('should a string with the min length', () => {
    expect(padString('abc', 4).length).toBe(4);
  });

  it('should contain the string given', () => {
    expect(padString('abc', 4).slice(0, 3)).toBe('abc');
  });

});

describe('padStringBehind', () => {

  it('should a string with the min length', () => {
    expect(padStringBehind('abc', 4).length).toBe(4);
  });

  it('should contain the string given', () => {
    expect(padStringBehind('abc', 4).slice(1, 4)).toBe('abc');
  });

});

describe('padRfid', () => {

  it('should have length 10', () => {
    expect(padRfid(328257412).length).toBe(10);
  });

  it('should contain the rfid', () => {
    expect(padRfid(328257412).slice(1, 10)).toBe('328257412');
  });

  it('should pad with 0', () => {
    expect(padRfid(328257412).slice(0, 1)).toBe('0');
  })

});


