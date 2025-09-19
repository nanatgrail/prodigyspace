"use client";

import { useState, useEffect } from "react";
import type { WaterIntake } from "@/types/utilities";
import { storage } from "@/lib/storage";

export function useWaterTracker() {
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2000); // 2L default

  useEffect(() => {
    const savedIntakes = storage.getItem<WaterIntake[]>("water-intakes") || [];
    const savedGoal = storage.getItem<number>("daily-water-goal") || 2000;
    setWaterIntakes(savedIntakes);
    setDailyGoal(savedGoal);
  }, []);

  const addWaterIntake = (amount: number) => {
    const newIntake: WaterIntake = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date(),
    };
    const updated = [...waterIntakes, newIntake];
    setWaterIntakes(updated);
    storage.setItem("water-intakes", updated);
  };

  const removeWaterIntake = (id: string) => {
    const updated = waterIntakes.filter((intake) => intake.id !== id);
    setWaterIntakes(updated);
    storage.setItem("water-intakes", updated);
  };

  const updateDailyGoal = (goal: number) => {
    setDailyGoal(goal);
    storage.setItem("daily-water-goal", goal);
  };

  const getTodayIntake = () => {
    const today = new Date().toDateString();
    return waterIntakes
      .filter((intake) => new Date(intake.timestamp).toDateString() === today)
      .reduce((total, intake) => total + intake.amount, 0);
  };

  const getTodayIntakes = () => {
    const today = new Date().toDateString();
    return waterIntakes.filter(
      (intake) => new Date(intake.timestamp).toDateString() === today
    );
  };

  return {
    waterIntakes,
    dailyGoal,
    addWaterIntake,
    removeWaterIntake,
    updateDailyGoal,
    getTodayIntake,
    getTodayIntakes,
  };
}
