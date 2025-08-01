# Authentication System Guide - מדריך מערכת ההתחברות

## 🔐 איך מערכת ההתחברות עובדת

### 🚀 **ניווט אוטומטי חדש (1 באוגוסט 2025)**

מערכת ההתחברות עכשיו עובדת אוטומטית וחכמה:

1. **פתיחת האפליקציה** → WelcomeScreen בודק אוטומטית אם יש משתמש מחובר
2. **משתמש מחובר** → ניווט ישיר למסך הבית (`MainApp`)
3. **משתמש לא מחובר** → הצגת מסך ברוכים הבאים הרגיל

```typescript
// WelcomeScreen.tsx - לוגיקת ניווט אוטומטי
useEffect(() => {
  const checkAuthStatus = async () => {
    // נתן זמן ל-store להתחזר מ-AsyncStorage
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isLoggedIn() && user) {
      console.log(
        "✅ WelcomeScreen - משתמש מחובר נמצא! מנווט למסך הבית:",
        user.email
      );
      navigation.navigate("MainApp");
      return;
    }

    console.log("ℹ️ WelcomeScreen - משתמש לא מחובר, מציג מסך ברוכים הבאים");
    setIsCheckingAuth(false);
  };

  checkAuthStatus();
}, [user, isLoggedIn, navigation]);
```

### 1️⃣ התחברות אוטומטית (Auto-Login):

כשפותחים את האפליקציה, Zustand טוען אוטומטיטת את נתוני המשתמש האחרון מ-AsyncStorage.

```typescript
// מתבצע אוטומטית בהפעלת האפליקציה
console.log("User store rehydrated:", user?.email);
```

### 2️⃣ התנתקות מלאה (Complete Logout):

כשמתנתקים, מוחקים **הכל** מהאחסון המקומי:

```typescript
import { useUserStore } from "../stores/userStore";

const { logout } = useUserStore();

// התנתקות מלאה - מוחקת הכל!
await logout();
```

## 🏠 **ניווט למסך הבית**

מערכת הניווט מובטחת שמשתמש מחובר תמיד יגיע למסך הבית:

```typescript
// BottomNavigation.tsx
<Tab.Navigator
  initialRouteName="Main" // מתחיל תמיד במסך הבית
  screenOptions={{...}}
>
```

**סדר הטאבים RTL:** פרופיל → היסטוריה → תוכניות → אימון → **בית**  
**ניווט ראשוני:** מסך הבית (חסכון זמן למשתמש)

## 🧹 מה נמחק בהתנתקות:

### נתוני משתמש בסיסיים:

- `user-storage` - נתוני המשתמש הראשיים
- `user_data` - מידע אישי
- `user_preferences` - העדפות

### נתוני שאלון:

- `questionnaire_metadata` - מטאדאטה של השאלון
- `questionnaire_answers` - תשובות השאלון
- `smart_questionnaire_results` - תוצאות שאלון חכם

### נתוני אימון:

- `workout_history` - היסטוריית אימונים
- `workout_plans` - תוכניות אימון
- `workout_statistics` - סטטיסטיקות
- `active_workout_data` - אימון פעיל

### נתוני AI:

- `ai_workout_data` - נתוני AI
- `ai_recommendations` - המלצות AI
- `ai_insights` - תובנות AI

### הגדרות:

- `notification_settings` - הגדרות התראות
- `theme_preferences` - העדפות עיצוב
- `app_settings` - הגדרות כלליות

**סה"כ: 25+ מפתחות נמחקים!**

## 📱 שימוש במסכים:

### בדיקת מצב התחברות:

```typescript
import { useAuthState } from '../stores/userStore';

function MyComponent() {
  const {
    user,
    isLoggedIn,
    logout,
    hasBasicInfo,
    hasQuestionnaire
  } = useAuthState();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!hasQuestionnaire) {
    return <QuestionnaireScreen />;
  }

  return <MainApp />;
}
```

### התנתקות עם אישור:

```typescript
const handleLogout = async () => {
  try {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  } catch (error) {
    console.error("שגיאה בהתנתקות:", error);
  }
};
```

## 🔄 התנהגות מצופה:

### ✅ התחברות רגילה:

1. פותח את האפליקציה
2. Zustand טוען את המשתמש מ-AsyncStorage
3. אם יש משתמש → עובר למסך הראשי
4. אם אין → עובר למסך התחברות

### ✅ התנתקות מלאה:

1. לוחץ "התנתק" בפרופיל
2. מופיע מודאל אישור עם רשימת מה ימחק
3. מאשר → מוחק הכל מ-AsyncStorage
4. עובר למסך הפתיחה
5. בפעם הבאה שפותח - אין זכרון של המשתמש

## 🚨 נקודות חשובות:

### אבטחה:

- **לא נשמרים סיסמאות** ב-AsyncStorage
- **רק טוקנים** או מידע לא רגיש
- **מחיקה מלאה** בהתנתקות

### ביצועים:

- **טעינה מהירה** - נתונים שמורים מקומית
- **ניקוי יעיל** - multiRemove במקום מחיקה אחת אחת
- **לוגים מפורטים** לדיבוג

### UX:

- **הודעות ברורות** למשתמש
- **אישור לפני מחיקה**
- **ניווט חלק** למסך הפתיחה

## 🧪 בדיקות:

### בדיקת התחברות אוטומטית:

1. התחבר למשתמש
2. סגור את האפליקציה לחלוטין
3. פתח מחדש
4. ✅ אמור להיכנס אוטומטית

### בדיקת התנתקות מלאה:

1. התנתק מהאפליקציה
2. סגור את האפליקציה
3. פתח מחדש
4. ✅ אמור להיכנס למסך פתיחה (לא מחובר)

---

**המערכת מוכנה ועובדת כמו שצריך! 🎉**
