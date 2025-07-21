/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @brief מסך אימון פעיל - Active Workout screen UI & mock data
 * @dependencies react-native, @react-navigation/native, theme
 * @author GYMovoo
 * עברית: מסך דמו לאימון פעיל עם תצוגת סטים, היסטוריה, וניווט בסיסי.
 * English: Demo screen for active workout, includes sets, last performance, and basic navigation.
 */
// cspell:ignore סקוואט

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";

// נתוני דמו
// Mock data
const MOCK_EXERCISE = {
  name: "סקוואט",
  sets: [
    { number: 1, weight: 50, reps: 8 },
    { number: 2, weight: 50, reps: 8 },
    { number: 3, weight: 50, reps: 6 },
  ],
  lastPerformance: "8x50kg (2024-07-15)",
};

export default function ActiveWorkoutScreen() {
  const navigation = useNavigation();

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
      <Text style={styles.header}>אימון A - רגליים</Text>

      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>{MOCK_EXERCISE.name}</Text>
        <Text style={styles.lastPerf}>
          תוצאה אחרונה: {MOCK_EXERCISE.lastPerformance}
        </Text>

        <FlatList
          data={MOCK_EXERCISE.sets}
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
    borderRadius: theme.borderRadius.lg,
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
    borderRadius: theme.borderRadius.md,
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
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.md,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
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
    borderRadius: theme.borderRadius.md,
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
