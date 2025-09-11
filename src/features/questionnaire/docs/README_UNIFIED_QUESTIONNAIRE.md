# 📋 מערכת השאלון האחודה (גרסה מודולרית)

**עודכן לאחרונה: 9 ספטמבר 2025**

## 🎯 מטרה

מערכת שאלון מתקדמת ואחודה עם תמיכה מלאה ב-RTL, גלילה מושלמת ואנימציות מתקדמות, בארכיטקטורת מודולים.

## 📁 קבצים עיקריים

### 1. `src/features/questionnaire/data/unifiedQuestionnaire.ts`

- כל סוגי השאלות והאפשרויות
- נתוני ציוד מאורגנים (ביתי, חדר כושר)
- מנהל השאלון (`UnifiedQuestionnaireManager`)

### 2. `src/features/questionnaire/screens/QuestionnaireScreen.tsx`

- ScrollView מושלם
- תמיכה מלאה ב-RTL ועברית
- UI מודרני ונקי

### 3. `src/features/questionnaire/hooks/useQuestionnaire.ts`

- ניהול מצב השאלון
- שמירת טיוטות ושחזור
- בדיקת מצב השלמה

### 4. `src/features/questionnaire/navigation/QuestionnaireNavigator.tsx`

- ניווט ייעודי למודול השאלון
- תמיכה במעבר בין שלבים שונים של השאלון

## 🧩 ארכיטקטורת מודולים

המודול החדש מאורגן לפי חלוקה לוגית של הפיצ'ר:

```
src/features/questionnaire/
├── components/       # רכיבי UI ייעודיים לשאלון
├── data/             # נתונים וניהול נתונים
├── docs/             # תיעוד
├── hooks/            # React hooks ייעודיים
│   └── __tests__/    # בדיקות ליחידות
├── navigation/       # ניווט בתוך הפיצ'ר
├── screens/          # מסכים מלאים
├── store/            # ניהול מצב גלובלי
└── types/            # הגדרות טיפוסים
```

## 📝 שימוש

המודול משתלב בתוך האפליקציה הראשית דרך:

```tsx
// AppNavigator.tsx
import { QuestionnaireNavigator } from "../features/questionnaire";

// ...
<Stack.Screen
  name="Questionnaire"
  component={QuestionnaireNavigator}
  options={{ gestureEnabled: false }}
/>;
```

## 🔄 שינויים מהגרסה הקודמת

- מעבר לארכיטקטורת מודולים
- הפרדה טובה יותר בין UI, לוגיקה ונתונים
- תמיכה משופרת בשמירת טיוטות
- טיפול טוב יותר בשגיאות
- נגישות משופרת
- ConfirmationModal במקום Alert.alert
- לוגינג מותני עם dlog
- React.memo לביצועים משופרים

## 📊 שאלות במערכת

1. **🎯 מטרת כושר** - ירידה במשקל / בניית שריר / כושר כללי / ביצועים
2. **💪 רמת ניסיון** - מתחיל / בינוני / מתקדם
3. **📅 זמינות** - 2-5+ ימים בשבוע
4. **⏱️ משך אימון** - 15-60+ דקות
5. **🏠 מיקום אימון** - בית / חדר כושר / משולב
6. **🏠 ציוד ביתי** - 10 אפשרויות בסיסיות
7. **🏋️ ציוד ביתי מתקדם** - משקולות, רצועות, קטלבל...
8. **🏟️ ציוד חדר כושר** - משקולות חופשיות, מכונות...
9. **🥗 העדפות דיאטה** - ללא הגבלות / צמחוני / טבעוני / קטו / פליאו

## 🔧 תכונות טכניות

### לוגינג מותני:

```typescript
const DEBUG = __DEV__;
const dlog = (message: string, ...args: unknown[]) => {
  if (DEBUG) {
    console.debug(`[UnifiedQuestionnaireScreen] ${message}`, ...args);
  }
};
```

### ConfirmationModal:

```typescript
const showModal = (config: {
  title: string;
  message: string;
  onConfirm: () => void;
}) => {
  setConfirmationModal({ visible: true, ...config });
};
```

## ✅ סטטוס נוכחי

- ✅ **0 שגיאות קומפילציה**
- ✅ **ConfirmationModal** החליף Alert.alert
- ✅ **לוגינג מותני** החליף console.log
- ✅ **React.memo** לביצועים משופרים
- ✅ **תמיכה מלאה RTL**
- ✅ **גלילה מושלמת**

## 🚀 שימוש

```bash
npm run android  # או npm run ios
# היכנס לשאלון מהמסך הראשי
```

---

**המערכת מוכנה לשימוש! 🎉**
