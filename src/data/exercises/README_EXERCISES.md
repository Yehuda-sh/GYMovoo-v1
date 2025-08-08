# 📘 מדריך הוספה ותחזוקה – תרגילים (Exercises)

מטרה: מקור אחד אחיד לכל התרגילים + הנחיות בטוחות להוספה/עדכון.

## ✅ עקרונות

- Single Source of Truth: כל התרגילים מפוזרים לפי קטגוריות בקבצים (bodyweight/dumbbells/...)
- `index.ts` מאחד הכל + פונקציות סינון מרכזיות.
- אין לשכפל לוגיקת סינון – להשתמש ב-exerciseFilters.

## 🔁 זרימת הוספת תרגיל חדש

1. בחר קובץ קטגוריה מתאים (לפי ציוד/סיווג).
2. צור `id` ייחודי: `<equipment|bodyweight>_<english_name_snake_case>_<increment>`.
3. ודא שה-`equipment` תואם ל-id ציוד (או bodyweight / resistance_bands / dumbbells וכו').
4. הוסף אובייקט לפי הטמפלייט.
5. אם נוספה קטגוריה חדשה → עדכון קבועים (אם רלוונטי) וסטטיסטיקות.

## 🧩 טמפלייט מלא

```ts
{
  id: "dumbbells_overhead_press_2",
  name: "לחיצת כתפיים עם משקולות",
  nameLocalized: { he: "לחיצת כתפיים עם משקולות", en: "Dumbbell Overhead Press" },
  category: "strength", // strength | cardio | flexibility | core
  primaryMuscles: ["shoulders"],
  secondaryMuscles: ["triceps", "core"],
  equipment: "dumbbells",
  difficulty: "intermediate", // beginner | intermediate | advanced
  instructions: {
    he: ["הרם משקולות לכתפיים", "דחוף מעלה עד יישור מרפקים", "הורד בשליטה"],
    en: ["Raise dumbbells to shoulders", "Press overhead until arms extend", "Lower under control"],
  },
  tips: {
    he: ["אל תנעל מרפקים", "שמור על בטן אסופה"],
    en: ["Don't lock elbows", "Engage core"],
  },
  safetyNotes: {
    he: ["התחל במשקל קל", "עצור אם יש כאב בצוואר"],
    en: ["Start light", "Stop if neck pain"],
  },
  media: {
    image: "exercises/dumbbells_overhead_press_2.jpg", // או השאר placeholder
    video: "exercises/dumbbells_overhead_press_2.mp4",
    thumbnail: "exercises/dumbbells_overhead_press_2_thumb.jpg",
  },
  homeCompatible: true,
  gymPreferred: true,
  outdoorSuitable: false,
  spaceRequired: "small", // minimal | small | medium | large
  noiseLevel: "quiet", // silent | quiet | moderate | loud
}
```

## 🧪 בדיקות מומלצות

הוסף סקריפט ולידציה (ראה scripts/validateExercises.js).

## 🚫 מה לא לעשות

- לא להוסיף תרגילי דמו עם טקסט placeholder ללא תיעוד.
- לא להמציא ערך ציוד שלא מופיע ב-equipmentData.ts בלי עדכון.
- לא להותיר מערכים ריקים (instructions/tips) – לפחות 1 פריט.

## 🗂 קבוצות שרירים (מומלץ לרכז בהמשך)

shoulders, chest, back, biceps, triceps, forearms, core, quadriceps, hamstrings, glutes, calves, hips, neck.

## 🏷 ציוד נפוץ (סנכרון)

bodyweight, dumbbells, resistance_bands, kettlebell, barbell, pull_up_bar, trx, bench.

---

שיפור עתידי: הפקת טייפים אוטומטית + בדיקות CI.
