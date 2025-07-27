# GYMovoo 💪

> אפליקציית כושר חכמה המייצרת תוכניות אימון אישיות בהתאם לרמת הכושר, היעדים והציוד הזמין לכל משתמש.

[English](#english) | [עברית](#hebrew)

<div id="hebrew">

## 📱 סקירה כללית

**GYMovoo** היא אפליקציית React Native חדשנית המעניקה לכל מתאמן תוכנית אימון מותאמת אישית. האפליקציה בנויה עם ממשק משתמש מודרני ואינטואיטיבי, תומכת במלואה בעברית (RTL), ומציעה חוויית אימון חלקה ויעילה.

### ✨ תכונות עיקריות

- 📋 **שאלון אישי חכם** - בניית פרופיל אימון מותאם אישית
- 🎯 **תוכניות אימון מותאמות** - על בסיס מטרות, ניסיון וציוד זמין
- ⏱️ **מעקב אימונים בזמן אמת** - טיימר, מעקב סטים ומשקלים
- 📊 **דשבורד מתקדם** - סטטיסטיקות, היסטוריה ומעקב התקדמות
- 🛠️ **תצוגת ציוד אישי** - הצגת הציוד הזמין בפרופיל המשתמש
- 🌙 **מצב כהה/בהיר** - תמיכה מלאה בשני המצבים
- 🔄 **סנכרון ענן** - גיבוי ושחזור נתונים אוטומטי
- 🏋️ **מאגר תרגילים עשיר** - מעל 100 תרגילים עם הדרכות
- 📱 **ממשק RTL מלא** - תמיכה מלאה בעברית

## 🚀 התחלה מהירה

### דרישות מקדימות

- Node.js (גרסה 18 ומעלה)
- npm או yarn
- Expo CLI
- Expo Go app (לבדיקה במכשיר)

### התקנה

```bash
# שכפל את הפרויקט
git clone https://github.com/yourusername/gymovoo.git

# היכנס לתיקיית הפרויקט
cd gymovoo

# התקן את החבילות
npm install
# או
yarn install

# הפעל את האפליקציה
npx expo start
```

### הרצה במכשיר

1. הורד את אפליקציית **Expo Go** מה-App Store או Google Play
2. סרוק את ה-QR code שמופיע בטרמינל
3. האפליקציה תיפתח במכשירך

## 🏗️ ארכיטקטורה

### מבנה התיקיות

```
GYMovoo/
├── app/                      # נקודת כניסה ראשית
├── src/
│   ├── screens/             # מסכי האפליקציה
│   │   ├── welcome/         # מסך פתיחה
│   │   ├── auth/           # מסכי הרשמה והתחברות
│   │   ├── questionnaire/  # שאלון אישי
│   │   ├── main/           # מסך ראשי ודשבורד
│   │   ├── workout/        # מסכי אימון
│   │   ├── exercise/       # רשימת תרגילים
│   │   └── profile/        # פרופיל משתמש
│   ├── components/         # רכיבים משותפים
│   │   ├── common/         # רכיבי UI בסיסיים
│   │   ├── forms/          # רכיבי טפסים
│   │   └── workout/        # רכיבי אימון
│   ├── stores/             # ניהול State (Zustand)
│   ├── services/           # שירותים ו-API
│   ├── hooks/              # React Hooks מותאמים
│   ├── utils/              # פונקציות עזר
│   ├── styles/             # עיצוב וסגנונות
│   └── types/              # TypeScript types
├── assets/                 # משאבים (תמונות, פונטים)
└── docs/                   # תיעוד

```

### טכנולוגיות עיקריות

- **React Native** - פיתוח cross-platform
- **Expo SDK** - כלי פיתוח ובנייה
- **TypeScript** - Type safety וקוד איכותי
- **Zustand** - ניהול state פשוט ויעיל
- **React Navigation** - ניווט בין מסכים
- **AsyncStorage** - אחסון מקומי
- **React Hook Form** - ניהול טפסים
- **Linear Gradient** - אפקטים ויזואליים

## 📱 מסכים עיקריים

### 1. מסך פתיחה (Welcome)

- הצגת לוגו ומידע על האפליקציה
- כפתורי התחברות והרשמה
- מונה משתמשים פעילים

### 2. הרשמה והתחברות (Auth)

- טופס הרשמה עם אימות
- התחברות עם אימייל/סיסמה
- התחברות עם Google
- שחזור סיסמה

### 3. שאלון אישי (Questionnaire)

- פרטים אישיים (גיל, משקל, גובה)
- רמת כושר נוכחית
- מטרות אימון
- ציוד זמין
- העדפות אימון

### 4. מסך ראשי (Dashboard)

- סטטיסטיקות אימון
- התקדמות שבועית/חודשית
- תוכניות אימון מומלצות
- גישה מהירה לאימון

### 5. אימון פעיל (Active Workout)

- רשימת תרגילים לביצוע
- טיימר ומעקב סטים
- רישום משקלים וחזרות
- מעבר בין תרגילים
- סיכום אימון

### 6. פרופיל משתמש (Profile)

- פרטים אישיים ואווטר מותאם
- תצוגת הציוד הזמין שנבחר בשאלון
- הישגים וסטטיסטיקות אימון
- היסטוריית אימונים
- הגדרות אפליקציה
- יצוא/ייבוא נתונים

## 🛠️ כלי בדיקה ופיתוח

הפרויקט כולל מספר כלי בדיקה שימושיים:

### כלי בדיקה בסיסיים:

- `npm run check:health` - בדיקת בריאות הפרויקט
- `npm run check:navigation` - בדיקת מערכת הניווט
- `npm run check:components` - בדיקת רכיבים חסרים
- `npm run check:data-flow` - בדיקת זרימת נתונים

### כלי בדיקה מתקדמים:

- `npm run check:quality` - בדיקת איכות קוד (קבצים גדולים, משתנים לא בשימוש, complexity)
- `npm run check:performance` - בדיקת ביצועים (bundle size, inline objects, re-renders)
- `npm run check:security` - בדיקת אבטחה (sensitive data, dependencies vulnerabilities)
- `npm run check:accessibility` - בדיקת נגישות (accessibility labels, color contrast, touch targets)

### כלי בדיקה נוספים:

- `npm run lint` - בדיקה ותיקון ESLint
- `npm run type-check` - בדיקת TypeScript
- `npm run audit` - בדיקת אבטחה של dependencies
- `npm run check:all` - הרצת כל הבדיקות המתקדמות

## 🎨 עיצוב וסגנון

### Design System

האפליקציה משתמשת ב-Design System מובנה הכולל:

- **צבעים** - פלטת צבעים עקבית
- **טיפוגרפיה** - גדלי פונט והיררכיה ברורה
- **רכיבים** - רכיבי UI מוכנים לשימוש חוזר
- **צללים** - 3 רמות צללים (קל, בינוני, חזק)
- **מרווחים** - מערכת spacing עקבית
- **אנימציות** - מעברים חלקים

### RTL Support

תמיכה מלאה בעברית:

- כל הטקסטים מיושרים לימין
- פריסות עם `flexDirection: 'row-reverse'`
- אייקונים מותאמים לכיוון RTL
- מיקום נכון של כפתורי פעולה

## 🔧 פיתוח

### סקריפטים זמינים

```bash
# הרצת האפליקציה
npm start

# הרצה ב-iOS
npm run ios

# הרצה ב-Android
npm run android

# בדיקות
npm test

# בניית APK
eas build -p android

# בניית IPA
eas build -p ios
```

### הוספת תכונה חדשה

1. צור branch חדש: `git checkout -b feature/your-feature`
2. פתח את התכונה תוך שמירה על הסטנדרטים
3. הוסף בדיקות אם רלוונטי
4. צור Pull Request עם תיאור מפורט

### כללי קוד

- TypeScript לכל הקוד החדש
- תיעוד דו-לשוני (עברית/אנגלית)
- שימוש ב-theme בלבד לצבעים וגדלים
- RTL compliance לכל רכיב חדש
- שמות משתנים ופונקציות באנגלית

## 📄 רישיון

פרויקט זה מוגן תחת רישיון MIT - ראה קובץ [LICENSE](LICENSE) לפרטים.

## 🤝 תרומה לפרויקט

נשמח לקבל תרומות! אנא קרא את [CONTRIBUTING.md](CONTRIBUTING.md) לפני שליחת Pull Request.

## 📞 יצירת קשר

- אתר: [www.gymovoo.com](https://www.gymovoo.com)
- אימייל: support@gymovoo.com
- GitHub: [@gymovoo](https://github.com/gymovoo)

</div>

---

<div id="english">

## 📱 Overview

**GYMovoo** is an innovative React Native application that provides personalized workout plans for every fitness enthusiast. Built with a modern and intuitive UI, full Hebrew (RTL) support, and a smooth training experience.

### ✨ Key Features

- 📋 **Smart Personal Questionnaire** - Build a custom training profile
- 🎯 **Personalized Workout Plans** - Based on goals, experience, and available equipment
- ⏱️ **Real-time Workout Tracking** - Timer, sets, and weight tracking
- 📊 **Advanced Dashboard** - Statistics, history, and progress tracking
- 🌙 **Dark/Light Mode** - Full support for both themes
- 🔄 **Cloud Sync** - Automatic backup and restore
- 🏋️ **Rich Exercise Database** - Over 100 exercises with instructions
- 📱 **Full RTL Interface** - Complete Hebrew support

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18+)
- npm or yarn
- Expo CLI
- Expo Go app (for device testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gymovoo.git

# Navigate to project directory
cd gymovoo

# Install dependencies
npm install
# or
yarn install

# Start the application
npx expo start
```

### Running on Device

1. Download **Expo Go** from App Store or Google Play
2. Scan the QR code displayed in terminal
3. The app will open on your device

## 🏗️ Architecture

### Technology Stack

- **React Native** - Cross-platform development
- **Expo SDK** - Development and build tools
- **TypeScript** - Type safety and code quality
- **Zustand** - Simple and efficient state management
- **React Navigation** - Screen navigation
- **AsyncStorage** - Local storage
- **React Hook Form** - Form management
- **Linear Gradient** - Visual effects

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a Pull Request.

## 📞 Contact

- Website: [www.gymovoo.com](https://www.gymovoo.com)
- Email: support@gymovoo.com
- GitHub: [@gymovoo](https://github.com/gymovoo)

</div>

---

<p align="center">Made with ❤️ by the GYMovoo Team</p>
