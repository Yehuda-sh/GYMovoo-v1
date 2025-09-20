/**
 * @file WorkoutSummaryScreen.tsx
 * @description מסך סיכום אימון מותאם - מציג סטטיסטיקות ושמירה פשוטה
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { WorkoutSummaryData } from "../../../../navigation/types";

import { theme } from "../../../../core/theme";
import { ErrorBoundary } from "../../../../components/common/ErrorBoundary";
import AppButton from "../../../../components/common/AppButton";
import { formatDuration, formatWeight } from "../../../../utils/formatters";
import workoutFacadeService from "../../../../services/workout/workoutFacadeService";
import { useUserStore } from "../../../../stores/userStore";
import { isRTL } from "../../../../utils/rtlHelpers";

interface RouteParams {
  workoutData: WorkoutSummaryData;
}

const WorkoutSummaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workoutData } = route.params as RouteParams;
  const { user, updateUser } = useUserStore();

  const [fadeAnim] = useState(new Animated.Value(0));

  // פונקציה לחישוב רצף פשוט (מניח שהאימון החדש הוא מהיום)
  const calculateNewStreak = async (): Promise<number> => {
    try {
      const history = await workoutFacadeService.getHistoryForList();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // אם אין היסטוריה, זה האימון הראשון
      if (history.length === 0) return 1;

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // מיון לפי תאריך (החדש ביותר קודם)
      const sortedHistory = history.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // מונה רצף
      let streak = 1; // האימון הנוכחי
      let checkDate = new Date(yesterday);

      for (const workout of sortedHistory) {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);

        // אם האימון הוא מהיום שאנחנו בודקים
        if (workoutDate.getTime() === checkDate.getTime()) {
          streak++;
          checkDate = new Date(checkDate);
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (workoutDate.getTime() < checkDate.getTime()) {
          // אם יש פער של יותר מיום אחד, הרצף נגמר
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error("Error calculating streak:", error);
      return 1; // ברירת מחדל
    }
  };

  useEffect(() => {
    // אנימציה פשוטה של כניסה
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // הפעלת רטט הצלחה
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [fadeAnim]);

  const handleSaveWorkout = async () => {
    try {
      // שמירת האימון עם נתונים בסיסיים בלבד
      await workoutFacadeService.saveWorkout({
        id: `workout_${Date.now()}`,
        workout: {
          id: `workout_${Date.now()}`,
          name: workoutData.workoutName,
          startTime: new Date(
            Date.now() - workoutData.totalDuration * 60 * 1000
          ).toISOString(),
          duration: workoutData.totalDuration,
          totalVolume: workoutData.totalVolume,
          exercises: workoutData.exercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            category: "strength",
            primaryMuscles: ["general"],
            equipment: "free_weights",
            sets: exercise.sets.map((set, index) => ({
              id: `set_${Date.now()}_${index}`,
              type: "working" as const,
              targetReps: set.reps,
              targetWeight: set.weight || 0,
              actualReps: set.reps,
              actualWeight: set.weight || 0,
              completed: set.completed,
              restTime: exercise.restTime || 60,
            })),
          })),
        },
        feedback: {
          completedAt: workoutData.completedAt,
          difficulty: workoutData.difficulty || 3,
          feeling: workoutData.feeling || "good",
          readyForMore: true,
          congratulationMessage: "אימון מעולה!",
        },
        stats: {
          duration: workoutData.totalDuration,
          totalSets: workoutData.totalSets,
          totalPlannedSets: workoutData.totalSets,
          totalVolume: workoutData.totalVolume,
          personalRecords: workoutData.personalRecords.length,
        },
      });

      // עדכון סטטיסטיקות המשתמש
      if (user) {
        const currentStats = user.trainingStats || {};
        const newTotalWorkouts = (currentStats.totalWorkouts || 0) + 1;

        // חישוב דירוג ממוצע חדש
        const currentAverage = currentStats.averageRating || 0;
        const currentTotal = currentStats.totalWorkouts || 0;
        const newAverageRating =
          currentTotal > 0
            ? (currentAverage * currentTotal + (workoutData.difficulty || 3)) /
              newTotalWorkouts
            : workoutData.difficulty || 3;

        // חישוב רצף חדש
        const newStreak = await calculateNewStreak();

        updateUser({
          trainingStats: {
            ...currentStats,
            totalWorkouts: newTotalWorkouts,
            currentStreak: newStreak,
            averageRating: newAverageRating,
            lastWorkoutDate: new Date().toISOString(),
          },
        });
      }

      // מעבר למסך הראשי
      navigation.goBack();
    } catch (error) {
      console.error("Error saving workout:", error);
      // נמשיך למסך הראשי גם במקרה של שגיאה
      navigation.goBack();
    }
  };

  const StatCard: React.FC<{
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
      <MaterialCommunityIcons
        name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={24}
        color={color}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const ExerciseCard: React.FC<{
    exercise: WorkoutSummaryData["exercises"][0];
  }> = ({ exercise }) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <View style={styles.setsContainer}>
        {exercise.sets.map((set, index) => (
          <View key={index} style={styles.setRow}>
            <Text style={styles.setText}>
              סט {index + 1}: {set.reps} חזרות
              {set.weight && ` × ${formatWeight(set.weight)}`}
            </Text>
            <MaterialCommunityIcons
              name={set.completed ? "check-circle" : "circle-outline"}
              size={16}
              color={
                set.completed
                  ? theme.colors.success
                  : theme.colors.textSecondary
              }
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary fallbackMessage="שגיאה בטעינת סיכום האימון">
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* כותרת עם מעגל הצלחה */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[theme.colors.success, theme.colors.primary]}
              style={styles.successCircle}
            >
              <MaterialCommunityIcons name="check" size={48} color="white" />
            </LinearGradient>
            <Text style={styles.congratsText}>כל הכבוד!</Text>
            <Text style={styles.workoutTitle}>{workoutData.workoutName}</Text>
            <Text style={styles.completionText}>
              הושלם ב-{formatDuration(workoutData.totalDuration)}
            </Text>
          </Animated.View>

          {/* סטטיסטיקות מרכזיות */}
          <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
            <StatCard
              icon="dumbbell"
              label="תרגילים"
              value={workoutData.exercises.length}
              color={theme.colors.primary}
            />
            <StatCard
              icon="format-list-numbered"
              label="סטים"
              value={workoutData.totalSets}
              color={theme.colors.warning}
            />
            <StatCard
              icon="repeat"
              label="חזרות"
              value={workoutData.totalReps}
              color={theme.colors.success}
            />
            <StatCard
              icon="weight-kilogram"
              label="נפח (ק״ג)"
              value={formatWeight(workoutData.totalVolume)}
              color={theme.colors.error}
            />
          </Animated.View>

          {/* שיאים אישיים */}
          {workoutData.personalRecords.length > 0 && (
            <Animated.View
              style={[styles.recordsContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.recordsTitle}>🏆 שיאים אישיים חדשים!</Text>
              {workoutData.personalRecords.map((record, index) => (
                <View key={index} style={styles.recordItem}>
                  <MaterialCommunityIcons
                    name="trophy"
                    size={16}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.recordText}>{record}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {/* פירוט תרגילים */}
          <Animated.View
            style={[styles.exercisesSection, { opacity: fadeAnim }]}
          >
            <Text style={styles.sectionTitle}>פירוט תרגילים</Text>
            {workoutData.exercises.map((exercise, index) => (
              <ExerciseCard key={exercise.id || index} exercise={exercise} />
            ))}
          </Animated.View>
        </ScrollView>

        {/* כפתורי פעולה */}
        <Animated.View style={[styles.actionButtons, { opacity: fadeAnim }]}>
          <AppButton
            title="שמור אימון"
            variant="primary"
            size="large"
            onPress={handleSaveWorkout}
            style={styles.saveButton}
          />
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.skipText}>דלג ועבור למסך הראשי</Text>
          </TouchableOpacity>
        </Animated.View>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // מקום לכפתורים
  },
  header: {
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  completionText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  recordsContainer: {
    backgroundColor: "white",
    marginHorizontal: theme.spacing.lg,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  recordItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  recordText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: isRTL() ? 0 : theme.spacing.sm,
    marginRight: isRTL() ? theme.spacing.sm : 0,
    flex: 1,
    textAlign: isRTL() ? "right" : "left",
  },
  exercisesSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: isRTL() ? "right" : "left",
  },
  exerciseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL() ? "right" : "left",
  },
  setsContainer: {
    gap: theme.spacing.sm,
  },
  setRow: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  setText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: isRTL() ? "right" : "left",
  },
  actionButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    marginBottom: theme.spacing.md,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  skipText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textDecorationLine: "underline",
  },
});

export default WorkoutSummaryScreen;
