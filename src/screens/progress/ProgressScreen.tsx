/**
 * @file src/screens/progress/ProgressScreen.tsx
 * @description מסך התקדמות זמני - מפנה לשירות היסטוריית אימונים
 * English: Temporary progress screen - redirects to workout history service
 * @version 1.0.0
 * @created 2025-08-01
 *
 * @note
 * מסך זה הוחלף ב-workoutHistoryService שמספק נתוני התקדמות מדויקים יותר.
 * השתמש ב-workoutHistoryService.getWorkoutStatistics() לקבלת נתוני התקדמות.
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

export default function ProgressScreen(): JSX.Element {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BackButton absolute={false} variant="minimal" />

      <View style={styles.content}>
        <MaterialCommunityIcons
          name="chart-line-variant"
          size={120}
          color={theme.colors.primary}
          style={styles.icon}
        />

        <Text style={styles.title}>מסך התקדמות</Text>
        <Text style={styles.subtitle}>
          הנתונים שלך נשמרים ונמצאים ב-WorkoutHistoryService
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📊 נתוני התקדמות זמינים:</Text>
          <Text style={styles.infoText}>• סך כל האימונים</Text>
          <Text style={styles.infoText}>• זמן אימון כולל</Text>
          <Text style={styles.infoText}>• רצף אימונים נוכחי</Text>
          <Text style={styles.infoText}>• דירוג קושי ממוצע</Text>
          <Text style={styles.infoText}>• שיאים אישיים</Text>
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
