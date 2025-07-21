/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @description מסך אימון פעיל - Active Workout screen UI & mock data
 * @author GYMovoo
 * עברית: מסך דמו לאימון פעיל עם תצוגת סטים, היסטוריה, וניווט בסיסי.
 * English: Demo screen for active workout, includes sets, last performance, and basic navigation.
 */
// cspell:ignore סקוואט

import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { theme } from "../../styles/theme"; // שימוש ב-theme לאחידות

// נתוני דמו
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
  // כאן תוכל להוסיף בעתיד לוגיקה לניווט בין תרגילים
  // למשל, באמצעות useState ו-useContext
  const handleNext = () => {
    console.log("מעבר לתרגיל הבא");
  };

  const handlePrev = () => {
    console.log("חזרה לתרגיל הקודם");
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
          keyExtractor={(item) => `${item.number}`}
          renderItem={({ item }) => (
            <View style={styles.setRow}>
              <Text style={styles.setText}>{`סט ${item.number}`}</Text>
              <Text style={styles.numberText}>{`${item.weight} ק"ג`}</Text>
              <Text style={styles.numberText}>{`${item.reps} חזרות`}</Text>
            </View>
          )}
        />
        <View style={styles.progressBarContainer}>
          {/* רוחב הפס יחושב דינמית לפי ההתקדמות באימון */}
          <View style={[styles.progressBarFill, { width: "33%" }]} />
        </View>
        <View style={styles.navButtons}>
          <Button
            title="הקודם"
            onPress={handlePrev}
            color={theme.colors.primary}
          />
          <Button
            title="הבא"
            onPress={handleNext}
            color={theme.colors.primary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // שימוש בצבע מה-theme
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary, // שימוש בצבע מה-theme
    marginBottom: 24,
    textAlign: "right",
    writingDirection: "rtl",
  },
  exerciseCard: {
    backgroundColor: theme.colors.card, // שימוש בצבע מה-theme
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.medium, // הוספת צל מה-theme
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.text, // שימוש בצבע מה-theme
    marginBottom: 8,
    textAlign: "right",
    writingDirection: "rtl",
  },
  lastPerf: {
    fontSize: 13,
    color: theme.colors.accent, // שימוש בצבע מה-theme
    marginBottom: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  setRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
    backgroundColor: theme.colors.background, // שימוש בצבע מה-theme
    borderRadius: 8,
  },
  setText: {
    textAlign: "right",
    writingDirection: "rtl",
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
  },
  numberText: {
    textAlign: "left",
    writingDirection: "ltr",
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.divider, // שימוש בצבע מה-theme
    borderRadius: 6,
    marginVertical: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary, // שימוש בצבע מה-theme
  },
  navButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
