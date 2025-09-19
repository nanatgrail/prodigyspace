"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Minus, Settings } from "lucide-react"
import { useWaterTracker } from "@/hooks/use-water-tracker"

export function WaterTracker() {
  const { dailyGoal, addWaterIntake, removeWaterIntake, updateDailyGoal, getTodayIntake, getTodayIntakes } =
    useWaterTracker()

  const [customAmount, setCustomAmount] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [goalInput, setGoalInput] = useState(dailyGoal.toString())

  const todayIntake = getTodayIntake()
  const todayIntakes = getTodayIntakes()
  const progress = Math.min((todayIntake / dailyGoal) * 100, 100)

  const quickAmounts = [250, 500, 750, 1000]

  const handleCustomAdd = () => {
    const amount = Number.parseInt(customAmount)
    if (amount > 0) {
      addWaterIntake(amount)
      setCustomAmount("")
    }
  }

  const handleGoalUpdate = () => {
    const newGoal = Number.parseInt(goalInput)
    if (newGoal > 0) {
      updateDailyGoal(newGoal)
      setShowSettings(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          Water Tracker
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSettings && (
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <Label htmlFor="goal">Daily Goal (ml)</Label>
            <div className="flex gap-2">
              <Input id="goal" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="2000" />
              <Button onClick={handleGoalUpdate}>Save</Button>
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-blue-600">
            {todayIntake}ml / {dailyGoal}ml
          </div>
          <Progress value={progress} className="h-3" />
          <div className="text-sm text-muted-foreground">
            {progress >= 100 ? "Goal achieved! 🎉" : `${dailyGoal - todayIntake}ml remaining`}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Quick Add</Label>
          <div className="grid grid-cols-2 gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => addWaterIntake(amount)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {amount}ml
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Custom Amount</Label>
          <div className="flex gap-2">
            <Input
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount in ml"
              type="number"
            />
            <Button onClick={handleCustomAdd}>Add</Button>
          </div>
        </div>

        {todayIntakes.length > 0 && (
          <div className="space-y-2">
            <Label>Today's Intake</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {todayIntakes
                .slice(-5)
                .reverse()
                .map((intake) => (
                  <div key={intake.id} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                    <span>
                      {intake.amount}ml at {new Date(intake.timestamp).toLocaleTimeString()}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => removeWaterIntake(intake.id)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
