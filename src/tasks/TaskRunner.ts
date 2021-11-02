import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task, TaskStatus } from "../models/Task";


export class TaskRunner {

  private db: Database;
  private idb: Instrukdb.API;

  public constructor (db: Database, idb: Instrukdb.API) {
    this.db = db;
    this.idb = idb;
  }

  public async run(task: Task) {
    
  }

}
