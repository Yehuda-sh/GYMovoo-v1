/**
 * @file createRealisticUsersWithQuestionnaire.js
 * @description יצירת 3 משתמשים אמיתיים עם נתוני שאלון מלאים - גרסה מתוקנת
 * @updated 2025-08-15 - תוקן לפי השאלון האמיתי מ-unifiedQuestionnaire.ts
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ משתני סביבה של Supabase חסרים!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 🎯 פונקציה ליצירת נתוני שאלון אמיתיים (מבוסס על UNIFIED_QUESTIONS בפועל)
function generateRealisticQuestionnaire(profile) {
  const now = new Date().toISOString();

  return {
    answers: {
      // 10 השאלות האמיתיות מ-unifiedQuestionnaire.ts:
      gender: profile.gender, // 👤 מין
      age: profile.age, // 🎂 גיל
      weight: profile.weight, // ⚖️ משקל
      height: profile.height, // 📏 גובה
      fitness_goal: profile.fitness_goal, // 🎯 מטרת כושר
      experience_level: profile.experience_level, // 💪 רמת ניסיון
      availability: profile.availability, // 📅 זמינות (ימים בשבוע)
      session_duration: profile.session_duration, // ⏱️ משך אימון
      workout_location: profile.workout_location, // 🏠 מיקום אימון
      diet_preferences: profile.diet_preferences, // 🥗 העדפות דיאטה

      // ציוד נקבע אוטומטית לפי workout_location:
      ...(profile.workout_location === "home_bodyweight" && {
        bodyweight_equipment: profile.bodyweight_equipment,
      }),
      ...(profile.workout_location === "home_equipment" && {
        home_equipment: profile.home_equipment,
      }),
      ...(profile.workout_location === "gym" && {
        gym_equipment: profile.gym_equipment,
      }),
    },
    metadata: {
      completedAt: now,
      version: "2.2",
      sessionId: `realistic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      completionTime: 180 + Math.floor(Math.random() * 300), // 3-8 דקות
      questionsAnswered: 10, // ✅ תוקן: 10 שאלות בפועל
      totalQuestions: 10, // ✅ תוקן: 10 שאלות בפועל
      deviceInfo: {
        platform: "mobile",
        screenWidth: 375,
        screenHeight: 812,
      },
      analytics: {
        completionRate: 100,
        recommendedProfile: profile.recommendedProfile,
        strengthAreas: profile.strengthAreas,
        timeSpent: 180 + Math.floor(Math.random() * 120),
      },
      recommendations: {
        sessionDuration:
          profile.session_duration === "30_45_min"
            ? "30-45 דקות מומלץ"
            : "45-60 דקות מומלץ",
        workoutFrequency:
          profile.availability === "2_days"
            ? "2 ימים בשבוע להתחלה"
            : "3+ ימים בשבוע",
        primaryFocus: [profile.fitness_goal],
        equipmentSuggestions: profile.equipment_suggestions || [],
        nutritionTips: [profile.diet_preferences],
      },
      validation: {
        isValid: true,
        errors: [],
        warnings: [],
      },
    },
  };
}

// 🎯 פרופילים אמיתיים מתוקנים לפי השאלון האמיתי
const realisticUsers = [
  {
    // 👩 משתמשת מתחילה - יערה (עודכן)
    name: "יערה כהן",
    email: "yaara.cohen.updated@gmail.com",

    // ✅ שאלות בסיסיות (4):
    gender: "female",
    age: "26_35",
    weight: "61_70",
    height: "161_170",

    // ✅ מטרה וניסיון (2):
    fitness_goal: "lose_weight",
    experience_level: "beginner",

    // ✅ זמינות ומשך (2):
    availability: "3_days", // 3 ימים בשבוע
    session_duration: "30_45_min", // 30-45 דקות

    // ✅ מיקום ותזונה (2):
    workout_location: "home_equipment",
    diet_preferences: "balanced_diet",

    // ציוד ביתי מתקדם:
    home_equipment: ["dumbbells", "resistance_bands", "yoga_mat"],

    // מטא-דאטה:
    strengthAreas: ["core", "lower_body"],
    recommendedProfile: "beginner_weight_loss_home_equipment",
    equipment_suggestions: ["dumbbells", "resistance_bands"],
  },

  {
    // 👨 משתמש מתקדם - אלון (עודכן)
    name: "אלון מזרחי",
    email: "alon.mizrahi.updated@outlook.com",

    // ✅ שאלות בסיסיות (4):
    gender: "male",
    age: "26_35",
    weight: "81_90",
    height: "171_180",

    // ✅ מטרה וניסיון (2):
    fitness_goal: "build_muscle",
    experience_level: "advanced",

    // ✅ זמינות ומשך (2):
    availability: "5_days", // 5+ ימים בשבוע
    session_duration: "45_60_min", // 45-60 דקות

    // ✅ מיקום ותזונה (2):
    workout_location: "gym",
    diet_preferences: "high_protein",

    // ציוד חדר כושר:
    gym_equipment: [
      "barbells",
      "dumbbells",
      "cable_machines",
      "squat_rack",
      "bench",
    ],

    // מטא-דאטה:
    strengthAreas: ["upper_body", "core", "lower_body"],
    recommendedProfile: "advanced_muscle_gain_gym_heavy",
    equipment_suggestions: ["barbells", "dumbbells"],
  },

  {
    // 👩 משתמשת ביניים - נועה (עודכנה)
    name: "נועה שפירא",
    email: "noa.shapira.updated@walla.com",

    // ✅ שאלות בסיסיות (4):
    gender: "female",
    age: "26_35",
    weight: "61_70",
    height: "161_170",

    // ✅ מטרה וניסיון (2):
    fitness_goal: "general_fitness",
    experience_level: "intermediate",

    // ✅ זמינות ומשך (2):
    availability: "3_days", // 3 ימים בשבוע
    session_duration: "30_45_min", // 30-45 דקות

    // ✅ מיקום ותזונה (2):
    workout_location: "home_bodyweight",
    diet_preferences: "vegetarian",

    // ציוד משקל גוף:
    bodyweight_equipment: ["yoga_mat", "water_bottles", "towel"],

    // מטא-דאטה:
    strengthAreas: ["core", "upper_body"],
    recommendedProfile: "intermediate_general_fitness_home_bodyweight",
    equipment_suggestions: ["yoga_mat"],
  },
];

// 🚀 פונקציה ליצירת משתמש אחד
async function createUserWithQuestionnaire(userProfile) {
  try {
    // 1. יצירת נתוני שאלון מלאים
    const questionnaireData = generateRealisticQuestionnaire(userProfile);

    // 2. יצירת אובייקט משתמש מלא
    const userData = {
      id: `realistic_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: userProfile.name,
      email: userProfile.email,
      created_at: new Date().toISOString(),

      // נתוני שאלון חכם (עיקרי) - עם השדה הנכון
      smartquestionnairedata: questionnaireData, // ✅ תוקן: lowercase עבור PostgreSQL

      // תאימות לאחור - questionnaire legacy
      questionnaire: {
        gender: userProfile.gender,
        age: userProfile.age,
        height: userProfile.height,
        weight: userProfile.weight,
        goal: userProfile.fitness_goal,
        experience: userProfile.experience_level,
        location: userProfile.workout_location,
        frequency: userProfile.availability,
        duration: userProfile.session_duration,
      },

      // מטא-דאטה נוספת בשדה preferences (קיים בטבלה)
      preferences: {
        fitness_level: userProfile.experience_level,
        primary_goals: [userProfile.fitness_goal],
        workout_frequency: userProfile.availability,
        preferred_equipment:
          userProfile.gym_equipment ||
          userProfile.home_equipment ||
          userProfile.bodyweight_equipment ||
          [],
        diet_style: userProfile.diet_preferences,
        session_length: userProfile.session_duration,
      },

      // היסטוריית אימונים ראשונית (שדה קיים בטבלה)
      activityhistory: {
        totalWorkouts: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null,
        weeklyGoal: parseInt(userProfile.availability.split("_")[0]) || 3,
        monthlyStats: {
          workoutsCompleted: 0,
          averageRating: 0,
          totalTimeMinutes: 0,
        },
      },

      // תוכניות אימון ראשוניות (שדה קיים בטבלה)
      workoutplans: {
        active: null,
        saved: [],
        history: [],
        preferences: {
          difficulty: userProfile.experience_level,
          duration: userProfile.session_duration,
          equipment: userProfile.workout_location,
          goals: [userProfile.fitness_goal],
        },
      },
    };

    // 3. שמירה ב-Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select();

    if (error) {
      console.error(
        `❌ שגיאה ביצירת משתמש ${userProfile.name}:`,
        error.message
      );
      return null;
    }

    console.log(`✅ משתמש נוצר בהצלחה: ${userProfile.name}`);
    console.log(`   📧 אימייל: ${userProfile.email}`);
    console.log(`   🎯 יעד: ${userProfile.fitness_goal}`);
    console.log(`   💪 רמה: ${userProfile.experience_level}`);
    console.log(`   🏠 מקום: ${userProfile.workout_location}`);
    console.log(`   📅 זמינות: ${userProfile.availability}`);
    console.log(`   ⏱️ משך אימון: ${userProfile.session_duration}`);
    console.log(`   🍽️ העדפות תזונה: ${userProfile.diet_preferences}`);

    // הצגת ציוד לפי סוג מיקום
    if (userProfile.workout_location === "gym" && userProfile.gym_equipment) {
      console.log(
        `   🏋️‍♀️ ציוד חדר כושר: ${userProfile.gym_equipment.join(", ")}`
      );
    } else if (
      userProfile.workout_location === "home_equipment" &&
      userProfile.home_equipment
    ) {
      console.log(`   🏠 ציוד ביתי: ${userProfile.home_equipment.join(", ")}`);
    } else if (
      userProfile.workout_location === "home_bodyweight" &&
      userProfile.bodyweight_equipment
    ) {
      console.log(
        `   🤸‍♀️ ציוד משקל גוף: ${userProfile.bodyweight_equipment.join(", ")}`
      );
    }
    console.log("");

    return data[0];
  } catch (err) {
    console.error(`💥 שגיאה כללית עבור ${userProfile.name}:`, err.message);
    return null;
  }
}

// 🎯 פונקציה ראשית
async function createAllRealisticUsers() {
  console.log("🚀 מתחיל יצירת 3 משתמשים אמיתיים עם נתוני שאלון מתוקנים...\n");

  // בדיקת חיבור
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);
    if (error) throw error;
    console.log("✅ חיבור Supabase תקין\n");
  } catch (err) {
    console.error("❌ בעיית חיבור Supabase:", err.message);
    return;
  }

  const results = [];

  // יצירת כל המשתמשים
  for (let i = 0; i < realisticUsers.length; i++) {
    const user = realisticUsers[i];
    console.log(`📝 יוצר משתמש ${i + 1}/3: ${user.name}...`);

    const result = await createUserWithQuestionnaire(user);
    results.push(result);

    // השהייה קטנה בין יצירות
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // סיכום
  const successful = results.filter((r) => r !== null).length;
  console.log("🎯 סיכום יצירת משתמשים:");
  console.log(`✅ נוצרו בהצלחה: ${successful}/${realisticUsers.length}`);
  console.log(`📊 כל המשתמשים כוללים 10 שאלות מתוקנות`);
  console.log(`🔗 נתונים נשמרו ב-Supabase בטבלת users`);
  console.log(`🎯 תוקן לפי השאלון האמיתי מ-unifiedQuestionnaire.ts`);

  if (successful === realisticUsers.length) {
    console.log("\n🚀 כל המשתמשים נוצרו בהצלחה! מוכנים לשימוש באפליקציה.");
  }
}

// הפעלה
createAllRealisticUsers().catch(console.error);
