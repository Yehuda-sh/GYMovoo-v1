# useUserPreferences Hook - Enhanced Smart Version 🧠

## תיאור / Description

Hook חכם לגישה נוחה לנתוני העדפות המשתמש עם אלגוריתמים מתקדמים וניתוח אישיות.
Smart hook for convenient access to user preferences with advanced algorithms and personality analysis.

## מה חדש? / What's New?

### 🎯 אלגוריתם ניתוח אישיות

**4 פרופילי משתמש חכמים:**

- **מתחיל זהיר** - משתמש חדש שצריך הדרכה עדינה
- **נחוש להצליח** - מוטיבציה גבוהה ועקביות טובה
- **ספורטאי מנוסה** - רמה מתקדמת ומוטיבציה גבוהה
- **מחפש איזון** - מתמקד בבריאות ואיזון חיים

### 🧮 מערכת ניקוד חכמה (1-10)

```typescript
interface SmartScores {
  motivationLevel: number; // רמת מוטיבציה
  consistencyScore: number; // ציון עקביות
  equipmentReadiness: number; // מוכנות ציוד
  completionQuality: number; // איכות השלמת השאלון
}
```

### 🤖 המלצות אוטומטיות

- **זמן אימון אידיאלי**: בוקר/צהריים/ערב
- **קצב התקדמות**: איטי/בינוני/מהיר
- **תחומי התמקדות**: קרדיו, כוח, טכניקה, בטיחות
- **אזהרות**: מוטיבציה נמוכה, ציוד מוגבל, מצב בריאותי

### 🔍 תובנות מותאמות אישית

```typescript
// דוגמאות לתובנות שהאלגוריתם מפיק:
"🔥 רמת מוטיבציה גבוהה - מוכן לאתגרים!";
"⚡ עקביות מצוינת - זה המפתח להצלחה";
"🏋️ ציוד מעולה - יש לך כל מה שצריך";
"⚠️ שים לב: מוטיבציה נמוכה, ציוד מוגבל";
"🎯 מתאים לך: נחוש להצליח";
```

## שיפורים טכניים / Technical Improvements

### 🔄 תמיכה במערכות מרובות

- **Legacy System**: מערכת ישנה
- **New System**: מערכת חדשה חכמה
- **Extended System**: מערכת מורחבת
- **Mixed**: שילוב מערכות

### 📊 ניתוח איכות נתונים

```typescript
const calculateDataQuality = (data: QuestionnaireMetadata): number => {
  // מחשב ציון איכות נתונים (1-10)
  // מבוסס על שלמות המידע שסופק על ידי המשתמש
};
```

### 🎯 תוכנית אימון חכמה

```typescript
interface SmartWorkoutPlan {
  weeklySchedule: WorkoutRecommendation[];
  personalityMatch: string;
  focusAreas: string[];
  progressionPace: string;
  motivationalBoost: string;
}
```

## דוגמת שימוש / Usage Example

```typescript
// ✅ Correct import path (updated)
import { useUserPreferences } from './useUserPreferences';

function MyComponent() {
  const {
    preferences,               // אובייקט מאוחד (legacy + new) / unified preferences object
    isLoading,                 // מצב טעינה
    systemType,                // 'legacy' | 'new' | 'extended' | 'mixed'
    completionQuality,         // 1-10 איכות נתונים
    personalizedInsights,      // מערך תובנות שנוצר בקומפילציה
    smartWorkoutPlan,          // תוכנית חכמה (SmartWorkoutPlan)

    // פונקציות חכמות / Smart helpers
    getSmartInsights,          // () => string[]
    calculateUserScore,        // () => number (1-10 aggregate)
    shouldRecommendUpgrade,    // () => boolean

    // פעולות / Actions
    refreshPreferences,        // force reload
    clearPreferences           // reset internal cached state
  } = useUserPreferences();

  if (isLoading) return <div>טוען נתונים חכמים...</div>;

  const userScore = calculateUserScore();      // 1-10
  const insights = getSmartInsights();         // string[]
  const needsUpgrade = shouldRecommendUpgrade();

  return (
    <div>
      <h2>פרופיל: {preferences?.personalityProfile}</h2>
      <p>ציון כללי: {userScore}/10</p>
      <p>איכות נתונים: {completionQuality}/10</p>
      <p>מערכת: {systemType}</p>

      <div>
        <h3>תובנות אישיות:</h3>
        {insights.map(insight => <p key={insight}>{insight}</p>)}
      </div>

      {needsUpgrade && (
        <div>🚀 מומלץ לשדרג למערכת החדשה!</div>
      )}

      {smartWorkoutPlan && (
        <div>
          <h3>תוכנית מותאמת:</h3>
          <p>התמקדות: {smartWorkoutPlan.focusAreas.join(", ")}</p>
          <p>קצב: {smartWorkoutPlan.progressionPace}</p>
          <p>{smartWorkoutPlan.motivationalBoost}</p>
        </div>
      )}
    </div>
  );
}
```

## Contract מהיר / Quick API Contract

```typescript
interface UseUserPreferencesReturn {
  preferences: any | null; // TODO: replace any with explicit UserPreferences type
  isLoading: boolean;
  systemType: "legacy" | "new" | "extended" | "mixed";
  completionQuality: number; // 1-10
  personalizedInsights: string[];
  smartWorkoutPlan: SmartWorkoutPlan | null;
  getSmartInsights(): string[];
  calculateUserScore(): number; // 1-10 aggregate (motivation + consistency + quality)
  shouldRecommendUpgrade(): boolean; // Suggest migration to new system
  refreshPreferences(): Promise<void> | void;
  clearPreferences(): void;
}
```

מקורות עיקריים / Primary Data Sources:

- legacy: user.questionnaire
- current: user.questionnaireData.answers
- smart: user.smartQuestionnaireData.answers
- extended: user.trainingStats

לוגיקת חישוב מפוצלת ל-helpers: `userPreferencesHelpers.ts` (scoreFrequency, calculateDataQuality, generateFocusAreas, generateWarningFlags, createSmartWorkoutPlan)

## Hook משלים חכם / Enhanced Quick Workout Hook

```typescript
const {
  workout,
  isLoading,
  error,
  refresh,
  smartInsights, // 🆕 תובנות לאימון המהיר
} = useQuickWorkout();

// smartInsights מכיל:
// "⚡ אימון מהיר מותאם לך"
// "🎯 בהתבסס על העדפותיך האישיות"
// "💪 מוכן להתחיל בכל רגע"
```

## יתרונות המערכת החכמה / Smart System Benefits

### 🎯 התאמה אישית מדויקת

- ניתוח פרופיל אישיות מבוסס נתונים
- המלצות מותאמות לרמת המשתמש
- זיהוי חוזק וחולשות אישיים

### 🧠 למידה חכמה

- האלגוריתם לומד מהנתונים הקיימים
- שיפור המלצות לאורך זמן
- זיהוי דפוסי התנהגות

### 🛡️ בטיחות ומניעה

- זיהוי מצבי בריאות מיוחדים
- התאמת עומס האימון לרמת המשתמש
- אזהרות על בעיות פוטנציאליות

### 🚀 מוטיבציה מותאמת

- הודעות מעודדות מותאמות אישית
- הכרה בהישגים והתקדמות
- עזרה בשמירה על מוטיבציה גבוהה

---

## השוואה לגרסה הישנה / Comparison to Old Version

| תכונה         | גרסה ישנה | גרסה חכמה       |
| ------------- | --------- | --------------- |
| ניתוח אישיות  | ❌        | ✅ 4 פרופילים   |
| ציון חכם      | ❌        | ✅ 4 מדדים      |
| תובנות אישיות | ❌        | ✅ דינמיות      |
| המלצות זמן    | ❌        | ✅ אוטומטיות    |
| זיהוי בעיות   | ❌        | ✅ אזהרות חכמות |
| תוכנית מותאמת | ❌        | ✅ מלאה         |
| תמיכה מערכות  | ❌        | ✅ מרובות       |
| איכות נתונים  | ❌        | ✅ ניתוח        |

**עכשיו המערכת לא רק זוכרת מה אתה רוצה - היא יודעת מי אתה ומה מתאים לך!** 🎯🧠💪

---

## עדכונים אחרונים / Recent Alignment Notes

- עודכנה נתיב ה-import (הוסר הסיומת \_NEW).
- מומלץ להחליף בעתיד את `preferences: any` בטיפוס מפורש (UserPreferencesUnified).
- להוסיף בדיקות יחידה ל-helpers הקריטיים (scoreFrequency, calculateDataQuality).
- אפשרות עתידית: caching in-memory לפי userId למניעת עומס חישוב חוזר.

## שיפורי תעוד מוצעים / Suggested Doc Improvements

1. להוסיף תרשים זרימה (Flow) קצר לאיך נבחר systemType.
2. טבלת משקולות (Weights) של תרומת כל מדד לציון הכללי.
3. דוגמת בדיקה (jest) המוודאת personalityProfile צפוי עבור סט תשובות.
4. הוספת ENV toggle ל-DEBUG_PREFS להדפסת אבחון.
5. רשימת Edge Cases (ללא ציוד, תשובות חלקיות, משתמש חדש לגמרי).

אם תרצה שאממש סעיפים מסוימים בקוד או בתעוד – כתוב מספרים.
