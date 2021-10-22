import { Router, Request, Response } from "express";
import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";

export interface Respondable {
  data?: any,
  error?: string,
}

// TODO determine behavor of `type N<T = K> = I<T>; N<any> and N<undefined>;` what is T in I<T>
export type Handle<ReqBody = any, ResBody = Respondable> = (db: Database, idb: Instrukdb.API) => 
  (req: Request<undefined, ResBody, ReqBody>, res: Response<ResBody>) => Promise<any>;

