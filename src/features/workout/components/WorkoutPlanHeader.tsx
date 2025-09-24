/**
 * @file src/features/workout/components/WorkoutPlanHeader.tsx
 * @brief Workout plan header with stats and info - extracted from WorkoutPlansScreen
 * Part of modular refactor reducing 1175 lines to manageable components
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../../core/theme";
import UniversalCard from "../../../components/ui/UniversalCard";
import CalorieCalculator from "../../../components/workout/CalorieCalculator";
import { wrapTextWithEmoji } from "../../../utils/rtlHelpers";
import type { WorkoutPlan } from "../../../core/types/workout.types";

interface WorkoutPlanHeaderProps {
  workoutPlan: {
    name?: string;
    duration?: number;
    frequency?: string;
    workouts?: Array<{ id?: string; name?: string }>;
  } | null;
  workoutPlanForCalc?: WorkoutPlan | undefined;
  user: {
    questionnaireData?: {
      answers?: {
        weight?: string | number;
        age?: string | number;
        gender?: string;
      };
    };
  } | null;
}

const WorkoutPlanHeader: React.FC<WorkoutPlanHeaderProps> = ({
  workoutPlan,
  workoutPlanForCalc,
  user,
}) => {
  if (!workoutPlan) return null;

  const workouts = workoutPlan.workouts ?? [];

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>תוכנית האימון שלי</Text>
        <Text style={styles.subtitle}>תוכנית מותאמת אישית</Text>
      </View>

      <UniversalCard title={workoutPlan.name ?? "תוכנית אימון"}>
        <View style={styles.planStats}>
          <Text style={styles.planStat}>🏋️ {workouts.length} אימונים</Text>
          <Text style={styles.planStat}>
            {wrapTextWithEmoji(`${workoutPlan.duration ?? 30} דקות`, "⏱️")}
          </Text>
          <Text style={styles.planStat}>
            {wrapTextWithEmoji(workoutPlan.frequency || "לא צוין", "📅")}
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
      </UniversalCard>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  planStat: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export default WorkoutPlanHeader;
