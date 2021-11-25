export enum LogStatus {
  success = 'success',
  error   = 'success\'nt',
};
  

export class LogItem {
  private timestamp: Date;
  private message:   string;
  private sender:    string;
  private status:    LogStatus;
  
  constructor(sender: string, status: LogStatus, message: string) {
    this.timestamp = new Date()
    this.message = message;
    this.status = status;
    this.sender = sender;
  }
  
  public getTimestamp(): string {
    return this.timestamp.toISOString();
  }

  public getMessage(): string {
    return this.message;
  }
  
  public getSender(): string {
    return this.sender;
  }

  public getStatus(): LogStatus {
    return this.status;
  }
  
  public toString(): string {
    return this.timestamp.toISOString() + '\n'
    + this.sender + '\n'
    + this.status + '\n'
    + this.message;
  }
}