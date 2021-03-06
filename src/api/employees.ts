import { Router } from "express";
import { Database } from "../database/Database";
import { downloadEmployees, downloadEmployeesWithImages } from "../employees/downloadEmployees";
import { getEmployees, getEmployeesWithImages } from "../employees/getEmployees";
import { syncEmployees } from "../employees/syncEmployees";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { InstrukdbClient } from "../instrukdb/InstrukdbClient";
import { Employee } from "../models/Employee";
import { syncProfilePictures } from "../profilePictures/syncProfilePictures";
import { Handle, Respondable } from "./utils";



export interface GetEmployeesSyncRes extends Respondable {
  data?: {
    name: string,
    flex: number,
    working: boolean,
    department: string,
    rfid: string,
  }[],
}

export const getEmployeesSyncHandle: Handle<any, GetEmployeesSyncRes> = (db: Database, idb: Instrukdb.API) =>
async (req, res) => {
  try {
    await syncEmployees(db, idb);
    await syncProfilePictures(db, idb);
    res.status(200).json({data: (await getEmployees(db, idb)).map(e => ({...e, rfid: e.rfid.toString()}))});
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
}

export interface GetEmployeesAllRes extends Respondable {
  data?: (Omit<Employee, 'rfid'> & {photo: string, rfid: string})[],
}

export const getEmployeesAllHandle: Handle<any, GetEmployeesAllRes> = (db: Database, idb: Instrukdb.API) =>
async (req, res) => {
  try {
    await syncEmployees(db, idb);
    await syncProfilePictures(db, idb);
    res.status(200).json({data: (await getEmployeesWithImages(db, idb))});
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
}

export const employeesRoutes = (router: Router, db: Database, idb: Instrukdb.API) => {

  router.get('/sync', getEmployeesSyncHandle(db, idb));
  router.get('/all', getEmployeesAllHandle(db, idb));

  return router;
}
