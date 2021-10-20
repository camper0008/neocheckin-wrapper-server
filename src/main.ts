import { config } from 'dotenv';
import { api } from './api/api';
import { MemoryDB } from './database/MemoryDB';


const main = async () => {
  config();
  const db = new MemoryDB();
  await api(db);
}

main().catch(error => console.error(error));
