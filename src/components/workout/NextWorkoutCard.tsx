/**
 * @file src/components/workout/NextWorkoutCard.tsx
 * @description רכיב לתצוגת האימון הבא במסך הבית - מותאם לכושר מובייל עם משוב מושגי
 * English: Component for displaying next workout in home screen - fitness mobile optimized with haptic feedback
 */

import React, { useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { theme } from "../../styles/theme";
import { useNextWorkout } from "../../hooks/useNextWorkout";
import { WorkoutPlan } from "../../screens/workout/types/workout.types";
import FloatingActionButton from "./FloatingActionButton";

interface NextWorkoutCardProps {
  onStartWorkout: (workoutName: string, workoutIndex: number) => void;
  workoutPlan?: WorkoutPlan;
}

export const NextWorkoutCard: React.FC<NextWorkoutCardProps> = React.memo(
  ({ onStartWorkout, workoutPlan }) => {
    const { nextWorkout, isLoading, cycleStats, error, refreshRecommendation } =
      useNextWorkout(workoutPlan);
    const [showTimeout, setShowTimeout] = React.useState(false);

    // ✨ Performance tracking לרכיבי כושר
    const renderStartTime = useMemo(() => Date.now(), []);

    // ✨ Haptic feedback מותאם לאימונים
    const triggerWorkoutHaptic = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, []);

    // ✨ Enhanced handleStartWorkout עם haptic feedback
    const handleStartWorkout = useCallback(
      (workoutName: string, workoutIndex: number) => {
        triggerWorkoutHaptic();
        onStartWorkout(workoutName, workoutIndex);
      },
      [triggerWorkoutHaptic, onStartWorkout]
    );

    // ✨ משוב ביצועים אוטומטי - רק בדיבוג מפורט
    useEffect(() => {
      const renderTime = Date.now() - renderStartTime;
      if (__DEV__ && renderTime > 300) {
        // העלאת סף ל-300ms
        console.warn(
          `⚠️ NextWorkoutCard render time: ${renderTime.toFixed(2)}ms`
        );
      }
    }, [renderStartTime]);

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

    // ✨ רכיב בטעינה מאוחד - Unified loading component
    const LoadingView = React.useMemo(
      () => (
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
        return undefined;
      }
    }, [isLoading]);

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

    if (error) {
      return <ErrorWorkoutView error={error} onRetry={refreshRecommendation} />;
    }

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
              <Text style={[styles.title, styles.rtlText]}>האימון הבא שלך</Text>
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
          <Text style={[styles.workoutName, styles.rtlText]}>
            {nextWorkout.workoutName}
          </Text>

          {/* הסבר הבחירה */}
          <Text style={[styles.reason, styles.rtlText]}>
            {nextWorkout.reason}
          </Text>

          {/* מידע נוסף אם רלוונטי */}
          {nextWorkout.daysSinceLastWorkout > 0 && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={16}
                color={theme.colors.textSecondary}
                accessible={false}
              />
              <Text style={[styles.infoText, styles.rtlText]}>
                {nextWorkout.daysSinceLastWorkout === 1
                  ? "אתמול התאמנת"
                  : `${nextWorkout.daysSinceLastWorkout} ימים מאז האימון האחרון`}
              </Text>
            </View>
          )}

          {/* סטטיסטיקות מחזור */}
          <CycleStatsView cycleStats={cycleStats} />
        </LinearGradient>

        {/* כפתור התחלת אימון */}
        <FloatingActionButton
          icon="play"
          onPress={() =>
            handleStartWorkout(
              nextWorkout.workoutName,
              nextWorkout.workoutIndex
            )
          }
          accessibilityLabel={`התחל אימון ${nextWorkout.workoutName}`}
          accessibilityHint="הקש כדי להתחיל את האימון הבא - יופעל משוב מושגי"
          size="medium"
          workout={true}
          intensity="heavy"
        />
      </View>
    );
  }
);

// ✨ הוספת displayName לרכיב הראשי
NextWorkoutCard.displayName = "NextWorkoutCard";

// ✨ רכיב ברירת מחדל נפרד עם אופטימיזציות כושר - Fitness optimized default workout component
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
}> = React.memo(({ workout, onStartWorkout }) => {
  // ✨ Haptic feedback לברירת מחדל
  const triggerDefaultHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleDefaultPress = useCallback(() => {
    triggerDefaultHaptic();
    onStartWorkout(workout.workoutName, workout.workoutIndex);
  }, [
    triggerDefaultHaptic,
    onStartWorkout,
    workout.workoutName,
    workout.workoutIndex,
  ]);

  return (
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
            <Text style={[styles.title, styles.rtlText]}>האימון הבא שלך</Text>
          </View>
        </View>

        <Text style={[styles.workoutName, styles.rtlText]}>
          {workout.workoutName}
        </Text>
        <Text style={[styles.reason, styles.rtlText]}>{workout.reason}</Text>

        <FloatingActionButton
          icon="play"
          onPress={handleDefaultPress}
          accessibilityLabel={`התחל אימון ${workout.workoutName}`}
          accessibilityHint="הקש כדי להתחיל את האימון הבא - יופעל משוב מושגי"
          size="medium"
          workout={true}
          intensity="medium"
        />
      </LinearGradient>
    </View>
  );
});

DefaultWorkoutView.displayName = "DefaultWorkoutView";

// ✨ רכיב סטטיסטיקות נפרד עם אופטימיזציות - Fitness optimized stats component
const CycleStatsView: React.FC<{
  cycleStats: {
    currentWeek: number;
    totalWorkouts: number;
    daysInProgram: number;
    consistency: number;
  } | null;
}> = React.memo(({ cycleStats }) => {
  const statsData = React.useMemo(() => {
    if (!cycleStats)
      return [] as Array<{ value: number | string; label: string }>;
    return [
      { value: cycleStats.currentWeek, label: "שבוע" },
      { value: cycleStats.totalWorkouts, label: "אימונים" },
      { value: `${Math.round(cycleStats.consistency)}%`, label: "עקביות" },
    ];
  }, [cycleStats]);

  if (statsData.length === 0) return null;

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

CycleStatsView.displayName = "CycleStatsView";

// ✨ רכיב שגיאה נפרד עם אופטימיזציות כושר - Fitness optimized error component
const ErrorWorkoutView: React.FC<{
  error: string;
  onRetry: () => void;
}> = React.memo(({ error, onRetry }) => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`שגיאה בטעינת האימון הבא: ${error}`}
      accessibilityHint="הקש לניסיון חוזר"
    >
      <LinearGradient
        colors={[theme.colors.error + "20", theme.colors.error + "10"]}
        style={styles.gradient}
      >
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={24}
            color={theme.colors.error}
            accessible={false}
          />
          <Text style={styles.errorText}>שגיאה בטעינת האימון הבא</Text>
          <Text style={styles.errorSubtext}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="נסה שוב"
            accessibilityHint="הקש לניסיון טעינה חוזר של האימון הבא"
          >
            <MaterialCommunityIcons
              name="refresh"
              size={16}
              color={theme.colors.error}
              accessible={false}
            />
            <Text style={styles.retryText}>נסה שוב</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
});

ErrorWorkoutView.displayName = "ErrorWorkoutView";

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
    writingDirection: "rtl",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  errorSubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    writingDirection: "rtl",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  retryText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    writingDirection: "rtl",
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
    writingDirection: "rtl",
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
    writingDirection: "rtl",
  },
  workoutName: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  reason: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
    writingDirection: "rtl",
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
    writingDirection: "rtl",
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
    writingDirection: "rtl",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.textSecondary + "30",
  },
  rtlText: {
    writingDirection: "rtl",
  },
});

export default NextWorkoutCard;
