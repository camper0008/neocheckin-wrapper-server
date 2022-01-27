import { MockMemoryDB } from "../database/MockMemoryDB";
import { syncEmployees } from "../employees/syncEmployees";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { TestLogger } from "../logs/TestLogger";
import { downloadProfilePictures } from "./downloadProfilePictures";

it('should download images for all employees', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  await syncEmployees(db, idb, logger);
  const pps = await downloadProfilePictures(db, idb, logger);
  expect(pps.length).toBe(idb.employees.length);
});
