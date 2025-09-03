# מדריך ניווט - GYMovoo Navigation System

## מבנה הניווט

### Stack Navigator (ראשי)

```
AppNavigator.tsx - ניווט ראשי
├── Welcome - מסך ברוכים הבאים
├── Login - התחברות
├── Register - הרשמה
├── Terms - תנאי שימוש
├── Questionnaire - שאלון אחוד
├── WorkoutPlan - תוכנית אימון
├── MainApp - אפליקציה ראשית (Bottom Tabs)
├── ActiveWorkout - מסך אימון פעיל
├── ExerciseList - רשימת תרגילים
├── Notifications - התראות
├── Progress - מסך התקדמות
└── Exercises - ספריית תרגילים
```

## 🔗 זרימת ניווט עיקרית

### מסכי Auth & Onboarding

- **WelcomeScreen** → Register, Login, UnifiedQuestionnaireScreen
- **LoginScreen** → Register
- **RegisterScreen** → Login, Terms, UnifiedQuestionnaireScreen
- **TermsScreen** → (חזרה)

### מסכים עיקריים

- **MainScreen** → כל המסכים
- **ProfileScreen** → UnifiedQuestionnaireScreen (עריכה)
- **WorkoutPlansScreen** → ActiveWorkout, UnifiedQuestionnaireScreen
- **ActiveWorkout** → תרגילים פעילים
- **ExerciseList** → מודל בחירת תרגילים
- **ExercisesScreen** → ExerciseList
- **HistoryScreen** → פרטי אימונים קודמים
- **NotificationsScreen** → הגדרות התראות
- **ProgressScreen** → מעקב התקדמות

## 📋 פרמטרים לניווט

### UnifiedQuestionnaireScreen

```typescript
{ stage?: "profile" | "training" }
```

### WorkoutPlansScreen

```typescript
{
  regenerate?: boolean;
  autoStart?: boolean;
  returnFromWorkout?: boolean;
  completedWorkoutId?: string;
}
```

### ActiveWorkout

```typescript
{
  exercises?: Exercise[];
  workoutName?: string;
  workoutId?: string;
  source?: "workout_plan" | "quick_start";
}
```

## 🛠️ טיפוסי TypeScript

### RootStackParamList

כל המסכים והפרמטרים מוגדרים ב-`src/navigation/types.ts`:

```typescript
export type RootStackParamList = {
  // Authentication & Onboarding
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Terms: undefined;
  Questionnaire: { stage?: "profile" | "training" };

  // Main Application
  WorkoutPlan: WorkoutPlanParams;
  ActiveWorkout: ActiveWorkoutParams;
  ExerciseList: ExerciseListParams;
  MainApp: undefined;

  // Additional Screens
  Notifications: undefined;
  Progress: undefined;
  Exercises: undefined;
};
```

## מבנה קבצים

```
src/
├── navigation/
│   ├── AppNavigator.tsx      # ניווט ראשי
│   ├── BottomNavigation.tsx  # ניווט תחתון
│   └── types.ts             # טיפוסי ניווט
└── screens/                 # כל המסכים
    ├── auth/               # מסכי התחברות
    ├── welcome/            # ברוכים הבאים
    ├── main/               # מסך ראשי
    ├── workout/            # מסכי אימון
    └── ...                 # שאר המסכים
```

## 🔧 פתרון בעיות נפוצות

### שגיאה: Route לא נמצא

1. וודא ש-route מוגדר ב-`types.ts`
2. וודא ש-Screen נוסף ל-`AppNavigator.tsx`
3. וודא שה-import תקין

### שגיאת TypeScript בניווט

1. בדוק את טיפוס הפרמטרים ב-`types.ts`
2. ייבא את `RootStackParamList` מ-`navigation/types`
3. השתמש ב-`NavigationProp<RootStackParamList>`

## 🆕 הוספת מסך חדש

1. צור קובץ מסך חדש ב-`src/screens/`
2. הוסף route ל-`src/navigation/types.ts`
3. ייבא המסך ב-`AppNavigator.tsx`
4. הוסף `<Stack.Screen>` חדש
5. עדכן תיעוד

---

**הערות:**

- מסמך זה מתמקד בתכונות הקריטיות של מערכת הניווט
- לפרטים טכניים נוספים ראה את הקוד ב-navigation/
