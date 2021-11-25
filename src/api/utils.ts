import { Router, Request, Response } from "express";
import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";

export interface Respondable {
  data?: any,
  error?: string,
}

export type Handle<ReqBody = any, ResBody = Respondable> = (db: Database, idb: Instrukdb.API, logger?: Logger) => 
  (req: Request<undefined, ResBody, ReqBody>, res: Response<ResBody>) => Promise<any>;

