# מדריך מסכי GYMovoo 📱💪

## סקירה כללית

מדריך מקיף לכל מסכי האפליקציה GYMovoo. כל מסך מתועד בנפרד עם פרטים טכניים, תכונות, ועיצוב.

## 🗂️ אינדקס מסכים לפי קטגוריה

### 🔐 מסכי אימות (Authentication)

**[📄 מדריך מסכי אימות](./AUTH_SCREENS_GUIDE.md)**

מסכים: LoginScreen, RegisterScreen, TermsScreen

- מערכת התחברות והרשמה מאובטחת
- תמיכה בולידציה מתקדמת
- אבטחה ברמה גבוהה עם הצפנה

---

### 🏠 מסך ראשי (Main Dashboard)

**[📄 מדריך מסך ראשי](./MAIN_SCREEN_GUIDE.md)**

מסך: MainScreen

- דשבורד מרכזי עם סטטיסטיקות
- נקודת מוצא לכל הפעולות
- הצגת התקדמות והישגים

---

### 🏋️ מסכי אימונים (Workout)

**[📄 מדריך מסכי אימונים](./WORKOUT_SCREENS_GUIDE.md)**

מסכים: WorkoutPlansScreen, ActiveWorkoutScreen, QuickWorkoutScreen

- יצירת תוכניות אימון מותאמות
- ביצוע אימונים בזמן אמת
- מעקב אחר ביצועים ושיאים

---

### 💪 מסכי תרגילים (Exercise Library)

**[📄 מדריך מסכי תרגילים](./EXERCISE_SCREENS_GUIDE.md)**

מסכים: ExerciseListScreen, ExerciseDetailsModal, ExercisesScreen, MuscleMapSearchScreen

- מאגר 600+ תרגילים מקומי
- חיפוש וסינון מתקדם
- מפת שרירים אינטראקטיבית

---

### 📋 מסכי שאלון חכם (Smart Questionnaire)

**[📄 מדריך מסכי שאלון](./QUESTIONNAIRE_SCREENS_GUIDE.md)**

מסכים: SmartQuestionnaireScreen, AgeSelector, HeightSlider, WeightSlider, EquipmentSelector, DietSelector

- 7 שאלות דינמיות לבניית פרופיל
- אלגוריתמים חכמים להתאמה אישית
- ולידציה וחישובים מתקדמים

---

### 👤📊 מסכי פרופיל והיסטוריה (Profile & Analytics)

**[📄 מדריך פרופיל והיסטוריה](./PROFILE_HISTORY_SCREENS_GUIDE.md)**

מסכים: ProfileScreen, HistoryScreen, ProgressScreen, NotificationsScreen

- ניהול נתונים אישיים ומטרות
- ניתוח התקדמות עם גרפים אינטראקטיביים
- מעקב אחר הישגים והיסטוריה

---

### 🎉 מסך ברוכים הבאים (Welcome)

**[📄 מדריך מסך ברוכים הבאים](./WELCOME_SCREEN_GUIDE.md)**

מסך: WelcomeScreen

- נקודת כניסה ראשונה לאפליקציה
- מבוא מוטיב והדרכה בסיסית
- ניווט לכניסה או הרשמה

---

## 🔄 זרימת ניווט כללית

```
WelcomeScreen
    ↓
[התחברות/הרשמה]
    ↓
LoginScreen / RegisterScreen
    ↓
SmartQuestionnaireScreen (אם הרשמה חדשה)
    ↓
MainScreen (דשבורד ראשי)
    ├── WorkoutPlansScreen → ActiveWorkoutScreen
    ├── QuickWorkoutScreen → ActiveWorkoutScreen
    ├── ExercisesScreen → ExerciseListScreen
    ├── ProfileScreen
    ├── HistoryScreen
    ├── ProgressScreen
    └── NotificationsScreen
```

## 🎯 תכונות מרכזיות לכל מסך

### ✅ תכונות בסיסיות (הושלמו):

- **RTL מלא:** תמיכה בעברית עם כיוון מימין לשמאל
- **TypeScript מלא:** 100% type safety ללא any
- **Theme מאוחד:** עיצוב עקבי מ-theme.ts
- **Navigation מתקדם:** ניווט חלק עם React Navigation
- **אחסון מקומי:** AsyncStorage לכל הנתונים
- **ביצועים גבוהים:** אופטימיזציה מתקדמת

### 🚀 תכונות מתקדמות (בפיתוח):

- **AI Recommendations:** המלצות חכמות מבוססות בינה מלאכותית
- **מאגר מקומי:** 600+ תרגילים ללא תלות באינטרנט
- **אנליטיקה מתקדמת:** גרפים אינטראקטיביים והתקדמות
- **גמיפיקציה:** הישגים, אתגרים ומעקב רציפות
- **אישיות מלאה:** התאמה לכל משתמש ומטרותיו

## 🛠️ מידע טכני

### סטנדרטים טכניים:

- **React Native 0.74+**
- **TypeScript 5.0+**
- **Expo SDK 51**
- **Zustand למצב גלובלי**
- **React Navigation 6**
- **AsyncStorage לנתונים מקומיים**

### ביצועים:

- **Lazy Loading:** טעינת מסכים לפי צורך
- **Memory Management:** ניקוי זיכרון אוטומטי
- **Image Optimization:** תמונות ממוטבות
- **Caching Strategy:** אסטרטגיית זיכרון מתקדמת

### בטיחות:

- **Input Validation:** ולידציה מקיפה
- **Data Encryption:** הצפנת נתונים רגישים
- **Error Boundaries:** טיפול בשגיאות מתקדם
- **Offline Support:** עבודה ללא אינטרנט

## 📊 ארכיטקטורת המידע

### מבנה נתונים מרכזי:

```
UserProfile → QuestionnaireAnswers → WorkoutPlans
     ↓              ↓                     ↓
Statistics ← WorkoutHistory ← ActiveWorkout
     ↓              ↓                     ↓
Progress   ← ExerciseLibrary ← PersonalRecords
```

### שכבות האפליקציה:

1. **UI Layer:** מסכים וקומפוננטים
2. **State Management:** Zustand stores
3. **Business Logic:** שירותים ואלגוריתמים
4. **Data Layer:** AsyncStorage ומטמון
5. **Exercise Database:** מאגר תרגילים מקומי

## 🎨 מערכת עיצוב אחידה

### צבעים מרכזיים:

- **Primary:** #4CAF50 (ירוק אנרגטי)
- **Secondary:** #2196F3 (כחול אמין)
- **Success:** #8BC34A (ירוק הצלחה)
- **Warning:** #FF9800 (כתום אזהרה)
- **Error:** #F44336 (אדום שגיאה)

### טיפוגרפיה:

- **Heading:** Heebo-Bold 24-32px
- **Body:** Heebo-Regular 16-18px
- **Caption:** Heebo-Light 12-14px
- **Button:** Heebo-Medium 16px

## 📱 תמיכה במכשירים

### פלטפורמות נתמכות:

- **iOS:** 13.0+ (iPhone 6s ומעלה)
- **Android:** API 21+ (Android 5.0+)
- **גדלי מסך:** מ-4" עד 6.7"+
- **אוריינטציה:** לאורך ולרוחב

### נגישות:

- **Screen Reader:** תמיכה מלאה ב-VoiceOver/TalkBack
- **Large Text:** תמיכה בהגדלת טקסט מערכת
- **High Contrast:** מצב ניגודיות גבוהה
- **Voice Control:** שליטה קולית בסיסית

## 📋 מפת הפיתוח

### ✅ הושלם (ינואר 2025):

- כל המסכים הבסיסיים
- מערכת ניווט מלאה
- TypeScript cleanup מלא
- מאגר תרגילים מקומי
- RTL והעברה מלאה

### 🔄 בפיתוח (פברואר 2025):

- שיפורי UI/UX מתקדמים
- אינטגרציות חיצוניות
- מערכת דוחות מתקדמת
- תכונות גמיפיקציה

### 🎯 מתוכנן (מרץ 2025):

- בינה מלאכותית לתוכניות
- מציאות רבודה לתרגילים
- אינטגרציה עם מכשירי ספורט
- מערכת קהילה וחברים

---

**עדכון אחרון:** ינואר 2025  
**גרסה:** 2.1.0  
**מתחזק:** GYMovoo Development Team
