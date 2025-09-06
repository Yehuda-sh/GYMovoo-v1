import React, { useState, useEffect } from "react";
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
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { UniversalButton } from "../../components/ui/UniversalButton";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";

interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  muscleGroup?: string;
}

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
        <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
      </View>

      {exercise.sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setNumber}>{index + 1}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>משקל</Text>
            <Text style={styles.inputValue}>{set.weight} ק"ג</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>חזרות</Text>
            <Text style={styles.inputValue}>{set.reps}</Text>
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

          {exercise.sets.length > 1 && (
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

const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { workoutData, pendingExercise } =
    (route.params as {
      workoutData?: any;
      pendingExercise?: any;
    }) || {};

  // State management
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    workoutData?.exercises || []
  );
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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
        sets: [{ id: `${Date.now()}`, weight: 0, reps: 0, completed: false }],
        muscleGroup: pendingExercise.muscleGroup,
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
    (total, ex) => total + ex.sets.filter((set) => set.completed).length,
    0
  );
  const totalSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const totalVolume = exercises.reduce(
    (total, ex) =>
      total +
      ex.sets
        .filter((set) => set.completed)
        .reduce((vol, set) => vol + set.weight * set.reps, 0),
    0
  );

  // Set management
  const handleCompleteSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              ),
            }
          : ex
      )
    );
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: `${Date.now()}`,
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      completed: false,
    };

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: [...ex.sets, newSet] } : ex
      )
    );
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise || exercise.sets.length <= 1) {
      Alert.alert("שגיאה", "חייב להיות לפחות סט אחד בתרגיל");
      return;
    }

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((set) => set.id !== setId) }
          : ex
      )
    );
  };

  const handleAddExercise = () => {
    (navigation as any).navigate("ExerciseList", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: WorkoutExercise) => {
        const newExercise = {
          ...selectedExercise,
          sets: [{ id: `${Date.now()}`, weight: 0, reps: 0, completed: false }],
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
          <UniversalButton
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

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedSets}</Text>
          <Text style={styles.statLabel}>סטים</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalVolume}</Text>
          <Text style={styles.statLabel}>ק"ג</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{exercises.length}</Text>
          <Text style={styles.statLabel}>תרגילים</Text>
        </View>
      </View>

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
        <UniversalButton
          title="הוסף תרגיל"
          onPress={handleAddExercise}
          variant="outline"
          style={styles.addExerciseButton}
        />
        <UniversalButton
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
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
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
});

export default ActiveWorkoutScreen;
