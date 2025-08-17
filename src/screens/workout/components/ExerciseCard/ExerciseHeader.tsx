/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseHeader.tsx
 * @brief כותרת תרגיל עם סטטיסטיקות ופעולות
 * @features React.memo מובנה, RTL support, אנימציות אופטימליות
 */

import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";
import {
  getEquipmentIcon,
  getEquipmentHebrewName,
} from "../../../../utils/equipmentIconMapping";
import { WorkoutExercise, Set as WorkoutSet } from "../../types/workout.types";

interface ExerciseHeaderProps {
  exercise: WorkoutExercise;
  sets: WorkoutSet[];
  isCompleted: boolean;
  isExpanded: boolean;
  isEditMode: boolean;
  completedSets: number;
  progressPercentage: number;
  totalVolume: number;
  totalReps: number;
  onToggleExpanded: () => void;
  onToggleEditMode: () => void;
  onTitlePress?: () => void;
  editModeAnimation: Animated.Value;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = React.memo(
  ({
    exercise,
    sets,
    isCompleted,
    isExpanded,
    isEditMode,
    completedSets,
    progressPercentage,
    totalVolume,
    totalReps,
    onToggleExpanded,
    onToggleEditMode,
    onTitlePress,
    editModeAnimation,
  }) => {
    // Memoized equipment data
    const equipmentIconName = useMemo(
      () =>
        getEquipmentIcon(
          exercise.equipment
        ) as keyof typeof MaterialCommunityIcons.glyphMap,
      [exercise.equipment]
    );

    const equipmentLabel = useMemo(
      () => getEquipmentHebrewName(exercise.equipment),
      [exercise.equipment]
    );

    // Handle title press with haptic feedback
    const handleTitlePress = useCallback(() => {
      if (onTitlePress) {
        if (Platform.OS === "ios") {
          triggerVibration("short");
        }
        onTitlePress();
      }
    }, [onTitlePress]);

    return (
      <TouchableOpacity
        style={[
          styles.header,
          isCompleted && styles.headerCompleted,
          isEditMode && styles.headerEditMode,
        ]}
        onPress={onToggleExpanded}
        activeOpacity={isEditMode ? 1 : 0.7}
        disabled={isEditMode}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded, disabled: isEditMode }}
        accessibilityLabel={
          isEditMode
            ? "כרטיס תרגיל במצב עריכה - לא ניתן לקפל"
            : isExpanded
              ? "קפל כרטיס תרגיל"
              : "פתח כרטיס תרגיל"
        }
      >
        <View style={styles.headerContent}>
          <View style={styles.exerciseInfo}>
            <TouchableOpacity
              style={styles.titleRow}
              onPress={handleTitlePress}
              disabled={!onTitlePress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`לחץ לעבור לאימון ${exercise.name}`}
            >
              <MaterialCommunityIcons
                name={equipmentIconName}
                size={20}
                color={theme.colors.primary}
                style={styles.equipmentIcon}
              />
              <Text
                style={[
                  styles.exerciseName,
                  onTitlePress && styles.exerciseNameClickable,
                ]}
              >
                {exercise.name}
              </Text>
              {onTitlePress && (
                <MaterialCommunityIcons
                  name="arrow-left-circle-outline"
                  size={16}
                  color={theme.colors.primary}
                  style={styles.focusIcon}
                />
              )}
              {isCompleted && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.success}
                />
              )}
            </TouchableOpacity>

            <Text style={styles.equipmentLabel}>{equipmentLabel}</Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.statText}>
                  {completedSets}/{sets.length} סטים
                </Text>
              </View>

              {totalVolume > 0 && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="weight"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.statText}>{totalVolume} ק״ג</Text>
                </View>
              )}

              {totalReps > 0 && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="repeat"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.statText}>{totalReps} חזרות</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.menuButton, isEditMode && styles.menuButtonActive]}
              onPress={onToggleEditMode}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={
                isEditMode ? "צא ממצב עריכה" : "כנס למצב עריכה"
              }
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: editModeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "0deg"],
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name={isEditMode ? "close" : "dots-vertical"}
                  size={24}
                  color={isEditMode ? theme.colors.error : theme.colors.text}
                />
              </Animated.View>
            </TouchableOpacity>

            <MaterialCommunityIcons
              name={
                isEditMode
                  ? "lock-outline"
                  : isExpanded
                    ? "chevron-up"
                    : "chevron-down"
              }
              size={24}
              color={
                isEditMode ? theme.colors.primary : theme.colors.textSecondary
              }
            />
          </View>
        </View>

        {/* Progress bar */}
        {sets.length > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <View
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel="התקדמות סטים"
              accessibilityValue={{
                now: Math.round(progressPercentage),
                min: 0,
                max: 100,
                text: `${completedSets} מתוך ${sets.length} סטים הושלמו`,
              }}
              style={styles.visuallyHidden}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

ExerciseHeader.displayName = "ExerciseHeader";

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerCompleted: {
    backgroundColor: theme.colors.success + "10",
  },
  headerEditMode: {
    backgroundColor: theme.colors.primary + "08",
    borderBottomColor: theme.colors.primary + "20",
  },
  headerContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  exerciseInfo: {
    flex: 1,
    marginStart: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  equipmentIcon: {
    marginEnd: theme.spacing.xs,
  },
  equipmentLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginStart: theme.spacing.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  exerciseNameClickable: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  focusIcon: {
    marginHorizontal: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  stat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  headerActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  menuButton: {
    padding: 4,
  },
  menuButtonActive: {
    padding: 4,
    backgroundColor: theme.colors.error + "20",
    borderRadius: 8,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBackground: {
    height: 4,
    backgroundColor: theme.colors.cardBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    borderWidth: 0,
    overflow: "hidden",
  },
});

export default ExerciseHeader;
