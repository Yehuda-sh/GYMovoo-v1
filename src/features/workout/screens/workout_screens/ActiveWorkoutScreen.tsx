// src/features/workout/screens/workout_screens/ActiveWorkoutScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../core/theme";
import BackButton from "../../../../components/common/BackButton";
import AppButton from "../../../../components/common/AppButton";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";
import { calculateWorkoutStats } from "../../utils/workoutStatsCalculator";
import { WorkoutExercise, Set } from "../../../../core/types/workout.types";
import { RootStackParamList } from "../../../../navigation/types";
import { wrapTextWithEmoji } from "../../../../utils/rtlHelpers";

/** ---------- RestTimer ---------- */
interface RestTimerProps {
  restTime: number;
  onComplete: () => void;
  onSkip: () => void;
  visible: boolean;
}

const RestTimer: React.FC<RestTimerProps> = ({
  restTime,
  onComplete,
  onSkip,
  visible,
}) => {
  const [timeLeft, setTimeLeft] = useState(restTime);

  const getRestTimeExplanation = (time: number): string => {
    if (time >= 120)
      return wrapTextWithEmoji("זמן מנוחה ארוך לתרגילי כוח", "💪");
    if (time >= 90) return wrapTextWithEmoji("זמן מנוחה בינוני למשקולות", "⚖️");
    if (time >= 60) return wrapTextWithEmoji("זמן מנוחה סטנדרטי", "🏃‍♂️");
    if (time >= 45) return wrapTextWithEmoji("זמן מנוחה קצר למשקל גוף", "🤸‍♂️");
    return wrapTextWithEmoji("זמן מנוחה מינימלי", "⚡");
  };

  useEffect(() => {
    if (!visible) {
      setTimeLeft(restTime);
      return;
    }

    if (timeLeft <= 0) {
      Vibration.vibrate([100, 50, 100, 50, 100]);
      onComplete();
      return;
    }

    if (timeLeft <= 10 && timeLeft > 0) {
      Vibration.vibrate(50);
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, visible, restTime, onComplete]);

  useEffect(() => {
    if (visible) setTimeLeft(restTime);
  }, [visible, restTime]);

  if (!visible) return null;

  const progress = ((restTime - timeLeft) / restTime) * 100;

  const getTimerColor = () => {
    if (timeLeft <= 10) return theme.colors.error;
    if (timeLeft <= 30) return theme.colors.warning;
    return theme.colors.primary;
  };

  const getTimerIcon = () => {
    if (timeLeft <= 10) return "clock-alert";
    if (timeLeft <= 30) return "clock-time-four";
    return "timer-sand";
  };

  return (
    <View style={styles.restTimerOverlay}>
      <View style={styles.restTimerContainer}>
        <MaterialCommunityIcons
          name={getTimerIcon()}
          size={40}
          color={getTimerColor()}
        />
        <Text style={styles.restTimerTitle}>זמן מנוחה</Text>
        <Text style={styles.restTimerExplanation}>
          {getRestTimeExplanation(restTime)}
        </Text>
        <Text style={[styles.restTimerTime, { color: getTimerColor() }]}>
          {timeLeft}s
        </Text>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: getTimerColor() },
            ]}
          />
        </View>

        {timeLeft <= 10 && (
          <Text style={styles.almostDoneText}>
            {wrapTextWithEmoji("כמעט גמרנו!", "💪")}
          </Text>
        )}

        <View style={styles.restTimerButtons}>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <MaterialCommunityIcons
              name="skip-next"
              size={20}
              color={theme.colors.text}
            />
            <Text style={styles.skipButtonText}>דלג</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addTimeButton}
            onPress={() => setTimeLeft((prev) => prev + 30)}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.addTimeButtonText}>+30s</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/** ---------- ExerciseItem ---------- */
interface ExerciseItemProps {
  exercise: WorkoutExercise;
  onCompleteSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onCompleteSet,
  onAddSet,
  onDeleteSet,
  onUpdateSet,
}) => {
  const getWeightHint = (equipment?: string): string => {
    switch (equipment) {
      case "dumbbells":
        return '💡 המלצה: התחל עם 3–5 ק"ג לכל משקולת יד';
      case "barbell":
        return '💡 המלצה: התחל עם מוט ריק (20 ק"ג)';
      case "kettlebell":
        return '💡 המלצה: התחל עם 8–12 ק"ג';
      case "resistance_bands":
        return "💡 התחל עם התנגדות קלה/בינונית";
      case "bodyweight":
        return "ℹ️ תרגיל משקל גוף – אין צורך במשקל נוסף";
      case "cable_machine":
        return '💡 המלצה: התחל עם 10–15 ק"ג';
      case "smith_machine":
        return '💡 המלצה: התחל עם מוט ריק (20 ק"ג)';
      default:
        return "💡 התחל עם משקל קל והתקדם בהדרגה";
    }
  };

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.muscleGroup}>
          {exercise.primaryMuscles?.[0] || "לא צוין"}
        </Text>
        <Text style={styles.weightHint}>
          {getWeightHint(exercise.equipment)}
        </Text>
      </View>

      {exercise.sets?.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
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

          <View style={styles.setContent}>
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

            <Text style={styles.setNumber}>{index + 1}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>חזרות</Text>
              <TextInput
                style={styles.inputField}
                value={(set.actualReps || set.targetReps || 0).toString()}
                onChangeText={(text) =>
                  onUpdateSet(exercise.id, set.id, "reps", parseInt(text) || 0)
                }
                keyboardType="numeric"
                textAlign="center"
                selectTextOnFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>משקל</Text>
              <TextInput
                style={styles.inputField}
                value={(set.actualWeight || set.targetWeight || 0).toString()}
                onChangeText={(text) =>
                  onUpdateSet(
                    exercise.id,
                    set.id,
                    "weight",
                    parseFloat(text) || 0
                  )
                }
                keyboardType="numeric"
                textAlign="center"
                selectTextOnFocus
              />
            </View>

            <View style={styles.volumeContainer}>
              <Text style={styles.volumeLabel}>נפח</Text>
              <Text style={styles.volumeValue}>
                {(
                  (set.actualReps || set.targetReps || 0) *
                  (set.actualWeight || set.targetWeight || 0)
                ).toFixed(0)}
              </Text>
            </View>
          </View>
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

/** ---------- Screen ---------- */
type ActiveWorkoutRouteProp = RouteProp<RootStackParamList, "ActiveWorkout">;

const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<ActiveWorkoutRouteProp>();

  const { workoutData, pendingExercise } = route.params || {};

  const createDefaultSet = (equipment?: string): Set => {
    let suggestedWeight = 0;
    let suggestedReps = 12;

    switch (equipment) {
      case "dumbbells":
        suggestedWeight = 5;
        break;
      case "barbell":
        suggestedWeight = 20;
        break;
      case "kettlebell":
        suggestedWeight = 8;
        break;
      case "resistance_bands":
        suggestedWeight = 0;
        suggestedReps = 15;
        break;
      case "bodyweight":
        suggestedWeight = 0;
        suggestedReps = 10;
        break;
      default:
        suggestedWeight = 5;
        break;
    }

    return {
      id: `${Date.now()}`,
      type: "working",
      targetWeight: suggestedWeight,
      targetReps: suggestedReps,
      completed: false,
    };
  };

  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    workoutData?.exercises || []
  );
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTime, setRestTime] = useState(60);

  const calculateRestTime = (exercise: WorkoutExercise): number => {
    const equipment = exercise.equipment;
    const primaryMuscle = exercise.primaryMuscles?.[0];
    if (equipment === "barbell" || equipment === "squat_rack") return 120;
    if (primaryMuscle === "legs" || primaryMuscle === "quadriceps") return 90;
    if (equipment === "bodyweight" || equipment === "resistance_bands")
      return 45;
    return 60;
  };

  const liveStats = useMemo(() => {
    if (!exercises?.length) return null;

    const formattedExercises = exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      category: exercise.category || "Unknown",
      primaryMuscles: exercise.primaryMuscles || ["Unknown"],
      equipment: exercise.equipment || "Unknown",
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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    setIsTimerRunning(true);
    return () => setIsTimerRunning(false);
  }, []);

  // ✅ שימוש בשדות שמוגדרים ב־RootStackParamList (אין category/primaryMuscles בפרמטר הניווט)
  useEffect(() => {
    if (pendingExercise && pendingExercise.id) {
      const newExercise: WorkoutExercise = {
        id: pendingExercise.id,
        name: pendingExercise.name,
        category: "Unknown",
        primaryMuscles: [pendingExercise.muscleGroup || "Unknown"],
        equipment: pendingExercise.equipment || "bodyweight",
        sets: [createDefaultSet(pendingExercise.equipment || "bodyweight")],
      };
      setExercises((prev) => [...prev, newExercise]);
    }
  }, [pendingExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedSets = liveStats?.completedSets || 0;
  const totalSets = liveStats?.totalSets || 0;
  const totalVolume = liveStats?.totalVolume || 0;

  const handleCompleteSet = (exerciseId: string, setId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    const set = exercise?.sets?.find((s) => s.id === setId);

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: (ex.sets || []).map((s) =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              ),
            }
          : ex
      )
    );

    if (exercise && set && !set.completed) {
      const currentSetIndex =
        exercise.sets?.findIndex((s) => s.id === setId) || 0;
      const hasMoreSetsInExercise =
        exercise.sets && currentSetIndex < exercise.sets.length - 1;
      const currentExerciseIndex = exercises.findIndex(
        (ex) => ex.id === exerciseId
      );
      const hasMoreExercises = currentExerciseIndex < exercises.length - 1;

      if (hasMoreSetsInExercise || hasMoreExercises) {
        const restDuration = calculateRestTime(exercise);
        setRestTime(restDuration);
        setShowRestTimer(true);
      }
    }
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise || !exercise.sets) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const defaultSet = createDefaultSet(exercise.equipment);

    const newSet: Set = {
      ...defaultSet,
      targetWeight:
        lastSet?.actualWeight ||
        lastSet?.targetWeight ||
        defaultSet.targetWeight,
      targetReps:
        lastSet?.actualReps || lastSet?.targetReps || defaultSet.targetReps,
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
          ? { ...ex, sets: (ex.sets || []).filter((s) => s.id !== setId) }
          : ex
      )
    );
  };

  const handleUpdateSet = (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: (ex.sets || []).map((s) =>
                s.id === setId
                  ? field === "weight"
                    ? { ...s, actualWeight: value, targetWeight: value }
                    : { ...s, actualReps: value, targetReps: value }
                  : s
              ),
            }
          : ex
      )
    );
  };

  const handleAddExercise = () => {
    navigation.navigate("ExercisesScreen", {
      fromScreen: "ActiveWorkout",
      mode: "selection",
      onSelectExercise: (selectedExercise: WorkoutExercise) => {
        const newExercise: WorkoutExercise = {
          ...selectedExercise,
          sets: [createDefaultSet(selectedExercise.equipment)],
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
            const workoutSummaryData = {
              workoutName: workoutData?.name || "אימון פעיל",
              exercises: exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                sets: (exercise.sets || []).map((s) => ({
                  reps: s.actualReps || s.targetReps || 0,
                  weight: s.actualWeight || s.targetWeight || 0,
                  completed: s.completed,
                })),
                restTime: 60,
              })),
              totalDuration: Math.floor(workoutTime / 60),
              totalSets: liveStats?.totalSets || 0,
              totalReps: liveStats?.totalReps || 0,
              totalVolume: liveStats?.totalVolume || 0,
              personalRecords: [],
              completedAt: new Date().toISOString(),
              difficulty: 3,
            };

            await nextWorkoutLogicService.updateWorkoutCompleted(0);

            navigation.navigate("WorkoutSummary", {
              workoutData: workoutSummaryData,
            });
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
        <View style={styles.beginnerTipsContainer}>
          <Text style={styles.beginnerTipsTitle}>
            {wrapTextWithEmoji("טיפים לאימון בטוח ויעיל", "💪")}
          </Text>
          <Text style={styles.beginnerTipsText}>
            • התחל עם משקלים קלים יותר ותתקדם בהדרגה{"\n"}• הקפד על ביצוע נכון
            לפני הוספת משקל{"\n"}• נוח 30-60 שניות בין סטים{"\n"}• הקשב לגופך
            ועצור אם אתה מרגיש כאב
          </Text>
        </View>

        {exercises.map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            onCompleteSet={handleCompleteSet}
            onAddSet={handleAddSet}
            onDeleteSet={handleDeleteSet}
            onUpdateSet={handleUpdateSet}
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

      {/* Rest Timer Overlay */}
      <RestTimer
        visible={showRestTimer}
        restTime={restTime}
        onComplete={() => setShowRestTimer(false)}
        onSkip={() => setShowRestTimer(false)}
      />
    </SafeAreaView>
  );
};

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
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
  workoutTitle: { fontSize: 18, fontWeight: "bold", color: theme.colors.text },
  workoutTime: { fontSize: 16, color: theme.colors.primary, marginTop: 4 },
  timerButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary + "20",
  },
  scrollView: { flex: 1, paddingHorizontal: theme.spacing.md },

  /* Exercise item */
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
    alignItems: "flex-end",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "right",
  },
  muscleGroup: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "right",
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "30",
    justifyContent: "space-between",
  },
  setContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    marginEnd: theme.spacing.sm,
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
  inputField: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    backgroundColor: theme.colors.background,
    textAlign: "center",
  },

  volumeContainer: {
    alignItems: "center",
    marginHorizontal: theme.spacing.sm,
    minWidth: 50,
  },
  volumeLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  volumeValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
  },

  completeButton: { padding: theme.spacing.sm },
  completedButton: { opacity: 1 },
  deleteButton: { padding: theme.spacing.sm },
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
    marginStart: theme.spacing.xs,
  },

  /* Footer / empty / tips */
  footer: {
    flexDirection: "row",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  addExerciseButton: { flex: 1 },
  finishButton: { flex: 2 },
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
  addButton: { marginTop: theme.spacing.lg },

  liveStatsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  liveStatItem: { alignItems: "center" },
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

  weightHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    marginTop: 4,
  },

  beginnerTipsContainer: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderStartWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  beginnerTipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  beginnerTipsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // Rest Timer
  restTimerOverlay: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  restTimerContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    alignItems: "center",
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  restTimerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  restTimerExplanation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  restTimerTime: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  almostDoneText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  restTimerButtons: { flexDirection: "row", gap: theme.spacing.md },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  skipButtonText: { fontSize: 16, color: theme.colors.text, fontWeight: "500" },
  addTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  addTimeButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "500",
  },
});

export default ActiveWorkoutScreen;
