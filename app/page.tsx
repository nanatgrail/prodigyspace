"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  FileText,
  Users,
  Heart,
  CheckSquare,
  BookOpen,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useNotes } from "@/hooks/use-notes";
import { useCollaboration } from "@/hooks/use-collaboration";
import { useWellbeing } from "@/hooks/use-wellbeing";

export default function HomePage() {
  const { tasks } = useTasks();
  const { notes, scannedDocs } = useNotes();
  const { studyGroups, projects } = useCollaboration();
  const { moodEntries, meditationSessions } = useWellbeing();

  useEffect(() => {
    // Register service worker for PWA functionality
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;
  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      task.status !== "completed" &&
      new Date(task.dueDate) < new Date()
  ).length;

  const totalStudyTime = meditationSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const averageMood =
    moodEntries.length > 0
      ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
        moodEntries.length
      : 0;

  const upcomingTasks = tasks
    .filter((task) => task.dueDate && task.status !== "completed")
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 3);

  const recentNotes = notes
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  const features = [
    {
      icon: FileText,
      title: "Notes & Documents",
      description: "Smart note-taking with document scanning and organization",
      color: "text-blue-600",
      href: "/notes",
      stats: `${notes.length} notes, ${scannedDocs.length} docs`,
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Advanced task tracking with study planning and reminders",
      color: "text-green-600",
      href: "/tasks",
      stats: `${completedTasks}/${tasks.length} completed`,
    },
    {
      icon: Users,
      title: "Collaboration Hub",
      description: "Study groups, project management, and peer communication",
      color: "text-purple-600",
      href: "/collaboration",
      stats: `${studyGroups.length} groups, ${projects.length} projects`,
    },
    {
      icon: Heart,
      title: "Well-being Center",
      description: "Mental health tracking, meditation, and stress management",
      color: "text-pink-600",
      href: "/wellbeing",
      stats: `${moodEntries.length} mood entries, ${totalStudyTime}min meditation`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto p-6">
        <header className="text-center py-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProdigySpace
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your comprehensive digital workspace for academic success,
            collaboration, and well-being
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {completedTasks}
              </div>
              <div className="text-sm text-muted-foreground">
                Tasks Completed
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {notes.length}
              </div>
              <div className="text-sm text-muted-foreground">Notes Created</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {studyGroups.length}
              </div>
              <div className="text-sm text-muted-foreground">Study Groups</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-pink-600">
                {averageMood.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Mood</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}
                      >
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming tasks
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => {
                    const daysUntilDue = Math.ceil(
                      (new Date(task.dueDate!).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded border"
                      >
                        <div>
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
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
                      </div>
                    );
                  })}
                </div>
              )}
              <Link href="/tasks">
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  size="sm"
                >
                  View All Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentNotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No notes yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <div key={note.id} className="p-3 rounded border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {note.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {note.content || "No content"}
                          </p>
                          <div className="flex gap-1 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {note.category}
                            </Badge>
                            {note.isPinned && (
                              <Badge variant="outline" className="text-xs">
                                Pinned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/notes">
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  size="sm"
                >
                  View All Notes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {tasks.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Task Completion</span>
                    <span>
                      {completedTasks}/{tasks.length}
                    </span>
                  </div>
                  <Progress
                    value={(completedTasks / tasks.length) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Pending Tasks</span>
                    <span>{pendingTasks}</span>
                  </div>
                  <Progress
                    value={(pendingTasks / tasks.length) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overdue Tasks</span>
                    <span className="text-red-600">{overdueTasks}</span>
                  </div>
                  <Progress
                    value={(overdueTasks / tasks.length) * 100}
                    className="h-2 bg-red-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
