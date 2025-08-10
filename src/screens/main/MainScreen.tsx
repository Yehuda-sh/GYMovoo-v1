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

// New imports for optimized components and constants
import StatCard, { StatCardGrid } from "../../components/common/StatCard";
import DayButton, { DayButtonGrid } from "../../components/common/DayButton";
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
    () =>
      user?.name ||
      user?.email?.split("@")[0] ||
      MAIN_SCREEN_TEXTS.WELCOME.DEMO_USER,
    [user?.name, user?.email]
  );

  /** @description ברכה דינמית לפי שעה / Dynamic greeting based on time */
  const timeBasedGreeting = useMemo(() => getTimeBasedGreeting(), []);

  /** @description מספר ימי האימון על בסיס השאלון / Number of training days based on questionnaire */
  const availableTrainingDays = useMemo(() => {
    // נסה לחלץ מהשאלון החדש
    const answers = user?.questionnaireData?.answers as any;
    const availability = answers?.availability?.[0];

    if (availability) {
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

    // fallback - נסה לחלץ מהשאלון הישן (questionnaire.frequency)
    const oldQuestionnaire = user?.questionnaire as any;
    const frequency = oldQuestionnaire?.frequency;

    if (frequency) {
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

    // fallback - נסה לחלץ מפרופיל מדעי
    const availableDays = user?.scientificProfile?.available_days;

    if (
      typeof availableDays === "number" &&
      availableDays >= 2 &&
      availableDays <= 5
    ) {
      return availableDays;
    }

    // ברירת מחדל
    return 3;
  }, [
    user?.questionnaireData?.answers,
    user?.questionnaire,
    user?.scientificProfile?.available_days,
  ]);

  /** @description מערך הימים להצגה / Array of days to display */
  const daysToShow = useMemo(() => {
    const days = Array.from({ length: availableTrainingDays }, (_, i) => i + 1);
    return days;
  }, [availableTrainingDays]);

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

  /** @description חישוב היום הבא המומלץ לאימון / Calculate next recommended workout day */
  const getNextRecommendedDay = useMemo(() => {
    const workouts = profileData.activityHistory?.workouts || [];

    if (workouts.length === 0) {
      return 1; // אם אין היסטוריה, מתחילים מיום 1
    }

    // מוצא את האימון האחרון
    const lastWorkout = workouts[workouts.length - 1];
    const lastWorkoutType = lastWorkout?.type || lastWorkout?.workoutName || "";

    // לוגיקה דינמית לפי מספר הימים הזמינים
    if (lastWorkoutType.includes("1") || lastWorkoutType.includes("יום 1")) {
      return 2;
    } else if (
      lastWorkoutType.includes("2") ||
      lastWorkoutType.includes("יום 2")
    ) {
      return availableTrainingDays >= 3 ? 3 : 1; // אם יש רק 2 ימים, חוזרים ליום 1
    } else if (
      lastWorkoutType.includes("3") ||
      lastWorkoutType.includes("יום 3")
    ) {
      return availableTrainingDays >= 4 ? 4 : 1; // אם יש פחות מ-4 ימים, חוזרים ליום 1
    } else if (
      lastWorkoutType.includes("4") ||
      lastWorkoutType.includes("יום 4")
    ) {
      return availableTrainingDays >= 5 ? 5 : 1; // אם יש פחות מ-5 ימים, חוזרים ליום 1
    } else if (
      lastWorkoutType.includes("5") ||
      lastWorkoutType.includes("יום 5")
    ) {
      return 1; // אחרי יום 5 תמיד חוזרים ליום 1
    }

    // ברירת מחדל - יום 1
    return 1;
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

      // סימולציית טעינת נתונים // Simulate data loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // בדיקה אם יש משתמש זמין // Check if user is available
      if (!userState.user) {
        throw new Error(MAIN_SCREEN_TEXTS.STATUS.NO_USER_FOUND);
      }
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
  }, []);

  const handleStartWorkout = useCallback(() => {
    console.log("🚀 MainScreen - התחל אימון מהיר נלחץ!");
    navigation.navigate("WorkoutPlans", {
      autoStart: true,
    });
  }, [navigation]);

  const handleDayWorkout = useCallback(
    (dayNumber: number) => {
      console.log(`🚀 MainScreen - בחירת יום ${dayNumber} אימון ישיר!`);
      navigation.navigate("WorkoutPlans", {
        preSelectedDay: dayNumber,
        autoStart: true,
      });
    },
    [navigation]
  );

  const handleProfilePress = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const handleHistoryPress = useCallback(() => {
    navigation.navigate("History");
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* מציג שגיאה אם יש */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>
              {MAIN_SCREEN_TEXTS.ACTIONS.TRY_AGAIN}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* מציג אינדיקטור טעינה */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
                accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.PROFILE_BUTTON}
                accessibilityHint="לחץ לצפייה ועריכת הפרופיל האישי"
                accessibilityRole="button"
              >
                <Text style={styles.profileInitials}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.age_range
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.gender
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.primary_goal
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.fitness_experience
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.workout_location
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.session_duration
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.available_days
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.available_equipment
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
                      (user?.questionnaireData?.answers as QuestionnaireAnswers)
                        ?.health_status
                    )}
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
                    {MAIN_SCREEN_TEXTS.QUESTIONNAIRE.DEMO_NOTE}
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
            </View>
          </Animated.View>
        )}

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
              getNextRecommendedDay
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
              {getNextRecommendedDay}
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
            onPress={handleStartWorkout}
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
                            getWorkoutIcon(
                              workout.type,
                              workout.workoutName
                            ) as any
                          }
                          size={24}
                          color={theme.colors.primary}
                        />
                      </View>
                      <View style={styles.workoutInfo}>
                        <Text style={styles.workoutTitle}>
                          {workout.workoutName ||
                            (workout.type === "strength"
                              ? MAIN_SCREEN_TEXTS.WORKOUT_TYPES.STRENGTH
                              : MAIN_SCREEN_TEXTS.WORKOUT_TYPES.GENERAL)}
                        </Text>
                        <Text style={styles.workoutDate}>
                          {formatWorkoutDate(
                            workout.date || workout.completedAt || new Date(),
                            workout.duration,
                            workout.startTime
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
                          {formatRating(
                            workout.feedback?.rating || workout.rating || 4.0
                          )}
                        </Text>
                      </View>
                    </View>
                  ))
              : // אם אין היסטוריה אמיתית - הצג אימונים דמו / If no real history - show demo workouts
                MAIN_SCREEN_TEXTS.DEMO_WORKOUTS.map((workout, index) => (
                  <View key={`demo-${index}`} style={styles.recentWorkoutItem}>
                    <View style={styles.workoutIcon}>
                      <MaterialCommunityIcons
                        name={workout.icon}
                        size={24}
                        color={theme.colors.primary}
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
                        color={theme.colors.warning}
                      />
                      <Text style={styles.ratingText}>{workout.rating}</Text>
                    </View>
                  </View>
                ))}
          </View>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleHistoryPress}
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

  // Section styles // סטיילים לקטעים
  sectionTitle: {
    fontSize: 22, // הוגדל מ-20 לבולטות במסך הנייד
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: theme.spacing.md,
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
  },
  quickWorkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.surface,
    marginStart: theme.spacing.sm,
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
