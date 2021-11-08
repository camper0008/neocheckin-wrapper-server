import { Router } from "express";
import { Database } from "../database/Database";
import { getAllEmployees } from "../employees/getEmployees";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { InstrukdbClient } from "../instrukdb/InstrukdbClient";
import { Employee } from "../models/Employee";
import { Handle, Respondable } from "./utils";



export interface GetEmployeesAllRes extends Respondable {
  data?: (Omit<Employee, 'rfid'> & {photo: string, rfid: string})[],
}

export const getEmployeesAllHandle: Handle<any, GetEmployeesAllRes> = (db: Database, idb: Instrukdb.API) =>
async (req, res) => {
  try {
    res.status(200).json({data: (await getAllEmployees(db, idb)).map(e => ({...e, rfid: e.rfid.toString()}))});
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
}

export const employeesRoutes = (router: Router, db: Database, idb: Instrukdb.API) => {

  router.get('/all', getEmployeesAllHandle(db, idb));

  return router;
}
