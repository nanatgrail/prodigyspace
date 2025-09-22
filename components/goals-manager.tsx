"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Target as TargetIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WellbeingGoal } from "@/types/wellbeing";

interface GoalsManagerProps {
  goals: WellbeingGoal[];
  onAddGoal: (goal: Omit<WellbeingGoal, "id" | "createdAt">) => void;
  onUpdateProgress: (goalId: string, progress: number) => void;
}

const goalCategories = [
  { value: "mood", label: "Mood" },
  { value: "stress", label: "Stress Management" },
  { value: "focus", label: "Focus & Concentration" },
  { value: "sleep", label: "Sleep Quality" },
  { value: "exercise", label: "Physical Activity" },
];

export function GoalsManager({
  goals,
  onAddGoal,
  onUpdateProgress,
}: GoalsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<WellbeingGoal["category"]>("mood");
  const [target, setTarget] = useState(10);
  const [current, setCurrent] = useState(0);
  const [unit, setUnit] = useState("sessions");
  const [deadline, setDeadline] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && target > 0 && deadline) {
      onAddGoal({
        title,
        description,
        category,
        target,
        current: 0,
        unit,
        deadline,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("mood");
      setTarget(10);
      setUnit("sessions");
      setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setShowAddForm(false);
    }
  };

  const handleProgressUpdate = (goalId: string, increment: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      const newProgress = Math.min(goal.current + increment, goal.target);
      onUpdateProgress(goalId, newProgress);
    }
  };

  const getProgressPercentage = (goal: WellbeingGoal) => {
    return Math.round((goal.current / goal.target) * 100);
  };

  const isGoalCompleted = (goal: WellbeingGoal) => {
    return goal.current >= goal.target;
  };

  const isGoalOverdue = (goal: WellbeingGoal) => {
    return new Date() > new Date(goal.deadline) && !isGoalCompleted(goal);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Well-being Goals</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? "Cancel" : "Add Goal"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Meditate for 10 days"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value: WellbeingGoal["category"]) =>
                      setCategory(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    type="number"
                    min="1"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., sessions, minutes, days"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? (
                          format(deadline, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Goal
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <TargetIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first well-being goal to get started.
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className={isGoalOverdue(goal) ? "border-red-500" : ""}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {
                      goalCategories.find((c) => c.value === goal.category)
                        ?.label
                    }
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {goal.current} of {goal.target} {goal.unit}
                    </span>
                    <span>{getProgressPercentage(goal)}%</span>
                  </div>
                  <Progress value={getProgressPercentage(goal)} />
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Deadline: {format(new Date(goal.deadline), "MMM d, yyyy")}
                  </span>
                  <span>
                    Created: {format(new Date(goal.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                {!isGoalCompleted(goal) && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleProgressUpdate(goal.id, 1)}
                      disabled={isGoalCompleted(goal)}
                    >
                      +1 {goal.unit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProgressUpdate(goal.id, 5)}
                      disabled={isGoalCompleted(goal)}
                    >
                      +5 {goal.unit}
                    </Button>
                  </div>
                )}

                {isGoalCompleted(goal) && (
                  <div className="text-sm text-green-600 font-medium">
                    Goal completed! 🎉
                  </div>
                )}

                {isGoalOverdue(goal) && !isGoalCompleted(goal) && (
                  <div className="text-sm text-red-600 font-medium">
                    Goal overdue!
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
