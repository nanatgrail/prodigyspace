export interface WaterIntake {
  id: string
  amount: number // in ml
  timestamp: Date
}

export interface PomodoroSession {
  id: string
  type: "work" | "break"
  duration: number // in minutes
  completed: boolean
  startTime: Date
  endTime?: Date
}

export interface Bookmark {
  id: string
  title: string
  url: string
  category: string
  createdAt: Date
}

export interface PomodoroSettings {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  sessionsUntilLongBreak: number
}
