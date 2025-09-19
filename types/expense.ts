export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
  createdAt: number
}

export type ExpenseCategory = "food" | "travel" | "study" | "entertainment" | "health" | "other"

export interface Budget {
  category: ExpenseCategory
  limit: number
  spent: number
}

export interface ExpenseStats {
  totalSpent: number
  budgetRemaining: number
  categoryBreakdown: Record<ExpenseCategory, number>
  weeklySpending: number[]
}
