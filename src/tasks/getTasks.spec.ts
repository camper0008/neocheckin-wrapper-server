import { MockMemoryDB } from "../database/MockMemoryDB";
import { getTaskTypes } from "./getTasks";

describe('getTaskTypes', () => {

  it('should call db.getTasks once', async () => {
    const db = new MockMemoryDB();
    await getTaskTypes(db);
    expect(db.getTasksCalls).toBe(1);
  });

});
