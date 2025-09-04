```mermaid
flowchart TD
    Start([📱 אפליקציה נפתחת]) --> AppNav{AppNavigator<br/>בודק user}

    AppNav -->|אין user| Welcome([🏠 WelcomeScreen])
    AppNav -->|יש user| CheckComplete{getCompletionStatus<br/>isFullySetup?}

    CheckComplete -->|true| MainApp([🎯 MainApp])
    CheckComplete -->|false| Questionnaire([📋 Questionnaire])

    Welcome --> QuickCheck{Quick Login<br/>זמין?}
    QuickCheck -->|כן| QuickBtn[🚀 כפתור 'המשך כ...']
    QuickCheck -->|לא| RegularBtns[🔐 התחבר / הירשם]

    QuickBtn --> TryQuick[tryQuickLogin]
    TryQuick -->|הצלחה| SetUser1[setUser]
    TryQuick -->|כשלון| Error1[❌ הודעת שגיאה]

    RegularBtns --> Login([🔐 LoginScreen])
    RegularBtns --> Register([📝 RegisterScreen])

    Login --> LoginSuccess[התחברות מוצלחת]
    LoginSuccess --> HasQ{יש שאלון?}
    HasQ -->|כן| MainApp
    HasQ -->|לא| Questionnaire

    Register --> RegSuccess[הרשמה מוצלחת]
    RegSuccess --> Questionnaire

    SetUser1 --> WelcomeEffect[WelcomeScreen.useEffect]
    WelcomeEffect --> CheckComplete

    Questionnaire --> FillQ[מענה על שאלות]
    FillQ --> CompleteQ[השלמת שאלון]
    CompleteQ --> SaveData[setSmartQuestionnaireData]
    SaveData --> UpdateUser[updateUser]
    UpdateUser --> SaveServer[שמירה לשרת]
    SaveServer --> NavMain[navigation.navigate('MainApp')]
    NavMain --> MainApp

    MainApp --> UseApp[שימוש באפליקציה]
    UseApp --> Logout{התנתקות?}
    Logout -->|כן| ClearData[ניקוי נתונים]
    ClearData --> Welcome
    Logout -->|לא| UseApp

    Error1 --> Welcome

    style Welcome fill:#e1f5fe
    style MainApp fill:#e8f5e8
    style Questionnaire fill:#fff3e0
    style CheckComplete fill:#f3e5f5
    style QuickCheck fill:#f3e5f5
    style HasQ fill:#f3e5f5

    classDef success fill:#4caf50,color:#fff
    classDef error fill:#f44336,color:#fff
    classDef process fill:#2196f3,color:#fff

    class SetUser1,SaveData,UpdateUser process
    class Error1 error
    class NavMain,LoginSuccess,RegSuccess success
```

# 🔄 דיאגרמת זרימת המידע - Welcome → MainApp

## 📋 הסבר הדיאגרמה:

### 🎯 **נקודות החלטה מרכזיות:**

- **AppNavigator**: בודק אם יש user ואם הוא מושלם
- **getCompletionStatus**: הפונקציה שמכריעה הכל
- **Quick Login Check**: בודק אם יש session תקף

### 🔄 **מסלולי הניווט:**

1. **משתמש חדש**: Welcome → Login/Register → Questionnaire → MainApp
2. **משתמש חוזר מושלם**: AppNavigator → MainApp (ישיר)
3. **משתמש חוזר לא מושלם**: AppNavigator → Questionnaire → MainApp
4. **Quick Login**: Welcome → Quick Login → MainApp/Questionnaire

### 💾 **נקודות שמירת נתונים:**

- `setUser()` - עדכון Zustand store
- `setSmartQuestionnaireData()` - שמירת תשובות שאלון
- `userApi.update()` - סנכרון לשרת

### 🔐 **אבטחה ובקרה:**

- בדיקת `user_logged_out` flag
- בדיקת session validity
- ניקוי נתונים בהתנתקות

---

### ✅ **המערכת מבטיחה:**

1. משתמש תמיד מגיע למקום הנכון
2. אין איבוד נתונים במעברים
3. חוויה חלקה ללא עיכובים מיותרים
4. אבטחה מלאה עם בקרת גישה
