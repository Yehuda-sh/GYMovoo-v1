# מסכי תרגילים (Exercise Screens) 💪

## סקירה כללית

מסכי התרגילים מספקים גישה למאגר ענק, חיפוש וסינון מתקדם, פרטי תרגיל מלאים, ומערכת לימוד אינטראקטיבית.

## מסכים עיקריים

- **ExerciseListScreen** (`src/screens/exercise/ExerciseListScreen.tsx`): רשימת תרגילים, חיפוש, סינון, מועדפים, UX מתקדם.
- **ExerciseDetailsModal** (`src/screens/exercise/ExerciseDetailsModal.tsx`): פרטי תרגיל, הוראות, טיפים, שגיאות, וריאציות, הוספה לאימון/מועדפים.
- **ExercisesScreen** (`src/screens/exercises/ExercisesScreen.tsx`): דשבורד תרגילים, סטטיסטיקות, המלצות, מדריכים.
- **MuscleMapSearchScreen** (`src/screens/exercise/MuscleMapSearchScreen.tsx`): חיפוש תרגילים דרך מפת גוף אינטראקטיבית.
- **MuscleMapInteractive** (`src/screens/exercise/MuscleMapInteractive.tsx`): רכיב מפת שרירים אינטראקטיבית (SVG, אנימציות, RTL).
- **MuscleBar** (`src/screens/exercise/MuscleBar.tsx`): גרף איזון שרירים, טרנדים, צבעים.

## זרימת ניווט

```
MainScreen → ExercisesScreen → ExerciseListScreen
                ↓                     ↓
        MuscleMapSearchScreen → ExerciseDetailsModal
                ↓                     ↓
        MuscleMapInteractive → Add to Workout/Favorites
```

## מאגר התרגילים

- מבנה נתונים עשיר: שם (עברית/אנגלית), שרירים, ציוד, רמת קושי, הוראות, טיפים, שגיאות, תמונות/GIF.
- קטגוריות: חזה, גב, רגליים, כתפיים, זרועות, ליבה, קרדיו.
- סוגי ציוד: משקל גוף, משקולות, מכונות, בית, אביזרים.

## עיצוב ו-UX

- RTL מלא, Typography ברור, Color Coding לפי קבוצת שרירים, מרווחים נוחים, Imagery איכותי.
- Quick Actions, Search History, Smart Suggestions, Offline Access.

## טכנולוגיות וביצועים

- FlatList וירטואלי, Image Caching, Search Optimization, Memory Management.
- State Management: ExerciseStore, SearchStore, FavoritesStore, FilterStore.

## אנליטיקה

- מעקב פופולריות, זמן צפייה, דפוסי חיפוש, המרות, תובנות אישיות.

## משימות עתידיות

- AR Exercise Demonstration, Video Tutorials, Form Analysis עם AI, Custom Exercise Creation, Community Reviews.
- אינטגרציות: YouTube, Instagram, Influencers, Medical Database.
- בינה מלאכותית: Smart Matching, Injury Prevention, Progressive Loading, Personal Trainer AI.

---

**הערות:**

- שמור על קוד ותיעוד דו-לשוני.
- עדכן מסמך זה בכל שינוי משמעותי בזרימה, עיצוב, או מבנה נתונים.
- אם יש כפילויות/מידע לא רלוונטי – מיזג/קצר והשאר רק את הדגשים הקריטיים.
