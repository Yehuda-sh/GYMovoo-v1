/**
 * @file src/screens/progress/ProgressScreen.tsx
 *        <View 
          style={styles.infoBox}
          accessibilityLabel={PROGRESS_SCREEN_TEXTS.A11Y.INFO_BOX}
        >cription מסך התקדמות זמני - מפנה לשירות היסטוריית אימונים
 * English: Temporary progress screen - redirects to workout history service
 * @version 1.0.1
 * @created 2025-08-01
 * @updated 2025-08-05 אופטימיזציה: הסרת ערכים קשיחים, שימוש במערכת theme, ריכוז constants
 *
 * @note
 * מסך זה הוחלף ב-workoutHistoryService שמספק נתוני התקדמות מדויקים יותר.
 * השתמש ב-workoutHistoryService.getWorkoutStatistics() לקבלת נתוני התקדמות.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { PROGRESS_SCREEN_TEXTS } from "../../constants/progressScreenTexts";

export default function ProgressScreen(): JSX.Element {
  // Debug logging for screen lifecycle
  console.log(PROGRESS_SCREEN_TEXTS.CONSOLE.SCREEN_LOADED);

  return (
    <View style={styles.container}>
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
          <Text style={styles.infoText}>
            {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.TOTAL_WORKOUTS}
          </Text>
          <Text style={styles.infoText}>
            {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.TOTAL_TIME}
          </Text>
          <Text style={styles.infoText}>
            {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.CURRENT_STREAK}
          </Text>
          <Text style={styles.infoText}>
            {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.AVERAGE_RATING}
          </Text>
          <Text style={styles.infoText}>
            {PROGRESS_SCREEN_TEXTS.INFO.FEATURES.PERSONAL_RECORDS}
          </Text>
        </View>
      </View>
    </View>
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
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
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
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
