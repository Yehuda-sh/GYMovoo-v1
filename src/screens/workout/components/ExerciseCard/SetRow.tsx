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
import { Set, Exercise } from "../../types/workout.types";
import { RPE_SCALE } from "../../utils/workoutConstants";

interface SetRowProps {
  set: Set;
  setNumber: number;
  onUpdate: (updates: Partial<Set>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  exercise: Exercise;
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
      const weight = set.weight;
      const reps = set.reps;

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
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  // המלצת משקל AI
  // AI weight recommendation
  const getWeightRecommendation = () => {
    if (set.previousWeight && set.previousReps) {
      // לוגיקה פשוטה להמלצה
      if (set.previousReps >= 12) {
        return `המלצה: ${(set.previousWeight * 1.05).toFixed(1)} ק"ג`;
      }
    }
    return null;
  };

  // צבע לפי סוג סט
  // Color by set type
  const getSetTypeColor = () => {
    switch (set.type) {
      case "warmup":
        return theme.colors.warning;
      case "dropset":
        return theme.colors.secondary;
      case "failure":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  // תווית סוג סט
  // Set type label
  const getSetTypeLabel = () => {
    switch (set.type) {
      case "warmup":
        return "חימום";
      case "dropset":
        return "דרופ";
      case "failure":
        return "כישלון";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={1}
      disabled={isActive}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          set.completed && styles.completedContainer,
        ]}
      >
        {/* מספר סט */}
        {/* Set number */}
        <View
          style={[styles.setNumber, { backgroundColor: getSetTypeColor() }]}
        >
          <Text style={styles.setNumberText}>{setNumber}</Text>
          {set.type !== "working" && (
            <Text style={styles.setTypeText}>{getSetTypeLabel()}</Text>
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

        {/* קלט משקל */}
        {/* Weight input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, set.completed && styles.completedInput]}
            value={set.weight?.toString() || ""}
            onChangeText={(text) => onUpdate({ weight: parseFloat(text) || 0 })}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.colors.textSecondary}
            selectTextOnFocus
          />
          <Text style={styles.unit}>ק"ג</Text>
        </View>

        {/* קלט חזרות */}
        {/* Reps input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, set.completed && styles.completedInput]}
            value={set.reps?.toString() || ""}
            onChangeText={(text) => onUpdate({ reps: parseInt(text) || 0 })}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.colors.textSecondary}
            selectTextOnFocus
          />
        </View>

        {/* פעולות */}
        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onComplete} style={styles.checkButton}>
            <Ionicons
              name="checkmark-circle-outline"
              size={28}
              color={theme.colors.textSecondary}
              style={styles.emptyCheck}
            />
            <Animated.View
              style={{
                opacity: checkAnim,
                transform: [{ scale: checkAnim }],
                position: "absolute",
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={theme.colors.success}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        </View>

        {/* תג שיא אישי */}
        {/* Personal record badge */}
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
            <Text style={styles.prText}>שיא!</Text>
          </Animated.View>
        )}

        {/* המלצת AI */}
        {/* AI recommendation */}
        {getWeightRecommendation() && !set.completed && (
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationText}>
              {getWeightRecommendation()}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* בחירת RPE */}
      {/* RPE selection */}
      {showRPE && set.completed && (
        <View style={styles.rpeContainer}>
          <Text style={styles.rpeTitle}>דרג את הקושי (RPE)</Text>
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
