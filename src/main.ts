import { config } from 'dotenv';
import { api } from './api/api';
import { MemoryDB } from './database/MemoryDB';
import { MockInstrukdb } from './instrukdb/MockInstrukdb';


const main = async () => {
  config();
  const db = new MemoryDB();
  const idb = new MockInstrukdb();
  await api(db, idb);
}

main().catch(error => console.error(error));
