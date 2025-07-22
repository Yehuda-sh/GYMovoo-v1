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
  onShowTips?: () => void; // הוספת callback לטיפים
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
  onStartRest,
  onMoveUp,
  onMoveDown,
  onShowTips, // קבלת ה-callback
  isFirst = false,
  isLast = false,
  isPaused = false,
  showHistory = true,
  showNotes = true,
  personalRecord,
  lastWorkout,
  onDuplicate,
  onReplace,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const rotateAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(1)).current;
  const selectionAnim = useRef(new Animated.Value(0)).current;

  // חישוב סטטיסטיקות
  // Calculate statistics
  const stats = useMemo(() => {
    const completedSets = sets.filter((s) => s.completed).length;
    const totalVolume = sets.reduce((sum, set) => {
      if (set.completed && set.weight && set.reps) {
        return sum + set.weight * set.reps;
      }
      return sum;
    }, 0);

    return {
      completedSets,
      totalSets: sets.length,
      totalVolume,
    };
  }, [sets]);

  const allSetsCompleted = stats.completedSets === stats.totalSets;
  const progress =
    stats.totalSets > 0 ? stats.completedSets / stats.totalSets : 0;

  // טיפול בלחיצה על הכרטיס
  // Handle card press
  const handleCardPress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);

    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  // טיפול בתפריט
  // Handle menu
  const handleMenuPress = useCallback(() => {
    setMenuVisible(true);
    Vibration.vibrate(10);
  }, []);

  // מצב בחירה
  // Selection mode
  const handleSetLongPress = useCallback(
    (setId: string) => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        Animated.spring(selectionAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
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
    },
    [isSelectionMode]
  );

  const handleDeleteSelected = useCallback(() => {
    Alert.alert("מחיקת סטים", `האם למחוק ${selectedSets.size} סטים?`, [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          selectedSets.forEach((setId) => {
            onDeleteSet?.(setId);
          });
          setSelectedSets(new Set());
          setIsSelectionMode(false);
        },
      },
    ]);
  }, [selectedSets, onDeleteSet]);

  const handleSelectAll = useCallback(() => {
    if (selectedSets.size === sets.length) {
      setSelectedSets(new Set());
    } else {
      setSelectedSets(new Set(sets.map((s) => s.id)));
    }
  }, [sets, selectedSets]);

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedSets(new Set());
    Animated.timing(selectionAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  // הוספת סט
  // Add set
  const handleAddSet = useCallback(() => {
    onAddSet();
    Vibration.vibrate(10);
  }, [onAddSet]);

  // עיבוד סרגל בחירה
  // Render selection bar
  const renderSelectionBar = () => {
    if (!isSelectionMode) return null;

    return (
      <Animated.View
        style={[
          styles.selectionBar,
          {
            opacity: selectionAnim,
            transform: [
              {
                translateY: selectionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleSelectAll}
          style={styles.selectionButton}
        >
          <Text style={styles.selectionText}>
            {selectedSets.size === sets.length ? "בטל הכל" : "בחר הכל"} (
            {selectedSets.size})
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <TouchableOpacity onPress={handleCancelSelection}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteSelected}
            style={{ opacity: selectedSets.size === 0 ? 0.5 : 1 }}
            disabled={selectedSets.size === 0}
          >
            <MaterialCommunityIcons
              name="delete"
              size={24}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        </View>
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
            {/* כפתור טיפים */}
            {onShowTips && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={onShowTips}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={24}
                  color={theme.colors.warning}
                />
              </TouchableOpacity>
            )}

            {/* כפתור תפריט */}
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

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* תוכן התרגיל */}
      {/* Exercise content */}
      {isExpanded && (
        <Animated.View style={[styles.content, { opacity: heightAnim }]}>
          {/* מידע נוסף */}
          {/* Additional info */}
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
                    פעם קודמת: {lastWorkout.bestSet.weight}ק"ג ×{" "}
                    {lastWorkout.bestSet.reps} חזרות
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
                onComplete={() => onCompleteSet(set.id)}
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
