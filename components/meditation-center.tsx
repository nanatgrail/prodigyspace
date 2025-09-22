"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  Brain,
  Waves,
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
import type { MeditationSession, BreathingExercise } from "@/types/wellbeing";

interface MeditationCenterProps {
  sessions: MeditationSession[];
  onAddSession: (session: Omit<MeditationSession, "id">) => void;
}

const breathingExercises: BreathingExercise[] = [
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "Calming technique for stress relief and better sleep",
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal breathing for focus and concentration",
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 6,
  },
  {
    id: "triangle",
    name: "Triangle Breathing",
    description: "Simple technique for beginners",
    inhale: 4,
    hold: 0,
    exhale: 4,
    cycles: 8,
  },
];

const guidedMeditations = [
  {
    type: "mindfulness" as const,
    name: "Mindfulness Meditation",
    description: "Focus on the present moment",
    icon: Brain,
    durations: [5, 10, 15, 20],
  },
  {
    type: "body-scan" as const,
    name: "Body Scan",
    description: "Progressive relaxation technique",
    icon: Waves,
    durations: [10, 15, 20, 30],
  },
  {
    type: "loving-kindness" as const,
    name: "Loving Kindness",
    description: "Cultivate compassion and kindness",
    icon: Heart,
    durations: [10, 15, 20],
  },
];

export function MeditationCenter({
  sessions,
  onAddSession,
}: MeditationCenterProps) {
  const [activeExercise, setActiveExercise] =
    useState<BreathingExercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Guided meditation states
  const [activeMeditation, setActiveMeditation] = useState<{
    type: MeditationSession["type"];
    duration: number;
  } | null>(null);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0);
  const [isMeditationRunning, setIsMeditationRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const meditationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && activeExercise && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && activeExercise && timeLeft === 0) {
      // Move to next phase
      if (phase === "inhale") {
        if (activeExercise.hold > 0) {
          setPhase("hold");
          setTimeLeft(activeExercise.hold);
        } else {
          setPhase("exhale");
          setTimeLeft(activeExercise.exhale);
        }
      } else if (phase === "hold") {
        setPhase("exhale");
        setTimeLeft(activeExercise.exhale);
      } else if (phase === "exhale") {
        const nextCycle = currentCycle + 1;
        if (nextCycle < activeExercise.cycles) {
          setCurrentCycle(nextCycle);
          setPhase("inhale");
          setTimeLeft(activeExercise.inhale);
        } else {
          // Exercise complete
          setIsRunning(false);
          if (sessionStartTime) {
            const duration = Math.round(
              (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60
            );
            onAddSession({
              type: "breathing",
              duration,
              completedAt: new Date(),
            });
          }
          setActiveExercise(null);
          setCurrentCycle(0);
          setPhase("inhale");
        }
      }
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    phase,
    currentCycle,
    activeExercise,
    sessionStartTime,
    onAddSession,
  ]);

  // Handle guided meditation timer
  useEffect(() => {
    if (isMeditationRunning && activeMeditation && meditationTimeLeft > 0) {
      meditationIntervalRef.current = setInterval(() => {
        setMeditationTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (
      isMeditationRunning &&
      activeMeditation &&
      meditationTimeLeft === 0
    ) {
      // Meditation complete
      finishMeditation();
    }

    return () => {
      if (meditationIntervalRef.current) {
        clearInterval(meditationIntervalRef.current);
      }
    };
  }, [isMeditationRunning, activeMeditation, meditationTimeLeft]);

  const startBreathingExercise = (exercise: BreathingExercise) => {
    setActiveExercise(exercise);
    setCurrentCycle(0);
    setPhase("inhale");
    setTimeLeft(exercise.inhale);
    setIsRunning(true);
    setSessionStartTime(new Date());
  };

  const pauseExercise = () => {
    setIsRunning(!isRunning);
  };

  const resetExercise = () => {
    setIsRunning(false);
    setActiveExercise(null);
    setCurrentCycle(0);
    setPhase("inhale");
    setTimeLeft(0);
    setSessionStartTime(null);
  };

  const startGuidedMeditation = (
    type: MeditationSession["type"],
    duration: number
  ) => {
    setActiveMeditation({ type, duration });
    setMeditationTimeLeft(duration * 60);
    setIsMeditationRunning(true);
    setShowCompletion(false);
  };

  const pauseMeditation = () => {
    setIsMeditationRunning(!isMeditationRunning);
  };

  const resetMeditation = () => {
    setIsMeditationRunning(false);
    setActiveMeditation(null);
    setMeditationTimeLeft(0);
    if (meditationIntervalRef.current) {
      clearInterval(meditationIntervalRef.current);
    }
  };

  const finishMeditation = () => {
    setIsMeditationRunning(false);
    if (meditationIntervalRef.current) {
      clearInterval(meditationIntervalRef.current);
    }
    onAddSession({
      type: activeMeditation!.type,
      duration: activeMeditation!.duration,
      completedAt: new Date(),
    });
    setActiveMeditation(null);
    setShowCompletion(true);
    setTimeout(() => setShowCompletion(false), 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const averageRating =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.rating || 0), 0) / sessions.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalSessions}
            </div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalMinutes}
            </div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breathing Exercises */}
        <Card>
          <CardHeader>
            <CardTitle>Breathing Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {activeExercise ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">{activeExercise.name}</h3>
                <div className="text-6xl font-bold text-blue-600">
                  {timeLeft}
                </div>
                <div className="text-lg capitalize text-muted-foreground">
                  {phase}
                </div>
                <Progress
                  value={((currentCycle + 1) / activeExercise.cycles) * 100}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  Cycle {currentCycle + 1} of {activeExercise.cycles}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={pauseExercise} variant="outline">
                    {isRunning ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button onClick={resetExercise} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {breathingExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exercise.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              {exercise.inhale}s inhale
                            </Badge>
                            {exercise.hold > 0 && (
                              <Badge variant="outline">
                                {exercise.hold}s hold
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {exercise.exhale}s exhale
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => startBreathingExercise(exercise)}
                          size="sm"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guided Meditations */}
        <Card>
          <CardHeader>
            <CardTitle>Guided Meditations</CardTitle>
          </CardHeader>
          <CardContent>
            {activeMeditation ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">
                  {
                    guidedMeditations.find(
                      (m) => m.type === activeMeditation.type
                    )?.name
                  }
                </h3>
                <div className="text-6xl font-bold text-blue-600">
                  {formatTime(meditationTimeLeft)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {activeMeditation.duration} minute session
                </div>
                <Progress
                  value={
                    ((activeMeditation.duration * 60 - meditationTimeLeft) /
                      (activeMeditation.duration * 60)) *
                    100
                  }
                  className="w-full"
                />
                <div className="flex gap-2 justify-center">
                  <Button onClick={pauseMeditation} variant="outline">
                    {isMeditationRunning ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button onClick={resetMeditation} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button onClick={finishMeditation} variant="outline">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : showCompletion ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">
                  <Check className="h-12 w-12 text-green-500 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-green-600">
                  Session Complete!
                </h3>
                <p className="text-muted-foreground">
                  Great job on your meditation practice
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {guidedMeditations.map((meditation) => (
                  <Card
                    key={meditation.type}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <meditation.icon className="h-6 w-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium">{meditation.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {meditation.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {meditation.durations.map((duration) => (
                              <Button
                                key={duration}
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  startGuidedMeditation(
                                    meditation.type,
                                    duration
                                  )
                                }
                              >
                                {duration} min
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
