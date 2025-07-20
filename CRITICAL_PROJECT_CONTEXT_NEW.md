# 🚨 GYMovoo - CRITICAL_PROJECT_CONTEXT_NEW.md

### 🏆 גרסה מעודכנת - עם דגשים אישיים ושיטת עבודה

_עדכון: 2025-01-20_

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
7. [Animation Guidelines](#-animation-guidelines)
8. [RTL Guidelines](#-rtl-guidelines)
9. [State Management](#-state-management)
10. [Database & Storage](#-database--storage)
11. [Git Workflow](#-git-workflow)
12. [Troubleshooting](#-troubleshooting)
13. [Checkpoint System](#-checkpoint-system)
14. [Next Steps](#-next-steps)

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

```
GYMovoo/
├── app/                    # Expo Router (רק לניווט בסיסי)
│   ├── _layout.tsx        # Layout ראשי
│   └── index.tsx          # Entry point
├── src/
│   ├── screens/           # כל מסכי האפליקציה (עמודים עיקריים)
│   │   ├── welcome/       # מסך התחלה
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── auth/          # מסכי הרשמה/התחברות
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── questionnaire/ # מסכי שאלון
│   │   │   ├── QuestionnaireScreen.tsx
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── main/          # מסך ראשי
│   │   │   ├── MainScreen.tsx
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── profile/       # פרופיל משתמש
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── exercises/     # רשימת תרגילים
│   │   │   ├── ExerciseListScreen.tsx
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── plans/         # רשימת תוכניות אימון
│   │   │   ├── PlansListScreen.tsx
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   └── workout/       # מסך אימון פעיל
│   │       ├── ActiveWorkoutScreen.tsx
│   │       ├── components/
│   │       └── types.ts
│   ├── components/        # קומפוננטות משותפות
│   │   ├── common/        # רכיבים בסיסיים (Button, Input, Card)
│   │   ├── forms/         # Form components
│   │   ├── workout/       # רכיבים לאימון (ExerciseCard, SetRow)
│   │   └── ui/            # קומפוננטות עיצוביות
│   ├── hooks/             # Custom hooks
│   ├── stores/            # Zustand stores
│   ├── services/          # API/services
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── constants/         # קבועים
│   └── styles/            # Design system (theme.ts, rtl.ts)
├── assets/                # תמונות, פונטים, אייקונים
├── docs/                  # תיעוד פנימי
└── README.md              # תיעוד פרויקט ראשי
```

---

## 💻 הנחיות פיתוח

- קוד באנגלית, הערות דו־לשוניות (עברית + אנגלית)
- תמיד TypeScript מלא, לא `any`
- לוגיקה ברורה — מינימום side effects
- הפרדה ברורה בין קומפוננטות, מסכים, hooks, stores
- **כל צבע/גודל/רווח - רק מ-theme.ts! (לא hex ישירים)**
- **אנימציות בכל מסך לחוויית משתמש טובה**
- **סימולציות לפיצ'רים עתידיים (כמו Google Sign In)**
- **שימוש ב-ActivityIndicator בזמן טעינה**
- **כל מסך חדש ירוץ עם הרקע הכהה של המערכת**

---

## 📝 שיטת עבודה עם GPT (חשוב!)

**1. כל קובץ שמתקבל - מלא (לא לבקש השלמות ידניות).**  
**2. שינויים קטנים - פירוט מדויק (קובץ + שורה).**  
**3. בכל שלב - שלח בעיות/שגיאות, GPT מתקן נקודתית.**  
**4. אם GPT צריך קובץ שלא אצלך - יבקש ממך לשלוח אותו.**  
**5. הקפדה על תיעוד מהיר, לא סחבת.**  
**6. כל שלב: קודם שהכל ירוץ, רק אז מתקדמים.**

---

## 📱 מסכים נדרשים (Core) - סטטוס עדכני

1. **WelcomeScreen** ✅ — מסך פתיחה עם אנימציות וקרוסלה
2. **QuestionnaireScreen** ✅ — שאלון משתמש
3. **LoginScreen/RegisterScreen** ✅ — הרשמה/התחברות
4. **MainScreen** ✅ — מסך ראשי
5. **ProfileScreen** ✅ — פרופיל משתמש
6. **ExerciseListScreen** ✅ — רשימת תרגילים עם API
7. **ActiveWorkoutScreen** 🔄 — מסך אימון פעיל (הבא בתור)
8. **PlansListScreen** ⏳ — תוכניות אימון
9. **PlanDetailScreen** ⏳ — פירוט תוכנית
10. **HistoryScreen** ⏳ — היסטוריית אימונים

---

## 🎨 Design System (theme.ts)

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    // רקעים ראשיים // Main backgrounds
    background: "#181E41", // רקע כהה ראשי
    backgroundAlt: "#1F2C4C", // רקע משני לגרדיאנטים

    // כרטיסים ומשטחים // Cards and surfaces
    card: "#242a47", // רקע כרטיסים
    cardBorder: "rgba(107, 181, 255, 0.2)", // גבול כרטיסים

    // צבעים ראשיים // Primary colors
    primary: "#007AFF", // כחול ראשי
    primaryGradientStart: "#4e9eff", // התחלת גרדיאנט
    primaryGradientEnd: "#007AFF", // סוף גרדיאנט

    // צבעים משניים // Secondary colors
    secondary: "#5856D6", // סגול
    accent: "#4e9eff", // כחול בהיר
    success: "#34C759", // ירוק הצלחה
    error: "#FF3B30", // אדום שגיאה
    warning: "#FF9500", // כתום אזהרה

    // טקסט // Text
    text: "#fff", // טקסט ראשי
    textSecondary: "#8CA8FF", // טקסט משני

    // גבולות וקווים // Borders and lines
    border: "#6bb5ff", // גבול כחול
    divider: "#4b5a7a", // קו מפריד

    // כפתורי כניסה // Auth buttons
    google: "#4285F4", // כפתור Google
    googleText: "#fff", // טקסט Google

    // אחרים // Others
    overlay: "rgba(0, 0, 0, 0.5)", // רקע שקוף
    shadow: "#000", // צל
    indicator: "rgba(255, 255, 255, 0.3)", // אינדיקטור לא פעיל
    indicatorActive: "#4e9eff", // אינדיקטור פעיל
    userCounterBg: "rgba(78, 158, 255, 0.1)", // רקע מונה משתמשים
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  typography: {
    // כותרות // Headings
    h1: {
      fontSize: 32,
      fontWeight: "bold" as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold" as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "bold" as const,
      lineHeight: 28,
    },

    // טקסט רגיל // Body text
    body: {
      fontSize: 16,
      fontWeight: "normal" as const,
      lineHeight: 22,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "normal" as const,
      lineHeight: 20,
    },

    // כיתובים // Captions
    caption: {
      fontSize: 13,
      fontWeight: "normal" as const,
      lineHeight: 18,
    },

    // כפתורים // Buttons
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
      letterSpacing: 0.5,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: "bold" as const,
      letterSpacing: 1,
    },
  },

  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    glow: {
      shadowColor: "#4e9eff",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};
```

---

## 🎭 Animation Guidelines

- **אנימציות כניסה**: Fade-in לכל מסך חדש (opacity 0→1)
- **אינטראקציות**: Scale 0.95 בלחיצה על כפתורים
- **משך אנימציות**: השתמש ב-theme.animations (fast/normal/slow)
- **קרוסלות**: תמיד עם snapToInterval ו-decelerationRate="fast"
- **טעינה**: ActivityIndicator במקום טקסט סטטי
- **מעברים**: Animated.timing עם useNativeDriver: true
- **Lists**: FlatList עם initialNumToRender ו-windowSize מותאמים

---

## 🌍 RTL Guidelines

- כל האפליקציה ב-RTL כברירת מחדל
- שימוש ב-`I18nManager.forceRTL(true)`
- flexDirection: 'row-reverse' לסידור אלמנטים
- textAlign: 'right' לטקסטים
- writingDirection: 'rtl' לכותרות

---

## 🗂️ State Management

- **Zustand בלבד בשלב ראשון**
- **TypeScript strict**
- **Stores נפרדים לכל תחום:**
  - `userStore` - ניהול משתמש
  - `workoutStore` - ניהול אימון פעיל
  - `exercisesStore` - רשימת תרגילים
  - `historyStore` - היסטוריית אימונים

---

## 🗃️ Database & Storage

- **AsyncStorage בלבד לשמירה מקומית (בשלבים הראשונים)**
- **אין אינטגרציה עם API/WEB בשלב ראשון**
- **שמירת:**
  - הגדרות משתמש
  - תשובות שאלון
  - היסטוריית אימונים
  - תרגילים מועדפים

---

## 🚦 Git Workflow

- Branch ראשי: `main`
- Branch פיתוח: `develop`
- Feature branches: `feature/welcome-screen`
- Commit messages: `feat:`, `fix:`, `docs:`, `style:`
- Pull Requests בתיעוד קצר

---

## 🆘 Troubleshooting

- אם יש שגיאות/הערות — לשלוח ל־GPT את כל ה־problems מה־IDE
- GPT יתקן/ישלח תיקון מדויק (או יבקש קובץ רלוונטי)
- בעיות נפוצות:
  - אייקונים חסרים - בדוק שם נכון ב-MaterialCommunityIcons
  - TypeScript errors - וודא types מוגדרים נכון
  - Navigation - וודא שהמסך רשום ב-navigation

---

## ✅ Checkpoint System

- נקודת ביניים כל פעם שמסך/פיצ'ר עובד
- תיעוד קצר של מה הושלם ומה בתהליך
- **כל checkpoint כולל:**
  - רשימת קבצים שעודכנו
  - סטטוס ברור - "הכל רץ נקי" או רשימת בעיות
  - Next Steps ברורים עם סדר עדיפויות
  - פקודות Git מומלצות

---

## 🚀 Next Steps - סדר עדיפויות

1. **ActiveWorkoutScreen** - מסך אימון פעיל עם:

   - טיימר אמיתי
   - ניהול סטים
   - מעקב התקדמות
   - שמירת נתונים

2. **שיפור ExerciseListScreen:**

   - הוספת תרגיל למועדפים
   - חיפוש מתקדם
   - פילטר לפי ציוד

3. **PlansListScreen:**

   - תוכניות מוכנות
   - יצירת תוכנית מותאמת
   - שיתוף תוכניות

4. **AsyncStorage Integration:**
   - שמירת כל הנתונים מקומית
   - סנכרון בין מסכים
   - backup/restore

---

## 📝 הערה מסכמת

הקובץ הזה הוא ה-**SINGLE SOURCE OF TRUTH**  
לניהול, סיכום, שיטת עבודה ובחירת טכנולוגיות/סדר עבודה לפרויקט GYMovoo.  
כל שאלה, תיקון, או שלב — יתנהל על פי מה שמופיע כאן!

**הקפד על שימוש ב-theme.ts לכל עיצוב — כל מסך חדש ירוץ עם הרקע הכהה של המערכת.**

---

_נערך לאחרונה: 2025-07-20_
