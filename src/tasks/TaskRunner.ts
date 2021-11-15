import { Database } from "../database/Database";
import { Instrukdb } from "../instrukdb/Instrukdb";
import { Task, TaskStatus } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { getRfidAsNumber } from "../utils/strings";


export class TaskRunner {

  private db: Database;
  private idb: Instrukdb.API;

  private optionPrefix: string;

  private timer?: NodeJS.Timer;
  private intervalMs: number = 500;
  
  public constructor (db: Database, idb: Instrukdb.API, optionPrefix: string = '') {
    this.db = db;
    this.idb = idb;

    this.optionPrefix = optionPrefix;
  }

  public startInterval() {
    this.timer = setInterval(() => {
      this.runAllTasks();
    }, this.intervalMs);
  }

  public stopInterval() {
    if (this.timer)
      clearInterval(this.timer);
    this.timer = undefined;
  }

  public async runAllTasks() {
    const tasks = await this.db.getTasksWithStatus(TaskStatus.WAITING);
    for (let i in tasks)
      await this.run(tasks[i]);
  }

  public async run(task: Task): Promise<void> {
    task.status = TaskStatus.PROCESSING;
    const taskType = await this.getTaskType(task.taskTypeId);
    if (!this.taskTypeExists(taskType))
      return this.fail(task, `could not find task with id '${task.taskTypeId}'`);

    const req = this.getCheckinRequest(task, taskType!);
    const [ok, msg] = await this.tryTosendRequest(req);
    if (!ok)
      return this.fail(task, msg ? 'Instrukdb: ' + msg : 'failed to send request to Instrukdb');
      
    return this.succeed(task);
  }

  private async getTaskType(id: number): Promise<TaskType | null> {
    try {
      return await this.db.getTaskType(id);
    } catch (c) {
      if ((c as Error)?.message === 'not found')
        return null;
      else
        throw c;
    }
  }

  private taskTypeExists = (taskType: TaskType | null) => taskType !== null;

  private getCheckinRequest(task: Task, type: TaskType): Instrukdb.PostCheckinRequest {
    return {
      token:      task.highLevelApiKey,
      option:     this.optionPrefix + type.name,
      timestamp:  task.date.getTime(),
      rfid:       getRfidAsNumber(task.employeeRfid),
      ip:         task.systemIp,
      // details:    'test',
      // HACK
      details: 'beta-eux-1-dato-11-11-2021'
    }
  }

  private async tryTosendRequest(req: Instrukdb.PostCheckinRequest): Promise<[boolean, string?]> {
    
    try {
      const res = await this.idb.postCheckin(req);
      if (res.statusCode === 400)
        return [false, res.message]
      return [true];
    } catch (e) {
      console.error(e);
      return [false];
    }
  }

  private fail(task: Task, msg?: string) {
    task.status = TaskStatus.FAILED;
    task.statusMsg = msg;
  }

  private succeed(task: Task) {
    task.status = TaskStatus.SUCCEEDED;
  }

  public getIntervalTimer() {
    return this.timer;
  }

  public setIntervalMs(ms: number) {
    this.intervalMs = ms;
  }

}
