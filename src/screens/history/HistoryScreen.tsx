import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmptyState } from "../../components";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { theme } from "../../core/theme";
import { useUserStore } from "../../stores/userStore";
import { dataManager } from "../../services/core";
import NextWorkoutCard from "../../components/workout/NextWorkoutCard";

interface WorkoutItem {
  id: string;
  workout: {
    name: string;
    exercises: unknown[];
  };
  feedback: {
    completedAt: string;
    difficulty: number;
    feeling: string;
    congratulationMessage?: string;
  };
  stats: {
    duration: number;
    totalSets: number;
    personalRecords: number;
  };
}

const HistoryScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserStore();
  const navigation = useNavigation();

  const loadData = async () => {
    try {
      if (!user) return;

      if (!dataManager.isReady()) {
        await dataManager.initialize(user);
      }

      const history = dataManager.getWorkoutHistory() || [];
      setWorkouts(history);
    } catch (error) {
      console.warn("Failed to load workout history:", error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      await dataManager.refresh(user);
      await loadData();
    } catch (error) {
      console.warn("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return "★".repeat(Math.max(1, Math.min(5, Math.round(difficulty))));
  };

  const getFeelingEmoji = (feeling: string) => {
    const feelings: { [key: string]: string } = {
      great: "😊",
      good: "🙂",
      okay: "😐",
      tired: "😴",
      hard: "😅",
    };
    return feelings[feeling] || "🙂";
  };

  const renderWorkoutItem = ({ item }: { item: WorkoutItem }) => {
    const workout = item.workout;
    const feedback = item.feedback;
    const stats = item.stats;

    return (
      <View style={styles.workoutCard}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutName}>{workout?.name || "אימון"}</Text>
          <View style={styles.dateTimeRow}>
            <Text style={styles.workoutDate}>
              {formatDate(feedback?.completedAt || "")}
            </Text>
            <Text style={styles.workoutTime}>
              {formatTime(feedback?.completedAt || "")}
            </Text>
          </View>
        </View>

        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>
              {Math.round((stats?.duration || 0) / 60)} דקות
            </Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>
              {workout?.exercises?.length || 0} תרגילים
            </Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.statText}>{stats?.totalSets || 0} סטים</Text>
          </View>

          {(stats?.personalRecords || 0) > 0 && (
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="trophy"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={[styles.statText, { color: theme.colors.primary }]}>
                {stats.personalRecords} שיאים
              </Text>
            </View>
          )}
        </View>

        <View style={styles.workoutFeedback}>
          <View style={styles.feedbackItem}>
            <Text style={styles.feedbackLabel}>קושי</Text>
            <Text style={styles.feedbackValue}>
              {getDifficultyStars(feedback?.difficulty || 3)}
            </Text>
          </View>

          <View style={styles.feedbackItem}>
            <Text style={styles.feedbackLabel}>תחושה</Text>
            <Text style={styles.feedbackValue}>
              {getFeelingEmoji(feedback?.feeling || "good")}
            </Text>
          </View>
        </View>

        {feedback?.congratulationMessage && (
          <View style={styles.congratulationCard}>
            <Text style={styles.congratulationText}>
              {feedback.congratulationMessage}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => {
    const totalWorkouts = workouts.length;
    const averageDifficulty =
      totalWorkouts > 0
        ? workouts.reduce((sum, w) => sum + (w.feedback?.difficulty || 3), 0) /
          totalWorkouts
        : 3;

    return (
      <View>
        {/* Statistics */}
        {totalWorkouts > 0 && (
          <View style={styles.statisticsCard}>
            <Text style={styles.statisticsTitle}>סטטיסטיקות</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalWorkouts}</Text>
                <Text style={styles.statLabel}>אימונים</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {averageDifficulty.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>קושי ממוצע</Text>
              </View>
            </View>
          </View>
        )}

        {/* Next Workout */}
        <NextWorkoutCard
          onStartWorkout={(workoutName, workoutIndex) => {
            (navigation as any).navigate("WorkoutPlans", {
              autoStart: true,
              requestedWorkoutName: workoutName,
              requestedWorkoutIndex: workoutIndex,
            });
          }}
        />

        {/* Section Title */}
        {totalWorkouts > 0 && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>היסטוריית אימונים</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{totalWorkouts}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" text="טוען היסטוריה..." />
        </View>
      </SafeAreaView>
    );
  }

  if (workouts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="time-outline"
            title="אין היסטוריית אימונים"
            description="התחל להתאמן כדי לראות את ההיסטוריה שלך כאן"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item, index) => item?.id || `workout_${index}`}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  statisticsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statisticsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  countBadge: {
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  countBadgeText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  workoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  workoutHeader: {
    marginBottom: theme.spacing.md,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  workoutTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  workoutStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "45%",
  },
  statText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  workoutFeedback: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  feedbackItem: {
    alignItems: "center",
  },
  feedbackLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  feedbackValue: {
    fontSize: 16,
  },
  congratulationCard: {
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRightWidth: 4,
    borderRightColor: theme.colors.primary,
  },
  congratulationText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontStyle: "italic",
    textAlign: "right",
  },
});

export default HistoryScreen;
