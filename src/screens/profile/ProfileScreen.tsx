/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש מתקדם - דשבורד אישי עם הישגים, התקדמות וניהול ציוד
 * @dependencies userStore, theme, MaterialCommunityIcons, ImagePicker, DefaultAvatar
 * @notes תמיכה מלאה RTL, אנימציות משופרות, ניהול אווטאר אינטראקטיבי
 * @features פרופיל אישי, סטטיסטיקות מתקדמות, מערכת הישגים, ניהול ציוד, הגדרות
 * @updated 2025-07-30 שיפורים RTL ואנימציות עקביות עם הפרויקט
 */

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";
// Removed problematic twoStageQuestionnaireData imports - using simple questionnaire validation
import { ALL_EQUIPMENT } from "../../data/equipmentData";
import * as ImagePicker from "expo-image-picker";
import type { ComponentProps } from "react";
import { User } from "../../stores/userStore";

// טיפוס לאייקון
type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

type Achievement = {
  id: number;
  title: string;
  icon: MaterialCommunityIconName;
  color: string;
  unlocked: boolean;
};

// טיפוס עבור workout עם רייטינג או feedback
interface WorkoutWithRating {
  id: string;
  date?: string;
  completedAt?: string;
  duration?: number;
  rating?: number;
  feedback?: {
    rating?: number;
  };
}

// טיפוס עבור שאלון עם הנתונים הבסיסיים שאנחנו צריכים
interface QuestionnaireBasicData {
  age?: string | number;
  goal?: string;
  gender?: string;
  [key: string]: unknown; // Allow additional properties
}

const { width: screenWidth } = Dimensions.get("window");

// פונקציה לחישוב הישגים מהנתונים המדעיים // Calculate achievements from scientific data
const calculateAchievements = (user: User | null): Achievement[] => {
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "מתחיל נלהב",
      icon: "star",
      color: "#FFD700",
      unlocked: !!user?.scientificProfile, // אם יש פרופיל מדעי
    },
    {
      id: 2,
      title: "7 ימי רצף",
      icon: "fire",
      color: "#FF6347",
      unlocked: false,
    },
    {
      id: 3,
      title: "30 אימונים",
      icon: "medal",
      color: "#C0C0C0",
      unlocked: false,
    },
    {
      id: 4,
      title: "גיבור כושר",
      icon: "trophy",
      color: "#FFD700",
      unlocked: false,
    },
  ];

  // אם יש נתונים מדעיים, חשב הישגים אמיתיים // If scientific data exists, calculate real achievements
  if (user?.activityHistory?.workouts) {
    const workouts = user.activityHistory.workouts;
    const workoutCount = workouts.length;

    // 30 אימונים
    if (workoutCount >= 30) {
      achievements[2].unlocked = true;
    }

    // 7 ימי רצף - בדיקה פשוטה
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentWorkouts = workouts.filter(
      (w: WorkoutWithRating) =>
        new Date(w.date || w.completedAt || "") >= oneWeekAgo
    );

    if (recentWorkouts.length >= 5) {
      // אם יש לפחות 5 אימונים בשבוע
      achievements[1].unlocked = true;
    }

    // גיבור כושר - אם יש יותר מ-50 אימונים עם דירוג גבוה
    const highRatedWorkouts = workouts.filter(
      (w: WorkoutWithRating) => (w.feedback?.rating || w.rating || 0) >= 4
    );

    if (workoutCount >= 50 && highRatedWorkouts.length >= workoutCount * 0.8) {
      achievements[3].unlocked = true;
    }
  }

  return achievements;
};

// דמו אווטארים (אימוג'ים)
const PRESET_AVATARS = [
  "💪",
  "🏃‍♂️",
  "🏋️‍♀️",
  "🤸‍♂️",
  "🏃‍♀️",
  "🧘‍♂️",
  "🧘‍♀️",
  "🚴‍♂️",
  "🚴‍♀️",
  "⛹️‍♂️",
  "⛹️‍♀️",
  "🏊‍♂️",
  "🏊‍♀️",
  "🥊",
  "🤺",
  "🏄‍♂️",
];

export default function ProfileScreen() {
  // נביגציה ומשתמש // Navigation and user
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, updateUser, logout: userLogout } = useUserStore();

  // מצב מקומי // Local state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "💪");
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // אנימציות משופרות // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // בדיקת השלמת השאלון - פשוטה ומאוחדת // Simple and unified questionnaire completion check
  const hasTrainingStage =
    !!user?.questionnaire &&
    (user.questionnaire as QuestionnaireBasicData).age &&
    (user.questionnaire as QuestionnaireBasicData).goal;
  const hasProfileStage =
    !!user?.questionnaire &&
    (user.questionnaire as QuestionnaireBasicData).gender;
  const isQuestionnaireComplete = hasTrainingStage && hasProfileStage;

  // חישוב הישגים מהנתונים המדעיים // Calculate achievements from scientific data
  const achievements = useMemo(() => calculateAchievements(user), [user]);

  useEffect(() => {
    // אנימציות כניסה חלקה // Smooth entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציית פולס לכפתור עריכת אווטאר // Pulse animation for avatar edit button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, pulseAnim]);

  // עדכון avatar כאשר user משתנה
  useEffect(() => {
    if (user?.avatar && user.avatar !== selectedAvatar) {
      setSelectedAvatar(user.avatar);
    }
  }, [user?.avatar, selectedAvatar]);

  // רענון הנתונים // Data refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // עדכון selectedAvatar מ-user // Update selectedAvatar from user
    if (user?.avatar) {
      setSelectedAvatar(user.avatar);
    }

    // סימולציה של רענון נתונים - במציאות כאן נקרא לAPI // Data refresh simulation
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, [user?.avatar]);

  // חישוב מידע נוסף מהשאלון
  // פונקציה להמרת מזהים לטקסטים בעברית
  const formatQuestionnaireValue = (key: string, value: string): string => {
    if (value === "לא צוין" || !value) return "לא צוין";

    const translations: Record<string, Record<string, string>> = {
      age: {
        "18-25": "18-25",
        "26-35": "26-35",
        "36-45": "36-45",
        "46-55": "46-55",
        "56+": "56+",
      },
      goal: {
        weight_loss: "ירידה במשקל",
        muscle_gain: "עליה במסת שריר",
        strength_improvement: "שיפור כוח",
        endurance_improvement: "שיפור סיבולת",
        general_health: "בריאות כללית",
        injury_rehab: "שיקום מפציעה",
      },
      experience: {
        beginner: "מתחיל (0-6 חודשים)",
        intermediate: "בינוני (6-24 חודשים)",
        advanced: "מתקדם (2-5 שנים)",
        expert: "מקצועי (5+ שנים)",
        athlete: "ספורטאי תחרותי",
      },
      frequency: {
        "2-times": "2 פעמים בשבוע",
        "3-times": "3 פעמים בשבוע",
        "4-times": "4 פעמים בשבוע",
        "5-times": "5 פעמים בשבוע",
        "6-7-times": "6-7 פעמים בשבוע",
      },
      duration: {
        "20-30-min": "20-30 דקות",
        "30-45-min": "30-45 דקות",
        "45-60-min": "45-60 דקות",
        "60-90-min": "60-90 דקות",
        "90-plus-min": "90+ דקות",
      },
    };

    return translations[key]?.[value] || value;
  };

  const getUserInfo = () => {
    const questionnaire = (user?.questionnaire || {}) as Record<
      string,
      unknown
    >;

    return {
      age: formatQuestionnaireValue("age", questionnaire.age as string),
      goal: formatQuestionnaireValue("goal", questionnaire.goal as string),
      experience: formatQuestionnaireValue(
        "experience",
        questionnaire.experience as string
      ),
      frequency: formatQuestionnaireValue(
        "frequency",
        questionnaire.frequency as string
      ),
      duration: formatQuestionnaireValue(
        "duration",
        questionnaire.duration as string
      ),
      location:
        questionnaire.location === "home"
          ? "אימונים בבית"
          : questionnaire.location === "gym"
            ? "אימונים בחדר כושר"
            : "לא צוין",
      height: questionnaire.height ? `${questionnaire.height} ס"מ` : "לא צוין",
      weight: questionnaire.weight ? `${questionnaire.weight} ק"ג` : "לא צוין",
      diet: (questionnaire.diet_type as string) || "לא צוין",
    };
  };

  const userInfo = getUserInfo();

  // חישוב סטטיסטיקות מהנתונים המדעיים
  const stats = useMemo(() => {
    if (user?.activityHistory?.workouts) {
      const workouts = user.activityHistory.workouts;

      // חישוב רצף
      const now = new Date();
      let streak = 0;
      let checkDate = new Date(now);
      const sortedWorkouts = [...workouts].sort(
        (a, b) =>
          new Date(b.date || b.completedAt).getTime() -
          new Date(a.date || a.completedAt).getTime()
      );

      for (const workout of sortedWorkouts) {
        const workoutDate = new Date(workout.date || workout.completedAt);
        const diffDays = Math.floor(
          (checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays <= 2) {
          streak++;
          checkDate = workoutDate;
        } else {
          break;
        }
      }

      // חישוב זמן כולל (בשעות)
      const totalMinutes = workouts.reduce(
        (sum: number, w: WorkoutWithRating) => sum + (w.duration || 45),
        0
      );
      const totalHours = Math.floor(totalMinutes / 60);

      // חישוב רמה (כל 20 אימונים = רמה)
      const level = Math.floor(workouts.length / 20) + 1;
      const xp = workouts.length * 50; // 50 XP לכל אימון
      const nextLevelXp = level * 20 * 50;

      return {
        workouts: workouts.length,
        streak,
        totalTime: `${totalHours}h`,
        level,
        xp,
        nextLevelXp,
      };
    }

    // נתונים ברירת מחדל
    return {
      workouts: user?.trainingStats?.totalWorkouts || 0,
      streak: 0,
      totalTime: "0h",
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
    };
  }, [user]);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const confirmLogout = useCallback(() => {
    userLogout();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  }, [userLogout, navigation]);

  // בחר מהגלריה // Pick from gallery
  const pickImageFromGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const newAvatar = result.assets[0].uri;
      setSelectedAvatar(newAvatar);
      updateUser({ avatar: newAvatar });
      setShowAvatarModal(false);
    }
  }, [updateUser]);

  // בחר מהמצלמה // Take photo
  const takePhoto = useCallback(async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const newAvatar = result.assets[0].uri;
      setSelectedAvatar(newAvatar);
      updateUser({ avatar: newAvatar });
      setShowAvatarModal(false);
    }
  }, [updateUser]);

  // בחר אימוג'י // Select emoji
  const selectPresetAvatar = useCallback(
    (avatar: string) => {
      setSelectedAvatar(avatar);
      updateUser({ avatar });
      setShowAvatarModal(false);
    },
    [updateUser]
  );

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.gradient}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <BackButton absolute={false} />
            <Text style={styles.headerTitle}>הפרופיל שלי</Text>
            <View style={styles.headerRight}>
              {/* כפתור השלמת שאלון אם לא הושלם */}
              {!isQuestionnaireComplete && (
                <TouchableOpacity
                  style={styles.headerQuestionnaireButton}
                  onPress={() =>
                    navigation.navigate("Questionnaire", { stage: "training" })
                  }
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="clipboard-list"
                    size={20}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* כרטיס שאלון אם לא הושלם */}
          {!isQuestionnaireComplete && (
            <TouchableOpacity
              style={styles.questionnaireCard}
              onPress={() =>
                navigation.navigate("Questionnaire", { stage: "training" })
              }
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  theme.colors.primaryGradientStart,
                  theme.colors.primaryGradientEnd,
                ]}
                style={styles.questionnaireGradient}
              >
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={24}
                  color={theme.colors.white}
                />
                <View style={styles.questionnaireTextContainer}>
                  <Text style={styles.questionnaireTitle}>השלם את השאלון</Text>
                  <Text style={styles.questionnaireSubtitle}>
                    {!hasTrainingStage
                      ? "קבל תוכנית אימונים מותאמת אישית"
                      : "השלם את הפרופיל האישי שלך"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.white}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* כרטיס פרופיל */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(true)}
                style={styles.avatarContainer}
              >
                {typeof selectedAvatar === "string" &&
                selectedAvatar.startsWith("http") ? (
                  <Image
                    source={{ uri: selectedAvatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : selectedAvatar && selectedAvatar.length === 2 ? (
                  <View style={styles.emojiAvatar}>
                    <Text style={styles.emojiText}>{selectedAvatar}</Text>
                  </View>
                ) : (
                  <View style={styles.avatar}>
                    <DefaultAvatar name={user?.name || "משתמש"} size={90} />
                  </View>
                )}
                <Animated.View
                  style={[
                    styles.editAvatarButton,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={20}
                    color={theme.colors.text}
                  />
                </Animated.View>
              </TouchableOpacity>
              {/* רמה ו-XP */}
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
            </View>
            <Text style={styles.username}>{user?.name || "אלוף הכושר"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "user@gymovoo.com"}
            </Text>
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <MaterialCommunityIcons
                  name="crown"
                  size={16}
                  color="#FFD700"
                />
                <Text style={styles.badgeText}>פרימיום</Text>
              </View>
              <View style={styles.badge}>
                <MaterialCommunityIcons name="fire" size={16} color="#FF6347" />
                <Text style={styles.badgeText}>{stats.streak} ימי רצף</Text>
              </View>
            </View>
          </View>

          {/* מידע אישי מהשאלון */}
          {isQuestionnaireComplete && (
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>המידע שלי</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="target"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>מטרה</Text>
                  <Text style={styles.infoValue}>{userInfo.goal}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>גיל</Text>
                  <Text style={styles.infoValue}>{userInfo.age}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="arm-flex"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>ניסיון</Text>
                  <Text style={styles.infoValue}>{userInfo.experience}</Text>
                </View>
                {userInfo.frequency !== "לא צוין" && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="calendar-week"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoLabel}>תדירות</Text>
                    <Text style={styles.infoValue}>{userInfo.frequency}</Text>
                  </View>
                )}
                {userInfo.duration !== "לא צוין" && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoLabel}>משך אימון</Text>
                    <Text style={styles.infoValue}>{userInfo.duration}</Text>
                  </View>
                )}
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>מיקום</Text>
                  <Text style={styles.infoValue}>{userInfo.location}</Text>
                </View>
                {userInfo.height !== "לא צוין" && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="human-male-height"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoLabel}>גובה</Text>
                    <Text style={styles.infoValue}>{userInfo.height}</Text>
                  </View>
                )}
                {userInfo.weight !== "לא צוין" && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="weight"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoLabel}>משקל</Text>
                    <Text style={styles.infoValue}>{userInfo.weight}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* סטטיסטיקות */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>הסטטיסטיקות שלי</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#4e9eff", "#3a7bc8"]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.statNumber}>{stats.workouts}</Text>
                  <Text style={styles.statLabel}>אימונים</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#ff6b6b", "#d84848"]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons name="fire" size={24} color="#fff" />
                  <Text style={styles.statNumber}>{stats.streak}</Text>
                  <Text style={styles.statLabel}>ימי רצף</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#00d9ff", "#00b8d4"]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.statNumber}>{stats.totalTime}</Text>
                  <Text style={styles.statLabel}>זמן כולל</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* ציוד זמין */}
          {user?.questionnaire && (
            <View style={styles.equipmentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>הציוד שלי</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Questionnaire", { stage: "training" })
                  }
                >
                  <Text style={styles.seeAllText}>ערוך</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.equipmentScroll}
                contentContainerStyle={styles.equipmentScrollContent}
              >
                {(() => {
                  // חילוץ הציוד מהשאלון החדש - תמיכה בשאלון החכם המעודכן
                  const questionnaire: Record<string, unknown> =
                    user.questionnaire as Record<string, unknown>;

                  let allEquipment: string[] = [];

                  // 🆕 השיטה החדשה - ציוד מהשאלות הדינמיות
                  const dynamicQuestions = [
                    "bodyweight_equipment_options", // ציוד ביתי בסיסי
                    "home_equipment_options", // ציוד ביתי מתקדם
                    "gym_equipment_options", // ציוד חדר כושר
                  ];

                  dynamicQuestions.forEach((questionId) => {
                    const answer = questionnaire?.[questionId];
                    if (Array.isArray(answer)) {
                      answer.forEach((option: unknown) => {
                        if (
                          option &&
                          typeof option === "object" &&
                          "metadata" in option &&
                          option.metadata &&
                          typeof option.metadata === "object" &&
                          "equipment" in option.metadata &&
                          Array.isArray(option.metadata.equipment)
                        ) {
                          allEquipment.push(
                            ...(option.metadata.equipment as string[])
                          );
                        }
                      });
                    }
                  });

                  // 🔧 תמיכה בשדה available_equipment החדש
                  if (
                    questionnaire?.available_equipment &&
                    Array.isArray(questionnaire.available_equipment)
                  ) {
                    allEquipment.push(...questionnaire.available_equipment);
                  }

                  // 🔧 תמיכה לאחור - פורמטים ישנים
                  if (allEquipment.length === 0) {
                    // פורמט רגיל
                    if (questionnaire?.home_equipment) {
                      const homeEq = Array.isArray(questionnaire.home_equipment)
                        ? questionnaire.home_equipment
                        : [];
                      allEquipment.push(...homeEq);
                    }
                    if (questionnaire?.gym_equipment) {
                      const gymEq = Array.isArray(questionnaire.gym_equipment)
                        ? questionnaire.gym_equipment
                        : [];
                      allEquipment.push(...gymEq);
                    }

                    // פורמט ישן עם מספרים
                    if (allEquipment.length === 0 && questionnaire[10]) {
                      const oldHomeEq = Array.isArray(questionnaire[10])
                        ? questionnaire[10]
                        : [];
                      allEquipment.push(...oldHomeEq);
                    }
                    if (allEquipment.length === 0 && questionnaire[11]) {
                      const oldGymEq = Array.isArray(questionnaire[11])
                        ? questionnaire[11]
                        : [];
                      allEquipment.push(...oldGymEq);
                    }
                  }

                  // הסרת כפילויות // Remove duplicates
                  allEquipment = [...new Set(allEquipment)];

                  if (allEquipment.length === 0) {
                    return (
                      <View style={styles.noEquipmentContainer}>
                        <MaterialCommunityIcons
                          name="dumbbell"
                          size={40}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.noEquipmentText}>לא נבחר ציוד</Text>
                        <Text style={styles.noEquipmentSubtext}>
                          השלם את השאלון לקבלת המלצות
                        </Text>
                      </View>
                    );
                  }

                  return allEquipment
                    .map((equipmentId: string) => {
                      // חיפוש ישיר לפי השם מהשאלון // Direct search by name from questionnaire
                      const equipment = ALL_EQUIPMENT.find(
                        (eq) => eq.id === equipmentId
                      );

                      if (!equipment) return null;

                      return (
                        <View key={equipmentId} style={styles.equipmentItem}>
                          <View style={styles.equipmentImageContainer}>
                            {equipment.image ? (
                              <Image
                                source={equipment.image}
                                style={styles.equipmentImage}
                                resizeMode="contain"
                              />
                            ) : (
                              <MaterialCommunityIcons
                                name="dumbbell"
                                size={28}
                                color={theme.colors.primary}
                              />
                            )}
                            {equipment.isPremium && (
                              <View style={styles.equipmentPremiumBadge}>
                                <MaterialCommunityIcons
                                  name="crown"
                                  size={12}
                                  color={theme.colors.warning}
                                />
                              </View>
                            )}
                          </View>
                          <Text style={styles.equipmentLabel} numberOfLines={2}>
                            {equipment.label}
                          </Text>
                          <View style={styles.equipmentCategoryBadge}>
                            <Text style={styles.equipmentCategoryText}>
                              {equipment.category === "home"
                                ? "בית"
                                : equipment.category === "gym"
                                  ? "חדר כושר"
                                  : "שניהם"}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                    .filter(Boolean);
                })()}
              </ScrollView>
            </View>
          )}

          {/* הישגים */}
          <View style={styles.achievementsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ההישגים שלי</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>הצג הכל</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement: Achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementBadge,
                    !achievement.unlocked && styles.lockedBadge,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={achievement.icon}
                    size={30}
                    color={
                      achievement.unlocked
                        ? achievement.color
                        : theme.colors.textTertiary
                    }
                  />
                  <Text
                    style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.lockedText,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* הגדרות בסיסיות */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>הגדרות</Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() =>
                navigation.navigate("Questionnaire", { stage: "training" })
              }
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.settingText}>ערוך שאלון</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                // TODO: הוסף הגדרות התראות
                Alert.alert("בקרוב", "הגדרות התראות יהיו זמינות בקרוב");
              }}
              activeOpacity={0.7}
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

          {/* כפתור התנתקות */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={theme.colors.error}
            />
            <Text style={styles.logoutText}>התנתק</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* מודל בחירת אווטאר */}
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>בחר אווטאר</Text>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
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

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="התנתקות"
        message="האם אתה בטוח שברצונך להתנתק?"
        confirmText="התנתק"
        cancelText="ביטול"
        destructive={true}
        icon="log-out-outline"
      />
    </LinearGradient>
  );
}

// שים את ה־styles שלך כאן (אותו דבר כמו הדוגמה שלך)

const styles = StyleSheet.create({
  // Container and layout styles // סטיילים לקונטיינר ופריסה
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
  },

  // Header styles // סטיילים לכותרת
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerQuestionnaireButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.sm,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Profile card styles // סטיילים לכרטיס פרופיל
  profileCard: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  emojiAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  emojiText: {
    fontSize: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.card,
    ...theme.shadows.small,
  },
  levelContainer: {
    width: "100%",
    alignItems: "center",
  },
  levelText: {
    color: theme.colors.primary,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  xpBar: {
    width: 200,
    height: 8,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.xs,
    overflow: "hidden",
    marginBottom: 4,
  },
  xpProgress: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  xpText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.captionSmall.fontSize,
  },
  username: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: 4,
    writingDirection: "rtl",
  },
  userEmail: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  badgesContainer: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
  },
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundElevated,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    gap: 4,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: theme.typography.captionSmall.fontSize,
    fontWeight: "500",
    writingDirection: "rtl",
  },

  // Questionnaire styles // סטיילים לשאלון
  questionnaireCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  questionnaireButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  questionnaireGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  questionnaireTextContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  questionnaireTitle: {
    color: theme.colors.surface,
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },
  questionnaireSubtitle: {
    color: theme.colors.surface,
    fontSize: theme.typography.bodySmall.fontSize,
    opacity: 0.9,
    textAlign: "right",
    writingDirection: "rtl",
  },
  questionnaireButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    writingDirection: "rtl",
  },

  // Info section styles // סטיילים למידע אישי
  infoContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  infoGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  infoItem: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: "center",
    ...theme.shadows.small,
  },
  infoLabel: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
    writingDirection: "rtl",
  },
  infoValue: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Stats section styles // סטיילים לסטטיסטיקות
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  statGradient: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.surface,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.surface,
    opacity: 0.8,
    writingDirection: "rtl",
  },

  // Achievements styles // סטיילים להישגים
  achievementsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: theme.typography.bodySmall.fontSize,
    writingDirection: "rtl",
  },
  achievementsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  achievementBadge: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4,
    aspectRatio: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  lockedBadge: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 4,
    writingDirection: "rtl",
  },
  lockedText: {
    color: theme.colors.textTertiary,
  },

  // Settings styles // סטיילים להגדרות
  settingsContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  settingItem: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backgroundElevated,
  },
  settingLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  settingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    writingDirection: "rtl",
  },

  // Logout styles // סטיילים להתנתקות
  logoutButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.error + "15",
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    writingDirection: "rtl",
  },

  // Modal styles // סטיילים למודלים
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xl + 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    writingDirection: "rtl",
  },
  uploadOptions: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: theme.spacing.xl,
  },
  uploadOption: {
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.lg,
    width: "45%",
    borderWidth: 1,
    borderColor: theme.colors.backgroundElevated,
  },
  uploadOptionText: {
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: "500",
    writingDirection: "rtl",
  },
  presetsTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    textAlign: "right",
    writingDirection: "rtl",
  },
  avatarGrid: {
    alignItems: "center",
  },
  presetAvatar: {
    width: 70,
    height: 70,
    margin: theme.spacing.xs,
    borderRadius: 35,
    backgroundColor: theme.colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPreset: {
    borderColor: theme.colors.primary,
  },
  presetAvatarText: {
    fontSize: 35,
  },

  // Equipment styles // סטיילים לציוד
  equipmentContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.small,
  },
  equipmentScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  equipmentScrollContent: {
    paddingRight: theme.spacing.lg,
  },
  noEquipmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  noEquipmentText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginTop: theme.spacing.sm,
    textAlign: "center",
    writingDirection: "rtl",
  },
  noEquipmentSubtext: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  equipmentItem: {
    alignItems: "center",
    marginLeft: theme.spacing.md,
    width: 80,
  },
  equipmentImageContainer: {
    position: "relative",
    width: 60,
    height: 60,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.backgroundElevated,
  },
  equipmentImage: {
    width: 40,
    height: 40,
  },
  equipmentPremiumBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.warning,
    borderRadius: theme.radius.xs,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  equipmentLabel: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: theme.spacing.xs,
    lineHeight: 16,
    writingDirection: "rtl",
  },
  equipmentCategoryBadge: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  equipmentCategoryText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    textAlign: "center",
    writingDirection: "rtl",
  },
});
