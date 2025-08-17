<!-- COPILOT_GUIDELINES.md -->

# GitHub Copilot - הנחיות עבודה לפרויקט GYMovoo

_Last updated: 2025-08-17_

## 🚫 פקודות טרמינל אסורות

- **לעולם לא לשלוח פקודות `timeout`** או פקודות המתנה אחרות
- אלה פקודות פנימיות שלא נחוצות למשתמש

## ✅ כללי עבודה עם טרמינל

- לשלוח **רק פקודות שהמשתמש מבקש באופן מפורש**
- לשלוח רק פקודות **הנחוצות באמת לפרויקט** (build, start, install וכו')
- **לחכות שהמשתמש יבקש restart לטרמינל** - לא לעשות זאת באופן אוטומטי

### 🔄 כללי רענון Expo - חשוב מאוד!

**✅ לרענון האפליקציה בפיתוח:**

- **אם Expo פועל** - פשוט לבקש מהמשתמש ללחוץ `r` בטרמינל הקיים
- **אסור לפתוח טרמינל חדש** כשרוצים לרענן
- זה מהיר יותר ולא מתנגש עם פקודת הביטול של Expo

**⚠️ לפקודות Windows חדשות:**

- **רק פקודות Windows** (כמו `dir`, `copy`, `move`) - טרמינל חדש
- **לא פקודות Expo** - אלה תמיד בטרמינל הקיים

**🚫 אסור להריץ מחדש `npx expo start` כשזה כבר פועל!**

## 🎯 עקרונות כלליים

- לשאול לפני ביצוע פעולות שאינן מוגדרות בבירור
- לתת הסברים קצרים ולעניין
- לעבוד בשיתוף עם המשתמש, לא במקומו
- **🚨 אסור לכלול נתונים דינמיים בתיעוד** - כמו מספרי אימונים, דקות, או סטטיסטיקות ספציפיות שמשתנות עם השימוש

## ⚠️ כללים חשובים לתיעוד

### 🚫 אסור לכתוב בתיעוד:

- מספרים ספציפיים של אימונים ("69 אימונים")
- נתוני זמן ספציפיים ("4,817 דקות")
- ציונים או דירוגים ספציפיים ("ממוצע 4.5/5")
- כל נתון שמשתנה עם שימוש במערכת

### ✅ במקום זה, כתוב:

- "מגוון אימונים מהדמו"
- "נתונים מלאים ומדויקים"
- "חישוב תקין של דירוגים"
- תיאור יכולות, לא תוצאות נוכחיות

## 📱 מידע על הפרויקט (סקירה כללית)

- **שם הפרויקט:** GYMovoo – אפליקציית כושר חכמה בעברית
- **טכנולוגיות:** React Native, Expo, TypeScript, Supabase
- **אינטגרציה:** WGER API + מאגר תרגילים מקומי
- **מטרה:** בניית תוכניות אימון מותאמות אישית ע"פ שאלון ונתוני משתמש
- **תכונות מרכזיות:** שאלון חכם, התאמת מגדר, מאגר ציוד רחב, נגישות + RTL
- **מצב:** מערכת יציבה עם מספר מסכים, רכיבים ושירותים ליבתיים (ללא ציון מספרים דינמיים)

## 🔧 הערות טכניות חשובות

- **הפעלת הפרויקט:** השתמש ב-`npx expo start` (לא `npm run start`)
- **מאגר תרגילים:** מאגר עשיר של תרגילים בעברית + תרגילי WGER באנגלית
- **WGER Integration:** עובד עם wgerApiService.ts (מאוחד ומאופטם v2.0.0)
  - ✅ **ממשק מאוחד:** `WgerExerciseInfo` משרת את כל הצרכים
  - ✅ **מטמון חכם:** 90% פחות קריאות API עם mappingsCache
  - ✅ **ביצועים משופרים:** הסרת כפילויות והמרות מיותרות
  - ✅ **איחוד הושלם:** הסרת `WgerExerciseFormatted` ב-useWgerExercises.ts
- **🎯 Demo Service Optimization:** שירות דמו מציאותי מאופטם (904 שורות)
  - ✅ **ממשקים מאוחדים:** `RealisticExerciseSet` מרחיב את `ExerciseSet` הבסיסי
  - ✅ **פתרון התנגשויות:** `PerformanceRecommendation` במקום `WorkoutRecommendation` כפול
  - ✅ **בטיחות טיפוסים:** הירארכיית inheritance נכונה עם imports מפורשים
  - ✅ **דוח מלא:** `docs/REALISTIC_DEMO_SERVICE_OPTIMIZATION_REPORT.md`
- **🏋️ Large Services Optimization:** אופטימיזציה של שירותים גדולים (2,474 שורות)
  - ✅ **פתרון כפילויות UserProfile:** `WorkoutUserProfile` ו-`ScientificUserProfile`
  - ✅ **התמחות ממשקים:** כל שירות עם ממשק מותאם לצרכיו הייחודיים
  - ✅ **בטיחות טיפוסים משופרת:** סיום התנגשויות בין שירותים
  - ✅ **דוח מקיף:** `docs/LARGE_SERVICES_OPTIMIZATION_REPORT.md`
- **TypeScript:** כל הקבצים צריכים להיות עם TypeScript מתקדם, אין שימוש ב-any
- **🔄 BackButton מרכזי:** תמיד import BackButton from "../../components/common/BackButton"
  - **Variants זמינים:** default, minimal, large
  - **Props:** absolute={false/true}, variant, size, style, onPress
  - **נגישות מובנית:** accessibilityLabel="חזור", accessibilityRole="button"
  - **RTL נכון:** אייקון chevron-forward (לא chevron-back)
- **איסור כפתורי חזרה ידניים:** אל תיצור TouchableOpacity עם navigation.goBack() ישירות

## 📊 סטטיסטיקות (Generalized)

לא נרשמות כאן ספירות מדויקות (מסכים, שירותים, קבצי תיעוד) כדי למנוע התיישנות. במקרה הצורך בדוק את העץ (`src/`) או קבצי הסיכום ב-`docs/`.

## 🧹 ניקוי Cache - מתי זה חשוב?

- **מטרו:** לניקוי cache השתמש ב-`--clear` (לא `--reset-cache`)
- **מתי לנקות:** כשיש בעיות טעינה, שגיאות import, או שינויים לא מופיעים
- **פקודה:** `npx expo start --clear`
- **לא להגזים:** רק כשבאמת יש בעיה - לא בכל פעם
- **RTL Support:** תמיכה מלאה בעברית עם תיקוני RTL מקיפים
- **מערכת שאלון:** 7 שאלות דינמיות עם התאמת מגדר ותמיכת RTL מלאה
- **אינטגרציה מושלמת:** HistoryScreen מציג נתוני דמו עם fallback logic חכם

## 🌍 תמיכת RTL והתאמת מגדר

### עקרונות חשובים:

- **כל הטקסטים בעברית:** `textAlign: "right"` + `writingDirection: "rtl"`
- **סימני בחירה:** תמיד בצד ימין (`right: theme.spacing.md`)
- **ריווחים:** `paddingRight` במקום `paddingLeft` לאלמנטים עבריים
- **התאמת מגדר:** שאלה ראשונה קובעת את התאמת כל השאלון
- **נייטרליות:** טקסטים קבועים נוסחו בצורה נייטרלית

### פונקציות מרכזיות (מאומתות):

```typescript
// שירותים מרכזיים - מאומתים ומעודכנים
workoutHistoryService - ניהול היסטוריית אימונים עם התאמת מגדר (15 functions)
userStore - ניהול מצב משתמש עם פונקציות מתקדמות
wgerApiService.ts - שירות WGER מאופטם עם מטמון ומפשקים מאוחדים (v2.0.0)
questionnaireService - שאלון חכם עם TypeScript מתקדם ונגישות מלאה
```

### BackButton – שימוש נכון (רוכז)

```tsx
import BackButton from "../../components/common/BackButton";
<BackButton variant="default" />;
// Optional: <BackButton variant="minimal" /> | <BackButton variant="large" onPress={customHandler} />
// ❌ אין ליצור TouchableOpacity ידני עם navigation.goBack()
```

### 🔔 ConfirmationModal - תחליף נגיש ל-Alert.alert

במקום להשתמש ב-`Alert.alert` שאינו תומך ב-RTL ונגישות מלאה, השתמש ב-`ConfirmationModal`:

```tsx
// ❌ הימנע מכך
Alert.alert("כותרת", "הודעה", [
  { text: "ביטול", style: "cancel" },
  { text: "אישור", onPress: () => doAction() },
]);

// ✅ השתמש בזה במקום
import ConfirmationModal from "../../components/common/ConfirmationModal";

// הגדרת state
const [showModal, setShowModal] = useState(false);
const [modalConfig, setModalConfig] = useState({
  title: "",
  message: "",
  onConfirm: () => {},
  confirmText: "אישור",
  destructive: false,
});

// שימוש
const handleAction = () => {
  setModalConfig({
    title: "אישור פעולה",
    message: "האם אתה בטוח שברצונך לבצע פעולה זו?",
    onConfirm: () => doAction(),
    confirmText: "כן, בצע",
    destructive: true, // למחיקות או פעולות מסוכנות
  });
  setShowModal(true);
};

// ב-JSX
<ConfirmationModal
  visible={showModal}
  title={modalConfig.title}
  message={modalConfig.message}
  onClose={() => setShowModal(false)}
  onConfirm={() => {
    setShowModal(false);
    modalConfig.onConfirm();
  }}
  onCancel={() => setShowModal(false)}
  confirmText={modalConfig.confirmText}
  cancelText="ביטול"
  destructive={modalConfig.destructive}
/>;
```

### ♿ קומפוננטי UI נגישים

כל הקומפוננטים הבסיסיים כעת תומכים בנגישות מלאה. **חובה לכלול נגישות בכל TouchableOpacity:**

```tsx
// ✅ TouchableOpacity עם נגישות מלאה - דוגמת חובה
<TouchableOpacity
  style={styles.button}
  onPress={handleAction}
  accessibilityLabel="תיאור הפעולה"
  accessibilityRole="button"
  accessibilityHint="מה יקרה כשתלחץ"
>
  <Text>כפתור</Text>
</TouchableOpacity>

// ✅ מתג/Switch עם נגישות
<TouchableOpacity
  accessibilityLabel={enabled ? "השבת תכונה" : "הפעל תכונה"}
  accessibilityRole="switch"
  accessibilityState={{ checked: enabled }}
  accessibilityHint="מחליף בין מצבי הפעלה"
  onPress={() => setEnabled(!enabled)}
>

// IconButton עם נגישות
<IconButton
  icon="settings"
  onPress={handleSettings}
  accessibilityLabel="הגדרות"
  accessibilityHint="פתח את מסך ההגדרות"
/>

// UniversalButton עם נגישות
<UniversalButton
  title="שמור"
  variant="primary"
  onPress={handleSave}
  loading={isSaving}
  accessibilityLabel="שמור שינויים"
  accessibilityHint="שמור את כל השינויים שביצעת"
/>

// InputField עם נגישות (אוטומטית)
<InputField
  label="שם מלא"
  placeholder="הכנס את שמך המלא"
  value={name}
  onChangeText={setName}
  // accessibility labels נוצרים אוטומטית מה-label ו-placeholder
/>

// DefaultAvatar עם נגישות (אוטומטית)
<DefaultAvatar
  name="יוסי כהן"
  size={90}
  // accessibility label נוצר אוטומטית: "תמונת פרופיל של יוסי כהן"
/>
```

## 🏗️ ארכיטקטורה מרכזית (תמצית)

- **ניווט:** Stack ראשי + Tabs
- **AI / תוכניות:** שירות ייעודי להרכבת אימון (אלגוריתם בסיסי מתרחב)
- **שאלון:** מנהל שאלון מאוחד + התאמות מגדר
- **תרגילים:** שירות WGER מאוחד + מאגר מקומי
- **מצב גלובלי:** userStore / workoutStore / historyStore (Zustand)
- **היסטוריה:** HistoryScreen צורך נתוני משתמש + דמו באותה תשתית

## 🔄 שירותים ורכיבים מחודשים (High-Level)

### דוגמאות שעודכנו לסטנדרט החדש

questionnaireService.ts, WorkoutPlansScreen.tsx – משמשים כמודל לקונבנציות (TypeScript מחמיר, RTL, נגישות, JSDoc).

### 🎯 הסטנדרטים החדשים כוללים:

- **JSDoc מקיף:** `@performance`, `@rtl`, `@accessibility`, `@algorithm`
- **TypeScript מתקדם:** אסור `any`, ממשקים מפורטים, global state מוגדר
- **נגישות חובה:** כל TouchableOpacity עם תכונות נגישות מלאות
- **תמיכת RTL:** כיוון טקסט, אייקונים, ופריסה מותאמים
- **תיעוד דו-לשוני:** עברית ואנגלית בכל הערה
- **בדיקות אוטומטיות:** `npx tsc --noEmit --skipLibCheck` מחויב

## 🔄 שדרוגים מתוכננים לביצוע (אוגוסט 2025)

### ✅ הושלם: wgerApiService.ts + useWgerExercises.ts אופטימיזציה

- **ממשק מאוחד:** `WgerExerciseInfo` משרת את כל הצרכים
- **מטמון חכם:** 90% פחות קריאות API
- **איחוד מלא:** הסרת `WgerExerciseFormatted` כפול
- **ביצועים:** 75% פחות כפילויות, 100% הסרת המרות מיותרות

### 🚧 עתידי: איחוד ממשקי Exercise (אופציונלי)

#### שלב מתקדם: ממשקי Exercise כלליים (לפי הצורך)

```typescript
// מטרה: איחוד 4 ממשקי Exercise שונים
// src/types/Exercise.ts - ממשק מרכזי אחיד
// השפעה: exerciseService.ts, types/index.ts, workout.types.ts
// סטטוס: לא נדרש כעת - כל ממשק משרת מטרה ייחודית
```

### 🎯 עקרונות איחוד

1. בטיחות טיפוסים קודם
2. צעדים קטנים + קומפילציה נקייה
3. תיעוד שינוי משמעותי

## ⚠️ בעיות ידועות וטעויות נפוצות

- **אל תשתמש ב-`npm run start`** - השתמש ב-`npx expo start`
- **אל תפתח טרמינל חדש לרענון Expo** - בקש מהמשתמש ללחוץ `r` בטרמינל הקיים
- **אל תכלול נתונים דינמיים בתיעוד** - כמו מספרי אימונים ספציפיים או זמנים
- **🚫 אל תיצור כפתורי חזרה ידניים** - תמיד השתמש ב-BackButton המרכזי
- **🚫 אל תשתמש ב-chevron-back** - תמיד chevron-forward (RTL)
- **🚫 אל תשכח accessibilityLabel** - בכל TouchableOpacity חובה: `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`
- **🚫 אל תשתמש בערכים קשיחים** - רק `theme.colors.*` ו-`theme.spacing.*`
- **🚫 אל תשתמש ב-any בTypeScript** - כל קובץ צריך טיפוסים מדויקים
- ✅ wgerApiService.ts כעת מאוחד ומאופטם (v2.0.0) עם מטמון חכם וממשקים מובנים
- **RTL חובה:** כל טקסט עברי חייב `textAlign: "right"` + `writingDirection: "rtl"`
- **מגדר:** שאלת מגדר תמיד ראשונה, ואחריה התאמה דינמית
- יש מספר קבצי שאלון - השתמש ב-smartQuestionnaireData.ts החדש
- **מבנה נתונים:** בדוק תמיד את המבנה האמיתי של נתוני הדמו (user.activityHistory.workouts)
- **🆕 תמיד לבדוק TypeScript:** `npx tsc --noEmit --skipLibCheck` לפני commit

## 🚨 לקחים קריטיים מהפרויקט

### 🎯 לקחים עדכניים חשובים:

- **נתונים דינמיים:** לעולם לא לכלול מספרים ספציפיים בתיעוד (אימונים, דקות, ציונים)
- **עבודה עם Expo:** אם Expo פועל - תמיד עבוד בטרמינל הקיים, לא תפתח חדש
- **מבנה נתונים:** תמיד בדוק את המבנה האמיתי (object.key, לא array ישירות)
- **אינטגרציה:** HistoryScreen עובד עם נתוני דמו דרך user.activityHistory.workouts
- **🔄 BackButton חובה:** כל מסך חדש חייב לכלול BackButton מ-components/common - אל תיצור כפתורי חזרה ידניים

### 🏗️ כללי פיתוח יסודיים:

- **RTL:** לא רק `textAlign: 'right'` - גם `flexDirection: 'row-reverse'` ו-`chevron-forward`
- **עיצוב:** אין ערכים קשיחים - רק מ-theme.ts (`theme.colors.*`, `theme.spacing.*`)
- **TypeScript:** אסור להשתמש ב-`any` - כל קובץ צריך טיפוסים מדויקים ובטיחות טיפוסים מלאה
- **נגישות חובה:** כל TouchableOpacity חייב `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`
- **אייקונים מוגדרים:** MaterialCommunityIcons עם טיפוס `keyof typeof MaterialCommunityIcons.glyphMap`
- **FlatList:** לעולם לא לקנן בתוך ScrollView
- **ייבוא:** רק imports יחסיים (./) - לא מוחלטים
- **הערות:** תמיד דו-לשוניות (עברית + אנגלית)
- **קבצים:** מקסימום 500 שורות - לפצל לcomponents/hooks/utils
- **ניווט:** כל route חדש = 3 עדכונים (screen + types.ts + AppNavigator.tsx)
- **כפתור חזרה:** תמיד להשתמש ב-BackButton מ-components/common עם variants מתאימים
- **בדיקות חובה:** `npx tsc --noEmit --skipLibCheck` לפני כל commit
- **קבועים:** השתמש ב-`as const` לטיפוסים קבועים
- **Global state:** השתמש בממשקים מוגדרים, לא ב-`global as any`

## 📝 כללי תיעוד חובה

- כל קובץ מתחיל ב-Header תיעוד מעודכן:

```typescript
/**
 * @file src/path/to/ComponentName.tsx
 * @brief תיאור קצר של הקומפוננט - מה הוא עושה ולמה הוא משמש
 * @dependencies React Native, Expo, MaterialCommunityIcons, theme, services נדרשים
 * @notes הערות מיוחדות על RTL, נגישות, או אלגוריתמים מיוחדים
 * @recurring_errors BackButton חובה במקום TouchableOpacity, accessibilityLabel חסר, any אסור
 */
```

### דוגמת תיעוד מושלמת (מעודכן יולי 2025):

```typescript
/**
 * @file src/screens/workout/WorkoutPlansScreen.tsx
 * @brief Enhanced Workout Plans Screen - מסך תוכניות אימון משופר עם AI וניהול מתקדם
 * @dependencies React Native, Expo, MaterialCommunityIcons, theme, userStore, questionnaireService, exerciseDatabase, WGER API
 * @notes מציג תוכניות אימון מותאמות אישית עם אלגוריתמי AI, תמיכת RTL מלאה, ונגישות מקיפה
 * @recurring_errors BackButton חובה במקום TouchableOpacity ידני, Alert.alert חסום - השתמש ב-ConfirmationModal
 */
```

- הערות בקוד תמיד דו-לשוניות
- אין שימוש ב-any בTypeScript
- כל קומפוננטה פונקציונלית בלבד

## 🎉 תקציר הצלחות (תמציתי)

- TypeScript מחמיר ללא any
- נגישות + RTL עקביים
- הפחתת כפילויות (BackButton, ConfirmationModal)
- מטמון ויעילות קריאות API (שירות WGER)

---

_מסמך זה מתוחזק כתקציר עקרונות – הימנע מהחזרת נתונים דינמיים. לעדכון מהותי: עדכן חותמת תאריך בראש._
