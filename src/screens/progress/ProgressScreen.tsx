/**
 * @file src/screens/progress/ProgressScreen.tsx
 * @description מסך התקדמות המציג נתונים אמיתיים משירות היסטוריית אימונים
 * English: Progress screen showing real stats from workoutHistoryService
 * @version 1.1.0 (2025-08-13)
 */

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { PROGRESS_SCREEN_TEXTS } from "../../constants/progressScreenTexts";
import { SafeAreaView } from "react-native-safe-area-context";
import { workoutFacadeService } from "../../services";

export default function ProgressScreen(): JSX.Element {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<{
    totalWorkouts: number;
    totalDuration: number;
    averageDifficulty: number;
    workoutStreak: number;
  } | null>(null);
  const [personalRecords, setPersonalRecords] = React.useState<number>(0);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const s = await workoutFacadeService.getGenderGroupedStatistics();
        // The analytics part needs to be refactored to not require personalData or to get it from a store
        // For now, we'll just get the total records for the badge.
        const history = await workoutFacadeService.getHistory();
        const personalRecordsCount = history.reduce(
          (acc, curr) => acc + (curr.stats?.personalRecords || 0),
          0
        );

        if (!mounted) return;
        setStats(s.total);
        setPersonalRecords(personalRecordsCount);
      } catch (e) {
        console.error("ProgressScreen: failed to load stats", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

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
              <ActivityIndicator size="small" color={theme.colors.primary} />
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
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    writingDirection: "rtl",
  },
  infoBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border + "30",
    width: "100%",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    writingDirection: "rtl",
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
});
