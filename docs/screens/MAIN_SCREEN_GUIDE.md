# מסך ראשי (Main Screen) 🏠

## סקירה כללית

המסך הראשי הוא מרכז הבקרה של האפליקציה, ממנו המשתמש ניגש לכל התכונות והסטטיסטיקות.

## מפרט מסך

- **MainScreen** (`src/screens/main/MainScreen.tsx`): דשבורד, סטטיסטיקות, ניווט מהיר לכל הפיצ'רים.

## ניווט

- תוכניות אימון → WorkoutPlansScreen
- התקדמות → ProgressScreen
- תרגילים → ExerciseListScreen/ExercisesScreen
- פרופיל → ProfileScreen
- היסטוריה → HistoryScreen
- התראות → NotificationsScreen
- הגדרות/עזרה/דמו – כפתורי עזר

## עיצוב ונתונים

- RTL מלא, צבעים מ-theme.ts, Cards עם צללים
- הצגת מטרה, סטטיסטיקות, הישגים, אימון הבא
- אימונים השבוע, ימים רצופים, המלצה לאימון הבא
- שם משתמש, רמת כושר, מטרה, ציוד זמין

## טכנולוגיות

- Zustand stores: userStore, workoutStore, statisticsStore
- טעינה אסינכרונית, רענון אוטומטי, Cache

---

**הערות:**

- מסמך זה מתמקד בתכונות הקריטיות של המסך הראשי
- לפרטים טכניים נוספים ראה את קבצי הקוד עצמם
