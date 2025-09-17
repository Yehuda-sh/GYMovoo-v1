import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../core/theme";
import BackButton from "../../../../components/common/BackButton";
import AppButton from "../../../../components/common/AppButton";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";
import { calculateWorkoutStats } from "../../utils/workoutStatsCalculator";

import { WorkoutExercise, Set } from "../../../../core/types/workout.types";
import { RootStackParamList } from "../../../../navigation/types";

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
  // פונקציה לקבלת רמז למשקל לפי סוג ציוד
  const getWeightHint = (equipment?: string): string => {
    switch (equipment) {
      case "dumbbells":
        return '💡 המלצה: התחל עם 3-5 ק"ג לכל דמבל';
      case "barbell":
        return '💡 המלצה: התחל עם מוט ריק (20 ק"ג)';
      case "kettlebell":
        return '💡 המלצה: התחל עם 8-12 ק"ג';
      case "resistance_bands":
        return "💡 התחל עם התנגדות קלה/בינונית";
      case "bodyweight":
        return "ℹ️ תרגיל משקל גוף - אין צורך במשקל נוסף";
      case "cable_machine":
        return '💡 המלצה: התחל עם 10-15 ק"ג';
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
          {/* כפתור מחיקה - צד שמאל */}
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

          {/* אזור מרכזי עם כל השאר */}
          <View style={styles.setContent}>
            {/* כפתור השלמה */}
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

            {/* מספר סט */}
            <Text style={styles.setNumber}>{index + 1}</Text>

            {/* שדות עריכה - חזרות */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>חזרות</Text>
              <TextInput
                style={styles.inputField}
                value={(set.actualReps || set.targetReps || 0).toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 0;
                  onUpdateSet(exercise.id, set.id, "reps", value);
                }}
                keyboardType="numeric"
                textAlign="center"
                selectTextOnFocus
              />
            </View>

            {/* שדות עריכה - משקל */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>משקל</Text>
              <TextInput
                style={styles.inputField}
                value={(set.actualWeight || set.targetWeight || 0).toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) || 0;
                  onUpdateSet(exercise.id, set.id, "weight", value);
                }}
                keyboardType="numeric"
                textAlign="center"
                selectTextOnFocus
              />
            </View>

            {/* נפח הסט (חזרות × משקל) */}
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  const { workoutData, pendingExercise } = (route.params as RouteParams) || {};

  // Helper function to create default set with suggested weights
  const createDefaultSet = (equipment?: string): Set => {
    let suggestedWeight = 0;
    let suggestedReps = 12;

    // הצעות משקל לפי סוג הציוד
    switch (equipment) {
      case "dumbbells":
        suggestedWeight = 5; // 5 ק"ג לכל דמבל
        break;
      case "barbell":
        suggestedWeight = 20; // מוט ריק
        break;
      case "kettlebell":
        suggestedWeight = 8; // קטל בל בסיסי
        break;
      case "resistance_bands":
        suggestedWeight = 0; // בלי משקל
        suggestedReps = 15; // יותר חזרות
        break;
      case "bodyweight":
        suggestedWeight = 0; // משקל גוף
        suggestedReps = 10; // פחות חזרות לתרגילי משקל גוף
        break;
      default:
        suggestedWeight = 5; // ברירת מחדל
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
        sets: [createDefaultSet(pendingExercise.equipment || "bodyweight")],
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

  // Get stats from liveStats to avoid duplication
  const completedSets = liveStats?.completedSets || 0;
  const totalSets = liveStats?.totalSets || 0;
  const totalVolume = liveStats?.totalVolume || 0;

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
          ? { ...ex, sets: (ex.sets || []).filter((set) => set.id !== setId) }
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
              sets: (ex.sets || []).map((set) =>
                set.id === setId
                  ? {
                      ...set,
                      ...(field === "weight"
                        ? { actualWeight: value, targetWeight: value }
                        : { actualReps: value, targetReps: value }),
                    }
                  : set
              ),
            }
          : ex
      )
    );
  };

  const handleAddExercise = () => {
    navigation.navigate("ExerciseList", {
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
            // יצירת נתוני סיכום אימון
            const workoutSummaryData = {
              workoutName: workoutData?.name || "אימון פעיל",
              exercises: exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                sets: (exercise.sets || []).map((set) => ({
                  reps: set.actualReps || set.targetReps || 0,
                  weight: set.actualWeight || set.targetWeight || 0,
                  completed: set.completed,
                })),
                restTime: 60, // ברירת מחדל
              })),
              totalDuration: Math.floor(workoutTime / 60), // המרה לדקות
              totalSets: liveStats?.totalSets || 0,
              totalReps: liveStats?.totalReps || 0,
              totalVolume: liveStats?.totalVolume || 0,
              personalRecords: [], // לעת עתה ריק
              completedAt: new Date().toISOString(),
              difficulty: 3, // ברירת מחדל
            };

            // עדכון שהאימון הושלם
            await nextWorkoutLogicService.updateWorkoutCompleted(0);

            // מעבר למסך סיכום
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
        {/* הנחיות למתחילים */}
        <View style={styles.beginnerTipsContainer}>
          <Text style={styles.beginnerTipsTitle}>
            💪 טיפים לאימון בטוח ויעיל
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
    alignItems: "flex-end", // יישור לימין לטקסט עברי
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "right", // יישור טקסט לימין
  },
  muscleGroup: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "right", // יישור טקסט לימין
  },
  setRow: {
    flexDirection: "row", // שורה רגילה
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "30",
    justifyContent: "space-between", // מפזר בין הקצוות
  },
  setContent: {
    flexDirection: "row-reverse", // RTL למרכז
    alignItems: "center",
    flex: 1,
    marginRight: theme.spacing.sm, // רווח מכפתור המחיקה
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
    borderLeftWidth: 4,
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
});

export default ActiveWorkoutScreen;
