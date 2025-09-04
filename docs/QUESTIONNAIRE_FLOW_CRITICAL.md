# 🚨 זרימת השאלון - קריטי לתפקוד האפליקציה

## ⚠️ אזהרה חשובה

**אין לשנות את הזרימה הזו ללא תיאום מלא! השינויים הללו נבדקו ואושרו.**

## זרימה נכונה ואמינה

### 1. מצב התחלתי

- אין משתמש במערכת (`hasUser: false`)
- אין נתוני שאלון שמורים

### 2. זרימת השאלון

```
WelcomeScreen → UnifiedQuestionnaireScreen → RegisterScreen → MainScreen
```

### 3. הלוגיקה החיונית ב-userStore.ts

#### getCompletionStatus - קריטי!

```typescript
const isFullySetup = hasSmartQuestionnaire && hasBasicInfo;
```

**לא לשנות!** המשתמש נחשב "fully setup" רק אם יש לו:

- ✅ שאלון מושלם (`hasSmartQuestionnaire`)
- ✅ מידע בסיסי (`hasBasicInfo` - ID/email)

#### setSmartQuestionnaireData - קריטי!

```typescript
if (state.user?.email) {
  // עדכון משתמש קיים בלבד
  set((state) => ({ user: { ...state.user!, smartquestionnairedata: data } }));
} else {
  // אם אין משתמש - רק שמירה ב-AsyncStorage
  logger.debug(
    "Store",
    "No user found, saving questionnaire data to AsyncStorage only"
  );
}
```

**לא לשנות!** הפונקציה לא יוצרת משתמש חדש אם אין כזה.

### 4. תוצאות מבחן מוצלח

#### לוגים מצופים

```
"No user ID - proceeding with local data only"
"Questionnaire completed - redirecting to Register"
```

#### זרימה מוצלחת

1. שאלון מושלם ✅
2. נתונים נשמרים ב-AsyncStorage ✅
3. לא נוצר משתמש אנונימי ✅
4. הפניה למסך הרשמה ✅

## 🚫 מה אסור לעשות

### אסור לשנות:

- לוגיקת `getCompletionStatus`
- לוגיקת `setSmartQuestionnaireData`
- זרימת הניווט שלאחר השאלון
- קובץ AppNavigator.tsx ללא תיאום

### אסור ליצור:

- משתמש אנונימי בסיום השאלון
- מעקפים לזרימת ההרשמה

## ✅ מה מותר לעשות

### מותר לשנות:

- עיצוב השאלון (UI/UX)
- שאלות בשאלון (בתוך unifiedQuestionnaire.ts)
- אנימציות וטרנזישנים
- לוגים (ללא שינוי הלוגיקה)

### מותר להוסיף:

- תכונות UI חדשות
- אמצעי נגישות
- אופטימיזציות ביצועים (ללא שינוי לוגיקה)

## 📋 רשימת בדיקות לפני שינויים

לפני כל שינוי בקבצים הקשורים לשאלון:

1. ✅ לוודא שהזרימה עדיין: שאלון → הרשמה → בית
2. ✅ לבדוק שלא נוצר משתמש אנונימי
3. ✅ לוודא שהלוג "redirecting to Register" מופיע
4. ✅ לבדוק שנתוני השאלון נשמרים ב-AsyncStorage
5. ✅ לוודא ש-getCompletionStatus מחזיר נכון

## 📁 קבצים קריטיים

### אסור לשנות בלי תיאום:

- `src/stores/userStore.ts` (functions: getCompletionStatus, setSmartQuestionnaireData)
- `src/navigation/AppNavigator.tsx`
- `src/screens/welcome/WelcomeScreen.tsx` (logic parts)

### מותר לשנות בזהירות:

- `src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx` (UI only)
- `src/data/unifiedQuestionnaire.ts` (questions content)

## 📝 היסטוריית תיקונים

### 4.9.2025 - תיקון קריטי ✅

- **בעיה**: השאלון יצר משתמש אנונימי והעביר ישר למסך הבית
- **פתרון**: תוקן getCompletionStatus ו-setSmartQuestionnaireData
- **תוצאה**: זרימה נכונה - שאלון → הרשמה → בית
- **נבדק**: ✅ מבחן מלא עבר בהצלחה

### 4.9.2025 - ניקוי לוגים ✅

- **שינוי**: הוחלף לוגינג לשלבים קריטיים בלבד
- **לוגים חשובים**: שמירות נתונים, מעברי מסכים, שגיאות
- **הוסר**: לוגים פרטניים של לחיצות כפתורים ופעולות רגילות
- **תוצאה**: קוד נקי יותר עם לוגים רלוונטיים בלבד

## 🎯 לוגים קריטיים לעקוב אחריהם

### לוגים של שלבים חשובים:

- `"Smart questionnaire data set successfully"` - שמירה בחנות
- `"smart_questionnaire_results נשמר"` - שמירה ב-AsyncStorage
- `"No user found, saving questionnaire data to AsyncStorage only"` - זיהוי משתמש חסר
- `"Questionnaire completed - redirecting to Register"` - מעבר מסך

### לוגים של שגיאות:

- `"CRITICAL: Failed persisting smart_questionnaire_results"` - כישלון שמירה
- `"שגיאה בשמירת השאלון החכם"` - שגיאת AsyncStorage
- `"Fallback save also failed"` - כישלון גיבוי

---

**⚡ זכור: כל שינוי בזרימה הזו יכול לשבור את האפליקציה!**
