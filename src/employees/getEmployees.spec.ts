import { MockMemoryDB } from "../database/MockMemoryDB";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { TestLogger } from "../logs/TestLogger";
import { Employee } from "../models/Employee";

it('should return employees from database', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  const employee: Employee = {id: 42069, department: 'qwerty', flex: 42069, name: 'Sole Olberg', rfid: '4206942069', working: false};
  await db.insertEmployee(employee);
  expect(await db.getEmployees()).toEqual([employee]);
});

it('should return with right image', async () => {
  const [db, idb, logger] = [new MockMemoryDB(), new MockInstrukdb(), new TestLogger()];
  const employee: Employee = {id: 42069, department: 'qwerty', flex: 42069, name: 'Sole Olberg', rfid: '4206942069', working: false};
  await db.insertEmployee(employee);
  expect(await db.getEmployees()).toEqual([employee]);
});
