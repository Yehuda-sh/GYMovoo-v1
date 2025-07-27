````markdown
<!--
@file docs/CRITICAL_PROJECT_CONTEXT_NEW.md
@brief חוקי ברזל, סטנדרטים והלקחים של פרויקט GYMovoo | Iron Rules, Standards & Lessons for GYMovoo Project
@dependencies theme.ts, theme.components, Zustand, Expo, React Navigation, TypeScript
@notes כל עדכון דורש סנכרון גם לכלי ה-AI ולעדכן גרסה במאגר.
@recurring_errors חובה לקרוא סעיף "לקחים חוזרים" לפני כל שינוי קוד!
-->

# 🏋️‍♂️ GYMovoo – חוקי ברזל, סטנדרטים ולקחים

## תוכן עניינים | Table of Contents

1. [כללי זהב (עברית)](#1-כללי-זהב-עברית)
2. [Golden Rules (English)](#11-golden-rules-english)
3. [סטנדרטים של תיעוד (עברית)](#2-סטנדרטים-של-תיעוד-עברית)
4. [Documentation Standards (English)](#21-documentation-standards-english)
5. [עיצוב ו־UI (עברית)](#3-עיצוב-ו-ui-עברית)
6. [UI & Design (English)](#31-ui--design-english)
7. [ארגון קוד ונתונים (עברית)](#4-ארגון-קוד-ונתונים-עברית)
8. [Code & Data Organization (English)](#41-code--data-organization-english)
9. [UX וחוויית משתמש (עברית)](#5-ux-וחוויית-משתמש-עברית)
10. [UX & User Experience (English)](#51-ux--user-experience-english)
11. [בדיקות לפני הגשה (עברית)](#6-בדיקות-לפני-הגשה-עברית)
12. [Pre-submission QA (English)](#61-pre-submission-qa-english)
13. [כללים נוספים (עברית)](#9-כללים-נוספים-עברית)
14. [Additional Rules (English)](#91-additional-rules-english)
15. [כלי בדיקה וQA (עברית)](#8-כלי-בדיקה-וqa-עברית)
16. [QA & Validation Tools (English)](#81-qa--validation-tools-english)
17. [מבנה הפרויקט המעודכן (עברית)](#10-מבנה-הפרויקט-המעודכן-עברית)
18. [Updated Project Structure (English)](#101-updated-project-structure-english)
19. [לקחים חוזרים מהיומן | Recurring Lessons](#📚-לקחים-חוזרים-מהיומן--recurring-lessons)

---

## 1. 🟦 כללי זהב (עברית)

- כל מסך/קומפוננטה חייבים לתמוך RTL מלא (flexDirection: 'row-reverse', textAlign: 'right', אייקונים/כפתורים לכיוון ימין).
- אסור להשתמש בערכי עיצוב/צבע/גודל קשיחים – הכל מ-theme.ts ו-theme.components בלבד.
- ייבוא יחסי בלבד (./) – לא src/...
- אין שימוש ב-any ב-TypeScript – כל טיפוס ו-prop חייב להיות מוגדר במדויק.
- כל שינוי ב-prop או interface – לעדכן בכל הממשקים/קבצים התלויים.
- אין להשאיר קבצים מעל 500 שורות – חובה לפצל ל-components, hooks, utils.
- אין לקנן FlatList בתוך ScrollView – רק FlatList כרכיב ראשי.
- להעדיף פשטות על פני אפקטים, להוסיף גרדיאנט/אנימציה רק בדרישה אמיתית.
- תיעוד דו-לשוני (עברית + אנגלית) בכל קובץ/פונקציה.
- אייקונים/חצים מתואמים RTL (chevron-forward לימין).
- כל UI/פיצ'ר חדש – לעדכן theme לפני שמיישמים.
- מיילים/שמות משתמש באנגלית בלבד, ASCII בלבד.
- לפני merge: לנקות לוגים, קוד דיבוג, וקוד מת.
- כל מסך חדש = 3 עדכונים חובה: screen file, types.ts, AppNavigator.tsx.
- לפני commit: להריץ כלי בדיקה (checkNavigation, checkMissingComponents, projectHealthCheck).

---

## 1.1 🟦 Golden Rules (English)

- Every screen/component must fully support RTL: flexDirection: 'row-reverse', textAlign: 'right', all icons/buttons point right.
- No hardcoded color/size/style values – use theme.ts and theme.components only.
- Relative imports only (./) – never use src/...
- No `any` in TypeScript – every type/prop must be strictly typed.
- Any prop/interface change must update all dependent interfaces/files.
- No files above 500 lines – always split into components, hooks, utils.
- Never nest FlatList inside ScrollView – FlatList is the main scrolling component.
- Prefer simplicity over effects; add gradients/animations only on real demand.
- Bilingual documentation (Hebrew + English) in every file/function.
- Icons/arrows always match RTL (chevron-forward to the right).
- Any new UI/feature – update theme before use.
- Emails/usernames in English only, ASCII only.
- Before merge: remove logs, debug code, and dead code.
- Every new screen = 3 mandatory updates: screen file, types.ts, AppNavigator.tsx.
- Before commit: run validation tools (checkNavigation, checkMissingComponents, projectHealthCheck).

---

## 2. 🟩 סטנדרטים של תיעוד (עברית)

- כל קובץ פותח ב-Header תיעוד:

```ts
/**
 * @file [נתיב מלא]
 * @brief [מה עושה]
 * @dependencies [תלויות עיקריות]
 * @notes [הערות מיוחדות]
 * @recurring_errors [שגיאות נפוצות]
 */
```
````

- הערות בקוד – תמיד דו-לשוני (עברית ואז אנגלית).
- אין שימוש ב-any.
- כל קומפוננטה – פונקציונלית בלבד.

---

## 2.1 🟩 Documentation Standards (English)

Every file starts with a documentation header:

```ts
/**
 * @file [Full Path]
 * @brief [Purpose]
 * @dependencies [Main dependencies]
 * @notes [Special notes]
 * @recurring_errors [Common errors]
 */
```

- Comments always bilingual (Hebrew first, then English).
- No use of any.
- All components functional only.

---

## 3. 🎨 עיצוב ו-UI (עברית)

- שימוש ב-theme.components (גרסה 5.1+).
- קצוות עגולים (borderRadius: 16) בכל הכרטיסים/רכיבים.
- עיצוב כרטיס (Card) עם מסגרת וצל (theme.components.card).
- כפתור ראשי/משני – מה־theme.
- spacing רק מה-theme.
- אייקונים – MaterialCommunityIcons בלבד.
- שינוי עיצוב – רק דרך theme.

---

## 3.1 🎨 UI & Design (English)

- Use theme.components (v5.1+).
- Rounded corners (borderRadius: 16) for all cards/components.
- Card design with border and shadow (theme.components.card).
- Primary/secondary buttons – from theme.
- Spacing from theme only.
- Icons – MaterialCommunityIcons only.
- Any design change – update theme first.

---

## 4. 🗂️ ארגון קוד ונתונים (עברית)

- כל קובץ data (שאלות, אופציות) בנפרד מהקומפוננטות.
- פונקציות עזר – בתיקיית utils/helpers/data.
- imports יחסיים בלבד.
- שמות קבצים:
  - רכיבים – kebab-case
  - data – snake_case
  - תיקיות – PascalCase

---

## 4.1 🗂️ Code & Data Organization (English)

- All data files (questions, options) separated from components.
- Helpers in utils/helpers/data.
- Relative imports only.
- File names:
  - Components – kebab-case
  - Data – snake_case
  - Folders – PascalCase

---

## 5. 🎯 UX וחוויית משתמש (עברית)

- שאלון דינמי – כל שאלה בהתאם לתשובות.
- אין מסך (מלבד אימון) עם גלילה.
- כפתורי פעולה תמיד גלויים גם במסך קטן.
- ברירות מחדל חכמות בכל שדה.
- משוב מיידי למשתמש (הצלחה/שגיאה).

---

## 5.1 🎯 UX & User Experience (English)

- Dynamic questionnaire – each question adapts to answers.
- No screen (except workout) should require scrolling.
- Action buttons always visible, even on small screens.
- Smart defaults for every field.
- Immediate feedback to user (success/error).

---

## 6. 🧪 בדיקות לפני הגשה (עברית)

- בדוק RTL מלא, שימוש ב-theme, Header תיעוד, הערות דו-לשוניות, עיצוב כ-Workout, theme.components.
- שינוי ב-data – לעדכן גם בקובצי עזר.

---

## 6.1 🧪 Pre-submission QA (English)

- Test full RTL, theme usage, doc headers, bilingual comments, workout-style design, theme.components everywhere.
- Data changes – update helpers as well.

---

## 7. 🟧 כללים נוספים (עברית)

- מותר לשלוח פונקציה/קטע קטן עם מספרי שורות – בתנאי שאח"כ שולחים קובץ מלא.
- כל פיצ׳ר – checkpoint עם סיכום ופקודות git.
- טיפוס מדויק ב-TS, שימוש ב-env רק לסודות.
- חיפוש תלות גלובלי לפני merge.
- אין any, אין קוד ישן.

---

## 8. 🔧 כלי בדיקה וQA (עברית)

### כלי בדיקה חובה:

```bash
# בדיקת ניווט מלא
node scripts/checkNavigation.js

# בדיקת רכיבים חסרים
node scripts/checkMissingComponents.js

# בדיקת מצב פרויקט כללי
node scripts/projectHealthCheck.js

# בדיקת TypeScript
npx tsc --noEmit

# בדיקת ESLint (אופציונלי - יש הרבה warnings)
npx eslint src/ --fix
```

### מבנה תיקיות נדרש:

- `scripts/` - כלי בדיקה אוטומטיים
- `docs/NAVIGATION_GUIDE.md` - תיעוד מערכת ניווט
- `src/navigation/types.ts` - טיפוסי ניווט מרכזיים

---

## 8.1 🔧 QA & Validation Tools (English)

### Mandatory validation tools:

```bash
# Full navigation check
node scripts/checkNavigation.js

# Missing components check
node scripts/checkMissingComponents.js

# Overall project health
node scripts/projectHealthCheck.js

# TypeScript validation
npx tsc --noEmit

# ESLint check (optional - many warnings)
npx eslint src/ --fix
```

### Required folder structure:

- `scripts/` - automated validation tools
- `docs/NAVIGATION_GUIDE.md` - navigation system documentation
- `src/navigation/types.ts` - centralized navigation types

---

## 9. 🟧 כללים נוספים (עברית)

- מותר לשלוח פונקציה/קטע קטן עם מספרי שורות – בתנאי שאח"כ שולחים קובץ מלא.
- כל פיצ׳ר – checkpoint עם סיכום ופקודות git.
- טיפוס מדויק ב-TS, שימוש ב-env רק לסודות.
- חיפוש תלות גלובלי לפני merge.
- אין any, אין קוד ישן.

---

## 9.1 🟧 Additional Rules (English)

- You may send a small function/patch with line numbers – but must send a full file for approval after.
- Each feature – checkpoint with summary and git commands.
- Precise TypeScript typing, use env for secrets only.
- Global dependency search before merge.
- No any, no legacy code.

---

## 10. � מבנה הפרויקט המעודכן (עברית)

### מבנה תיקיות ראשי:

```
GYMovoo/
├── app/                    # App Router מבוססי Expo
│   ├── _layout.tsx         # Layout ראשי עם navigation
│   └── index.tsx           # Entry point
├── src/                    # קוד מקור ראשי
│   ├── components/         # רכיבים שימושיים
│   ├── data/              # מידע סטטי
│   ├── hooks/             # Custom hooks
│   ├── navigation/        # מערכת ניווט
│   ├── screens/           # כל המסכים
│   ├── services/          # שירותי נתונים
│   ├── stores/            # State management
│   └── styles/            # עיצוב גלובלי
├── assets/                # תמונות ואייקונים
├── scripts/               # כלי בדיקה ו-automation
└── docs/                  # תיעוד מפורט
```

### מסכים קיימים (22 מסכים):

```
src/screens/
├── auth/                  # אימות (3 מסכים)
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── TermsScreen.tsx
├── exercise/              # תרגילים (3 מסכים)
│   ├── ExerciseListScreen.tsx
│   ├── ExerciseDetailsModal.tsx
│   └── MuscleBar.tsx
├── exercises/             # ספריית תרגילים (1 מסך)
│   └── ExercisesScreen.tsx
├── history/               # היסטוריה (1 מסך)
│   └── HistoryScreen.tsx
├── main/                  # מסך ראשי (1 מסך)
│   └── MainScreen.tsx
├── notifications/         # התראות (1 מסך)
│   └── NotificationsScreen.tsx
├── profile/               # פרופיל (1 מסך)
│   └── ProfileScreen.tsx  # פרופיל מקיף עם תצוגת ציוד, הישגים וסטטיסטיקות
├── progress/              # מעקב התקדמות (1 מסך)
│   └── ProgressScreen.tsx
├── questionnaire/         # שאלון (8 מסכים)
│   ├── AgeSelector.tsx
│   ├── DietSelector.tsx
│   ├── EquipmentSelector.tsx
│   ├── ExperienceSelector.tsx
│   ├── FitnessGoalSelector.tsx
│   ├── GenderSelector.tsx
│   ├── HeightWeightSelector.tsx
│   └── QuestionnaireResults.tsx
├── welcome/               # קבלת פנים (1 מסך)
│   └── WelcomeScreen.tsx
└── workout/               # אימון (1 מסך)
    └── WorkoutScreen.tsx
```

### רכיבים עיקריים (6 קטגוריות):

```
src/components/
├── common/                # רכיבים כלליים
│   ├── BackButton.tsx     # כפתור חזרה RTL
│   └── DefaultAvatar.tsx  # אווטר ברירת מחדל
├── ui/                    # רכיבי ממשק
│   ├── ScreenContainer.tsx # Container עם RTL
│   ├── UniversalButton.tsx # כפתור מתואם theme
│   └── UniversalCard.tsx   # כרטיס מתואם theme
└── workout/               # רכיבי אימון
    └── FloatingActionButton.tsx # FAB למשימות מהירות
```

### שירותים (5 שירותים):

```
src/services/
├── authService.ts         # שירותי אימות (כולל dev mode)
├── exerciseService.ts     # ניהול תרגילים
├── questionnaireService.ts # עיבוד שאלון
├── quickWorkoutGenerator.ts # יצירת אימונים
└── workoutDataService.ts  # ניהול נתוני אימון
```

### כלי פיתוח ודיבוג:

```
שירותי authService כוללים:
├── fakeGoogleSignIn()     # כניסה רגילה ללא שאלון
└── fakeGoogleSignInWithQuestionnaire() # כניסה עם שאלון מלא (DEV בלבד)

מסך Welcome כולל:
├── כפתור Google רגיל     # ניווט לשאלון
└── כפתור "🚀 דמו מהיר"  # ניווט ישירות למסך ראשי (רק ב-__DEV__)
```

```
src/services/
├── authService.ts         # שירותי אימות
├── exerciseService.ts     # ניהול תרגילים
├── questionnaireService.ts # עיבוד שאלון
├── quickWorkoutGenerator.ts # יצירת אימונים
└── workoutDataService.ts  # ניהול נתוני אימון
```

### ניווט מרכזי:

```
src/navigation/
├── AppNavigator.tsx       # Stack Navigator ראשי
├── BottomNavigation.tsx   # Bottom Tab Navigator
├── types.ts              # טיפוסי ניווט מרכזיים
└── QuestionnaireNavigationUpdate.tsx # עדכוני ניווט דינמיים
```

### כלי בדיקה אוטומטיים:

```
scripts/
├── checkNavigation.js     # בדיקת ניווט מלא
├── checkMissingComponents.js # בדיקת imports חסרים
├── projectHealthCheck.js  # בדיקה כללית (100/100)
└── testDataFlow.js       # בדיקת זרימת נתונים
```

### תיעוד מקיף:

```
docs/
├── NAVIGATION_GUIDE.md    # מדריך ניווט מלא
├── PROGRESS_LOG.md        # יומן התקדמות
└── QUESTIONNAIRE_ISSUES_REPORT.md # דוח בעיות שאלון
```

---

## 10.1 📁 Updated Project Structure (English)

### Main Folder Structure:

```
GYMovoo/
├── app/                    # Expo App Router based
│   ├── _layout.tsx         # Root layout with navigation
│   └── index.tsx           # Entry point
├── src/                    # Main source code
│   ├── components/         # Reusable components
│   ├── data/              # Static data
│   ├── hooks/             # Custom hooks
│   ├── navigation/        # Navigation system
│   ├── screens/           # All screens
│   ├── services/          # Data services
│   ├── stores/            # State management
│   └── styles/            # Global styling
├── assets/                # Images and icons
├── scripts/               # Validation & automation tools
└── docs/                  # Detailed documentation
```

### Existing Screens (22 screens):

- **Authentication**: Login, Register, Terms (3 screens)
- **Exercise Library**: ExerciseList, ExerciseDetails, MuscleBar (3 screens)
- **Exercises Overview**: ExercisesScreen (1 screen)
- **History**: HistoryScreen (1 screen)
- **Main**: MainScreen (1 screen)
- **Notifications**: NotificationsScreen (1 screen)
- **Profile**: ProfileScreen (1 screen)
- **Progress**: ProgressScreen (1 screen)
- **Questionnaire**: 8 selector screens + Results (9 screens)
- **Welcome**: WelcomeScreen (1 screen)
- **Workout**: WorkoutScreen (1 screen)

### Core Components (6 categories):

- **Common**: BackButton, DefaultAvatar
- **UI**: ScreenContainer, UniversalButton, UniversalCard
- **Workout**: FloatingActionButton

### Services (5 services):

- Authentication, Exercise, Questionnaire, QuickWorkout, WorkoutData

### Central Navigation:

- AppNavigator (Stack), BottomNavigation (Tabs), types.ts (centralized types)

### Automated Validation Tools:

- Navigation check, Missing components check, Project health (100/100), Data flow test

### Comprehensive Documentation:

- Navigation guide, Progress log, Questionnaire issues report

---

### 1. RTL – לא רק textAlign

- **בעיה:** יושם רק `textAlign: 'right'`, אך לא שונה `flexDirection`, אייקונים או חצים.
- **פתרון:** `flexDirection: 'row-reverse'` לכל רכיב רלוונטי + chevron-forward לימין.

```tsx
// ❌ Wrong
<View style={{ flexDirection: 'row' }}>

// ✅ Right
<View style={{ flexDirection: 'row-reverse' }}>
```

---

### 2. ערכי עיצוב קשיחים

- **בעיה:** שימוש ב-borderRadius/color קשיח.
- **פתרון:** תמיד theme בלבד.

```ts
// ❌ Wrong
borderRadius: 20, backgroundColor: '#121212'

// ✅ Right
borderRadius: theme.radius.lg, backgroundColor: theme.colors.card
```

---

### 3. קינון FlatList ב-ScrollView

- **בעיה:** ביצועים ירודים, אזהרות.
- **פתרון:** FlatList כרכיב ראשי.

```tsx
// ❌ Wrong
<ScrollView>
  <FlatList ... />
</ScrollView>

// ✅ Right
<FlatList ListHeaderComponent={<Header />} ... />
```

---

### 4. ייבוא לא עקבי

- **בעיה:** import מוחלט/יחסי לא נכון.
- **פתרון:** רק ./ imports.

```ts
// ❌ Wrong
import { X } from "src/screens/workout/X";
// ✅ Right
import { X } from "./X";
```

---

### 5. אייקונים לא מותאמי RTL

- **בעיה:** חץ/אייקון שמאלה.
- **פתרון:** תמיד chevron-forward.

```tsx
// ❌ Wrong
<MaterialCommunityIcons name="chevron-back" ... />
// ✅ Right
<MaterialCommunityIcons name="chevron-forward" ... />
```

---

### 6. הערות לא דו-לשוניות

- **בעיה:** הערה רק באנגלית או רק בעברית.
- **פתרון:** תמיד דו-לשוני.

```ts
// ❌ Wrong
// Update user state
// ✅ Right
// עדכון מצב משתמש | Update user state
```

---

### 7. קבצים מונוליטיים

- **בעיה:** קבצים של 1200 שורות, בלתי מתחזקים.
- **פתרון:** פיצול תמידי ל-components, hooks, utils.

---

### 8. ניהול טיפוסי ניווט

- **בעיה:** RootStackParamList מפוזר במקומות שונים, namespace issues ב-TypeScript.
- **פתרון:** קובץ נפרד `src/navigation/types.ts` לכל טיפוסי הניווט.

```tsx
// ❌ Wrong - בכל קובץ בנפרד
export type RootStackParamList = { ... }

// ✅ Right - קובץ מרכזי
// src/navigation/types.ts
export type RootStackParamList = { ... }
```

---

### 9. routes חסרים בניווט

- **בעיה:** navigation.navigate() לroutes שלא קיימים ב-AppNavigator.
- **פתרון:** כל route בקוד חייב להיות מוגדר ב-RootStackParamList ולהיות מחובר כ-Stack.Screen.

```typescript
// בדיקה: כל navigation.navigate("X") חייב להיות:
// 1. מוגדר ב-types.ts
// 2. מחובר ב-AppNavigator.tsx כ-Stack.Screen
```

---

### 10. מסכים ללא imports תקינים

- **בעיה:** מסכים חדשים שנוצרו אבל לא יובאו נכון ב-AppNavigator.
- **פתרון:** בדיקה שיטתית עם כלי אוטומטיים.

```bash
# כלי בדיקה חובה לפני commit:
node scripts/checkNavigation.js
node scripts/checkMissingComponents.js
node scripts/projectHealthCheck.js
```

---

### 11. מבנה תיקיות ומסכים

- **בעיה:** מסכים חדשים נוצרים בלי לעדכן את מבנה הפרויקט.
- **פתרון:** כל מסך חדש = עדכון ב-3 מקומות:

1. `src/screens/[category]/` - יצירת המסך
2. `src/navigation/types.ts` - הוספת הroute
3. `src/navigation/AppNavigator.tsx` - חיבור Stack.Screen

---

### 12. תיעוד מערכת הניווט

- **בעיה:** מערכת ניווט מורכבת ללא תיעוד מקיף.
- **פתרון:** תיעוד חובה ב-`docs/NAVIGATION_GUIDE.md` עם:
  - מפת כל המסכים
  - פרמטרים לכל route
  - דוגמאות שימוש
  - כלי בדיקה

---

### 14. כלי פיתוח ודיבוג

- **בעיה:** פיתוח מערכת מורכבת דורש דרכים לדלג על שלבים ארוכים (כמו מילוי שאלון).
- **פתרון:** כפתורי פיתוח זמניים עם `__DEV__` שמאפשרים כניסה מהירה:

```tsx
// כפתור רק ב-development mode
{
  __DEV__ && (
    <TouchableButton style={styles.devButton} onPress={handleDevQuickLogin}>
      <Text>🚀 דמו מהיר (פיתוח)</Text>
    </TouchableButton>
  );
}
```

```typescript
// פונקציה עם נתונים מדומים מלאים
export const fakeGoogleSignInWithQuestionnaire = async () => {
  const randomUser = generateRandomUser();
  const randomQuestionnaire = generateRandomQuestionnaire();

  return {
    ...randomUser,
    questionnaire: randomQuestionnaire,
    questionnaireData: {
      answers: randomQuestionnaire,
      completedAt: new Date().toISOString(),
      version: "1.0",
      metadata: { generatedRandomly: true, devMode: true },
    },
  };
};
```

**⚠️ שגיאת navigation נפוצה:** וודא שמשתמש בשמות routes הנכונים מ-types.ts (למשל "MainApp" ולא "Main").

---

### 15. בדיקת navigation routes

- **בעיה:** בדיקות ידניות לא מספיקות לפרויקט מורכב.
- **פתרון:** 3 כלי בדיקה חובה לפני כל commit:

```bash
# ציון מושלם 100/100 נדרש
node scripts/projectHealthCheck.js

# אפס שגיאות ניווט
node scripts/checkNavigation.js

# אפס imports חסרים
node scripts/checkMissingComponents.js
```

---

### 14. כלי פיתוח ודיבוג

- **בעיה:** פיתוח מערכת מורכבת דורש דרכים לדלג על שלבים ארוכים (כמו מילוי שאלון).
- **פתרון:** כפתורי פיתוח זמניים עם `__DEV__` שמאפשרים כניסה מהירה:

```tsx
// כפתור רק ב-development mode
{
  __DEV__ && (
    <TouchableButton style={styles.devButton} onPress={handleDevQuickLogin}>
      <Text>🚀 דמו מהיר (פיתוח)</Text>
    </TouchableButton>
  );
}
```

```typescript
// פונקציה עם נתונים מדומים מלאים
export const fakeGoogleSignInWithQuestionnaire = async () => {
  const randomUser = generateRandomUser();
  const randomQuestionnaire = generateRandomQuestionnaire();

  return {
    ...randomUser,
    questionnaire: randomQuestionnaire,
    questionnaireData: {
      answers: randomQuestionnaire,
      completedAt: new Date().toISOString(),
      version: "1.0",
      metadata: { generatedRandomly: true, devMode: true },
    },
  };
};
```

---

### 15. תצוגת ציוד בפרופיל משתמש

- **בעיה:** משתמשים לא יכלו לראות איזה ציוד הם בחרו בשאלון.
- **פתרון:** הוספת סקציה חדשה בפרופיל המציגה את הציוד הזמין:

```tsx
// תצוגת ציוד בפרופיל
{
  user?.questionnaire && (
    <View style={styles.equipmentContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>הציוד שלי</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Questionnaire")}>
          <Text style={styles.seeAllText}>ערוך</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {allEquipment.map((equipmentId) => {
          const equipment = ALL_EQUIPMENT.find((eq) => eq.id === equipmentId);
          return (
            <View key={equipmentId} style={styles.equipmentItem}>
              <View style={styles.equipmentImageContainer}>
                {equipment.image ? (
                  <Image
                    source={equipment.image}
                    style={styles.equipmentImage}
                  />
                ) : (
                  <MaterialCommunityIcons name="dumbbell" size={28} />
                )}
                {equipment.isPremium && (
                  <View style={styles.equipmentPremiumBadge}>
                    <MaterialCommunityIcons name="crown" size={12} />
                  </View>
                )}
              </View>
              <Text style={styles.equipmentLabel}>{equipment.label}</Text>
              <View style={styles.equipmentCategoryBadge}>
                <Text style={styles.equipmentCategoryText}>
                  {equipment.category === "home" ? "בית" : "חדר כושר"}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
```

**תכונות:**

- תצוגה אופקית של כל הציוד הנבחר מהשאלון
- תמונות ציוד מהמאגר המרכזי
- תגיות קטגוריה (בית/חדר כושר)
- סמל פרימיום לציוד מיוחד
- כפתור עריכה שמוביל לשאלון
- תמיכה בפורמטים ישנים וחדשים של נתוני השאלון
- הודעה ידידותית כשאין ציוד נבחר

---

🔔 **Reminder:**
יש לקרוא מסמך זה לפני כל פיתוח/רפקטור ולסנכרן כל לקח/טעות חוזרת מיד בסעיף "לקחים חוזרים"!

**📈 Project Status:** 100/100 Health Score | 22 Screens | 6 Components | 5/5 Services | Perfect Navigation

---

```

```
