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
import styles from "@/styles/page.module.css";

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
    <div className={styles["mainpage-container"]}>
      <div className="container mx-auto p-6">
        <header className={styles["mainpage-header"]}>
          <div className={styles["mainpage-logo-container"]}>
            <div className={styles["mainpage-logo-icon"]}>
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className={styles["mainpage-logo-title"]}>ProdigySpace</h1>
          </div>
          <p className={styles["mainpage-subtitle"]}>
            Your comprehensive digital workspace for academic success,
            collaboration, and well-being
          </p>
        </header>

        <div className={styles["mainpage-stats-grid"]}>
          <Card className={styles["mainpage-stat-card"]}>
            <CardContent className="p-4">
              <div
                className={`${styles["mainpage-stat-value"]} ${styles["mainpage-stat-value-completed"]}`}
              >
                {completedTasks}
              </div>
              <div className={styles["mainpage-stat-label"]}>
                Tasks Completed
              </div>
            </CardContent>
          </Card>
          <Card className={styles["mainpage-stat-card"]}>
            <CardContent className="p-4">
              <div
                className={`${styles["mainpage-stat-value"]} ${styles["mainpage-stat-value-notes"]}`}
              >
                {notes.length}
              </div>
              <div className={styles["mainpage-stat-label"]}>Notes Created</div>
            </CardContent>
          </Card>
          <Card className={styles["mainpage-stat-card"]}>
            <CardContent className="p-4">
              <div
                className={`${styles["mainpage-stat-value"]} ${styles["mainpage-stat-value-groups"]}`}
              >
                {studyGroups.length}
              </div>
              <div className={styles["mainpage-stat-label"]}>Study Groups</div>
            </CardContent>
          </Card>
          <Card className={styles["mainpage-stat-card"]}>
            <CardContent className="p-4">
              <div
                className={`${styles["mainpage-stat-value"]} ${styles["mainpage-stat-value-mood"]}`}
              >
                {averageMood.toFixed(1)}
              </div>
              <div className={styles["mainpage-stat-label"]}>Avg Mood</div>
            </CardContent>
          </Card>
        </div>

        <div className={styles["mainpage-features-grid"]}>
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className={styles["mainpage-feature-card"]}>
                <CardHeader>
                  <div className={styles["mainpage-feature-header"]}>
                    <div className={styles["mainpage-feature-icon-container"]}>
                      <div className={styles["mainpage-feature-icon-bg"]}>
                        <feature.icon className={feature.color} />
                      </div>
                      <div>
                        <CardTitle className={styles["mainpage-feature-title"]}>
                          {feature.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={styles["mainpage-feature-badge"]}
                        >
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription
                    className={styles["mainpage-feature-description"]}
                  >
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className={styles["mainpage-content-grid"]}>
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className={styles["mainpage-section-header"]}>
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
                        className={styles["mainpage-task-item"]}
                      >
                        <div className={styles["mainpage-task-details"]}>
                          <h4 className={styles["mainpage-task-title"]}>
                            {task.title}
                          </h4>
                          <div className={styles["mainpage-task-badges"]}>
                            <Badge
                              variant="outline"
                              className={styles["mainpage-task-badge"]}
                            >
                              {task.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={styles["mainpage-task-badge"]}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        <div
                          className={`${styles["mainpage-task-due-date"]} ${
                            daysUntilDue < 0
                              ? styles["mainpage-task-due-date-overdue"]
                              : daysUntilDue < 3
                              ? styles["mainpage-task-due-date-soon"]
                              : styles["mainpage-task-due-date-normal"]
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
                  className={styles["mainpage-view-all-button"]}
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
              <CardTitle className={styles["mainpage-section-header"]}>
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
                    <div key={note.id} className={styles["mainpage-note-item"]}>
                      <div className={styles["mainpage-note-details"]}>
                        <div className={styles["mainpage-note-title"]}>
                          {note.title}
                        </div>
                        <p className={styles["mainpage-note-content"]}>
                          {note.content || "No content"}
                        </p>
                        <div className={styles["mainpage-note-badges"]}>
                          <Badge
                            variant="outline"
                            className={styles["mainpage-note-badge"]}
                          >
                            {note.category}
                          </Badge>
                          {note.isPinned && (
                            <Badge
                              variant="outline"
                              className={styles["mainpage-note-badge"]}
                            >
                              Pinned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/notes">
                <Button
                  variant="outline"
                  className={styles["mainpage-view-all-button"]}
                  size="sm"
                >
                  View All Notes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {tasks.length > 0 && (
          <Card className={styles["mainpage-progress-section"]}>
            <CardHeader>
              <CardTitle className={styles["mainpage-section-header"]}>
                <TrendingUp className="h-5 w-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["mainpage-progress-grid"]}>
                <div>
                  <div className={styles["mainpage-progress-header"]}>
                    <span>Task Completion</span>
                    <span>
                      {completedTasks}/{tasks.length}
                    </span>
                  </div>
                  <Progress
                    value={(completedTasks / tasks.length) * 100}
                    className={styles["mainpage-progress-bar"]}
                  />
                </div>
                <div>
                  <div className={styles["mainpage-progress-header"]}>
                    <span>Pending Tasks</span>
                    <span>{pendingTasks}</span>
                  </div>
                  <Progress
                    value={(pendingTasks / tasks.length) * 100}
                    className={styles["mainpage-progress-bar"]}
                  />
                </div>
                <div>
                  <div className={styles["mainpage-progress-header"]}>
                    <span>Overdue Tasks</span>
                    <span className="text-red-600">{overdueTasks}</span>
                  </div>
                  <Progress
                    value={(overdueTasks / tasks.length) * 100}
                    className={`${styles["mainpage-progress-bar"]} ${styles["mainpage-progress-bar-overdue"]}`}
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
