# מסך שאלון חכם (Questionnaire Screens) 📋

## סקירה כללית

מסכי השאלון החכם מהווים את הבסיס לבניית פרופיל המשתמש ויצירת תוכניות אימון מותאמות אישית. המערכת משתמשת ב-7 שאלות דינמיות לאיסוף מידע מקיף.

## 📱 מסכים במודול

### 1. SmartQuestionnaireScreen (מסך השאלון הראשי)

**מיקום:** `src/screens/questionnaire/SmartQuestionnaireScreen.tsx`

**תפקיד:**

- מסך מרכזי המנהל את כל זרימת השאלון
- ניווט חכם בין שאלות בהתאם לתשובות
- שמירת נתונים ומעבר למסך הבא

**תכונות עיקריות:**

- 🧠 **לוגיקה דינמית:** שאלות משתנות לפי תשובות קודמות
- 📊 **פס התקדמות:** הצגת מיקום בשאלון (1/7, 2/7...)
- ✅ **ולידציה:** בדיקת תקינות לפני מעבר
- 💾 **שמירה אוטומטית:** כל תשובה נשמרת מיידית
- 🔄 **חזרה לאחור:** אפשרות לשנות תשובות קודמות

**מבנה השאלון:**

```
שאלה 1: מטרת האימון (עליית כוח/ירידה במשקל/חיטוב)
שאלה 2: רמת ניסיון (מתחיל/בינוני/מתקדם)
שאלה 3: גיל (AgeSelector)
שאלה 4: גובה (HeightSlider)
שאלה 5: משקל (WeightSlider)
שאלה 6: ציוד זמין (EquipmentSelector)
שאלה 7: תזונה מועדפת (DietSelector)
```

**אלגוריתם ההתאמה:**

1. ניתוח שילוב של כל התשובות
2. חישוב מקדמי משקל לפי גיל ומטרות
3. בחירת רמת קושי בהתאם לניסיון
4. התאמת תרגילים לציוד הזמין
5. הצעת תוכנית תזונה בסיסית

---

### 2. AgeSelector (בוחר גיל)

**מיקום:** `src/screens/questionnaire/AgeSelector.tsx`

**תפקיד:**

- בחירת גיל המשתמש
- חישוב פרמטרים רפואיים בסיסיים
- התאמת המלצות לשלב החיים

**תכונות עיקריות:**

- 🎚️ **Slider אינטואיטיבי:** טווח 13-80 שנה
- 📊 **משוב ויזואלי:** השפעה על תוכנית האימון
- ⚕️ **התראות רפואיות:** המלצה לייעוץ רפואי (65+)
- 🎯 **התאמת יעדים:** מטרות ריאליות לפי גיל

**השפעה על התוכנית:**

- **13-18:** דגש על טכניקה ובטיחות
- **18-30:** מקסימום עצימות ובניית כוח
- **30-45:** איזון עבודה-אימון, מניעת פציעות
- **45-60:** שמירת מסת שריר, בריאות מפרקים
- **60+:** פונקציונליות, יציבות, איכות חיים

---

### 3. HeightSlider (בוחר גובה)

**מיקום:** `src/screens/questionnaire/HeightSlider.tsx`

**תפקיד:**

- הקלטת גובה המשתמש
- חישוב BMI וMaintenance Calories
- התאמת טווחי משקל בריאים

**תכונות עיקריות:**

- 📏 **יחידות מרובות:** ס"מ / feet & inches
- 🔄 **המרה אוטומטית:** בין יחידות מידה
- 📊 **חישובים מיידיים:** BMI, משקל אידיאלי
- 🎯 **המלצות מותאמות:** טווח משקל בריא

**טווחים תקינים:**

- **נשים:** 140-200 ס"מ
- **גברים:** 150-220 ס"מ
- **התאמות מיוחדות:** לילדים ומתבגרים

---

### 4. WeightSlider (בוחר משקל)

**מיקום:** `src/screens/questionnaire/WeightSlider.tsx`

**תפקיד:**

- הקלטת משקל נוכחי ומשקל יעד
- חישוב קלוריות תחזוקה ויעד
- קביעת קצב ירידה/עליה מומלץ

**תכונות עיקריות:**

- ⚖️ **יחידות מרובות:** ק"ג / lbs
- 🎯 **משקל נוכחי ויעד:** שני משתנים נפרדים
- 📈 **חישוב טרנד:** קצב שינוי מומלץ
- ⚠️ **אזהרות בטיחות:** יעדים לא בריאים

**חישובים אוטומטיים:**

```javascript
BMI = weight(kg) / (height(m))²
BMR = Harris-Benedict formula
TDEE = BMR × Activity Factor
Target Rate = 0.5-1kg per week (safe)
```

---

### 5. EquipmentSelector (בוחר ציוד)

**מיקום:** `src/screens/questionnaire/EquipmentSelector.tsx`

**תפקיד:**

- בחירת ציוד הזמין למשתמש
- קביעת סוגי אימונים אפשריים
- התאמת מאגר התרגילים

**תכונות עיקריות:**

- ✅ **בחירה מרובה:** אפשרות לבחירת מספר פריטים
- 🏠 **מצבי אימון:** בית / חדר כושר / שניהם
- 🔍 **חיפוש מהיר:** לפי שם או קטגוריה
- 📊 **השפעה על תוכנית:** הצגת כמות תרגילים זמינים

**קטגוריות ציוד:**

```
🏠 ביתי:
- משקל גוף
- משקולות בסיסיות
- גומיות התנגדות
- מזרן יוגה

🏋️ חדר כושר:
- ברבל ומשקולות
- מכונות כוח
- מכונות קרדיו
- כבלים ופולי

🎯 אביזרי עזר:
- כדור רפואי
- קטלבל
- TRX
- foam roller
```

---

### 6. DietSelector (בוחר תזונה)

**מיקום:** `src/screens/questionnaire/DietSelector.tsx`

**תפקיד:**

- בחירת סוג התזונה המועדפת
- התאמת המלצות תזונה לאימונים
- חישוב מקרו-נוטריינטים

**תכונות עיקריות:**

- 🥗 **דיאטות מרובות:** רגילה, טבעונית, קטו, פליאו
- ⚖️ **איזון מקרו:** חלבון, פחמימות, שומנים
- 🔢 **חישוב קלוריות:** בהתאם למטרה
- 📋 **המלצות מזון:** רשימת מזונות מומלצים

**סוגי דיאטות נתמכות:**

```
🥙 רגילה: איזון כל המקרו-נוטריינטים
🌱 טבעונית: מבוססת צמחים, B12 וחלבון
🥓 קטו: שומנים גבוהים, פחמימות נמוכות
🥩 פליאו: מזונות טבעיים, ללא עיבוד
🐟 ים תיכוני: שמן זית, דגים, ירקות
```

## 🔄 זרימת השאלון

```
WelcomeScreen/RegisterScreen
        ↓
SmartQuestionnaireScreen
        ↓
Question 1: מטרה
        ↓
Question 2: ניסיון
        ↓
Question 3: AgeSelector
        ↓
Question 4: HeightSlider
        ↓
Question 5: WeightSlider
        ↓
Question 6: EquipmentSelector
        ↓
Question 7: DietSelector
        ↓
Profile Creation & MainScreen
```

## 🎯 אלגוריתם ההמלצות

### שלב 1: איסוף נתונים

```javascript
const userProfile = {
  goal: 'weight_loss' | 'muscle_gain' | 'toning' | 'strength',
  experience: 'beginner' | 'intermediate' | 'advanced',
  age: number,
  height: number,
  weight: number,
  targetWeight: number,
  equipment: string[],
  diet: string
};
```

### שלב 2: חישובים מתקדמים

```javascript
// BMR - קלוריות מנוחה
const bmr = calculateBMR(weight, height, age, gender);

// TDEE - קלוריות יומיות
const tdee = bmr * activityFactor;

// יעד קלוריות
const targetCalories = calculateTarget(tdee, goal);

// פיצול מקרו
const macros = calculateMacros(targetCalories, diet, goal);
```

### שלב 3: בחירת תרגילים

```javascript
// סינון לפי ציוד
const availableExercises = exercises.filter((ex) =>
  ex.equipment.some((eq) => userEquipment.includes(eq))
);

// התאמה לרמה
const levelAppropriate = availableExercises.filter(
  (ex) => ex.difficulty <= userExperience
);

// איזון שרירים
const balancedWorkout = createBalancedWorkout(levelAppropriate, goal);
```

## 🎨 עיצוב ו-UX

### כללי עיצוב:

- **Progressive Disclosure:** חשיפת מידע בהדרגה
- **Visual Feedback:** הצגת השפעת כל תשובה
- **Error Prevention:** ולידציה לפני מעבר
- **Accessibility:** תמיכה מלאה בכלי נגישות

### אנימציות:

- **Smooth Transitions:** מעברים חלקים בין שאלות
- **Progress Animation:** התקדמות הפס המיידית
- **Success States:** אנימציות השלמה
- **Loading States:** טעינה במהלך חישובים

### גיזום כפתורים:

- **טקסט ברור:** כל אפשרות מוסברת
- **Chunking:** קיבוץ אפשרויות דומות
- **Default Values:** ערכי ברירת מחדל חכמים
- **Quick Select:** אפשרויות מהירות נפוצות

## 🔧 טכנולוגיות

### State Management:

```javascript
// Zustand store לשאלון
const useQuestionnaireStore = create((set) => ({
  currentQuestion: 1,
  answers: {},
  isComplete: false,
  updateAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  nextQuestion: () =>
    set((state) => ({
      currentQuestion: state.currentQuestion + 1,
    })),
  previousQuestion: () =>
    set((state) => ({
      currentQuestion: Math.max(1, state.currentQuestion - 1),
    })),
}));
```

### Validation:

```javascript
// Yup schema לולידציה
const questionnaireSchema = yup.object({
  goal: yup.string().required(),
  experience: yup.string().required(),
  age: yup.number().min(13).max(100),
  height: yup.number().min(140).max(220),
  weight: yup.number().min(30).max(200),
  equipment: yup.array().min(1),
  diet: yup.string().required(),
});
```

### Performance:

- **Lazy Loading:** טעינת קומפוננטים לפי צורך
- **Memoization:** זכירת חישובים יקרים
- **Debounced Input:** עדכון ערכים מהיר
- **Background Calculation:** חישובים ברקע

## 📊 אנליטיקה ותובנות

### מעקב התנהגות:

- **זמן בכל שאלה:** איזה שאלות מבלבלות
- **שיעור נטישה:** איפה משתמשים עוזבים
- **שינוי תשובות:** כמה פעמים חוזרים אחורה
- **דפוסי תשובות:** צירופים נפוצים

### תובנות מוצר:

- **שאלות בעייתיות:** שיעורי נטישה גבוהים
- **זמן השלמה ממוצע:** אופטימיזציה UX
- **דיוק תחזיות:** עד כמה התוכניות מדויקות
- **שביעות רצון:** משוב על התוכניות שנוצרו

## 📋 משימות פיתוח עתידיות

### שיפורי UX:

- [ ] **Voice Input:** מענה קולי לשאלות
- [ ] **Smart Defaults:** ערכי ברירת מחדל מבוססי AI
- [ ] **Progress Saving:** שמירת התקדמות בענן
- [ ] **A/B Testing:** בדיקת וריאציות שאלות

### תכונות מתקדמות:

- [ ] **Photo Analysis:** זיהוי מבנה גוף מתמונה
- [ ] **Health Kit Integration:** נתונים מאפליקציות בריאות
- [ ] **Genetic Factors:** התחשבות במידע גנטי
- [ ] **Medical History:** התאמה למגבלות רפואיות

### בינה מלאכותית:

- [ ] **Smart Question Flow:** שאלות דינמיות מבוססות AI
- [ ] **Prediction Accuracy:** שיפור דיוק התחזיות
- [ ] **Personalized Recommendations:** המלצות מותאמות יותר
- [ ] **Continuous Learning:** למידה מתוצאות משתמשים
