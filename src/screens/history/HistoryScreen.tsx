/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים פשוט - שליפת נתונים מוכנים ממנהל מרכזי
 * @brief Simple workout history screen - fetches ready data from central manager
 * @dependencies theme, dataManager, MaterialCommunityIcons, workoutHelpers
 * @notes תמיכה מלאה RTL, נתונים מוכנים מראש, ללא לוגיקה מורכבת
 * @updated 2025-08-10 פישוט מהותי - שליפת נתונים פשוטה ממנהל מרכזי
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmptyState } from "../../components";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { dataManager } from "../../services/core";
import {
  WorkoutStatistics,
  WorkoutWithFeedback,
} from "../workout/types/workout.types";
import { getGenderIcon, getUserGender } from "../../utils/workoutHelpers";
import {
  HISTORY_SCREEN_TEXTS,
  HISTORY_SCREEN_ACCESSIBILITY,
  HISTORY_SCREEN_ICONS,
} from "../../constants/historyScreenTexts";
import { HISTORY_SCREEN_CONFIG } from "../../constants/historyScreenConfig";
import {
  formatDateHebrew,
  getDifficultyStars,
  getFeelingEmoji,
  formatProgressText,
  formatDifficultyScore,
} from "./utils/historyHelpers";

export default function HistoryScreen() {
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

  // Constants for pagination
  const ITEMS_PER_PAGE = HISTORY_SCREEN_CONFIG.ITEMS_PER_PAGE;

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  /**
   * טעינת נתונים מהמנהל המרכזי
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // וודא שהמנהל מאותחל
      if (!dataManager.isReady()) {
        if (user) {
          console.warn("📊 HistoryScreen: Initializing data manager...");
          await dataManager.initialize(user);
        } else {
          console.warn(
            "⚠️ HistoryScreen: No user available for initialization"
          );
          return;
        }
      }

      // שלוף נתונים מוכנים מהמנהל
      const allWorkouts = dataManager.getWorkoutHistory();
      const stats = dataManager.getStatistics();
      const congratulation = dataManager.getCongratulationMessage();

      // עדכן State
      setStatistics(stats);
      setCongratulationMessage(congratulation);

      // Pagination
      const initialData = allWorkouts.slice(0, ITEMS_PER_PAGE);
      setWorkouts(initialData);
      setCurrentPage(1);
      setHasMoreData(allWorkouts.length > ITEMS_PER_PAGE);

      console.warn(
        `✅ HistoryScreen: Loaded ${initialData.length}/${allWorkouts.length} workouts`
      );
    } catch (error) {
      console.error("❌ HistoryScreen: Failed to load data", error);
    } finally {
      setLoading(false);
    }
  }, [user, ITEMS_PER_PAGE]);

  /**
   * טעינת נתונים נוספים (pagination)
   */
  const loadMoreWorkouts = useCallback(() => {
    if (!hasMoreData || loading || refreshing) return;

    try {
      const allWorkouts = dataManager.getWorkoutHistory();
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
      console.error("❌ HistoryScreen: Failed to load more data", error);
    }
  }, [currentPage, ITEMS_PER_PAGE, hasMoreData, loading, refreshing]);

  /**
   * רענון נתונים
   */
  const onRefresh = useCallback(async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      console.warn("🔄 HistoryScreen: Refreshing data...");
      await dataManager.refresh(user);
      await loadData();
    } catch (error) {
      console.error("❌ HistoryScreen: Refresh failed", error);
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

  const renderStatistics = useCallback(() => {
    if (!statistics || !statistics.total) return null;

    const totalWorkouts = statistics.total.totalWorkouts || 0;
    const averageDifficulty = isNaN(statistics.total.averageDifficulty)
      ? HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING
      : statistics.total.averageDifficulty;

    if (totalWorkouts === 0) return null;

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

      if (!item || !item.workout) return null;

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
            <View style={styles.dateTimeRow}>
              <Text style={styles.workoutDate}>
                {formatDateHebrew(item.feedback.completedAt)}
              </Text>
              <Text style={styles.workoutTime}>
                {new Date(item.feedback.completedAt).toLocaleTimeString(
                  "he-IL",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
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
                {Math.round((item.stats.duration || 0) / 60)} דקות
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.DUMBBELL}
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {item.workout?.exercises?.length || 0} תרגילים
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.CHECK_CIRCLE}
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {item.stats.totalSets || 0} סטים
              </Text>
            </View>

            {(item.stats?.personalRecords || 0) > 0 && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name={HISTORY_SCREEN_ICONS.TROPHY}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.statText, { color: theme.colors.primary }]}
                >
                  {item.stats.personalRecords || 0} שיאים
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

          {item.feedback.congratulationMessage && (
            <View style={styles.congratulationInCard}>
              <Text style={styles.congratulationInCardText}>
                {item.feedback.congratulationMessage}
              </Text>
            </View>
          )}
        </Animated.View>
      );
    },
    [fadeAnim, slideAnim]
  );

  const renderLoadingFooter = useCallback(() => {
    const allWorkouts = dataManager.getWorkoutHistory();

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
  }, [hasMoreData, workouts.length]);

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
                      {workouts.length}/{dataManager.getWorkoutHistory().length}
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
}

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
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.primary + "20",
  },
  statisticsTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    writingDirection: "rtl",
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  statNumber: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  sectionTitleContainer: {
    flexDirection: "row-reverse",
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
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.small,
    borderWidth: 0.5,
    borderColor: theme.colors.textSecondary + "15",
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
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    writingDirection: "rtl",
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
