
export interface TimeStamp {
  hour: number,
  minute: number,
  second: number
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

export interface Schedule {
  from: TimeStamp,
  to: TimeStamp,
  days: WeekSchedule,
}

export interface TaskType {
  id: number,
  name: string,
  description: string,
  priority: boolean,
  instrukdbCheckinId: number | null,
  instrukdbCheckinName: string,
  schedule: Schedule,
}
