/**
 * @file src/screens/progress/ProgressScreen.tsx
 * @description מסך התקדמות המציג נתונים אמיתיים משירות היסטוריית אימונים
 * English: Progress screen showing real stats from workoutHistoryService
 * @version 1.1.0 (2025-08-13)
 */

import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../core/theme";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PROGRESS_SCREEN_TEXTS } from "../../constants/progressScreenTexts";
import workoutFacadeService from "../../services/workout/workoutFacadeService";

// Types for stats
interface ProgressStats {
  totalWorkouts: number;
  totalDuration: number;
  averageDifficulty: number;
  workoutStreak: number;
}

export default function ProgressScreen(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [personalRecords, setPersonalRecords] = useState<number>(0);

  const loadProgressData = useCallback(async () => {
    try {
      const historyData = await workoutFacadeService.getHistory();

      // Calculate stats from history
      const totalWorkouts = historyData.length;
      const totalDuration = historyData.reduce(
        (acc, workout) => acc + (workout.workout?.duration || 0),
        0
      );
      const averageDifficulty =
        historyData.length > 0
          ? historyData.reduce(
              (acc, workout) => acc + (workout.feedback?.difficulty || 0),
              0
            ) / historyData.length
          : 0;

      // Calculate streak (simplified - consecutive recent workouts)
      const workoutStreak = historyData.slice(0, 7).length;

      const personalRecordsCount = historyData.reduce(
        (acc: number, curr) => acc + (curr.stats?.personalRecords || 0),
        0
      );

      setStats({
        totalWorkouts,
        totalDuration,
        averageDifficulty,
        workoutStreak,
      });
      setPersonalRecords(personalRecordsCount);
    } catch (error) {
      console.error("Failed to load progress data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgressData();
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
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: theme.spacing.xl,
    writingDirection: "rtl",
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
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    writingDirection: "rtl",
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
});
