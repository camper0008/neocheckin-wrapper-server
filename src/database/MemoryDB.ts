import { CheckTask } from "../models/CheckTask";
import { Database } from "./Database";

export class MemoryDB extends Database {

  private idCounter: {[key: string]: number} = {};
  private checkInTasks: CheckTask[] = [];

  public constructor () {
    super ();
    this.idCounter['tasks'] = 0;
  }

  public getUniqueTaskId = async (): Promise<number> => {
    return this.idCounter['tasks']++;
  }

  public getCheckTaskCount = async (): Promise<number> => {
    return this.checkInTasks.length;
  }

  public insertCheckTask = async (task: CheckTask): Promise<CheckTask> => {
    for (let i in this.checkInTasks)
      if (this.checkInTasks[i].id === task.id)
        throw new Error('id must be unique');
    this.checkInTasks.push(task);
    return task;
  };

  // because `super.<func>` no worky worky in jest
  protected getUniqueTaskId_ = this.getUniqueTaskId;
  protected getCheckInTaskCount_ = this.getCheckTaskCount;
  protected insertCheckInTask_ = this.insertCheckTask;

}
