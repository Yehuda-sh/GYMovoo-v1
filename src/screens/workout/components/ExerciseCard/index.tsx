/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @brief כרטיס תרגיל המציג סטים ופעולות עם מצב עריכה in-place
 * @dependencies SetRow, ExerciseMenu, useWorkoutStore, theme
 * @notes מכיל לוגיקת אנימציה לפתיחה וסגירה של כרטיס + מצב עריכה מתקדם
 * @features
 * - ✅ מצב עריכה In-Place: לחיצה על ... מעבירה למצב עריכה
 * - ✅ אייקונים דינמיים: ... הופך ל-X במצב עריכה
 * - ✅ כלי עריכה לסטים: חצים הזז, העתק, מחק (רק במצב עריכה)
 * - ✅ פס כלים לתרגיל: שכפל, החלף, מחק תרגיל
 * - ✅ אנימציות חלקות: מעברים עם Animated API
 * - ✅ משוב מגע: רטט iOS למעברי מצב
 * - ✅ נגישות מתקדמת: תיוגים בעברית
 * - ✅ פתיחה אוטומטית: כניסה למצב עריכה פותחת את הסטים אוטומטית
 * - ✅ נעילת קיפול: במצב עריכה לא ניתן לקפל את הכרטיס
 * - ✅ אינדיקציה חזותית: רקע כחול קל + אייקון נעילה במצב עריכה
 * - 🆕 כפתור הוספת סט: כפתור + מעוצב בסיום רשימת הסטים (v3.0.1)
 * @updated 2025-08-02 - הוספת כפתור הוספת סט מעוצב עם משוב חזותי ומגע
 * @updated 2025-01-31 - הוספת מצב עריכה In-Place מתקדם עם נעילת קיפול
 */

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// קומפוננטות פנימיות
// Internal components
import ExerciseHeader from "./ExerciseHeader";
import EditToolbar from "./EditToolbar";
import SetsList from "./SetsList";

// ייבוא ה-theme
// Import theme
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";

// ייבוא ה-types
// Import types
import { Exercise, Set as WorkoutSet } from "../../types/workout.types";

// אפשור LayoutAnimation באנדרואיד
// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Debug mode (enable via EXPO_PUBLIC_DEBUG_EXERCISECARD=1)
const DEBUG = process.env.EXPO_PUBLIC_DEBUG_EXERCISECARD === "1";
const log = (message: string, data?: object) => {
  if (DEBUG) {
    console.warn(
      `🏋️ ExerciseCard: ${message}` +
        (data ? ` -> ${JSON.stringify(data)}` : "")
    );
  }
};

interface ExerciseCardProps {
  exercise: Exercise;
  sets: WorkoutSet[];
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onAddSet: () => void;
  onDeleteSet?: (setId: string) => void;
  onCompleteSet: (setId: string, isCompleting?: boolean) => void; // הוספת פרמטר אופציונלי
  onRemoveExercise: () => void;
  onStartRest?: (duration: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  // onShowTips?: () => void; // מוסר - הפונקציה לא משמשת עוד
  onTitlePress?: () => void; // עבור מעבר לתרגיל יחיד
  isFirst?: boolean;
  isLast?: boolean;
  isPaused?: boolean;
  showHistory?: boolean;
  showNotes?: boolean;
  personalRecord?: { weight: number; reps: number };
  lastWorkout?: {
    date: string;
    bestSet: { weight: number; reps: number };
  };
  onDuplicate?: () => void;
  onReplace?: () => void;
  // פונקציה להזזת סטים - אופציונלי לעתיד
  onReorderSets?: (fromIndex: number, toIndex: number) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(
  ({
    exercise,
    sets,
    onUpdateSet,
    onAddSet,
    onDeleteSet,
    onCompleteSet,
    onRemoveExercise,
    // onStartRest, // לא בשימוש כרגע
    onMoveUp: _onMoveUp,
    onMoveDown: _onMoveDown,
    // onShowTips, // מוסר - הפונקציה לא משמשת עוד
    onTitlePress, // עבור מעבר לתרגיל יחיד
    isFirst: _isFirst = false,
    isLast: _isLast = false,
    // isPaused = false, // לא בשימוש כרגע
    showHistory = false,
    showNotes = false,
    // personalRecord, // לא בשימוש כרגע
    lastWorkout,
    onDuplicate,
    onReplace,
    onReorderSets, // פונקציה להזזת סטים
  }) => {
    // מצבים מקומיים
    // Local states
    const [isExpanded, setIsExpanded] = useState(true);
    // const [menuVisible, setMenuVisible] = useState(false); // תפריט אופציות הוסר זמנית – לא בשימוש כעת
    const [isEditMode, setIsEditMode] = useState(false); // מצב עריכה חדש
    const [selectedSets, setSelectedSets] = useState<globalThis.Set<string>>(
      new globalThis.Set()
    );
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // אנימציות
    // Animations
    const expandAnimation = useRef(new Animated.Value(1)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;
    const headerColorAnimation = useRef(new Animated.Value(0)).current;
    const editModeAnimation = useRef(new Animated.Value(0)).current; // אנימציה למצב עריכה

    // חישוב האם התרגיל הושלם
    // Calculate if exercise is completed
    const isCompleted = useMemo(() => {
      return sets.length > 0 && sets.every((set) => set.completed);
    }, [sets]);

    // חישוב נפח כולל
    // Calculate total volume
    const totalVolume = useMemo(() => {
      return sets.reduce((total, set) => {
        if (set.actualWeight && set.actualReps) {
          return total + set.actualWeight * set.actualReps;
        }
        return total;
      }, 0);
    }, [sets]);

    // חישוב סטים שהושלמו + אחוז התקדמות ממורכז (memo)
    const completedSets = useMemo(
      () => sets.filter((set) => set.completed).length,
      [sets]
    );

    const progressPercentage = useMemo(() => {
      if (sets.length === 0) return 0;
      return (completedSets / sets.length) * 100;
    }, [completedSets, sets.length]);

    // חישוב חזרות כוללות
    // Calculate total reps
    const totalReps = useMemo(() => {
      return sets.reduce((total, set) => {
        return total + (set.actualReps || 0);
      }, 0);
    }, [sets]);

    // טיפול בלחיצה על התרגיל
    // Handle exercise tap
    const handleToggleExpanded = useCallback(() => {
      log("Toggle expanded", { isExpanded, isEditMode });

      // אל תאפשר סגירה במצב עריכה
      if (isEditMode && isExpanded) {
        log("Cannot collapse in edit mode");

        // הודעת נגישות
        if (Platform.OS === "ios") {
          triggerVibration("short"); // רטט קצר להודיע שהפעולה לא זמינה
        }

        return;
      }

      const toValue = !isExpanded ? 1 : 0;

      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          300,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.scaleY
        )
      );

      Animated.timing(expandAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setIsExpanded(!isExpanded);
    }, [isExpanded, expandAnimation, isEditMode]);

    // טיפול בלחיצה ארוכה על סט
    // Handle long press on set
    const handleSetLongPress = useCallback((setId: string) => {
      log("Set long press", { setId });

      if (Platform.OS === "ios") {
        triggerVibration("short");
      }

      setIsSelectionMode(true);
      setSelectedSets(new Set([setId]));
    }, []);

    // ביטול מצב בחירה
    // Cancel selection mode
    const cancelSelectionMode = useCallback(() => {
      log("Cancel selection mode");
      setIsSelectionMode(false);
      setSelectedSets(new Set());
    }, []);

    // מחיקת סטים נבחרים
    // Delete selected sets
    const deleteSelectedSets = useCallback(() => {
      log("Delete selected sets", { count: selectedSets.size });

      Alert.alert("מחיקת סטים", `האם למחוק ${selectedSets.size} סטים?`, [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            selectedSets.forEach((setId) => {
              onDeleteSet?.(setId);
            });
            cancelSelectionMode();
          },
        },
      ]);
    }, [selectedSets, onDeleteSet, cancelSelectionMode]);

    // טיפול במצב עריכה
    // Handle edit mode
    const toggleEditMode = useCallback(() => {
      log("Toggle edit mode", { isEditMode });

      const toValue = !isEditMode ? 1 : 0;

      // משוב מגע
      if (Platform.OS === "ios") {
        triggerVibration(!isEditMode ? "medium" : "short");
      }

      // אנימציה חלקה
      Animated.timing(editModeAnimation, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }).start();

      setIsEditMode(!isEditMode);

      // וודא שהסטים גלויים במצב עריכה
      if (!isEditMode && !isExpanded) {
        log("Expanding card for edit mode");

        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            300,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.scaleY
          )
        );

        Animated.timing(expandAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setIsExpanded(true);
      }

      // הודעת נגישות
      if (!isEditMode) {
        // נכנס למצב עריכה
        log("Entering edit mode");
      } else {
        // יוצא ממצב עריכה
        log("Exiting edit mode");
      }
    }, [isEditMode, editModeAnimation, isExpanded, expandAnimation]);

    // פונקציות עזר למצב עריכה
    // Edit mode helper functions
    const handleMoveSetUp = useCallback(
      (setIndex: number) => {
        if (setIndex > 0) {
          log("Move set up", { setIndex });

          // משוב מגע חזק יותר למעבר
          if (Platform.OS === "ios") {
            triggerVibration("medium");
          }

          // החלף בין הסט הנוכחי לסט שמעליו
          const currentSet = sets[setIndex];
          const previousSet = sets[setIndex - 1];

          // עדכן את הסדר - כאן צריכה להיות לוגיקה של החלפת מיקומים
          // בינתיים נוסיף רק לוג
          log("Swapping sets", {
            current: currentSet.id,
            previous: previousSet.id,
            fromIndex: setIndex,
            toIndex: setIndex - 1,
          });

          // TODO: צריך לקרוא לפונקציה שמעדכנת את סדר הסטים ב-parent component
          // אם הפונקציה קיימת, נשתמש בה
          if (onReorderSets) {
            onReorderSets(setIndex, setIndex - 1);
          } else {
            log("onReorderSets not provided - cannot move sets");
          }
        }
      },
      [sets, onReorderSets]
    );

    const handleMoveSetDown = useCallback(
      (setIndex: number) => {
        if (setIndex < sets.length - 1) {
          log("Move set down", { setIndex });

          // משוב מגע חזק יותר למעבר
          if (Platform.OS === "ios") {
            triggerVibration("medium");
          }

          // החלף בין הסט הנוכחי לסט שמתחתיו
          const currentSet = sets[setIndex];
          const nextSet = sets[setIndex + 1];

          // עדכן את הסדר
          log("Swapping sets", {
            current: currentSet.id,
            next: nextSet.id,
            fromIndex: setIndex,
            toIndex: setIndex + 1,
          });

          // TODO: צריך לקרוא לפונקציה שמעדכנת את סדר הסטים ב-parent component
          // אם הפונקציה קיימת, נשתמש בה
          if (onReorderSets) {
            onReorderSets(setIndex, setIndex + 1);
          } else {
            log("onReorderSets not provided - cannot move sets");
          }
        }
      },
      [sets, onReorderSets]
    );

    const handleDuplicateSet = useCallback(
      (setIndex: number) => {
        log("Duplicate set", { setIndex });
        if (onAddSet) {
          // שכפול הסט - נוסיף את אותם ערכים
          onAddSet();
          // TODO: צריך להעביר את הערכים של הסט הקיים
        }
      },
      [onAddSet]
    );

    // טיפול בבחירת סט
    // Handle set selection
    // const handleSetSelect = useCallback((setId: string) => {
    //   log("Set select", { setId });

    //   setSelectedSets((prev: globalThis.Set<string>) => {
    //     const newSet = new globalThis.Set(prev);
    //     if (newSet.has(setId)) {
    //       newSet.delete(setId);
    //     } else {
    //       newSet.add(setId);
    //     }
    //     return newSet;
    //   });
    // }, []);

    // אנימציה כשהתרגיל הושלם
    // Animate when exercise is completed
    useEffect(() => {
      if (isCompleted) {
        log("Exercise completed animation");

        Animated.sequence([
          Animated.timing(headerColorAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [isCompleted, headerColorAnimation, cardOpacity]);

    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        {/* פס בחירה */}
        {/* Selection bar */}
        {isSelectionMode && (
          <View style={styles.selectionBar}>
            <View style={styles.selectionButtonsRow}>
              <TouchableOpacity
                onPress={cancelSelectionMode}
                style={styles.selectionButton}
                accessibilityRole="button"
                accessibilityLabel="בטל בחירה"
                accessibilityHint="יציאה ממצב בחירה"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={deleteSelectedSets}
                style={styles.selectionButton}
                accessibilityRole="button"
                accessibilityLabel="מחק סטים נבחרים"
                accessibilityHint={`מחק ${selectedSets.size} סטים`}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.selectionText}>
              {selectedSets.size} סטים נבחרו
            </Text>
          </View>
        )}

        {/* כותרת התרגיל */}
        <ExerciseHeader
          exercise={exercise}
          sets={sets}
          isCompleted={isCompleted}
          isExpanded={isExpanded}
          isEditMode={isEditMode}
          completedSets={completedSets}
          progressPercentage={progressPercentage}
          totalVolume={totalVolume}
          totalReps={totalReps}
          onToggleExpanded={handleToggleExpanded}
          onToggleEditMode={toggleEditMode}
          onTitlePress={onTitlePress}
          editModeAnimation={editModeAnimation}
        />

        {/* פס כלים למצב עריכה */}
        <EditToolbar
          isVisible={isEditMode}
          editModeAnimation={editModeAnimation}
          onDuplicate={onDuplicate}
          onReplace={onReplace}
          onRemoveExercise={onRemoveExercise}
          onExitEditMode={() => setIsEditMode(false)}
        />

        {/* תוכן התרגיל */}
        {/* Exercise content */}
        {isExpanded && (
          <Animated.View
            style={[
              styles.content,
              {
                opacity: expandAnimation,
                transform: [{ scaleY: expandAnimation }],
              },
            ]}
          >
            {/* מידע נוסף */}
            {/* Additional info */}
            <View style={styles.infoSection}>
              {exercise.notes && showNotes && (
                <View style={styles.notesContainer}>
                  <MaterialCommunityIcons
                    name="note-text"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.notesText}>{exercise.notes}</Text>
                </View>
              )}

              {lastWorkout && showHistory && (
                <View style={styles.historyContainer}>
                  <MaterialCommunityIcons
                    name="history"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.historyText}>
                    אימון קודם: {lastWorkout.bestSet.weight} ק״ג x{" "}
                    {lastWorkout.bestSet.reps} חזרות
                  </Text>
                </View>
              )}
            </View>

            {/* רשימת סטים */}
            <SetsList
              sets={sets}
              isEditMode={isEditMode}
              onUpdateSet={onUpdateSet}
              onDeleteSet={onDeleteSet}
              onCompleteSet={onCompleteSet}
              onSetLongPress={handleSetLongPress}
              onMoveSetUp={handleMoveSetUp}
              onMoveSetDown={handleMoveSetDown}
              onDuplicateSet={handleDuplicateSet}
            />

            {/* כפתור הוספת סט - נוסף אחרי רשימת הסטים, רק אם יש סטים ולא במצב עריכה */}
            {/* Add Set Button - Added after sets list, only if there are sets and not in edit mode */}
            {sets.length > 0 && !isEditMode && (
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => {
                  // משוב מגע קל
                  if (Platform.OS === "ios") {
                    triggerVibration("medium");
                  }
                  log("Add set button pressed");
                  onAddSet();
                }}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel="הוסף סט חדש"
                accessibilityHint="הקש פעמיים להוספת סט נוסף לתרגיל"
              >
                <View style={styles.addSetContent}>
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.addSetText}>הוסף סט</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {/* ExerciseMenu הוסר זמנית כדי להפחית מורכבות – אם נדרש נחזיר בגרסה עתידית */}
      </SafeAreaView>
    );
  }
);

// Set display name for debugging
ExerciseCard.displayName = "ExerciseCard";

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    alignItems: "flex-end", // ✅ RTL support - יישור תוכן לימין
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  infoSection: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  notesContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: theme.spacing.xs,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  historyContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  historyText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  selectionBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  selectionButton: {
    padding: theme.spacing.xs,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  selectionButtonsRow: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  // כפתור הוספת סט
  addSetButton: {
    marginTop: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary + "40",
    borderStyle: "dashed",
    backgroundColor: theme.colors.primary + "08",
    alignItems: "center",
    // אפקט צל קל
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addSetContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  addSetText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
});

export default ExerciseCard;
