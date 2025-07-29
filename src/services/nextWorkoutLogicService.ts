/**
 * @file src/services/nextWorkoutLogicService.ts
 * @description שירות לקביעת האימון הבא במחזור
 * English: Service for determining the next workout in cycle
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const WORKOUT_CYCLE_KEY = "workout_cycle_state";
const LAST_WORKOUT_DATE_KEY = "last_workout_date";

export interface WorkoutCycleState {
  currentWeekNumber: number; // שבוע נוכחי במחזור
  currentDayInWeek: number; // יום נוכחי בשבוע (0-6)
  lastWorkoutDate: string; // תאריך האימון האחרון
  totalWorkoutsCompleted: number; // כמה אימונים הושלמו
  programStartDate: string; // תאריך התחלת התוכנית
  weeklyPlan: string[]; // רשימת שמות האימונים בסדר השבועי
}

export interface NextWorkoutRecommendation {
  workoutName: string; // שם האימון הרצוי
  workoutIndex: number; // אינדקס באימונים השבועיים
  reason: string; // הסבר למה בחרנו את האימון הזה
  isRegularProgression: boolean; // האם זה המשך רגיל או תיקון
  daysSinceLastWorkout: number; // כמה ימים עברו מהאימון האחרון
  suggestedIntensity: "normal" | "light" | "catchup"; // רמת אינטנסיביות מומלצת
}

class NextWorkoutLogicService {
  // Cache למניעת קריאות מיותרות
  private cachedCycleState: WorkoutCycleState | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5000; // 5 שניות

  /**
   * פונקציה ראשית - מחליטה איזה אימון הבא
   * Main function - decides which workout is next
   */
  async getNextWorkoutRecommendation(
    weeklyPlan: string[]
  ): Promise<NextWorkoutRecommendation> {
    try {
      console.log("🚀 Starting workout recommendation calculation");

      // וידוא שיש תוכנית אימונים
      if (!weeklyPlan || weeklyPlan.length === 0) {
        console.log("⚠️ No weekly plan provided, using default");
        weeklyPlan = ["דחיפה", "משיכה", "רגליים"];
      }

      // 1. קבלת מצב הציקל הנוכחי
      const cycleState = await this.getCurrentCycleState(weeklyPlan);

      // 2. חישוב כמה ימים עברו מהאימון האחרון
      const daysSinceLastWorkout = this.calculateDaysSinceLastWorkout(
        cycleState.lastWorkoutDate
      );

      // מקרה מיוחד: משתמש חדש (אף פעם לא התאמן)
      if (!cycleState.lastWorkoutDate || daysSinceLastWorkout >= 999) {
        console.log("👋 New user - starting first workout");
        return this.createRecommendation(
          weeklyPlan[0],
          0,
          "ברוכים הבאים! התחלת תוכנית האימונים",
          true,
          0,
          "normal"
        );
      }

      // 3. החלטה לפי תרחישים שונים
      if (daysSinceLastWorkout === 0) {
        // אימון היום - לא מומלץ
        return this.createRecommendation(
          cycleState.weeklyPlan[cycleState.currentDayInWeek],
          cycleState.currentDayInWeek,
          "כבר התאמנת היום! מומלץ למנוח",
          false,
          daysSinceLastWorkout,
          "light"
        );
      } else if (daysSinceLastWorkout === 1) {
        // יום אחד הפסקה - המשך רגיל
        const nextDayIndex =
          (cycleState.currentDayInWeek + 1) % weeklyPlan.length;
        return this.createRecommendation(
          weeklyPlan[nextDayIndex],
          nextDayIndex,
          "המשך רגיל לאימון הבא בתוכנית",
          true,
          daysSinceLastWorkout,
          "normal"
        );
      } else if (daysSinceLastWorkout >= 2 && daysSinceLastWorkout <= 4) {
        // הפסקה של 2-4 ימים - המשך מהאימון הבא
        const nextDayIndex =
          (cycleState.currentDayInWeek + 1) % weeklyPlan.length;
        return this.createRecommendation(
          weeklyPlan[nextDayIndex],
          nextDayIndex,
          `${daysSinceLastWorkout} ימי הפסקה - ממשיכים לאימון הבא`,
          true,
          daysSinceLastWorkout,
          "normal"
        );
      } else if (daysSinceLastWorkout >= 5 && daysSinceLastWorkout <= 7) {
        // הפסקה ארוכה - חזרה לאימון הראשון בשבוע
        return this.createRecommendation(
          weeklyPlan[0],
          0,
          `הפסקה של ${daysSinceLastWorkout} ימים - מתחילים שבוע חדש`,
          false,
          daysSinceLastWorkout,
          "light"
        );
      } else if (daysSinceLastWorkout > 7) {
        // הפסקה ארוכה מאוד - חזרה לאימון הראשון עם עצמה מופחתת
        return this.createRecommendation(
          weeklyPlan[0],
          0,
          `הפסקה ארוכה של ${daysSinceLastWorkout} ימים - חזרה מדורגת`,
          false,
          daysSinceLastWorkout,
          "light"
        );
      } else {
        // מקרה ברירת מחדל - אימון ראשון
        return this.createRecommendation(
          weeklyPlan[0],
          0,
          "התחלת תוכנית חדשה",
          true,
          daysSinceLastWorkout,
          "normal"
        );
      }
    } catch (error) {
      console.error("❌ Error getting next workout recommendation:", error);
      // ברירת מחדל במקרה של שגיאה - חזור לאימון הראשון
      const safeWeeklyPlan =
        weeklyPlan && weeklyPlan.length > 0
          ? weeklyPlan
          : ["דחיפה", "משיכה", "רגליים"];
      return this.createRecommendation(
        safeWeeklyPlan[0],
        0,
        "אימון ברירת מחדל",
        true,
        0,
        "normal"
      );
    }
  }

  /**
   * קבלת מצב הציקל הנוכחי
   * Get current cycle state
   */
  private async getCurrentCycleState(
    weeklyPlan: string[]
  ): Promise<WorkoutCycleState> {
    try {
      // בדיקת cache
      const now = Date.now();
      if (
        this.cachedCycleState &&
        now - this.cacheTimestamp < this.CACHE_DURATION &&
        JSON.stringify(this.cachedCycleState.weeklyPlan) ===
          JSON.stringify(weeklyPlan)
      ) {
        console.log("🚀 Using cached cycle state");
        return this.cachedCycleState;
      }

      console.log("📀 Loading cycle state from storage");
      const savedState = await AsyncStorage.getItem(WORKOUT_CYCLE_KEY);

      if (savedState) {
        const state = JSON.parse(savedState) as WorkoutCycleState;
        // וידוא שהתוכנית לא השתנתה
        if (JSON.stringify(state.weeklyPlan) === JSON.stringify(weeklyPlan)) {
          // עדכון cache
          this.cachedCycleState = state;
          this.cacheTimestamp = now;
          return state;
        }
      }

      // יצירת מצב חדש אם אין או שהתוכנית השתנתה
      const newState: WorkoutCycleState = {
        currentWeekNumber: 1,
        currentDayInWeek: 0,
        lastWorkoutDate: "",
        totalWorkoutsCompleted: 0,
        programStartDate: new Date().toISOString(),
        weeklyPlan: [...weeklyPlan],
      };

      await AsyncStorage.setItem(WORKOUT_CYCLE_KEY, JSON.stringify(newState));

      // עדכון cache
      this.cachedCycleState = newState;
      this.cacheTimestamp = now;

      return newState;
    } catch (error) {
      console.error("Error getting cycle state:", error);
      // ברירת מחדל
      return {
        currentWeekNumber: 1,
        currentDayInWeek: 0,
        lastWorkoutDate: "",
        totalWorkoutsCompleted: 0,
        programStartDate: new Date().toISOString(),
        weeklyPlan: [...weeklyPlan],
      };
    }
  }

  /**
   * חישוב ימים מאז האימון האחרון
   * Calculate days since last workout
   */
  private calculateDaysSinceLastWorkout(lastWorkoutDate: string): number {
    if (!lastWorkoutDate || lastWorkoutDate === "") {
      console.log("📅 No previous workout found");
      return 999; // אף פעם לא התאמן
    }

    try {
      const lastDate = new Date(lastWorkoutDate);
      const today = new Date();

      // אם התאריך לא תקין
      if (isNaN(lastDate.getTime())) {
        console.log("⚠️ Invalid workout date format");
        return 999;
      }

      const timeDiff = today.getTime() - lastDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      console.log(`📅 Days since last workout: ${daysDiff}`);
      return Math.max(0, daysDiff); // לא יכול להיות שלילי
    } catch (error) {
      console.error("Error calculating days since last workout:", error);
      return 999;
    }
  }

  /**
   * יצירת המלצה
   * Create recommendation
   */
  private createRecommendation(
    workoutName: string,
    workoutIndex: number,
    reason: string,
    isRegularProgression: boolean,
    daysSinceLastWorkout: number,
    suggestedIntensity: "normal" | "light" | "catchup"
  ): NextWorkoutRecommendation {
    console.log(
      `✅ Created recommendation: ${workoutName} (index: ${workoutIndex})`
    );
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
   * עדכון מצב האימון לאחר השלמת אימון
   * Update workout state after completing workout
   */
  async updateWorkoutCompleted(
    workoutIndex: number,
    workoutName: string
  ): Promise<void> {
    try {
      const currentState = await this.getCurrentCycleState([]);

      const updatedState: WorkoutCycleState = {
        ...currentState,
        currentDayInWeek: workoutIndex,
        lastWorkoutDate: new Date().toISOString().split("T")[0], // רק התאריך
        totalWorkoutsCompleted: currentState.totalWorkoutsCompleted + 1,
        currentWeekNumber:
          Math.floor(
            currentState.totalWorkoutsCompleted / currentState.weeklyPlan.length
          ) + 1,
      };

      await AsyncStorage.setItem(
        WORKOUT_CYCLE_KEY,
        JSON.stringify(updatedState)
      );

      // נקה cache כדי שבטעינה הבאה יהיה עדכני
      this.cachedCycleState = null;
      this.cacheTimestamp = 0;

      console.log(
        `✅ Workout cycle updated: completed "${workoutName}" (index ${workoutIndex})`
      );
    } catch (error) {
      console.error("Error updating workout completed:", error);
    }
  }

  /**
   * איפוס מחזור האימונים (למקרה של תוכנית חדשה)
   * Reset workout cycle (for new program)
   */
  async resetWorkoutCycle(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WORKOUT_CYCLE_KEY);
      await AsyncStorage.removeItem(LAST_WORKOUT_DATE_KEY);

      // נקה cache
      this.cachedCycleState = null;
      this.cacheTimestamp = 0;

      console.log("✅ Workout cycle reset");
    } catch (error) {
      console.error("Error resetting workout cycle:", error);
    }
  }

  /**
   * קבלת סטטיסטיקות מחזור
   * Get cycle statistics
   */
  async getCycleStatistics(): Promise<{
    currentWeek: number;
    totalWorkouts: number;
    daysInProgram: number;
    consistency: number; // אחוז עקביות
  }> {
    try {
      const state = await this.getCurrentCycleState([]);
      const programStart = new Date(state.programStartDate);
      const today = new Date();
      const daysInProgram = Math.floor(
        (today.getTime() - programStart.getTime()) / (1000 * 3600 * 24)
      );

      // חישוב עקביות (כמה אימונים עשה מתוך כמה שהיה אמור)
      const expectedWorkouts =
        Math.floor(daysInProgram / 2) * state.weeklyPlan.length; // בהנחה של אימון כל יומיים
      const consistency =
        expectedWorkouts > 0
          ? (state.totalWorkoutsCompleted / expectedWorkouts) * 100
          : 100;

      return {
        currentWeek: state.currentWeekNumber,
        totalWorkouts: state.totalWorkoutsCompleted,
        daysInProgram,
        consistency: Math.min(100, Math.max(0, consistency)),
      };
    } catch (error) {
      console.error("Error getting cycle statistics:", error);
      return {
        currentWeek: 1,
        totalWorkouts: 0,
        daysInProgram: 0,
        consistency: 100,
      };
    }
  }
}

export const nextWorkoutLogicService = new NextWorkoutLogicService();
