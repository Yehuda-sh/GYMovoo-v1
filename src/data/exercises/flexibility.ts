/**
 * @file flexibility.ts
 * @description תרגילי גמישות ומתיחות
 * Flexibility and stretching exercises
 */

import { Exercise } from "./types";

export const flexibilityExercises: Exercise[] = [
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
    instructions: {
      he: [
        "רד לכריעה על הברכיים ברוחב הירכיים",
        "ישב בחזרה על העקבים",
        "השתטח קדימה עם הידיים מושטות לפנים",
        "הנח את המצח על הרצפה",
      ],
      en: [
        "Kneel down with knees hip-width apart",
        "Sit back on your heels",
        "Fold forward with arms extended in front",
        "Rest forehead on the floor",
      ],
    },
    tips: {
      he: [
        "נשום עמוק ואיטי",
        "הרגע את כל הגוף",
        "אם קשה לשבת על עקבים - שים כרית",
      ],
      en: [
        "Breathe deeply and slowly",
        "Relax entire body",
        "Use pillow between calves and thighs if needed",
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

  {
    id: "downward_dog_1",
    name: "כלב פונה מטה",
    nameLocalized: {
      he: "כלב פונה מטה",
      en: "Downward Facing Dog",
    },
    category: "flexibility",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["hamstrings", "calves", "back"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "התחל בעמדה של ידיים וברכיים",
        "שים אצבעות כפות הרגליים על הרצפה",
        "הרם את הירכיים למעלה ואחורה",
        "יישר את הרגליים ויצור צורת משולש הפוך",
      ],
      en: [
        "Start in hands and knees position",
        "Tuck toes under",
        "Lift hips up and back",
        "Straighten legs to form inverted V shape",
      ],
    },
    tips: {
      he: [
        "הפעל לחץ דרך כפות הידיים",
        "מתח את העקבים לעבר הרצפה",
        "אל תנעל את הברכיים",
      ],
      en: [
        "Press down through palms",
        "Reach heels toward floor",
        "Don't lock out knees",
      ],
    },
    safetyNotes: {
      he: [
        "אל תכפה את העקבים לרצפה",
        "הפסק אם כואב בפרקי הידיים",
        "שמור על הצוואר רגוע",
      ],
      en: [
        "Don't force heels to floor",
        "Stop if wrists hurt",
        "Keep neck relaxed",
      ],
    },
    media: {
      image: "exercises/downward_dog.jpg",
      video: "exercises/downward_dog.mp4",
      thumbnail: "exercises/downward_dog_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "silent",
  },
];
