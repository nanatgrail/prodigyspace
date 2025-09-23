import { useState } from "react";

export function useConverter() {
  const [fromValue, setFromValue] = useState("");
  const [fromUnit, setFromUnit] = useState("bytes");
  const [toUnit, setToUnit] = useState("kb");

  // Conversion functions
  const convertDataUnits = (
    value: number,
    from: string,
    to: string
  ): number => {
    const units: Record<string, number> = {
      bits: 1,
      bytes: 8,
      kb: 8 * 1024,
      mb: 8 * 1024 * 1024,
      gb: 8 * 1024 * 1024 * 1024,
      tb: 8 * 1024 * 1024 * 1024 * 1024,
    };

    if (!units[from] || !units[to]) return 0;

    const bits = value * units[from];
    return bits / units[to];
  };

  const convertTimeUnits = (
    value: number,
    from: string,
    to: string
  ): number => {
    const units: Record<string, number> = {
      milliseconds: 1,
      seconds: 1000,
      minutes: 1000 * 60,
      hours: 1000 * 60 * 60,
      days: 1000 * 60 * 60 * 24,
    };

    if (!units[from] || !units[to]) return 0;

    const milliseconds = value * units[from];
    return milliseconds / units[to];
  };

  const convertLengthUnits = (
    value: number,
    from: string,
    to: string
  ): number => {
    const units: Record<string, number> = {
      mm: 1,
      cm: 10,
      m: 1000,
      km: 1000000,
      inch: 25.4,
      feet: 304.8,
      yard: 914.4,
      mile: 1609344,
    };

    if (!units[from] || !units[to]) return 0;

    const mm = value * units[from];
    return mm / units[to];
  };

  const convertTemperature = (
    value: number,
    from: string,
    to: string
  ): number => {
    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case "celsius":
        celsius = value;
        break;
      case "fahrenheit":
        celsius = ((value - 32) * 5) / 9;
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      default:
        return 0;
    }

    // Convert from Celsius to target unit
    switch (to) {
      case "celsius":
        return celsius;
      case "fahrenheit":
        return (celsius * 9) / 5 + 32;
      case "kelvin":
        return celsius + 273.15;
      default:
        return 0;
    }
  };

  const getResult = (): string => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) return "0";

    let result = 0;
    if (
      ["bytes", "bits", "kb", "mb", "gb", "tb"].includes(fromUnit) &&
      ["bytes", "bits", "kb", "mb", "gb", "tb"].includes(toUnit)
    ) {
      result = convertDataUnits(value, fromUnit, toUnit);
    } else if (
      ["milliseconds", "seconds", "minutes", "hours", "days"].includes(
        fromUnit
      ) &&
      ["milliseconds", "seconds", "minutes", "hours", "days"].includes(toUnit)
    ) {
      result = convertTimeUnits(value, fromUnit, toUnit);
    } else if (
      ["mm", "cm", "m", "km", "inch", "feet", "yard", "mile"].includes(
        fromUnit
      ) &&
      ["mm", "cm", "m", "km", "inch", "feet", "yard", "mile"].includes(toUnit)
    ) {
      result = convertLengthUnits(value, fromUnit, toUnit);
    } else if (
      ["celsius", "fahrenheit", "kelvin"].includes(fromUnit) &&
      ["celsius", "fahrenheit", "kelvin"].includes(toUnit)
    ) {
      result = convertTemperature(value, fromUnit, toUnit);
    } else {
      return "Invalid conversion";
    }

    // Format the result
    if (result === Math.floor(result)) {
      return result.toString();
    } else {
      return result.toFixed(4).replace(/\.?0+$/, "");
    }
  };

  return {
    fromValue,
    setFromValue,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    getResult,
  };
}
