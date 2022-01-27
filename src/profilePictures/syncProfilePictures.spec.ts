import { MockMemoryDB } from "../database/MockMemoryDB";
import { syncEmployees } from "../employees/syncEmployees";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { TestLogger } from "../logs/TestLogger";
import { downloadProfilePictures } from "./downloadProfilePictures";
import { syncProfilePictures } from "./syncProfilePictures";

it('should download images for all employees', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  await syncEmployees(db, idb, logger);
  await syncProfilePictures(db, idb, logger);
  expect((await db.getProfilePictureByEmployeeId(idb.employees[0].id)).id).toBe(0);
});
