// src/features/workout/screens/workout_screens/WorkoutPlansScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
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
import EmptyState from "../../../../components/common/EmptyState";
import UniversalCard from "../../../../components/ui/UniversalCard";
import VideoTutorials from "../../../../components/workout/VideoTutorials";
import CalorieCalculator from "../../../../components/workout/CalorieCalculator";
import { questionnaireService } from "../../../questionnaire/services/questionnaireService";
import AppButton from "../../../../components/common/AppButton";
import { logger } from "../../../../utils/logger";
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

/** -------------------------- Debug helper (no non-null) --------------------------- */
const debugWorkoutPlan = (plan: WorkoutPlanLite | null, source: string) => {
  const first = plan?.workouts?.[0];
  console.log(`🔍 DEBUG ${source}:`, {
    planExists: !!plan,
    planId: plan?.id,
    planName: plan?.name,
    planDescription: plan?.description,
    workoutsCount: plan?.workouts?.length,
    firstWorkout: first
      ? {
          id: first.id,
          name: first.name,
          exercisesCount: first.exercises?.length,
        }
      : null,
  });
};

export default function WorkoutPlansScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanLite | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "",
    message: "",
  });
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const currentWorkoutPlan = workoutPlan;

  const showMessage = (title: string, message: string) => {
    setModalConfig({ title, message });
    setShowModal(true);
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      console.log("🚀 Starting workout plan generation...");

      if (!user) {
        console.log("❌ No user found");
        showMessage("שגיאה", "לא נמצא משתמש");
        return;
      }

      console.log("👤 User found:", user?.id);
      console.log("📝 Questionnaire data:", user?.questionnaireData?.answers);

      const plans = (await questionnaireService.generateSmartWorkoutPlan()) as
        | WorkoutPlanLite[]
        | undefined;

      console.log("📋 Plans generated:", plans);

      const plan = Array.isArray(plans) && plans.length > 0 ? plans[0] : null;
      console.log("🎯 Selected plan:", plan);

      if (!plan) {
        console.log("❌ No plan generated");
        showMessage("שגיאה", "לא הצלחנו ליצור תוכנית אימון");
        return;
      }

      console.log("✅ Setting workout plan:", plan);
      debugWorkoutPlan(plan, "WorkoutPlansScreen.setWorkoutPlan");
      setWorkoutPlan(plan);
      showMessage("תוכנית נוצרה!", "תוכנית אימון נוצרה בהצלחה");
    } catch (err) {
      console.error("❌ Error in generatePlan:", err);
      logger.error("WorkoutPlansScreen", "Error generating plan", err);
      showMessage("שגיאה", "לא הצלחנו ליצור תוכנית אימון");
    } finally {
      setLoading(false);
    }
  };

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

  const handleRefresh = async () => {
    await generatePlan();
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
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>תוכניות אימון</Text>
          <Text style={styles.subtitle}>
            צור תוכנית אימון מותאמת אישית עם מסד נתונים מקיף של 150+ תרגילים
          </Text>

          {/* Debug info */}
          <Text style={styles.debugText}>
            סטטוס תוכנית: {currentWorkoutPlan ? "נוצרה ✅" : "לא קיימת ❌"}
          </Text>

          {user?.questionnaireData?.answers && (
            <View>
              {user.questionnaireData.answers.equipment && (
                <Text style={styles.debugText}>
                  ציוד ישן:{" "}
                  {user.questionnaireData.answers.equipment.join(", ")}
                </Text>
              )}
              {user.questionnaireData.answers.bodyweight_equipment && (
                <Text style={styles.debugText}>
                  חפצים ביתיים:{" "}
                  {user.questionnaireData.answers.bodyweight_equipment.join(
                    ", "
                  )}
                </Text>
              )}
              {user.questionnaireData.answers.home_equipment && (
                <Text style={styles.debugText}>
                  ציוד בית:{" "}
                  {user.questionnaireData.answers.home_equipment.join(", ")}
                </Text>
              )}
              {user.questionnaireData.answers.gym_equipment && (
                <Text style={styles.debugText}>
                  ציוד חדר כושר:{" "}
                  {user.questionnaireData.answers.gym_equipment.join(", ")}
                </Text>
              )}
            </View>
          )}
        </View>

        {currentWorkoutPlan ? (
          <>
            <UniversalCard title={currentWorkoutPlan.name ?? "תוכנית אימון"}>
              <Text style={styles.planDescription}>
                {currentWorkoutPlan.description}
              </Text>

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

              {/* Show exercise count & equipment for first workout */}
              {workouts[0]?.exercises && (
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseInfoText}>
                    {wrapTextWithEmoji(
                      `${workouts[0].exercises?.length ?? 0} תרגילים באימון הראשון`,
                      "💪"
                    )}
                  </Text>
                  <Text style={styles.exerciseInfoText}>
                    {wrapTextWithEmoji(
                      `ציוד נדרש: ${workouts[0].equipment?.join(", ") || "משקל גוף"}`,
                      "🎯"
                    )}
                  </Text>
                </View>
              )}

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

              <AppButton
                title="הצג פרטי התוכנית"
                variant="secondary"
                size="medium"
                fullWidth
                onPress={() => {
                  console.log(
                    "📋 Full workout plan details:",
                    JSON.stringify(currentWorkoutPlan, null, 2)
                  );
                  showMessage(
                    "פרטי התוכנית",
                    `שם: ${currentWorkoutPlan.name}\n` +
                      `תיאור: ${currentWorkoutPlan.description}\n` +
                      `מספר אימונים: ${workouts.length}\n` +
                      `תרגילים באימון הראשון: ${workouts[0]?.exercises?.length ?? 0}`
                  );
                }}
                accessibilityLabel="הצג פרטי התוכנית"
                accessibilityHint="לחץ כדי לראות פרטים מלאים על התוכנית"
              />
            </UniversalCard>

            {/* Workout Days Tabs */}
            {workouts.length > 0 && (
              <UniversalCard title="ימי האימון">
                {/* Day Tabs */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.tabsContainer}
                >
                  {workouts.map((workout, index) => (
                    <TouchableOpacity
                      key={workout.id || index}
                      style={[
                        styles.dayTab,
                        selectedDayIndex === index && styles.activeTab,
                      ]}
                      onPress={() => setSelectedDayIndex(index)}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          selectedDayIndex === index && styles.activeTabText,
                        ]}
                      >
                        {workout.name || `יום ${index + 1}`}
                      </Text>
                      <Text
                        style={[
                          styles.tabSubtext,
                          selectedDayIndex === index && styles.activeTabSubtext,
                        ]}
                      >
                        {workout.exercises?.length || 0} תרגילים
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Selected Day Content */}
                {selectedWorkout && (
                  <View style={styles.dayContent}>
                    <View style={styles.dayHeader}>
                      <Text style={styles.dayTitle}>
                        {selectedWorkout.name || `יום ${selectedDayIndex + 1}`}
                      </Text>
                      <Text style={styles.daySubtitle}>
                        {selectedWorkout.description || "אימון מקיף"}
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

                      {/* הנחיות כלליות למתחילים */}
                      <View style={styles.beginnerTips}>
                        <Text style={styles.beginnerTipsTitle}>
                          🎯 הנחיות למתחילים:
                        </Text>
                        <Text style={styles.beginnerTipsText}>
                          • התחל עם משקלים קלים ובנה הדרגתית{"\n"}• טכניקה נכונה
                          חשובה יותר ממשקל כבד{"\n"}• אם קשה לסיים את כל החזרות
                          - הקל במשקל{"\n"}• אם קל מדי - הוסף משקל בהדרגה
                        </Text>
                      </View>

                      {selectedWorkout.exercises?.map(
                        (exercise, exerciseIndex) => (
                          <View
                            key={exercise.id || exerciseIndex}
                            style={styles.exerciseItem}
                          >
                            <View style={styles.exerciseItemInfo}>
                              <Text style={styles.exerciseName}>
                                {exercise.name}
                              </Text>
                              <Text style={styles.exerciseDetails}>
                                {exercise.sets?.length || 3} סטים •{" "}
                                {exercise.sets?.[0]?.reps || 12} חזרות
                                {exercise.equipment !== "bodyweight" &&
                                  " • משקל: התחל קל ובנה הדרגתית"}
                              </Text>
                              <Text style={styles.exerciseEquipment}>
                                🏋️ {exercise.equipment}
                              </Text>

                              {/* טיפ למתחילים לפי ציוד */}
                              {exercise.equipment !== "bodyweight" && (
                                <View style={styles.beginnerTips}>
                                  <Text style={styles.beginnerTipsTitle}>
                                    💡 טיפ למתחילים:
                                  </Text>
                                  <Text style={styles.beginnerTipsText}>
                                    {exercise.equipment === "dumbbells" &&
                                      "התחל עם 3-5 ק״ג ועלה הדרגתית"}
                                    {exercise.equipment === "barbell" &&
                                      "התחל עם רק המוט (20 ק״ג) ועלה הדרגתית"}
                                    {exercise.equipment === "kettlebell" &&
                                      "התחל עם 8-12 ק״ג ועלה הדרגתית"}
                                    {exercise.equipment ===
                                      "resistance_bands" &&
                                      "התחל עם התנגדות קלה ועלה הדרגתית"}
                                    {![
                                      "dumbbells",
                                      "barbell",
                                      "kettlebell",
                                      "resistance_bands",
                                    ].includes(exercise.equipment ?? "") &&
                                      "התחל עם משקל קל שמאפשר לבצע את כל החזרות בטכניקה נכונה"}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        )
                      )}
                    </View>

                    <AppButton
                      title={`התחל ${
                        selectedWorkout.name || `יום ${selectedDayIndex + 1}`
                      }`}
                      variant="primary"
                      size="medium"
                      fullWidth
                      onPress={() => {
                        navigation.navigate("ActiveWorkout", {
                          workoutData: {
                            name: currentWorkoutPlan.name || "אימון יומי",
                            dayName:
                              selectedWorkout.name ||
                              `יום ${selectedDayIndex + 1}`,
                            startTime: new Date().toISOString(),
                            exercises: (selectedWorkout.exercises ||
                              []) as unknown as WorkoutExercise[],
                          },
                        });
                      }}
                      accessibilityLabel={`התחל ${
                        selectedWorkout.name || `יום ${selectedDayIndex + 1}`
                      }`}
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
          <EmptyState
            icon="clipboard-outline"
            title="אין תוכנית אימון"
            description="יצור תוכנית חדשה כדי להתחיל להתאמן"
            variant="compact"
          />
        )}

        <View style={styles.actionsContainer}>
          <AppButton
            title="צור תוכנית אימון"
            variant="primary"
            size="medium"
            fullWidth
            onPress={generatePlan}
            accessibilityLabel="צור תוכנית אימון"
            accessibilityHint="לחץ כדי ליצור תוכנית אימון מותאמת אישית"
          />

          <AppButton
            title="צור תוכנית דמו (לבדיקה)"
            variant="secondary"
            size="medium"
            fullWidth
            onPress={() => {
              console.log("🧪 Creating demo workout plan...");
              const demoPlan: WorkoutPlanLite = {
                id: "demo-plan-123",
                name: "תוכנית דמו למתחילים",
                description: "תוכנית אימון דמו לבדיקת המערכת",
                duration: 45,
                difficulty: "beginner",
                workouts: [
                  {
                    id: "demo-workout-1",
                    name: "אימון כוח בסיסי",
                    description: "אימון כוח למתחילים",
                    type: "strength",
                    difficulty: "beginner",
                    duration: 45,
                    equipment: ["bodyweight"],
                    targetMuscles: ["כל הגוף"],
                    estimatedCalories: 200,
                    exercises: [
                      {
                        id: "pushups",
                        name: "שכיבות סמיכה",
                        equipment: "bodyweight",
                        sets: [
                          {
                            id: "set1",
                            reps: 10,
                            weight: 0,
                            duration: 30,
                            restTime: 60,
                            completed: false,
                          },
                          {
                            id: "set2",
                            reps: 10,
                            weight: 0,
                            duration: 30,
                            restTime: 60,
                            completed: false,
                          },
                          {
                            id: "set3",
                            reps: 10,
                            weight: 0,
                            duration: 30,
                            restTime: 60,
                            completed: false,
                          },
                        ],
                        targetMuscles: ["חזה", "זרועות"],
                        instructions: ["בצע שכיבות סמיכה נכונות"],
                        restTime: 60,
                        difficulty: "beginner",
                      },
                      {
                        id: "squats",
                        name: "כפיפות רגליים",
                        equipment: "bodyweight",
                        sets: [
                          {
                            id: "set1",
                            reps: 15,
                            weight: 0,
                            duration: 30,
                            restTime: 60,
                            completed: false,
                          },
                          {
                            id: "set2",
                            reps: 15,
                            weight: 0,
                            duration: 30,
                            restTime: 60,
                            completed: false,
                          },
                          {
                            id: "set3",
                            reps: 15,
                            weight: 0,
                            duration: 30,
                            restTime: 60,
                            completed: false,
                          },
                        ],
                        targetMuscles: ["‌رגליים", "ישבן"],
                        instructions: ["בצע כפיפות רגליים נכונות"],
                        restTime: 60,
                        difficulty: "beginner",
                      },
                    ],
                    restTime: 60,
                    sets: 3,
                    reps: 12,
                  },
                ],
                type: "demo",
                isActive: true,
                frequency: "3 פעמים בשבוע",
                tags: ["דמו"],
              };

              console.log("🎯 Setting demo plan:", demoPlan);
              setWorkoutPlan(demoPlan);
              showMessage(
                "תוכנית דמו נוצרה!",
                "תוכנית אימון דמו נוצרה בהצלחה לבדיקה"
              );
            }}
            accessibilityLabel="צור תוכנית דמו"
            accessibilityHint="לחץ כדי ליצור תוכנית דמו לבדיקה"
          />
        </View>
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
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: isRTL() ? "right" : "left",
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
  actionsContainer: {
    gap: 12,
    marginTop: 24,
  },
  exerciseInfo: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  exerciseInfoText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: isRTL() ? "right" : "left",
  },
  debugText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  tabsContainer: {
    marginBottom: 16,
    direction: isRTL() ? "rtl" : "ltr",
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginEnd: isRTL() ? 0 : 8,
    marginStart: isRTL() ? 8 : 0,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  activeTabText: {
    color: theme.colors.background,
  },
  tabSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  activeTabSubtext: {
    color: theme.colors.background,
    opacity: 0.9,
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
    textAlign: isRTL() ? "right" : "left",
  },
  daySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textAlign: isRTL() ? "right" : "left",
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
    marginBottom: 12,
    textAlign: isRTL() ? "right" : "left",
  },
  exerciseItem: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseItemInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  exerciseEquipment: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  beginnerTips: {
    marginTop: 8,
    padding: 8,
    backgroundColor: theme.colors.primary + "10",
    borderRadius: 6,
    borderStartWidth: isRTL() ? 0 : 3,
    borderEndWidth: isRTL() ? 3 : 0,
    borderLeftColor: isRTL() ? "transparent" : theme.colors.primary,
    borderRightColor: isRTL() ? theme.colors.primary : "transparent",
  },
  beginnerTipsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  beginnerTipsText: {
    fontSize: 11,
    color: theme.colors.text,
    lineHeight: 16,
  },
});
