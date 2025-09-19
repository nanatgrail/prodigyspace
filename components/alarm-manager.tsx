"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useAlarms } from "@/hooks/use-alarms"
import { useNotifications } from "@/hooks/use-notifications"
import type { AlarmDay } from "@/types/alarm"
import { Plus, Clock, Bell, BellRing, Trash2, AlertCircle } from "lucide-react"

const dayLabels: Record<AlarmDay, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
}

const allDays: AlarmDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export function AlarmManager() {
  const {
    alarms,
    reminders,
    loading,
    addAlarm,
    deleteAlarm,
    toggleAlarm,
    addReminder,
    deleteReminder,
    toggleReminder,
  } = useAlarms()

  const { supported, permission, requestPermission } = useNotifications()

  const [isAlarmDialogOpen, setIsAlarmDialogOpen] = useState(false)
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)

  const [newAlarm, setNewAlarm] = useState({
    title: "",
    description: "",
    time: "",
    days: [] as AlarmDay[],
    isActive: true,
  })

  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dateTime: "",
    isActive: true,
    isRecurring: false,
    recurringType: "daily" as "daily" | "weekly" | "monthly",
  })

  const handleAddAlarm = () => {
    if (!newAlarm.title || !newAlarm.time || newAlarm.days.length === 0) return

    addAlarm({
      title: newAlarm.title,
      description: newAlarm.description || undefined,
      time: newAlarm.time,
      days: newAlarm.days,
      isActive: newAlarm.isActive,
    })

    setNewAlarm({
      title: "",
      description: "",
      time: "",
      days: [],
      isActive: true,
    })
    setIsAlarmDialogOpen(false)
  }

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.dateTime) return

    addReminder({
      title: newReminder.title,
      description: newReminder.description || undefined,
      dateTime: newReminder.dateTime,
      isActive: newReminder.isActive,
      isRecurring: newReminder.isRecurring,
      recurringType: newReminder.isRecurring ? newReminder.recurringType : undefined,
    })

    setNewReminder({
      title: "",
      description: "",
      dateTime: "",
      isActive: true,
      isRecurring: false,
      recurringType: "daily",
    })
    setIsReminderDialogOpen(false)
  }

  const handleDayToggle = (day: AlarmDay) => {
    setNewAlarm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Alarms & Reminders</h2>
          <p className="text-muted-foreground">Never miss important deadlines and events</p>
        </div>
      </div>

      {/* Notification Permission */}
      {supported && permission !== "granted" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="h-5 w-5" />
              Enable Notifications
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              To receive alarm and reminder notifications, please enable notifications for this app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={requestPermission} variant="outline">
              Enable Notifications
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alarms.filter((a) => a.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Out of {alarms.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reminders.filter((r) => r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Out of {reminders.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permission === "granted" ? "Enabled" : "Disabled"}</div>
            <p className="text-xs text-muted-foreground">{supported ? "Browser supported" : "Not supported"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alarms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alarms">Alarms</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="alarms" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAlarmDialogOpen} onOpenChange={setIsAlarmDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Alarm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Alarm</DialogTitle>
                  <DialogDescription>Set up a recurring alarm for specific days and times</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="alarm-title">Title</Label>
                    <Input
                      id="alarm-title"
                      placeholder="Wake up, Study time, etc."
                      value={newAlarm.title}
                      onChange={(e) => setNewAlarm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alarm-description">Description (Optional)</Label>
                    <Textarea
                      id="alarm-description"
                      placeholder="Additional details..."
                      value={newAlarm.description}
                      onChange={(e) => setNewAlarm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alarm-time">Time</Label>
                    <Input
                      id="alarm-time"
                      type="time"
                      value={newAlarm.time}
                      onChange={(e) => setNewAlarm((prev) => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Days</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allDays.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={newAlarm.days.includes(day)}
                            onCheckedChange={() => handleDayToggle(day)}
                          />
                          <Label htmlFor={day} className="text-sm">
                            {dayLabels[day]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="alarm-active"
                      checked={newAlarm.isActive}
                      onCheckedChange={(checked) => setNewAlarm((prev) => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="alarm-active">Active</Label>
                  </div>
                  <Button onClick={handleAddAlarm} className="w-full">
                    Add Alarm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Alarms</CardTitle>
              <CardDescription>Manage your recurring alarms</CardDescription>
            </CardHeader>
            <CardContent>
              {alarms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No alarms set. Add your first alarm to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {alarms.map((alarm) => (
                    <div key={alarm.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch checked={alarm.isActive} onCheckedChange={() => toggleAlarm(alarm.id)} />
                        <div>
                          <div className="font-medium">{alarm.title}</div>
                          <div className="text-sm text-muted-foreground">{formatTime(alarm.time)}</div>
                          {alarm.description && (
                            <div className="text-sm text-muted-foreground mt-1">{alarm.description}</div>
                          )}
                          <div className="flex gap-1 mt-2">
                            {alarm.days.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {dayLabels[day]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlarm(alarm.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Reminder</DialogTitle>
                  <DialogDescription>Set up a one-time or recurring reminder</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reminder-title">Title</Label>
                    <Input
                      id="reminder-title"
                      placeholder="Assignment due, Meeting, etc."
                      value={newReminder.title}
                      onChange={(e) => setNewReminder((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder-description">Description (Optional)</Label>
                    <Textarea
                      id="reminder-description"
                      placeholder="Additional details..."
                      value={newReminder.description}
                      onChange={(e) => setNewReminder((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder-datetime">Date & Time</Label>
                    <Input
                      id="reminder-datetime"
                      type="datetime-local"
                      value={newReminder.dateTime}
                      onChange={(e) => setNewReminder((prev) => ({ ...prev, dateTime: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reminder-active"
                      checked={newReminder.isActive}
                      onCheckedChange={(checked) => setNewReminder((prev) => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="reminder-active">Active</Label>
                  </div>
                  <Button onClick={handleAddReminder} className="w-full">
                    Add Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Reminders</CardTitle>
              <CardDescription>Manage your one-time and recurring reminders</CardDescription>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reminders set. Add your first reminder to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch checked={reminder.isActive} onCheckedChange={() => toggleReminder(reminder.id)} />
                        <div>
                          <div className="font-medium">{reminder.title}</div>
                          <div className="text-sm text-muted-foreground">{formatDateTime(reminder.dateTime)}</div>
                          {reminder.description && (
                            <div className="text-sm text-muted-foreground mt-1">{reminder.description}</div>
                          )}
                          {reminder.isRecurring && (
                            <Badge variant="secondary" className="text-xs mt-2">
                              Recurring {reminder.recurringType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
