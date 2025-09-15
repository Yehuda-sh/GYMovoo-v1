/**
 * @file kettlebells.ts
 * @description תרגילי קטלבל
 * Kettlebell exercises
 */

import { Exercise } from "./types";

export const kettlebellExercises: Exercise[] = [
  {
    id: "kettlebell_swing_1",
    name: "נדנוד קטלבל",
    nameLocalized: {
      he: "נדנוד קטלבל",
      en: "Kettlebell Swing",
    },
    category: "strength",
    primaryMuscles: ["glutes", "hamstrings", "core"],
    secondaryMuscles: ["shoulders", "back"],
    equipment: "kettlebell",
    difficulty: "intermediate",
    instructions: {
      he: [
        "עמוד עם רגליים פתוחות ברוחב הכתפיים",
        "אחז בקטלבל בשתי ידיים מול הגוף",
        "התחל בכפיפת ירכיים ושלח את הקטלבל אחורה בין הרגליים",
        "הפעל כוח עם הירכיים ושלח את הקטלבל למעלה עד גובה הכתפיים",
        "שלוט בירידה וחזור לתנועה",
      ],
      en: [
        "Stand with feet shoulder-width apart",
        "Hold kettlebell with both hands in front of body",
        "Start with hip hinge and send kettlebell back between legs",
        "Drive with hips and swing kettlebell up to shoulder height",
        "Control the descent and repeat movement",
      ],
    },
    tips: {
      he: [
        "התנועה צריכה לבוא מהירכיים, לא מהכתפיים",
        "שמור על גב ישר לאורך כל התנועה",
        "התנשם החוצה כשדוחף את הקטלבל מעלה",
      ],
      en: [
        "Movement should come from hips, not shoulders",
        "Keep back straight throughout movement",
        "Exhale when driving kettlebell up",
      ],
    },
    safetyNotes: {
      he: [
        "התחל עם משקל קל עד שתשלוט על הטכניקה",
        "אל תעקם את הגב במהלך התנועה",
        "ודא שיש מקום מספק סביבך",
      ],
      en: [
        "Start with light weight until technique is mastered",
        "Don't round the back during movement",
        "Ensure adequate space around you",
      ],
    },
    media: {
      image: "/images/kettlebell_swing.jpg",
      video: "/videos/kettlebell_swing.mp4",
      thumbnail: "/images/kettlebell_swing_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "moderate",
  },
  {
    id: "kettlebell_goblet_squat_1",
    name: "כפיפה עם קטלבל",
    nameLocalized: {
      he: "כפיפה עם קטלבל",
      en: "Kettlebell Goblet Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core", "calves"],
    equipment: "kettlebell",
    difficulty: "beginner",
    instructions: {
      he: [
        "אחז בקטלבל קרוב לחזה עם שתי ידיים",
        "עמוד עם רגליים ברוחב הכתפיים",
        "רד לכפיפה עמוקה עם שמירה על גב ישר",
        "עלה חזרה לעמדת התחלה בכוח",
      ],
      en: [
        "Hold kettlebell close to chest with both hands",
        "Stand with feet shoulder-width apart",
        "Lower into deep squat maintaining straight back",
        "Drive back up to starting position",
      ],
    },
    tips: {
      he: [
        "שמור על המשקל קרוב לגוף",
        "הברכיים צריכות לכוון באותו כיוון כמו הבהונות",
        "רד עמוק ככל שמאפשרת הגמישות",
      ],
      en: [
        "Keep weight close to body",
        "Knees should track in same direction as toes",
        "Descend as deep as flexibility allows",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברכיים להתכופף פנימה",
        "שמור על מבט קדימה",
        "התחל עם משקל קל",
      ],
      en: [
        "Don't let knees cave inward",
        "Keep gaze forward",
        "Start with light weight",
      ],
    },
    media: {
      image: "/images/kettlebell_goblet_squat.jpg",
      video: "/videos/kettlebell_goblet_squat.mp4",
      thumbnail: "/images/kettlebell_goblet_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },
  {
    id: "kettlebell_turkish_getup_1",
    name: "קימה טורקית עם קטלבל",
    nameLocalized: {
      he: "קימה טורקית עם קטלבל",
      en: "Turkish Get-Up",
    },
    category: "strength",
    primaryMuscles: ["core", "shoulders"],
    secondaryMuscles: ["quadriceps", "glutes"],
    equipment: "kettlebell",
    difficulty: "advanced",
    instructions: {
      he: [
        "התחל שכוב על הגב עם הקטלבל ביד ימין",
        "כופף את הרגל הימנית ושלח יד שמאל הצידה",
        "התגלגל אל הצד השמאלי ותמוך על המרפק",
        "המשך לעמוד בהדרגה תוך שמירה על הקטלבל למעלה",
        "חזור באותו דרך להתחלה",
      ],
      en: [
        "Start lying on back with kettlebell in right hand",
        "Bend right leg and extend left arm to side",
        "Roll to left side and support on elbow",
        "Continue to stand gradually keeping kettlebell up",
        "Return same way to start",
      ],
    },
    tips: {
      he: [
        "תרגיל מורכב - התחל ללא משקל",
        "שמור מבט על הקטלבל לאורך כל התנועה",
        "עבוד לאט ובשליטה",
      ],
      en: [
        "Complex exercise - start without weight",
        "Keep eyes on kettlebell throughout movement",
        "Work slowly and controlled",
      ],
    },
    safetyNotes: {
      he: [
        "שלוט בטכניקה לפני הוספת משקל",
        "עבוד על משטח יציב",
        "התחל עם מדריך אם אפשר",
      ],
      en: [
        "Master technique before adding weight",
        "Work on stable surface",
        "Start with instructor if possible",
      ],
    },
    media: {
      image: "/images/turkish_getup.jpg",
      video: "/videos/turkish_getup.mp4",
      thumbnail: "/images/turkish_getup_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "large",
    noiseLevel: "quiet",
  },
  {
    id: "kettlebell_snatch_1",
    name: "חטיפה עם קטלבל",
    nameLocalized: {
      he: "חטיפה עם קטלבל",
      en: "Kettlebell Snatch",
    },
    category: "strength",
    primaryMuscles: ["shoulders", "back", "quadriceps"],
    secondaryMuscles: ["core"],
    equipment: "kettlebell",
    difficulty: "advanced",
    instructions: {
      he: [
        "עמוד עם רגליים ברוחב הכתפיים",
        "אחז בקטלבל ביד אחת",
        "התחל עם נדנוד ואז משוך את הקטלבל מעלה בתנועה רציפה",
        "סובב את פרק היד ותפוס את הקטלבל מעל הראש",
        "הורד בשליטה",
      ],
      en: [
        "Stand with feet shoulder-width apart",
        "Hold kettlebell in one hand",
        "Start with swing then pull kettlebell up in fluid motion",
        "Rotate wrist and catch kettlebell overhead",
        "Lower with control",
      ],
    },
    tips: {
      he: [
        "תרגיל מאוד מתקדם - דרוש אימון רב",
        "התחל עם משקל קל מאוד",
        "עבוד על קואורדינציה לפני כוח",
      ],
      en: [
        "Very advanced exercise - requires extensive training",
        "Start with very light weight",
        "Work on coordination before power",
      ],
    },
    safetyNotes: {
      he: [
        "לא מתאים למתחילים",
        "דרוש הדרכה מקצועית",
        "שמור על מרחק מאנשים אחרים",
      ],
      en: [
        "Not suitable for beginners",
        "Professional instruction required",
        "Keep distance from other people",
      ],
    },
    media: {
      image: "/images/kettlebell_snatch.jpg",
      video: "/videos/kettlebell_snatch.mp4",
      thumbnail: "/images/kettlebell_snatch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "large",
    noiseLevel: "moderate",
  },
];
