# 🛠️ הנחיות פיתוח - GYMovoo

## פקודות פיתוח עיקריות

### הפעלת האפליקציה

```bash
# הפקודה הסטנדרטית להפעלת Expo (מומלצת)
npx expo start

# או באמצעות npm script
npm start

# הפעלה עם development build
npm run start:dev-client
```

### פקודות נוספות

```bash
# הפעלה על Android
npm run android

# הפעלה על iOS
npm run ios

# הפעלה ברשת
npm run web

# בדיקת איכות קוד
npm run check:all
```

## 📝 הערות חשובות

- **תמיד השתמש ב-`npx expo start`** - זוהי הפקודה הסטנדרטית של Expo
- פקודת `npm start` מוגדרת עכשיו לקרוא ל-`npx expo start`
- אם אתה צריך development build, השתמש ב-`npm run start:dev-client`

## 🏗️ מבנה הפרויקט

```
src/
├── components/     # קומפוננטים נלמשמשים
├── screens/        # מסכי האפליקציה
├── services/       # שירותים וBusinessצ Logic
├── data/          # מאגרי נתונים
├── navigation/    # ניווט
├── hooks/         # Custom Hooks
├── stores/        # State Management
├── styles/        # עיצוב גלובלי
└── utils/         # כלי עזר
```

## 🔧 הגדרות פיתוח

### VS Code Extensions מומלצות

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- TypeScript Importer
- React Native Tools

### הגדרות ESLint וPrettier

הפרויקט מגיע עם הגדרות ESLint ו-Prettier מוכנות מראש.
