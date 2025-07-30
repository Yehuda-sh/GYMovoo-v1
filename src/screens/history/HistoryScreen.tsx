/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - עם תמיכה במשוב והתאמת מגדר
 * @brief Workout history screen - with feedback support and gender adaptation
 * @dependencies theme, userStore, workoutHistoryService, MaterialCommunityIcons
 * @notes תמיכה מלאה RTL, אנימציות משופרות, סטטיסטיקות מותאמות מגדר
 * @updated 2025-07-30 שיפורים RTL ואנימציות עקביות עם הפרויקט
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import {
  workoutHistoryService,
  WorkoutWithFeedback,
} from "../../services/workoutHistoryService";

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [congratulationMessage, setCongratulationMessage] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { user } = useUserStore();

  // Constants for pagination
  const ITEMS_PER_PAGE = 10;

  // אנימציות משופרות // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadHistory(true);
    loadStatistics();
    loadLatestCongratulation();

    // אנימציית כניסה חלקה // Smooth entry animation
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
  }, []);

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
        allHistoryData = user.activityHistory.workouts
          .map((workout: any) => ({
            id: workout.id,
            workout: workout,
            feedback: workout.feedback || {
              completedAt: workout.endTime || workout.startTime,
              difficulty: workout.feedback?.overallRating || 3,
              feeling: workout.feedback?.mood || "😐",
              readyForMore: null,
            },
            stats: {
              duration: workout.duration || 0,
              personalRecords: workout.plannedVsActual?.personalRecords || 0,
              totalSets: workout.plannedVsActual?.totalSetsCompleted || 0,
              totalPlannedSets: workout.plannedVsActual?.totalSetsPlanned || 0,
              totalVolume: workout.totalVolume || 0,
            },
            metadata: {
              userGender: getUserGender(),
              deviceInfo: {
                platform: "unknown",
                screenWidth: 375,
                screenHeight: 667,
              },
              version: "1.0.0",
              workoutSource: "demo" as const,
            },
          }))
          .filter(
            (workout: any, index: number, array: any[]) =>
              // הסר כפילויות לפי ID ותאריך
              array.findIndex(
                (w: any) =>
                  w.id === workout.id &&
                  w.feedback.completedAt === workout.feedback.completedAt
              ) === index
          )
          .sort(
            (a: any, b: any) =>
              new Date(b.feedback.completedAt).getTime() -
              new Date(a.feedback.completedAt).getTime()
          ) as WorkoutWithFeedback[];
      } else {
        // אם אין היסטוריה ישירה, נשתמש בשירות
        allHistoryData = await workoutHistoryService.getWorkoutHistory();
      }

      if (reset) {
        setAllWorkouts(allHistoryData);
        const initialData = allHistoryData.slice(0, ITEMS_PER_PAGE);
        setWorkouts(initialData);
        setHasMoreData(allHistoryData.length > ITEMS_PER_PAGE);
        setCurrentPage(2); // עדכון לעמוד הבא
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
      console.error("❌ Error loading history:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את היסטוריית האימונים");
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
        const userGender = getUserGender();

        const totalWorkouts = user.activityHistory.workouts.length;
        const totalDuration = user.activityHistory.workouts.reduce(
          (sum: number, w: any) => sum + (w.duration || 0),
          0
        );

        // חישוב ציון קושי ממוצע - נבדוק אם יש ציון בפידבק
        const workoutsWithDifficulty = user.activityHistory.workouts.filter(
          (w: any) =>
            w.feedback?.overallRating && !isNaN(w.feedback.overallRating)
        );
        const averageDifficulty =
          workoutsWithDifficulty.length > 0
            ? workoutsWithDifficulty.reduce(
                (sum: number, w: any) => sum + (w.feedback.overallRating || 4),
                0
              ) / workoutsWithDifficulty.length
            : 4; // ברירת מחדל

        const stats = {
          total: {
            totalWorkouts,
            totalDuration,
            averageDifficulty,
            workoutStreak: 1, // מחושב באופן פשוט
          },
          byGender: {
            male: {
              count: userGender === "male" ? totalWorkouts : 0,
              averageDifficulty: userGender === "male" ? averageDifficulty : 0,
            },
            female: {
              count: userGender === "female" ? totalWorkouts : 0,
              averageDifficulty:
                userGender === "female" ? averageDifficulty : 0,
            },
            other: {
              count: userGender === "other" ? totalWorkouts : 0,
              averageDifficulty: userGender === "other" ? averageDifficulty : 0,
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
      console.error("❌ Error loading statistics:", error);
    }
  };

  const loadLatestCongratulation = async () => {
    try {
      const message =
        await workoutHistoryService.getLatestCongratulationMessage();
      setCongratulationMessage(message);
    } catch (error) {
      console.error("Error loading congratulation message:", error);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyStars = (difficulty: number) => {
    return "⭐".repeat(Math.max(1, Math.min(5, difficulty)));
  };

  const getFeelingEmoji = (feeling: string) => {
    const emojiMap: { [key: string]: string } = {
      challenging: "😤",
      strong: "💪",
      enjoyable: "😊",
      easy: "😴",
      excellent: "🔥",
      good: "👍",
      okay: "😐",
      tired: "😴",
      energetic: "⚡",
    };
    return emojiMap[feeling] || feeling || "😐";
  };

  const getGenderIcon = (gender?: "male" | "female" | "other") => {
    switch (gender) {
      case "male":
        return "gender-male";
      case "female":
        return "gender-female";
      default:
        return "account";
    }
  };

  const getUserGender = (): "male" | "female" | "other" => {
    // בדיקה של מגדר מתוך smartQuestionnaireData (חדש) או questionnaire רגיל (ישן)
    const smartData = user?.smartQuestionnaireData;
    const regularData = user?.questionnaire;

    if (smartData?.answers?.gender) {
      return smartData.answers.gender;
    }

    // לשאלון הישן - מגדר בדרך כלל נמצא בשאלה 1
    if (regularData && regularData[1]) {
      const genderAnswer = regularData[1] as string;
      if (
        genderAnswer === "male" ||
        genderAnswer === "female" ||
        genderAnswer === "other"
      ) {
        return genderAnswer;
      }
    }

    return "other";
  };

  const renderStatistics = () => {
    if (!statistics) return null;

    const userGender = getUserGender();
    const currentGenderStats = statistics.byGender[userGender];

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
        <Text style={styles.statisticsTitle}>📊 סטטיסטיקות</Text>
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
              {statistics.total.totalWorkouts}
            </Text>
            <Text style={styles.statLabel}>סה"כ אימונים</Text>
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
              {Math.round(statistics.total.averageDifficulty * 10) / 10}
            </Text>
            <Text style={styles.statLabel}>קושי ממוצע</Text>
          </Animated.View>

          {currentGenderStats && currentGenderStats.count > 0 && (
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
                name={getGenderIcon(userGender)}
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.statNumber}>{currentGenderStats.count}</Text>
              <Text style={styles.statLabel}>האימונים שלי</Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    );
  };

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
          name="trophy"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.congratulationText}>{congratulationMessage}</Text>
      </Animated.View>
    );
  };

  const renderWorkoutItem = ({
    item,
    index,
  }: {
    item: WorkoutWithFeedback;
    index: number;
  }) => {
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
                  inputRange: [0, 50],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutTitleRow}>
            <Text style={styles.workoutName}>
              {item.workout.name || "אימון"}
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
            {formatDate(item.feedback.completedAt)}
          </Text>
        </View>

        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="clock"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>{item.stats.duration} דק'</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>
              {item.workout.exercises?.length || 0} תרגילים
            </Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="check-circle"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>
              {item.stats.totalSets}/{item.stats.totalPlannedSets} סטים
            </Text>
          </View>

          {item.stats.personalRecords > 0 && (
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="trophy"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={[styles.statText, { color: theme.colors.primary }]}>
                {item.stats.personalRecords} שיאים
              </Text>
            </View>
          )}
        </View>

        <View style={styles.workoutFeedback}>
          <View style={styles.feedbackItem}>
            <Text style={styles.feedbackLabel}>קושי:</Text>
            <Text style={styles.feedbackValue}>
              {getDifficultyStars(item.feedback.difficulty)}
            </Text>
          </View>

          <View style={styles.feedbackItem}>
            <Text style={styles.feedbackLabel}>הרגשה:</Text>
            <Text style={styles.feedbackValue}>
              {getFeelingEmoji(item.feedback.feeling)}
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
  };

  const renderLoadingFooter = () => {
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
            נטענו {workouts.length} מתוך {allWorkouts.length} אימונים (
            {percentage}%)
          </Text>
        </View>
      );
    }

    if (!loadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.loadingFooterText}>טוען עוד...</Text>
      </View>
    );
  };

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
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>טוען היסטוריה...</Text>
          <Text style={styles.loadingSubtext}>מאחזר נתוני אימונים קודמים</Text>
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
        <View style={styles.emptyContainer}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
            }}
          >
            <MaterialCommunityIcons
              name="history"
              size={100}
              color={theme.colors.textSecondary}
            />
          </Animated.View>
          <Text style={styles.emptyTitle}>אין עדיין אימונים שמורים</Text>
          <Text style={styles.emptySubtitle}>
            לאחר סיום אימון, לחץ על "שמור אימון ומשוב"
          </Text>
          <Text style={styles.emptyHint}>
            האימונים הבאים שלך יופיעו כאן עם פרטים מלאים וסטטיסטיקות
          </Text>

          {/* הוספת כפתור לחזרה למסך הראשי */}
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
              name="dumbbell"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.emptyActionText}>בואו נתחיל לאמן!</Text>
          </Animated.View>
        </View>
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
        keyExtractor={(item, index) =>
          `${item.id}_${index}_${item.feedback.completedAt}`
        }
        onEndReached={loadMoreWorkouts}
        onEndReachedThreshold={0.3}
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
                <Text style={styles.sectionTitle}>היסטוריית אימונים</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {workouts.length}/{allWorkouts.length}
                  </Text>
                </View>
              </View>
              {hasMoreData && (
                <Text style={styles.loadMoreHint}>
                  גלול למטה לראות עוד אימונים
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyHint: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textTertiary,
    textAlign: "center",
    marginTop: theme.spacing.md,
    fontStyle: "italic",
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
