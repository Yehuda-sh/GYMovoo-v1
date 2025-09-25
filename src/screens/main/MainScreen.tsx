import React, { useEffect, useRef, useCallback, useMemo } from "react";
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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../core/theme";
import { isRTL, wrapBidi, wrapTextWithEmoji } from "../../utils/rtlHelpers";
import { useUserStore } from "../../stores/userStore";
import { RootStackParamList } from "../../navigation/types";
import { logger } from "../../utils/logger";
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
import { formatLargeNumber, formatProgressRatio } from "../../utils/formatters";
import {
  WelcomeHeader,
  QuickStatsCard,
  AIRecommendationsSection,
  WearablesSection,
  RecentWorkoutItem,
} from "./components";
import { useMainScreenData } from "./hooks/useMainScreenData";
import { formatRating, formatFitnessLevel } from "./utils/mainScreenHelpers";
import { useLastWorkoutStats } from "./hooks/useLastWorkoutStats";
import {
  calculateNextRecommendedDay,
  calculateWeeklyProgress,
} from "./utils/workoutDataHelpers";

// Types
interface ProcessedStats {
  totalWorkouts: number;
  currentStreak: number;
  totalVolume: number;
  averageRating: number;
  fitnessLevel: string;
}

function MainScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    refreshing,
    loading,
    error,
    advancedStats,
    displayName,
    availableTrainingDays,
    daysToShow,
    onRefresh,
  } = useMainScreenData();

  const { user } = useUserStore();
  const renderStartTime = useMemo(() => Date.now(), []);

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime;
    if (renderTime > 100) {
      logger.warn("MainScreen", `רינדור איטי: ${renderTime.toFixed(2)}ms`);
    }
  }, [renderStartTime]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const quickWorkoutScale = useRef(new Animated.Value(1)).current;
  const triggerHapticFeedback = useCallback(
    (intensity: "light" | "medium" | "heavy") => {
      const feedbackMap = {
        light: () => Haptics.selectionAsync(),
        medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
        heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
      };
      feedbackMap[intensity]();
    },
    []
  );

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

  const timeBasedGreeting = useMemo(() => getTimeBasedGreeting(), []);

  /** @description נתוני סטטיסטיקה מעובדים לתצוגה */
  const stats: ProcessedStats = useMemo(
    () => ({
      totalWorkouts:
        advancedStats?.totalWorkouts || user?.trainingStats?.totalWorkouts || 0,
      currentStreak:
        advancedStats?.currentStreak || user?.trainingStats?.currentStreak || 0,
      totalVolume: user?.trainingStats?.totalVolume || 0,
      averageRating:
        advancedStats?.genderStats?.total?.averageDifficulty ||
        user?.trainingStats?.averageRating ||
        0,
      fitnessLevel:
        user?.questionnaireData?.answers?.experience_level ||
        user?.trainingStats?.currentFitnessLevel ||
        "beginner",
    }),
    [
      advancedStats,
      user?.trainingStats,
      user?.questionnaireData?.answers?.experience_level,
    ]
  );

  /** @description סטטיסטיקות מהאימון האחרון */
  const lastWorkoutStats = useLastWorkoutStats({
    workouts: user?.activityHistory?.workouts || [],
  });

  /** @description חישוב היום הבא המומלץ לאימון */
  const nextRecommendedDay = useMemo(() => {
    return calculateNextRecommendedDay(
      user?.activityHistory?.workouts || [],
      availableTrainingDays
    );
  }, [user?.activityHistory?.workouts, availableTrainingDays]);

  /** @description נתוני התקדמות שבועית */
  const weeklyProgressData = useMemo(() => {
    return calculateWeeklyProgress(
      user?.activityHistory?.weeklyProgress || 0,
      availableTrainingDays
    );
  }, [user?.activityHistory?.weeklyProgress, availableTrainingDays]);

  useEffect(() => {
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

  // onRefresh now handled by useMainScreenData hook

  const handleStartWorkout = useCallback(
    (options?: { workoutName?: string; workoutIndex?: number }) => {
      triggerHapticFeedback("heavy");
      navigation.navigate("WorkoutPlans", {
        autoStart: true,
        ...(options?.workoutName && {
          requestedWorkoutName: options.workoutName,
        }),
        ...(options?.workoutIndex !== undefined && {
          requestedWorkoutIndex: options.workoutIndex,
        }),
      });
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
          {stats.totalWorkouts > 0 && (
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
                          {wrapTextWithEmoji("תובנות אימון מתקדמות", "📊")}
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

          {/* AI המלצות ו-Wearables */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginBottom: 24,
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.sectionTitle}>🤖 המלצות חכמות ובריאות</Text>

            {/* Wearables Integration Component */}
            <WearablesSection />

            {/* AI Recommendations Component */}
            <AIRecommendationsSection
              historyItems={user?.activityHistory?.workouts || []}
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
                בהתבסס על האימון האחרון שלך, אנו ממליצים להמשיך לאימון{" "}
                {(() => {
                  const letters = ["A", "B", "C", "D", "E", "F", "G"];
                  return (
                    letters[(nextRecommendedDay || 1) - 1] ||
                    `יום ${nextRecommendedDay}`
                  );
                })()}
              </Text>
            </View>

            <DayButtonGrid
              days={daysToShow}
              onDayPress={handleDayWorkout}
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
              {wrapBidi(MAIN_SCREEN_TEXTS.SECTIONS.YOUR_STATUS)}
            </Text>

            <View style={styles.statsGrid}>
              <StatCard
                variant="progress"
                value={weeklyProgressData.text}
                label={MAIN_SCREEN_TEXTS.STATS.WEEKLY_GOAL}
                subtitle={formatProgressRatio(
                  user?.activityHistory?.weeklyProgress || 0,
                  availableTrainingDays,
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
                value={user?.trainingStats?.currentStreak || 0}
                label={MAIN_SCREEN_TEXTS.STATS.CURRENT_STREAK}
                subtitle={MAIN_SCREEN_TEXTS.STATS.DAYS}
                testID="current-streak-card"
              />
              <StatCard
                variant="default"
                icon="chart-line"
                iconColor={theme.colors.primary}
                value={
                  user?.activityHistory?.workouts?.length ||
                  user?.trainingStats?.totalWorkouts ||
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
              {wrapBidi(MAIN_SCREEN_TEXTS.SECTIONS.RECENT_WORKOUTS)}
            </Text>

            <View style={styles.recentWorkoutsList}>
              {user?.activityHistory?.workouts &&
              user.activityHistory.workouts.length > 0 ? (
                user.activityHistory.workouts
                  .slice(0, 3)
                  .map((workout, index) => (
                    <RecentWorkoutItem
                      key={workout?.id || `workout-${index}`}
                      workout={workout}
                    />
                  ))
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
    textAlign: isRTL() ? "right" : "left",
    marginBottom: theme.spacing.lg,
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    alignSelf: isRTL() ? "flex-end" : "flex-start",
    marginBottom: theme.spacing.sm,
  },
  fitnessLevelText: {
    fontSize: 16, // הוגדל מ-14 לקריאות טובה יותר
    color: theme.colors.primary,
    fontWeight: "600",
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
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
    writingDirection: isRTL() ? "rtl" : "ltr",
  },

  // Day selection section styles // סטיילים לקטע בחירת יום
  daySelectionSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  recommendationNote: {
    flexDirection: isRTL() ? "row-reverse" : "row",
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
    marginEnd: isRTL() ? theme.spacing.xs : 0,
    marginStart: isRTL() ? 0 : theme.spacing.xs,
    flex: 1,
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    // 📱 44px Minimum Touch Target Validation for Fitness Mobile
    minHeight: 44,
  },
  quickWorkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.surface,
    marginEnd: isRTL() ? theme.spacing.sm : 0,
    marginStart: isRTL() ? 0 : theme.spacing.sm,
    writingDirection: isRTL() ? "rtl" : "ltr",
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
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  insightItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  insightText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 16,
    marginEnd: isRTL() ? theme.spacing.xs : 0,
    marginStart: isRTL() ? 0 : theme.spacing.xs,
    flex: 1,
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  // AI & Wearables section styles moved to individual components
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
