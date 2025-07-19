/**
 * @file src/screens/workout/ActiveWorkoutScreen.tsx
 * @description מסך אימון פעיל - Active Workout screen UI & mock data
 * @author GYMovoo
 * עברית: מסך דמו ראשוני לאימון פעיל עם תצוגת סטים, היסטוריה, וניווט בסיסי.
 * English: Demo screen for active workout, includes sets, last performance, and basic navigation.
 */

import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

// אם יצרת theme.ts ו-rtl.ts תייבא אותם, אחרת תוכל להעתיק קוד סטיילינג בהמשך

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
              <Text style={styles.number}>{`${item.weight} ק"ג`}</Text>
              <Text style={styles.number}>{`${item.reps} חזרות`}</Text>
            </View>
          )}
        />
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>
        <View style={styles.navButtons}>
          <Button title="הקודם" onPress={() => {}} />
          <Button title="הבא" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 24,
    textAlign: "right",
    writingDirection: "rtl",
  },
  exerciseCard: {
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    textAlign: "right",
    writingDirection: "rtl",
  },
  lastPerf: {
    fontSize: 13,
    color: "#5856D6",
    marginBottom: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  setRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  setText: {
    textAlign: "right",
    writingDirection: "rtl",
    fontSize: 16,
    fontWeight: "500",
  },
  number: {
    textAlign: "left",
    writingDirection: "ltr",
    fontSize: 16,
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginVertical: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    width: "33%",
    height: "100%",
    backgroundColor: "#007AFF",
  },
  navButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
