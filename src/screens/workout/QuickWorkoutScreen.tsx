/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @description מסך אימון מהיר עם עיצוב משופר וקומפקטי
 * English: Quick workout screen with improved and compact design
 */
// cspell:ignore קומפוננטות, קומפוננטה, סקוואט, במודאלים, לדשבורד, הדשבורד, Subviews

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  FlatList,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { generateQuickWorkout } from "../../services/quickWorkoutGenerator";
import { useUserPreferences } from "../../hooks/useUserPreferences";

// Components - תיקון הייבוא
import { WorkoutHeader } from "./components/WorkoutHeader";
import { WorkoutDashboard } from "./components/WorkoutDashboard";
import { RestTimer } from "./components/RestTimer";
import ExerciseCard from "./components/ExerciseCard"; // שינוי לייבוא default
import { NextExerciseBar } from "./components/NextExerciseBar";
import { WorkoutSummary } from "./components/WorkoutSummary";
import { PlateCalculatorModal } from "./components/PlateCalculatorModal";
import { ExerciseTipsModal } from "./components/ExerciseTipsModal";
import FloatingActionButton from "../../components/workout/FloatingActionButton";

// Hooks & Services
import { useWorkoutTimer } from "./hooks/useWorkoutTimer";
import { useRestTimer } from "./hooks/useRestTimer";
import autoSaveService from "./services/autoSaveService";

// Types
import { Exercise, WorkoutData, Set } from "./types/workout.types";

const initialExercises: Exercise[] = [
  {
    id: "1",
    name: "לחיצת חזה במוט",
    category: "חזה",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "שרירי היד האחוריים"],
    equipment: "מוט",
    sets: [
      {
        id: "1-1",
        type: "warmup",
        targetReps: 15,
        targetWeight: 40,
        completed: false,
        isPR: false,
      },
      {
        id: "1-2",
        type: "working",
        targetReps: 10,
        targetWeight: 60,
        completed: false,
        isPR: false,
      },
      {
        id: "1-3",
        type: "working",
        targetReps: 10,
        targetWeight: 60,
        completed: false,
        isPR: false,
      },
      {
        id: "1-4",
        type: "working",
        targetReps: 8,
        targetWeight: 65,
        completed: false,
        isPR: false,
      },
    ],
    restTime: 90,
    notes: "התחמם היטב לפני הסטים הכבדים",
  },
  {
    id: "2",
    name: "חתירה בכבלים",
    category: "גב",
    primaryMuscles: ["גב"],
    secondaryMuscles: ["שרירי היד הקדמיים"],
    equipment: "כבלים",
    sets: [
      {
        id: "2-1",
        type: "working",
        targetReps: 12,
        targetWeight: 50,
        completed: false,
        isPR: false,
      },
      {
        id: "2-2",
        type: "working",
        targetReps: 12,
        targetWeight: 50,
        completed: false,
        isPR: false,
      },
      {
        id: "2-3",
        type: "working",
        targetReps: 10,
        targetWeight: 55,
        completed: false,
        isPR: false,
      },
    ],
    restTime: 60,
  },
  {
    id: "3",
    name: "סקוואט",
    category: "רגליים",
    primaryMuscles: ["רגליים", "ישבן"],
    secondaryMuscles: ["core"],
    equipment: "מוט",
    sets: [
      {
        id: "3-1",
        type: "warmup",
        targetReps: 12,
        targetWeight: 40,
        completed: false,
        isPR: false,
      },
      {
        id: "3-2",
        type: "working",
        targetReps: 8,
        targetWeight: 80,
        completed: false,
        isPR: false,
      },
      {
        id: "3-3",
        type: "working",
        targetReps: 8,
        targetWeight: 80,
        completed: false,
        isPR: false,
      },
      {
        id: "3-4",
        type: "working",
        targetReps: 6,
        targetWeight: 90,
        completed: false,
        isPR: false,
      },
    ],
    restTime: 120,
    notes: "שמור על גב ישר וירידה עמוקה",
  },
];

// הגדרות FAB
// FAB Configuration
const FAB_CONFIG = {
  showLabel: true,
  labelDuration: 3000, // 3 שניות
};

const QuickWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const [workoutName, setWorkoutName] = useState("אימון מהיר");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(true);

  // גישה לנתוני המשתמש
  // Access user data
  const { userGoal, preferredDuration, hasCompletedQuestionnaire } =
    useUserPreferences();

  // מצב FAB
  const [fabVisible, setFabVisible] = useState(true);
  const [fabLabelVisible, setFabLabelVisible] = useState(true);

  // מודלים (modals)
  const [modals, setModals] = useState({
    plateCalculator: false,
    exerciseTips: false,
  });

  const [modalData, setModalData] = useState<{
    plateCalculatorWeight?: number;
    selectedExercise?: Exercise;
  }>({});

  // הגדרות טיימרים
  const workoutId = `quick-workout-${Date.now()}`;
  const { elapsedTime, formattedTime, isRunning, startTimer, pauseTimer } =
    useWorkoutTimer(workoutId);
  const {
    isRestTimerActive,
    restTimeRemaining,
    startRestTimer,
    pauseRestTimer,
    resumeRestTimer,
    skipRestTimer,
  } = useRestTimer();

  // אנימציות
  const dashboardAnimation = useRef(new Animated.Value(0)).current;

  // טעינת אימון מותאם אישית
  // Load personalized workout
  useEffect(() => {
    loadPersonalizedWorkout();
  }, []);

  const loadPersonalizedWorkout = async () => {
    try {
      setIsLoadingWorkout(true);

      // אם המשתמש השלים שאלון, צור אימון מותאם
      // If user completed questionnaire, create personalized workout
      if (hasCompletedQuestionnaire) {
        const personalizedExercises = await generateQuickWorkout();
        if (personalizedExercises.length > 0) {
          setExercises(personalizedExercises);

          // עדכון שם האימון לפי המטרה
          // Update workout name by goal
          const workoutNames: { [key: string]: string } = {
            "ירידה במשקל": "אימון קרדיו לירידה במשקל",
            "עליה במסת שריר": "אימון בניית שריר",
            "שיפור כוח": "אימון כוח",
            "שיפור סיבולת": "אימון סיבולת",
            "בריאות כללית": "אימון מאוזן",
            "שיקום מפציעה": "אימון שיקומי",
          };
          setWorkoutName(workoutNames[userGoal] || "אימון מותאם אישית");
        } else {
          // אם אין תרגילים מתאימים, השתמש בברירת מחדל
          // If no suitable exercises, use default
          setExercises(initialExercises);
        }
      } else {
        // אם לא השלים שאלון, השתמש באימון ברירת מחדל
        // If didn't complete questionnaire, use default workout
        setExercises(initialExercises);

        // הצג הודעה למשתמש
        // Show message to user
        setTimeout(() => {
          Alert.alert(
            "אימון מותאם אישית",
            "השלם את השאלון כדי לקבל אימונים מותאמים אישית לפי המטרות והיכולות שלך",
            [
              { text: "אחר כך", style: "cancel" },
              {
                text: "לשאלון",
                onPress: () =>
                  navigation.navigate("DynamicQuestionnaire" as never),
              },
            ]
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error loading personalized workout:", error);
      setExercises(initialExercises);
    } finally {
      setIsLoadingWorkout(false);
    }
  };

  // הסתרת תווית FAB אחרי זמן מוגדר
  useEffect(() => {
    const timer = setTimeout(() => {
      setFabLabelVisible(false);
    }, FAB_CONFIG.labelDuration);

    return () => clearTimeout(timer);
  }, []);

  // פתיחה/סגירה של דשבורד
  const toggleDashboard = useCallback(() => {
    const toValue = dashboardVisible ? 0 : 1;
    setDashboardVisible(!dashboardVisible);

    Animated.spring(dashboardAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [dashboardVisible, dashboardAnimation]);

  // התחלת אימון
  useEffect(() => {
    startTimer();
    autoSaveService.startAutoSave(workoutId, () => ({
      id: workoutId,
      name: workoutName,
      startTime: new Date().toISOString(),
      duration: elapsedTime,
      exercises: exercises,
      totalVolume: stats.totalVolume,
    }));

    return () => {
      autoSaveService.stopAutoSave();
    };
  }, []);

  // חישובי סטטיסטיקות
  const stats = useMemo(() => {
    let completedSets = 0;
    let totalVolume = 0;
    let totalReps = 0;

    exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.completed && set.actualReps && set.actualWeight) {
          completedSets++;
          totalReps += set.actualReps;
          totalVolume += set.actualReps * set.actualWeight;
        }
      });
    });

    return {
      completedSets,
      totalSets: exercises.reduce((acc, ex) => acc + ex.sets.length, 0),
      totalVolume,
      totalReps,
      currentPace: totalReps > 0 ? Math.round(elapsedTime / totalReps) : 0,
    };
  }, [exercises, elapsedTime]);

  // התרגיל הבא
  const nextExercise = useMemo(() => {
    const incompleteExercise = exercises.find((ex) =>
      ex.sets.some((set) => !set.completed)
    );
    return incompleteExercise || null;
  }, [exercises]);

  // Handlers
  const handleEditWorkoutName = useCallback(() => {
    Alert.prompt(
      "שם האימון",
      "הכנס שם חדש לאימון",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "שמור",
          onPress: (newName) => {
            if (newName && newName.trim()) {
              setWorkoutName(newName.trim());
            }
          },
        },
      ],
      "plain-text",
      workoutName
    );
  }, [workoutName]);

  const handleFinishWorkout = useCallback(() => {
    if (stats.completedSets === 0) {
      Alert.alert(
        "אין סטים שהושלמו",
        "יש להשלים לפחות סט אחד לפני סיום האימון"
      );
      return;
    }

    const workoutData: WorkoutData = {
      id: `workout-${Date.now()}`,
      name: workoutName,
      startTime: new Date().toISOString(),
      duration: elapsedTime,
      exercises: exercises,
      totalVolume: stats.totalVolume,
    };

    autoSaveService.saveWorkoutState(workoutData);
    setShowSummary(true);
  }, [workoutName, elapsedTime, exercises, stats]);

  // עיבוד המסך
  // Render screen
  if (isLoadingWorkout) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={80}
          color={theme.colors.primary}
        />
        <Text style={styles.loadingText}>יוצר אימון מותאם אישית...</Text>
        <Text style={styles.loadingSubtext}>
          {hasCompletedQuestionnaire
            ? `מתאים אימון ל${userGoal}`
            : "טוען אימון ברירת מחדל"}
        </Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* Header קומפקטי */}
        <WorkoutHeader
          workoutName={workoutName}
          elapsedTime={formattedTime}
          onTimerPress={() => (isRunning ? pauseTimer() : startTimer())}
          onNamePress={handleEditWorkoutName}
          onMenuPress={toggleDashboard}
        />

        {/* Main Content - FlatList במקום ScrollView */}
        <FlatList
          style={styles.listStyle}
          contentContainerStyle={styles.listContent}
          data={exercises}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            isRestTimerActive ? (
              <RestTimer
                timeLeft={restTimeRemaining}
                progress={0} // TODO: calculate actual progress
                isPaused={false} // TODO: track pause state
                nextExercise={nextExercise}
                onPause={pauseRestTimer}
                onSkip={skipRestTimer}
                onAddTime={(seconds: number) => {
                  // TODO: implement add time
                  console.log("Add time:", seconds);
                }}
                onSubtractTime={(seconds: number) => {
                  // TODO: implement subtract time
                  console.log("Subtract time:", seconds);
                }}
              />
            ) : null
          }
          renderItem={({ item, index }) => (
            <ExerciseCard
              exercise={item}
              sets={item.sets}
              onUpdateSet={(setId: string, updates: Partial<Set>) => {
                const newExercises = [...exercises];
                const exerciseIndex = newExercises.findIndex(
                  (ex) => ex.id === item.id
                );
                const setIndex = newExercises[exerciseIndex].sets.findIndex(
                  (s) => s.id === setId
                );
                if (setIndex !== -1) {
                  newExercises[exerciseIndex].sets[setIndex] = {
                    ...newExercises[exerciseIndex].sets[setIndex],
                    ...updates,
                  };
                  setExercises(newExercises);
                }
              }}
              onAddSet={() => {
                const newExercises = [...exercises];
                const exerciseIndex = newExercises.findIndex(
                  (ex) => ex.id === item.id
                );
                const lastSet = item.sets[item.sets.length - 1];
                const newSet = {
                  id: `${item.id}_set_${Date.now()}`,
                  type: "working" as const,
                  targetReps: lastSet?.targetReps || 10,
                  targetWeight: lastSet?.targetWeight || 0,
                  completed: false,
                  isPR: false,
                };
                newExercises[exerciseIndex].sets.push(newSet);
                setExercises(newExercises);
              }}
              onCompleteSet={(setId: string) => {
                const newExercises = [...exercises];
                const exerciseIndex = newExercises.findIndex(
                  (ex) => ex.id === item.id
                );
                const setIndex = newExercises[exerciseIndex].sets.findIndex(
                  (s) => s.id === setId
                );
                if (setIndex !== -1) {
                  newExercises[exerciseIndex].sets[setIndex].completed =
                    !newExercises[exerciseIndex].sets[setIndex].completed;
                  setExercises(newExercises);
                }
              }}
              onRemoveExercise={() => {
                const newExercises = exercises.filter(
                  (ex) => ex.id !== item.id
                );
                setExercises(newExercises);
              }}
              onStartRest={(duration: number) => {
                startRestTimer(duration, item.name);
              }}
              isFirst={index === 0}
              isLast={index === exercises.length - 1}
            />
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinishWorkout}
            >
              <Text style={styles.finishButtonText}>סיים אימון</Text>
            </TouchableOpacity>
          }
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            // הסתרת/הצגת FAB בגלילה
            const offsetY = event.nativeEvent.contentOffset.y;
            const velocity = event.nativeEvent.velocity?.y || 0;

            if (velocity > 0.5) {
              // גלילה למטה - הסתר FAB
              setFabVisible(false);
            } else if (velocity < -0.5) {
              // גלילה למעלה - הצג FAB
              setFabVisible(true);
            }
          }}
          scrollEventThrottle={16}
        />

        {/* Next Exercise Bar */}
        {nextExercise && !isRestTimerActive && (
          <NextExerciseBar
            nextExercise={nextExercise}
            onSkipToNext={() => {
              // TODO: implement skip to next logic
              console.log("Skip to next exercise:", nextExercise.name);
            }}
          />
        )}

        {/* FAB */}
        <FloatingActionButton
          visible={fabVisible}
          label={fabLabelVisible ? "התחל עכשיו" : undefined}
          onPress={() => {
            // מצא את הסט הבא שלא הושלם
            const nextSet = exercises
              .flatMap((ex) => ex.sets.map((set) => ({ exercise: ex, set })))
              .find(({ set }) => !set.completed);

            if (nextSet) {
              Alert.alert(
                "התחל סט",
                `${nextSet.exercise.name} - ${nextSet.set.targetReps} חזרות`,
                [
                  { text: "ביטול", style: "cancel" },
                  {
                    text: "התחל",
                    onPress: () => console.log("Starting set..."),
                  },
                ]
              );
            }
          }}
        />
      </KeyboardAvoidingView>

      {/* Dashboard Drawer */}
      <Animated.View
        style={[
          styles.dashboardDrawer,
          {
            transform: [
              {
                translateY: dashboardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-300, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents={dashboardVisible ? "auto" : "none"}
      >
        <WorkoutDashboard
          totalVolume={stats.totalVolume}
          completedSets={stats.completedSets}
          totalSets={stats.totalSets}
          pace={stats.currentPace}
          personalRecords={0} // TODO: calculate personal records
          elapsedTime={formattedTime}
        />
        <TouchableOpacity
          style={styles.closeDashboard}
          onPress={() => setDashboardVisible(false)}
        >
          <MaterialCommunityIcons
            name="chevron-up"
            size={24}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Modals */}
      {modals.plateCalculator && (
        <PlateCalculatorModal
          visible={modals.plateCalculator}
          onClose={() =>
            setModals((prev) => ({ ...prev, plateCalculator: false }))
          }
          currentWeight={modalData.plateCalculatorWeight}
        />
      )}
      {modals.exerciseTips && modalData.selectedExercise && (
        <ExerciseTipsModal
          visible={modals.exerciseTips}
          onClose={() =>
            setModals((prev) => ({ ...prev, exerciseTips: false }))
          }
          exerciseName={modalData.selectedExercise.name}
        />
      )}

      {/* Workout Summary */}
      {showSummary && (
        <WorkoutSummary
          workout={{
            id: `workout-${Date.now()}`,
            name: workoutName,
            startTime: new Date(Date.now() - elapsedTime * 1000).toISOString(),
            duration: elapsedTime,
            exercises: exercises,
            totalVolume: stats.totalVolume,
          }}
          onClose={() => {
            setShowSummary(false);
            navigation.goBack();
          }}
          onSave={() => {
            setShowSummary(false);
            navigation.goBack();
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  loadingSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  listStyle: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 60,
  },
  finishButton: {
    backgroundColor: theme.colors.success,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dashboardDrawer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.large,
  },
  closeDashboard: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

// הוספת export default בסוף הקובץ
export default QuickWorkoutScreen;
