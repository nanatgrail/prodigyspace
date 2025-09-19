"use client"

import { useState, useEffect } from "react"
import type { Task, StudySession, StudyPlan, Assignment } from "@/types/tasks"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    const savedTasks = localStorage.getItem("studysync-tasks")
    const savedSessions = localStorage.getItem("studysync-study-sessions")
    const savedPlans = localStorage.getItem("studysync-study-plans")
    const savedAssignments = localStorage.getItem("studysync-assignments")

    if (savedTasks) {
      setTasks(
        JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          subtasks: task.subtasks.map((subtask: any) => ({
            ...subtask,
            createdAt: new Date(subtask.createdAt),
          })),
          reminders: task.reminders.map((reminder: any) => ({
            ...reminder,
            time: new Date(reminder.time),
          })),
        })),
      )
    }

    if (savedSessions) {
      setStudySessions(
        JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
        })),
      )
    }

    if (savedPlans) {
      setStudyPlans(
        JSON.parse(savedPlans).map((plan: any) => ({
          ...plan,
          startDate: new Date(plan.startDate),
          endDate: new Date(plan.endDate),
        })),
      )
    }

    if (savedAssignments) {
      setAssignments(
        JSON.parse(savedAssignments).map((assignment: any) => ({
          ...assignment,
          dueDate: new Date(assignment.dueDate),
          createdAt: new Date(assignment.createdAt),
        })),
      )
    }
  }, [])

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    localStorage.setItem("studysync-tasks", JSON.stringify(newTasks))
  }

  const saveStudySessions = (newSessions: StudySession[]) => {
    setStudySessions(newSessions)
    localStorage.setItem("studysync-study-sessions", JSON.stringify(newSessions))
  }

  const saveStudyPlans = (newPlans: StudyPlan[]) => {
    setStudyPlans(newPlans)
    localStorage.setItem("studysync-study-plans", JSON.stringify(newPlans))
  }

  const saveAssignments = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments)
    localStorage.setItem("studysync-assignments", JSON.stringify(newAssignments))
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "subtasks" | "reminders">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [],
      reminders: [],
    }
    saveTasks([...tasks, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            ...updates,
            updatedAt: new Date(),
            completedAt: updates.status === "completed" && !task.completedAt ? new Date() : task.completedAt,
          }
        : task,
    )
    saveTasks(updatedTasks)
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((task) => task.id !== id))
  }

  const addStudySession = (sessionData: Omit<StudySession, "id">) => {
    const newSession: StudySession = {
      ...sessionData,
      id: Date.now().toString(),
    }
    saveStudySessions([...studySessions, newSession])
  }

  const addAssignment = (assignmentData: Omit<Assignment, "id" | "createdAt">) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    saveAssignments([...assignments, newAssignment])
  }

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === id ? { ...assignment, ...updates } : assignment,
    )
    saveAssignments(updatedAssignments)
  }

  return {
    tasks,
    studySessions,
    studyPlans,
    assignments,
    addTask,
    updateTask,
    deleteTask,
    addStudySession,
    addAssignment,
    updateAssignment,
  }
}
