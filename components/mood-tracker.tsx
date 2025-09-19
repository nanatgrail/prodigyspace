"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, TrendingUp } from "lucide-react"
import type { MoodEntry } from "@/types/wellbeing"

interface MoodTrackerProps {
  moodEntries: MoodEntry[]
  onAddEntry: (entry: Omit<MoodEntry, "id">) => void
}

const moodEmojis = {
  1: { emoji: "😢", label: "Very Bad", color: "text-red-600" },
  2: { emoji: "😕", label: "Bad", color: "text-orange-600" },
  3: { emoji: "😐", label: "Okay", color: "text-yellow-600" },
  4: { emoji: "😊", label: "Good", color: "text-green-600" },
  5: { emoji: "😄", label: "Excellent", color: "text-blue-600" },
}

const activities = [
  "Exercise",
  "Study",
  "Social Time",
  "Sleep",
  "Meditation",
  "Hobbies",
  "Work",
  "Family Time",
  "Outdoor Activity",
  "Reading",
]

export function MoodTracker({ moodEntries, onAddEntry }: MoodTrackerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [stress, setStress] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [notes, setNotes] = useState("")
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  const handleSubmit = () => {
    onAddEntry({
      date: selectedDate,
      mood,
      energy,
      stress,
      notes: notes.trim(),
      activities: selectedActivities,
    })

    // Reset form
    setMood(3)
    setEnergy(3)
    setStress(3)
    setNotes("")
    setSelectedActivities([])
  }

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity],
    )
  }

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0)
    return sum / moodEntries.length
  }

  const recentEntries = moodEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Log Your Mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mood</label>
              <div className="flex gap-2">
                {Object.entries(moodEmojis).map(([value, { emoji, label, color }]) => (
                  <Button
                    key={value}
                    variant={mood === Number.parseInt(value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMood(Number.parseInt(value) as 1 | 2 | 3 | 4 | 5)}
                    className="flex-1 flex-col h-auto py-2"
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Energy Level</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={energy >= level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEnergy(level as 1 | 2 | 3 | 4 | 5)}
                    className="flex-1"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Stress Level</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={stress >= level ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setStress(level as 1 | 2 | 3 | 4 | 5)}
                    className="flex-1"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Activities</label>
              <div className="flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <Badge
                    key={activity}
                    variant={selectedActivities.includes(activity) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleActivity(activity)}
                  >
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling today?"
                rows={3}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Log Mood
            </Button>
          </CardContent>
        </Card>

        {/* Mood Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mood Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {moodEntries.length > 0 ? moodEmojis[Math.round(getAverageMood()) as 1 | 2 | 3 | 4 | 5].emoji : "😐"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Average Mood: {getAverageMood().toFixed(1)}/5 ({moodEntries.length} entries)
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recent Entries</h4>
                {recentEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No mood entries yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{moodEmojis[entry.mood].emoji}</span>
                          <span className="text-sm">{format(entry.date, "MMM d")}</span>
                        </div>
                        <div className="flex gap-1 text-xs">
                          <Badge variant="outline">E: {entry.energy}</Badge>
                          <Badge variant="outline">S: {entry.stress}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
