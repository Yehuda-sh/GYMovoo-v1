/**
 * @file scripts/generateDemoData.js
 * @description יצירת נתוני דמו ריאליסטיים דרך השירותים הקיימים במערכת
 * @usage node scripts/generateDemoData.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// Mock services - נשתמש בלוגיקה של השירותים האמיתיים
const DEMO_USERS = {
  FREE: {
    id: "u_init_1",
    name: "Ron Shoval",
    email: "ron.shoval@example.com",
    subscriptionType: "free",
    workoutCount: 3,
    daysBack: 7,
  },
  TRIAL: {
    id: "realistic_1755276001521_ifig7z",
    name: "נועה שפירא",
    email: "noa.shapira.updated@walla.com",
    subscriptionType: "trial",
    workoutCount: 7,
    daysBack: 14,
  },
  PREMIUM: {
    id: "u_init_3",
    name: "Amit Cohen",
    email: "amit.cohen@example.com",
    subscriptionType: "premium",
    workoutCount: 15,
    daysBack: 30,
  },
};

/**
 * יצירת אימון ריאליסטי בפורמט המערכת
 */
function generateRealisticWorkout(userId, workoutIndex, daysBack) {
  const workoutDate = new Date();
  workoutDate.setDate(
    workoutDate.getDate() - Math.floor(Math.random() * daysBack)
  );

  const workoutTemplates = [
    {
      name: "אימון כוח עליון",
      exercises: [
        {
          name: "לחיצת חזה",
          equipment: "dumbbells",
          sets: 3,
          targetReps: 10,
          targetWeight: 15,
        },
        {
          name: "משיכת גב",
          equipment: "dumbbells",
          sets: 3,
          targetReps: 12,
          targetWeight: 12,
        },
        {
          name: "לחיצת כתפיים",
          equipment: "dumbbells",
          sets: 3,
          targetReps: 8,
          targetWeight: 8,
        },
        {
          name: "כיפופי זרועות",
          equipment: "dumbbells",
          sets: 3,
          targetReps: 12,
          targetWeight: 10,
        },
      ],
    },
    {
      name: "אימון רגליים",
      exercises: [
        {
          name: "סקוואט",
          equipment: "bodyweight",
          sets: 4,
          targetReps: 15,
          targetWeight: 0,
        },
        {
          name: "לונג'ים",
          equipment: "dumbbells",
          sets: 3,
          targetReps: 12,
          targetWeight: 8,
        },
        {
          name: "העלאת חזה",
          equipment: "bodyweight",
          sets: 3,
          targetReps: 12,
          targetWeight: 0,
        },
        {
          name: "הרמת שוקיים",
          equipment: "dumbbells",
          sets: 3,
          targetReps: 15,
          targetWeight: 12,
        },
      ],
    },
    {
      name: "אימון גוף מלא",
      exercises: [
        {
          name: "בורפי",
          equipment: "bodyweight",
          sets: 3,
          targetReps: 8,
          targetWeight: 0,
        },
        {
          name: "שכיבות סמיכה",
          equipment: "bodyweight",
          sets: 3,
          targetReps: 10,
          targetWeight: 0,
        },
        {
          name: "פלאנק",
          equipment: "bodyweight",
          sets: 3,
          targetReps: 30,
          targetWeight: 0,
        },
        {
          name: "קפיצות כוכב",
          equipment: "bodyweight",
          sets: 3,
          targetReps: 20,
          targetWeight: 0,
        },
      ],
    },
  ];

  const template = workoutTemplates[workoutIndex % workoutTemplates.length];
  const duration = 35 + Math.floor(Math.random() * 20); // 35-55 דקות

  // יצירת תרגילים עם סטים מושלמים
  const exercises = template.exercises.map((ex, index) => {
    const sets = [];
    for (let i = 0; i < ex.sets; i++) {
      const actualReps = ex.targetReps + Math.floor(Math.random() * 3) - 1; // ±1 חזרה
      const actualWeight = ex.targetWeight + Math.floor(Math.random() * 3) - 1; // ±1 ק"ג

      sets.push({
        id: `set_${index}_${i}`,
        type: "working",
        targetReps: ex.targetReps,
        targetWeight: ex.targetWeight,
        actualReps: Math.max(1, actualReps),
        actualWeight: Math.max(0, actualWeight),
        completed: true,
        restTime: 60 + Math.floor(Math.random() * 30), // 60-90 שניות מנוחה
        timeToComplete: 45 + Math.floor(Math.random() * 30), // 45-75 שניות לביצוע
      });
    }

    return {
      id: `exercise_${Date.now()}_${index}`,
      name: ex.name,
      category: ex.name.includes("רגל")
        ? "legs"
        : ex.name.includes("חזה")
          ? "chest"
          : "general",
      primaryMuscles: [ex.name.includes("רגל") ? "רגליים" : "גוף עליון"],
      equipment: ex.equipment,
      sets: sets,
    };
  });

  const totalVolume = exercises.reduce((total, ex) => {
    return (
      total +
      ex.sets.reduce((exTotal, set) => {
        return exTotal + set.actualWeight * set.actualReps;
      }, 0)
    );
  }, 0);

  const workoutData = {
    id: `workout_${Date.now()}_${workoutIndex}`,
    name: template.name,
    startTime: workoutDate.toISOString(),
    endTime: new Date(
      workoutDate.getTime() + duration * 60 * 1000
    ).toISOString(),
    duration: duration * 60, // שניות
    exercises: exercises,
    totalVolume: totalVolume,
    totalSets: exercises.reduce((total, ex) => total + ex.sets.length, 0),
    completedSets: exercises.reduce(
      (total, ex) => total + ex.sets.filter((s) => s.completed).length,
      0
    ),
  };

  // יצירת משוב ריאליסטי
  const feedback = {
    workoutId: workoutData.id,
    completedAt: workoutData.endTime,
    difficulty: 2 + Math.floor(Math.random() * 3), // 2-4 (קל עד קשה)
    enjoyment: 3 + Math.floor(Math.random() * 3), // 3-5 (בינוני עד מעולה)
    fatigue: 2 + Math.floor(Math.random() * 3), // 2-4
    muscleGroups: exercises.map((ex) => ex.primaryMuscles[0]),
    notes: `אימון ${template.name} - הרגשתי ${["טוב", "מעולה", "חזק", "מאומץ"][Math.floor(Math.random() * 4)]}`,
  };

  // יצירת סטטיסטיקות
  const stats = {
    duration: duration * 60,
    totalSets: workoutData.totalSets,
    completedSets: workoutData.completedSets,
    totalVolume: totalVolume,
    completedExercises: exercises.length,
    averageRestTime: 75,
    caloriesBurned: Math.floor(duration * 8), // הערכה של 8 קלוריות לדקה
  };

  return {
    id: workoutData.id,
    workout: workoutData,
    feedback: feedback,
    stats: stats,
  };
}

/**
 * יצירת נתוני גיימיפיקציה בהתאם לאימונים
 */
function generateGamificationState(workouts, userType) {
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => sum + w.stats.totalVolume, 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.stats.duration, 0);

  // חישוב XP בהתאם לביצועים
  const baseXP = totalWorkouts * 50; // 50 XP לאימון
  const volumeXP = Math.floor(totalVolume / 100); // 1 XP לכל 100 ק"ג נפח
  const durationXP = Math.floor(totalDuration / 3600); // 1 XP לכל שעה

  const totalXP = baseXP + volumeXP + durationXP;
  const level = Math.floor(totalXP / 500) + 1; // כל 500 XP = רמה חדשה

  return {
    level: level,
    experience_points: totalXP,
    workouts_completed: totalWorkouts,
    total_volume: totalVolume,
    total_duration_minutes: Math.floor(totalDuration / 60),
    current_streak: Math.min(totalWorkouts, 7), // מקסימום רצף של שבוע
    longest_streak: totalWorkouts,
    achievements_count: Math.min(Math.floor(totalWorkouts / 2), 10),
    last_workout_date:
      workouts[0]?.workout.startTime || new Date().toISOString(),
  };
}

/**
 * יצירת הישגים בהתאם לפעילות
 */
function generateAchievements(workouts, gamificationState) {
  const achievements = [];

  // הישגים בסיסיים
  achievements.push({
    id: 1,
    type: "questionnaire_complete",
    title: "השלמת שאלון",
    description: "השלמת השאלון הראשוני",
    unlocked_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: "basic",
  });

  // הישגי כמות
  if (workouts.length >= 3) {
    achievements.push({
      id: 2,
      type: "first_workouts",
      title: "צעדים ראשונים",
      description: "השלמת 3 אימונים ראשונים",
      unlocked_at: workouts[2]?.workout.endTime,
      category: "quantity",
    });
  }

  if (workouts.length >= 7) {
    achievements.push({
      id: 3,
      type: "consistent_week",
      title: "שבוע עקבי",
      description: "השלמת 7 אימונים",
      unlocked_at: workouts[6]?.workout.endTime,
      category: "streak",
    });
  }

  if (workouts.length >= 15) {
    achievements.push({
      id: 4,
      type: "dedicated_trainer",
      title: "מתאמן מסור",
      description: "השלמת 15 אימונים",
      unlocked_at: workouts[14]?.workout.endTime,
      category: "quantity",
    });
  }

  // הישגי נפח
  if (gamificationState.total_volume >= 1000) {
    achievements.push({
      id: 5,
      type: "volume_milestone",
      title: "אלף קילו",
      description: 'השגת נפח כולל של 1000 ק"ג',
      unlocked_at: workouts[Math.floor(workouts.length / 2)]?.workout.endTime,
      category: "performance",
    });
  }

  return achievements;
}

/**
 * יצירת נתוני training stats מתקדמים
 */
function generateTrainingStats(workouts, userType) {
  if (workouts.length === 0) {
    return {
      workoutsCompleted: 0,
      currentFitnessLevel: "beginner",
      preferredWorkoutDuration: 45,
      averageIntensity: 0,
      lastWorkoutDate: null,
    };
  }

  const avgDuration =
    workouts.reduce((sum, w) => sum + w.stats.duration, 0) /
    workouts.length /
    60;
  const avgVolume =
    workouts.reduce((sum, w) => sum + w.stats.totalVolume, 0) / workouts.length;

  // קביעת רמת כושר על בסיס נתונים
  let fitnessLevel = "beginner";
  if (workouts.length >= 10 && avgVolume > 500) {
    fitnessLevel = "intermediate";
  }
  if (workouts.length >= 20 && avgVolume > 800) {
    fitnessLevel = "advanced";
  }

  return {
    workoutsCompleted: workouts.length,
    currentFitnessLevel: fitnessLevel,
    preferredWorkoutDuration: Math.round(avgDuration),
    averageIntensity: Math.min(10, Math.floor(avgVolume / 100)),
    totalVolume: workouts.reduce((sum, w) => sum + w.stats.totalVolume, 0),
    totalDuration: workouts.reduce((sum, w) => sum + w.stats.duration, 0),
    averageRating:
      workouts.reduce((sum, w) => sum + w.feedback.enjoyment, 0) /
      workouts.length,
    lastWorkoutDate: workouts[0]?.workout.startTime,
    progressionRate: userType === "premium" ? "adaptive" : "linear",
    strengthGains:
      userType === "premium"
        ? {
            "לחיצת חזה": 15.5,
            סקוואט: 22.3,
            "משיכת גב": 12.8,
          }
        : {},
  };
}

/**
 * עדכון משתמש עם נתוני דמו
 */
async function updateUserWithDemoData(userConfig) {
  console.log(
    `\n🔄 יוצר נתוני דמו עבור ${userConfig.name} (${userConfig.subscriptionType.toUpperCase()})...`
  );

  try {
    // יצירת אימונים
    const workouts = [];
    for (let i = 0; i < userConfig.workoutCount; i++) {
      const workout = generateRealisticWorkout(
        userConfig.id,
        i,
        userConfig.daysBack
      );
      workouts.push(workout);
    }

    // סידור כרונולוגי (הכי חדש ראשון)
    workouts.sort(
      (a, b) =>
        new Date(b.workout.startTime).getTime() -
        new Date(a.workout.startTime).getTime()
    );

    // יצירת נתוני גיימיפיקציה
    const gamificationState = generateGamificationState(
      workouts,
      userConfig.subscriptionType
    );

    // יצירת הישגים
    const achievements = generateAchievements(workouts, gamificationState);

    // יצירת training stats
    const trainingStats = generateTrainingStats(
      workouts,
      userConfig.subscriptionType
    );

    // עדכון subscription status
    const subscription =
      userConfig.subscriptionType !== "free"
        ? {
            type: userConfig.subscriptionType,
            status: "active",
            startDate: new Date(
              Date.now() - 15 * 24 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date(
              Date.now() + 15 * 24 * 60 * 60 * 1000
            ).toISOString(),
          }
        : null;

    // עדכון בסיס הנתונים
    const updateData = {
      activityhistory: workouts, // היסטוריית אימונים מלאה
      trainingstats: trainingStats, // נתוני אימון מעודכנים
      subscription: subscription, // מצב מנוי
      currentstats: {
        gamification: gamificationState,
        achievements: achievements,
        lastUpdated: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userConfig.id);

    if (error) {
      console.error(`❌ שגיאה בעדכון ${userConfig.name}:`, error.message);
      return false;
    }

    console.log(
      `✅ ${userConfig.name}: ${workouts.length} אימונים, ${achievements.length} הישגים, רמה ${gamificationState.level}`
    );

    // סיכום פרטים
    console.log(`   📊 נפח כולל: ${trainingStats.totalVolume}ק"ג`);
    console.log(
      `   ⏱️ זמן כולל: ${Math.floor(trainingStats.totalDuration / 3600)}:${Math.floor((trainingStats.totalDuration % 3600) / 60)} שעות`
    );
    console.log(`   🏆 רמת כושר: ${trainingStats.currentFitnessLevel}`);
    console.log(`   🔥 רצף נוכחי: ${gamificationState.current_streak} ימים`);

    return true;
  } catch (error) {
    console.error(`❌ שגיאה כללית בעדכון ${userConfig.name}:`, error);
    return false;
  }
}

/**
 * הרצת תהליך יצירת נתוני הדמו
 */
async function generateAllDemoData() {
  console.log("🎯 יצירת נתוני דמו ריאליסטיים באמצעות השירותים הקיימים");
  console.log("=" * 60);

  const results = [];

  for (const [userType, userConfig] of Object.entries(DEMO_USERS)) {
    const success = await updateUserWithDemoData(userConfig);
    results.push({ userType, success, name: userConfig.name });
  }

  console.log("\n📋 סיכום תוצאות:");
  console.log("=" * 30);

  results.forEach((result) => {
    const status = result.success ? "✅ הצליח" : "❌ נכשל";
    console.log(`${result.userType}: ${result.name} - ${status}`);
  });

  const successCount = results.filter((r) => r.success).length;

  if (successCount === results.length) {
    console.log("\n🎉 כל נתוני הדמו נוצרו בהצלחה!");
    console.log("\n📌 עכשיו ניתן לבדוק:");
    console.log("- Ron Shoval (Free): 3 אימונים בסיסיים");
    console.log("- נועה שפירא (Trial): 7 אימונים עם גיימיפיקציה");
    console.log("- Amit Cohen (Premium): 15 אימונים עם ניתוחים מתקדמים");
  } else {
    console.log(`\n⚠️ ${successCount}/${results.length} משתמשים עודכנו בהצלחה`);
  }
}

// הרצה
generateAllDemoData()
  .then(() => {
    console.log("\n✅ תהליך יצירת נתוני הדמו הושלם!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ שגיאה בתהליך יצירת נתוני הדמו:", error);
    process.exit(1);
  });
