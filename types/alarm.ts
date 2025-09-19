export interface Alarm {
  id: string
  title: string
  description?: string
  time: string // HH:MM format
  days: AlarmDay[]
  isActive: boolean
  soundUrl?: string
  createdAt: number
  updatedAt: number
}

export type AlarmDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export interface Reminder {
  id: string
  title: string
  description?: string
  dateTime: string // ISO string
  isActive: boolean
  isRecurring: boolean
  recurringType?: "daily" | "weekly" | "monthly"
  soundUrl?: string
  createdAt: number
  updatedAt: number
}

export interface NotificationPermission {
  granted: boolean
  requested: boolean
}
