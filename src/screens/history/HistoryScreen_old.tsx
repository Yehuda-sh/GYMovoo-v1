/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - עם תמיכה במשוב
 * @brief Workout history screen - with feedback support
 * @dependencies React Native, theme, workoutHistoryService
 * @notes מסך מעודכן עם תצוגת היסטוריה אמיתית
 * @notes Updated screen with real history display
 */

import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { workoutHistoryService, WorkoutWithFeedback } from "../../services/workoutHistoryService";

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    averageDifficulty: 0,
    workoutStreak: 0,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const [historyData, statsData] = await Promise.all([
        workoutHistoryService.getWorkoutHistory(),
        workoutHistoryService.getWorkoutStatistics(),
      ]);
      setWorkouts(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDifficultyStars = (difficulty: number) => {
    return '⭐'.repeat(difficulty);
  };

  const getFeelingEmoji = (feeling: string) => {
    const emojiMap: { [key: string]: string } = {
      challenging: "😤",
      strong: "💪",
      enjoyable: "😊",
      easy: "😴",
    };
    return emojiMap[feeling] || "😐";
  };

  const renderWorkoutItem = ({ item }: { item: WorkoutWithFeedback }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.workout.name || "אימון"}</Text>
        <Text style={styles.workoutDate}>{formatDate(item.feedback.completedAt)}</Text>
      </View>
      
      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.statText}>{item.stats.duration} דק'</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="dumbbell" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.statText}>{item.workout.exercises.length} תרגילים</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.statText}>{item.stats.totalSets}/{item.stats.totalPlannedSets} סטים</Text>
        </View>
      </View>

      <View style={styles.workoutFeedback}>
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>קושי:</Text>
          <Text style={styles.feedbackValue}>{getDifficultyStars(item.feedback.difficulty)}</Text>
        </View>
        
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackLabel}>הרגשה:</Text>
          <Text style={styles.feedbackValue}>{getFeelingEmoji(item.feedback.feeling)}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={50} color={theme.colors.primary} />
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
      {/* סטטיסטיקות כלליות */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>הסטטיסטיקות שלך</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="trophy" size={24} color={theme.colors.warning} />
            <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>אימונים</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={24} color={theme.colors.accent} />
            <Text style={styles.statNumber}>{stats.workoutStreak}</Text>
            <Text style={styles.statLabel}>רצף ימים</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock" size={24} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{Math.round(stats.totalDuration / 60)}h</Text>
            <Text style={styles.statLabel}>זמן כולל</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star" size={24} color={theme.colors.success} />
            <Text style={styles.statNumber}>{stats.averageDifficulty.toFixed(1)}</Text>
            <Text style={styles.statLabel}>קושי ממוצע</Text>
          </View>
        </View>
      </View>

      {/* רשימת אימונים */}
      <Text style={styles.sectionTitle}>היסטוריית אימונים</Text>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id}
        style={styles.workoutsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="history"
          size={80}
          color={theme.colors.primary}
        />
        <Text style={styles.title}>היסטוריית אימונים</Text>
        <Text style={styles.subtitle}>
          כאן תוכל לראות את כל האימונים שביצעת
        </Text>
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
  statsSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.small,
  },
  statNumber: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  workoutsList: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  workoutName: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
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
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
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
});
