/**
 * @file resistanceBands.ts
 * @description תרגילי גומי התנגדות מעודכנים ונקיים
 * Resistance band exercises - updated and cleaned
 *
 * @updated 2025-09-14 - Removed duplicates, improved data consistency
 * @exercises 10 high-quality resistance band exercises
 * @features Complete instructions, tips, safety notes for each exercise
 */

import { Exercise } from "./types";

export const resistanceBandExercises: Exercise[] = [
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
    instructions: {
      he: [
        "עגן את גומי ההתנגדות לנקודה יציבה בגובה החזה",
        "עמוד עם רגליים מעט כפופות לייצב",
        "אחוז בקצות הגומי ומשוך לעבר הבטן",
        "חזור בשליטה לעמדת ההתחלה",
      ],
      en: [
        "Anchor resistance band to stable point at chest height",
        "Stand with knees slightly bent for stability",
        "Grip band ends and pull toward abdomen",
        "Return with control to starting position",
      ],
    },
    tips: {
      he: [
        "שמור על הכתפיים למטה ואחורה",
        "שליטה מלאה בתנועת החזרה",
        "הפעל את שרירי הגב, לא הזרועות",
      ],
      en: [
        "Keep shoulders down and back",
        "Full control on return movement",
        "Use back muscles, not just arms",
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
  {
    id: "band_chest_press_1",
    name: "לחיצת חזה עם גומי התנגדות",
    nameLocalized: { he: "לחיצת חזה עם גומי התנגדות", en: "Band Chest Press" },
    category: "strength",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: [
        "עגן את הגומי מאחוריך בגובה החזה",
        "אחוז בקצות הגומי ועמוד יציב",
        "דחוף את הידיים קדימה עד לישור מלא",
        "חזור בשליטה לעמדת ההתחלה",
      ],
      en: [
        "Anchor band behind you at chest height",
        "Hold band ends and stand stable",
        "Press hands forward to full extension",
        "Return with control to starting position",
      ],
    },
    tips: {
      he: [
        "שמור על פרקי ידיים ניטרליים",
        "הימנע מנעילת מרפקים מלאה",
        "שליטה בתנועת החזרה",
      ],
      en: [
        "Keep wrists neutral",
        "Avoid full elbow lockout",
        "Control the return movement",
      ],
    },
    safetyNotes: {
      he: [
        "בדוק שחיקה בגומי לפני שימוש",
        "ודא עיגון יציב ובטוח",
        "התחל עם התנגדות קלה",
      ],
      en: [
        "Inspect band wear before use",
        "Ensure stable and secure anchor",
        "Start with light resistance",
      ],
    },
    media: {
      image: "exercises/band_chest_press.jpg",
      video: "",
      thumbnail: "exercises/band_chest_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "band_overhead_press_1",
    name: "לחיצת כתפיים עם גומי התנגדות",
    nameLocalized: {
      he: "לחיצת כתפיים עם גומי התנגדות",
      en: "Band Overhead Press",
    },
    category: "strength",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "core"],
    equipment: "resistance_bands",
    difficulty: "intermediate",
    instructions: {
      he: [
        "עמוד על הגומי ברגליים ברוחב כתפיים",
        "אחוז בקצות הגומי בגובה כתפיים",
        "דחוף ידיים מעלה עד לישור מלא",
        "חזור בשליטה לגובה כתפיים",
      ],
      en: [
        "Stand on band with feet shoulder-width apart",
        "Hold band ends at shoulder height",
        "Press hands overhead to full extension",
        "Return with control to shoulder height",
      ],
    },
    tips: {
      he: ["הימנע מקשת יתר בגב", "שמור על core מופעל", "תנועה ישרה מעלה ומטה"],
      en: [
        "Avoid over-arching back",
        "Keep core engaged",
        "Straight up and down movement",
      ],
    },
    safetyNotes: {
      he: [
        "בדוק יציבות העמידה על הגומי",
        "לא לנעול מרפקים בחוזקה",
        "התחל עם התנגדות קלה",
      ],
      en: [
        "Check footing stability on band",
        "Don't lock elbows hard",
        "Start with light resistance",
      ],
    },
    media: {
      image: "exercises/band_overhead_press.jpg",
      video: "",
      thumbnail: "exercises/band_overhead_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "band_triceps_extension_1",
    name: "פשיטת טרייספס עם גומי התנגדות",
    nameLocalized: {
      he: "פשיטת טרייספס עם גומי התנגדות",
      en: "Band Triceps Extension",
    },
    category: "strength",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["shoulders"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: [
        "עגן את הגומי למעלה (דלת או מתקן)",
        "אחוז בקצות הגומי עם כפות ידיים כלפי מטה",
        "יישר את המרפקים למטה עד לישור מלא",
        "חזור בשליטה לעמדת ההתחלה",
      ],
      en: [
        "Anchor band high (door or equipment)",
        "Hold band ends with palms facing down",
        "Extend elbows down to full extension",
        "Return with control to starting position",
      ],
    },
    tips: {
      he: [
        "שמור על מרפקים צמודים לגוף",
        "רק המרפקים זזים, לא הכתפיים",
        "מתח מלא בטרייספס בתחתית",
      ],
      en: [
        "Keep elbows tucked to body",
        "Only elbows move, not shoulders",
        "Full triceps contraction at bottom",
      ],
    },
    safetyNotes: {
      he: [
        "לא לנעול מרפקים בחוזקה",
        "שליטה בתנועת החזרה",
        "בדוק עיגון בטוח למעלה",
      ],
      en: [
        "Don't hyperextend elbows",
        "Control the return movement",
        "Check secure high anchor",
      ],
    },
    media: {
      image: "exercises/band_triceps_extension.jpg",
      video: "",
      thumbnail: "exercises/band_triceps_extension_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "band_biceps_curl_1",
    name: "כפיפת זרועות עם גומי התנגדות",
    nameLocalized: {
      he: "כפיפת זרועות עם גומי התנגדות",
      en: "Band Biceps Curl",
    },
    category: "strength",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד על הגומי ברגליים ברוחב כתפיים",
        "אחוז בקצות הגומי עם כפות ידיים כלפי מעלה",
        "כופף את המרפקים למעלה עד הכתפיים",
        "חזור בשליטה לעמדת זרועות ישרות",
      ],
      en: [
        "Stand on band with feet shoulder-width apart",
        "Hold band ends with palms facing up",
        "Curl elbows up toward shoulders",
        "Return with control to straight arms",
      ],
    },
    tips: {
      he: [
        "הימנע מתנופה עם הגוף",
        "רק המרפקים זזים",
        "מתח מלא בביצפס בחלק העליון",
      ],
      en: [
        "Avoid swinging with body",
        "Only elbows move",
        "Full biceps contraction at top",
      ],
    },
    safetyNotes: {
      he: [
        "בדוק שחיקה בגומי לפני שימוש",
        "ודא עמידה יציבה על הגומי",
        "שליטה בתנועת החזרה",
      ],
      en: [
        "Inspect for tears before use",
        "Ensure stable footing on band",
        "Control the lowering movement",
      ],
    },
    media: {
      image: "exercises/band_biceps_curl.jpg",
      video: "",
      thumbnail: "exercises/band_biceps_curl_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "band_squat_1",
    name: "סקווט עם גומי התנגדות",
    nameLocalized: { he: "סקווט עם גומי התנגדות", en: "Band Squat" },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: [
        "הכנס גומי לולאה מעל לברכיים",
        "עמוד עם רגליים ברוחב כתפיים",
        "רד לסקווט תוך דחיפת ברכיים החוצה",
        "עלה חזרה תוך שמירה על מתח בגומי",
      ],
      en: [
        "Place loop band above knees",
        "Stand with feet shoulder-width apart",
        "Squat down while pushing knees out",
        "Rise back up maintaining band tension",
      ],
    },
    tips: {
      he: [
        "דחוף ברכיים החוצה נגד הגומי",
        "שמור על חזה זקוף ועיניים קדימה",
        "עקבים צמודים לרצפה",
      ],
      en: [
        "Push knees out against band",
        "Keep chest up and eyes forward",
        "Keep heels planted on floor",
      ],
    },
    safetyNotes: {
      he: [
        "שמור עקבים על הרצפה",
        "ברכיים עוקבות אחר כיוון אצבעות",
        "התחל עם התנגדות קלה",
      ],
      en: [
        "Keep heels planted",
        "Knees track over toes",
        "Start with light resistance",
      ],
    },
    media: {
      image: "exercises/band_squat.jpg",
      video: "",
      thumbnail: "exercises/band_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "band_good_morning_1",
    name: "גוד מורנינג גומיה",
    nameLocalized: { he: "גוד מורנינג גומיה", en: "Band Good Morning" },
    category: "strength",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["back", "core"],
    equipment: "resistance_bands",
    difficulty: "intermediate",
    instructions: {
      he: ["גומיה סביב כתפיים מתחת רגליים", "כיפוף ירכיים"],
      en: ["Band over shoulders under feet", "Hinge at hips"],
    },
    tips: { he: ["ברכיים רכות"], en: ["Soft knees"] },
    safetyNotes: { he: ["לא לעגל גב"], en: ["Don't round back"] },
    media: {
      image: "exercises/band_good_morning.jpg",
      video: "",
      thumbnail: "exercises/band_good_morning_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "band_lateral_walk_1",
    name: "הליכת גומיה צדית",
    nameLocalized: { he: "הליכת גומיה צדית", en: "Band Lateral Walk" },
    category: "strength",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hips", "quadriceps"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: ["גומיה מעל הקרסול", "צעדים לצד"],
      en: ["Band above ankles", "Step laterally"],
    },
    tips: { he: ["שמירה על מתח"], en: ["Keep band tension"] },
    safetyNotes: { he: ["לא לסגור רגליים מהר"], en: ["Control return step"] },
    media: {
      image: "exercises/band_lateral_walk.jpg",
      video: "",
      thumbnail: "exercises/band_lateral_walk_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "band_glute_bridge_1",
    name: "גשר עכוז גומיה",
    nameLocalized: { he: "גשר עכוז גומיה", en: "Band Glute Bridge" },
    category: "strength",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: ["גומיה מעל ברכיים", "הרם אגן"],
      en: ["Band above knees", "Lift hips up"],
    },
    tips: { he: ["שחיטת עכוז למעלה"], en: ["Squeeze at top"] },
    safetyNotes: { he: ["לא לקשת יתר"], en: ["Don't overextend"] },
    media: {
      image: "exercises/band_glute_bridge.jpg",
      video: "",
      thumbnail: "exercises/band_glute_bridge_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "band_face_pull_1",
    name: "פייס פול גומיה",
    nameLocalized: { he: "פייס פול גומיה", en: "Band Face Pull" },
    category: "strength",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["back", "biceps"],
    equipment: "resistance_bands",
    difficulty: "intermediate",
    instructions: {
      he: ["עגן בגובה פנים", "משוך לכיוון הפנים"],
      en: ["Anchor face height", "Pull toward face"],
    },
    tips: { he: ["מרפקים גבוהים"], en: ["Elbows high"] },
    safetyNotes: { he: ["שלוט בחזרה"], en: ["Control eccentric"] },
    media: {
      image: "exercises/band_face_pull.jpg",
      video: "",
      thumbnail: "exercises/band_face_pull_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
];
