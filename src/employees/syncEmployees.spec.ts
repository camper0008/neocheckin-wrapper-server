import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { TestLogger } from "../logs/TestLogger";
import { syncEmployees } from "./syncEmployees";

it('should synchronize employees', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  const employee = idb.employees[0];
  await syncEmployees(db,idb, logger);
  expect((await db.getEmployee(employee.id)).name).toEqual(employee.name);
});

it('should update existing', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  const employee = Object.assign({}, idb.employees[0]);
  await syncEmployees(db,idb, logger);
  idb.employees[0].name = 'Soelberg'
  await syncEmployees(db,idb, logger);
  expect((await db.getEmployee(employee.id)).name).toEqual('Soelberg');
});
