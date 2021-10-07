

export interface Time {
  secondsTotal: number,
    
  minutesPartial: number,
  hoursPartial: number,
}

export interface FlexTime extends Time {
  isNegative: boolean,
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
  flex: FlexTime,
  vacation: Vacation,
}
