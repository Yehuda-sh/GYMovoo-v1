# 🏋️ Workout Hooks

## 📚 הוקים זמינים

### ⏱️ `useWorkoutTimer`

**תכלית:** ניהול זמן האימון הכללי

**תכונות:**

- טיימר פשוט עם עדכון כל שנייה
- pause/resume בסיסי
- ניקוי אוטומטי של intervals

**שימוש:**

```typescript
const { formattedTime, isRunning, startTimer, pauseTimer } = useWorkoutTimer();
```

**מחזיר:**

- `formattedTime: string` - זמן מפורמט לתצוגה
- `isRunning: boolean` - האם הטיימר פועל
- `startTimer(): void` - התחל טיימר
- `pauseTimer(): void` - השהה טיימר

---

### ⏰ `useRestTimer`

**תכלית:** ניהול טיימר מנוחה בין סטים

**תכונות:**

- טיימר פשוט עם ספירה לאחור
- הוספה/הפחתה של זמן
- דילוג על טיימר

**שימוש:**

```typescript
const {
  isRestTimerActive,
  restTimeRemaining,
  startRestTimer,
  skipRestTimer,
  addRestTime,
  subtractRestTime,
} = useRestTimer();
```

---

### 🔧 `useExerciseManager`

**תכלית:** ניהול תרגילים באימון פעיל

**תכונות:**

- ניהול רשימת תרגילים וסטים
- עדכון, הוספה ומחיקה של סטים
- הוספה והסרה של תרגילים

**שימוש:**

```typescript
const {
  exercises,
  handleUpdateSet,
  handleCompleteSet,
  handleAddSet,
  handleDeleteSet,
  handleAddExercise,
  handleRemoveExercise,
} = useExerciseManager({ initialExercises, pendingExercise });
```

---

### 🔔 `useModalManager`

**תכלית:** ניהול מודלים

**תכונות:**

- 4 סוגי מודלים: error, success, confirm, comingSoon
- ממשק אחיד עם פונקציות נוחות

**שימוש:**

```typescript
const {
  activeModal,
  modalConfig,
  showModal,
  hideModal,
  showError,
  showSuccess,
  showConfirm,
  showComingSoon,
} = useModalManager();
```

---

## 📱 דוגמאות שימוש

### טיימר אימון בסיסי

```typescript
const WorkoutScreen = () => {
  const { formattedTime, startTimer, pauseTimer, isRunning } = useWorkoutTimer();

  return (
    <View>
      <Text>זמן אימון: {formattedTime}</Text>
      <Button
        title={isRunning ? "השהה" : "התחל"}
        onPress={isRunning ? pauseTimer : startTimer}
      />
    </View>
  );
};
```

### טיימר מנוחה

```typescript
const RestScreen = () => {
  const { isRestTimerActive, restTimeRemaining, startRestTimer } = useRestTimer();

  const handleStartRest = () => {
    startRestTimer(60); // 60 שניות מנוחה
  };

  return isRestTimerActive ? (
    <View>
      <Text>זמן מנוחה נותר: {restTimeRemaining}s</Text>
    </View>
  ) : null;
};
```

---

## 🧪 בדיקות

### Jest + React Native Testing Library

```typescript
jest.useFakeTimers();

it("counts timer", () => {
  const { result } = renderHook(() => useWorkoutTimer());
  act(() => {
    result.current.startTimer();
    jest.advanceTimersByTime(1000);
  });
  expect(result.current.formattedTime).toBe("0:01");
});
```

---

_עודכן: 2025-09-06_  
_סטטוס: הוקים פשוטים ויעילים_
