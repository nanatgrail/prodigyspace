export interface Note {
  id: string
  title: string
  content: string
  category: "lecture" | "research" | "personal" | "assignment" | "meeting"
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: "image" | "pdf" | "document" | "audio"
  url: string
  size: number
}

export interface ScanDocument {
  id: string
  name: string
  pages: string[]
  createdAt: Date
  category: "textbook" | "handout" | "assignment" | "notes" | "other"
}
