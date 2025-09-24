/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileJourneyTab.tsx
 * @description כרטיסיית המסע שלי - הישגים וסטטיסטיקות
 *
 * השאלות שהובילו ליצירת הקומפוננט הזה:
 * - "למה הפונקציה הזאת כל כך מורכבת?" - כל הנתונים היו במסך אחד
 * - "אפשר לעשות את זה בשורה אחת?" - פישוט תצוגת ההישגים
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL, wrapBidi } from "../../../../../utils/rtlHelpers";
import { PROFILE_SCREEN_TEXTS } from "../../../../../constants/profileScreenTexts";
import AchievementSystem from "../../../../../components/achievement/AchievementSystem";
import type { User } from "../../../../../core/types";
import type { ProfileStats } from "../hooks/useProfileData";

interface Props {
  user: User | null;
  stats: ProfileStats;
  profileBadges: ProfileBadge[];
}

import type { ProfileBadge } from "../hooks/useProfileData";

export const ProfileJourneyTab: React.FC<Props> = ({
  user,
  stats,
  profileBadges: _profileBadges,
}) => {
  const [showAchievements, setShowAchievements] = useState(false);

  const totalWorkouts = user?.trainingStats?.totalWorkouts || 0;
  const currentStreak = user?.trainingStats?.currentStreak || 0;
  const averageRating = user?.trainingStats?.averageRating || 0;

  return (
    <View>
      {/* Stats Section */}
      {(totalWorkouts > 0 || currentStreak > 0 || averageRating > 0) && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            {wrapBidi(PROFILE_SCREEN_TEXTS.HEADERS.MY_STATS)}
          </Text>

          <View style={styles.statsGrid}>
            {totalWorkouts > 0 && (
              <View style={styles.statCard}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statNumber}>
                  {wrapBidi(String(stats.workouts))}
                </Text>
                <Text style={styles.statLabel}>
                  {PROFILE_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS}
                </Text>
              </View>
            )}

            {currentStreak > 0 && (
              <View style={styles.statCard}>
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={theme.colors.warning}
                />
                <Text style={styles.statNumber}>
                  {wrapBidi(String(stats.streak))}
                </Text>
                <Text style={styles.statLabel}>
                  {PROFILE_SCREEN_TEXTS.STATS.STREAK_DAYS}
                </Text>
              </View>
            )}

            {averageRating > 0 && (
              <View style={styles.statCard}>
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={styles.statNumber}>
                  {wrapBidi(String(stats.rating))}
                </Text>
                <Text style={styles.statLabel}>דירוג</Text>
              </View>
            )}
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

        {/* הישגים פשוטים */}
        <View style={styles.simpleAchievements}>
          {totalWorkouts >= 1 && (
            <View style={styles.achievementBadge}>
              <MaterialCommunityIcons name="trophy" size={20} color="#FFD700" />
              <Text style={styles.achievementText}>אימון ראשון</Text>
            </View>
          )}

          {totalWorkouts >= 10 && (
            <View style={styles.achievementBadge}>
              <MaterialCommunityIcons name="medal" size={20} color="#C0C0C0" />
              <Text style={styles.achievementText}>10 אימונים</Text>
            </View>
          )}

          {currentStreak >= 3 && (
            <View style={styles.achievementBadge}>
              <MaterialCommunityIcons name="fire" size={20} color="#FF6B35" />
              <Text style={styles.achievementText}>רצף 3 ימים</Text>
            </View>
          )}
        </View>
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
});
