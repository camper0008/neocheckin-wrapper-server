import { Router } from "express";
import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Employee } from "../models/Employee";
import { Handle, Respondable } from "./utils";



export interface GetEmployeesAllRes extends Respondable {
  data?: (Employee & {rfid: string})[],
}

export const getEmployeesAllHandle: Handle<any, GetEmployeesAllRes> = (db: Database, idb: Instrukdb.API) =>
async (req, res) => {
  try {
    throw new Error('not implemented');
    res.status(200).json({});
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
}

export const employeesRoutes = (router: Router, db: Database, idb: Instrukdb.API) => {



  return router;
}
