import { Router } from "express";
import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Logger } from "../logs/Logger";
import { TaskType } from "../models/TaskType";
import { addTask } from "../tasks/addTasks";
import { getTasks } from "../tasks/getTasks";
import { runTask } from "../tasks/runTask";
import { getTaskTypes } from "../tasks/taskTypes";
import { Handle, Respondable } from "./utils";

export interface GetTypesRes extends Respondable {
  data?: Omit<TaskType, 'instrukdbCheckinId' | 'instrukdbCheckinName'>[],
  error?: string,
}

export const getTypesHandle: Handle<undefined, GetTypesRes> = (db, idb) => 
async (req, res) => {
  try {
    res.status(200).json({data: (await getTaskTypes(db, idb)).map(task => ({
      ...task,
      instrukdbCheckinId: undefined,
      instrukdbCheckinName: undefined,
    }))});
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

export const postAddHandle: Handle<PostAddReq, any> = (db, idb, logger) => 
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
      taskTypeId: taskId,
      employeeRfid,
      highLevelApiKey,
      systemIdentifier,
      systemIp: req.ip,
      date: timestamp ? new Date(timestamp) : undefined,
    }, db, logger);
    await runTask(result, db, idb, logger);
    return res.status(200).json({data: result});
  } catch (catched) {
    res.status(500).json({error: 'server error', errormsg: catched});
    console.error(catched);
  }
}

export const getAll: Handle = (db, idb) =>
async (req, res) => {
  try {
    res.status(200).json({data: (await getTasks(db)).map(task => ({...task, taskId: task.taskTypeId}))});
  } catch (catched) {
    res.status(500).json({error: 'server error'});
    console.error(catched);
  }
};

export const tasksRoutes = (router: Router, db: Database, idb: Instrukdb.API, logger: Logger): Router => {

  router.get('/types', getTypesHandle(db, idb));

  router.post('/add', postAddHandle(db, idb, logger));

  router.get('/all', getAll(db, idb));

  return router;
}

