# שאלון דינמי - לקחים וגידלינים

**עדכון אחרון**: 2025-08-14
**רלוונטי עד**: עד שינוי ארכיטקטורת שאלון

## 🎯 לקח המרכזי

שאלון דינמי דורש לוגיקה מדויקת ב-`influenceNextQuestions` - כל שגיאה גורמת לדילוג על שאלות או לולאות אינסופיות.

## ⚡ פתרון מהיר - שגיאות נפוצות

### 1. שאלות לא רלוונטיות מופיעות

```typescript
// ❌ לא נכון - תמיד מחזיר אותה שאלה
influenceNextQuestions: (answer) => {
  return ["gym_equipment_options"];
};

// ✅ נכון - בדיקה לפי תשובה
influenceNextQuestions: (answer) => {
  const option = answer as SmartOption;
  switch (option?.id) {
    case "home":
      return ["home_equipment_availability"];
    case "gym":
      return ["gym_equipment_availability"];
    default:
      return [];
  }
};
```

### 2. לולאות אינסופיות

```typescript
// ❌ לא נכון - חוזר לשאלה קודמת
influenceNextQuestions: (answer) => {
  return ["training_location"]; // יוצר מעגל
};

// ✅ נכון - מתקדם קדימה בלבד
influenceNextQuestions: (answer) => {
  return ["next_logical_question"];
};
```

## 🚫 מה לא לעשות

- אל תחזיר שאלות שכבר נענו (יוצר לולאות)
- אל תשכח לבדוק שה-ID של השאלה קיים במערך
- אל תסמוך על הנחות - תמיד בדוק את סוג התשובה
- אל תשכח לטפל במקרה default

## 🔧 בדיקות חובה

1. **זרימת פלואו**: עבור על כל נתיב אפשרי ובדוק שאין דילוגים
2. **IDs תקינים**: ודא שכל שאלה ב-`influenceNextQuestions` קיימת
3. **מניעת לולאות**: שום שאלה לא מפנה לשאלה קודמת
4. **נתונים מלאים**: `extractEquipmentFromAnswers` מטפל בכל התשובות

---

**ניקוי אחרון**: 2025-08-14 | **מחק אחרי**: שינוי מערכת שאלון או מעבר לפתרון אחר
