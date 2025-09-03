# מסכי תרגילים (Exercise Screens) 💪

## סקירה כללית

מסכי התרגילים מספקים גישה למאגר ענק, חיפוש וסינון מתקדם, פרטי תרגיל מלאים, ומערכת לימוד אינטראקטיבית.

## מסכים עיקריים

- **ExerciseListScreen** (`src/screens/exercise/ExerciseListScreen.tsx`): רשימת תרגילים, חיפוש, סינון, מועדפים.
- **ExerciseDetailsModal** (`src/screens/exercise/ExerciseDetailsModal.tsx`): פרטי תרגיל, הוראות, הוספה לאימון/מועדפים.
- **ExercisesScreen** (`src/screens/exercises/ExercisesScreen.tsx`): דשבורד תרגילים, סטטיסטיקות, המלצות.
- **ExerciseDetailsScreen** (`src/screens/exercises/ExerciseDetailsScreen.tsx`): מסך פרטי תרגיל מפורט.
- **MuscleBar** (`src/screens/exercise/MuscleBar.tsx`): גרף איזון שרירים.

## זרימת ניווט

```
MainScreen → ExercisesScreen → ExerciseListScreen
                ↓                     ↓
        ExerciseDetailsScreen → ExerciseDetailsModal
                                      ↓
                            Add to Workout/Favorites
```

## מאגר התרגילים

- מבנה נתונים: שם (עברית/אנגלית), שרירים, ציוד, רמת קושי, הוראות.
- קטגוריות: חזה, גב, רגליים, כתפיים, זרועות, ליבה, קרדיו.
- סוגי ציוד: משקל גוף, משקולות, מכונות, בית, אביזרים.

## עיצוב וטכנולוגיות

- RTL מלא, צבעים לפי קבוצת שרירים
- FlatList וירטואלי, אופטימיזציית חיפוש
- State Management: ExerciseStore, SearchStore, FavoritesStore

---

**הערות:**

- מסמך זה מתמקד בתכונות הקריטיות של מסכי התרגילים
- לפרטים טכניים נוספים ראה את קבצי הקוד עצמם
