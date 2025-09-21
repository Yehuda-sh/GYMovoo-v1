import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../core/theme";
import { useNextWorkout } from "../../features/workout/hooks/useNextWorkout";

interface NextWorkoutCardProps {
  onStartWorkout: (workoutName: string, workoutIndex: number) => void;
}

export const NextWorkoutCard: React.FC<NextWorkoutCardProps> = React.memo(
  ({ onStartWorkout }) => {
    const { nextWorkout, isLoading, error } = useNextWorkout();

    const defaultWorkout = {
      workoutName: "דחיפה",
      workoutIndex: 0,
      reason: "התחלת תוכנית אימונים חדשה",
    };

    const currentWorkout = nextWorkout || defaultWorkout;

    if (error) {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={[theme.colors.error + "20", theme.colors.error + "10"]}
            style={styles.gradient}
          >
            <Text style={styles.errorText}>שגיאה בטעינת האימון הבא</Text>
          </LinearGradient>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={[theme.colors.primary + "20", theme.colors.primary + "10"]}
            style={styles.gradient}
          >
            <View style={styles.loadingContainer}>
              <MaterialCommunityIcons
                name="refresh"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.loadingText}>מחשב אימון הבא...</Text>
            </View>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary + "15", theme.colors.primary + "05"]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.title]}>האימון הבא שלך</Text>
          </View>

          <Text style={[styles.workoutName]}>{currentWorkout.workoutName}</Text>

          <Text style={[styles.reason]}>{currentWorkout.reason}</Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              onStartWorkout(
                currentWorkout.workoutName,
                currentWorkout.workoutIndex
              )
            }
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="play" size={20} color="white" />
            <Text style={styles.startButtonText}>התחל אימון</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
);

NextWorkoutCard.displayName = "NextWorkoutCard";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  gradient: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: "600",
    color: theme.colors.primary,
    marginStart: theme.spacing.sm,
  },
  workoutName: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  reason: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },
  startButtonText: {
    color: "white",
    fontSize: theme.typography.button.fontSize,
    fontWeight: "600",
    marginStart: theme.spacing.sm,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    marginStart: theme.spacing.sm,
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
  },
  errorText: {
    textAlign: "center",
    color: theme.colors.error,
    fontSize: theme.typography.body.fontSize,
    paddingVertical: theme.spacing.xl,
  },
});

export default NextWorkoutCard;
