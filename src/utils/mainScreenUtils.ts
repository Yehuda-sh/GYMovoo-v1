/**
 * @file src/utils/mainScreenUtils.ts
 * @description יוטיליטיז מתקדמים למסך הראשי - Advanced Main Screen Utilities
 */

import type { User } from "../types";

// ===============================================
// 📊 Types & Interfaces - טיפוסים וממשקים
// ===============================================

/** נתונים אישיים מחולצים מהמשתמש */
interface ExtractedPersonalData {
  age: string;
  gender: "male" | "female";
  availability: "2_days" | "3_days" | "4_days" | "5_days";
  goals: string[];
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  weight: string;
  height: string;
}

/** מידע על התקדמות המשתמש */
interface UserProgress {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoalProgress: number;
  lastWorkoutDate?: string;
  nextRecommendedWorkout: number;
  motivationalLevel: "low" | "medium" | "high";
}

/** insights והמלצות למשתמש */
interface UserInsights {
  weeklyAnalysis: string;
  strengths: string[];
  improvements: string[];
  achievements: string[];
  recommendations: string[];
  nextMilestone: string;
}

/** הגדרות ברכות מתקדמות */
interface GreetingConfig {
  timeSlots: Map<string, string>;
  motivationalGreetings: Map<string, string[]>;
  personalizedGreetings: Map<string, string>;
}

// ===============================================
// 🔧 Configuration & Constants - הגדרות וקבועים
// ===============================================

/** מפת ימי אימון זמינים */
const AVAILABILITY_MAP = new Map<string, number>([
  ["2_days", 2],
  ["3_days", 3],
  ["4_days", 4],
  ["5_days", 5],
]);

/** מפת דפוסי יום אימון */
// Legacy pattern map (kept for backwards compatibility/reference only). Prefer using extractWorkoutDayNumber()
const WORKOUT_DAY_PATTERNS = new Map<string, number>([
  ["יום 1", 2],
  ["יום 2", 3],
  ["יום 3", 4],
  ["יום 4", 5],
  ["יום 5", 1],
]);

/** ברירות מחדל לנתונים אישיים */
const DEFAULT_PERSONAL_DATA: ExtractedPersonalData = {
  age: "unknown",
  gender: "male",
  availability: "3_days",
  goals: [],
  fitnessLevel: "beginner",
  weight: "70",
  height: "170",
};

/** הגדרות ברכות מתקדמות */
const GREETING_CONFIG: GreetingConfig = {
  timeSlots: new Map([
    ["dawn", "בוקר טוב מוקדם"], // 5-6
    ["morning", "בוקר טוב"], // 6-12
    ["noon", "צהריים טובים"], // 12-17
    ["evening", "ערב טוב"], // 17-21
    ["night", "לילה טוב"], // 21-5
  ]),

  motivationalGreetings: new Map([
    ["beginner", ["יאללה נתחיל!", "זמן לאימון הראשון!", "הדרך מתחילה כאן!"]],
    ["intermediate", ["זמן להתקדם!", "בואו נמשיך להתחזק!", "האימון הבא מחכה!"]],
    [
      "advanced",
      ["זמן לאתגר חדש!", "בואו נשבור גבולות!", "האימון המתקדם מחכה!"],
    ],
  ]),

  personalizedGreetings: new Map([
    ["streak_high", "וואו, איזה סדרה מדהימה! 🔥"],
    ["comeback", "שמח לראות אותך חוזר! 💪"],
    ["goal_close", "אתה קרוב למטרה! 🎯"],
    ["milestone", "הגעת לאבן דרך חשובה! 🏆"],
  ]),
};

/** הודעות מוטיבציה לפי הקשר */
const MOTIVATIONAL_MESSAGES = new Map([
  [
    "first_workout",
    "האימון הראשון הוא הקשה ביותר - אתה כבר על הדרך הנכונה! 🌟",
  ],
  ["streak_start", "מתחילים סדרה חדשה! בואו נבנה הרגל חזק 💪"],
  ["weekly_goal", "אתה בדרך למטרה השבועית! 🎯"],
  ["missed_day", "לא נורא, מחר זה יום חדש! בואו נחזור למסלול 🔄"],
  ["perfect_week", "שבוע מושלם! אתה מקצוען אמיתי! 🏆"],
]);

// Cache for performance optimization
const userDataCache = new Map<
  string,
  { data: ExtractedPersonalData; timestamp: number }
>();
const progressCache = new Map<
  string,
  { progress: UserProgress; timestamp: number }
>();
const CACHE_TTL = 300000; // 5 minutes

// ===============================================
// 🔧 Helper Functions - פונקציות עזר
// ===============================================

/**
 * קבלת מפתח cache ייחודי למשתמש
 * @param user אובייקט המשתמש
 * @returns מפתח cache או null
 */
function getUserCacheKey(user: User | null): string | null {
  if (!user) return null;
  // Only stable identifiers should be used for cache keys. Avoid time-based fallbacks that break cache hits.
  return user.id || user.email || null;
}

/**
 * בדיקה האם cache תקף
 * @param timestamp זמן יצירת הcache
 * @returns true אם הcache תקף
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Unified error logger for this module
 */
function logError(context: string, error: unknown) {
  console.error(`[mainScreenUtils:${context}]`, error);
}

/**
 * Start of the week (Sunday by default)
 */
function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 0): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day - weekStartsOn + 7) % 7; // how many days since week start
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

/**
 * Extracts a "day number" from a workout label. Supports formats like "יום 3" or plain numbers.
 */
function extractWorkoutDayNumber(label: string): number | null {
  if (!label) return null;
  // Prefer explicit Hebrew pattern "יום <n>"
  const heb = label.match(/יום\s*(\d+)/);
  if (heb && heb[1]) {
    const n = parseInt(heb[1], 10);
    return Number.isFinite(n) ? n : null;
  }
  // Fallback: find a standalone 1-5 token (avoid matching parts of 10, 12, etc.)
  const token = label.match(/(?:^|\D)([1-5])(?:\D|$)/);
  if (token && token[1]) {
    const n = parseInt(token[1], 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// ===============================================
// 🎯 Core Functions - פונקציות עיקריות משופרות
// ===============================================

/**
 * חישוב ימי אימון זמינים מנתוני המשתמש - משופר עם caching
 * @param user אובייקט המשתמש
 * @returns מספר ימי האימון הזמינים
 */
export const calculateAvailableTrainingDays = (user: User | null): number => {
  if (!user) return 3;

  try {
    // Check smart questionnaire first
    const smartAnswers = user.smartquestionnairedata?.answers as
      | { availability?: string | string[] }
      | undefined;

    if (smartAnswers?.availability) {
      const availability = Array.isArray(smartAnswers.availability)
        ? smartAnswers.availability[0]
        : smartAnswers.availability;

      if (availability && typeof availability === "string") {
        return AVAILABILITY_MAP.get(availability) || 3;
      }
    }

    // Check training stats
    const preferredDays = user.trainingstats?.preferredWorkoutDays;
    if (preferredDays) {
      const days =
        typeof preferredDays === "number"
          ? preferredDays
          : parseInt(String(preferredDays), 10);
      if (days >= 2 && days <= 5) return days;
    }

    return 3; // Default
  } catch (error) {
    logError("calculateAvailableTrainingDays", error);
    return 3;
  }
};

/**
 * חישוב יום האימון הבא הממולץ - משופר עם דפוסים מתקדמים
 * @param workouts מערך האימונים הקודמים
 * @param availableDays מספר ימי האימון הזמינים
 * @returns מספר יום האימון הבא
 */
export const getNextRecommendedDay = (
  workouts: Array<{ type?: string; workoutName?: string }>,
  availableDays: number
): number => {
  try {
    if (workouts.length === 0) return 1;

    const lastWorkout = workouts[workouts.length - 1];
    const lastWorkoutType = lastWorkout?.type || lastWorkout?.workoutName || "";

    const day = extractWorkoutDayNumber(lastWorkoutType);
    if (day && day >= 1 && day <= 5) {
      const next = day + 1;
      return next > availableDays ? 1 : next;
    }

    // Legacy fallback for any remaining patterns
    for (const [pattern, nextDay] of WORKOUT_DAY_PATTERNS) {
      if (lastWorkoutType.includes(pattern)) {
        return nextDay > availableDays ? 1 : nextDay;
      }
    }

    return 1; // Default fallback
  } catch (error) {
    logError("getNextRecommendedDay", error);
    return 1;
  }
};

/**
 * חילוץ נתונים אישיים מהמשתמש - משופר עם caching ו-validation
 * @param user אובייקט המשתמש
 * @returns נתונים אישיים מעובדים
 */
export const extractPersonalDataFromUser = (
  user: User | null
): ExtractedPersonalData => {
  try {
    if (!user) return { ...DEFAULT_PERSONAL_DATA };

    // Check cache first
    const cacheKey = getUserCacheKey(user);
    if (cacheKey) {
      const cached = userDataCache.get(cacheKey);
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.data;
      }
    }

    if (!user.smartquestionnairedata?.answers) {
      return { ...DEFAULT_PERSONAL_DATA };
    }

    const answers = user.smartquestionnairedata.answers;

    const extractedData: ExtractedPersonalData = {
      age: answers.age?.toString() || DEFAULT_PERSONAL_DATA.age,
      gender: (answers.gender === "female" ? "female" : "male") as
        | "male"
        | "female",
      availability: (Array.isArray(answers.availability)
        ? answers.availability[0] || DEFAULT_PERSONAL_DATA.availability
        : answers.availability || DEFAULT_PERSONAL_DATA.availability) as
        | "2_days"
        | "3_days"
        | "4_days"
        | "5_days",
      goals: Array.isArray(answers.goals)
        ? answers.goals
        : DEFAULT_PERSONAL_DATA.goals,
      fitnessLevel: (answers.fitnessLevel ||
        DEFAULT_PERSONAL_DATA.fitnessLevel) as
        | "beginner"
        | "intermediate"
        | "advanced",
      weight: answers.weight?.toString() || DEFAULT_PERSONAL_DATA.weight,
      height: answers.height?.toString() || DEFAULT_PERSONAL_DATA.height,
    };

    // Cache the result
    if (cacheKey) {
      userDataCache.set(cacheKey, {
        data: extractedData,
        timestamp: Date.now(),
      });
    }

    return extractedData;
  } catch (error) {
    logError("extractPersonalDataFromUser", error);
    return { ...DEFAULT_PERSONAL_DATA };
  }
};

/**
 * ברכה מותאמת לפי שעה ומצב המשתמש - משופרת
 * @param user אובייקט המשתמש (אופציונלי)
 * @param includeMotivation הוספת הודעת מוטיבציה
 * @returns מחרוזת ברכה מותאמת
 */
export const getTimeBasedGreeting = (
  user?: User | null,
  includeMotivation: boolean = false
): string => {
  try {
    const hour = new Date().getHours();
    let baseGreeting = "שלום";

    // Time-based greeting
    if (hour >= 5 && hour < 6) {
      baseGreeting = GREETING_CONFIG.timeSlots.get("dawn") || "בוקר טוב מוקדם";
    } else if (hour >= 6 && hour < 12) {
      baseGreeting = GREETING_CONFIG.timeSlots.get("morning") || "בוקר טוב";
    } else if (hour >= 12 && hour < 17) {
      baseGreeting = GREETING_CONFIG.timeSlots.get("noon") || "צהריים טובים";
    } else if (hour >= 17 && hour < 21) {
      baseGreeting = GREETING_CONFIG.timeSlots.get("evening") || "ערב טוב";
    } else {
      baseGreeting = GREETING_CONFIG.timeSlots.get("night") || "לילה טוב";
    }

    if (!user || !includeMotivation) {
      return baseGreeting;
    }

    // Add personalized motivation
    const personalData = extractPersonalDataFromUser(user);
    const motivationalOptions =
      GREETING_CONFIG.motivationalGreetings.get(personalData.fitnessLevel) ||
      [];

    if (motivationalOptions.length > 0) {
      const randomMotivation =
        motivationalOptions[
          Math.floor(Math.random() * motivationalOptions.length)
        ];
      return `${baseGreeting}! ${randomMotivation}`;
    }

    return baseGreeting;
  } catch (error) {
    logError("getTimeBasedGreeting", error);
    return "שלום";
  }
};

// ===============================================
// 🚀 Advanced Main Screen Features - פיצ'רים מתקדמים למסך הראשי
// ===============================================

/**
 * חישוב התקדמות המשתמש עם insights מתקדמים
 * @param user אובייקט המשתמש
 * @param workouts מערך האימונים
 * @returns אובייקט התקדמות מפורט
 */
export const calculateUserProgress = (
  user: User | null,
  workouts: Array<{ date?: string; completed?: boolean }> = []
): UserProgress => {
  try {
    if (!user) {
      return {
        totalWorkouts: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoalProgress: 0,
        motivationalLevel: "low",
        nextRecommendedWorkout: 1,
      };
    }

    // Check cache first
    const cacheKey = getUserCacheKey(user);
    if (cacheKey) {
      const cached = progressCache.get(cacheKey);
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.progress;
      }
    }

    const totalWorkouts = workouts.filter((w) => w.completed).length;
    const availableDays = calculateAvailableTrainingDays(user);

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateWorkoutStreaks(workouts);

    // Calculate weekly progress
    const weeklyGoalProgress = calculateWeeklyProgress(workouts, availableDays);

    // Determine motivational level
    const motivationalLevel = determineMotivationalLevel(
      currentStreak,
      weeklyGoalProgress
    );

    // Next recommended workout is context-dependent (requires workout labels). Keep 1 as conservative default.
    const nextRecommendedWorkout = 1;

    const progressBase = {
      totalWorkouts,
      currentStreak,
      longestStreak,
      weeklyGoalProgress,
      nextRecommendedWorkout,
      motivationalLevel,
    } satisfies Omit<UserProgress, "lastWorkoutDate">;

    const lastDate = getLastWorkoutDate(workouts);
    const progress: UserProgress = lastDate
      ? { ...progressBase, lastWorkoutDate: lastDate }
      : { ...progressBase };

    // Cache the result
    if (cacheKey) {
      progressCache.set(cacheKey, {
        progress,
        timestamp: Date.now(),
      });
    }

    return progress;
  } catch (error) {
    logError("calculateUserProgress", error);
    return {
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyGoalProgress: 0,
      motivationalLevel: "low",
      nextRecommendedWorkout: 1,
    };
  }
};

/**
 * יצירת insights והמלצות מותאמות אישית
 * @param user אובייקט המשתמש
 * @param progress התקדמות המשתמש
 * @returns אובייקט insights מפורט
 */
export const generateUserInsights = (
  user: User | null,
  progress: UserProgress
): UserInsights => {
  try {
    const personalData = extractPersonalDataFromUser(user);
    const insights: UserInsights = {
      weeklyAnalysis: "",
      strengths: [],
      improvements: [],
      achievements: [],
      recommendations: [],
      nextMilestone: "",
    };

    // Weekly analysis
    if (progress.weeklyGoalProgress >= 100) {
      insights.weeklyAnalysis = "שבוע מושלם! השגת את המטרה השבועית 🎯";
    } else if (progress.weeklyGoalProgress >= 75) {
      insights.weeklyAnalysis = "שבוע מעולה! אתה קרוב לסיום המטרה 💪";
    } else if (progress.weeklyGoalProgress >= 50) {
      insights.weeklyAnalysis = "שבוע טוב, אפשר להמשיך ולהתחזק 📈";
    } else {
      insights.weeklyAnalysis = "בואו נתמקד בהגעה למטרה השבועית 🎯";
    }

    // Identify strengths
    if (progress.currentStreak >= 3) {
      insights.strengths.push("עקביות מדהימה באימונים");
    }
    if (progress.weeklyGoalProgress > 80) {
      insights.strengths.push("מעולה בעמידה במטרות שבועיות");
    }
    if (personalData.fitnessLevel === "advanced") {
      insights.strengths.push("רמת כושר מתקדמת");
    }

    // Suggest improvements
    if (progress.currentStreak === 0) {
      insights.improvements.push("התחלת סדרת אימונים חדשה");
    }
    if (progress.weeklyGoalProgress < 50) {
      insights.improvements.push("הגברת תדירות האימונים");
    }

    // Achievements
    if (progress.totalWorkouts >= 10) {
      insights.achievements.push("השלמת 10 אימונים! 🏆");
    }
    if (progress.longestStreak >= 7) {
      insights.achievements.push("שבוע שלם של אימונים! 🔥");
    }

    // Recommendations
    insights.recommendations = generatePersonalizedRecommendations(
      personalData,
      progress
    );

    // Next milestone
    insights.nextMilestone = getNextMilestone(progress);

    return insights;
  } catch (error) {
    logError("generateUserInsights", error);
    return {
      weeklyAnalysis: "המשך בעבודה הטובה!",
      strengths: [],
      improvements: [],
      achievements: [],
      recommendations: ["המשך לאמן בקביעות"],
      nextMilestone: "האימון הבא",
    };
  }
};

/**
 * קבלת הודעת מוטיבציה מותאמת למצב המשתמש
 * @param progress התקדמות המשתמש
 * @param personalData נתונים אישיים
 * @returns הודעת מוטיבציה
 */
export const getMotivationalMessage = (
  progress: UserProgress,
  personalData: ExtractedPersonalData
): string => {
  try {
    // First workout
    if (progress.totalWorkouts === 0) {
      return MOTIVATIONAL_MESSAGES.get("first_workout") || "בואו נתחיל!";
    }

    // Starting a streak
    if (progress.currentStreak === 1) {
      return MOTIVATIONAL_MESSAGES.get("streak_start") || "התחלה טובה!";
    }

    // Perfect week
    if (progress.weeklyGoalProgress === 100) {
      return MOTIVATIONAL_MESSAGES.get("perfect_week") || "שבוע מושלם!";
    }

    // Approaching weekly goal
    if (progress.weeklyGoalProgress >= 75) {
      return MOTIVATIONAL_MESSAGES.get("weekly_goal") || "קרוב למטרה!";
    }

    // Missed workout
    if (progress.currentStreak === 0 && progress.totalWorkouts > 0) {
      return MOTIVATIONAL_MESSAGES.get("missed_day") || "בואו נחזור למסלול!";
    }

    // Default motivation by fitness level
    const levelMessages =
      GREETING_CONFIG.motivationalGreetings.get(personalData.fitnessLevel) ||
      [];
    if (levelMessages.length > 0) {
      const randomIndex = Math.floor(Math.random() * levelMessages.length);
      const selectedMessage = levelMessages[randomIndex];
      if (selectedMessage) {
        return selectedMessage;
      }
    }

    return "זמן לאימון! 💪";
  } catch (error) {
    logError("getMotivationalMessage", error);
    return "בואו נאמן! 💪";
  }
};

// ===============================================
// 🔧 Additional Helper Functions - פונקציות עזר נוספות
// ===============================================

/**
 * חישוב סדרות אימונים
 * @param workouts מערך האימונים
 * @returns אובייקט עם סדרה נוכחית וארוכה ביותר
 */
function calculateWorkoutStreaks(
  workouts: Array<{ date?: string; completed?: boolean }>
): {
  currentStreak: number;
  longestStreak: number;
} {
  try {
    type CompletedWorkout = { date: string; completed: true };
    const completedWorkouts = workouts
      .filter((w): w is CompletedWorkout => Boolean(w.completed && w.date))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (completedWorkouts.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Calculate current streak from most recent workout
    const today = new Date();
    const mostRecent = completedWorkouts[0];
    if (!mostRecent) {
      return { currentStreak: 0, longestStreak: 0 };
    }
    const lastWorkoutDate = new Date(mostRecent.date);
    const daysDiff = Math.floor(
      (today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Allow up to 2 rest days between today and the most recent workout
    if (daysDiff <= 3) {
      // Allow for rest days
      currentStreak = 1;

      // Count consecutive days (with flexibility for rest days)
      for (let i = 1; i < completedWorkouts.length; i++) {
        const currItem = completedWorkouts[i - 1];
        const prevItem = completedWorkouts[i];
        if (!currItem || !prevItem) break;
        const current = new Date(currItem.date);
        const previous = new Date(prevItem.date);
        const diff = Math.floor(
          (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diff <= 3) {
          // Allow up to 2 rest days
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < completedWorkouts.length; i++) {
      const currItem = completedWorkouts[i - 1];
      const prevItem = completedWorkouts[i];
      if (!currItem || !prevItem) break;
      const current = new Date(currItem.date);
      const previous = new Date(prevItem.date);
      const diff = Math.floor(
        (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff <= 3) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  } catch (error) {
    logError("calculateWorkoutStreaks", error);
    return { currentStreak: 0, longestStreak: 0 };
  }
}

/**
 * חישוב התקדמות שבועית
 * @param workouts מערך האימונים
 * @param availableDays ימי אימון זמינים בשבוע
 * @returns אחוז השלמת מטרה שבועית
 */
function calculateWeeklyProgress(
  workouts: Array<{ date?: string; completed?: boolean }>,
  availableDays: number
): number {
  try {
    const today = new Date();
    const weekStart = startOfWeek(today, 0); // Start of week (Sunday)

    const thisWeekWorkouts = workouts.filter((w) => {
      if (!w.date || !w.completed) return false;
      const workoutDate = new Date(w.date);
      return workoutDate >= weekStart && workoutDate <= today;
    });

    const progress = (thisWeekWorkouts.length / availableDays) * 100;
    return Math.min(progress, 100);
  } catch (error) {
    logError("calculateWeeklyProgress", error);
    return 0;
  }
}

/**
 * קביעת רמת מוטיבציה
 * @param currentStreak סדרה נוכחית
 * @param weeklyProgress התקדמות שבועית
 * @returns רמת מוטיבציה
 */
function determineMotivationalLevel(
  currentStreak: number,
  weeklyProgress: number
): "low" | "medium" | "high" {
  if (currentStreak >= 5 && weeklyProgress >= 80) return "high";
  if (currentStreak >= 2 || weeklyProgress >= 50) return "medium";
  return "low";
}

/**
 * קבלת תאריך האימון האחרון
 * @param workouts מערך האימונים
 * @returns תאריך האימון האחרון או undefined
 */
function getLastWorkoutDate(
  workouts: Array<{ date?: string; completed?: boolean }>
): string | undefined {
  try {
    type CompletedWorkout = { date: string; completed: true };
    const completedWorkouts = workouts
      .filter((w): w is CompletedWorkout => Boolean(w.completed && w.date))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (completedWorkouts.length === 0) return undefined;
    const first = completedWorkouts[0];
    return first ? first.date : undefined;
  } catch (error) {
    logError("getLastWorkoutDate", error);
    return undefined;
  }
}

/**
 * יצירת המלצות מותאמות אישית
 * @param personalData נתונים אישיים
 * @param progress התקדמות
 * @returns מערך המלצות
 */
function generatePersonalizedRecommendations(
  personalData: ExtractedPersonalData,
  progress: UserProgress
): string[] {
  const recommendations: string[] = [];

  try {
    // Based on fitness level
    if (
      personalData.fitnessLevel === "beginner" &&
      progress.currentStreak === 0
    ) {
      recommendations.push("התחל עם אימונים קצרים של 20-30 דקות");
    } else if (
      personalData.fitnessLevel === "advanced" &&
      progress.weeklyGoalProgress < 80
    ) {
      recommendations.push("הגבר את עוצמת האימונים");
    }

    // Based on availability
    if (
      personalData.availability === "2_days" &&
      progress.weeklyGoalProgress === 100
    ) {
      recommendations.push("מעולה! שקול להוסיף יום אימון נוסף");
    }

    // Based on streak
    if (progress.currentStreak >= 7) {
      recommendations.push("זמן ליום מנוחה - הגוף צריך התאוששות");
    } else if (progress.currentStreak === 0) {
      recommendations.push("התחל סדרה חדשה - קביעות היא המפתח");
    }

    // Based on goals
    if (
      personalData.goals.includes("weight_loss") &&
      progress.weeklyGoalProgress < 60
    ) {
      recommendations.push("להורדה במשקל חשוב לשמור על קביעות");
    }

    // Default recommendation
    if (recommendations.length === 0) {
      recommendations.push("המשך בעבודה הטובה!");
    }

    return recommendations;
  } catch (error) {
    logError("generatePersonalizedRecommendations", error);
    return ["המשך לאמן בקביעות"];
  }
}

/**
 * קבלת אבן הדרך הבאה
 * @param progress התקדמות המשתמש
 * @returns תיאור אבן הדרך הבאה
 */
function getNextMilestone(progress: UserProgress): string {
  try {
    if (progress.totalWorkouts === 0) return "האימון הראשון שלך";
    if (progress.totalWorkouts < 5)
      return `${5 - progress.totalWorkouts} אימונים לאבן דרך הראשונה`;
    if (progress.totalWorkouts < 10)
      return `${10 - progress.totalWorkouts} אימונים עד לעשרה הראשונים`;
    if (progress.totalWorkouts < 25)
      return `${25 - progress.totalWorkouts} אימונים עד לרבע הראשון`;
    if (progress.totalWorkouts < 50)
      return `${50 - progress.totalWorkouts} אימונים עד לחמישים הראשונים`;
    if (progress.totalWorkouts < 100)
      return `${100 - progress.totalWorkouts} אימונים עד למאה!`;

    return "המשך להתפתח ולהתחזק!";
  } catch (error) {
    logError("getNextMilestone", error);
    return "האימון הבא";
  }
}

// ===============================================
// 🎁 Additional Utility Functions - פונקציות תועלת נוספות
// ===============================================

/**
 * קבלת סטטיסטיקות שימוש בcache
 * @returns אובייקט עם סטטיסטיקות cache
 */
export function getCacheStats() {
  return {
    userDataCacheSize: userDataCache.size,
    progressCacheSize: progressCache.size,
    cacheTTL: CACHE_TTL,
  };
}

/**
 * ניקוי cache ידני
 * @param force ניקוי כפוי של הכל
 */
export function clearCache(force: boolean = false): void {
  if (force) {
    userDataCache.clear();
    progressCache.clear();
  } else {
    // Clean expired entries
    for (const [key, entry] of userDataCache.entries()) {
      if (!isCacheValid(entry.timestamp)) {
        userDataCache.delete(key);
      }
    }

    for (const [key, entry] of progressCache.entries()) {
      if (!isCacheValid(entry.timestamp)) {
        progressCache.delete(key);
      }
    }
  }
}

/**
 * בדיקה האם המשתמש פעיל השבוע
 * @param workouts מערך האימונים
 * @returns true אם המשתמש פעיל השבוע
 */
export function isUserActiveThisWeek(
  workouts: Array<{ date?: string; completed?: boolean }>
): boolean {
  try {
    const today = new Date();
    const weekStart = startOfWeek(today, 0);

    return workouts.some((w) => {
      if (!w.date || !w.completed) return false;
      const workoutDate = new Date(w.date);
      return workoutDate >= weekStart && workoutDate <= today;
    });
  } catch (error) {
    logError("isUserActiveThisWeek", error);
    return false;
  }
}
