/**
 * @file src/screens/workout/utils/workoutPlanConverter.ts
 * @status Utility (safe) - בשימוש נקודתי/פוטנציאלי
 * @note המרה מ-WorkoutTemplate ל-WorkoutData עם אפשרות resolve לנתוני תרגיל.
 */

import type {
  WorkoutTemplate,
  WorkoutData,
  Exercise,
} from "../types/workout.types";

type ExerciseResolver = (
  exerciseId: string
) => Partial<
  Pick<
    Exercise,
    | "name"
    | "category"
    | "primaryMuscles"
    | "equipment"
    | "restTime"
    | "notes"
    | "tips"
  >
>;

export const convertTemplateToWorkout = (
  template: WorkoutTemplate,
  opts?: { resolve?: ExerciseResolver }
): WorkoutData => {
  const exercises: Exercise[] = template.exercises.map((t, idx) => {
    const resolved = opts?.resolve?.(t.exerciseId) || {};

    // ציוד ברירת מחדל: מתוך התבנית (אם קיים) או bodyweight
    const tplEquip = Array.isArray(template.equipment)
      ? template.equipment.find(Boolean)
      : undefined;
    const equipmentRaw = resolved.equipment ?? tplEquip ?? "bodyweight";
    const equipment = equipmentRaw === "none" ? "bodyweight" : equipmentRaw;

    // פריסת סטים בטוחה
    const setsCount = Math.max(
      1,
      Number.isFinite(Number(t.sets)) ? Number(t.sets) : 0
    );
    const firstReps = (() => {
      // תומך בטווחים "8-12" וגם בקאסים/טקסטים שונים
      const m = String(t.reps || "").match(/\d+/);
      const n = m ? parseInt(m[0], 10) : 10;
      return Math.max(1, n);
    })();

    return {
      id: `${template.id}_ex_${idx}`,
      name: resolved.name ?? t.exerciseId,
      category: resolved.category ?? "general",
      primaryMuscles: resolved.primaryMuscles ?? [],
      equipment,
      restTime: resolved.restTime ?? t.restTime,
      notes: resolved.notes,
      tips: resolved.tips,
      sets: Array.from({ length: setsCount }).map((_, i) => ({
        id: `${template.id}_ex_${idx}_set_${i}`,
        type: "working",
        targetReps: firstReps,
        targetWeight: 0,
        completed: false,
      })),
    } as Exercise;
  });

  const workout: WorkoutData = {
    id: `workout_${Date.now()}`,
    name: template.name,
    startTime: new Date().toISOString(),
    duration: 0,
    exercises,
    totalVolume: 0,
  } as WorkoutData;

  return workout;
};

// TODO: להמיר בחזרה מ-WorkoutData ל-Template לפי צורך (שמירת עקביות ציוד/סטים/הערות).
