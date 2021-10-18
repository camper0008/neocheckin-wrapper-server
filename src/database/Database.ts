import { CheckTask } from "../models/CheckTask";

export abstract class Database {

  public abstract getUniqueTaskId: () => Promise<number>;
  
  public abstract getCheckTaskCount: () => Promise<number>;
  public abstract insertCheckTask: (task: CheckTask) => Promise<CheckTask>;

}
