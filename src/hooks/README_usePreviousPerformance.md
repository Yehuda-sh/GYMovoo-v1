# usePreviousPerformance Hook - Enhanced Smart Version 🧠

## תיאור / Description

Hook חכם לקבלת ביצועים קודמים עם אלגוריתם התקדמות מתקדם.
Smart hook for getting previous exercise performances with advanced progression algorithm.

**עדכון אוגוסט 2025**: שיפור לוגינג ותמיכה מלאה במאגר התרגילים החדש 🆕

### מבנה אובייקט חכם / Smart Object Shape

```typescript
export interface SmartPreviousPerformance {
  weight?: number; // משקל אחרון שנרשם
  reps?: number; // חזרות אחרונות
  sets?: number; // סטים אחרונים
  date?: string | Date; // תאריך אימון אחרון
  // שדות נגזרים
  progressionTrend: "improving" | "stable" | "declining" | "new";
  recommendedProgression: {
    weight?: number;
    reps?: number;
    sets?: number;
    reasoning: string; // הסבר טקסטואלי
  };
  consistencyScore: number; // 1-10
  strengthGain: number; // אחוז שינוי נפח (%) בין שני אימונים אחרונים
  lastWorkoutGap: number; // ימים מאז האימון האחרון
  confidenceLevel: "high" | "medium" | "low";
}
```

### חוזה Hook / Hook Contract

```typescript
interface UsePreviousPerformanceReturn {
  previousPerformance: SmartPreviousPerformance | null;
  loading: boolean;
  error: string | null;
  refetch(): Promise<void>;
  getProgressionInsight(): string;
  shouldIncreaseWeight(): boolean;
  getMotivationalMessage(): string;
}
```

## שיפורים שנוספו / Added Enhancements

### 🎯 אלגוריתם התקדמות חכם / Smart Progression Algorithm

- **מגמת התקדמות**: improving, stable, declining, new
- **ציון עקביות**: 1-10 בהתבסס על היסטוריה וביצועים
- **חישוב שיפור כוח**: אחוזי שיפור בין אימונים
- **רמת ביטחון**: high, medium, low להמלצות

### 🔧 פונקציות חכמות נוספות / Smart Functions

```typescript
getProgressionInsight(): string // תובנה על ההתקדמות
shouldIncreaseWeight(): boolean // האם להעלות משקל
getMotivationalMessage(): string // הודעה מוטיבציונית
```

### 🆕 לוגינג נשלט / Controlled Debug Logging

- ברירת מחדל: שקט (רק שגיאות console.error)
- הפעלה: שינוי `DEBUG_PREV_PERF` בקובץ hook ל-`true`
- כל הלוגים עוברים דרך פונקציה `debug()` מרכזית (קל לכבות / להחליף ללוגר מתקדם)

```typescript
// בתוך usePreviousPerformance.ts
const DEBUG_PREV_PERF = true; // להפעיל בעת דיבוג
// debug('� Progression', { name, strengthGain, trend });
```

### 💡 המלצות אוטומטיות / Automatic Recommendations

- **משקל מומלץ**: בהתבסס על מגמה ועקביות
- **חזרות מומלצות**: התאמה דינמית לביצועים
- **נימוק**: הסבר ברור למשתמש

### 🚀 שיפורי UX

- הודעות ביעברית עם אמוג'י
- הסברים ברורים להחלטות האלגוריתם
- התמודדות חכמה עם משתמשים חדשים

## דוגמת שימוש / Usage Example

```typescript
const {
  previousPerformance,
  loading,
  error,
  getProgressionInsight,
  shouldIncreaseWeight,
  getMotivationalMessage,
} = usePreviousPerformance("Push-ups");

// הצגת תובנות חכמות
const insight = getProgressionInsight(); // "מצוין! התקדמת ב-12.5% - המשך כך!"
const shouldIncrease = shouldIncreaseWeight(); // true/false
const motivation = getMotivationalMessage(); // "כל הכבוד! שיפור של 12.5% 🚀"
```

### כללי לוגיקת המלצה / Recommendation Rules Summary

| תנאי                             | פעולה          | נימוק                         |
| -------------------------------- | -------------- | ----------------------------- |
| trend=improving & consistency>=8 | weight +2.5%   | "מגמה מצוינת!"                |
| trend=stable & consistency>=6    | +1 rep (עד 15) | "הוסף חזרה"                   |
| trend=declining OR gap>7 ימים    | weight -10%    | "התמקד בטכניקה / חזרה מהפסקה" |
| אחרת                             | שמור           | "שמור על הרמה"                |

נפח מחושב כ: `weight * reps * sets`. אחוז שיפור = (ΔVolume / prevVolume)\*100.

### 🆕 עבודה עם מאגר התרגילים החדש / Working with New Exercise Database

```typescript
// התרגילים החדשים עם equipment "none" נתמכים במלואם
usePreviousPerformance("שכיבת סמיכה בסיסית"); // תרגיל משקל גוף
usePreviousPerformance("כיפופי ברכיים עם משקל גוף"); // תרגיל בית
usePreviousPerformance("דחיפת חזה עם משקולות"); // תרגיל עם ציוד

// כל התרגילים מהמאגר החדש נתמכים עם ניתוח חכם מלא
```

## יתרונות המערכת החכמה / Smart System Benefits

1. **התקדמות מדעית**: אלגוריתם מבוסס נתונים אמיתיים
2. **מניעת פציעות**: זיהוי ירידה בביצועים והתאמת עומס
3. **מוטיבציה**: הודעות מעודדות והכרה בהתקדמות
4. **התאמה אישית**: המלצות מותאמות לרמת המשתמש
5. **למידה מתמשכת**: השתפרות האלגוריתם עם יותר נתונים

---

✨ **כל הכבוד על השדרוג החכם!** עכשיו המערכת יודעת לא רק מה עשית אלא גם מה כדאי לעשות הבא! 💪

## הערות פיתוח / Dev Notes

- מניעת setState לאחר unmount: שימוש ב-`isMountedRef`.
- אלגוריתם מפורק לפונקציות קטנות: `calculateRecommendedProgression`, `getVolume`, `calculateSmartProgression` (טהור לפי input).
- ניתן להרחיב בעתיד: תמיכה במגמת Rolling (ממוצע 3-5 אימונים), התאמות לפי זמן יום.

## שיפורים מוצעים (אם תרצה שאממש – ציין מספרים)

1. העברת DEBUG לפרמטר hook או ENV.
2. הוספת cache פנימי לפי exerciseName מפחית חישובים.
3. בדיקות יחידה ל-calculateSmartProgression (edge cases: אימון אחד, gap גדול, ירידה חדה).
4. תמיכה ב-window ממוצע (EMA) לנפח כדי להחליק קפיצות.
5. חשיפת גם raw history (אם יסופק בעתיד) לניתוח גרפי.
