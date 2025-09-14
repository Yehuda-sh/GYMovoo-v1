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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../core/theme";
import { useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../navigation/types";
import { logger } from "../../utils/logger";
import workoutFacadeService from "../../services/workout/workoutFacadeService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard, { StatCardGrid } from "../../components/common/StatCard";
import { DayButtonGrid } from "../../components/common/DayButton";
import AppButton from "../../components/common/AppButton";
import EmptyState from "../../components/common/EmptyState";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import {
  MAIN_SCREEN_TEXTS,
  getTimeBasedGreeting,
} from "../../constants/mainScreenTexts";
import {
  formatLargeNumber,
  formatWorkoutDate,
  getWorkoutIcon,
  formatWeeklyProgress,
  formatProgressRatio,
} from "../../utils/formatters";
import { calculateWorkoutStats } from "../../features/workout/utils";
import type { User } from "../../core/types/user.types";
import { WelcomeHeader, QuickStatsCard } from "./components";
import { getNextRecommendedDay } from "./utils/dataProcessors";

// Helper functions
const formatRating = (rating: number): string => {
  if (isNaN(rating) || rating === 0) return "-";
  return rating.toFixed(1);
};

const formatFitnessLevel = (level: string): string => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "בינוני";
    case "advanced":
      return "מתקדם";
    default:
      return "מתחיל";
  }
};

/** @description Calculate available training days from user data - SIMPLIFIED */
const calculateAvailableTrainingDays = (user: User | null): number => {
  if (!user) return 3;

  // מקור יחיד: תשובות השאלון החכם
  const smartAnswers = user.questionnaireData?.answers;
  if (smartAnswers?.availability) {
    const availability = Array.isArray(smartAnswers.availability)
      ? smartAnswers.availability[0]
      : smartAnswers.availability;

    // בדיקת טיפוס והמרה
    if (typeof availability === "string") {
      const daysMap: Record<string, number> = {
        "2_days": 2,
        "3_days": 3,
        "4_days": 4,
        "5_days": 5,
        "5_plus_days": 5,
      };

      return daysMap[availability] || 3;
    }
  }

  return 3; // ברירת מחדל
};

/** @description Extract personal data from user for analytics */
const extractPersonalDataFromUser = (user: User | null) => {
  if (!user) {
    return {
      age: "unknown" as const,
      gender: "male" as const,
      availability: "3_days" as const,
      goals: "general_fitness" as const,
      fitnessLevel: "beginner" as const,
      weight: "70",
      height: "170",
    };
  }

  // Extract gender
  const gender = (
    user.questionnaireData?.answers?.gender === "female" ? "female" : "male"
  ) as "male" | "female";

  // Extract age
  const age = user.questionnaireData?.answers?.age?.toString() || "unknown";

  // Extract availability
  const availability = (
    Array.isArray(user.questionnaireData?.answers?.availability)
      ? user.questionnaireData.answers.availability[0] || "3_days"
      : "3_days"
  ) as "2_days" | "3_days" | "4_days" | "5_days";

  // Extract goals
  const goalsArray = Array.isArray(user.questionnaireData?.answers?.goals)
    ? user.questionnaireData.answers.goals
    : [];

  const goals =
    goalsArray.length > 0
      ? (goalsArray[0] as
          | "weight_loss"
          | "muscle_gain"
          | "endurance"
          | "strength"
          | "general_fitness")
      : ("general_fitness" as const);

  // Extract fitness level
  const fitnessLevel = (user.questionnaireData?.answers?.fitnessLevel ||
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

// Types
interface ProcessedStats {
  totalWorkouts: number;
  currentStreak: number;
  totalVolume: number;
  averageRating: number;
  fitnessLevel: string;
}

interface MinimalWorkout {
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
}

// ===============================================
// 🚀 Main Component - קומפוננטה ראשית
// ===============================================

/**
 * @description MainScreen - המסך הראשי של האפליקציה
 * @features דשבורד מותאם אישית, סטטיסטיקות, המלצות AI, בחירת אימונים
 * @performance מותאם עם React.memo ו-hooks ממוחזרים
 * @accessibility תמיכה מלאה בנגישות עם תוויות ויעדי מגע מתאימים
 */
function MainScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, getCompletionStatus } = useUserStore();
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

  // Guard: enforce strict onboarding flow
  useEffect(() => {
    const completion = getCompletionStatus?.();
    if (!completion) return;

    logger.info("MainScreen", "Completion status check", {
      hasSmartQuestionnaire: completion.hasSmartQuestionnaire,
      hasBasicInfo: completion.hasBasicInfo,
      isFullySetup: completion.isFullySetup,
      userData: {
        hasQuestionnaire: useUserStore.getState().user?.hasQuestionnaire,
        hasQuestionnaireData: !!useUserStore.getState().user?.questionnaireData,
        userId: useUserStore.getState().user?.id,
        userEmail: useUserStore.getState().user?.email,
      },
    });

    // תיקון: else if במקום if כפול - מניעת redirect כפול
    if (!completion.hasSmartQuestionnaire) {
      logger.info(
        "MainScreen",
        "Redirecting to Questionnaire due to missing questionnaire data"
      );
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      return;
    } else if (!completion.hasBasicInfo) {
      // עדכון: ניווט למסך הרשמה דרך navigator האימות
      logger.info(
        "MainScreen",
        "Redirecting to Auth/Register due to missing basic info"
      );
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Auth",
            params: {
              screen: "Register",
            },
          },
        ],
      });
      return;
    }
  }, [user, navigation, getCompletionStatus]);

  // טעינת נתונים מתקדמים
  const loadAdvancedData = useCallback(async () => {
    if (!user) return;

    try {
      const historyItems = await workoutFacadeService.getHistoryForList();
      const personalData = extractPersonalDataFromUser(user);
      const insights = await workoutFacadeService.getPersonalizedAnalytics(
        historyItems,
        personalData
      );

      // חישוב סטטיסטיקות מההיסטוריה
      const totalWorkouts = historyItems.length;
      const currentStreak = historyItems.slice(0, 7).length; // פשוט

      setAdvancedStats({
        insights,
        genderStats: {
          total: {
            totalWorkouts,
            currentStreak,
            averageDifficulty: 4.0,
            workoutStreak: currentStreak,
          },
        },
        totalWorkouts,
        currentStreak,
      });
    } catch (error) {
      console.error("שגיאה בטעינת נתונים:", error);
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
      console.warn(`רינדור איטי: ${renderTime.toFixed(2)}ms`);
    }
  }, [renderStartTime]);

  // ===============================================
  // � Animation References - אנימציות משופרות
  // ===============================================
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // �🎯 Micro-interactions for buttons - מיקרו-אינטראקציות לכפתורים
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const quickWorkoutScale = useRef(new Animated.Value(1)).current;

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

  // 🎨 Micro-interaction animations - אנימציות מיקרו-אינטראקציות
  const animateQuickWorkout = useCallback(() => {
    Animated.sequence([
      Animated.timing(quickWorkoutScale, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(quickWorkoutScale, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [quickWorkoutScale]);

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
      scientificProfile: undefined, // user?.scientificprofile - field doesn't exist in User type
      activityHistory: user?.activityHistory,
      currentStats: user?.trainingStats, // ✅ תיקון: השתמש ב-trainingStats במקום trainingstats
    }),
    [user]
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
        advancedStats?.genderStats?.total?.averageDifficulty || 4.0, // ✅ תיקון: השתמש בערך ברירת מחדל
      fitnessLevel:
        // @ts-expect-error - נתיב לא קיים
        profileData.scientificProfile?.fitnessTests?.overallLevel || "beginner",
    }),
    [profileData, advancedStats]
  );

  // סטטיסטיקות מהאימון האחרון (ממופה בבטיחות טיפוסים)
  const lastWorkoutStats = useMemo(() => {
    const workouts = profileData.activityHistory?.workouts;
    if (!Array.isArray(workouts) || workouts.length === 0) return null;
    const last = workouts[0];
    if (!last || !Array.isArray(last.exercises) || last.exercises.length === 0)
      return null;

    const formattedExercises = last.exercises.map((ex, exIdx) => {
      const equipment = Array.isArray(ex.equipment)
        ? ex.equipment[0]
        : ex.equipment;
      const sets = Array.isArray(ex.sets)
        ? ex.sets.map((s, sIdx) => ({
            id: s.id || `set-${exIdx}-${sIdx}`,
            type: "working" as const,
            targetReps: s.reps || 0,
            actualReps: s.completed ? s.reps || 0 : 0,
            targetWeight: s.weight || 0,
            actualWeight: s.completed ? s.weight || 0 : 0,
            completed: !!s.completed,
            isPR: false,
            timeToComplete: 0,
          }))
        : [];
      return {
        id: ex.id || `ex-${exIdx}`,
        name: ex.name || "Unknown Exercise",
        category: ex.category || "Unknown",
        primaryMuscles: ex.primaryMuscles || ["Unknown"],
        equipment: equipment || "Unknown",
        sets,
      };
    });

    return calculateWorkoutStats(formattedExercises);
  }, [profileData.activityHistory?.workouts]);

  /** @description חישוב היום הבא המומלץ לאימון / Calculate next recommended workout day */
  const nextRecommendedDay = useMemo(() => {
    const workouts = profileData.activityHistory?.workouts || [];
    // המרה לפורמט WorkoutHistoryItem
    const historyItems = workouts.map((workout) => ({
      id: workout.id,
      workoutName: workout.name,
      type: workout.type || workout.name,
      date:
        (typeof workout.date === "string"
          ? new Date(workout.date)
          : workout.date
        )?.toISOString() || new Date().toISOString(),
      completedAt:
        (typeof workout.date === "string"
          ? new Date(workout.date)
          : workout.date
        )?.toISOString() || new Date().toISOString(),
      rating: 4.0,
    }));

    // @ts-expect-error - התאמה בין טיפוסים שונים
    return getNextRecommendedDay(historyItems, availableTrainingDays);
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
      triggerHapticFeedback("heavy");

      const navigationParams: Record<string, unknown> = {
        autoStart: true,
      };

      if (workoutName) {
        navigationParams.requestedWorkoutName = workoutName;
      }

      if (workoutIndex !== undefined) {
        navigationParams.requestedWorkoutIndex = workoutIndex;
      }

      navigation.navigate("WorkoutPlans", navigationParams);
    },
    [navigation, triggerHapticFeedback]
  );

  const handleDayWorkout = useCallback(
    (dayNumber: number) => {
      triggerHapticFeedback("medium");
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
            <AppButton
              title={MAIN_SCREEN_TEXTS.ACTIONS.TRY_AGAIN}
              variant="primary"
              size="small"
              onPress={onRefresh}
              accessibilityLabel="נסה שוב"
              accessibilityHint="לחץ כדי לרענן ולנסות לטעון מחדש"
            />
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
          <WelcomeHeader
            userName={displayName}
            greeting={timeBasedGreeting}
            onProfilePress={handleProfilePress}
            buttonScaleAnim={buttonScaleAnim}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />

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

              {/* Quick Stats Card - אימון אחרון */}
              <ErrorBoundary fallbackMessage="שגיאה בטעינת סטטיסטיקות האימון האחרון">
                {lastWorkoutStats && (
                  <QuickStatsCard
                    totalExercises={lastWorkoutStats.totalExercises}
                    totalReps={lastWorkoutStats.totalReps}
                    totalVolume={lastWorkoutStats.totalVolume}
                    personalRecords={lastWorkoutStats.personalRecords}
                    onPress={() => navigation.navigate("History")}
                  />
                )}
              </ErrorBoundary>

              <ErrorBoundary fallbackMessage="שגיאה בטעינת הסטטיסטיקות הכלליות">
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
                    value={formatLargeNumber(stats.totalVolume) || "0"}
                    label={MAIN_SCREEN_TEXTS.STATS.TOTAL_VOLUME}
                    testID="total-volume-card"
                  />

                  <StatCard
                    variant="scientific"
                    icon="star"
                    iconColor={theme.colors.warning}
                    value={formatRating(stats.averageRating) || "4.0"}
                    label={MAIN_SCREEN_TEXTS.STATS.AVERAGE_RATING}
                    testID="average-rating-card"
                  />
                </StatCardGrid>
              </ErrorBoundary>

              {/* רמת כושר */}
              <View style={styles.aiInsightCard}>
                <View style={styles.fitnessLevelBadge}>
                  <Text style={styles.fitnessLevelText}>
                    {MAIN_SCREEN_TEXTS.STATS.FITNESS_LEVEL}{" "}
                    {formatFitnessLevel(stats.fitnessLevel)}
                  </Text>
                </View>

                {/* Removed aiRecommendations quick tip (property no longer on profileData) */}

                {/* תובנות מתקדמות מ-WorkoutFacadeService */}
                <ErrorBoundary fallbackMessage="שגיאה בטעינת תובנות מתקדמות">
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
                              <Text style={styles.insightText}>
                                {insight || ""}
                              </Text>
                            </View>
                          ))}
                      </View>
                    )}
                </ErrorBoundary>
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
            {/* Remove NextWorkoutCard for now as it requires workoutPlan prop */}
            {/* TODO: Implement NextWorkoutCard with proper workoutPlan data */}
            {/* <NextWorkoutCard
              workoutPlan={undefined}
              onStartWorkout={handleStartWorkout}
            /> */}
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
                nextRecommendedDay || 1
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

            {/* כפתור אימון מהיר משופר */}
            <Animated.View
              style={{ transform: [{ scale: quickWorkoutScale }] }}
            >
              <TouchableOpacity
                style={styles.quickWorkoutButtonContainer}
                onPress={() => {
                  animateQuickWorkout();
                  handleStartWorkout();
                }}
                onPressIn={() => {
                  Animated.timing(quickWorkoutScale, {
                    toValue: 0.98,
                    duration: 100,
                    useNativeDriver: true,
                  }).start();
                }}
                onPressOut={() => {
                  Animated.timing(quickWorkoutScale, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                  }).start();
                }}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.QUICK_WORKOUT}
                accessibilityHint={MAIN_SCREEN_TEXTS.A11Y.QUICK_WORKOUT_HINT}
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={[theme.colors.primary, `${theme.colors.primary}DD`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickWorkoutButton}
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
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
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
                  profileData.currentStats?.currentStreak || 0 // ✅ תיקון: השתמש ב-currentStreak במקום workoutStreak
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
                            {formatWorkoutDate(dateValue, durationMinutes) ||
                              "תאריך לא ידוע"}
                          </Text>
                        </View>
                        <View style={styles.workoutRating}>
                          <MaterialCommunityIcons
                            name="star"
                            size={16}
                            color={theme.colors.warning}
                          />
                          <Text style={styles.ratingText}>
                            {formatRating(ratingValue) || "4.0"}
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

            <AppButton
              title={MAIN_SCREEN_TEXTS.ACTIONS.VIEW_ALL_HISTORY}
              variant="ghost"
              size="small"
              icon="chevron-left"
              iconPosition="right"
              onPress={handleHistoryPress}
              accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.VIEW_HISTORY}
              accessibilityHint={MAIN_SCREEN_TEXTS.A11Y.VIEW_HISTORY_HINT}
            />
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
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    // Glass morphism inspired effect - אפקט בהשראת זכוכית מודרני
    backgroundColor: `${theme.colors.surface}15`,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}25`,
    // Enhanced shadows - צללים משופרים
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  statsGrid: {
    gap: theme.spacing.lg,
  },

  // Recent workouts section משופר // קטע האימונים האחרונים מעודכן
  recentWorkoutsSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    // Enhanced glass-inspired design - עיצוב משופר בהשראת זכוכית
    backgroundColor: `${theme.colors.surface}12`,
    borderWidth: 1.5,
    borderColor: `${theme.colors.cardBorder}30`,
    // Multi-layer shadows for depth - צללים רב-שכבתיים לעומק
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 10,
  },
  recentWorkoutsList: {
    gap: theme.spacing.md,
  },
  recentWorkoutItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.xs,
    // Premium card design - עיצוב כרטיס פרימיום
    backgroundColor: `${theme.colors.card}FA`,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}40`,
    // Advanced shadows with subtle glow - צללים מתקדמים עם זוהר עדין
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    // Subtle gradient border effect (simulated)
    borderTopColor: `${theme.colors.primary}15`,
    borderTopWidth: 2,
  },
  workoutIcon: {
    width: 56, // הוגדל מ-52 לנוכחות טובה יותר
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.lg,
    // Modern icon design with gradient-like background
    backgroundColor: `${theme.colors.backgroundElevated}F5`,
    borderWidth: 2.5,
    borderColor: `${theme.colors.primary}25`,
    // Enhanced 3D effect with multiple shadows
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    // Inner glow effect (simulated)
    borderTopColor: `${theme.colors.primary}35`,
    borderBottomColor: `${theme.colors.primary}15`,
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

  // Error and loading styles
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
    fontSize: 16,
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
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
  quickWorkoutButtonContainer: {
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    ...theme.shadows.medium,
    elevation: 8,
  },
  quickWorkoutButton: {
    padding: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
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
