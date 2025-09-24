/**
 * @file src/components/profile/BMIBMRCalculator/hooks/useBMICalculator.ts
 * @description Hook לחישוב BMI/BMR - הפרדת לוגיקה מ-UI
 */

import { useState, useCallback } from "react";
import { Alert } from "react-native";
// טיפוסים מקומיים עד שיהיו זמינים במקום אחר
interface BMIBMRResults {
  bmi: number;
  bmr: number;
  bmiCategory: string;
  tdee?: number;
  idealWeight?: { min: number; max: number };
  recommendedCaloriesRange: { min: number; max: number };
}

interface BMIBMRHistory {
  date: string;
  results: BMIBMRResults;
}

interface BMIBMRData {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
}

export const useBMICalculator = (initialHistory: BMIBMRHistory[] = []) => {
  const [results, setResults] = useState<BMIBMRResults | null>(null);
  const [history, setHistory] = useState<BMIBMRHistory[]>(initialHistory);

  const calculateResults = useCallback((data: BMIBMRData): BMIBMRResults => {
    const { weight, height, age, gender, activityLevel } = data;

    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // BMI Category
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "תת משקל";
    else if (bmi < 25) bmiCategory = "משקל תקין";
    else if (bmi < 30) bmiCategory = "עודף משקל";
    else bmiCategory = "השמנה";

    // BMR Calculation (Mifflin-St Jeor Equation)
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    // TDEE Calculation
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const tdee = bmr * activityMultipliers[activityLevel];

    // Ideal Weight Range
    const heightInMetersSquared = heightInMeters * heightInMeters;
    const idealWeight = {
      min: Math.round(18.5 * heightInMetersSquared),
      max: Math.round(24.9 * heightInMetersSquared),
    };

    const calculatedResults = {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      idealWeight,
      recommendedCaloriesRange: {
        min: Math.round(tdee * 0.8),
        max: Math.round(tdee * 1.2),
      },
    };

    setResults(calculatedResults);
    return calculatedResults;
  }, []);

  const validateAndCalculate = useCallback(
    (formData: BMIBMRData) => {
      // Validation
      if (!formData.weight || !formData.height || !formData.age) {
        Alert.alert("שגיאה", "אנא מלא את כל השדות הנדרשים");
        return null;
      }

      if (formData.weight < 30 || formData.weight > 300) {
        Alert.alert("שגיאה", 'משקל חייב להיות בין 30-300 ק"ג');
        return null;
      }

      if (formData.height < 100 || formData.height > 250) {
        Alert.alert("שגיאה", 'גובה חייב להיות בין 100-250 ס"מ');
        return null;
      }

      if (formData.age < 10 || formData.age > 120) {
        Alert.alert("שגיאה", "גיל חייב להיות בין 10-120 שנים");
        return null;
      }

      const newResults = calculateResults(formData);

      // Save to history
      const newHistoryEntry: BMIBMRHistory = {
        date:
          new Date().toISOString().split("T")[0] || new Date().toISOString(),
        results: newResults,
      };

      const updatedHistory = [newHistoryEntry, ...history.slice(0, 9)];
      setHistory(updatedHistory);

      return { results: newResults, history: updatedHistory };
    },
    [calculateResults, history]
  );

  return {
    results,
    history,
    calculateResults,
    validateAndCalculate,
    setHistory,
  };
};
