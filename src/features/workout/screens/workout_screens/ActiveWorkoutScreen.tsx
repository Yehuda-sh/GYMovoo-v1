// Fixed: Using proper Set type from core/types instead of local WorkoutSet
// All type issues resolved, no more any casting needed

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../core/theme";
import BackButton from "../../../../components/common/BackButton";
import AppButton from "../../../../components/common/AppButton";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";
import { calculateWorkoutStats } from "../../utils/workoutStatsCalculator";

import { WorkoutExercise, Set } from "../../../../core/types/workout.types";

interface ExerciseItemProps {
  exercise: WorkoutExercise;
  onCompleteSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onCompleteSet,
  onAddSet,
  onDeleteSet,
}) => {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.muscleGroup}>
          {exercise.primaryMuscles?.[0] || "לא צוין"}
        </Text>
      </View>

      {exercise.sets?.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setNumber}>{index + 1}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>משקל</Text>
            <Text style={styles.inputValue}>
              {set.actualWeight || set.targetWeight || 0} ק"ג
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>חזרות</Text>
            <Text style={styles.inputValue}>
              {set.actualReps || set.targetReps || 0}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              set.completed && styles.completedButton,
            ]}
            onPress={() => onCompleteSet(exercise.id, set.id)}
          >
            <MaterialCommunityIcons
              name={set.completed ? "check-circle" : "circle-outline"}
              size={24}
              color={
                set.completed
                  ? theme.colors.success
                  : theme.colors.textSecondary
              }
            />
          </TouchableOpacity>

          {(exercise.sets?.length || 0) > 1 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteSet(exercise.id, set.id)}
            >
              <MaterialCommunityIcons
                name="delete"
                size={20}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.addSetButton}
        onPress={() => onAddSet(exercise.id)}
      >
        <MaterialCommunityIcons
          name="plus"
          size={20}
          color={theme.colors.primary}
        />
        <Text style={styles.addSetText}>הוסף סט</Text>
      </TouchableOpacity>
    </View>
  );
};

interface RouteParams {
  workoutData?: {
    name?: string;
    exercises?: WorkoutExercise[];
  };
  pendingExercise?: {
    id: string;
    name: string;
    category?: string;
    primaryMuscles?: string[];
    equipment?: string;
    muscleGroup?: string;
  };
}

const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { workoutData, pendingExercise } = (route.params as RouteParams) || {};

  // State management
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    workoutData?.exercises || []
  );
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // סטטיסטיקות בזמן אמת
  const liveStats = useMemo(() => {
    if (!exercises?.length) return null;

    // יצירת פורמט תואם לפונקציה
    const formattedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      category: exercise.category || "Unknown",
      primaryMuscles: [exercise.category || "Unknown"],
      equipment: "Unknown",
      sets: (exercise.sets || []).map((set) => ({
        id: set.id,
        type: set.type || ("working" as const),
        targetReps: set.targetReps,
        actualReps: set.completed ? set.actualReps || set.targetReps : 0,
        targetWeight: set.targetWeight,
        actualWeight: set.completed ? set.actualWeight || set.targetWeight : 0,
        completed: set.completed,
        isPR: set.isPR || false,
        timeToComplete: set.timeToComplete || 0,
      })),
    }));

    return calculateWorkoutStats(formattedExercises);
  }, [exercises]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Start timer on mount
  useEffect(() => {
    setIsTimerRunning(true);
    return () => setIsTimerRunning(false);
  }, []);

  // Add pending exercise if exists
  useEffect(() => {
    if (pendingExercise && pendingExercise.id) {
      const newExercise: WorkoutExercise = {
        id: pendingExercise.id,
        name: pendingExercise.name,
        category: pendingExercise.category || "Unknown",
        primaryMuscles: pendingExercise.primaryMuscles || [
          pendingExercise.muscleGroup || "Unknown",
        ],
        equipment: pendingExercise.equipment || "bodyweight",
        sets: [
          {
            id: `${Date.now()}`,
            type: "working",
            targetWeight: 0,
            targetReps: 0,
            completed: false,
          },
        ],
      };
      setExercises((prev) => [...prev, newExercise]);
    }
  }, [pendingExercise]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate stats
  const completedSets = exercises.reduce(
    (total, ex) =>
      total + (ex.sets || []).filter((set) => set.completed).length,
    0
  );
  const totalSets = exercises.reduce(
    (total, ex) => total + (ex.sets || []).length,
    0
  );
  const totalVolume = exercises.reduce(
    (total, ex) =>
      total +
      (ex.sets || [])
        .filter((set) => set.completed)
        .reduce(
          (vol, set) =>
            vol +
            (set.actualWeight || set.targetWeight || 0) *
              (set.actualReps || set.targetReps || 0),
          0
        ),
    0
  );

  // Set management
  const handleCompleteSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: (ex.sets || []).map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              ),
            }
          : ex
      )
    );
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise || !exercise.sets) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: Set = {
      id: `${Date.now()}`,
      type: "working",
      targetWeight: lastSet?.actualWeight || lastSet?.targetWeight || 0,
      targetReps: lastSet?.actualReps || lastSet?.targetReps || 0,
      completed: false,
    };

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: [...(ex.sets || []), newSet] }
          : ex
      )
    );
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise || !exercise.sets || exercise.sets.length <= 1) {
      Alert.alert("שגיאה", "חייב להיות לפחות סט אחד בתרגיל");
      return;
    }

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: (ex.sets || []).filter((set) => set.id !== setId) }
          : ex
      )
    );
  };

  const handleAddExercise = () => {
    // @ts-expect-error - Navigation type needs to be properly typed
    navigation.navigate("ExerciseList", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: WorkoutExercise) => {
        const newExercise: WorkoutExercise = {
          ...selectedExercise,
          sets: [
            {
              id: `${Date.now()}`,
              type: "working",
              targetWeight: 0,
              targetReps: 0,
              completed: false,
            },
          ],
        };
        setExercises((prev) => [...prev, newExercise]);
        navigation.goBack();
      },
    });
  };

  const handleFinishWorkout = () => {
    if (completedSets === 0) {
      Alert.alert("שגיאה", "יש להשלים לפחות סט אחד לפני סיום האימון");
      return;
    }

    Alert.alert(
      "סיום אימון",
      `האם ברצונך לסיים את האימון?\n\n• ${completedSets}/${totalSets} סטים הושלמו\n• ${totalVolume} ק"ג נפח כללי`,
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "סיים",
          style: "destructive",
          onPress: async () => {
            await nextWorkoutLogicService.updateWorkoutCompleted(
              0,
              workoutData?.name || "אימון"
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton />
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={80}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyText}>אין תרגילים באימון</Text>
          <AppButton
            title="הוסף תרגיל"
            onPress={handleAddExercise}
            variant="primary"
            style={styles.addButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerCenter}>
          <Text style={styles.workoutTitle}>
            {workoutData?.name || "אימון פעיל"}
          </Text>
          <Text style={styles.workoutTime}>{formatTime(workoutTime)}</Text>
        </View>
        <TouchableOpacity
          style={styles.timerButton}
          onPress={() => setIsTimerRunning(!isTimerRunning)}
        >
          <MaterialCommunityIcons
            name={isTimerRunning ? "pause" : "play"}
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Live Stats Bar */}
      {liveStats && (
        <View style={styles.liveStatsBar}>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatLabel}>סטים</Text>
            <Text style={styles.liveStatValue}>
              {liveStats.completedSets}/{liveStats.totalSets}
            </Text>
          </View>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatLabel}>נפח</Text>
            <Text style={styles.liveStatValue}>
              {Math.round(liveStats.totalVolume)}kg
            </Text>
          </View>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatLabel}>חזרות</Text>
            <Text style={styles.liveStatValue}>{liveStats.totalReps}</Text>
          </View>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatLabel}>התקדמות</Text>
            <Text style={styles.liveStatValue}>
              {liveStats.progressPercentage}%
            </Text>
          </View>
        </View>
      )}

      {/* Exercises */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            onCompleteSet={handleCompleteSet}
            onAddSet={handleAddSet}
            onDeleteSet={handleDeleteSet}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton
          title="הוסף תרגיל"
          onPress={handleAddExercise}
          variant="outline"
          style={styles.addExerciseButton}
        />
        <AppButton
          title="סיים אימון"
          onPress={handleFinishWorkout}
          variant="primary"
          style={styles.finishButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  workoutTime: {
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 4,
  },
  timerButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary + "20",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  exerciseHeader: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  muscleGroup: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "30",
  },
  setNumber: {
    width: 30,
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  completeButton: {
    padding: theme.spacing.sm,
  },
  completedButton: {
    opacity: 1,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderStyle: "dashed",
  },
  addSetText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    flexDirection: "row",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  addExerciseButton: {
    flex: 1,
  },
  finishButton: {
    flex: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginVertical: theme.spacing.lg,
  },
  addButton: {
    marginTop: theme.spacing.lg,
  },
  liveStatsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  liveStatItem: {
    alignItems: "center",
  },
  liveStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "400",
  },
  liveStatValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "bold",
    marginTop: 2,
  },
});

export default ActiveWorkoutScreen;
