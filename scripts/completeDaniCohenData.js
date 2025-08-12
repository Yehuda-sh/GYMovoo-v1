/**
 * @file completeDaniCohenData.js
 * @description השלמת נתוני דני כהן - מילוי כל החוסרים שזוהו
 * מוסיף 90 אימונים מפורטים, תוכניות אימון מלאות, תוכן שבועי פעיל
 */

const fs = require("fs").promises;
const path = require("path");

// מיקום קבצי ה-AsyncStorage הסימולטיביים
const STORAGE_DIR = path.join(__dirname, "../storage_simulation");

// דמולציה של AsyncStorage עבור Node.js
const mockAsyncStorage = {
  async getItem(key) {
    try {
      const filePath = path.join(STORAGE_DIR, `${key}.json`);
      const data = await fs.readFile(filePath, "utf8");
      return data;
    } catch (error) {
      return null;
    }
  },

  async setItem(key, value) {
    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
      const filePath = path.join(STORAGE_DIR, `${key}.json`);
      await fs.writeFile(filePath, value, "utf8");
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  },

  async removeItem(key) {
    try {
      const filePath = path.join(STORAGE_DIR, `${key}.json`);
      await fs.unlink(filePath);
    } catch (error) {
      // קובץ לא קיים - זה בסדר
    }
  },

  async clear() {
    try {
      const files = await fs.readdir(STORAGE_DIR);
      await Promise.all(
        files.map((file) => fs.unlink(path.join(STORAGE_DIR, file)))
      );
    } catch (error) {
      // תיקיה לא קיימת - זה בסדר
    }
  },
};

const storage = mockAsyncStorage;

// ========================================
// 🏋️ נתוני תרגילים מפורטים
// ========================================

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

  // אימונים מעורבים
  burpees: { name: "ברפיז", category: "full_body", equipment: "none" },
  mountain_climbers: {
    name: "מטפסי הרים",
    category: "cardio",
    equipment: "none",
  },
  planks: { name: "פלאנק", category: "core", equipment: "none" },
};

// ========================================
// 📅 יצירת היסטוריית אימונים (90 אימונים)
// ========================================

function generateWorkoutHistory() {
  const workouts = [];
  const today = new Date();

  // דני מתאמן 4 פעמים בשבוע (ראשון, שלישי, חמישי, שבת) במשך 6 חודשים
  const workoutDays = [0, 2, 4, 6]; // ראשון=0, שלישי=2, חמישי=4, שבת=6

  for (let weekBack = 0; weekBack < 25; weekBack++) {
    // 25 שבועות = ~6 חודשים
    for (const dayOfWeek of workoutDays) {
      if (workouts.length >= 90) break;

      const workoutDate = new Date(today);
      workoutDate.setDate(today.getDate() - weekBack * 7 - (6 - dayOfWeek));

      const workout = generateSingleWorkout(
        workouts.length + 1,
        workoutDate,
        dayOfWeek
      );
      workouts.push(workout);
    }
    if (workouts.length >= 90) break;
  }

  // מיון לפי תאריך (הישן ביותר קודם)
  workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log(`✅ נוצרו ${workouts.length} אימונים עבור דני כהן`);
  return workouts;
}

function generateSingleWorkout(index, date, dayOfWeek) {
  const workoutTypes = {
    0: "חזה וכתפיים", // ראשון
    2: "גב וביצפס", // שלישי
    4: "רגליים", // חמישי
    6: "כוח מעורב", // שבת
  };

  const exercisesByDay = {
    0: [
      "bench_press",
      "incline_bench",
      "overhead_press",
      "lateral_raises",
      "tricep_dips",
    ],
    2: ["pull_ups", "barbell_rows", "bicep_curls", "planks"],
    4: ["squats", "deadlifts", "lunges", "leg_press", "calf_raises"],
    6: ["burpees", "mountain_climbers", "squats", "pull_ups", "planks"],
  };

  const exercises = exercisesByDay[dayOfWeek].map((exerciseId) => {
    const exerciseData = EXERCISES_DATABASE[exerciseId];
    return {
      id: exerciseId,
      name: exerciseData.name,
      category: exerciseData.category,
      equipment: exerciseData.equipment,
      sets: Math.floor(Math.random() * 3) + 3, // 3-5 סטים
      reps: Math.floor(Math.random() * 5) + 8, // 8-12 חזרות
      weight: Math.floor(Math.random() * 30) + 20, // 20-50 ק"ג
      restTime: 90, // 90 שניות מנוחה
      completed: Math.random() > 0.1, // 90% השלמה
    };
  });

  const duration = 65 + Math.floor(Math.random() * 20); // 65-85 דקות
  const calories = Math.floor(duration * 8.5); // ~8.5 קלוריות לדקה

  return {
    id: `workout_dani_${index}`,
    name: workoutTypes[dayOfWeek],
    date: date.toISOString(),
    duration: duration,
    exercises: exercises,
    rating: Math.floor(Math.random() * 2) + 3, // 3-5 כוכבים
    estimatedCalories: calories,
    type: "strength",
    notes: `אימון ${index}/90 - ${workoutTypes[dayOfWeek]}`,
    completed: true,
    userId: "user_dani_cohen_real",
  };
}

// ========================================
// 📋 יצירת תוכניות אימון מלאות
// ========================================

function generateWorkoutPlans() {
  const basicPlan = {
    id: "plan_basic_dani",
    name: "תוכנית בסיסית - דני כהן",
    description: "תוכנית אימון בסיסית למתחילים",
    type: "basic",
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
        type: "strength",
        difficulty: "beginner",
        duration: 45,
        exercises: [
          {
            exerciseId: "bench_press",
            sets: 3,
            reps: 10,
            weight: 40,
            restTime: 90,
          },
          {
            exerciseId: "overhead_press",
            sets: 3,
            reps: 8,
            weight: 30,
            restTime: 90,
          },
          {
            exerciseId: "lateral_raises",
            sets: 3,
            reps: 12,
            weight: 8,
            restTime: 60,
          },
        ],
      },
      {
        id: "basic_day2",
        name: "אימון גב וביצפס בסיסי",
        description: "אימון עליון מתמקד בגב וביצפס",
        type: "strength",
        difficulty: "beginner",
        duration: 45,
        exercises: [
          {
            exerciseId: "barbell_rows",
            sets: 3,
            reps: 10,
            weight: 35,
            restTime: 90,
          },
          {
            exerciseId: "pull_ups",
            sets: 3,
            reps: 6,
            weight: 0,
            restTime: 120,
          },
          {
            exerciseId: "bicep_curls",
            sets: 3,
            reps: 12,
            weight: 12,
            restTime: 60,
          },
        ],
      },
      {
        id: "basic_day3",
        name: "אימון רגליים בסיסי",
        description: "אימון תחתון מקיף",
        type: "strength",
        difficulty: "beginner",
        duration: 50,
        exercises: [
          {
            exerciseId: "squats",
            sets: 3,
            reps: 10,
            weight: 50,
            restTime: 120,
          },
          { exerciseId: "lunges", sets: 3, reps: 8, weight: 15, restTime: 90 },
          {
            exerciseId: "calf_raises",
            sets: 3,
            reps: 15,
            weight: 20,
            restTime: 60,
          },
        ],
      },
    ],
    duration: 12,
    frequency: 3,
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    requiresSubscription: false,
  };

  const smartPlan = {
    id: "plan_smart_dani",
    name: "תוכנית חדר כושר מקצועית",
    description: "תוכנית אימון מתקדמת ומותאמת אישית",
    type: "smart",
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
        name: "חזה וכתפיים מתקדם",
        description: "אימון עליון אינטנסיבי",
        type: "strength",
        difficulty: "intermediate",
        duration: 75,
        exercises: [
          {
            exerciseId: "bench_press",
            sets: 4,
            reps: 8,
            weight: 70,
            restTime: 120,
          },
          {
            exerciseId: "incline_bench",
            sets: 4,
            reps: 10,
            weight: 25,
            restTime: 90,
          },
          {
            exerciseId: "overhead_press",
            sets: 4,
            reps: 6,
            weight: 45,
            restTime: 120,
          },
          {
            exerciseId: "lateral_raises",
            sets: 3,
            reps: 15,
            weight: 12,
            restTime: 60,
          },
          {
            exerciseId: "tricep_dips",
            sets: 3,
            reps: 12,
            weight: 0,
            restTime: 90,
          },
        ],
      },
      {
        id: "smart_day2",
        name: "גב וביצפס מתקדם",
        description: "פיתוח כוח עליון אחורי",
        type: "strength",
        difficulty: "intermediate",
        duration: 70,
        exercises: [
          {
            exerciseId: "pull_ups",
            sets: 4,
            reps: 8,
            weight: 10,
            restTime: 120,
          },
          {
            exerciseId: "barbell_rows",
            sets: 4,
            reps: 8,
            weight: 60,
            restTime: 120,
          },
          {
            exerciseId: "bicep_curls",
            sets: 4,
            reps: 10,
            weight: 18,
            restTime: 60,
          },
          { exerciseId: "planks", sets: 3, reps: 1, weight: 0, restTime: 60 },
        ],
      },
      {
        id: "smart_day3",
        name: "רגליים מתקדם",
        description: "אימון תחתון אינטנסיבי",
        type: "strength",
        difficulty: "intermediate",
        duration: 80,
        exercises: [
          { exerciseId: "squats", sets: 4, reps: 6, weight: 90, restTime: 180 },
          {
            exerciseId: "deadlifts",
            sets: 4,
            reps: 5,
            weight: 100,
            restTime: 180,
          },
          { exerciseId: "lunges", sets: 3, reps: 10, weight: 22, restTime: 90 },
          {
            exerciseId: "leg_press",
            sets: 4,
            reps: 12,
            weight: 150,
            restTime: 120,
          },
          {
            exerciseId: "calf_raises",
            sets: 4,
            reps: 20,
            weight: 30,
            restTime: 60,
          },
        ],
      },
      {
        id: "smart_day4",
        name: "כוח מעורב HIIT",
        description: "אימון אינטרוולים מתקדם",
        type: "hiit",
        difficulty: "intermediate",
        duration: 60,
        exercises: [
          { exerciseId: "burpees", sets: 4, reps: 8, weight: 0, restTime: 60 },
          {
            exerciseId: "mountain_climbers",
            sets: 4,
            reps: 20,
            weight: 0,
            restTime: 45,
          },
          { exerciseId: "squats", sets: 3, reps: 15, weight: 20, restTime: 60 },
          { exerciseId: "pull_ups", sets: 3, reps: 5, weight: 0, restTime: 90 },
        ],
      },
    ],
    duration: 16,
    frequency: 4,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    requiresSubscription: true,
  };

  return { basicPlan, smartPlan };
}

// ========================================
// 📊 עדכון סטטיסטיקות מתקדמות
// ========================================

function generateAdvancedStatistics(workouts) {
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
    const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
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
    weeklyProgress: {
      thisWeek: Math.floor(Math.random() * 4) + 3, // 3-6 אימונים השבוע
      lastWeek: 4,
      improvement: "+12%",
    },
    monthlyStats: {
      workoutsThisMonth: Math.floor(Math.random() * 8) + 14, // 14-22 אימונים החודש
      averageDuration: Math.floor(totalMinutes / totalWorkouts),
      strengthGains: "+8.5%",
      enduranceGains: "+15%",
    },
  };
}

// ========================================
// 👤 פרופיל מותאם מגדר
// ========================================

function generateGenderProfile() {
  return {
    selectedGender: "male",
    adaptedWorkoutNames: {
      bench_press: "ספסל שטוח לגברים",
      squats: "סקוואט כוח",
      deadlifts: "דדליפט גברי",
      pull_ups: "מתחים לגברים",
    },
    personalizedMessages: [
      "אלוף! ממשיך להתחזק 💪",
      "גבר אמיתי לא מפסיק לדחוף גבולות!",
      "הכוח שלך גדל כל אימון 🔥",
      "מלך החדר כושר!",
    ],
    completionMessages: {
      male: "כל הכבוד גבר! סיימת אימון מדהים 🏆",
      neutral: "אימון מושלם! אתה מתחזק כל פעם 💪",
    },
  };
}

// ========================================
// 🎯 העדפות מתקדמות
// ========================================

function generateUserPreferences() {
  return {
    theme: "dark",
    notifications: true,
    language: "he",
    units: "metric",
    gender: "male",
    rtlPreference: true,
    workoutNameStyle: "adapted", // משתמש בשמות מותאמים
  };
}

// ========================================
// 🚀 פונקציה ראשית - השלמת כל הנתונים
// ========================================

async function completeDaniCohenData() {
  try {
    console.log("🚀 מתחיל השלמת נתוני דני כהן...");

    // 1. יצירת היסטוריית אימונים מלאה
    console.log("📅 יוצר 90 אימונים מפורטים...");
    const workoutHistory = generateWorkoutHistory();
    await storage.setItem(
      "workout_history_dani",
      JSON.stringify(workoutHistory)
    );

    // 2. יצירת תוכניות אימון מלאות
    console.log("📋 יוצר תוכניות אימון עם תוכן מלא...");
    const { basicPlan, smartPlan } = generateWorkoutPlans();
    const workoutPlans = {
      basicPlan,
      smartPlan,
      lastUpdated: new Date().toISOString(),
      planPreference: "smart",
    };
    await storage.setItem("workout_plans_dani", JSON.stringify(workoutPlans));

    // 3. עדכון סטטיסטיקות מתקדמות
    console.log("📊 מחשב סטטיסטיקות מתקדמות...");
    const advancedStats = generateAdvancedStatistics(workoutHistory);
    await storage.setItem(
      "user_statistics_dani",
      JSON.stringify(advancedStats)
    );

    // 4. יצירת פרופיל מותאם מגדר
    console.log("👤 יוצר פרופיל מותאם לגבר...");
    const genderProfile = generateGenderProfile();

    // 5. הגדרת העדפות מתקדמות
    console.log("🎨 מגדיר העדפות מתקדמות...");
    const preferences = generateUserPreferences();

    // 6. יצירת נתוני משתמש מעודכנים
    const updatedUser = {
      id: "user_dani_cohen_real",
      name: "דני כהן",
      email: "dani.cohen.gym@gmail.com",
      age: 28,
      gender: "male",
      weight: 79,
      height: 178,
      provider: "manual",

      // נתונים בסיסיים
      goals: ["muscle_gain", "strength"],
      equipment: ["dumbbells", "barbell", "bench", "squat_rack"],
      availability: ["sunday", "tuesday", "thursday", "saturday"],
      sessionDuration: 75,
      experienceLevel: "intermediate",

      // מנוי פרימיום
      subscription: {
        type: "premium",
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
        id: "questionnaire_dani_cohen",
        answers: {
          personalInfo: { age: 28, gender: "male", weight: 79, height: 178 },
          goals: ["muscle_gain", "strength"],
          equipment: ["dumbbells", "barbell", "bench", "squat_rack"],
          availability: ["sunday", "tuesday", "thursday", "saturday"],
          sessionDuration: "75",
          experienceLevel: "intermediate",
          previousActivity: "gym",
          dietPreference: "balanced",
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

      // פרופיל מותאם מגדר
      genderProfile,

      // העדפות מתקדמות
      preferences,

      // נתוני אימון
      trainingStats: {
        totalWorkouts: workoutHistory.length,
        totalVolume: advancedStats.totalMinutes,
        favoriteExercises: ["bench_press", "squats", "deadlifts"],
        lastWorkoutDate: workoutHistory[workoutHistory.length - 1]?.date,
        preferredWorkoutDays: 4,
        selectedEquipment: ["dumbbells", "barbell", "bench", "squat_rack"],
        fitnessGoals: ["muscle_gain", "strength"],
        currentFitnessLevel: "intermediate",
      },

      // סטטיסטיקות מעודכנות
      userStatistics: advancedStats,

      // מטאדטה
      metadata: {
        createdAt: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
        isDemo: false,
        isRealUser: true,
        isComplete: true,
        sessionId: `dani_cohen_complete_${Date.now()}`,
      },
    };

    // שמירת המשתמש המעודכן
    await storage.setItem("user_data_complete", JSON.stringify(updatedUser));

    console.log("\n🎉 השלמת נתוני דני כהן הושלמה בהצלחה!");
    console.log("=".repeat(50));
    console.log("✅ נתונים שנוצרו:");
    console.log(
      `📅 היסטוריית אימונים: ${workoutHistory.length} אימונים מפורטים`
    );
    console.log(`📋 תוכנית בסיסית: ${basicPlan.workouts.length} אימונים`);
    console.log(`🏆 תוכנית חכמה: ${smartPlan.workouts.length} אימונים`);
    console.log(
      `📊 סטטיסטיקות: ${advancedStats.totalWorkouts} אימונים, ${advancedStats.totalMinutes} דקות`
    );
    console.log(
      `👤 פרופיל מגדר: ${Object.keys(genderProfile.adaptedWorkoutNames).length} תרגילים מותאמים`
    );
    console.log(
      `🎨 העדפות: נושא ${preferences.theme}, שפה ${preferences.language}`
    );
    console.log("=".repeat(50));
    console.log("🚀 דני כהן עכשיו משתמש מלא ומקצועי עם כל הנתונים!");

    return {
      user: updatedUser,
      workoutHistory,
      workoutPlans,
      statistics: advancedStats,
    };
  } catch (error) {
    console.error("❌ שגיאה בהשלמת נתוני דני כהן:", error);
    throw error;
  }
}

// הרצה ישירה אם הקובץ מופעל
if (require.main === module) {
  completeDaniCohenData()
    .then(() => {
      console.log("✅ סקריפט הושלם בהצלחה!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ שגיאה בהרצת הסקריפט:", error);
      process.exit(1);
    });
}

module.exports = { completeDaniCohenData };
