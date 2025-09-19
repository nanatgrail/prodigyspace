export interface MoodEntry {
  id: string
  date: Date
  mood: 1 | 2 | 3 | 4 | 5
  energy: 1 | 2 | 3 | 4 | 5
  stress: 1 | 2 | 3 | 4 | 5
  notes?: string
  activities: string[]
}

export interface MeditationSession {
  id: string
  type: "breathing" | "mindfulness" | "body-scan" | "loving-kindness"
  duration: number
  completedAt: Date
  rating?: 1 | 2 | 3 | 4 | 5
}

export interface BreathingExercise {
  id: string
  name: string
  description: string
  inhale: number
  hold: number
  exhale: number
  cycles: number
}

export interface StressReliefActivity {
  id: string
  name: string
  description: string
  duration: number
  category: "physical" | "mental" | "creative" | "social"
  difficulty: "easy" | "medium" | "hard"
}

export interface FocusSession {
  id: string
  technique: "pomodoro" | "deep-work" | "time-blocking"
  duration: number
  startTime: Date
  endTime?: Date
  completed: boolean
  distractions: number
  productivity: 1 | 2 | 3 | 4 | 5
}

export interface WellbeingGoal {
  id: string
  title: string
  description: string
  category: "mood" | "stress" | "focus" | "sleep" | "exercise"
  target: number
  current: number
  unit: string
  deadline: Date
  createdAt: Date
}
