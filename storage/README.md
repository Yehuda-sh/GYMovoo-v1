# Local Storage Server

שרת מקומי לניהול משתמשים (CRUD) עם אחסון JSON, כהכנה למיגרציה עתידית ל-Supabase/DB אמיתי.

## הרצה

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

- `storage/db/users.json`
- `storage/db/workouts.json`

מדיניות ומקור אמת:

- השרת הוא מקור האמת. צד הלקוח משתמש ב-AsyncStorage כ-cache בלבד.
- XP בסיסי על השלמת שאלון: השרת מעניק +120 XP בעת יצירה/עדכון כשקיים `smartQuestionnaireData.completedAt`.
- אימות XP בקריאה: ב-GET השרת מבטיח לפחות 120 XP למי שהשלים שאלון (אידמפוטנטי).

## הערות מיגרציה

- שמרו על מבנה תשובות ונתיבי ה-API – מעבר ל-Supabase יוכל למפות endpoints לאותם חוזים.
