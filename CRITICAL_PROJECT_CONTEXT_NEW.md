# 🚨 GYMovoo - CRITICAL_PROJECT_CONTEXT_NEW.md

### 🏆 גרסה מעודכנת - עם דגשים אישיים ושיטת עבודה

_עדכון: 2025-07-19_

---

## 🧑‍💻 פרטי עבודה מול GPT (שיטת עבודה)

**1. קבצים:**

- כל קובץ שמתקבל כאן מיועד להדבקה מלאה (אין להשאיר חלקים להשלמה ידנית).
- לשינויים קטנים: תצוין בדיוק שורת/שורות השינוי + מיקום קובץ.

**2. תהליך עבודה:**

- בכל שלב אתה (המשתמש) מדביק קוד → מריץ → שולח בעיות (problems / errors / warnings / spell / linter).
- GPT סורק, מוצא שגיאות ומחזיר קטעים/שורות לתיקון, או קובץ שלם במידת הצורך.
- חסר קובץ? GPT יבקש במפורש העתקה מהמשתמש.

**3. קצב וסגנון:**

- פירוט רק של צעדים חשובים — לא חפירה.
- קוד ישירות ל-copy-paste, מסומן לכל קובץ/מיקום.
- אם צריך לפצל קבצים/פעולות בגלל גודל — יינתנו הוראות מסודרות.
- תמיד לוודא בסיום שלב שכל הקוד נכנס כמו שצריך ואין שגיאות.

---

## 👤 התאמה אישית - תשובות המשתמש לשאלות ראשוניות

**העדפות שנבחרו:**

- **UI:** בחירת GPT (React Native Elements, בשילוב קומפוננטות מותאמות אישית).
- **State Management:** Zustand בלבד בשלב ראשון (React Query ורשת בעתיד, לא עכשיו).
- **סדר בניית מסכים:** מתחילים מה-core flow (ActiveWorkoutScreen ותשתית שמאפשרת לראות מסך "חי" על המכשיר, כדי לבדוק/להתנסות מיד).
- **הערות קוד:** תמיד דו־לשוני (עברית + משפט אנגלי קצר).
- **מסך ActiveWorkout:** UI מלא עם דאטה מדומה (mock), כולל header, היסטוריה, סטים, ניווט, progress, טיימר פיקטיבי.
- **התקנת תלויות:** מתחילים רק עם מה שצריך (לא מתקינים הכל מראש).
- **הוראות:** סיכום תמציתי לכל שלב; קוד מלא בכל קובץ; לשינויים נקודתיים — רק השינוי.
- **בדיקת שגיאות:** לאחר כל הדבקה — המשתמש שולח ל־GPT את כל ה־problems/linter/spell; GPT מחזיר תיקון/השלמה.
- **דרישה ברורה:** קוד שמתקבל = להדבקה ישירה, אין דרישה להשלמה ידנית.
- **שינויים קטנים:** לציין קובץ + שורה/מיקום מדויק.
- **אם חסר קובץ:** המשתמש ישלח את כולו ל־GPT לפי בקשה.

---

## 📋 תוכן עניינים

1. [טכנולוגיות מומלצות](#-טכנולוגיות-מומלצות)
2. [מבנה הפרויקט](#-מבנה-הפרויקט)
3. [הנחיות פיתוח](#-הנחיות-פיתוח)
4. [שיטת עבודה עם GPT](#-שיטת-עבודה-עם-gpt)
5. [מסכים נדרשים](#-מסכים-נדרשים)
6. [Design System](#-design-system)
7. [RTL Guidelines](#-rtl-guidelines)
8. [State Management](#-state-management)
9. [Database & Storage](#-database--storage)
10. [Git Workflow](#-git-workflow)
11. [Troubleshooting](#-troubleshooting)
12. [Checkpoint System](#-checkpoint-system)
13. [Next Steps](#-next-steps)

---

## 🛠️ טכנולוגיות מומלצות

- **React Native 0.79.5**
- **Expo SDK 53**
- **TypeScript 5.8.3**
- **React Navigation 7**
- **Zustand 5.0.6**
- **AsyncStorage**
- **React Native Elements** (בשילוב קומפוננטות custom)
- **React Native Vector Icons**
- **ESLint + Prettier**
- **(רק בהמשך: React Query, Sentry, Flipper, Reanimated)**

---

## 🗂️ מבנה פרויקט מלא (Full Folder Structure)

GYMovoo/
├── app/ # Expo Router (רק לניווט בסיסי)
│ ├── \_layout.tsx # Layout ראשי
│ └── index.tsx # Entry point
├── src/
│ ├── screens/ # כל מסכי האפליקציה (עמודים עיקריים)
│ │ ├── welcome/ # מסך התחלה
│ │ │ ├── WelcomeScreen.tsx
│ │ │ ├── components/
│ │ │ └── types.ts
│ │ ├── auth/ # מסכי הרשמה/התחברות
│ │ │ ├── LoginScreen.tsx
│ │ │ ├── RegisterScreen.tsx
│ │ │ ├── components/
│ │ │ └── types.ts
│ │ ├── questionnaire/ # מסכי שאלון
│ │ │ ├── QuestionnaireScreen.tsx
│ │ │ ├── components/
│ │ │ └── types.ts
│ │ ├── summary/ # מסך סיכום
│ │ │ ├── SummaryScreen.tsx
│ │ │ ├── components/
│ │ │ └── types.ts
│ │ ├── plans/ # רשימת תוכניות אימון
│ │ │ ├── PlansListScreen.tsx
│ │ │ ├── components/
│ │ │ └── types.ts
│ │ ├── plan-detail/ # פירוט תוכנית (טאבים)
│ │ │ ├── PlanDetailScreen.tsx
│ │ │ ├── components/
│ │ │ └── types.ts
│ │ └── workout/ # מסך אימון פעיל
│ │ ├── ActiveWorkoutScreen.tsx
│ │ ├── components/
│ │ └── types.ts
│ ├── components/ # קומפוננטות משותפות (כפתורים, אינפוטים וכו')
│ │ ├── common/ # רכיבים בסיסיים (Button, Input, Card)
│ │ ├── forms/ # Form components
│ │ ├── workout/ # רכיבים שקשורים לאימון (ExerciseCard, SetRow וכו')
│ │ └── ui/ # קומפוננטות עיצוביות
│ ├── hooks/ # Custom hooks
│ ├── stores/ # Zustand stores (userStore, workoutStore, historyStore)
│ ├── services/ # API/services (authService, workoutService, storageService)
│ ├── types/ # TypeScript types (user, workout, common)
│ ├── utils/ # Utility functions (validation, formatting, constants)
│ ├── constants/ # קבועים (colors, strings, config)
│ └── styles/ # Design system (theme.ts, rtl.ts, styles)
├── assets/ # תמונות, פונטים, אייקונים
├── docs/ # תיעוד פנימי
└── README.md # תיעוד פרויקט ראשי

---

### 🏁 יצירת תיקיות וקבצי placeholder - פקודת Bash (תריץ פעם אחת בספריית הפרויקט):

> כל קובץ יקבל הערת placeholder ברורה (להחלפה עתידית).

<details>
<summary>הצג פקודת Bash מלאה (אפשר להעתיק כקובץ <code>init_structure.sh</code> ולהריץ ב־Git Bash / Mac / Linux):</summary>

````bash
#!/bin/bash
mkdir -p app
touch app/_layout.tsx
touch app/index.tsx

mkdir -p src/screens/welcome/components
echo "// placeholder" > src/screens/welcome/WelcomeScreen.tsx
echo "// placeholder" > src/screens/welcome/types.ts

mkdir -p src/screens/auth/components
echo "// placeholder" > src/screens/auth/LoginScreen.tsx
echo "// placeholder" > src/screens/auth/RegisterScreen.tsx
echo "// placeholder" > src/screens/auth/types.ts

mkdir -p src/screens/questionnaire/components
echo "// placeholder" > src/screens/questionnaire/QuestionnaireScreen.tsx
echo "// placeholder" > src/screens/questionnaire/types.ts

mkdir -p src/screens/summary/components
echo "// placeholder" > src/screens/summary/SummaryScreen.tsx
echo "// placeholder" > src/screens/summary/types.ts

mkdir -p src/screens/plans/components
echo "// placeholder" > src/screens/plans/PlansListScreen.tsx
echo "// placeholder" > src/screens/plans/types.ts

mkdir -p src/screens/plan-detail/components
echo "// placeholder" > src/screens/plan-detail/PlanDetailScreen.tsx
echo "// placeholder" > src/screens/plan-detail/types.ts

mkdir -p src/screens/workout/components
echo "// placeholder" > src/screens/workout/ActiveWorkoutScreen.tsx
echo "// placeholder" > src/screens/workout/types.ts

mkdir -p src/components/common
mkdir -p src/components/forms
mkdir -p src/components/workout
echo "// placeholder" > src/components/workout/ExerciseCard.tsx
echo "// placeholder" > src/components/workout/SetRow.tsx
echo "// placeholder" > src/components/workout/WorkoutHeader.tsx
echo "// placeholder" > src/components/workout/ProgressBar.tsx
mkdir -p src/components/ui

mkdir -p src/hooks
echo "// placeholder" > src/hooks/useWorkout.ts
echo "// placeholder" > src/hooks/useExercise.ts
echo "// placeholder" > src/hooks/useAuth.ts

mkdir -p src/stores
echo "// placeholder" > src/stores/userStore.ts
echo "// placeholder" > src/stores/workoutStore.ts
echo "// placeholder" > src/stores/historyStore.ts

mkdir -p src/services
echo "// placeholder" > src/services/authService.ts
echo "// placeholder" > src/services/workoutService.ts
echo "// placeholder" > src/services/storageService.ts

mkdir -p src/types
echo "// placeholder" > src/types/user.ts
echo "// placeholder" > src/types/workout.ts
echo "// placeholder" > src/types/common.ts

mkdir -p src/utils
echo "// placeholder" > src/utils/validation.ts
echo "// placeholder" > src/utils/formatting.ts
echo "// placeholder" > src/utils/constants.ts

mkdir -p src/constants
echo "// placeholder" > src/constants/colors.ts
echo "// placeholder" > src/constants/strings.ts
echo "// placeholder" > src/constants/config.ts

mkdir -p src/styles
echo "// placeholder" > src/styles/theme.ts
echo "// placeholder" > src/styles/rtl.ts
echo "// placeholder" > src/styles/components.ts
echo "// placeholder" > src/styles/workout.ts

mkdir -p assets
mkdir -p docs
touch README.md

echo "✅ כל התיקיות והקבצים נוצרו עם placeholder!"

---

## 💻 הנחיות פיתוח

- קוד באנגלית, הערות דו־לשוניות (עברית + אנגלית).
- תמיד TypeScript מלא, לא `any`.
- לוגיקה ברורה — מינימום side effects.
- הפרדה ברורה בין קומפוננטות, מסכים, hooks, stores.

---

## 📝 שיטת עבודה עם GPT (חשוב!)

**1. כל קובץ שמתקבל - מלא (לא לבקש השלמות ידניות).**
**2. שינויים קטנים - פירוט מדויק (קובץ + שורה).**
**3. בכל שלב - שלח בעיות/שגיאות, GPT מתקן נקודתית.**
**4. אם GPT צריך קובץ שלא אצלך - יבקש ממך לשלוח אותו.**
**5. הקפדה על תיעוד מהיר, לא סחבת.**
**6. כל שלב: קודם שהכל ירוץ, רק אז מתקדמים.**

---

## 📱 מסכים נדרשים (Core)

1. **ActiveWorkoutScreen** — ראשוני (core flow, mock data).
2. (אחריו: Welcome, Auth, Questionnaire, וכו'...)

---

## 🎨 Design System (theme.ts דוגמה)

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    surface: '#F2F2F7',
    workoutActive: '#FF6B35',
    workoutCompleted: '#34C759',
    progress: '#007AFF',
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  borderRadius: {
    md: 8,
    lg: 16,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: 'bold' },
    h2: { fontSize: 22, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 13, fontWeight: 'normal' },
  },
};
🗂️ State Management
Zustand בלבד בשלב ראשון.

TypeScript strict.

🗃️ Database & Storage
AsyncStorage בלבד לשמירה מקומית (בשלבים הראשונים).

אין אינטגרציה עם API/WEB עדכון ראשון.

🚦 Git Workflow
Branch ראשי: main

Branch פיתוח: develop

Feature לפי צורך

Pull Requests בתיעוד קצר

🆘 Troubleshooting
אם יש שגיאות/הערות — לשלוח ל־GPT את כל ה־problems מה־IDE.

GPT יתקן/ישלח תיקון מדויק (או יבקש קובץ רלוונטי).

✅ Checkpoint System
נקודת ביניים כל פעם שמסך/פיצ'ר עובד.

תיעוד קצר של מה הושלם ומה בתהליך.

🚀 Next Steps (דוגמה)
יצירת פרויקט Expo (TS)

התקנת תלויות נחוצות בלבד (navigation, zustand, elements)

יצירת theme.ts + rtl.ts

העלאת מסך אימון ראשוני עם דאטה מדומה

בדיקת ריצה, תיקון שגיאות

התקדמות למסכים נוספים לפי סדר core flow

📝 הערה מסכמת
הקובץ הזה הוא ה-SINGLE SOURCE OF TRUTH
לניהול, סיכום, שיטת עבודה ובחירת טכנולוגיות/סדר עבודה לפרויקט GYMovoo.
כל שאלה, תיקון, או שלב — יתנהל על פי מה שמופיע כאן!
````

---

### 2. **הנחיה בהנחיות פיתוח (💻 הנחיות פיתוח)**

הוסף:

- "**כל מסך חדש (screen/component): צבע רקע, טקסט, גבולות — _רק_ מה־theme (לא hex ישיר!). אם יש חריגה — לעדכן theme.ts בלבד.**"

---

### 3. **הערה גם ב־Next Steps (בסוף הקובץ):**

- "הקפד על שימוש ב־theme.ts לכל עיצוב — כל מסך חדש ירוץ עם הרקע הכהה של המערכת."

---

## 🟦 תוספת מוכנה להדבקה (סיכום):

### 🎨 Design System (theme.ts דוגמה)

````markdown
- כל מסך/קומפוננטה חייבים להשתמש ב־theme מרכזי ל־colors/radius/spacing (לא hex-ים ידניים!).
- רקע ברירת מחדל: כהה, כמו Welcome (background: "#181E41"), מתוך theme.
- עדכון צבעים רק דרך theme.ts.

```typescript
// src/styles/theme.ts

export const theme = {
  colors: {
    background: "#181E41", // Dark background (default)
    backgroundAlt: "#1F2C4C", // Alt gradient
    card: "#242a47", // Card/box
    primary: "#007AFF",
    secondary: "#5856D6",
    accent: "#4e9eff",
    text: "#fff",
    textSecondary: "#8CA8FF",
    border: "#6bb5ff",
    divider: "#4b5a7a",
    google: "#fff",
    googleText: "#fff",
  },
  borderRadius: {
    md: 16,
    lg: 24,
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },
};
```
````

שימוש בכל מסך:
import { theme } from "../../styles/theme";

const styles = StyleSheet.create({
container: {
backgroundColor: theme.colors.background,
// ...
},
});
או:
<LinearGradient
colors={[theme.colors.background, theme.colors.backgroundAlt]}
style={{ flex: 1 }}

> {/_ ... _/}
> </LinearGradient>

---

### 💻 הנחיות פיתוח — עדכן להוסיף:

> כל מסך/קומפוננטה: עיצוב (צבע, טקסט, גבולות) אך ורק מתוך theme.ts המרכזי.

---

**זה יבטיח שהכול יישאר עקבי, מודרני, וקל להחלפה לכל המסכים!**
