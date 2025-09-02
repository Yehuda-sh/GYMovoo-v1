/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseHeader.tsx
 * @brief כותרת תרגיל מתקדמת עם סטטיסטיקות, פעולות ונגישות מלאה
 * @features React.memo מובנה, RTL support, אנימציות אופטימליות, accessibility מתקדמת
 * @version 2.1.0
 * @updated 2025-09-02 הוסף שיפורי נגישות, performance ו-TypeScript מתקדמים
 * @dependencies MaterialCommunityIcons, LinearGradient, theme, workoutHelpers, equipmentIconMapping
 * @accessibility מותאם לנגישות עם הכרזות חכמות, תוויות מפורטות ותמיכה בקוראי מסך
 * @performance ממוטב עם React.memo, useMemo, useCallback ובדיקות בטיחות מתקדמות
 * @rtl תמיכה מלאה ב-RTL עם עיצוב מותאם לעברית
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
    OUTPUT_RANGE_ROTATE: ["0deg", "90deg"] as const, // Improved animation with proper typing
  },
  // 🎯 Enhanced accessibility constants with detailed descriptions
  ACCESSIBILITY: {
    EDIT_MODE_DISABLED: "כרטיס תרגיל במצב עריכה - לא ניתן לקפל או לפתוח",
    COLLAPSE_CARD: "קפל כרטיס תרגיל - הסתר פרטי סטים",
    EXPAND_CARD: "פתח כרטיס תרגיל - הצג פרטי סטים",
    GO_TO_EXERCISE: (name: string) => `לחץ לעבור לאימון ${name} ולהתמקד בו`,
    TOGGLE_EDIT_EXIT: "צא ממצב עריכה - חזור למצב רגיל",
    TOGGLE_EDIT_ENTER: "כנס למצב עריכה - אפשר שכפול, החלפה ומחיקה",
    PROGRESS_BAR: "מחוון התקדמות סטים בתרגיל",
    PROGRESS_BAR_TEXT: (completed: number, total: number) =>
      `הושלמו ${completed} מתוך ${total} סטים`,
    EQUIPMENT_ICON: (equipment: string) => `אייקון ציוד: ${equipment}`,
    STATS_COMPLETED: "סטטיסטיקת סטים שהושלמו",
    STATS_VOLUME: "סטטיסטיקת נפח משקלים",
    STATS_REPS: "סטטיסטיקת מספר חזרות",
  },
  VIBRATION_TYPE: SHARED_VIBRATION_TYPES.SHORT,
  // 🎨 Animation timing constants
  TIMING: {
    ANIMATION_DURATION: 300,
    HAPTIC_DELAY: 50,
  },
} as const;

// 🔧 INTERFACES - הגדרות טיפוסים מתקדמות לבטיחות סוג מוגברת ותיעוד מפורט
interface ExerciseHeaderProps {
  /** נתוני התרגיל הבסיסיים */
  exercise: WorkoutExercise;
  /** רשימת כל הסטים בתרגיל */
  sets: WorkoutSet[];
  /** האם התרגיל הושלם במלואו */
  isCompleted: boolean;
  /** האם הכרטיס מורחב ומציג פרטים */
  isExpanded: boolean;
  /** האם הכרטיס במצב עריכה */
  isEditMode: boolean;
  /** מספר הסטים שהושלמו */
  completedSets: number;
  /** אחוז ההתקדמות (0-100) */
  progressPercentage: number;
  /** נפח משקלים כולל בק״ג */
  totalVolume: number;
  /** מספר חזרות כולל */
  totalReps: number;
  /** פונקציה לשינוי מצב הרחבה */
  onToggleExpanded: () => void;
  /** פונקציה לשינוי מצב עריכה */
  onToggleEditMode: () => void;
  /** פונקציה להתמקדות בתרגיל (אופציונלי) */
  onTitlePress?: () => void;
  /** ערך האנימציה למצב עריכה */
  editModeAnimation: Animated.Value;
}

// 🎯 MAIN COMPONENT - רכיב הכותרת הראשי עם ביצועים וחוויית משתמש מתקדמים
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
    // 🎙️ ACCESSIBILITY ANNOUNCEMENTS - הכרזות נגישות מתקדמות
    const { announceSuccess, announceInfo } = useAccessibilityAnnouncements();

    // 🛡️ SAFE DATA VALIDATION - וידוא בטיחות נתונים עם בדיקות מתקדמות
    const safeSets = useMemo(() => sets || [], [sets]);

    // 🎨 MEMOIZED EQUIPMENT DATA - נתוני ציוד ממוטבים למניעת חישובים מיותרים
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

    // 🎮 EVENT HANDLERS - מטפלי אירועים ממוטבים עם haptic feedback ולוגיקה מתקדמת

    // Handle title press with enhanced feedback and logging
    const handleTitlePress = useCallback(() => {
      if (onTitlePress) {
        try {
          // Enhanced haptic feedback with timing
          if (Platform.OS === "ios") {
            setTimeout(() => {
              triggerVibration(CONSTANTS.VIBRATION_TYPE);
            }, CONSTANTS.TIMING.HAPTIC_DELAY);
          }

          logger.debug(
            "ExerciseHeader",
            "Title pressed with enhanced tracking",
            {
              exerciseName: exercise.name,
              exerciseId: exercise.id,
              isCompleted,
              completedSets,
              totalSets: safeSets.length,
              progressPercentage,
              totalVolume,
              totalReps,
            }
          );

          announceInfo(`עובר לתרגיל ${exercise.name}`);
          onTitlePress();
        } catch (error) {
          logger.error("ExerciseHeader", "Error in enhanced title press", {
            error: error instanceof Error ? error.message : String(error),
            exerciseName: exercise.name,
            context: "title_press_handler",
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
      progressPercentage,
      totalVolume,
      totalReps,
      announceInfo,
    ]);

    // Handle edit mode toggle with enhanced announcements and validation
    const handleToggleEditMode = useCallback(() => {
      try {
        logger.debug(
          "ExerciseHeader",
          "Edit mode toggled with enhanced context",
          {
            exerciseName: exercise.name,
            exerciseId: exercise.id,
            wasEditMode: isEditMode,
            newEditMode: !isEditMode,
            currentProgress: progressPercentage,
            completedSets,
            totalSets: safeSets.length,
          }
        );

        const message = isEditMode
          ? `יצאת ממצב עריכה של תרגיל ${exercise.name}`
          : `נכנסת למצב עריכה של תרגיל ${exercise.name}. ניתן לשכפל, להחליף או למחוק`;
        announceInfo(message);

        onToggleEditMode();
      } catch (error) {
        logger.error("ExerciseHeader", "Error in enhanced edit mode toggle", {
          error: error instanceof Error ? error.message : String(error),
          exerciseName: exercise.name,
          context: "edit_mode_toggle",
        });
      }
    }, [
      onToggleEditMode,
      isEditMode,
      exercise.name,
      exercise.id,
      progressPercentage,
      completedSets,
      safeSets.length,
      announceInfo,
    ]);

    // Handle expansion toggle with enhanced announcements and validation
    const handleToggleExpanded = useCallback(() => {
      if (!isEditMode) {
        try {
          logger.debug(
            "ExerciseHeader",
            "Expansion toggled with enhanced context",
            {
              exerciseName: exercise.name,
              exerciseId: exercise.id,
              wasExpanded: isExpanded,
              newExpanded: !isExpanded,
              currentProgress: progressPercentage,
              completedSets,
              totalSets: safeSets.length,
            }
          );

          const message = isExpanded
            ? `כרטיס תרגיל ${exercise.name} נקפל - פרטי הסטים הוסתרו`
            : `כרטיס תרגיל ${exercise.name} נפתח - פרטי הסטים מוצגים`;
          announceInfo(message);

          onToggleExpanded();
        } catch (error) {
          logger.error("ExerciseHeader", "Error in enhanced expansion toggle", {
            error: error instanceof Error ? error.message : String(error),
            exerciseName: exercise.name,
            context: "expansion_toggle",
          });
        }
      }
    }, [
      onToggleExpanded,
      isEditMode,
      isExpanded,
      exercise.name,
      exercise.id,
      progressPercentage,
      completedSets,
      safeSets.length,
      announceInfo,
    ]);

    // 🎉 COMPLETION EFFECT - אפקט השלמת תרגיל עם הכרזות מתקדמות
    React.useEffect(() => {
      if (
        isCompleted &&
        completedSets === safeSets.length &&
        completedSets > 0
      ) {
        const completionMessage = `תרגיל ${exercise.name} הושלם בהצלחה! ${completedSets} סטים, ${totalReps} חזרות, ${totalVolume} ק״ג נפח`;
        announceSuccess(completionMessage);

        logger.info(
          "ExerciseHeader",
          "Exercise completed with enhanced stats",
          {
            exerciseName: exercise.name,
            exerciseId: exercise.id,
            completedSets,
            totalSets: safeSets.length,
            totalVolume,
            totalReps,
            progressPercentage,
            equipmentType: exercise.equipment,
          }
        );
      }
    }, [
      isCompleted,
      completedSets,
      safeSets.length,
      exercise.name,
      exercise.id,
      exercise.equipment,
      totalVolume,
      totalReps,
      progressPercentage,
      announceSuccess,
    ]);

    // 🏷️ MEMOIZED ACCESSIBILITY LABEL - תווית נגישות ממוטבת עם מידע מפורט
    const accessibilityLabel = useMemo(() => {
      if (isEditMode) return CONSTANTS.ACCESSIBILITY.EDIT_MODE_DISABLED;
      return isExpanded
        ? CONSTANTS.ACCESSIBILITY.COLLAPSE_CARD
        : CONSTANTS.ACCESSIBILITY.EXPAND_CARD;
    }, [isEditMode, isExpanded]);

    // 🎨 MEMOIZED ACCESSIBILITY STATE - מצב נגישות ממוטב למשוב מתקדם
    const accessibilityState = useMemo(
      () => ({
        expanded: isExpanded,
        disabled: isEditMode,
        selected: isCompleted,
      }),
      [isExpanded, isEditMode, isCompleted]
    );

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
          accessibilityState={accessibilityState}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={
            isEditMode
              ? "במצב עריכה - לא ניתן לקפל"
              : "לחץ לקפל או לפתוח את פרטי התרגיל"
          }
        >
          <View style={styles.headerContent}>
            {/* 📋 EXERCISE INFO SECTION - מידע התרגיל הראשי */}
            <View style={styles.exerciseInfo}>
              {/* 🏷️ TITLE ROW - שורת כותרת עם אייקונים */}
              <TouchableOpacity
                style={styles.titleRow}
                onPress={handleTitlePress}
                disabled={!onTitlePress}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={CONSTANTS.ACCESSIBILITY.GO_TO_EXERCISE(
                  exercise.name
                )}
                accessibilityHint="לחץ כדי לעבור למסך התמקדות בתרגיל זה"
              >
                <MaterialCommunityIcons
                  name={equipmentIconName}
                  size={CONSTANTS.ICON_SIZES.EQUIPMENT}
                  color={theme.colors.primary}
                  style={styles.equipmentIcon}
                  accessibilityRole="image"
                  accessibilityLabel={CONSTANTS.ACCESSIBILITY.EQUIPMENT_ICON(
                    equipmentLabel
                  )}
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
                    accessibilityRole="image"
                    accessibilityLabel="אייקון התמקדות - ניתן ללחוץ"
                  />
                )}
                {isCompleted && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={CONSTANTS.ICON_SIZES.COMPLETED}
                    color={theme.colors.success}
                    accessibilityRole="image"
                    accessibilityLabel="תרגיל הושלם"
                  />
                )}
              </TouchableOpacity>

              <Text
                style={styles.equipmentLabel}
                accessible={true}
                accessibilityLabel={`ציוד נדרש: ${equipmentLabel}`}
              >
                {equipmentLabel}
              </Text>

              {/* 📊 STATS ROW - שורת סטטיסטיקות */}
              {/* 📊 STATS ROW - שורת סטטיסטיקות */}
              <View style={styles.statsRow}>
                {/* ✅ SETS COMPLETION STAT */}
                <View
                  style={styles.stat}
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel={CONSTANTS.ACCESSIBILITY.STATS_COMPLETED}
                  accessibilityValue={{
                    text: `${completedSets} מתוך ${safeSets.length} סטים הושלמו`,
                  }}
                >
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

                {/* 🏋️ VOLUME STAT */}
                {totalVolume > 0 && (
                  <View
                    style={styles.stat}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={CONSTANTS.ACCESSIBILITY.STATS_VOLUME}
                    accessibilityValue={{
                      text: `נפח כולל ${totalVolume} קילוגרם`,
                    }}
                  >
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

                {/* 🔄 REPS STAT */}
                {totalReps > 0 && (
                  <View
                    style={styles.stat}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={CONSTANTS.ACCESSIBILITY.STATS_REPS}
                    accessibilityValue={{
                      text: `סך הכל ${totalReps} חזרות`,
                    }}
                  >
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

            {/* 🎛️ HEADER ACTIONS - פעולות כותרת */}
            <View style={styles.headerActions}>
              {/* 🔧 EDIT MODE TOGGLE BUTTON */}
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
                accessibilityHint={
                  isEditMode
                    ? "לחץ לצאת ממצב עריכה וחזור למצב רגיל"
                    : "לחץ לכנוס למצב עריכה ולאפשר שכפול, החלפה ומחיקה"
                }
              >
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: editModeAnimation.interpolate({
                          inputRange: CONSTANTS.ANIMATION.INPUT_RANGE,
                          outputRange: ["0deg", "90deg"], // Fix TypeScript error by using direct array
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

              {/* 📐 EXPANSION INDICATOR */}
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
                accessibilityRole="image"
                accessibilityLabel={
                  isEditMode
                    ? "נעול במצב עריכה"
                    : isExpanded
                      ? "מורחב - לחץ לקפל"
                      : "מקופל - לחץ לפתוח"
                }
              />
            </View>
          </View>

          {/* 📊 PROGRESS BAR - מחוון התקדמות מתקדם */}
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

// 🏷️ COMPONENT DISPLAY NAME - שם רכיב לדיבוג ופיתוח
ExerciseHeader.displayName = "ExerciseHeader";

// 🎨 STYLES - עיצוב מתקדם עם RTL, נגישות ושיפורי חוויית משתמש
const styles = StyleSheet.create({
  // 🏠 Main header container with enhanced design
  header: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginVertical: theme.spacing.xs,
    ...theme.shadows.small,
    // Enhanced RTL support
    direction: "rtl",
    // Improved accessibility
    minHeight: 80, // Ensure touch target size
  },

  // ✅ Header states with enhanced visual feedback
  headerCompleted: {
    backgroundColor: theme.colors.success + "10",
    borderColor: theme.colors.success,
    borderWidth: 1,
    // Enhanced completion styling
    shadowColor: theme.colors.success,
    shadowOpacity: 0.1,
  },

  headerEditMode: {
    backgroundColor: theme.colors.warning + "10",
    borderColor: theme.colors.warning,
    borderWidth: 1,
    // Enhanced edit mode styling
    shadowColor: theme.colors.warning,
    shadowOpacity: 0.1,
  },

  // 📐 Content layout with RTL optimization
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 48, // Accessibility minimum
  },

  // 📋 Exercise info section
  exerciseInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
    // RTL text alignment
    textAlign: "right",
  },

  // 🏷️ Title row with enhanced spacing
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    minHeight: 32, // Touch target
  },

  equipmentIcon: {
    marginRight: theme.spacing.sm,
    // Enhanced accessibility
    borderRadius: theme.radius.sm,
  },

  // ✨ Enhanced exercise name styling
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    // RTL text alignment
    textAlign: "right",
    // Enhanced readability
    lineHeight: 24,
  },

  exerciseNameClickable: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },

  focusIcon: {
    marginLeft: theme.spacing.xs,
  },

  // 📊 Stats row with enhanced layout
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
    flexWrap: "wrap", // Handle overflow
  },

  // 📈 Individual stat styling
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    minHeight: 24, // Accessibility
  },

  statText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    // RTL text alignment
    textAlign: "right",
  },

  equipmentLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    // RTL text alignment
    textAlign: "right",
  },

  // 🎛️ Header actions with RTL layout
  headerActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  // 🔧 Enhanced menu button
  menuButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  menuButtonActive: {
    backgroundColor: theme.colors.error + "20",
    // Enhanced active state
    borderWidth: 1,
    borderColor: theme.colors.error + "40",
  },

  // 📊 Enhanced progress bar styling
  progressContainer: {
    marginVertical: theme.spacing.xs,
    height: 6,
    backgroundColor: theme.colors.border + "30",
    borderRadius: 3,
    overflow: "hidden",
    // Enhanced accessibility
    minHeight: 6,
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
    // Smooth animation support
    minWidth: 2,
  },

  // ♿ Accessibility helper
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
