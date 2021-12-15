import { config } from 'dotenv';
import { api } from './api/api';
import { MemoryDB } from './database/MemoryDB';
import { InstrukdbClient } from './instrukdb/InstrukdbClient';
import { FileLogger } from './logs/FileLogger';
import { synchronizeTaskTypesWithSample } from './tasks/taskTypes';
import { getInstrukdbUrl } from './utils/env';

const main = async () => {
  config();
  const db = new MemoryDB();
  const idb = new InstrukdbClient(getInstrukdbUrl(), 'AivlHRlOSZgbOIoD8ja37TQTGKB6ijhYTpsyhSO1UUDaKOGApGMVPCqtnSxb4hWO');
  await synchronizeTaskTypesWithSample(db, idb);
  const logger = new FileLogger();
  await api(db, idb, logger);
}

main().catch(error => console.error(error));
