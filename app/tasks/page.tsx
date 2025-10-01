"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskManager } from "@/components/task-manager";
import { StudyPlanner } from "@/components/study-planner";
import { useTasks } from "@/hooks/use-tasks";
import { CheckSquare, Calendar, BookOpen, GraduationCap } from "lucide-react";

export default function TasksPage() {
  const {
    tasks,
    studySessions,
    assignments,
    addTask,
    updateTask,
    deleteTask,
    addStudySession,
  } = useTasks();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Task Management & Study Planner
        </h1>
        <p className="text-muted-foreground">
          Organize your assignments, plan study sessions, and track your
          academic progress.
        </p>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Study Planner
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Assignments ({assignments.length})
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Sessions ({studySessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskManager
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </TabsContent>

        <TabsContent value="planner">
          <StudyPlanner
            studySessions={studySessions}
            tasks={tasks}
            onAddSession={addStudySession}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Assignment Tracker</h3>
            <p className="text-muted-foreground">
              Track your assignments, deadlines, and grades.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Study Sessions</h3>
            <p className="text-muted-foreground">
              Review your study session history and analytics.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
