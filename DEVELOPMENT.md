# 🛠️ הנחיות פיתוח - GYMovoo

> מדריך מהיר לפיתוח - לתיעוד מפורט ראה [`docs/`](./docs/) ו-[`CRITICAL_PROJECT_CONTEXT_NEW.md`](./CRITICAL_PROJECT_CONTEXT_NEW.md)

## פקודות פיתוח עיקריות

### הפעלת האפליקציה

```bash
# הפקודה הסטנדרטית
npx expo start

# עם ניקוי cache (אם יש בעיות)
npx expo start --clear
```

### פקודות נוספות

```bash
# פלטפורמות
npm run android
npm run ios
npm run web

# בדיקות חובה לפני commit
npm run check:all
node scripts/projectHealthCheck.js  # ציון 100/100 נדרש
node scripts/checkNavigation.js     # 0 שגיאות נדרש
```

## ⚡ עדכון אחרון (31/07/2025): איחוד מסכי האימון

### מה השתנה
- ❌ **נמחק:** `ActiveWorkoutScreen.tsx` (450+ שורות)
- ✅ **עודכן:** `QuickWorkoutScreen.tsx` → מסך אוניברסלי עם 3 מצבים

### מצבי הפעלה חדשים
```typescript
// QuickWorkoutScreen תומך ב-3 מצבים:
navigation.navigate("QuickWorkout", {
  mode: "full",              // מצב מלא (ברירת מחדל)
  mode: "single-exercise",   // מצב תרגיל יחיד
  mode: "view-only",         // מצב צפייה בלבד
});
```

## 🔗 תיעוד מפורט

| נושא | קובץ |
|------|------|
| חוקי זהב וסטנדרטים | [`CRITICAL_PROJECT_CONTEXT_NEW.md`](./CRITICAL_PROJECT_CONTEXT_NEW.md) |
| מדריך טכני מלא | [`docs/TECHNICAL_IMPLEMENTATION_GUIDE.md`](./docs/TECHNICAL_IMPLEMENTATION_GUIDE.md) |
| כללי פיתוח | [`docs/DEVELOPMENT_GUIDELINES.md`](./docs/DEVELOPMENT_GUIDELINES.md) |
| מבנה הפרוייקט | [`docs/PROJECT_MASTER_SUMMARY.md`](./docs/PROJECT_MASTER_SUMMARY.md) |
| מדריך ניווט | [`docs/NAVIGATION_GUIDE.md`](./docs/NAVIGATION_GUIDE.md) |

## ⚠️ כללים חובה

- **RTL חובה:** כל רכיב חדש חייב לתמוך ב-RTL מלא
- **Theme בלبד:** אין ערכים קשיחים - הכל מ-`theme.ts`
- **TypeScript מחמיר:** אין `any` - כל טיפוס מוגדר
- **תיעוד דו-לשוני:** עברית + אנגלית בכל קובץ

> 💡 **טיפ:** לפירוט מלא של כל הכללים, ראה [`CRITICAL_PROJECT_CONTEXT_NEW.md`](./CRITICAL_PROJECT_CONTEXT_NEW.md)
