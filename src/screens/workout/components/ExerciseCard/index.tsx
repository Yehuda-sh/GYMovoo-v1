/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @brief כרטיס תרגיל המציג סטים ופעולות
 * @dependencies SetRow, ExerciseMenu, useWorkoutStore, theme
 * @notes מכיל לוגיקת אנימציה לפתיחה וסגירה של כרטיס
 * @recurring_errors שכחה להעביר את ה-prop isPaused ל-RestTimer
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
  Vibration,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// קומפוננטות פנימיות
// Internal components
import SetRow from "./SetRow";
import ExerciseMenu from "./ExerciseMenu";

// ייבוא ה-theme
// Import theme
import { theme } from "../../../../styles/theme";

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

// Debug mode
const DEBUG = true;
const log = (message: string, data?: object) => {
  if (DEBUG) {
    console.log(`🏋️ ExerciseCard: ${message}`, data || "");
  }
};

interface ExerciseCardProps {
  exercise: Exercise;
  sets: WorkoutSet[];
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onAddSet: () => void;
  onDeleteSet?: (setId: string) => void;
  onCompleteSet: (setId: string) => void;
  onRemoveExercise: () => void;
  onStartRest?: (duration: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onShowTips?: () => void;
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
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  sets,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onCompleteSet,
  onRemoveExercise,
  // onStartRest, // לא בשימוש כרגע
  onMoveUp,
  onMoveDown,
  // onShowTips, // לא בשימוש כרגע
  onTitlePress, // עבור מעבר לתרגיל יחיד
  isFirst = false,
  isLast = false,
  // isPaused = false, // לא בשימוש כרגע
  showHistory = false,
  showNotes = false,
  // personalRecord, // לא בשימוש כרגע
  lastWorkout,
  onDuplicate,
  onReplace,
}) => {
  // מצבים מקומיים
  // Local states
  const [isExpanded, setIsExpanded] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedSets, setSelectedSets] = useState<globalThis.Set<string>>(
    new globalThis.Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // אנימציות
  // Animations
  const expandAnimation = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const headerColorAnimation = useRef(new Animated.Value(0)).current;

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

  // חישוב סטים שהושלמו
  // Calculate completed sets
  const completedSets = useMemo(() => {
    return sets.filter((set) => set.completed).length;
  }, [sets]);

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
    log("Toggle expanded", { isExpanded });

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
  }, [isExpanded, expandAnimation]);

  // טיפול בלחיצה ארוכה על סט
  // Handle long press on set
  const handleSetLongPress = useCallback((setId: string) => {
    log("Set long press", { setId });

    if (Platform.OS === "ios") {
      Vibration.vibrate(10);
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
    <View style={styles.container}>
      {/* פס בחירה */}
      {/* Selection bar */}
      {isSelectionMode && (
        <View style={styles.selectionBar}>
          <View style={{ flexDirection: "row-reverse", gap: 12 }}>
            <TouchableOpacity
              onPress={cancelSelectionMode}
              style={styles.selectionButton}
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
      {/* Exercise header */}
      <TouchableOpacity
        style={[styles.header, isCompleted && styles.headerCompleted]}
        onPress={handleToggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.exerciseInfo}>
            <TouchableOpacity
              style={styles.titleRow}
              onPress={onTitlePress}
              disabled={!onTitlePress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`לחץ לעבור לאימון ${exercise.name}`}
              accessibilityHint="פותח את התרגיל במסך נפרד לפוקוס מלא"
            >
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
              style={styles.menuButton}
              onPress={() => {
                log("Menu button pressed");
                setMenuVisible(true);
              }}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            <MaterialCommunityIcons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* פס התקדמות */}
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
                  { width: `${(completedSets / sets.length) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

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
          {/* Sets list */}
          <View style={styles.setsList}>
            {/* כותרות הטבלה */}
            {/* Table headers */}
            <View style={styles.setsTableHeader}>
              <View style={styles.setNumberHeader}>
                <Text style={styles.headerText}>סט</Text>
              </View>
              <View style={styles.previousHeader}>
                <Text style={styles.headerText}>קודם</Text>
              </View>
              <View style={styles.weightHeader}>
                <Text style={styles.headerText}>משקל</Text>
              </View>
              <View style={styles.repsHeader}>
                <Text style={styles.headerText}>חזרות</Text>
              </View>
              <View style={styles.actionsHeader}>
                <Text style={styles.headerText}>פעולות</Text>
              </View>
            </View>

            {sets.map((set, index) => (
              <SetRow
                key={set.id}
                set={set}
                setNumber={index + 1}
                onUpdate={(updates: Partial<WorkoutSet>) =>
                  onUpdateSet(set.id, updates)
                }
                onDelete={() => onDeleteSet?.(set.id)}
                onComplete={() => onCompleteSet(set.id)}
                onLongPress={() => handleSetLongPress(set.id)}
                isActive={index === 0 && !set.completed}
                exercise={exercise}
              />
            ))}
          </View>
        </Animated.View>
      )}

      {/* תפריט אפשרויות */}
      {/* Options menu */}
      <ExerciseMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onDelete={onRemoveExercise}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate || (() => {})}
        onReplace={onReplace || (() => {})}
        onAddSet={onAddSet}
        onDeleteLastSet={() => {
          // מחק את הסט האחרון
          if (sets.length > 0) {
            const lastSet = sets[sets.length - 1];
            onDeleteSet?.(lastSet.id);
          }
        }}
        hasLastSet={sets.length > 0}
        canMoveUp={!isFirst}
        canMoveDown={!isLast}
      />
    </View>
  );
};

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
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerCompleted: {
    backgroundColor: theme.colors.success + "10",
  },
  headerContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  exerciseInfo: {
    flex: 1,
    marginStart: theme.spacing.sm, // שינוי RTL: marginStart במקום marginLeft
  },
  titleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginStart: theme.spacing.sm, // שינוי RTL: marginStart במקום marginLeft
    textAlign: "right",
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
  setsList: {
    gap: theme.spacing.sm,
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
  // כותרות טבלת הסטים - סגנונות חדשים
  setsTableHeader: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  setNumberHeader: {
    width: 50,
    alignItems: "center",
    marginStart: 8, // שינוי RTL: marginStart במקום marginLeft
  },
  previousHeader: {
    flex: 1.2,
    alignItems: "center",
  },
  weightHeader: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  repsHeader: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionsHeader: {
    width: 80,
    alignItems: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  // סגנונות לכותרת לחיצה
  exerciseNameClickable: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  focusIcon: {
    marginHorizontal: theme.spacing.xs,
  },
});

export default ExerciseCard;
