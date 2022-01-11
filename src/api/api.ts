import cors from 'cors';
import express, { json, Router, urlencoded } from 'express';
import { Database } from '../database/Database';
import { Instrukdb } from '../instrukdb/Instrukdb';
import { Logger } from '../logs/Logger';
import { getApiToken } from '../utils/env';
import { employeesRoutes } from './employees';
import { jsonError } from './jsonError';
import { serveHttp, serveHttps } from './servers';
import { tasksRoutes } from './tasks';
import { tokenAuth } from './tokenAuth';

export const api = async (db: Database, idb: Instrukdb.API, logger: Logger) => {
  const app = express();

  app.use(cors());
  app.use(json());
  app.use(urlencoded({extended: true}));
  app.use(tokenAuth(getApiToken()));
  app.use(jsonError());

  app.use('/api/tasks', tasksRoutes(Router(), db, idb, logger));
  app.use('/api/employees', employeesRoutes(Router(), db, idb));

  app.use('/', express.static('./public'));

  serveHttp(app);
  serveHttps(app);
}
