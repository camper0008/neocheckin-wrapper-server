
export enum States {
  OK,
  INTERNAL,
  CONNECTION,
}

// TODO refactor and implement database

export class State {

  private state: States;

  private lastCatched?: any;
  private lastError?: Error;

  public constructor () {
    this.state = States.OK;
  }

  public getState() {
    return this.state;
  } 

}
