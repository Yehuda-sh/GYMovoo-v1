# מסכי פרופיל והיסטוריה (Profile & History Screens) 👤📊

## סקירה כללית

מסכי הפרופיל וההיסטוריה מאפשרים למשתמש לנהל את המידע האישי, לעקוב אחר התקדמות ולנתח את ביצועי האימונים לאורך זמן.

## 📱 מסכי פרופיל

### 1. ProfileScreen (מסך פרופיל)

**מיקום:** `src/screens/profile/ProfileScreen.tsx`

**תפקיד:**

- ניהול נתונים אישיים ומטרות
- הצגת סטטיסטיקות מרכזיות
- הגדרות מתקדמות ועדכון פרטים

**תכונות עיקריות:**

- 👤 **מידע אישי:** שם, גיל, גובה, משקל נוכחי
- 🎯 **מטרות:** משקל יעד, מטרת אימון, תאריך יעד
- 🏋️ **העדפות אימון:** רמת ניסיון, תדירות, משך
- 🛠️ **ציוד זמין:** רשימה מלאה עם אפשרות עדכון
- 🥗 **תזונה:** סוג דיאטה, העדפות, אלרגיות
- ⚙️ **הגדרות:** יחידות מידה, שפה, התראות

**מבנה המסך:**

```
┌─────────────────────────┐
│    Profile Picture      │
│     + שם משתמש          │
├─────────────────────────┤
│   Current Stats Card    │
│   משקל | BMI | יעד      │
├─────────────────────────┤
│    Settings Sections    │
│  📊 נתונים אישיים       │
│  🎯 מטרות והעדפות       │
│  🏋️ ציוד ואימונים       │
│  ⚙️ הגדרות כלליות       │
└─────────────────────────┘
```

**פונקציות מתקדמות:**

- 📊 **BMI Calculator:** חישוב אוטומטי וצבע לפי תקינות
- 📈 **Progress Tracking:** מעקב שינויי משקל לאורך זמן
- 🔄 **Data Sync:** סנכרון עם אפליקציות בריאות
- 💾 **Backup/Restore:** גיבוי והשחזור נתונים
- 🎨 **Theme Selection:** בחירת ערכת צבעים

**קישורים:**

- 📊 התקדמות → `ProgressScreen`
- 📋 עדכון שאלון → `SmartQuestionnaireScreen`
- 🏋️ עדכון ציוד → `EquipmentSelector`
- ⚙️ הגדרות מתקדמות → Settings Modal

---

## 📊 מסכי היסטוריה והתקדמות

### 2. HistoryScreen (מסך היסטוריה)

**מיקום:** `src/screens/history/HistoryScreen.tsx`

**תפקיד:**

- הצגת כל האימונים שבוצעו
- ניתוח מגמות וביצועים
- גישה לפרטי אימונים ספציפיים

**תכונות עיקריות:**

- 📅 **Timeline View:** אימונים בסדר כרונולוגי
- 🔍 **חיפוש וסינון:** לפי תאריך, סוג, תרגיל
- 📊 **Quick Stats:** סה"כ אימונים, זמן, נפח
- ⭐ **דירוגים:** ממוצע דירוגי אימונים
- 📈 **גרפים מהירים:** טרנדים שבועיים/חודשיים
- 💾 **Export Data:** ייצוא לExcel/CSV

**מבנה תצוגת היסטוריה:**

```
┌─────────────────────────┐
│    Quick Stats Bar      │
│  30 אימונים | 45 שעות  │
├─────────────────────────┤
│    Filter & Search      │
│  [השבוע] [חזה] [🔍]     │
├─────────────────────────┤
│     Workout Cards       │
│  ┌─────────────────┐    │
│  │ 🏋️ רגליים כבד   │    │
│  │ 2 ינואר | 45 דק' │    │
│  │ ⭐⭐⭐⭐⭐ | 85%  │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

**אנליזות מתקדמות:**

- 📊 **Volume Tracking:** סה"כ משקל מושקל בזמן
- 🏆 **Personal Records:** זיהוי שיאים אוטומטי
- 📈 **Strength Progression:** מעקב עליית כוח
- ⏱️ **Time Analysis:** זמן ממוצע לאימון
- 🎯 **Goal Progress:** התקדמות לעבר מטרות

---

### 3. ProgressScreen (מסך התקדמות)

**מיקום:** `src/screens/progress/ProgressScreen.tsx`

**תפקיד:**

- ויזואליזציה מתקדמת של התקדמות
- גרפים אינטראקטיביים ומדדי ביצועים
- השוואות ומגמות זמן

**תכונות עיקריות:**

- 📊 **Interactive Charts:** גרפים מגע עם זום
- ⚖️ **Body Metrics:** משקל, BMI, אחוז שומן
- 💪 **Strength Metrics:** 1RM, נפח, עצימות
- 📅 **Time Ranges:** יום/שבוע/חודש/שנה
- 🏆 **Achievements:** מערכת הישגים ותגים
- 📸 **Progress Photos:** השוואת תמונות לפני/אחרי

**סוגי גרפים:**

```javascript
// דוגמת גרף משקל
const weightChart = {
  type: "line",
  data: weightHistory,
  xAxis: "date",
  yAxis: "weight",
  trend: "decreasing",
  goal: targetWeight,
};

// דוגמת גרף נפח אימון
const volumeChart = {
  type: "bar",
  data: weeklyVolume,
  xAxis: "week",
  yAxis: "totalVolume",
  comparison: "previousMonth",
};
```

**מדדי התקדמות:**

- **משקל:** גרף עם קו מגמה ויעד
- **כוח:** שיאים אישיים בתרגילים מרכזיים
- **נפח:** סה"כ משקל × חזרות באימון
- **תדירות:** ימי אימון בשבוע
- **עקביות:** רצף ימים/שבועות
- **יעילות:** זמן ממוצע להשלמת אימון

---

## 🔔 מסך התראות

### 4. NotificationsScreen (מסך התראות)

**מיקום:** `src/screens/notifications/NotificationsScreen.tsx`

**תפקיד:**

- ניהול התראות ותזכורות
- הגדרת זמני אימון ויעדים
- מעקב אחר הישגים ועדכונים

**תכונות עיקריות:**

- ⏰ **תזכורות אימון:** יומי/שבועי/מותאם אישית
- 🏆 **הישגים:** התראות על שיאים חדשים
- 📊 **דוחות שבועיים:** סיכום התקדמות
- 🎯 **מעקב יעדים:** התראות קרבה ליעד
- 💧 **תזכורות שתייה:** הידרציה במהלך אימון
- 📱 **הגדרות Push:** ניהול התראות מערכת

**סוגי התראות:**

```javascript
const notificationTypes = {
  workoutReminder: {
    time: "18:00",
    days: ["sunday", "tuesday", "thursday"],
    message: "זמן לאימון! 💪",
  },
  achievement: {
    type: "personal_record",
    message: "שיא חדש בכפיפות! 🏆",
  },
  motivation: {
    frequency: "daily",
    message: "יום מעולה להתחיל! 🌟",
  },
};
```

## 🔄 זרימת ניווט

```
MainScreen → ProfileScreen ⟷ Settings
     ↓           ↓
HistoryScreen → WorkoutDetails
     ↓           ↓
ProgressScreen → Charts & Analytics
     ↓
NotificationsScreen → Settings
```

## 📊 מבנה נתונים

### UserProfile Interface:

```typescript
interface UserProfile {
  // מידע בסיסי
  id: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";

  // מדדי גוף
  height: number; // ס"מ
  currentWeight: number; // ק"ג
  targetWeight?: number; // ק"ג
  bodyFatPercentage?: number;

  // מטרות ויעדים
  fitnessGoal: "weight_loss" | "muscle_gain" | "toning" | "strength";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  weeklyWorkoutGoal: number; // מספר אימונים בשבוע

  // העדפות
  preferredWorkoutDuration: number; // דקות
  availableEquipment: string[];
  dietType: string;
  allergies?: string[];

  // הגדרות
  units: "metric" | "imperial";
  language: "he" | "en";
  notifications: NotificationSettings;

  // מטא-דטה
  createdAt: Date;
  lastUpdated: Date;
  totalWorkouts: number;
  streakDays: number;
}
```

### WorkoutHistory Interface:

```typescript
interface WorkoutHistory {
  id: string;
  userId: string;
  date: Date;
  type: "planned" | "quick" | "custom";
  duration: number; // דקות
  totalVolume: number; // ק"ג × חזרות
  averageRPE: number; // 1-10
  rating: number; // כוכבים 1-5
  notes?: string;
  exercises: ExerciseSet[];
  personalRecords: PersonalRecord[]; // שיאים שהושגו
}
```

## 🎨 עיצוב ו-UX

### כללי עיצוב:

- **Data Visualization:** גרפים ברורים וצבעוניים
- **Progressive Disclosure:** מידע בסיסי קדימה
- **Consistent Icons:** איקונוגרפיה אחידה
- **Color Coding:** צבעים למגמות (ירוק=טוב, אדום=זקוק לשיפור)

### אינטראקציות:

- **Pull to Refresh:** רענון נתונים
- **Swipe Actions:** פעולות מהירות
- **Long Press:** אפשרויות מתקדמות
- **Haptic Feedback:** משוב מגע

### נגישות:

- **Screen Reader:** תמיכה מלאה
- **Large Text:** הגדלת טקסט
- **High Contrast:** ניגודיות גבוהה
- **Voice Control:** שליטה קולית

## 🔧 טכנולוגיות

### Charts & Analytics:

```javascript
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
} from "react-native-chart-kit";

// דוגמת גרף קו למשקל
<LineChart
  data={{
    labels: dates,
    datasets: [{ data: weights }],
  }}
  width={screenWidth}
  height={220}
  chartConfig={chartConfig}
  bezier
/>;
```

### Performance Optimization:

- **Virtualized Lists:** לרשימות גדולות
- **Memoization:** זכירת חישובים
- **Lazy Loading:** טעינת נתונים לפי צורך
- **Caching:** שמירת נתונים בזיכרון

### Data Management:

- **AsyncStorage:** נתונים מקומיים
- **SQLite:** בסיס נתונים מתקדם
- **Cloud Sync:** סנכרון ענן (בעתיד)
- **Compression:** דחיסת נתונים גדולים

## 🔐 אבטחה ופרטיות

### הגנת נתונים:

- **Encryption at Rest:** הצפנת נתונים מקומיים
- **Secure Endpoints:** תקשורת מוצפנת
- **Biometric Lock:** נעילה ביומטרית
- **Data Anonymization:** אנונימיזציה לאנליטיקה

### GDPR Compliance:

- **Data Export:** ייצוא כל הנתונים
- **Right to Delete:** מחיקת חשבון מלאה
- **Consent Management:** ניהול הסכמות
- **Privacy Settings:** בקרה על שיתוף נתונים

## 📋 משימות פיתוח עתידיות

### תכונות מתקדמות:

- [ ] **AI Insights:** תובנות מבוססות AI על התקדמות
- [ ] **Social Features:** שיתוף הישגים עם חברים
- [ ] **Coach Mode:** המלצות אישיות לשיפור
- [ ] **Health Integration:** סנכרון עם Apple Health/Google Fit

### אנליטיקה מתקדמת:

- [ ] **Predictive Analytics:** חיזוי ביצועים עתידיים
- [ ] **Injury Prevention:** זיהוי דפוסים מסוכנים
- [ ] **Plateau Detection:** זיהוי תקוות בהתקדמות
- [ ] **Recovery Analysis:** מעקב אחר התאוששות

### חוויית משתמש:

- [ ] **Voice Commands:** שליטה קולית מלאה
- [ ] **AR Progress:** מציאות רבודה לתמונות התקדמות
- [ ] **Gamification:** מערכת נקודות ותחרויות
- [ ] **Personalization Engine:** התאמה אוטומטית של UI
