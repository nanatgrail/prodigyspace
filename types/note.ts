export interface StickyNote {
  id: string
  title: string
  content: string
  color: NoteColor
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  createdAt: number
  updatedAt: number
}

export type NoteColor = "yellow" | "blue" | "green" | "pink" | "purple" | "orange"

export interface NotesStats {
  total: number
  colorBreakdown: Record<NoteColor, number>
}
