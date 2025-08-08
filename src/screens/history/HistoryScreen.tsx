/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - עם תמיכה במשוב והתאמת מגדר
 * @brief Workout history screen - with feedback support and gender adaptation
 * @dependencies theme, userStore, workoutHistoryService, MaterialCommunityIcons, workoutHelpers
 * @notes תמיכה מלאה RTL, אנימציות משופרות, סטטיסטיקות מותאמות מגדר
 * @updated 2025-08-04 קוד משופר עם הסרת כפילויות ושיפור ארכיטקטורה
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmptyState } from "../../components";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { workoutHistoryService } from "../../services/workoutHistoryService";
import {
  WorkoutData,
  WorkoutStatistics,
  WorkoutWithFeedback,
} from "../workout/types/workout.types";
import {
  formatDateHebrew,
  getDifficultyStars,
  getFeelingEmoji,
  getGenderIcon,
  getUserGender,
} from "../../utils/workoutHelpers";
import {
  HISTORY_SCREEN_TEXTS,
  HISTORY_SCREEN_ACCESSIBILITY,
  HISTORY_SCREEN_ICONS,
} from "../../constants/historyScreenTexts";
import {
  HISTORY_SCREEN_CONFIG,
  HISTORY_SCREEN_FILTERS,
  HISTORY_SCREEN_FORMATS,
} from "../../constants/historyScreenConfig";
import {
  formatProgressText,
  formatSetRatio,
  formatDifficultyScore,
  removeDuplicateWorkouts,
  sortWorkoutsByDate,
  validateWorkoutData,
} from "./utils/historyHelpers";

// Note: WorkoutStatistics interface moved to workout.types.ts for consistency

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState<WorkoutStatistics | null>(null);
  const [congratulationMessage, setCongratulationMessage] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { user } = useUserStore();

  // Constants for pagination
  const ITEMS_PER_PAGE = HISTORY_SCREEN_CONFIG.ITEMS_PER_PAGE;

  // אנימציות משופרות // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Effect: initial load & user change reload (added user dependency)
  useEffect(() => {
    loadHistory(true);
    loadStatistics();
    loadLatestCongratulation();

    // אנימציית כניסה חלקה // Smooth entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: HISTORY_SCREEN_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: HISTORY_SCREEN_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [user?.id]);

  const loadHistory = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setHasMoreData(true);
      } else {
        setLoadingMore(true);
      }

      // תחילה ננסה לטעון מההיסטוריה הישירה של המשתמש (דמו)
      let allHistoryData: WorkoutWithFeedback[] = [];

      if (
        user?.activityHistory?.workouts &&
        Array.isArray(user.activityHistory.workouts) &&
        user.activityHistory.workouts.length > 0
      ) {
        allHistoryData = user.activityHistory.workouts.map(
          (workout: Record<string, unknown>) =>
            ({
              id: workout.id as string,
              workout: workout as unknown as WorkoutData,
              feedback: (workout.feedback as Record<string, unknown>) || {
                completedAt: (() => {
                  // טיפול משופר בתאריכים
                  const endTime = workout.endTime as string;
                  const startTime = workout.startTime as string;
                  const feedbackTime = (
                    workout.feedback as Record<string, unknown>
                  )?.completedAt as string;

                  // בדיקה לתאריך תקין
                  const possibleDates = [
                    feedbackTime,
                    endTime,
                    startTime,
                  ].filter(Boolean);

                  for (const dateStr of possibleDates) {
                    if (dateStr && dateStr !== "Invalid Date") {
                      const testDate = new Date(dateStr);
                      if (
                        !isNaN(testDate.getTime()) &&
                        testDate.getTime() > 0
                      ) {
                        return dateStr;
                      }
                    }
                  }

                  // ברירת מחדל - תאריך נוכחי
                  return new Date().toISOString();
                })(),
                difficulty:
                  ((workout.feedback as Record<string, unknown>)
                    ?.overallRating as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING,
                feeling:
                  ((workout.feedback as Record<string, unknown>)
                    ?.mood as string) || HISTORY_SCREEN_CONFIG.DEFAULT_MOOD,
                readyForMore: null,
              },
              stats: {
                duration:
                  (workout.duration as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_WORKOUT_DURATION,
                personalRecords:
                  ((workout.plannedVsActual as Record<string, unknown>)
                    ?.personalRecords as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_PERSONAL_RECORDS,
                totalSets:
                  ((workout.plannedVsActual as Record<string, unknown>)
                    ?.totalSetsCompleted as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_SETS,
                totalPlannedSets:
                  ((workout.plannedVsActual as Record<string, unknown>)
                    ?.totalSetsPlanned as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_PLANNED_SETS,
                totalVolume:
                  workout.totalVolume ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_VOLUME,
              },
              metadata: {
                userGender: getUserGender(user),
                deviceInfo: {
                  platform: HISTORY_SCREEN_CONFIG.DEMO_METADATA.PLATFORM,
                  screenWidth: HISTORY_SCREEN_CONFIG.DEMO_METADATA.SCREEN_WIDTH,
                  screenHeight:
                    HISTORY_SCREEN_CONFIG.DEMO_METADATA.SCREEN_HEIGHT,
                },
                version: HISTORY_SCREEN_CONFIG.DEMO_METADATA.VERSION,
                workoutSource:
                  HISTORY_SCREEN_CONFIG.DEMO_METADATA.WORKOUT_SOURCE,
              },
            }) as WorkoutWithFeedback
        );

        // הסר כפילויות ומיין לפי תאריך
        allHistoryData = sortWorkoutsByDate(
          removeDuplicateWorkouts(allHistoryData.map(validateWorkoutData))
        );
      } else {
        // אם אין היסטוריה ישירה, נשתמש בשירות
        allHistoryData = await workoutHistoryService.getWorkoutHistory();

        // וידוא שהנתונים מהשירות תקינים
        allHistoryData = allHistoryData.map(validateWorkoutData);
      }

      if (reset) {
        setAllWorkouts(allHistoryData);
        const initialData = allHistoryData.slice(0, ITEMS_PER_PAGE);
        setWorkouts(initialData);
        setHasMoreData(allHistoryData.length > ITEMS_PER_PAGE);
        setCurrentPage(HISTORY_SCREEN_CONFIG.INITIAL_PAGE); // עדכון לעמוד הבא
      } else {
        // Load more data - וודא שלא טוענים נתונים כפולים
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newData = allWorkouts.slice(startIndex, endIndex);

        if (newData.length > 0) {
          // וודא שלא מוסיפים נתונים כפולים
          setWorkouts((prev) => {
            const existingIds = new Set(prev.map((w) => w.id));
            const uniqueNewData = newData.filter((w) => !existingIds.has(w.id));
            return [...prev, ...uniqueNewData];
          });
          setCurrentPage((prev) => prev + 1);
          setHasMoreData(endIndex < allWorkouts.length);
        } else {
          setHasMoreData(false);
        }
      }
    } catch (error) {
      console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_HISTORY, error);
      Alert.alert(
        HISTORY_SCREEN_TEXTS.ERROR_TITLE,
        HISTORY_SCREEN_TEXTS.ERROR_LOADING_HISTORY
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadStatistics = async () => {
    try {
      // אם יש היסטוריה ישירה של המשתמש, נחשב סטטיסטיקות מהיא
      if (
        user?.activityHistory?.workouts &&
        Array.isArray(user.activityHistory.workouts) &&
        user.activityHistory.workouts.length > 0
      ) {
        const userGender = getUserGender(user);

        const totalWorkouts = user.activityHistory.workouts.length;
        const totalDuration = user.activityHistory.workouts.reduce(
          (sum: number, w: Record<string, unknown>) =>
            sum + ((w.duration as number) || 0),
          0
        );

        // חישוב ציון קושי ממוצע - נבדוק אם יש ציון בפידבק
        const workoutsWithDifficulty = user.activityHistory.workouts.filter(
          (w: Record<string, unknown>) =>
            (w.feedback as Record<string, unknown>)?.overallRating &&
            !isNaN(
              (w.feedback as Record<string, unknown>).overallRating as number
            )
        );
        const averageDifficulty =
          workoutsWithDifficulty.length > 0
            ? workoutsWithDifficulty.reduce(
                (sum: number, w: Record<string, unknown>) =>
                  sum +
                  (((w.feedback as Record<string, unknown>)
                    .overallRating as number) ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING),
                0
              ) / workoutsWithDifficulty.length
            : HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING; // ברירת מחדל

        const stats = {
          total: {
            totalWorkouts,
            totalDuration,
            averageDifficulty,
            workoutStreak: HISTORY_SCREEN_CONFIG.DEFAULT_WORKOUT_STREAK, // מחושב באופן פשוט
          },
          byGender: {
            male: {
              count:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.MALE
                  ? totalWorkouts
                  : 0,
              averageDifficulty:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.MALE
                  ? averageDifficulty
                  : 0,
            },
            female: {
              count:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.FEMALE
                  ? totalWorkouts
                  : 0,
              averageDifficulty:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.FEMALE
                  ? averageDifficulty
                  : 0,
            },
            other: {
              count:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.OTHER
                  ? totalWorkouts
                  : 0,
              averageDifficulty:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.OTHER
                  ? averageDifficulty
                  : 0,
            },
          },
        };

        setStatistics(stats);
      } else {
        // אחרת, נשתמש בשירות
        const stats = await workoutHistoryService.getGenderGroupedStatistics();
        setStatistics(stats);
      }
    } catch (error) {
      console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_STATISTICS, error);
    }
  };

  const loadLatestCongratulation = async () => {
    try {
      const message =
        await workoutHistoryService.getLatestCongratulationMessage();
      setCongratulationMessage(message);
    } catch (error) {
      console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_CONGRATULATION, error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadHistory(true),
      loadStatistics(),
      loadLatestCongratulation(),
    ]);
    setRefreshing(false);
  }, []);

  const loadMoreWorkouts = useCallback(() => {
    if (!loadingMore && hasMoreData && !loading) {
      loadHistory(false);
    }
  }, [loadingMore, hasMoreData, currentPage, loading]);

  // מאממוריזציה של חישובי סטטיסטיקה כדי למנוע חישובים מיותרים
  const currentGenderStats = useMemo(() => {
    if (!statistics || !user) return null;
    const userGender = getUserGender(user);
    return statistics.byGender[userGender];
  }, [statistics, user]);

  // מאממוריזציה של אייקון מגדר למשתמש הנוכחי
  const currentUserGenderIcon = useMemo(() => {
    if (!user) return null;
    const userGender = getUserGender(user);
    return getGenderIcon(userGender);
  }, [user]);

  const renderStatistics = useCallback(() => {
    if (!statistics || !statistics.total) return null;

    // בדיקה שהסטטיסטיקות תקינות
    const totalWorkouts = statistics.total.totalWorkouts || 0;
    const averageDifficulty = isNaN(statistics.total.averageDifficulty)
      ? HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING
      : statistics.total.averageDifficulty;

    if (totalWorkouts === 0) {
      return null; // אם אין אימונים, לא מציגים סטטיסטיקות
    }

    return (
      <Animated.View
        style={[
          styles.statisticsCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.statisticsTitle}>
          {HISTORY_SCREEN_TEXTS.STATISTICS_TITLE}
        </Text>
        <View style={styles.statsGrid}>
          <Animated.View
            style={[
              styles.statBox,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              },
            ]}
          >
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>
              {HISTORY_SCREEN_TEXTS.STAT_TOTAL_WORKOUTS}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.statBox,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              },
            ]}
          >
            <Text style={styles.statNumber}>
              {formatDifficultyScore(averageDifficulty)}
            </Text>
            <Text style={styles.statLabel}>
              {HISTORY_SCREEN_TEXTS.STAT_AVERAGE_DIFFICULTY}
            </Text>
          </Animated.View>

          {currentGenderStats &&
            currentGenderStats.count > 0 &&
            currentUserGenderIcon && (
              <Animated.View
                style={[
                  styles.statBox,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: fadeAnim }],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={currentUserGenderIcon}
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.statNumber}>
                  {currentGenderStats.count}
                </Text>
                <Text style={styles.statLabel}>
                  {HISTORY_SCREEN_TEXTS.STAT_MY_WORKOUTS}
                </Text>
              </Animated.View>
            )}
        </View>
      </Animated.View>
    );
  }, [
    statistics,
    currentGenderStats,
    currentUserGenderIcon,
    fadeAnim,
    slideAnim,
  ]);

  const renderCongratulationMessage = useCallback(() => {
    if (!congratulationMessage) return null;

    return (
      <Animated.View
        style={[
          styles.congratulationCard,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={HISTORY_SCREEN_ICONS.TROPHY}
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.congratulationText}>{congratulationMessage}</Text>
      </Animated.View>
    );
  }, [congratulationMessage, fadeAnim, slideAnim]);

  const renderWorkoutItem = useCallback(
    ({ item }: { item: WorkoutWithFeedback; index: number }) => {
      const userGender = item.metadata?.userGender;

      // בדיקה אם יש נתונים תקינים // Check if data is valid
      if (!item || !item.workout) {
        return null;
      }

      return (
        <Animated.View
          style={[
            styles.workoutCard,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange:
                      HISTORY_SCREEN_CONFIG.SLIDE_ANIMATION_RANGE.INPUT,
                    outputRange:
                      HISTORY_SCREEN_CONFIG.SLIDE_ANIMATION_RANGE.OUTPUT,
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.workoutHeader}>
            <View style={styles.workoutTitleRow}>
              <Text style={styles.workoutName}>
                {item.workout.name || HISTORY_SCREEN_TEXTS.WORKOUT_DEFAULT_NAME}
              </Text>
              {userGender && (
                <MaterialCommunityIcons
                  name={getGenderIcon(userGender)}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              )}
            </View>
            <Text style={styles.workoutDate}>
              {formatDateHebrew(item.feedback.completedAt)}
            </Text>
          </View>

          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.CLOCK}
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {item.stats.duration || 0}{" "}
                {HISTORY_SCREEN_TEXTS.WORKOUT_DURATION_UNIT}
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.DUMBBELL}
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {item.workout?.exercises?.length || 0}{" "}
                {HISTORY_SCREEN_TEXTS.WORKOUT_EXERCISES_LABEL}
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.CHECK_CIRCLE}
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {formatSetRatio(
                  item.stats.totalSets,
                  item.stats.totalPlannedSets
                )}{" "}
                {HISTORY_SCREEN_TEXTS.WORKOUT_SETS_COMPLETED}
              </Text>
            </View>

            {(item.stats?.personalRecords || 0) > 0 && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name={HISTORY_SCREEN_ICONS.TROPHY}
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.statText, { color: theme.colors.primary }]}
                >
                  {item.stats.personalRecords || 0}{" "}
                  {HISTORY_SCREEN_TEXTS.WORKOUT_PERSONAL_RECORDS}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.workoutFeedback}>
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackLabel}>
                {HISTORY_SCREEN_TEXTS.FEEDBACK_DIFFICULTY_LABEL}
              </Text>
              <Text style={styles.feedbackValue}>
                {getDifficultyStars(
                  item.feedback?.difficulty ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING
                )}
              </Text>
            </View>

            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackLabel}>
                {HISTORY_SCREEN_TEXTS.FEEDBACK_FEELING_LABEL}
              </Text>
              <Text style={styles.feedbackValue}>
                {getFeelingEmoji(
                  item.feedback?.feeling || HISTORY_SCREEN_CONFIG.DEFAULT_MOOD
                )}
              </Text>
            </View>
          </View>

          {/* הודעת ברכה מותאמת מגדר */}
          {item.feedback.congratulationMessage && (
            <View style={styles.congratulationInCard}>
              <Text style={styles.congratulationInCardText}>
                {item.feedback.congratulationMessage}
              </Text>
            </View>
          )}

          {/* הערות מותאמות מגדר */}
          {item.feedback.genderAdaptedNotes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesText}>
                {item.feedback.genderAdaptedNotes}
              </Text>
            </View>
          )}
        </Animated.View>
      );
    },
    [fadeAnim, slideAnim]
  );

  const renderLoadingFooter = useCallback(() => {
    if (!loadingMore && hasMoreData) {
      // הצגת אחוזים של נתונים שנטענו
      const percentage = Math.round(
        (workouts.length / allWorkouts.length) * 100
      );
      return (
        <View style={styles.progressFooter}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {formatProgressText(workouts.length, allWorkouts.length)}
          </Text>
        </View>
      );
    }

    if (!loadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <LoadingSpinner
          size="small"
          text={HISTORY_SCREEN_TEXTS.LOADING_MORE}
          variant="fade"
          testID={HISTORY_SCREEN_ACCESSIBILITY.LOADING_MORE_TEST_ID}
        />
      </View>
    );
  }, [loadingMore, hasMoreData, workouts.length, allWorkouts.length]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
            },
          ]}
        >
          <LoadingSpinner
            size="large"
            text={HISTORY_SCREEN_TEXTS.LOADING_MAIN}
            variant="pulse"
            testID={HISTORY_SCREEN_ACCESSIBILITY.MAIN_LOADING_TEST_ID}
          />
          <Text style={styles.loadingSubtext}>
            {HISTORY_SCREEN_TEXTS.LOADING_SUBTEXT}
          </Text>
        </Animated.View>
      </View>
    );
  }

  if (workouts.length === 0 && !loading) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <EmptyState
          icon={HISTORY_SCREEN_ICONS.TIME_OUTLINE}
          title={HISTORY_SCREEN_TEXTS.EMPTY_STATE_TITLE}
          description={HISTORY_SCREEN_TEXTS.EMPTY_STATE_DESCRIPTION}
          variant="default"
          testID={HISTORY_SCREEN_ACCESSIBILITY.EMPTY_STATE_TEST_ID}
        >
          {/* כפתור לחזרה למסך הראשי */}
          <Animated.View
            style={[
              styles.emptyAction,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name={HISTORY_SCREEN_ICONS.DUMBBELL}
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.emptyActionText}>
              {HISTORY_SCREEN_TEXTS.EMPTY_ACTION_TEXT}
            </Text>
          </Animated.View>
        </EmptyState>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* רשימת אימונים עם pagination */}
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => `${item.id}_${item.feedback.completedAt}`}
        onEndReached={loadMoreWorkouts}
        onEndReachedThreshold={HISTORY_SCREEN_CONFIG.LOAD_MORE_THRESHOLD}
        ListHeaderComponent={() => (
          <View>
            {/* הודעת ברכה אחרונה */}
            {renderCongratulationMessage()}

            {/* סטטיסטיקות */}
            {renderStatistics()}

            {/* כותרת היסטוריה */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>
                  {HISTORY_SCREEN_TEXTS.SCREEN_TITLE}
                </Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {workouts.length}/{allWorkouts.length}
                  </Text>
                </View>
              </View>
              {hasMoreData && (
                <Text style={styles.loadMoreHint}>
                  {HISTORY_SCREEN_TEXTS.LOAD_MORE_HINT}
                </Text>
              )}
            </Animated.View>
          </View>
        )}
        ListFooterComponent={renderLoadingFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center", // שיפור RTL: יישור מרכז
  },
  loadingSubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textTertiary,
    textAlign: "center", // שיפור RTL: יישור מרכז
  },
  emptyAction: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyActionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
    marginEnd: theme.spacing.sm,
  },
  congratulationCard: {
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: "row-reverse", // שיפור RTL: כיוון שמאל לימין
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  congratulationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
    marginEnd: theme.spacing.sm, // שיפור RTL: marginEnd במקום marginLeft
    flex: 1,
    textAlign: "right", // שיפור RTL: יישור לימין
  },
  statisticsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.primary + "10",
  },
  statisticsTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  statNumber: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right", // שיפור RTL: יישור לימין
  },
  sectionTitleContainer: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  countBadge: {
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  countBadgeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  loadMoreHint: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: theme.spacing.md,
  },
  workoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary + "10",
  },
  workoutHeader: {
    marginBottom: theme.spacing.md,
  },
  workoutTitleRow: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  workoutName: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  workoutDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  workoutStats: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-around",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background + "80",
    borderRadius: theme.radius.md,
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: theme.colors.textSecondary + "10",
  },
  statItem: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginEnd: theme.spacing.xs, // שיפור RTL: marginEnd במקום marginLeft
    textAlign: "right", // שיפור RTL: יישור לימין
  },
  workoutFeedback: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-around",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.textSecondary + "20",
  },
  feedbackItem: {
    alignItems: "center",
  },
  feedbackLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "center", // שיפור RTL: יישור מרכז
  },
  feedbackValue: {
    fontSize: theme.typography.body.fontSize,
    textAlign: "center", // שיפור RTL: יישור מרכז
  },
  congratulationInCard: {
    backgroundColor: theme.colors.primary + "08",
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  congratulationInCardText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    fontStyle: "italic",
  },
  notesSection: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  notesText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  loadingFooter: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingFooterText: {
    marginStart: theme.spacing.sm,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  progressFooter: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: theme.colors.textSecondary + "20",
    borderRadius: 2,
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
