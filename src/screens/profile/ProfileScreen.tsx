/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש מתקדם - דשבורד אישי עם הישגים, התקדמות וניהול ציוד
 * @brief Advanced user profile screen - personal dashboard with achievements, progress, and equipment management
 * @dependencies userStore, theme, MaterialCommunityIcons, ImagePicker, DefaultAvatar
 * @notes תמיכה מלאה RTL, אנימציות משופרות, ניהול אווטאר אינטראקטיבי, גדלי טקסט מותאמים למכשירים
 * @notes Full RTL support, enhanced animations, interactive avatar management, device-adapted text sizes
 * @features פרופיל אישי, סטטיסטיקות מתקדמות, מערכת הישגים, ניהול ציוד, הגדרות
 * @features Personal profile, advanced statistics, achievement system, equipment management, settings
 * @performance Optimized with useMemo, useCallback, and efficient data calculations
 * @accessibility Full RTL support, screen reader compatibility, and improved text readability
 * @version 2.4.0 - Enhanced with React.memo, accessibility improvements, and performance optimizations
 * @updated 2025-08-04 שיפורי React.memo, נגישות משופרת ואופטימיזציית ביצועים
 * @enhancements
 * - ✅ React.memo wrapper for component memoization
 * - ✅ Comprehensive accessibility labels and hints
 * - ✅ useMemo optimizations for heavy calculations
 * - ✅ Enhanced JSDoc documentation with bilingual support
 * - ✅ Fixed variable reference conflicts and compilation issues
 * - ✅ Improved component organization and code structure
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
  TextInput,
  Easing,
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
import { ALL_EQUIPMENT } from "../../data/equipmentData";
import * as ImagePicker from "expo-image-picker";
import type { ComponentProps } from "react";
import { User } from "../../types";
import { useModalManager } from "../workout/hooks/useModalManager";
import { UniversalModal } from "../../components/common/UniversalModal";

// 🆕 קבועים וקונפיגורציות מרכזיות / New centralized constants and configurations
import {
  PROFILE_SCREEN_TEXTS,
  formatQuestionnaireValue,
} from "../../constants/profileScreenTexts";
import {
  PROFILE_UI_COLORS,
  STATS_COLORS,
  EQUIPMENT_COLORS,
  BUTTON_COLORS,
  getStatsGradient,
} from "../../constants/profileScreenColors";
import {
  calculateAchievements,
  getUnlockedCount,
  getNextAchievement,
  type Achievement,
} from "../../constants/achievementsConfig";

// =======================================
// 🎯 TypeScript Interfaces & Types
// ממשקי טייפסקריפט וטיפוסים
// =======================================

/**
 * Material Community Icon name type for type safety
 * טיפוס לשם אייקון מ-Material Community עבור בטיחות טיפוסים
 */
type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

/**
 * Workout interface with rating and feedback support
 * ממשק אימון עם תמיכה בדירוג ומשוב
 */
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

/**
 * Basic questionnaire data interface
 * ממשק נתוני שאלון בסיסי
 */
interface QuestionnaireBasicData {
  age?: string | number;
  goal?: string;
  gender?: string;
  [key: string]: unknown;
}

// ===============================================
// 🔧 Constants & Static Data - קונסטנטים ונתונים סטטיים
// ===============================================

/** @description מימדי מסך / Screen dimensions */
const { width: screenWidth } = Dimensions.get("window");

/** @description אוסף אווטארים מוכנים / Preset avatars collection */
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
] as const;

// � הישגים מחושבים דינמית מ-achievementsConfig
// New dynamic achievements calculated from achievementsConfig
// הפונקציה ה-calculateAchievements מיובאת מ-achievementsConfig.ts

/**
 * רכיב מסך הפרופיל הראשי
 * Main Profile Screen Component
 *
 * @component ProfileScreen
 * @description מסך פרופיל משתמש מתקדם עם ניהול הישגים, אוואטרים, וציוד
 * Advanced user profile screen with achievements, avatars, and equipment management
 */
function ProfileScreen() {
  // ===============================================
  // 🔧 Core Dependencies - תלויות בסיסיות
  // ===============================================
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, updateUser, logout: userLogout } = useUserStore();

  // Modal management - אחיד במקום Alert.alert מפוזר
  const { activeModal, modalConfig, hideModal, showComingSoon } =
    useModalManager();

  // ===============================================
  // 🎛️ Local State Management - ניהול מצב מקומי
  // ===============================================
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "💪");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🆕 מצבים חדשים לעריכת שם / New name editing states
  const [showNameModal, setShowNameModal] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [lastNameEdit, setLastNameEdit] = useState<number>(0);

  // 🎉 מצבים להתראות הישגים / Achievement notification states
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(
    null
  );
  const [achievementTooltip, setAchievementTooltip] = useState<{
    achievement: Achievement;
    visible: boolean;
  } | null>(null);

  // ===============================================
  // 🎨 Animation References - הפניות אנימציה
  // ===============================================
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const achievementPulseAnim = useRef(new Animated.Value(1)).current;
  const fireworksOpacity = useRef(new Animated.Value(0)).current;
  const fireworksScale = useRef(new Animated.Value(0.5)).current;

  // ===============================================
  // 💾 Memoized Data Processing - עיבוד נתונים ממוחזר
  // ===============================================

  /** @description בדיקת השלמת השאלון / Questionnaire completion check */
  const questionnaireStatus = useMemo(() => {
    const hasTrainingStage =
      !!user?.questionnaire &&
      (user.questionnaire as QuestionnaireBasicData).age &&
      (user.questionnaire as QuestionnaireBasicData).goal;
    const hasProfileStage =
      !!user?.questionnaire &&
      (user.questionnaire as QuestionnaireBasicData).gender;
    return {
      hasTrainingStage,
      hasProfileStage,
      isComplete: hasTrainingStage && hasProfileStage,
    };
  }, [user?.questionnaire]);

  /** @description חישוב הישגים מהנתונים המדעיים / Calculate achievements from scientific data */
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

  // אנימציית פולס להישגים חדשים // Pulse animation for new achievements
  useEffect(() => {
    const unlockedAchievements = achievements.filter((a) => a.unlocked);
    if (unlockedAchievements.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(achievementPulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(achievementPulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [achievements, achievementPulseAnim]);

  // עדכון avatar כאשר user משתנה
  useEffect(() => {
    if (user?.avatar && user.avatar !== selectedAvatar) {
      setSelectedAvatar(user.avatar);
    }
  }, [user?.avatar, selectedAvatar]);

  // רענון הנתונים // Data refresh
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      // עדכון selectedAvatar מ-user // Update selectedAvatar from user
      if (user?.avatar) {
        setSelectedAvatar(user.avatar);
      }

      // סימולציה של רענון נתונים - במציאות כאן נקרא לAPI // Data refresh simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Error refreshing profile:", error);
      setError(error instanceof Error ? error.message : "שגיאה ברענון הפרופיל");
    } finally {
      setRefreshing(false);
    }
  }, [user?.avatar]);

  // ===============================================
  // 🧮 Performance Optimized Calculations - חישובים מאופטמים
  // ===============================================

  /** @description מערכת XP חכמה עם חישוב ממוחזר / Smart XP system with memoized calculation */
  const calculateXP = useCallback(
    (workouts: number, streak: number, achievements: number): number => {
      let totalXP = 0;

      // XP בסיסי מאימונים (50 XP לכל אימון) / Base XP from workouts
      totalXP += workouts * 50;

      // בונוס רצף (10 XP לכל יום רצף) / Streak bonus
      totalXP += streak * 10;

      // בונוס הישגים (100 XP לכל הישג) / Achievement bonus
      totalXP += achievements * 100;

      // בונוס מיוחד לרצפים ארוכים / Special bonuses for long streaks
      if (streak >= 30) totalXP += 500; // בונוס חודש
      if (streak >= 14) totalXP += 200; // בונוס שבועיים
      if (streak >= 7) totalXP += 100; // בונוס שבוע

      return totalXP;
    },
    []
  );

  /** @description וולידציה לשם משתמש / Username validation */
  const validateName = useCallback((name: string): string | null => {
    const trimmedName = name.trim();

    // בדיקת אורך / Length validation
    if (trimmedName.length < 2) {
      return "השם חייב להכיל לפחות 2 תווים";
    }
    if (trimmedName.length > 30) {
      return "השם לא יכול להכיל יותר מ-30 תווים";
    }

    // בדיקת תווים חוקיים / Valid characters check
    const validPattern = /^[\u0590-\u05FFa-zA-Z0-9\s\-']+$/;
    if (!validPattern.test(trimmedName)) {
      return "השם יכול להכיל רק אותיות עברית/אנגלית, מספרים, רווחים ומקפים";
    }

    // בדיקת מילים אסורות בסיסית / Basic banned words check
    const bannedWords = ["admin", "test", "null", "undefined", "fuck", "shit"];
    const lowerName = trimmedName.toLowerCase();
    for (const word of bannedWords) {
      if (lowerName.includes(word)) {
        return "השם מכיל מילים לא מתאימות";
      }
    }

    return null; // תקין
  }, []);

  // ===============================================
  // 🔧 Helper Functions - פונקציות עזר
  // ===============================================

  /** @description בדיקת הגבלת זמן לעריכת שם / Name edit time restriction check */
  const canEditName = useCallback((): boolean => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // שבוע במילישניות
    return now - lastNameEdit >= oneWeek;
  }, [lastNameEdit]);

  // 🎉 פונקציה להצגת הישג חדש עם אנימציות
  const showNewAchievement = useCallback(
    (achievement: Achievement) => {
      console.log("ProfileScreen: 🎉 הישג חדש נפתח:", achievement.title);

      setNewAchievement(achievement);

      // אנימציית זיקוקים
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fireworksOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
          Animated.timing(fireworksOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(fireworksScale, {
            toValue: 1.2,
            duration: 400,
            easing: Easing.out(Easing.back(1.7)),
            useNativeDriver: true,
          }),
          Animated.timing(fireworksScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // הצגת מודל ההישג אחרי האנימציה
        setTimeout(() => {
          setShowAchievementModal(true);
        }, 500);
      });
    },
    [fireworksOpacity, fireworksScale]
  );

  // 🔍 טיפול בלחיצה ארוכה על הישג (Tooltip)
  const handleAchievementLongPress = useCallback((achievement: Achievement) => {
    console.log("ProfileScreen: הצגת תיאור הישג:", achievement.title);
    setAchievementTooltip({ achievement, visible: true });

    // סגירה אוטומטית אחרי 3 שניות
    setTimeout(() => {
      setAchievementTooltip(null);
    }, 3000);
  }, []);

  // 🎯 בדיקה והשוואה של הישגים חדשים
  const checkForNewAchievements = useCallback(
    (oldAchievements: Achievement[], newAchievements: Achievement[]) => {
      const newUnlocked = newAchievements.filter(
        (newAch) =>
          newAch.unlocked &&
          !oldAchievements.find(
            (oldAch) => oldAch.id === newAch.id && oldAch.unlocked
          )
      );

      // הצגת הישג חדש אם יש
      if (newUnlocked.length > 0) {
        // הצגת ההישג הראשון (אפשר לשנות להצגת כולם)
        showNewAchievement(newUnlocked[0]);
      }
    },
    [showNewAchievement]
  );

  // 💾 שמירת שם חדש
  const handleSaveName = useCallback(async () => {
    const error = validateName(editedName);
    if (error) {
      setNameError(error);
      return;
    }

    if (!canEditName()) {
      setNameError("ניתן לשנות שם פעם בשבוע בלבד");
      return;
    }

    try {
      setLoading(true);
      setNameError(null);

      // עדכון המשתמש
      await updateUser({ name: editedName.trim() });

      // עדכון זמן העריכה האחרונה
      setLastNameEdit(Date.now());

      // סגירת המודל
      setShowNameModal(false);

      Alert.alert("הצלחה", "השם עודכן בהצלחה!");
    } catch (error) {
      console.error("Error updating name:", error);
      setNameError("שגיאה בעדכון השם. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }, [editedName, lastNameEdit, updateUser]);

  // ===============================================
  // 📊 User Info Calculation - חישוב נתוני משתמש
  // ===============================================
  const userInfo = useMemo(() => {
    const questionnaire = (user?.questionnaire || {}) as Record<
      string,
      unknown
    >;

    // תמיכה גם בשאלון החכם החדש
    const smartData = user?.smartQuestionnaireData?.answers;

    // לוג לדיבוג תרגומים
    console.log("ProfileScreen: נתוני משתמש לתרגום:", {
      age: questionnaire.age,
      goal: questionnaire.goal || smartData?.goals?.[0],
      experience:
        questionnaire.experience ||
        questionnaire.fitness_level ||
        smartData?.fitnessLevel,
      frequency: questionnaire.frequency || questionnaire.workout_frequency,
      duration: questionnaire.duration || questionnaire.workout_duration,
      location: questionnaire.location || questionnaire.workout_location,
      gender:
        questionnaire.gender || smartData?.gender || user?.preferences?.gender,
      diet:
        questionnaire.diet_type ||
        questionnaire.diet ||
        smartData?.nutrition?.[0],
    });

    return {
      age: formatQuestionnaireValue("age", questionnaire.age as string),
      goal: formatQuestionnaireValue(
        "goal",
        (questionnaire.goal || smartData?.goals?.[0]) as string
      ),
      experience: formatQuestionnaireValue(
        "experience",
        (questionnaire.experience ||
          questionnaire.fitness_level ||
          smartData?.fitnessLevel) as string
      ),
      frequency: formatQuestionnaireValue(
        "frequency",
        (questionnaire.frequency || questionnaire.workout_frequency) as string
      ),
      duration: formatQuestionnaireValue(
        "duration",
        (questionnaire.duration || questionnaire.workout_duration) as string
      ),
      location: formatQuestionnaireValue(
        "location",
        (questionnaire.location || questionnaire.workout_location) as string
      ),
      gender: formatQuestionnaireValue(
        "gender",
        (questionnaire.gender ||
          smartData?.gender ||
          user?.preferences?.gender) as string
      ),
      height: questionnaire.height ? `${questionnaire.height} ס"מ` : "לא צוין",
      weight: questionnaire.weight ? `${questionnaire.weight} ק"ג` : "לא צוין",
      diet: formatQuestionnaireValue(
        "diet",
        (questionnaire.diet_type ||
          questionnaire.diet ||
          smartData?.nutrition?.[0]) as string
      ),
      // שדות נוספים אפשריים
      activity_level: formatQuestionnaireValue(
        "activity_level",
        questionnaire.activity_level as string
      ),
      workout_time: formatQuestionnaireValue(
        "workout_time",
        (questionnaire.workout_time || questionnaire.preferred_time) as string
      ),
      motivation: formatQuestionnaireValue(
        "motivation",
        questionnaire.motivation as string
      ),
      body_type: formatQuestionnaireValue(
        "body_type",
        questionnaire.body_type as string
      ),
      sleep_hours: formatQuestionnaireValue(
        "sleep_hours",
        questionnaire.sleep_hours as string
      ),
      stress_level: formatQuestionnaireValue(
        "stress_level",
        questionnaire.stress_level as string
      ),
      session_duration: formatQuestionnaireValue(
        "session_duration",
        (questionnaire.session_duration ||
          questionnaire.duration ||
          questionnaire.workout_duration) as string
      ),
      health_conditions: questionnaire.health_conditions
        ? Array.isArray(questionnaire.health_conditions)
          ? questionnaire.health_conditions
              .map((condition) =>
                formatQuestionnaireValue("health_conditions", condition)
              )
              .join(", ")
          : formatQuestionnaireValue(
              "health_conditions",
              questionnaire.health_conditions as string
            )
        : "לא צוין",
      availability: (() => {
        const availabilityData =
          questionnaire.availability || smartData?.availability;
        if (!availabilityData) return "לא צוין";
        if (Array.isArray(availabilityData)) {
          return availabilityData
            .map((day: string) => formatQuestionnaireValue("availability", day))
            .join(", ");
        }
        return formatQuestionnaireValue(
          "availability",
          availabilityData as string
        );
      })(),
    };
  }, [user, formatQuestionnaireValue]);

  // פונקציה למניעת כפילויות בתצוגת המידע - כל השדות דינמיים
  const getDisplayFields = (userInfo: any) => {
    const fields = [];

    // שדות בסיסיים - תמיד מוצגים (אם יש ערך)
    const basicFields = [
      { key: "goal", icon: "target", label: "מטרה", value: userInfo.goal },
      { key: "age", icon: "calendar", label: "גיל", value: userInfo.age },
      {
        key: "experience",
        icon: "arm-flex",
        label: "ניסיון",
        value: userInfo.experience,
      },
      {
        key: "location",
        icon: "map-marker",
        label: "מיקום",
        value: userInfo.location,
      },
    ];

    // הוספת שדות בסיסיים
    basicFields.forEach((field) => {
      if (field.value !== "לא צוין") {
        fields.push(field);
      }
    });

    // בדיקת כפילויות משך אימון - עדיפות ל-duration על פני session_duration
    if (userInfo.duration !== "לא צוין") {
      fields.push({
        key: "duration",
        icon: "clock-outline",
        label: "משך אימון",
        value: userInfo.duration,
      });
    } else if (userInfo.session_duration !== "לא צוין") {
      fields.push({
        key: "session_duration",
        icon: "timer",
        label: "משך מועדף",
        value: userInfo.session_duration,
      });
    }

    // בדיקת כפילויות תדירות - יכול להיות frequency או availability
    if (userInfo.frequency !== "לא צוין") {
      fields.push({
        key: "frequency",
        icon: "calendar-week",
        label: "תדירות",
        value: userInfo.frequency,
      });
    } else if (userInfo.availability !== "לא צוין") {
      fields.push({
        key: "availability",
        icon: "calendar-check",
        label: "זמינות לאימונים",
        value: userInfo.availability,
      });
    }

    // שדות פיזיים אופציונליים
    const physicalFields = [
      {
        key: "height",
        icon: "human-male-height",
        label: "גובה",
        value: userInfo.height,
      },
      { key: "weight", icon: "weight", label: "משקל", value: userInfo.weight },
      { key: "gender", icon: "human", label: "מגדר", value: userInfo.gender },
    ];

    physicalFields.forEach((field) => {
      if (field.value !== "לא צוין") {
        fields.push(field);
      }
    });

    // שדות תזונה ואורח חיים
    const lifestyleFields = [
      { key: "diet", icon: "food-apple", label: "תזונה", value: userInfo.diet },
      {
        key: "activity_level",
        icon: "run",
        label: "רמת פעילות",
        value: userInfo.activity_level,
      },
      {
        key: "workout_time",
        icon: "clock-time-four",
        label: "שעת אימון",
        value: userInfo.workout_time,
      },
      {
        key: "motivation",
        icon: "heart-pulse",
        label: "מוטיבציה",
        value: userInfo.motivation,
      },
      {
        key: "body_type",
        icon: "human-male-board",
        label: "סוג גוף",
        value: userInfo.body_type,
      },
      {
        key: "sleep_hours",
        icon: "sleep",
        label: "שעות שינה",
        value: userInfo.sleep_hours,
      },
      {
        key: "stress_level",
        icon: "alert-circle",
        label: "רמת לחץ",
        value: userInfo.stress_level,
      },
      {
        key: "health_conditions",
        icon: "medical-bag",
        label: "מגבלות רפואיות",
        value: userInfo.health_conditions,
      },
    ];

    lifestyleFields.forEach((field) => {
      if (field.value !== "לא צוין") {
        fields.push(field);
      }
    });

    console.log(
      'ProfileScreen: כל השדות דינמיים - סה"כ:',
      fields.length,
      "שדות:",
      fields.map((f) => f.key)
    );
    console.log("ProfileScreen: ערכי משך אימון:", {
      duration: userInfo.duration,
      session_duration: userInfo.session_duration,
      frequency: userInfo.frequency,
      availability: userInfo.availability,
    });
    return fields;
  };

  // ===============================================
  // 📋 Display Fields Calculation - חישוב שדות תצוגה
  // ===============================================
  const displayFields = useMemo(() => getDisplayFields(userInfo), [userInfo]);

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

      // 🆕 מערכת XP חכמה
      const unlockedAchievements = achievements.filter(
        (a) => a.unlocked
      ).length;
      const totalXP = calculateXP(
        workouts.length,
        streak,
        unlockedAchievements
      );

      // חישוב רמה דינמי (כל 1000 XP = רמה)
      const level = Math.floor(totalXP / 1000) + 1;
      const currentLevelXP = totalXP % 1000;
      const nextLevelXP = 1000;

      return {
        workouts: workouts.length,
        streak,
        totalTime: `${totalHours}h`,
        level,
        xp: currentLevelXP,
        totalXP,
        nextLevelXp: nextLevelXP,
      };
    }

    // נתונים ברירת מחדל
    const defaultWorkouts = user?.trainingStats?.totalWorkouts || 0;
    const defaultAchievements = achievements.filter((a) => a.unlocked).length;
    const defaultXP = calculateXP(defaultWorkouts, 0, defaultAchievements);
    const defaultLevel = Math.floor(defaultXP / 1000) + 1;

    return {
      workouts: defaultWorkouts,
      streak: 0,
      totalTime: "0h",
      level: defaultLevel,
      xp: defaultXP % 1000,
      totalXP: defaultXP,
      nextLevelXp: 1000,
    };
  }, [user, achievements, calculateXP]);

  // =======================================
  // 🛠️ Core Handlers & Event Management
  // פונקציות ליבה וניהול אירועים
  // =======================================

  const handleLogout = useCallback(() => {
    console.log("ProfileScreen: Logout initiated");
    setShowLogoutModal(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    console.log("ProfileScreen: Logout confirmed - מתחיל התנתקות מלאה");

    try {
      // הצגת הודעת טעינה
      setShowLogoutModal(false);
      setLoading(true);

      // התנתקות מלאה עם ניקוי כל הנתונים
      await userLogout();

      console.log("✅ ProfileScreen: התנתקות הושלמה בהצלחה");

      // ניווט למסך הפתיחה עם איפוס מלא של המחסנית
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" as never }],
      });
    } catch (error) {
      console.error("❌ ProfileScreen: שגיאה בהתנתקות:", error);

      // גם במקרה של שגיאה, נווט למסך הפתיחה
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" as never }],
      });
    } finally {
      setLoading(false);
    }
  }, [userLogout, navigation]);

  // 📷 אווטאר מקומי - בחירת תמונות לא נשלחות לשרת
  // Images are stored locally on device only for privacy
  const validateAvatarImage = (uri: string) => {
    // בדיקות בסיסיות לתמונות (אופציונלי)
    // Basic image validation (optional)
    console.log("ProfileScreen: Avatar selected locally:", uri);
    return true; // תמיד מקבל כי זה מקומי
  };

  // בחר מהגלריה // Pick from gallery
  const pickImageFromGallery = useCallback(async () => {
    try {
      console.log("ProfileScreen: Gallery picker opened");
      setError(null);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newAvatar = result.assets[0].uri;

        // 🔒 ולידציה בסיסית (אופציונלי)
        if (validateAvatarImage(newAvatar)) {
          setSelectedAvatar(newAvatar);
          // 💾 אחסון מקומי בלבד - לא נשלח לשרת
          updateUser({ avatar: newAvatar });
          setShowAvatarModal(false);
          console.log(
            "ProfileScreen: Avatar updated locally (not uploaded to server)"
          );
        }
      }
    } catch (error) {
      console.error("ProfileScreen: Gallery picker error:", error);
      setError(error instanceof Error ? error.message : "שגיאה בבחירת תמונה");
    }
  }, [updateUser]);

  // בחר מהמצלמה // Take photo
  const takePhoto = useCallback(async () => {
    try {
      console.log("ProfileScreen: Camera opened");
      setError(null);

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newAvatar = result.assets[0].uri;

        // 🔒 ולידציה בסיסית (אופציונלי)
        if (validateAvatarImage(newAvatar)) {
          setSelectedAvatar(newAvatar);
          // 💾 אחסון מקומי בלבד - לא נשלח לשרת
          updateUser({ avatar: newAvatar });
          setShowAvatarModal(false);
          console.log(
            "ProfileScreen: Avatar updated locally from camera (not uploaded to server)"
          );
        }
      }
    } catch (error) {
      console.error("ProfileScreen: Camera error:", error);
      setError(error instanceof Error ? error.message : "שגיאה בצילום תמונה");
    }
  }, [updateUser]);

  // בחר אימוג'י // Select emoji
  const selectPresetAvatar = useCallback(
    (avatar: string) => {
      console.log("ProfileScreen: Preset avatar selected:", avatar);
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
            <Text style={styles.headerTitle}>
              {PROFILE_SCREEN_TEXTS.HEADERS.PROFILE_TITLE}
            </Text>
            <View style={styles.headerRight}>
              {/* כפתור השלמת שאלון אם לא הושלם */}
              {!questionnaireStatus.isComplete && (
                <TouchableOpacity
                  style={styles.headerQuestionnaireButton}
                  onPress={() =>
                    navigation.navigate("Questionnaire", { stage: "training" })
                  }
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={PROFILE_SCREEN_TEXTS.A11Y.EDIT_PROFILE}
                  accessibilityHint="מעבר למילוי שאלון האימון לקבלת המלצות מותאמות אישית"
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

          {/* הודעת שגיאה */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.errorRetryButton}
                onPress={() => setError(null)}
              >
                <Text style={styles.errorRetryText}>
                  {PROFILE_SCREEN_TEXTS.ACTIONS.GOT_IT}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* כרטיס שאלון אם לא הושלם */}
          {!questionnaireStatus.isComplete && (
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
                  <Text style={styles.questionnaireTitle}>
                    {PROFILE_SCREEN_TEXTS.ACTIONS.COMPLETE_QUESTIONNAIRE}
                  </Text>
                  <Text style={styles.questionnaireSubtitle}>
                    {!questionnaireStatus.hasTrainingStage
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
                accessibilityRole="button"
                accessibilityLabel="שינוי תמונת פרופיל"
                accessibilityHint="לחיצה לפתיחת גלריית אווטארים וחלופות תמונה"
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

            {/* שם המשתמש עם כפתור עריכה */}
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{user?.name || "אלוף הכושר"}</Text>
              <TouchableOpacity
                style={styles.editNameButton}
                onPress={() => {
                  if (canEditName()) {
                    setEditedName(user?.name || "");
                    setNameError(null);
                    setShowNameModal(true);
                  } else {
                    const nextEditDate = new Date(
                      lastNameEdit + 7 * 24 * 60 * 60 * 1000
                    );
                    Alert.alert(
                      "הגבלת זמן",
                      `ניתן לשנות שם פעם בשבוע.\nעריכה הבאה תהיה זמינה ב-${nextEditDate.toLocaleDateString("he-IL")}`
                    );
                  }
                }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  canEditName() ? "עריכת שם משתמש" : "עריכת שם - לא זמין"
                }
                accessibilityHint={
                  canEditName()
                    ? "לחיצה לפתיחת חלון עריכת שם המשתמש"
                    : "עריכת שם זמינה פעם בשבוע בלבד"
                }
                accessibilityState={{ disabled: !canEditName() }}
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
            <View style={styles.badgesContainer}>
              {/* תג רצף ימים - תמיד מוצג */}
              <View
                style={[
                  styles.badge,
                  stats.streak > 0 ? styles.activeBadge : styles.inactiveBadge,
                ]}
              >
                <MaterialCommunityIcons
                  name="fire"
                  size={16}
                  color={
                    stats.streak > 0
                      ? STATS_COLORS.STREAK.ACTIVE
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.badgeText,
                    stats.streak > 0
                      ? styles.activeBadgeText
                      : styles.inactiveBadgeText,
                  ]}
                >
                  {stats.streak > 0 ? `${stats.streak} ימי רצף` : "התחל רצף!"}
                </Text>
              </View>

              {/* תגים דינמיים מההישגים הפתוחים - מקסימום 2 */}
              {achievements
                .filter((achievement) => achievement.unlocked)
                .slice(0, 2) // מקסימום 2 הישגים כתגים
                .map((achievement) => (
                  <View
                    key={`badge-${achievement.id}`}
                    style={[styles.badge, styles.achievementTag]}
                  >
                    <MaterialCommunityIcons
                      name={achievement.icon}
                      size={16}
                      color={achievement.color}
                    />
                    <Text style={styles.badgeText}>{achievement.title}</Text>
                  </View>
                ))}

              {/* תג מספר אימונים - אם אין מספיק הישגים */}
              {achievements.filter((a) => a.unlocked).length < 2 && (
                <View style={styles.badge}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.badgeText}>
                    {stats.workouts} {PROFILE_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* מידע אישי מהשאלון - כולו דינמי */}
          {questionnaireStatus.isComplete && (
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>
                {PROFILE_SCREEN_TEXTS.HEADERS.MY_INFO}
              </Text>
              <View style={styles.infoGrid}>
                {/* כל השדות נוצרים באופן דינמי */}
                {displayFields.map((field) => (
                  <View key={field.key} style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name={field.icon as any}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoLabel}>{field.label}</Text>
                    <Text style={styles.infoValue}>{field.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* סטטיסטיקות */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>
              {PROFILE_SCREEN_TEXTS.HEADERS.MY_STATS}
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={getStatsGradient("workouts")}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={24}
                    color={STATS_COLORS.WORKOUTS.ICON}
                  />
                  <Text style={styles.statNumber}>{stats.workouts}</Text>
                  <Text style={styles.statLabel}>
                    {PROFILE_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS}
                  </Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={getStatsGradient("streak")}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="fire"
                    size={24}
                    color={STATS_COLORS.STREAK.ICON}
                  />
                  <Text style={styles.statNumber}>{stats.streak}</Text>
                  <Text style={styles.statLabel}>
                    {PROFILE_SCREEN_TEXTS.STATS.STREAK_DAYS}
                  </Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={getStatsGradient("rating")}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={24}
                    color={STATS_COLORS.RATING.ICON}
                  />
                  <Text style={styles.statNumber}>{stats.totalTime}</Text>
                  <Text style={styles.statLabel}>
                    {PROFILE_SCREEN_TEXTS.STATS.TOTAL_TIME}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* ציוד זמין */}
          {user?.questionnaire && (
            <View style={styles.equipmentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {PROFILE_SCREEN_TEXTS.HEADERS.MY_EQUIPMENT}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Questionnaire", { stage: "training" })
                  }
                >
                  <Text style={styles.seeAllText}>
                    {PROFILE_SCREEN_TEXTS.ACTIONS.EDIT}
                  </Text>
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

                  console.log("ProfileScreen: חילוץ ציוד מהשאלון:", {
                    questionnaire: Object.keys(questionnaire || {}),
                    smartData: user?.smartQuestionnaireData?.answers?.equipment,
                    trainingStats: user?.trainingStats?.selectedEquipment,
                  });

                  // 🆕 השיטה החדשה - ציוד מהשדה החכם
                  if (user?.smartQuestionnaireData?.answers?.equipment) {
                    allEquipment.push(
                      ...user.smartQuestionnaireData.answers.equipment
                    );
                    console.log(
                      "ProfileScreen: נמצא ציוד בשאלון החכם:",
                      user.smartQuestionnaireData.answers.equipment
                    );
                  }

                  // 🔧 תמיכה בשדה trainingStats
                  if (user?.trainingStats?.selectedEquipment) {
                    allEquipment.push(...user.trainingStats.selectedEquipment);
                    console.log(
                      "ProfileScreen: נמצא ציוד ב-trainingStats:",
                      user.trainingStats.selectedEquipment
                    );
                  }

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
                    console.log(
                      "ProfileScreen: נמצא ציוד ב-available_equipment:",
                      questionnaire.available_equipment
                    );
                  }

                  // 🔧 תמיכה לאחור - פורמטים ישנים
                  if (allEquipment.length === 0) {
                    // פורמט רגיל
                    if (questionnaire?.home_equipment) {
                      const homeEq = Array.isArray(questionnaire.home_equipment)
                        ? questionnaire.home_equipment
                        : [];
                      allEquipment.push(...homeEq);
                      console.log("ProfileScreen: נמצא ציוד בית:", homeEq);
                    }
                    if (questionnaire?.gym_equipment) {
                      const gymEq = Array.isArray(questionnaire.gym_equipment)
                        ? questionnaire.gym_equipment
                        : [];
                      allEquipment.push(...gymEq);
                      console.log("ProfileScreen: נמצא ציוד חדר כושר:", gymEq);
                    }

                    // פורמט ישן עם מספרים
                    if (allEquipment.length === 0 && questionnaire[10]) {
                      const oldHomeEq = Array.isArray(questionnaire[10])
                        ? questionnaire[10]
                        : [];
                      allEquipment.push(...oldHomeEq);
                      console.log(
                        "ProfileScreen: נמצא ציוד בפורמט ישן (10):",
                        oldHomeEq
                      );
                    }
                    if (allEquipment.length === 0 && questionnaire[11]) {
                      const oldGymEq = Array.isArray(questionnaire[11])
                        ? questionnaire[11]
                        : [];
                      allEquipment.push(...oldGymEq);
                      console.log(
                        "ProfileScreen: נמצא ציוד בפורמט ישן (11):",
                        oldGymEq
                      );
                    }
                  }

                  // אם עדיין אין ציוד, בואו נבדוק עוד מקורות
                  if (allEquipment.length === 0) {
                    // בדיקת כל השדות בשאלון
                    Object.keys(questionnaire).forEach((key) => {
                      const value = questionnaire[key];
                      if (Array.isArray(value) && key.includes("equipment")) {
                        console.log(`ProfileScreen: בדיקת שדה ${key}:`, value);
                        allEquipment.push(
                          ...value.filter((v) => typeof v === "string")
                        );
                      }
                    });
                  }

                  // הסרת כפילויות // Remove duplicates
                  allEquipment = [...new Set(allEquipment)];

                  console.log("ProfileScreen: ציוד סופי שנמצא:", allEquipment);

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
                        <TouchableOpacity
                          style={styles.addEquipmentButton}
                          onPress={() =>
                            navigation.navigate("Questionnaire", {
                              stage: "training",
                            })
                          }
                        >
                          <Text style={styles.addEquipmentText}>הוסף ציוד</Text>
                        </TouchableOpacity>
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
                                ? PROFILE_SCREEN_TEXTS.VALUES.HOME
                                : equipment.category === "gym"
                                  ? PROFILE_SCREEN_TEXTS.VALUES.GYM
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

          {/* הישגים - הישגים שלא מוצגים כתגים */}
          {(() => {
            // הישגים שכבר מוצגים כתגים (2 הראשונים הפתוחים)
            const badgeAchievements = achievements
              .filter((achievement) => achievement.unlocked)
              .slice(0, 2)
              .map((a) => a.id);

            // הישגים שעדיין לא מוצגים
            const remainingAchievements = achievements.filter(
              (achievement) => !badgeAchievements.includes(achievement.id)
            );

            // אם יש הישגים להציג
            if (remainingAchievements.length > 0) {
              return (
                <View style={styles.achievementsContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      {remainingAchievements.some((a) => a.unlocked)
                        ? PROFILE_SCREEN_TEXTS.HEADERS.ACHIEVEMENTS
                        : PROFILE_SCREEN_TEXTS.HEADERS.GOALS_TO_UNLOCK}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        console.log("ProfileScreen: Show all achievements")
                      }
                    >
                      <Text style={styles.seeAllText}>
                        {PROFILE_SCREEN_TEXTS.ACTIONS.SHOW_ALL}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.achievementsGrid}>
                    {remainingAchievements.map((achievement: Achievement) => (
                      <TouchableOpacity
                        key={achievement.id}
                        activeOpacity={0.8}
                        onLongPress={() => {
                          setAchievementTooltip({
                            visible: true,
                            achievement: achievement,
                          });
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`הישג: ${achievement.title}`}
                        accessibilityHint={
                          achievement.unlocked
                            ? "הישג פתוח - לחיצה ארוכה לפרטים נוספים"
                            : "הישג נעול - לחיצה ארוכה לראות דרישות"
                        }
                        accessibilityState={{
                          disabled: false,
                          selected: achievement.unlocked,
                        }}
                        style={[
                          styles.achievementBadge,
                          !achievement.unlocked && styles.lockedBadge,
                          // אנימציית פולס להישגים פתוחים
                          achievement.unlocked && {
                            transform: [{ scale: achievementPulseAnim }],
                          },
                        ]}
                      >
                        {/* רקע עם גרדיאנט להישגים פתוחים */}
                        {achievement.unlocked && (
                          <LinearGradient
                            colors={[
                              achievement.color + "20",
                              achievement.color + "10",
                            ]}
                            style={styles.achievementGradientBg}
                          />
                        )}

                        {/* אייקון עם אפקט Grayscale להישגים נעולים */}
                        <View
                          style={[
                            styles.achievementIconContainer,
                            !achievement.unlocked && styles.grayscaleContainer,
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

                          {/* אייקון מנעול להישגים נעולים */}
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

                        {/* כותרת עם אפקט מיוחד להישגים פתוחים */}
                        <Text
                          style={[
                            styles.achievementTitle,
                            !achievement.unlocked && styles.lockedText,
                            achievement.unlocked && styles.unlockedTitle,
                          ]}
                        >
                          {achievement.title}
                        </Text>

                        {/* הברקה קטנה להישגים שזה עתה נפתחו */}
                        {achievement.unlocked && (
                          <View style={styles.achievementShine} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            }
            return null; // אם אין הישגים נוספים להציג
          })()}

          {/* הגדרות בסיסיות */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>
              {PROFILE_SCREEN_TEXTS.HEADERS.SETTINGS}
            </Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                console.log("ProfileScreen: Edit questionnaire");
                navigation.navigate("Questionnaire", { stage: "training" });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.settingText}>
                  {PROFILE_SCREEN_TEXTS.ACTIONS.EDIT_QUESTIONNAIRE}
                </Text>
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
                console.log("ProfileScreen: Notifications settings");
                showComingSoon("הגדרות התראות");
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
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel={PROFILE_SCREEN_TEXTS.A11Y.LOGOUT_BUTTON}
            accessibilityHint="לחיצה להתנתקות מהמשתמש הנוכחי וחזרה למסך הכניסה"
          >
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={theme.colors.error}
            />
            <Text style={styles.logoutText}>
              {PROFILE_SCREEN_TEXTS.ACTIONS.LOGOUT}
            </Text>
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
          style={theme.getModalOverlayStyle("bottom")}
          activeOpacity={1}
          onPress={() => setShowAvatarModal(false)}
        >
          <View style={theme.getModalContentStyle("bottom")}>
            <View style={theme.getModalHeaderStyle()}>
              <Text style={styles.modalTitle}>בחר אווטאר</Text>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* הודעת פרטיות */}
            <View style={styles.privacyNotice}>
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color={theme.colors.success}
              />
              <Text style={styles.privacyText}>
                התמונה נשמרת במכשיר שלך בלבד ולא נשלחת לשרת
              </Text>
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

      {/* 🆕 מודל עריכת שם */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNameModal(false)}
      >
        <TouchableOpacity
          style={theme.getModalOverlayStyle("bottom")}
          activeOpacity={1}
          onPress={() => setShowNameModal(false)}
        >
          <View style={theme.getModalContentStyle("bottom")}>
            <View style={theme.getModalHeaderStyle()}>
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
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
                textAlign="right"
                selectTextOnFocus
                accessibilityLabel="שדה עריכת שם משתמש"
                accessibilityHint="הכנס שם מלא עד 30 תווים, לחץ Enter לשמירה"
                accessibilityState={{ disabled: false }}
              />

              {nameError && (
                <Text style={styles.nameErrorText}>{nameError}</Text>
              )}

              <Text style={styles.nameHelpText}>
                • ניתן לשנות שם פעם בשבוع{"\n"}• 2-30 תווים בלבד{"\n"}• אותיות
                עברית/אנגלית, מספרים ומקפים{"\n"}• ללא מילים פוגעניות
              </Text>

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
                  <Text
                    style={[
                      styles.nameModalButtonTextSave,
                      (loading || !editedName.trim()) &&
                        styles.nameModalButtonTextDisabled,
                    ]}
                  >
                    {loading ? "שומר..." : "שמור"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="התנתקות מלאה 🚪"
        message={
          "האם אתה בטוח שברצונך להתנתק?\n\n" +
          "⚠️ פעולה זו תמחק:\n" +
          "• כל נתוני המשתמש\n" +
          "• היסטוריית אימונים\n" +
          "• העדפות אישיות\n" +
          "• נתוני השאלון\n\n" +
          "תצטרך להתחבר מחדש ולמלא את השאלון שוב."
        }
        confirmText="כן, התנתק"
        cancelText="ביטול"
        destructive={true}
        icon="log-out-outline"
      />

      {/* 🎉 מודל הישג חדש */}
      <Modal
        visible={showAchievementModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAchievementModal(false)}
      >
        <View style={styles.achievementModalOverlay}>
          <Animated.View
            style={[
              styles.achievementModalContent,
              {
                opacity: fireworksOpacity,
                transform: [{ scale: fireworksScale }],
              },
            ]}
          >
            {/* אנימציית זיקוקים */}
            <View style={styles.fireworksContainer}>
              <Text style={styles.fireworksText}>🎆✨🎉✨🎆</Text>
            </View>

            {newAchievement && (
              <>
                <MaterialCommunityIcons
                  name={newAchievement.icon}
                  size={80}
                  color={newAchievement.color}
                  style={styles.achievementModalIcon}
                />

                <Text style={styles.achievementModalTitle}>
                  🏆 הישג חדש! 🏆
                </Text>

                <Text style={styles.achievementModalAchievement}>
                  {newAchievement.title}
                </Text>

                <Text style={styles.achievementModalDescription}>
                  {newAchievement.description}
                </Text>

                <TouchableOpacity
                  style={styles.achievementModalButton}
                  onPress={() => setShowAchievementModal(false)}
                >
                  <Text style={styles.achievementModalButtonText}>
                    מעולה! 🎯
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* 💬 Tooltip להישגים */}
      {achievementTooltip && (
        <Modal
          visible={achievementTooltip.visible}
          transparent
          animationType="fade"
          onRequestClose={() => setAchievementTooltip(null)}
        >
          <TouchableOpacity
            style={styles.tooltipOverlay}
            activeOpacity={1}
            onPress={() => setAchievementTooltip(null)}
          >
            <View style={styles.tooltipContent}>
              <View style={styles.tooltipHeader}>
                <MaterialCommunityIcons
                  name={achievementTooltip.achievement.icon}
                  size={24}
                  color={achievementTooltip.achievement.color}
                />
                <Text style={styles.tooltipTitle}>
                  {achievementTooltip.achievement.title}
                </Text>
              </View>

              <Text style={styles.tooltipDescription}>
                {achievementTooltip.achievement.description}
              </Text>

              <Text style={styles.tooltipHint}>💡 לחץ בכל מקום לסגירה</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* מודל אחיד למקום Alert.alert מפוזר */}
      <UniversalModal
        visible={activeModal !== null}
        type={activeModal || "comingSoon"}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={hideModal}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        destructive={modalConfig.destructive}
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

  // Header styles - גדלי טקסט משופרים לקראות טובה יותר
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
    fontSize: 22, // הגדלת הכותרת לגודל יותר קריא
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Profile card styles - טקסט גדול יותר לפרופיל
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
    fontSize: 16, // הגדלת טקסט הרמה
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
    fontSize: 13, // הגדלת טקסט ה-XP
  },
  username: {
    fontSize: 20, // הגדלת שם המשתמש
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: 4,
    writingDirection: "rtl",
  },

  // 🆕 סטיילים לעריכת שם
  usernameContainer: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    gap: 8,
  },

  editNameButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  nameEditContainer: {
    padding: 20,
    gap: 16,
  },

  nameEditLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },

  nameInput: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },

  nameInputError: {
    borderColor: theme.colors.error,
  },

  nameErrorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: "right",
    marginTop: -8,
  },

  nameHelpText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "right",
    lineHeight: 18,
  },

  nameModalButtons: {
    flexDirection: "row-reverse", // RTL
    gap: 12,
    marginTop: 8,
  },

  nameModalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  nameModalButtonCancel: {
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  nameModalButtonSave: {
    backgroundColor: theme.colors.primary,
  },

  nameModalButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
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

  nameModalButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },

  // 🔒 סטיילים להודעת פרטיות אווטאר
  privacyNotice: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.success + "15",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.success + "30",
  },

  privacyText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.success,
    textAlign: "right",
    fontWeight: "500",
  },
  userEmail: {
    fontSize: 15, // הגדלת האימייל
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  badgesContainer: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
    flexWrap: "wrap", // מאפשר מעבר לשורה חדשה
  },
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundElevated,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    gap: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  // תגים פעילים (עם הישגים)
  activeBadge: {
    backgroundColor: theme.colors.primary + "15",
    borderColor: theme.colors.primary + "30",
  },
  // תגים לא פעילים (עדיין לא הושגו)
  inactiveBadge: {
    backgroundColor: theme.colors.textSecondary + "10",
    borderColor: theme.colors.textSecondary + "20",
  },
  // תגים של הישגים
  achievementTag: {
    backgroundColor: theme.colors.success + "15",
    borderColor: theme.colors.success + "30",
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 13, // הגדלת טקסט התגיות
    fontWeight: "500",
    writingDirection: "rtl",
  },
  activeBadgeText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  inactiveBadgeText: {
    color: theme.colors.textSecondary,
  },

  // Questionnaire styles - טקסט גדול יותר לשאלון
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
    fontSize: 18, // הגדלת כותרת השאלון
    fontWeight: theme.typography.h4.fontWeight,
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },
  questionnaireSubtitle: {
    color: theme.colors.surface,
    fontSize: 14, // הגדלת תת כותרת השאלון
    opacity: 0.9,
    textAlign: "right",
    writingDirection: "rtl",
  },
  questionnaireButtonText: {
    color: theme.colors.surface,
    fontSize: 16, // הגדלת טקסט כפתור השאלון
    fontWeight: "600",
    writingDirection: "rtl",
  },

  // Info section styles - מידע אישי עם טקסט גדול יותר
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
    fontSize: 13, // הגדלת תויות המידע
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
    writingDirection: "rtl",
  },
  infoValue: {
    fontSize: 15, // הגדלת ערכי המידע
    color: theme.colors.text,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Stats section styles - סטטיסטיקות עם טקסט גדול יותר
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20, // הגדלת כותרות הקטעים
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
    fontSize: 24, // הגדלת מספרי הסטטיסטיקות
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.surface,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 13, // הגדלת תויות הסטטיסטיקות
    color: theme.colors.surface,
    opacity: 0.8,
    writingDirection: "rtl",
  },

  // Achievements styles - הישגים עם טקסט גדול יותר
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
    fontSize: 15, // הגדלת טקסט "הצג הכל"
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
    position: "relative",
    overflow: "hidden",
    // אפקט מיוחד להישגים פתוחים
    transform: [{ scale: 1 }],
  },
  // רקע גרדיאנט להישגים פתוחים
  achievementGradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.radius.lg,
  },
  // קונטיינר לאייקון עם אפקט grayscale
  achievementIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  grayscaleContainer: {
    // אפקט grayscale באמצעות opacity וכהות
    opacity: 0.4,
  },
  // אייקון מנעול
  lockIconContainer: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  lockedBadge: {
    borderColor: theme.colors.textTertiary + "30",
    backgroundColor: theme.colors.backgroundElevated,
    // הסרת shadow מהישגים נעולים
    shadowOpacity: 0,
    elevation: 0,
  },
  achievementTitle: {
    fontSize: 12, // הגדלת כותרות ההישגים
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 4,
    writingDirection: "rtl",
  },
  unlockedTitle: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  lockedText: {
    color: theme.colors.textTertiary,
    opacity: 0.7,
  },
  // אפקט הברקה להישגים פתוחים
  achievementShine: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: theme.colors.warning,
    borderRadius: 4,
    opacity: 0.8,
    shadowColor: theme.colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },

  // Settings styles - הגדרות עם טקסט גדול יותר
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
    fontSize: 16, // הגדלת טקסט ההגדרות
    color: theme.colors.text,
    writingDirection: "rtl",
  },

  // Logout styles - התנתקות עם טקסט גדול יותר
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
    fontSize: 16, // הגדלת טקסט ההתנתקות
    fontWeight: "600",
    writingDirection: "rtl",
  },

  // Modal styles - removed duplicates, now using theme helpers
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalTitle: {
    fontSize: 20, // הגדלת כותרת המודל
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
    fontSize: 15, // הגדלת טקסט אפשרויות העלאה
    fontWeight: "500",
    writingDirection: "rtl",
  },
  presetsTitle: {
    color: theme.colors.text,
    fontSize: 16, // הגדלת כותרת הפריסטים
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

  // Equipment styles - ציוד עם טקסט גדול יותר
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
    fontSize: 16, // הגדלת טקסט "לא נבחר ציוד"
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginTop: theme.spacing.sm,
    textAlign: "center",
    writingDirection: "rtl",
  },
  noEquipmentSubtext: {
    fontSize: 14, // הגדלת תת טקסט הציוד
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  addEquipmentButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
  },
  addEquipmentText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
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
    fontSize: 12, // הגדלת תוויות הציוד
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
    fontSize: 11, // הגדלת טקסט קטגוריות הציוד
    color: theme.colors.primary,
    fontWeight: "500",
    textAlign: "center",
    writingDirection: "rtl",
  },
  errorContainer: {
    backgroundColor: theme.colors.error + "10",
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    flex: 1,
    fontSize: 15, // הגדלת טקסט השגיאה
    color: theme.colors.error,
    fontWeight: "500",
    writingDirection: "rtl",
    marginRight: theme.spacing.sm,
  },
  errorRetryButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  errorRetryText: {
    color: theme.colors.white,
    fontSize: 14, // הגדלת טקסט כפתור השגיאה
    fontWeight: "600",
  },

  // 🎉 סטיילים לאנימציית הישגים חדשים
  achievementModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  achievementModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: PROFILE_UI_COLORS.SHADOW,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
  },

  fireworksContainer: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  fireworksText: {
    fontSize: 30,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  achievementModalIcon: {
    marginVertical: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  achievementModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },

  achievementModalAchievement: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 15,
  },

  achievementModalDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  achievementModalButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  achievementModalButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  // 💬 סטיילים ל-Tooltip
  tooltipOverlay: {
    flex: 1,
    backgroundColor: PROFILE_UI_COLORS.BACKGROUND.OVERLAY,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  tooltipContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 20,
    maxWidth: "90%",
    shadowColor: PROFILE_UI_COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  tooltipHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  tooltipTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },

  tooltipDescription: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "right",
    lineHeight: 22,
    marginBottom: 10,
  },

  tooltipHint: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});

/**
 * מוטב ProfileScreen עם React.memo להשוואת שינויים
 * ProfileScreen memoized with React.memo for change detection
 */
export default React.memo(ProfileScreen);
