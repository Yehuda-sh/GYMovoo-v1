# מדריך ניווט מתקדם - GYMovoo Smart Navigation System

## 🚀 עדכון מרכזי: מערכת ניווט חכמה (1 באוגוסט 2025)

### 💪 המערכת החדשה - AppNavigator.tsx מתקדם

המערכת עודכנה למערכת ניווט חכמה מתקדמת עם:

- 🎨 **אנימציות RTL מותאמות אישית** לכל מסך
- ⚡ **אופטימיזציות ביצועים מתקדמות**
- 🎯 **גסטורות חכמות** עם רספונסיביות מירבית
- 🎪 **אפקטים ויזואליים מתקדמים** למודלים ומסכים

## 📱 מבנה הניווט המתקדם

### Stack Navigator (ראשי) - עם אנימציות RTL חכמות

```
AppNavigator.tsx - ניווט ראשי מתקדם עם אלגוריתמים חכמים
├── Welcome - מסך ברוכים הבאים (אנימציה מיוחדת)
├── Login - התחברות (RTL animations)
├── Register - הרשמה (RTL animations)
├── Terms - תנאי שימוש (RTL animations)
├── Questionnaire - שאלון דינמי (מודל עם גסטורות אנכיות)
├── WorkoutPlan - תוכנית אימון AI (RTL optimized)
├── MainApp - אפליקציה ראשית (Bottom Tabs עם הגנה)
├── QuickWorkout - אימון פעיל (הגנה מפני יציאה בטעות)
├── ActiveWorkout - מסך תרגיל פעיל (ניווט בין תרגילים)
├── ExerciseList - רשימת תרגילים (מודל עם רקע כהה)
├── Notifications - התראות (RTL animations)
├── Progress - מסך התקדמות (אופטימיזציה לגרפים)
└── Exercises - ספריית תרגילים (אופטימיזציה לרשימות גדולות)
```

### 🎨 אנימציות RTL מותאמות אישית

```typescript
// אנימציה חכמה לכל מסך עברי
cardStyleInterpolator: ({ current, layouts }) => ({
  cardStyle: {
    transform: [{
      translateX: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0], // RTL slide
      }),
    }],
  },
}),
gestureDirection: "horizontal-inverted", // RTL gestures
```

### ⚡ אופטימיזציות ביצועים מתקדמות

```typescript
// אופטימיזציות חכמות לכל המסכים
screenOptions: {
  freezeOnBlur: true,              // חיסכון זיכרון
  detachPreviousScreen: false,     // אנימציות חלקות
  gestureResponseDistance: 200,    // רספונסיביות מירבית
  animationTypeForReplace: "push", // אנימציה עדינה
}
```

## 🎯 מסכים עם אופטימיזציות ייעודיות

### 📋 שאלון חכם (Questionnaire)

```typescript
options: {
  presentation: "modal",          // פתיחה כמודל מתקדם
  gestureDirection: "vertical",   // סגירה בגרירה למטה
  gestureResponseDistance: 200,   // רספונסיביות מירבית
  headerShown: false
}
```

### 💪 אימון פעיל (QuickWorkout)

```typescript
options: {
  gestureEnabled: false,          // הגנה מפני יציאה בטעות
  presentation: "card",
  cardStyle: {
    backgroundColor: "transparent" // רקע שקוף לאנימציות
  }
}
```

### 📊 רשימת תרגילים (ExerciseList)

```typescript
options: {
  presentation: "modal",          // פתיחה כמודל
  gestureDirection: "vertical",   // סגירה למטה
  cardStyle: {
    backgroundColor: "rgba(0,0,0,0.5)" // רקע כהה למודל
  }
}
```

### 📈 מסכי נתונים מותאמים

```typescript
// Progress Screen - אופטימיזציה לגרפים
Progress: {
  cardStyle: {
    backgroundColor: "rgba(248, 250, 252, 1)"; // רקע בהיר
  }
}

// Exercises Screen - אופטימיזציה לרשימות גדולות
Exercises: {
  freezeOnBlur: true; // חיסכון בביצועים
}
```

## 🔗 מפת קישורים מעודכנת

### מסכי Auth & Onboarding (עם RTL חלק)

- **WelcomeScreen** → Register, Login, Questionnaire (אנימציה מיוחדת)
- **LoginScreen** → Register (RTL animations)
- **RegisterScreen** → Login, Terms, Questionnaire (RTL animations)
- **TermsScreen** → (חזרה עם RTL animation)

### מסכים עיקריים (עם אופטימיזציות חכמות)

- **MainScreen** → כל המסכים עם navigation מותאם
- **ProfileScreen** → Questionnaire (עריכה במודל)
- **WorkoutPlansScreen** → QuickWorkout, Questionnaire (RTL optimized)
- **QuickWorkout** → הגנה מפני יציאה + רקע שקוף
- **ExerciseList** → מודל עם רקע כהה ואנימציות חלקות
  - **תכונות AI:** התקדמות אוטומטית, התאמה דינמית, למידה אישית
- **QuickWorkoutScreen** → Questionnaire
- **ExercisesScreen** → ExerciseList
- **ExerciseListScreen** → (מודל)

### מסכים חדשים וחדשנים

- **NotificationsScreen** - מסך התראות מלא עם הגדרות התאמה אישית
- **ProgressScreen** - מעקב התקדמות מתקדם עם גרפים וסטטיסטיקות
- **ExercisesScreen** - ספריית תרגילים מלאה עם 200+ תרגילים
- **HistoryScreen משופר** - תצוגת כרטיסי אימון עשירה עם משוב חזותי
- **WorkoutSummary משופר** - מסך סיום אימון עם זיהוי שיאים אישיים בזמן אמת

### רכיבים משותפים חדשים

- **LoadingSpinner** - ספינר טעינה אוניברסלי
- **EmptyState** - תצוגת מצב ריק עם פעולות
- **IconButton** - כפתור אייקון לשימוש חוזר
- **ConfirmationModal** - מודל אישור פעולות
- **InputField** - שדה קלט משופר עם RTL

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
  preSelectedDay?: number;
  requestedWorkoutIndex?: number;
  requestedWorkoutName?: string;
}
```

### QuickWorkout

```typescript
{
  exercises?: Exercise[];
  workoutName?: string;
  workoutId?: string;
  source?: "workout_plan" | "quick_start" | "day_selection";
  requestedDay?: number;
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
  selectedMuscleGroup?: string;
}
```

### ActiveWorkout

```typescript
{
  exercise: Exercise;
  exerciseIndex: number;
  totalExercises: number;
  workoutData?: {
    name?: string;
    startTime?: string;
    exercises?: Exercise[];
  };
  onExerciseUpdate?: (exercise: Exercise) => void;
  onNavigate?: (direction: "prev" | "next") => void;
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
  ActiveWorkout: { ... };
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
