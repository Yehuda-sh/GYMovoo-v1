/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileJourneyTab.tsx
 * @description כרטיסיית המסע שלי - הישגים וסטטיסטיקות
 */

import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL, wrapBidi } from "../../../../../utils/rtlHelpers";
import { PROFILE_SCREEN_TEXTS } from "../../../../../constants/profileScreenTexts";
import AchievementSystem from "../../../../../components/achievement/AchievementSystem";
import type { User } from "../../../../../core/types";
import type { ProfileStats, ProfileBadge } from "../hooks/useProfileData";

interface Props {
  user: User | null;
  stats: ProfileStats;
  profileBadges: ProfileBadge[];
}

interface StatCard {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  value: number;
  label: string;
  visible: boolean;
}

interface Achievement {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  text: string;
  condition: boolean;
}

export const ProfileJourneyTab: React.FC<Props> = ({
  user,
  stats,
  // profileBadges not used - removed from destructuring
}) => {
  const [showAchievements, setShowAchievements] = useState(false);

  const totalWorkouts = user?.trainingStats?.totalWorkouts || 0;
  const currentStreak = user?.trainingStats?.currentStreak || 0;
  const averageRating = user?.trainingStats?.averageRating || 0;

  // מערך הסטטיסטיקות - פשוט יותר
  const statCards: StatCard[] = useMemo(
    () => [
      {
        icon: "dumbbell",
        color: theme.colors.primary,
        value: stats.workouts,
        label: PROFILE_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS,
        visible: totalWorkouts > 0,
      },
      {
        icon: "fire",
        color: theme.colors.warning,
        value: stats.streak,
        label: PROFILE_SCREEN_TEXTS.STATS.STREAK_DAYS,
        visible: currentStreak > 0,
      },
      {
        icon: "star",
        color: theme.colors.success,
        value: stats.rating,
        label: "דירוג",
        visible: averageRating > 0,
      },
    ],
    [stats, totalWorkouts, currentStreak, averageRating]
  );

  // הישגים פשוטים - מערך נקי
  const achievements: Achievement[] = useMemo(
    () => [
      {
        icon: "trophy",
        color: "#FFD700",
        text: "אימון ראשון",
        condition: totalWorkouts >= 1,
      },
      {
        icon: "medal",
        color: "#C0C0C0",
        text: "10 אימונים",
        condition: totalWorkouts >= 10,
      },
      {
        icon: "fire",
        color: "#FF6B35",
        text: "רצף 3 ימים",
        condition: currentStreak >= 3,
      },
    ],
    [totalWorkouts, currentStreak]
  );

  const visibleStats = statCards.filter((stat) => stat.visible);
  const earnedAchievements = achievements.filter(
    (achievement) => achievement.condition
  );
  const hasAnyStats = visibleStats.length > 0;

  return (
    <View>
      {/* Stats Section */}
      {hasAnyStats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            {wrapBidi(PROFILE_SCREEN_TEXTS.HEADERS.MY_STATS)}
          </Text>

          <View style={styles.statsGrid}>
            {visibleStats.map((stat, index) => (
              <View key={`stat-${index}`} style={styles.statCard}>
                <MaterialCommunityIcons
                  name={stat.icon}
                  size={24}
                  color={stat.color}
                />
                <Text style={styles.statNumber}>
                  {wrapBidi(String(stat.value))}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Achievements Section */}
      <View style={styles.achievementsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{wrapBidi("ההישגים שלי")}</Text>
          <TouchableOpacity
            style={styles.showAllButton}
            onPress={() => setShowAchievements(true)}
          >
            <Text style={styles.showAllText}>הצג הכל</Text>
            <MaterialCommunityIcons
              name={isRTL() ? "chevron-left" : "chevron-right"}
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* הישגים שהושגו */}
        {earnedAchievements.length > 0 ? (
          <View style={styles.simpleAchievements}>
            {earnedAchievements.map((achievement, index) => (
              <View
                key={`achievement-${index}`}
                style={styles.achievementBadge}
              >
                <MaterialCommunityIcons
                  name={achievement.icon}
                  size={20}
                  color={achievement.color}
                />
                <Text style={styles.achievementText}>{achievement.text}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noAchievements}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.noAchievementsText}>
              התחל להתאמן כדי לזכות בהישגים
            </Text>
          </View>
        )}
      </View>

      {/* Achievement System Modal */}
      <AchievementSystem
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL() ? "right" : "left",
  },
  statsGrid: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    minWidth: 100,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  achievementsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  showAllButton: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  showAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  simpleAchievements: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  achievementBadge: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
  },
  achievementText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "500",
  },
  noAchievements: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
  },
  noAchievementsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
});
