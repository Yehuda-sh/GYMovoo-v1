# מדריך מסכי GYMovoo 📱💪

## סקירה כללית

מדריך מקיף לכל מסכי האפליקציה GYMovoo. כל מסך מתועד בנפרד עם פרטים טכניים ותכונות.

## 🗂️ אינדקס מסכים לפי קטגוריה

### 🔐 מסכי אימות (Authentication)

**[📄 מדריך מסכי אימות](./AUTH_SCREENS_GUIDE.md)**

מסכים: LoginScreen, RegisterScreen, TermsScreen

---

### 🏠 מסך ראשי (Main Dashboard)

**[📄 מדריך מסך ראשי](./MAIN_SCREEN_GUIDE.md)**

מסך: MainScreen

---

### 🏋️ מסכי אימונים (Workout)

**[📄 מדריך מסכי אימונים](./WORKOUT_SCREENS_GUIDE.md)**

מסכים: WorkoutPlansScreen, ActiveWorkoutScreen

---

### 💪 מסכי תרגילים (Exercise Library)

**[📄 מדריך מסכי תרגילים](./EXERCISE_SCREENS_GUIDE.md)**

מסכים: ExerciseListScreen, ExerciseDetailsModal, ExercisesScreen

---

### 📋 מסך שאלון אחוד (Unified Questionnaire)

**[📄 מדריך מסך שאלון](./QUESTIONNAIRE_SCREENS_GUIDE.md)**

מסך: UnifiedQuestionnaireScreen

---

### 👤📊 מסכי פרופיל והיסטוריה (Profile & Analytics)

**[📄 מדריך פרופיל והיסטוריה](./PROFILE_HISTORY_SCREENS_GUIDE.md)**

מסכים: ProfileScreen, HistoryScreen, ProgressScreen, NotificationsScreen

---

### 🎉 מסך ברוכים הבאים (Welcome)

**[📄 מדריך מסך ברוכים הבאים](./WELCOME_SCREEN_GUIDE.md)**

מסך: WelcomeScreen

---

## 🔄 זרימת ניווט כללית

```
WelcomeScreen
    ↓
[התחברות/הרשמה]
    ↓
LoginScreen / RegisterScreen
    ↓
UnifiedQuestionnaireScreen (אם הרשמה חדשה)
    ↓
MainScreen (דשבורד ראשי)
    ├── WorkoutPlansScreen → ActiveWorkoutScreen
    ├── ExercisesScreen → ExerciseListScreen
    ├── ProfileScreen
    ├── HistoryScreen
    ├── ProgressScreen
    └── NotificationsScreen
```

## 🎯 תכונות מרכזיות

- **RTL מלא:** תמיכה בעברית עם כיוון מימין לשמאל
- **TypeScript מלא:** 100% type safety ללא any
- **Theme מאוחד:** עיצוב עקבי מ-theme.ts
- **Navigation מתקדם:** ניווט חלק עם React Navigation
- **אחסון מקומי:** AsyncStorage לכל הנתונים

## ️ מידע טכני

### סטנדרטים טכניים:

- **React Native 0.74+**
- **TypeScript 5.0+**
- **Expo SDK 51**
- **Zustand למצב גלובלי**
- **React Navigation 6**
- **AsyncStorage לנתונים מקומיים**

---

**עדכון אחרון:** ספטמבר 2025  
**מתחזק:** GYMovoo Development Team
