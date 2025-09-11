# 📋 ניתוח מבנה טיפוסי המשתמש ב-GYMovoo

## 🧑‍💻 מבנה נתוני משתמש נוכחי

בהתבסס על השאלות והתשובות, להלן ניתוח מקיף של מבנה נתוני המשתמש במערכת:

### 📊 טיפוס המשתמש הבסיסי

```typescript
interface User {
  // שדות חובה
  id: string;
  email: string;
  name: string;

  // מידע אימות
  provider: "google" | "manual"; // כרגע תמיכה בגוגל ואימות ידני

  // נתוני שאלון
  hasQuestionnaire: boolean; // האם השלים שאלון
  questionnaireData?: QuestionnaireData; // נתוני השאלון המלאים

  // סטטיסטיקות
  trainingStats?: TrainingStats; // סטטיסטיקות מצטברות (מספר אימונים, זמן, וכו')
  activityHistory?: ActivityHistory[]; // היסטוריית אימונים מלאה עם פרטים

  // מידע נוסף
  metadata?: {
    registrationDate: Date;
    lastLoginDate: Date;
  };

  // פרטי מנוי
  subscription?: {
    type: "free" | "premium" | "trial";
    startDate: Date;
    endDate?: Date;
    active: boolean;
  };

  // מדידות גוף
  bodyMeasurements?: {
    weight: BodyMeasurementRecord[];
    height?: number;
    // מדידות נוספות...
  };

  // מטרות אימון
  trainingGoals?: TrainingGoal[]; // מטרות מפורטות
}
```

### 🏋️ מאפייני משתמש עיקריים

1. **פרטי משתמש בסיסיים**:
   - שדות חובה: `id`, `email`, `name`
   - נוצרים מקומית ומסתנכרנים בעת הרשמה

2. **נתוני שאלון**:
   - נשמרים ב-`AsyncStorage`
   - מסתנכרנים עם השרת בעת הרשמה
   - מכילים את כל התשובות שהמשתמש בחר בשאלון

3. **סטטיסטיקות והיסטוריה**:
   - `trainingStats` - סטטיסטיקות מצטברות (מספר אימונים, זמן, וכו')
   - `activityHistory` - היסטוריית אימונים מלאה עם פרטים

4. **אחסון נתונים**:
   - נשמר מקומית ובענן
   - סנכרון לענן רק למנויי פרימיום ולמנויי 7 ימי ניסיון
   - אין תמיכה במצב לא מקוון (חייב חיבור)

5. **מטרות ומדידות**:
   - מדידות גוף (כולל משקל) כחלק מנתוני המשתמש
   - מטרות אימון בטיפוס נפרד, מבוססות על נתוני השאלון

## 🏃‍♂️ זרימת נתוני משתמש במערכת

### 📱 יצירת משתמש והרשמה

1. המשתמש ממלא שאלון (לפני הרשמה)
2. נתוני השאלון נשמרים ב-`AsyncStorage`
3. בעת הרשמה, נוצר אובייקט משתמש חדש
4. נתוני השאלון מסתנכרנים עם נתוני המשתמש
5. המידע מועבר לשרת (אם מתחבר)

### 🔄 סנכרון נתונים

- במשתמשי פרימיום ומשתמשי ניסיון - סנכרון דו-כיווני עם הענן
- במשתמשים רגילים - שמירה מקומית בלבד
- שגיאות סנכרון נרשמות ביומן מקומי

### 📊 מעקב התקדמות

- היסטוריית אימונים נשמרת באובייקט המשתמש
- משתמש יכול לראות גרפים של משקלים ואימונים
- מדידות גוף (כולל משקל) נשמרות בטאב בפרופיל

## 🧩 אימונים ותרגילים

### 📆 תוכניות אימון

- נוצרות אוטומטית לפי תשובות השאלון:
  - חלוקת ימים
  - זמן זמין
  - ציוד זמין
  - העדפות אישיות
- משתמשי פרימיום יכולים ליצור תוכנית אחת מותאמת אישית
- אימונים מובנים מראש הם סטטיים ללא מבנה נתונים דינמי

### 💪 תרגילים

- מידע מפורט כולל וידאו והוראות
- פרטים חשובים: שמות התרגילים, קבוצות שרירים, שריר מרכזי, ציוד

### 📝 תיעוד אימונים

- בסיום אימון, הנתונים נשמרים ישירות בהיסטוריית האימונים של המשתמש

## 🛠️ המלצות לשיפור מבנה הטיפוסים

בהתבסס על הניתוח לעיל, להלן המלצות לרפקטורינג של מבנה הטיפוסים:

1. **הגדרת טיפוסים מרכזיים**:

   ```typescript
   // src/core/types/user.types.ts
   export interface User {
     id: string;
     email: string;
     name: string;
     provider: AuthProvider;
     hasQuestionnaire: boolean;
     questionnaireData?: QuestionnaireData;
     trainingStats: TrainingStats;
     activityHistory: WorkoutHistory[];
     bodyMeasurements: BodyMeasurements;
     subscription: Subscription;
     metadata: UserMetadata;
     trainingGoals: TrainingGoal[];
   }

   export type AuthProvider = "google" | "manual";

   export interface UserMetadata {
     registrationDate: Date;
     lastLoginDate: Date;
     appVersion?: string;
   }

   // src/core/types/subscription.types.ts
   export interface Subscription {
     type: SubscriptionType;
     startDate: Date;
     endDate?: Date;
     active: boolean;
     features: SubscriptionFeature[];
   }

   export type SubscriptionType = "free" | "premium" | "trial";
   export type SubscriptionFeature =
     | "customWorkouts"
     | "cloudSync"
     | "advancedStats"
     | "videoGuides";

   // src/core/types/measurements.types.ts
   export interface BodyMeasurements {
     weight: BodyMeasurementRecord[];
     height?: number;
     chest?: BodyMeasurementRecord[];
     waist?: BodyMeasurementRecord[];
     // מדידות נוספות...
   }

   export interface BodyMeasurementRecord {
     value: number;
     date: Date;
     notes?: string;
   }

   // src/core/types/workout.types.ts
   export interface WorkoutHistory {
     id: string;
     date: Date;
     duration: number; // בשניות
     exercises: CompletedExercise[];
     notes?: string;
   }

   export interface CompletedExercise {
     exerciseId: string;
     sets: CompletedSet[];
     duration?: number; // לתרגילים מבוססי זמן
   }

   export interface CompletedSet {
     weight?: number;
     reps?: number;
     duration?: number; // לסטים מבוססי זמן
     completed: boolean;
   }

   // src/core/types/stats.types.ts
   export interface TrainingStats {
     totalWorkouts: number;
     totalTime: number; // בשניות
     startDate: Date; // תאריך התחלת אימונים
     achievements: Achievement[];
     personalRecords: PersonalRecord[];
   }

   export interface PersonalRecord {
     exerciseId: string;
     value: number; // משקל/חזרות
     date: Date;
     type: "weight" | "reps" | "duration";
   }

   // src/core/types/questionnaire.types.ts
   export interface QuestionnaireData {
     goals: TrainingGoal[];
     schedule: WeeklySchedule;
     equipment: EquipmentItem[];
     experience: ExperienceLevel;
     preferences: UserPreferences;
     healthInfo?: HealthInformation;
   }

   export type TrainingGoal =
     | "muscle"
     | "strength"
     | "weight_loss"
     | "endurance"
     | "health";
   export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

   export interface WeeklySchedule {
     daysPerWeek: number;
     timePerWorkout: number; // בדקות
     preferredDays?: DayOfWeek[];
   }

   export type DayOfWeek =
     | "sunday"
     | "monday"
     | "tuesday"
     | "wednesday"
     | "thursday"
     | "friday"
     | "saturday";
   ```

2. **ארגון קבצי טיפוסים**:
   - קבצים נפרדים לפי דומיינים לוגיים
   - ייצוא מרכזי דרך `index.ts`
   - תיעוד מלא לכל טיפוס והשדות שלו

3. **שיפור מבנה טיפוסים**:
   - הסרת שדות אופציונליים מיותרים
   - הוספת טיפוסי אנאם במקום מחרוזות גנריות
   - הגדרת טיפוסי רשומות עבור נתונים היסטוריים

4. **מבנה תיקיות מעודכן**:
   ```
   src/
   ├── core/
   │   ├── types/
   │   │   ├── index.ts                  # ייצוא מרכזי
   │   │   ├── user.types.ts             # טיפוסי משתמש
   │   │   ├── workout.types.ts          # טיפוסי אימון
   │   │   ├── exercise.types.ts         # טיפוסי תרגיל
   │   │   ├── questionnaire.types.ts    # טיפוסי שאלון
   │   │   ├── stats.types.ts            # סטטיסטיקות
   │   │   ├── measurements.types.ts     # מדידות גוף
   │   │   └── subscription.types.ts     # מנויים
   ```

## 🔄 מיגרציה הדרגתית

לאור מורכבות המבנה הנוכחי, מומלץ:

1. **להתחיל ממרכוז הטיפוסים**
2. **להגדיר שדות חובה ברורים**
3. **להוסיף תיעוד מפורט לכל טיפוס**
4. **לעדכן בהדרגה את השימוש בטיפוסים במודולים השונים**

כך נוכל להבטיח מעבר חלק למבנה טיפוסים נקי ומובנה יותר, תוך הפחתת שגיאות TypeScript.
