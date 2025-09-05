# 📋 מערכת השאלון האחודה

**עודכן לאחרונה: 5 ספטמבר 2025**

## 🎯 מטרה

מערכת שאלון מתקדמת ואחודה עם תמיכה מלאה ב-RTL, גלילה מושלמת ואנימציות מתקדמות.

## 📁 קבצים עיקריים

### 1. `src/data/unifiedQuestionnaire.ts`

- כל סוגי השאלות והאפשרויות
- נתוני ציוד מאורגנים (ביתי, חדר כושר)
- מנהל השאלון (`UnifiedQuestionnaireManager`)

### 2. `src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx`

- ScrollView מושלם
- תמיכה מלאה ב-RTL ועברית
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
