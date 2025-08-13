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

## REST API

- GET /health
- GET /users
- GET /users/:id
- GET /users/by-email/:email
- POST /users { name, email, ... }
- PUT /users/:id { ...updates }
- DELETE /users/:id

קבצי נתונים נשמרים תחת storage/db/users.json

## הערות מיגרציה

- שמרו על מבנה תשובות ונתיבי ה-API – מעבר ל-Supabase יוכל למפות endpoints לאותם חוזים.
