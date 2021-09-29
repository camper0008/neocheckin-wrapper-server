
export interface Elev {
  id: number,
  name: string,
  department: string,
  flex: FlexTime,
  vacation: Vacation,
}

export interface FlexTime {
  secondsTotal: number,
  isNegative: boolean,
  
  minutesPartial: number,
  hoursPartial: number,
}

export interface Vacation {
  used: number,
  planned: number,
  left: number,
}
