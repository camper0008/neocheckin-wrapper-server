import { Router, Request, Response } from "express";
import { Database } from "../database/Database";
import { InstrukdbClient } from "../instrukdb/InstrukdbClient";
import { MockInstrukdb } from "../instrukdb/MockInstrukdb";
import { Task } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { addTask } from "../tasks/addTasks";
import { getTaskTypes } from "../tasks/taskTypes";
import { Respondable, Handle } from "./utils";

// TODO implement error state

export interface GetTypesRes extends Respondable {
  data?: TaskType[],
  error?: string,
}

export const getTypesHandle: Handle<undefined, GetTypesRes> = (db) => async (req, res) => {
  try {
    const instrukdb = new MockInstrukdb();
    res.status(200).json({data: await getTaskTypes(db, instrukdb)});
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
}

export interface PostAddReq {
  taskId: number,
  name: string,
  employeeRfid: string,
  highLevelApiKey: string,
  systemIdentifier: string,
  timestamp: string,
}

export const postAddHandle: Handle<PostAddReq> = (db) => 
async (req, res) => {
  try {
    const {
      name,
      taskId,
      employeeRfid,
      highLevelApiKey,
      systemIdentifier,
      timestamp,
    } = req.body;
    const result = await addTask({
      name,
      taskId,
      employeeRfid,
      highLevelApiKey,
      systemIdentifier,
      date: timestamp ? new Date(timestamp) : undefined,
    }, db);
    return res.status(200).json({data: result});
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
}

export const tasksRoutes = (router: Router, db: Database): Router => {

  router.get('/types', getTypesHandle(db));

  router.post('/add', postAddHandle(db));

  return router;
}

