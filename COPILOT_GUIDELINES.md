# GitHub Copilot - הנחיות עבודה לפרויקט GYMovoo

## 🚫 פקודות טרמינל אסורות

- **לעולם לא לשלוח פקודות `timeout`** או פקודות המתנה אחרות
- אלה פקודות פנימיות שלא נחוצות למשתמש

## ✅ כללי עבודה עם טרמינל

- לשלוח **רק פקודות שהמשתמש מבקש באופן מפורש**
- לשלוח רק פקודות **הנחוצות באמת לפרויקט** (build, start, install וכו')
- **לחכות שהמשתמש יבקש restart לטרמינל** - לא לעשות זאת באופן אוטומטי

## 🎯 עקרונות כלליים

- לשאול לפני ביצוע פעולות שאינן מוגדרות בבירור
- לתת הסברים קצרים ולעניין
- לעבוד בשיתוף עם המשתמש, לא במקומו

## 📱 מידע על הפרויקט

- **שם הפרויקט:** GYMovoo - אפליקציית כושר בעברית
- **טכנולוגיות:** React Native + Expo
- **אינטגרציה:** WGER API לתרגילי כושר באנגלית + בסיס נתונים מקומי בעברית (131 תרגילים)
- **מטרה:** לספק תוכניות אימון מותאמות אישית עם מערכת AI חכמה
- **מצב נוכחי:** 22 מסכים מחוברים, 6 קטגוריות רכיבים, 5 שירותים פעילים

## 🔧 הערות טכניות חשובות

- **הפעלת הפרויקט:** השתמש ב-`npx expo start` (לא `npm run start`)
- **מאגר תרגילים:** 131 תרגילים מקומיים בעברית + תרגילי WGER באנגלית
- **WGER Integration:** עובד עם wgerService.ts (לא wgerApiService.ts)
- **מטרו:** זקוק לפעמים לניקוי cache עם `--clear --reset-cache`
- **RTL Support:** תמיכה בעברית עם בעיות RTL שנפתרו

## 🏗️ ארכיטקטורה מרכזית

- **ניווט:** AppNavigator.tsx (Stack) + BottomNavigation.tsx (Tabs)
- **AI System:** workoutDataService.ts עם אלגוריתם חכם לבחירת תרגילים
- **שאלון:** מערכת דו-שלבית עם 3 קבצי נתונים (questionnaireData.ts, twoStageQuestionnaireData.ts, simplifiedQuestionnaireData.ts)
- **Hook מרכזי:** useWgerExercises.ts למשיכת תרגילים מ-WGER

## ⚠️ בעיות ידועות וטעויות נפוצות

- **אל תשתמש ב-`npm run start`** - השתמש ב-`npx expo start`
- שים לב לקונפליקטים בין wgerService.ts ו-wgerApiService.ts
- מעבר אוטומטי מהיר בשאלון (תוקן ל-800ms)
- יש 3 קבצי שאלון שונים - שים לב לעקביות

## 🚨 לקחים קריטיים מהפרויקט

- **RTL:** לא רק `textAlign: 'right'` - גם `flexDirection: 'row-reverse'` ו-`chevron-forward`
- **עיצוב:** אין ערכים קשיחים - רק מ-theme.ts
- **FlatList:** לעולם לא לקנן בתוך ScrollView
- **ייבוא:** רק imports יחסיים (./) - לא מוחלטים
- **אייקונים:** תמיד MaterialCommunityIcons ומותאמים RTL
- **הערות:** תמיד דו-לשוניות (עברית + אנגלית)
- **קבצים:** מקסימום 500 שורות - לפצל לcomponents/hooks/utils
- **ניווט:** כל route חדש = 3 עדכונים (screen + types.ts + AppNavigator.tsx)
- **בדיקות:** להריץ תמיד לפני commit: checkNavigation.js, checkMissingComponents.js, projectHealthCheck.js

## 📝 כללי תיעוד חובה

- כל קובץ מתחיל ב-Header תיעוד:

```typescript
/**
 * @file [נתיב מלא]
 * @brief [מה עושה]
 * @dependencies [תלויות עיקריות]
 * @notes [הערות מיוחדות]
 * @recurring_errors [שגיאות נפוצות]
 */
```

- הערות בקוד תמיד דו-לשוניות
- אין שימוש ב-any בTypeScript
- כל קומפוננטה פונקציונלית בלבד

---

_קובץ זה נועד להבטיח עבודה חלקה ויעילה בין GitHub Copilot למשתמש_
