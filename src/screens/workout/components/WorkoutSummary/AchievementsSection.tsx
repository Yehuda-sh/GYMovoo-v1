/**
 * @file src/screens/workout/components/WorkoutSummary/AchievementsSection.tsx
 * @brief רכיב הישגים ושיפורים מפולח
 * @description מציג הישגים חדשים, שיפורים ומעקב אחר התקדמות
 */

import React, { useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

interface Achievement {
  type: "new_pr" | "volume_record" | "streak" | "consistency";
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
  personalRecords: {
    exercise: string;
    previousBest: number;
    newRecord: number;
    improvement: number;
  }[];
  workoutStats: {
    totalSets: number;
    totalVolume: number;
    duration: number;
    completedExercises: number;
  };
  reducedMotion?: boolean;
  onAchievementPress?: (achievement: Achievement) => void;
  testID?: string;
}

// Icon & color maps (hoisted for stability)
type MCIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const ACHIEVEMENT_ICON_MAP: Record<Achievement["type"], MCIconName> = {
  new_pr: "trophy-award",
  volume_record: "chart-line",
  streak: "fire",
  consistency: "calendar-check",
};

const ACHIEVEMENT_COLOR_MAP: Record<Achievement["type"], string> = {
  new_pr: theme.colors.warning,
  volume_record: theme.colors.success,
  streak: "#FF6B35",
  consistency: theme.colors.primary,
};

const SUMMARY_ITEMS: Array<{
  key: string;
  icon: MCIconName;
  color: string;
  value: (stats: AchievementsSectionProps["workoutStats"]) => string | number;
  label: string;
}> = [
  {
    key: "sets",
    icon: "weight-lifter",
    color: theme.colors.primary,
    value: (s) => s.totalSets,
    label: "סטים",
  },
  {
    key: "volume",
    icon: "chart-bar",
    color: theme.colors.success,
    value: (s) => (s.totalVolume / 1000).toFixed(1) + "K",
    label: "נפח",
  },
  {
    key: "duration",
    icon: "clock-outline",
    color: theme.colors.warning,
    value: (s) => Math.round(s.duration / 60),
    label: "דקות",
  },
  {
    key: "exercises",
    icon: "check-circle",
    color: theme.colors.error,
    value: (s) => s.completedExercises,
    label: "תרגילים",
  },
];

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

export const AchievementsSection: React.FC<AchievementsSectionProps> =
  React.memo(
    ({
      achievements,
      personalRecords,
      workoutStats,
      reducedMotion = false,
      onAchievementPress,
      testID,
    }) => {
      const animatedValueRef = useRef(new Animated.Value(0));
      const animatedValue = animatedValueRef.current;

      useEffect(() => {
        if (achievements.length > 0 && !reducedMotion) {
          animatedValue.setValue(0);
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }).start();
        }
      }, [achievements.length, reducedMotion, animatedValue]);

      const animatedContainerStyle = useMemo(
        () => ({
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        }),
        [animatedValue]
      );

      const renderedSummary = useMemo(
        () =>
          SUMMARY_ITEMS.map((item) => (
            <View
              key={item.key}
              style={styles.summaryItem}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${item.label}: ${item.value(workoutStats)}`}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={item.color}
              />
              <Text style={styles.summaryValue}>
                {item.value(workoutStats)}
              </Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          )),
        [workoutStats]
      );

      const renderedAchievements = useMemo(
        () =>
          achievements.map((achievement, index) => {
            const iconName: MCIconName = ACHIEVEMENT_ICON_MAP[achievement.type];
            const iconColor =
              ACHIEVEMENT_COLOR_MAP[achievement.type] || theme.colors.primary;
            const isDisabled = !onAchievementPress;
            const a11yHint = isDisabled
              ? "לקריאה בלבד"
              : "הקש לפתיחת פירוט ההישג";

            return (
              <TouchableOpacity
                key={achievement.title + index}
                style={styles.achievementCard}
                activeOpacity={0.75}
                onPress={
                  onAchievementPress
                    ? () => onAchievementPress(achievement)
                    : undefined
                }
                disabled={isDisabled}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel={`${achievement.title}: ${achievement.subtitle}`}
                accessibilityHint={a11yHint}
                accessibilityState={{ disabled: isDisabled }}
                testID={`AchievementsSection-item-${index}`}
              >
                <View style={styles.achievementIcon}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={24}
                    color={iconColor}
                  />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementSubtitle}>
                    {achievement.subtitle}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.chevron}
                />
              </TouchableOpacity>
            );
          }),
        [achievements, onAchievementPress]
      );

      if (achievements.length === 0 && personalRecords.length === 0)
        return null;

      return (
        <View
          style={styles.achievementsSection}
          testID={testID || "AchievementsSection"}
        >
          <Text style={styles.sectionTitle}>הישגים והתקדמות 🏆</Text>

          {achievements.length > 0 && (
            <Animated.View
              style={[
                styles.achievementsList,
                !reducedMotion && animatedContainerStyle,
              ]}
              accessibilityRole="list"
              accessibilityLabel="רשימת הישגים"
            >
              {renderedAchievements}
            </Animated.View>
          )}

          {personalRecords.length > 0 && (
            <View
              style={styles.personalRecordsSection}
              accessibilityRole="list"
              accessibilityLabel="שיאים אישיים חדשים"
            >
              <Text style={styles.subsectionTitle}>שיאים אישיים חדשים! 🎯</Text>
              {personalRecords.map((record, index) => (
                <View
                  key={record.exercise + index}
                  style={styles.prCard}
                  accessibilityRole="text"
                  accessibilityLabel={`תרגיל ${record.exercise} שיא חדש ${record.newRecord} קילוגרם, שיפור ${record.improvement} אחוזים`}
                  testID={`AchievementsSection-pr-${index}`}
                >
                  <View style={styles.prHeader}>
                    <Text style={styles.prExercise}>{record.exercise}</Text>
                    <View style={styles.prImprovement}>
                      <MaterialCommunityIcons
                        name="trending-up"
                        size={16}
                        color={theme.colors.success}
                      />
                      <Text style={styles.prImprovementText}>
                        +{record.improvement}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.prComparison}>
                    <Text style={styles.prPrevious}>
                      הקודם: {record.previousBest} ק"ג
                    </Text>
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={16}
                      color={theme.colors.textSecondary}
                      style={styles.arrowIcon}
                    />
                    <Text style={styles.prNew}>
                      חדש: {record.newRecord} ק"ג
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.quickSummary}>
            <Text style={styles.summaryTitle}>סיכום מהיר</Text>
            <View style={styles.summaryGrid}>{renderedSummary}</View>
          </View>
        </View>
      );
    }
  );
AchievementsSection.displayName = "AchievementsSection";

const styles = StyleSheet.create({
  achievementsSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.body.fontSize + 1,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  achievementsList: {
    marginBottom: theme.spacing.md,
  },
  achievementCard: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderLeftWidth: theme.isRTL ? 0 : 4,
    borderRightWidth: theme.isRTL ? 4 : 0,
    borderLeftColor: theme.isRTL ? "transparent" : theme.colors.primary,
    borderRightColor: theme.isRTL ? theme.colors.primary : "transparent",
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.isRTL ? 0 : theme.spacing.sm,
    marginLeft: theme.isRTL ? theme.spacing.sm : 0,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  achievementSubtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  personalRecordsSection: {
    marginBottom: theme.spacing.md,
  },
  subsectionTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.warning,
    marginBottom: theme.spacing.sm,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  prCard: {
    backgroundColor: theme.colors.warning + "10",
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.warning + "30",
  },
  prHeader: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  prExercise: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  prImprovement: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.success + "20",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  prImprovementText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "600",
    color: theme.colors.success,
    marginLeft: theme.isRTL ? 0 : 4,
    marginRight: theme.isRTL ? 4 : 0,
  },
  prComparison: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
  },
  prPrevious: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textDecorationLine: "line-through",
  },
  prNew: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "600",
    color: theme.colors.success,
  },
  quickSummary: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  summaryTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: theme.typography.title1.fontSize,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  chevron: {
    transform: [{ scaleX: theme.isRTL ? -1 : 1 }],
  },
  arrowIcon: {
    marginHorizontal: theme.spacing.xs,
    transform: [{ scaleX: theme.isRTL ? -1 : 1 }],
  },
});
