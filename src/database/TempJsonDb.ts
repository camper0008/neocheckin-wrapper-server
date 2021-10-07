import { readFile, writeFile } from "fs/promises";
import { Employee } from "../models/Employee";
import { Database, OperationStatus, SingleOperationResult } from "./Database";

const OBJECT_ID_CHARS = 'abcdefghijklmnopqrtstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const generateObjectId = (length: number = 64, chars = OBJECT_ID_CHARS) =>
  ' '.repeat(length).split('').map(_ => chars.charAt(Math.random() * chars.length)).join('');

enum DbCollections {
  EMPLOYEES = 'employees'
}

export class TempJsonDb extends Database {
  
  private filename: string;
  private data: {[key: string]: any};

  private read = async () => {
    try {
      const filetext = await (readFile(this.filename));
      const filedata = JSON.parse(filetext.toString()) as {[key: string]: any};
      this.data = filedata;
    } catch (catched) {
      this.data = {};
      if (!(catched as Error).message.startsWith('ENOENT: no such file or directory'))
        throw catched;
      console.log(`'${this.filename}' not found, creating new`);
      await this.write();
    }
  }
  
  private write = async () => {
    try {
      await writeFile(this.filename, JSON.stringify(this.data, null, 2));
    } catch (catched) {
      throw catched;
    }
  }

  private getCollection = <T = any>(name: string): T[] => {
    if (this.data[name])
      return this.data[name];
    const newCollection: T[] = [];
    this.data[name] = newCollection;
    return newCollection;
  }

  public constructor (filename: string) {
    super();
    this.filename = filename;
    this.data = [];
  }

  public isElevIdValid = async (elev: Employee): Promise<SingleOperationResult<boolean>> => {
    try {
      await this.read();
      const Elever = this.getCollection<Employee>(DbCollections.EMPLOYEES);
      for(let i in Elever)
        if (Elever[i].id === elev.id)
          return {status: OperationStatus.Ok, data: false};
      return {status: OperationStatus.Ok, data: true};
    } catch (catched) {
      if (!(catched instanceof Error))
        return {status: OperationStatus.ServerError, catched};
      return {status: OperationStatus.ServerError, error: (catched as Error), catched};
    }
  }

  public addElev = async (elev: Employee): Promise<SingleOperationResult<{_id: string} & Employee>> => {
    try {
      await this.read();
      const Elever = this.getCollection<Employee>(DbCollections.EMPLOYEES);
      const _id = generateObjectId();
      const toInsert = {_id, ...elev};
      Elever.push(toInsert);
      await this.write();
      return {status: OperationStatus.Ok, data: toInsert};
    } catch (catched) {
      if (!(catched instanceof Error))
        return {status: OperationStatus.ServerError, catched};
      return {status: OperationStatus.ServerError, error: (catched as Error), catched};
    }
  }

  public getElev = async (id: number) => {
    try {
      await this.read();
      const Elever = this.getCollection<Employee>(DbCollections.EMPLOYEES);
      for (let i in Elever)
        if (Elever[i].id === id)
          return {status: OperationStatus.Ok, data: Elever[i]};
      return {status: OperationStatus.Empty};
    } catch (catched) {
      if (!(catched instanceof Error))
        return {status: OperationStatus.ServerError, catched};
      return {status: OperationStatus.ServerError, error: (catched as Error), catched};
    }
  }

}
