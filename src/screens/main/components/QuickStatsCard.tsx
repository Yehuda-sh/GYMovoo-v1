/**
 * @file src/screens/main/components/QuickStatsCard.tsx
 * @description כרטיס סטטיסטיקות מהיר של האימון האחרון – RTL, Theme, A11y
 */

import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../core/theme";
import {
  getFlexDirection,
  getTextAlign,
  getTextDirection,
  formatHebrewNumber,
  isRTL,
  getRTLIconName,
} from "../../../utils/rtlHelpers";

type MCIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface QuickStatsCardProps {
  totalExercises: number;
  totalReps: number;
  totalVolume: number; // ק״ג
  personalRecords: number;
  workoutName?: string;
  onPress?: () => void;
  // אופציונלי: התאמות עיצוב
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  totalExercises,
  totalReps,
  totalVolume,
  personalRecords,
  workoutName,
  onPress,
  containerStyle,
  titleStyle,
  valueStyle,
  labelStyle,
  testID,
}) => {
  const pressable = Boolean(onPress);

  const Stat = ({
    icon,
    value,
    label,
  }: {
    icon: MCIconName;
    value: string | number;
    label: string;
  }) => (
    <View style={styles.statItem} accessible accessibilityRole="text">
      <MaterialCommunityIcons name={icon} size={20} color="#fff" />
      <Text style={[styles.statValue, valueStyle]}>{value}</Text>
      <Text style={[styles.statLabel, labelStyle]}>{label}</Text>
    </View>
  );

  const content = (
    <LinearGradient
      colors={[
        theme.colors.primaryGradientStart,
        theme.colors.primaryGradientEnd,
      ]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header} accessible>
        <Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          האימון האחרון
        </Text>
        {workoutName ? (
          <Text
            style={styles.workoutName}
            numberOfLines={1}
            accessibilityLabel={`שם האימון: ${workoutName}`}
          >
            {workoutName}
          </Text>
        ) : null}
      </View>

      {/* Stats */}
      <View
        style={styles.statsGrid}
        accessibilityRole="summary"
        accessibilityLabel="סיכום סטטיסטיקות"
      >
        <Stat
          icon="dumbbell"
          value={formatHebrewNumber(totalExercises)}
          label="תרגילים"
        />
        <Stat
          icon="repeat"
          value={formatHebrewNumber(totalReps)}
          label="חזרות"
        />
        <Stat
          icon="weight-kilogram"
          value={formatHebrewNumber(Math.round(totalVolume))}
          label={`ק"ג כולל`}
        />
        <Stat
          icon="trophy"
          value={formatHebrewNumber(personalRecords)}
          label="שיאים"
        />
      </View>

      {/* Footer */}
      {pressable && (
        <View style={styles.footer} accessible>
          <Text style={styles.viewMore}>לחץ לפרטים נוספים</Text>
          <MaterialCommunityIcons
            name={getRTLIconName("arrow-left") as MCIconName}
            size={16}
            color="#fff"
          />
        </View>
      )}
    </LinearGradient>
  );

  if (pressable) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: theme.colors.ripple }}
        style={({ pressed }) => [
          styles.container,
          containerStyle,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`האימון האחרון${workoutName ? `: ${workoutName}` : ""}`}
        testID={testID || "quick-stats-card"}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.container, containerStyle]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`האימון האחרון${workoutName ? `: ${workoutName}` : ""}`}
      testID={testID || "quick-stats-card"}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    ...theme.shadows.large,
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.996 }],
  },
  gradient: {
    padding: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.md,
    alignItems: "flex-end",
  },
  title: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "800",
    textAlign: getTextAlign(),
    writingDirection: getTextDirection(),
  },
  workoutName: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: getTextAlign(),
    writingDirection: getTextDirection(),
    marginTop: 4,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: getFlexDirection(),
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    minWidth: 64,
  },
  statValue: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 2,
    textAlign: "center",
  },
  statLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  footer: {
    flexDirection: getFlexDirection(),
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.25)",
    gap: theme.spacing.xs,
  },
  viewMore: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 14,
    marginStart: isRTL() ? 0 : theme.spacing.xs,
    marginEnd: isRTL() ? theme.spacing.xs : 0,
    fontWeight: "700",
  },
});

export default QuickStatsCard;
