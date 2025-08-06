# מסכי אימות (Auth Screens) 🔐

## סקירה כללית

מסכי האימות מנהלים את תהליך ההתחברות, ההרשמה ואישור תנאים למשתמש.

## מסכים עיקריים

- **LoginScreen** (`src/screens/auth/LoginScreen.tsx`): טופס התחברות, ולידציה, ניווט להרשמה/שחזור סיסמה, טיפול בשגיאות.
- **RegisterScreen** (`src/screens/auth/RegisterScreen.tsx`): רישום משתמשים, ולידציה בזמן אמת, הצפנה, אישור תנאים.
- **TermsScreen** (`src/screens/auth/TermsScreen.tsx`): הצגת תנאי שימוש, אישור/ביטול, עדכון סטטוס.

## זרימת ניווט

```
WelcomeScreen → LoginScreen ⟷ RegisterScreen
                    ↓              ↓
                TermsScreen    SmartQuestionnaireScreen <!-- מיקום נכון: src/screens/questionnaire/SmartQuestionnaireScreen.tsx -->
                    ↓              ↓
            MainScreen         MainScreen
```

## אבטחה ופרטיות

- הצפנת סיסמאות (BCrypt)
- אחסון מאובטח (AsyncStorage מוצפן, Expo SecureStore)
- ולידציה קפדנית (Yup, React Hook Form)
- הגנה מפני SQL Injection/XSS
- לוגים מוצפנים לפעילות חריגה

## עיצוב ונגישות

- RTL מלא לכל הטקסטים
- שימוש ב-theme.ts לעיצוב אחיד
- אנימציות חלקות
- טיפול בשגיאות ידידותי
- תמיכה מלאה ב-accessibility

## טכנולוגיות

- React Native, TypeScript
- React Hook Form, Yup
- AsyncStorage, Expo SecureStore

## משימות עתידיות

- התחברות עם Google/Facebook
- אימות דו-שלבי (2FA)
- שחזור סיסמה ב-SMS
- ביומטריה (Face/Touch ID)
- SSO עם מערכות חיצוניות

---

**הערות:**

- שמור על קוד ותיעוד דו-לשוני.
- עדכן מסמך זה בכל שינוי משמעותי בזרימה, אבטחה או עיצוב.
- אם יש כפילויות/מידע לא רלוונטי – מיזג/קצר והשאר רק את הדגשים הקריטיים.
