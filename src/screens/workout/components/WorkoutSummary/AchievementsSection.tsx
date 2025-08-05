/**
 * @file src/screens/workout/components/WorkoutSummary/AchievementsSection.tsx
 * @brief רכיב הישגים ושיפורים מפולח
 * @description מציג הישגים חדשים, שיפורים ומעקב אחר התקדמות
 */

import React from "react";
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
}

export const AchievementsSection: React.FC<AchievementsSectionProps> =
  React.memo(({ achievements, personalRecords, workoutStats }) => {
    const animatedValue = new Animated.Value(0);

    React.useEffect(() => {
      if (achievements.length > 0) {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
    }, [achievements.length]);

    const getAchievementIcon = (type: Achievement["type"]) => {
      const iconMap: Record<Achievement["type"], string> = {
        new_pr: "trophy-award",
        volume_record: "chart-line",
        streak: "fire",
        consistency: "calendar-check",
      };
      return iconMap[type] || "star";
    };

    const getAchievementColor = (type: Achievement["type"]) => {
      const colorMap: Record<Achievement["type"], string> = {
        new_pr: theme.colors.warning,
        volume_record: theme.colors.success,
        streak: "#FF6B35",
        consistency: theme.colors.primary,
      };
      return colorMap[type] || theme.colors.primary;
    };

    if (achievements.length === 0 && personalRecords.length === 0) {
      return null;
    }

    return (
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>הישגים והתקדמות 🏆</Text>

        {/* הישגים כלליים */}
        {achievements.length > 0 && (
          <Animated.View
            style={[
              styles.achievementsList,
              {
                opacity: animatedValue,
                transform: [
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <MaterialCommunityIcons
                    name={getAchievementIcon(achievement.type) as any}
                    size={24}
                    color={getAchievementColor(achievement.type)}
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
                  style={{ transform: [{ scaleX: theme.isRTL ? -1 : 1 }] }}
                />
              </View>
            ))}
          </Animated.View>
        )}

        {/* שיאים אישיים */}
        {personalRecords.length > 0 && (
          <View style={styles.personalRecordsSection}>
            <Text style={styles.subsectionTitle}>שיאים אישיים חדשים! 🎯</Text>
            {personalRecords.map((record, index) => (
              <View key={index} style={styles.prCard}>
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
                    style={{
                      marginHorizontal: theme.spacing.xs,
                      transform: [{ scaleX: theme.isRTL ? -1 : 1 }],
                    }}
                  />
                  <Text style={styles.prNew}>חדש: {record.newRecord} ק"ג</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* סיכום מהיר */}
        <View style={styles.quickSummary}>
          <Text style={styles.summaryTitle}>סיכום מהיר</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="weight-lifter"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.summaryValue}>{workoutStats.totalSets}</Text>
              <Text style={styles.summaryLabel}>סטים</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="chart-bar"
                size={20}
                color={theme.colors.success}
              />
              <Text style={styles.summaryValue}>
                {(workoutStats.totalVolume / 1000).toFixed(1)}K
              </Text>
              <Text style={styles.summaryLabel}>נפח</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.summaryValue}>
                {Math.round(workoutStats.duration / 60)}
              </Text>
              <Text style={styles.summaryLabel}>דקות</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={theme.colors.error}
              />
              <Text style={styles.summaryValue}>
                {workoutStats.completedExercises}
              </Text>
              <Text style={styles.summaryLabel}>תרגילים</Text>
            </View>
          </View>
        </View>
      </View>
    );
  });

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
});
