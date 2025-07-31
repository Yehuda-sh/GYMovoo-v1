# GYMovoo 💪

> אפליקציית כושר חכמה המייצרת תוכניות אימון אישיות בהתאם לרמת הכושר, היעדים והציוד הזמין לכל משתמש.

[English](#english) | [עברית](#hebrew)

<div id="hebrew">

## 📱 סקירה כללית

**GYMovoo** היא אפליקציית React Native חדשנית המעניקה לכל מתאמן תוכנית אימון מותאמת אישית. האפליקציה בנויה עם ממשק משתמש מודרני ואינטואיטיבי, תומכת במלואה בעברית (RTL), ומציעה חוויית אימון חלקה ויעילה.

### ✨ תכונות עיקריות

- 📋 **שאלון אישי חכם** - בניית פרופיל אימון מותאמת אישית
- 🤖 **AI מתקדם** - מערכת בחירת תרגילים חכמה מתוך מאגר של 100+ תרגילים
- 🎯 **תוכניות אימון מותאמות** - על בסיס מטרות, ניסיון וציוד זמין
- 📈 **התקדמות אוטומטית** - האימונים מתעצמים מעצמם לפי ביצועים
- ⏱️ **מעקב אימונים בזמן אמת** - טיימר, מעקב סטים ומשקלים
- 🏆 **מערכת שיאים אישיים** - זיהוי אוטומטי של שיאים חדשים (משקל, נפח, חזרות)
- 💾 **שמירת אימונים** - היסטוריה מלאה עם משוב ודירוגים
- ⭐ **מערכת משוב מתקדמת** - דירוג כוכבים, רמת קושי ואימוג'י
- 📊 **דשבורד מתקדם** - סטטיסטיקות, היסטוריה ומעקב התקדמות
- 🛠️ **תצוגת ציוד אישי** - הצגת הציוד הזמין בפרופיל המשתמש
- 🌙 **מצב כהה/בהיר** - תמיכה מלאה בשני המצבים
- 🔄 **סנכרון מקומי** - שמירה מקומית עם AsyncStorage
- 🏋️ **מאגר תרגילים עשיר** - מעל 100 תרגילים עם הדרכות ובחירה אוטומטית
- 📱 **ממשק RTL מלא** - תמיכה מלאה בעברית עם אייקונים אינטואיטיביים
- 🔧 **TypeScript מלא** - 100% type safety עם interfaces מתקדמים

#### 🆕 עדכונים אחרונים (ינואר 2025)

- **🔧 TypeScript Cleanup מלא** - 50+ `any` types הוחלפו בטיפוסים מדויקים ב-7 מסכי Screen מרכזיים
- **📦 Interfaces מתקדמים** - WorkoutStatistics, QuestionnaireBasicData, WorkoutHistoryItem, QuestionnaireAnswers
- **🧭 Navigation Typing** - שיפור משמעותי בטיפוסי הניווט עם StackNavigationProp
- **🎨 Style Consistency** - תיקון כל בעיות fontWeight ו-icon typing
- **🛡️ Type Safety** - 100% type safety במסכי Screen מרכזיים, 0 שגיאות קריטיות
- **📚 Documentation Cleanup** - ניקוי מסמכים מיותרים (מחקנו 4 קבצים כפולים)
- **🧹 Storage Optimization** - שיפור מערכת ניקוי אחסון עם console logging עקבי

#### 🎯 תכונות קודמות (יולי 2025)

- **🔄 מסך אימון אוניברסלי** - איחוד ActiveWorkout ו-QuickWorkout למסך יחיד עם 3 מצבים
- **📉 צמצום קוד** - חיסכון של 450+ שורות קוד (כפילות 70%)
- **⚡ פונקציה חדשה** - getActiveExerciseFromHistory לשיפור חוויית המשתמש
- **🎨 UI מותנה חכם** - הסתרת תכונות לפי מצב האימון
- **מערכת שאלון חכמה מתקדמת** - 7 שאלות דינמיות עם בחירה מרובה
- **מאגר ציוד מקיף** - מעל 100 פריטי ציוד מקטלגים (בית, חדר כושר, שניהם)
- **סינכרון מושלם** - מסך הפרופיל מתעדכן אוטומטית עם הציוד הנבחר
- **מערכת דמו לבדיקות** - כפתור דמו במסך הראשי לבדיקת תרחישים שונים
- **שאלות דינמיות** - השאלון מתאים את עצמו לפי התשובות הקודמות
- **מסך סיום אימון משופר** - תצוגת סיכום מקיפה עם שיאים אישיים
- **זיהוי שיאים בזמן אמת** - המערכת מזהה שיאי משקל, נפח וחזרות אוטומטית
- **מערכת היסטוריה מתקדמת** - כל האימונים נשמרים עם משוב מפורט ותמיכה בנתוני דמו
- **רכיבים משותפים חדשים** - LoadingSpinner, EmptyState, IconButton, ConfirmationModal ועוד
- **תיקוני RTL מקיפים** - 30+ תיקונים למיקום וכיווניות מלאה
- **שירותים חדשים** - workoutHistoryService, workoutSimulationService (עם התאמת מגדר וסימולציה חכמה), scientificAIService ועוד (15 שירותים פעילים)

## 🚀 התחלה מהירה

### דרישות מקדימות

- Node.js (גרסה 18 ומעלה)
- npm או yarn
- Expo CLI
- Expo Go app (לבדיקה במכשיר)

### התקנה

```bash
# שכפל את הפרויקט
git clone https://github.com/yourusername/gymovoo.git

# היכנס לתיקיית הפרויקט
cd gymovoo

# התקן את החבילות
npm install
# או
yarn install

# הפעל את האפליקציה בפיתוח
npx expo start

# או השתמש בסקריפט המובנה
npm start

# הפעל עם ניקוי cache (רק אם יש בעיות טעינה)
npx expo start --clear

# הפעל במצב תונל (אם יש בעיות רשת)
npx expo start --tunnel
```

### ⚠️ הערות חשובות להפעלה

- **השתמש רק ב-`npx expo start`** - זו הפקודה הנכונה לפרויקט Expo
- **`npm run start` גם עובד** - מוגדר לקרוא ל-`npx expo start`
- אם האפליקציה לא נטענת, נסה עם `--clear` לניקוי הcache
- במקרה של בעיות רשת, השתמש ב-`--tunnel`

### הרצה במכשיר

1. הורד את אפליקציית **Expo Go** מה-App Store או Google Play
2. סרוק את ה-QR code שמופיע בטרמינל
3. האפליקציה תיפתח במכשירך

## 🏗️ ארכיטקטורה

### 📊 סטטיסטיקות הפרויקט

- **📱 מסכים פעילים:** 27 מסכים ראשיים (ללא רכיבים וגיבויים)
- **🧩 רכיבים:** 12 רכיבים ב-3 קטגוריות (common, ui, workout)
- **🔧 שירותים:** 15 שירותים פעילים כולל workoutHistoryService
- **📚 תיעוד:** 13 קבצי .md מאורגנים עם מידע מעודכן (לאחר ניקוי)

### מבנה התיקיות

```
GYMovoo/
├── app/                      # נקודת כניסה ראשית
├── src/
│   ├── screens/             # מסכי האפליקציה
│   │   ├── welcome/         # מסך פתיחה
│   │   ├── auth/           # מסכי הרשמה והתחברות
│   │   ├── questionnaire/  # שאלון אישי
│   │   ├── main/           # מסך ראשי ודשבורד
│   │   ├── workout/        # מסכי אימון
│   │   ├── exercise/       # רשימת תרגילים
│   │   └── profile/        # פרופיל משתמש
│   ├── components/         # רכיבים משותפים (3 קטגוריות)
│   │   ├── common/         # רכיבי UI בסיסיים
│   │   ├── ui/             # רכיבי ממשק משתמש
│   │   └── workout/        # רכיבי אימון ייעודיים
│   ├── stores/             # ניהול State (Zustand)
│   ├── services/           # שירותים ו-API
│   ├── hooks/              # React Hooks מותאמים
│   ├── utils/              # פונקציות עזר
│   ├── styles/             # עיצוב וסגנונות
│   └── types/              # TypeScript types
├── assets/                 # משאבים (תמונות, פונטים)
└── docs/                   # תיעוד

```

### טכנולוגיות עיקריות

- **React Native** - פיתוח cross-platform
- **Expo SDK** - כלי פיתוח ובנייה
- **TypeScript** - Type safety וקוד איכותי
- **Zustand** - ניהול state פשוט ויעיל
- **React Navigation** - ניווט בין מסכים
- **AsyncStorage** - אחסון מקומי
- **React Hook Form** - ניהול טפסים
- **Linear Gradient** - אפקטים ויזואליים

## 📱 מסכים עיקריים (27 מסכים פעילים)

### 1. מסך פתיחה (Welcome)

- הצגת לוגו ומידע על האפליקציה
- כפתורי התחברות והרשמה
- מונה משתמשים פעילים

### 2. הרשמה והתחברות (Auth)

- טופס הרשמה עם אימות
- התחברות עם אימייל/סיסמה
- התחברות עם Google
- שחזור סיסמה

### 3. שאלון אישי חכם (Smart Questionnaire)

#### 🔥 תכונות חדשות - מערכת שאלון מתקדמת:

- **7 שאלות דינמיות** עם בחירת מגדר כשאלה ראשונה
- **בחירה מרובה** - אפשרות לבחור כמה תשובות בשאלה אחת
- **מאגר ציוד מקיף** - מעל 100 פריטי ציוד מקטלגים לבית וחדר כושר
- **הסתגלות דינמית** - השאלון משתנה בהתאם לתשובות הקודמות
- **תמיכה מלאה ב-RTL** - טקסט מימין, אייקונים ומיקום נכון
- **התאמה למגדר** - השאלות והתשובות מתאימות למגדר הנבחר
- **כפתור צף** - ממשק משתמש מודרני עם אנימציות
- **סטטיסטיקות מתקדמות** - מעקב אחרי הפעולות במהלך השאלון

#### שאלות הליבה:

1. **מגדר** - בחירת זהות מגדרית עבור התאמת השפה
2. **רמת כושר** - מתחיל, בינוני, מתקדם
3. **מטרות אימון** - עלייה במסה, ירידה במשקל, סיבולת, וכוח
4. **זמינות לאימון** - תדירות ומשך אימונים
5. **עדיפויות אימון** - חלקי גוף מועדפים ומגבלות
6. **ציוד זמין** - בחירה ממאגר מקיף של 100+ פריטי ציוד
7. **העדפות תזונה** - דיאטות מיוחדות ומגבלות תזונתיות

### 4. מסך ראשי (Dashboard)

- סטטיסטיקות אימון
- התקדמות שבועית/חודשית
- תוכניות אימון מומלצות
- גישה מהירה לאימון

### 5. אימון פעיל (Active Workout)

- רשימת תרגילים לביצוע
- טיימר ומעקב סטים
- רישום משקלים וחזרות
- מעבר בין תרגילים
- סיכום אימון

### 6. פרופיל משתמש (Profile)

- פרטים אישיים ואווטר מותאם
- תצוגת הציוד הזמין שנבחר בשאלון
- הישגים וסטטיסטיקות אימון
- היסטוריית אימונים
- הגדרות אפליקציה
- יצוא/ייבוא נתונים

## 🛠️ כלי בדיקה ופיתוח

הפרויקט כולל מערכת בדיקות מקיפה עם 15+ סקריפטים שונים:

### כלי בדיקה בסיסיים:

- `npm run check:health` - בדיקת בריאות הפרויקט
- `npm run check:navigation` - בדיקת מערכת הניווט
- `npm run check:components` - בדיקת רכיבים חסרים
- `npm run check:data-flow` - בדיקת זרימת נתונים

### כלי בדיקה מתקדמים:

- `npm run check:quality` - בדיקת איכות קוד (קבצים גדולים, משתנים לא בשימוש, complexity)
- `npm run check:performance` - בדיקת ביצועים (bundle size, inline objects, re-renders)
- `npm run check:security` - בדיקת אבטחה (sensitive data, dependencies vulnerabilities)
- `npm run check:accessibility` - בדיקת נגישות (accessibility labels, color contrast, touch targets)

### כלי בדיקה נוספים:

- `npm run lint` - בדיקה ותיקון ESLint
- `npm run type-check` - בדיקת TypeScript
- `npm run audit` - בדיקת אבטחה של dependencies
- `npm run check:all` - הרצת כל הבדיקות המתקדמות
- **כלי בדיקה מיוחדים חדשים:**
  - `node scripts/checkScientificQuestionnaire.js` - בדיקת השאלון המדעי
  - `node scripts/testScientificDemo.js` - בדיקת הדמו המדעי
  - `node scripts/testDataFlow.js` - בדיקת זרימת נתונים מלאה
  - `node scripts/analyzeQuestionnaireUsage.js` - ניתוח שימוש בשאלונים

## 🎨 עיצוב וסגנון

### Design System

האפליקציה משתמשת ב-Design System מובנה הכולל:

- **צבעים** - פלטת צבעים עקבית
- **טיפוגרפיה** - גדלי פונט והיררכיה ברורה
- **רכיבים** - רכיבי UI מוכנים לשימוש חוזר
- **צללים** - 3 רמות צללים (קל, בינוני, חזק)
- **מרווחים** - מערכת spacing עקבית
- **אנימציות** - מעברים חלקים

### RTL Support

תמיכה מלאה בעברית:

- כל הטקסטים מיושרים לימין
- פריסות עם `flexDirection: 'row-reverse'`
- אייקונים מותאמים לכיוון RTL
- מיקום נכון של כפתורי פעולה

#### 🆕 מערכת RTL ו-Gender Adaptation המתקדמת:

- **יישור טקסט מלא** - `textAlign: "right"` ו-`writingDirection: "rtl"` לכל הטקסטים
- **מיקום מדויק** - `alignItems: "flex-end"` ו-`paddingRight` במקום `paddingLeft`
- **רכיבי בחירה מותאמים** - מיקום נכון של אינדיקטורים וכפתורים
- **התאמה דינמית למגדר** - טקסט מתאים אוטומטית למגדר הנבחר
- **המרת טקסט דו-כיוונית** - מערכת המרה חכמה בין צורות זכר/נקבה/נייטרלי
- **אופטימיזציה לעברית** - כל הממשקים מותאמים לכתיבה מימין לשמאל

למידע טכני מפורט, ראה: `docs/TECHNICAL_IMPLEMENTATION_GUIDE.md`

## 📚 תיעוד מקיף

הפרויקט כולל תיעוד מפורט:

- 📖 **מדריך ניווט** - `docs/NAVIGATION_GUIDE.md`
- 🧩 **מדריך רכיבים משותפים** - `docs/SHARED_COMPONENTS_GUIDE.md`
- 🔧 **מדריך יישום טכני** - `docs/TECHNICAL_IMPLEMENTATION_GUIDE.md`
- 📋 **יומן התקדמות** - `docs/PROGRESS_LOG.md`
- 📝 **הנחיות פיתוח** - `docs/DEVELOPMENT_GUIDELINES.md`
- 📊 **סיכום מאסטר** - `docs/PROJECT_MASTER_SUMMARY.md`
- 📑 **אינדקס תיעוד** - `docs/DOCUMENTATION_INDEX_MASTER.md`

## 🔧 פיתוח

### סקריפטים זמינים

```bash
# הרצת האפליקציה (שתי אפשרויות זמינות)
npm start                    # סקריפט מובנה שקורא ל-npx expo start
npx expo start              # פקודה ישירה של Expo

# הרצה ב-iOS
npm run ios

# הרצה ב-Android
npm run android

# בדיקות
npm test

# בניית APK
eas build -p android

# בניית IPA
eas build -p ios
```

### הוספת תכונה חדשה

1. צור branch חדש: `git checkout -b feature/your-feature`
2. פתח את התכונה תוך שמירה על הסטנדרטים
3. הוסף בדיקות אם רלוונטי
4. צור Pull Request עם תיאור מפורט

### כללי קוד

- TypeScript לכל הקוד החדש
- תיעוד דו-לשוני (עברית/אנגלית)
- שימוש ב-theme בלבד לצבעים וגדלים
- RTL compliance לכל רכיב חדש
- שמות משתנים ופונקציות באנגלית

## 📄 רישיון

פרויקט זה מוגן תחת רישיון MIT - ראה קובץ [LICENSE](LICENSE) לפרטים.

## 🤝 תרומה לפרויקט

נשמח לקבל תרומות! אנא קרא את [CONTRIBUTING.md](CONTRIBUTING.md) לפני שליחת Pull Request.

## 📞 יצירת קשר

- אתר: [www.gymovoo.com](https://www.gymovoo.com)
- אימייל: support@gymovoo.com
- GitHub: [@gymovoo](https://github.com/gymovoo)

</div>

---

<div id="english">

## 📱 Overview

**GYMovoo** is an innovative React Native application that provides personalized workout plans for every fitness enthusiast. Built with a modern and intuitive UI, full Hebrew (RTL) support, and a smooth training experience.

### ✨ Key Features

- 📋 **Smart Personal Questionnaire** - Build a custom training profile with 7 dynamic questions
- 🌍 **Advanced RTL & Gender Adaptation** - Full Hebrew support with gender-adaptive language
- 🎯 **Personalized Workout Plans** - Based on goals, experience, and available equipment
- ⏱️ **Real-time Workout Tracking** - Timer, sets, and weight tracking
- 📊 **Advanced Dashboard** - Statistics, history, and progress tracking
- 🌙 **Dark/Light Mode** - Full support for both themes
- 🔄 **Local Sync** - AsyncStorage persistence with seamless experience
- 🏋️ **Rich Exercise Database** - Over 100 exercises with smart selection
- 📱 **Complete RTL Interface** - Full Hebrew support with proper text alignment
- 🤖 **AI-Powered Insights** - Smart workout recommendations and feedback
- 🏆 **Personal Records** - Automatic detection of weight, volume, and repetition records
- ⭐ **Advanced Feedback System** - Star ratings, difficulty levels, and emoji feedback
- 🔧 **Full TypeScript** - 100% type safety with advanced interfaces

#### 🆕 Latest Updates (January 2025)

- **🔧 Complete TypeScript Cleanup** - 50+ `any` types replaced with precise typing across 7 major Screen components
- **📦 Advanced Interfaces** - WorkoutStatistics, QuestionnaireBasicData, WorkoutHistoryItem, QuestionnaireAnswers
- **🧭 Navigation Typing** - Significant improvement in navigation types with StackNavigationProp
- **🎨 Style Consistency** - Fixed all fontWeight and icon typing issues
- **🛡️ Type Safety** - 100% type safety in major Screen components, 0 critical errors
- **📚 Documentation Cleanup** - Removed unnecessary documents (deleted 4 duplicate files)
- **🧹 Storage Optimization** - Improved storage cleanup system with consistent console logging

#### 🎯 Previous Features (July 2025)

- **Advanced Smart Questionnaire System** - 7 dynamic questions with multiple selection
- **Comprehensive Equipment Database** - 100+ equipment items categorized (home, gym, both)
- **Perfect Synchronization** - Profile screen automatically updates with selected equipment
- **Demo System** - Demo button on main screen for testing different scenarios
- **Dynamic Questions** - Questionnaire adapts based on previous answers
- **Gender-First Approach** - Gender selection as first question for language adaptation
- **RTL & Gender Adaptation** - Complete system for Hebrew RTL and gender-adaptive text
- **Enhanced History System** - Complete workout history with comprehensive demo data and feedback

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18+)
- npm or yarn
- Expo CLI
- Expo Go app (for device testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gymovoo.git

# Navigate to project directory
cd gymovoo

# Install dependencies
npm install
# or
yarn install

# Start the application
npx expo start
```

### Running on Device

1. Download **Expo Go** from App Store or Google Play
2. Scan the QR code displayed in terminal
3. The app will open on your device

## 🏗️ Architecture

### 📊 Project Statistics

- **📱 Active Screens:** 27 main screens (excluding components and backups)
- **🧩 Components:** 12 components in 3 categories (common, ui, workout)
- **🔧 Services:** 15 active services including workoutHistoryService
- **📚 Documentation:** 13 organized .md files with up-to-date information (after cleanup)

### Technology Stack

- **React Native** - Cross-platform development
- **Expo SDK** - Development and build tools
- **TypeScript** - Type safety and code quality
- **Zustand** - Simple and efficient state management
- **React Navigation** - Screen navigation
- **AsyncStorage** - Local storage
- **React Hook Form** - Form management
- **Linear Gradient** - Visual effects

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 📚 Documentation

For comprehensive documentation, please refer to:

- 📖 **Navigation Guide** - `docs/NAVIGATION_GUIDE.md`
- 🧩 **Shared Components Guide** - `docs/SHARED_COMPONENTS_GUIDE.md`
- 🔧 **Technical Implementation Guide** - `docs/TECHNICAL_IMPLEMENTATION_GUIDE.md`
- 📋 **Progress Log** - `docs/PROGRESS_LOG.md`
- 📝 **Development Guidelines** - `docs/DEVELOPMENT_GUIDELINES.md`
- 📊 **Master Summary** - `docs/PROJECT_MASTER_SUMMARY.md`
- 📑 **Documentation Index** - `docs/DOCUMENTATION_INDEX_MASTER.md`

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a Pull Request.

## 📞 Contact

- Website: [www.gymovoo.com](https://www.gymovoo.com)
- Email: support@gymovoo.com
- GitHub: [@gymovoo](https://github.com/gymovoo)

</div>

---

<p align="center">Made with ❤️ by the GYMovoo Team</p>
