/**
 * @file src/features/profile/screens/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../../../core/theme";
import { RootStackParamList } from "../../../navigation/types";
import BackButton from "../../../components/common/BackButton";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import AppButton from "../../../components/common/AppButton";
import { useUserStore } from "../../../stores/userStore";
import { useQuestionnaireStatus } from "../../questionnaire/hooks";
import DefaultAvatar from "../../../components/common/DefaultAvatar";
import BMIBMRCalculator from "../../../components/profile/BMIBMRCalculator";
import AchievementSystem from "../../../components/achievement/AchievementSystem";
import { User } from "../../../core/types";
import { userApi } from "../../../services/api/userApi";
import { PROFILE_SCREEN_TEXTS } from "../../../constants/profileScreenTexts";
import {
  calculateAchievements,
  type AchievementDisplay,
} from "../../../constants/achievementsConfig";

const PRESET_AVATARS = [
  "💪",
  "🏋️",
  "🏃",
  "🚴",
  "🤸",
  "🧘",
  "🥊",
  "⚽",
  "🏀",
  "🎾",
  "🏐",
  "🏓",
  "🏸",
  "🥅",
  "⛳",
  "🏹",
  "🎣",
  "🤾",
  "🏇",
  "🧗",
  "🏂",
  "🏄",
  "🚣",
  "🏊",
  "🤽",
  "🤿",
  "🛷",
  "🥌",
  "🛹",
  "🤺",
];

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout, updateUser } = useUserStore();
  const questionnaireStatus = useQuestionnaireStatus();
  const scrollRef = useRef<ScrollView>(null);

  // Check if user has personal info
  const hasPersonalInfo =
    !!user?.personalInfo && Object.keys(user.personalInfo).length > 3;

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    user?.avatar || null
  );
  const [editedName, setEditedName] = useState(user?.name || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Stats calculation - using real user data
  const totalWorkouts = user?.trainingStats?.totalWorkouts || 0;
  const currentStreak = user?.trainingStats?.currentStreak || 0;
  const averageRating = user?.trainingStats?.averageRating || 0;

  // Calculate level based on total workouts (every 10 workouts = 1 level)
  const level = Math.max(1, Math.floor(totalWorkouts / 10) + 1);

  // Calculate XP based on workouts and streak
  const baseXp = totalWorkouts * 50; // 50 XP per workout
  const streakBonus = currentStreak * 10; // 10 XP per streak day
  const currentXp = baseXp + streakBonus;
  const nextLevelXp = level * 500; // Each level requires 500 more XP

  const stats = {
    level,
    workouts: totalWorkouts,
    streak: currentStreak,
    rating: averageRating,
    xp: currentXp,
    nextLevelXp,
  };

  // Achievements
  const achievements = calculateAchievements(user);

  // Equipment extraction - simplified
  const extractUserEquipment = (user: User | null) => {
    if (!user?.questionnaireData?.answers) return [];

    const answers = user.questionnaireData.answers;
    const equipment: Array<{
      id: string;
      label: string;
      description?: string;
    }> = [];

    // חפצים ביתיים
    if (
      answers.bodyweight_equipment &&
      answers.bodyweight_equipment.length > 0
    ) {
      answers.bodyweight_equipment.forEach((item) => {
        switch (item) {
          case "bodyweight_only":
            equipment.push({
              id: "bodyweight",
              label: "משקל גוף",
              description: "ללא ציוד נוסף",
            });
            break;
          case "mat_available":
            equipment.push({
              id: "yoga_mat",
              label: "מזרון יוגה",
              description: "לתרגילי רצפה",
            });
            break;
          case "chair_available":
            equipment.push({
              id: "chair",
              label: "כיסא יציב",
              description: "לתרגילי דחיפה",
            });
            break;
          case "wall_space":
            equipment.push({
              id: "wall",
              label: "קיר פנוי",
              description: "למתיחות ותרגילי קיר",
            });
            break;
          case "stairs_available":
            equipment.push({
              id: "stairs",
              label: "מדרגות",
              description: "לאימוני קרדיו",
            });
            break;
          case "water_bottles":
            equipment.push({
              id: "water_bottles",
              label: "בקבוקי מים",
              description: "כמשקולות קלות",
            });
            break;
        }
      });
    }

    // ציוד ביתי מקצועי
    if (answers.home_equipment && answers.home_equipment.length > 0) {
      answers.home_equipment.forEach((item) => {
        switch (item) {
          case "dumbbells":
            equipment.push({
              id: "dumbbells",
              label: "משקולות יד",
              description: "מגוון משקלים",
            });
            break;
          case "resistance_bands":
            equipment.push({
              id: "resistance_bands",
              label: "גומיות התנגדות",
              description: "עמידות שונות",
            });
            break;
          case "kettlebell":
            equipment.push({
              id: "kettlebells",
              label: "קטלבל",
              description: "אימון פונקציונלי",
            });
            break;
          case "yoga_mat":
            equipment.push({
              id: "yoga_mat",
              label: "מזרון יוגה",
              description: "לתרגילי רצפה",
            });
            break;
          case "pullup_bar":
            equipment.push({
              id: "pull_up_bar",
              label: "מתקן מתח",
              description: "למשיכות ותליות",
            });
            break;
          case "exercise_ball":
            equipment.push({
              id: "stability_ball",
              label: "כדור פיטנס",
              description: "ליציבות וכוח ליבה",
            });
            break;
          case "trx":
            equipment.push({
              id: "trx",
              label: "רצועות TRX",
              description: "אימון השעיה",
            });
            break;
        }
      });
    }

    // ציוד חדר כושר
    if (answers.gym_equipment && answers.gym_equipment.length > 0) {
      answers.gym_equipment.forEach((item) => {
        switch (item) {
          case "free_weights":
            equipment.push({
              id: "barbells",
              label: "משקולות חופשיות",
              description: "משקולות יד ומוטות",
            });
            break;
          case "cable_machine":
            equipment.push({
              id: "cables",
              label: "מכונת כבלים",
              description: "תרגילים מגוונים",
            });
            break;
          case "squat_rack":
            equipment.push({
              id: "squat_rack",
              label: "מתקן סקוואט",
              description: "לתרגילי רגליים",
            });
            break;
          case "bench_press":
            equipment.push({
              id: "bench_press",
              label: "ספסל דחיפה",
              description: "לתרגילי חזה",
            });
            break;
          case "leg_press":
            equipment.push({
              id: "leg_press",
              label: "מכונת רגליים",
              description: "לחיזוק רגליים",
            });
            break;
          case "lat_pulldown":
            equipment.push({
              id: "lat_pulldown",
              label: "מכונת גב",
              description: "למשיכות גב",
            });
            break;
          case "rowing_machine":
            equipment.push({
              id: "rowing_machine",
              label: "מכונת חתירה",
              description: "קרדיו וכוח",
            });
            break;
          case "treadmill":
            equipment.push({
              id: "treadmill",
              label: "הליכון",
              description: "ריצה והליכה",
            });
            break;
          case "bike":
            equipment.push({
              id: "bike",
              label: "אופני כושר",
              description: "קרדיו ורגליים",
            });
            break;
        }
      });
    }

    // אם אין ציוד ספציפי, תמיד נוסיף "משקל גוף" כברירת מחדל
    if (equipment.length === 0) {
      equipment.push({
        id: "bodyweight",
        label: "משקל גוף",
        description: "אימונים ללא ציוד",
      });
    }

    return equipment;
  };

  // Questionnaire results extraction and formatting
  const extractQuestionnaireResults = (user: User | null) => {
    if (!user?.questionnaireData?.answers) return [];

    const answers = user.questionnaireData.answers;
    const results: Array<{ icon: string; label: string; value: string }> = [];

    // Map answer IDs to readable Hebrew text
    const answerMapping: Record<string, Record<string, string>> = {
      gender: {
        male: "זכר",
        female: "נקבה",
        prefer_not_to_say: "מעדיף/ה לא לציין",
      },
      age: {
        under_18: "מתחת ל-18",
        "18_25": "18-25",
        "26_35": "26-35",
        "36_50": "36-50",
        "51_65": "51-65",
        over_65: "מעל 65",
      },
      weight: {
        under_50: 'מתחת ל-50 ק"ג',
        "50_60": '50-60 ק"ג',
        "61_70": '61-70 ק"ג',
        "71_80": '71-80 ק"ג',
        "81_90": '81-90 ק"ג',
        "91_100": '91-100 ק"ג',
        over_100: 'מעל 100 ק"ג',
        prefer_not_to_say_weight: "מעדיף/ה לא לציין",
      },
      height: {
        under_150: 'מתחת ל-150 ס"מ',
        "150_160": '150-160 ס"מ',
        "161_170": '161-170 ס"מ',
        "171_180": '171-180 ס"מ',
        "181_190": '181-190 ס"מ',
        over_190: 'מעל 190 ס"מ',
        prefer_not_to_say_height: "מעדיף/ה לא לציין",
      },
      fitness_goal: {
        lose_weight: "ירידה במשקל",
        build_muscle: "בניית שריר",
        general_fitness: "כושר כללי",
        athletic_performance: "ביצועים ספורטיביים",
      },
      experience_level: {
        beginner: "מתחיל",
        intermediate: "בינוני",
        advanced: "מתקדם",
      },
      availability: {
        "2_days": "2 ימים בשבוע",
        "3_days": "3 ימים בשבוע",
        "4_days": "4 ימים בשבוע",
        "5_days": "5 ימים בשבוע",
        "6_days": "6 ימים בשבוע",
        "7_days": "כל יום",
      },
      workout_duration: {
        "15_30_min": "15-30 דקות",
        "30_45_min": "30-45 דקות",
        "45_60_min": "45-60 דקות",
        "60_plus_min": "יותר מ-60 דקות",
      },
      workout_location: {
        home_bodyweight: "בית - משקל גוף",
        home_equipment: "בית - עם ציוד",
        gym: "חדר כושר",
        outdoor: "בחוץ",
      },
    };

    // Helper function to safely get mapped value - but handle numeric converted values
    const getMappedValue = (
      category: string,
      key: string | number | string[] | undefined
    ): string => {
      if (!key) return "";

      // For numeric values (converted by toSmartQuestionnaireData), map back to range
      if (typeof key === "number") {
        if (category === "age") {
          if (key <= 18) return "מתחת ל-18";
          if (key <= 25) return "18-25";
          if (key <= 35) return "26-35";
          if (key <= 50) return "36-50";
          if (key <= 65) return "51-65";
          return "מעל 65";
        }
        if (category === "weight") {
          if (key < 50) return 'מתחת ל-50 ק"ג';
          if (key <= 60) return '50-60 ק"ג';
          if (key <= 70) return '61-70 ק"ג';
          if (key <= 80) return '71-80 ק"ג';
          if (key <= 90) return '81-90 ק"ג';
          if (key <= 100) return '91-100 ק"ג';
          return 'מעל 100 ק"ג';
        }
        if (category === "height") {
          if (key < 150) return 'מתחת ל-150 ס"מ';
          if (key <= 160) return '150-160 ס"מ';
          if (key <= 170) return '161-170 ס"מ';
          if (key <= 180) return '171-180 ס"מ';
          if (key <= 190) return '181-190 ס"מ';
          return 'מעל 190 ס"מ';
        }
      }

      const keyStr = String(key);
      return answerMapping[category]?.[keyStr] || keyStr;
    };

    // Add results based on available answers
    if (answers.gender) {
      results.push({
        icon: "gender-male-female",
        label: "מין",
        value: getMappedValue("gender", answers.gender),
      });
    }

    if (answers.age) {
      results.push({
        icon: "cake-variant",
        label: "גיל",
        value: getMappedValue("age", answers.age),
      });
    }

    if (answers.weight) {
      results.push({
        icon: "scale-bathroom",
        label: "משקל",
        value: getMappedValue("weight", answers.weight),
      });
    }

    if (answers.height) {
      results.push({
        icon: "human-male-height",
        label: "גובה",
        value: getMappedValue("height", answers.height),
      });
    }

    if (answers.fitness_goal) {
      const goal = Array.isArray(answers.fitness_goal)
        ? answers.fitness_goal[0]
        : answers.fitness_goal;
      results.push({
        icon: "target",
        label: "מטרת כושר",
        value: getMappedValue("fitness_goal", goal),
      });
    } else if (Array.isArray(answers.goals) && answers.goals.length > 0) {
      results.push({
        icon: "target",
        label: "מטרת כושר",
        value: getMappedValue("fitness_goal", answers.goals[0]),
      });
    }

    if (answers.experience_level || answers.fitnessLevel) {
      const level = answers.experience_level || answers.fitnessLevel;
      results.push({
        icon: "medal",
        label: "רמת ניסיון",
        value: getMappedValue("experience_level", level),
      });
    }

    if (answers.availability) {
      const availabilityValue = Array.isArray(answers.availability)
        ? answers.availability[0]
        : answers.availability;
      if (availabilityValue) {
        results.push({
          icon: "calendar-week",
          label: "זמינות",
          value: getMappedValue("availability", availabilityValue),
        });
      }
    }

    if (answers.workout_duration) {
      results.push({
        icon: "clock-outline",
        label: "משך אימון",
        value: getMappedValue("workout_duration", answers.workout_duration),
      });
    }

    if (answers.workout_location || answers.workoutLocation) {
      const location = answers.workout_location || answers.workoutLocation;
      results.push({
        icon: "map-marker",
        label: "מיקום אימון",
        value: getMappedValue("workout_location", location as string),
      });
    }

    return results;
  };

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigation.navigate("Welcome");
  };

  const selectPresetAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    updateUser({ avatar });
    setShowAvatarModal(false);
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedAvatar(result.assets[0].uri);
      updateUser({ avatar: result.assets[0].uri });
      setShowAvatarModal(false);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedAvatar(result.assets[0].uri);
      updateUser({ avatar: result.assets[0].uri });
      setShowAvatarModal(false);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setNameError("שם חובה");
      return;
    }

    if (editedName.length < 2) {
      setNameError("שם קצר מדי");
      return;
    }

    setLoading(true);
    try {
      await userApi.update(user?.id || "", { name: editedName.trim() });
      updateUser({ name: editedName.trim() });
      setShowNameModal(false);
      setNameError(null);
    } catch {
      setNameError("שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  };

  const canEditName = () => {
    return user?.name && user.name !== "אלוף הכושר";
  };

  const showComingSoon = (_feature: string) => {
    // Simple placeholder for coming soon features
  };

  // Profile badges
  const profileBadges = [
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
  ];

  const allEquipment = extractUserEquipment(user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <BackButton />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {PROFILE_SCREEN_TEXTS.HEADERS.PROFILE_TITLE}
          </Text>
          {!questionnaireStatus.isComplete && (
            <TouchableOpacity
              style={styles.headerQuestionnaireButton}
              onPress={() => navigation.navigate("Questionnaire" as never)}
            >
              <MaterialCommunityIcons
                name="clipboard-list"
                size={24}
                color={theme.colors.white}
              />
              <Text style={styles.questionnaireTitle}>
                {PROFILE_SCREEN_TEXTS.ACTIONS.COMPLETE_QUESTIONNAIRE}
              </Text>
            </TouchableOpacity>
          )}

          {!hasPersonalInfo && questionnaireStatus.isComplete && (
            <TouchableOpacity
              style={styles.headerQuestionnaireButton}
              onPress={() => navigation.navigate("PersonalInfo" as never)}
            >
              <MaterialCommunityIcons
                name="account-details"
                size={24}
                color={theme.colors.white}
              />
              <Text style={styles.questionnaireTitle}>
                השלם מידע אישי מתקדם
              </Text>
            </TouchableOpacity>
          )}

          {hasPersonalInfo && (
            <TouchableOpacity
              style={[
                styles.headerQuestionnaireButton,
                { backgroundColor: theme.colors.success },
              ]}
              onPress={() => navigation.navigate("PersonalInfo" as never)}
            >
              <MaterialCommunityIcons
                name="account-edit"
                size={24}
                color={theme.colors.white}
              />
              <Text style={styles.questionnaireTitle}>עדכן מידע אישי</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setShowAvatarModal(true)}
          >
            {selectedAvatar && selectedAvatar.startsWith("http") ? (
              <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
            ) : selectedAvatar && selectedAvatar.length === 2 ? (
              <View style={styles.emojiAvatar}>
                <Text style={styles.emojiText}>{selectedAvatar}</Text>
              </View>
            ) : (
              <View style={styles.avatar}>
                <DefaultAvatar name={user?.name || "משתמש"} size={90} />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <MaterialCommunityIcons
                name="camera"
                size={20}
                color={theme.colors.text}
              />
            </View>
          </TouchableOpacity>

          {/* User Info */}
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{user?.name || "אלוף הכושר"}</Text>
            <TouchableOpacity
              style={styles.editNameButton}
              onPress={() => {
                if (canEditName()) {
                  setEditedName(user?.name || "");
                  setShowNameModal(true);
                }
              }}
              disabled={!canEditName()}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color={
                  canEditName()
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.userEmail}>
            {user?.email || "user@gymovoo.com"}
          </Text>

          {/* Level and XP */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>רמה {stats.level}</Text>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpProgress,
                  { width: `${(stats.xp / stats.nextLevelXp) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {stats.xp}/{stats.nextLevelXp} XP
            </Text>
          </View>

          {/* Badges */}
          <View style={styles.badgesContainer}>
            {profileBadges.map((badge) => (
              <View
                key={badge.key}
                style={[styles.badge, { backgroundColor: badge.color + "20" }]}
              >
                <Text style={[styles.badgeText, { color: badge.color }]}>
                  {badge.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            {PROFILE_SCREEN_TEXTS.HEADERS.MY_STATS}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.statNumber}>{stats.workouts}</Text>
              <Text style={styles.statLabel}>
                {PROFILE_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS}
              </Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="fire"
                size={24}
                color={theme.colors.warning}
              />
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>
                {PROFILE_SCREEN_TEXTS.STATS.STREAK_DAYS}
              </Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color={theme.colors.success}
              />
              <Text style={styles.statNumber}>{stats.rating}</Text>
              <Text style={styles.statLabel}>דירוג</Text>
            </View>
          </View>
        </View>

        {/* BMI/BMR Calculator */}
        <BMIBMRCalculator />

        {/* Achievements Button */}
        <View style={styles.achievementsSection}>
          <TouchableOpacity
            style={styles.achievementsButton}
            onPress={() => setShowAchievements(true)}
          >
            <View style={styles.achievementsButtonContent}>
              <MaterialCommunityIcons
                name="trophy"
                size={28}
                color={theme.colors.warning}
              />
              <View style={styles.achievementsTextContainer}>
                <Text style={styles.achievementsTitle}>הישגים</Text>
                <Text style={styles.achievementsSubtitle}>3 מתוך 8 הושגו</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={theme.colors.textSecondary}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Equipment */}
        <View style={styles.equipmentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>הציוד שלי</Text>
            <TouchableOpacity onPress={() => showComingSoon("עריכת ציוד")}>
              <Text style={styles.editEquipmentText}>ערוך</Text>
            </TouchableOpacity>
          </View>

          {allEquipment.length === 0 ? (
            <View style={styles.noEquipmentContainer}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={40}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.noEquipmentText}>לא נבחר ציוד</Text>
              <Text style={styles.noEquipmentSubtext}>
                לחץ על 'ערוך' כדי לבחור ציוד
              </Text>
            </View>
          ) : (
            <View style={styles.equipmentGrid}>
              {allEquipment.map((equipment, index) => (
                <View
                  key={equipment?.id || index}
                  style={styles.equipmentGridItem}
                >
                  <View style={styles.equipmentImageContainer}>
                    <MaterialCommunityIcons
                      name="dumbbell"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.equipmentLabel} numberOfLines={1}>
                    {equipment?.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Questionnaire Results */}
        {extractQuestionnaireResults(user).length > 0 && (
          <View style={styles.questionnaireSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>תוצאות השאלון</Text>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.questionnaireGrid}>
              {extractQuestionnaireResults(user).map((result, index) => (
                <View key={index} style={styles.questionnaireItem}>
                  <View style={styles.questionnaireIconContainer}>
                    <MaterialCommunityIcons
                      name={
                        result.icon as keyof typeof MaterialCommunityIcons.glyphMap
                      }
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.questionnaireContent}>
                    <Text style={styles.questionnaireLabel}>
                      {result.label}
                    </Text>
                    <Text style={styles.questionnaireValue}>
                      {result.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>הישגים</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {achievements.slice(0, 6).map((achievement: AchievementDisplay) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIconContainer}>
                  <MaterialCommunityIcons
                    name={achievement.icon}
                    size={24}
                    color={
                      achievement.unlocked
                        ? achievement.color
                        : theme.colors.textTertiary
                    }
                  />
                  {!achievement.unlocked && (
                    <View style={styles.lockIconContainer}>
                      <MaterialCommunityIcons
                        name="lock"
                        size={16}
                        color={theme.colors.textTertiary}
                      />
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => showComingSoon("הגדרות התראות")}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.settingText}>התראות</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <AppButton
          title={PROFILE_SCREEN_TEXTS.ACTIONS.LOGOUT}
          variant="danger"
          size="medium"
          icon="logout"
          iconPosition="left"
          onPress={handleLogout}
          style={styles.logoutButton}
          accessibilityLabel="התנתק מהמערכת"
          accessibilityHint="לחץ כדי להתנתק מהחשבון שלך"
        />
      </ScrollView>

      {/* Avatar Modal */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAvatarModal(false)}
        >
          <View style={styles.avatarModalContent}>
            <Text style={styles.modalTitle}>בחר אווטאר</Text>
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={pickImageFromGallery}
              >
                <MaterialCommunityIcons
                  name="image"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.uploadOptionText}>מהגלריה</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                <MaterialCommunityIcons
                  name="camera"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.uploadOptionText}>צלם תמונה</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.presetsTitle}>או בחר אימוג&apos;י:</Text>
            <FlatList
              data={PRESET_AVATARS}
              numColumns={4}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.avatarGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.presetAvatar,
                    selectedAvatar === item && styles.selectedPreset,
                  ]}
                  onPress={() => selectPresetAvatar(item)}
                >
                  <Text style={styles.presetAvatarText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Name Edit Modal */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNameModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNameModal(false)}
        >
          <View style={styles.nameModalContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.modalTitle}>עריכת שם</Text>
              <TouchableOpacity
                onPress={() => setShowNameModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.nameEditContainer}>
              <Text style={styles.nameEditLabel}>שם מלא:</Text>
              <TextInput
                style={[styles.nameInput, nameError && styles.nameInputError]}
                value={editedName}
                onChangeText={(text) => {
                  setEditedName(text);
                  setNameError(null);
                }}
                placeholder="הכנס שם מלא..."
                placeholderTextColor={theme.colors.textSecondary}
                autoFocus
              />
              {nameError && (
                <Text style={styles.nameErrorText}>{nameError}</Text>
              )}
            </View>
            <View style={styles.nameModalButtons}>
              <TouchableOpacity
                style={[styles.nameModalButton, styles.nameModalButtonCancel]}
                onPress={() => setShowNameModal(false)}
              >
                <Text style={styles.nameModalButtonTextCancel}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.nameModalButton,
                  styles.nameModalButtonSave,
                  (loading || !editedName.trim()) &&
                    styles.nameModalButtonDisabled,
                ]}
                onPress={handleSaveName}
                disabled={loading || !editedName.trim()}
              >
                <Text style={styles.nameModalButtonTextSave}>
                  {loading ? "שומר..." : "שמור"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout Confirmation */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="התנתקות"
        message="האם אתה בטוח שברצונך להתנתק?"
        confirmText="התנתק"
        cancelText="ביטול"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        onClose={() => setShowLogoutModal(false)}
        variant="error"
      />

      {/* Achievement System Modal */}
      <AchievementSystem
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  headerQuestionnaireButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  questionnaireTitle: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  emojiAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 40,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  editNameButton: {
    padding: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  levelContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  xpBar: {
    width: "100%",
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  xpProgress: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  xpText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
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
  equipmentSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  editEquipmentText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  noEquipmentContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  noEquipmentText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontWeight: "600",
  },
  noEquipmentSubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
  },
  equipmentGridItem: {
    alignItems: "center",
    width: "30%", // 3 items per row with gap
    minWidth: 80,
  },
  equipmentImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },
  equipmentLabel: {
    fontSize: 11,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "500",
  },
  achievementsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  achievementCard: {
    width: "30%",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    position: "relative",
  },
  achievementIconContainer: {
    position: "relative",
    marginBottom: theme.spacing.sm,
  },
  lockIconContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 2,
  },
  achievementTitle: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "600",
  },
  achievementTitleLocked: {
    color: theme.colors.textTertiary,
  },
  settingsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  settingText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  logoutButton: {
    marginHorizontal: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    maxHeight: "80%",
  },
  nameModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  uploadOptions: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    justifyContent: "center",
  },
  uploadOption: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  uploadOptionText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  avatarGrid: {
    gap: theme.spacing.sm,
  },
  presetAvatar: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing.xs,
  },
  selectedPreset: {
    backgroundColor: theme.colors.primary + "20",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  presetAvatarText: {
    fontSize: 24,
  },
  nameEditContainer: {
    marginBottom: theme.spacing.lg,
  },
  nameEditLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  nameInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "right",
  },
  nameInputError: {
    borderColor: theme.colors.error,
  },
  nameErrorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
    textAlign: "right",
  },
  // Questionnaire Results Styles
  questionnaireSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  questionnaireGrid: {
    gap: theme.spacing.sm,
  },
  questionnaireItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  questionnaireIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  questionnaireContent: {
    flex: 1,
  },
  questionnaireLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginBottom: 2,
  },
  questionnaireValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  nameModalButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  nameModalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  nameModalButtonCancel: {
    backgroundColor: theme.colors.surface,
  },
  nameModalButtonSave: {
    backgroundColor: theme.colors.primary,
  },
  nameModalButtonDisabled: {
    opacity: 0.5,
  },
  nameModalButtonTextCancel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  nameModalButtonTextSave: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // Achievement styles
  achievementsSection: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  achievementsButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  achievementsTextContainer: {
    flex: 1,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  achievementsSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
