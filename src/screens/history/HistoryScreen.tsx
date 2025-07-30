/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - עם תמיכה במשוב והתאמת מגדר
 * @brief Workout history screen - with feedback support and gender adaptation
 * @updated 2025-07-30 הוספת תמיכה בהתאמת מגדר ותכונות מתקדמות
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [congratulationMessage, setCongratulationMessage] = useState<
    string | null
  >(null);
  const { user } = useUserStore();

  useEffect(() => {
    loadHistory();
    loadStatistics();
    loadLatestCongratulation();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      console.log("📚 HistoryScreen - טוען היסטוריה מעודכנת");

      const historyData = await workoutHistoryService.getWorkoutHistory();
      console.log("📚 HistoryScreen - נמצאו", historyData.length, "אימונים");
      setWorkouts(historyData);
    } catch (error) {
      console.error("Error loading history:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את היסטוריית האימונים");
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await workoutHistoryService.getGenderGroupedStatistics();
      setStatistics(stats);
      console.log("📊 Statistics loaded:", stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
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
      loadHistory(),
      loadStatistics(),
      loadLatestCongratulation(),
    ]);
    setRefreshing(false);
  }, []);

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
      <View style={styles.statisticsCard}>
        <Text style={styles.statisticsTitle}>📊 סטטיסטיקות</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {statistics.total.totalWorkouts}
            </Text>
            <Text style={styles.statLabel}>סה"כ אימונים</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {Math.round(statistics.total.averageDifficulty * 10) / 10}
            </Text>
            <Text style={styles.statLabel}>קושי ממוצע</Text>
          </View>
          {currentGenderStats && currentGenderStats.count > 0 && (
            <View style={styles.statBox}>
              <MaterialCommunityIcons
                name={getGenderIcon(userGender)}
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.statNumber}>{currentGenderStats.count}</Text>
              <Text style={styles.statLabel}>האימונים שלי</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderCongratulationMessage = () => {
    if (!congratulationMessage) return null;

    return (
      <View style={styles.congratulationCard}>
        <MaterialCommunityIcons
          name="trophy"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.congratulationText}>{congratulationMessage}</Text>
      </View>
    );
  };

  const renderWorkoutItem = ({ item }: { item: WorkoutWithFeedback }) => {
    const userGender = item.metadata?.userGender;

    return (
      <View style={styles.workoutCard}>
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
              {item.workout.exercises.length} תרגילים
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
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons
            name="loading"
            size={50}
            color={theme.colors.primary}
          />
          <Text style={styles.loadingText}>טוען היסטוריה...</Text>
        </View>
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="history"
            size={80}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>אין עדיין אימונים שמורים</Text>
          <Text style={styles.emptySubtitle}>
            לאחר סיום אימון, לחץ על "שמור אימון ומשוב"
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* הודעת ברכה אחרונה */}
        {renderCongratulationMessage()}

        {/* סטטיסטיקות */}
        {renderStatistics()}

        {/* כותרת היסטוריה */}
        <Text style={styles.sectionTitle}>
          היסטוריית אימונים ({workouts.length})
        </Text>

        {/* רשימת אימונים */}
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
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
  congratulationCard: {
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  congratulationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  statisticsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  statisticsTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: "600",
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
    marginBottom: theme.spacing.md,
  },
  workoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  workoutHeader: {
    marginBottom: theme.spacing.md,
  },
  workoutTitleRow: {
    flexDirection: "row",
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  workoutFeedback: {
    flexDirection: "row",
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
  },
  feedbackValue: {
    fontSize: theme.typography.body.fontSize,
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
});
