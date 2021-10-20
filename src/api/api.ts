import cors from 'cors';
import express, { json, Router, urlencoded } from 'express';
import { join } from 'path';
import { Database } from '../database/Database';
import { serveHttp, serveHttps } from './servers';
import { tasksRoutes } from './tasks';

export const api = async (db: Database) => {
  const app = express();

  app.use(cors());
  app.use(json());
  app.use(urlencoded({extended: true}));

  // TODO implement error state

  app.use('/api/tasks', tasksRoutes(Router(), db));

  app.use('/', express.static(join(__dirname, '../public')));

  serveHttp(app);
  serveHttps(app);
}
