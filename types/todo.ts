export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  category: TodoCategory
  priority: TodoPriority
  dueDate?: string
  createdAt: number
  updatedAt: number
}

export type TodoCategory = "study" | "personal" | "assignments" | "projects" | "other"

export type TodoPriority = "low" | "medium" | "high"

export interface TodoStats {
  total: number
  completed: number
  pending: number
  overdue: number
  todayTasks: number
  categoryBreakdown: Record<TodoCategory, number>
}
