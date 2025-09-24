// src/features/workout/screens/workout_screens/WorkoutPlansScreen.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { theme } from "../../../../core/theme";
import { useUserStore } from "../../../../stores/userStore";
import type {
  WorkoutExercise,
  WorkoutPlan,
} from "../../../../core/types/workout.types";
import { RootStackParamList } from "../../../../navigation/types";
import BackButton from "../../../../components/common/BackButton";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import UniversalCard from "../../../../components/ui/UniversalCard";
import VideoTutorials from "../../../../components/workout/VideoTutorials";
import CalorieCalculator from "../../../../components/workout/CalorieCalculator";
import { questionnaireService } from "../../../questionnaire/services/questionnaireService";
import AppButton from "../../../../components/common/AppButton";
import { isRTL, wrapTextWithEmoji } from "../../../../utils/rtlHelpers";

/** --------- Minimal shapes just for rendering in this screen ---------- */
type Difficulty = "beginner" | "intermediate" | "advanced" | string;

interface WorkoutSetLite {
  id?: string;
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  completed?: boolean;
}

interface ExerciseLite {
  id?: string;
  name?: string;
  equipment?: string;
  sets?: WorkoutSetLite[];
  targetMuscles?: string[];
  instructions?: string[];
  restTime?: number;
  difficulty?: Difficulty;
}

interface WorkoutDayLite {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  difficulty?: Difficulty;
  duration?: number;
  equipment?: string[];
  targetMuscles?: string[];
  estimatedCalories?: number;
  exercises?: ExerciseLite[];
  restTime?: number;
  sets?: number;
  reps?: number;
}

interface WorkoutPlanLite {
  id?: string;
  name?: string;
  description?: string;
  duration?: number; // minutes
  difficulty?: Difficulty;
  workouts?: WorkoutDayLite[];
  type?: string;
  isActive?: boolean;
  frequency?: string;
  tags?: string[];
}

interface ModalConfig {
  title: string;
  message: string;
}

export default function WorkoutPlansScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);
  const { width: screenWidth } = useWindowDimensions();

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanLite | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "",
    message: "",
  });
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseLite | null>(
    null
  );
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set()
  );

  // 🎯 Dynamic Grid Configuration - גריד דינמי לפי רוחב מסך
  const gridConfig = useMemo(() => {
    const workouts = workoutPlan?.workouts ?? [];
    const workoutCount = workouts.length;

    if (workoutCount === 0)
      return { columns: 1, itemWidth: screenWidth - 64, gap: 12 };

    // חישוב עמודות דינמי עם שולי בטיחות מדויקים
    const minItemWidth = 110; // רוחב מינימלי קטן יותר
    const universalCardPadding = 32; // פדינג של UniversalCard (16 * 2)
    const gridContainerPadding = 8; // פדינג של workoutDaysGrid (4 * 2)
    const safetyMargin = 24; // שולי בטיחות גדולים יותר
    const gap = 6; // מרווח קטן מאוד בין כרטיסים

    const availableWidth =
      screenWidth - universalCardPadding - gridContainerPadding - safetyMargin;

    // חישוב מספר עמודות אופטימלי
    let columns = Math.floor((availableWidth + gap) / (minItemWidth + gap));

    // ללא הגבלת מקסימום - תמיכה בעד 7 ימים!
    columns = Math.max(1, Math.min(columns, workoutCount));

    // אופטימיזציה מיוחדת למספרים קטנים
    if (workoutCount <= 2) {
      columns = Math.min(2, workoutCount);
    } else if (workoutCount === 3) {
      columns = Math.min(3, columns);
    }

    // חישוב רוחב כרטיס מדויק עם מניעת גלישה
    const totalGapSpace = gap * (columns - 1);
    const itemWidth = Math.floor((availableWidth - totalGapSpace) / columns);

    // Debug info לפיתוח
    console.log(
      `🎯 Grid Config: ${workoutCount} days → ${columns} cols, screen: ${screenWidth}px, available: ${availableWidth}px`
    );

    return {
      columns,
      itemWidth: Math.max(itemWidth, 75), // רוחב מינימלי קטן יותר
      gap,
      workoutCount,
      availableWidth,
    };
  }, [screenWidth, workoutPlan?.workouts]); // 🎨 Dynamic Grid Layout - פריסת גריד דינמית
  const workoutGridLayout = useMemo(() => {
    const workouts = workoutPlan?.workouts ?? [];
    if (workouts.length === 0) return [];

    const rows: WorkoutDayLite[][] = [];
    for (let i = 0; i < workouts.length; i += gridConfig.columns) {
      rows.push(workouts.slice(i, i + gridConfig.columns));
    }
    return rows;
  }, [workoutPlan?.workouts, gridConfig.columns]);

  const currentWorkoutPlan = workoutPlan;

  // 🎯 Smart Workout Day Naming - שמות חכמים לימי אימון
  const generateWorkoutDayName = (index: number): string => {
    const letters = ["A", "B", "C", "D", "E", "F", "G"];
    return letters[index] || `יום ${index + 1}`;
  };

  // 🎯 Generate Muscle Groups Description - תיאור קבוצות שרירים
  const generateMuscleGroupsDescription = (workout: WorkoutDayLite): string => {
    if (!workout.exercises || workout.exercises.length === 0) {
      return "אימון כללי";
    }

    const muscleGroups = new Set<string>();
    const exerciseTypes = new Set<string>();

    workout.exercises.forEach((exercise) => {
      const exerciseName = exercise.name?.toLowerCase() || "";

      // Analyze exercise names for muscle groups
      if (
        exerciseName.includes("דחיפ") ||
        exerciseName.includes("push") ||
        exerciseName.includes("חזה") ||
        exerciseName.includes("bench")
      ) {
        muscleGroups.add("חזה");
      }

      if (
        exerciseName.includes("משיכ") ||
        exerciseName.includes("pull") ||
        exerciseName.includes("גב") ||
        exerciseName.includes("רואינג")
      ) {
        muscleGroups.add("גב");
      }

      if (
        exerciseName.includes("כתפ") ||
        exerciseName.includes("shoulder") ||
        exerciseName.includes("דלתא")
      ) {
        muscleGroups.add("כתפיים");
      }

      if (
        exerciseName.includes("זרוע") ||
        exerciseName.includes("ביצפס") ||
        exerciseName.includes("טריצפס") ||
        exerciseName.includes("bicep") ||
        exerciseName.includes("tricep")
      ) {
        muscleGroups.add("זרועות");
      }

      if (
        exerciseName.includes("סקווט") ||
        exerciseName.includes("לונג'") ||
        exerciseName.includes("רגל") ||
        exerciseName.includes("ירך") ||
        exerciseName.includes("squat") ||
        exerciseName.includes("lunge")
      ) {
        muscleGroups.add("רגליים");
      }

      if (
        exerciseName.includes("בטן") ||
        exerciseName.includes("פלאנק") ||
        exerciseName.includes("core") ||
        exerciseName.includes("קרנץ'") ||
        exerciseName.includes("ליבה")
      ) {
        muscleGroups.add("ליבה");
      }

      if (
        exerciseName.includes("ריצה") ||
        exerciseName.includes("jumping") ||
        exerciseName.includes("burpee") ||
        exerciseName.includes("cardio") ||
        exerciseName.includes("אירובי") ||
        exerciseName.includes("קפיצ")
      ) {
        exerciseTypes.add("קרדיו");
      }
    });

    // Also check target muscles if available
    if (workout.targetMuscles && workout.targetMuscles.length > 0) {
      workout.targetMuscles.forEach((muscle) => {
        const lowerMuscle = muscle.toLowerCase();
        if (lowerMuscle.includes("chest") || lowerMuscle.includes("חזה")) {
          muscleGroups.add("חזה");
        }
        if (lowerMuscle.includes("back") || lowerMuscle.includes("גב")) {
          muscleGroups.add("גב");
        }
        if (lowerMuscle.includes("shoulder") || lowerMuscle.includes("כתף")) {
          muscleGroups.add("כתפיים");
        }
        if (lowerMuscle.includes("arm") || lowerMuscle.includes("זרוע")) {
          muscleGroups.add("זרועות");
        }
        if (lowerMuscle.includes("leg") || lowerMuscle.includes("רגל")) {
          muscleGroups.add("רגליים");
        }
        if (lowerMuscle.includes("core") || lowerMuscle.includes("בטן")) {
          muscleGroups.add("ליבה");
        }
      });
    }

    // Build description with null checks
    const groups = Array.from(muscleGroups);
    const types = Array.from(exerciseTypes);

    if (types.length > 0 && groups.length === 0) {
      return types[0] || "קרדיו";
    }

    if (groups.length === 0) {
      return "אימון כללי";
    }

    if (groups.length === 1) {
      return groups[0] || "אימון כללי";
    }

    if (groups.length === 2) {
      return groups.join(" + ");
    }

    if (groups.length >= 3) {
      return "כל הגוף";
    }

    return groups.slice(0, 2).join(" + ");
  };

  const showMessage = (title: string, message: string) => {
    setModalConfig({ title, message });
    setShowModal(true);
  };

  const handleExercisePress = (exercise: ExerciseLite) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const closeExerciseModal = () => {
    setShowExerciseModal(false);
    setSelectedExercise(null);
  };

  const toggleExerciseExpansion = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const getMuscleGroupColor = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase();

    // חזה - כתום
    if (
      name.includes("דחיפ") ||
      name.includes("push") ||
      name.includes("חזה") ||
      name.includes("bench")
    ) {
      return "#FF6B35";
    }

    // גב - כחול
    if (
      name.includes("משיכ") ||
      name.includes("pull") ||
      name.includes("גב") ||
      name.includes("רואינג")
    ) {
      return "#4A90E2";
    }

    // כתפיים - סגול
    if (
      name.includes("כתפ") ||
      name.includes("shoulder") ||
      name.includes("דלתא")
    ) {
      return "#9B59B6";
    }

    // זרועות - ירוק
    if (
      name.includes("זרוע") ||
      name.includes("ביצפס") ||
      name.includes("טריצפס") ||
      name.includes("bicep") ||
      name.includes("tricep")
    ) {
      return "#27AE60";
    }

    // רגליים - אדום
    if (
      name.includes("סקווט") ||
      name.includes("לונג'") ||
      name.includes("רגל") ||
      name.includes("ירך") ||
      name.includes("squat") ||
      name.includes("lunge")
    ) {
      return "#E74C3C";
    }

    // ליבה - צהוב
    if (
      name.includes("בטן") ||
      name.includes("פלאנק") ||
      name.includes("core") ||
      name.includes("קרנץ'") ||
      name.includes("ליבה")
    ) {
      return "#F39C12";
    }

    // קרדיו - ורוד
    if (
      name.includes("ריצה") ||
      name.includes("jumping") ||
      name.includes("burpee") ||
      name.includes("cardio") ||
      name.includes("אירובי")
    ) {
      return "#E91E63";
    }

    // ברירת מחדל - אפור
    return "#95A5A6";
  };

  const getMuscleGroupName = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase();

    if (
      name.includes("דחיפ") ||
      name.includes("push") ||
      name.includes("חזה") ||
      name.includes("bench")
    )
      return "חזה";
    if (
      name.includes("משיכ") ||
      name.includes("pull") ||
      name.includes("גב") ||
      name.includes("רואינג")
    )
      return "גב";
    if (
      name.includes("כתפ") ||
      name.includes("shoulder") ||
      name.includes("דלתא")
    )
      return "כתפיים";
    if (
      name.includes("זרוע") ||
      name.includes("ביצפס") ||
      name.includes("טריצפס") ||
      name.includes("bicep") ||
      name.includes("tricep")
    )
      return "זרועות";
    if (
      name.includes("סקווט") ||
      name.includes("לונג'") ||
      name.includes("רגל") ||
      name.includes("ירך") ||
      name.includes("squat") ||
      name.includes("lunge")
    )
      return "רגליים";
    if (
      name.includes("בטן") ||
      name.includes("פלאנק") ||
      name.includes("core") ||
      name.includes("קרנץ'") ||
      name.includes("ליבה")
    )
      return "ליבה";
    if (
      name.includes("ריצה") ||
      name.includes("jumping") ||
      name.includes("burpee") ||
      name.includes("cardio") ||
      name.includes("אירובי")
    )
      return "קרדיו";

    return "כללי";
  };

  const renderExerciseDetails = (): string => {
    if (!selectedExercise) return "";

    const parts: string[] = [];

    // Equipment
    if (selectedExercise.equipment) {
      parts.push(`🏋️ ציוד: ${selectedExercise.equipment}`);
    }

    // Target muscles
    if (selectedExercise.targetMuscles?.length) {
      parts.push(`🎯 שרירים: ${selectedExercise.targetMuscles.join(", ")}`);
    }

    // Sets and reps
    const sets = selectedExercise.sets?.length || 3;
    const reps = selectedExercise.sets?.[0]?.reps || 12;
    const weight = selectedExercise.sets?.[0]?.weight;

    parts.push(`📊 ${sets} סטים × ${reps} חזרות`);

    if (weight) {
      parts.push(`⚖️ משקל מומלץ: ${weight}kg`);
    }

    // Rest time
    if (selectedExercise.restTime) {
      parts.push(`⏱️ מנוחה: ${selectedExercise.restTime} שניות`);
    }

    // Instructions
    if (selectedExercise.instructions?.length) {
      parts.push(`📝 הוראות ביצוע:`);
      selectedExercise.instructions.forEach((instruction, index) => {
        parts.push(`${index + 1}. ${instruction}`);
      });
    } else {
      // Default instructions based on equipment
      parts.push(`📝 הוראות ביצוע:`);
      if (selectedExercise.equipment === "bodyweight") {
        parts.push("• התמקד בטכניקה נכונה");
        parts.push("• בצע בקצב איטי ומבוקר");
        parts.push("• נשום באופן סדיר");
      } else {
        parts.push("• התחל עם משקל קל");
        parts.push("• שמור על יציבות הגוף");
        parts.push("• הרם בזריזות, הנמך באיטיות");
      }
    }

    // Difficulty tips
    const difficulty = selectedExercise.difficulty || "beginner";
    parts.push(
      `💡 טיפים לרמה ${difficulty === "beginner" ? "מתחיל" : difficulty === "intermediate" ? "בינוני" : "מתקדם"}:`
    );

    if (difficulty === "beginner") {
      parts.push("• התחל עם 50% מהמשקל המרבי");
      parts.push("• התמקד בלמידת התנועה");
      parts.push("• אל תחפף על הטכניקה");
    } else if (difficulty === "intermediate") {
      parts.push("• הדרגתית הוסף משקל או חזרות");
      parts.push("• שמור על קצב אימון קבוע");
      parts.push("• הקפד על מנוחה מספקת");
    } else {
      parts.push("• נסה וריאציות מאתגרות");
      parts.push("• שלב טכניקות עדינות");
      parts.push("• התמקד בשיפור איכות התנועה");
    }

    return parts.join("\n\n");
  };

  // 🚀 Auto-generate workout plan on screen entry
  useEffect(() => {
    const initializeWorkoutPlan = async () => {
      console.log("🎯 Auto-initializing workout plan...");

      if (!user) {
        console.log("❌ No user found for auto-generation");
        return;
      }

      // Only generate if we don't already have a plan
      if (!workoutPlan) {
        console.log("📋 No existing plan, generating new one...");

        try {
          setLoading(true);

          const plans =
            (await questionnaireService.generateSmartWorkoutPlan()) as
              | WorkoutPlanLite[]
              | undefined;

          const plan =
            Array.isArray(plans) && plans.length > 0 ? plans[0] : null;

          if (plan) {
            console.log("✅ Auto-generated workout plan:", plan);
            setWorkoutPlan(plan);
          } else {
            console.log("❌ Failed to auto-generate plan");
            showMessage("שגיאה", "לא הצלחנו ליצור תוכנית אימון אוטומטית");
          }
        } catch (err) {
          console.error("❌ Error in auto-generation:", err);
          showMessage("שגיאה", "שגיאה ביצירת תוכנית אימון");
        } finally {
          setLoading(false);
        }
      } else {
        console.log("✅ Workout plan already exists, skipping generation");
      }
    };

    initializeWorkoutPlan();
  }, [user, workoutPlan]); // Only depend on user and existing plan

  const handleStartWorkout = () => {
    const workouts = currentWorkoutPlan?.workouts ?? [];
    if (workouts.length === 0) {
      showMessage("שגיאה", "לא ניתן למצוא תבנית אימון");
      return;
    }

    const workout = workouts[0];

    navigation.navigate("ActiveWorkout", {
      workoutData: {
        name: currentWorkoutPlan?.name ?? "אימון יומי",
        dayName: workout?.name ?? "יום אימון",
        startTime: new Date().toISOString(),
        exercises: (workout?.exercises ?? []) as unknown as WorkoutExercise[],
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>יוצר תוכנית אימון...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // מתאם ל-CalorieCalculator: מצפה ל-WorkoutPlan מלא -> cast בטוח לשימוש תצוגתי
  const workoutPlanForCalc = currentWorkoutPlan
    ? (currentWorkoutPlan as unknown as WorkoutPlan)
    : undefined;

  const workouts = currentWorkoutPlan?.workouts ?? [];
  const selectedWorkout = workouts[selectedDayIndex];

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>תוכנית האימון שלי</Text>
          <Text style={styles.subtitle}>תוכנית מותאמת אישית</Text>
        </View>

        {currentWorkoutPlan ? (
          <>
            <UniversalCard title={currentWorkoutPlan.name ?? "תוכנית אימון"}>
              <View style={styles.planStats}>
                <Text style={styles.planStat}>
                  🏋️ {workouts.length} אימונים
                </Text>
                <Text style={styles.planStat}>
                  {wrapTextWithEmoji(
                    `${currentWorkoutPlan.duration ?? 30} דקות`,
                    "⏱️"
                  )}
                </Text>
                <Text style={styles.planStat}>
                  {wrapTextWithEmoji(
                    currentWorkoutPlan.frequency || "לא צוין",
                    "📅"
                  )}
                </Text>
              </View>

              {/* Calorie Calculator */}
              {workoutPlanForCalc && (
                <CalorieCalculator
                  workoutPlan={workoutPlanForCalc}
                  userWeight={
                    user?.questionnaireData?.answers?.weight &&
                    typeof user.questionnaireData.answers.weight === "number"
                      ? user.questionnaireData.answers.weight
                      : 70
                  }
                  userAge={
                    user?.questionnaireData?.answers?.age &&
                    typeof user.questionnaireData.answers.age === "number"
                      ? user.questionnaireData.answers.age
                      : 30
                  }
                  userGender={
                    user?.questionnaireData?.answers?.gender === "female"
                      ? "female"
                      : "male"
                  }
                />
              )}

              <AppButton
                title="התחל אימון"
                variant="workout"
                size="large"
                fullWidth
                onPress={handleStartWorkout}
                accessibilityLabel="התחל אימון חדש"
                accessibilityHint="לחץ כדי להתחיל אימון לפי התוכנית הנבחרת"
              />
            </UniversalCard>

            {/* Workout Days Tabs */}
            {workouts.length > 0 && (
              <UniversalCard title="ימי האימון">
                {/* 🎯 Dynamic Workout Days Grid - גריד דינמי לימי אימון */}
                <View style={styles.workoutDaysGrid}>
                  {workoutGridLayout.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.gridRow}>
                      {row.map((workout, columnIndex) => {
                        const workoutIndex =
                          rowIndex * gridConfig.columns + columnIndex;
                        return (
                          <TouchableOpacity
                            key={workout.id || workoutIndex}
                            style={[
                              styles.dayGridCard,
                              selectedDayIndex === workoutIndex &&
                                styles.activeDayGridCard,
                            ]}
                            onPress={() => setSelectedDayIndex(workoutIndex)}
                          >
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[
                                styles.dayGridCardTitle,
                                selectedDayIndex === workoutIndex &&
                                  styles.activeDayGridCardTitle,
                              ]}
                            >
                              {generateWorkoutDayName(workoutIndex)}
                            </Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[
                                styles.dayGridCardSubtext,
                                selectedDayIndex === workoutIndex &&
                                  styles.activeDayGridCardSubtext,
                              ]}
                            >
                              {workout.exercises?.length || 0} תרגילים
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>

                {/* Selected Day Content */}
                {selectedWorkout && (
                  <View style={styles.dayContent}>
                    <View style={styles.dayHeader}>
                      <Text style={styles.dayTitle}>
                        {generateWorkoutDayName(selectedDayIndex)}
                      </Text>
                      <Text style={styles.daySubtitle}>
                        {generateMuscleGroupsDescription(selectedWorkout)}
                      </Text>
                      <View style={styles.dayStats}>
                        <Text style={styles.dayStat}>
                          ⏱️ {selectedWorkout.duration || 30} דקות
                        </Text>
                        <Text style={styles.dayStat}>
                          🎯{" "}
                          {selectedWorkout.targetMuscles?.join(", ") ||
                            "כל הגוף"}
                        </Text>
                      </View>
                    </View>

                    {/* Exercise List */}
                    <View style={styles.exercisesList}>
                      <Text style={styles.exercisesHeader}>תרגילים:</Text>
                      <Text style={styles.exercisesSubHeader}>
                        לחץ על תרגיל כדי לראות פרטים מלאים
                      </Text>

                      {/* הנחיות כלליות למתחילים - מודגשות */}
                      <View style={styles.prominentBeginnerTips}>
                        <Text style={styles.prominentBeginnerTipsTitle}>
                          🎯 הנחיות חשובות למתחילים
                        </Text>
                        <Text style={styles.prominentBeginnerTipsText}>
                          💪 התחל עם משקלים קלים ובנה הדרגתית{"\n\n"}✅ טכניקה
                          נכונה חשובה יותר ממשקל כבד{"\n\n"}
                          📉 אם קשה לסיים את כל החזרות - הקל במשקל{"\n\n"}
                          📈 אם קל מדי - הוסף משקל בהדרגה
                        </Text>
                      </View>

                      {selectedWorkout.exercises?.map(
                        (exercise, exerciseIndex) => {
                          const exerciseId =
                            exercise.id || `exercise-${exerciseIndex}`;
                          const isExpanded = expandedExercises.has(exerciseId);
                          const muscleColor = getMuscleGroupColor(
                            exercise.name || ""
                          );
                          const muscleName = getMuscleGroupName(
                            exercise.name || ""
                          );

                          return (
                            <View
                              key={exerciseId}
                              style={styles.exerciseAccordionItem}
                            >
                              {/* Header - always visible */}
                              <TouchableOpacity
                                style={styles.exerciseAccordionHeader}
                                onPress={() =>
                                  toggleExerciseExpansion(exerciseId)
                                }
                                activeOpacity={0.7}
                                accessibilityLabel={`תרגיל ${exercise.name} - ${isExpanded ? "נפתח" : "סגור"}`}
                                accessibilityHint="לחץ כדי לפתוח או לסגור פרטי התרגיל"
                              >
                                <View style={styles.exerciseHeaderRow}>
                                  {/* Muscle Group Color Tag */}
                                  <View
                                    style={[
                                      styles.muscleGroupTag,
                                      { backgroundColor: muscleColor },
                                    ]}
                                  >
                                    <Text style={styles.muscleGroupTagText}>
                                      {muscleName}
                                    </Text>
                                  </View>

                                  <View style={styles.exerciseHeaderInfo}>
                                    <Text style={styles.exerciseHeaderName}>
                                      {exercise.name}
                                    </Text>
                                    <Text style={styles.exerciseHeaderSummary}>
                                      {exercise.sets?.length || 3} סטים •{" "}
                                      {exercise.sets?.[0]?.reps || 12} חזרות
                                    </Text>
                                  </View>

                                  {/* Expand/Collapse Icon */}
                                  <View style={styles.expandIcon}>
                                    <Text style={styles.expandIconText}>
                                      {isExpanded ? "▲" : "▼"}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>

                              {/* Expanded Content */}
                              {isExpanded && (
                                <View style={styles.exerciseAccordionContent}>
                                  <View style={styles.exerciseDetailRow}>
                                    <View style={styles.exerciseImage}>
                                      <Text
                                        style={styles.exerciseImagePlaceholder}
                                      >
                                        💪
                                      </Text>
                                    </View>

                                    <View style={styles.exerciseDetailInfo}>
                                      <Text style={styles.exerciseEquipment}>
                                        🏋️ {exercise.equipment}
                                      </Text>
                                      {exercise.equipment !== "bodyweight" && (
                                        <Text style={styles.exerciseWeightTip}>
                                          משקל: התחל קל ובנה הדרגתית
                                        </Text>
                                      )}

                                      <TouchableOpacity
                                        style={styles.viewDetailsButton}
                                        onPress={() =>
                                          handleExercisePress(exercise)
                                        }
                                      >
                                        <Text style={styles.viewDetailsText}>
                                          � הוראות מפורטות
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              )}
                            </View>
                          );
                        }
                      )}
                    </View>

                    <AppButton
                      title={`התחל ${generateWorkoutDayName(selectedDayIndex)}`}
                      variant="primary"
                      size="medium"
                      fullWidth
                      onPress={() => {
                        navigation.navigate("ActiveWorkout", {
                          workoutData: {
                            name: currentWorkoutPlan.name || "אימון יומי",
                            dayName: generateWorkoutDayName(selectedDayIndex),
                            startTime: new Date().toISOString(),
                            exercises: (selectedWorkout.exercises ||
                              []) as unknown as WorkoutExercise[],
                          },
                        });
                      }}
                      accessibilityLabel={`התחל ${generateWorkoutDayName(selectedDayIndex)}`}
                      accessibilityHint="לחץ כדי להתחיל את האימון הנבחר"
                    />
                  </View>
                )}
              </UniversalCard>
            )}

            {/* Video Tutorials */}
            <VideoTutorials
              workoutCategory={currentWorkoutPlan.tags?.[0] || "כללי"}
              userLevel={currentWorkoutPlan.difficulty || "beginner"}
            />
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {loading
                ? "יוצר תוכנית אימון..."
                : "בהכנת תוכנית אימון מותאמת..."}
            </Text>
          </View>
        )}
      </ScrollView>

      <ConfirmationModal
        visible={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        singleButton
        variant="default"
      />

      {/* Exercise Details Modal */}
      <ConfirmationModal
        visible={showExerciseModal}
        title={selectedExercise?.name || "פרטי תרגיל"}
        message={renderExerciseDetails()}
        onClose={closeExerciseModal}
        onConfirm={closeExerciseModal}
        singleButton
        confirmText="סגור"
        variant="default"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  planStats: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  planStat: {
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dayContent: {
    marginTop: 8,
  },
  dayHeader: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "right", // תמיד ימין בעברית
  },
  daySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textAlign: "right", // תמיד ימין בעברית
  },
  dayStats: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayStat: {
    fontSize: 12,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exercisesList: {
    marginBottom: 16,
  },
  exercisesHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "right", // תמיד ימין בעברית
  },
  exercisesSubHeader: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    textAlign: "right", // תמיד ימין בעברית
    fontStyle: "italic",
  },

  exerciseEquipment: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
    textAlign: "right", // תמיד ימין בעברית
  },
  // 🎯 Prominent Beginner Tips - טיפים בולטים למתחילים
  prominentBeginnerTips: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: theme.colors.primary + "15",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
    borderStartWidth: isRTL() ? 0 : 4,
    borderEndWidth: isRTL() ? 4 : 0,
    borderLeftColor: isRTL() ? "transparent" : theme.colors.primary,
    borderRightColor: isRTL() ? theme.colors.primary : "transparent",
    // Shadow for emphasis
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  prominentBeginnerTipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  prominentBeginnerTipsText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 20,
    textAlign: "right", // תמיד ימין בעברית
  },

  // 🖼️ Exercise Image Style - סגנון תמונת תרגיל
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.colors.primary + "10",
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0, // מונע התכווצות התמונה
  },
  exerciseImagePlaceholder: {
    fontSize: 24,
    textAlign: "center",
  },

  // 🎯 Exercise Accordion Styles - סגנונות אקורדיון תרגילים
  exerciseAccordionItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border + "40",
    overflow: "hidden",
  },
  exerciseAccordionHeader: {
    padding: 12,
    backgroundColor: theme.colors.surface,
  },
  exerciseHeaderRow: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseHeaderInfo: {
    flex: 1,
  },
  exerciseHeaderName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
    textAlign: "right",
  },
  exerciseHeaderSummary: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  expandIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  expandIconText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  exerciseAccordionContent: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + "30",
  },
  exerciseDetailRow: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "flex-start",
    gap: 16,
  },
  exerciseDetailInfo: {
    flex: 1,
  },
  exerciseWeightTip: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    marginTop: 4,
    textAlign: "right",
  },
  viewDetailsButton: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  viewDetailsText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },

  // 🏷️ Muscle Group Tag - תגית קבוצת שרירים
  muscleGroupTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: "center",
  },
  muscleGroupTagText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  // 🎯 Dynamic Grid Styles - סגנונות גריד דינמי
  workoutDaysGrid: {
    marginBottom: 16,
    direction: isRTL() ? "rtl" : "ltr",
    paddingHorizontal: 0, // ללא פדינג כדי למנוע גלישה
    overflow: "hidden", // מניעת גלישה מהקונטיינר
  },
  gridRow: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between", // חלוקה שווה של המקום
    marginBottom: 6,
    flexWrap: "nowrap", // מניעת גלישה
    width: "100%", // רוחב מלא
  },
  dayGridCard: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 65,
    flex: 1, // כרטיס יתפרס באופן שווה
    marginHorizontal: 1, // מרווח קטן מאוד בין כרטיסים
    // Shadow for iOS - מופחת לביצועים טובים יותר
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 3,
  },
  activeDayGridCard: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  dayGridCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 3,
    flexShrink: 1, // מאפשר התכווצות טקסט
  },
  activeDayGridCardTitle: {
    color: theme.colors.background,
  },
  dayGridCardSubtext: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
    flexShrink: 1, // מאפשר התכווצות טקסט
  },
  activeDayGridCardSubtext: {
    color: theme.colors.background,
    opacity: 0.9,
  },
});
