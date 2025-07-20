/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @description מסך האימון האולטימטיבי - חכם, אדפטיבי ומניע
 * English: The Ultimate Workout Screen - Smart, Adaptive & Motivating
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Alert,
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Vibration,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Foundation,
} from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// רשימת תרגילים פופולריים להתחלה מהירה
const POPULAR_EXERCISES = [
  {
    id: "1",
    name: "לחיצת חזה",
    icon: "weight-lifter",
    muscle: "חזה",
    defaultRest: 180,
  },
  {
    id: "2",
    name: "סקוואט",
    icon: "human-handsdown",
    muscle: "רגליים",
    defaultRest: 180,
  },
  {
    id: "3",
    name: "משיכה לסנטר",
    icon: "arm-flex",
    muscle: "גב",
    defaultRest: 120,
  },
  {
    id: "4",
    name: "לחיצת כתפיים",
    icon: "weight",
    muscle: "כתפיים",
    defaultRest: 120,
  },
  {
    id: "5",
    name: "כפיפת ברכיים",
    icon: "human",
    muscle: "בטן",
    defaultRest: 60,
  },
  {
    id: "6",
    name: "כפיפת מרפקים",
    icon: "dumbbell",
    muscle: "זרועות",
    defaultRest: 90,
  },
];

interface Set {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
  type: string;
  previousWeight?: string;
  previousReps?: string;
  rpe?: number;
  rir?: number;
  isPR?: boolean;
}

interface WorkoutExercise {
  id: string;
  name: string;
  muscle: string;
  sets: Set[];
  restTime: number;
  notes?: string;
  targetVolume?: number;
  currentVolume: number;
  lastWorkoutVolume?: number;
  personalRecord?: { weight: number; reps: number };
}

export default function QuickWorkoutScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);

  // States
  const [workoutName, setWorkoutName] = useState("אימון מהיר");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [workoutPace, setWorkoutPace] = useState(0);
  const [showPlateCalculator, setShowPlateCalculator] = useState(false);
  const [targetWeight, setTargetWeight] = useState(0);
  const [showTips, setShowTips] = useState<string | null>(null);
  const [showRPEModal, setShowRPEModal] = useState<{
    exerciseId: string;
    setId: string;
  } | null>(null);
  const [personalRecords, setPersonalRecords] = useState<string[]>([]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const volumeAnim = useRef(new Animated.Value(0)).current;
  const prAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // AI Recommendations (מדומה כרגע)
  const getAIRecommendation = (exercise: WorkoutExercise, setIndex: number) => {
    const lastWeight = parseFloat(exercise.sets[0]?.previousWeight || "0");
    const lastReps = parseInt(exercise.sets[0]?.previousReps || "0");

    // לוגיקה פשוטה להתקדמות לינארית
    if (lastWeight > 0) {
      return {
        weight: lastWeight + 2.5,
        reps: lastReps,
        reason: "התקדמות לינארית מומלצת",
      };
    }
    return null;
  };

  // Workout Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTime((prev) => {
          const newTime = prev + 1;
          // חישוב קצב אימון (נפח לדקה)
          if (newTime > 0 && totalVolume > 0) {
            setWorkoutPace(Math.round((totalVolume / newTime) * 60));
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, totalVolume]);

  // Rest Timer with Pulse Animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      // אנימציית פעימה
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            // רטט בסיום
            Vibration.vibrate([0, 200, 100, 200]);
            Alert.alert("⏰ זמן המנוחה הסתיים", "זמן לסט הבא!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      pulseAnim.stopAnimation();
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  // חישוב נפח כולל
  useEffect(() => {
    let volume = 0;
    exercises.forEach((exercise) => {
      let exerciseVolume = 0;
      exercise.sets.forEach((set) => {
        if (set.completed && set.weight && set.reps) {
          exerciseVolume += parseFloat(set.weight) * parseInt(set.reps);
        }
      });
      exercise.currentVolume = exerciseVolume;
      volume += exerciseVolume;
    });

    setTotalVolume(volume);

    // אנימציה של עליית הנפח
    Animated.timing(volumeAnim, {
      toValue: volume,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [exercises]);

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const addExercise = (exercise: (typeof POPULAR_EXERCISES)[0]) => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: exercise.name,
      muscle: exercise.muscle,
      sets: [
        {
          id: "1",
          weight: "",
          reps: "",
          completed: false,
          type: "normal",
          previousWeight: "50",
          previousReps: "10",
        },
        {
          id: "2",
          weight: "",
          reps: "",
          completed: false,
          type: "normal",
          previousWeight: "50",
          previousReps: "10",
        },
        {
          id: "3",
          weight: "",
          reps: "",
          completed: false,
          type: "normal",
          previousWeight: "50",
          previousReps: "10",
        },
      ],
      restTime: exercise.defaultRest,
      currentVolume: 0,
      lastWorkoutVolume: 1500, // מדומה
      personalRecord: { weight: 55, reps: 10 },
    };
    setExercises([...exercises, newExercise]);
    setShowExercisePicker(false);
  };

  const checkForPR = (exerciseId: string, weight: number, reps: number) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (exercise?.personalRecord) {
      const currentTotal = weight * reps;
      const prTotal =
        exercise.personalRecord.weight * exercise.personalRecord.reps;

      if (currentTotal > prTotal || weight > exercise.personalRecord.weight) {
        // שיא חדש!
        Animated.sequence([
          Animated.timing(prAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(prAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        Vibration.vibrate([0, 100, 50, 100]);
        setPersonalRecords([...personalRecords, exerciseId]);
        return true;
      }
    }
    return false;
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: string
  ) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                const updatedSet = { ...set, [field]: value };

                // בדיקת שיא אישי
                if (field === "reps" && updatedSet.weight && value) {
                  const isPR = checkForPR(
                    exerciseId,
                    parseFloat(updatedSet.weight),
                    parseInt(value)
                  );
                  updatedSet.isPR = isPR;
                }

                return updatedSet;
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    const set = exercise?.sets.find((s) => s.id === setId);

    if (!set?.completed && exercise) {
      // התחל טיימר מנוחה
      setRestTimer(exercise.restTime);
      setIsResting(true);
      setActiveExerciseId(exerciseId);
    }

    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((s) =>
              s.id === setId ? { ...s, completed: !s.completed } : s
            ),
          };
        }
        return ex;
      })
    );
  };

  const getNextExercise = () => {
    const currentIndex = exercises.findIndex(
      (ex) => ex.id === activeExerciseId
    );
    if (currentIndex < exercises.length - 1) {
      return exercises[currentIndex + 1];
    }
    return null;
  };

  const calculatePlates = (targetWeight: number) => {
    const barWeight = 20; // משקל מוט סטנדרטי
    const remainingWeight = targetWeight - barWeight;
    const weightPerSide = remainingWeight / 2;

    const plates = [20, 15, 10, 5, 2.5, 1.25];
    const result: number[] = [];
    let remaining = weightPerSide;

    for (const plate of plates) {
      while (remaining >= plate) {
        result.push(plate);
        remaining -= plate;
      }
    }

    return result;
  };

  const finishWorkout = () => {
    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

    Alert.alert(
      "🎉 סיכום האימון",
      `⏱️ זמן: ${formatTime(workoutTime)}\n` +
        `💪 תרגילים: ${exercises.length}\n` +
        `✅ סטים: ${completedSets}/${totalSets}\n` +
        `📊 נפח כולל: ${totalVolume.toFixed(0)} ק"ג\n` +
        `⚡ קצב: ${workoutPace} ק"ג/דקה\n` +
        `🏆 שיאים חדשים: ${personalRecords.length}\n\n` +
        `האם לשמור את האימון?`,
      [
        {
          text: "שמור וצא",
          onPress: () => {
            console.log("💾 Saving workout...");
            navigation.goBack();
          },
        },
        {
          text: "צא בלי לשמור",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
        { text: "המשך", style: "cancel" },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Dynamic Header Dashboard */}
      <LinearGradient colors={["#007AFF", "#0056D6"]} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <TextInput
            style={styles.workoutNameInput}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="שם האימון"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
        </View>

        <TouchableOpacity onPress={finishWorkout}>
          <Text style={styles.finishText}>סיום</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Live Dashboard */}
      <View style={styles.dashboard}>
        <View style={styles.dashboardItem}>
          <Ionicons name="time-outline" size={16} color="#8E8E93" />
          <Text style={styles.dashboardValue}>{formatTime(workoutTime)}</Text>
          <Text style={styles.dashboardLabel}>זמן</Text>
        </View>

        <Animated.View style={styles.dashboardItem}>
          <Ionicons name="barbell-outline" size={16} color="#8E8E93" />
          <Animated.Text style={styles.dashboardValue}>
            {totalVolume.toFixed(0)}
          </Animated.Text>
          <Text style={styles.dashboardLabel}>ק"ג</Text>
        </Animated.View>

        <View style={styles.dashboardItem}>
          <Ionicons name="speedometer-outline" size={16} color="#8E8E93" />
          <Text style={styles.dashboardValue}>{workoutPace}</Text>
          <Text style={styles.dashboardLabel}>ק"ג/דקה</Text>
        </View>

        <View style={styles.dashboardItem}>
          <Ionicons name="trophy-outline" size={16} color="#FFD700" />
          <Text style={[styles.dashboardValue, { color: "#FFD700" }]}>
            {personalRecords.length}
          </Text>
          <Text style={styles.dashboardLabel}>שיאים</Text>
        </View>
      </View>

      {/* Rest Timer */}
      {isResting && (
        <Animated.View
          style={[
            styles.restTimerContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.restTimerLabel}>זמן מנוחה</Text>
          <Text style={styles.restTimerValue}>{formatTime(restTimer)}</Text>

          {/* הצגת הסט הבא */}
          {activeExerciseId && (
            <View style={styles.nextSetInfo}>
              <Text style={styles.nextSetLabel}>הסט הבא:</Text>
              <Text style={styles.nextSetTarget}>
                {exercises
                  .find((ex) => ex.id === activeExerciseId)
                  ?.sets.find((s) => !s.completed)?.previousWeight || "?"}{" "}
                ק"ג |{" "}
                {exercises
                  .find((ex) => ex.id === activeExerciseId)
                  ?.sets.find((s) => !s.completed)?.previousReps || "?"}{" "}
                חזרות
              </Text>
            </View>
          )}

          <View style={styles.restTimerActions}>
            <TouchableOpacity
              style={[styles.restTimerButton, styles.timeAdjustButton]}
              onPress={() => setRestTimer((prev) => Math.max(0, prev - 15))}
            >
              <Ionicons name="remove" size={24} color="#fff" />
              <Text style={styles.restTimerButtonText}>15</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.restTimerButton, styles.skipButton]}
              onPress={() => {
                setRestTimer(0);
                setIsResting(false);
              }}
            >
              <Text style={styles.skipButtonText}>דלג</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.restTimerButton, styles.timeAdjustButton]}
              onPress={() => setRestTimer((prev) => prev + 15)}
            >
              <Text style={styles.restTimerButtonText}>15</Text>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Next Exercise Preview */}
      {getNextExercise() && (
        <View style={styles.nextExerciseBar}>
          <Text style={styles.nextExerciseLabel}>הבא בתור:</Text>
          <Text style={styles.nextExerciseName}>{getNextExercise()?.name}</Text>
        </View>
      )}

      {/* Exercise List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((exercise) => {
          const recommendation = getAIRecommendation(exercise, 0);
          const progressPercent = exercise.lastWorkoutVolume
            ? (exercise.currentVolume / exercise.lastWorkoutVolume) * 100
            : 0;

          return (
            <Animated.View
              key={exercise.id}
              style={[
                styles.exerciseCard,
                personalRecords.includes(exercise.id) && styles.prCard,
              ]}
            >
              {/* Exercise Header */}
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseInfo}>
                  <TouchableOpacity
                    style={styles.plateCalculatorIcon}
                    onPress={() => {
                      setTargetWeight(
                        parseFloat(exercise.sets[0]?.weight || "0")
                      );
                      setShowPlateCalculator(true);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="weight-kilogram"
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.tipsIcon}
                    onPress={() => setShowTips(exercise.id)}
                  >
                    <MaterialCommunityIcons
                      name="lightbulb-outline"
                      size={20}
                      color="#FFD700"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setExercises(
                        exercises.filter((ex) => ex.id !== exercise.id)
                      )
                    }
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>

                <View style={styles.exerciseNameContainer}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(progressPercent, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {exercise.currentVolume} / {exercise.lastWorkoutVolume} ק"ג
                </Text>
              </View>

              {/* AI Recommendation */}
              {recommendation && (
                <View style={styles.aiRecommendation}>
                  <MaterialCommunityIcons
                    name="robot"
                    size={16}
                    color="#007AFF"
                  />
                  <Text style={styles.aiText}>
                    המלצת AI: {recommendation.weight} ק"ג ×{" "}
                    {recommendation.reps} חזרות
                  </Text>
                </View>
              )}

              {/* Sets Table */}
              <View style={styles.setsContainer}>
                <View style={styles.setsHeader}>
                  <Text style={styles.headerLabel}>RPE</Text>
                  <Text style={styles.headerLabel}>✓</Text>
                  <Text style={styles.headerLabel}>חזרות</Text>
                  <Text style={styles.headerLabel}>משקל</Text>
                  <Text style={styles.headerLabel}>קודם</Text>
                  <Text style={styles.headerLabel}>סט</Text>
                </View>

                {exercise.sets.map((set, index) => (
                  <View
                    key={set.id}
                    style={[
                      styles.setRow,
                      set.completed && styles.completedSetRow,
                      set.isPR && styles.prSetRow,
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.rpeButton}
                      onPress={() =>
                        setShowRPEModal({
                          exerciseId: exercise.id,
                          setId: set.id,
                        })
                      }
                    >
                      <Text style={styles.rpeText}>{set.rpe || "-"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        set.completed && styles.checkboxCompleted,
                      ]}
                      onPress={() => toggleSetComplete(exercise.id, set.id)}
                    >
                      {set.completed && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </TouchableOpacity>

                    <TextInput
                      style={[
                        styles.input,
                        set.completed && styles.completedInput,
                      ]}
                      placeholder="0"
                      placeholderTextColor="#666"
                      value={set.reps}
                      onChangeText={(value) =>
                        updateSet(exercise.id, set.id, "reps", value)
                      }
                      keyboardType="numeric"
                      editable={!set.completed}
                    />

                    <TextInput
                      style={[
                        styles.input,
                        set.completed && styles.completedInput,
                      ]}
                      placeholder="0"
                      placeholderTextColor="#666"
                      value={set.weight}
                      onChangeText={(value) =>
                        updateSet(exercise.id, set.id, "weight", value)
                      }
                      keyboardType="numeric"
                      editable={!set.completed}
                    />

                    <Text style={styles.previousText}>
                      {set.previousWeight}×{set.previousReps}
                    </Text>

                    <View style={styles.setNumberContainer}>
                      <Text style={styles.setNumber}>{index + 1}</Text>
                      {set.isPR && (
                        <Animated.View
                          style={{ transform: [{ scale: prAnimation }] }}
                        >
                          <MaterialCommunityIcons
                            name="trophy"
                            size={16}
                            color="#FFD700"
                          />
                        </Animated.View>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Add Set Button */}
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => {
                  setExercises(
                    exercises.map((ex) => {
                      if (ex.id === exercise.id) {
                        const lastSet = ex.sets[ex.sets.length - 1];
                        const newSet: Set = {
                          id: (ex.sets.length + 1).toString(),
                          weight: lastSet?.weight || "",
                          reps: lastSet?.reps || "",
                          completed: false,
                          type: "normal",
                          previousWeight: lastSet?.previousWeight,
                          previousReps: lastSet?.previousReps,
                        };
                        return { ...ex, sets: [...ex.sets, newSet] };
                      }
                      return ex;
                    })
                  );
                }}
              >
                <Ionicons name="add" size={18} color="#007AFF" />
                <Text style={styles.addSetText}>הוסף סט</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Add Exercise Button */}
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => setShowExercisePicker(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.addExerciseText}>הוסף תרגיל</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Exercise Picker Modal */}
      <Modal
        visible={showExercisePicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowExercisePicker(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>בחר תרגיל</Text>
              <View style={{ width: 24 }} />
            </View>

            <FlatList
              data={POPULAR_EXERCISES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseOption}
                  onPress={() => addExercise(item)}
                >
                  <View style={styles.exerciseOptionContent}>
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color="#007AFF"
                    />
                    <Text style={styles.exerciseOptionName}>{item.name}</Text>
                  </View>
                  <Text style={styles.exerciseOptionMuscle}>{item.muscle}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Plate Calculator Modal */}
      <Modal
        visible={showPlateCalculator}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calculatorContent}>
            <Text style={styles.modalTitle}>מחשבון משקולות</Text>
            <Text style={styles.targetWeightText}>
              משקל יעד: {targetWeight} ק"ג
            </Text>

            <View style={styles.barVisual}>
              <View style={styles.barCenter}>
                <Text style={styles.barText}>20 ק"ג</Text>
              </View>

              <View style={styles.platesContainer}>
                <Text style={styles.sideLabel}>צד ימין</Text>
                <View style={styles.platesList}>
                  {calculatePlates(targetWeight).map((plate, index) => (
                    <View
                      key={index}
                      style={[styles.plate, { width: 30 + plate * 2 }]}
                    >
                      <Text style={styles.plateText}>{plate}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPlateCalculator(false)}
            >
              <Text style={styles.closeButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Exercise Tips Modal */}
      <Modal
        visible={showTips !== null}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.tipsContent}>
            <Text style={styles.modalTitle}>טיפים לביצוע</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.tipText}>
                  שמור על גב ישר לאורך כל התנועה
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.tipText}>בצע טווח תנועה מלא</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.tipText}>
                  נשום נכון - שאיפה בירידה, נשיפה בעלייה
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTips(null)}
            >
              <Text style={styles.closeButtonText}>הבנתי</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RPE/RIR Modal */}
      <Modal
        visible={showRPEModal !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.rpeModalContent}>
            <Text style={styles.modalTitle}>דרג את המאמץ</Text>
            <Text style={styles.rpeSubtitle}>
              RPE (Rate of Perceived Exertion)
            </Text>

            <View style={styles.rpeScale}>
              {[6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={styles.rpeOption}
                  onPress={() => {
                    if (showRPEModal) {
                      setExercises(
                        exercises.map((ex) => {
                          if (ex.id === showRPEModal.exerciseId) {
                            return {
                              ...ex,
                              sets: ex.sets.map((set) =>
                                set.id === showRPEModal.setId
                                  ? { ...set, rpe: value }
                                  : set
                              ),
                            };
                          }
                          return ex;
                        })
                      );
                      setShowRPEModal(null);
                    }
                  }}
                >
                  <Text style={styles.rpeValue}>{value}</Text>
                  <Text style={styles.rpeDescription}>
                    {value === 6 && "קל מאוד"}
                    {value === 7 && "קל"}
                    {value === 8 && "בינוני"}
                    {value === 9 && "קשה"}
                    {value === 10 && "מקסימלי"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRPEModal(null)}
            >
              <Text style={styles.closeButtonText}>ביטול</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  workoutNameInput: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    minWidth: 150,
  },
  finishText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dashboard: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#2C2C2E",
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  dashboardItem: {
    alignItems: "center",
  },
  dashboardValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 4,
  },
  dashboardLabel: {
    color: "#8E8E93",
    fontSize: 11,
  },
  restTimerContainer: {
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  restTimerLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 4,
  },
  restTimerValue: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 8,
  },
  nextSetInfo: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  nextSetLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textAlign: "center",
  },
  nextSetTarget: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  restTimerActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  restTimerButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  restTimerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  timeAdjustButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
  },
  skipButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  skipButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  nextExerciseBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3C3C3E",
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    gap: 8,
  },
  nextExerciseLabel: {
    color: "#8E8E93",
    fontSize: 14,
  },
  nextExerciseName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  prCard: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  exerciseHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  plateCalculatorIcon: {
    padding: 4,
  },
  tipsIcon: {
    padding: 4,
  },
  exerciseNameContainer: {
    flex: 1,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
  },
  exerciseMuscle: {
    color: "#8E8E93",
    fontSize: 14,
    textAlign: "right",
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#3C3C3E",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  progressText: {
    color: "#8E8E93",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  aiRecommendation: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  aiText: {
    color: "#007AFF",
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  setsContainer: {
    padding: 16,
  },
  setsHeader: {
    flexDirection: "row-reverse",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerLabel: {
    flex: 1,
    color: "#8E8E93",
    fontSize: 12,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  completedSetRow: {
    opacity: 0.6,
  },
  prSetRow: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 8,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  setNumberContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  setNumber: {
    color: "#8E8E93",
    fontSize: 14,
  },
  previousText: {
    flex: 1,
    color: "#8E8E93",
    fontSize: 12,
    textAlign: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  completedInput: {
    backgroundColor: "#3C3C3E",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#8E8E93",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  checkboxCompleted: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  rpeButton: {
    flex: 1,
    backgroundColor: "#3C3C3E",
    borderRadius: 6,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  rpeText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  addSetButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#3C3C3E",
  },
  addSetText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  addExerciseButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    gap: 8,
  },
  addExerciseText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#2C2C2E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  exerciseOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  exerciseOptionContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  exerciseOptionName: {
    fontSize: 16,
    color: "#fff",
  },
  exerciseOptionMuscle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  calculatorContent: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 100,
  },
  targetWeightText: {
    color: "#8E8E93",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  barVisual: {
    marginBottom: 24,
  },
  barCenter: {
    backgroundColor: "#3C3C3E",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 16,
  },
  barText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  platesContainer: {
    alignItems: "center",
  },
  sideLabel: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 8,
  },
  platesList: {
    flexDirection: "row",
    gap: 4,
  },
  plate: {
    backgroundColor: "#007AFF",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  plateText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  tipsContent: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
  },
  tipsList: {
    marginVertical: 20,
  },
  tipItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  tipText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
  },
  rpeModalContent: {
    backgroundColor: "#2C2C2E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  rpeSubtitle: {
    color: "#8E8E93",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  rpeScale: {
    marginBottom: 24,
  },
  rpeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#3C3C3E",
    borderRadius: 8,
    marginBottom: 8,
  },
  rpeValue: {
    color: "#007AFF",
    fontSize: 24,
    fontWeight: "600",
    width: 40,
  },
  rpeDescription: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
    textAlign: "right",
  },
});
