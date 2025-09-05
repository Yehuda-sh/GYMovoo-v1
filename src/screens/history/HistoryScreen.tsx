/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים פשוט - שליפת נתונים מוכנים ממנהל מרכזי
 * @description מציג היסטוריית אימונים עם סטטיסטיקות, תמיכה ב-RTL ואנימציות
 * @dependencies theme, dataManager, MaterialCommunityIcons, workoutHelpers, logger
 * @notes תמיכה מלאה RTL, נתונים מוכנים מראש, logging מרכזי, ללא לוגיקה מורכבת
 * @created 2025-01-15
 * @updated 2025-08-25 החלפת console calls בלוגינג מרכזי, פישוט constants, שיפור error handling
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
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmptyState } from "../../components";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { dataManager } from "../../services/core";
import { logger } from "../../utils/logger";
import {
  WorkoutStatistics,
  WorkoutWithFeedback,
} from "../workout/types/workout.types";
import { getGenderIcon, getUserGender } from "../../utils/workoutHelpers";
import {
  HISTORY_SCREEN_CONFIG,
  HISTORY_SCREEN_TEXTS,
  HISTORY_SCREEN_ACCESSIBILITY,
  HISTORY_SCREEN_ICONS,
} from "../../constants/historyScreenConfig";
import {
  formatDateHebrew,
  getDifficultyStars,
  getFeelingEmoji,
  formatProgressText,
  formatDifficultyScore,
} from "./utils/historyHelpers";

// Import User type for type safety
import type { User } from "../../types";
import NextWorkoutCard from "../../components/workout/NextWorkoutCard";

// ===============================================
// 🔧 Type Guards and Helper Functions
// ===============================================

/** @description Type guard for valid workout item */
const isValidWorkoutItem = (item: unknown): item is WorkoutWithFeedback => {
  const workoutItem = item as Partial<WorkoutWithFeedback>;
  return (
    typeof item === "object" &&
    item !== null &&
    typeof workoutItem.workout === "object" &&
    typeof workoutItem.feedback === "object" &&
    typeof workoutItem.stats === "object" &&
    workoutItem.workout !== null &&
    workoutItem.feedback !== null &&
    workoutItem.stats !== null
  );
};

/** @description Safe workout data extractor */
const extractWorkoutData = (item: WorkoutWithFeedback) => {
  if (!isValidWorkoutItem(item)) {
    return null;
  }

  const workout = item.workout;
  const feedback = item.feedback;
  const stats = item.stats;

  return {
    name: workout?.name || HISTORY_SCREEN_TEXTS.WORKOUT_DEFAULT_NAME,
    exercisesCount: workout?.exercises?.length || 0,
    durationMinutes: stats?.duration ? Math.round(stats.duration / 60) : 0,
    totalSets: stats?.totalSets || 0,
    personalRecords: stats?.personalRecords || 0,
    completedAt: feedback?.completedAt,
    difficulty:
      feedback?.difficulty || HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING,
    feeling: feedback?.feeling || HISTORY_SCREEN_CONFIG.DEFAULT_MOOD,
    congratulationMessage: feedback?.congratulationMessage,
    userGender: item.metadata?.userGender,
  };
};

/** @description Calculate workout statistics safely */
const calculateWorkoutStats = (statistics: WorkoutStatistics | null) => {
  if (!statistics?.total) {
    return {
      totalWorkouts: 0,
      averageDifficulty: HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING,
      hasData: false,
    };
  }

  const totalWorkouts = statistics.total.totalWorkouts || 0;
  const averageDifficulty = isNaN(statistics.total.averageDifficulty)
    ? HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING
    : statistics.total.averageDifficulty;

  return {
    totalWorkouts,
    averageDifficulty,
    hasData: totalWorkouts > 0,
  };
};

/** @description Safe data manager operations */
const safeDataManager = {
  getWorkoutHistory: (): WorkoutWithFeedback[] => {
    try {
      return dataManager.getWorkoutHistory() || [];
    } catch (error) {
      logger.error("HistoryScreen", "Failed to get workout history", error);
      return [];
    }
  },

  getStatistics: (): WorkoutStatistics | null => {
    try {
      return dataManager.getStatistics();
    } catch (error) {
      logger.error("HistoryScreen", "Failed to get statistics", error);
      return null;
    }
  },

  getCongratulationMessage: (): string | null => {
    try {
      return dataManager.getCongratulationMessage();
    } catch (error) {
      logger.error(
        "HistoryScreen",
        "Failed to get congratulation message",
        error
      );
      return null;
    }
  },

  isReady: (): boolean => {
    try {
      return dataManager.isReady();
    } catch (error) {
      logger.error(
        "HistoryScreen",
        "Failed to check data manager readiness",
        error
      );
      return false;
    }
  },

  initialize: async (user: User): Promise<void> => {
    try {
      await dataManager.initialize(user);
    } catch (error) {
      logger.error("HistoryScreen", "Failed to initialize data manager", error);
      throw error;
    }
  },

  refresh: async (user: User): Promise<void> => {
    try {
      await dataManager.refresh(user);
    } catch (error) {
      logger.error("HistoryScreen", "Failed to refresh data manager", error);
      throw error;
    }
  },
};

// Debug logging system
const dlog = (message: string, ...args: unknown[]) => {
  if (__DEV__) {
    logger.debug("HistoryScreen", message, ...args);
  }
};

const HistoryScreen: React.FC = React.memo(() => {
  const [workouts, setWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [statistics, setStatistics] = useState<WorkoutStatistics | null>(null);
  const [congratulationMessage, setCongratulationMessage] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);
  const { user } = useUserStore();
  const navigation = useNavigation();

  // Constants for pagination
  const ITEMS_PER_PAGE = HISTORY_SCREEN_CONFIG.ITEMS_PER_PAGE;

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  /**
   * טעינת נתונים מהמנהל המרכזי
   */
  const loadData = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setLoading(true);
        }

        // וודא שהמנהל מאותחל
        if (!safeDataManager.isReady()) {
          if (user) {
            dlog("Initializing data manager...");
            await safeDataManager.initialize(user);
          } else {
            dlog("No user available for initialization");
            return;
          }
        }

        // שלוף נתונים מוכנים מהמנהל בבטחה
        const allWorkouts = safeDataManager.getWorkoutHistory();
        const stats = safeDataManager.getStatistics();
        const congratulation = safeDataManager.getCongratulationMessage();

        // עדכן State
        setStatistics(stats);
        setCongratulationMessage(congratulation);

        // Pagination
        const initialData = allWorkouts.slice(0, ITEMS_PER_PAGE);
        setWorkouts(initialData);
        setCurrentPage(1);
        setHasMoreData(allWorkouts.length > ITEMS_PER_PAGE);

        dlog(`Loaded ${initialData.length}/${allWorkouts.length} workouts`);
      } catch (error) {
        logger.error("HistoryScreen", "Failed to load data", error);
        dlog("Failed to load data", { error });
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [user, ITEMS_PER_PAGE]
  );

  /**
   * טעינת נתונים נוספים (pagination)
   */
  const loadMoreWorkouts = useCallback(() => {
    if (!hasMoreData || loading || refreshing) return;

    try {
      const allWorkouts = safeDataManager.getWorkoutHistory();
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newData = allWorkouts.slice(startIndex, endIndex);

      if (newData.length > 0) {
        setWorkouts((prev) => [...prev, ...newData]);
        setCurrentPage((prev) => prev + 1);
        setHasMoreData(endIndex < allWorkouts.length);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      logger.error("HistoryScreen", "Failed to load more data", error);
      dlog("Failed to load more data", { error });
    }
  }, [currentPage, ITEMS_PER_PAGE, hasMoreData, loading, refreshing]);

  /**
   * רענון נתונים
   */
  const onRefresh = useCallback(async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      dlog("Refreshing data...");
      await safeDataManager.refresh(user);
      await loadData({ silent: true });
    } catch (error) {
      logger.error("HistoryScreen", "Refresh failed", error);
      dlog("Refresh failed", { error });
    } finally {
      setRefreshing(false);
    }
  }, [user, loadData]);

  // אתחול ראשוני
  useEffect(() => {
    if (!user?.id) return;

    const initializeScreen = async () => {
      await loadData();

      // אנימציית כניסה
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
    };

    initializeScreen();
  }, [user?.id, loadData, fadeAnim, slideAnim]);

  // מאממוריזציה של חישובי סטטיסטיקה
  const currentGenderStats = useMemo(() => {
    if (!statistics || !user) return null;
    const userGender = getUserGender(user);
    return statistics.byGender[userGender];
  }, [statistics, user]);

  // מאממוריזציה של אייקון מגדר
  const currentUserGenderIcon = useMemo(() => {
    if (!user) return null;
    const userGender = getUserGender(user);
    return getGenderIcon(userGender);
  }, [user]);

  // מאממוריזציה של סטטיסטיקות מעובדות
  const processedStats = useMemo(() => {
    return calculateWorkoutStats(statistics);
  }, [statistics]);

  /**
   * רינדור סטטיסטיקות משתמש
   * מציג סה"כ אימונים, קושי ממוצע ונתוני מגדר
   */
  const renderStatistics = useCallback(() => {
    if (!processedStats.hasData) return null;

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
            <Text style={styles.statNumber}>
              {processedStats.totalWorkouts}
            </Text>
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
              {formatDifficultyScore(processedStats.averageDifficulty)}
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
    processedStats,
    currentGenderStats,
    currentUserGenderIcon,
    fadeAnim,
    slideAnim,
  ]);

  /**
   * רינדור הודעת ברכה למשתמש
   */
  const renderCongratulationMessage = () => {
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
  };

  const renderWorkoutItem = useCallback(
    ({ item }: { item: WorkoutWithFeedback; index: number }) => {
      const workoutData = extractWorkoutData(item);
      if (!workoutData) return null;

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
              <Text style={styles.workoutName}>{workoutData.name}</Text>
              {workoutData.userGender && (
                <MaterialCommunityIcons
                  name={getGenderIcon(workoutData.userGender)}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              )}
            </View>
            <View style={styles.dateTimeRow}>
              <Text style={styles.workoutDate}>
                {workoutData.completedAt
                  ? formatDateHebrew(workoutData.completedAt)
                  : ""}
              </Text>
              <Text style={styles.workoutTime}>
                {workoutData.completedAt
                  ? new Date(workoutData.completedAt).toLocaleTimeString(
                      "he-IL",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : ""}
              </Text>
            </View>
          </View>

          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.CLOCK}
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {workoutData.durationMinutes} דקות
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.DUMBBELL}
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {workoutData.exercisesCount} תרגילים
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.CHECK_CIRCLE}
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>{workoutData.totalSets} סטים</Text>
            </View>

            {workoutData.personalRecords > 0 && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name={HISTORY_SCREEN_ICONS.TROPHY}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.statText, { color: theme.colors.primary }]}
                >
                  {workoutData.personalRecords} שיאים
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
                {getDifficultyStars(workoutData.difficulty)}
              </Text>
            </View>

            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackLabel}>
                {HISTORY_SCREEN_TEXTS.FEEDBACK_FEELING_LABEL}
              </Text>
              <Text style={styles.feedbackValue}>
                {getFeelingEmoji(workoutData.feeling)}
              </Text>
            </View>
          </View>

          {workoutData.congratulationMessage && (
            <View style={styles.congratulationInCard}>
              <Text style={styles.congratulationInCardText}>
                {workoutData.congratulationMessage}
              </Text>
            </View>
          )}
        </Animated.View>
      );
    },
    [fadeAnim, slideAnim]
  );

  const renderLoadingFooter = () => {
    const allWorkouts = safeDataManager.getWorkoutHistory();

    if (!hasMoreData) {
      return (
        <View style={styles.progressFooter}>
          <Text style={styles.progressText}>
            {formatProgressText(workouts.length, allWorkouts.length)}
          </Text>
        </View>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "right", "left", "bottom"]}
      >
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
      </SafeAreaView>
    );
  }

  if (workouts.length === 0 && !loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "right", "left", "bottom"]}
      >
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "right", "left", "bottom"]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item, index) =>
            item?.id && item?.feedback?.completedAt
              ? `${item.id}_${item.feedback.completedAt}`
              : `history_${index}`
          }
          onEndReached={loadMoreWorkouts}
          onEndReachedThreshold={HISTORY_SCREEN_CONFIG.LOAD_MORE_THRESHOLD}
          removeClippedSubviews={false}
          accessibilityLabel={HISTORY_SCREEN_TEXTS.SCREEN_TITLE}
          ListHeaderComponent={() => (
            <View>
              {renderCongratulationMessage()}
              {renderStatistics()}

              {/* Next Workout Recommendation */}
              <NextWorkoutCard
                onStartWorkout={(workoutName, workoutIndex) => {
                  // Navigate to workout plans screen with specific workout
                  navigation.navigate("WorkoutPlans", {
                    autoStart: true,
                    requestedWorkoutName: workoutName,
                    requestedWorkoutIndex: workoutIndex,
                  });
                }}
              />

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
                      {workouts.length}/
                      {safeDataManager.getWorkoutHistory().length}
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
    </SafeAreaView>
  );
});

HistoryScreen.displayName = "HistoryScreen";

export default HistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
  loadingSubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textTertiary,
    textAlign: "center",
  },
  emptyAction: {
    flexDirection: "row-reverse",
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
    writingDirection: "rtl",
  },
  congratulationCard: {
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  congratulationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
    marginEnd: theme.spacing.sm,
    flex: 1,
    textAlign: "right",
  },
  statisticsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  statisticsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    writingDirection: "rtl",
    letterSpacing: 0.4,
    textShadowColor: "rgba(0, 0, 0, 0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface + "40",
    borderRadius: theme.radius.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: 0.5,
    textShadowColor: theme.colors.primary + "20",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "right",
    letterSpacing: 0.4,
  },
  sectionTitleContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  countBadge: {
    backgroundColor: theme.colors.primary + "25",
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary + "20",
  },
  workoutHeader: {
    marginBottom: theme.spacing.sm,
  },
  workoutTitleRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    flex: 1,
    writingDirection: "rtl",
    letterSpacing: 0.3,
  },
  workoutDate: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    writingDirection: "rtl",
  },
  dateTimeRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  workoutTime: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textTertiary,
    fontWeight: "500",
  },
  workoutStats: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background + "40",
    borderRadius: theme.radius.sm,
    flexWrap: "wrap",
    borderWidth: 0,
  },
  statItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginEnd: theme.spacing.xs,
    textAlign: "right",
    fontWeight: "500",
  },
  workoutFeedback: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.textSecondary + "20",
  },
  feedbackItem: {
    alignItems: "center",
  },
  feedbackLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  feedbackValue: {
    fontSize: theme.typography.h4.fontSize,
    textAlign: "center",
  },
  congratulationInCard: {
    backgroundColor: theme.colors.primary + "08",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    marginHorizontal: theme.spacing.xs,
  },
  congratulationInCardText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    fontStyle: "italic",
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.sm,
  },
  progressFooter: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  progressText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
