"use client";

import { WaterTracker } from "@/components/water-tracker";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { BookmarkManager } from "@/components/bookmark-manager";
import { DocumentScanner } from "@/components/document-scanner";
import { StudyPlanner } from "@/components/study-planner";
import { GoalsManager } from "@/components/goals-manager";
import { UnitConverter } from "@/components/unit-converter";

// Mock data for the new components
const mockScannedDocs = [
  {
    id: "1",
    name: "Math Notes",
    pages: ["/placeholder.svg"],
    category: "notes" as const,
    createdAt: new Date(),
  },
];

const mockStudySessions = [
  {
    id: "1",
    subject: "Mathematics",
    topic: "Calculus",
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000),
    duration: 60,
    technique: "pomodoro" as const,
    productivity: 4 as const,
    distractions: 0,
  },
];

const mockTasks = [
  {
    id: "1",
    title: "Complete Assignment",
    description: "Finish math assignment",
    status: "todo" as const,
    priority: "high" as const,
    category: "assignment" as const,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    estimatedTime: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    subtasks: [],
    reminders: [],
  },
];

const mockGoals = [
  {
    id: "1",
    title: "Study for 30 days",
    description: "Consistent study habit",
    category: "focus" as const,
    target: 30,
    current: 15,
    unit: "days",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
];

export default function UtilitiesPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Student Utilities</h1>
        <p className="text-muted-foreground">
          Essential tools to boost your productivity and maintain healthy habits
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1">
          <WaterTracker />
        </div>
        <div className="md:col-span-1">
          <PomodoroTimer />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <BookmarkManager />
        </div>

        {/* New Utilities */}
        <div className="md:col-span-2">
          <UnitConverter />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <DocumentScanner
            onSave={(docData) => console.log("Save document:", docData)}
            scannedDocs={mockScannedDocs}
            onDelete={(id) => console.log("Delete document:", id)}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <StudyPlanner
            studySessions={mockStudySessions}
            tasks={mockTasks}
            onAddSession={(session) => console.log("Add session:", session)}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <GoalsManager
            goals={mockGoals}
            onAddGoal={(goal) => console.log("Add goal:", goal)}
            onUpdateProgress={(goalId, progress) =>
              console.log("Update progress:", goalId, progress)
            }
          />
        </div>
      </div>
    </div>
  );
}
