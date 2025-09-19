"use client"

import { useState, useEffect, useCallback } from "react"
import { storage } from "@/lib/storage"
import type { Alarm, AlarmDay, Reminder } from "@/types/alarm"
import { useNotifications } from "./use-notifications"

const ALARMS_KEY = "studysync_alarms"
const REMINDERS_KEY = "studysync_reminders"

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const { showNotification } = useNotifications()

  // Load data from storage on mount
  useEffect(() => {
    const loadData = () => {
      const savedAlarms = storage.getItem<Alarm[]>(ALARMS_KEY) || []
      const savedReminders = storage.getItem<Reminder[]>(REMINDERS_KEY) || []

      setAlarms(savedAlarms)
      setReminders(savedReminders)
      setLoading(false)
    }

    loadData()
  }, [])

  // Save alarms to storage whenever they change
  useEffect(() => {
    if (!loading) {
      storage.setItem(ALARMS_KEY, alarms)
    }
  }, [alarms, loading])

  // Save reminders to storage whenever they change
  useEffect(() => {
    if (!loading) {
      storage.setItem(REMINDERS_KEY, reminders)
    }
  }, [reminders, loading])

  // Check for alarms and reminders every minute
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const currentDay = now.toLocaleDateString("en-US", { weekday: "lowercase" }) as AlarmDay

      // Check alarms
      alarms.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime && alarm.days.includes(currentDay)) {
          showNotification(`⏰ ${alarm.title}`, {
            body: alarm.description || "Alarm is ringing!",
            tag: `alarm-${alarm.id}`,
            requireInteraction: true,
          })
        }
      })

      // Check reminders
      reminders.forEach((reminder) => {
        if (reminder.isActive) {
          const reminderTime = new Date(reminder.dateTime)
          const timeDiff = Math.abs(now.getTime() - reminderTime.getTime())

          // Trigger if within 1 minute of reminder time
          if (timeDiff < 60000) {
            showNotification(`🔔 ${reminder.title}`, {
              body: reminder.description || "Reminder notification",
              tag: `reminder-${reminder.id}`,
              requireInteraction: true,
            })
          }
        }
      })
    }

    const interval = setInterval(checkAlarms, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [alarms, reminders, showNotification])

  const addAlarm = useCallback((alarm: Omit<Alarm, "id" | "createdAt" | "updatedAt">) => {
    const newAlarm: Alarm = {
      ...alarm,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setAlarms((prev) => [newAlarm, ...prev])
  }, [])

  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === id ? { ...alarm, ...updates, updatedAt: Date.now() } : alarm)),
    )
  }, [])

  const deleteAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
  }, [])

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive, updatedAt: Date.now() } : alarm)),
    )
  }, [])

  const addReminder = useCallback((reminder: Omit<Reminder, "id" | "createdAt" | "updatedAt">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setReminders((prev) => [newReminder, ...prev])
  }, [])

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, ...updates, updatedAt: Date.now() } : reminder)),
    )
  }, [])

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }, [])

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, isActive: !reminder.isActive, updatedAt: Date.now() } : reminder,
      ),
    )
  }, [])

  return {
    alarms,
    reminders,
    loading,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
  }
}
