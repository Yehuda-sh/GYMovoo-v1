# מדריך ניווט - GYMovoo Navigation System

## מבנה הניווט

### Stack Navigator (ראשי)

```
AppNavigator.tsx - ניווט ראשי מתקדם עם RTL ואופטימיזציות ביצועים
├── Welcome - מסך ברוכים הבאים עם AI insights
├── Login - התחברות עם Google OAuth ואנליטיקה
├── Register - הרשמה עם הדרכה חכמה
├── Terms - תנאי שימוש עם אנליטיקה
├── Questionnaire - שאלון חכם עם AI
├── DeveloperScreen - מסך פיתוח (DEV only)
├── WorkoutPlan - תוכנית אימון חכמה עם AI
├── MainApp - אפליקציה ראשית (Bottom Tabs)
├── ActiveWorkout - מסך אימון פעיל עם AI coaching
├── ExerciseList - רשימת תרגילים עם AI filtering
├── ExerciseDetails - פרטי תרגיל מפורט עם AI insights
├── ExercisesScreen - ספריית תרגילים עם AI curation
├── Notifications - התראות עם AI filtering
└── Progress - התקדמות עם AI analytics
```

### Bottom Tab Navigator (5 טאבים RTL)

```
BottomNavigation.tsx - ניווט תחתון ישראלי מתקדם
├── Profile - פרופיל משתמש עם AI personalization (ראשון מימין)
├── History - היסטוריית אימונים עם AI analytics (שני מימין)
├── WorkoutPlans - תוכניות אימון עם AI optimization (מרכז)
├── QuickWorkout - אימון מהיר (שני משמאל)
└── Main - מסך בית עם AI dashboard (אחרון משמאל)
```

## 🔗 זרימת ניווט עיקרית

### מסכי Auth & Onboarding

- **WelcomeScreen** → Register, Login, Questionnaire
- **LoginScreen** → Register, Terms, MainApp
- **RegisterScreen** → Login, Terms, Questionnaire
- **TermsScreen** → (חזרה)
- **Questionnaire** → MainApp (אחרי השלמה)

### מסכים עיקריים

- **MainScreen** → כל המסכים
- **ProfileScreen** → Questionnaire (עריכה)
- **WorkoutPlansScreen** → ActiveWorkout, Questionnaire
- **ActiveWorkout** → תרגילים פעילים
- **ExerciseList** → מודל בחירת תרגילים
- **ExercisesScreen** → ExerciseList, ExerciseDetails
- **HistoryScreen** → פרטי אימונים קודמים
- **NotificationsScreen** → הגדרות התראות
- **ProgressScreen** → מעקב התקדמות

## 📋 פרמטרים לניווט

### AI & Analytics Types

```typescript
interface NavigationAIInsights {
  suggestedNextScreen?: keyof RootStackParamList;
  optimizationTips: string[];
  performanceScore: number;
  userBehaviorPattern: "efficient" | "exploring" | "confused" | "focused";
}

interface NavigationAnalytics {
  screenTime: number;
  interactions: number;
  lastVisited: string;
  frequency: number;
  userPreference: number;
}

interface NavigationPerformanceConfig {
  lazyLoading: boolean;
  cacheStrategy: "aggressive" | "balanced" | "minimal";
  preloadScreens: (keyof RootStackParamList)[];
  analyticsEnabled: boolean;
}
```

### UnifiedQuestionnaireScreen

```typescript
{
  stage?: "profile" | "training" | "ai_analysis" | "personalization";
  aiInsights?: NavigationAIInsights;
  performanceTracking?: boolean;
}
```

### WorkoutPlanScreen

```typescript
{
  regenerate?: boolean;
  autoStart?: boolean;
  returnFromWorkout?: boolean;
  completedWorkoutId?: string;
  aiRecommendations?: string[];
  performanceInsights?: NavigationAnalytics;
  smartOptimization?: boolean;
}
```

### ActiveWorkout

```typescript
{
  workoutData: {
    name: string;
    dayName: string;
    startTime: string;
    exercises: WorkoutExercise[];
  };
  pendingExercise?: {
    id: string;
    name: string;
    muscleGroup?: string;
    equipment?: string;
  };
  aiCoaching?: boolean;
  performanceTracking?: NavigationAnalytics;
  smartSuggestions?: string[];
}
```

### ExerciseList

```typescript
{
  fromScreen?: string;
  mode?: "view" | "selection" | "ai_curation" | "smart_filtering";
  onSelectExercise?: (exercise: WorkoutExercise) => void;
  selectedMuscleGroup?: string;
  aiFiltering?: boolean;
  smartRecommendations?: WorkoutExercise[];
  performanceOptimization?: boolean;
}
```

### ExerciseDetails

```typescript
{
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  exerciseData?: {
    equipment?: string;
    difficulty?: string;
    instructions?: string[];
    benefits?: string[];
    tips?: string[];
  };
  aiInsights?: NavigationAIInsights;
  personalizedTips?: string[];
  performanceData?: NavigationAnalytics;
}
```

## 🛠️ טיפוסי TypeScript

### RootStackParamList

כל המסכים והפרמטרים מוגדרים ב-`src/navigation/types.ts`:

```typescript
export type RootStackParamList = {
  // Authentication & Onboarding
  Welcome:
    | {
        aiInsights?: NavigationAIInsights;
        performanceConfig?: NavigationPerformanceConfig;
      }
    | undefined;
  Login: {
    google?: boolean;
    analytics?: NavigationAnalytics;
    aiSuggestions?: string[];
  };
  Register: { aiGuidance?: boolean; performanceTracking?: boolean } | undefined;
  Terms:
    | { source?: keyof RootStackParamList; analytics?: NavigationAnalytics }
    | undefined;
  DeveloperScreen: undefined;
  Questionnaire: {
    stage?: QuestionnaireStage;
    aiInsights?: NavigationAIInsights;
    performanceTracking?: boolean;
  };

  // Workout & Exercise Screens
  WorkoutPlan: BaseWorkoutParams & {
    aiRecommendations?: string[];
    performanceInsights?: NavigationAnalytics;
    smartOptimization?: boolean;
  };
  ActiveWorkout: {
    workoutData: {
      name: string;
      dayName: string;
      startTime: string;
      exercises: WorkoutExercise[];
    };
    pendingExercise?: {
      id: string;
      name: string;
      muscleGroup?: string;
      equipment?: string;
    };
    aiCoaching?: boolean;
    performanceTracking?: NavigationAnalytics;
    smartSuggestions?: string[];
  };
  ExerciseList: {
    fromScreen?: string;
    mode?: ExerciseListMode;
    onSelectExercise?: (exercise: WorkoutExercise) => void;
    selectedMuscleGroup?: string;
    aiFiltering?: boolean;
    smartRecommendations?: WorkoutExercise[];
    performanceOptimization?: boolean;
  };
  ExerciseDetails: {
    exerciseId: string;
    exerciseName: string;
    muscleGroup: string;
    exerciseData?: {
      equipment?: string;
      difficulty?: string;
      instructions?: string[];
      benefits?: string[];
      tips?: string[];
    };
    aiInsights?: NavigationAIInsights;
    personalizedTips?: string[];
    performanceData?: NavigationAnalytics;
  };
  ExercisesScreen: {
    selectedMuscleGroup?: string;
    filterTitle?: string;
    returnScreen?: string;
    aiCuration?: boolean;
    smartFiltering?: boolean;
    performanceOptimized?: boolean;
  };

  // Main Application
  MainApp:
    | {
        aiInsights?: NavigationAIInsights;
        performanceConfig?: NavigationPerformanceConfig;
      }
    | undefined;

  // Additional Screens
  Notifications:
    | {
        aiFiltering?: boolean;
        priorityLevel?: "high" | "medium" | "low";
        performanceTracking?: NavigationAnalytics;
      }
    | undefined;
  Progress:
    | {
        aiAnalytics?: boolean;
        performanceInsights?: NavigationAIInsights;
        timeRange?: "7d" | "30d" | "90d" | "all";
      }
    | undefined;

  // Bottom Tabs
  Main:
    | {
        aiDashboard?: boolean;
        performanceInsights?: NavigationAIInsights;
        smartRecommendations?: string[];
      }
    | undefined;
  WorkoutPlans: ExtendedWorkoutParams & {
    aiOptimization?: boolean;
    performanceAnalytics?: NavigationAnalytics;
    smartCuration?: boolean;
  };
  History:
    | {
        aiAnalytics?: boolean;
        performanceInsights?: NavigationAIInsights;
        smartFiltering?: boolean;
      }
    | undefined;
  Profile:
    | {
        aiPersonalization?: boolean;
        performanceTracking?: NavigationAnalytics;
        smartRecommendations?: string[];
      }
    | undefined;
};
```

## מבנה קבצים

```
src/
├── navigation/
│   ├── AppNavigator.tsx      # ניווט ראשי מתקדם עם RTL ואופטימיזציות
│   ├── BottomNavigation.tsx  # ניווט תחתון עם 5 טאבים RTL
│   └── types.ts             # טיפוסי ניווט מתקדמים עם AI
└── screens/                 # כל המסכים
    ├── auth/               # מסכי התחברות
    ├── developer/          # מסך פיתוח
    ├── welcome/            # ברוכים הבאים
    ├── main/               # מסך בית
    ├── workout/            # מסכי אימון
    ├── exercise/           # רשימת תרגילים
    ├── exercises/          # ספריית תרגילים ופרטי תרגיל
    ├── history/            # היסטוריית אימונים
    ├── profile/            # פרופיל משתמש
    ├── notifications/      # התראות
    ├── progress/           # התקדמות
    └── questionnaire/       # שאלון חכם
```

## 🔧 פתרון בעיות נפוצות

### שגיאה: Route לא נמצא

1. וודא ש-route מוגדר ב-`types.ts`
2. וודא ש-Screen נוסף ל-`AppNavigator.tsx` או `BottomNavigation.tsx`
3. וודא שה-import תקין
4. בדוק אם זה Bottom Tab או Stack Screen

### שגיאת TypeScript בניווט

1. בדוק את טיפוס הפרמטרים ב-`types.ts`
2. ייבא את `RootStackParamList` מ-`navigation/types`
3. השתמש ב-`NavigationProp<RootStackParamList>`
4. וודא שכל הפרמטרים האופציונליים כוללים `| undefined`

### בעיות AI & Analytics

1. וודא ש-`NavigationAIInsights` מיובא
2. בדוק ש-`NavigationAnalytics` מוגדר נכון
3. וודא ש-`NavigationPerformanceConfig` משמש כראוי

## 🆕 הוספת מסך חדש

### Stack Screen

1. צור קובץ מסך חדש ב-`src/screens/`
2. הוסף route ל-`src/navigation/types.ts`
3. ייבא המסך ב-`AppNavigator.tsx`
4. הוסף `<Stack.Screen>` חדש
5. עדכן תיעוד

### Bottom Tab

1. צור קובץ מסך חדש ב-`src/screens/`
2. הוסף route ל-`src/navigation/types.ts`
3. ייבא המסך ב-`BottomNavigation.tsx`
4. הוסף `<Tab.Screen>` חדש עם אייקון ואפשרויות
5. עדכן תיעוד

## 🤖 תכונות AI & Analytics

### מסכים עם תמיכת AI

- Welcome, Login, Questionnaire, WorkoutPlan, ActiveWorkout, Main, Profile
- כל אחד עם פרמטרים מתקדמים של AI insights ואנליטיקה

### כלי עזר AI

```typescript
// בדיקה אם מסך תומך ב-AI
isAISupportedScreen(screen: keyof RootStackParamList): boolean

// יצירת פרמטרים עם AI
createAIEnabledParams<T extends keyof RootStackParamList>(
  screen: T,
  baseParams: RootStackParamList[T],
  aiInsights?: NavigationAIInsights
): ScreenParams<T>
```

---

**הערות:**

- מסמך זה מתמקד בתכונות הקריטיות של מערכת הניווט המתקדמת
- לפרטים טכניים נוספים ראה את הקוד ב-navigation/
- התיעוד מעודכן לתאריך 2025-09-03
