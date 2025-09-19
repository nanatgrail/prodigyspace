export interface StudyGroup {
  id: string
  name: string
  description: string
  subject: string
  members: GroupMember[]
  createdAt: Date
  isActive: boolean
  meetingSchedule?: MeetingSchedule
}

export interface GroupMember {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  joinedAt: Date
  isOnline: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  groupId: string
  status: "planning" | "in-progress" | "review" | "completed"
  dueDate: Date
  createdAt: Date
  tasks: ProjectTask[]
  files: SharedFile[]
}

export interface ProjectTask {
  id: string
  title: string
  description: string
  assignedTo: string[]
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: Date
  createdAt: Date
}

export interface SharedFile {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: Date
  url: string
}

export interface MeetingSchedule {
  id: string
  title: string
  description: string
  date: Date
  duration: number
  location: string
  type: "in-person" | "online"
  participants: string[]
  recurring?: {
    frequency: "weekly" | "biweekly" | "monthly"
    endDate?: Date
  }
}

export interface ChatMessage {
  id: string
  groupId: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "file" | "system"
}
