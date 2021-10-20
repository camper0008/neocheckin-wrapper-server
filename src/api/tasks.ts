import { Router, Request, Response } from "express";
import { Database } from "../database/Database";
import { Task } from "../models/Task";
import { getTaskTypes } from "../tasks/getTasks";
import { Respondable, Handle } from "./utils";

// TODO implement error state

export interface GetTypesRes extends Respondable {
  data?: Task[],
  error?: string,
}

export const getTypesHandle: Handle<undefined, GetTypesRes> = (db) => async (req, res) => {
  try {
    res.json({data: await getTaskTypes(db)}).status(200);
  } catch (catched) {
    res.json({error: 'server error'}).status(500);
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

// TODO implement tasks/addTasks
export const postAddHandle: Handle<PostAddReq> = (db) => async (req, res) => {
  try {
  } catch (catched) {
    res.json({error: 'server error'}).status(500);
    console.error(catched);
  }
}

export const tasksRoutes = (router: Router, db: Database): Router => {

  router.get('/types', getTypesHandle(db));

  router.post('/add', postAddHandle(db));

  return router;
}

