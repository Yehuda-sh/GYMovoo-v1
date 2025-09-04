# Authentication System Guide - מדריך מערכת ההתחברות

## 🔐 איך מערכת ההתחברות עובדת

### ניווט אוטומטי

מערכת ההתחברות עובדת אוטומטית:

1. **פתיחת האפליקציה** → אם יש משתמש + שאלון מלא → MainApp / אם יש משתמש בלי שאלון → Questionnaire / אחרת Welcome
2. **משתמש מחובר ללא שאלון** → Redirect מיידי ל-Questionnaire (Guard)
3. **משתמש לא מחובר** → Welcome → Questionnaire (איסוף תשובות) → Register (צירוף תשובות) → MainApp

### התחברות אוטומטית (Auto-Login)

כשפותחים את האפליקציה, Zustand טוען אוטומטית את נתוני המשתמש האחרון מ-AsyncStorage.

### התנתקות מלאה (Complete Logout)

כשמתנתקים, מוחקים **הכל** מהאחסון המקומי:

- נתוני משתמש בסיסיים
- נתוני שאלון ותוצאות
- נתוני אימון והיסטוריה
- הגדרות והעדפות

## 📱 שימוש במסכים

### בדיקת מצב התחברות:

```typescript
import { useAuthState } from '../stores/userStore';

function MyComponent() {
  const { user, isLoggedIn, hasQuestionnaire } = useAuthState();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!hasQuestionnaire) {
    return <UnifiedQuestionnaireScreen />;
  }

  return <MainApp />;
}
```

## 🔄 התנהגות מצופה

### ✅ התחברות רגילה (מעודכן):

1. פתיחת אפליקציה
2. טוען משתמש מקומי (אם קיים)
3. אם user && hasQuestionnaire → MainApp
4. אם user && !hasQuestionnaire → Questionnaire (אי אפשר לדלג)
5. אם אין משתמש → Welcome → Questionnaire → Register → MainApp

### ✅ התנתקות מלאה:

1. לוחץ "התנתק" בפרופיל
2. מופיע אישור
3. מאשר → מוחק הכל מ-AsyncStorage
4. עובר למסך הפתיחה

## 🚨 נקודות חשובות

### אבטחה:

- לא נשמרות סיסמאות ב-AsyncStorage
- רק טוקנים או מידע לא רגיש
- מחיקה מלאה בהתנתקות

### ביצועים:

- טעינה מהירה - נתונים שמורים מקומית
- ניקוי יעיל עם multiRemove
- לוגים מפורטים לדיבוג

---

### 🛡️ Guards חדשים

- MainScreen: לפני רינדור – בדיקה אם יש questionnairedata/smartquestionnairedata/hasQuestionnaire אחרת redirect
- Questionnaire: בעת השלמה ללא משתמש → reset ל-Register (ולא MainApp)
- Register: אם קיימים smart_questionnaire_results מקומיים → מצרף ונכנס ל-MainApp עם reset

**המערכת מעודכנת ועובדת עם זרימת Onboarding קשיחה! 🎉**
