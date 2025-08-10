# 🔍 כלי בדיקת הפרדת דמו-production

## סקירה כללית

כלי אוטומטי לוידוא שההפרדה בין קוד דמו לקוד production עובדת נכון ובטוח.

## הרצה

```bash
# בדיקה מלאה
npm run validate:demo-production

# או ישירות
node validateProductionDemoSeparation.js
```

## מה הכלי בודק

### 🏭 קבצי Production

- ✅ קבצים קיימים
- ✅ נקיים מקוד דמו
- ✅ ללא imports של שירותי דמו

### 🔴 קבצי Demo

- ✅ קבצים קיימים
- ✅ הגנות אבטחה במקום
- ✅ בדיקות `__DEV__` פועלות

### 🏗️ ארכיטקטורה

- ✅ תיקיית demo קיימת
- ✅ דמו משתמש בשירותי production
- ✅ exports נכונים

### 📦 Imports

- ✅ מסכים משתמשים בשירותי demo חדשים
- ✅ לא נותרו imports ישנים

### ⚙️ קומפילציה

- ✅ TypeScript עובר בלי שגיאות

## תוצאות לדוגמה

```
🔍 מתחיל בדיקה מקיפה של הפרדת דמו-production...
============================================================

🏭 בדיקת קבצי Production...
✅ קובץ production נקי: workoutSimulationService.ts
✅ קובץ production נקי: workoutHistoryService.ts

🔴 בדיקת קבצי Demo...
✅ הגנות במקום: demoUserService.ts
✅ הגנות במקום: demoWorkoutService.ts

📊 סיכום:
✅ עבר: 18
❌ נכשל: 0
🎯 תוצאה: ✅ SUCCESS
```

## שימושים מומלצים

### 🔄 CI/CD

הוסף לפייפליין:

```yaml
- name: Validate Demo-Production Separation
  run: npm run validate:demo-production
```

### 🧪 לפני commit

```bash
npm run validate:demo-production && git commit
```

### 📊 בדיקה יומית

הרץ כחלק מבדיקות איכות קוד.

## העדפת נכשלונות

אם הכלי נכשל:

1. 📋 בדוק את רשימת השגיאות
2. 🔧 תקן את הבעיות
3. 🔄 הרץ שוב

## הרחבות עתידיות

- 🔌 אינטגרציה עם Git hooks
- 📈 דוחות מפורטים יותר
- 🎯 בדיקות performance
- 🔐 סריקות אבטחה נוספות
