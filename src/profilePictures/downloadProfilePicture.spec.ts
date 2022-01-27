import { MockMemoryDB } from "../database/MockMemoryDB";
import { syncEmployees } from "../employees/syncEmployees";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { TestLogger } from "../logs/TestLogger";
import { downloadProfilePicture } from "./downloadProfilePicture";
import { downloadProfilePictures } from "./downloadProfilePictures";
import { syncProfilePictures } from "./syncProfilePictures";

it('should contain employee id', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  await syncEmployees(db, idb, logger);
  await syncProfilePictures(db, idb, logger);
  const pp = await downloadProfilePicture(idb.employees[0].id, db, idb, logger);
  expect(await (await db.getProfilePictureByEmployeeId(pp.employeeId)).employeeId).toBe(idb.employees[0].id);
});
