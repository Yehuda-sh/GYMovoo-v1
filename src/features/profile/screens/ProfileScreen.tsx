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
import { isRTL, wrapBidi } from "../../../utils/rtlHelpers";
import { UNIFIED_QUESTIONS } from "../../questionnaire/data/unifiedQuestionnaire";
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

  // Mapping function for questionnaire values - using real questionnaire data
  const getMappedValue = (
    key: string,
    value: string | number | undefined
  ): string => {
    if (!value) return "לא צוין";

    // מחפש את השאלה הרלוונטית בשאלון
    const relevantQuestion = UNIFIED_QUESTIONS.find((q) => q.id === key);

    if (relevantQuestion && relevantQuestion.options) {
      // מחפש את האופציה הרלוונטית
      const option = relevantQuestion.options.find(
        (opt) => opt.id === value?.toString()
      );
      if (option) {
        return option.label;
      }
    }

    // מיפויים מיוחדים אם לא נמצאו בשאלון
    const specialMappings: Record<string, Record<string, string>> = {
      age: {
        "16": "מתחת ל-18",
        "22": "18-25",
        "30": "26-35",
        "43": "36-50",
        "58": "51-65",
        "70": "מעל 65",
      },
      weight: {
        "45": 'מתחת ל-50 ק"ג',
        "55": '50-60 ק"ג',
        "65": '61-70 ק"ג',
        "75": '71-80 ק"ג',
        "85": '81-90 ק"ג',
        "95": '91-100 ק"ג',
        "105": 'מעל 100 ק"ג',
      },
      height: {
        "145": 'מתחת ל-150 ס"מ',
        "155": '150-160 ס"מ',
        "165": '161-170 ס"מ',
        "175": '171-180 ס"מ',
        "185": '181-190 ס"מ',
        "195": 'מעל 190 ס"מ',
      },
    };

    const specialMapping = specialMappings[key];
    if (specialMapping) {
      const mappedValue = specialMapping[value.toString()];
      if (mappedValue) {
        return mappedValue;
      }
    }

    // אם לא מצאנו התאמה, נחזיר את הערך המקורי
    return value.toString();
  };

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
    // Debug: לוג את מבנה הנתונים
    console.log("User data:", user);
    console.log("Questionnaire data:", user?.questionnaireData);
    console.log("Answers:", user?.questionnaireData?.answers);

    if (!user?.questionnaireData?.answers) {
      console.log("No questionnaire answers found");
      // אם אין תשובות, נחזיר לפחות משקל גוף כברירת מחדל
      return [
        {
          id: "bodyweight",
          label: "משקל גוף",
          description: "אימונים ללא ציוד",
        },
      ];
    }

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
    const results: Array<{
      icon: string;
      label: string;
      value: string;
      color?: string; // הוספת צבע
      category?: string; // הוספת קטגוריה
    }> = [];

    // הוספת צבעים לכל קטגוריה
    const categoryColors = {
      personal: theme.colors.primary,
      physical: theme.colors.success,
      goals: theme.colors.warning,
      availability: theme.colors.info,
    };

    if (answers.gender) {
      results.push({
        icon:
          answers.gender === "male"
            ? "human-male"
            : answers.gender === "female"
              ? "human-female"
              : "human",
        label: "מין",
        value: getMappedValue("gender", answers.gender),
        color: categoryColors.personal,
        category: "personal",
      });
    }

    if (answers.age) {
      // תמיד הצג טווח עבור נתוני השאלון
      results.push({
        icon: "calendar-today",
        label: "טווח גיל",
        value: getMappedValue("age", answers.age),
        color: categoryColors.personal,
        category: "personal",
      });
    }

    if (answers.weight) {
      // תמיד הצג טווח עבור נתוני השאלון
      results.push({
        icon: "weight-kilogram",
        label: "טווח משקל",
        value: getMappedValue("weight", answers.weight),
        color: categoryColors.physical,
        category: "physical",
      });
    }

    if (answers.height) {
      // תמיד הצג טווח עבור נתוני השאלון
      results.push({
        icon: "human-male-height-variant",
        label: "טווח גובה",
        value: getMappedValue("height", answers.height),
        color: categoryColors.physical,
        category: "physical",
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
        color: categoryColors.goals,
        category: "goals",
      });
    } else if (Array.isArray(answers.goals) && answers.goals.length > 0) {
      results.push({
        icon: "target",
        label: "מטרת כושר",
        value: getMappedValue("fitness_goal", answers.goals[0]),
        color: categoryColors.goals,
        category: "goals",
      });
    }

    if (answers.experience_level || answers.fitnessLevel) {
      const level = answers.experience_level || answers.fitnessLevel;
      results.push({
        icon: "medal",
        label: "רמת ניסיון",
        value: getMappedValue("experience_level", level),
        color: categoryColors.personal,
        category: "personal",
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
          color: categoryColors.availability,
          category: "availability",
        });
      }
    }

    if (answers.workout_duration) {
      results.push({
        icon: "clock-outline",
        label: "משך אימון",
        value: getMappedValue("workout_duration", answers.workout_duration),
        color: categoryColors.physical,
        category: "physical",
      });
    }

    if (answers.workout_location || answers.workoutLocation) {
      const location = answers.workout_location || answers.workoutLocation;
      results.push({
        icon: "map-marker",
        label: "מיקום אימון",
        value: getMappedValue("workout_location", location as string),
        color: categoryColors.physical,
        category: "physical",
      });
    }

    // הוספת נתוני BMI אחרונים אם קיימים - רק אלו מחושבים במחשבון
    if (user?.lastBMICalculation) {
      const bmiData = user.lastBMICalculation;

      // הוספת הפרדה ויזואלית
      results.push({
        icon: "calculator",
        label: "--- נתונים מחושבים ---",
        value: "מהמחשבון",
        color: theme.colors.info,
        category: "calculated",
      });

      results.push({
        icon: "scale-bathroom",
        label: "BMI מחושב",
        value: `${bmiData.bmi} (${bmiData.bmiCategory})`,
        color: categoryColors.physical,
        category: "calculated",
      });

      results.push({
        icon: "fire",
        label: "BMR מחושב",
        value: `${bmiData.bmr} קלוריות`,
        color: categoryColors.physical,
        category: "calculated",
      });

      if (bmiData.tdee) {
        results.push({
          icon: "nutrition",
          label: "TDEE מחושב",
          value: `${bmiData.tdee} קלוריות יומיות`,
          color: categoryColors.physical,
          category: "calculated",
        });
      }
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

  // הוספת מיפוי אייקונים לציוד
  const getEquipmentIcon = (
    equipmentId: string
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    const iconMap: Record<
      string,
      keyof typeof MaterialCommunityIcons.glyphMap
    > = {
      bodyweight: "human-handsup",
      dumbbells: "dumbbell",
      resistance_bands: "resistor",
      kettlebells: "kettlebell",
      yoga_mat: "yoga",
      pull_up_bar: "arm-flex",
      stability_ball: "circle",
      trx: "weight",
      barbells: "weight-lifter",
      cables: "cable-data",
      squat_rack: "weight",
      bench_press: "sofa",
      treadmill: "run",
      bike: "bike",
      rowing_machine: "rowing",
      chair: "chair-rolling",
      wall: "wall",
      stairs: "stairs-up",
      water_bottles: "bottle-wine-outline",
    };

    return iconMap[equipmentId] || "dumbbell";
  };

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
            {wrapBidi(PROFILE_SCREEN_TEXTS.HEADERS.PROFILE_TITLE)}
          </Text>

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
            <Text style={styles.username}>
              {wrapBidi(user?.name || "אלוף הכושר")}
            </Text>
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

          {user?.email && (
            <Text style={styles.userEmail}>{wrapBidi(user.email)}</Text>
          )}

          {/* Level and XP */}
          {totalWorkouts > 0 && (
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>
                {wrapBidi(`רמה ${stats.level}`)}
              </Text>
              <View style={styles.xpBar}>
                <View
                  style={[
                    styles.xpProgress,
                    { width: `${(stats.xp / stats.nextLevelXp) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.xpText}>
                {wrapBidi(`${stats.xp}/${stats.nextLevelXp} XP`)}
              </Text>
            </View>
          )}

          {/* Badges */}
          {(totalWorkouts > 0 || currentStreak > 0) && (
            <View style={styles.badgesContainer}>
              {profileBadges
                .filter((badge) => {
                  if (badge.key === "level" && totalWorkouts === 0)
                    return false;
                  if (badge.key === "workouts" && totalWorkouts === 0)
                    return false;
                  if (badge.key === "streak" && currentStreak === 0)
                    return false;
                  return true;
                })
                .map((badge) => (
                  <View
                    key={badge.key}
                    style={[
                      styles.badge,
                      { backgroundColor: badge.color + "20" },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: badge.color }]}>
                      {wrapBidi(badge.text)}
                    </Text>
                  </View>
                ))}
            </View>
          )}
        </View>

        {/* Stats */}
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

        {/* BMI/BMR Calculator - רק אם יש נתונים מדויקים */}
        {hasPersonalInfo &&
          user?.personalInfo?.weight &&
          user?.personalInfo?.height && <BMIBMRCalculator />}

        {/* הודעה על הצורך בנתונים מדויקים */}
        {!hasPersonalInfo && (
          <View style={styles.bmiPlaceholderSection}>
            <View style={styles.bmiPlaceholderCard}>
              <MaterialCommunityIcons
                name="calculator"
                size={32}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.bmiPlaceholderTitle}>
                {wrapBidi("מחשבון BMI/BMR")}
              </Text>
              <Text style={styles.bmiPlaceholderText}>
                {wrapBidi(
                  "כדי לקבל חישוב מדויק של BMI ו-BMR, נדרשים נתונים מדויקים של גובה ומשקל"
                )}
              </Text>
              <TouchableOpacity
                style={styles.bmiPlaceholderButton}
                onPress={() => navigation.navigate("PersonalInfo" as never)}
              >
                <Text style={styles.bmiPlaceholderButtonText}>
                  {wrapBidi("הוסף נתונים מדויקים")}
                </Text>
                <MaterialCommunityIcons
                  name={isRTL() ? "chevron-left" : "chevron-right"}
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Achievements Section - Unified */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{wrapBidi("הישגים")}</Text>
            <TouchableOpacity
              onPress={() => setShowAchievements(true)}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllButtonText}>
                {wrapBidi("צפה בהכל")}
              </Text>
              <MaterialCommunityIcons
                name={isRTL() ? "chevron-left" : "chevron-right"}
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Quick stats */}
          <View style={styles.achievementsQuickStats}>
            <View style={styles.achievementQuickStat}>
              <MaterialCommunityIcons
                name="trophy"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.achievementQuickStatText}>
                {wrapBidi(
                  `${achievements.filter((a) => a.unlocked).length} הושגו`
                )}
              </Text>
            </View>
            <View style={styles.achievementQuickStat}>
              <MaterialCommunityIcons
                name="target"
                size={20}
                color={theme.colors.info}
              />
              <Text style={styles.achievementQuickStatText}>
                {wrapBidi(
                  `${achievements.length - achievements.filter((a) => a.unlocked).length} נותרו`
                )}
              </Text>
            </View>
          </View>

          {/* Recent/Featured Achievements Grid */}
          <View style={styles.achievementsGrid}>
            {achievements
              .sort((a, b) => {
                // מיון: הישגים שהושגו לאחרונה קודם, אחר כך הקרובים ביותר
                if (a.unlocked && !b.unlocked) return -1;
                if (!a.unlocked && b.unlocked) return 1;
                return 0;
              })
              .slice(0, 6)
              .map((achievement: AchievementDisplay) => (
                <TouchableOpacity
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    achievement.unlocked && styles.achievementCardUnlocked,
                  ]}
                  onPress={() => setShowAchievements(true)}
                  activeOpacity={0.7}
                >
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
                          size={12}
                          color={theme.colors.textTertiary}
                        />
                      </View>
                    )}
                    {achievement.unlocked && (
                      <View style={styles.checkIconContainer}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={16}
                          color={theme.colors.success}
                        />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.achievementTitleLocked,
                    ]}
                    numberOfLines={2}
                  >
                    {wrapBidi(achievement.title)}
                  </Text>
                  {achievement.unlocked && (
                    <View style={styles.achievementUnlockedIndicator}>
                      <Text style={styles.achievementUnlockedText}>
                        {wrapBidi("הושג!")}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Equipment */}
        <View style={styles.equipmentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{wrapBidi("הציוד שלי")}</Text>
            <TouchableOpacity onPress={() => showComingSoon("עריכת ציוד")}>
              <Text style={styles.editEquipmentText}>{wrapBidi("ערוך")}</Text>
            </TouchableOpacity>
          </View>

          {/* Debug info */}
          {__DEV__ && (
            <Text style={{ color: "red", fontSize: 12, marginBottom: 10 }}>
              Equipment count: {allEquipment.length}
            </Text>
          )}

          {allEquipment.length === 0 ? (
            <View style={styles.noEquipmentContainer}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={40}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.noEquipmentText}>
                {wrapBidi("לא נבחר ציוד")}
              </Text>
              <Text style={styles.noEquipmentSubtext}>
                {wrapBidi("לחץ על 'ערוך' כדי לבחור ציוד")}
              </Text>
            </View>
          ) : (
            <View style={styles.equipmentGrid}>
              {allEquipment.map((equipment, index) => (
                <View key={equipment?.id || index} style={styles.equipmentCard}>
                  <View
                    style={[
                      styles.equipmentIconWrapper,
                      { backgroundColor: theme.colors.primary + "15" },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getEquipmentIcon(equipment.id)}
                      size={28}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.equipmentName} numberOfLines={1}>
                    {wrapBidi(equipment?.label)}
                  </Text>
                  {equipment?.description && (
                    <Text style={styles.equipmentDescription} numberOfLines={1}>
                      {wrapBidi(equipment.description)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Questionnaire Results */}
        {extractQuestionnaireResults(user).length > 0 && (
          <View style={styles.questionnaireSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{wrapBidi("מידע עליי")}</Text>
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>

            {/* הודעת הסבר על טווחים ונתונים מחושבים */}
            <View style={styles.questionnaireExplanation}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color={theme.colors.textSecondary}
                style={styles.explanationIcon}
              />
              <Text style={styles.questionnaireExplanationText}>
                {wrapBidi(
                  "💡 הנתונים מהשאלון מוצגים כטווחים. נתונים מדויקים מוצגים רק לאחר שימוש במחשבון BMI"
                )}
              </Text>
            </View>

            <View>
              {extractQuestionnaireResults(user).map((result, index) => (
                <View
                  key={index}
                  style={[
                    styles.questionnaireItem,
                    result.category === "calculated" &&
                      result.label.includes("---") &&
                      styles.questionnaireSeparator,
                  ]}
                >
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
                    <Text
                      style={[
                        styles.questionnaireLabel,
                        result.category === "calculated" &&
                          result.label.includes("---") &&
                          styles.questionnaireSeparatorLabel,
                      ]}
                    >
                      {wrapBidi(result.label)}
                    </Text>
                    <Text
                      style={[
                        styles.questionnaireValue,
                        result.category === "calculated" &&
                          result.label.includes("---") &&
                          styles.questionnaireSeparatorValue,
                      ]}
                    >
                      {wrapBidi(result.value)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

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
              <Text style={styles.settingText}>{wrapBidi("התראות")}</Text>
            </View>
            <MaterialCommunityIcons
              name={isRTL() ? "chevron-right" : "chevron-left"}
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
        title={wrapBidi("התנתקות")}
        message={wrapBidi("האם אתה בטוח שברצונך להתנתק?")}
        confirmText={wrapBidi("התנתק")}
        cancelText={wrapBidi("ביטול")}
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  headerQuestionnaireButton: {
    flexDirection: isRTL() ? "row-reverse" : "row",
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
    end: isRTL() ? undefined : -5,
    start: isRTL() ? -5 : undefined,
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
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  editNameButton: {
    padding: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  sectionHeader: {
    flexDirection: isRTL() ? "row" : "row-reverse",
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  noEquipmentSubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  equipmentCard: {
    width: "31%",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    // אפקט hover
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  equipmentIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },

  equipmentName: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },

  equipmentDescription: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    marginTop: 2,
  },

  achievementsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  viewAllButton: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  achievementsQuickStats: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  achievementQuickStat: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  achievementQuickStatText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  achievementCard: {
    width: "30%",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  achievementCardUnlocked: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + "10",
  },
  achievementIconContainer: {
    position: "relative",
    marginBottom: theme.spacing.sm,
  },
  lockIconContainer: {
    position: "absolute",
    top: -5,
    end: -5,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 2,
  },
  checkIconContainer: {
    position: "absolute",
    top: -8,
    end: -8,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 1,
  },
  achievementTitle: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    fontWeight: "600",
    lineHeight: 16,
  },
  achievementTitleLocked: {
    color: theme.colors.textTertiary,
  },
  achievementUnlockedIndicator: {
    position: "absolute",
    bottom: -6,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  achievementUnlockedText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.white,
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
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  settingText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    marginBottom: theme.spacing.md,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  uploadOptions: {
    flexDirection: isRTL() ? "row-reverse" : "row",
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
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    textAlign: isRTL() ? "left" : "right",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  nameInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: isRTL() ? "left" : "right",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  nameInputError: {
    borderColor: theme.colors.error,
  },
  nameErrorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
    textAlign: isRTL() ? "left" : "right",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  nameModalButtons: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  nameModalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  nameModalButtonCancel: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nameModalButtonSave: {
    backgroundColor: theme.colors.primary,
  },
  nameModalButtonDisabled: {
    backgroundColor: theme.colors.surface,
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
  // Questionnaire Results Styles
  questionnaireSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionnaireItem: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  questionnaireIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginStart: isRTL() ? 0 : theme.spacing.sm,
    marginEnd: isRTL() ? theme.spacing.sm : 0,
  },
  questionnaireContent: {
    flex: 1,
    alignItems: isRTL() ? "flex-start" : "flex-end",
  },
  questionnaireLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  questionnaireValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  // BMI Placeholder Styles
  bmiPlaceholderSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  bmiPlaceholderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: theme.spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  bmiPlaceholderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  bmiPlaceholderText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  bmiPlaceholderButton: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary + "10",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  bmiPlaceholderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  // Questionnaire explanation styles
  questionnaireExplanation: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.warning + "10",
    padding: theme.spacing.sm,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  explanationIcon: {
    marginEnd: isRTL() ? 0 : theme.spacing.xs,
    marginStart: isRTL() ? theme.spacing.xs : 0,
  },
  questionnaireExplanationText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  // Separator styles for calculated data
  questionnaireSeparator: {
    backgroundColor: theme.colors.info + "15",
    borderStartWidth: isRTL() ? 0 : 4,
    borderEndWidth: isRTL() ? 4 : 0,
    borderLeftColor: isRTL() ? "transparent" : theme.colors.info,
    borderRightColor: isRTL() ? theme.colors.info : "transparent",
    marginTop: theme.spacing.md,
  },
  questionnaireSeparatorLabel: {
    fontWeight: "bold",
    color: theme.colors.info,
    fontSize: 13,
  },
  questionnaireSeparatorValue: {
    fontWeight: "bold",
    color: theme.colors.info,
    fontSize: 12,
  },
});
