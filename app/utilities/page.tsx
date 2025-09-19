import { WaterTracker } from "@/components/water-tracker"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { BookmarkManager } from "@/components/bookmark-manager"

export default function UtilitiesPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Student Utilities</h1>
        <p className="text-muted-foreground">Essential tools to boost your productivity and maintain healthy habits</p>
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
      </div>
    </div>
  )
}
