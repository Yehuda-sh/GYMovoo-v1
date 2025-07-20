/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @description כרטיס תרגיל מלא עם סטים, התקדמות ופעולות
 * English: Complete exercise card with sets, progress and actions
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
// import DraggableFlatList, {
//   ScaleDecorator,
// } from "react-native-draggable-flatlist";
import { theme } from "../../../../styles/theme";
import { Exercise, Set } from "../../types/workout.types";
import SetRow from "./SetRow";
import ExerciseMenu from "./ExerciseMenu";

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseNumber: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateSet: (setId: string, updates: Partial<Set>) => void;
  onAddSet: () => void;
  onDeleteSet: (setId: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStartRest: (duration: number) => void;
  onShowPlateCalculator: (weight: number) => void;
  onShowTips: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseNumber,
  isExpanded,
  onToggleExpand,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onDelete,
  onDuplicate,
  onStartRest,
  onShowPlateCalculator,
  onShowTips,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showExerciseInfo, setShowExerciseInfo] = useState(false);
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // חישוב התקדמות
  // Calculate progress
  const completedSets = exercise.sets.filter(
    (set: Set) => set.completed
  ).length;
  const totalSets = exercise.sets.length;
  const progressPercentage =
    totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // חישוב נפח נוכחי
  // Calculate current volume
  const currentVolume = exercise.sets.reduce((total: number, set: Set) => {
    if (set.completed && set.weight && set.reps) {
      return total + set.weight * set.reps;
    }
    return total;
  }, 0);

  // אנימציית התקדמות
  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  // אנימציית הרחבה/כיווץ
  // Expand/collapse animation
  useEffect(() => {
    const toValue = isExpanded ? 1 : 0;
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  // סידור מחדש של סטים
  // Reorder sets
  const reorderSets = ({ data }: { data: Set[] }) => {
    // TODO: Implement reordering logic
  };

  // בדיקה האם יש שיא אישי
  // Check for personal records
  const hasPersonalRecord = exercise.sets.some(
    (set: Set) => set.isPersonalRecord
  );

  // כותרת התרגיל
  // Exercise header
  const ExerciseHeader = () => (
    <TouchableOpacity
      style={[styles.header, hasPersonalRecord && styles.prHeader]}
      onPress={onToggleExpand}
      activeOpacity={0.7}
    >
      <View style={styles.headerLeft}>
        <View style={styles.exerciseNumber}>
          <Text style={styles.exerciseNumberText}>{exerciseNumber}</Text>
        </View>
        <View style={styles.exerciseDetails}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
            <Text style={styles.muscleText}>
              {exercise.primaryMuscles.join(", ")}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.headerRight}>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>
            {completedSets}/{totalSets}
          </Text>
          <Text style={styles.statLabel}>סטים</Text>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            setShowMenu(true);
          }}
          style={styles.menuButton}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons
            name="chevron-down"
            size={24}
            color={theme.colors.textSecondary}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );

  // פס התקדמות
  // Progress bar
  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
      {currentVolume > 0 && (
        <Text style={styles.volumeText}>
          {currentVolume.toLocaleString()} ק"ג נפח
        </Text>
      )}
    </View>
  );

  // תוכן התרגיל
  // Exercise content
  const ExerciseContent = () => (
    <Animated.View
      style={[
        styles.content,
        {
          maxHeight: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000],
          }),
          opacity: expandAnim,
        },
      ]}
    >
      {/* כותרות עמודות */}
      {/* Column headers */}
      <View style={styles.columnHeaders}>
        <Text style={styles.columnHeader}>סט</Text>
        <Text style={styles.columnHeader}>קודם</Text>
        <Text style={styles.columnHeader}>משקל</Text>
        <Text style={styles.columnHeader}>חזרות</Text>
        <View style={styles.columnHeaderEmpty} />
      </View>

      {/* רשימת סטים */}
      {/* Sets list */}
      {/* <DraggableFlatList
        data={exercise.sets}
        keyExtractor={(item) => item.id}
        onDragEnd={reorderSets}
        renderItem={({ item, drag, isActive, getIndex }) => (
          <ScaleDecorator> */}
      {/* <SetRow
              set={item}
              setNumber={(getIndex?.() || 0) + 1}
              onUpdate={(updates) => onUpdateSet(item.id, updates)}
              onDelete={() => onDeleteSet(item.id)}
              onComplete={() => {
                onUpdateSet(item.id, { completed: !item.completed });
                if (!item.completed && exercise.restTimeBetweenSets) {
                  onStartRest(exercise.restTimeBetweenSets);
                }
              }}
              onLongPress={drag}
              isActive={isActive}
              exercise={exercise}
            />
          </ScaleDecorator>
        )}
      /> */}

      {/* כפתור הוספת סט */}
      {/* Add set button */}
      <TouchableOpacity onPress={onAddSet} style={styles.addSetButton}>
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.addSetText}>הוסף סט</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, hasPersonalRecord && styles.prContainer]}>
      {hasPersonalRecord && (
        <View style={styles.prBadge}>
          <MaterialCommunityIcons
            name="trophy"
            size={16}
            color={theme.colors.warning}
          />
          <Text style={styles.prBadgeText}>שיא אישי!</Text>
        </View>
      )}

      <ExerciseHeader />
      <ProgressBar />
      {isExpanded && <ExerciseContent />}

      {/* תפריט אפשרויות */}
      {/* Options menu */}
      <ExerciseMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onMoveUp={() => {
          /* TODO: implement move up */
        }}
        onMoveDown={() => {
          /* TODO: implement move down */
        }}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        canMoveUp={exerciseNumber > 1}
        canMoveDown={true}
      />

      {/* מודל מידע על התרגיל */}
      {/* Exercise info modal */}
      <Modal
        visible={showExerciseInfo}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExerciseInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{exercise.name}</Text>
              <TouchableOpacity onPress={() => setShowExerciseInfo(false)}>
                <Ionicons name="close" size={28} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {exercise.primaryMuscles &&
                exercise.primaryMuscles.length > 0 && (
                  <>
                    <Text style={styles.infoLabel}>שרירים ראשיים</Text>
                    <Text style={styles.infoText}>
                      {exercise.primaryMuscles.join(", ")}
                    </Text>
                  </>
                )}

              {exercise.secondaryMuscles &&
                exercise.secondaryMuscles.length > 0 && (
                  <>
                    <Text style={styles.infoLabel}>שרירים משניים</Text>
                    <Text style={styles.infoText}>
                      {exercise.secondaryMuscles.join(", ")}
                    </Text>
                  </>
                )}

              {exercise.equipment && (
                <>
                  <Text style={styles.infoLabel}>ציוד</Text>
                  <Text style={styles.infoText}>{exercise.equipment}</Text>
                </>
              )}

              {exercise.notes && (
                <>
                  <Text style={styles.infoLabel}>הערות</Text>
                  <Text style={styles.infoText}>{exercise.notes}</Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  prContainer: {
    borderColor: theme.colors.warning,
    borderWidth: 2,
  },
  prBadge: {
    position: "absolute",
    top: -1,
    right: 16,
    backgroundColor: theme.colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 10,
  },
  prBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  prHeader: {
    paddingTop: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exerciseNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  muscleText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statsContainer: {
    alignItems: "center",
  },
  statText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  menuButton: {
    padding: 4,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.divider,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  volumeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  content: {
    overflow: "hidden",
  },
  columnHeaders: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  columnHeader: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  columnHeaderEmpty: {
    width: 40,
  },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  addSetText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  modalBody: {
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
});
