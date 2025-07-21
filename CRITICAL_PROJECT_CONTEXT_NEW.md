// CRITICAL_PROJECT_CONTEXT_NEW.md
🔵 GYMovoo: מדריך עבודה לפיתוח עם AI
גרסה 5.0 - עדכון אחרון: 21.07.2025

מבוא לכלי ה-AI
מסמך זה הוא מקור האמת היחיד (Single Source of Truth) לפיתוח פרויקט GYMovoo. עליך לפעול אך ורק לפי ההנחיות, המבנה והסטנדרטים המוגדרים כאן. קרא והפנם את כל הסעיפים לפני התחלת העבודה.

📜 1. כללי הזהב (הנחיות קריטיות)
🌍 כלל #1: התאמה מלאה לימין-לשמאל (RTL) - חובה!
זוהי ההנחיה החשובה ביותר בפרויקט. האפליקציה מיועדת לקהל דובר עברית.

פריסה (Layout): השתמש ב-flexDirection: 'row-reverse'.

טקסט: יש ליישר לימין (textAlign: 'right').

מיקום אלמנטים: כפתורי פעולה בצד שמאל, תוכן ראשי בצד ימין.

אייקונים: חץ "אחורה" יפנה ימינה (chevron-forward).

⚠️ אזהרה: קבצים רבים בפרויקט עדיין אינם מיושרים לסטנדרט זה. בכל פעם שאתה עורך קובץ, באחריותך לוודא ולתקן את התאמתו המלאה ל-RTL.

📋 כלל #2: תהליך עבודה ותקשורת
אני שולח קוד: אני (המשתמש) אשלח קובץ מלא או קטע קוד.

אתה מחזיר קוד מלא: אתה (ה-AI) תמיד תחזיר את הקובץ המלא והמתוקן להעתק-הדבק ישיר.

אני מריץ ובודק: אני אשלח את כל השגיאות והאזהרות מהטרמינל.

אתה מתקן: אתה תנתח את השגיאות ותחזיר קובץ מתוקן.

בקשת קבצים קשורים: אם שגיאה בקובץ A קשורה לקובץ B (למשל, props חסרים), עליך לבקש ממני במפורש לשלוח גם את קובץ B כדי לקבל הקשר מלא.

🎨 כלל #3: שימוש ב-Design System בלבד
אסור להשתמש בערכי צבע (hex) או גדלים ישירות בקוד. יש להשתמש אך ורק במשתנים מקובץ theme.ts.

🚀 כלל #4: פקודות Git בסיום כל Checkpoint
בסיום כל checkpoint, יסופק בלוק קוד עם פקודות Git מותאמות לטרמינל PowerShell ב-VS Code על Windows 11.

✍️ 2. סטנדרט תיעוד בראש כל קובץ
כל קובץ קומפוננטה, hook או שירות יתחיל עם בלוק התיעוד הבא. זה קריטי להבנת ההקשר.

/\*\*

- @file [הנתיב המלא לקובץ, למשל: src/screens/workout/components/ExerciseCard.tsx]
- @brief [תקציר במשפט אחד: מה הרכיב הזה עושה? למשל: "כרטיס תרגיל המציג סטים ופעולות."]
- @dependencies [על אילו רכיבים/קבצים אחרים הוא מסתמך? למשל: "SetRow, ExerciseMenu"]
- @notes [הערות מיוחדות: למשל: "מכיל לוגיקת אנימציה מורכבת לפתיחה וסגירה."]
- @recurring_errors [שגיאות נפוצות בקובץ זה שיש לשים לב אליהן, למשל: "שכחה להעביר את ה-prop isPaused ל-RestTimer"]
  \*/

🛠️ 3. טכנולוגיות וסגנון קוד
Tech Stack: React Native, Expo, TypeScript, Zustand, React Navigation, AsyncStorage.

UI Library: רכיבים מותאמים אישית בלבד.

Code Style:

שפה: קוד באנגלית.

הערות: תמיד דו-לשוניות (עברית ואז אנגלית).

TypeScript: אסור להשתמש ב-any.

קומפוננטות: פונקציונליות בלבד, עם פירוק של רכיבים מורכבים.

🤖 4. מצבי עבודה עם AI
ישנם שני מצבי עבודה אפשריים, בהתאם ליכולות שלך:

א. מצב קבצים בודדים (File-by-File):

זוהי ברירת המחדל.

ההקשר שלך מבוסס אך ורק על הקבצים שאני שולח בשיחה הנוכחית.

עליך להקפיד על כלל #2, סעיף 5 ולבקש קבצים נוספים בעת הצורך.

ב. מצב סריקת פרויקט מלא (Full Repo Context):

אם יש לך גישה לסרוק את כל מאגר ה-GitHub של הפרויקט, הודע לי על כך.

במצב זה, באחריותך לסרוק את הקבצים הרלוונטיים כדי להבין את הקשרים ביניהם ולמנוע שגיאות props או import.

גם במצב זה, התשובות שלך יתמקדו רק בקבצים שביקשתי לערוך.
כלל #5: עבודה עם AI בעל יכולת סריקת פרויקט (כמו Claude)
ההקשר אינו מתעדכן בזמן אמת: ה-AI עובד עם "תמונת מצב" של הפרויקט. הוא אינו סורק שינויים באופן אוטומטי.

חובת סנכרון ידני: לאחר ביצוע git push עם שינויים משמעותיים, באחריותי (המשתמש) להיכנס להגדרות הפרויקט ב-AI ולבצע סנכרון מחדש (Re-sync) של המאגר.

סדר פעולות: קודם git push ← אחר כך סנכרון ידני ב-AI ← ורק אז התחלת שיחה חדשה על הקוד המעודכן.

🌐 Appendix: English Version
This document is the Single Source of Truth for the GYMovoo project.

Rule #1: Full RTL Compliance is Mandatory. Layouts (flexDirection: 'row-reverse'), text (textAlign: 'right'), and element positioning (actions left, content right) must be adapted for Hebrew.

Rule #2: Workflow Protocol. I send code -> You return full, copy-paste ready code -> I test and send errors -> You fix. You must ask for related files if needed to solve an error.

Rule #3: Use the Design System Exclusively. No hardcoded values. Use variables from theme.ts only.

Rule #4: Git Commands Post-Checkpoint. At the end of each checkpoint, a code block with Git commands will be provided, tailored for the PowerShell terminal in VS Code on Windows 11.

File Headers: Every component/hook/service file must start with the standardized documentation block.
