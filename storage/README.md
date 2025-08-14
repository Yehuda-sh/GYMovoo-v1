# Local Storage Server [DEPRECATED]

⚠️ **שרת מקומי זה הוחלף ב-Supabase** - תיעוד היסטורי בלבד

שרת מקומי שהיה משמש לניהול משתמשים (CRUD) עם אחסון JSON, לפני המעבר ל-Supabase.

## המצב הנוכחי - אוגוסט 2025

✅ **Supabase הוא מקור האמת**  
✅ **users.json נמחק** - כל נתוני המשתמשים ב-Supabase  
✅ **AsyncStorage משמש כ-cache בלבד**  
❌ **השרת המקומי לא בשימוש יותר**

## הרצה [לא רלוונטי]

- התקנת תלות (פעם ראשונה):
  - npm i express cors
  - אופציונלי לפיתוח חם: npm i -D nodemon
- הרצה:
  - npm run storage:start
  - לפיתוח: npm run storage:start:dev

ברירת מחדל: מאזין על http://localhost:3001

- ניתן לשנות פורט עם משתנה סביבה `PORT`.
- אמולטור אנדרואיד: הלקוח צריך לפנות ל-`http://10.0.2.2:3001` (מיפוי localhost).

לקוח (Expo/React Native): יש להגדיר משתנה סביבה

- `EXPO_PUBLIC_STORAGE_BASE_URL` – חובה. לדוגמה:
  - Windows/Pwsh (סשן נוכחי): `$env:EXPO_PUBLIC_STORAGE_BASE_URL="http://10.0.2.2:3001"`

## REST API

- GET /health
- GET /users
- GET /users/:id
- GET /users/by-email/:email
- POST /users { name, email, ... }
- PUT /users/:id { ...updates }
- DELETE /users/:id

אימונים למשתמש (Workouts):

- GET /users/:id/workouts
- POST /users/:id/workouts { ...workout }
- DELETE /users/:id/workouts/:wid

קבצי נתונים נשמרים תחת:

- ~~`storage/db/users.json`~~ - **נמחק - הועבר ל-Supabase** ✅
- `storage/db/workouts.json` - **עדיין מקומי** (לעדכון עתידי)

מדיניות ומקור אמת (מעודכן):

- **Supabase PostgreSQL הוא מקור האמת** עבור נתוני משתמשים
- **userStore.ts מסונכרן אוטומטית** עם Supabase via scheduleServerSync
- **AsyncStorage כ-cache בלבד** - לא מקור אמת
- **שמות שדות PostgreSQL**: lowercase (smartquestionnairedata, activityhistory)
- XP בסיסי: מנוהל ב-Supabase triggers/functions

## הערות מיגרציה ולקחים

✅ **המיגרציה הושלמה בהצלחה** (אוגוסט 2025):

- כל נתוני המשתמשים הועברו ל-Supabase PostgreSQL
- workoutApi.ts מותאם לשדות Supabase (activityhistory במקום workouthistory)
- userStore מסונכרן אוטומטית עם הענן
- שמירה על mocks/demo data לפיתוח

🔧 **לקחים טכניים**:

- PostgreSQL דורש lowercase field names
- AsyncStorage רק לcaching - לא לlogic
- Supabase REST API מהיר ויציב
- auto-sync מונע data inconsistency
