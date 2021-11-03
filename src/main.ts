import { config } from 'dotenv';
import { api } from './api/api';
import { MemoryDB } from './database/MemoryDB';
import { Instrukdb } from './instrukdb/Instrukdb';
import { InstrukdbClient } from './instrukdb/InstrukdbClient';
import { MockInstrukdb } from './instrukdb/MockInstrukdb';
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
  const idb = new TestInstrukdbClient('https://instrukdb/', 'AivlHRlOSZgbOIoD8ja37TQTGKB6ijhYTpsyhSO1UUDaKOGApGMVPCqtnSxb4hWO');
  await synchronizeTaskTypes(db, idb);
  await api(db, idb);
}

main().catch(error => console.error(error));
