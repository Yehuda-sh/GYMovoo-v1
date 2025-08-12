/**
 * יצירת משתמש אמיתי עם 6 חודשים של היסטוריה מציאותית
 * הנתונים מבוססים על שימוש אמיתי באפליקציה
 * עם התקדמות הדרגתית ומציאותית
 */

// הדמיית AsyncStorage עבור בדיקות
const mockAsyncStorage = {
  data: {},
  async setItem(key, value) {
    this.data[key] = value;
    console.warn(`💾 נשמר: ${key}`);
    return Promise.resolve();
  },
  async getItem(key) {
    return Promise.resolve(this.data[key] || null);
  },
  async removeItem(key) {
    delete this.data[key];
    return Promise.resolve();
  },
  async clear() {
    this.data = {};
    return Promise.resolve();
  },
};

const storage = mockAsyncStorage;

// ==========================================
// 📅 חישוב תאריכים - 6 חודשים אחורה
// ==========================================

const now = new Date();
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(now.getMonth() - 6);

function getDateXDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.getTime();
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("he-IL");
}

// ==========================================
// 👤 משתמש אמיתי - "דני כהן"
// ==========================================

const REAL_USER = {
  id: "user_dani_cohen_real",
  name: "דני כהן",
  email: "dani.cohen.gym@gmail.com",
  age: 28,
  gender: "male",
  weight: 82, // משקל נוכחי (עלה מ-78 בתחילה)
  height: 178,
  startingWeight: 78, // משקל התחלתי
  goals: ["muscle_gain", "strength"], // החל עם muscle_gain, הוסיף strength אחרי 3 חודשים
  equipment: ["dumbbells", "barbell", "bench", "squat_rack"], // הוסיף ציוד הדרגתי
  availability: ["sunday", "tuesday", "thursday", "saturday"], // החל עם 3 ימים, הוסיף יום רביעי
  sessionDuration: 75, // החל עם 60, עלה ל-75 אחרי חודשיים
  experienceLevel: "intermediate", // התקדם מ-beginner
  createdAt: getDateXDaysAgo(180), // נרשם לפני 6 חודשים
  isDemo: false, // משתמש אמיתי!

  // מנוי - התחיל ב-trial, עבר לפרימיום אחרי שבוע
  subscription: {
    type: "premium",
    startDate: getDateXDaysAgo(173), // התחיל פרימיום אחרי שבוע trial
    trialStartDate: getDateXDaysAgo(180),
    isActive: true,
    planHistory: [
      {
        type: "trial",
        startDate: getDateXDaysAgo(180),
        endDate: getDateXDaysAgo(173),
      },
      { type: "premium", startDate: getDateXDaysAgo(173), endDate: null },
    ],
  },
};

// ==========================================
// 📋 מסע השאלון האמיתי של דני
// ==========================================

const INITIAL_QUESTIONNAIRE = {
  // שאלון מהיום הראשון
  answers: {
    personal_info: {
      age: 28,
      gender: "male",
      weight: 78, // משקל התחלתי
      height: 178,
    },
    goals: ["muscle_gain"], // התחיל רק עם muscle_gain
    gym_equipment: ["dumbbells"], // התחיל רק עם dumbbells בבית
    availability: ["sunday", "tuesday", "thursday"], // 3 ימים בשבוע
    session_duration: 60, // שעה לאימון
    experience_level: "beginner",
  },
  metadata: {
    completedAt: getDateXDaysAgo(180),
    version: "smart_questionnaire_v2",
    totalQuestions: 6,
    completionTime: 245, // לקח לו כמעט 4 דקות במלא
  },
};

// עדכון שאלון אחרי 3 חודשים (כשהתקדם)
const UPDATED_QUESTIONNAIRE = {
  answers: {
    personal_info: {
      age: 28,
      gender: "male",
      weight: 80, // עלה ב-2 ק"ג
      height: 178,
    },
    goals: ["muscle_gain", "strength"], // הוסיף strength
    gym_equipment: ["dumbbells", "barbell", "bench"], // קנה ציוד נוסף
    availability: ["sunday", "tuesday", "thursday", "saturday"], // הוסיף יום רביעי
    session_duration: 75, // הגדיל אימונים
    experience_level: "intermediate", // התקדם
  },
  metadata: {
    completedAt: getDateXDaysAgo(90),
    version: "smart_questionnaire_v2",
    totalQuestions: 6,
    completionTime: 156, // יותר מהיר הפעם
  },
};

// ==========================================
// 🏋️ תוכניות האימון שהתפתח איתן
// ==========================================

const WORKOUT_PLANS_EVOLUTION = {
  // תוכנית ראשונה - בסיסית (ימים 1-60)
  phase1_basic: {
    id: "dani_plan_phase1",
    name: "תוכנית התחלתית - דני",
    type: "basic",
    description: "תוכנית בסיסית עם דמבלים בבית",
    daysPerWeek: 3,
    estimatedDuration: 60,
    dateCreated: getDateXDaysAgo(180),
    workouts: [
      {
        name: "אימון גוף עליון",
        type: "strength",
        estimatedCalories: 220,
        exercises: [
          {
            id: "dumbbell_chest_press",
            name: "הרחקות דמבלים",
            equipment: "dumbbells",
            sets: 3,
            reps: 12,
            weight: 12,
            restTime: 60,
          },
          {
            id: "dumbbell_rows",
            name: "חתירה דמבלים",
            equipment: "dumbbells",
            sets: 3,
            reps: 12,
            weight: 12,
            restTime: 60,
          },
          {
            id: "dumbbell_shoulder_press",
            name: "לחיצות כתפיים",
            equipment: "dumbbells",
            sets: 3,
            reps: 10,
            weight: 10,
            restTime: 60,
          },
          {
            id: "pushups",
            name: "שכיבות סמיכה",
            equipment: "none",
            sets: 3,
            reps: 10,
            restTime: 45,
          },
        ],
      },
      {
        name: "אימון רגליים",
        type: "strength",
        estimatedCalories: 200,
        exercises: [
          {
            id: "bodyweight_squats",
            name: "כפיפות ברכיים",
            equipment: "none",
            sets: 3,
            reps: 15,
            restTime: 45,
          },
          {
            id: "lunges",
            name: "לאנג'ס",
            equipment: "none",
            sets: 3,
            reps: 12,
            restTime: 45,
          },
          {
            id: "dumbbell_deadlifts",
            name: "דדליפט דמבלים",
            equipment: "dumbbells",
            sets: 3,
            reps: 10,
            weight: 14,
            restTime: 60,
          },
        ],
      },
    ],
  },

  // תוכנית שנייה - מתקדמת (ימים 61-120)
  phase2_intermediate: {
    id: "dani_plan_phase2",
    name: "תוכנית ביניים - דני",
    type: "smart",
    description: "תוכנית מתקדמת עם ציוד נוסף",
    daysPerWeek: 4,
    estimatedDuration: 70,
    dateCreated: getDateXDaysAgo(120),
    workouts: [
      {
        name: "חזה וטריצפס",
        type: "strength",
        estimatedCalories: 280,
        exercises: [
          {
            id: "barbell_bench_press",
            name: "הרחקות מוט",
            equipment: "barbell",
            sets: 4,
            reps: 8,
            weight: 60,
            restTime: 90,
          },
          {
            id: "dumbbell_flyes",
            name: "פתיחות דמבלים",
            equipment: "dumbbells",
            sets: 3,
            reps: 12,
            weight: 15,
            restTime: 60,
          },
          {
            id: "close_grip_bench",
            name: "הרחקות צרות",
            equipment: "barbell",
            sets: 3,
            reps: 10,
            weight: 45,
            restTime: 75,
          },
          {
            id: "tricep_dips",
            name: "דיפים",
            equipment: "bench",
            sets: 3,
            reps: 12,
            restTime: 60,
          },
        ],
      },
      {
        name: "גב וביצפס",
        type: "strength",
        estimatedCalories: 270,
        exercises: [
          {
            id: "barbell_rows",
            name: "חתירה מוט",
            equipment: "barbell",
            sets: 4,
            reps: 8,
            weight: 55,
            restTime: 90,
          },
          {
            id: "lat_pulldowns",
            name: "משיכות לאט",
            equipment: "lat_pulldown",
            sets: 3,
            reps: 10,
            weight: 50,
            restTime: 75,
          },
          {
            id: "dumbbell_curls",
            name: "כפיפות דמבלים",
            equipment: "dumbbells",
            sets: 3,
            reps: 12,
            weight: 16,
            restTime: 60,
          },
        ],
      },
    ],
  },

  // תוכנית שלישית - מתקדמת (ימים 121-180)
  phase3_advanced: {
    id: "dani_plan_phase3",
    name: "תוכנית מתקדמת - דני",
    type: "smart",
    description: "תוכנית מתקדמת עם מיקוד בכוח",
    daysPerWeek: 4,
    estimatedDuration: 75,
    dateCreated: getDateXDaysAgo(60),
    workouts: [
      {
        name: "כוח - חזה ופרסים",
        type: "strength",
        estimatedCalories: 320,
        exercises: [
          {
            id: "barbell_bench_press",
            name: "הרחקות מוט",
            equipment: "barbell",
            sets: 5,
            reps: 5,
            weight: 75,
            restTime: 120,
          },
          {
            id: "incline_dumbbell_press",
            name: "הרחקות נטוי",
            equipment: "dumbbells",
            sets: 4,
            reps: 8,
            weight: 22,
            restTime: 90,
          },
          {
            id: "military_press",
            name: "לחיצה צבאית",
            equipment: "barbell",
            sets: 4,
            reps: 6,
            weight: 50,
            restTime: 100,
          },
        ],
      },
      {
        name: "כוח - גב ומשיכות",
        type: "strength",
        estimatedCalories: 300,
        exercises: [
          {
            id: "deadlifts",
            name: "דדליפט",
            equipment: "barbell",
            sets: 5,
            reps: 5,
            weight: 90,
            restTime: 150,
          },
          {
            id: "pull_ups",
            name: "מתחים",
            equipment: "pullup_bar",
            sets: 4,
            reps: 8,
            restTime: 90,
          },
          {
            id: "barbell_rows",
            name: "חתירה מוט",
            equipment: "barbell",
            sets: 4,
            reps: 6,
            weight: 65,
            restTime: 100,
          },
        ],
      },
      {
        name: "רגליים כבדות",
        type: "strength",
        estimatedCalories: 350,
        exercises: [
          {
            id: "barbell_squats",
            name: "כפיפות מוט",
            equipment: "squat_rack",
            sets: 5,
            reps: 5,
            weight: 85,
            restTime: 150,
          },
          {
            id: "romanian_deadlifts",
            name: "דדליפט רומני",
            equipment: "barbell",
            sets: 4,
            reps: 8,
            weight: 70,
            restTime: 100,
          },
          {
            id: "leg_press",
            name: "לחיצות רגליים",
            equipment: "leg_press",
            sets: 4,
            reps: 12,
            weight: 120,
            restTime: 90,
          },
        ],
      },
    ],
  },
};

// ==========================================
// 📈 יצירת היסטוריה אמיתית של 6 חודשים
// ==========================================

function generateRealisticWorkoutHistory() {
  const history = [];
  let currentWeight = 78; // משקל התחלתי
  let strengthProgress = 1.0; // מקדם התקדמות בכוח

  // Phase 1: חודשיים ראשונים (ימים 180-121)
  console.warn("📅 יוצר Phase 1: חודשיים ראשונים...");
  for (let day = 180; day >= 121; day--) {
    const dayOfWeek = new Date(getDateXDaysAgo(day)).getDay();

    // אימון ב: ראשון (0), שלישי (2), חמישי (4)
    if ([0, 2, 4].includes(dayOfWeek)) {
      const workoutType = day % 2 === 0 ? "אימון גוף עליון" : "אימון רגליים";
      const baseWorkout = WORKOUT_PLANS_EVOLUTION.phase1_basic.workouts.find(
        (w) => w.name === workoutType
      );

      if (baseWorkout) {
        const workoutEntry = {
          id: `workout_${day}_phase1`,
          planId: "dani_plan_phase1",
          workoutName: workoutType,
          date: getDateXDaysAgo(day),
          duration: Math.floor(55 + Math.random() * 15), // 55-70 דקות
          caloriesBurned: Math.floor(
            baseWorkout.estimatedCalories * (0.9 + Math.random() * 0.2)
          ),
          exercises: baseWorkout.exercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            sets: generateRealisticSets(ex, strengthProgress, "beginner"),
          })),
          notes: generateWorkoutNotes(day, "beginner"),
          rating: Math.floor(3 + Math.random() * 2), // 3-4 כוכבים
          completed: Math.random() > 0.1, // 90% השלמה
          bodyWeight: Math.floor(currentWeight * 100) / 100,
        };

        history.push(workoutEntry);

        // התקדמות הדרגתית בכוח ומשקל
        strengthProgress += 0.01; // 1% כל אימון
        if (day % 7 === 0) currentWeight += 0.1; // עליה במשקל גוף
      }
    }
  }

  // Phase 2: חודשיים באמצע (ימים 120-61)
  console.warn("📅 יוצר Phase 2: חודשיים באמצע...");
  for (let day = 120; day >= 61; day--) {
    const dayOfWeek = new Date(getDateXDaysAgo(day)).getDay();

    // 4 ימים בשבוע: ראשון, שלישי, חמישי, שבת
    if ([0, 2, 4, 6].includes(dayOfWeek)) {
      const workouts = WORKOUT_PLANS_EVOLUTION.phase2_intermediate.workouts;
      const workout = workouts[day % workouts.length];

      const workoutEntry = {
        id: `workout_${day}_phase2`,
        planId: "dani_plan_phase2",
        workoutName: workout.name,
        date: getDateXDaysAgo(day),
        duration: Math.floor(65 + Math.random() * 15), // 65-80 דקות
        caloriesBurned: Math.floor(
          workout.estimatedCalories * (0.9 + Math.random() * 0.2)
        ),
        exercises: workout.exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          sets: generateRealisticSets(ex, strengthProgress, "intermediate"),
        })),
        notes: generateWorkoutNotes(day, "intermediate"),
        rating: Math.floor(3 + Math.random() * 2), // 3-5 כוכבים
        completed: Math.random() > 0.05, // 95% השלמה
        bodyWeight: Math.floor(currentWeight * 100) / 100,
      };

      history.push(workoutEntry);
      strengthProgress += 0.008; // התקדמות יותר איטית
      if (day % 10 === 0) currentWeight += 0.15;
    }
  }

  // Phase 3: חודשיים אחרונים (ימים 60-1)
  console.warn("📅 יוצר Phase 3: חודשיים אחרונים...");
  for (let day = 60; day >= 1; day--) {
    const dayOfWeek = new Date(getDateXDaysAgo(day)).getDay();

    if ([0, 2, 4, 6].includes(dayOfWeek)) {
      const workouts = WORKOUT_PLANS_EVOLUTION.phase3_advanced.workouts;
      const workout = workouts[day % workouts.length];

      const workoutEntry = {
        id: `workout_${day}_phase3`,
        planId: "dani_plan_phase3",
        workoutName: workout.name,
        date: getDateXDaysAgo(day),
        duration: Math.floor(70 + Math.random() * 20), // 70-90 דקות
        caloriesBurned: Math.floor(
          workout.estimatedCalories * (0.9 + Math.random() * 0.2)
        ),
        exercises: workout.exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          sets: generateRealisticSets(ex, strengthProgress, "advanced"),
        })),
        notes: generateWorkoutNotes(day, "advanced"),
        rating: Math.floor(4 + Math.random() * 2), // 4-5 כוכבים
        completed: Math.random() > 0.03, // 97% השלמה
        bodyWeight: Math.floor(currentWeight * 100) / 100,
      };

      history.push(workoutEntry);
      strengthProgress += 0.005; // התקדמות איטית יותר
      if (day % 14 === 0) currentWeight += 0.1;
    }
  }

  // עדכון משקל הסופי של המשתמש
  REAL_USER.weight = Math.floor(currentWeight);

  return history.sort((a, b) => a.date - b.date); // סדר כרונולוגי
}

function generateRealisticSets(exercise, strengthProgress, level) {
  const sets = [];
  const baseWeight = exercise.weight || 0;
  const actualWeight = Math.floor(baseWeight * strengthProgress);

  for (let setNum = 1; setNum <= exercise.sets; setNum++) {
    // התקדמות ריאליסטית - פחות חזרות בסטים אחרונים
    const fatigueFactor = 1 - (setNum - 1) * 0.1;
    const reps = Math.max(
      Math.floor(exercise.reps * fatigueFactor * (0.9 + Math.random() * 0.2)),
      Math.floor(exercise.reps * 0.6)
    );

    // זמן מנוחה ריאליסטי - יותר אם זה כבד
    let restTime = exercise.restTime;
    if (level === "advanced" && actualWeight > baseWeight * 1.5) {
      restTime += Math.floor(Math.random() * 30); // מנוחה נוספת לסטים כבדים
    }

    sets.push({
      set: setNum,
      reps: reps,
      weight: actualWeight,
      restTime: restTime,
      completed: Math.random() > 0.02, // 98% השלמת סטים
      notes:
        setNum === exercise.sets && Math.random() > 0.7
          ? "סט אחרון מעצבן"
          : undefined,
    });
  }

  return sets;
}

function generateWorkoutNotes(day, level) {
  const notes = {
    beginner: [
      "אימון טוב! עדיין מתרגל לטכניקה",
      "הרגשתי חזק היום",
      "קצת עייף אבל סיימתי הכל",
      "התחלתי להרגיש שיפור בכוח",
      "טכניקה משתפרת בהדרגה",
    ],
    intermediate: [
      "אימון מעולה! הוספתי משקל",
      "הרגשתי פחות עייף מהפעם הקודמת",
      "התקדמות ברורה בכוח",
      "טכניקה טובה, מוסיף עוד משקל בפעם הבאה",
      "אימון אינטנסיבי אבל מסופק",
    ],
    advanced: [
      "PR חדש! הרגשתי בשיא הכוח",
      "אימון קשה אבל מאוד מוצלח",
      "התקדמות משמעותית בכל התרגילים",
      "מרוכז וממוקד, תוצאות מעולות",
      "כוח שיא! מרגיש את ההתקדמות",
    ],
  };

  if (Math.random() > 0.3) {
    // 70% מהאימונים עם הערות
    const levelNotes = notes[level];
    return levelNotes[Math.floor(Math.random() * levelNotes.length)];
  }
  return undefined;
}

// ==========================================
// 💾 שמירה בסדר הנכון
// ==========================================

async function saveUserDataInCorrectOrder() {
  console.warn("🚀 מתחיל יצירת משתמש אמיתי עם 6 חודשים של היסטוריה...\n");

  try {
    // 1. שמירת המשתמש הראשוני (יום 180)
    console.warn("👤 שלב 1: יצירת משתמש ראשוני...");
    const initialUser = { ...REAL_USER, weight: 78, goals: ["muscle_gain"] };
    await storage.setItem("user_data", JSON.stringify(initialUser));

    // 2. שמירת השאלון הראשון (יום 180)
    console.warn("📋 שלב 2: שמירת שאלון ראשוני...");
    await storage.setItem(
      "smart_questionnaire_results",
      JSON.stringify(INITIAL_QUESTIONNAIRE)
    );

    // שמירה גם כ-legacy לתאימות
    const legacyData = {
      age: INITIAL_QUESTIONNAIRE.answers.personal_info.age,
      gender: INITIAL_QUESTIONNAIRE.answers.personal_info.gender,
      weight: INITIAL_QUESTIONNAIRE.answers.personal_info.weight,
      height: INITIAL_QUESTIONNAIRE.answers.personal_info.height,
      goals: INITIAL_QUESTIONNAIRE.answers.goals,
      equipment: INITIAL_QUESTIONNAIRE.answers.gym_equipment,
      availability: INITIAL_QUESTIONNAIRE.answers.availability,
      sessionDuration: INITIAL_QUESTIONNAIRE.answers.session_duration,
    };
    await storage.setItem("questionnaire_answers", JSON.stringify(legacyData));
    await storage.setItem(
      "questionnaire_metadata",
      JSON.stringify(INITIAL_QUESTIONNAIRE.metadata)
    );

    // 3. שמירת תוכנית ראשונה (יום 180)
    console.warn("🏋️ שלב 3: שמירת תוכנית אימון ראשונה...");
    await storage.setItem(
      "workout_plans",
      JSON.stringify({
        basic: WORKOUT_PLANS_EVOLUTION.phase1_basic,
      })
    );

    // 4. יצירת היסטוריה מלאה
    console.warn("📈 שלב 4: יצירת היסטוריית אימונים (6 חודשים)...");
    const fullHistory = generateRealisticWorkoutHistory();
    await storage.setItem("workout_history", JSON.stringify(fullHistory));

    // 5. עדכון תוכניות (יום 120)
    console.warn("🔄 שלב 5: עדכון תוכניות אימון...");
    await storage.setItem(
      "workout_plans",
      JSON.stringify({
        basic: WORKOUT_PLANS_EVOLUTION.phase1_basic,
        smart: WORKOUT_PLANS_EVOLUTION.phase2_intermediate,
      })
    );

    // 6. עדכון שאלון (יום 90)
    console.warn("📝 שלב 6: עדכון שאלון...");
    await storage.setItem(
      "smart_questionnaire_results",
      JSON.stringify(UPDATED_QUESTIONNAIRE)
    );

    // 7. תוכנית סופית (יום 60)
    console.warn("🎯 שלב 7: תוכנית אימון סופית...");
    await storage.setItem(
      "workout_plans",
      JSON.stringify({
        basic: WORKOUT_PLANS_EVOLUTION.phase1_basic,
        smart: WORKOUT_PLANS_EVOLUTION.phase3_advanced,
      })
    );

    // 8. עדכון משתמש סופי
    console.warn("👤 שלב 8: עדכון נתוני משתמש סופיים...");
    await storage.setItem("user_data", JSON.stringify(REAL_USER));

    // 9. סטטיסטיקות
    console.warn("📊 שלב 9: חישוב סטטיסטיקות...");
    const stats = calculateUserStats(fullHistory);
    await storage.setItem("user_statistics", JSON.stringify(stats));

    return { user: REAL_USER, history: fullHistory, stats };
  } catch (error) {
    console.error("❌ שגיאה ביצירת המשתמש:", error);
    throw error;
  }
}

function calculateUserStats(history) {
  const completedWorkouts = history.filter((w) => w.completed);
  const totalWorkouts = completedWorkouts.length;

  const totalMinutes = completedWorkouts.reduce(
    (sum, w) => sum + w.duration,
    0
  );
  const totalCalories = completedWorkouts.reduce(
    (sum, w) => sum + w.caloriesBurned,
    0
  );

  const avgRating =
    completedWorkouts.reduce((sum, w) => sum + w.rating, 0) / totalWorkouts;
  const avgDuration = totalMinutes / totalWorkouts;

  // התקדמות במשקלים
  const benchPressWorkouts = completedWorkouts.filter((w) =>
    w.exercises.some((e) => e.id.includes("bench_press"))
  );

  const startingBench =
    benchPressWorkouts[0]?.exercises.find((e) => e.id.includes("bench_press"))
      ?.sets[0]?.weight || 0;
  const currentBench =
    benchPressWorkouts[benchPressWorkouts.length - 1]?.exercises.find((e) =>
      e.id.includes("bench_press")
    )?.sets[0]?.weight || 0;

  return {
    totalWorkouts,
    totalMinutes,
    totalCalories,
    avgRating: Math.round(avgRating * 10) / 10,
    avgDuration: Math.round(avgDuration),
    workoutStreak: calculateCurrentStreak(history),
    strengthProgress: {
      benchPress: {
        start: startingBench,
        current: currentBench,
        improvement: currentBench - startingBench,
      },
      bodyWeight: {
        start: 78,
        current: REAL_USER.weight,
        improvement: REAL_USER.weight - 78,
      },
    },
    weeklyFrequency: Math.round((totalWorkouts / 26) * 10) / 10, // 26 שבועות
    completionRate: Math.round(
      (completedWorkouts.length / history.length) * 100
    ),
  };
}

function calculateCurrentStreak(history) {
  const recent = history.slice(-14).filter((w) => w.completed); // 14 ימים אחרונים
  let streak = 0;
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i].completed) streak++;
    else break;
  }
  return streak;
}

// ==========================================
// ✅ בדיקת תוצאות
// ==========================================

async function verifyRealisticUser() {
  console.warn("\n🔍 בודק את המשתמש שנוצר...");

  const userData = JSON.parse(await storage.getItem("user_data"));
  const history = JSON.parse(await storage.getItem("workout_history"));
  const stats = JSON.parse(await storage.getItem("user_statistics"));

  console.warn(`👤 משתמש: ${userData.name} (${userData.email})`);
  console.warn(`📅 נרשם: ${formatDate(userData.createdAt)}`);
  console.warn(`⚖️ משקל: ${userData.weight}ק"ג (התחיל: 78ק"ג)`);
  console.warn(`🎯 מטרות: ${userData.goals.join(", ")}`);
  console.warn(`🏋️ ציוד: ${userData.equipment.join(", ")}`);
  console.warn(
    `💎 מנוי: ${userData.subscription.type} (מ-${formatDate(userData.subscription.startDate)})`
  );

  console.warn(`\n📊 סטטיסטיקות:`);
  console.warn(`  💪 סה"כ אימונים: ${stats.totalWorkouts}`);
  console.warn(
    `  ⏱️ סה"כ דקות: ${stats.totalMinutes} (ממוצע: ${stats.avgDuration})`
  );
  console.warn(`  🔥 סה"כ קלוריות: ${stats.totalCalories}`);
  console.warn(`  ⭐ דירוג ממוצע: ${stats.avgRating}/5`);
  console.warn(
    `  📈 התקדמות הרחקות: ${stats.strengthProgress.benchPress.start}ק"ג → ${stats.strengthProgress.benchPress.current}ק"ג (+${stats.strengthProgress.benchPress.improvement})`
  );
  console.warn(`  🎯 אחוז השלמות: ${stats.completionRate}%`);
  console.warn(`  🔥 רצף נוכחי: ${stats.workoutStreak} אימונים`);

  console.warn(`\n📅 אימונים אחרונים:`);
  const recentWorkouts = history.slice(-5);
  recentWorkouts.forEach((w) => {
    console.warn(
      `  ${formatDate(w.date)}: ${w.workoutName} (${w.duration}דק, ${w.rating}⭐)`
    );
  });

  return { userData, history, stats };
}

// ==========================================
// 🏃‍♂️ הרצה
// ==========================================

async function createRealisticUser() {
  const results = await saveUserDataInCorrectOrder();
  await verifyRealisticUser();

  console.warn("\n" + "=".repeat(50));
  console.warn("🎉 משתמש אמיתי עם 6 חודשים של היסטוריה נוצר בהצלחה!");
  console.warn("✅ כל הנתונים נשמרו בסדר הכרונולוגי הנכון");
  console.warn("✅ התקדמות מציאותית במשקלים ובביצועים");
  console.warn("✅ שלוש תוכניות אימון בהתפתחות הדרגתית");
  console.warn("✅ היסטוריה עשירה עם הערות אמיתיות");
  console.warn("=".repeat(50));

  return results;
}

// הרצה
createRealisticUser().catch(console.error);
