"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Timer, Play, Pause, Square, Settings } from "lucide-react"
import { usePomodoro } from "@/hooks/use-pomodoro"

export function PomodoroTimer() {
  const {
    settings,
    currentSession,
    timeLeft,
    isRunning,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    updateSettings,
    formatTime,
    getTodaySessions,
  } = usePomodoro()

  const [showSettings, setShowSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState(settings)

  const todaySessions = getTodaySessions()
  const workSessions = todaySessions.filter((s) => s.type === "work").length
  const breakSessions = todaySessions.filter((s) => s.type === "break").length

  const handleSettingsUpdate = () => {
    updateSettings(settingsForm)
    setShowSettings(false)
  }

  const getNextSessionType = (): "work" | "break" => {
    if (!currentSession) {
      return workSessions === 0 ? "work" : "break"
    }
    return currentSession.type === "work" ? "break" : "work"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-red-500" />
          Pomodoro Timer
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSettings && (
          <div className="space-y-3 p-3 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Work Duration (min)</Label>
                <Input
                  type="number"
                  value={settingsForm.workDuration}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      workDuration: Number.parseInt(e.target.value) || 25,
                    })
                  }
                />
              </div>
              <div>
                <Label>Short Break (min)</Label>
                <Input
                  type="number"
                  value={settingsForm.shortBreakDuration}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      shortBreakDuration: Number.parseInt(e.target.value) || 5,
                    })
                  }
                />
              </div>
              <div>
                <Label>Long Break (min)</Label>
                <Input
                  type="number"
                  value={settingsForm.longBreakDuration}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      longBreakDuration: Number.parseInt(e.target.value) || 15,
                    })
                  }
                />
              </div>
              <div>
                <Label>Sessions Until Long Break</Label>
                <Input
                  type="number"
                  value={settingsForm.sessionsUntilLongBreak}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      sessionsUntilLongBreak: Number.parseInt(e.target.value) || 4,
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={handleSettingsUpdate} className="w-full">
              Save Settings
            </Button>
          </div>
        )}

        <div className="text-center space-y-4">
          <div className="text-6xl font-mono font-bold">{formatTime(timeLeft)}</div>

          {currentSession && (
            <div className="text-lg font-medium">{currentSession.type === "work" ? "Work Session" : "Break Time"}</div>
          )}

          <div className="flex justify-center gap-2">
            {!currentSession ? (
              <Button onClick={() => startSession(getNextSessionType())} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start {getNextSessionType() === "work" ? "Work" : "Break"}
              </Button>
            ) : (
              <>
                {isRunning ? (
                  <Button onClick={pauseSession} variant="outline">
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={resumeSession}>
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button onClick={stopSession} variant="destructive">
                  <Square className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">{workSessions}</div>
            <div className="text-sm text-muted-foreground">Work Sessions</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{breakSessions}</div>
            <div className="text-sm text-muted-foreground">Break Sessions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
