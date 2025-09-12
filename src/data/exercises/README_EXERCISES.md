# 📘 מדריך הוספה ותחזוקה – תרגילים (Exercises)

מטרה: מקור אחד אחיד לכל התרגילים + הנחיות בטוחות להוספה/עדכון.

## ✅ עקרונות

- Single Source of Truth: תרגילים מפוזרים לפי קטגוריות בקבצים (bodyweight / dumbbells / cardio / flexibility / resistanceBands / machines).
- `index.ts` מאחד הכל + פונקציות סינון (אל תיצור איחוד חדש).
- אל תשכפל לוגיקת סינון – השתמש ב-`exerciseFilters`.
- שמות exports אינם תמיד זהים לשם הקובץ (ראה חריגים בהמשך).

## 🔁 זרימת הוספת תרגיל חדש

1. בחר קובץ קטגוריה נכון (לדוגמה: תרגיל מכונה → `machines.ts`).
2. `id` ייחודי בפורמט: `<equipment|bodyweight|machine|cardio>_<english_snake_case>_<increment>`.

- דוגמאות: `dumbbells_overhead_press_2`, `leg_press_machine_1`, `mountain_climbers_2`.

3. `equipment` חייב להתאים לערך קיים ב-`equipmentCatalog.ts` (או `none` / `bodyweight` / `dumbbells` / `resistance_bands` / `leg_press`).
4. מלא את כל השדות בטמפלייט (אין להשאיר מערכים ריקים).
5. שמות קבוצות שרירים רק מתוך הרשימה הקנונית (ראה להלן).
6. הרץ ולידציה: `node scripts/validateExercises.js` – ודא 0 Errors לפני Commit.
7. אם הוספת ציוד חדש → עדכן `equipmentCatalog.ts` + וודא שאין אזהרת "unused equipment".
8. אם נדרשת קטגוריה חדשה (נדיר) → לעדכן קבועים / פילטרים / תיעוד.

## 🧩 טמפלייט מלא (שדות חובה)

```ts
{
  id: "dumbbells_overhead_press_2",
  name: "לחיצת כתפיים עם משקולות",
  nameLocalized: { he: "לחיצת כתפיים עם משקולות", en: "Dumbbell Overhead Press" },
  category: "strength", // strength | cardio | flexibility | core
  primaryMuscles: ["shoulders"], // רק ערכים חוקיים
  secondaryMuscles: ["triceps", "core"], // אפשר להשאיר [] אם באמת אין, אך עדיף לכלול תמיכה
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

## 🧪 ולידציה / בדיקות

- הרצה ידנית: `node scripts/validateExercises.js`.
- הסקריפט בודק: כפילות ids, ציוד לא מזוהה, קבוצות שרירים לא חוקיות, ציוד שהוגדר אך אין לו תרגילים.
- טפל קודם ב-Errors, אח"כ ב-Warnings (Warnings יכולות להיות תקינות אם ציוד מתוכנן לעתיד).

שדרוג עתידי מתוכנן: מצב `--json` ל-CI + כיסוי שרירים כמותי.

## 🚫 מה לא לעשות

- לא להוסיף תרגילי דמו / placeholder ללא תוכן מלא.
- לא ליצור `id` ממוחזר או לשנות `id` קיים (פוגע בהפניות אפשריות עתידיות).
- לא להמציא `equipment` חדש בלי להוסיף ל-`equipmentCatalog.ts`.
- לא להשאיר מערכי instructions / tips ריקים (לפחות פריט אחד לשפה).
- לא להשתמש בקבוצות שרירים לא קנוניות (הוולידטור יכשיל).

## 🗂 קבוצות שרירים (קנוני – מסונכרן עם constants/exercise.ts)

`shoulders, chest, back, biceps, triceps, forearms, core, quadriceps, hamstrings, glutes, calves, hips, neck`

אם נדרש להוסיף שריר חדש – עדכון ב-`constants/exercise.ts` + התאמות פילטרים.

## 🏷 ציוד נפוץ (דוגמאות)

`bodyweight, dumbbells, resistance_bands, leg_press, kettlebell, barbell, pull_up_bar, trx, bench`

הוולידטור יתריע על ציוד לא בשימוש (עוזר לזהות פערי כיסוי).

### חריגי שמות exports

- `dumbbells.ts` → `dumbbellExercises`
- `resistanceBands.ts` → `resistanceBandExercises`
- `machines.ts` → `machineExercises`

בעת שינוי שמות – לעדכן גם את לוגיקת המיפוי בסקריפט הולידציה.

---

שיפור עתידי: הפקת טייפים אוטומטית, מצב JSON ל-CI, מדד כיסוי שרירים.
