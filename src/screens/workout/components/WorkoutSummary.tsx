/**
 * @file WorkoutSummary.tsx
 * @description מסך סיכום אימון
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface Exercise {
  id?: string;
  name?: string;
  sets?: Set[];
}

interface Set {
  weight?: number;
  reps?: number;
  completed?: boolean;
}

interface Workout {
  id?: string;
  name?: string;
  exercises?: Exercise[];
  duration?: number;
}

interface WorkoutSummaryProps {
  workout: Workout;
  onClose: () => void;
  onSave: () => void;
  visible: boolean;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workout,
  onClose,
  onSave,
  visible,
}) => {
  const [difficulty, setDifficulty] = useState<number>(0);
  const [feeling, setFeeling] = useState<string>("");

  if (!visible) {
    return null;
  }

  // חישוב סטטיסטיקות בסיסיות
  const totalExercises = workout.exercises?.length || 0;
  const totalSets =
    workout.exercises?.reduce(
      (sum: number, ex: Exercise) => sum + (ex.sets?.length || 0),
      0
    ) || 0;
  const totalVolume =
    workout.exercises?.reduce(
      (sum: number, ex: Exercise) =>
        sum +
        (ex.sets?.reduce(
          (setSum: number, set: Set) =>
            setSum + (set.weight || 0) * (set.reps || 0),
          0
        ) || 0),
      0
    ) || 0;
  const duration = workout.duration || 0;

  const formatDuration = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}`
      : `${mins} דק'`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏋️ סיימתי אימון מדהים! 💪\n\n📊 הסטטיסטיקות:\n⏱️ משך: ${formatDuration(duration)}\n🔢 סטים: ${totalSets}\n⚖️ נפח: ${Math.round(totalVolume)} ק״ג\n\n#אימון #כושר #התקדמות`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const renderDifficultyStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setDifficulty(star)}
            style={styles.star}
          >
            <MaterialCommunityIcons
              name={difficulty >= star ? "star" : "star-outline"}
              size={24}
              color={
                difficulty >= star
                  ? theme.colors.warning
                  : theme.colors.textSecondary
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <MaterialCommunityIcons
              name="trophy"
              size={32}
              color={theme.colors.warning}
            />
            <Text style={styles.congratsText}>כל הכבוד! 🎉</Text>
            <Text style={styles.workoutName}>
              {workout.name || "אימון מהיר"}
            </Text>
          </View>

          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* סטטיסטיקות */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>{formatDuration(duration)}</Text>
              <Text style={styles.statLabel}>משך</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="format-list-numbered"
                size={20}
                color={theme.colors.success}
              />
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>סטים</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.statValue}>{Math.round(totalVolume)}</Text>
              <Text style={styles.statLabel}>נפח כולל</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={20}
                color={theme.colors.accent}
              />
              <Text style={styles.statValue}>{totalExercises}</Text>
              <Text style={styles.statLabel}>תרגילים</Text>
            </View>
          </View>

          {/* משוב */}
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>איך היה האימון?</Text>

            <View style={styles.difficultySection}>
              <Text style={styles.difficultyLabel}>רמת קושי:</Text>
              {renderDifficultyStars()}
            </View>

            <View style={styles.feelingSection}>
              <Text style={styles.feelingLabel}>איך הרגשת?</Text>
              <View style={styles.feelingButtons}>
                {["מעולה", "טוב", "בסדר", "קשה"].map((feel) => (
                  <TouchableOpacity
                    key={feel}
                    onPress={() => setFeeling(feel)}
                    style={[
                      styles.feelingButton,
                      feeling === feel && styles.feelingButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.feelingButtonText,
                        feeling === feel && styles.feelingButtonTextSelected,
                      ]}
                    >
                      {feel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* כפתורי פעולה */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
              <MaterialCommunityIcons name="check" size={20} color="white" />
              <Text style={styles.primaryButtonText}>סיים אימון</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  header: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  congratsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 8,
    textAlign: "center",
  },
  workoutName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  feedbackSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: 16,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  difficultySection: {
    marginBottom: theme.spacing.lg,
  },
  difficultyLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  star: {
    padding: 4,
  },
  feelingSection: {
    marginBottom: theme.spacing.sm,
  },
  feelingLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  feelingButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  feelingButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  feelingButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  feelingButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  feelingButtonTextSelected: {
    color: "white",
  },
  actionButtons: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default WorkoutSummary;
