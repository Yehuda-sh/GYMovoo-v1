# מדריך ניווט מקיף - GYMovoo

## 📱 מבנה הניווט

### Stack Navigator (ראשי)

```
AppNavigator.tsx - ניווט ראשי של האפליקציה
├── Welcome - מסך ברוכים הבאים
├── Login - התחברות
├── Register - הרשמה
├── Terms - תנאי שימוש
├── Questionnaire - שאלון דינמי
├── WorkoutPlan - תוכנית אימון AI
├── MainApp - אפליקציה ראשית (Bottom Tabs)
├── QuickWorkout - אימון פעיל
├── ExerciseList - רשימת תרגילים
├── Notifications - התראות
├── Progress - מסך התקדמות
└── Exercises - ספריית תרגילים
```

### Bottom Tab Navigator (תוך האפליקציה)

```
BottomNavigation.tsx - ניווט תחתון
├── Main - מסך ראשי
├── WorkoutPlans - תוכניות אימון AI
├── QuickWorkout - אימון מהיר
├── History - היסטוריית אימונים
└── Profile - פרופיל משתמש
```

## 🔗 מפת קישורים

### מסכי Auth & Onboarding

- **WelcomeScreen** → Register, Login, Questionnaire
- **LoginScreen** → Register
- **RegisterScreen** → Login, Terms, Questionnaire
- **TermsScreen** → (חזרה)

### מסכים עיקריים

- **MainScreen** → Profile, Notifications, Questionnaire, WorkoutPlans, Exercises, Progress, History, QuickWorkout
- **ProfileScreen** → Questionnaire (עריכה)
- **WorkoutPlansScreen** → QuickWorkout, Questionnaire
- **QuickWorkoutScreen** → Questionnaire
- **ExercisesScreen** → ExerciseList
- **ExerciseListScreen** → (מודל)

### מסכים חדשים

- **NotificationsScreen** - מסך התראות (בקרוב)
- **ProgressScreen** - מעקב התקדמות (בקרוב)
- **ExercisesScreen** - ספריית תרגילים מלאה

## 📋 פרמטרים לניווט

### Questionnaire

```typescript
{ stage?: "profile" | "training" }
```

### WorkoutPlan / WorkoutPlans

```typescript
{
  regenerate?: boolean;
  autoStart?: boolean;
  returnFromWorkout?: boolean;
  completedWorkoutId?: string;
}
```

### QuickWorkout

```typescript
{
  exercises?: Exercise[];
  workoutName?: string;
  workoutId?: string;
  source?: "workout_plan" | "quick_start";
  planData?: {
    targetMuscles: string[];
    estimatedDuration: number;
    equipment: string[];
  };
}
```

### ExerciseList

```typescript
{
  fromScreen?: string;
  mode?: "view" | "selection";
  onSelectExercise?: (exercise: Exercise) => void;
}
```

## 🛠️ טיפוסי TypeScript

### RootStackParamList

כל המסכים והפרמטרים שלהם מוגדרים ב-`src/navigation/types.ts`:

```typescript
export type RootStackParamList = {
  Welcome: undefined;
  Login: { google?: boolean };
  Register: undefined;
  Terms: undefined;
  Questionnaire: { stage?: "profile" | "training" };
  WorkoutPlan: { ... };
  MainApp: undefined;
  QuickWorkout: { ... };
  ExerciseList: { ... };
  Notifications: undefined;
  Progress: undefined;
  Exercises: undefined;
  WorkoutPlans: { ... };
  Profile: undefined;
  History: undefined;
  Main: undefined;
};
```

## 🔍 כלי בדיקה

### סקריפט checkNavigation.js

```bash
node scripts/checkNavigation.js
```

בודק:

- התאמה בין routes לcomponents
- קישורי ניווט תקינים
- imports של מסכים

### סקריפט checkMissingComponents.js

```bash
node scripts/checkMissingComponents.js
```

בודק:

- imports חסרים
- קבצים שלא קיימים
- קישורים שבורים

## 📁 מבנה קבצים

```
src/
├── navigation/
│   ├── AppNavigator.tsx      # ניווט ראשי
│   ├── BottomNavigation.tsx  # ניווט תחתון
│   └── types.ts             # טיפוסי ניווט
├── screens/
│   ├── auth/                # מסכי התחברות
│   ├── welcome/            # מסך ברוכים הבאים
│   ├── main/               # מסך ראשי
│   ├── profile/            # פרופיל
│   ├── workout/            # מסכי אימון
│   ├── exercise/           # מסכי תרגילים
│   ├── exercises/          # ספריית תרגילים
│   ├── questionnaire/      # שאלון
│   ├── history/            # היסטוריה
│   ├── progress/           # התקדמות
│   └── notifications/      # התראות
└── components/             # רכיבים משותפים
```

## ✅ רשימת בדיקות

### לפני Release

- [ ] כל המסכים נטענים בלי שגיאות
- [ ] כל הקישורים עובדים
- [ ] פרמטרים מועברים נכון
- [ ] Back navigation עובד
- [ ] Deep linking עובד
- [ ] TypeScript validation עובר
- [ ] כל ה-imports קיימים

### בדיקות אוטומטיות

```bash
# בדיקת TypeScript
npx tsc --noEmit

# בדיקת ESLint
npx eslint src/

# בדיקת ניווט
node scripts/checkNavigation.js

# בדיקת רכיבים
node scripts/checkMissingComponents.js
```

## 🔧 פתרון בעיות נפוצות

### שגיאה: Route לא נמצא

1. וודא ש-route מוגדר ב-`types.ts`
2. וודא ש-Screen נוסף ל-`AppNavigator.tsx`
3. וודא שה-import תקין

### שגיאת TypeScript בניווט

1. בדיק את טיפוס הפרמטרים ב-`types.ts`
2. ייבא את `RootStackParamList` מ-`navigation/types`
3. השתמש ב-`NavigationProp<RootStackParamList>`

### מסך לא נטען

1. בדיק את ה-import במסך המקור
2. וודא שהמסך קיים בתיקייה הנכונה
3. בדיק שהמסך מייצא default export

## 📚 המלצות לפיתוח

1. **Type Safety** - תמיד השתמש בטיפוסי TypeScript לניווט
2. **Naming Convention** - השתמש בשמות עקביים למסכים ו-routes
3. **Parameters** - תעד את כל הפרמטרים של המסכים
4. **Testing** - רוץ בדיקות אוטומטיות לפני commit
5. **Documentation** - עדכן תיעוד כשמוסיפים מסכים חדשים

## 🆕 הוספת מסך חדש

1. צור קובץ מסך חדש ב-`src/screens/`
2. הוסף route ל-`src/navigation/types.ts`
3. ייבא המסך ב-`AppNavigator.tsx`
4. הוסף `<Stack.Screen>` חדש
5. עדכן תיעוד
6. רוץ בדיקות אוטומטיות
