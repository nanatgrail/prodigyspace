"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAlarms } from "@/hooks/use-alarms";
import { useNotifications } from "@/hooks/use-notifications";
import type { AlarmDay } from "@/types/alarm";
import { Plus, Clock, Bell, BellRing, Trash2, AlertCircle } from "lucide-react";
import "@/styles/alarms.css";

const dayLabels: Record<AlarmDay, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const allDays: AlarmDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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
  } = useAlarms();

  const { supported, permission, requestPermission } = useNotifications();

  const [isAlarmDialogOpen, setIsAlarmDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  const [newAlarm, setNewAlarm] = useState({
    title: "",
    description: "",
    time: "",
    days: [] as AlarmDay[],
    isActive: true,
  });

  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dateTime: "",
    isActive: true,
    isRecurring: false,
    recurringType: "daily" as "daily" | "weekly" | "monthly",
  });

  const handleAddAlarm = () => {
    if (!newAlarm.title || !newAlarm.time || newAlarm.days.length === 0) return;

    addAlarm({
      title: newAlarm.title,
      description: newAlarm.description || undefined,
      time: newAlarm.time,
      days: newAlarm.days,
      isActive: newAlarm.isActive,
    });

    setNewAlarm({
      title: "",
      description: "",
      time: "",
      days: [],
      isActive: true,
    });
    setIsAlarmDialogOpen(false);
  };

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.dateTime) return;

    addReminder({
      title: newReminder.title,
      description: newReminder.description || undefined,
      dateTime: newReminder.dateTime,
      isActive: newReminder.isActive,
      isRecurring: newReminder.isRecurring,
      recurringType: newReminder.isRecurring
        ? newReminder.recurringType
        : undefined,
    });

    setNewReminder({
      title: "",
      description: "",
      dateTime: "",
      isActive: true,
      isRecurring: false,
      recurringType: "daily",
    });
    setIsReminderDialogOpen(false);
  };

  const handleDayToggle = (day: AlarmDay) => {
    setNewAlarm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <div className="mainpage-loading-container">Loading...</div>;
  }

  return (
    <div className="mainpage-alarm-manager">
      {/* Header */}
      <div className="mainpage-alarm-header">
        <div>
          <h2 className="mainpage-alarm-title">Alarms & Reminders</h2>
          <p className="mainpage-alarm-subtitle">
            Never miss important deadlines and events
          </p>
        </div>
      </div>

      {/* Notification Permission */}
      {supported && permission !== "granted" && (
        <Card className="mainpage-notification-card mainpage-notification-card-dark">
          <CardHeader>
            <CardTitle className="mainpage-warning-title mainpage-warning-title-dark">
              <AlertCircle className="mainpage-large-icon" />
              Enable Notifications
            </CardTitle>
            <CardDescription className="mainpage-warning-description mainpage-warning-description-dark">
              To receive alarm and reminder notifications, please enable
              notifications for this app.
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
      <div className="mainpage-stats-grid">
        <Card>
          <CardHeader className="mainpage-card-header">
            <CardTitle className="mainpage-card-title">Active Alarms</CardTitle>
            <Clock className="mainpage-icon" />
          </CardHeader>
          <CardContent>
            <div className="mainpage-stat-number">
              {alarms.filter((a) => a.isActive).length}
            </div>
            <p className="mainpage-stat-label">Out of {alarms.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="mainpage-card-header">
            <CardTitle className="mainpage-card-title">
              Active Reminders
            </CardTitle>
            <Bell className="mainpage-icon" />
          </CardHeader>
          <CardContent>
            <div className="mainpage-stat-number">
              {reminders.filter((r) => r.isActive).length}
            </div>
            <p className="mainpage-stat-label">
              Out of {reminders.length} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="mainpage-card-header">
            <CardTitle className="mainpage-card-title">Notifications</CardTitle>
            <BellRing className="mainpage-icon" />
          </CardHeader>
          <CardContent>
            <div className="mainpage-stat-number">
              {permission === "granted" ? "Enabled" : "Disabled"}
            </div>
            <p className="mainpage-stat-label">
              {supported ? "Browser supported" : "Not supported"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alarms" className="mainpage-tabs-content">
        <TabsList>
          <TabsTrigger value="alarms">Alarms</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="alarms" className="mainpage-tabs-content">
          <div className="mainpage-button-container">
            <Dialog
              open={isAlarmDialogOpen}
              onOpenChange={setIsAlarmDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mainpage-dialog-button" />
                  Add Alarm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Alarm</DialogTitle>
                  <DialogDescription>
                    Set up a recurring alarm for specific days and times
                  </DialogDescription>
                </DialogHeader>
                <div className="mainpage-form-section">
                  <div>
                    <Label htmlFor="alarm-title">Title</Label>
                    <Input
                      id="alarm-title"
                      placeholder="Wake up, Study time, etc."
                      value={newAlarm.title}
                      onChange={(e) =>
                        setNewAlarm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="alarm-description">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="alarm-description"
                      placeholder="Additional details..."
                      value={newAlarm.description}
                      onChange={(e) =>
                        setNewAlarm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="alarm-time">Time</Label>
                    <Input
                      id="alarm-time"
                      type="time"
                      value={newAlarm.time}
                      onChange={(e) =>
                        setNewAlarm((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Days</Label>
                    <div className="mainpage-days-container">
                      {allDays.map((day) => (
                        <div key={day} className="mainpage-day-item">
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
                  <div className="mainpage-switch-container">
                    <Switch
                      id="alarm-active"
                      checked={newAlarm.isActive}
                      onCheckedChange={(checked) =>
                        setNewAlarm((prev) => ({ ...prev, isActive: checked }))
                      }
                    />
                    <Label htmlFor="alarm-active">Active</Label>
                  </div>
                  <Button
                    onClick={handleAddAlarm}
                    className="mainpage-full-width"
                  >
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
                <div className="mainpage-empty-state">
                  No alarms set. Add your first alarm to get started!
                </div>
              ) : (
                <div className="mainpage-alarm-list">
                  {alarms.map((alarm) => (
                    <div key={alarm.id} className="mainpage-alarm-item">
                      <div className="mainpage-alarm-content">
                        <Switch
                          checked={alarm.isActive}
                          onCheckedChange={() => toggleAlarm(alarm.id)}
                        />
                        <div>
                          <div className="font-medium">{alarm.title}</div>
                          <div className="mainpage-alarm-time">
                            {formatTime(alarm.time)}
                          </div>
                          {alarm.description && (
                            <div className="mainpage-alarm-description">
                              {alarm.description}
                            </div>
                          )}
                          <div className="mainpage-days-list">
                            {alarm.days.map((day) => (
                              <Badge
                                key={day}
                                variant="outline"
                                className="mainpage-badge"
                              >
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
                        className="mainpage-delete-button"
                      >
                        <Trash2 className="mainpage-icon" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="mainpage-tabs-content">
          <div className="mainpage-button-container">
            <Dialog
              open={isReminderDialogOpen}
              onOpenChange={setIsReminderDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mainpage-dialog-button" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Reminder</DialogTitle>
                  <DialogDescription>
                    Set up a one-time or recurring reminder
                  </DialogDescription>
                </DialogHeader>
                <div className="mainpage-form-section">
                  <div>
                    <Label htmlFor="reminder-title">Title</Label>
                    <Input
                      id="reminder-title"
                      placeholder="Assignment due, Meeting, etc."
                      value={newReminder.title}
                      onChange={(e) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder-description">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="reminder-description"
                      placeholder="Additional details..."
                      value={newReminder.description}
                      onChange={(e) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder-datetime">Date & Time</Label>
                    <Input
                      id="reminder-datetime"
                      type="datetime-local"
                      value={newReminder.dateTime}
                      onChange={(e) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          dateTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="mainpage-switch-container">
                    <Switch
                      id="reminder-active"
                      checked={newReminder.isActive}
                      onCheckedChange={(checked) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          isActive: checked,
                        }))
                      }
                    />
                    <Label htmlFor="reminder-active">Active</Label>
                  </div>
                  <Button
                    onClick={handleAddReminder}
                    className="mainpage-full-width"
                  >
                    Add Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Reminders</CardTitle>
              <CardDescription>
                Manage your one-time and recurring reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="mainpage-empty-state">
                  No reminders set. Add your first reminder to get started!
                </div>
              ) : (
                <div className="mainpage-alarm-list">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="mainpage-alarm-item">
                      <div className="mainpage-alarm-content">
                        <Switch
                          checked={reminder.isActive}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                        <div>
                          <div className="font-medium">{reminder.title}</div>
                          <div className="mainpage-alarm-time">
                            {formatDateTime(reminder.dateTime)}
                          </div>
                          {reminder.description && (
                            <div className="mainpage-alarm-description">
                              {reminder.description}
                            </div>
                          )}
                          {reminder.isRecurring && (
                            <Badge
                              variant="secondary"
                              className="mainpage-badge"
                            >
                              Recurring {reminder.recurringType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                        className="mainpage-delete-button"
                      >
                        <Trash2 className="mainpage-icon" />
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
  );
}
