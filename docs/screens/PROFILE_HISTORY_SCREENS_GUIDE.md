# מסכי פרופיל והיסטוריה (Profile & History Screens) 👤📊

## סקירה כללית

מסכי הפרופיל וההיסטוריה מאפשרים למשתמש לנהל את המידע האישי ולעקוב אחר התקדמות האימונים.

## מסכים עיקריים

- **ProfileScreen** (`src/screens/profile/ProfileScreen.tsx`): ניהול נתונים אישיים, מטרות, הגדרות
- **HistoryScreen** (`src/screens/history/HistoryScreen.tsx`): הצגת אימונים שבוצעו, ניתוח מגמות
- **ProgressScreen** (`src/screens/progress/ProgressScreen.tsx`): ויזואליזציה של התקדמות וגרפים
- **NotificationsScreen** (`src/screens/notifications/NotificationsScreen.tsx`): ניהול התראות ותזכורות

## זרימת ניווט

```
MainScreen → ProfileScreen ⟷ Settings
     ↓           ↓
HistoryScreen → WorkoutDetails
     ↓           ↓
ProgressScreen → Charts & Analytics
     ↓
NotificationsScreen → Settings
```

## טכנולוגיות

- RTL מלא, צבעים מ-theme.ts
- Zustand stores: userStore, workoutStore, statisticsStore
- AsyncStorage לנתונים מקומיים
- Charts עם react-native-chart-kit

---

**הערות:**

- מסמך זה מתמקד בתכונות הקריטיות של מסכי הפרופיל וההיסטוריה
- לפרטים טכניים נוספים ראה את קבצי הקוד עצמם
