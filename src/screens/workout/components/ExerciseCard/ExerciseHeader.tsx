/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseHeader.tsx
 * @brief כותרת תרגיל עם סטטיסטיקות ופעולות
 * @features React.memo מובנה, RTL support, אנימציות אופטימליות
 * @version 2.0.0
 * @updated 2025-08-18
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
import {
  SHARED_ICON_SIZES,
  SHARED_VIBRATION_TYPES,
  SHARED_ANIMATION,
  SHARED_ACCESSIBILITY,
} from "../../../../constants/sharedConstants";

// 🎨 CONSTANTS - ריכוז קבועים לשיפור קריאות, תחזוקתיות ועקביות
const CONSTANTS = {
  ICON_SIZES: {
    EQUIPMENT: SHARED_ICON_SIZES.EQUIPMENT,
    FOCUS: SHARED_ICON_SIZES.FOCUS,
    COMPLETED: SHARED_ICON_SIZES.COMPLETED,
    STATS: SHARED_ICON_SIZES.STATS,
    MENU: SHARED_ICON_SIZES.MENU,
    CHEVRON: SHARED_ICON_SIZES.CHEVRON,
  },
  ANIMATION: {
    INPUT_RANGE: SHARED_ANIMATION.INPUT_RANGE,
    OUTPUT_RANGE_ROTATE: ["0deg", "90deg"], // Improved animation
  },
  ACCESSIBILITY: {
    EDIT_MODE_DISABLED: "כרטיס תרגיל במצב עריכה - לא ניתן לקפל",
    COLLAPSE_CARD: "קפל כרטיס תרגיל",
    EXPAND_CARD: "פתח כרטיס תרגיל",
    GO_TO_EXERCISE: (name: string) => `לחץ לעבור לאימון ${name}`,
    TOGGLE_EDIT_EXIT: "צא ממצב עריכה",
    TOGGLE_EDIT_ENTER: "כנס למצב עריכה",
    PROGRESS_BAR: "התקדמות סטים",
    PROGRESS_BAR_TEXT: (completed: number, total: number) =>
      `${completed} מתוך ${total} סטים הושלמו`,
  },
  VIBRATION_TYPE: SHARED_VIBRATION_TYPES.SHORT,
};

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

// Component
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
          triggerVibration(CONSTANTS.VIBRATION_TYPE);
        }
        onTitlePress();
      }
    }, [onTitlePress]);

    const accessibilityLabel = useMemo(() => {
      if (isEditMode) return CONSTANTS.ACCESSIBILITY.EDIT_MODE_DISABLED;
      return isExpanded
        ? CONSTANTS.ACCESSIBILITY.COLLAPSE_CARD
        : CONSTANTS.ACCESSIBILITY.EXPAND_CARD;
    }, [isEditMode, isExpanded]);

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
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.headerContent}>
          <View style={styles.exerciseInfo}>
            <TouchableOpacity
              style={styles.titleRow}
              onPress={handleTitlePress}
              disabled={!onTitlePress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={CONSTANTS.ACCESSIBILITY.GO_TO_EXERCISE(
                exercise.name
              )}
            >
              <MaterialCommunityIcons
                name={equipmentIconName}
                size={CONSTANTS.ICON_SIZES.EQUIPMENT}
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
                  size={CONSTANTS.ICON_SIZES.FOCUS}
                  color={theme.colors.primary}
                  style={styles.focusIcon}
                />
              )}
              {isCompleted && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={CONSTANTS.ICON_SIZES.COMPLETED}
                  color={theme.colors.success}
                />
              )}
            </TouchableOpacity>

            <Text style={styles.equipmentLabel}>{equipmentLabel}</Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={CONSTANTS.ICON_SIZES.STATS}
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
                    size={CONSTANTS.ICON_SIZES.STATS}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.statText}>{totalVolume} ק״ג</Text>
                </View>
              )}

              {totalReps > 0 && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="repeat"
                    size={CONSTANTS.ICON_SIZES.STATS}
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
                isEditMode
                  ? CONSTANTS.ACCESSIBILITY.TOGGLE_EDIT_EXIT
                  : CONSTANTS.ACCESSIBILITY.TOGGLE_EDIT_ENTER
              }
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: editModeAnimation.interpolate({
                        inputRange: CONSTANTS.ANIMATION.INPUT_RANGE,
                        outputRange: CONSTANTS.ANIMATION.OUTPUT_RANGE_ROTATE,
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name={isEditMode ? "close" : "dots-vertical"}
                  size={CONSTANTS.ICON_SIZES.MENU}
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
              size={CONSTANTS.ICON_SIZES.CHEVRON}
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
              accessibilityLabel={CONSTANTS.ACCESSIBILITY.PROGRESS_BAR}
              accessibilityValue={{
                now: Math.round(progressPercentage),
                min: 0,
                max: 100,
                text: CONSTANTS.ACCESSIBILITY.PROGRESS_BAR_TEXT(
                  completedSets,
                  sets.length
                ),
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
    // ... (existing styles)
  },
  headerCompleted: {
    // ... (existing styles)
  },
  headerEditMode: {
    // ... (existing styles)
  },
  headerContent: {
    // ... (existing styles)
  },
  exerciseInfo: {
    // ... (existing styles)
  },
  titleRow: {
    // ... (existing styles)
  },
  equipmentIcon: {
    // ... (existing styles)
  },
  exerciseName: {
    // ... (existing styles)
  },
  exerciseNameClickable: {
    // ... (existing styles)
  },
  focusIcon: {
    // ... (existing styles)
  },
  statsRow: {
    // ... (existing styles)
  },
  stat: {
    // ... (existing styles)
  },
  statText: {
    // ... (existing styles)
  },
  equipmentLabel: {
    // ... (existing styles)
  },
  headerActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  menuButton: {
    padding: 4,
    borderRadius: 8,
  },
  menuButtonActive: {
    backgroundColor: theme.colors.error + "20",
  },
  progressContainer: {
    // ... (existing styles)
  },
  progressBackground: {
    // ... (existing styles)
  },
  progressFill: {
    // ... (existing styles)
  },
  visuallyHidden: {
    // ... (existing styles)
  },
});

export default ExerciseHeader;
