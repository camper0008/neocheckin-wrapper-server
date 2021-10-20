import { Router, Request, Response } from "express";
import { Database } from "../database/Database";

export interface Respondable {
  data?: any,
  error?: string,
}

// TODO determine behavor of `type N<T = K> = I<T>; N<any> and N<undefined>;` what is T in I<T>
export type Handle<ReqBody = any, ResBody = Respondable> = (db: Database) => 
  (req: Request<undefined, ResBody, ReqBody>, res: Response<ResBody>) => Promise<any>;

