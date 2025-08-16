require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function updateWorkoutPlansWithDetails() {
  console.log("🔧 משדרג תוכניות אימון עם פרטים מלאים...");

  // 🏋️ בנק תרגילים מפורט
  const detailedExercises = {
    lose_weight: {
      home_bodyweight: [
        {
          name: "Burpees",
          reps: "8-12",
          sets: 3,
          type: "cardio",
          targetMuscles: ["כל הגוף"],
          equipment: [],
          tips: ["שמור על קצב קבוע", "נשום נכון"],
          rest: 45,
        },
        {
          name: "Mountain Climbers",
          reps: "20-30",
          sets: 3,
          type: "cardio",
          targetMuscles: ["core", "רגליים"],
          equipment: [],
          tips: ["שמור על גב ישר", "תנועה מהירה"],
          rest: 30,
        },
        {
          name: "Jump Squats",
          reps: "12-15",
          sets: 3,
          type: "cardio",
          targetMuscles: ["רגליים", "עכוז"],
          equipment: [],
          tips: ["נחת בעדינות", "כופף ברכיים"],
          rest: 60,
        },
      ],
      home_equipment: [
        {
          name: "Dumbbell Thrusters",
          reps: "10-12",
          sets: 3,
          type: "strength",
          targetMuscles: ["כתפיים", "רגליים"],
          equipment: ["משקולות"],
          tips: ["תנועה מלאה", "שמור על יציבות"],
          rest: 60,
        },
        {
          name: "Resistance Band Rows",
          reps: "12-15",
          sets: 3,
          type: "strength",
          targetMuscles: ["גב", "ביצפס"],
          equipment: ["רצועות התנגדות"],
          tips: ["משוך עד הסוף", "שמור על יציבה"],
          rest: 45,
        },
      ],
      gym: [
        {
          name: "Treadmill Intervals",
          reps: "5 מחזורים",
          sets: 1,
          type: "cardio",
          targetMuscles: ["רגליים", "לב"],
          equipment: ["הליכון"],
          tips: ["החלף בין מהיר לאיטי", "שמור על קצב נשימה"],
          rest: 0,
        },
        {
          name: "Cable Machine Circuits",
          reps: "12-15",
          sets: 3,
          type: "strength",
          targetMuscles: ["כל הגוף"],
          equipment: ["מכונת כבלים"],
          tips: ["מעבר מהיר בין תרגילים", "שמור על טכניקה"],
          rest: 30,
        },
      ],
    },
    build_muscle: {
      home_bodyweight: [
        {
          name: "Push-up Variations",
          reps: "8-12",
          sets: 4,
          type: "strength",
          targetMuscles: ["חזה", "טריצפס"],
          equipment: [],
          tips: ["שמור על גב ישר", "תנועה מלאה"],
          rest: 90,
        },
        {
          name: "Pistol Squats",
          reps: "5-8",
          sets: 3,
          type: "strength",
          targetMuscles: ["רגליים", "core"],
          equipment: [],
          tips: ["שמור על איזון", "ירידה מבוקרת"],
          rest: 120,
        },
      ],
      home_equipment: [
        {
          name: "Dumbbell Rows",
          reps: "8-12",
          sets: 4,
          type: "strength",
          targetMuscles: ["גב", "ביצפס"],
          equipment: ["משקולות"],
          tips: ["משוך עד הצלעות", "שמור על גב ישר"],
          rest: 90,
        },
        {
          name: "Goblet Squats",
          reps: "10-15",
          sets: 4,
          type: "strength",
          targetMuscles: ["רגליים", "עכוז"],
          equipment: ["משקולות"],
          tips: ["ירידה עמוקה", "שמור על חזה גבוה"],
          rest: 90,
        },
      ],
      gym: [
        {
          name: "Barbell Bench Press",
          reps: "6-8",
          sets: 4,
          type: "strength",
          targetMuscles: ["חזה", "טריצפס", "כתפיים"],
          equipment: ["ברבל", "ספסל"],
          tips: ["תנועה מבוקרת", "נגיעה קלה לחזה"],
          rest: 120,
        },
        {
          name: "Barbell Squats",
          reps: "8-10",
          sets: 4,
          type: "strength",
          targetMuscles: ["רגליים", "עכוז"],
          equipment: ["ברבל", "rack"],
          tips: ["ירידה מתחת לברכיים", "דחיפה דרך עקבים"],
          rest: 150,
        },
        {
          name: "Deadlifts",
          reps: "5-6",
          sets: 3,
          type: "strength",
          targetMuscles: ["גב", "רגליים", "core"],
          equipment: ["ברבל"],
          tips: ["שמור על גב ישר", "דחיפה דרך עקבים"],
          rest: 180,
        },
      ],
    },
    general_fitness: {
      home_bodyweight: [
        {
          name: "Bodyweight Squats",
          reps: "12-15",
          sets: 3,
          type: "strength",
          targetMuscles: ["רגליים", "עכוז"],
          equipment: [],
          tips: ["ירידה מבוקרת", "שמור על ברכיים מעל אצבעות"],
          rest: 60,
        },
        {
          name: "Push-ups",
          reps: "8-12",
          sets: 3,
          type: "strength",
          targetMuscles: ["חזה", "טריצפס"],
          equipment: [],
          tips: ["שמור על גב ישר", "תנועה מלאה"],
          rest: 60,
        },
        {
          name: "Jumping Jacks",
          reps: "20-30",
          sets: 3,
          type: "cardio",
          targetMuscles: ["כל הגוף"],
          equipment: [],
          tips: ["שמור על קצב קבוע", "נחיתה על כפות רגליים"],
          rest: 30,
        },
        {
          name: "Plank",
          reps: "30-60 שניות",
          sets: 2,
          type: "core",
          targetMuscles: ["core", "כתפיים"],
          equipment: [],
          tips: ["שמור על גב ישר", "אל תעכב נשימה"],
          rest: 60,
        },
      ],
      home_equipment: [
        {
          name: "Dumbbell Squats",
          reps: "10-12",
          sets: 3,
          type: "strength",
          targetMuscles: ["רגליים", "עכוז"],
          equipment: ["משקולות"],
          tips: ["שמור על חזה גבוה", "ירידה מבוקרת"],
          rest: 60,
        },
        {
          name: "Resistance Band Pull-aparts",
          reps: "12-15",
          sets: 3,
          type: "strength",
          targetMuscles: ["גב", "כתפיים"],
          equipment: ["רצועות התנגדות"],
          tips: ["משוך לפירוק מלא", "שמור על כתפיים למטה"],
          rest: 45,
        },
      ],
      gym: [
        {
          name: "Lat Pulldown",
          reps: "10-12",
          sets: 3,
          type: "strength",
          targetMuscles: ["גב", "ביצפס"],
          equipment: ["מכונת lat pulldown"],
          tips: ["משוך עד החזה", "שמור על גב ישר"],
          rest: 60,
        },
        {
          name: "Leg Press",
          reps: "12-15",
          sets: 3,
          type: "strength",
          targetMuscles: ["רגליים", "עכוז"],
          equipment: ["מכונת leg press"],
          tips: ["ירידה מבוקרת", "דחיפה דרך עקבים"],
          rest: 60,
        },
      ],
    },
  };

  function createDetailedWorkouts(exercises, goal, location) {
    return [
      {
        id: `workout-1-${Date.now()}`,
        name: "אימון יום א",
        day: 1,
        goal: `אימון ${goal === "lose_weight" ? "ירידה במשקל" : goal === "build_muscle" ? "בניית שריר" : "כושר כללי"}`,
        exercises: exercises.slice(0, 2),
        duration: goal === "build_muscle" ? 45 : 30,
        type: goal === "lose_weight" ? "cardio" : "strength",
      },
      {
        id: `workout-2-${Date.now() + 1}`,
        name: "אימון יום ג",
        day: 3,
        goal: `אימון ${goal === "lose_weight" ? "ירידה במשקל" : goal === "build_muscle" ? "בניית שריר" : "כושר כללי"}`,
        exercises: exercises.slice(1, 3),
        duration: goal === "build_muscle" ? 45 : 30,
        type: "mixed",
      },
      {
        id: `workout-3-${Date.now() + 2}`,
        name: "אימון יום ה",
        day: 5,
        goal: `אימון ${goal === "lose_weight" ? "ירידה במשקל" : goal === "build_muscle" ? "בניית שריר" : "כושר כללי"}`,
        exercises: exercises.slice(2),
        duration: goal === "build_muscle" ? 50 : 35,
        type: goal === "lose_weight" ? "cardio" : "strength",
      },
    ];
  }

  try {
    // קבל כל המשתמשים
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, smartquestionnairedata, workoutplans");

    if (error) {
      console.error("❌ שגיאה בקריאת משתמשים:", error);
      return;
    }

    console.log(`📋 נמצאו ${users.length} משתמשים לעדכון`);

    let updated = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const questionnaire = user.smartquestionnairedata || {};
        const goal = questionnaire.fitness_goal || "general_fitness";
        const location = questionnaire.workout_location || "home_bodyweight";

        const exercises =
          detailedExercises[goal]?.[location] ||
          detailedExercises.general_fitness.home_bodyweight;
        const workouts = createDetailedWorkouts(exercises, goal, location);

        // עדכן את התוכניות עם הפרטים המלאים
        const updatedPlans = {
          ...user.workoutplans,
          basicPlan: {
            ...user.workoutplans?.basicPlan,
            workouts: workouts,
          },
          smartPlan: {
            ...user.workoutplans?.smartPlan,
            workouts: [
              ...workouts,
              {
                id: `ai-bonus-${Date.now()}`,
                name: "אימון AI מיוחד",
                day: 7,
                goal: "התאוששות חכמה",
                exercises: [
                  {
                    name: "AI Recovery Stretch",
                    reps: "5-10 דקות",
                    sets: 1,
                    type: "recovery",
                    targetMuscles: ["כל הגוף"],
                    equipment: [],
                    tips: ["הקשב לגוף", "נשימה עמוקה"],
                    rest: 0,
                  },
                ],
                duration: 15,
                type: "recovery",
              },
            ],
          },
          lastUpdated: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from("users")
          .update({ workoutplans: updatedPlans })
          .eq("id", user.id);

        if (updateError) {
          console.error(`❌ שגיאה בעדכון ${user.name}:`, updateError.message);
          failed++;
        } else {
          console.log(`✅ עודכן: ${user.name}`);
          updated++;
        }
      } catch (userError) {
        console.error(`❌ שגיאה במשתמש ${user.name}:`, userError.message);
        failed++;
      }
    }

    console.log(`\n📊 סיכום:`);
    console.log(`✅ עודכנו בהצלחה: ${updated}`);
    console.log(`❌ נכשלו: ${failed}`);
    console.log(`📊 סה"כ: ${users.length}`);
  } catch (error) {
    console.error("❌ שגיאה כללית:", error.message);
  }
}

updateWorkoutPlansWithDetails();
