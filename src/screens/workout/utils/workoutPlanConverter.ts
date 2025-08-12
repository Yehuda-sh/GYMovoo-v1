/**
 * @file src/screens/workout/utils/workoutPlanConverter.ts
 * @status Placeholder (TODO) - לא בשימוש כרגע
 * @note קובץ זה נשמר כ-stub כדי למנוע הפניות שבורות. הצעתי: לממש המרה בין Template ל-WorkoutData.
 */

import type {
  WorkoutTemplate,
  WorkoutData,
  Exercise,
} from "../types/workout.types";

export const convertTemplateToWorkout = (
  template: WorkoutTemplate
): WorkoutData => {
  const exercises: Exercise[] = template.exercises.map((t, idx) => ({
    id: `${template.id}_ex_${idx}`,
    name: t.exerciseId,
    category: "general",
    primaryMuscles: [],
    equipment: "none",
    sets: Array.from({ length: t.sets }).map((_, i) => ({
      id: `${template.id}_ex_${idx}_set_${i}`,
      type: "working",
      targetReps: parseInt(t.reps.split("-")[0] || "10", 10),
      targetWeight: 0,
      completed: false,
    })),
  }));

  return {
    id: `workout_${Date.now()}`,
    name: template.name,
    startTime: new Date().toISOString(),
    duration: 0,
    exercises,
    totalVolume: 0,
  } as WorkoutData;
};

// TODO: להמיר בחזרה מ-WorkoutData ל-Template לפי צורך.
