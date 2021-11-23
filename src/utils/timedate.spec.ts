import { formatFileFriendly } from "./timedate";

it('should format time and date', () => {
  const date = new Date('2021-11-23T14:48:19.796Z')
  expect(formatFileFriendly(date)).toBe(`2021-11-23_14-48-19`)
});
