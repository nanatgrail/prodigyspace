"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { useConverter } from "@/hooks/use-converter";
import { Calculator } from "lucide-react";
import { useState } from "react";

const unitCategories = [
  {
    id: "data",
    name: "Data",
    units: ["bits", "bytes", "kb", "mb", "gb", "tb"],
  },
  {
    id: "time",
    name: "Time",
    units: ["milliseconds", "seconds", "minutes", "hours", "days"],
  },
  {
    id: "length",
    name: "Length",
    units: ["mm", "cm", "m", "km", "inch", "feet", "yard", "mile"],
  },
  {
    id: "temperature",
    name: "Temperature",
    units: ["celsius", "fahrenheit", "kelvin"],
  },
];

export function UnitConverter() {
  const {
    fromValue,
    setFromValue,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    getResult,
  } = useConverter();

  const [category, setCategory] = useState("data");
  const currentCategory = unitCategories.find((cat) => cat.id === category);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Unit Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory?.units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory?.units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>

          <div className="space-y-2">
            <Label>Result</Label>
            <Input
              type="text"
              value={getResult()}
              readOnly
              placeholder="Result"
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Quick conversions for students: file sizes, time durations,
            measurements, and temperature.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
