export interface Task {
  id: string
  title: string
  description?: string
  category: "assignment" | "study" | "exam" | "project" | "personal" | "reading"
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in-progress" | "completed" | "cancelled"
  dueDate?: Date
  estimatedTime?: number // in minutes
  actualTime?: number // in minutes
  tags: string[]
  subtasks: Subtask[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  reminders: Reminder[]
  course?: string
  professor?: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

export interface Reminder {
  id: string
  type: "notification" | "email"
  time: Date
  message: string
  sent: boolean
}

export interface StudySession {
  id: string
  taskId?: string
  subject: string
  topic: string
  duration: number // in minutes
  startTime: Date
  endTime: Date
  technique: "pomodoro" | "time-blocking" | "active-recall" | "spaced-repetition"
  productivity: 1 | 2 | 3 | 4 | 5
  notes?: string
  distractions: number
}

export interface StudyPlan {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  subjects: StudySubject[]
  totalHours: number
  completedHours: number
  isActive: boolean
}

export interface StudySubject {
  id: string
  name: string
  color: string
  allocatedHours: number
  completedHours: number
  topics: StudyTopic[]
}

export interface StudyTopic {
  id: string
  name: string
  estimatedHours: number
  completedHours: number
  priority: "low" | "medium" | "high"
  status: "not-started" | "in-progress" | "completed"
  resources: string[]
}

export interface Assignment {
  id: string
  title: string
  course: string
  professor: string
  type: "essay" | "problem-set" | "project" | "presentation" | "exam" | "quiz" | "lab"
  dueDate: Date
  submissionMethod: "online" | "in-person" | "email"
  status: "not-started" | "in-progress" | "completed" | "submitted" | "graded"
  priority: "low" | "medium" | "high" | "urgent"
  estimatedHours: number
  actualHours: number
  grade?: string
  feedback?: string
  requirements: string[]
  resources: string[]
  createdAt: Date
}
