/**
 * @file src/features/workout/services/nextWorkoutLogicService.ts
 * @description שירות לוגיקת האימון הבא - מנהל את ההתקדמות באימונים
 * @status ACTIVE - features-based architecture
 * @updated 2025-01-08
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import workoutFacadeService from "../../../services/workout/workoutFacadeService";
import { daysSinceLastWorkout } from "../../../utils/dateHelpers";
import { logger } from "../../../utils/logger";

const WORKOUT_CYCLE_KEY = "workout_cycle_state";
const CACHE_DURATION_MS = 5_000 as const;
const DEFAULT_WEEKLY_PLAN = ["דחיפה", "משיכה", "רגליים"] as const;

export interface WorkoutCycleState {
  currentWeekNumber: number;
  currentDayInWeek: number; // אינדקס היום האחרון שהושלם בתוכנית
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

/** מבנה מינימלי של רשומה בהיסטוריית אימונים שעליו אנו מסתמכים */
interface WorkoutHistoryEntry {
  feedback?: {
    completedAt?: string;
  };
  /** שדה היסטורי אפשרי באחסון ישן */
  endTime?: string;
}

/** עוזר בטוח להפקת timestamp מרשומת היסטוריה */
const getHistoryEntryTime = (e: WorkoutHistoryEntry): number => {
  const iso = e.feedback?.completedAt ?? e.endTime ?? "";
  const t = new Date(iso || 0).getTime();
  return Number.isFinite(t) ? t : 0;
};

class NextWorkoutLogicService {
  private cachedCycleState: WorkoutCycleState | null = null;
  private cacheTimestamp = 0;

  /**
   * קבלת האימון הבא לפי תוכנית שבועית
   */
  async getNextWorkoutRecommendation(
    weeklyPlan: string[]
  ): Promise<NextWorkoutRecommendation> {
    try {
      const plan =
        weeklyPlan && weeklyPlan.length > 0
          ? weeklyPlan
          : [...DEFAULT_WEEKLY_PLAN];
      const cycleState = await this.getCurrentCycleState(plan);

      const daysSince =
        cycleState.lastWorkoutDate &&
        cycleState.lastWorkoutDate.trim().length > 0
          ? daysSinceLastWorkout(cycleState.lastWorkoutDate)
          : 999; // משתמש חדש

      return this.determineNextWorkout(plan, cycleState, daysSince);
    } catch (error) {
      logger.error(
        "NextWorkoutLogicService",
        "getNextWorkoutRecommendation failed",
        error
      );
      const plan =
        weeklyPlan && weeklyPlan.length > 0
          ? weeklyPlan
          : [...DEFAULT_WEEKLY_PLAN];
      return this.createRecommendation(
        plan[0] ?? "דחיפה",
        0,
        "אימון ברירת מחדל",
        true,
        0,
        "normal"
      );
    }
  }

  /**
   * קביעת האימון הבא לפי ימים מאז אימון אחרון והתקדמות במחזור
   */
  private determineNextWorkout(
    weeklyPlan: string[],
    cycleState: WorkoutCycleState,
    daysSinceLast: number
  ): NextWorkoutRecommendation {
    const planLen = Math.max(weeklyPlan.length, 1);
    const safeDayIndex = Math.min(
      Math.max(cycleState.currentDayInWeek, 0),
      planLen - 1
    );

    // משתמש חדש / אין תאריך אחרון
    if (!cycleState.lastWorkoutDate || daysSinceLast >= 999) {
      return this.createRecommendation(
        weeklyPlan[0] ?? "דחיפה",
        0,
        "ברוכים הבאים! בואו נתחיל 🚀",
        true,
        0,
        "normal"
      );
    }

    // אותו היום
    if (daysSinceLast === 0) {
      return this.createRecommendation(
        cycleState.weeklyPlan[safeDayIndex] ?? "מנוחה",
        safeDayIndex,
        "כבר התאמנת היום! מנוחה חשובה 💪",
        false,
        daysSinceLast,
        "light"
      );
    }

    // התקדמות רגילה (יום אחד)
    if (daysSinceLast === 1) {
      const nextDayIndex = (safeDayIndex + 1) % planLen;
      return this.createRecommendation(
        weeklyPlan[nextDayIndex] ?? "דחיפה",
        nextDayIndex,
        "המשך מצוין! זמן לאימון הבא 🎯",
        true,
        daysSinceLast,
        "normal"
      );
    }

    // הפסקה קצרה (2–4 ימים)
    if (daysSinceLast >= 2 && daysSinceLast <= 4) {
      const nextDayIndex = (safeDayIndex + 1) % planLen;
      return this.createRecommendation(
        weeklyPlan[nextDayIndex] ?? "דחיפה",
        nextDayIndex,
        `${daysSinceLast} ימי מנוחה - בואו נמשיך! 💪`,
        true,
        daysSinceLast,
        "normal"
      );
    }

    // הפסקה בינונית (5–7 ימים) – התחלה מחדש
    if (daysSinceLast >= 5 && daysSinceLast <= 7) {
      return this.createRecommendation(
        weeklyPlan[0] ?? "דחיפה",
        0,
        `${daysSinceLast} ימים - מתחילים שבוע חדש! 🌟`,
        false,
        daysSinceLast,
        "light"
      );
    }

    // הפסקה ארוכה – חזרה הדרגתית
    if (daysSinceLast > 7) {
      return this.createRecommendation(
        weeklyPlan[0] ?? "דחיפה",
        0,
        `הפסקה ארוכה - חוזרים בהדרגה! 🎯`,
        false,
        daysSinceLast,
        "light"
      );
    }

    // ברירת מחדל
    return this.createRecommendation(
      weeklyPlan[0] ?? "דחיפה",
      0,
      "בואו נתחיל! 🚀",
      true,
      daysSinceLast,
      "normal"
    );
  }

  /**
   * שליפת מצב המחזור הנוכחי (עם קאש קצר)
   */
  private async getCurrentCycleState(
    weeklyPlan?: string[]
  ): Promise<WorkoutCycleState> {
    try {
      const now = Date.now();

      // קאש קצר
      if (
        this.cachedCycleState &&
        now - this.cacheTimestamp < CACHE_DURATION_MS &&
        (!weeklyPlan ||
          JSON.stringify(this.cachedCycleState.weeklyPlan) ===
            JSON.stringify(weeklyPlan))
      ) {
        return this.cachedCycleState;
      }

      // נסה לטעון מהאחסון
      const savedStateStr = await AsyncStorage.getItem(WORKOUT_CYCLE_KEY);
      if (savedStateStr) {
        const state = JSON.parse(savedStateStr) as WorkoutCycleState;
        if (
          !weeklyPlan ||
          JSON.stringify(state.weeklyPlan) === JSON.stringify(weeklyPlan)
        ) {
          this.cachedCycleState = state;
          this.cacheTimestamp = now;
          return state;
        }
      }

      // בנה מצב חדש מהיסטוריית אימונים
      const workoutHistoryUnknown = await workoutFacadeService.getHistory();
      const workoutHistory = workoutHistoryUnknown as WorkoutHistoryEntry[];

      const sortedHistory = [...workoutHistory].sort(
        (a, b) => getHistoryEntryTime(b) - getHistoryEntryTime(a)
      );

      const plan =
        weeklyPlan && weeklyPlan.length > 0
          ? weeklyPlan
          : [...DEFAULT_WEEKLY_PLAN];
      const planLen = plan.length;

      const lastWorkout = sortedHistory[0] ?? null;
      const lastWorkoutDate: string = (lastWorkout?.feedback?.completedAt ??
        lastWorkout?.endTime ??
        "") as string;

      // האינדקס של היום האחרון שהושלם בתוכנית:
      // אם יש היסטוריה, נקבע לפי (historyLength - 1) % planLen, אחרת 0
      const historyCount = workoutHistory.length;
      const lastCompletedIndex =
        planLen > 0 ? (historyCount > 0 ? (historyCount - 1) % planLen : 0) : 0;

      const newState: WorkoutCycleState = {
        currentWeekNumber:
          planLen > 0 ? Math.floor(historyCount / planLen) + 1 : 1,
        currentDayInWeek: lastCompletedIndex,
        lastWorkoutDate,
        totalWorkoutsCompleted: historyCount,
        programStartDate: new Date().toISOString(),
        weeklyPlan: [...plan],
      };

      if (newState.weeklyPlan.length > 0) {
        await AsyncStorage.setItem(WORKOUT_CYCLE_KEY, JSON.stringify(newState));
      }

      this.cachedCycleState = newState;
      this.cacheTimestamp = now;
      return newState;
    } catch (error) {
      logger.error(
        "NextWorkoutLogicService",
        "getCurrentCycleState failed",
        error
      );
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

  /**
   * עדכון מצב לאחר סימון אימון כהושלם
   */
  async updateWorkoutCompleted(workoutIndex: number): Promise<void> {
    try {
      const currentState = await this.getCurrentCycleState();
      const planLen = Math.max(1, currentState.weeklyPlan.length);
      const normalizedIndex = ((workoutIndex % planLen) + planLen) % planLen; // הגנה על שלילי

      const updatedState: WorkoutCycleState = {
        ...currentState,
        currentDayInWeek: normalizedIndex,
        lastWorkoutDate: new Date().toISOString(),
        totalWorkoutsCompleted: currentState.totalWorkoutsCompleted + 1,
        currentWeekNumber:
          planLen > 0
            ? Math.floor((currentState.totalWorkoutsCompleted + 1) / planLen) +
              1
            : 1,
      };

      await AsyncStorage.setItem(
        WORKOUT_CYCLE_KEY,
        JSON.stringify(updatedState)
      );

      // נקה קאש
      this.cachedCycleState = null;
      this.cacheTimestamp = 0;
    } catch (error) {
      logger.error(
        "NextWorkoutLogicService",
        "updateWorkoutCompleted failed",
        error
      );
    }
  }
}

export const nextWorkoutLogicService = new NextWorkoutLogicService();
