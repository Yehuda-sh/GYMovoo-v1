import { Exercise } from "./types";

export const bodyweightExercises: Exercise[] = [
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
    instructions: {
      he: [
        "השתטח על הבטן עם כפות הידיים על הרצפה ברוחב הכתפיים",
        "שמור על קו ישר מהראש עד העקבים",
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
    tips: {
      he: [
        "שמור על שרירי הליבה מתוחים כל הזמן",
        "נשם פנימה בירידה, החוצה בעלייה",
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
    secondaryMuscles: ["calves", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד עם הרגליים ברוחב הכתפיים",
        "שמור על החזה זקוף והמבט קדימה",
        "רד בישיבה כאילו אתה יושב על כיסא",
        "רד עד שהירכיים מקבילות לרצפה",
        "עלה חזרה בכוח דחיפה דרך העקבים",
      ],
      en: [
        "Stand with feet shoulder-width apart",
        "Keep chest up and look forward",
        "Lower down as if sitting on a chair",
        "Go down until thighs parallel to floor",
        "Rise back up by pushing through heels",
      ],
    },
    tips: {
      he: [
        "שמור על הברכיים מעל האצבעות",
        "אל תתן לברכיים להתכופף פנימה",
        "שמור על הגב ישר לאורך כל התרגיל",
        "נשם פנימה בירידה, החוצה בעלייה",
      ],
      en: [
        "Keep knees above toes",
        "Don't let knees cave inward",
        "Maintain straight back throughout",
        "Breathe in going down, out going up",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בברכיים",
        "התחל בעומק חלקי והגדל בהדרגה",
        "שמור על שליטה באופן התנועה",
      ],
      en: [
        "Stop if you feel knee pain",
        "Start with partial depth and progress",
        "Maintain control of the movement",
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
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "plank_1",
    name: "פלאנק",
    nameLocalized: {
      he: "תמיכה על המרפקים",
      en: "Plank",
    },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "glutes"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "שכב על הבטן ותמוך על המרפקים וקצות האצבעות",
        "שמור על קו ישר מהראש עד העקבים",
        "הדק את שרירי הבטן והעכוז",
        "החזק את העמדה בלי לזוז",
      ],
      en: [
        "Lie face down, support on elbows and toes",
        "Maintain straight line from head to heels",
        "Tighten abs and glutes",
        "Hold position without movement",
      ],
    },
    tips: {
      he: [
        "אל תתן לירכיים לרדת או להתרומם",
        "נשם באופן רגיל לאורך כל התרגיל",
        "תתמקד בשמירה על יציבות הליבה",
        "התחל עם זמנים קצרים והאריך בהדרגה",
      ],
      en: [
        "Don't let hips sag or pike up",
        "Breathe normally throughout",
        "Focus on maintaining core stability",
        "Start with short times and progress",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בגב התחתון",
        "שמור על צוואר ניטרלי",
        "התחל עם 20-30 שניות והגדל בהדרגה",
      ],
      en: [
        "Stop if you feel lower back pain",
        "Keep neck neutral",
        "Start with 20-30 seconds and progress",
      ],
    },
    media: {
      image: "exercises/plank.jpg",
      video: "exercises/plank.mp4",
      thumbnail: "exercises/plank_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "lunges_bodyweight_1",
    name: "פיצוצים",
    nameLocalized: {
      he: "פיצוצים עם משקל גוף",
      en: "Bodyweight Lunges",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["calves", "core"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "עמוד זקוף עם הרגליים ברוחב הירכיים",
        "צעד צעד גדול קדימה עם רגל אחת",
        "הורד את הגוף עד ששתי הברכיים ב-90 מעלות",
        "דחף חזרה לעמדת ההתחלה",
        "חזור על התנועה עם הרגל השנייה",
      ],
      en: [
        "Stand upright with feet hip-width apart",
        "Take a large step forward with one leg",
        "Lower body until both knees at 90 degrees",
        "Push back to starting position",
        "Repeat with other leg",
      ],
    },
    tips: {
      he: [
        "שמור על הגו זקוף לאורך כל התנועה",
        "אל תתן לברך הקדמית לעבור מעל האצבעות",
        "הברך האחורית צריכה לגעת כמעט ברצפה",
        "שמור על שיווי משקל יציב",
      ],
      en: [
        "Keep torso upright throughout movement",
        "Don't let front knee go past toes",
        "Back knee should nearly touch floor",
        "Maintain stable balance",
      ],
    },
    safetyNotes: {
      he: [
        "התחל בצעדים קצרים יותר",
        "שמור על שליטה בתנועה",
        "הפסק אם מרגיש כאב בברכיים",
      ],
      en: [
        "Start with shorter steps",
        "Maintain movement control",
        "Stop if you feel knee pain",
      ],
    },
    media: {
      image: "exercises/lunges_bodyweight.jpg",
      video: "exercises/lunges_bodyweight.mp4",
      thumbnail: "exercises/lunges_bodyweight_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },

  {
    id: "mountain_climbers_1",
    name: "מטפסי הרים",
    nameLocalized: {
      he: "מטפסי הרים",
      en: "Mountain Climbers",
    },
    category: "cardio",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "quadriceps"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "התחל בעמדת שכיבת סמיכה",
        "הבא ברך אחת לעבר החזה",
        "החלף במהירות את הרגליים",
        "שמור על העליון יציב",
        "המשך להחליף ברצף מהיר",
      ],
      en: [
        "Start in push-up position",
        "Bring one knee toward chest",
        "Quickly switch legs",
        "Keep upper body stable",
        "Continue alternating rapidly",
      ],
    },
    tips: {
      he: [
        "שמור על הגב ישר",
        "אל תתן לירכיים להתרומם",
        "נשם באופן קצבי",
        "התחל בקצב איטי והגדל בהדרגה",
      ],
      en: [
        "Keep back straight",
        "Don't let hips rise up",
        "Breathe rhythmically",
        "Start slow and build speed",
      ],
    },
    safetyNotes: {
      he: [
        "התחל עם זמנים קצרים",
        "שמור על צורה נכונה מעל מהירות",
        "הפסק אם מרגיש עייפות יתר",
      ],
      en: [
        "Start with short durations",
        "Prioritize form over speed",
        "Stop if feeling overly fatigued",
      ],
    },
    media: {
      image: "exercises/mountain_climbers.jpg",
      video: "exercises/mountain_climbers.mp4",
      thumbnail: "exercises/mountain_climbers_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },

  {
    id: "burpees_1",
    name: "ברפיז",
    nameLocalized: {
      he: "ברפיז",
      en: "Burpees",
    },
    category: "cardio",
    primaryMuscles: ["core", "quadriceps", "chest"],
    secondaryMuscles: ["shoulders", "glutes", "triceps"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: [
        "התחל בעמידה",
        "כרע והנח את הידיים על הרצפה",
        "קפוץ לעמדת שכיבת סמיכה",
        "בצע שכיבת סמיכה אחת",
        "קפוץ חזרה לכריעה",
        "קפוץ מעלה עם הידיים למעלה",
      ],
      en: [
        "Start standing",
        "Squat down and place hands on floor",
        "Jump to push-up position",
        "Perform one push-up",
        "Jump back to squat",
        "Jump up with hands overhead",
      ],
    },
    tips: {
      he: [
        "שמור על קצב קבוע",
        "תתמקד בצורה נכונה",
        "נשם בעמקות",
        "התחל עם מעט חזרות",
      ],
      en: [
        "Maintain steady pace",
        "Focus on proper form",
        "Breathe deeply",
        "Start with few reps",
      ],
    },
    safetyNotes: {
      he: [
        "תרגיל עתיר עומס - התחל בזהירות",
        "הפסק אם מרגיש חולשה או סחרחורת",
        "התחמם היטב לפני הביצוע",
      ],
      en: [
        "High-intensity exercise - start carefully",
        "Stop if feeling weakness or dizziness",
        "Warm up well before performing",
      ],
    },
    media: {
      image: "exercises/burpees.jpg",
      video: "exercises/burpees.mp4",
      thumbnail: "exercises/burpees_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
];

export default bodyweightExercises;
