"use client"

import { useState, useEffect, useCallback } from "react"
import { storage } from "@/lib/storage"
import type { Todo, TodoCategory, TodoPriority, TodoStats } from "@/types/todo"

const TODOS_KEY = "studysync_todos"

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from storage on mount
  useEffect(() => {
    const loadData = () => {
      const savedTodos = storage.getItem<Todo[]>(TODOS_KEY) || []
      setTodos(savedTodos)
      setLoading(false)
    }

    loadData()
  }, [])

  // Save todos to storage whenever they change
  useEffect(() => {
    if (!loading) {
      storage.setItem(TODOS_KEY, todos)
    }
  }, [todos, loading])

  const addTodo = useCallback((todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setTodos((prev) => [newTodo, ...prev])
  }, [])

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates, updatedAt: Date.now() } : todo)))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: Date.now() } : todo)),
    )
  }, [])

  const getTodoStats = useCallback((): TodoStats => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]

    const total = todos.length
    const completed = todos.filter((todo) => todo.completed).length
    const pending = total - completed

    const overdue = todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false
      return todo.dueDate < today
    }).length

    const todayTasks = todos.filter((todo) => {
      if (!todo.dueDate) return false
      return todo.dueDate === today
    }).length

    const categoryBreakdown: Record<TodoCategory, number> = {
      study: 0,
      personal: 0,
      assignments: 0,
      projects: 0,
      other: 0,
    }

    todos.forEach((todo) => {
      categoryBreakdown[todo.category]++
    })

    return {
      total,
      completed,
      pending,
      overdue,
      todayTasks,
      categoryBreakdown,
    }
  }, [todos])

  const getTodosByCategory = useCallback(
    (category: TodoCategory) => {
      return todos.filter((todo) => todo.category === category)
    },
    [todos],
  )

  const getTodosByPriority = useCallback(
    (priority: TodoPriority) => {
      return todos.filter((todo) => todo.priority === priority)
    },
    [todos],
  )

  const getOverdueTodos = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    return todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false
      return todo.dueDate < today
    })
  }, [todos])

  const getTodayTodos = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    return todos.filter((todo) => {
      if (!todo.dueDate) return false
      return todo.dueDate === today
    })
  }, [todos])

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoStats,
    getTodosByCategory,
    getTodosByPriority,
    getOverdueTodos,
    getTodayTodos,
  }
}
