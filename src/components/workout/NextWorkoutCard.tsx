/**
 * @file src/components/workout/NextWorkoutCard.tsx
 * @description רכיב לתצוגת האימון הבא במסך הבית
 * English: Component for displaying next workout in home screen
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { useNextWorkout } from "../../hooks/useNextWorkout";
import { WorkoutPlan } from "../../screens/workout/types/workout.types";

interface NextWorkoutCardProps {
  onStartWorkout: (workoutName: string, workoutIndex: number) => void;
  workoutPlan?: WorkoutPlan;
}

export const NextWorkoutCard: React.FC<NextWorkoutCardProps> = ({
  onStartWorkout,
  workoutPlan,
}) => {
  const { nextWorkout, isLoading, cycleStats } = useNextWorkout(workoutPlan);
  const [showTimeout, setShowTimeout] = React.useState(false);

  // ✨ ברירת מחדל מאוחדת - Unified default workout
  const DEFAULT_WORKOUT = React.useMemo(
    () => ({
      workoutName: "דחיפה",
      workoutIndex: 0,
      reason: "התחלת תוכנית אימונים חדשה",
      isRegularProgression: true,
      daysSinceLastWorkout: 0,
      suggestedIntensity: "normal" as const,
    }),
    []
  );

  // ✨ רכיب בטעינה מאוחד - Unified loading component
  const LoadingView = React.useMemo(
    () => (
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary + "20", theme.colors.primary + "10"]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <MaterialCommunityIcons
              name="loading"
              size={24}
              color={theme.colors.primary}
              accessible={false}
            />
            <Text style={styles.loadingText}>מחשב אימון הבא...</Text>
          </View>
        </LinearGradient>
      </View>
    ),
    []
  );

  // Timeout למניעת טעינה ארוכה מדי
  React.useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setShowTimeout(true);
      }, 2000); // 2 שניות

      return () => clearTimeout(timeout);
    } else {
      setShowTimeout(false);
    }
  }, [isLoading]);

  if (isLoading && !showTimeout) {
    return LoadingView;
  }

  if (!nextWorkout || showTimeout) {
    return (
      <DefaultWorkoutView
        workout={DEFAULT_WORKOUT}
        onStartWorkout={onStartWorkout}
      />
    );
  }

  // ✨ מערכת אינטנסיביות מאוחדת - Unified intensity system
  const INTENSITY_CONFIG = React.useMemo(
    () => ({
      light: {
        icon: "weather-sunny" as const,
        color: "#FFA726", // Orange
        text: "אימון קל",
        description: "אימון בקצב נמוך למנוחה פעילה",
      },
      catchup: {
        icon: "rocket" as const,
        color: "#42A5F5", // Blue
        text: "השלמה",
        description: "השלמת אימון שהוחמץ",
      },
      normal: {
        icon: "fire" as const,
        color: theme.colors.primary,
        text: "אימון רגיל",
        description: "אימון בעצימות רגילה",
      },
    }),
    []
  );

  const getIntensityConfig = React.useMemo(() => {
    return INTENSITY_CONFIG[nextWorkout?.suggestedIntensity || "normal"];
  }, [nextWorkout?.suggestedIntensity, INTENSITY_CONFIG]);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`האימון הבא שלך: ${nextWorkout.workoutName}. ${nextWorkout.reason}. ${getIntensityConfig.text}.`}
      accessibilityHint="פרטי האימון הבא המומלץ עבורך"
    >
      <LinearGradient
        colors={[theme.colors.primary + "15", theme.colors.primary + "05"]}
        style={styles.gradient}
      >
        {/* כותרת */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={20}
              color={theme.colors.primary}
              accessible={false}
            />
            <Text style={styles.title}>האימון הבא שלך</Text>
          </View>

          {/* אינדיקטור אינטנסיביות */}
          <View
            style={[
              styles.intensityBadge,
              { borderColor: getIntensityConfig.color },
            ]}
          >
            <MaterialCommunityIcons
              name={getIntensityConfig.icon}
              size={14}
              color={getIntensityConfig.color}
              accessible={false}
            />
            <Text
              style={[
                styles.intensityText,
                { color: getIntensityConfig.color },
              ]}
            >
              {getIntensityConfig.text}
            </Text>
          </View>
        </View>

        {/* שם האימון */}
        <Text style={styles.workoutName}>{nextWorkout.workoutName}</Text>

        {/* הסבר הבחירה */}
        <Text style={styles.reason}>{nextWorkout.reason}</Text>

        {/* מידע נוסף אם רלוונטי */}
        {nextWorkout.daysSinceLastWorkout > 0 && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={16}
              color={theme.colors.textSecondary}
              accessible={false}
            />
            <Text style={styles.infoText}>
              {nextWorkout.daysSinceLastWorkout === 1
                ? "אתמול התאמנת"
                : `${nextWorkout.daysSinceLastWorkout} ימים מאז האימון האחרון`}
            </Text>
          </View>
        )}

        {/* סטטיסטיקות מחזור */}
        <CycleStatsView cycleStats={cycleStats} />

        {/* כפתור התחלת אימון */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() =>
            onStartWorkout(nextWorkout.workoutName, nextWorkout.workoutIndex)
          }
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`התחל אימון ${nextWorkout.workoutName}`}
          accessibilityHint="הקש כדי להתחיל את האימון הבא"
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary + "DD"]}
            style={styles.startButtonGradient}
          >
            <MaterialCommunityIcons
              name="play"
              size={20}
              color="white"
              accessible={false}
            />
            <Text style={styles.startButtonText}>התחל אימון</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

// ✨ רכיב ברירת מחדל נפרד - Separate default workout component
const DefaultWorkoutView: React.FC<{
  workout: {
    workoutName: string;
    workoutIndex: number;
    reason: string;
    isRegularProgression: boolean;
    daysSinceLastWorkout: number;
    suggestedIntensity: "normal" | "light" | "catchup";
  };
  onStartWorkout: (workoutName: string, workoutIndex: number) => void;
}> = React.memo(({ workout, onStartWorkout }) => (
  <View
    style={styles.container}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={`האימון הבא שלך: ${workout.workoutName}. ${workout.reason}.`}
    accessibilityHint="פרטי האימון הבא המומלץ עבורך"
  >
    <LinearGradient
      colors={[theme.colors.primary + "30", theme.colors.primary + "10"]}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={20}
            color={theme.colors.primary}
            accessible={false}
          />
          <Text style={styles.title}>האימון הבא שלך</Text>
        </View>
      </View>

      <Text style={styles.workoutName}>{workout.workoutName}</Text>
      <Text style={styles.reason}>{workout.reason}</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() =>
          onStartWorkout(workout.workoutName, workout.workoutIndex)
        }
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`התחל אימון ${workout.workoutName}`}
        accessibilityHint="הקש כדי להתחיל את האימון הבא"
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary + "DD"]}
          style={styles.startButtonGradient}
        >
          <MaterialCommunityIcons
            name="play"
            size={20}
            color="white"
            accessible={false}
          />
          <Text style={styles.startButtonText}>התחל אימון</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  </View>
));

// ✨ רכיב סטטיסטיקות נפרד - Separate stats component
const CycleStatsView: React.FC<{
  cycleStats: {
    currentWeek: number;
    totalWorkouts: number;
    daysInProgram: number;
    consistency: number;
  } | null;
}> = React.memo(({ cycleStats }) => {
  if (!cycleStats) return null;

  const statsData = React.useMemo(
    () => [
      { value: cycleStats.currentWeek, label: "שבוע" },
      { value: cycleStats.totalWorkouts, label: "אימונים" },
      { value: `${Math.round(cycleStats.consistency)}%`, label: "עקביות" },
    ],
    [cycleStats]
  );

  return (
    <View style={styles.statsContainer}>
      {statsData.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
          {index < statsData.length - 1 && <View style={styles.statDivider} />}
        </React.Fragment>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    ...theme.shadows.medium,
  },
  gradient: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
  },
  errorText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  intensityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  intensityText: {
    fontSize: theme.typography.caption.fontSize - 1,
    fontWeight: "500",
    marginLeft: theme.spacing.xs,
  },
  workoutName: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  reason: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.textSecondary + "30",
  },
  startButton: {
    borderRadius: theme.radius.lg,
    ...theme.shadows.small,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
  },
  startButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: "white",
    marginLeft: theme.spacing.sm,
  },
});
