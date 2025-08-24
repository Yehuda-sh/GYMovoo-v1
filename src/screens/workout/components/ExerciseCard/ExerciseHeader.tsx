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
} from "../../../../constants/sharedConstants";
import { ErrorBoundary } from "../../../../components/common/ErrorBoundary";
import { logger } from "../../../../utils/logger";
import { useAccessibilityAnnouncements } from "../../../../hooks/useAccessibilityAnnouncements";

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
    // Accessibility announcements
    const { announceSuccess, announceInfo } = useAccessibilityAnnouncements();

    // Safe sets validation
    const safeSets = useMemo(() => sets || [], [sets]);

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
        try {
          if (Platform.OS === "ios") {
            triggerVibration(CONSTANTS.VIBRATION_TYPE);
          }

          logger.debug("ExerciseHeader", "Title pressed", {
            exerciseName: exercise.name,
            exerciseId: exercise.id,
            isCompleted,
            completedSets,
            totalSets: safeSets.length,
          });

          announceInfo(`עובר לתרגיל ${exercise.name}`);
          onTitlePress();
        } catch (error) {
          logger.error("ExerciseHeader", "Error in title press", {
            error: error instanceof Error ? error.message : String(error),
            exerciseName: exercise.name,
          });
        }
      }
    }, [
      onTitlePress,
      exercise.name,
      exercise.id,
      isCompleted,
      completedSets,
      safeSets.length,
      announceInfo,
    ]);

    // Handle edit mode toggle with announcements
    const handleToggleEditMode = useCallback(() => {
      try {
        logger.debug("ExerciseHeader", "Edit mode toggled", {
          exerciseName: exercise.name,
          wasEditMode: isEditMode,
          newEditMode: !isEditMode,
        });

        const message = isEditMode
          ? `יצאת ממצב עריכה של ${exercise.name}`
          : `נכנסת למצב עריכה של ${exercise.name}`;
        announceInfo(message);

        onToggleEditMode();
      } catch (error) {
        logger.error("ExerciseHeader", "Error toggling edit mode", {
          error: error instanceof Error ? error.message : String(error),
          exerciseName: exercise.name,
        });
      }
    }, [onToggleEditMode, isEditMode, exercise.name, announceInfo]);

    // Handle expansion toggle with announcements
    const handleToggleExpanded = useCallback(() => {
      if (!isEditMode) {
        try {
          logger.debug("ExerciseHeader", "Expansion toggled", {
            exerciseName: exercise.name,
            wasExpanded: isExpanded,
            newExpanded: !isExpanded,
          });

          const message = isExpanded
            ? `כרטיס ${exercise.name} נקפל`
            : `כרטיס ${exercise.name} נפתח`;
          announceInfo(message);

          onToggleExpanded();
        } catch (error) {
          logger.error("ExerciseHeader", "Error toggling expansion", {
            error: error instanceof Error ? error.message : String(error),
            exerciseName: exercise.name,
          });
        }
      }
    }, [onToggleExpanded, isEditMode, isExpanded, exercise.name, announceInfo]);

    // Effect for announcing completion
    React.useEffect(() => {
      if (
        isCompleted &&
        completedSets === safeSets.length &&
        completedSets > 0
      ) {
        announceSuccess(`תרגיל ${exercise.name} הושלם בהצלחה!`);
        logger.info("ExerciseHeader", "Exercise completed", {
          exerciseName: exercise.name,
          completedSets,
          totalSets: safeSets.length,
          totalVolume,
          totalReps,
        });
      }
    }, [
      isCompleted,
      completedSets,
      safeSets.length,
      exercise.name,
      totalVolume,
      totalReps,
      announceSuccess,
    ]);

    const accessibilityLabel = useMemo(() => {
      if (isEditMode) return CONSTANTS.ACCESSIBILITY.EDIT_MODE_DISABLED;
      return isExpanded
        ? CONSTANTS.ACCESSIBILITY.COLLAPSE_CARD
        : CONSTANTS.ACCESSIBILITY.EXPAND_CARD;
    }, [isEditMode, isExpanded]);

    return (
      <ErrorBoundary fallbackMessage="שגיאה בכותרת התרגיל">
        <TouchableOpacity
          style={[
            styles.header,
            isCompleted && styles.headerCompleted,
            isEditMode && styles.headerEditMode,
          ]}
          onPress={handleToggleExpanded}
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
                    name="checkbox-marked-circle-outline"
                    size={CONSTANTS.ICON_SIZES.STATS}
                    color={
                      completedSets === safeSets.length
                        ? theme.colors.success
                        : theme.colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.statText,
                      completedSets === safeSets.length && {
                        color: theme.colors.success,
                      },
                    ]}
                  >
                    {completedSets}/{safeSets.length} סטים
                  </Text>
                </View>

                {totalVolume > 0 && (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons
                      name="weight-kilogram"
                      size={CONSTANTS.ICON_SIZES.STATS}
                      color={theme.colors.warning}
                    />
                    <Text
                      style={[styles.statText, { color: theme.colors.warning }]}
                    >
                      {totalVolume} ק״ג
                    </Text>
                  </View>
                )}

                {totalReps > 0 && (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons
                      name="repeat"
                      size={CONSTANTS.ICON_SIZES.STATS}
                      color={theme.colors.success}
                    />
                    <Text
                      style={[styles.statText, { color: theme.colors.success }]}
                    >
                      {totalReps} חזרות
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.menuButton,
                  isEditMode && styles.menuButtonActive,
                ]}
                onPress={handleToggleEditMode}
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
          {safeSets.length > 0 && (
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
                    safeSets.length
                  ),
                }}
                style={styles.visuallyHidden}
              />
            </View>
          )}
        </TouchableOpacity>
      </ErrorBoundary>
    );
  }
);

ExerciseHeader.displayName = "ExerciseHeader";

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginVertical: theme.spacing.xs,
    ...theme.shadows.small,
  },
  headerCompleted: {
    backgroundColor: theme.colors.success + "10",
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  headerEditMode: {
    backgroundColor: theme.colors.warning + "10",
    borderColor: theme.colors.warning,
    borderWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  exerciseInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  equipmentIcon: {
    marginRight: theme.spacing.sm,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  exerciseNameClickable: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  focusIcon: {
    marginLeft: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  equipmentLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
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
    marginVertical: theme.spacing.xs,
    height: 6,
    backgroundColor: theme.colors.border + "30",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBackground: {
    height: "100%",
    backgroundColor: theme.colors.border + "30",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.success,
    borderRadius: 3,
  },
  visuallyHidden: {
    position: "absolute",
    left: -10000,
    top: -10000,
    width: 1,
    height: 1,
    opacity: 0,
  },
});

export default ExerciseHeader;
