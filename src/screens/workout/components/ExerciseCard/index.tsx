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
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { theme } from "../../../../styles/theme";
import { WorkoutExercise, WorkoutSet } from "../../types/workout.types";
import SetRow from "./SetRow";
import ExerciseMenu from "./ExerciseMenu";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  onUpdateExercise: (exercise: WorkoutExercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onStartRest: (duration: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onUpdateExercise,
  onDeleteExercise,
  onMoveUp,
  onMoveDown,
  onStartRest,
  isFirst,
  isLast,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showExerciseInfo, setShowExerciseInfo] = useState(false);
  const expandAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // חישוב התקדמות
  // Calculate progress
  const completedSets = exercise.sets.filter((set) => set.completed).length;
  const totalSets = exercise.sets.length;
  const progressPercentage =
    totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // חישוב נפח נוכחי
  // Calculate current volume
  useEffect(() => {
    let volume = 0;
    exercise.sets.forEach((set) => {
      if (set.completed && set.weight && set.reps) {
        volume += parseFloat(set.weight) * parseInt(set.reps);
      }
    });

    if (volume !== exercise.currentVolume) {
      onUpdateExercise({
        ...exercise,
        currentVolume: volume,
      });
    }
  }, [exercise.sets]);

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
  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  // עדכון סט
  // Update set
  const updateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    const updatedSets = exercise.sets.map((set) =>
      set.id === setId ? { ...set, ...updates } : set
    );

    onUpdateExercise({
      ...exercise,
      sets: updatedSets,
    });
  };

  // מחיקת סט
  // Delete set
  const deleteSet = (setId: string) => {
    Alert.alert("מחיקת סט", "האם אתה בטוח שברצונך למחוק את הסט?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          const updatedSets = exercise.sets.filter((set) => set.id !== setId);
          onUpdateExercise({
            ...exercise,
            sets: updatedSets,
          });
        },
      },
    ]);
  };

  // הוספת סט
  // Add set
  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: `${exercise.id}_set_${Date.now()}`,
      weight: lastSet?.weight || "",
      reps: lastSet?.reps || "",
      completed: false,
      type: "normal",
      previousWeight: lastSet?.weight,
      previousReps: lastSet?.reps,
    };

    onUpdateExercise({
      ...exercise,
      sets: [...exercise.sets, newSet],
    });
  };

  // סידור מחדש של סטים
  // Reorder sets
  const reorderSets = ({ data }: { data: WorkoutSet[] }) => {
    onUpdateExercise({
      ...exercise,
      sets: data,
    });
  };

  // כותרת התרגיל
  // Exercise header
  const ExerciseHeader = () => (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
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
            <Ionicons name="chevron-down" size={24} color={theme.colors.text} />
          </Animated.View>

          <TouchableOpacity
            onPress={() => setShowExerciseInfo(true)}
            style={styles.exerciseNameButton}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>
              {completedSets}/{totalSets}
            </Text>
            <Text style={styles.statLabel}>סטים</Text>
          </View>

          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* פס התקדמות */}
      {/* Progress bar */}
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
        {exercise.currentVolume > 0 && (
          <Text style={styles.volumeText}>
            {exercise.currentVolume.toLocaleString()} ק"ג נפח
          </Text>
        )}
      </View>
    </TouchableOpacity>
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
      <DraggableFlatList
        data={exercise.sets}
        keyExtractor={(item) => item.id}
        onDragEnd={reorderSets}
        renderItem={({ item, drag, isActive, getIndex }) => (
          <ScaleDecorator>
            <SetRow
              set={item}
              setNumber={(getIndex() || 0) + 1}
              onUpdate={(updates) => updateSet(item.id, updates)}
              onDelete={() => deleteSet(item.id)}
              onComplete={() => {
                updateSet(item.id, { completed: !item.completed });
                if (!item.completed) {
                  onStartRest(exercise.restTime);
                }
              }}
              onLongPress={drag}
              isActive={isActive}
              exercise={exercise}
            />
          </ScaleDecorator>
        )}
      />

      {/* כפתור הוספת סט */}
      {/* Add set button */}
      <TouchableOpacity onPress={addSet} style={styles.addSetButton}>
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
    <View style={styles.container}>
      <ExerciseHeader />
      <ExerciseContent />

      {/* תפריט אפשרויות */}
      {/* Options menu */}
      <ExerciseMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={() => onDeleteExercise(exercise.id)}
        onDuplicate={() => {
          /* TODO: implement duplicate */
        }}
        canMoveUp={!isFirst}
        canMoveDown={!isLast}
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
              <Text style={styles.infoLabel}>שריר ראשי:</Text>
              <Text style={styles.infoText}>{exercise.muscle}</Text>

              {exercise.technique && (
                <>
                  <Text style={styles.infoLabel}>טכניקה:</Text>
                  <Text style={styles.infoText}>{exercise.technique}</Text>
                </>
              )}

              {exercise.personalRecord && (
                <View style={styles.prContainer}>
                  <FontAwesome5
                    name="trophy"
                    size={20}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.prText}>
                    שיא אישי: {exercise.personalRecord.weight}ק"ג ×{" "}
                    {exercise.personalRecord.reps}
                  </Text>
                </View>
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
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  exerciseNameButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    gap: 6,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
    fontSize: 11,
    color: theme.colors.textSecondary,
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
  prContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  prText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.warning,
  },
});
