# 📋 מערכת השאלון האחודה החדשה

# Unified Questionnaire System

## 🎯 מטרה

החלפת כל מערכות השאלון הישנות במערכת אחת פשוטה, יעילה ועובדת.

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

## 🔄 השינויים שבוצעו

### קבצים שהוחלפו:

- ❌ `SmartQuestionnaireScreen.tsx` (ישן)
- ✅ `UnifiedQuestionnaireScreen.tsx` (חדש)

### עדכונים בנאוויגציה:

- ✅ `AppNavigator.tsx` - עודכן לשימוש במסך החדש
- ✅ `src/screens/index.ts` - ייצוא המסך החדש

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

1. **Debug logging** - לוגים מפורטים לזיהוי בעיות גלילה
2. **רווחים גדולים** - 400px padding ו-300px bottomSpacer

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

### לוגים:

- ✅ `📋 Loaded question: ${question?.id}`
- ✅ `✅ Answered question: ${questionId}`
- ✅ `🎯 UnifiedQuestionnaireManager initialized`
- ✅ `📐 EMULATOR: Content size changed: ${width}x${height}`
- ✅ `🖱️ EMULATOR: Scroll Y: ${scrollY}, Max: ${maxScroll}`

### בדיקות:

1. **גלילה** - ודא שרואה את כל 10 האפשרויות בציוד ביתי
2. **בחירה** - בחירה יחידה ומרובה עובדות
3. **ניווט** - מעבר בין שאלות חלק
4. **השלמה** - יצירת משתמש דמו מהתשובות

## 🔧 פתרון בעיות באמולטור

### אם הגלילה לא עובדת באמולטור:

1. **Console logs** - בדוק את הלוגים:

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

## 📋 TODO (אם נדרש)

- [ ] הוספת אנימציות מעבר בין שאלות
- [ ] שמירת טיוטה באמצע השאלון
- [ ] תמיכה בתמונות לאפשרויות
- [ ] מערכת ציונים משוקללת לכל תשובה

## ✅ יתרונות המערכת החדשה

1. **קובץ אחד** - כל הלוגיקה במקום אחד
2. **ScrollView עובד** - גלילה מושלמת לכל התוכן
3. **ללא כפילויות** - מערכת אחת במקום 3-4 מערכות
4. **פשוט לתחזוקה** - קוד ברור וקריא
5. **תמיכה מלאה בעברית** - RTL בכל מקום
6. **מהיר** - ללא עומסים מיותרים

---

**המערכת החדשה מוכנה לשימוש! 🎉**
