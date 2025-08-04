/**
 * @file src/screens/main/MainScreen.tsx
 * @brief מסך ראשי מודרני - דשבורד מרכזי עם סטטיסטיקות מדעיות והתאמה אישית
 * @brief Modern main screen - Central dashboard with scientific statistics and personalization
 * @dependencies theme, userStore, MaterialCommunityIcons, Animated API, React Navigation
 * @notes תמיכה מלאה RTL, אנימציות משופרות, דמו אינטראקטיבי לשאלון מדעי
 * @notes Full RTL support, enhanced animations, interactive demo for scientific questionnaire
 * @features דשבורד אישי, סטטיסטיקות מתקדמות, המלצות AI, היסטוריית אימונים
 * @features Personal dashboard, advanced statistics, AI recommendations, workout history
 * @accessibility Enhanced with proper labels and semantic structure
 * @performance Optimized with React.memo and useMemo hooks
 * @version 2.2.0 - Enhanced organization, accessibility, and performance optimizations
 * @updated 2025-08-04 שיפורי נגישות, ביצועים ועקביות עם הפרויקט
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { RootStackParamList, WorkoutSource } from "../../navigation/types";

import type { ComponentProps } from "react";

// ===============================================
// 🔧 Type Definitions - הגדרות טיפוסים
// ===============================================

/** @description טיפוס לאייקון MaterialCommunityIcons / Type for MaterialCommunityIcons icon */
type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

/** @description טיפוס נגישות לכפתורים / Accessibility type for buttons */
interface AccessibilityProps {
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: "button" | "text" | "header";
}

/** @description טיפוס עבור workout בהיסטוריה / Type for workout in history */
interface WorkoutHistoryItem {
  id: string;
  type?: string;
  workoutName?: string;
  date?: string;
  completedAt?: string;
  startTime?: string;
  duration?: number;
  icon?: string;
  rating?: number;
  feedback?: {
    rating?: number;
  };
  [key: string]: unknown; // Allow additional properties
}

/** @description טיפוס עבור תשובות שאלון עם השדות הנפוצים / Type for questionnaire answers */
interface QuestionnaireAnswers {
  age_range?: string;
  gender?: string;
  primary_goal?: string;
  experience_level?: string;
  workout_location?: string;
  available_equipment?: string[];
  fitness_experience?: string;
  session_duration?: string;
  available_days?: string;
  health_status?: string;
  [key: string]: unknown; // Allow additional properties
}

/** @description טיפוס עבור סטטיסטיקות מעובדות / Type for processed statistics */
interface ProcessedStats {
  totalWorkouts: number;
  currentStreak: number;
  totalVolume: number;
  averageRating: number;
  fitnessLevel: string;
}

/** @description טיפוס עבור פריט דמו באימונים / Type for demo workout item */
interface DemoWorkoutItem {
  name: string;
  date: string;
  rating: string;
  icon: MaterialCommunityIconName;
}

// ===============================================
// 🚀 Main Component - קומפוננטה ראשית
// ===============================================

function MainScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===============================================
  // 🎨 Animation References - אנימציות
  // ===============================================
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // ===============================================
  // 💾 Memoized Data Processing - עיבוד נתונים ממוחזר
  // ===============================================

  /** @description שם המשתמש מותאם עם fallback / Adapted username with fallback */
  const displayName = useMemo(
    () => user?.name || user?.email?.split("@")[0] || "משתמש",
    [user?.name, user?.email]
  );

  /** @description נתונים מדעיים ומקצועיים ממוחזרים / Memoized scientific and professional data */
  const profileData = useMemo(
    () => ({
      scientificProfile: user?.scientificProfile,
      activityHistory: user?.activityHistory,
      currentStats: user?.currentStats,
      aiRecommendations: user?.aiRecommendations,
    }),
    [
      user?.scientificProfile,
      user?.activityHistory,
      user?.currentStats,
      user?.aiRecommendations,
    ]
  );

  /** @description נתוני סטטיסטיקה מעובדים לתצוגה / Processed statistics for display */
  const stats: ProcessedStats = useMemo(
    () => ({
      totalWorkouts: profileData.currentStats?.totalWorkouts || 0,
      currentStreak: profileData.currentStats?.currentStreak || 0,
      totalVolume: profileData.currentStats?.totalVolume || 0,
      averageRating: profileData.currentStats?.averageRating || 0,
      fitnessLevel:
        profileData.scientificProfile?.fitnessTests?.overallLevel || "beginner",
    }),
    [profileData]
  );

  useEffect(() => {
    // אנימציות כניסה חלקה // Smooth entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      setLoading(true);
      // רענון נתונים אמיתיים // Real data refresh
      const userState = useUserStore.getState();

      // סימולציית טעינת נתונים // Simulate data loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // בדיקה אם יש משתמש זמין // Check if user is available
      if (!userState.user) {
        throw new Error("לא נמצא משתמש פעיל");
      }

      console.log("✅ MainScreen - נתונים נטענו בהצלחה");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בטעינת נתונים";
      setError(errorMessage);
      console.error("❌ MainScreen - שגיאה בטעינת נתונים:", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleStartWorkout = useCallback(() => {
    console.log("🚀 MainScreen - התחל אימון מהיר נלחץ!");
    navigation.navigate("QuickWorkout", {
      source: "quick_start" as WorkoutSource,
    });
  }, [navigation]);

  const handleDayWorkout = useCallback(
    (dayNumber: number) => {
      console.log(`🚀 MainScreen - בחירת יום ${dayNumber} אימון ישיר!`);
      navigation.navigate("QuickWorkout", {
        source: "day_selection" as WorkoutSource,
        requestedDay: dayNumber,
        workoutName: `יום ${dayNumber} - אימון`,
      });
    },
    [navigation]
  );

  const handleProfilePress = useCallback(() => {
    console.log("👤 MainScreen - כפתור פרופיל נלחץ!");
    navigation.navigate("Profile");
  }, [navigation]);

  const handleHistoryPress = useCallback(() => {
    console.log("📊 MainScreen - צפייה בהיסטוריה נלחצה!");
    navigation.navigate("History");
  }, [navigation]);

  // ===============================================
  // 🎯 Demo & Utility Functions - פונקציות דמו ועזר
  // ===============================================

  /** @description פונקציית דמו אינטראקטיבית לשאלון מדעי / Interactive demo function for scientific questionnaire */
  const handleDemoRandomize = useCallback(() => {
    try {
      // מערכי אפשרויות לבחירה רנדומלית / Arrays of options for random selection
      const demoOptions = {
        ages: ["18-25", "26-35", "36-45", "46-55", "55-plus"],
        goals: [
          "weight_loss",
          "muscle_gain",
          "strength_improvement",
          "endurance_improvement",
          "general_health",
          "fitness_maintenance",
        ],
        experiences: [
          "beginner",
          "intermediate",
          "advanced",
          "expert",
          "competitive",
        ],
        frequencies: [
          "2-times",
          "3-times",
          "4-times",
          "5-times",
          "6-plus-times",
        ],
        durations: [
          "20-30-min",
          "30-45-min",
          "45-60-min",
          "60-90-min",
          "90-plus-min",
        ],
      };

      // ציוד אפשרי מקובץ / Available equipment options
      const equipmentOptions = {
        bodyweight: [
          { id: "bodyweight_only", metadata: { equipment: ["bodyweight"] } },
          { id: "mat_available", metadata: { equipment: ["mat"] } },
          { id: "chair_available", metadata: { equipment: ["chair"] } },
          { id: "wall_space", metadata: { equipment: ["wall"] } },
          { id: "stairs_available", metadata: { equipment: ["stairs"] } },
        ],
        home: [
          { id: "dumbbells_home", metadata: { equipment: ["dumbbells"] } },
          {
            id: "resistance_bands",
            metadata: { equipment: ["resistance_bands"] },
          },
          { id: "kettlebell_home", metadata: { equipment: ["kettlebell"] } },
          { id: "pullup_bar", metadata: { equipment: ["pullup_bar"] } },
          { id: "exercise_ball", metadata: { equipment: ["exercise_ball"] } },
        ],
        gym: [
          {
            id: "free_weights_gym",
            metadata: { equipment: ["dumbbells", "barbell"] },
          },
          { id: "squat_rack_gym", metadata: { equipment: ["squat_rack"] } },
          { id: "bench_press_gym", metadata: { equipment: ["bench_press"] } },
          {
            id: "cable_machine_gym",
            metadata: { equipment: ["cable_machine"] },
          },
          {
            id: "cardio_machines_gym",
            metadata: { equipment: ["treadmill", "elliptical"] },
          },
        ],
      };

      // פונקציית עזר לבחירה רנדומלית / Helper function for random selection
      const getRandomItem = <T,>(array: T[]): T =>
        array[Math.floor(Math.random() * array.length)];
      const getRandomItems = <T,>(array: T[], maxCount = 3): T[] =>
        array.slice(0, Math.floor(Math.random() * maxCount) + 1);

      // בחירה רנדומלית / Random selection
      const selectedBodyweight = getRandomItems(equipmentOptions.bodyweight);
      const selectedHome = getRandomItems(equipmentOptions.home);
      const selectedGym = getRandomItems(equipmentOptions.gym);

      // יצירת נתוני שאלון חדשים / Creating new questionnaire data
      const newQuestionnaireData = {
        age: {
          id: getRandomItem(demoOptions.ages),
          label: getRandomItem(demoOptions.ages),
        },
        goal: {
          id: getRandomItem(demoOptions.goals),
          label: getRandomItem(demoOptions.goals),
        },
        experience: {
          id: getRandomItem(demoOptions.experiences),
          label: getRandomItem(demoOptions.experiences),
        },
        frequency: {
          id: getRandomItem(demoOptions.frequencies),
          label: getRandomItem(demoOptions.frequencies),
        },
        duration: {
          id: getRandomItem(demoOptions.durations),
          label: getRandomItem(demoOptions.durations),
        },
        bodyweight_equipment_options: selectedBodyweight,
        home_equipment_options: selectedHome,
        gym_equipment_options: selectedGym,
        available_equipment: [
          ...selectedBodyweight.flatMap((item) => item.metadata.equipment),
          ...selectedHome.flatMap((item) => item.metadata.equipment),
          ...selectedGym.flatMap((item) => item.metadata.equipment),
        ],
      };

      // עדכון ה-store / Update store
      useUserStore.getState().setQuestionnaire(newQuestionnaireData);
      console.log("🎯 MainScreen - דמו הופעל בהצלחה, נתונים חדשים נוצרו");
    } catch (error) {
      console.error("❌ MainScreen - שגיאה בפונקציית הדמו:", error);
    }
  }, []);

  const handleDemoPress = useCallback(() => {
    console.log("🎯 MainScreen - כפתור דמו נלחץ!");
    handleDemoRandomize();
  }, [handleDemoRandomize]);

  return (
    <View style={styles.container}>
      {/* מציג שגיאה אם יש */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>נסה שוב</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* מציג אינדיקטור טעינה */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>טוען נתונים...</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={["#007AFF"]}
          />
        }
      >
        {/* כותרת עם ברוכים הבאים */}
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeText}>
              <Text style={styles.greetingText}>צהריים טובים,</Text>
              <Text style={styles.userName}>{displayName}</Text>
            </View>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={handleProfilePress}
                accessibilityLabel="כפתור פרופיל משתמש"
                accessibilityHint="לחץ לצפייה ועריכת הפרופיל האישי"
                accessibilityRole="button"
              >
                <Text style={styles.profileInitials}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>

              {/* כפתור דמו לשינוי תוצאות השאלון */}
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleDemoPress}
                accessibilityLabel="כפתור דמו לשינוי נתונים"
                accessibilityHint="לחץ לבחירת נתונים חדשים בצורה רנדומלית"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={20}
                  color="#fff"
                  accessibilityElementsHidden={true}
                />
                <Text style={styles.demoText}>דמו</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.motivationText}>מוכן לאימון?</Text>
        </Animated.View>

        {/* סטטיסטיקות מדעיות חדשות */}
        {(stats.totalWorkouts > 0 || profileData.scientificProfile) && (
          <Animated.View
            style={[
              styles.scientificStatsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>הנתונים המדעיים שלך</Text>

            <View style={styles.scientificStatsGrid}>
              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.scientificStatNumber}>
                  {stats.totalWorkouts}
                </Text>
                <Text style={styles.scientificStatLabel}>אימונים הושלמו</Text>
              </View>

              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={theme.colors.warning}
                />
                <Text style={styles.scientificStatNumber}>
                  {stats.currentStreak}
                </Text>
                <Text style={styles.scientificStatLabel}>ימי רצף</Text>
              </View>

              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={styles.scientificStatNumber}>
                  {Math.round(stats.totalVolume / 1000)}K
                </Text>
                <Text style={styles.scientificStatLabel}>נפח כולל</Text>
              </View>

              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={theme.colors.warning}
                />
                <Text style={styles.scientificStatNumber}>
                  {stats.averageRating.toFixed(1)}
                </Text>
                <Text style={styles.scientificStatLabel}>דירוג ממוצע</Text>
              </View>
            </View>

            {/* פרופיל מדעי - תשובות שאלון */}
            {profileData.scientificProfile && (
              <View style={styles.questionnaireAnswersCard}>
                <Text style={styles.questionnaireTitle}>
                  הפרטים שלך מהשאלון המדעי
                </Text>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>גיל:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.age_range || "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מין:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.gender === "male"
                      ? "גבר"
                      : (
                            user?.questionnaireData
                              ?.answers as QuestionnaireAnswers
                          )?.gender === "female"
                        ? "אישה"
                        : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מטרה עיקרית:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.primary_goal === "lose_weight"
                      ? "הורדת משקל"
                      : (
                            user?.questionnaireData
                              ?.answers as QuestionnaireAnswers
                          )?.primary_goal === "build_muscle"
                        ? "בניית שריר"
                        : (
                              user?.questionnaireData
                                ?.answers as QuestionnaireAnswers
                            )?.primary_goal === "improve_health"
                          ? "שיפור בריאות"
                          : (
                                user?.questionnaireData
                                  ?.answers as QuestionnaireAnswers
                              )?.primary_goal === "feel_stronger"
                            ? "הרגשה חזקה יותר"
                            : (
                                  user?.questionnaireData
                                    ?.answers as QuestionnaireAnswers
                                )?.primary_goal === "improve_fitness"
                              ? "שיפור כושר"
                              : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>ניסיון באימונים:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.fitness_experience === "complete_beginner"
                      ? "מתחיל לחלוטין"
                      : (
                            user?.questionnaireData
                              ?.answers as QuestionnaireAnswers
                          )?.fitness_experience === "some_experience"
                        ? "קצת ניסיון"
                        : (
                              user?.questionnaireData
                                ?.answers as QuestionnaireAnswers
                            )?.fitness_experience === "intermediate"
                          ? "בינוני"
                          : (
                                user?.questionnaireData
                                  ?.answers as QuestionnaireAnswers
                              )?.fitness_experience === "advanced"
                            ? "מתקדם"
                            : (
                                  user?.questionnaireData
                                    ?.answers as QuestionnaireAnswers
                                )?.fitness_experience === "athlete"
                              ? "ספורטאי"
                              : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מיקום אימון:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.workout_location === "home_only"
                      ? "בית בלבד"
                      : (
                            user?.questionnaireData
                              ?.answers as QuestionnaireAnswers
                          )?.workout_location === "gym_only"
                        ? "חדר כושר בלבד"
                        : (
                              user?.questionnaireData
                                ?.answers as QuestionnaireAnswers
                            )?.workout_location === "both"
                          ? "שניהם"
                          : (
                                user?.questionnaireData
                                  ?.answers as QuestionnaireAnswers
                              )?.workout_location === "outdoor"
                            ? "חוץ"
                            : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>זמן לאימון:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.session_duration
                      ? `${(user?.questionnaireData?.answers as QuestionnaireAnswers)?.session_duration} דקות`
                      : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>תדירות:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.available_days
                      ? `${(user?.questionnaireData?.answers as QuestionnaireAnswers)?.available_days} ימים בשבוע`
                      : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>ציוד זמין:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.available_equipment &&
                    (user?.questionnaireData?.answers as QuestionnaireAnswers)
                      .available_equipment!.length > 0
                      ? (
                          user?.questionnaireData
                            ?.answers as QuestionnaireAnswers
                        )
                          .available_equipment!.map((eq: string) =>
                            eq === "full_gym"
                              ? "חדר כושר מלא"
                              : eq === "dumbbells"
                                ? "דמבלים"
                                : eq === "barbell"
                                  ? "מוט ומשקולות"
                                  : eq === "bodyweight"
                                    ? "משקל גוף"
                                    : eq === "resistance_bands"
                                      ? "גומיות"
                                      : eq
                          )
                          .join(", ")
                      : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מצב בריאותי:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as QuestionnaireAnswers)
                      ?.health_status === "excellent"
                      ? "מעולה"
                      : (
                            user?.questionnaireData
                              ?.answers as QuestionnaireAnswers
                          )?.health_status === "good"
                        ? "טוב"
                        : (
                              user?.questionnaireData
                                ?.answers as QuestionnaireAnswers
                            )?.health_status === "some_issues"
                          ? "יש כמה בעיות"
                          : (
                                user?.questionnaireData
                                  ?.answers as QuestionnaireAnswers
                              )?.health_status === "serious_issues"
                            ? "בעיות רציניות"
                            : "לא צוין"}
                  </Text>
                </View>

                {/* הערה על השם */}
                <View style={styles.noteContainer}>
                  <MaterialCommunityIcons
                    name="information"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.noteText}>
                    השם נוצר אוטומטית למשתמש הדמו. בשאלון האמיתי לא שואלים שם
                    אישי.
                  </Text>
                </View>
              </View>
            )}

            {/* רמת כושר ו-AI recommendations */}
            <View style={styles.aiInsightCard}>
              <View style={styles.fitnessLevelBadge}>
                <Text style={styles.fitnessLevelText}>
                  רמת כושר:{" "}
                  {stats.fitnessLevel === "beginner"
                    ? "מתחיל"
                    : stats.fitnessLevel === "intermediate"
                      ? "בינוני"
                      : "מתקדם"}
                </Text>
              </View>

              {profileData.aiRecommendations?.quickTip && (
                <View style={styles.aiTipContainer}>
                  <MaterialCommunityIcons
                    name="lightbulb"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.aiTipText}>
                    {profileData.aiRecommendations.quickTip}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* האימון הבא */}
        <Animated.View
          style={[
            styles.nextWorkoutSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>האימון הבא שלך</Text>
          <View style={styles.workoutCard}>
            <Text style={styles.workoutName}>חזה</Text>
            <Text style={styles.workoutDescription}>
              ברוכים הבאים! התחלת תוכנית האימונים
            </Text>

            <View style={styles.workoutProgress}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>1</Text>
                <Text style={styles.progressLabel}>שבוע</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>0</Text>
                <Text style={styles.progressLabel}>אימונים</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>100%</Text>
                <Text style={styles.progressLabel}>הישג</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.startWorkoutButton}
              onPress={handleStartWorkout}
              accessibilityLabel="התחל אימון מהיר"
              accessibilityHint="לחץ להתחלת אימון מהיר מותאם אישית"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name="play"
                size={16}
                color="white"
                accessibilityElementsHidden={true}
              />
              <Text style={styles.startWorkoutText}>התחל אימון מהיר</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* בחירת יום אימון */}
        <Animated.View
          style={[
            styles.daySelectionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>בחר יום אימון ספציפי</Text>
          <View style={styles.dayButtonsGrid}>
            {[1, 2, 3, 4].map((dayNum) => (
              <TouchableOpacity
                key={dayNum}
                style={styles.dayButton}
                onPress={() => handleDayWorkout(dayNum)}
                accessibilityLabel={`יום ${dayNum} אימון`}
                accessibilityHint={`לחץ להתחלת אימון יום ${dayNum} - ${dayNum === 1 ? "חזה וטריצפס" : dayNum === 2 ? "גב וביצפס" : dayNum === 3 ? "רגליים" : "כתפיים וליבה"}`}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={24}
                  color={theme.colors.primary}
                  accessibilityElementsHidden={true}
                />
                <Text style={styles.dayButtonText}>יום {dayNum}</Text>
                <Text style={styles.dayButtonSubtext}>
                  {dayNum === 1 && "חזה + טריצפס"}
                  {dayNum === 2 && "גב + ביצפס"}
                  {dayNum === 3 && "רגליים"}
                  {dayNum === 4 && "כתפיים + ליבה"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* סטטוס שלך */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>הסטטוס שלך</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>מטרת שבועית</Text>
                <Text style={styles.statPercentage}>
                  {profileData.activityHistory?.weeklyProgress
                    ? `${Math.round((profileData.activityHistory.weeklyProgress / (profileData.scientificProfile?.available_days || 3)) * 100)}%`
                    : "0%"}
                </Text>
              </View>
              <Text style={styles.statSubtitle}>
                {profileData.activityHistory?.weeklyProgress || 0}/
                {profileData.scientificProfile?.available_days || 3} אימונים
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: profileData.activityHistory?.weeklyProgress
                        ? `${Math.min(100, Math.round((profileData.activityHistory.weeklyProgress / (profileData.scientificProfile?.available_days || 3)) * 100))}%`
                        : "0%",
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconWrapper}>
                <MaterialCommunityIcons name="fire" size={20} color="#007AFF" />
              </View>
              <Text style={styles.statTitle}>רצף נוכחי</Text>
              <Text style={styles.statValue}>
                {profileData.currentStats?.streak ||
                  profileData.activityHistory?.streak ||
                  0}{" "}
                ימים
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconWrapper}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={20}
                  color="#007AFF"
                />
              </View>
              <Text style={styles.statTitle}>סה"כ אימונים</Text>
              <Text style={styles.statValue}>
                {profileData.activityHistory?.workouts?.length ||
                  profileData.currentStats?.totalWorkouts ||
                  0}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* אימונים אחרונים */}
        <Animated.View
          style={[
            styles.recentWorkoutsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>אימונים אחרונים</Text>

          <View style={styles.recentWorkoutsList}>
            {/* אימונים אמיתיים מההיסטוריה */}
            {profileData.activityHistory?.workouts &&
            profileData.activityHistory.workouts.length > 0
              ? profileData.activityHistory.workouts
                  .slice(0, 3)
                  .map((workout: WorkoutHistoryItem, index: number) => (
                    <View
                      key={workout.id || `workout-${index}`}
                      style={styles.recentWorkoutItem}
                    >
                      <View style={styles.workoutIcon}>
                        <MaterialCommunityIcons
                          name={
                            workout.type === "strength" ||
                            workout.workoutName?.includes("חזה")
                              ? "dumbbell"
                              : workout.workoutName?.includes("רגל") ||
                                  workout.type === "cardio"
                                ? "run"
                                : workout.workoutName?.includes("גב")
                                  ? "arm-flex"
                                  : "weight-lifter"
                          }
                          size={24}
                          color="#007AFF"
                        />
                      </View>
                      <View style={styles.workoutInfo}>
                        <Text style={styles.workoutTitle}>
                          {workout.workoutName || workout.type === "strength"
                            ? "אימון כח"
                            : "אימון כללי"}
                        </Text>
                        <Text style={styles.workoutDate}>
                          {workout.date
                            ? new Date(workout.date).toLocaleDateString("he-IL")
                            : new Date(
                                (workout.completedAt as string) || Date.now()
                              ).toLocaleDateString("he-IL")}
                          {(workout.completedAt || workout.startTime) && (
                            <Text style={styles.workoutTime}>
                              {" • "}
                              {new Date(
                                (workout.completedAt ||
                                  workout.startTime) as string
                              ).toLocaleTimeString("he-IL", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          )}
                          {" • "}
                          {workout.duration || 45} דקות
                        </Text>
                      </View>
                      <View style={styles.workoutRating}>
                        <MaterialCommunityIcons
                          name="star"
                          size={16}
                          color="#FFD700"
                        />
                        <Text style={styles.ratingText}>
                          {workout.feedback?.rating?.toFixed(1) ||
                            workout.rating?.toFixed(1) ||
                            "4.5"}
                        </Text>
                      </View>
                    </View>
                  ))
              : // אם אין היסטוריה אמיתית - הצג אימונים דמו / If no real history - show demo workouts
                (
                  [
                    {
                      name: "אימון חזה וכתפיים",
                      date: "אתמול • 45 דקות",
                      rating: "4.8",
                      icon: "dumbbell" as MaterialCommunityIconName,
                    },
                    {
                      name: "רגליים וישבן",
                      date: "לפני 3 ימים • 50 דקות",
                      rating: "4.5",
                      icon: "run" as MaterialCommunityIconName,
                    },
                    {
                      name: "גב וביצפס",
                      date: "לפני 5 ימים • 40 דקות",
                      rating: "4.7",
                      icon: "arm-flex" as MaterialCommunityIconName,
                    },
                  ] as DemoWorkoutItem[]
                ).map((workout, index) => (
                  <View key={`demo-${index}`} style={styles.recentWorkoutItem}>
                    <View style={styles.workoutIcon}>
                      <MaterialCommunityIcons
                        name={workout.icon}
                        size={24}
                        color="#007AFF"
                        accessibilityElementsHidden={true}
                      />
                    </View>
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutTitle}>{workout.name}</Text>
                      <Text style={styles.workoutDate}>{workout.date}</Text>
                    </View>
                    <View style={styles.workoutRating}>
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#FFD700"
                      />
                      <Text style={styles.ratingText}>{workout.rating}</Text>
                    </View>
                  </View>
                ))}
          </View>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleHistoryPress}
            accessibilityLabel="צפה בכל ההיסטוריה"
            accessibilityHint="לחץ לצפייה בהיסטוריית האימונים המלאה"
            accessibilityRole="button"
          >
            <Text style={styles.viewAllText}>צפה בכל ההיסטוריה</Text>
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color="#007AFF"
              accessibilityElementsHidden={true}
            />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container and layout styles // סטיילים לקונטיינר ופריסה
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Welcome section styles // סטיילים לקטע הברוכים הבאים
  welcomeSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.lg,
  },
  welcomeHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  welcomeText: {
    alignItems: "flex-end",
  },
  greetingText: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר במכשיר אמיתי
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },
  userName: {
    fontSize: 28, // הוגדל מ-24 לבולטות במסך הנייד
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  motivationText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginTop: theme.spacing.sm,
    writingDirection: "rtl",
  },
  profileContainer: {
    alignItems: "center",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  profileInitials: {
    fontSize: 18, // הוגדל מ-16 לבולטות במסך הנייד
    fontWeight: "600",
    color: theme.colors.surface,
  },

  // Demo button styles // סטיילים לכפתור הדמו
  demoButton: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md,
    ...theme.shadows.medium,
  },
  demoText: {
    fontSize: 12, // הוגדל מ-10 לקריאות טובה יותר
    color: theme.colors.surface,
    fontWeight: "600",
    marginTop: 2,
  },

  // Section styles // סטיילים לקטעים
  sectionTitle: {
    fontSize: 22, // הוגדל מ-20 לבולטות במסך הנייד
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },

  // Next workout section // קטע האימון הבא
  nextWorkoutSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  workoutCard: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  workoutName: {
    fontSize: 24, // הוגדל מ-20 לבולטות במסך הנייד
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  workoutDescription: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginBottom: theme.spacing.lg,
    writingDirection: "rtl",
  },
  workoutProgress: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  progressItem: {
    alignItems: "center",
    flex: 1,
  },
  progressNumber: {
    fontSize: 20, // הוגדל מ-18 לבולטות במסך הנייד
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 13, // הוגדל מ-11 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    writingDirection: "rtl",
  },
  startWorkoutButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.small,
  },
  startWorkoutText: {
    fontSize: 18, // הוגדל מ-16 לבולטות במסך הנייד
    fontWeight: "600",
    color: theme.colors.surface,
    marginStart: theme.spacing.sm,
    writingDirection: "rtl",
  },

  // Stats section // קטע הסטטיסטיקות
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    gap: theme.spacing.md,
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  statHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statTitle: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statPercentage: {
    fontSize: 24, // הוגדל מ-20 לבולטות במסך הנייד
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.primary,
  },
  statSubtitle: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xs,
  },
  statIconWrapper: {
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 20, // הוגדל מ-18 לבולטות במסך הנייד
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    textAlign: "right",
  },

  // Recent workouts section // קטע האימונים האחרונים
  recentWorkoutsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  recentWorkoutsList: {
    gap: theme.spacing.sm,
  },
  recentWorkoutItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  workoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundElevated,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.md,
  },
  workoutInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  workoutTitle: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: 4,
    writingDirection: "rtl",
  },
  workoutDate: {
    fontSize: 14, // הוגדל מ-12 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  workoutTime: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  workoutRating: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  ratingText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: 4,
  },
  viewAllButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.primary,
    fontWeight: "600",
    marginRight: theme.spacing.xs,
    writingDirection: "rtl",
  },

  // Scientific stats section // קטע הסטטיסטיקות המדעיות
  scientificStatsSection: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  scientificStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  scientificStatCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: "center",
    ...theme.shadows.small,
  },
  scientificStatNumber: {
    fontSize: 24, // הוגדל מ-20 לבולטות במסך הנייד
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    marginBottom: 4,
  },
  scientificStatLabel: {
    fontSize: 13, // הוגדל מ-11 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // AI insight card // כרטיס תובנות AI
  aiInsightCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.xs,
    ...theme.shadows.small,
  },
  fitnessLevelBadge: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    alignSelf: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  fitnessLevelText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.primary,
    fontWeight: "600",
    writingDirection: "rtl",
  },
  aiTipContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  aiTipText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.text,
    lineHeight: 20,
    marginEnd: theme.spacing.xs,
    flex: 1,
    writingDirection: "rtl",
  },

  // Questionnaire answers card // כרטיס תשובות השאלון
  questionnaireAnswersCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.small,
  },
  questionnaireTitle: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  answerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "30",
  },
  answerLabel: {
    fontSize: 15, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    fontWeight: "600",
    writingDirection: "rtl",
  },
  answerValue: {
    fontSize: 15, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.text,
    fontWeight: "600",
    writingDirection: "rtl",
  },

  // Note container // קונטיינר ההערה
  noteContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  noteText: {
    fontSize: 13, // הוגדל מ-11 לקריאות טובה יותר
    color: theme.colors.primary,
    marginEnd: theme.spacing.xs,
    flex: 1,
    writingDirection: "rtl",
    lineHeight: 16,
  },

  // Error and loading styles // סגנונות שגיאות וטעינה
  errorContainer: {
    backgroundColor: theme.colors.error + "20",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    margin: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.error + "40",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  retryButton: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  retryButtonText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.surface,
    fontWeight: "600",
    writingDirection: "rtl",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background + "90",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    writingDirection: "rtl",
  },

  // Day selection section styles // סטיילים לקטע בחירת יום
  daySelectionSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  dayButtonsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  dayButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border + "40",
  },
  dayButtonText: {
    fontSize: 18, // הוגדל מ-16 לקריאות טובה יותר
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    marginBottom: 4,
    textAlign: "center",
  },
  dayButtonSubtext: {
    fontSize: 13, // הוגדל מ-11 לקריאות טובה יותר
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
});

// ===============================================
// 🎯 Export with Performance Optimization
// ייצוא עם אופטימיזצית ביצועים
// ===============================================

/**
 * @description MainScreen optimized with React.memo for better performance
 * @description MainScreen מאופטם עם React.memo לביצועים טובים יותר
 */
const MainScreenMemo = React.memo(MainScreen);
MainScreenMemo.displayName = "MainScreen";

export default MainScreenMemo;
