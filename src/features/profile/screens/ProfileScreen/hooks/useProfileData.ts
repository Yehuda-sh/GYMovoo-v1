/**
 * @file src/features/profile/screens/ProfileScreen/hooks/useProfileData.ts
 * @description Hook לניהול נתוני הפרופיל - גרסה משופרת
 */

import { useState, useMemo, useCallback } from "react";
import { useUserStore } from "../../../../../stores/userStore";
import { theme } from "../../../../../core/theme";
import { logger } from "../../../../../utils/logger";

export interface ProfileStats {
  level: number;
  workouts: number;
  streak: number;
  rating: number;
  xp: number;
  nextLevelXp: number;
}

export interface ProfileBadge {
  key: string;
  text: string;
  color: string;
}

// קונסטנטים לחישובי XP
const XP_PER_WORKOUT = 10;
const WORKOUTS_PER_LEVEL = 10;

export const useProfileData = () => {
  const { user, updateUser, logout } = useUserStore();

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // בדיקות פשוטות
  const hasQuestionnaireData = useMemo(
    () => !!user?.questionnaireData?.answers,
    [user?.questionnaireData?.answers]
  );

  const hasPersonalInfo = useMemo(
    () => !!user?.personalInfo && Object.keys(user.personalInfo).length > 3,
    [user?.personalInfo]
  );

  // חישובי סטטיסטיקות - מתוקן ומשופר
  const stats = useMemo((): ProfileStats => {
    const totalWorkouts = user?.trainingStats?.totalWorkouts || 0;
    const currentStreak = user?.trainingStats?.currentStreak || 0;
    const averageRating = user?.trainingStats?.averageRating || 0;

    const level = Math.floor(totalWorkouts / WORKOUTS_PER_LEVEL) + 1;
    const xp = totalWorkouts * XP_PER_WORKOUT;
    const nextLevelXp = level * WORKOUTS_PER_LEVEL * XP_PER_WORKOUT; // XP נדרש לרמה הבאה

    return {
      level,
      workouts: totalWorkouts,
      streak: currentStreak,
      rating: Math.round(averageRating * 10) / 10,
      xp,
      nextLevelXp,
    };
  }, [user?.trainingStats]);

  // Profile badges - עם צבעי theme
  const profileBadges = useMemo(
    (): ProfileBadge[] => [
      {
        key: "level",
        text: `רמה ${stats.level}`,
        color: theme.colors.primary,
      },
      {
        key: "workouts",
        text: `${stats.workouts} אימונים`,
        color: theme.colors.success,
      },
      {
        key: "streak",
        text: `${stats.streak} ימי רצף`,
        color: theme.colors.warning,
      },
    ],
    [stats]
  );

  // פונקציות פעולה
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // TODO: Add actual refresh logic here
      // לדוגמה: await refetchUserData()
      logger.info("ProfileData", "Refreshing profile data");

      // זמני: סימולציה של טעינה
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error("ProfileData", "Error refreshing", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      logger.info("ProfileData", "User logged out successfully");
    } catch (error) {
      logger.error("ProfileData", "Error logging out", error);
      throw error; // Re-throw למי שקורא לפונקציה
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // תיקון הלוגיקה - כעת משקף את המשמעות האמיתית
  const canEditName = useCallback((): boolean => {
    // אפשר לערוך שם אם אין שם או שהשם הוא ברירת המחדל
    const currentName = user?.name;
    return !currentName || currentName === "אלוף הכושר";
  }, [user?.name]);

  // בדיקה נוספת - האם המשתמש חדש
  const isNewUser = useMemo(() => {
    return stats.workouts === 0 && !hasQuestionnaireData;
  }, [stats.workouts, hasQuestionnaireData]);

  return {
    // Data
    user,
    stats,
    profileBadges,
    hasQuestionnaireData,
    hasPersonalInfo,
    isNewUser,

    // State
    refreshing,
    loading,
    activeTab,
    setActiveTab,

    // Actions
    handleRefresh,
    handleLogout,
    canEditName,
    updateUser,
  };
};
