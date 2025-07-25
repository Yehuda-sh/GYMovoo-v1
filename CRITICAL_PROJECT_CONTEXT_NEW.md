/\*\*

- @file GYMovoo/docs/CRITICAL_PROJECT_CONTEXT_NEW.md
- @brief חוקי הברזל, סטנדרטים והלקחים של פרויקט GYMovoo | Iron Rules, Standards & Lessons for GYMovoo Project
- @dependencies theme.ts, theme.components, Zustand, Expo, React Navigation, TypeScript
- @notes כל עדכון דורש סנכרון גם לכלי ה-AI ולעדכן גרסה במאגר.
- @recurring_errors חובה לקרוא סעיף "לקחים חוזרים" לפני כל שינוי קוד!
  \*/

# 🏋️‍♂️ GYMovoo – חוקי ברזל וסטנדרטים לפיתוח

## 1. 🟦 כללי זהב (עברית)

- כל מסך/קומפוננטה חייבים לתמוך RTL מלא (flexDirection: 'row-reverse', textAlign: 'right', אייקונים/כפתורים לכיוון ימין).
- אסור להשתמש בערכי עיצוב/צבע/גודל קשיחים – הכל מ-theme.ts ו-theme.components בלבד.
- ייבוא יחסי בלבד (./) – לא src/...
- אין שימוש ב-any ב-TypeScript – כל טיפוס ו-prop חייב להיות מוגדר במדויק.
- כל שינוי ב-prop או interface – לעדכן בכל הממשקים/קבצים התלויים.
- אין להשאיר קבצים מעל 500 שורות – חובה לפצל ל-components, hooks, utils.
- אין לקנן FlatList בתוך ScrollView – רק FlatList כרכיב ראשי.
- להעדיף פשטות על פני אפקטים, להוסיף גרדיאנט/אנימציה רק בדרישה אמיתית.
- תיעוד דו-לשוני (עברית + אנגלית) בכל קובץ/פונקציה.
- אייקונים/חצים מתואמים RTL (chevron-forward לימין).
- כל UI/פיצ'ר חדש – לעדכן theme לפני שמיישמים.
- מיילים/שמות משתמש באנגלית בלבד, ASCII בלבד.
- לפני merge: לנקות לוגים, קוד דיבוג, וקוד מת.

---

## 1.1 🟦 Golden Rules (English)

- Every screen/component must fully support RTL: flexDirection: 'row-reverse', textAlign: 'right', all icons/buttons point right.
- No hardcoded color/size/style values – use theme.ts and theme.components only.
- Relative imports only (./) – never use src/...
- No `any` in TypeScript – every type/prop must be strictly typed.
- Any prop/interface change must update all dependent interfaces/files.
- No files above 500 lines – always split into components, hooks, utils.
- Never nest FlatList inside ScrollView – FlatList is the main scrolling component.
- Prefer simplicity over effects; add gradients/animations only on real demand.
- Bilingual documentation (Hebrew + English) in every file/function.
- Icons/arrows always match RTL (chevron-forward to the right).
- Any new UI/feature – update theme before use.
- Emails/usernames in English only, ASCII only.
- Before merge: remove logs, debug code, and dead code.

---

## 2. 🟩 סטנדרטים של תיעוד (עברית)

- כל קובץ פותח ב-Header תיעוד:
  /\*\*

* @file [נתיב מלא]
* @brief [מה עושה]
* @dependencies [תלויות עיקריות]
* @notes [הערות מיוחדות]
* @recurring_errors [שגיאות נפוצות]
  \*/

- הערות בקוד – תמיד דו-לשוני (עברית ואז אנגלית).
- אין שימוש ב-any.
- כל קומפוננטה – פונקציונלית בלבד.

---

## 2.1 🟩 Documentation Standards (English)

- Every file starts with a documentation header:
  /\*\*

* @file [Full Path]
* @brief [Purpose]
* @dependencies [Main dependencies]
* @notes [Special notes]
* @recurring_errors [Common errors]
  \*/

- Comments always bilingual (Hebrew first, then English).
- No use of any.
- All components functional only.

---

## 3. 🎨 עיצוב ו-UI (עברית)

- שימוש ב-theme.components (גרסה 5.1+).
- קצוות עגולים (borderRadius: 16) בכל הכרטיסים/רכיבים.
- עיצוב כרטיס (Card) עם מסגרת וצל (theme.components.card).
- כפתור ראשי/משני – מהtheme.
- spacing רק מה-theme.
- אייקונים – MaterialCommunityIcons בלבד.
- שינוי עיצוב – רק דרך theme.

---

## 3.1 🎨 UI & Design (English)

- Use theme.components (v5.1+).
- Rounded corners (borderRadius: 16) for all cards/components.
- Card design with border and shadow (theme.components.card).
- Primary/secondary buttons – from theme.
- Spacing from theme only.
- Icons – MaterialCommunityIcons only.
- Any design change – update theme first.

---

## 4. 🗂️ ארגון קוד ונתונים (עברית)

- כל קובץ data (שאלות, אופציות) בנפרד מהקומפוננטות.
- פונקציות עזר – בתיקיית utils/helpers/data.
- imports יחסיים בלבד.
- שמות קבצים:
  - רכיבים – kebab-case
  - data – snake_case
  - תיקיות – PascalCase

---

## 4.1 🗂️ Code & Data Organization (English)

- All data files (questions, options) separated from components.
- Helpers in utils/helpers/data.
- Relative imports only.
- File names:
  - Components – kebab-case
  - Data – snake_case
  - Folders – PascalCase

---

## 5. 🎯 UX וחוויית משתמש (עברית)

- שאלון דינמי – כל שאלה בהתאם לתשובות.
- אין מסך (מלבד אימון) עם גלילה.
- כפתורי פעולה תמיד גלויים גם במסך קטן.
- ברירות מחדל חכמות בכל שדה.
- משוב מיידי למשתמש (הצלחה/שגיאה).

---

## 5.1 🎯 UX & User Experience (English)

- Dynamic questionnaire – each question adapts to answers.
- No screen (except workout) should require scrolling.
- Action buttons always visible, even on small screens.
- Smart defaults for every field.
- Immediate feedback to user (success/error).

---

## 6. 🧪 בדיקות לפני הגשה (עברית)

- בדוק RTL מלא, שימוש ב-theme, Header תיעוד, הערות דו-לשוניות, עיצוב כ-Workout, theme.components.
- שינוי ב-data – לעדכן גם בקובצי עזר.

---

## 6.1 🧪 Pre-submission QA (English)

- Test full RTL, theme usage, doc headers, bilingual comments, workout-style design, theme.components everywhere.
- Data changes – update helpers as well.

---

## 7. 🟧 כללים נוספים (עברית)

- מותר לשלוח פונקציה/קטע קטן עם מספרי שורות – בתנאי שאח"כ שולחים קובץ מלא.
- כל פיצ׳ר – checkpoint עם סיכום ופקודות git.
- טיפוס מדויק ב-TS, שימוש ב-env רק לסודות.
- חיפוש תלות גלובלי לפני merge.
- אין any, אין קוד ישן.

---

## 7.1 🟧 Additional Rules (English)

- You may send a small function/patch with line numbers – but must send a full file for approval after.
- Each feature – checkpoint with summary and git commands.
- Precise TypeScript typing, use env for secrets only.
- Global dependency search before merge.
- No any, no legacy code.

---

## 📚 לקחים חוזרים מהיומן – Recurring Lessons from Progress Log

### 1. RTL – לא רק textAlign

- בעיה: יושם רק textAlign: 'right', אך לא שונה flexDirection, אייקונים או חצים.
- פתרון: flexDirection: 'row-reverse' לכל רכיב רלוונטי + chevron-forward לימין.

#### Example:

```jsx
// ❌ Wrong
<View style={{ flexDirection: 'row' }}>
// ✅ Right
<View style={{ flexDirection: 'row-reverse' }}>
```

2. ערכי עיצוב קשיחים
   בעיה: שימוש ב-borderRadius/color קשיח.

פתרון: תמיד theme בלבד.
Example:
// ❌ Wrong
borderRadius: 20, backgroundColor: '#121212'
// ✅ Right
borderRadius: theme.radius.lg, backgroundColor: theme.colors.card 3. קינון FlatList ב-ScrollView
בעיה: ביצועים ירודים, אזהרות.

פתרון: FlatList כרכיב ראשי.

Example:
// ❌ Wrong
<ScrollView>
<FlatList ... />
</ScrollView>
// ✅ Right
<FlatList ListHeaderComponent={<Header />} ... /> 5. ייבוא לא עקבי
בעיה: import מוחלט/יחסי לא נכון.

פתרון: רק ./ imports.

Example:
// ❌ Wrong
import { X } from 'src/screens/workout/X';
// ✅ Right
import { X } from './X'; 6. אייקונים לא מותאמי RTL
בעיה: חץ/אייקון שמאלה.

פתרון: תמיד chevron-forward.

Example:
// ❌ Wrong
<MaterialCommunityIcons name="chevron-back" ... />
// ✅ Right
<MaterialCommunityIcons name="chevron-forward" ... /> 7. הערות לא דו-לשוניות
בעיה: הערה רק באנגלית או רק בעברית.

פתרון: תמיד דו-לשוני.

Example:
// ❌ Wrong
// Update user state
// ✅ Right
// עדכון מצב משתמש | Update user state 8. קבצים מונוליטיים
בעיה: קבצים של 1200 שורות, בלתי מתחזקים.

פתרון: פיצול תמידי ל-components, hooks, utils.
🔔 Reminder:
יש לקרוא מסמך זה לפני כל פיתוח/רפקטור ולסנכרן כל לקח/טעות חוזרת מיד בסעיף "לקחים חוזרים"!

---
