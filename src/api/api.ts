import cors from 'cors';
import express, { json, NextFunction, Request, Response, Router, urlencoded } from 'express';
import { Database } from '../database/Database';
import { Instrukdb } from '../instrukdb/Instrukdb';
import { Logger } from '../logs/Logger';
import { getApiToken } from '../utils/env';
import { employeesRoutes } from './employees';
import { jsonError } from './jsonError';
import { serveHttp } from './servers';
import { tasksRoutes } from './tasks';

export const apiTokenAuth = (apiToken: string) => async (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers['token'] || req.query['token']) as string;
  if (token === apiToken)
    next();
  else
    res.status(400).json({error: 'access denied'})
}

export const api = async (db: Database, idb: Instrukdb.API, logger: Logger) => {
  const app = express();

  app.use(cors());
  app.use(json());
  app.use(urlencoded({extended: true}));
  app.use(apiTokenAuth(getApiToken()));
  app.use(jsonError());

  app.use('/api/tasks', tasksRoutes(Router(), db, idb, logger));
  app.use('/api/employees', employeesRoutes(Router(), db, idb));

  app.use('/', express.static('./public'));

  serveHttp(app);
}
