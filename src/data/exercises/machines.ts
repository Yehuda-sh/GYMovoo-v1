/**
 * @file machines.ts
 * תרגילים למכונות (Machine-based exercises)
 */
import { Exercise } from "./types";

export const machineExercises: Exercise[] = [
  {
    id: "leg_press_machine_1",
    name: "לחיצת רגליים",
    nameLocalized: { he: "לחיצת רגליים", en: "Leg Press" },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "leg_press",
    difficulty: "beginner",
    instructions: {
      he: [
        "כוון משענת לפי טווח תנועה בטוח",
        "הנח כפות רגליים ברוחב כתפיים",
        "דחוף את הפלטה ללא נעילת ברכיים",
        "הורד בשליטה עד זוית ברך ~90°",
      ],
      en: [
        "Adjust backrest for safe range",
        "Place feet shoulder-width on platform",
        "Press without locking knees",
        "Lower under control to ~90° knee angle",
      ],
    },
    tips: {
      he: ["דחוף דרך העקבים", "שלוט בירידה", "שמור ליבה פעילה"],
      en: ["Drive through heels", "Control the lowering", "Engage core"],
    },
    safetyNotes: {
      he: ["אל תנעל ברכיים", "שמור גב צמוד למשענת", "בחר משקל בינוני"],
      en: ["Don't lock knees", "Keep back against pad", "Choose moderate load"],
    },
    media: {
      image: "exercises/leg_press.jpg",
      video: "",
      thumbnail: "exercises/leg_press_thumb.jpg",
    },
    homeCompatible: false,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "large",
    noiseLevel: "quiet",
  },
  {
    id: "leg_press_machine_single_leg_1",
    name: "לחיצת רגל אחת",
    nameLocalized: { he: "לחיצת רגל אחת", en: "Single-Leg Leg Press" },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "leg_press",
    difficulty: "intermediate",
    instructions: {
      he: ["הנח רגל אחת במרכז הפלטה", "דחוף ושמור ברך מיושרת", "הורד לאט"],
      en: [
        "Place one foot centered",
        "Press keeping knee tracking",
        "Lower slowly",
      ],
    },
    tips: { he: ["שמור שליטה"], en: ["Maintain control"] },
    safetyNotes: { he: ["משקל נמוך יותר"], en: ["Use lighter load"] },
    media: {
      image: "exercises/leg_press_single_leg.jpg",
      video: "",
      thumbnail: "exercises/leg_press_single_leg_thumb.jpg",
    },
    homeCompatible: false,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "large",
    noiseLevel: "quiet",
  },
];
