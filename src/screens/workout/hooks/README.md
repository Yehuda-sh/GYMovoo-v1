# 🏋️ Workout Hooks Documentation / תיעוד הוקי האימון

> Updated: 2025-08-16 – נוספה תמיכה ב-`usePreviousPerformance` (AI + Cache + Facade Refactor)

## 📚 Table of Contents / תוכן עניינים

- 📄 Overview / סקירה כללית
- 🔧 Available Hooks / הוקים הזמינים
  - ⏱️ useWorkoutTimer
  - ⏰ useRestTimer
  - � usePreviousPerformance
- �🔄 Integration / אינטגרציה
- 🚀 Performance Improvements / שיפורי ביצועים
- 📱 Usage Examples / דוגמאות שימוש
- 🔍 Technical Notes / הערות טכניות
- 🧪 Tests / בדיקות
- 📋 Maintenance / תחזוקה

## 📄 Overview / סקירה כללית

מכיל הוקים מתמחים לניהול זמן ופונקציונליות במסכי האימון.

Contains specialized hooks for time management and functionality in workout screens.

---

## 🔧 Available Hooks / הוקים הזמינים

### ⏱️ `useWorkoutTimer`

**Purpose:** ניהול זמן האימון הכללי / Overall workout time management

**Simplified Features (2025-09-03):**

- ✅ **Simplified Architecture**: Reduced from 237→50 lines, removed over-engineering
- ✅ **Core Functionality**: Only essential features kept (timer display and basic controls)
- ✅ **Memory Leak Protection**: Basic `isMountedRef` flag protection
- ✅ **High Accuracy**: 100ms interval for smooth timer updates

**Usage:**

```typescript
const { formattedTime, isRunning, startTimer, pauseTimer } = useWorkoutTimer(); // workoutId parameter now optional/unused
```

**Parameters:**

- `workoutId?: string` - מזהה אימון (לא בשימוש, שמור לתאימות) / Workout ID (unused, kept for compatibility)

**Returns:**

- `formattedTime: string` - זמן מפורמט לתצוגה / Formatted time for display
- `isRunning: boolean` - האם הטיימר פועל / Whether timer is running
- `startTimer(): void` - התחל טיימר / Start timer
- `pauseTimer(): void` - השהה טיימר / Pause timer

---

### ⏰ `useRestTimer`

**Purpose:** ניהול טיימר מנוחה בין סטים / Rest timer management between sets

**Enhanced Features (2025-01-31):**

- ✅ **Memory Leak Protection**: Added `isMountedRef` flag consistency with useWorkoutTimer
- ✅ **Improved Cleanup**: Better interval management and null checks
- ✅ **Consistent Architecture**: Aligned with useWorkoutTimer improvements

**Usage:**

```typescript
const {
  isRestTimerActive,
  restTimeRemaining,
  startRestTimer,
  pauseRestTimer,
  resumeRestTimer,
  skipRestTimer,
  addRestTime,
  subtractRestTime,
  currentExerciseName,
} = useRestTimer();
```

**Features:**

- 🔔 **Vibration Alerts**: רטט בשניות האחרונות / Vibrate in final seconds
- ⏯️ **Pause/Resume**: השהה והמשך / Pause and resume functionality
- ➕➖ **Time Adjustment**: הוסף/הפחת זמן / Add/subtract time
- 📱 **Visual Feedback**: משוב ויזואלי למשתמש / Visual feedback to user

---

### 📈 `usePreviousPerformance`

**Purpose:** ניתוח ביצועים קודמים + מגמות + המלצות AI / Previous performance analytics & AI recommendations.

**Core Capabilities:**

- 🔄 טוען ביצועים קודמים מתווך הפאסאד `workoutFacadeService`
- 🧠 מחשב מגמה (improving | stable | declining | new)
- 🎯 יוצר המלצת התקדמות (משקל / חזרות / סטים + reasoning)
- 🔍 מזהה פער ימים מהאימון האחרון + עקביות (consistencyScore)
- 🤖 AI Insights: סיכון, שיפור צפוי, מנוחה מיטבית, טיפים מותאמים
- ⚡ Cache בזיכרון (TTL 5 דקות) עם hash לנתוני משתמש (age / gender / fitnessLevel)

**Usage:**

```ts
const {
  previousPerformance,
  loading,
  error,
  refetch,
  getProgressionInsight,
  shouldIncreaseWeight,
  getMotivationalMessage,
  generateAIInsights,
  getPredictedPerformance,
  clearCache,
  getCacheStats,
} = usePreviousPerformance("Bench Press", {
  gender: "male",
  age: "26_35",
  fitnessLevel: "intermediate",
});
```

**Returns (selected):**

- `previousPerformance.progressionTrend`
- `previousPerformance.recommendedProgression.{weight,reps,sets,reasoning}`
- `generateAIInsights(): AIPerformanceInsights`
- `getPredictedPerformance(daysAhead=7)` – תחזית משקל / חזרות
- `getCacheStats()` – { isFromCache, cacheAge, hits }

**Cache Logic:**

```
Map<exerciseName + personalDataHash, { data, timestamp }>
TTL = 5m → מעבר לכך טעינה רעננה
```

**AI Heuristics (פשטות נוכחית):**

- שיפור צפוי נגזר מהמגמה + strengthGain
- סיכון (riskAssessment) נקבע לפי פער ימים וירידה ביציבות
- מנוחה מומלצת (optimalRestDays) 1–2

**Integration Notes:**

- אין לכתוב ל-AsyncStorage מההוק – קריאה בלבד דרך השירותים
- נתמך ע"י: `personalRecordService` ← `workoutFacadeService`
- מתאים להטריגר רענון אחרי סיום אימון חדש (`refetch`)

**When to Use:**

- בראש מסכי תרגיל להצגת “ביצוע קודם”
- במסך התקדמות להצגת מגמות

**Recommended UI:**

```
if (loading) Spinner
else if (!previousPerformance) EmptyState
else <PreviousPerformanceCard ... />
```

**Edge Cases Covered:**

- אין נתונים קודמים → החזרה null + הודעת התחלה
- חוסר סט קודם להשוואה → trend = "new"
- פער גדול (>14 ימים) → המלצה זהירה (הפחת משקל)

**Future Extensions (לא מומש עדיין):**

- אחסון cache per user persistently
- Fine-grained PR attribution per set
- ML מבוסס רצפים (אם יתווסף backend מתאים)

---

---

## 🔄 Integration / אינטגרציה

### עם QuickWorkoutScreen / With QuickWorkoutScreen

```typescript
// Both hooks work together seamlessly
const { elapsedTime, formattedTime, startTimer, pauseTimer } =
  useWorkoutTimer(workoutId);

const { isRestTimerActive, startRestTimer, skipRestTimer } = useRestTimer();

// Auto-pause workout timer when rest timer is active
useEffect(() => {
  if (isRestTimerActive) {
    pauseTimer();
  }
}, [isRestTimerActive, pauseTimer]);

// שילוב עם ביצועים קודמים (הדמיה)
const { previousPerformance, getProgressionInsight } = usePreviousPerformance(
  currentExerciseName,
  userProfileBasic
);

const recommendation = previousPerformance?.recommendedProgression;
```

---

````

---

## 🚀 Performance Improvements / שיפורי ביצועים

### 2025-09-03 Simplification & Cleanup:

1. **⏱️ Simplified useWorkoutTimer**
   - Reduced from 237→50 lines (79% reduction)
   - Removed over-engineered AsyncStorage persistence
   - Removed unused lapTime() and resetTimer() functions
   - Kept only essential functionality: timer display and basic controls

2. **🛡️ Memory Management**
   - Basic `isMountedRef` implementation maintained
   - Essential interval cleanup preserved
   - Prevention of state updates after component unmount
   - Simplified but effective memory leak protection

3. **� Code Quality**
   - Removed complex error handling for storage quotas
   - Eliminated unused features and dependencies
   - Better alignment with actual usage patterns
   - Cleaner, more maintainable codebase

---

## 📱 Usage Examples / דוגמאות שימוש

### Basic Workout Timer / טיימר אימון בסיסי

```typescript
const WorkoutScreen = () => {
  const { formattedTime, startTimer, pauseTimer, isRunning } =
    useWorkoutTimer(); // No workoutId needed

  return (
    <View>
      <Text>Workout Time: {formattedTime}</Text>
      <Button
        title={isRunning ? "Pause" : "Start"}
        onPress={isRunning ? pauseTimer : startTimer}
      />
    </View>
  );
};
````

### Rest Timer with Exercise Context / טיימר מנוחה עם הקשר תרגיל

```typescript
const RestScreen = () => {
  const {
    isRestTimerActive,
    restTimeRemaining,
    startRestTimer,
    currentExerciseName
  } = useRestTimer();

  const handleStartRest = () => {
    startRestTimer(60, "Push-ups"); // 60 seconds rest
  };

  return isRestTimerActive ? (
    <View>
      <Text>Rest after: {currentExerciseName}</Text>
      <Text>Time remaining: {restTimeRemaining}s</Text>
    </View>
  ) : null;
};
```

---

## 🔍 Technical Notes / הערות טכניות

### Interval Management / ניהול Interval

Both hooks use consistent interval management:

- 100ms update frequency for accuracy
- Proper cleanup on unmount
- Memory leak prevention with mounted flags

### AsyncStorage Integration / אינטגרציה עם AsyncStorage

- Automatic save/restore for workout timer
- Error handling for storage limits
- Cleanup of old data to prevent quota issues

### Facade Architecture / ארכיטקטורת פאסאד

- כל גישה לנתוני עבר מתועלת כעת דרך `workoutFacadeService` (החלפת God Object ישן)
- חלוקה ל: storage / analytics / personalRecords / recommendations
- מפחית צימוד ומאפשר בדיקות יחידה ממוקדות

### Caching & AI Layer / שכבת Cache ו-AI

- In-memory בלבד (ללא persisting) → מהיר ונקי
- Hash לנתוני התאמה אישית כדי למנוע התנגשות בין משתמשים שונים
- ניתן לניקוי ידני (`clearCache`) או בריענון TTL

### Performance Considerations / שיקולי ביצועים

- useCallback for all functions to prevent unnecessary re-renders
- Ref usage for values that don't need to trigger re-renders
- Optimized state updates with proper dependencies

---

## 🧪 Tests / בדיקות

### Jest + React Native Testing Library

- השתמשו ב-fake timers עבור בדיקות טיימרים: `jest.useFakeTimers()`.
- עטפו פעולות המשנות זמן בתוך `act`.
- דוגמה קצרה:

```ts
import { act } from "@testing-library/react-native";

jest.useFakeTimers();

it("counts rest timer down", () => {
  const { result } = renderHook(() => useRestTimer());
  act(() => {
    result.current.startRestTimer(60, "Push-ups");
    jest.advanceTimersByTime(1000);
  });
  expect(result.current.restTimeRemaining).toBe(59);
});
```

### Testing usePreviousPerformance

```ts
jest.useFakeTimers();

it("returns null initially then data", async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    usePreviousPerformance("Bench Press", { gender: "male" })
  );
  expect(result.current.previousPerformance).toBeNull();
  await waitForNextUpdate();
  expect(result.current.previousPerformance).not.toBeNull();
});

it("generates AI insights", async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    usePreviousPerformance("Bench Press")
  );
  await waitForNextUpdate();
  const insights = result.current.generateAIInsights();
  expect(insights?.riskAssessment).toBeDefined();
});
```

**Test Notes:**

- מומלץ למקם mock ל-`workoutFacadeService.getPreviousPerformanceForExercise`
- לבדיקת cache: קריאה שנייה צריכה להיות מהירה וללא גישה לשירות (ספיי)
- לעקיפת זמן: השתמש ב-`Date.now = jest.fn()` או `jest.setSystemTime()`

- הערות:
  - ודאו ניקוי טיימרים בין בדיקות (`jest.clearAllTimers()` ב-afterEach אם צריך).
  - אימות חוויית משתמש: בדקו טקסט/מצב כפתורים ולא משתנים פנימיים.

---

## 📋 Maintenance / תחזוקה

### Regular Tasks / משימות שוטפות

1. **Monitor AsyncStorage usage** - ניטור שימוש ב-AsyncStorage
2. **Test timer accuracy** - בדיקת דיוק הטיימרים
3. **Check memory leaks** - בדיקת דליפות זיכרון
4. **Update dependencies** - עדכון תלויות
5. **Invalidate performance cache after workout save**
6. **Audit AI heuristics אחת לחודשיים**

### Known Issues / בעיות ידועות

None currently identified after 2025-01-17 comprehensive audit and improvements.

**Recent Fixes:**

- ✅ Fixed React Hook dependencies in useWorkoutTimer
- ✅ Resolved function redeclaration issues
- ✅ Enhanced error handling for AsyncStorage edge cases
- ✅ Improved memory leak prevention across both hooks
- ✅ Added smart performance & AI insights hook (`usePreviousPerformance`)
- ✅ Introduced facade-based workout services decomposition

---

_Last Updated: 2025-08-16_  
_Documentation maintained by: GitHub Copilot_  
_Status: Timer hooks stable; performance analytics (AI + cache) in active monitoring_
