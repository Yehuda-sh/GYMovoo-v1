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
- **מצב נוכחי:** 22+ מסכים מחוברים, 6+ קטגוריות רכיבים, 13+ שירותים פעילים

## 🔧 הערות טכניות חשובות

- **הפעלת הפרויקט:** השתמש ב-`npx expo start` (לא `npm run start`)
- **מאגר תרגילים:** 131 תרגילים מקומיים בעברית + תרגילי WGER באנגלית
- **WGER Integration:** עובד עם wgerService.ts (לא wgerApiService.ts)
- **מטרו:** זקוק לפעמים לניקוי cache עם `--clear --reset-cache`
- **RTL Support:** תמיכה מלאה בעברית עם תיקוני RTL מקיפים
- **מערכת שאלון:** 7 שאלות דינמיות עם התאמת מגדר ותמיכת RTL מלאה

## 🌍 תמיכת RTL והתאמת מגדר

### עקרונות חשובים:

- **כל הטקסטים בעברית:** `textAlign: "right"` + `writingDirection: "rtl"`
- **סימני בחירה:** תמיד בצד ימין (`right: theme.spacing.md`)
- **ריווחים:** `paddingRight` במקום `paddingLeft` לאלמנטים עבריים
- **התאמת מגדר:** שאלה ראשונה קובעת את התאמת כל השאלון
- **נייטרליות:** טקסטים קבועים נוסחו בצורה נייטרלית

### פונקציות מרכזיות:

```typescript
// התאמת טקסט לפי מגדר
adaptTextToGender(text: string, gender: string): string

// התאמת אפשרויות מלאה
adaptOptionToGender(option: SmartOption, gender: string): SmartOption
```

## 🏗️ ארכיטקטורה מרכזית

- **ניווט:** AppNavigator.tsx (Stack) + BottomNavigation.tsx (Tabs)
- **AI System:** workoutDataService.ts עם אלגוריתם חכם לבחירת תרגילים
- **שאלון חכם:** SmartQuestionnaireManager עם 7 שאלות דינמיות + התאמת מגדר
- **Hook מרכזי:** useWgerExercises.ts למשיכת תרגילים מ-WGER
- **מאגר ציוד:** 100+ פריטי ציוד עם קטגוריזציה חכמה

## ⚠️ בעיות ידועות וטעויות נפוצות

- **אל תשתמש ב-`npm run start`** - השתמש ב-`npx expo start`
- שים לב לקונפליקטים בין wgerService.ts ו-wgerApiService.ts
- **RTL חובה:** כל טקסט עברי חייב `textAlign: "right"` + `writingDirection: "rtl"`
- **מגדר:** שאלת מגדר תמיד ראשונה, ואחריה התאמה דינמית
- יש מספר קבצי שאלון - השתמש ב-smartQuestionnaireData.ts החדש

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
