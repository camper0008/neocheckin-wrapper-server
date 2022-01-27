import { MockMemoryDB } from "../database/MockMemoryDB"
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { TestLogger } from "../logs/TestLogger"
import { addDevEmployee } from "./addDevEmployee";

it('should add "Test Bruger" to database', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  await addDevEmployee(db, idb, logger);
  expect(await db.getEmployee(10000)).toEqual({
    name: 'Test Bruger',
    department: 'EUX',
    flex: 3600,
    id: 10000,
    rfid: '1234567890',
    working: false
  })
});

it('should not add dev user twice', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  await addDevEmployee(db, idb, logger);
  await addDevEmployee(db, idb, logger);
  expect((await db.getEmployees()).length).toBe(1)
})