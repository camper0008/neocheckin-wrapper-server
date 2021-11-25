import { LogItem, LogStatus } from "./LogItem"


describe('LogItem.toString', () => {
  it('should return in proper format', async () => {
    const item = new LogItem("test_success_sender", LogStatus.success, "test_success_message");

    const expected = item.getTimestamp() + '\n'
    + item.getSender() + '\n'
    + item.getStatus() + '\n'
    + item.getMessage();

    expect(item.toString()).toBe(expected);
  });

  it('should include log status', async () => {
    const item = new LogItem("test_error_sender", LogStatus.error, "test_error_message");

    const expected = item.getTimestamp() + '\n'
    + item.getSender() + '\n'
    + item.getStatus() + '\n'
    + item.getMessage();

    expect(item.toString()).toBe(expected);
  });
});