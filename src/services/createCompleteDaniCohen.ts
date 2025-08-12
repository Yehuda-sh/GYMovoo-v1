/**
 * @file src/services/createCompleteDaniCohen.ts
 * @description יצירת דני כהן עם נתונים מלאים ישירות ב-React Native
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// ========================================
// 🏋️ נתוני תרגילים מפורטים
// ========================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EXERCISES_DATABASE = {
  // תרגילי כוח עליון
  bench_press: { name: "ספסל שטוח", category: "chest", equipment: "barbell" },
  incline_bench: {
    name: "ספסל נטוי",
    category: "chest",
    equipment: "dumbbells",
  },
  pull_ups: { name: "מתחים", category: "back", equipment: "pullup_bar" },
  barbell_rows: {
    name: "חתירה עם ברבל",
    category: "back",
    equipment: "barbell",
  },
  overhead_press: {
    name: "לחיצה מעל הראש",
    category: "shoulders",
    equipment: "barbell",
  },
  lateral_raises: {
    name: "הרמות צד",
    category: "shoulders",
    equipment: "dumbbells",
  },
  bicep_curls: {
    name: "כיפופי ביצפס",
    category: "biceps",
    equipment: "dumbbells",
  },
  tricep_dips: { name: "טריצפס דיפס", category: "triceps", equipment: "bench" },

  // תרגילי כוח תחתון
  squats: { name: "סקוואט", category: "legs", equipment: "barbell" },
  deadlifts: { name: "דדליפט", category: "legs", equipment: "barbell" },
  lunges: { name: "פסיעות", category: "legs", equipment: "dumbbells" },
  leg_press: { name: "לחיצת רגליים", category: "legs", equipment: "leg_press" },
  calf_raises: {
    name: "עליות עקב",
    category: "calves",
    equipment: "dumbbells",
  },
};

function generateWorkoutPlans() {
  const basicPlan = {
    id: "plan_basic_dani",
    name: "תוכנית בסיסית - דני כהן",
    description: "תוכנית אימון בסיסית למתחילים",
    type: "basic" as const,
    features: {
      personalizedWorkouts: true,
      equipmentOptimization: true,
      progressTracking: true,
      aiRecommendations: false,
      customSchedule: false,
    },
    workouts: [
      {
        id: "basic_day1",
        name: "אימון חזה וכתפיים בסיסי",
        description: "אימון עליון מתמקד בחזה וכתפיים",
        type: "strength" as const,
        difficulty: "beginner" as const,
        duration: 45,
        equipment: ["barbell", "dumbbells"],
        targetMuscles: ["chest", "shoulders", "triceps"],
        estimatedCalories: 380,
        exercises: [
          {
            id: "bench_press",
            name: "דחיפת חזה עם מקל",
            category: "strength",
            primaryMuscles: ["chest"],
            secondaryMuscles: ["shoulders", "triceps"],
            equipment: "barbell",
            sets: [
              { reps: 10, weight: 40, restTime: 90 },
              { reps: 10, weight: 40, restTime: 90 },
              { reps: 10, weight: 40, restTime: 90 },
            ],
            restTime: 90,
          },
          {
            id: "overhead_press",
            name: "לחיצת כתפיים עם מקל",
            category: "strength",
            primaryMuscles: ["shoulders"],
            secondaryMuscles: ["triceps"],
            equipment: "barbell",
            sets: [
              { reps: 8, weight: 30, restTime: 90 },
              { reps: 8, weight: 30, restTime: 90 },
              { reps: 8, weight: 30, restTime: 90 },
            ],
            restTime: 90,
          },
          {
            id: "lateral_raises",
            name: "הרמות צידיות",
            category: "strength",
            primaryMuscles: ["shoulders"],
            equipment: "dumbbells",
            sets: [
              { reps: 12, weight: 8, restTime: 60 },
              { reps: 12, weight: 8, restTime: 60 },
              { reps: 12, weight: 8, restTime: 60 },
            ],
            restTime: 60,
          },
        ],
        isAccessible: true,
      },
      {
        id: "basic_day3",
        name: "אימון רגליים בסיסי",
        description: "אימון תחתון מתמקד ברגליים וישבן",
        type: "strength" as const,
        difficulty: "beginner" as const,
        duration: 50,
        equipment: ["barbell", "dumbbells"],
        targetMuscles: ["quadriceps", "glutes", "hamstrings"],
        estimatedCalories: 420,
        exercises: [
          {
            id: "squats",
            name: "כיפופי ברכיים",
            category: "strength",
            primaryMuscles: ["quadriceps", "glutes"],
            equipment: "barbell",
            sets: [
              { reps: 10, weight: 50, restTime: 120 },
              { reps: 10, weight: 50, restTime: 120 },
              { reps: 10, weight: 50, restTime: 120 },
            ],
            restTime: 120,
          },
        ],
        isAccessible: true,
      },
    ],
    requiresSubscription: false,
  };

  const smartPlan = {
    id: "plan_smart_dani",
    name: "תוכנית חכמה - דני כהן",
    description: "תוכנית אימון מותאמת אישית עם בינה מלאכותית",
    type: "smart" as const,
    features: {
      personalizedWorkouts: true,
      equipmentOptimization: true,
      progressTracking: true,
      aiRecommendations: true,
      customSchedule: true,
    },
    workouts: [
      {
        id: "smart_day1",
        name: "דחיפה - אימון חכם",
        description: "אימון דחיפה מותאם לדני",
        type: "strength" as const,
        difficulty: "intermediate" as const,
        duration: 75,
        equipment: ["dumbbells", "barbell", "bench"],
        targetMuscles: ["chest", "shoulders", "triceps"],
        estimatedCalories: 480,
        exercises: [
          {
            id: "dumbbell_press",
            name: "דחיפת חזה עם משקולות",
            category: "strength",
            primaryMuscles: ["chest"],
            secondaryMuscles: ["shoulders", "triceps"],
            equipment: "dumbbells",
            sets: [
              { reps: 10, weight: 22, restTime: 90 },
              { reps: 8, weight: 24, restTime: 90 },
              { reps: 6, weight: 26, restTime: 90 },
              { reps: 8, weight: 22, restTime: 90 },
            ],
            restTime: 90,
          },
        ],
        isAccessible: true,
      },
      {
        id: "smart_day2",
        name: "משיכה - אימון חכם",
        description: "אימון משיכה מותאם לדני",
        type: "strength" as const,
        difficulty: "intermediate" as const,
        duration: 75,
        equipment: ["dumbbells", "barbell"],
        targetMuscles: ["back", "biceps"],
        estimatedCalories: 460,
        exercises: [
          {
            id: "dumbbell_row",
            name: "חתירה עם משקולת אחת",
            category: "strength",
            primaryMuscles: ["back"],
            secondaryMuscles: ["biceps"],
            equipment: "dumbbells",
            sets: [
              { reps: 10, weight: 20, restTime: 90 },
              { reps: 10, weight: 22, restTime: 90 },
              { reps: 8, weight: 24, restTime: 90 },
              { reps: 10, weight: 20, restTime: 90 },
            ],
            restTime: 90,
          },
        ],
        isAccessible: true,
      },
      {
        id: "smart_day3",
        name: "רגליים - אימון חכם",
        description: "אימון רגליים מותאם לדני",
        type: "strength" as const,
        difficulty: "intermediate" as const,
        duration: 80,
        equipment: ["dumbbells", "barbell"],
        targetMuscles: ["quadriceps", "glutes", "hamstrings"],
        estimatedCalories: 520,
        exercises: [
          {
            id: "dumbbell_squats",
            name: "כיפופי ברכיים עם משקולות",
            category: "strength",
            primaryMuscles: ["quadriceps", "glutes"],
            equipment: "dumbbells",
            sets: [
              { reps: 12, weight: 18, restTime: 120 },
              { reps: 10, weight: 20, restTime: 120 },
              { reps: 8, weight: 22, restTime: 120 },
              { reps: 10, weight: 18, restTime: 120 },
            ],
            restTime: 120,
          },
        ],
        isAccessible: true,
      },
      {
        id: "smart_day4",
        name: "כוח מלא - אימון חכם",
        description: "אימון גוף מלא מותאם לדני",
        type: "strength" as const,
        difficulty: "intermediate" as const,
        duration: 70,
        equipment: ["dumbbells", "barbell"],
        targetMuscles: ["full_body"],
        estimatedCalories: 450,
        exercises: [
          {
            id: "deadlift",
            name: "דדליפט",
            category: "strength",
            primaryMuscles: ["hamstrings", "glutes", "back"],
            equipment: "barbell",
            sets: [
              { reps: 8, weight: 60, restTime: 150 },
              { reps: 6, weight: 65, restTime: 150 },
              { reps: 4, weight: 70, restTime: 150 },
            ],
            restTime: 150,
          },
        ],
        isAccessible: true,
      },
    ],
    requiresSubscription: true,
  };

  return {
    basicPlan,
    smartPlan,
  };
}

// ========================================
// 📊 עדכון סטטיסטיקות מתקדמות
// ========================================

function generateAdvancedStatistics(
  workouts: Array<{
    duration?: number;
    estimatedCalories?: number;
    rating?: number;
    completed?: boolean;
    date: string;
  }>
) {
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCalories = workouts.reduce(
    (sum, w) => sum + (w.estimatedCalories || 0),
    0
  );
  const averageRating =
    workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / totalWorkouts;
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const completionRate = Math.round((completedWorkouts / totalWorkouts) * 100);

  // חישוב רצף נוכחי
  let currentStreak = 0;
  const today = new Date();
  for (let i = workouts.length - 1; i >= 0; i--) {
    const workoutDate = new Date(workouts[i].date);
    const daysDiff = Math.floor(
      (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 2 && workouts[i].completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    totalWorkouts,
    totalMinutes,
    totalCalories,
    averageRating: Math.round(averageRating * 10) / 10,
    completionRate,
    currentStreak,
    personalRecords: {
      benchPress: 80 + Math.floor(Math.random() * 50), // 80-130 ק"ג
      squat: 90 + Math.floor(Math.random() * 60), // 90-150 ק"ג
      deadlift: 100 + Math.floor(Math.random() * 70), // 100-170 ק"ג
      pullUps: 8 + Math.floor(Math.random() * 7), // 8-15 חזרות
    },
    lastUpdated: new Date().toISOString(),
  };
}

// ========================================
// 🚀 פונקציה ראשית - יצירת דני כהן מלא
// ========================================

export async function createCompleteDaniCohen() {
  try {
    console.warn("🚀 יוצר דני כהן עם נתונים מלאים...");

    // 1. יצירת היסטוריית אימונים מלאה
    const workoutHistory = generateWorkoutHistory();
    console.warn(`📅 נוצרו ${workoutHistory.length} אימונים מפורטים`);

    // 2. יצירת תוכניות אימון מלאות
    const workoutPlans = generateWorkoutPlans();
    console.warn(
      `📋 נוצרו תוכניות: בסיסית (${workoutPlans.basicPlan.workouts.length} אימונים) + חכמה (${workoutPlans.smartPlan.workouts.length} אימונים)`
    );

    // 3. חישוב סטטיסטיקות מתקדמות
    const statistics = generateAdvancedStatistics(workoutHistory);
    console.warn(
      `📊 חושבו סטטיסטיקות: ${statistics.totalWorkouts} אימונים, ${statistics.totalMinutes} דקות`
    );

    // 4. יצירת המשתמש המלא
    const completeDani = {
      id: "user_dani_cohen_real",
      name: "דני כהן",
      email: "dani.cohen.gym@gmail.com",
      age: 28,
      gender: "male",
      weight: 79,
      height: 178,
      provider: "manual",

      // נתונים בסיסיים (IDs חוקיים בלבד)
      goals: ["build_muscle"],
      equipment: ["dumbbells", "barbell", "bench", "squat_rack"],
      availability: ["sunday", "tuesday", "thursday", "saturday"],
      sessionDuration: 75,
      experienceLevel: "intermediate",

      // מנוי פרימיום
      subscription: {
        type: "premium" as const,
        isActive: true,
        startDate: new Date(
          Date.now() - 173 * 24 * 60 * 60 * 1000
        ).toISOString(),
        registrationDate: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
        hasCompletedTrial: true,
        trialDaysRemaining: 0,
      },

      // שאלון חכם
      smartQuestionnaireData: {
        answers: {
          personalInfo: { age: 28, gender: "male", weight: 79, height: 178 },
          goals: ["build_muscle"],
          equipment: ["dumbbells", "barbell", "bench", "squat_rack"],
          availability: ["sunday", "tuesday", "thursday", "saturday"],
          // מזהה חוקי לפי unifiedQuestionnaire
          sessionDuration: "60_plus_min",
          // שימוש במפתח חוקי ל-formatter והמערכת
          experience_level: "intermediate",
          // תאימות לאחור
          experience: "intermediate",
        },
        completedAt: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
        metadata: {
          completedAt: new Date(
            Date.now() - 180 * 24 * 60 * 60 * 1000
          ).toISOString(),
          version: "2.0",
          sessionId: "dani_cohen_complete",
        },
      },

      // תוכניות אימון מלאות
      workoutPlans,

      // היסטוריית אימונים
      workoutHistory,

      // היסטוריית פעילות לתמיכה בסטטיסטיקות ורצף
      activityHistory: {
        workouts: workoutHistory,
      },

      // סטטיסטיקות מעודכנות
      userStatistics: statistics,

      // נתוני אימון
      trainingStats: {
        totalWorkouts: workoutHistory.length,
        totalVolume: statistics.totalMinutes,
        favoriteExercises: ["bench_press", "squats", "deadlifts"],
        lastWorkoutDate: workoutHistory[workoutHistory.length - 1]?.date,
        preferredWorkoutDays: 4,
        selectedEquipment: ["dumbbells", "barbell", "bench", "squat_rack"],
        fitnessGoals: ["build_muscle"],
        currentFitnessLevel: "intermediate" as const,
        // שדות נלווים שימושיים במסכים
        currentStreak: statistics.currentStreak,
        lastUpdated: statistics.lastUpdated,
      },

      // פרופיל מותאם מגדר
      genderProfile: {
        selectedGender: "male" as const,
        adaptedWorkoutNames: {
          bench_press: "ספסל שטוח לגברים",
          squats: "סקוואט כוח",
          deadlifts: "דדליפט גברי",
        },
        personalizedMessages: [
          "אלוף! ממשיך להתחזק 💪",
          "גבר אמיתי לא מפסיק לדחוף גבולות!",
        ],
      },

      // העדפות
      preferences: {
        theme: "dark" as const,
        notifications: true,
        language: "he" as const,
        units: "metric" as const,
        gender: "male" as const,
        rtlPreference: true,
        workoutNameStyle: "adapted" as const,
      },

      // מטאדטה
      metadata: {
        createdAt: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
        isDemo: false,
        isRealUser: true,
        hasCompleteData: true,
        sessionId: `dani_cohen_complete_${Date.now()}`,
      },

      // 🔁 שכבת תאימות לשאלון בסיסי (IDs חוקיים בלבד)
      questionnaire: {
        // גיל/גובה/משקל כטווחים חוקיים לפי unifiedQuestionnaire
        age: "26_35",
        gender: "male",
        height: "171_180",
        weight: "71_80",
        // יעד/יעדים לפי מזהים חוקיים
        goals: ["build_muscle"],
        goal: "build_muscle",
        // ניסיון
        experience_level: "intermediate",
        experience: "intermediate",
        // זמינות ומשך אימון (ID חוקי)
        availability: ["sunday", "tuesday", "thursday", "saturday"],
        sessionDuration: "60_plus_min",
        duration: "60_plus_min",
        // ציוד
        equipment: ["dumbbells", "barbell", "bench", "squat_rack"],
        // דיאטה ברירת מחדל חוקית
        diet_type: "none_diet",
        completedAt: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    };

    // שמירה ב-AsyncStorage
    await AsyncStorage.setItem(
      "user_data_complete",
      JSON.stringify(completeDani)
    );
    await AsyncStorage.setItem(
      "workout_history_dani",
      JSON.stringify(workoutHistory)
    );
    await AsyncStorage.setItem(
      "workout_plans_dani",
      JSON.stringify(workoutPlans)
    );
    await AsyncStorage.setItem(
      "user_statistics_dani",
      JSON.stringify(statistics)
    );

    console.warn("✅ דני כהן נשמר עם כל הנתונים ב-AsyncStorage!");

    return completeDani;
  } catch (error) {
    console.error("❌ שגיאה ביצירת דני כהן המלא:", error);
    throw error;
  }
}

// ========================================
// 🗓️ יצירת היסטוריית אימונים מינימלית (לשימוש פנימי)
// ========================================
function generateWorkoutHistory(weeksBack: number = 12) {
  const workouts: Array<{
    id: string;
    name: string;
    date: string;
    duration: number;
    estimatedCalories: number;
    completed: boolean;
    rating: number;
  }> = [];

  const now = new Date();
  for (let week = 0; week < weeksBack; week++) {
    const workoutsThisWeek = 3 + Math.floor(Math.random() * 2); // 3-4
    for (let i = 0; i < workoutsThisWeek; i++) {
      const date = new Date(
        now.getTime() - (week * 7 + i * 2) * 24 * 60 * 60 * 1000
      );
      workouts.push({
        id: `workout_${week}_${i}`,
        name: i % 2 === 0 ? "חזה וכתפיים" : "גב וביצפס",
        date: date.toISOString(),
        duration: 60 + Math.floor(Math.random() * 20),
        estimatedCalories: 350 + Math.floor(Math.random() * 150),
        completed: true,
        rating: 4 + Math.random(),
      });
    }
  }
  // מיון יורד לפי תאריך
  return workouts.sort((a, b) => b.date.localeCompare(a.date));
}
