import { Router } from "express";
import { Database } from "../database/Database";
import { getEmployeesWithRfid, removeEmployeesWithoutRfid, removeEmployeesWithRfid } from "../employees/getEmployees";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Handle, Respondable } from "./utils";

export interface GetEmployeesAllRes extends Respondable {
  data?: {
    rfid: string,
    name: string,
    flex: number,
    working: boolean,
    department: string,
    photo: string,
  }[],
  employeesWithoutRfid?: {
    name: string,
    flex: number,
    working: boolean,
    department: string,
    photo: string,
  }[]
}

export const getEmployeesAllHandle: Handle<any, GetEmployeesAllRes> = (db: Database, idb: Instrukdb.API) =>
async (req, res) => {
  try {
    const employees = await getEmployeesWithRfid(db, idb);
    const employeesWithRfid = removeEmployeesWithoutRfid(employees);
    const employeesWithoutRfid = removeEmployeesWithRfid(employees);
    res.status(200).json({
      data: employeesWithRfid.map((e) => ({...e, rfid: e.rfid!})),
      employeesWithoutRfid
    });
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
}

export const employeesRoutes = (router: Router, db: Database, idb: Instrukdb.API) => {



  return router;
}
