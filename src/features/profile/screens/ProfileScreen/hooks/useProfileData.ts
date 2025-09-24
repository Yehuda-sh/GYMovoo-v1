/**
 * @file src/features/profile/screens/ProfileScreen/hooks/useProfileData.ts
 * @description Hook לניהול נתוני הפרופיל - הפרדת לוגיקה מ-UI
 *
 * השאלות שהובילו ליצירת ה-Hook הזה:
 * - "למה הפונקציה הזאת כל כך מורכבת?" - כל הלוגיקה הייתה במסך אחד
 * - "אפשר לעשות את זה בשורה אחת?" - פישוט חישובי הנתונים
 */

import { useState, useMemo, useCallback } from "react";
import { useUserStore } from "../../../../../stores/userStore";

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

  // חישובי סטטיסטיקות - פשוט יותר
  const stats = useMemo((): ProfileStats => {
    const totalWorkouts = user?.trainingStats?.totalWorkouts || 0;
    const currentStreak = user?.trainingStats?.currentStreak || 0;
    const averageRating = user?.trainingStats?.averageRating || 0;

    const level = Math.floor(totalWorkouts / 10) + 1;
    const xp = totalWorkouts * 10;
    const nextLevelXp = level * 100;

    return {
      level,
      workouts: totalWorkouts,
      streak: currentStreak,
      rating: Math.round(averageRating * 10) / 10,
      xp,
      nextLevelXp,
    };
  }, [user?.trainingStats]);

  // Profile badges - פשוט יותר
  const profileBadges = useMemo(
    (): ProfileBadge[] => [
      {
        key: "level",
        text: `רמה ${stats.level}`,
        color: "#007AFF",
      },
      {
        key: "workouts",
        text: `${stats.workouts} אימונים`,
        color: "#34C759",
      },
      {
        key: "streak",
        text: `${stats.streak} ימי רצף`,
        color: "#FF9500",
      },
    ],
    [stats]
  );

  // פונקציות פעולה
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Refresh user data
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
    } catch (error) {
      logger.error("ProfileData", "Error logging out", error);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const canEditName = useCallback((): boolean => {
    return !!(user?.name && user.name !== "אלוף הכושר");
  }, [user?.name]);

  return {
    // Data
    user,
    stats,
    profileBadges,
    hasQuestionnaireData,
    hasPersonalInfo,

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
