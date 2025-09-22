"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Calendar, Activity, Brain, Heart } from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import type { MoodEntry, MeditationSession } from "@/types/wellbeing";

interface InsightsDashboardProps {
  moodEntries: MoodEntry[];
  meditationSessions: MeditationSession[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const getTimeRangeData = (
  days: number,
  moodEntries: MoodEntry[],
  meditationSessions: MeditationSession[]
) => {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  // Filter data within the time range
  const filteredMoodEntries = moodEntries.filter(
    (entry) =>
      new Date(entry.date) >= startDate && new Date(entry.date) <= endDate
  );

  const filteredMeditationSessions = meditationSessions.filter(
    (session) =>
      new Date(session.completedAt) >= startDate &&
      new Date(session.completedAt) <= endDate
  );

  return { filteredMoodEntries, filteredMeditationSessions };
};

const prepareMoodData = (moodEntries: MoodEntry[]) => {
  // Group by date and calculate average mood
  const moodByDate: Record<
    string,
    { date: string; mood: number; count: number }
  > = {};

  moodEntries.forEach((entry) => {
    const dateStr = format(new Date(entry.date), "MMM dd");
    if (!moodByDate[dateStr]) {
      moodByDate[dateStr] = { date: dateStr, mood: 0, count: 0 };
    }
    moodByDate[dateStr].mood += entry.mood;
    moodByDate[dateStr].count += 1;
  });

  return Object.values(moodByDate).map((item) => ({
    date: item.date,
    mood: parseFloat((item.mood / item.count).toFixed(1)),
  }));
};

const prepareMeditationData = (meditationSessions: MeditationSession[]) => {
  // Group by date and calculate total minutes
  const minutesByDate: Record<string, { date: string; minutes: number }> = {};

  meditationSessions.forEach((session) => {
    const dateStr = format(new Date(session.completedAt), "MMM dd");
    if (!minutesByDate[dateStr]) {
      minutesByDate[dateStr] = { date: dateStr, minutes: 0 };
    }
    minutesByDate[dateStr].minutes += session.duration;
  });

  return Object.values(minutesByDate);
};

const prepareMeditationTypeData = (meditationSessions: MeditationSession[]) => {
  const typeCount: Record<string, number> = {
    mindfulness: 0,
    "body-scan": 0,
    "loving-kindness": 0,
    breathing: 0,
  };

  meditationSessions.forEach((session) => {
    typeCount[session.type] = (typeCount[session.type] || 0) + 1;
  });

  return Object.entries(typeCount)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));
};

export function InsightsDashboard({
  moodEntries,
  meditationSessions,
}: InsightsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const { filteredMoodEntries, filteredMeditationSessions } = getTimeRangeData(
    timeRange === "week" ? 7 : 30,
    moodEntries,
    meditationSessions
  );

  const moodData = prepareMoodData(filteredMoodEntries);
  const meditationData = prepareMeditationData(filteredMeditationSessions);
  const meditationTypeData = prepareMeditationTypeData(
    filteredMeditationSessions
  );

  // Calculate statistics
  const totalMoodEntries = filteredMoodEntries.length;
  const averageMood =
    totalMoodEntries > 0
      ? parseFloat(
          (
            filteredMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
            totalMoodEntries
          ).toFixed(1)
        )
      : 0;

  const totalMeditationMinutes = filteredMeditationSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const avgMeditationDuration =
    filteredMeditationSessions.length > 0
      ? parseFloat(
          (totalMeditationMinutes / filteredMeditationSessions.length).toFixed(
            1
          )
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Well-being Insights</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "week"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "month"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mood Entries</p>
                <p className="text-2xl font-bold">{totalMoodEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Mood</p>
                <p className="text-2xl font-bold">{averageMood}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meditation</p>
                <p className="text-2xl font-bold">{totalMeditationMinutes}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Session</p>
                <p className="text-2xl font-bold">{avgMeditationDuration}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meditation Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meditationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Meditation Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={meditationTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent as number) * 100).toFixed(0)}%`
                    }
                  >
                    {meditationTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
