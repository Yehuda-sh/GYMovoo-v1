/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - עם תמיכה במשוב
 * @brief Workout history screen - with feedback support
 */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import {
  workoutHistoryService,
  WorkoutWithFeedback,
} from "../../services/workoutHistoryService";

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      console.log("📚 HistoryScreen - התחלת טעינת היסטוריה");
      console.log("📚 HistoryScreen - יש משתמש:", !!user);
      console.log(
        "📚 HistoryScreen - יש activityHistory:",
        !!user?.activityHistory
      );
      console.log(
        "📚 HistoryScreen - מספר אימונים:",
        user?.activityHistory?.workouts?.length || 0
      );

      // בדוק אם יש נתונים מדעיים חדשים
      if (
        user?.activityHistory?.workouts &&
        user.activityHistory.workouts.length > 0
      ) {
        console.log(
          "📚 HistoryScreen - טוען היסטוריה מדעית:",
          user.activityHistory.workouts.length,
          "אימונים"
        );

        // המר את הנתונים המדעיים לפורמט הנדרש
        const scientificWorkouts = user.activityHistory.workouts.map(
          (workout: any, index: number) => ({
            id: workout.id || `workout-${index}`,
            date: workout.date || workout.completedAt,
            name:
              workout.workoutName ||
              (workout.type === "strength" ? "אימון כח" : "אימון כללי"),
            duration: workout.duration || 45,
            exercises: workout.exercises || [],
            feedback: workout.feedback || {
              rating: workout.rating || 4,
              difficulty: "medium",
              mood: "😊",
              notes: workout.notes || "",
            },
          })
        );

        console.log(
          "📚 HistoryScreen - המרו",
          scientificWorkouts.length,
          "אימונים"
        );
        console.log("📚 HistoryScreen - דוגמה לאימון:", scientificWorkouts[0]);
        setWorkouts(scientificWorkouts);
      } else {
        // אם אין נתונים מדעיים, השתמש בשירות הישן
        console.log("📚 HistoryScreen - טוען מהשירות הישן");
        const historyData = await workoutHistoryService.getWorkoutHistory();
        console.log(
          "📚 HistoryScreen - נתונים מהשירות הישן:",
          historyData.length
        );
        setWorkouts(historyData);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDifficultyStars = (difficulty: number) => {
    return "⭐".repeat(difficulty);
  };

  const getFeelingEmoji = (feeling: string) => {
    const emojiMap: { [key: string]: string } = {
      challenging: "😤",
      strong: "💪",
      enjoyable: "😊",
      easy: "😴",
    };
    return emojiMap[feeling] || "😐";
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>
          {item.name || item.workout?.name || "אימון"}
        </Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.workoutDate}>
            {formatDate(item.date || item.feedback?.completedAt)}
          </Text>
          {(item.completedAt || item.startTime) && (
            <Text style={styles.workoutTime}>
              {formatTime(item.completedAt || item.startTime)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="clock"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {item.duration || item.stats?.duration || 45} דק'
          </Text>
        </View>

        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {item.exercises?.length || item.workout?.exercises?.length || 0}{" "}
            תרגילים
          </Text>
        </View>

        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {item.stats?.totalSets || 12}/{item.stats?.totalPlannedSets || 15}{" "}
            סטים
          </Text>
        </View>
      </View>

      <View style={styles.workoutFeedback}>
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>דירוג:</Text>
          <Text style={styles.feedbackValue}>
            {item.feedback?.rating || 4}⭐
          </Text>
        </View>

        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>הרגשה:</Text>
          <Text style={styles.feedbackValue}>
            {item.feedback?.mood || "😊"}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons
            name="loading"
            size={50}
            color={theme.colors.primary}
          />
          <Text style={styles.loadingText}>טוען היסטוריה...</Text>
        </View>
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="history"
            size={80}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>אין עדיין אימונים שמורים</Text>
          <Text style={styles.emptySubtitle}>
            לאחר סיום אימון, לחץ על "שמור אימון ומשוב"
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        היסטוריית אימונים ({workouts.length})
      </Text>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id}
        style={styles.workoutsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  workoutsList: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  workoutName: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  workoutDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  dateTimeContainer: {
    alignItems: "flex-end",
  },
  workoutTime: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    marginTop: 2,
  },
  workoutStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  workoutFeedback: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.textSecondary + "20",
  },
  feedbackItem: {
    alignItems: "center",
  },
  feedbackLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  feedbackValue: {
    fontSize: theme.typography.body.fontSize,
  },
});
