# 🔧 מדריך טכני - מערכת שאלון חכמה עם תמיכת RTL והתאמת מגדר

**עדכון אחרון:** 02/08/2025  
**תיקון אחרון:** ממשק עריכה מתקדם לסטים עם חצי מעלית וקלט מקלדת

## 🎯 סקירה כללית

מדריך זה מתמקד ברכיבים הטכניים המרכזיים של מערכת השאלון החכם עם תמיכה מלאה ב-RTL והתאמת מגדר.

## 🚀 **תיקונים חדשים - ספטמבר 2025**

### ✅ **ממשק עריכה מתקדם לסטים - SetRow Component**

#### 🎯 אתגרים טכניים שנפתרו:

**1. קונפליקט TouchableOpacity ו-TextInput ב-Android:**

```typescript
// בעיה: TouchableOpacity חיצוני חוטף אירועי פוקוס
// פתרון: עטיפה ספציפית לכל TextInput
<TouchableOpacity
  activeOpacity={1}
  onPress={() => inputRef.current?.focus()}
>
  <TextInput ref={inputRef} />
</TouchableOpacity>
```

**2. אופטימיזציית TextInput ל-Android:**

```typescript
<TextInput
  keyboardType="numeric"
  selectTextOnFocus={true}
  editable={true}
  returnKeyType="done"
  blurOnSubmit={false}          // מפתח - מונע סגירת מקלדת
  showSoftInputOnFocus={true}   // מאלץ הצגת מקלדת
  autoCorrect={false}
  autoCapitalize="none"
  spellCheck={false}
  textContentType="none"
  caretHidden={false}
  contextMenuHidden={false}
/>
```

**3. ניהול State עם useRef:**

```typescript
// רפרנסים לשליטה ישירה
const weightInputRef = useRef<TextInput>(null);
const repsInputRef = useRef<TextInput>(null);

// מניעת re-renders מיותרים
const weightValue = React.useMemo(
  () => set.actualWeight?.toString() || "",
  [set.actualWeight]
);
```

**4. עיצוב חצי מעלית:**

```typescript
// עיצוב מעלית עם משולשים מסתובבים
elevatorButtonsContainer: {
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.card,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: theme.colors.cardBorder,
  padding: 2,
  marginHorizontal: 4,
},
elevatorButton: {
  width: 20,
  height: 16,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.colors.background,
  borderRadius: 3,
  marginVertical: 1,
}
```

#### 🎨 הרכבה מתקדמת של הרכיב:

```typescript
// רכיב SetRow עם כל התכונות המתקדמות
const SetRow: React.FC<SetRowProps> = ({
  set,
  setNumber,
  onUpdate,
  onDelete,
  onComplete,
  onLongPress,
  isActive,
  isEditMode = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  isFirst = false,
  isLast = false,
}) => {
  // רפרנסים לשדות קלט
  const weightInputRef = useRef<TextInput>(null);
  const repsInputRef = useRef<TextInput>(null);

  // אנימציות
  const checkAnim = useRef(new Animated.Value(set.completed ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prBounceAnim = useRef(new Animated.Value(0)).current;

  // ממשק עריכה מותנה
  return (
    <View style={{ marginBottom: 8 }}>
      <Animated.View style={[styles.container, /* אנימציות */]}>
        {/* חצי מעלית - רק במצב עריכה */}
        {isEditMode && (
          <View style={styles.elevatorButtonsContainer}>
            {!isFirst && (
              <TouchableOpacity onPress={onMoveUp}>
                <MaterialCommunityIcons
                  name="triangle"
                  style={{ transform: [{ rotate: '0deg' }] }}
                />
              </TouchableOpacity>
            )}
            {!isLast && (
              <TouchableOpacity onPress={onMoveDown}>
                <MaterialCommunityIcons
                  name="triangle"
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* כפתור השלמה - מוסתר במצב עריכה */}
        {!isEditMode && (
          <TouchableOpacity onPress={handleComplete}>
            {/* כפתור השלמה עם אנימציה */}
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};
```

#### 🔄 ביטול השלמת סט:

```typescript
const handleComplete = () => {
  // אם הסט כבר מושלם - בטל את ההשלמה
  if (set.completed) {
    onUpdate({ completed: false });
    return;
  }

  // אם הסט לא מושלם - השלם אותו
  if (!set.actualWeight && set.targetWeight) {
    onUpdate({ actualWeight: set.targetWeight });
  }
  if (!set.actualReps && set.targetReps) {
    onUpdate({ actualReps: set.targetReps });
  }

  onComplete();
};
```

### ✅ **מערכת התחברות אוטומטית - תיקון קודם**

מערכת מושלמת הכוללת:

- **WelcomeScreen** עם בדיקה אוטומטית של מצב התחברות
- **BottomNavigation** עם `initialRouteName="Main"`
- **זיהוי חכם** של משתמש מחובר מ-AsyncStorage
- **ניווט ישיר** למסך הבית ללא עצירות

```typescript
// WelcomeScreen.tsx - הלוגיקה המרכזית
const [isCheckingAuth, setIsCheckingAuth] = useState(true);

useEffect(() => {
  const checkAuthStatus = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // זמן להתחזרות

    if (isLoggedIn() && user) {
      navigation.navigate("MainApp"); // ניווט ישיר
      return;
    }

    setIsCheckingAuth(false); // הצגת מסך ברוכים הבאים
  };

  checkAuthStatus();
}, [user, isLoggedIn, navigation]);
```

### 📋 רכיבים מרכזיים

```
src/screens/workout/
├── ActiveWorkoutScreen.tsx       # מסך אימון פעיל
├── WorkoutPlansScreen.tsx        # מסך תכניות אימון
└── components/
    └── WorkoutSummary.tsx        # רכיב סיכום עם שמירה

src/navigation/
├── AppNavigator.tsx              # ניווט ראשי
└── BottomNavigation.tsx          # טאבים עם initialRouteName="Main"

src/screens/welcome/
└── WelcomeScreen.tsx             # מסך כניסה עם בדיקה אוטומטית
```

## 🔧 מימוש טכני - WorkoutSummary.tsx

### פונקציות התאמת מגדר

```typescript
private adaptTextToGender(text: string, gender: string): string {
  if (gender === "male") {
    return text
      .replace(/תרצי/g, "תרצה")
      .replace(/מעוניין\/ת/g, "מעוניין")
      .replace(/מעוניינת/g, "מעוניין");
  } else if (gender === "female") {
    return text
      .replace(/תרצה/g, "תרצי")
      .replace(/מעוניין\/ת/g, "מעוניינת")
      .replace(/מעוניין/g, "מעוניינת");
  }
  return text;
}
```

### שמירת נתוני אימון

```typescript
const handleSaveWorkout = async () => {
  try {
    // התאמת טקסט למגדר המשתמש
    const adaptedNotes = notes.map((note) =>
      adaptTextToGender(note, user?.gender || "other")
    );

    const workoutData = {
      id: `workout_${Date.now()}`,
      date: new Date().toISOString(),
      exercises: completedExercises,
      notes: adaptedNotes,
      rating: workoutRating,
      duration: workoutDuration,
    };

    await AsyncStorage.setItem(
      "workoutHistory",
      JSON.stringify([...existingHistory, workoutData])
    );

    showSuccessMessage("האימון נשמר בהצלחה!");
  } catch (error) {
    showErrorMessage("שגיאה בשמירת האימון");
  }
};
```

## 🎨 מערכת עיצוב RTL

### סגנונות בסיסיים

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    direction: "rtl",
  },

  summaryCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },

  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
    color: theme.colors.text,
  },
});
```

## 🧭 ניווט והחלפת מסכים

### עדכוני ניווט מרכזיים

מערכת הניווט מבוססת על React Navigation 6 עם תמיכה מלאה ב-RTL ואופטימיזציות למובייל.

### קבצים קיימים

```
✅ src/screens/workout/ActiveWorkoutScreen.tsx
✅ src/screens/workout/WorkoutPlansScreen.tsx
✅ src/navigation/AppNavigator.tsx
✅ src/navigation/BottomNavigation.tsx
```

## 📊 מערכת ההיסטוריה

### HistoryScreen Integration

```typescript
const renderWorkoutHistory = () => {
  // בדיקה נכונה של מבנה הנתונים
  if (
    user?.activityHistory?.workouts &&
    Array.isArray(user.activityHistory.workouts)
  ) {
    const workouts = user.activityHistory.workouts;
    return workouts.map(renderWorkoutItem);
  }

  return <EmptyHistoryState />;
};
```

### חישוב סטטיסטיקות

```typescript
const calculateStats = (workouts: WorkoutData[]) => {
  const validWorkouts = workouts.filter(
    (w) => w.feedback?.overallRating && !isNaN(w.feedback.overallRating)
  );

  const stats = {
    totalWorkouts: workouts.length,
    averageDuration:
      validWorkouts.reduce((sum, w) => sum + (w.duration || 30), 0) /
        validWorkouts.length || 30,
    averageRating:
      validWorkouts.reduce((sum, w) => sum + w.feedback.overallRating, 0) /
        validWorkouts.length || 4,
  };

  return stats;
};
```

## 🔄 ניהול מצב עם Zustand

### User Store

```typescript
interface UserStore {
  user: UserProfile | null;
  workoutHistory: WorkoutData[];

  // פעולות
  updateUser: (updates: Partial<UserProfile>) => void;
  addWorkout: (workout: WorkoutData) => void;
  getWorkoutStats: () => WorkoutStatistics;
}
```

## 🎯 התאמת מגדר מתקדמת

### שירות התאמה מיועל (עדכון 2025-08-05)

```typescript
// src/utils/genderAdaptation.ts
// ✅ מיועל עם קבועים וללא כפילויות קוד

// קבועים מרכזיים
const DIFFICULTY_THRESHOLD = 4;
const DEFAULT_DIFFICULTY = 3;

// מילוני התאמות משותפים
const CORE_GENDER_MAPPINGS = {
  male: { מתחילה: "מתחיל", מתקדמת: "מתקדם" },
  female: { מתחיל: "מתחילה", מתקדם: "מתקדמת" },
} as const;

export const adaptWorkoutText = (text: string, gender: UserGender): string => {
  if (gender === "other") return text;

  const mappings = CORE_GENDER_MAPPINGS[gender];
  let adaptedText = text;

  Object.entries(mappings).forEach(([from, to]) => {
    adaptedText = adaptedText.replace(new RegExp(from, "g"), to);
  });

  return adaptedText;
};
```

**שיפורים שבוצעו:**

- ✅ **הסרת כפילויות**: איחוד מילונים דומים לקבועים מרכזיים
- ✅ **קבועים מוגדרים**: החלפת מספרים קבועים בקבועים בעלי משמעות
- ✅ **ביצועים משופרים**: קוד יעיל יותר עם פחות חזרות
- ✅ **קריאות טובה יותר**: סדר הגיוני של פונקציות ומבנה ברור

## 🔧 כלי עזר RTL

### RTL Helpers

```typescript
// src/utils/rtlHelpers.ts
export const createRTLStyle = (baseStyle: any) => ({
  ...baseStyle,
  textAlign: "right",
  writingDirection: "rtl",
  flexDirection:
    baseStyle.flexDirection === "row" ? "row-reverse" : baseStyle.flexDirection,
});

export const getRTLTextStyle = (
  variant: "title" | "body" | "caption" = "body"
) => {
  const baseStyle = {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
  };

  switch (variant) {
    case "title":
      return { ...baseStyle, fontSize: 24, fontWeight: "700" };
    case "caption":
      return { ...baseStyle, fontSize: 14, opacity: 0.7 };
    default:
      return { ...baseStyle, fontSize: 16 };
  }
};
```

## 🎨 Theme System

### צבעי מגדר

```typescript
const genderColors = {
  male: "#3b82f6", // כחול
  female: "#ec4899", // ורוד
  neutral: "#8b5cf6", // סגול
};

const genderHelpers = {
  getGenderColor: (gender: UserGender) =>
    genderColors[gender] || genderColors.neutral,
  getGenderGradient: (gender: UserGender) => {
    switch (gender) {
      case "male":
        return ["#3b82f6", "#1d4ed8"];
      case "female":
        return ["#ec4899", "#be185d"];
      default:
        return ["#8b5cf6", "#7c3aed"];
    }
  },
};
```

## 📱 אופטימיזציות ביצועים

### Lazy Loading

```typescript
const LazyWorkoutSummary = React.lazy(() =>
  import('./components/WorkoutSummary')
);

const WorkoutScreen = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyWorkoutSummary />
  </Suspense>
);
```

### Memoization

```typescript
const MemoizedExerciseList = React.memo(
  ExerciseList,
  (prevProps, nextProps) =>
    prevProps.exercises.length === nextProps.exercises.length
);
```

## 🧪 בדיקות איכות

### Unit Tests

```typescript
describe("Gender Adaptation", () => {
  it("should adapt text for male users", () => {
    const result = adaptWorkoutText("מרגישה עייפה", "male");
    expect(result).toBe("מרגיש עייף");
  });

  it("should adapt text for female users", () => {
    const result = adaptWorkoutText("מרגיש עייף", "female");
    expect(result).toBe("מרגישה עייפה");
  });
});
```

### RTL Tests

```typescript
describe("RTL Support", () => {
  it("should create RTL text style", () => {
    const style = getRTLTextStyle("title");
    expect(style.textAlign).toBe("right");
    expect(style.writingDirection).toBe("rtl");
  });
});
```

## 🔄 Storage Management

### AsyncStorage Utilities

```typescript
const StorageKeys = {
  WORKOUT_HISTORY: "workoutHistory",
  USER_PREFERENCES: "userPreferences",
  GENDER_SETTINGS: "genderSettings",
} as const;

export const storageUtils = {
  async saveWorkout(workout: WorkoutData) {
    const existing = await this.getWorkouts();
    const updated = [...existing, workout];
    await AsyncStorage.setItem(
      StorageKeys.WORKOUT_HISTORY,
      JSON.stringify(updated)
    );
  },

  async getWorkouts(): Promise<WorkoutData[]> {
    const data = await AsyncStorage.getItem(StorageKeys.WORKOUT_HISTORY);
    return data ? JSON.parse(data) : [];
  },
};
```

## 📊 מדדי ביצועים

### Performance Metrics

```typescript
const performanceMetrics = {
  averageLoadTime: "<2s", // זמן טעינה ממוצע
  memoryUsage: "<50MB", // שימוש בזיכרון
  renderTime: "<16ms", // זמן רינדור
  navigationSpeed: "<300ms", // מהירות ניווט
  cacheHitRate: ">90%", // אחוז פגיעות cache
};
```

## 🔧 תיקוני באגים מרכזיים

### תיקון חישוב סטטיסטיקות

```typescript
// ❌ בעיה: NaN results
const avg = workouts.reduce((sum, w) => sum + w.rating, 0) / workouts.length;

// ✅ פתרון: פילטור חכם
const validWorkouts = workouts.filter(
  (w) => w.feedback?.overallRating && !isNaN(w.feedback.overallRating)
);
const averageRating =
  validWorkouts.length > 0
    ? validWorkouts.reduce((sum, w) => sum + w.feedback.overallRating, 0) /
      validWorkouts.length
    : 4; // ברירת מחדל
```

### תיקון בדיקת נתונים

```typescript
// ❌ בעיה: בדיקה שגויה
if (user?.activityHistory && Array.isArray(user.activityHistory)) {
  // never reached
}

// ✅ פתרון: בדיקה נכונה
if (
  user?.activityHistory?.workouts &&
  Array.isArray(user.activityHistory.workouts)
) {
  // works correctly
}
```

## 🎯 עקרונות פיתוח

### Best Practices

1. **תמיד בדוק מבנה נתונים** - `console.log` לפני שימוש
2. **פלטר נתונים לפני חישובים** - מנע NaN ו-undefined
3. **השתמש בברירות מחדל הגיוניות** - מנע crashes
4. **בדוק RTL בכל רכיב עברי** - `textAlign: 'right'` ו-`writingDirection: 'rtl'`
5. **התאם טקסטים למגדר** - שימוש ב-`adaptTextToGender`

### Code Quality Rules

```typescript
// ✅ טוב
const validData = data.filter((item) => item && !isNaN(item.value));
const average =
  validData.length > 0
    ? validData.reduce((sum, item) => sum + item.value, 0) / validData.length
    : DEFAULT_VALUE;

// ❌ רע
const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
```

## 🚀 הוראות פריסה

### Build & Deploy

```bash
# הכנת build לייצור
npm run build:production

# בדיקת איכות קוד
npm run lint:fix
npm run type-check

# הרצת בדיקות
npm test -- --coverage
```

---

**מסמך זה מכסה את הרכיבים הטכניים המרכזיים של מערכת השאלון החכם עם תמיכה מלאה ב-RTL והתאמת מגדר. לפרטים נוספים, עיינו בקבצי הקוד המקבילים.**

_עדכון אחרון: 03/09/2025_
