"use client"

import { useState, useEffect } from "react"
import type { MoodEntry, MeditationSession, FocusSession, WellbeingGoal } from "@/types/wellbeing"

export function useWellbeing() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([])
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([])
  const [wellbeingGoals, setWellbeingGoals] = useState<WellbeingGoal[]>([])

  useEffect(() => {
    const savedMoods = localStorage.getItem("studysync-mood-entries")
    const savedMeditations = localStorage.getItem("studysync-meditations")
    const savedFocus = localStorage.getItem("studysync-focus-sessions")
    const savedGoals = localStorage.getItem("studysync-wellbeing-goals")

    if (savedMoods) {
      setMoodEntries(
        JSON.parse(savedMoods).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })),
      )
    }

    if (savedMeditations) {
      setMeditationSessions(
        JSON.parse(savedMeditations).map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt),
        })),
      )
    }

    if (savedFocus) {
      setFocusSessions(
        JSON.parse(savedFocus).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        })),
      )
    }

    if (savedGoals) {
      setWellbeingGoals(
        JSON.parse(savedGoals).map((goal: any) => ({
          ...goal,
          deadline: new Date(goal.deadline),
          createdAt: new Date(goal.createdAt),
        })),
      )
    }
  }, [])

  const saveMoodEntries = (entries: MoodEntry[]) => {
    setMoodEntries(entries)
    localStorage.setItem("studysync-mood-entries", JSON.stringify(entries))
  }

  const saveMeditationSessions = (sessions: MeditationSession[]) => {
    setMeditationSessions(sessions)
    localStorage.setItem("studysync-meditations", JSON.stringify(sessions))
  }

  const saveFocusSessions = (sessions: FocusSession[]) => {
    setFocusSessions(sessions)
    localStorage.setItem("studysync-focus-sessions", JSON.stringify(sessions))
  }

  const saveWellbeingGoals = (goals: WellbeingGoal[]) => {
    setWellbeingGoals(goals)
    localStorage.setItem("studysync-wellbeing-goals", JSON.stringify(goals))
  }

  const addMoodEntry = (entryData: Omit<MoodEntry, "id">) => {
    const newEntry: MoodEntry = {
      ...entryData,
      id: Date.now().toString(),
    }
    saveMoodEntries([...moodEntries, newEntry])
  }

  const addMeditationSession = (sessionData: Omit<MeditationSession, "id">) => {
    const newSession: MeditationSession = {
      ...sessionData,
      id: Date.now().toString(),
    }
    saveMeditationSessions([...meditationSessions, newSession])
  }

  const addFocusSession = (sessionData: Omit<FocusSession, "id">) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: Date.now().toString(),
    }
    saveFocusSessions([...focusSessions, newSession])
  }

  const addWellbeingGoal = (goalData: Omit<WellbeingGoal, "id" | "createdAt">) => {
    const newGoal: WellbeingGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    saveWellbeingGoals([...wellbeingGoals, newGoal])
  }

  const updateGoalProgress = (goalId: string, progress: number) => {
    const updatedGoals = wellbeingGoals.map((goal) =>
      goal.id === goalId ? { ...goal, current: Math.min(progress, goal.target) } : goal,
    )
    saveWellbeingGoals(updatedGoals)
  }

  return {
    moodEntries,
    meditationSessions,
    focusSessions,
    wellbeingGoals,
    addMoodEntry,
    addMeditationSession,
    addFocusSession,
    addWellbeingGoal,
    updateGoalProgress,
  }
}
