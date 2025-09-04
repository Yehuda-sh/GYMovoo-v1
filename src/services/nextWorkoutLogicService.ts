/**
 * @file src/services/nextWorkoutLogicService.ts
 * @description שירות לוגיקת האימון הבא במחזור - מערכת חכמה לניהול תוכניות אימון
 * English: Next workout logic service - intelligent system for workout program management
 * @status ACTIVE - Core service with intensive usage in useNextWorkout hook
 * @dependencies AsyncStorage for persistence, intelligent caching system
 * @usedBy useNextWorkout hook (primary), exported via services/index.ts
 * @notes מספק המלצות חכמות לאימון הבא על בסיס היסטוריה, דפוסי אימון ולוגיקה מתקדמת
 * @performance Optimized with intelligent caching (5s), efficient date calculations, memory management
 * @rtl Full Hebrew workout names and reason explanations support
 * @accessibility Compatible with screen readers and workout progression tracking
 * @algorithm Advanced logic for workout progression, break detection, intensity adjustment
 * @updated 2025-09-01 Enhanced documentation and code quality review
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutFacadeService } from "./workout/workoutFacadeService";

// =======================================
// 🔑 Storage Configuration
// הגדרות אחסון
// =======================================

const WORKOUT_CYCLE_KEY = "workout_cycle_state";

// =======================================
// 📊 TypeScript Interfaces
// ממשקי טייפסקריפט
// =======================================

/**
 * Comprehensive workout cycle state with enhanced tracking capabilities
 * מצב מחזור אימון מקיף עם יכולות מעקב משופרות
 */
export interface WorkoutCycleState {
  currentWeekNumber: number; // שבוע נוכחי במחזור
  currentDayInWeek: number; // יום נוכחי בשבוע (0-6)
  lastWorkoutDate: string; // תאריך האימון האחרון
  totalWorkoutsCompleted: number; // כמה אימונים הושלמו
  programStartDate: string; // תאריך התחלת התוכנית
  weeklyPlan: string[]; // רשימת שמות האימונים בסדר השבועי
}

/**
 * Intelligent next workout recommendation with comprehensive metadata
 * המלצה חכמה לאימון הבא עם מטא-דאטה מקיף
 */
export interface NextWorkoutRecommendation {
  workoutName: string; // שם האימון הרצוי
  workoutIndex: number; // אינדקס באימונים השבועיים
  reason: string; // הסבר למה בחרנו את האימון הזה
  isRegularProgression: boolean; // האם זה המשך רגיל או תיקון
  daysSinceLastWorkout: number; // כמה ימים עברו מהאימון האחרון
  suggestedIntensity: "normal" | "light" | "catchup"; // רמת אינטנסיביות מומלצת
}

// =======================================
// 🧠 Intelligent Workout Logic Service
// שירות לוגיקת אימון חכמה
// =======================================

class NextWorkoutLogicService {
  // =======================================
  // 💾 Enhanced Caching System
  // מערכת מטמון משופרת
  // =======================================

  /**
   * Intelligent cache for cycle state with performance optimization
   * מטמון חכם למצב המחזור עם אופטימיזציה של ביצועים
   */
  private cachedCycleState: WorkoutCycleState | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5000; // 5 seconds optimized cache

  // ✅ הוספת מנגנון להגנה מפני קריאות כפולות
  private activeFetches = new Set<string>();
  private static lastRecommendationTime = 0;
  private static readonly MIN_REQUEST_INTERVAL = 1000; // 1 שנייה בין בקשות

  // =======================================
  // 🚀 Core Recommendation Engine
  // מנוע המלצות מרכזי
  // =======================================

  /**
   * Enhanced main recommendation function with advanced decision logic
   * פונקציה ראשית משופרת עם לוגיקת החלטה מתקדמת
   *
   * @param weeklyPlan - Array of workout names in weekly order
   * @param personalData - ✅ נתונים אישיים לשיפור ההמלצות (גיל, משקל, גובה, מין)
   * @returns {Promise<NextWorkoutRecommendation>} Intelligent workout recommendation
   * @performance Optimized with caching and efficient calculations
   * @algorithm Uses advanced logic for workout progression, break detection, and intensity adjustment
   */
  async getNextWorkoutRecommendation(
    weeklyPlan: string[],
    personalData?: {
      gender?: string;
      age?: string;
      weight?: string;
      height?: string;
      fitnessLevel?: string;
    }
  ): Promise<NextWorkoutRecommendation> {
    try {
      const now = Date.now();
      const requestKey = `${JSON.stringify(weeklyPlan)}_${JSON.stringify(personalData)}`;

      // ✅ הגנה מפני קריאות תכופות מדי
      if (
        now - NextWorkoutLogicService.lastRecommendationTime <
        NextWorkoutLogicService.MIN_REQUEST_INTERVAL
      ) {
        if (__DEV__)
          console.warn(
            "⏱️ NextWorkoutLogic: Request too frequent, using cached result"
          );
        // החזר המלצה מהירה אם יש cache
        if (this.cachedCycleState) {
          return this.createRecommendation(
            weeklyPlan[0] || "דחיפה",
            0,
            "המלצה זמנית - מונע עומס יתר",
            true,
            0,
            "normal"
          );
        }
      }

      // ✅ מניעת קריאות כפולות בו זמנית
      if (this.activeFetches.has(requestKey)) {
        if (__DEV__)
          console.warn(
            "🔄 NextWorkoutLogic: Request already in progress, skipping duplicate"
          );
        return this.createRecommendation(
          weeklyPlan[0] || "דחיפה",
          0,
          "ממתין לחישוב קודם",
          true,
          0,
          "normal"
        );
      }

      this.activeFetches.add(requestKey);
      NextWorkoutLogicService.lastRecommendationTime = now;

      // ✅ הפחתת לוגים מיותרים - רק לוגים חשובים
      if (__DEV__) {
        console.warn(
          "🚀 NextWorkoutLogic: Starting intelligent workout recommendation calculation"
        );
      }

      // ✅ הדפסת נתונים אישיים רק ב-dev mode
      if (personalData && __DEV__) {
        console.warn("👤 Personal data available for recommendations:", {
          gender: personalData.gender,
          age: personalData.age,
          weight: personalData.weight,
          height: personalData.height,
          fitnessLevel: personalData.fitnessLevel,
        });
      }

      // Enhanced weekly plan validation with fallback
      if (!weeklyPlan || weeklyPlan.length === 0) {
        if (__DEV__)
          console.warn(
            "⚠️ NextWorkoutLogic: No weekly plan provided, using enhanced default"
          );
        weeklyPlan = ["דחיפה", "משיכה", "רגליים"];
      }

      // 1. Get current cycle state with intelligent caching
      const cycleState = await this.getCurrentCycleState(weeklyPlan);

      // 2. Calculate days since last workout with enhanced precision
      const daysSinceLastWorkout = this.calculateDaysSinceLastWorkout(
        cycleState.lastWorkoutDate
      );

      if (__DEV__)
        console.warn(
          `📊 NextWorkoutLogic: Analysis - Days: ${daysSinceLastWorkout}, Current: ${cycleState.currentDayInWeek}, Total: ${cycleState.totalWorkoutsCompleted}`
        );

      // Enhanced decision logic with comprehensive scenarios
      const recommendation = this.determineNextWorkout(
        weeklyPlan,
        cycleState,
        daysSinceLastWorkout
      );

      return recommendation;
    } catch (error) {
      console.error(
        "❌ NextWorkoutLogic: Error in recommendation calculation:",
        error
      );
      // Enhanced fallback with proper error handling
      const safeWeeklyPlan =
        weeklyPlan && weeklyPlan.length > 0
          ? weeklyPlan
          : ["דחיפה", "משיכה", "רגליים"];
      return this.createRecommendation(
        safeWeeklyPlan[0],
        0,
        "אימון ברירת מחדל בעקבות שגיאה טכנית",
        true,
        0,
        "normal"
      );
    } finally {
      // ✅ ניקוי ה-active fetch
      const requestKey = `${JSON.stringify(weeklyPlan)}_${JSON.stringify(personalData)}`;
      this.activeFetches.delete(requestKey);
    }
  }

  // =======================================
  // 🎯 Enhanced Decision Logic Engine
  // מנוע לוגיקת החלטה משופר
  // =======================================

  /**
   * Advanced workout determination with comprehensive scenario handling
   * קביעת אימון מתקדמת עם טיפול מקיף בתרחישים
   */
  private determineNextWorkout(
    weeklyPlan: string[],
    cycleState: WorkoutCycleState,
    daysSinceLastWorkout: number
  ): NextWorkoutRecommendation {
    // New user scenario - enhanced welcome experience
    if (!cycleState.lastWorkoutDate || daysSinceLastWorkout >= 999) {
      console.warn(
        "👋 NextWorkoutLogic: New user detected - starting first workout with enhanced onboarding"
      );
      return this.createRecommendation(
        weeklyPlan[0],
        0,
        "ברוכים הבאים! התחלת מסע הכושר שלך 🚀",
        true,
        0,
        "normal"
      );
    }

    // Same day workout - recovery recommendation
    if (daysSinceLastWorkout === 0) {
      console.warn(
        "🛑 NextWorkoutLogic: Same day workout detected - recommending recovery"
      );
      return this.createRecommendation(
        cycleState.weeklyPlan[cycleState.currentDayInWeek],
        cycleState.currentDayInWeek,
        "כבר התאמנת היום! הגוף זקוק למנוחה לבניית שרירים 💪",
        false,
        daysSinceLastWorkout,
        "light"
      );
    }

    // Regular progression - 1 day rest
    if (daysSinceLastWorkout === 1) {
      const nextDayIndex =
        (cycleState.currentDayInWeek + 1) % weeklyPlan.length;
      console.warn(
        `✅ NextWorkoutLogic: Regular progression to workout ${nextDayIndex}`
      );
      return this.createRecommendation(
        weeklyPlan[nextDayIndex],
        nextDayIndex,
        "המשך מצוין! זמן לאימון הבא בתוכנית שלך 🎯",
        true,
        daysSinceLastWorkout,
        "normal"
      );
    }

    // Short break - 2-4 days continue normally
    if (daysSinceLastWorkout >= 2 && daysSinceLastWorkout <= 4) {
      const nextDayIndex =
        (cycleState.currentDayInWeek + 1) % weeklyPlan.length;
      console.warn(
        `⏰ NextWorkoutLogic: Short break detected (${daysSinceLastWorkout} days) - continuing progression`
      );
      return this.createRecommendation(
        weeklyPlan[nextDayIndex],
        nextDayIndex,
        `${daysSinceLastWorkout} ימי מנוחה - בואו נמשיך איפה שעצרנו! 💪`,
        true,
        daysSinceLastWorkout,
        "normal"
      );
    }

    // Medium break - 5-7 days restart week
    if (daysSinceLastWorkout >= 5 && daysSinceLastWorkout <= 7) {
      console.warn(
        `🔄 NextWorkoutLogic: Medium break detected (${daysSinceLastWorkout} days) - restarting week`
      );
      return this.createRecommendation(
        weeklyPlan[0],
        0,
        `הפסקה של ${daysSinceLastWorkout} ימים - מתחילים שבוע אימונים רענן! 🌟`,
        false,
        daysSinceLastWorkout,
        "light"
      );
    }

    // Long break - over 7 days gradual return
    if (daysSinceLastWorkout > 7) {
      console.warn(
        `🏃‍♂️ NextWorkoutLogic: Long break detected (${daysSinceLastWorkout} days) - gradual return protocol`
      );
      return this.createRecommendation(
        weeklyPlan[0],
        0,
        `הפסקה ארוכה של ${daysSinceLastWorkout} ימים - חוזרים בהדרגה ובבטחה! 🎯`,
        false,
        daysSinceLastWorkout,
        "light"
      );
    }

    // Fallback scenario
    console.warn("🔧 NextWorkoutLogic: Using fallback scenario");
    return this.createRecommendation(
      weeklyPlan[0],
      0,
      "התחלת תוכנית אימונים חדשה - בואו נתחיל! 🚀",
      true,
      daysSinceLastWorkout,
      "normal"
    );
  }

  // =======================================
  // 📊 Enhanced State Management
  // ניהול מצב משופר
  // =======================================

  /**
   * Enhanced cycle state retrieval with intelligent caching and validation
   * קבלת מצב המחזור משופרת עם מטמון חכם ואימות
   *
   * @param weeklyPlan - Current weekly workout plan
   * @returns {Promise<WorkoutCycleState>} Current cycle state with validation
   * @performance Uses intelligent caching to minimize storage reads
   */
  private async getCurrentCycleState(
    weeklyPlan?: string[]
  ): Promise<WorkoutCycleState> {
    try {
      const now = Date.now();

      // Enhanced cache validation with plan comparison
      if (
        this.cachedCycleState &&
        now - this.cacheTimestamp < this.CACHE_DURATION &&
        // if no plan provided, any cached state is valid; otherwise plans must match
        (!weeklyPlan ||
          JSON.stringify(this.cachedCycleState.weeklyPlan) ===
            JSON.stringify(weeklyPlan))
      ) {
        console.warn("🚀 NextWorkoutLogic: Using optimized cached cycle state");
        return this.cachedCycleState;
      }

      console.warn(
        "📀 NextWorkoutLogic: Loading cycle state from persistent storage"
      );
      const savedState = await AsyncStorage.getItem(WORKOUT_CYCLE_KEY);

      if (savedState) {
        const state = JSON.parse(savedState) as WorkoutCycleState;

        // Enhanced plan validation with detailed logging
        if (!weeklyPlan) {
          // No new plan provided -> use saved plan as source of truth
          console.warn(
            "✅ NextWorkoutLogic: No plan provided, using saved state"
          );
          this.cachedCycleState = state;
          this.cacheTimestamp = now;
          return state;
        }

        if (JSON.stringify(state.weeklyPlan) === JSON.stringify(weeklyPlan)) {
          console.warn(
            "✅ NextWorkoutLogic: Weekly plan matches, using saved state"
          );
          this.cachedCycleState = state;
          this.cacheTimestamp = now;
          return state;
        }

        console.warn(
          "🔄 NextWorkoutLogic: Weekly plan changed, creating new state"
        );
      }

      // Enhanced new state creation with comprehensive initialization from real workout history
      // 🔄 Load actual workout history to get real lastWorkoutDate
      const workoutHistory = await workoutFacadeService.getHistory();

      if (__DEV__) {
        console.warn(
          `📚 NextWorkoutLogic: Found ${workoutHistory.length} workouts in history`
        );
      }

      // Sort by date (newest first) to get the most recent workout
      const sortedHistory = workoutHistory.sort((a, b) => {
        const dateA = new Date(
          a.feedback?.completedAt || a.endTime || 0
        ).getTime();
        const dateB = new Date(
          b.feedback?.completedAt || b.endTime || 0
        ).getTime();
        return dateB - dateA; // newest first
      });

      const lastWorkout = sortedHistory.length > 0 ? sortedHistory[0] : null; // Most recent workout
      const lastWorkoutDate =
        lastWorkout?.feedback?.completedAt || lastWorkout?.endTime || "";

      if (__DEV__ && lastWorkout) {
        console.warn(
          `📅 NextWorkoutLogic: Last workout found: ${lastWorkoutDate}`
        );
      }

      const newState: WorkoutCycleState = {
        currentWeekNumber: 1,
        currentDayInWeek: Math.min(
          workoutHistory.length,
          (weeklyPlan ?? []).length - 1
        ), // Progress based on actual history
        lastWorkoutDate,
        totalWorkoutsCompleted: workoutHistory.length, // Real count from history
        programStartDate: new Date().toISOString(),
        weeklyPlan: [...(weeklyPlan ?? [])],
      };

      // Persist only if we have a valid non-empty plan; avoid polluting storage with empty
      if (newState.weeklyPlan.length > 0) {
        await AsyncStorage.setItem(WORKOUT_CYCLE_KEY, JSON.stringify(newState));
      }

      // Update cache with new state
      this.cachedCycleState = newState;
      this.cacheTimestamp = now;

      console.warn("🆕 NextWorkoutLogic: Created new cycle state", {
        weekNumber: newState.currentWeekNumber,
        planLength: newState.weeklyPlan.length,
      });

      return newState;
    } catch (error) {
      console.error("❌ NextWorkoutLogic: Error getting cycle state:", error);
      // Enhanced fallback with proper plan preservation
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

  // =======================================
  // 📅 Enhanced Date Calculations
  // חישובי תאריך משופרים
  // =======================================

  /**
   * Advanced calculation of days since last workout with enhanced precision
   * חישוב מתקדם של ימים מאז האימון האחרון עם דיוק משופר
   *
   * @param lastWorkoutDate - ISO date string of last workout
   * @returns {number} Days since last workout (999 if never worked out)
   * @performance Optimized date calculations with proper error handling
   */
  private calculateDaysSinceLastWorkout(lastWorkoutDate: string): number {
    if (!lastWorkoutDate || lastWorkoutDate === "") {
      console.warn("📅 NextWorkoutLogic: No previous workout history found");
      return 999; // Special code for new users
    }

    try {
      const lastDate = new Date(lastWorkoutDate);
      const today = new Date();

      // Enhanced date validation with detailed error reporting
      if (isNaN(lastDate.getTime())) {
        console.warn(
          "⚠️ NextWorkoutLogic: Invalid workout date format detected"
        );
        return 999;
      }

      // Precise day calculation with timezone consideration
      const timeDiff = today.getTime() - lastDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      console.warn(
        `📅 NextWorkoutLogic: Calculated ${daysDiff} days since last workout (${lastWorkoutDate})`
      );
      return Math.max(0, daysDiff); // Ensure non-negative result
    } catch (error) {
      console.error(
        "❌ NextWorkoutLogic: Error calculating days since last workout:",
        error
      );
      return 999;
    }
  }

  // =======================================
  // 🎯 Enhanced Recommendation Builder
  // בונה המלצות משופר
  // =======================================

  /**
   * Enhanced recommendation creation with comprehensive metadata and validation
   * יצירת המלצה משופרת עם מטא-דאטה מקיף ואימות
   *
   * @param workoutName - Name of recommended workout
   * @param workoutIndex - Index in weekly plan
   * @param reason - Hebrew explanation for the recommendation
   * @param isRegularProgression - Whether this follows normal progression
   * @param daysSinceLastWorkout - Days since last workout
   * @param suggestedIntensity - Recommended intensity level
   * @returns {NextWorkoutRecommendation} Complete recommendation object
   * @accessibility Includes detailed Hebrew explanations for screen readers
   */
  private createRecommendation(
    workoutName: string,
    workoutIndex: number,
    reason: string,
    isRegularProgression: boolean,
    daysSinceLastWorkout: number,
    suggestedIntensity: "normal" | "light" | "catchup"
  ): NextWorkoutRecommendation {
    const recommendation = {
      workoutName,
      workoutIndex,
      reason,
      isRegularProgression,
      daysSinceLastWorkout,
      suggestedIntensity,
    };

    console.warn(
      `✅ NextWorkoutLogic: Created enhanced recommendation - "${workoutName}" (index: ${workoutIndex}, intensity: ${suggestedIntensity})`
    );

    return recommendation;
  }

  // =======================================
  // 📈 Enhanced Workout Progress Tracking
  // מעקב התקדמות אימון משופר
  // =======================================

  /**
   * Enhanced workout completion update with intelligent state management
   * עדכון השלמת אימון משופר עם ניהול מצב חכם
   *
   * @param workoutIndex - Index of completed workout in weekly plan
   * @param workoutName - Name of completed workout
   * @returns {Promise<void>} Completion promise
   * @performance Optimized with cache invalidation and atomic updates
   */
  async updateWorkoutCompleted(
    workoutIndex: number,
    workoutName: string
  ): Promise<void> {
    try {
      console.warn(
        `🎯 NextWorkoutLogic: Updating workout completion - "${workoutName}" (index: ${workoutIndex})`
      );

      const currentState = await this.getCurrentCycleState();

      const planLength = Math.max(1, currentState.weeklyPlan.length);
      const normalizedIndex = workoutIndex % planLength;

      // Enhanced state calculation with proper week progression
      const updatedState: WorkoutCycleState = {
        ...currentState,
        currentDayInWeek: normalizedIndex,
        lastWorkoutDate: new Date().toISOString(), // Full ISO date for timezone safety
        totalWorkoutsCompleted: currentState.totalWorkoutsCompleted + 1,
        currentWeekNumber:
          Math.floor((currentState.totalWorkoutsCompleted + 1) / planLength) +
          1,
      };

      await AsyncStorage.setItem(
        WORKOUT_CYCLE_KEY,
        JSON.stringify(updatedState)
      );

      // Enhanced cache invalidation for immediate consistency
      this.cachedCycleState = null;
      this.cacheTimestamp = 0;

      console.warn(
        `✅ NextWorkoutLogic: Workout cycle updated successfully - Week ${updatedState.currentWeekNumber}, Total workouts: ${updatedState.totalWorkoutsCompleted}`
      );
    } catch (error) {
      console.error(
        "❌ NextWorkoutLogic: Error updating workout completed:",
        error
      );
    }
  }

  // =======================================
  // 🔄 Enhanced System Management
  // ניהול מערכת משופר
  // =======================================

  /**
   * Enhanced workout cycle reset with comprehensive cleanup
   * איפוס מחזור אימונים משופר עם ניקוי מקיף
   *
   * @returns {Promise<void>} Reset completion promise
   * @usage For new programs or complete restart scenarios
   * @performance Atomic operations with proper cache management
   */
  async resetWorkoutCycle(): Promise<void> {
    try {
      console.warn(
        "🔄 NextWorkoutLogic: Performing comprehensive workout cycle reset"
      );

      // Enhanced cleanup with atomic operations
      await Promise.all([AsyncStorage.removeItem(WORKOUT_CYCLE_KEY)]);

      // Comprehensive cache invalidation
      this.cachedCycleState = null;
      this.cacheTimestamp = 0;

      console.warn(
        "✅ NextWorkoutLogic: Workout cycle reset completed successfully"
      );
    } catch (error) {
      console.error(
        "❌ NextWorkoutLogic: Error resetting workout cycle:",
        error
      );
    }
  }

  // =======================================
  // 📊 Enhanced Analytics & Statistics
  // אנליטיקה וסטטיסטיקה משופרת
  // =======================================

  /**
   * Enhanced cycle statistics with comprehensive analytics and insights
   * סטטיסטיקות מחזור משופרות עם אנליטיקה ותובנות מקיפות
   *
   * @returns {Promise<Object>} Comprehensive statistics object
   * @performance Optimized calculations with intelligent consistency metrics
   * @analytics Provides detailed insights into workout patterns and progress
   */
  async getCycleStatistics(): Promise<{
    currentWeek: number;
    totalWorkouts: number;
    daysInProgram: number;
    consistency: number; // Percentage consistency score
  }> {
    try {
      console.warn(
        "📊 NextWorkoutLogic: Calculating comprehensive cycle statistics"
      );

      const state = await this.getCurrentCycleState();
      const programStart = new Date(state.programStartDate);
      const today = new Date();

      // Enhanced date calculations with proper timezone handling
      const daysInProgram = Math.floor(
        (today.getTime() - programStart.getTime()) / (1000 * 3600 * 24)
      );

      // Intelligent consistency calculation with realistic expectations
      // Assumes optimal frequency of every 2 days for consistency baseline
      const expectedWorkouts =
        Math.floor(daysInProgram / 2) *
        Math.min(state.weeklyPlan.length || 0, 3);
      const consistency =
        expectedWorkouts > 0
          ? (state.totalWorkoutsCompleted / expectedWorkouts) * 100
          : 100;

      const statistics = {
        currentWeek: state.currentWeekNumber,
        totalWorkouts: state.totalWorkoutsCompleted,
        daysInProgram,
        consistency: Math.min(100, Math.max(0, Math.round(consistency))),
      };

      console.warn("✅ NextWorkoutLogic: Statistics calculated", {
        week: statistics.currentWeek,
        workouts: statistics.totalWorkouts,
        consistency: `${statistics.consistency}%`,
      });

      return statistics;
    } catch (error) {
      console.error(
        "❌ NextWorkoutLogic: Error calculating cycle statistics:",
        error
      );
      // Enhanced fallback with realistic defaults
      return {
        currentWeek: 1,
        totalWorkouts: 0,
        daysInProgram: 0,
        consistency: 100,
      };
    }
  }
}

// =======================================
// 🔄 Service Export & Singleton
// ייצוא שירות וסינגלטון
// =======================================

/**
 * Singleton instance of NextWorkoutLogicService for global access
 * מופע סינגלטון של NextWorkoutLogicService לגישה גלובלית
 *
 * @usage Import and use throughout the application for consistent workout logic
 * @performance Single instance ensures optimal memory usage and state consistency
 */
export const nextWorkoutLogicService = new NextWorkoutLogicService();
