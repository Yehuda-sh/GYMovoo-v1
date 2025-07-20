/**
 * @file src/screens/workout/components/ExerciseCard/SetRow.tsx
 * @description שורת סט בודדת עם שדות קלט והמלצות AI
 * English: Single set row with inputs and AI recommendations
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { WorkoutSet, WorkoutExercise } from "../../types/workout.types";
import { RPE_SCALE } from "../../utils/workoutConstants";

interface SetRowProps {
  set: WorkoutSet;
  setNumber: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  exercise: WorkoutExercise;
}

const SetRow: React.FC<SetRowProps> = ({
  set,
  setNumber,
  onUpdate,
  onDelete,
  onComplete,
  onLongPress,
  isActive,
  exercise,
}) => {
  const [showRPE, setShowRPE] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const prAnim = useRef(new Animated.Value(0)).current;

  // בדיקת שיא אישי
  // Check for personal record
  useEffect(() => {
    if (set.completed && set.weight && set.reps) {
      const weight = parseFloat(set.weight);
      const reps = parseInt(set.reps);

      if (exercise.personalRecord) {
        const prWeight = exercise.personalRecord.weight;
        const prReps = exercise.personalRecord.reps;
        const currentTotal = weight * reps;
        const prTotal = prWeight * prReps;

        if (currentTotal > prTotal || (weight > prWeight && reps >= prReps)) {
          onUpdate({ isPR: true });
          // אנימציית שיא
          Animated.sequence([
            Animated.timing(prAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(prAnim, {
              toValue: 0,
              tension: 40,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    }
  }, [set.completed, set.weight, set.reps]);

  // אנימציית השלמה
  // Completion animation
  useEffect(() => {
    Animated.timing(checkAnim, {
      toValue: set.completed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [set.completed]);

  // אנימציית גרירה
  // Drag animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 0.95 : 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  // המלצת AI למשקל
  // AI weight recommendation
  const getWeightRecommendation = () => {
    if (!set.previousWeight || !set.previousReps) return null;

    const prevWeight = parseFloat(set.previousWeight);
    const prevReps = parseInt(set.previousReps);

    // לוגיקה פשוטה להמלצה
    if (prevReps >= 12) {
      return `💡 המלצה: ${(prevWeight + 2.5).toFixed(1)}ק"ג`;
    } else if (prevReps <= 6) {
      return `💡 המלצה: ${Math.max(prevWeight - 2.5, 0).toFixed(1)}ק"ג`;
    }

    return null;
  };

  // סוג הסט
  // Set type
  const getSetTypeColor = () => {
    switch (set.type) {
      case "warmup":
        return theme.colors.warning;
      case "dropset":
        return "#AF52DE"; // סט ירידה
      case "failure":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity onLongPress={onLongPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          set.completed && styles.completedContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* מספר סט */}
        {/* Set number */}
        <View
          style={[styles.setNumber, { backgroundColor: getSetTypeColor() }]}
        >
          <Text style={styles.setNumberText}>{setNumber}</Text>
          {set.type !== "normal" && (
            <Text style={styles.setTypeText}>
              {set.type === "warmup"
                ? "חימום"
                : set.type === "dropset"
                ? "ירידה"
                : set.type === "failure"
                ? "כישלון"
                : set.type}
            </Text>
          )}
        </View>

        {/* ביצוע קודם */}
        {/* Previous performance */}
        <View style={styles.previousContainer}>
          {set.previousWeight && set.previousReps ? (
            <Text style={styles.previousText}>
              {set.previousWeight} × {set.previousReps}
            </Text>
          ) : (
            <Text style={styles.previousEmpty}>-</Text>
          )}
        </View>

        {/* משקל */}
        {/* Weight */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, set.completed && styles.completedInput]}
            value={set.weight}
            onChangeText={(text) => onUpdate({ weight: text })}
            placeholder="0"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            editable={!set.completed}
            selectTextOnFocus
          />
          <Text style={styles.unit}>ק"ג</Text>
        </View>

        {/* חזרות */}
        {/* Reps */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, set.completed && styles.completedInput]}
            value={set.reps}
            onChangeText={(text) => onUpdate({ reps: text })}
            placeholder="0"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            editable={!set.completed}
            selectTextOnFocus
          />
        </View>

        {/* פעולות */}
        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onComplete} style={styles.checkButton}>
            <Animated.View
              style={{
                transform: [{ scale: checkAnim }],
                opacity: checkAnim,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={theme.colors.success}
              />
            </Animated.View>
            {!set.completed && (
              <View style={styles.emptyCheck}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={28}
                  color={theme.colors.textSecondary}
                />
              </View>
            )}
          </TouchableOpacity>

          {set.completed && (
            <TouchableOpacity onPress={() => setShowRPE(true)}>
              <MaterialCommunityIcons
                name="speedometer"
                size={24}
                color={
                  set.rpe ? theme.colors.primary : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          )}
        </View>

        {/* אינדיקציית שיא */}
        {/* PR indicator */}
        {set.isPR && (
          <Animated.View
            style={[
              styles.prBadge,
              {
                transform: [
                  {
                    scale: prAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.prText}>🏆 שיא!</Text>
          </Animated.View>
        )}

        {/* המלצת AI */}
        {/* AI recommendation */}
        {!set.completed && getWeightRecommendation() && (
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationText}>
              {getWeightRecommendation()}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* מודל RPE */}
      {/* RPE modal */}
      {showRPE && (
        <View style={styles.rpeContainer}>
          <Text style={styles.rpeTitle}>דרג את המאמץ:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {RPE_SCALE.map((rpe) => (
              <TouchableOpacity
                key={rpe.value}
                onPress={() => {
                  onUpdate({ rpe: rpe.value });
                  setShowRPE(false);
                }}
                style={[
                  styles.rpeOption,
                  { backgroundColor: rpe.color + "20" },
                  set.rpe === rpe.value && styles.rpeSelected,
                ]}
              >
                <Text style={[styles.rpeValue, { color: rpe.color }]}>
                  {rpe.value}
                </Text>
                <Text style={styles.rpeLabel}>{rpe.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  completedContainer: {
    backgroundColor: "rgba(52, 199, 89, 0.1)",
  },
  setNumber: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  setNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  setTypeText: {
    color: "#fff",
    fontSize: 9,
    position: "absolute",
    bottom: 2,
  },
  previousContainer: {
    flex: 1,
    alignItems: "center",
  },
  previousText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  previousEmpty: {
    fontSize: 14,
    color: theme.colors.divider,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  completedInput: {
    backgroundColor: "transparent",
    color: theme.colors.success,
  },
  unit: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 12,
  },
  checkButton: {
    position: "relative",
  },
  emptyCheck: {
    position: "absolute",
  },
  prBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: theme.colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  recommendationContainer: {
    position: "absolute",
    bottom: -20,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.primary + "10",
    padding: 4,
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 11,
    color: theme.colors.primary,
    textAlign: "center",
  },
  rpeContainer: {
    backgroundColor: theme.colors.card,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  rpeTitle: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  rpeOption: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 60,
    alignItems: "center",
  },
  rpeSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  rpeValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  rpeLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default SetRow;
