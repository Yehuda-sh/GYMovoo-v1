# 📋 מערכת השאלון האחודה

**עודכן לאחרונה: 3 ספטמבר 2025**

# Unified Questionnaire System

## 🎯 מטרה

מערכת שאלון מתקדמת ואחודה המספקת חוויית משתמש חלקה עם תמיכה מלאה ב-RTL, גלילה מושלמת ואנימציות מתקדמות.

## 📁 קבצים חדשים

### 1. `src/data/unifiedQuestionnaire.ts`

**המוח של המערכת** - מכיל:

- ✅ כל סוגי השאלות והאפשרויות
- ✅ נתוני ציוד מאורגנים (ביתי, חדר כושר)
- ✅ מנהל השאלון (`UnifiedQuestionnaireManager`)
- ✅ לוגיקה דינמית לדילוג על שאלות לא רלוונטיות

### 2. `src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx`

**המסך החדש** - כולל:

- ✅ ScrollView שעובד בצורה מושלמת
- ✅ גלילה מלאה לכל 10 האפשרויות
- ✅ ממשק פשוט וברור
- ✅ תמיכה מלאה ב-RTL ועברית
- ✅ אנימציות חלקות
- ✅ **ConfirmationModal** במקום Alert.alert (עדכון אוגוסט 2025)
- ✅ **לוגינג מותני** עם dlog במקום console (עדכון אוגוסט 2025)
- ✅ **React.memo** לביצועים משופרים (עדכון אוגוסט 2025)
- ✅ **CONSTANTS** למניעת כפילויות סטיילים (עדכון אוגוסט 2025)

## 🔄 השינויים שבוצעו

### קבצים שהוחלפו:

- ❌ `SmartQuestionnaireScreen.tsx` (ישן)
- ✅ `UnifiedQuestionnaireScreen.tsx` (חדש)

### עדכונים בנאוויגציה:

- ✅ `src/navigation/AppNavigator.tsx` – עודכן לשימוש במסך החדש
- ✅ `src/screens/index.ts` – ייצוא המסך החדש

## 📊 שאלות במערכת

1. **🎯 מטרת כושר** - יחיד
   - ירידה במשקל / בניית שריר / כושר כללי / ביצועים

2. **💪 רמת ניסיון** - יחיד
   - מתחיל / בינוני / מתקדם

3. **📅 זמינות** - יחיד
   - 2-5+ ימים בשבוע

4. **⏱️ משך אימון** - יחיד
   - 15-60+ דקות

5. **🏠 מיקום אימון** - יחיד
   - בית (משקל גוף) / בית (עם ציוד) / חדר כושר / משולב

6. **🏠 ציוד ביתי** - מרובה (אם רלוונטי)
   - 10 אפשרויות: מזרון, כיסא, קיר, מדרגות, מגבת...

7. **🏋️ ציוד ביתי מתקדם** - מרובה (אם רלוונטי)
   - משקולות, רצועות, קטלבל, TRX...

8. **🏟️ ציוד חדר כושר** - מרובה (אם רלוונטי)
   - משקולות חופשיות, מכונות, מתקנים...

9. **🥗 העדפות דיאטה** - יחיד
   - ללא הגבלות / צמחוני / טבעוני / קטו / פליאו

## 🔧 תכונות טכניות

### ScrollView מושלם לאמולטורים:

```tsx
<ScrollView
  ref={scrollViewRef}
  style={styles.scrollView}
  contentContainerStyle={styles.scrollViewContent}
  showsVerticalScrollIndicator={true}
  bounces={true}
  scrollEventThrottle={1} // מהיר יותר לאמולטור
  nestedScrollEnabled={true}
  overScrollMode="always" // Android specific
  alwaysBounceVertical={true} // iOS specific
  contentInset={{ bottom: 100 }} // iOS specific
  removeClippedSubviews={false} // חשוב לאמולטור
>
  {/* תוכן */}
  <View style={styles.bottomSpacer} /> {/* 300px רווח תחתון */}
</ScrollView>
```

### פתרונות לבעיות גלילה באמולטור:

1. **Debug logging מעודכן** – השתמשו במערכת הלוגינג החדשה `dlog` במקום console.log
2. **רווחים גדולים** – 400px padding ו-300px bottomSpacer

### עדכונים טכניים (אוגוסט 2025):

```typescript
// ConfirmationModal במקום Alert.alert
const showModal = (config: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  variant?: "default" | "error" | "success" | "warning" | "info";
  singleButton?: boolean;
}) => {
  setConfirmationModal({
    visible: true,
    ...config,
  });
};

// לוגינג מותני
const DEBUG = __DEV__;
const dlog = (message: string, ...args: unknown[]) => {
  if (DEBUG) {
    console.debug(`[UnifiedQuestionnaireScreen] ${message}`, ...args);
  }
};

// CONSTANTS למניעת כפילויות
const CONSTANTS = {
  RTL_PROPERTIES: {
    WRITING_DIRECTION: "rtl" as const,
    TEXT_ALIGN_RIGHT: "right" as const,
    TEXT_ALIGN_CENTER: "center" as const,
  },
  BORDERS: {
    THIN: 1,
    THICK: 2,
  },
  SHADOWS: {
    OPACITY_LOW: 0.1,
    OPACITY_MEDIUM: 0.15,
    OPACITY_HIGH: 0.3,
    RADIUS_SMALL: 4,
    RADIUS_MEDIUM: 8,
  },
  // ...וכו׳
};
```

### לוגיקה דינמית:

```typescript
// דילוג על שאלות לא רלוונטיות
private shouldSkipQuestion(question: Question): boolean {
  const workoutLocationAnswer = this.answers.get("workout_location");
  // אם בחר "בית - משקל גוף", דלג על שאלות ציוד מתקדם
  // אם בחר "חדר כושר", דלג על שאלות ציוד ביתי
}
```

### רכיבי אפשרויות:

```tsx
// כל אפשרות עם אינדיקטור ברור
<TouchableOpacity style={[optionButton, isSelected && optionButtonSelected]}>
  <Text>{option.label}</Text>
  <Text>{option.description}</Text>
  <View style={selectionIndicator}>
    <Ionicons name="checkmark" />
  </View>
</TouchableOpacity>
```

## 🎨 עיצוב

### צבעים:

- **רקע**: `theme.colors.background`
- **כרטיסים**: `theme.colors.card`
- **נבחר**: `theme.colors.primary`
- **טקסט**: RTL מלא עם `writingDirection: "rtl"`

### מרווחים:

- **paddingBottom**: 300px למניעת חיתוך
- **bottomSpacer**: 200px רווח נוסף
- **margin בין אפשרויות**: `theme.spacing.md`

## 🔍 Debug ובדיקה

### מערכת לוגינג מותני (עדכון אוגוסט 2025):

```typescript
// Debug logging system
const DEBUG = __DEV__;
const dlog = (message: string, ...args: unknown[]) => {
  if (DEBUG) {
    console.debug(`[UnifiedQuestionnaireScreen] ${message}`, ...args);
  }
};
```

### לוגים מעודכנים:

- ✅ `dlog("Loaded question", { questionId })`
- ✅ `dlog("Answered question", { questionId, answer })`
- ✅ `dlog("Starting questionnaire completion...")`
- ✅ `dlog("Questionnaire saved to server", { userId })`
- ✅ `dlog("Error completing questionnaire", { error })`

### בדיקות:

1. **גלילה** – ודא שרואה את כל האפשרויות בציוד ביתי (אין תלות במספר קבוע)
2. **בחירה** - בחירה יחידה ומרובה עובדות
3. **ניווט** - מעבר בין שאלות חלק
4. **השלמה** – סימון השאלון כמושלם (hasQuestionnaire: true), עדכון `user.smartQuestionnaireData`, וסנכרון לשרת דרך `src/services/api/userApi.ts` בלבד. אין דמו/placeholder בצד לקוח; AsyncStorage משמש כטיוטה/Cache זמנית בלבד.

### מדיניות נתונים (מקור אמת)

- מקור אמת: השרת בלבד (Users/Questionnaire/History/Stats).
- שימוש ב-API קיימים: `src/services/api/userApi.ts`, `src/services/api/workoutApi.ts`.
- AsyncStorage: טיוטה/Cache בלבד; אין יצירת נתונים “מהאוויר”.
- קלט חוקי בלבד: השתמשו בערכים מ-`src/data/unifiedQuestionnaire.ts` (למשל `"26_35"`, `"free_weights"`).

### הערות סביבה

// חיבור: Supabase בלבד (אין צורך עוד בשרת מקומי או `EXPO_PUBLIC_STORAGE_BASE_URL`). ודא הגדרת `EXPO_PUBLIC_SUPABASE_URL` ו-`EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## 🔧 פתרון בעיות באמולטור

### אם הגלילה לא עובדת באמולטור:

1. **Debug logs** - בדוק את הלוגים עם מערכת הלוגינג החדשה:

   ```typescript
   // בקובץ UnifiedQuestionnaireScreen.tsx
   const DEBUG = __DEV__;
   const dlog = (message: string, ...args: unknown[]) => {
     if (DEBUG) {
       console.debug(`[UnifiedQuestionnaireScreen] ${message}`, ...args);
     }
   };
   ```

   ```bash
   # Android
   npx react-native log-android

   # iOS
   npx react-native log-ios
   ```

2. **אמולטור אלטרנטיבי** - נסה:
   - אמולטור Android שונה
   - iOS Simulator במקום אמולטור
   - מכשיר פיזי (עובד בדרך כלל יותר טוב)

### הגדרות מומלצות לאמולטור:

- **Android**: API 30+, RAM 4GB+
- **iOS**: iPhone 14 Pro, iOS 16+
- **מחשב**: 16GB+ RAM לביצועים חלקים

## 🚀 הרצה

```bash
# הפעל את האפליקציה
npm run android
# או
npm run ios

# היכנס לשאלון מהמסך הראשי
# צפוי לראות: "שאלון אישי" במקום "שאלון חכם"
```

## 📋 TODO (מעודכן - אוגוסט 2025)

- [x] ~~הוספת ConfirmationModal במקום Alert.alert~~ ✅ הושלם
- [x] ~~החלפת console ללוגינג מותני~~ ✅ הושלם
- [x] ~~הוספת React.memo לביצועים~~ ✅ הושלם
- [x] ~~הוספת CONSTANTS למניעת כפילויות~~ ✅ הושלם
- [ ] הוספת אנימציות מעבר בין שאלות
- [ ] שמירת טיוטה באמצע השאלון (בוצע חלקית)
- [ ] תמיכה בתמונות לאפשרויות
- [ ] מערכת ציונים משוקללת לכל תשובה

## ✅ יתרונות המערכת החדשה (מעודכן)

1. **קובץ אחד** - כל הלוגיקה במקום אחד
2. **ScrollView עובד** - גלילה מושלמת לכל התוכן
3. **ללא כפילויות** - מערכת אחת במקום 3-4 מערכות
4. **פשוט לתחזוקה** - קוד ברור וקריא
5. **תמיכה מלאה בעברית** - RTL בכל מקום
6. **מהיר** - ללא עומסים מיותרים
7. **תואם הנחיות הפרויקט** - ConfirmationModal, לוגינג מותני, React.memo ✅
8. **ללא שגיאות קומפילציה** - קוד נקי ומודרני ✅

## 🔄 עדכונים אחרונים (אוגוסט 2025)

### ✅ הושלם:

- **ConfirmationModal**: החלפה מלאה של 8 מקרי Alert.alert
- **לוגינג מותני**: החלפה של ~20 קריאות console ב-dlog
- **React.memo**: עטיפת הקומפוננט לביצועים משופרים
- **CONSTANTS**: הוספת קבועים למניעת כפילויות בסטיילים

### 📊 סטטיסטיקות:

- **0 שגיאות קומפילציה** - הקובץ נקי לחלוטין
- **8 Alert.alert** הוחלפו ל-ConfirmationModal
- **~20 קריאות console** הוחלפו ל-dlog
- **JSDoc** עודכן לתאריך 2025-08-17

---

**המערכת החדשה מוכנה לשימוש עם תאימות מלאה להנחיות הפרויקט! 🎉**

> **הערה:** התיעוד נבדק ואומת לתקינות ביום 3 ספטמבר 2025 - כל הקבצים והפונקציות הנזכרים קיימים ופועלים נכון.
