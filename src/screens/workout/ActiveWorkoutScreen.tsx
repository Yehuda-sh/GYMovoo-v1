/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @brief מסך אימון פעיל - מציג אימון בזמן אמת עם נתונים מתוך המערכת
 * @dependencies react-native, @react-navigation/native, theme, userStore
 * @author GYMovoo
 * עברית: מסך אימון פעיל עם תצוגת סטים, היסטוריה, וניווט על בסיס נתוני המשתמש.
 * English: Active workout screen with sets, history, and navigation based on user data.
 */
// cspell:ignore סקוואט

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import BackButton from "../../components/common/BackButton";

// ממשק לתרגיל פעיל
interface ActiveExercise {
  name: string;
  sets: Array<{
    number: number;
    weight: number;
    reps: number;
    completed?: boolean;
  }>;
  lastPerformance?: string;
  instructions?: string[];
}

// פונקציה לקבלת נתוני התרגיל הפעיל
const getActiveExercise = (
  user: any,
  exerciseName?: string
): ActiveExercise => {
  // אם יש שם תרגיל ספציפי, נחפש אותו בהיסטוריה
  if (exerciseName && user?.activityHistory?.workouts) {
    const recentWorkouts = user.activityHistory.workouts.slice(0, 5); // 5 אימונים אחרונים

    for (const workout of recentWorkouts) {
      if (workout.exercises) {
        const exercise = workout.exercises.find(
          (ex: any) =>
            ex.name?.includes(exerciseName) ||
            ex.exerciseName?.includes(exerciseName)
        );

        if (exercise) {
          return {
            name: exercise.name || exercise.exerciseName || exerciseName,
            sets: exercise.sets || [
              {
                number: 1,
                weight: exercise.weight || 50,
                reps: exercise.reps || 8,
              },
              {
                number: 2,
                weight: exercise.weight || 50,
                reps: exercise.reps || 8,
              },
              {
                number: 3,
                weight: exercise.weight || 50,
                reps: exercise.reps || 6,
              },
            ],
            lastPerformance: `${exercise.reps || 8}x${exercise.weight || 50}kg (${new Date(workout.date).toLocaleDateString("he-IL")})`,
            instructions: exercise.instructions || [],
          };
        }
      }
    }
  }

  // נתוני דמו כגיבוי
  return {
    name: exerciseName || "סקוואט",
    sets: [
      { number: 1, weight: 50, reps: 8 },
      { number: 2, weight: 50, reps: 8 },
      { number: 3, weight: 50, reps: 6 },
    ],
    lastPerformance: "8x50kg (השבוע שעבר)",
  };
};

export default function ActiveWorkoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUserStore();
  const [currentSet, setCurrentSet] = useState(0);

  // קבלת שם התרגיל מה-route או ברירת מחדל
  const exerciseName = (route.params as any)?.exerciseName;

  // קבלת נתוני התרגיל הפעיל
  const activeExercise = getActiveExercise(user, exerciseName);

  // מעבר לתרגיל הבא
  // Navigate to next exercise
  const handleNext = () => {
    console.log("מעבר לתרגיל הבא");
    // TODO: לוגיקת מעבר לתרגיל הבא
    // TODO: Logic for next exercise
  };

  // חזרה לתרגיל הקודם
  // Navigate to previous exercise
  const handlePrev = () => {
    console.log("חזרה לתרגיל הקודם");
    // TODO: לוגיקת חזרה לתרגיל הקודם
    // TODO: Logic for previous exercise
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.header}>אימון A - רגליים</Text>

      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>{activeExercise.name}</Text>
        <Text style={styles.lastPerf}>
          תוצאה אחרונה: {activeExercise.lastPerformance}
        </Text>

        <FlatList
          data={activeExercise.sets}
          keyExtractor={(item) => `set-${item.number}`}
          renderItem={({ item }) => (
            <View style={styles.setRow}>
              <Text style={styles.setText}>סט {item.number}</Text>
              <View style={styles.setData}>
                <Text style={styles.numberText}>{item.weight} ק"ג</Text>
                <Text style={styles.separator}>×</Text>
                <Text style={styles.numberText}>{item.reps} חזרות</Text>
              </View>
            </View>
          )}
        />

        <View style={styles.progressBarContainer}>
          {/* רוחב הפס יחושב דינמית לפי ההתקדמות באימון */}
          {/* Progress bar width will be calculated dynamically */}
          <View style={[styles.progressBarFill, { width: "33%" }]} />
        </View>

        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>הבא</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={handlePrev}
          >
            <Text style={styles.navButtonText}>הקודם</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: "right",
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  exerciseName: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  lastPerf: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.accent,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  setRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
  },
  setText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "500",
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  setData: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 2,
    justifyContent: "flex-start",
  },
  numberText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.xs,
  },
  separator: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.xs,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.radius.sm,
    marginVertical: theme.spacing.md,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
  },
  navButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  navButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    minWidth: 100,
    alignItems: "center",
  },
  prevButton: {
    backgroundColor: theme.colors.secondary,
  },
  navButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
});
