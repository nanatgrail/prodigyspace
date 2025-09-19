"use client";

import { useState, useEffect, useRef } from "react";
import type { PomodoroSession, PomodoroSettings } from "@/types/utilities";
import { storage } from "@/lib/storage";

export function usePomodoro() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const savedSessions =
      storage.getItem<PomodoroSession[]>("pomodoro-sessions") || [];
    const savedSettings =
      storage.getItem<PomodoroSettings>("pomodoro-settings") || settings;
    setSessions(savedSessions);
    setSettings(savedSettings);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const startSession = (type: "work" | "break") => {
    const duration =
      type === "work" ? settings.workDuration : getBreakDuration();

    const session: PomodoroSession = {
      id: Date.now().toString(),
      type,
      duration,
      completed: false,
      startTime: new Date(),
    };

    setCurrentSession(session);
    setTimeLeft(duration * 60);
    setIsRunning(true);
  };

  const getBreakDuration = () => {
    const completedWorkSessions = sessions.filter(
      (s) => s.type === "work" && s.completed
    ).length;
    return (completedWorkSessions + 1) % settings.sessionsUntilLongBreak === 0
      ? settings.longBreakDuration
      : settings.shortBreakDuration;
  };

  const completeSession = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        completed: true,
        endTime: new Date(),
      };
      const updated = [...sessions, completedSession];
      setSessions(updated);
      storage.setItem("pomodoro-sessions", updated);

      // Show notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(
          `${
            currentSession.type === "work" ? "Work" : "Break"
          } session completed!`,
          {
            body:
              currentSession.type === "work"
                ? "Time for a break!"
                : "Ready to work?",
            icon: "/icon-192.jpg",
          }
        );
      }
    }

    setCurrentSession(null);
    setIsRunning(false);
    setTimeLeft(0);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resumeSession = () => {
    setIsRunning(true);
  };

  const stopSession = () => {
    setCurrentSession(null);
    setIsRunning(false);
    setTimeLeft(0);
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    storage.setItem("pomodoro-settings", newSettings);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTodaySessions = () => {
    const today = new Date().toDateString();
    return sessions.filter(
      (session) =>
        new Date(session.startTime).toDateString() === today &&
        session.completed
    );
  };

  return {
    sessions,
    settings,
    currentSession,
    timeLeft,
    isRunning,
    startSession,
    completeSession,
    pauseSession,
    resumeSession,
    stopSession,
    updateSettings,
    formatTime,
    getTodaySessions,
  };
}
