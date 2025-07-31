// DEVELOPMENT.md

# 🛠️ הנחיות פיתוח - GYMovoo

## פקודות פיתוח עיקריות

### הפעלת האפליקציה

```bash
# הפקודה הסטנדרטית להפעלת Expo (מומלצת)
npx expo start

# או באמצעות npm script (עובד גם כן - קורא ל-npx expo start)
npm start

# הפעלה עם ניקוי cache (רק אם יש בעיות טעינה)
npx expo start --clear

# הפעלה עם development build
npm run start:dev-client
```

### פקודות נוספות

```bash
# הפעלה על Android
npm run android

# הפעלה על iOS
npm run ios

# הפעלה ברשת
npm run web

# בדיקת איכות קוד (כל הכלים)
npm run check:all

# כלי בדיקה מתקדמים נוספים
npm run check:health        # בדיקת בריאות פרויקט
npm run check:navigation     # בדיקת מערכת ניווט
npm run check:components     # בדיקת רכיבים חסרים
npm run check:performance    # בדיקת ביצועים
npm run check:security       # בדיקת אבטחה
```

## � עדכון חדש: אופציה 2 - איחוד מסכי האימון (31/07/2025)

### 🎯 השינויים החדשים בפיתוח:

#### 🗑️ **קבצים שנמחקו:**

```bash
# לא קיים יותר:
src/screens/workout/ActiveWorkoutScreen.tsx  # נמחק - 450+ שורות
```

#### ✅ **קבצים שעודכנו:**

```bash
# עודכן למצבים מרובים:
src/screens/workout/QuickWorkoutScreen.tsx  # מסך אוניברסלי חדש

# עודכן להסיר הקובץ הישן:
init_structure.ps1                          # עדכון סקריפט היצירה
```

#### 🔧 **תיקוני TypeScript שנדרשו:**

```typescript
// שגיאות שתוקנו בפיתוח:
// 1. Set interface - שדות לא קיימים:
- set.number, set.weight, set.reps           // הוסרו
+ set.targetWeight, set.actualWeight         // הוחלפו

// 2. Exercise interface - שדות נדרשים:
+ primaryMuscles: ["כללי"]                  // נוסף
+ equipment: "לא מוגדר"                     // נוסף

// 3. פרמטרים לא בשימוש:
- .map((set, index) => ...)                  // הוסר index
+ .map((set) => ...)                         // נוקה
```

#### 📱 **מצבי הפעלה חדשים:**

```typescript
// QuickWorkoutScreen תומך ב-3 מצבים:
// 1. "full" - מצב מלא (ברירת מחדל)
// 2. "single-exercise" - מצב תרגיל יחיד (חדש)
// 3. "view-only" - מצב צפייה בלבד (חדש)

// דוגמה לשימוש:
navigation.navigate("QuickWorkout", {
  mode: "single-exercise",
  exerciseName: "לחיצת חזה",
  hideAdvancedFeatures: true,
});
```

## �📝 הערות חשובות

- **תמיד השתמש ב-`npx expo start`** - זוהי הפקודה הסטנדרטית של Expo
- פקודת `npm start` **גם עובדת** - מוגדרת לקרוא ל-`npx expo start`
- לניקוי cache: `--clear` (רק כשיש בעיות טעינה, שגיאות import)
- אם אתה צריך development build, השתמש ב-`npm run start:dev-client`
- **עבודה עם Expo פעיל:** אם Expo כבר רץ - לחץ `r` בטרמינל לרענון (אל תפתח טרמינלחדש)

## 🎯 לקחים קריטיים לפיתוח

### 🔧 לקח #3: Multi-File Data Synchronization (31/07/2025)

**בעיה:** נתונים זהים (כמו frequency mapping) קיימים בקבצים שונים ולא מסונכרנים  
**דוגמה:** `"4 times per week"` חסר במיפוי של `WorkoutPlansScreen.tsx` אבל קיים ב-`workoutDataService.ts`  
**פתרון:** כאשר מוסיפים ערך חדש - בדוק בכל הקבצים הרלוונטיים ועדכן בכולם  
**מניעה:** יצירת קובץ constants משותף לערכים המשותפים

### 🔧 לקח #4: Interface Field Naming Consistency (31/07/2025)

**בעיה:** שדות בממשקי TypeScript לא תואמים לשדות בנתונים האמיתיים  
**דוגמה:** `QuestionnaireMetadata` חסר שדה `equipment` למרות שהנתונים כוללים אותו  
**פתרון:** בדיקה קפדנית של שמות שדות בממשקים מול הנתונים בפועל  
**מניעה:** unit tests לוולידציית התאמת ממשקים לנתונים

## 🏗️ מבנה הפרויקט (עדכני - 30/07/2025)

### 📊 סטטיסטיקות נוכחיות:

- **27 מסכים פעילים** (ללא רכיבים וגיבויים)
- **3 קטגוריות רכיבים** (common, ui, workout) עם 12 רכיבים
- **15 שירותים פעילים** כולל workoutHistoryService
- **15+ כלי בדיקה** לוולידציה אוטומטית

```
src/
├── components/     # קומפוננטים נשמושיים (3 קטגוריות)
│   ├── common/     # BackButton, DefaultAvatar, LoadingSpinner, etc.
│   ├── ui/         # UniversalButton, UniversalCard, ScreenContainer
│   └── workout/    # FloatingActionButton, ExerciseTipsModal
├── screens/        # מסכי האפליקציה (27 מסכים פעילים)
├── services/       # שירותים ו-Business Logic (15 שירותים)
├── data/          # מאגרי נתונים וקבועים
├── navigation/    # ניווט (Stack + Tabs)
├── hooks/         # Custom Hooks
├── stores/        # State Management (Zustand)
├── styles/        # עיצוב גלובלי (theme.ts)
└── utils/         # כלי עזר
```

## 🔧 הגדרות פיתוח

### VS Code Extensions מומלצות

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- TypeScript Importer
- React Native Tools

### הגדרות ESLint וPrettier

הפרויקט מגיע עם הגדרות ESLint ו-Prettier מוכנות מראש.

## 🧪 כלי בדיקה פנימיים

### כלי בדיקה חובה לפני commit:

```bash
# בדיקת ניווט מלא (אפס שגיאות נדרש)
node scripts/checkNavigation.js

# בדיקת רכיבים חסרים
node scripts/checkMissingComponents.js

# בדיקת בריאות פרויקט (ציון 100/100 נדרש)
node scripts/projectHealthCheck.js

# בדיקת TypeScript
npx tsc --noEmit
```

### כלי בדיקה מתקדמים:

```bash
# בדיקת ביצועים
node scripts/performanceCheck.js

# בדיקת אבטחה
node scripts/securityCheck.js

# בדיקת נגישות
node scripts/accessibilityCheck.js

# בדיקת איכות קוד
node scripts/codeQualityCheck.js
```

## ⚠️ כללי פיתוח חשובים

- **RTL חובה:** כל רכיב חדש חייב לתמוך ב-RTL מלא
- **Theme בלבד:** אין ערכים קשיחים - הכל מ-theme.ts
- **Imports יחסיים:** רק `./` - לא `src/...`
- **TypeScript מחמיר:** אין `any` - כל טיפוס מוגדר
- **תיעוד דו-לשוני:** עברית + אנגלית בכל קובץ
- **בדיקת נתונים:** תמיד בדוק מבנה נתונים לפני גישה
