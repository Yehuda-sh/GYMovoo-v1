/**
 * @file israeli_military.ts
 * @description תרגילים ישראליים וצבאיים
 * Israeli military exercises
 */

import { Exercise } from "./types";

export const israeliMilitaryExercises: Exercise[] = [
  {
    id: "israeli_pushup_1",
    name: "שכיבת סמיכה צבאית",
    nameLocalized: {
      he: "שכיבת סמיכה צבאית",
      en: "Military Push-Up",
    },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "השתטח על הבטן עם כפות הידיים ברוחב הכתפיים",
        "שמור על גוף ישר מהראש עד הרגליים",
        "הורד את החזה עד שנוגע ברצפה",
        "דחף מעלה בכוח עד לזרועות מתוחות",
        "ביצוע מדויק לפי תקנות צה''ל",
      ],
      en: [
        "Lie face down with palms shoulder-width apart",
        "Keep body straight from head to feet",
        "Lower chest until touching floor",
        "Push up powerfully to arms extended",
        "Precise execution per IDF standards",
      ],
    },
    tips: {
      he: [
        "אין כיפוף בירכיים או גב",
        "ירידה מלאה עד המחייה",
        "עלייה חזקה ומהירה",
        "נשימה מבוקרת",
      ],
      en: [
        "No bending at hips or back",
        "Full descent until chest touches",
        "Strong and fast ascent",
        "Controlled breathing",
      ],
    },
    safetyNotes: {
      he: [
        "שמור על פורמה נכונה גם בעייפות",
        "עצור אם יש כאב במפרקים",
        "התקדם בהדרגה במספר החזרות",
      ],
      en: [
        "Maintain proper form even when tired",
        "Stop if joint pain occurs",
        "Progress gradually in repetitions",
      ],
    },
    media: {
      image: "/images/israeli_military_pushup.jpg",
      video: "/videos/israeli_military_pushup.mp4",
      thumbnail: "/images/israeli_military_pushup_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "gaza_situp_1",
    name: "בטן ''ג'אזא''",
    nameLocalized: {
      he: "בטן ''ג'אזא''",
      en: "Gaza Sit-Up",
    },
    category: "strength",
    primaryMuscles: ["core"],
    secondaryMuscles: ["hips"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "שכב על הגב עם ברכיים כפופות",
        "ידיים מתחת לראש או על החזה",
        "עלה עד שהמרפקים נוגעים בברכיים",
        "רד בשליטה למצב התחלה",
        "ביצוע מהיר ומדויק",
      ],
      en: [
        "Lie on back with knees bent",
        "Hands behind head or on chest",
        "Rise until elbows touch knees",
        "Lower controlled to start position",
        "Fast and precise execution",
      ],
    },
    tips: {
      he: [
        "אל תמשוך בצוואר",
        "עבוד עם שרירי הבטן",
        "שמור על נשימה קבועה",
        "קצב מהיר אבל מבוקר",
      ],
      en: [
        "Don't pull on neck",
        "Work with abdominal muscles",
        "Maintain steady breathing",
        "Fast but controlled pace",
      ],
    },
    safetyNotes: {
      he: [
        "עצור אם יש כאב בגב התחתון",
        "אל תעשה על משטח קשה מדי",
        "התחל עם מספר קטן של חזרות",
      ],
      en: [
        "Stop if lower back pain occurs",
        "Don't do on too hard surface",
        "Start with small number of repetitions",
      ],
    },
    media: {
      image: "/images/gaza_situp.jpg",
      video: "/videos/gaza_situp.mp4",
      thumbnail: "/images/gaza_situp_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "combat_fitness_1",
    name: "כושר קרבי",
    nameLocalized: {
      he: "כושר קרבי",
      en: "Combat Fitness",
    },
    category: "cardio",
    primaryMuscles: ["quadriceps", "glutes", "calves"],
    secondaryMuscles: ["core", "shoulders"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: [
        "רצי במקום עם הרמת ברכיים גבוה",
        "עבור לכפיפות מהירות",
        "חזור לריצה במקום",
        "שלב קפיצות במקום",
        "סיבוב של 3-4 דקות ללא הפסקה",
      ],
      en: [
        "Run in place with high knee raises",
        "Switch to fast squats",
        "Return to running in place",
        "Include jumping in place",
        "3-4 minute rounds without rest",
      ],
    },
    tips: {
      he: [
        "שמור על קצב גבוה",
        "נשימה עמוקה ומבוקרת",
        "שנה תרגילים כל 30 שניות",
        "דחף את הגבולות",
      ],
      en: [
        "Maintain high pace",
        "Deep, controlled breathing",
        "Change exercises every 30 seconds",
        "Push the limits",
      ],
    },
    safetyNotes: {
      he: [
        "תרגיל אינטנסיבי - התחל בהדרגה",
        "עצור אם מרגיש סחרחורת",
        "שתה מים לפני ואחרי",
      ],
      en: [
        "Intense exercise - start gradually",
        "Stop if feeling dizzy",
        "Drink water before and after",
      ],
    },
    media: {
      image: "/images/combat_fitness.jpg",
      video: "/videos/combat_fitness.mp4",
      thumbnail: "/images/combat_fitness_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
  {
    id: "zahal_burpee_1",
    name: "ברפי צה''לי",
    nameLocalized: {
      he: "ברפי צה''לי",
      en: "IDF Burpee",
    },
    category: "cardio",
    primaryMuscles: ["quadriceps", "chest", "shoulders"],
    secondaryMuscles: ["core", "triceps"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים ברוחב הכתפיים",
        "רד לכפיפה ושים ידיים על הרצפה",
        "קפוץ לעמדת פלאנק",
        "בצע שכיבת סמיכה אחת",
        "קפוץ רגליים חזרה לכפיפה ואז למעלה עם קפיצה",
      ],
      en: [
        "Stand upright with feet shoulder-width apart",
        "Squat down and place hands on floor",
        "Jump to plank position",
        "Perform one push-up",
        "Jump feet back to squat then up with jump",
      ],
    },
    tips: {
      he: [
        "שמור על קצב קבוע",
        "כל תנועה חייבת להיות מלאה",
        "נשום בין החזרות",
        "דיוק לפני מהירות",
      ],
      en: [
        "Maintain steady pace",
        "Every movement must be complete",
        "Breathe between repetitions",
        "Accuracy before speed",
      ],
    },
    safetyNotes: {
      he: [
        "תרגיל מאוד אינטנסיבי",
        "התחל עם 5-10 חזרות",
        "עצור אם יש כאב חד",
        "חמם היטב לפני התרגיל",
      ],
      en: [
        "Very intensive exercise",
        "Start with 5-10 repetitions",
        "Stop if sharp pain occurs",
        "Warm up well before exercise",
      ],
    },
    media: {
      image: "/images/zahal_burpee.jpg",
      video: "/videos/zahal_burpee.mp4",
      thumbnail: "/images/zahal_burpee_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "moderate",
  },
];
