/**
 * @file exerciseDatabase.ts
 * @description מאגר תרגילים מקומי דו-לשוני עם סינון מדויק לפי ציוד
 * English: Local bilingual exercise database with precise equipment filtering
 *
 * ✅ תמיכה דו-לשונית מלאה (עברית/אנגלית)
 * ✅ סינון מדויק לפי ציוד זמין
 * ✅ פלייסהולדר למדיה (תמונות וסרטונים)
 * ✅ התאמה לאימוני בית/חדר כושר/חוץ
 */

import { QuickWorkoutTemplate } from "../types";

// =======================================
// 🎯 הרחבת הממשק הקיים
// Extended Interface
// =======================================

/**
 * הרחבת הממשק הקיים עם תכונות דו-לשוניות וסינון מתקדם
 * Extended existing interface with bilingual features and advanced filtering
 */
export interface ExtendedExerciseTemplate extends QuickWorkoutTemplate {
  // תמיכה דו-לשונית בשמות
  nameLocalized: {
    he: string;
    en: string;
  };

  // הוראות מפורטות בשתי שפות
  instructionsLocalized: {
    he: string[];
    en: string[];
  };

  // טיפים לביצוע נכון
  tipsLocalized: {
    he: string[];
    en: string[];
  };

  // אזהרות בטיחות
  safetyNotes: {
    he: string[];
    en: string[];
  };

  // פלייסהולדר למדיה
  media: {
    image: string;
    video: string;
    thumbnail: string;
  };

  // תכונות סינון חכם
  homeCompatible: boolean;
  gymPreferred: boolean;
  outdoorSuitable: boolean;
  spaceRequired: "minimal" | "small" | "medium" | "large";
  noiseLevel: "silent" | "quiet" | "moderate" | "loud";
}

// =======================================
// 🔧 קטגוריות ציוד למיפוי מדויק
// Equipment Categories for Precise Mapping
// =======================================

export const EQUIPMENT_CATEGORIES = {
  BODYWEIGHT: ["none"],
  HOME_BASIC: ["dumbbells", "resistance_bands"],
  HOME_ADVANCED: ["kettlebell", "pull_up_bar", "yoga_mat"],
  GYM_WEIGHTS: ["barbell", "olympic_plates", "squat_rack"],
  GYM_MACHINES: ["cable_machine", "lat_pulldown", "leg_press"],
  OUTDOOR: ["park_bench", "playground"],
  FUNCTIONAL: ["medicine_ball", "battle_ropes", "suspension_trainer"],
} as const;

// =======================================
// 🏋️ מאגר התרגילים הראשי - 10 תרגילים
// Main Exercise Database - 10 Exercises
// =======================================

export const exerciseDatabase: ExtendedExerciseTemplate[] = [
  // =================== משקל גוף ===================
  {
    id: "push_up_1",
    name: "שכיבת סמיכה בסיסית",
    nameLocalized: {
      he: "שכיבת סמיכה בסיסית",
      en: "Basic Push-Up",
    },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: [
      "השתטח על הבטן עם כפות הידיים על הרצפה",
      "שמור על קו ישר מהראש עד הכעבים",
      "הורד את החזה עד 90 מעלות",
      "דחף חזרה למעלה",
    ],
    instructionsLocalized: {
      he: [
        "השתטח על הבטן עם כפות הידיים על הרצפה ברוחב הכתפיים",
        "שמור על קו ישר מהראש עד הכעבים",
        "הורד את החזה לעבר הרצפה עד שהמרפקים ב-90 מעלות",
        "דחף חזרה למעלה לעמדת ההתחלה בכוח",
      ],
      en: [
        "Lie face down with palms on floor shoulder-width apart",
        "Maintain straight line from head to heels",
        "Lower chest toward floor until elbows at 90 degrees",
        "Push back up to starting position with force",
      ],
    },
    tips: ["שמור על הליבה מתוחה", "נשום נכון"],
    tipsLocalized: {
      he: [
        "שמור על שרירי הליבה מתוחים כל הזמן",
        "נשום פנימה בירידה, החוצה בעלייה",
        "אל תתן לירכיים לרדת או להתרומם",
        "התחל על הברכיים אם קשה מדי",
      ],
      en: [
        "Keep core muscles tight throughout",
        "Breathe in going down, out going up",
        "Don't let hips sag or pike up",
        "Start on knees if too difficult",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בכתפיים",
        "אל תכופף את פרקי הידיים יותר מדי",
        "התחל עם מעט חזרות והגדל בהדרגה",
      ],
      en: [
        "Stop if you feel shoulder pain",
        "Don't overextend wrists",
        "Start with few reps and progress gradually",
      ],
    },
    media: {
      image: "exercises/push_up_basic.jpg",
      video: "exercises/push_up_basic.mp4",
      thumbnail: "exercises/push_up_basic_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "squat_bodyweight_1",
    name: "כיפופי ברכיים",
    nameLocalized: {
      he: "כיפופי ברכיים עם משקל גוף",
      en: "Bodyweight Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: [
      "עמוד עם רגליים ברוחב כתפיים",
      "הורד ירכיים אחורה ומטה",
      "רד עד שירכיים במקביל לרצפה",
      "עלה חזרה בכוח",
    ],
    instructionsLocalized: {
      he: [
        "עמוד עם הרגליים ברוחב הכתפיים",
        "הושט ידיים קדימה לאיזון",
        "הורד את הירכיים אחורה ומטה כמו יושב על כיסא",
        "רד עד שהירכיים במקביל לרצפה",
        "דחף דרך העקבים לחזור למעלה",
      ],
      en: [
        "Stand with feet shoulder-width apart",
        "Extend arms forward for balance",
        "Lower hips back and down like sitting in chair",
        "Descend until thighs parallel to floor",
        "Drive through heels to return up",
      ],
    },
    tips: ["שמור על חזה פתוח", "ברכיים עוקבות אחר אצבעות"],
    tipsLocalized: {
      he: [
        "שמור על החזה פתוח והגב ישר",
        "הברכיים צריכות לעקוב אחר כיוון האצבעות",
        "התמקד בהפעלת הישבן",
        "התחל עם עומק קטן והגדל בהדרגה",
      ],
      en: [
        "Keep chest up and back straight",
        "Knees should track over toes",
        "Focus on engaging glutes",
        "Start shallow and increase depth gradually",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברכיים ליפול פנימה",
        "הפסק אם כואב בברכיים או גב",
        "אל תרד מהר מדי",
      ],
      en: [
        "Don't let knees collapse inward",
        "Stop if knees or back hurt",
        "Don't descend too quickly",
      ],
    },
    media: {
      image: "exercises/squat_bodyweight.jpg",
      video: "exercises/squat_bodyweight.mp4",
      thumbnail: "exercises/squat_bodyweight_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "plank_1",
    name: "פלאנק",
    nameLocalized: {
      he: "פלאנק סטנדרטי",
      en: "Standard Plank",
    },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "back"],
    equipment: "none",
    difficulty: "beginner",
    instructions: [
      "רד על מרפקים בעמדת שכיבת סמיכה",
      "שמור קו ישר מראש עד כעבים",
      "הפעל שרירי ליבה",
      "החזק עמדה",
    ],
    instructionsLocalized: {
      he: [
        "התחל בעמדת שכיבת סמיכה ורד על המרפקים",
        "שמור על קו ישר מהראש עד הכעבים",
        "הפעל את שרירי הליבה וחזק אותם",
        "החזק את העמדה למשך הזמן הנדרש",
        "נשום באופן קבוע",
      ],
      en: [
        "Start in push-up position and lower to forearms",
        "Maintain straight line from head to heels",
        "Engage and tighten core muscles",
        "Hold position for required duration",
        "Breathe regularly throughout",
      ],
    },
    tips: ["נשום קבוע", "אל תעצור נשימה"],
    tipsLocalized: {
      he: [
        "נשום באופן קבוע, אל תעצור את הנשימה",
        "התמקד בהפעלת שרירי הבטן העמוקים",
        "שמור על הצוואר במצב נייטרלי",
        "אל תתן לירכיים לרדת",
      ],
      en: [
        "Breathe regularly, don't hold breath",
        "Focus on deep abdominal muscles",
        "Keep neck in neutral position",
        "Don't let hips drop",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בגב תחתון",
        "התחל עם זמנים קצרים",
        "אל תתרומם יותר מדי גבוה",
      ],
      en: [
        "Stop if you feel lower back pain",
        "Start with shorter durations",
        "Don't raise hips too high",
      ],
    },
    media: {
      image: "exercises/plank_standard.jpg",
      video: "exercises/plank_standard.mp4",
      thumbnail: "exercises/plank_standard_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  // =================== עם משקולות ===================
  {
    id: "dumbbell_chest_press_1",
    name: "דחיפת חזה עם משקולות",
    nameLocalized: {
      he: "דחיפת חזה עם משקולות",
      en: "Dumbbell Chest Press",
    },
    category: "strength",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "שכב על גב עם משקולות בידיים",
      "התחל עם משקולות בגובה חזה",
      "דחף כלפי מעלה",
      "הורד בשליטה",
    ],
    instructionsLocalized: {
      he: [
        "שכב על הגב עם משקולות בשתי הידיים",
        "התחל עם המשקולות בגובה החזה, מרפקים כפופים",
        "דחף את המשקולות כלפי מעלה עד זרועות ישרות",
        "הורד בשליטה חזרה לעמדת ההתחלה",
        "שמור על שרירי הליבה מתוחים",
      ],
      en: [
        "Lie on back with dumbbells in both hands",
        "Start with dumbbells at chest level, elbows bent",
        "Press dumbbells up until arms are straight",
        "Lower with control back to starting position",
        "Keep core muscles engaged",
      ],
    },
    tips: ["אל תנעל מרפקים", "שליטה בירידה"],
    tipsLocalized: {
      he: [
        "אל תנעל את המרפקים בחלק העליון",
        "שמור על שליטה מלאה בירידה",
        "המשקולות צריכות לנוע במסלול ישר",
        "התחל עם משקל קל והגדל בהדרגה",
      ],
      en: [
        "Don't lock elbows at the top",
        "Maintain full control on the descent",
        "Dumbbells should move in straight path",
        "Start light and progress gradually",
      ],
    },
    safetyNotes: {
      he: [
        "השתמש במשקולות מתאימות לרמתך",
        "ודא יציבות לפני תחילת התרגיל",
        "בקש עזרה אם המשקל כבד",
      ],
      en: [
        "Use appropriate weight for your level",
        "Ensure stability before starting",
        "Ask for help if weight is heavy",
      ],
    },
    media: {
      image: "exercises/dumbbell_chest_press.jpg",
      video: "exercises/dumbbell_chest_press.mp4",
      thumbnail: "exercises/dumbbell_chest_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_squat_1",
    name: "כיפופי ברכיים עם משקולות",
    nameLocalized: {
      he: "כיפופי ברכיים עם משקולות",
      en: "Dumbbell Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "החזק משקולות בצדי הגוף",
      "עמוד ברוחב כתפיים",
      "רד לכיפוף ברכיים",
      "עלה בכוח",
    ],
    instructionsLocalized: {
      he: [
        "החזק משקולת בכל יד בצדי הגוף",
        "עמוד עם רגליים ברוחב כתפיים",
        "רד לכיפוף ברכיים כמו יושב על כיסא",
        "עלה בכוח דרך העקבים חזרה למעלה",
        "שמור על גב ישר לאורך כל התנועה",
      ],
      en: [
        "Hold one dumbbell in each hand at sides",
        "Stand with feet shoulder-width apart",
        "Squat down like sitting in a chair",
        "Drive up through heels back to standing",
        "Keep back straight throughout movement",
      ],
    },
    tips: ["גב ישר", "משקל על עקבים"],
    tipsLocalized: {
      he: [
        "שמור על הגב ישר והחזה פתוח",
        "רוב המשקל על העקבים",
        "המשקולות נשארות בצדי הגוף",
        "אל תתן לברכיים ליפול פנימה",
      ],
      en: [
        "Keep back straight and chest up",
        "Most weight should be on heels",
        "Dumbbells stay at sides of body",
        "Don't let knees collapse inward",
      ],
    },
    safetyNotes: {
      he: [
        "התחל עם משקולות קלות",
        "הפסק אם כואב בגב או ברכיים",
        "ודא אחיזה יציבה של המשקולות",
      ],
      en: [
        "Start with light dumbbells",
        "Stop if back or knees hurt",
        "Ensure secure grip on dumbbells",
      ],
    },
    media: {
      image: "exercises/dumbbell_squat.jpg",
      video: "exercises/dumbbell_squat.mp4",
      thumbnail: "exercises/dumbbell_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  // =================== אלסטיים ===================
  {
    id: "resistance_band_row_1",
    name: "משיכה עם גומי התנגדות",
    nameLocalized: {
      he: "משיכה עם גומי התנגדות",
      en: "Resistance Band Row",
    },
    category: "strength",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "shoulders"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: [
      "עגן את הגומי לנקודה יציבה",
      "יש ברגליים מעט כפופות",
      "משוך הגומי לעבר הבטן",
      "חזור בשליטה",
    ],
    instructionsLocalized: {
      he: [
        "עגן את גומי ההתנגדות לנקודה יציבה בגובה החזה",
        "עמוד עם רגליים מעט כפופות לייצב",
        "אחוז בקצות הגומי ומשוך לעבר הבטן",
        "חזור בשליטה לעמדת ההתחלה",
        "שמור על כתפיים למטה ואחורה",
      ],
      en: [
        "Anchor resistance band to stable point at chest height",
        "Stand with knees slightly bent for stability",
        "Grip band ends and pull toward abdomen",
        "Return with control to starting position",
        "Keep shoulders down and back",
      ],
    },
    tips: ["כתפיים אחורה", "שליטה בחזרה"],
    tipsLocalized: {
      he: [
        "שמור על הכתפיים למטה ואחורה",
        "שליטה מלאה בתנועת החזרה",
        "הפעל את שרירי הגב, לא הזרועות",
        "ודא שהגומי מעוגן היטב",
      ],
      en: [
        "Keep shoulders down and back",
        "Full control on return movement",
        "Use back muscles, not just arms",
        "Ensure band is securely anchored",
      ],
    },
    safetyNotes: {
      he: ["בדוק שהגומי לא קרוע", "ודא עיגון יציב", "אל תשחרר פתאום"],
      en: [
        "Check band isn't torn",
        "Ensure stable anchoring",
        "Don't release suddenly",
      ],
    },
    media: {
      image: "exercises/resistance_band_row.jpg",
      video: "exercises/resistance_band_row.mp4",
      thumbnail: "exercises/resistance_band_row_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "silent",
  },

  // =================== תרגילי גמישות ===================
  {
    id: "child_pose_1",
    name: "תנוחת הילד",
    nameLocalized: {
      he: "תנוחת הילד",
      en: "Child's Pose",
    },
    category: "flexibility",
    primaryMuscles: ["back"],
    secondaryMuscles: ["shoulders", "hips"],
    equipment: "none",
    difficulty: "beginner",
    instructions: [
      "רד לכריעה על הברכיים",
      "ישב על עקבים",
      "השתטח קדימה עם ידיים מושטות",
      "נשום עמוק",
    ],
    instructionsLocalized: {
      he: [
        "רד לכריעה על הברכיים ברוחב הירכיים",
        "ישב בחזרה על העקבים",
        "השתטח קדימה עם הידיים מושטות לפנים",
        "הנח את המצח על הרצפה",
        "נשום עמוק והרגע",
      ],
      en: [
        "Kneel down with knees hip-width apart",
        "Sit back on your heels",
        "Fold forward with arms extended in front",
        "Rest forehead on the floor",
        "Breathe deeply and relax",
      ],
    },
    tips: ["נשום עמוק", "הרגע"],
    tipsLocalized: {
      he: [
        "נשום עמוק ואיטי",
        "הרגע את כל הגוף",
        "אם קשה לשבת על עקבים - שים כרית",
        "החזק לפחות 30 שניות",
      ],
      en: [
        "Breathe deeply and slowly",
        "Relax entire body",
        "Use pillow between calves and thighs if needed",
        "Hold for at least 30 seconds",
      ],
    },
    safetyNotes: {
      he: [
        "אל תכפה אם כואב בברכיים",
        "עצור אם מרגיש חוסר נוחות",
        "התאם לגמישות שלך",
      ],
      en: [
        "Don't force if knees hurt",
        "Stop if feeling discomfort",
        "Adapt to your flexibility",
      ],
    },
    media: {
      image: "exercises/child_pose.jpg",
      video: "exercises/child_pose.mp4",
      thumbnail: "exercises/child_pose_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },

  // =================== תרגילי קרדיו ===================
  {
    id: "jumping_jacks_1",
    name: "קפיצות פתיחה",
    nameLocalized: {
      he: "קפיצות פתיחה וסגירה",
      en: "Jumping Jacks",
    },
    category: "cardio",
    primaryMuscles: ["legs"],
    secondaryMuscles: ["shoulders", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: [
      "עמוד זקוף עם רגליים צמודות",
      "קפוץ ופתח רגליים ברוחב כתפיים",
      "הרם ידיים מעל הראש",
      "קפוץ חזרה לעמדת התחלה",
    ],
    instructionsLocalized: {
      he: [
        "עמוד זקוף עם רגליים צמודות וידיים בצדי הגוף",
        "קפוץ ופתח את הרגליים ברוחב הכתפיים",
        "בו זמנית הרם את הידיים מעל הראש",
        "קפוץ שוב וחזור לעמדת ההתחלה",
        "חזור במהירות קבועה",
      ],
      en: [
        "Stand upright with feet together and arms at sides",
        "Jump and spread feet to shoulder-width apart",
        "Simultaneously raise arms overhead",
        "Jump again and return to starting position",
        "Repeat at steady pace",
      ],
    },
    tips: ["קצב קבוע", "נחיתה רכה"],
    tipsLocalized: {
      he: [
        "שמור על קצב קבוע ומתמיד",
        "נחיתה רכה על כרית כף הרגל",
        "שמור על הליבה מתוחה",
        "אם קשה - הליכה במקום עם הרמת ידיים",
      ],
      en: [
        "Maintain steady, consistent pace",
        "Land softly on balls of feet",
        "Keep core engaged",
        "If difficult - march in place with arm raises",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בברכיים",
        "התחל לאט והגדל עצימות",
        "ודא משטח יציב",
      ],
      en: [
        "Stop if you feel knee pain",
        "Start slow and increase intensity",
        "Ensure stable surface",
      ],
    },
    media: {
      image: "exercises/jumping_jacks.jpg",
      video: "exercises/jumping_jacks.mp4",
      thumbnail: "exercises/jumping_jacks_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },

  // =================== תרגיל מתקדם ===================
  {
    id: "burpee_1",
    name: "ברפי",
    nameLocalized: {
      he: "ברפי מלא",
      en: "Full Burpee",
    },
    category: "cardio",
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["core", "shoulders"],
    equipment: "none",
    difficulty: "advanced",
    instructions: [
      "עמוד זקוף",
      "רד לכיפוף ברכיים ושים ידיים ברצפה",
      "קפוץ לעמדת פלאנק",
      "בצע שכיבת סמיכה",
    ],
    instructionsLocalized: {
      he: [
        "עמוד זקוף עם רגליים ברוחב כתפיים",
        "רד לכיפוף ברכיים ושים את הידיים על הרצפה",
        "קפוץ עם הרגליים אחורה לעמדת פלאנק",
        "בצע שכיבת סמיכה אחת",
        "קפוץ עם הרגליים קדימה לכיפוף ברכיים",
        "קפוץ למעלה עם הידיים מעל הראש",
      ],
      en: [
        "Stand upright with feet shoulder-width apart",
        "Squat down and place hands on floor",
        "Jump feet back into plank position",
        "Perform one push-up",
        "Jump feet forward back to squat",
        "Jump up with arms overhead",
      ],
    },
    tips: ["התחל לאט", "נשים נכון"],
    tipsLocalized: {
      he: [
        "התחל לאט ובצע בטכניקה נכונה",
        "נשים לאורך כל התרגיל",
        "אם קשה - בצע ללא קפיצה בסוף",
        "מותר להליכה במקום קפיצה",
      ],
      en: [
        "Start slow with proper technique",
        "Breathe throughout entire exercise",
        "If difficult - skip final jump",
        "Can step instead of jumping",
      ],
    },
    safetyNotes: {
      he: [
        "תרגיל מתקדם - התחל עם גרסה מקלה",
        "הפסק אם מרגיש סחרחורת",
        "ודא משטח לא חלק",
      ],
      en: [
        "Advanced exercise - start with easier version",
        "Stop if feeling dizzy",
        "Ensure non-slip surface",
      ],
    },
    media: {
      image: "exercises/burpee_full.jpg",
      video: "exercises/burpee_full.mp4",
      thumbnail: "exercises/burpee_full_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "loud",
  },

  // =================== תרגילי גב וביצפס נוספים ===================
  {
    id: "dumbbell_row_1",
    name: "חתירה עם משקולת",
    nameLocalized: {
      he: "חתירה עם משקולת אחת",
      en: "Single Dumbbell Row",
    },
    category: "strength",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "shoulders"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "העמד רגל אחת על ספסל",
      "החזק משקולת ביד הנגדית",
      "משוך המשקולת לעבר הבטן",
      "הורד בשליטה",
    ],
    instructionsLocalized: {
      he: [
        "העמד רגל אחת על ספסל או משטח גבוה",
        "החזק משקולת ביד הנגדית",
        "השען עם היד החופשית על הספסל",
        "משוך את המשקולת לעבר הבטן",
        "הורד בשליטה חזרה למטה",
      ],
      en: [
        "Place one foot on bench or elevated surface",
        "Hold dumbbell in opposite hand",
        "Support with free hand on bench",
        "Pull dumbbell toward abdomen",
        "Lower with control back down",
      ],
    },
    tips: ["גב ישר", "משוך עם הגב"],
    tipsLocalized: {
      he: [
        "שמור על הגב ישר לאורך התנועה",
        "משוך עם שרירי הגב, לא הזרוע",
        "הרגש את הכתף נסחבת אחורה",
        "אל תסובב את הגוף",
      ],
      en: [
        "Keep back straight throughout movement",
        "Pull with back muscles, not arm",
        "Feel shoulder blade pulling back",
        "Don't rotate torso",
      ],
    },
    safetyNotes: {
      he: [
        "וודא יציבות לפני תחילה",
        "התחל עם משקל קל",
        "הפסק אם כואב בגב תחתון",
      ],
      en: [
        "Ensure stability before starting",
        "Start with light weight",
        "Stop if lower back hurts",
      ],
    },
    media: {
      image: "exercises/dumbbell_row.jpg",
      video: "exercises/dumbbell_row.mp4",
      thumbnail: "exercises/dumbbell_row_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_bicep_curl_1",
    name: "כיפופי ביצפס עם משקולות",
    nameLocalized: {
      he: "כיפופי ביצפס עם משקולות",
      en: "Dumbbell Bicep Curls",
    },
    category: "strength",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions: [
      "עמוד עם משקולות בידיים",
      "ידיים בצדי הגוף",
      "כופף זרועות למעלה",
      "הורד בשליטה",
    ],
    instructionsLocalized: {
      he: [
        "עמוד זקוף עם משקולת בכל יד",
        "ידיים בצדי הגוף, כפות הידיים קדימה",
        "כופף את הזרועות ומעלה את המשקולות לכתפיים",
        "הורד בשליטה חזרה למטה",
        "שמור על מרפקים קרוב לגוף",
      ],
      en: [
        "Stand upright with dumbbell in each hand",
        "Arms at sides, palms facing forward",
        "Curl weights up toward shoulders",
        "Lower with control back down",
        "Keep elbows close to body",
      ],
    },
    tips: ["מרפקים יציבים", "תנועה מבוקרת"],
    tipsLocalized: {
      he: [
        "שמור על המרפקים יציבים בצדי הגוף",
        "תנועה מבוקרת למעלה ולמטה",
        "אל תנופף או תעזור עם הגוף",
        "התמקד על הביצפס",
      ],
      en: [
        "Keep elbows stable at sides",
        "Controlled movement up and down",
        "Don't swing or use body momentum",
        "Focus on bicep contraction",
      ],
    },
    safetyNotes: {
      he: ["התחל עם משקל קל", "אל תנעל מרפקים בתחתית", "הפסק אם כואב במרפק"],
      en: [
        "Start with light weight",
        "Don't lock elbows at bottom",
        "Stop if elbow hurts",
      ],
    },
    media: {
      image: "exercises/dumbbell_bicep_curl.jpg",
      video: "exercises/dumbbell_bicep_curl.mp4",
      thumbnail: "exercises/dumbbell_bicep_curl_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_shoulder_press_1",
    name: "דחיפת כתפיים עם משקולות",
    nameLocalized: {
      he: "דחיפת כתפיים עם משקולות",
      en: "Dumbbell Shoulder Press",
    },
    category: "strength",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "עמוד עם משקולות בגובה כתפיים",
      "דחף למעלה מעל הראש",
      "הורד בשליטה",
      "חזור על התנועה",
    ],
    instructionsLocalized: {
      he: [
        "עמוד זקוף עם משקולת בכל יד בגובה הכתפיים",
        "כפות הידיים פונות קדימה",
        "דחף את המשקולות ישר למעלה מעל הראש",
        "הורד בשליטה חזרה לגובה הכתפיים",
        "שמור על הליבה מתוחה",
      ],
      en: [
        "Stand upright with dumbbell in each hand at shoulder height",
        "Palms facing forward",
        "Press dumbbells straight up overhead",
        "Lower with control back to shoulder height",
        "Keep core engaged",
      ],
    },
    tips: ["מסלול ישר", "ליבה מתוחה"],
    tipsLocalized: {
      he: [
        "משקולות נעות במסלול ישר למעלה ולמטה",
        "שמור על הליבה מתוחה כל הזמן",
        "אל תנעל מרפקים למעלה",
        "נשום החוצה בדחיפה למעלה",
      ],
      en: [
        "Dumbbells move in straight path up and down",
        "Keep core tight throughout",
        "Don't lock elbows at top",
        "Exhale when pressing up",
      ],
    },
    safetyNotes: {
      he: [
        "התחל עם משקל קל יותר מדחיפת חזה",
        "הפסק אם כואב בכתף",
        "ודא גמישות טובה בכתפיים",
      ],
      en: [
        "Start lighter than chest press weight",
        "Stop if shoulder hurts",
        "Ensure good shoulder mobility",
      ],
    },
    media: {
      image: "exercises/dumbbell_shoulder_press.jpg",
      video: "exercises/dumbbell_shoulder_press.mp4",
      thumbnail: "exercises/dumbbell_shoulder_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_tricep_extension_1",
    name: "הרחבת טריצפס עם משקולת",
    nameLocalized: {
      he: "הרחבת טריצפס עם משקולת",
      en: "Dumbbell Tricep Extension",
    },
    category: "strength",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["shoulders"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: [
      "החזק משקולת אחת בשתי ידיים מעל הראש",
      "הורד אחורה מאחרי הראש",
      "הרם חזרה למעלה",
      "שמור מרפקים קבועים",
    ],
    instructionsLocalized: {
      he: [
        "עמוד או שב עם משקולת אחת בשתי הידיים מעל הראש",
        "אחוז במשקולת בחלק העליון עם כפות הידיים",
        "הורד את המשקולת אחורה מאחרי הראש",
        "הרם חזרה למעלה בתנועה מבוקרת",
        "שמור על המרפקים קבועים וקרוב לראש",
      ],
      en: [
        "Stand or sit with one dumbbell held overhead with both hands",
        "Grip top of dumbbell with palms",
        "Lower weight behind head",
        "Raise back up in controlled motion",
        "Keep elbows fixed and close to head",
      ],
    },
    tips: ["מרפקים קבועים", "תנועה איטית"],
    tipsLocalized: {
      he: [
        "שמור על המרפקים קבועים וקרוב לראש",
        "תנועה איטית ומבוקרת",
        "התמקד על הטריצפס",
        "אל תיתן למרפקים להתרחב החוצה",
      ],
      en: [
        "Keep elbows fixed and close to head",
        "Slow and controlled movement",
        "Focus on tricep engagement",
        "Don't let elbows flare out",
      ],
    },
    safetyNotes: {
      he: [
        "התחל עם משקל קל",
        "הפסק אם כואב במרפק או כתף",
        "ודא אחיזה בטוחה של המשקולת",
      ],
      en: [
        "Start with light weight",
        "Stop if elbow or shoulder hurts",
        "Ensure secure grip on dumbbell",
      ],
    },
    media: {
      image: "exercises/dumbbell_tricep_extension.jpg",
      video: "exercises/dumbbell_tricep_extension.mp4",
      thumbnail: "exercises/dumbbell_tricep_extension_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },
];

// =======================================
// 🎯 פונקציות סינון חכמות
// Smart Filtering Functions
// =======================================

/**
 * מחזיר תרגילי משקל גוף בלבד
 * Returns bodyweight exercises only
 */
export function getBodyweightExercises(): ExtendedExerciseTemplate[] {
  return exerciseDatabase.filter((exercise) => exercise.equipment === "none");
}

/**
 * מחזיר תרגילים עם משקולות
 * Returns dumbbell exercises
 */
export function getDumbbellExercises(): ExtendedExerciseTemplate[] {
  return exerciseDatabase.filter(
    (exercise) => exercise.equipment === "dumbbells"
  );
}

/**
 * סינון תרגילים לפי ציוד זמין
 * Filter exercises by available equipment
 */
export function filterExercisesByEquipment(
  availableEquipment: string[]
): ExtendedExerciseTemplate[] {
  if (availableEquipment.length === 0) {
    // אם אין ציוד - רק תרגילי משקל גוף
    return getBodyweightExercises();
  }

  return exerciseDatabase.filter(
    (exercise) =>
      exercise.equipment === "none" ||
      availableEquipment.includes(exercise.equipment)
  );
}

/**
 * סינון חכם לפי סביבת אימון וציוד - הפונקציה המרכזית!
 * Smart filtering by workout environment and equipment - Main function!
 *
 * @param environments - סביבות אימון: 'home', 'gym', 'outdoor'
 * @param equipment - ציוד זמין
 * @returns תרגילים מתאימים
 */
export function getSmartFilteredExercises(
  environments: ("home" | "gym" | "outdoor")[],
  equipment: string[]
): ExtendedExerciseTemplate[] {
  // אם המשתמש בחר רק "בית" ואין ציוד - רק תרגילי משקל גוף
  if (environments.includes("home") && equipment.length === 0) {
    return exerciseDatabase.filter(
      (exercise) => exercise.homeCompatible && exercise.equipment === "none"
    );
  }

  // אם המשתמש בחר "בית" עם ציוד ספציפי
  if (environments.includes("home") && equipment.length > 0) {
    return exerciseDatabase.filter(
      (exercise) =>
        exercise.homeCompatible &&
        (exercise.equipment === "none" ||
          equipment.includes(exercise.equipment))
    );
  }

  // סינון כללי לפי סביבות וציוד
  return exerciseDatabase.filter((exercise) => {
    // בדיקת התאמה לסביבה
    const environmentMatch = environments.some((env) => {
      switch (env) {
        case "home":
          return exercise.homeCompatible;
        case "gym":
          return exercise.gymPreferred;
        case "outdoor":
          return exercise.outdoorSuitable;
        default:
          return true;
      }
    });

    // בדיקת זמינות ציוד
    const equipmentMatch =
      equipment.length === 0
        ? exercise.equipment === "none"
        : exercise.equipment === "none" ||
          equipment.includes(exercise.equipment);

    return environmentMatch && equipmentMatch;
  });
}

/**
 * קבלת תרגילים לפי רמת קושי
 * Get exercises by difficulty level
 */
export function getExercisesByDifficulty(
  level: "beginner" | "intermediate" | "advanced"
): ExtendedExerciseTemplate[] {
  return exerciseDatabase.filter((exercise) => exercise.difficulty === level);
}

/**
 * קבלת תרגילים לפי קטגוריה
 * Get exercises by category
 */
export function getExercisesByCategory(
  category: string
): ExtendedExerciseTemplate[] {
  return exerciseDatabase.filter((exercise) => exercise.category === category);
}

/**
 * חיפוש תרגילים לפי קבוצת שרירים
 * Search exercises by muscle group
 */
export function getExercisesByMuscleGroup(
  muscleGroup: string
): ExtendedExerciseTemplate[] {
  return exerciseDatabase.filter(
    (exercise) =>
      exercise.primaryMuscles.includes(muscleGroup) ||
      (exercise.secondaryMuscles &&
        exercise.secondaryMuscles.includes(muscleGroup))
  );
}

/**
 * חיפוש תרגילים שקטים לדירה
 * Get quiet exercises for apartment
 */
export function getQuietExercises(): ExtendedExerciseTemplate[] {
  return exerciseDatabase.filter(
    (exercise) =>
      exercise.noiseLevel === "silent" || exercise.noiseLevel === "quiet"
  );
}

/**
 * חיפוש תרגילים שדורשים מעט מקום
 * Get exercises requiring minimal space
 */
export function getMinimalSpaceExercises(): ExtendedExerciseTemplate[] {
  return exerciseDatabase.filter(
    (exercise) =>
      exercise.spaceRequired === "minimal" || exercise.spaceRequired === "small"
  );
}

// =======================================
// 🔄 תמיכה לאחור - Backward Compatibility
// =======================================

/**
 * יצוא במבנה הישן לשמירה על תאימות
 * Export in old structure for compatibility
 */
export const exercises = exerciseDatabase.map((exercise) => ({
  id: exercise.id,
  name: exercise.nameLocalized.he,
  english_name: exercise.nameLocalized.en,
  category: exercise.category,
  primaryMuscles: exercise.primaryMuscles,
  secondaryMuscles: exercise.secondaryMuscles,
  equipment: exercise.equipment,
  difficulty: exercise.difficulty,
  instructions: exercise.instructionsLocalized.he,
  tips: exercise.tipsLocalized.he,
}));

// =======================================
// 📊 סטטיסטיקות מאגר
// Database Statistics
// =======================================

/**
 * קבלת סטטיסטיקות מאגר התרגילים
 * Get exercise database statistics
 */
export function getDatabaseStats() {
  const total = exerciseDatabase.length;
  const byCategory = exerciseDatabase.reduce(
    (acc, ex) => {
      acc[ex.category] = (acc[ex.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byDifficulty = exerciseDatabase.reduce(
    (acc, ex) => {
      acc[ex.difficulty] = (acc[ex.difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byEquipment = exerciseDatabase.reduce(
    (acc, ex) => {
      acc[ex.equipment] = (acc[ex.equipment] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total,
    byCategory,
    byDifficulty,
    byEquipment,
    homeCompatible: exerciseDatabase.filter((ex) => ex.homeCompatible).length,
    gymPreferred: exerciseDatabase.filter((ex) => ex.gymPreferred).length,
    outdoorSuitable: exerciseDatabase.filter((ex) => ex.outdoorSuitable).length,
    quiet: exerciseDatabase.filter(
      (ex) => ex.noiseLevel === "silent" || ex.noiseLevel === "quiet"
    ).length,
  };
}

export default exerciseDatabase;
