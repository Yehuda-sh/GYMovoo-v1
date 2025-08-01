# מדריך כלי בדיקת API - API Testing Tool Guide

## סקירה כללית / Overview

כלי מקיף לבדיקת תקינות חיבורי API ואיכות נתונים באפליקציה.
Comprehensive tool for testing API connections and data quality in the application.

## איך להשתמש / How to Use

### גישה לכלי / Accessing the Tool

1. פתח את מסך תוכניות האימון (WorkoutPlansScreen)
2. חפש את הכפתור "🔍 בדיקת API ואיכות נתונים"
3. לחץ על הכפתור כדי להתחיל את הבדיקה

### מה נבדק / What Gets Tested

#### 1. בדיקת קישוריות רשת / Network Connectivity

- ✅ חיבור לאינטרנט
- ⏱️ זמן תגובה (latency)
- 🌐 בדיקת גישה ל-WGER API

#### 2. בדיקת שירותי API / API Services Testing

- **questionnaireService**: בדיקת שירות השאלון והעדפות משתמש
- **WorkoutDataService**: בדיקת שירות נתוני אימון משתמש
- **WGER API**: בדיקת חיבור למאגר התרגילים החיצוני
- **User Store**: בדיקת מצב המשתמש ונתוני השאלון

#### 3. בדיקת איכות נתונים / Data Quality Validation

- 📊 תקינות בסיס נתוני התרגילים
- 📋 שלמות תוכנית האימון הנוכחית
- 👤 השלמת העדפות המשתמש

## תוצאות בדיקה / Test Results

### מצב תקין / Healthy State

כאשר כל הבדיקות עוברות בהצלחה:

- ✅ כל ה-APIs פעילים
- ✅ חיבור רשת יציב
- ✅ נתונים תקינים ושלמים

### זיהוי בעיות / Problem Detection

הכלי יזהה:

- ❌ כשלים בחיבור API
- ⚠️ בעיות ברשת
- 🔍 נתונים חסרים או פגומים
- 📊 בעיות באיכות הנתונים

## פלט מפורט / Detailed Output

### בקונסול הפיתוח / Developer Console

כל הפרטים נשמרים ב-console.log:

```javascript
📊 API Test Results Summary: { ... }
📊 Data Quality Results: { ... }
📡 Network Connectivity: { ... }
```

### הודעת משתמש / User Message

הודעה מסוכמת עם:

- סטטוס כל API
- תוצאות בדיקת איכות נתונים
- מידע על קישוריות רשת

## שימוש מומלץ / Recommended Usage

### מתי להשתמש / When to Use

1. 🆕 בהתקנה ראשונית של האפליקציה
2. 🔧 בעת חקירת בעיות טכניות
3. 📱 לפני אימון חשוב
4. 🔄 אחרי עדכון האפליקציה

### פתרון בעיות / Troubleshooting

אם יש כשלים:

1. בדוק חיבור אינטרנט
2. נסה שוב אחרי כמה דקות
3. עיין בקונסול לפרטים נוספים
4. צור קשר עם התמיכה הטכנית

## פרטים טכניים / Technical Details

### פונקציות עיקריות / Main Functions

- `handleTestAPIConnections()`: פונקציה ראשית לבדיקה
- `checkNetworkConnectivity()`: בדיקת קישוריות רשת
- `validateDataQuality()`: בדיקת איכות נתונים

### תלויות / Dependencies

- questionnaireService
- WorkoutDataService
- useWgerExercises hook
- useUserStore

---

## הערות למפתחים / Developer Notes

### הוספת בדיקות נוספות / Adding More Tests

כדי להוסיף בדיקה חדשה:

1. הוסף ל-`testResults` object
2. הוסף לוגיקת בדיקה ב-`handleTestAPIConnections`
3. עדכן את הודעת התוצאות

### שיפורים עתידיים / Future Improvements

- [ ] בדיקת מהירות API
- [ ] בדיקת זיכרון ו-performance
- [ ] בדיקות אבטחה בסיסיות
- [ ] ייצוא תוצאות לקובץ

---

**💡 טיפ**: השתמש בכלי זה כחלק מבדיקה שגרתית לוודא שהאפליקציה פועלת כמצופה!
