
export interface TimePoint {
  date: Date,
  hour: number,
  minute: number,
  second: number,
}

export interface WeekSchedule {
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean,
}

export interface ActiveSchedule {
  from: TimePoint,
  to: TimePoint,
  days: WeekSchedule,
}
