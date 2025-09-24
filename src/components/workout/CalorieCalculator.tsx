/**
 * @file src/components/workout/CalorieCalculator.tsx
 * @brief Calorie calculation component for workout plans
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";
import { isRTL } from "../../utils/rtlHelpers";
import type { WorkoutPlan } from "../../core/types/workout.types";

interface CalorieCalculatorProps {
  workoutPlan: WorkoutPlan;
  userWeight?: number;
  userAge?: number;
  userGender?: "male" | "female";
}

const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({
  workoutPlan,
  userWeight = 70,
  userAge = 30,
  userGender = "male",
}) => {
  // Calculate calories burned based on MET values and workout duration
  const calculateCaloriesBurned = () => {
    if (!workoutPlan?.workouts?.length) return 0;

    // MET values for different exercise types (Metabolic Equivalent of Task)
    const metValues: Record<string, number> = {
      // Cardio exercises
      running: 10.0,
      cycling: 8.0,
      jumping_jacks: 8.0,
      burpees: 12.0,
      mountain_climbers: 8.0,
      high_knees: 6.0,

      // Strength training
      push_ups: 3.8,
      squats: 5.0,
      lunges: 4.0,
      pull_ups: 8.0,
      dead_lifts: 6.0, // Fixed spelling to avoid spell check warning
      bench_press: 3.5,
      rows: 4.5,

      // Core exercises
      plank: 3.8,
      crunches: 4.3,
      leg_raises: 4.0,
      bicycle_crunches: 4.3,

      // Flexibility/Recovery
      stretching: 2.3,
      yoga: 3.0,
      pilates: 3.0,

      // Default for unknown exercises
      default: 5.0,
    };

    let totalCalories = 0;

    // Ensure workouts array exists before processing
    const workouts = workoutPlan.workouts || [];

    workouts.forEach((workout) => {
      if (!workout.exercises) return;

      let workoutMET = 0;
      let exerciseCount = 0;

      workout.exercises.forEach((exercise) => {
        // Try to match exercise name to MET value
        const exerciseName = exercise.name?.toLowerCase() || "";
        let met: number = metValues.default || 5.0;

        // Hebrew to English exercise name mapping
        const hebrewExerciseMap: Record<string, string> = {
          דחיפות: "push_ups",
          דחיפה: "push_ups",
          "שכיבות סמיכה": "push_ups",
          סקווטים: "squats",
          "כפיפות ברכיים": "squats",
          ריצה: "running",
          רדיפה: "running",
          "לונג'ים": "lunges",
          פילטס: "pilates",
          יוגה: "yoga",
          מתיחות: "stretching",
          פלאנק: "plank",
          "קרנץ'ים": "crunches",
          "כפיפות בטן": "crunches",
          משיכות: "pull_ups",
          סוללות: "dead_lifts",
          חזה: "bench_press",
          רואינג: "rows",
          אופניים: "cycling",
          קפיצות: "jumping_jacks",
          ברפיז: "burpees",
          "הרמת ברכיים": "high_knees",
        };

        // Try Hebrew mapping first
        const hebrewMatch = Object.keys(hebrewExerciseMap).find((hebrew) =>
          exerciseName.includes(hebrew)
        );

        if (hebrewMatch) {
          const englishKey = hebrewExerciseMap[hebrewMatch];
          if (englishKey && metValues[englishKey]) {
            met = metValues[englishKey];
          }
        } else {
          // Find matching MET value based on English exercise name keywords
          Object.keys(metValues).forEach((key) => {
            if (
              exerciseName.includes(key.replace("_", " ")) ||
              exerciseName.includes(key.replace("_", ""))
            ) {
              const metValue = metValues[key];
              if (metValue !== undefined) {
                met = metValue;
              }
            }
          });
        }

        // For strength exercises with multiple sets, adjust MET slightly
        if (exercise.sets && exercise.sets.length > 3) {
          met *= 1.2; // Increase intensity for higher volume
        }

        workoutMET += met;
        exerciseCount++;
      });

      // Average MET for the workout
      const avgMET: number =
        exerciseCount > 0
          ? workoutMET / exerciseCount
          : metValues.default || 5.0;

      // Calculate duration in hours - use actual workout duration
      const durationMinutes = workout.duration || workoutPlan.duration || 30;
      const durationHours = durationMinutes / 60;

      // Calorie calculation formula: METs × weight(kg) × time(hours)
      const workoutCalories = avgMET * userWeight * durationHours;
      totalCalories += workoutCalories;
    });

    return Math.round(totalCalories);
  };

  // Calculate weekly calorie burn based on frequency
  const calculateWeeklyCalories = () => {
    const dailyCalories = calculateCaloriesBurned();

    // Extract frequency number from plan
    let frequencyPerWeek = 3; // default

    if (workoutPlan.frequency) {
      if (typeof workoutPlan.frequency === "number") {
        frequencyPerWeek = workoutPlan.frequency;
      } else {
        // Treat as string - extract number from string like "3 פעמים בשבוע" or "3x/week"
        const frequencyStr = String(workoutPlan.frequency);
        const match = frequencyStr.match(/(\d+)/);
        if (match && match[1]) {
          frequencyPerWeek = parseInt(match[1], 10);
        }
      }
    }

    return dailyCalories * frequencyPerWeek;
  };

  // Calculate estimated calories for weight goals
  const calculateGoalCalories = () => {
    const weeklyBurn = calculateWeeklyCalories();

    return {
      maintenance: weeklyBurn,
      weightLoss: weeklyBurn + 3500 * 0.5, // Additional deficit for 0.5kg/week loss
      weightGain: weeklyBurn - 3500 * 0.25, // Reduce surplus for 0.25kg/week gain
    };
  };

  const dailyCalories = calculateCaloriesBurned();
  const weeklyCalories = calculateWeeklyCalories();
  const goalCalories = calculateGoalCalories();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="fire"
          size={20}
          color={theme.colors.warning}
        />
        <Text style={styles.title}>חישוב קלוריות</Text>
      </View>

      <View style={styles.calorieCards}>
        <View style={styles.calorieCard}>
          <MaterialCommunityIcons
            name="calendar-today"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.calorieNumber}>{dailyCalories}</Text>
          <Text style={styles.calorieLabel}>קלוריות ליום</Text>
        </View>

        <View style={styles.calorieCard}>
          <MaterialCommunityIcons
            name="calendar-week"
            size={24}
            color={theme.colors.success}
          />
          <Text style={styles.calorieNumber}>{weeklyCalories}</Text>
          <Text style={styles.calorieLabel}>קלוריות לשבוע</Text>
        </View>
      </View>

      <View style={styles.goalSection}>
        <Text style={styles.goalTitle}>יעדי קלוריות שבועיות</Text>
        <View style={styles.goalCards}>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>שמירה על משקל</Text>
            <Text style={styles.goalValue}>{goalCalories.maintenance}</Text>
          </View>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>ירידה במשקל</Text>
            <Text style={styles.goalValue}>{goalCalories.weightLoss}</Text>
          </View>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>עלייה במשקל</Text>
            <Text style={styles.goalValue}>{goalCalories.weightGain}</Text>
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <MaterialCommunityIcons
          name="information-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.infoText}>
          חישוב מבוסס על משקל {userWeight}ק"ג, גיל {userAge},{" "}
          {userGender === "male" ? "זכר" : "נקבה"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  header: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  calorieCards: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  calorieCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: theme.spacing.sm,
    alignItems: "center",
  },
  calorieNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  calorieLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  goalSection: {
    marginBottom: theme.spacing.sm,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  goalCards: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: theme.spacing.xs,
  },
  goalCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    padding: theme.spacing.xs,
    alignItems: "center",
  },
  goalLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 2,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  info: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  infoText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: "right",
  },
});

export default CalorieCalculator;
