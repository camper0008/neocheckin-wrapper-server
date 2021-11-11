import { config } from 'dotenv';
import { api } from './api/api';
import { MemoryDB } from './database/MemoryDB';
import { Instrukdb } from './instrukdb/Instrukdb';
import { InstrukdbClient } from './instrukdb/InstrukdbClient';
import { MockInstrukdb } from './instrukdb/MockInstrukdb';
import { TaskRunner } from './tasks/TaskRunner';
import { synchronizeTaskTypes } from './tasks/taskTypes';

class TestInstrukdbClient extends InstrukdbClient {
  public async postCheckin(req: Instrukdb.PostCheckinRequest) {
    if (!/^test-/.test(req.option))
      throw new Error('FATAL: expected option to match "/^test-/" prefix in testing');
    return super.postCheckin(req)
  }
}

const main = async () => {
  config();
  const db = new MemoryDB();
  const idb = new TestInstrukdbClient('AivlHRlOSZgbOIoD8ja37TQTGKB6ijhYTpsyhSO1UUDaKOGApGMVPCqtnSxb4hWO');
  const taskrunner = new TaskRunner(db, idb, 'test-');
  taskrunner.startInterval();
  await synchronizeTaskTypes(db, idb);
  await api(db, idb);
}

main().catch(error => console.error(error));
