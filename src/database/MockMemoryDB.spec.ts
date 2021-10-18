import { MockMemoryDB } from "./MockMemoryDB";

describe('getUniqueTaskId', () => {

  it('should count number of calls', async () => {
    const db = new MockMemoryDB();
    await db.getUniqueTaskId();
    await db.getUniqueTaskId();
    await db.getUniqueTaskId();
    expect(db.getUniqueTaskIdCalls).toBe(3);
  });

});
