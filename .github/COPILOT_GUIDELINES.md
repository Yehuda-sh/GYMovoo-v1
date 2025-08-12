// COPILOT_GUIDELINES.md

# GitHub Copilot - הנחיות עבודה לפרויקט GYMovoo

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

## 📱 מידע על הפרויקט

- **שם הפרויקט:** GYMovoo - אפליקציית כושר בעברית
- **טכנולוגיות:** React Native + Expo + TypeScript
- **אינטגרציה:** WGER API לתרגילי כושר באנגלית + בסיס נתונים מקומי בעברית
- **מטרה:** לספק תוכניות אימון מותאמות אישית עם מערכת AI חכמה
- **מצב נוכחי:** 27 מסכים ראשיים פעילים, 3 קטגוריות רכיבים (common/ui/workout), 15 שירותים פעילים
- **🆕 היסטוריה:** HistoryScreen עם תמיכה מלאה בנתוני דמו ריאליסטיים ואינטגרציה מושלמת
- **🎯 תכונות עיקריות:** שאלון חכם 7 שאלות, מאגר ציוד 100+ פריטים, מערכת התאמת מגדר מתקדמת
- **🔄 עדכונים אחרונים:** שירותים מחודשים עם TypeScript מתקדם, נגישות מקיפה, ותמיכת RTL משופרת

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

## 📊 סטטיסטיקות הפרויקט המעודכנות

- **📱 מסכים פעילים:** 27 מסכים ראשיים (ללא רכיבים וגיבויים)
- **🧩 קטגוריות רכיבים:** 3 (common, ui, workout) עם 12 רכיבים
- **🔧 שירותים פעילים:** 15 שירותים כולל workoutHistoryService
- **📚 תיעוד:** 17 קבצי .md מאורגנים

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

### דוגמת שימוש נכון ב-BackButton:

```typescript
// ✅ שימוש נכון
import BackButton from "../../components/common/BackButton";

// במסך רגיל
<BackButton absolute={false} />

// במסך עם header minimal
<BackButton absolute={false} variant="minimal" />

// במסך עם header גדול
<BackButton absolute={false} variant="large" />

// עם פונקציה מותאמת אישית
<BackButton absolute={false} onPress={handleCustomBack} />

// ❌ שימוש שגוי - אל תעשה כך!
<TouchableOpacity onPress={() => navigation.goBack()}>
  <Ionicons name="chevron-forward" size={24} />
</TouchableOpacity>
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

## 🏗️ ארכיטקטורה מרכזית

- **ניווט:** AppNavigator.tsx (Stack) + BottomNavigation.tsx (Tabs)
- **AI System:** workoutDataService.ts עם אלגוריתם חכם לבחירת תרגילים
- **שאלון חכם:** SmartQuestionnaireManager עם 7 שאלות דינמיות + התאמת מגדר
- **Hook מרכזי:** useWgerExercises.ts למשיכת תרגילים מ-WGER (מאומת)
- **מאגר ציוד:** 100+ פריטי ציוד עם קטגוריזציה חכמה
- **🆕 היסטוריה:** HistoryScreen עם תמיכה מלאה בנתוני דמו ריאליסטיים ואינטגרציה מושלמת (27 מסכים פעילים)
- **🔧 ניהול מצב:** userStore מורחב עם פונקציות מתקדמות לשאלון ומגדר (15 services פעילים)
- **🆕 שירותים מחודשים:** questionnaireService, WorkoutPlansScreen מחודשים עם TypeScript מתקדם ונגישות מקיפה

## 🔄 שירותים ורכיבים מחודשים (יולי 2025)

### ✅ שירותים שעודכנו לסטנדרט חדש:

- **questionnaireService.ts** - TypeScript מתקדם, ממשקים מקיפים, אלגוריתמי AI משופרים
- **WorkoutPlansScreen.tsx** - נגישות מלאה, TypeScript נקי, תמיכת RTL מתקדמת

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

### 🎯 עקרונות איחוד:

- **בטיחות ראשונה:** כל שדרוג נבדק עם `npx tsc --noEmit --skipLibCheck`
- **שלבים קטנים:** לא לשבור יותר מקובץ אחד בכל פעם
- **תיעוד מלא:** כל שינוי מתועד ב-COPILOT_GUIDELINES

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

## 🎉 הצלחות וחידושים (יולי 2025)

### ✅ הישגים טכניים מרכזיים:

- **TypeScript מתקדם:** מעבר מ-`any` לטיפוסים מדויקים בכל השירותים המחודשים
- **נגישות מקיפה:** כל TouchableOpacity כולל `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`
- **RTL מושלם:** chevron-forward, כיוון טקסט נכון, פריסה מותאמת
- **Global State מוגדר:** מעבר מ-`global as any` לממשקים TypeScript מוגדרים
- **Theme עקבי:** החלפת ערכים קשיחים בצבעי theme מוגדרים

### 🔧 שיפורים ארכיטקטוניים:

- **ConfirmationModal:** תחליף נגיש ל-Alert.alert עם תמיכת RTL מלאה
- **BackButton מרכזי:** קומפוננטה אחידה עם variants למניעת כפילויות
- **Service Modernization:** questionnaireService ו-WorkoutPlansScreen כדוגמת סטנדרט חדש
- **Documentation Standards:** JSDoc עם תגי @performance, @rtl, @accessibility

### 📊 איכות קוד מוכחת:

- **Zero TypeScript Errors:** כל הקבצים המחודשים עוברים `npx tsc --noEmit --skipLibCheck`
- **Accessibility Compliance:** תמיכה מלאה בקוראי מסך ונגישות
- **RTL Perfection:** תמיכה מושלמת בעברית עם כיוון נכון
- **Performance Optimized:** מיטוב זיכרון ועיבוד עם intelligent caching

---

_קובץ זה נועד להבטיח עבודה חלקה ויעילה בין GitHub Copilot למשתמש_  
_🔄 עודכן: יולי 30, 2025 - הוספת סטנדרטים חדשים לשירותים ורכיבים מחודשים_
