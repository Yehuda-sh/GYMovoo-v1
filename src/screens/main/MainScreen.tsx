/**
 * @file src/screens/main/MainScreen.tsx
 * @brief מסך ראשי מודרני - דשבורד מרכזי עם סטטיסטיקות מדעיות והתאמה אישית - מותאם לכושר מובייל
 * @brief Modern main screen - Central dashboard with scientific statistics and personalization - fitness mobile optimized
 * @dependencies theme, userStore, MaterialCommunityIcons, Animated API, React Navigation, expo-haptics
 * @notes תמיכה מלאה RTL, אנימציות משופרות, אופטימיזציות כושר מובייל
 * @notes Full RTL support, enhanced animations, fitness mobile optimizations
 * @features דשבורד אישי, סטטיסטיקות מתקדמות, המלצות AI, היסטוריית אימונים, haptic feedback מדורג
 * @features Personal dashboard, advanced statistics, AI recommendations, workout history, graduated haptic feedback
 * @accessibility Enhanced with proper labels, semantic structure, and 44px minimum touch targets
 * @performance Optimized with React.memo, useMemo hooks, and render time tracking
 * @version 2.3.0 - Fitness mobile optimization: haptic feedback, performance tracking, enlarged hitSlop
 * @updated 2025-08-14 אופטימיזציות כושר מובייל מלאות עם משוב מישושי מדורג
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
} from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { workoutFacadeService } from "../../services/workout/workoutFacadeService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// New imports for optimized components and constants
import StatCard, { StatCardGrid } from "../../components/common/StatCard";
import { DayButtonGrid } from "../../components/common/DayButton";
import DefaultAvatar from "../../components/common/DefaultAvatar";
import EmptyState from "../../components/common/EmptyState";
import {
  MAIN_SCREEN_TEXTS,
  getTimeBasedGreeting,
  formatQuestionnaireValue,
} from "../../constants/mainScreenTexts";
import {
  formatLargeNumber,
  formatRating,
  formatFitnessLevel,
  formatWorkoutDate,
  getWorkoutIcon,
  formatWeeklyProgress,
  formatProgressRatio,
} from "../../utils/formatters";

// Import User type for type safety
import type { User } from "../../types";

// Import NextWorkoutCard
import NextWorkoutCard from "../../components/workout/NextWorkoutCard";

// Import utility functions
import {} from "../../utils/mainScreenUtils";

// ===============================================
// 🔧 Type Guards and Helper Functions
// ===============================================

/** @description Workout item type for history processing */
interface WorkoutHistoryItem {
  id?: string;
  workout?: {
    name?: string;
    duration?: number;
    startTime?: string;
  };
  workoutName?: string;
  type?: string;
  feedback?: {
    completedAt?: string | Date;
    difficulty?: number;
  };
  date?: string | Date;
  completedAt?: string | Date;
  stats?: {
    duration?: number;
  };
  duration?: number;
  startTime?: string;
  rating?: number;
}

/** @description Calculate available training days from user data */
const calculateAvailableTrainingDays = (user: User | null): number => {
  if (!user) return 3;

  // Try to extract from new smart questionnaire
  const smartAnswers = user.smartquestionnairedata?.answers as
    | { availability?: string | string[] }
    | undefined;
  if (smartAnswers?.availability) {
    const availability = Array.isArray(smartAnswers.availability)
      ? smartAnswers.availability[0]
      : smartAnswers.availability;
    switch (availability) {
      case "2_days":
        return 2;
      case "3_days":
        return 3;
      case "4_days":
        return 4;
      case "5_days":
        return 5;
      default:
        return 3;
    }
  }

  // Try to extract from training stats
  if (user.trainingstats?.preferredWorkoutDays) {
    const days =
      typeof user.trainingstats.preferredWorkoutDays === "number"
        ? user.trainingstats.preferredWorkoutDays
        : parseInt(String(user.trainingstats.preferredWorkoutDays), 10);
    if (days >= 2 && days <= 5) return days;
  }

  // Try to extract from legacy questionnaire data
  if (user.questionnairedata?.answers) {
    const answers = user.questionnairedata.answers as Record<string, unknown>;
    const frequency = answers.frequency;
    if (typeof frequency === "string") {
      switch (frequency) {
        case "2_days":
          return 2;
        case "3_days":
          return 3;
        case "4_days":
          return 4;
        case "5_days":
          return 5;
        default:
          return 3;
      }
    }
  }

  // Try to extract from old questionnaire
  if (user.questionnaire) {
    const questionnaireValues = Object.values(user.questionnaire);
    for (const value of questionnaireValues) {
      if (typeof value === "string") {
        if (
          value.includes("2") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 2;
        if (
          value.includes("3") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 3;
        if (
          value.includes("4") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 4;
        if (
          value.includes("5") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 5;
      }
    }
  }

  // Fallback - try to extract from scientific profile
  const availableDays = user.scientificprofile?.available_days;
  if (
    typeof availableDays === "number" &&
    availableDays >= 2 &&
    availableDays <= 5
  ) {
    return availableDays;
  }

  return 3; // Default
};

/** @description Calculate next recommended workout day */
const getNextRecommendedDay = (
  workouts: WorkoutHistoryItem[],
  availableDays: number
): number => {
  if (workouts.length === 0) return 1;

  const lastWorkout = workouts[workouts.length - 1];
  const lastWorkoutType = lastWorkout?.type || lastWorkout?.workoutName || "";

  if (lastWorkoutType.includes("1") || lastWorkoutType.includes("יום 1")) {
    return 2;
  } else if (
    lastWorkoutType.includes("2") ||
    lastWorkoutType.includes("יום 2")
  ) {
    return availableDays >= 3 ? 3 : 1;
  } else if (
    lastWorkoutType.includes("3") ||
    lastWorkoutType.includes("יום 3")
  ) {
    return availableDays >= 4 ? 4 : 1;
  } else if (
    lastWorkoutType.includes("4") ||
    lastWorkoutType.includes("יום 4")
  ) {
    return availableDays >= 5 ? 5 : 1;
  } else if (
    lastWorkoutType.includes("5") ||
    lastWorkoutType.includes("יום 5")
  ) {
    return 1;
  }

  return 1;
};

/** @description Extract personal data from user for analytics */
const extractPersonalDataFromUser = (user: User | null) => {
  if (!user) {
    return {
      age: "unknown" as const,
      gender: "male" as const,
      availability: "3_days" as const,
      goals: [] as string[],
      fitnessLevel: "beginner" as const,
      weight: "70",
      height: "170",
    };
  }

  // Extract gender
  const gender = (
    user.smartquestionnairedata?.answers?.gender === "female"
      ? "female"
      : "male"
  ) as "male" | "female";

  // Extract age
  const age =
    user.smartquestionnairedata?.answers?.age?.toString() || "unknown";

  // Extract availability
  const availability = (
    Array.isArray(user.smartquestionnairedata?.answers?.availability)
      ? user.smartquestionnairedata.answers.availability[0] || "3_days"
      : "3_days"
  ) as "2_days" | "3_days" | "4_days" | "5_days";

  // Extract goals
  const goals = Array.isArray(user.smartquestionnairedata?.answers?.goals)
    ? user.smartquestionnairedata.answers.goals
    : [];

  // Extract fitness level
  const fitnessLevel = (user.smartquestionnairedata?.answers?.fitnessLevel ||
    "beginner") as "beginner" | "intermediate" | "advanced";

  // Use default values for weight and height since they're not in ScientificProfile
  const weight = "70";
  const height = "170";

  return {
    age,
    gender,
    availability,
    goals,
    fitnessLevel,
    weight,
    height,
  };
};

// (הוסר טיפוס נגישות פנימי לא בשימוש)

// הוסר טיפוס פנימי לא בשימוש למניעת אזהרות לינט

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

// ===============================================
// 🚀 Main Component - קומפוננטה ראשית
// ===============================================

function MainScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedStats, setAdvancedStats] = useState<{
    insights: string[];
    genderStats?: {
      total: {
        totalWorkouts: number;
        currentStreak: number;
        averageDifficulty: number;
        workoutStreak: number;
      };
    };
    totalWorkouts: number;
    currentStreak: number;
  } | null>(null);

  // 🚀 Performance Tracking - מדידת זמן רינדור לאופטימיזציה
  const renderStartTime = useMemo(() => Date.now(), []);

  // 📊 טעינת נתונים מתקדמים מ-WorkoutFacadeService
  const loadAdvancedData = useCallback(async () => {
    if (!user) return;

    try {
      const [historyItems, genderGroupedStats] = await Promise.all([
        workoutFacadeService.getHistoryForList(),
        workoutFacadeService.getGenderGroupedStatistics(),
      ]);

      const personalData = extractPersonalDataFromUser(user);

      const insights =
        await workoutFacadeService.getPersonalizedWorkoutAnalytics(
          historyItems,
          personalData
        );

      setAdvancedStats({
        insights,
        genderStats: {
          total: {
            totalWorkouts: genderGroupedStats.total.totalWorkouts,
            currentStreak: genderGroupedStats.total.workoutStreak, // workoutStreak הוא currentStreak
            averageDifficulty: genderGroupedStats.total.averageDifficulty,
            workoutStreak: genderGroupedStats.total.workoutStreak,
          },
        },
        totalWorkouts: genderGroupedStats.total.totalWorkouts,
        currentStreak: genderGroupedStats.total.workoutStreak,
      });
    } catch (error) {
      if (__DEV__) {
        console.warn("⚠️ שגיאה בטעינת נתונים מתקדמים:", error);
      }
      // המשך עם נתונים קיימים מה-store
    }
  }, [user]);

  useEffect(() => {
    // ✅ הוספת delay למניעת קריאות מיותרות
    const timeoutId = setTimeout(() => {
      loadAdvancedData();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [user?.id, loadAdvancedData]); // רק כשמשתמש משתנה

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime;
    if (renderTime > 100) {
      if (__DEV__) {
        console.warn(`⚠️ MainScreen רינדור איטי: ${renderTime.toFixed(2)}ms`);
      }
    }
  }, [renderStartTime]);

  // 🎯 Haptic Feedback Functions - פונקציות משוב מישושי מותאמות לכושר
  const triggerHapticFeedback = useCallback(
    (intensity: "light" | "medium" | "heavy") => {
      switch (intensity) {
        case "light":
          Haptics.selectionAsync(); // לניווט רגיל (פרופיל, היסטוריה)
          break;
        case "medium":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // לבחירת יום אימון
          break;
        case "heavy":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // להתחלת אימון מהיר
          break;
      }
    },
    []
  );

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
    () => user?.name || user?.email?.split("@")[0] || "מתאמן",
    [user?.name, user?.email]
  );

  /** @description ברכה דינמית לפי שעה / Dynamic greeting based on time */
  const timeBasedGreeting = useMemo(() => getTimeBasedGreeting(), []);

  /** @description מספר ימי האימון על בסיס השאלון / Number of training days based on questionnaire */
  const availableTrainingDays = useMemo(() => {
    return calculateAvailableTrainingDays(user);
  }, [user]);

  /** @description מערך הימים להצגה / Array of days to display */
  const daysToShow = useMemo(() => {
    const days = Array.from({ length: availableTrainingDays }, (_, i) => i + 1);
    return days;
  }, [availableTrainingDays]);

  /** @description נתונים מדעיים ומקצועיים ממוחזרים / Memoized scientific and professional data */
  const profileData = useMemo(
    () => ({
      scientificProfile: user?.scientificprofile,
      activityHistory: user?.activityhistory,
      currentStats: user?.currentstats,
      aiRecommendations: user?.airecommendations,
    }),
    [
      user?.scientificprofile,
      user?.activityhistory,
      user?.currentstats,
      user?.airecommendations,
    ]
  );

  /** @description נתוני סטטיסטיקה מעובדים לתצוגה / Processed statistics for display */
  const stats: ProcessedStats = useMemo(
    () => ({
      totalWorkouts:
        advancedStats?.totalWorkouts ||
        profileData.currentStats?.totalWorkouts ||
        0,
      currentStreak:
        advancedStats?.currentStreak ||
        profileData.currentStats?.currentStreak ||
        0,
      totalVolume: profileData.currentStats?.totalVolume || 0,
      averageRating:
        advancedStats?.genderStats?.total?.averageDifficulty ||
        profileData.currentStats?.averageRating ||
        0,
      fitnessLevel:
        profileData.scientificProfile?.fitnessTests?.overallLevel || "beginner",
    }),
    [profileData, advancedStats]
  );

  /** @description חישוב היום הבא המומלץ לאימון / Calculate next recommended workout day */
  const nextRecommendedDay = useMemo(() => {
    const workouts = profileData.activityHistory?.workouts || [];
    return getNextRecommendedDay(workouts, availableTrainingDays);
  }, [profileData.activityHistory?.workouts, availableTrainingDays]);

  /** @description נתוני התקדמות שבועית מעובדים / Processed weekly progress data */
  const weeklyProgressData = useMemo(() => {
    const completed = profileData.activityHistory?.weeklyProgress || 0;
    const target = availableTrainingDays; // משתמש בימים מהשאלון
    return formatWeeklyProgress(completed, target);
  }, [profileData.activityHistory?.weeklyProgress, availableTrainingDays]);

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

      // בדיקה אם יש משתמש זמין // Check if user is available
      if (!userState.user) {
        throw new Error(MAIN_SCREEN_TEXTS.STATUS.NO_USER_FOUND);
      }

      // רענון נתונים מתקדמים מ-WorkoutFacadeService
      await loadAdvancedData();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : MAIN_SCREEN_TEXTS.STATUS.DATA_LOAD_ERROR;
      setError(errorMessage);
      console.error("❌ MainScreen - שגיאה בטעינת נתונים:", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadAdvancedData]);

  const handleStartWorkout = useCallback(
    (workoutName?: string, workoutIndex?: number) => {
      triggerHapticFeedback("heavy"); // משוב חזק להתחלת אימון מהיר
      if (__DEV__) {
        console.warn("🚀 MainScreen - התחל אימון מהיר נלחץ!", {
          workoutName,
          workoutIndex,
        });
      }
      navigation.navigate("WorkoutPlans", {
        autoStart: true,
        requestedWorkoutName: workoutName,
        requestedWorkoutIndex: workoutIndex,
      });
    },
    [navigation, triggerHapticFeedback]
  );

  const handleDayWorkout = useCallback(
    (dayNumber: number) => {
      triggerHapticFeedback("medium"); // משוב בינוני לבחירת יום אימון
      if (__DEV__) {
        console.warn(`🚀 MainScreen - בחירת יום ${dayNumber} אימון ישיר!`);
      }
      navigation.navigate("WorkoutPlans", {
        preSelectedDay: dayNumber,
        autoStart: true,
      });
    },
    [navigation, triggerHapticFeedback]
  );

  const handleProfilePress = useCallback(() => {
    triggerHapticFeedback("light"); // משוב קל לניווט לפרופיל
    navigation.navigate("Profile");
  }, [navigation, triggerHapticFeedback]);

  const handleHistoryPress = useCallback(() => {
    triggerHapticFeedback("light"); // משוב קל לניווט להיסטוריה
    navigation.navigate("History");
  }, [navigation, triggerHapticFeedback]);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "right", "left", "bottom"]}
    >
      <View style={styles.container}>
        {/* מציג שגיאה אם יש */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRefresh}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="נסה שוב"
              accessibilityHint="לחץ כדי לרענן ולנסות לטעון מחדש"
            >
              <Text style={styles.retryButtonText}>
                {MAIN_SCREEN_TEXTS.ACTIONS.TRY_AGAIN}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* מציג אינדיקטור טעינה */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <LoadingSpinner size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>
              {MAIN_SCREEN_TEXTS.STATUS.LOADING_DATA}
            </Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
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
                <Text style={styles.greetingText}>{timeBasedGreeting}</Text>
                <Text style={styles.userName}>{displayName}</Text>
              </View>
              <View style={styles.profileContainer}>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={handleProfilePress}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.PROFILE_BUTTON}
                  accessibilityHint="לחץ לצפייה ועריכת הפרופיל האישי"
                  accessibilityRole="button"
                >
                  <DefaultAvatar
                    name={displayName}
                    size="medium"
                    showBorder={false}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.motivationText}>
              {MAIN_SCREEN_TEXTS.WELCOME.READY_TO_WORKOUT}
            </Text>
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
              <Text style={styles.sectionTitle}>
                {MAIN_SCREEN_TEXTS.SECTIONS.SCIENTIFIC_DATA}
              </Text>

              <StatCardGrid testID="scientific-stats-grid">
                <StatCard
                  variant="scientific"
                  icon="trophy"
                  iconColor={theme.colors.primary}
                  value={stats.totalWorkouts}
                  label={MAIN_SCREEN_TEXTS.STATS.WORKOUTS_COMPLETED}
                  testID="workouts-completed-card"
                />

                <StatCard
                  variant="scientific"
                  icon="fire"
                  iconColor={theme.colors.warning}
                  value={stats.currentStreak}
                  label={MAIN_SCREEN_TEXTS.STATS.STREAK_DAYS}
                  testID="streak-days-card"
                />

                <StatCard
                  variant="scientific"
                  icon="weight-lifter"
                  iconColor={theme.colors.success}
                  value={formatLargeNumber(stats.totalVolume)}
                  label={MAIN_SCREEN_TEXTS.STATS.TOTAL_VOLUME}
                  testID="total-volume-card"
                />

                <StatCard
                  variant="scientific"
                  icon="star"
                  iconColor={theme.colors.warning}
                  value={formatRating(stats.averageRating)}
                  label={MAIN_SCREEN_TEXTS.STATS.AVERAGE_RATING}
                  testID="average-rating-card"
                />
              </StatCardGrid>

              {/* פרופיל מדעי - תשובות שאלון */}
              {profileData.scientificProfile && (
                <View style={styles.questionnaireAnswersCard}>
                  <Text style={styles.questionnaireTitle}>
                    {MAIN_SCREEN_TEXTS.SECTIONS.QUESTIONNAIRE_DETAILS}
                  </Text>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.AGE}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "age_range",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.age_range
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.GENDER}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "gender",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.gender
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.PRIMARY_GOAL}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "primary_goal",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.primary_goal
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.FITNESS_EXPERIENCE}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "fitness_experience",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.fitness_experience
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.WORKOUT_LOCATION}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "workout_location",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.workout_location
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.SESSION_DURATION}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "session_duration",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.session_duration
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.FREQUENCY}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "available_days",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.available_days
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.AVAILABLE_EQUIPMENT}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "available_equipment",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.available_equipment
                      )}
                    </Text>
                  </View>

                  <View style={styles.answerRow}>
                    <Text style={styles.answerLabel}>
                      {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.HEALTH_STATUS}
                    </Text>
                    <Text style={styles.answerValue}>
                      {formatQuestionnaireValue(
                        "health_status",
                        (
                          user?.questionnairedata
                            ?.answers as QuestionnaireAnswers
                        )?.health_status
                      )}
                    </Text>
                  </View>
                </View>
              )}

              {/* רמת כושר ו-AI recommendations */}
              <View style={styles.aiInsightCard}>
                <View style={styles.fitnessLevelBadge}>
                  <Text style={styles.fitnessLevelText}>
                    {MAIN_SCREEN_TEXTS.STATS.FITNESS_LEVEL}{" "}
                    {formatFitnessLevel(stats.fitnessLevel)}
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

                {/* תובנות מתקדמות מ-WorkoutFacadeService */}
                {advancedStats?.insights &&
                  advancedStats.insights.length > 0 && (
                    <View style={styles.advancedInsightsContainer}>
                      <Text style={styles.advancedInsightsTitle}>
                        📊 תובנות אימון מתקדמות
                      </Text>
                      {advancedStats.insights
                        .slice(0, 2)
                        .map((insight, index) => (
                          <View key={index} style={styles.insightItem}>
                            <MaterialCommunityIcons
                              name="chart-line"
                              size={14}
                              color={theme.colors.success}
                            />
                            <Text style={styles.insightText}>{insight}</Text>
                          </View>
                        ))}
                    </View>
                  )}
              </View>
            </Animated.View>
          )}

          {/* המלצת אימון הבא */}
          <Animated.View
            style={[
              styles.nextWorkoutSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <NextWorkoutCard
              workoutPlan={undefined}
              onStartWorkout={handleStartWorkout}
            />
          </Animated.View>

          {/* בחירת יום אימון עם המלצה דינמית */}
          <Animated.View
            style={[
              styles.daySelectionSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>
              {MAIN_SCREEN_TEXTS.SECTIONS.SELECT_DAY_RECOMMENDED(
                nextRecommendedDay
              )}
            </Text>

            {/* הוספת הערה על ההמלצה */}
            <View style={styles.recommendationNote}>
              <MaterialCommunityIcons
                name="lightbulb"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.recommendationText}>
                בהתבסס על האימון האחרון שלך, אנו ממליצים להמשיך ליום{" "}
                {nextRecommendedDay}
              </Text>
            </View>

            <DayButtonGrid
              days={daysToShow}
              onDayPress={handleDayWorkout}
              variant="default"
              testID="day-selection-grid"
            />

            {/* כפתור אימון מהיר */}
            <TouchableOpacity
              style={styles.quickWorkoutButton}
              onPress={() => handleStartWorkout()}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.QUICK_WORKOUT}
              accessibilityHint={MAIN_SCREEN_TEXTS.A11Y.QUICK_WORKOUT_HINT}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name="flash"
                size={20}
                color={theme.colors.surface}
                accessibilityElementsHidden={true}
              />
              <Text style={styles.quickWorkoutText}>
                {MAIN_SCREEN_TEXTS.ACTIONS.START_QUICK_WORKOUT}
              </Text>
            </TouchableOpacity>
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
            <Text style={styles.sectionTitle}>
              {MAIN_SCREEN_TEXTS.SECTIONS.YOUR_STATUS}
            </Text>

            <View style={styles.statsGrid}>
              <StatCard
                variant="progress"
                value={weeklyProgressData.text}
                label={MAIN_SCREEN_TEXTS.STATS.WEEKLY_GOAL}
                subtitle={formatProgressRatio(
                  profileData.activityHistory?.weeklyProgress || 0,
                  availableTrainingDays, // משתמש בימים מהשאלון
                  MAIN_SCREEN_TEXTS.ACTIONS.WORKOUTS
                )}
                showProgress={true}
                progressValue={weeklyProgressData.percentage}
                testID="weekly-goal-card"
              />

              <StatCard
                variant="default"
                icon="fire"
                iconColor={theme.colors.primary}
                value={
                  profileData.currentStats?.currentStreak ||
                  profileData.currentStats?.workoutStreak ||
                  0
                }
                label={MAIN_SCREEN_TEXTS.STATS.CURRENT_STREAK}
                subtitle={MAIN_SCREEN_TEXTS.STATS.DAYS}
                testID="current-streak-card"
              />

              <StatCard
                variant="default"
                icon="chart-line"
                iconColor={theme.colors.primary}
                value={
                  profileData.activityHistory?.workouts?.length ||
                  profileData.currentStats?.totalWorkouts ||
                  0
                }
                label={MAIN_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS}
                testID="total-workouts-card"
              />
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
            <Text style={styles.sectionTitle}>
              {MAIN_SCREEN_TEXTS.SECTIONS.RECENT_WORKOUTS}
            </Text>

            <View style={styles.recentWorkoutsList}>
              {/* אימונים אמיתיים מההיסטוריה */}
              {profileData.activityHistory?.workouts &&
              profileData.activityHistory.workouts.length > 0 ? (
                profileData.activityHistory.workouts
                  .slice(0, 3)
                  .map((workout: unknown, index: number) => {
                    type MinimalWorkout = {
                      id?: string;
                      type?: string;
                      workoutName?: string;
                      date?: string | Date;
                      completedAt?: string;
                      duration?: number;
                      rating?: number;
                      startTime?: string;
                      workout?: {
                        name?: string;
                        duration?: number;
                        startTime?: string;
                      };
                      stats?: { duration?: number };
                      feedback?: {
                        difficulty?: number;
                        completedAt?: string;
                      };
                    };
                    const item = workout as MinimalWorkout;
                    const title: string =
                      item?.workout?.name ||
                      item?.workoutName ||
                      (item?.type === "strength"
                        ? MAIN_SCREEN_TEXTS.WORKOUT_TYPES.STRENGTH
                        : MAIN_SCREEN_TEXTS.WORKOUT_TYPES.GENERAL);

                    const dateValue: string | Date =
                      item?.feedback?.completedAt ||
                      item?.date ||
                      item?.completedAt ||
                      new Date();

                    const durationMinutes: number | undefined = (() => {
                      const seconds: number | undefined =
                        typeof item?.workout?.duration === "number"
                          ? item.workout.duration
                          : typeof item?.stats?.duration === "number"
                            ? item.stats.duration
                            : typeof item?.duration === "number"
                              ? item.duration
                              : undefined;
                      return typeof seconds === "number"
                        ? Math.max(1, Math.round(seconds / 60))
                        : undefined;
                    })();

                    const startTime: string | undefined =
                      item?.startTime || item?.workout?.startTime;

                    const iconName = getWorkoutIcon(
                      item?.type,
                      title
                    ) as keyof typeof MaterialCommunityIcons.glyphMap;

                    const ratingValue: number =
                      (typeof item?.feedback?.difficulty === "number"
                        ? item.feedback.difficulty
                        : undefined) ||
                      item?.rating ||
                      4.0;

                    return (
                      <View
                        key={item?.id || `workout-${index}`}
                        style={styles.recentWorkoutItem}
                      >
                        <View style={styles.workoutIcon}>
                          <MaterialCommunityIcons
                            name={iconName}
                            size={24}
                            color={theme.colors.primary}
                          />
                        </View>
                        <View style={styles.workoutInfo}>
                          <Text style={styles.workoutTitle}>{title}</Text>
                          <Text style={styles.workoutDate}>
                            {formatWorkoutDate(
                              dateValue,
                              durationMinutes,
                              startTime
                            )}
                          </Text>
                        </View>
                        <View style={styles.workoutRating}>
                          <MaterialCommunityIcons
                            name="star"
                            size={16}
                            color={theme.colors.warning}
                          />
                          <Text style={styles.ratingText}>
                            {formatRating(ratingValue)}
                          </Text>
                        </View>
                      </View>
                    );
                  })
              ) : (
                // אם אין היסטוריה אמיתית - הצג הודעת ריקנות
                <EmptyState
                  icon="time-outline"
                  title={MAIN_SCREEN_TEXTS.STATUS.NO_RECENT_WORKOUTS}
                  description={MAIN_SCREEN_TEXTS.STATUS.START_FIRST_WORKOUT}
                  variant="compact"
                  testID="main-screen-empty-history"
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleHistoryPress}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.VIEW_HISTORY}
              accessibilityHint={MAIN_SCREEN_TEXTS.A11Y.VIEW_HISTORY_HINT}
              accessibilityRole="button"
            >
              <Text style={styles.viewAllText}>
                {MAIN_SCREEN_TEXTS.ACTIONS.VIEW_ALL_HISTORY}
              </Text>
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={theme.colors.primary}
                accessibilityElementsHidden={true}
              />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Container and layout styles // סטיילים לקונטיינר ופריסה משופרים
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 4,
  },

  // Welcome section styles משופר // סטיילים לקטע הברוכים הבאים מעודכן
  welcomeSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: theme.spacing.xl,
    backgroundColor: `${theme.colors.background}FB`,
    // שיפורי עיצוב מתקדמים
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  welcomeText: {
    alignItems: "flex-end",
    flex: 1,
  },
  greetingText: {
    fontSize: 20, // הוגדל עוד יותר לבולטות
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: 32, // הוגדל מ-28 לבולטות גדולה יותר
    fontWeight: "800", // הוגדל מ-theme.typography
    color: theme.colors.text,
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: 0.5,
    // שיפור טיפוגרפי
    textShadowColor: `${theme.colors.text}12`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  motivationText: {
    fontSize: 17, // הוגדל מ-16
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginTop: theme.spacing.md,
    writingDirection: "rtl",
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  profileContainer: {
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${theme.colors.accent}F0`,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: `${theme.colors.surface}E0`,
    // שיפור כפתור פרופיל
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    // 📱 Touch Target מוגדל
    minWidth: 50,
    minHeight: 50,
  },

  // Section styles משופר // סטיילים לקטעים מעודכן
  sectionTitle: {
    fontSize: 24, // הוגדל מ-22 לבולטות מקסימלית
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: theme.spacing.lg,
    writingDirection: "rtl",
    letterSpacing: 0.4,
    // שיפור טיפוגרפי נוסף
    textShadowColor: `${theme.colors.text}12`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Stats section משופר // קטע הסטטיסטיקות מעודכן
  statsSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    backgroundColor: `${theme.colors.surface}30`,
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    // שיפורי עיצוב לקטע סטטיסטיקות
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}40`,
  },
  statsGrid: {
    gap: theme.spacing.lg,
  },

  // Recent workouts section משופר // קטע האימונים האחרונים מעודכן
  recentWorkoutsSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    backgroundColor: `${theme.colors.surface}25`,
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    // שיפורי עיצוב לקטע אימונים אחרונים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}35`,
  },
  recentWorkoutsList: {
    gap: theme.spacing.md,
  },
  recentWorkoutItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: `${theme.colors.card}F8`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: `${theme.colors.cardBorder}60`,
    // שיפור פריט אימון אחרון
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    marginVertical: theme.spacing.xs,
  },
  workoutIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${theme.colors.backgroundElevated}F0`,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.lg,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}20`,
    // שיפור אייקון אימון
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  workoutInfo: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: theme.spacing.sm,
  },
  workoutTitle: {
    fontSize: 20, // הוגדל מ-18 לבולטות רבה יותר
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: 6,
    writingDirection: "rtl",
    letterSpacing: 0.3,
  },
  workoutDate: {
    fontSize: 15, // הוגדל מ-14 לקריאות מעולה
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: 0.2,
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
    // 📱 44px Minimum Touch Target Validation for Fitness Mobile
    minHeight: 44,
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

  // Note styles were removed as demo notes are no longer used

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
    // 📱 44px Minimum Touch Target Validation for Fitness Mobile
    minHeight: 44,
    paddingVertical: Math.max(theme.spacing.sm, 12), // מבטיח גובה של לפחות 44px
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
  recommendationNote: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  recommendationText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginEnd: theme.spacing.xs,
    flex: 1,
    writingDirection: "rtl",
    lineHeight: 18,
  },
  quickWorkoutButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.md,
    ...theme.shadows.small,
    // 📱 44px Minimum Touch Target Validation for Fitness Mobile
    minHeight: 44,
  },
  quickWorkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.surface,
    marginStart: theme.spacing.sm,
    writingDirection: "rtl",
  },

  // Advanced insights styles // סטיילים לתובנות מתקדמות
  advancedInsightsContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.success + "30",
  },
  advancedInsightsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  insightItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  insightText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 16,
    marginEnd: theme.spacing.xs,
    flex: 1,
    writingDirection: "rtl",
  },
  nextWorkoutSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
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
