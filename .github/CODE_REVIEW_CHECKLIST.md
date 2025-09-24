# Code Review Checklist - GYMovoo Project

## 📋 שאלות הבדיקה לכל קובץ בפרוייקט

לפני כל עבודה על קובץ קיים או יצירת קובץ חדש, יש לשאול את השאלות הבאות:

### 🔍 שאלות יסוד

1. **"למה הפונקציה הזאת כל כך מורכבת?"**
   - האם הקובץ מכיל יותר מ-300 שורות?
   - האם יש פונקציות מעל 30 שורות?
   - האם הלוגיקה מעורבת עם ה-UI?

2. **"אפשר לעשות את זה בשורה אחת?"**
   - האם יש חישובים מורכבים שיכולים להפוך לפונקציית utility?
   - האם יש קוד חוזר שיכול להפוך לקומפוננט או hook?
   - האם יש תנאים מורכבים שיכולים להפשט?

### 📊 מדדי Over-Engineering

#### 🚨 אזהרה קריטית (דורש פעולה מיידית)

- **1500+ שורות** במסך אחד
- **500+ שורות** בקומפוננט אחד
- **100+ שורות** בפונקציה אחת
- **10+ פרמטרים** בפונקציה
- **5+ רמות nesting** בקוד

#### ⚠️ אזהרה בינונית (דורש בדיקה)

- **300-500 שורות** בקומפוננט
- **30-50 שורות** בפונקציה
- **5-10 פרמטרים** בפונקציה
- **3-5 רמות nesting** בקוד

#### ✅ תקין

- **< 200 שורות** בקומפוננט
- **< 20 שורות** בפונקציה
- **< 5 פרמטרים** בפונקציה
- **< 3 רמות nesting** בקוד

### 🛠️ פתרונות לדפוסי Over-Engineering

#### מסכים גדולים (MainScreen: 1700+ → 771 שורות)

- [ ] הפרד לוגיקה ל-custom hooks
- [ ] חלק UI לקומפוננטים קטנים
- [ ] העבר חישובים לקבצי utility
- [ ] השתמש ב-memoization חכם

#### פונקציות מורכבות

- [ ] פצל לפונקציות קטנות יותר
- [ ] החלק לוגיקה עסקית מ-UI
- [ ] השתמש בקומפוזיציה במקום inheritance
- [ ] העבר חישובים ל-pure functions

#### State Management מסובך

- [ ] השתמש ב-custom hooks
- [ ] הפרד local state מ-global state
- [ ] השתמש ב-context providers נפרדים
- [ ] הקטן את מספר ה-useState calls

### 📝 דוגמאות מהפרוייקט

#### ✅ לפני הרפקטורינג

```tsx
// MainScreen.tsx - 1700+ שורות
function MainScreen() {
  // 10+ useState hooks
  // 20+ useEffect hooks
  // 50+ inline functions
  // מעורב: UI + לוגיקה עסקית + API calls + חישובים
}
```

#### ✅ אחרי הרפקטורינג

```tsx
// MainScreen.tsx - 771 שורות
function MainScreen() {
  const {
    user,
    stats,
    handleRefresh,
    // ... עוד נתונים מוכנים
  } = useMainScreenData(); // Custom hook

  const lastWorkoutStats = useLastWorkoutStats({
    workouts: user?.activityHistory?.workouts || [],
  });

  // רק UI ו-rendering
  return (
    <ScrollView>
      <WelcomeHeader {...headerProps} />
      <AIRecommendationsSection {...aiProps} />
      <WearablesSection />
    </ScrollView>
  );
}
```

### 🎯 עקרונות הרפקטורינג

1. **Single Responsibility Principle**
   - כל קומפוננט/פונקציה עושה דבר אחד בלבד

2. **Separation of Concerns**
   - הפרד UI מלוגיקה עסקית
   - הפרד API calls מ-state management
   - הפרד חישובים מ-rendering

3. **DRY (Don't Repeat Yourself)**
   - העבר קוד חוזר לפונקציות משותפות
   - צור קומפוננטים מורכבים מקומפוננטים קטנים

4. **Composition over Inheritance**
   - השתמש ב-hooks במקום class inheritance
   - בנה קומפוננטים גדולים מקומפוננטים קטנים

### 📈 תוצאות שהושגו

| קובץ                    | לפני           | אחרי         | חיסכון       |
| ----------------------- | -------------- | ------------ | ------------ |
| MainScreen.tsx          | 1700+ שורות    | 771 שורות    | 55% 🎉       |
| **ProfileScreen.tsx**   | **1926 שורות** | **81 שורות** | **95.8% 🚀** |
| mainScreenTexts.ts      | 118 שורות      | 114 שורות    | 3.4% ✅      |
| exercisesScreenTexts.ts | 78 שורות       | 11 שורות     | 85% 🔧       |
| muscleGroups.ts         | דופליקציה      | מערכת מאוחדת | איחוד ✨     |

### 🎯 בתור הבא (בסדר עדיפות):

| קובץ                    | שורות | useState | עדיפות    |
| ----------------------- | ----- | -------- | --------- |
| WorkoutPlansScreen.tsx  | 1175  | 9 hooks  | 🚨 קריטי  |
| ActiveWorkoutScreen.tsx | 946   | 7 hooks  | 🚨 קריטי  |
| achievementsConfig.ts   | 769   | -        | 🟡 בינוני |

### ⚡ Tools ו-Scripts לבדיקה

```bash
# בדיקת מספר שורות בקבצים
Get-Content "src/**/*.tsx" | Measure-Object -Line

# חיפוש קבצים גדולים
Get-ChildItem -Recurse -Include "*.tsx","*.ts" | Where-Object {(Get-Content $_.FullName | Measure-Object -Line).Lines -gt 300}

# חיפוש פונקציות ארוכות
grep -n "function\|const.*=" src/**/*.tsx | wc -l
```

### 🔄 תהליך בדיקה שגרתי

1. **לפני כל commit:**
   - בדוק אם יש קבצים מעל 300 שורות
   - בדוק אם יש פונקציות מעל 30 שורות

2. **Code Review:**
   - שאל: "למה הפונקציה הזאת כל כך מורכבת?"
   - שאל: "אפשר לעשות את זה בשורה אחת?"

3. **רפקטורינג תקופתי:**
   - כל שבועיים - בדוק קבצים שגדלו
   - כל חודש - בדוק performance ו-maintainability

---

## 📌 הערות חשובות

- **פשטות עדיפה על מורכבות** - תמיד העדף פתרון פשוט
- **Readability מעל Cleverness** - קוד צריך להיות קריא, לא חכם
- **Performance בסוף** - קודם נכונות ופשטות, אח"כ ביצועים

---

_"The best code is no code at all. The second best is simple, readable code."_
