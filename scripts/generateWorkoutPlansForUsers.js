/**
 * @file generateWorkoutPlansForUsers.js
 * @description יצירת תוכניות אימון מלאות למשתמשים קיימים
 * @date 2025-08-16
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * 🏋️ יצירת תוכנית אימון בסיסית עם תרגילים אמיתיים
 */
function createBasicWorkoutPlan(userProfile) {
  const { fitness_goal, experience_level, workout_location } = userProfile;

  // 📋 תרגילים לפי מיקום ומטרה
  const exercisesByGoalAndLocation = {
    lose_weight: {
      home_bodyweight: [
        { name: "Jumping Jacks", duration: 30, sets: 3, type: "cardio" },
        { name: "Burpees", reps: 10, sets: 3, type: "cardio" },
        { name: "Mountain Climbers", duration: 30, sets: 3, type: "cardio" },
        { name: "High Knees", duration: 30, sets: 3, type: "cardio" },
      ],
      home_equipment: [
        { name: "Dumbbell Thrusters", reps: 12, sets: 3, type: "strength" },
        { name: "Resistance Band Rows", reps: 15, sets: 3, type: "strength" },
        { name: "Kettlebell Swings", reps: 20, sets: 3, type: "cardio" },
      ],
      gym: [
        { name: "Treadmill Running", duration: 20, sets: 1, type: "cardio" },
        { name: "Rowing Machine", duration: 15, sets: 1, type: "cardio" },
        { name: "Cable Cross Trainer", reps: 15, sets: 3, type: "strength" },
      ],
    },
    build_muscle: {
      home_bodyweight: [
        { name: "Push-ups", reps: 12, sets: 3, type: "strength" },
        { name: "Squats", reps: 15, sets: 3, type: "strength" },
        { name: "Lunges", reps: 10, sets: 3, type: "strength" },
        { name: "Plank", duration: 60, sets: 3, type: "core" },
      ],
      home_equipment: [
        { name: "Dumbbell Bench Press", reps: 10, sets: 4, type: "strength" },
        { name: "Dumbbell Rows", reps: 12, sets: 3, type: "strength" },
        { name: "Goblet Squats", reps: 12, sets: 3, type: "strength" },
      ],
      gym: [
        { name: "Barbell Bench Press", reps: 8, sets: 4, type: "strength" },
        { name: "Barbell Squats", reps: 10, sets: 4, type: "strength" },
        { name: "Deadlifts", reps: 8, sets: 3, type: "strength" },
        { name: "Pull-ups", reps: 8, sets: 3, type: "strength" },
      ],
    },
    general_fitness: {
      home_bodyweight: [
        { name: "Bodyweight Squats", reps: 15, sets: 3, type: "strength" },
        { name: "Push-ups", reps: 10, sets: 3, type: "strength" },
        { name: "Jumping Jacks", duration: 30, sets: 3, type: "cardio" },
        { name: "Plank", duration: 45, sets: 2, type: "core" },
      ],
      home_equipment: [
        { name: "Dumbbell Squats", reps: 12, sets: 3, type: "strength" },
        {
          name: "Resistance Band Pull-aparts",
          reps: 15,
          sets: 3,
          type: "strength",
        },
        {
          name: "Yoga Mat Stretches",
          duration: 300,
          sets: 1,
          type: "flexibility",
        },
      ],
      gym: [
        { name: "Lat Pulldown", reps: 12, sets: 3, type: "strength" },
        { name: "Leg Press", reps: 15, sets: 3, type: "strength" },
        { name: "Chest Press Machine", reps: 12, sets: 3, type: "strength" },
      ],
    },
  };

  const exercises =
    exercisesByGoalAndLocation[fitness_goal]?.[workout_location] ||
    exercisesByGoalAndLocation.general_fitness.home_bodyweight;

  // 🏋️ יצירת 3 אימונים שבועיים
  const workouts = [
    {
      id: `workout-1-${Date.now()}`,
      name: "אימון יום א",
      day: 1,
      exercises: exercises.slice(0, 2), // 2 תרגילים ראשונים
      duration: 30,
      type: "strength",
    },
    {
      id: `workout-2-${Date.now() + 1}`,
      name: "אימון יום ג",
      day: 3,
      exercises: exercises.slice(1, 3), // תרגילים 2-3
      duration: 30,
      type: "mixed",
    },
    {
      id: `workout-3-${Date.now() + 2}`,
      name: "אימון יום ה",
      day: 5,
      exercises: exercises.slice(2), // כל השאר
      duration: 35,
      type: fitness_goal === "lose_weight" ? "cardio" : "strength",
    },
  ];

  return {
    id: `plan-${Date.now()}`,
    name: `תוכנית ${fitness_goal === "lose_weight" ? "ירידה במשקל" : fitness_goal === "build_muscle" ? "בניית שריר" : "כושר כללי"}`,
    description: `תוכנית אימון מותאמת לרמה ${experience_level} במקום ${workout_location}`,
    type: "basic",
    features: {
      personalizedWorkouts: true,
      equipmentOptimization: true,
      progressTracking: true,
      aiRecommendations: false,
      customSchedule: true,
    },
    workouts: workouts,
    duration: 4, // 4 שבועות
    frequency: 3, // 3 פעמים בשבוע
    createdAt: new Date().toISOString(),
    requiresSubscription: false,
  };
}

/**
 * 🧠 יצירת תוכנית אימון חכמה מתקדמת
 */
function createSmartWorkoutPlan(userProfile) {
  const basicPlan = createBasicWorkoutPlan(userProfile);

  return {
    ...basicPlan,
    id: `smart-plan-${Date.now()}`,
    name: `תוכנית AI מתקדמת`,
    description: `תוכנית אימון חכמה עם AI מותאמת אישית`,
    type: "smart",
    features: {
      personalizedWorkouts: true,
      equipmentOptimization: true,
      progressTracking: true,
      aiRecommendations: true,
      customSchedule: true,
    },
    // הוסף תרגיל נוסף לכל אימון
    workouts: basicPlan.workouts.map((workout) => ({
      ...workout,
      exercises: [
        ...workout.exercises,
        {
          name: "AI Recovery Stretch",
          duration: 120,
          sets: 1,
          type: "flexibility",
        },
      ],
      duration: workout.duration + 5,
    })),
    requiresSubscription: true,
  };
}

/**
 * 🔄 עדכון תוכניות אימון למשתמש
 */
async function generateWorkoutPlansForUser(user) {
  try {
    // חלץ פרופיל משתמש מהשאלון החכם
    const smartAnswers = user.smartquestionnairedata?.answers || {};

    const userProfile = {
      fitness_goal: smartAnswers.fitness_goal || "general_fitness",
      experience_level: smartAnswers.experience_level || "beginner",
      workout_location: smartAnswers.workout_location || "home_bodyweight",
    };

    console.log(`🏋️ יוצר תוכניות עבור ${user.name}:`);
    console.log(`   🎯 מטרה: ${userProfile.fitness_goal}`);
    console.log(`   💪 רמה: ${userProfile.experience_level}`);
    console.log(`   📍 מקום: ${userProfile.workout_location}`);

    // יצור תוכניות
    const basicPlan = createBasicWorkoutPlan(userProfile);
    const smartPlan = createSmartWorkoutPlan(userProfile);

    // עדכן במבנה מורחב
    const updatedWorkoutPlans = {
      // שמור נתונים קיימים אם יש
      ...user.workoutplans,

      // הוסף תוכניות חדשות
      basicPlan: basicPlan,
      smartPlan: smartPlan,

      // מטא-דאטה
      active: basicPlan.id, // התוכנית הפעילה
      lastGenerated: new Date().toISOString(),
      planCount: 2,
    };

    // עדכן בבסיס נתונים
    const { error } = await supabase
      .from("users")
      .update({ workoutplans: updatedWorkoutPlans })
      .eq("id", user.id);

    if (error) {
      console.error(`❌ שגיאה בעדכון ${user.name}:`, error.message);
      return false;
    }

    console.log(`✅ ${user.name} - תוכניות נוצרו בהצלחה:`);
    console.log(`   📋 תוכנית בסיסית: ${basicPlan.workouts.length} אימונים`);
    console.log(`   🧠 תוכנית חכמה: ${smartPlan.workouts.length} אימונים`);

    return true;
  } catch (error) {
    console.error(`❌ שגיאה ביצירת תוכניות עבור ${user.name}:`, error);
    return false;
  }
}

/**
 * 🚀 פונקציה ראשית - יצירת תוכניות לכל המשתמשים
 */
async function generateWorkoutPlansForAllUsers() {
  console.log("🔄 מתחיל יצירת תוכניות אימון למשתמשים...\n");

  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("❌ שגיאה בקבלת משתמשים:", error.message);
      return;
    }

    console.log(`👥 נמצאו ${users.length} משתמשים\n`);

    let successful = 0;
    let failed = 0;

    for (const user of users) {
      // בדוק אם יש שאלון חכם
      if (!user.smartquestionnairedata?.answers) {
        console.log(`⚠️ ${user.name} - אין נתוני שאלון חכם, מדלג...`);
        continue;
      }

      const success = await generateWorkoutPlansForUser(user);
      if (success) {
        successful++;
      } else {
        failed++;
      }

      console.log(""); // רווח
    }

    // סיכום
    console.log("📋 סיכום יצירת תוכניות:");
    console.log(`   ✅ הצליחו: ${successful}`);
    console.log(`   ❌ כשלו: ${failed}`);
    console.log(`   📊 סה"כ: ${users.length}`);

    if (failed === 0) {
      console.log("\n🎉 כל התוכניות נוצרו בהצלחה!");
    } else {
      console.log(`\n⚠️ יש ${failed} כשלונות - בדוק את הלוגים`);
    }
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

// 🚀 הפעלה
if (require.main === module) {
  generateWorkoutPlansForAllUsers();
}

module.exports = { generateWorkoutPlansForAllUsers };
