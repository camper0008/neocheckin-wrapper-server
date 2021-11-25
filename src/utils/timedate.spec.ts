import { formatFileFriendly, getDateFromDateOrString, getUnixTimestamp } from "./timedate";

describe('formatFileFriendly', () => {
  it('should format time and date', () => {
    const date = new Date('2021-11-23T14:48:19.796Z');
    expect(formatFileFriendly(date)).toBe(`2021-11-23_14-48-19`);
  });
});

describe('getDateFromDateOrString', () => {
  it('should parse and return a date', () => {
    const datestring = '2021-11-24T08:24:13.050Z';
    expect(getDateFromDateOrString(datestring)).toEqual(new Date('2021-11-24T08:24:13.050Z'));
  })

  it('should use givin date', () => {
    const date = new Date();
    expect(getDateFromDateOrString(date)).toEqual(date);
  })

  it('should make a new date', () => {
    const before = new Date();
    const res = getDateFromDateOrString(undefined);
    const after = new Date();
    expect(res.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(res.getTime()).toBeLessThanOrEqual(after.getTime())
  });
});

describe('getUnixTimestamp', () => {
  it('should return unix timestamp in seconds', () => {
    const date = new Date(1637848761000);
    expect(getUnixTimestamp(date)).toBe(1637848761);
  });
})
