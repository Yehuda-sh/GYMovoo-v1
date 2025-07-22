/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @brief כרטיס תרגיל המציג סטים ופעולות
 * @dependencies SetRow, ExerciseMenu, useWorkoutStore, theme
 * @notes מכיל לוגיקת אנימציה לפתיחה וסגירה של כרטיס
 * @recurring_errors שכחה להעביר את ה-prop isPaused ל-RestTimer
 */

import React, { useState, useRef, useCallback, useMemo } from "react";
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
import { Exercise, WorkoutSet, SetType } from "../../types/workout.types";

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
const log = (message: string, data?: any) => {
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
  isFirst?: boolean;
  isLast?: boolean;
  isPaused?: boolean;
  showHistory?: boolean;
  showNotes?: boolean;
  personalRecord?: { weight: number; reps: number };
  lastWorkout?: {
    date: string;
    sets: Array<{ weight: number; reps: number }>;
  };
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  sets,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onCompleteSet,
  onRemoveExercise,
  onStartRest,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  isPaused = false,
  showHistory = true,
  showNotes = true,
  personalRecord,
  lastWorkout,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const animatedHeight = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(1)).current;

  // חישוב האם כל הסטים הושלמו
  // Calculate if all sets are completed
  const allSetsCompleted = useMemo(() => {
    return sets.length > 0 && sets.every((set) => set.completed);
  }, [sets]);

  // חישוב סטטיסטיקות
  // Calculate statistics
  const stats = useMemo(() => {
    const completedSets = sets.filter((set) => set.completed);
    const totalVolume = completedSets.reduce(
      (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
      0
    );
    const avgWeight =
      completedSets.length > 0
        ? completedSets.reduce((sum, set) => sum + (set.weight || 0), 0) /
          completedSets.length
        : 0;

    return {
      completedSets: completedSets.length,
      totalSets: sets.length,
      totalVolume,
      avgWeight,
    };
  }, [sets]);

  // טיפול בלחיצה על כרטיס
  // Handle card press
  const handleCardPress = useCallback(() => {
    log("Card pressed", { isExpanded });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);

    // אנימציה לחץ ההרחבה
    // Animate expand arrow
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  // טיפול בלחיצה על סט
  // Handle set press
  const handleSetPress = useCallback(
    (setId: string) => {
      if (isSelectionMode) {
        log("Toggle set selection", { setId });
        setSelectedSets((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(setId)) {
            newSet.delete(setId);
          } else {
            newSet.add(setId);
          }
          return newSet;
        });
        Vibration.vibrate(10);
      }
    },
    [isSelectionMode]
  );

  // טיפול בלחיצה ארוכה על סט
  // Handle set long press
  const handleSetLongPress = useCallback((setId: string) => {
    log("Set long press - entering selection mode", { setId });
    setIsSelectionMode(true);
    setSelectedSets(new Set([setId]));
    Vibration.vibrate(50);
  }, []);

  // יציאה ממצב בחירה
  // Exit selection mode
  const exitSelectionMode = useCallback(() => {
    log("Exiting selection mode");
    setIsSelectionMode(false);
    setSelectedSets(new Set());
  }, []);

  // מחיקת סטים נבחרים
  // Delete selected sets
  const deleteSelectedSets = useCallback(() => {
    Alert.alert(
      `מחיקת ${selectedSets.size} סטים`,
      `האם אתה בטוח שברצונך למחוק ${selectedSets.size} סטים?`,
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            log("Deleting selected sets", { count: selectedSets.size });
            selectedSets.forEach((setId) => {
              onDeleteSet?.(setId);
            });
            exitSelectionMode();
          },
        },
      ]
    );
  }, [selectedSets, onDeleteSet, exitSelectionMode]);

  // טיפול במחיקת תרגיל
  // Handle exercise deletion
  const handleDeleteExercise = useCallback(() => {
    Alert.alert(
      "מחיקת תרגיל",
      `האם אתה בטוח שברצונך למחוק את ${exercise.name}?`,
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            log("Deleting exercise", { exerciseId: exercise.id });
            onRemoveExercise();
          },
        },
      ]
    );
  }, [exercise, onRemoveExercise]);

  // טיפול בהוספת סט
  // Handle add set
  const handleAddSet = useCallback(() => {
    log("Adding new set");
    onAddSet();
    Vibration.vibrate(10);
  }, [onAddSet]);

  // טיפול בהשלמת סט
  // Handle complete set
  const handleCompleteSet = useCallback(
    (setId: string) => {
      log("Completing set", { setId });
      onCompleteSet(setId);

      // מציאת הסט להבין את זמן המנוחה
      // Find the set to understand rest time
      const set = sets.find((s) => s.id === setId);
      if (set && !set.completed) {
        // חישוב זמן מנוחה מומלץ בהתבסס על המשקל
        // Calculate recommended rest time based on weight
        const weight = set.weight || 0;
        let restTime = 60; // ברירת מחדל

        if (weight > 100) {
          restTime = 180; // 3 דקות למשקלים כבדים
        } else if (weight > 60) {
          restTime = 120; // 2 דקות למשקלים בינוניים
        } else {
          restTime = 90; // 1.5 דקות למשקלים קלים
        }

        if (onStartRest) {
          log("Starting rest timer", { duration: restTime });
          onStartRest(restTime);
        }

        Vibration.vibrate(50);
      }
    },
    [sets, onCompleteSet, onStartRest]
  );

  // טיפול בתפריט
  // Handle menu
  const handleMenuPress = useCallback(() => {
    log("Toggle menu", { showMenu: !showMenu });
    setShowMenu(!showMenu);
  }, [showMenu]);

  // רנדר סרגל בחירה
  // Render selection bar
  const renderSelectionBar = () => {
    if (!isSelectionMode) return null;

    return (
      <Animated.View style={[styles.selectionBar]}>
        <TouchableOpacity
          onPress={exitSelectionMode}
          style={styles.selectionButton}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.selectionText}>{selectedSets.size} נבחרו</Text>

        <TouchableOpacity
          onPress={deleteSelectedSets}
          style={[
            styles.selectionButton,
            { opacity: selectedSets.size > 0 ? 1 : 0.5 },
          ]}
          disabled={selectedSets.size === 0}
        >
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-90deg"],
  });

  return (
    <View style={styles.container}>
      {/* סרגל בחירה */}
      {/* Selection bar */}
      {renderSelectionBar()}

      {/* ראש הכרטיס */}
      {/* Card header */}
      <TouchableOpacity
        style={[styles.header, allSetsCompleted && styles.headerCompleted]}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          {/* מידע על התרגיל */}
          {/* Exercise info */}
          <View style={styles.exerciseInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Animated.View style={{ transform: [{ rotate }] }}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </Animated.View>
            </View>

            {/* סטטיסטיקות */}
            {/* Statistics */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <MaterialCommunityIcons
                  name="checkbox-marked-circle"
                  size={16}
                  color={theme.colors.success}
                />
                <Text style={styles.statText}>
                  {stats.completedSets}/{stats.totalSets}
                </Text>
              </View>

              {stats.totalVolume > 0 && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="weight-kilogram"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.statText}>
                    {stats.totalVolume.toFixed(0)} ק"ג
                  </Text>
                </View>
              )}

              {personalRecord && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="trophy"
                    size={16}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.statText}>
                    {personalRecord.weight}×{personalRecord.reps}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* כפתורי פעולה */}
          {/* Action buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleMenuPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* פס התקדמות */}
        {/* Progress bar */}
        {stats.totalSets > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  {
                    width: `${(stats.completedSets / stats.totalSets) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* תפריט */}
      {/* Menu */}
      {showMenu && (
        <ExerciseMenu
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onDelete={handleDeleteExercise}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={() => {
            log("Duplicate exercise");
            // TODO: implement duplicate
          }}
          onReplace={() => {
            log("Replace exercise");
            // TODO: implement replace
          }}
          canMoveUp={!isFirst}
          canMoveDown={!isLast}
        />
      )}

      {/* תוכן מורחב */}
      {/* Expanded content */}
      {isExpanded && (
        <Animated.View style={[styles.content, { opacity: animatedHeight }]}>
          {/* הערות והיסטוריה */}
          {/* Notes and history */}
          {(showNotes || showHistory) && (
            <View style={styles.infoSection}>
              {showNotes && exercise.notes && (
                <View style={styles.notesContainer}>
                  <MaterialCommunityIcons
                    name="note-text"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.notesText}>{exercise.notes}</Text>
                </View>
              )}

              {showHistory && lastWorkout && (
                <View style={styles.historyContainer}>
                  <MaterialCommunityIcons
                    name="history"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.historyText}>
                    אימון אחרון: {lastWorkout.date} -{" "}
                    {lastWorkout.sets
                      .map((s) => `${s.weight}×${s.reps}`)
                      .join(", ")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* רשימת סטים */}
          {/* Sets list */}
          <View style={styles.setsList}>
            {sets.map((set, index) => (
              <SetRow
                key={set.id}
                set={set}
                setNumber={index + 1}
                onUpdate={(updates) => onUpdateSet(set.id, updates)}
                onComplete={() => handleCompleteSet(set.id)}
                onDelete={() => onDeleteSet?.(set.id)}
                onLongPress={() => handleSetLongPress(set.id)}
                exercise={exercise}
              />
            ))}
          </View>

          {/* כפתור הוספת סט */}
          {/* Add set button */}
          <TouchableOpacity
            style={styles.addSetButton}
            onPress={handleAddSet}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[
                theme.colors.primary + "20",
                theme.colors.primaryGradientEnd + "20",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addSetGradient}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.addSetText}>הוסף סט</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: "visible",
    shadowColor: theme.colors.shadow,
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
    marginLeft: theme.spacing.sm,
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
    marginLeft: theme.spacing.sm,
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
  addSetButton: {
    marginTop: theme.spacing.md,
  },
  addSetGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
    borderRadius: 12,
    gap: theme.spacing.xs,
  },
  addSetText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
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
});

export default ExerciseCard;
