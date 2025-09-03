# 📋 כללים והנחיות פיתוח - GYMovoo Development Guidelines

> **📅 עדכון אחרון:** 3 בספטמבר 2025  
> **⚠️ הערה:** מדריך זה משלים את [`DEVELOPMENT.md`](../DEVELOPMENT.md) - עיין בשני הקבצים

## 🎯 עקרונות פיתוח מרכזיים

### 🇮🇱 עברית First - לא Hebrew Support

```typescript
// ❌ גישה שגויה - עברית כתוספת
const text = translations[language] || "default english";

// ✅ גישה נכונה - עברית בליבה
const hebrewText = "טקסט עברי";
const englishFallback = "English fallback"; // רק לפיתוח
```

**כלל זהב #1:** כל טקסט, כל משפט, כל מילה - תמיד עברית קודם, אנגלית רק למטה-דטה טכני.

### 🧠 Smart Algorithms מההתחלה

```typescript
// ❌ נתונים בסיסיים
const equipment = { name: "dumbbell" };

// ✅ נתונים חכמים עם אלגוריתמים
const equipment = {
  name: "משקולות",
  difficulty: 6, // 🧠 אלגוריתם חכם
  effectiveness: 9, // 🧠 אלגוריתם חכם
  availability: 8, // 🧠 אלגוריתם חכם
  smartScore: 7.7, // 🧮 חישוב אוטומטי
};
```

**כלל זהב #2:** כל נתון חייב להיות חכם עם scoring 1-10. אין נתונים "פשוטים".

### 🎨 RTL מהיום הראשון

```typescript
// ✅ כל רכיב עברי חייב RTL
const HebrewComponent = () => (
  <View style={{
    flexDirection: 'row-reverse',    // RTL layout
    textAlign: 'right',              // RTL text
    writingDirection: 'rtl'          // RTL direction
  }}>
    <Text style={{ textAlign: 'right' }}>
      טקסט עברי תמיד מיושר ימינה
    </Text>
  </View>
);
```

**כלל זהב #3:** RTL זה לא סטיילינג, זה אדריכלות. תכנן מראש.

## 🏗️ ארכיטקטורה וקוד

### 📁 מבנה קבצים חובה

```
src/
├── components/
│   ├── common/       // רכיבים בסיסיים בלבד
│   ├── ui/          // רכיבי UI מתקדמים
│   └── workout/     // רכיבי אימון ייעודיים
├── screens/         // מסכים לפי קטגוריות
├── hooks/           // hooks חכמים עם אלגוריתמים
├── services/        // שירותים טכניים
├── stores/          // Zustand state management
├── data/            // נתונים חכמים עם metadata
└── utils/           // כלי עזר טכניים
```

**כלל זהב #4:** כל קובץ במקום הנכון. אין "misc" או "other".

### 🔍 בדיקת רכיבים קיימים - חובה לפני פיתוח!

**לפני יצירת רכיב חדש - תמיד בדוק:**

```bash
# 1. חפש רכיבים דומים
find src/components -name "*.tsx" | grep -i "button\|modal\|input"

# 2. חפש פונקציונליות דומה
grep -r "onPress\|TouchableOpacity" src/components/

# 3. בדוק רכיבים משותפים
ls src/components/common/
ls src/screens/workout/components/shared/
```

**✅ דוגמה לשימוש נכון ברכיבים קיימים:**

```tsx
// ❌ יצירת כפתור סגירה מחדש
<TouchableOpacity onPress={onClose}>
  <MaterialCommunityIcons name="close" size={24} />
</TouchableOpacity>

// ✅ שימוש ב-CloseButton הקיים
<CloseButton
  onPress={onClose}
  size="medium"
  variant="solid"
  accessibilityLabel="סגור מסך"
/>

// ❌ יצירת מודל מחדש
<Modal visible={show}>
  <View style={customStyles}>
    <Text>אישור מחיקה?</Text>
    <TouchableOpacity onPress={onConfirm}>
      <Text>מחק</Text>
    </TouchableOpacity>
  </View>
</Modal>

// ✅ שימוש ב-UniversalModal הקיים
<UniversalModal
  visible={show}
  type="warning"
  title="אישור מחיקה"
  message="האם אתה בטוח שברצונך למחוק?"
  onConfirm={onConfirm}
  onClose={onClose}
/>
```

**🎯 רשימת רכיבים משותפים עיקריים:**

- `CloseButton` - כפתורי סגירה וביטול
- `BackButton` - כפתורי חזרה וניווט
- `LoadingSpinner` - מצבי טעינה
- `UniversalModal` - מודלים כלליים
- `UniversalButton` - כפתורים עיקריים
- `InputField` - קלטי טקסט
- `EmptyState` - מצבים ריקים

### 🔧 TypeScript חובה מוחלטת

```typescript
// ✅ כל hook עם interface מפורט
interface SmartWorkoutIntegration {
  analyzeWorkout: (workout: WorkoutData) => WorkoutAnalysis;
  generateWarmup: (intensity: number) => Exercise[];
  optimizeExerciseOrder: (exercises: Exercise[]) => Exercise[];
  trackProgress: (performance: PerformanceData) => ProgressInsights;
}

// ✅ כל נתון עם טיפוס מדויק
interface EquipmentData {
  id: string;
  name: string; // עברית
  nameEn: string; // אנגלית טכנית
  difficulty: number; // 1-10
  effectiveness: number; // 1-10
  availability: number; // 1-10
  smartScore: number; // חישוב אוטומטי
}
```

**כלל זהב #5:** אפס any, אפס קוד ללא טיפוסים. TypeScript 100%.

### ⚡ Performance מההתחלה

```typescript
// ✅ אופטימיזציות חובה
const OptimizedScreen = () => {
  // 1. Memoization לחישובים כבדים
  const expensiveCalculation = useMemo(() =>
    calculateSmartScore(data), [data]);

  // 2. Callback optimization
  const handlePress = useCallback(() => {
    doSomething();
  }, [dependency]);

  // 3. Component memoization
  return React.memo(<ExpensiveComponent />);
};

// ✅ Navigation optimizations
const screenOptions = {
  freezeOnBlur: true,           // חיסכון זיכרון
  detachPreviousScreen: false,  // אנימציות חלקות
  gestureResponseDistance: 200, // רספונסיביות מירבית
};
```

**כלל זהב #6:** Performance זה לא אופציה, זה דרישה בסיסית.

## 🎨 UI/UX Guidelines

### 📱 Hebrew Native UI

```typescript
// ✅ רכיב עברי מושלם
const HebrewButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
  >
    <Text style={styles.hebrewText}>{title}</Text>
    <Icon
      name="arrow-left"  // חץ שמאל = קדימה בעברית
      style={styles.rtlIcon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hebrewText: {
    textAlign: 'right',
    fontFamily: 'Hebrew-Font',
    fontSize: 16,
  },
  rtlIcon: {
    marginLeft: 8, // במקום marginRight
  }
});
```

### 🎪 Animation Guidelines

```typescript
// ✅ אנימציות RTL נכונות
const RTLSlideAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0], // משמאל לימין
          }),
        },
      ],
    },
  }),
  gestureDirection: "horizontal-inverted", // RTL gestures
};
```

**כלל זהב #7:** כל אנימציה צריכה להרגיש טבעית בעברית.

## 🧠 Smart Features חובה

### 🎯 כל Feature עם AI

```typescript
// ❌ feature בסיסי
const saveWorkout = (workout) => {
  localStorage.setItem("workout", workout);
};

// ✅ feature חכם עם AI
const saveWorkoutWithAI = (workout) => {
  // 1. ניתוח חכם
  const analysis = analyzeWorkoutPerformance(workout);

  // 2. תובנות אישיות
  const insights = generatePersonalInsights(workout, userProfile);

  // 3. המלצות לעתיד
  const recommendations = generateNextWorkoutSuggestions(analysis);

  // 4. שמירה עם מטא-דטה חכמה
  const smartWorkout = {
    ...workout,
    aiAnalysis: analysis,
    personalInsights: insights,
    recommendations: recommendations,
    smartScore: calculateWorkoutScore(workout),
  };

  workoutStore.saveWorkout(smartWorkout);
};
```

**כלל זהב #8:** כל פיצ'ר צריך להיות חכם. אין פונקציונליות "פשוטה".

### 📊 Data עם Smart Scoring

```typescript
// ✅ כל נתון עם smart scoring
interface SmartData {
  // נתונים בסיסיים
  id: string;
  name: string; // עברית
  nameEn: string; // אנגלית טכנית

  // אלגוריתמים חכמים (1-10)
  difficulty: number; // קושי שימוש
  effectiveness: number; // יעילות
  availability: number; // זמינות

  // חישוב אוטומטי
  smartScore: number; // ממוצע משוקלל

  // מטא-דטה מתקדמת
  category: Category;
  tags: string[];
  algorithms: AlgorithmData;
}
```

## 🔗 Integration & APIs

### 🌐 Hybrid Architecture חובה

```typescript
// ✅ ארכיטקטורה היברידית נכונה
const getExerciseData = async (exerciseId: string) => {
  // 1. נתונים מקומיים בעברית (מהיר)
  const localData = exerciseDatabase.find((ex) => ex.id === exerciseId);

  // 2. נתונים מ-WGER API (עשיר)
  const apiData = await wgerAPI.getExercise(exerciseId);

  // 3. שילוב חכם
  return {
    ...localData, // עברית + UX
    ...apiData, // תוכן עשיר
    smartScore: calculateSmartScore(localData, apiData),
    hebrewName: localData.name,
    englishName: apiData.name,
  };
};
```

**כלל זהב #9:** תמיד היברידי - מקומי לUX, API לתוכן.

### 🔄 State Management

```typescript
// ✅ Zustand עם smart actions
const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  // State
  currentWorkout: null,
  workoutHistory: [],

  // Smart Actions
  startWorkout: (plan: WorkoutPlan) => {
    const smartPlan = optimizeWorkoutPlan(plan, get().userProfile);
    set({ currentWorkout: smartPlan });

    // AI tracking
    trackWorkoutStart(smartPlan);
  },

  completeWorkout: () => {
    const workout = get().currentWorkout;
    const analysis = analyzeWorkoutCompletion(workout);
    const insights = generateInsights(analysis);

    set((state) => ({
      workoutHistory: [
        ...state.workoutHistory,
        {
          ...workout,
          analysis,
          insights,
          completedAt: new Date(),
        },
      ],
      currentWorkout: null,
    }));
  },
}));
```

## 🧪 Testing & Quality

### ✅ Testing Strategy חובה

```typescript
// 1. Unit Tests - כל hook וכל utility
describe('calculateSmartScore', () => {
  it('should calculate correct smart score', () => {
    const input = { difficulty: 6, effectiveness: 9, availability: 8 };
    const result = calculateSmartScore(input);
    expect(result).toBeCloseTo(7.7, 1);
  });
});

// 2. RTL Tests - כל רכיב עברי
describe('HebrewComponent', () => {
  it('should render RTL correctly', () => {
    const { getByText } = render(<HebrewComponent text="טקסט עברי" />);
    const element = getByText('טקסט עברי');
    expect(element).toHaveStyle({ textAlign: 'right' });
  });
});

// 3. Integration Tests - זרימות מלאות
describe('Workout Flow', () => {
  it('should complete full smart workout cycle', async () => {
    // Test: questionnaire → AI analysis → workout plan → execution → insights
  });
});
```

### 📊 Code Quality Metrics

```typescript
const qualityStandards = {
  typeScriptCoverage: 100, // אפס any, הכל מוגדר
  testCoverage: 90, // כיסוי בדיקות גבוה
  performanceScore: 95, // מהירות מעולה
  accessibilityScore: 100, // נגישות מלאה
  hebrewUXScore: 100, // עברית נטיבית
  smartFeaturesScore: 100, // כל פיצ'ר חכם
};
```

**כלל זהב #10:** איכות זה לא "nice to have", זה סטנדרט בסיסי.

## 🚫 מה אסור לעשות - Red Lines

### ❌ אסור לחלוטין:

```typescript
// 1. אסור - קוד ללא טיפוסים
const badFunction = (data) => { // ❌ אין any!
  return data.something;
};

// 2. אסור - עברית כתוספת
const getText = (lang) => lang === 'he' ? 'עברית' : 'English'; // ❌

// 3. אסור - נתונים בלי אלגוריתמים
const basicData = { name: "item" }; // ❌ איפה ה-smart score?

// 4. אסור - RTL afterthought
<Text>עברית</Text> // ❌ איפה ה-textAlign: 'right'?

// 5. אסור - performance afterthought
const Component = () => {
  const heavyCalculation = expensiveFunction(); // ❌ איפה המemoization?
  return <div>{heavyCalculation}</div>;
};
```

### 🚨 אזהרות קריטיות:

```typescript
// 1. אל תיצור טרמינל חדש אם Expo פועל
// ❌ גורם להתנגשות
run_in_terminal('npx expo start'); // כש-Expo כבר פועל

// ✅ תמיד בקש מהמשתמש ללחוץ 'r' בטרמינל הקיים
// הודעה למשתמש במקום console.log
userFeedback.show('לחץ r בטרמינל הקיים לרענון');

// 2. אל תשכח RTL בכל רכיב עברי
// ❌ ייראה מוזר
<Text>טקסט עברי</Text>

// ✅ תמיד עם RTL
<Text style={{ textAlign: 'right' }}>טקסט עברי</Text>

// 3. אל תעשה features בסיסיים
// ❌ חסר intelligence
const saveData = (data) => storage.save(data);

// ✅ תמיד עם AI ואלגוריתמים
const saveSmartData = (data) => {
  const analysis = analyzeData(data);
  const insights = generateInsights(analysis);
  storage.save({ ...data, analysis, insights });
};
```

## 🎯 המטרה הסופית

**כל שורת קוד צריכה לעמוד במבחן:**

1. ✅ **העברית** - נטיבית, לא מתורגמת
2. ✅ **החכמה** - עם אלגוריתמים, לא בסיסית
3. ✅ **הביצועים** - מהירה ומובטחת
4. ✅ **הנקיות** - TypeScript מושלם
5. ✅ **החוויה** - כמו אפליקציה מסחרית מובילה

## 🏆 הכלל האולטימטיבי

> **"אם זה לא Hebrew-First, Smart-Algorithm-Powered, Performance-Optimized, ו-TypeScript-Perfect - זה לא עומד בסטנדרט GYMovoo!"**

**זכור: אנחנו בונים לא רק אפליקציה - אנחנו בונים מערכת חכמה מהדור הבא!** 🚀💪

---

_📝 מסמך זה מתעדכן עם כל שינוי בסטנדרטים הפיתוח_

## 📖 מדריכים קשורים

- **מדריך מהיר:** [`DEVELOPMENT.md`](../DEVELOPMENT.md) - פקודות ועדכונים אחרונים
- **חוקי זהב:** [`CRITICAL_PROJECT_CONTEXT_NEW.md`](../CRITICAL_PROJECT_CONTEXT_NEW.md) - כללים קריטיים
- **מדריך טכני:** [`TECHNICAL_ARCHITECTURE_GUIDE.md`](./TECHNICAL_ARCHITECTURE_GUIDE.md) - ארכיטקטורה מפורטת
