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
- 🔄 **Cache מקומי (AsyncStorage)** - מטמון בלבד; מקור אמת: השרת
- 🏋️ **מאגר תרגילים עשיר** - מעל 100 תרגילים עם הדרכות ובחירה אוטומטית
- 📱 **ממשק RTL מלא** - תמיכה מלאה בעברית עם אייקונים אינטואיטיביים
- 🔧 **TypeScript מלא** - 100% type safety עם interfaces מתקדמים

#### 🆕 עדכונים אחרונים (אוגוסט 2025)

- 🌐 מקור אמת: השרת בלבד – נתוני דמו הוסרו; חובה להגדיר `EXPO_PUBLIC_STORAGE_BASE_URL` (באמולטור אנדרואיד: http://10.0.2.2:3001)
- **🔧 TypeScript Cleanup מלא** - 50+ `any` types הוחלפו בטיפוסים מדויקים ב-7 מסכי Screen מרכזיים
- **🐛 תיקוני שגיאות קריטיות** - פתרון 52+ שגיאות TypeScript ב-WelcomeScreen, useUserPreferences, ו-MuscleMapInteractive
- **⚡ אופטימיזציה מתקדמת** - קובץ questionnaireService צומצם מ-1428 ל-1417 שורות (הסרת כפילויות)
- **🎨 שיפורי UI/UX** - תיקוני fontWeight, icon typing, ושיפור עקביות העיצוב
- **📦 ממשקים מתקדמים** - WorkoutStatistics, QuestionnaireBasicData, WorkoutHistoryItem, QuestionnaireAnswers
- **🧭 Navigation Typing משופר** - שיפור משמעותי בטיפוסי הניווט עם StackNavigationProp
- **🛡️ Type Safety מלא** - 100% type safety במסכי Screen מרכזיים, 0 שגיאות קריטיות
- **📚 ניקוי תיעוד** - הסרת מסמכים כפולים ושיפור ארגון המידע

#### 🎯 תכונות קודמות (יולי 2025)

- **🔄 מסך אימון אוניברסלי** - איחוד ActiveWorkout ו-QuickWorkout למסך יחיד עם 3 מצבים
- **📉 צמצום קוד** - חיסכון של 450+ שורות קוד (כפילות 70%)
- **⚡ פונקציה חדשה** - getActiveExerciseFromHistory לשיפור חוויית המשתמש
- **🎨 UI מותנה חכם** - הסתרת תכונות לפי מצב האימון
- **מערכת שאלון חכמה מתקדמת** - 7 שאלות דינמיות עם בחירה מרובה
- **מאגר ציוד מקיף** - מעל 100 פריטי ציוד מקטלגים (בית, חדר כושר, שניהם)
- **סינכרון מושלם** - מסך הפרופיל מתעדכן אוטומטית עם הציוד הנבחר
- **מערכת דמו לבדיקות** - כפתור דמו במסך הראשי לבדיקת תרחישים שונים (הוסר באוגוסט 2025)
- **שאלות דינמיות** - השאלון מתאים את עצמו לפי התשובות הקודמות
- **מסך סיום אימון משופר** - תצוגת סיכום מקיפה עם שיאים אישיים
- **זיהוי שיאים בזמן אמת** - המערכת מזהה שיאי משקל, נפח וחזרות אוטומטית
- **מערכת היסטוריה מתקדמת** - כל האימונים נשמרים עם משוב מפורט
- **רכיבים משותפים חדשים** - LoadingSpinner, EmptyState, IconButton, ConfirmationModal ועוד
- **תיקוני RTL מקיפים** - 30+ תיקונים למיקום וכיווניות מלאה
- **שירותים חדשים** - workoutHistoryService, scientificAIService ועוד (שירות סימולציה ודמו הוסרו באוגוסט 2025)

## 🚀 התחלה מהירה

### דרישות מקדימות

- Node.js (גרסה 18 ומעלה)
- npm או yarn
- Expo CLI
- Expo Go app (לבדיקה במכשיר)

### התקנה

```bash
# שכפל את הפרויקט
git clone https://github.com/Yehuda-sh/GYMovoo-v1.git

# היכנס לתיקיית הפרויקט
cd GYMovoo-v1

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
- חובה להגדיר משתנה סביבה `EXPO_PUBLIC_STORAGE_BASE_URL` לכתובת השרת. באמולטור אנדרואיד השתמשו ב-`http://10.0.2.2:3001`.
- `AsyncStorage` משמש כ-cache בלבד; השרת הוא מקור אמת. ללא שרת פעיל לא מתבצעת התקדמות בפיצ'רים קריטיים (למשל מעבר ל-Home ללא שאלון שלם).

### הרצה במכשיר

1. הורד את אפליקציית **Expo Go** מה-App Store או Google Play
2. סרוק את ה-QR code שמופיע בטרמינל
3. האפליקציה תיפתח במכשירך

### 🔄 הגדרת RTL (חשוב!)

האפליקציה מוגדרת ל-RTL מאולץ לתמיכה מלאה בעברית. אם RTL לא עובד:

⚠️ **פתרון מהיר**: הפעל מחדש את האפליקציה (Ctrl+R או reload)

📚 **מידע מפורט**: ראה [מדריך RTL](docs/RTL_SETUP_GUIDE.md)

## 🏗️ ארכיטקטורה

### 📊 סטטיסטיקות הפרויקט

- **📱 מסכים פעילים:** 27 מסכים ראשיים (ללא רכיבים וגיבויים)
- **🧩 רכיבים:** 12 רכיבים ב-3 קטגוריות (common, ui, workout)
- **🔧 שירותים:** 14 שירותים פעילים (שירות סימולציה ודמו הוסרו) כולל workoutHistoryService
- **📚 תיעוד:** 13 קבצי .md מאורגנים עם מידע מעודכן (לאחר ניקוי)

> עדכון סטטיסטיקות אחרון: 2025-08-10 (לבדיקה מחודשת לפני ריליס גדול)

### 🗺️ מפת קוד (High-Level Code Map)

| שכבה                      | מיקום                          | מטרה עיקרית                                                 | הערות תחזוקה                                 |
| ------------------------- | ------------------------------ | ----------------------------------------------------------- | -------------------------------------------- |
| Screens                   | `src/screens/*`                | לוגיקת תצוגה לכל דומיין (auth, workout, questionnaire וכו') | לבדוק פיצול עתידי אם מסך > 500 שורות         |
| Components /common        | `src/components/common`        | רכיבי UI קטנים לשימוש רחב                                   | שמור נטול לוגיקה עסקית                       |
| Components /ui            | `src/components/ui`            | אלמנטים ויזואליים מורחבים                                   | לרכז סטנדרטים (Spacing / Shadows)            |
| Components /workout       | `src/components/workout`       | רכיבי אימון (טיימר, סטים, ברים)                             | טיימר מאוחד – אין RestTimer ישן              |
| Components /questionnaire | `src/components/questionnaire` | רכיבי שאלון דינמי                                           | לאחר איחוד – לתעד זרימת סטייט                |
| Navigation                | `src/navigation`               | App / Bottom navigators + טיפוסים                           | לוודא סנכרון עם מסכים חדשים                  |
| Services                  | `src/services`                 | לוגיקה עסקית: שאלון, היסטוריה, דמו, סימולציה                | מועמדי איחוד: demo / simulation / scientific |
| Store                     | `src/stores`                   | Zustand stores (כעת userStore יחיד)                         | לייצר index אם נוספים מתווספים               |
| Data                      | `src/data`                     | מקורות סטטיים (תרגילים, ציוד, unifiedQuestionnaire)         | שני קבצי ציוד – דורש החלטה                   |
| Utils                     | `src/utils`                    | פונקציות עזר (format, gender, stats, logger)                | לרכז pure logic בלבד                         |
| Constants                 | `src/constants`                | טקסטים / קונפיג UI פר-מסך                                   | לאחד naming (texts/config/colors)            |
| Styles                    | `src/styles/theme.ts`          | Theme מרכזי                                                 | שקול פירוק light/dark אם יתרחב               |
| Types                     | `src/types + inline types`     | מודלי דטה גלובליים                                          | להתחיל הקשחת variant scopes                  |
| Assets                    | `assets/*`                     | אייקונים / תמונות / ציוד                                    | לבדוק כפילויות (icons דומים)                 |
| Docs                      | `docs/*`                       | מדריכים, דוחות, אופטימיזציות                                | להעביר דוחות לתיקיית reports/                |

### 🛠 הערות תחזוקה קריטיות (Maintenance Notes)

1. איחוד טיימר: כל הלוגיקה עוברת דרך `WorkoutStatusBar` + `shared/TimerDisplay` + `TimeAdjustButton`. רכיב RestTimer הוסר – אין להוסיף חדש נפרד.
2. Variants: האיחוד הבא מתוכנן – צמצום `WorkoutVariant` לפי שימוש אמיתי (pills בשימוש רק ב-NextExerciseBar). ראו TODO.
3. שאלון: קבצים מרובים (FINAL*QUESTIONNAIRE_SOLUTION / DYNAMIC_FLOW / DETECTION_FIX / SERVICE_OPTIMIZATION / REALISTIC_USER*\*) – מיזוג מתוכנן למסמך יחיד.
4. Demo Services: `advancedDemoService` + `realisticDemoService` + סימולציה → יעד: DEMO_SYSTEM_GUIDE + בחינת איחוד.
5. ציוד: שני קבצים (`equipmentData.ts`, `equipmentData_new.ts`) – החלטה: לשמור רק אחד אחרי בדיקת שימוש ב-import בפועל.
6. דוחות Root (BUG*FIXES*_, OPTIMIZATION*REPORT*_) – יעברו ל-`docs/reports/` לשמירה היסטורית.
7. טיפוסים: לבצע הקשחה פר קומפוננט (HeaderVariant, DashboardVariant וכו') מבלי לשבור API חיצוני – שלב ראשון תיעוד, שלב שני שינוי קוד.
8. סטטיסטיקות README: נתפסות כצילום מצב – לא להבטיח עדכניות בלי ריצת סקריפט איסוף.
9. נגישות: רכיבים חדשים – חובה `accessibilityLabel` בעברית + סימון role היכן רלוונטי.
10. RTL: כל טקסט חדש – לוודא `writingDirection: 'rtl'` אם אינו יורש סגנון גלובלי.

### 📂 סטטוס תיעוד – מועמדי איחוד / סידור

| קבוצה                | קבצים נוכחיים                                                                                                                                                                              | פעולה מוצעת                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Questionnaire        | FINAL_QUESTIONNAIRE_SOLUTION.md, QUESTIONNAIRE_DYNAMIC_FLOW_ANALYSIS.md, QUESTIONNAIRE_DETECTION_FIX.md, QUESTIONNAIRE_SERVICE_OPTIMIZATION_REPORT.md, REALISTIC_USER_QUESTIONNAIRE_FIX.md | למזג ל-`docs/questionnaire/QUESTIONNAIRE_SYSTEM.md` + נספח FLOW |
| Demo / Realistic     | REALISTIC_DEMO_FLOW_ANALYSIS.md, REALISTIC_USER_FIXES_REPORT.md, advancedDemoService, realisticDemoService                                                                                 | ליצור `DEMO_SYSTEM_GUIDE.md` + לבדוק איחוד שירותים              |
| Optimization Reports | OPTIMIZATION*REPORT*_ + BUG*FIXES*_ + WORKOUTDASHBOARD_OPTIMIZATION_REPORT.md                                                                                                              | להעביר ל-`docs/reports/` ולהוסיף אינדקס                         |
| Equipment            | equipmentData.ts, equipmentData_new.ts                                                                                                                                                     | לבדוק שימוש; לסמן unused כ-deprecated                           |
| Variants Typing      | types.ts (WorkoutVariant)                                                                                                                                                                  | להוסיף הערות JSDoc + לפצל בהמשך                                 |

### 🧪 צעדי אימות מוצעים בעת שינויים מבניים

1. `npm run type-check` – לפני ואחרי שינוי טיפוסים
2. `npm run check:performance` – לאחר איחוד קבצים גדולים
3. Grep ל-imports של קבצים שסומנו למחיקה לפני הסרה
4. פתיחת מסכי Workout + Questionnaire באמולטור לבדיקת RTL וסטייט

---

### מבנה התיקיות

```
GYMovoo/
├── src/                      # קוד המקור הראשי
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
- `npm run check:questionnaire` - בדיקת לוגיקת השאלון החכם
- `npm run check:questionnaire:flow` - בדיקת זרימת שאלות דינמית
- `npm run check:questionnaire:detection` - זיהוי השלמת שאלון ומיפוי לוקאלי
- `node runAllProjectChecks.js` - אגרגטור להרצת כלל הבדיקות עם סיכום
- **כלי בדיקה מיוחדים חדשים:**
  - `node scripts/testDataFlow.js` - בדיקת זרימת נתונים מלאה

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

### 📱 מדריכי מסכים (חדש!)

- 🎉 **[מדריך מסכי האפליקציה](docs/screens/README.md)** - אינדקס מרכזי לכל המסכים
- 🔐 **[מסכי אימות](docs/screens/AUTH_SCREENS_GUIDE.md)** - התחברות, הרשמה ותנאי שימוש
- 🏠 **[מסך ראשי](docs/screens/MAIN_SCREEN_GUIDE.md)** - דשבורד מרכזי וניווט
- 🏋️ **[מסכי אימונים](docs/screens/WORKOUT_SCREENS_GUIDE.md)** - תוכניות אימון ואימון פעיל
- 🏋️‍♂️ **[מסכי תרגילים](docs/screens/EXERCISE_SCREENS_GUIDE.md)** - מאגר תרגילים ומפת שרירים
- 📋 **[מסכי שאלון](docs/screens/QUESTIONNAIRE_SCREENS_GUIDE.md)** - שאלון חכם ובניית פרופיל
- 👤 **[פרופיל והיסטוריה](docs/screens/PROFILE_HISTORY_SCREENS_GUIDE.md)** - ניהול נתונים ומעקב התקדמות
- 🎉 **[מסך ברוכים הבאים](docs/screens/WELCOME_SCREEN_GUIDE.md)** - מסך פתיחה ומבוא

### 🔧 מדריכים טכניים

- 📖 **מדריך ניווט** - `docs/NAVIGATION_GUIDE.md`
- 🧩 **מדריך רכיבים משותפים** - `docs/SHARED_COMPONENTS_GUIDE.md`
- 🔧 **מדריך יישום טכני** - `docs/TECHNICAL_IMPLEMENTATION_GUIDE.md`
- 📝 **הנחיות פיתוח** - `docs/DEVELOPMENT_GUIDELINES.md`
- 📊 **סיכום מאסטר** - `docs/PROJECT_MASTER_SUMMARY.md`
- 📑 **אינדקס תיעוד** - `docs/DOCUMENTATION_INDEX_MASTER.md`
- 🗂️ **דוחות אופטימיזציה ותיקונים (הועברו)** - `docs/reports/`

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
- 🔄 **Local Cache (AsyncStorage)** - Cache only; server is the single source of truth
- 🏋️ **Rich Exercise Database** - Over 100 exercises with smart selection
- 📱 **Complete RTL Interface** - Full Hebrew support with proper text alignment
- 🤖 **AI-Powered Insights** - Smart workout recommendations and feedback
- 🏆 **Personal Records** - Automatic detection of weight, volume, and repetition records
- ⭐ **Advanced Feedback System** - Star ratings, difficulty levels, and emoji feedback
- 🔧 **Full TypeScript** - 100% type safety with advanced interfaces

#### 🆕 Latest Updates (August 2025)

- 🌐 Server as the single source of truth – demo data removed; requires `EXPO_PUBLIC_STORAGE_BASE_URL` (Android emulator: http://10.0.2.2:3001)
- **🔧 Complete TypeScript Cleanup** - 50+ `any` types replaced with precise typing across 7 major Screen components
- **🐛 Critical Bug Fixes** - Resolved 52+ TypeScript errors in WelcomeScreen, useUserPreferences, and MuscleMapInteractive
- **⚡ Advanced Optimization** - questionnaireService reduced from 1428 to 1417 lines (removed duplications)
- **🎨 UI/UX Improvements** - Fixed fontWeight, icon typing, and improved design consistency
- **📦 Advanced Interfaces** - WorkoutStatistics, QuestionnaireBasicData, WorkoutHistoryItem, QuestionnaireAnswers
- **🧭 Enhanced Navigation Typing** - Significant improvement in navigation types with StackNavigationProp
- **🛡️ Complete Type Safety** - 100% type safety in major Screen components, 0 critical errors
- **📚 Documentation Cleanup** - Removed duplicate documents and improved information organization

#### 🎯 Previous Features (July 2025)

- **Advanced Smart Questionnaire System** - 7 dynamic questions with multiple selection
- **Comprehensive Equipment Database** - 100+ equipment items categorized (home, gym, both)
- **Perfect Synchronization** - Profile screen automatically updates with selected equipment
- **Demo System** - Demo button on main screen for testing different scenarios (removed Aug 2025)
- **Dynamic Questions** - Questionnaire adapts based on previous answers
- **Gender-First Approach** - Gender selection as first question for language adaptation
- **RTL & Gender Adaptation** - Complete system for Hebrew RTL and gender-adaptive text
- **Enhanced History System** - Complete workout history with comprehensive feedback

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18+)
- npm or yarn
- Expo CLI
- Expo Go app (for device testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/Yehuda-sh/GYMovoo-v1.git

# Navigate to project directory
cd GYMovoo-v1

# Install dependencies
npm install
# or
yarn install

# Start the application
npx expo start

# Important notes

- Set the `EXPO_PUBLIC_STORAGE_BASE_URL` environment variable to your server URL. On Android emulator use `http://10.0.2.2:3001`.
- AsyncStorage is used as cache only. Without a running server, critical features won't progress (e.g., gating after questionnaire).
```

### Running on Device

1. Download **Expo Go** from App Store or Google Play
2. Scan the QR code displayed in terminal
3. The app will open on your device

### 🔄 RTL Configuration

The app is configured for forced RTL to support Hebrew interface. If RTL doesn't work:

⚠️ **Quick Fix**: Restart the app (Ctrl+R or reload)

📚 **Detailed Guide**: See [RTL Setup Guide](docs/RTL_SETUP_GUIDE.md)

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
- **Development Guidelines** - `docs/DEVELOPMENT_GUIDELINES.md`
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
