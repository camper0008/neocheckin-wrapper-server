import { flexTimeFromString } from "./timeUtils";

describe('timeUtils', () => {

  it('should parse a flex time string', () => {
    expect(flexTimeFromString('12:34').secondsTotal).toBe((12 * 60 + 34) * 60);
  });

});
