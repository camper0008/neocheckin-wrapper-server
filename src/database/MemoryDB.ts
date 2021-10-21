import { LoggedError } from "../models/LoggedError";
import { Task } from "../models/Task";
import { TaskType } from "../models/TaskType";
import { Database } from "./Database";

export class MemoryDB extends Database {

  private idCounter: {[key: string]: number} = {};
  private tasks: Task[] = [];
  private taskTypes: TaskType[] = [];
  private errors: LoggedError[] = [];

  public constructor () {
    super ();
    this.idCounter['tasks'] = 0;
    this.idCounter['errors'] = 0;
  }

  public async getUniqueTaskId(): Promise<number> {
    return this.idCounter['tasks']++;
  }

  public async getUniqueErrorId(): Promise<number> {
    return this.idCounter['errors']++;
  }



  public async getTaskCount(): Promise<number> {
    return this.tasks.length;
  }

  public async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  public async insertTask(task: Task): Promise<Task> {
    for (let i in this.tasks)
      if (this.tasks[i].id === task.id)
        throw new Error('id must be unique');
    this.tasks.push(task);
    return task;
  };



  public async getTaskType(id: number): Promise<TaskType> {
    for (let i in this.taskTypes)
      if (this.taskTypes[i].id === id)
        return this.taskTypes[i];
    throw new Error('not found');
  }

  public async getTaskTypes(): Promise<TaskType[]> {
    return this.taskTypes;
  }
  
  public async replaceTaskTypes(taskTypes: TaskType[]): Promise<number> {
    this.taskTypes = taskTypes;
    return taskTypes.length;
  }



  public async getErrorCount(): Promise<number> {
    return this.errors.length;
  }

  public async getErrors(): Promise<LoggedError[]> {
    return this.errors;
  }

  public async insertError(error: LoggedError): Promise<LoggedError> {
    for (let i in this.errors)
      if (this.errors[i].id === error.id)
        throw new Error('id must be unique');
    this.errors.push(error);
    return error;
  }


}
