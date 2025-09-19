"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoodTracker } from "@/components/mood-tracker"
import { MeditationCenter } from "@/components/meditation-center"
import { useWellbeing } from "@/hooks/use-wellbeing"
import { Heart, Brain, Target, TrendingUp } from "lucide-react"

export default function WellbeingPage() {
  const { moodEntries, meditationSessions, addMoodEntry, addMeditationSession } = useWellbeing()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Well-being Center</h1>
        <p className="text-muted-foreground">
          Track your mental health, practice mindfulness, and maintain balance in your student life.
        </p>
      </div>

      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Mood
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mood">
          <MoodTracker moodEntries={moodEntries} onAddEntry={addMoodEntry} />
        </TabsContent>

        <TabsContent value="meditation">
          <MeditationCenter sessions={meditationSessions} onAddSession={addMeditationSession} />
        </TabsContent>

        <TabsContent value="goals">
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Well-being Goals</h3>
            <p className="text-muted-foreground">Set and track your mental health and wellness goals.</p>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Well-being Insights</h3>
            <p className="text-muted-foreground">Analyze your mood patterns and meditation progress.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
