"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { CalendarIcon, Clock, BookOpen, Target } from "lucide-react"
import type { StudySession, Task } from "@/types/tasks"

interface StudyPlannerProps {
  studySessions: StudySession[]
  tasks: Task[]
  onAddSession: (session: Omit<StudySession, "id">) => void
}

const studyTechniques = [
  { value: "pomodoro", label: "Pomodoro (25min focus)", icon: "🍅" },
  { value: "time-blocking", label: "Time Blocking", icon: "📅" },
  { value: "active-recall", label: "Active Recall", icon: "🧠" },
  { value: "spaced-repetition", label: "Spaced Repetition", icon: "🔄" },
]

export function StudyPlanner({ studySessions, tasks, onAddSession }: StudyPlannerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("week")

  const getSessionsForDate = (date: Date) => {
    return studySessions.filter((session) => isSameDay(session.startTime, date))
  }

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate)
    const end = endOfWeek(selectedDate)
    return eachDayOfInterval({ start, end })
  }

  const getTotalStudyTime = (date: Date) => {
    const sessions = getSessionsForDate(date)
    return sessions.reduce((total, session) => total + session.duration, 0)
  }

  const getUpcomingTasks = () => {
    const today = new Date()
    return tasks
      .filter((task) => task.status !== "completed" && task.dueDate)
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
      .slice(0, 5)
  }

  const weekDays = getWeekDays()
  const todaySessions = getSessionsForDate(selectedDate)
  const upcomingTasks = getUpcomingTasks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Planner</h2>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: "day" | "week") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Study Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {viewMode === "day"
                ? `Study Schedule - ${format(selectedDate, "EEEE, MMMM d")}`
                : `Week of ${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d")}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "day" ? (
              <div className="space-y-4">
                {todaySessions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No study sessions scheduled for this day</p>
                    <Button className="mt-4" size="sm">
                      Schedule Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaySessions
                      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                      .map((session) => (
                        <Card key={session.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{session.subject}</h4>
                              <p className="text-sm text-muted-foreground">{session.topic}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">
                                  {format(session.startTime, "HH:mm")} - {format(session.endTime, "HH:mm")}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {session.technique}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{session.duration}min</div>
                              <div className="text-xs text-muted-foreground">
                                Productivity: {session.productivity}/5
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {weekDays.map((day) => {
                  const dayStudyTime = getTotalStudyTime(day)
                  const daySessions = getSessionsForDate(day)

                  return (
                    <div key={day.toISOString()} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <div className="text-center min-w-[60px]">
                          <div className="text-sm font-medium">{format(day, "EEE")}</div>
                          <div className="text-lg">{format(day, "d")}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{dayStudyTime} minutes</span>
                            <Badge variant="outline" className="text-xs">
                              {daySessions.length} sessions
                            </Badge>
                          </div>
                          <Progress value={(dayStudyTime / 480) * 100} className="mt-1 h-2" />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDate(day)}
                        className={isSameDay(day, selectedDate) ? "bg-primary text-primary-foreground" : ""}
                      >
                        View
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Techniques & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Study Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studyTechniques.map((technique) => (
                <Card key={technique.value} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{technique.icon}</span>
                    <div>
                      <h4 className="font-medium">{technique.label}</h4>
                      <p className="text-sm text-muted-foreground">
                        {technique.value === "pomodoro" && "25 minutes focused work + 5 minute break"}
                        {technique.value === "time-blocking" && "Dedicated time blocks for specific subjects"}
                        {technique.value === "active-recall" && "Test yourself without looking at notes"}
                        {technique.value === "spaced-repetition" && "Review material at increasing intervals"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming tasks with due dates</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const daysUntilDue = Math.ceil(
                    (task.dueDate!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )

                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded border">
                      <div>
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm ${
                            daysUntilDue < 0
                              ? "text-red-600"
                              : daysUntilDue < 3
                                ? "text-yellow-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          {daysUntilDue < 0
                            ? `${Math.abs(daysUntilDue)}d overdue`
                            : daysUntilDue === 0
                              ? "Due today"
                              : `${daysUntilDue}d left`}
                        </div>
                        {task.estimatedTime && (
                          <div className="text-xs text-muted-foreground">{task.estimatedTime}min</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
