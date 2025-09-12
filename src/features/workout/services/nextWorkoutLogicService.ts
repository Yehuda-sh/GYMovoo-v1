/**
 * @file src/features/workout/services/nextWorkoutLogicService.ts
 * @description שירות לוגיקת האימון הבא - מנהל את ההתקדמות באימונים
 * @status ACTIVE - Moved from src/services/ to features-based architecture
 * @updated 2025-01-08 - Removed unused personalData parameter, moved to features structure
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import workoutFacadeService from "../../../services/workout/workoutFacadeService";
import { daysSinceLastWorkout } from "../../../utils/dateHelpers";

const WORKOUT_CYCLE_KEY = "workout_cycle_state";

export interface WorkoutCycleState {
  currentWeekNumber: number;
  currentDayInWeek: number;
  lastWorkoutDate: string;
  totalWorkoutsCompleted: number;
  programStartDate: string;
  weeklyPlan: string[];
}

export interface NextWorkoutRecommendation {
  workoutName: string;
  workoutIndex: number;
  reason: string;
  isRegularProgression: boolean;
  daysSinceLastWorkout: number;
  suggestedIntensity: "normal" | "light" | "catchup";
}

class NextWorkoutLogicService {
  private cachedCycleState: WorkoutCycleState | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5000;

  async getNextWorkoutRecommendation(
    weeklyPlan: string[]
  ): Promise<NextWorkoutRecommendation> {
    try {
      if (!weeklyPlan || weeklyPlan.length === 0) {
        weeklyPlan = ["דחיפה", "משיכה", "רגליים"];
      }

      const cycleState = await this.getCurrentCycleState(weeklyPlan);
      const daysSinceLastWorkoutCount = daysSinceLastWorkout(
        cycleState.lastWorkoutDate
      );

      return this.determineNextWorkout(
        weeklyPlan,
        cycleState,
        daysSinceLastWorkoutCount
      );
    } catch (error) {
      console.error("NextWorkoutLogic error:", error);
      const safeWeeklyPlan =
        weeklyPlan && weeklyPlan.length > 0
          ? weeklyPlan
          : ["דחיפה", "משיכה", "רגליים"];
      return this.createRecommendation(
        safeWeeklyPlan[0] || "דחיפה",
        0,
        "אימון ברירת מחדל",
        true,
        0,
        "normal"
      );
    }
  }

  private determineNextWorkout(
    weeklyPlan: string[],
    cycleState: WorkoutCycleState,
    daysSinceLastWorkout: number
  ): NextWorkoutRecommendation {
    // New user
    if (!cycleState.lastWorkoutDate || daysSinceLastWorkout >= 999) {
      return this.createRecommendation(
        weeklyPlan[0] || "דחיפה",
        0,
        "ברוכים הבאים! בואו נתחיל 🚀",
        true,
        0,
        "normal"
      );
    }

    // Same day
    if (daysSinceLastWorkout === 0) {
      return this.createRecommendation(
        cycleState.weeklyPlan[cycleState.currentDayInWeek] || "מנוחה",
        cycleState.currentDayInWeek,
        "כבר התאמנת היום! מנוחה חשובה 💪",
        false,
        daysSinceLastWorkout,
        "light"
      );
    }

    // Regular progression (1 day)
    if (daysSinceLastWorkout === 1) {
      const nextDayIndex =
        (cycleState.currentDayInWeek + 1) % weeklyPlan.length;
      return this.createRecommendation(
        weeklyPlan[nextDayIndex] || "דחיפה",
        nextDayIndex,
        "המשך מצוין! זמן לאימון הבא 🎯",
        true,
        daysSinceLastWorkout,
        "normal"
      );
    }

    // Short break (2-4 days)
    if (daysSinceLastWorkout >= 2 && daysSinceLastWorkout <= 4) {
      const nextDayIndex =
        (cycleState.currentDayInWeek + 1) % weeklyPlan.length;
      return this.createRecommendation(
        weeklyPlan[nextDayIndex] || "דחיפה",
        nextDayIndex,
        `${daysSinceLastWorkout} ימי מנוחה - בואו נמשיך! 💪`,
        true,
        daysSinceLastWorkout,
        "normal"
      );
    }

    // Medium break (5-7 days) - restart week
    if (daysSinceLastWorkout >= 5 && daysSinceLastWorkout <= 7) {
      return this.createRecommendation(
        weeklyPlan[0] || "דחיפה",
        0,
        `${daysSinceLastWorkout} ימים - מתחילים שבוע חדש! 🌟`,
        false,
        daysSinceLastWorkout,
        "light"
      );
    }

    // Long break - gradual return
    if (daysSinceLastWorkout > 7) {
      return this.createRecommendation(
        weeklyPlan[0] || "דחיפה",
        0,
        `הפסקה ארוכה - חוזרים בהדרגה! 🎯`,
        false,
        daysSinceLastWorkout,
        "light"
      );
    }

    // Fallback
    return this.createRecommendation(
      weeklyPlan[0] || "דחיפה",
      0,
      "בואו נתחיל! 🚀",
      true,
      daysSinceLastWorkout,
      "normal"
    );
  }

  private async getCurrentCycleState(
    weeklyPlan?: string[]
  ): Promise<WorkoutCycleState> {
    try {
      const now = Date.now();

      // Simple cache check
      if (
        this.cachedCycleState &&
        now - this.cacheTimestamp < this.CACHE_DURATION &&
        (!weeklyPlan ||
          JSON.stringify(this.cachedCycleState.weeklyPlan) ===
            JSON.stringify(weeklyPlan))
      ) {
        return this.cachedCycleState;
      }

      const savedState = await AsyncStorage.getItem(WORKOUT_CYCLE_KEY);

      if (savedState) {
        const state = JSON.parse(savedState) as WorkoutCycleState;

        if (!weeklyPlan) {
          this.cachedCycleState = state;
          this.cacheTimestamp = now;
          return state;
        }

        if (JSON.stringify(state.weeklyPlan) === JSON.stringify(weeklyPlan)) {
          this.cachedCycleState = state;
          this.cacheTimestamp = now;
          return state;
        }
      }

      // Create new state from workout history
      const workoutHistory = await workoutFacadeService.getHistory();
      const sortedHistory = workoutHistory.sort((a, b) => {
        const dateA = new Date(
          a.feedback?.completedAt || a.endTime || 0
        ).getTime();
        const dateB = new Date(
          b.feedback?.completedAt || b.endTime || 0
        ).getTime();
        return dateB - dateA;
      });

      const lastWorkout = sortedHistory.length > 0 ? sortedHistory[0] : null;
      const lastWorkoutDate =
        lastWorkout?.feedback?.completedAt || lastWorkout?.endTime || "";

      const newState: WorkoutCycleState = {
        currentWeekNumber: 1,
        currentDayInWeek: Math.min(
          workoutHistory.length,
          (weeklyPlan ?? []).length - 1
        ),
        lastWorkoutDate,
        totalWorkoutsCompleted: workoutHistory.length,
        programStartDate: new Date().toISOString(),
        weeklyPlan: [...(weeklyPlan ?? [])],
      };

      if (newState.weeklyPlan.length > 0) {
        await AsyncStorage.setItem(WORKOUT_CYCLE_KEY, JSON.stringify(newState));
      }

      this.cachedCycleState = newState;
      this.cacheTimestamp = now;

      return newState;
    } catch (error) {
      console.error("Error getting cycle state:", error);
      return {
        currentWeekNumber: 1,
        currentDayInWeek: 0,
        lastWorkoutDate: "",
        totalWorkoutsCompleted: 0,
        programStartDate: new Date().toISOString(),
        weeklyPlan: [...(weeklyPlan ?? [])],
      };
    }
  }

  private createRecommendation(
    workoutName: string,
    workoutIndex: number,
    reason: string,
    isRegularProgression: boolean,
    daysSinceLastWorkout: number,
    suggestedIntensity: "normal" | "light" | "catchup"
  ): NextWorkoutRecommendation {
    return {
      workoutName,
      workoutIndex,
      reason,
      isRegularProgression,
      daysSinceLastWorkout,
      suggestedIntensity,
    };
  }

  async updateWorkoutCompleted(
    workoutIndex: number,
    _workoutName: string
  ): Promise<void> {
    try {
      const currentState = await this.getCurrentCycleState();
      const planLength = Math.max(1, currentState.weeklyPlan.length);
      const normalizedIndex = workoutIndex % planLength;

      const updatedState: WorkoutCycleState = {
        ...currentState,
        currentDayInWeek: normalizedIndex,
        lastWorkoutDate: new Date().toISOString(),
        totalWorkoutsCompleted: currentState.totalWorkoutsCompleted + 1,
        currentWeekNumber:
          Math.floor((currentState.totalWorkoutsCompleted + 1) / planLength) +
          1,
      };

      await AsyncStorage.setItem(
        WORKOUT_CYCLE_KEY,
        JSON.stringify(updatedState)
      );

      // Invalidate cache
      this.cachedCycleState = null;
      this.cacheTimestamp = 0;
    } catch (error) {
      console.error("Error updating workout completed:", error);
    }
  }
}

export const nextWorkoutLogicService = new NextWorkoutLogicService();
