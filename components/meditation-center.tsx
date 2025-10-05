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
  Check,
} from "lucide-react";
import type { MeditationSession, BreathingExercise } from "@/types/wellbeing";
import styles from "@styles/meditation-center.css";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className={styles.meditationContainer}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent className={styles.statCardContent}>
            <div className={`${styles.statValue} ${styles.statValueBlue}`}>
              {totalSessions}
            </div>
            <div className={styles.statLabel}>Sessions</div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent className={styles.statCardContent}>
            <div className={`${styles.statValue} ${styles.statValueGreen}`}>
              {totalMinutes}
            </div>
            <div className={styles.statLabel}>Minutes</div>
          </CardContent>
        </Card>
        <Card className={styles.statCard}>
          <CardContent className={styles.statCardContent}>
            <div className={`${styles.statValue} ${styles.statValuePurple}`}>
              {averageRating.toFixed(1)}
            </div>
            <div className={styles.statLabel}>Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      <div className={styles.mainGrid}>
        {/* Breathing Exercises */}
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              Breathing Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {activeExercise ? (
              <div className={styles.exerciseActiveContainer}>
                <h3 className={styles.exerciseName}>{activeExercise.name}</h3>
                <div className={styles.timeDisplay}>{timeLeft}</div>
                <div className={styles.phaseDisplay}>{phase}</div>
                <div className={styles.progressContainer}>
                  <Progress
                    value={((currentCycle + 1) / activeExercise.cycles) * 100}
                    className={styles.progressBar}
                  />
                </div>
                <div className={styles.cycleInfo}>
                  Cycle {currentCycle + 1} of {activeExercise.cycles}
                </div>
                <div className={styles.controlsContainer}>
                  <Button
                    onClick={pauseExercise}
                    variant="outline"
                    className={styles.controlButton}
                  >
                    {isRunning ? (
                      <Pause className={styles.buttonIcon} />
                    ) : (
                      <Play className={styles.buttonIcon} />
                    )}
                  </Button>
                  <Button
                    onClick={resetExercise}
                    variant="outline"
                    className={styles.controlButton}
                  >
                    <RotateCcw className={styles.buttonIcon} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.exercisesList}>
                {breathingExercises.map((exercise) => (
                  <Card key={exercise.id} className={styles.exerciseCard}>
                    <CardContent className={styles.exerciseCardContent}>
                      <div className={styles.exerciseHeader}>
                        <div className={styles.exerciseInfo}>
                          <h4 className={styles.exerciseName}>
                            {exercise.name}
                          </h4>
                          <p className={styles.exerciseDescription}>
                            {exercise.description}
                          </p>
                          <div className={styles.exerciseBadges}>
                            <Badge
                              variant="outline"
                              className={styles.exerciseBadge}
                            >
                              {exercise.inhale}s inhale
                            </Badge>
                            {exercise.hold > 0 && (
                              <Badge
                                variant="outline"
                                className={styles.exerciseBadge}
                              >
                                {exercise.hold}s hold
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={styles.exerciseBadge}
                            >
                              {exercise.exhale}s exhale
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => startBreathingExercise(exercise)}
                          size="sm"
                          className={styles.startButton}
                        >
                          <Play className={styles.buttonIcon} />
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
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              Guided Meditations
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {activeMeditation ? (
              <div className={styles.meditationActiveContainer}>
                <h3 className={styles.meditationName}>
                  {
                    guidedMeditations.find(
                      (m) => m.type === activeMeditation.type
                    )?.name
                  }
                </h3>
                <div className={styles.timeDisplay}>
                  {formatTime(meditationTimeLeft)}
                </div>
                <div className={styles.sessionInfo}>
                  {activeMeditation.duration} minute session
                </div>
                <div className={styles.progressContainer}>
                  <Progress
                    value={
                      ((activeMeditation.duration * 60 - meditationTimeLeft) /
                        (activeMeditation.duration * 60)) *
                      100
                    }
                    className={styles.progressBar}
                  />
                </div>
                <div className={styles.controlsContainer}>
                  <Button
                    onClick={pauseMeditation}
                    variant="outline"
                    className={styles.controlButton}
                  >
                    {isMeditationRunning ? (
                      <Pause className={styles.buttonIcon} />
                    ) : (
                      <Play className={styles.buttonIcon} />
                    )}
                  </Button>
                  <Button
                    onClick={resetMeditation}
                    variant="outline"
                    className={styles.controlButton}
                  >
                    <RotateCcw className={styles.buttonIcon} />
                  </Button>
                  <Button
                    onClick={finishMeditation}
                    variant="outline"
                    className={styles.controlButton}
                  >
                    <Check className={styles.buttonIcon} />
                  </Button>
                </div>
              </div>
            ) : showCompletion ? (
              <div className={styles.completionContainer}>
                <div className={styles.completionIcon}>
                  <Check className={styles.completionCheckIcon} />
                </div>
                <h3 className={styles.completionTitle}>Session Complete!</h3>
                <p className={styles.completionMessage}>
                  Great job on your meditation practice
                </p>
              </div>
            ) : (
              <div className={styles.meditationsList}>
                {guidedMeditations.map((meditation) => (
                  <Card key={meditation.type} className={styles.meditationCard}>
                    <CardContent className={styles.meditationCardContent}>
                      <div className={styles.meditationHeader}>
                        <meditation.icon className={styles.meditationIcon} />
                        <div className={styles.meditationInfo}>
                          <h4 className={styles.meditationName}>
                            {meditation.name}
                          </h4>
                          <p className={styles.meditationDescription}>
                            {meditation.description}
                          </p>
                          <div className={styles.durationButtons}>
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
                                className={styles.durationButton}
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
