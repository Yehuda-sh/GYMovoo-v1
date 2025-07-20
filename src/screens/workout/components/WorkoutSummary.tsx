/**
 * @file src/screens/workout/components/WorkoutSummary.tsx
 * @description מסך סיכום אימון - הצגת סטטיסטיקות, הישגים ושיאים אישיים
 * English: Workout summary screen - display statistics, achievements and personal records
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { theme } from "../../../styles/theme";
import { WorkoutData, PersonalRecord } from "../types/workout.types";

interface WorkoutSummaryProps {
  workout: WorkoutData;
  onFinish: () => void;
  onSaveAsTemplate?: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workout,
  onFinish,
  onSaveAsTemplate,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // אנימציות כניסה
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // הסתרת קונפטי אחרי 3 שניות
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  }, []);

  // חישוב סטטיסטיקות
  // Calculate statistics
  const totalSets = workout.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((s) => s.completed).length,
    0
  );

  const totalReps = workout.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.reduce((sum, set) => sum + (set.reps || 0), 0),
    0
  );

  const totalVolume = workout.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
        0
      ),
    0
  );

  const personalRecords: PersonalRecord[] = workout.exercises.flatMap(
    (exercise) =>
      exercise.sets
        .filter((set) => set.isPersonalRecord)
        .map((set) => ({
          exerciseName: exercise.name,
          type: "weight" as const,
          value: set.weight || 0,
          previousValue: (set.weight || 0) - 5, // לדוגמה
          date: new Date().toISOString(),
        }))
  );

  // הישגים לדוגמה
  // Sample achievements
  const achievements: Achievement[] = [];

  if (personalRecords.length > 0) {
    achievements.push({
      id: "pr",
      title: "שובר שיאים!",
      description: `${personalRecords.length} שיאים אישיים חדשים`,
      icon: "trophy",
      color: theme.colors.warning,
    });
  }

  if (workout.duration && workout.duration > 3600) {
    achievements.push({
      id: "marathon",
      title: "מרתון!",
      description: "אימון של יותר משעה",
      icon: "clock",
      color: theme.colors.primary,
    });
  }

  if (totalVolume > 10000) {
    achievements.push({
      id: "heavy",
      title: "הרמת משאות!",
      description: "יותר מ-10 טון נפח כולל",
      icon: "weight-lifter",
      color: theme.colors.success,
    });
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `סיימתי אימון ${workout.name} 💪\n\n` +
          `⏱ זמן: ${formatDuration(workout.duration || 0)}\n` +
          `🏋️ סטים: ${totalSets}\n` +
          `🔄 חזרות: ${totalReps}\n` +
          `📊 נפח: ${(totalVolume / 1000).toFixed(1)} טון\n` +
          `${
            personalRecords.length > 0
              ? `🏆 ${personalRecords.length} שיאים חדשים!\n`
              : ""
          }\n` +
          `#GYMovoo #כושר #אימון`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* אפקט קונפטי */}
      {/* Confetti effect */}
      {showConfetti && personalRecords.length > 0 && (
        <LottieView
          source={require("../../../../assets/animations/confetti.json")}
          autoPlay
          loop={false}
          style={styles.confetti}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* כותרת */}
        {/* Title */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="check-circle"
            size={64}
            color={theme.colors.success}
          />
          <Text style={styles.title}>אימון הושלם!</Text>
          <Text style={styles.workoutName}>{workout.name}</Text>
        </View>

        {/* סטטיסטיקות ראשיות */}
        {/* Main statistics */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.statValue}>
              {formatDuration(workout.duration || 0)}
            </Text>
            <Text style={styles.statLabel}>זמן אימון</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="format-list-checks"
              size={24}
              color={theme.colors.accent}
            />
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>סטים</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="repeat"
              size={24}
              color={theme.colors.success}
            />
            <Text style={styles.statValue}>{totalReps}</Text>
            <Text style={styles.statLabel}>חזרות</Text>
          </View>

          <View style={styles.statCard}>
            <FontAwesome5
              name="weight"
              size={20}
              color={theme.colors.warning}
            />
            <Text style={styles.statValue}>
              {(totalVolume / 1000).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>טון</Text>
          </View>
        </View>

        {/* הישגים */}
        {/* Achievements */}
        {achievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>הישגים</Text>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.color + "20" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={achievement.icon as any}
                    size={24}
                    color={achievement.color}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* שיאים אישיים */}
        {/* Personal records */}
        {personalRecords.length > 0 && (
          <View style={styles.recordsSection}>
            <Text style={styles.sectionTitle}>שיאים אישיים חדשים</Text>
            {personalRecords.map((record, index) => (
              <View key={index} style={styles.recordCard}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={20}
                  color={theme.colors.warning}
                />
                <Text style={styles.recordText}>
                  {record.exerciseName}: {record.value} ק"ג
                </Text>
                <View style={styles.recordImprovement}>
                  <MaterialCommunityIcons
                    name="trending-up"
                    size={16}
                    color={theme.colors.success}
                  />
                  <Text style={styles.improvementText}>
                    +{(record.value - record.previousValue).toFixed(1)} ק"ג
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* סיכום תרגילים */}
        {/* Exercise summary */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>סיכום תרגילים</Text>
          {workout.exercises.map((exercise, index) => {
            const completedSets = exercise.sets.filter(
              (s) => s.completed
            ).length;
            const exerciseVolume = exercise.sets.reduce(
              (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
              0
            );

            return (
              <View key={index} style={styles.exerciseSummaryCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseStats}>
                  <Text style={styles.exerciseStat}>{completedSets} סטים</Text>
                  <Text style={styles.exerciseStat}>•</Text>
                  <Text style={styles.exerciseStat}>
                    {(exerciseVolume / 1000).toFixed(1)} טון
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* כפתורי פעולה */}
        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.secondaryButtonText}>שתף</Text>
          </TouchableOpacity>

          {onSaveAsTemplate && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onSaveAsTemplate}
            >
              <MaterialCommunityIcons
                name="content-save"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>שמור כתבנית</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={onFinish}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.finishButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.finishButtonText}>סיום</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  confetti: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 16,
  },
  workoutName: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: "50%",
    padding: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 8,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  recordsSection: {
    marginBottom: 24,
  },
  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.warning + "40",
  },
  recordText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  recordImprovement: {
    flexDirection: "row",
    alignItems: "center",
  },
  improvementText: {
    fontSize: 14,
    color: theme.colors.success,
    marginLeft: 4,
    fontWeight: "600",
  },
  exercisesSection: {
    marginBottom: 24,
  },
  exerciseSummaryCard: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  exerciseStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseStat: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginHorizontal: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
    fontWeight: "600",
  },
  finishButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
});
