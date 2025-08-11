/\*\* \* @file src/screens/workout/hooks/README.md \* @description תיעוד הוקי האימון - טיימרים ופונקציונליות מתקדמת \* @description English: Workout hooks documentation - timers and advanced functionality \* @updated 2025-01-17 Enhanced documentation following audit completion \* \* ✅ ACTIVE & COMPREHENSIVE: תיעוד מקיף מעודכן לגמרי \* - Covers useWorkoutTimer & useRestTimer with full API documentation \* - Usage examples and integration patterns for real-world scenarios \* - Performance improvements and technical details from 2025 updates \* - Bilingual documentation (Hebrew/English) for team accessibility
\*/

# 🏋️ Workout Hooks Documentation / תיעוד הוקי האימון

## 📄 Overview / סקירה כללית

מכיל הוקים מתמחים לניהול זמן ופונקציונליות במסכי האימון.

Contains specialized hooks for time management and functionality in workout screens.

---

## 🔧 Available Hooks / הוקים הזמינים

### ⏱️ `useWorkoutTimer`

**Purpose:** ניהול זמן האימון הכללי / Overall workout time management

**Enhanced Features (2025-01-31):**

- ✅ **Improved Accuracy**: 100ms interval instead of 1000ms (consistent with useRestTimer)
- ✅ **Memory Leak Protection**: Added `isMountedRef` flag to prevent updates after unmount
- ✅ **Enhanced Error Handling**: Better AsyncStorage error management with quota cleanup
- ✅ **Performance Optimization**: Reduced unnecessary re-renders and improved state management

**Usage:**

```typescript
const {
  elapsedTime,
  formattedTime,
  isRunning,
  startTimer,
  pauseTimer,
  resetTimer,
  lapTime,
} = useWorkoutTimer(workoutId);
```

**Parameters:**

- `workoutId?: string` - מזהה אימון לשמירה אוטומטית / Workout ID for auto-save

**Returns:**

- `elapsedTime: number` - זמן שעבר בשניות / Elapsed time in seconds
- `formattedTime: string` - זמן מפורמט לתצוגה / Formatted time for display
- `isRunning: boolean` - האם הטיימר פועל / Whether timer is running
- `startTimer(): void` - התחל טיימר / Start timer
- `pauseTimer(): void` - השהה טיימר / Pause timer
- `resetTimer(): void` - אפס טיימר / Reset timer
- `lapTime(): number` - זמן בין תרגילים / Time between exercises

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
```

---

## 🚀 Performance Improvements / שיפורי ביצועים

### 2025-01-17 Latest Enhancements (Audit Completion):

1. **⏱️ Timing Accuracy & Dependencies**
   - useWorkoutTimer: Fixed React Hook dependencies with proper useCallback structure
   - Enhanced function ordering to prevent redeclaration issues
   - Consistent 100ms interval timing with useRestTimer
   - Better synchronization between both timer hooks

2. **🛡️ Memory Management & Reliability**
   - Improved `isMountedRef` implementation in both hooks
   - Enhanced interval cleanup with comprehensive null checks
   - Prevention of state updates after component unmount
   - Memory leak protection optimized for production use

3. **💾 Storage Optimization & Error Handling**
   - Advanced AsyncStorage error handling with specific error type detection
   - Automatic cleanup of old workout timer data when quota exceeded
   - Graceful degradation for storage full scenarios
   - Enhanced error logging with diagnostic information

4. **🔧 Code Quality & TypeScript**
   - Better TypeScript consistency across both hooks
   - Enhanced useCallback usage with proper dependency management
   - Improved error logging with specific diagnostics
   - Documentation alignment with actual implementation

---

## 📱 Usage Examples / דוגמאות שימוש

### Basic Workout Timer / טיימר אימון בסיסי

```typescript
const WorkoutScreen = () => {
  const { formattedTime, startTimer, pauseTimer, isRunning } =
    useWorkoutTimer('workout-123');

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
```

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

### Performance Considerations / שיקולי ביצועים

- useCallback for all functions to prevent unnecessary re-renders
- Ref usage for values that don't need to trigger re-renders
- Optimized state updates with proper dependencies

---

## 📋 Maintenance / תחזוקה

### Regular Tasks / משימות שוטפות

1. **Monitor AsyncStorage usage** - ניטור שימוש ב-AsyncStorage
2. **Test timer accuracy** - בדיקת דיוק הטיימרים
3. **Check memory leaks** - בדיקת דליפות זיכרון
4. **Update dependencies** - עדכון תלויות

### Known Issues / בעיות ידועות

None currently identified after 2025-01-17 comprehensive audit and improvements.

**Recent Fixes:**

- ✅ Fixed React Hook dependencies in useWorkoutTimer
- ✅ Resolved function redeclaration issues
- ✅ Enhanced error handling for AsyncStorage edge cases
- ✅ Improved memory leak prevention across both hooks

---

_Last Updated: 2025-01-17_  
_Documentation maintained by: GitHub Copilot_  
_Status: Comprehensive audit completed with full functionality verification_
