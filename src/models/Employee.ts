

export interface Time {
  secondsTotal: number,
    
  minutesPartial: number,
  hoursPartial: number,
}

export interface FlexTime extends Time {
  isNegative: boolean,
  srcString: string,
}


export interface Vacation {
  used: number,
  planned: number,
  left: number,
}

export interface Employee {
  id: number,
  name: string,
  department: string,
  teamId: number,
  flex: FlexTime,
  vacation: Vacation,
  workTimeString: string,
  location: string,
  projectName: string,
  nameShort: string,
  locationShort: string,
}
