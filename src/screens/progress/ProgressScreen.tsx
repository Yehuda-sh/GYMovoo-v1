/**
 * @file src/screens/progress/ProgressScreen.tsx
 * @description מסך התקדמות המציג נתונים אמיתיים משירות היסטוריית אימונים
 * English: Progress screen showing real stats from workoutHistoryService
 * @version 1.1.0 (2025-08-13)
 */

import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PROGRESS_SCREEN_TEXTS } from "../../constants/progressScreenTexts";
import { SafeAreaView } from "react-native-safe-area-context";
// useNavigation import commented out until NextWorkoutCard integration
// import { useNavigation } from "@react-navigation/native";
import { workoutFacadeService } from "../../services/workout/workoutFacadeService";
import { logger } from "../../utils/logger";
// NextWorkoutCard import commented out until proper workoutPlan integration
// import NextWorkoutCard from "../../components/workout/NextWorkoutCard";

// Types for stats
interface ProgressStats {
  totalWorkouts: number;
  totalDuration: number;
  averageDifficulty: number;
  workoutStreak: number;
}

export default function ProgressScreen(): JSX.Element {
  // const navigation = useNavigation(); // Commented out until NextWorkoutCard integration
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [personalRecords, setPersonalRecords] = useState<number>(0);

  const loadProgressData = useCallback(async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        workoutFacadeService.getGenderGroupedStatistics(),
        workoutFacadeService.getHistory(),
      ]);

      const personalRecordsCount = historyData.reduce(
        (acc, curr) => acc + (curr.stats?.personalRecords || 0),
        0
      );

      setStats(statsData.total);
      setPersonalRecords(personalRecordsCount);
    } catch (error) {
      logger.error("ProgressScreen: failed to load stats", String(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    // Add delay to prevent unnecessary calls
    const timeoutId = setTimeout(() => {
      if (mounted) {
        loadProgressData();
      }
    }, 200);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [loadProgressData]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "right", "left", "bottom"]}
    >
      <BackButton absolute={false} variant="minimal" />

      <View style={styles.content}>
        <MaterialCommunityIcons
          name={PROGRESS_SCREEN_TEXTS.ICONS.MAIN_CHART}
          size={120}
          color={theme.colors.primary}
          style={styles.icon}
          accessibilityLabel={PROGRESS_SCREEN_TEXTS.A11Y.MAIN_ICON}
        />

        <Text style={styles.title}>
          {PROGRESS_SCREEN_TEXTS.HEADERS.MAIN_TITLE}
        </Text>
        <Text style={styles.subtitle}>
          {PROGRESS_SCREEN_TEXTS.HEADERS.SUBTITLE}
        </Text>

        <View
          style={styles.infoBox}
          accessibilityLabel={PROGRESS_SCREEN_TEXTS.A11Y.INFO_BOX}
        >
          <Text style={styles.infoTitle}>
            {PROGRESS_SCREEN_TEXTS.INFO.BOX_TITLE}
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size="small" color={theme.colors.primary} />
            </View>
          ) : (
            <>
              <Text style={styles.infoText}>
                {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.TOTAL_WORKOUTS}:{" "}
                {stats?.totalWorkouts ?? 0}
              </Text>
              <Text style={styles.infoText}>
                {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.TOTAL_TIME}:{" "}
                {stats ? Math.round((stats.totalDuration || 0) / 60) : 0}{" "}
                {"דקות"}
              </Text>
              <Text style={styles.infoText}>
                {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.CURRENT_STREAK}:{" "}
                {stats?.workoutStreak ?? 0}
              </Text>
              <Text style={styles.infoText}>
                {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.AVERAGE_RATING}:{" "}
                {stats
                  ? (
                      Math.round((stats.averageDifficulty || 0) * 10) / 10
                    ).toFixed(1)
                  : "-"}
              </Text>
              <Text style={styles.infoText}>
                {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.PERSONAL_RECORDS}:{" "}
                {personalRecords}
              </Text>
            </>
          )}
        </View>

        {/* Next Workout Recommendation - Commented out until proper workoutPlan data */}
        {/* <NextWorkoutCard
          workoutPlan={undefined}
          onStartWorkout={(workoutName, workoutIndex) => {
            navigation.navigate("WorkoutPlans", {
              autoStart: true,
              requestedWorkoutName: workoutName,
              requestedWorkoutIndex: workoutIndex,
            });
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  icon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    writingDirection: "rtl",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: theme.spacing.xl,
    writingDirection: "rtl",
    letterSpacing: 0.3,
    paddingHorizontal: theme.spacing.sm,
  },
  infoBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border + "40",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    writingDirection: "rtl",
    letterSpacing: 0.4,
    textShadowColor: "rgba(0, 0, 0, 0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
