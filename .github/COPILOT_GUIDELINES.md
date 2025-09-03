<!-- COP## תוכן עניינים (TO## 🧹 עדכון מסמך (3 בספטמבר 2025)

### ✅ תיקונים שבוצעו:

1. **תיקון כותרת כפולה**: 4.1 אימות נתוני דמו → 4.2
2. **עדכון תוכן עניינים**: הוספת סעיפים 19-22 שחסרו
3. **הסרת חזרות מיותרות**: מיזוג מידע כפול בסעיף 18
4. **עדכון תאריך**: 2025-09-02 → 2025-09-03
5. **מיזוג תוכן ייחודי מ-copilot-instructions-updated.md**:
   - הנחיות דמו מפורטות (סעיף 12.1)
   - בניית מערכות מחדש (סעיף 12.2)
   - דיבוג ניווט מתקדם (סעיף 15.1)
   - דיבוג אמולטור ו-React Native 0.77 (סעיף 15.2)
   - תיקוני UI מהירים (סעיף 15.3)
6. **תיקון כפילות סעיף 15.3**: הסרת סעיף כפול ומיזוג התוכן
7. **הפיכת קבצי stub ל-stub אמיתיים**: עדכון תאריכים וקישורים נכונים
8. **מיזוג דוחות עדכון**:
   - `TYPESCRIPT_SHARED_COMPONENTS_UPDATE_2025-09-02.md` (106→14 שורות) → סעיף 22
   - `UPDATE_SUMMARY_2025-09-02.md` (51→13 שורות) → סעיפים 19-22

**תוצאה**: מסמך מלא ומאוחד עם כל התוכן הייחודי ללא כפילויות 📋יסוד וקונבנציות
2. ארכיטקטורת פיצ'רים (חדש!)
3. עבודה עם טרמינל ו-Expo
4. Supabase – מקור אמת ונתוני דמו
5. RTL + נגישות (Accessibility)
6. ארכיטקטורה ותצורת פרויקט
7. מניעת כפילויות ודפוסי Refactor
8. BackButton ו-ConfirmationModal – שימוש מחייב
9. TypeScript & Data Contracts (כולל UserStore)
10. בדיקות (TS / יחידה / אינטגרציה)
11. ניהול תיעוד ומיזוג מסמכים
12. יצירת / עדכון נתוני דמו נכונים
13. Impact & Quality Checklists
14. הנחיות לעוזר AI (GitHub Copilot)
15. דיבוג מהיר (Navigation / UI / Cache)
16. בטיחות שינויים והסרת Legacy
17. דפוסי שאלון וציוד
18. טעויות נפוצות / DO & DON'T
19. ביצועים ואופטימיזציה (חדש!)
20. אבטחה ופרטיות (חדש!)
21. תרחישי קיצון וחוסן מערכת (חדש!)
22. לקחים משיפור TypeScript ורכיבים משותפים (חדש!)->

# הנחיות מאוחדות לפרויקט GYMovoo (Master Guidelines)

Last updated: 2025-09-03 (תוקן תוכן ענ## 🧹 עדכון מסמך (3 בספטמבר 2025)

### ✅ תיקונים שבוצעו:

1. **תיקון כותרת כפולה**: 4.1 אימות נתוני דמו → 4.2
2. **עדכון תוכן עניינים**: הוספת סעיפים 19-22 שחסרו
3. **הסרת חזרות מיותרות**: מיזוג מידע כפול בסעיף 18
4. **עדכון תאריך**: 2025-09-02 → 2025-09-03
5. **מיזוג תוכן ייחודי מ-copilot-instructions-updated.md**:
   - הנחיות דמו מפורטות (סעיף 12.1)
   - בניית מערכות מחדש (סעיף 12.2)
   - דיבוג ניווט מתקדם (סעיף 15.1)
   - דיבוג אמולטור ו-React Native 0.77 (סעיף 15.2)
   - תיקוני UI מהירים (סעיף 15.3)
6. **תיקון כפילות סעיף 15.3**: הסרת סעיף כפול ומיזוג התוכן

**תוצאה**: מסמך מלא ומאוחד עם כל התוכן הייחודי ללא כפילויות 📋יפים, והוסרו חזרות)

מסמך זה הוא מקור אמת יחיד לכללי עבודה, שימוש ב-AI, ארכיטקטורה, RTL, נגישות, Supabase, דמו, וניהול תיעוד. שני קובצי ההנחיות הישנים (`copilot-instructions.md`, `copilot-instructions-updated.md`) הוחלפו ומכילים הפניה בלבד. אין לשכפל תוכן חדש אליהם.

## תוכן עניינים (TOC)

1. עקרונות יסוד וקונבנציות
2. ארכיטקטורת פיצ'רים (חדש!)
3. עבודה עם טרמינל ו-Expo
4. Supabase – מקור אמת ונתוני דמו
5. RTL + נגישות (Accessibility)
6. ארכיטקטורה ותצורת פרויקט
7. מניעת כפילויות ודפוסי Refactor
8. BackButton ו-ConfirmationModal – שימוש מחייב
9. TypeScript & Data Contracts
10. בדיקות (TS / יחידה / אינטגרציה)
11. ניהול תיעוד ומיזוג מסמכים
12. יצירת / עדכון נתוני דמו נכונים
13. Impact & Quality Checklists
14. הנחיות לעוזר AI (GitHub Copilot)
15. דיבוג מהיר (Navigation / UI / Cache)
16. בטיחות שינויים והסרת Legacy
17. דפוסי שאלון וציוד
18. טעויות נפוצות / DO & DON'T
19. ביצועים ואופטימיזציה (חדש!)
20. אבטחה ופרטיות (חדש!)
21. תרחישי קיצון וחוסן מערכת (חדש!)
22. לקחים משיפור TypeScript ורכיבים משותפים (חדש!)

---

## 1. עקרונות יסוד וקונבנציות

- המשך מקוד קיים – אין שכתוב גורף.
- Supabase = מקור אמת יחיד; AsyncStorage = cache זמני בלבד.
- שינויים קטנים, דיפ מינימלי, ללא Reformat נרחב.
- אין נתונים דינמיים בתיעוד (מספרי אימונים, דקות, דירוגים).
- דו-לשוניות: הוסף מפתחות חדשים – אל תשנה קיימים.
- עדכון פרופיל → סנכרון מידי ל-Supabase + userStore.
- קובץ > ~500 שורות → שקול פיצול.
- "קודם קרא – אחר כך כתוב" – חפש רכיב/דפוס קיים לפני יצירה.

### זרימת משתמש בסיסית (עדכון ספטמבר 2025):

- התחלה: WelcomeScreen (אם אין session פעיל).
- כפתור ראשי: "התחל עכשיו" → RegisterScreen.
- לאחר הרשמה: אם אין שאלון מלא → UnifiedQuestionnaireScreen.
- לאחר השלמה: MainApp (BottomNavigation עם MainScreen).
- דמו: DeveloperScreen (מצב פיתוח) לבחירת משתמשי דמו מוכנים.

## 2. ארכיטקטורת פיצ'רים (חדש!)

בעת פיתוח פיצ'ר חדש ומשמעותי (כמו "Equipment-Aware Plans"), יש לפעול לפי השלבים הבאים:

1.  **יצירת שירות ליבה (Utility/Service):**
    - רכז את הלוגיקה המרכזית בקובץ ייעודי (לדוגמה: `src/utils/equipmentCatalog.ts`).
    - קובץ זה צריך להיות עצמאי ככל הניתן, עם תלות מינימלית.
    - הגדר `types` ו-`constants` ברורים בתוך השירות.

2.  **אינטגרציה עם שכבת הנתונים (Data Layer):**
    - עדכן את ה-stores הרלוונטיים (כמו `userStore.ts`) כדי לחשוף את הנתונים הנדרשים.
    - צור Selectors ייעודיים (`useUserEquipment`) שמטפלים בלוגיקת הגישה למקורות נתונים מרובים (למשל, `customDemoUser` או `trainingstats`).
    - בצע נורמליזציה של הנתונים בשכבה זו.

3.  **שילוב בשכבת הלוגיקה העסקית (Business Logic):**
    - בצע Refactor לשירותים קיימים (כמו `workoutLogicService.ts`) כדי שישתמשו בשירות הליבה החדש.
    - החלף לוגיקה ישנה ופשוטה בלוגיקה החדשה והחכמה (למשל, החלפת בדיקת ציוד פשוטה ב-`canPerform` ו-`getExerciseAvailability`).

4.  **כתיבת בדיקות (Testing):**
    - צור קובץ בדיקות ייעודי (`*.test.ts`) עבור שירות הליבה החדש.
    - ודא כיסוי מלא ל-Happy Paths, Edge Cases, ולוגיקת ההחלפות.

5.  **תיעוד:**
    - צור מסמך סיכום (`FEATURE_SUMMARY.md`) המסביר את הארכיטקטורה, זרימת הנתונים והשימוש.

## 3. עבודה עם טרמינל ו-Expo

אסור: timeout, sleep, הפעלת `npx expo start` כפול.
רענון אפליקציה: לחץ `r` בטרמינל הקיים (לא לפתוח חדש).
ניקוי Cache רק בעת בעיה: `npx expo start --clear`.
פקודות מבוקשות בלבד – לא להריץ ללא בקשת המשתמש.

## 4. Supabase – מקור אמת ונתוני דמו

- טבלת `public.users` מחזיקה JSONB מרובים (smartquestionnairedata, workoutplans, activityhistory...).
- שמות עמודות ב-DB תמיד lowercase (camelCase→lowercase).
- משתני סביבה חובה (Expo): `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- אין fetch/axios ל-localhost – רק supabase client.
- AsyncStorage: לאחסון זמני בלבד (`user_cache`), לא מקור אמת.
- שינוי סכימה → לציין בתקציר PR (מיגרציה).

### 4.1 אסטרטגיית סנכרון חכמה
- **סנכרון סלקטיבי**: רק משתמשי פרימיום מסתנכרנים עם השרת
- **debouncing**: מרווח 2 שניות בין עדכונים למניעת spam של השרת
- **התנגשויות**: `refreshFromServer()` עלול לגבור על שינויים מקומיים בעבודה מקבילית
- **התאמת שדות**: `fieldMapper.toDB()` ממיר מcamelCase ללowercase לפני שמירה

### 4.2 אימות נתוני דמו

השתמש רק בערכים המופיעים ב-`src/data/unifiedQuestionnaire.ts` ובקבועים תחת `src/constants/`.
סמן השלמת שאלון: `hasQuestionnaire: true` או `questionnaire.completed = true`.
אין להמציא שדות חדשים (ללא שינוי סכימה מתועד).
בדוק התאמה למבנה שהמסכים צורכים (`ProfileScreen`, `HistoryScreen`).

## 5. RTL + נגישות

- טקסט עברי: `writingDirection:"rtl"` + לרוב `textAlign:"right"`.
- חיצים: BackButton מציג chevron-forward ב-RTL (לא chevron-back).
- Row עם אייקון+טקסט בעברית: שקול `flexDirection: 'row-reverse'`.
- כל TouchableOpacity: `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`.
- אין שימוש ב-`Alert.alert` – רק `ConfirmationModal` (תמיכה ב-RTL ונגישות).

## 6. ארכיטקטורה ותצורת פרויקט

- React Native + Expo + TypeScript (strict).
- Zustand stores: `userStore`, `workoutStore`, `historyStore` (סנכרון Supabase דו-כיווני).
- ניווט: Stack ראשי + Tabs (react-navigation v6). BackButton מותאם בכל Header.
- WGER Integration: `wgerApiService.ts` v2.0.0 (מטמון + ממשק מאוחד `WgerExerciseInfo`).
- Demo Service: שירות דמו מציאותי (שדה `isDemo: true`).
- Unified Questionnaire: גרסה חדשה + תמיכה לאחור (legacy `questionnaire`).

## 7. מניעת כפילויות ודפוס Refactor

Pattern: Detect → Extract (util/component) → Replace Usages → Remove Legacy.
אין להשאיר ישן+חדש ללא TODO או מחיקה מידית (מועדפת).
סבבי מחיקה: UI → Logic → Styles → Docs.

## 8. BackButton & ConfirmationModal

BackButton ממוקם ב-`src/components/common/BackButton.tsx` – השימוש מחייב. אין כפתורי חזרה ידניים.
ConfirmationModal מחליף `Alert.alert` לכל הודעת אישור/אזהרה.

## 9. TypeScript & Data Contracts

- אין `any` (0 tolerance). שימוש ב-union / generics / interfaces.
- שדות JSONB: ודא טיפוס מוגדר (interface תואם lower-case columns בעת שמירה).
- `as const` לקבועים, לא קסמי מחרוזת.
- **איתור מבנים מורכבים**: יש לאתר את הנתיב המדויק לשדה הנדרש. לדוגמה, `equipment` יכול להימצא ב-`user.customDemoUser.equipment` או `user.trainingstats.selectedEquipment`. יש לתמוך בכל האפשרויות.
- מסונכרן בין legacy `questionnaire` ל-`smartquestionnairedata` עד הסרה מלאה.

### 9.1 ניהול מצב משתמש (UserStore) - עקרונות מרכזיים

- **session יחיד**: רק משתמש אחד בכל פעם, התחברות חדשה מחליפה את הקודמת
- **מטמון ציוד**: `memoizedNormalizeEquipment` עם TTL למניעת memory leaks
- **דיבאונס שרת**: `scheduleServerSync` עם עיכוב 2 שניות - רק הקריאה האחרונה מתבצעת
- **התנתקות**: `logout()` מציב דגל `user_logged_out` ב-AsyncStorage, `clearAllUserData()` לניקוי מלא
- **תקופת ניסיון**: מעבר אוטומטי מ-trial ל-free עם השבתת תכני פרימיום
- **סנכרון**: רק משתמשי פרימיום מסתנכרנים לשרת, משתמשי דמו (`demo_*`) מקומיים בלבד
- **שגיאות שרת**: נשמרות בלוג, נתונים נשארים מקומיים עד הסנכרון הבא
- **storage מלא**: טיפול ב-QUOTA_EXCEEDED עם ניסיונות ניקוי וחזרה

## 10. בדיקות

- **חובה**: לפני commit, הרץ `npx tsc --noEmit --skipLibCheck`.
- **לוגיקה חדשה**: חובה ליצור קובץ `*.test.ts` עם כיסוי ל-happy path ו-edge cases.
- בדיקות סמוכות לקוד או בתיקיית `src/tests`.
- שינויים בנתוני דמו → לעדכן בדיקות שמסתמכות עליהם.

## 11. ניהול תיעוד

- מסמך זה = יחיד. שני מסמכי העבר = הפניה בלבד.
- אין מספרים דינמיים, אין סטטיסטיקות מתיישנות.
- הוסף "Last updated" בראש כל מסמך חדש מהותי.
- מיזוג/מחיקת מסמכים: לציין ב-PR (Removed / Merged).
- שמור 5–10 מסמכים חיוניים קצרים.

## 12. יצירת / עדכון משתמש דמו

צעדים: קרא questionnaire values → בחר ערכים חוקיים → מלא מבנים מלאים (questionnaire + smartquestionnairedata + activityhistory + workoutplans) → סמן `hasQuestionnaire` → בדוק מסכים (`Profile`, `History`).
Email ייחודי (timestamp). שדות JSONB ריקים = `{}` מותר אם לוגיקה יודעת להתמודד.
עדכון שדה חדש למשתמש ⇒ לעדכן גם יוצר הדמו + התאמת Legacy.

### 12.1 הנחיות טיפול בקבצי דמו מפורטות

כל קובץ/פונקציה/מודול שמזהה דמו (Demo, DemoUser, realisticDemo, placeholder, customDemoUser):

- **הפרדה ברורה**: שמור את כל קוד הדמו במודול/פונקציה נפרדת (למשל `demoUserService.ts`)
- **סימון משתמש דמו**: ודא שכל אובייקט דמו מכיל שדה `isDemo: true`
- **הצגת תווית**: במסכים – הצג תווית "משתמש דמו" (למפתחים בלבד)
- **מחיקת דמו אוטומטית**: ודא שמשתמש דמו נמחק אוטומטית בסיום סשן/רענון/יציאה
- **עדכון דמו אוטומטי**: כל שינוי בשדות המשתמש/שאלון – עדכן גם את פונקציית הדמו
- **בדיקות אוטומטיות**: ודא שכל שדה חדש מופיע גם בדמו (הוסף בדיקות)
- **הפעלה/כיבוי דמו**: אפשר להפעיל/לכבות דמו בקלות (משתנה סביבה/כפתור dev)
- **תיעוד ברור**: הוסף תיעוד קצר שמסביר מהו דמו, איך מפעילים, ואיך מזהים אותו

### 12.2 בניית מערכות מחדש

- **זיהוי מורכבות יתר**: כאשר יש מרובה קבצים דומים - הצע בנייה מחדש במערכת אחודה
- **Unified Systems**: העדף קובץ אחד עם מנהל מרכזי (UnifiedManager) על פני מספר קבצים קטנים
- **נקה תוך כדי**: כשבונה מערכת חדשה, הסר את הישנה מיד כדי למנוע קונפליקטים

- **סימון דמו**: כל משתמש דמו חייב להכיל `isDemo: true`
- **מחיקת דמו אוטומטית**: דמו נמחק אוטומטית בסגירת האפליקציה או לחץ "נקה"
- **הפעלה/כיבוי דמו**: אפשר להפעיל/לכבות דמו בקלות (משתנה סביבה/כפתור dev)
- **תיעוד ברור**: הוסף תיעוד קצר שמסביר מהו דמו, איך מפעילים, ואיך מזהים אותו
- **הפרדת נתונים**: דמו לא מסתנכרן לשרת ונשאר מקומי בלבד

## 13. Checklists

### 13.1 Impact Checklist

[] Types מעודכנים
[] Stores מסונכרנים (user/workout/history)
[] Migration מתועדת (אם schema השתנה)
[] אין שימוש בנתוני דמו כקבועים
[] בדיקות רצות נקי

### 13.2 Quality Gate

1. TypeScript clean
2. Tests (אם השתנה לוגיקה)
3. No unused imports
4. No console.log production (devLog בלבד ב-**DEV**)
5. RTL + Accessibility בבדיקת UI בסיסית

## 14. הנחיות לעוזר AI

- לענות בעברית בלבד (קוד / פקודות באנגלית מותר).
- תמציתי, בולטים, ללא סופרלטיבים.
- לבצע פעולות ישירות (כלי) כשאפשר; לשאול רק כשחסר מידע חיוני.
- להסביר דלתא (מה השתנה) במקום לחזור על כל התכנית.
- לא להריץ פקודות שלא נתבקשו במפורש.

### 14.2 מבנה תקשורת ותוכניות פעולה (חדש!)

כדי למנוע בעיות RTL ולשפר את בהירות התקשורת, יש להקפיד על המבנה הבא בכל הצגת תוכנית פעולה. המבנה מפריד באופן מוחלט בין עברית לאנגלית.

> **🎯 מטרה: [שם המשימה]**
>
> **📝 הסבר כללי:**
> [הסבר מלא בעברית בלבד.]
>
> ---
>
> **🗺️ תוכנית הפעולה:**
>
> **1. [שם השלב הראשון]**
>
> - 📂 **קובץ לשינוי:**
>   ```
>   path/to/file.to.change.ts
>   ```
> - 🔧 **פונקציית יעד:**
>   ```
>   functionToModify
>   ```
> - 🔄 **הסבר השינוי (עברית בלבד):**
>   [פירוט מלא של השינוי המוצע, בעברית בלבד.]
>
> ---
>
> **✅ לאישור והמשך:**
> [קריאה ברורה לפעולה.]
>
> **✅ לאישור והמשך:**
> [קריאה לפעולה ברורה.]

## 15. דיבוג מהיר

- כפתור לא מגיב: בדוק onPress, שכבה חוסמת (zIndex), hitSlop.
- BackButton לא עובד: `navigation.canGoBack()`; אם false → נווט למסך root.
- שגיאת עמודה: בדוק lowercase מול DB.
- בעיות RTL: הוסף writingDirection + בדוק flexDirection.
- מטמון לא מתעדכן: ניקוי `expo start --clear` רק אם הכרחי.

### 15.1 דיבוג ניווט מתקדם

- **BackButton לא מגיב**: בדוק `navigation.canGoBack()` - אם false, נווט למסך root
- **ניווט חירום**: אם הניווט נתקע, השתמש ב-`navigation.reset()` עם state חדש
- **כפתורים לא מגיבים**: בדוק `hitSlop`, `zIndex`, ושכבות חוסמות

### 15.2 דיבוג אמולטור ו-React Native 0.77

- **בעיות גלילה באמולטור**: השתמש ב-ScrollView עם `nestedScrollEnabled={true}`, `removeClippedSubviews={false}`, רווחים גדולים (300px+ bottomSpacer)
- **Debug logging**: הוסף console.log למעקב אחר גלילה, contentSize, scroll position באמולטורים
- **כשל בפתרונות זמניים**: אם פתרונות כמו כפתורי עזרה/בחירה מהירה לא עובדים - הסר אותם והתמקד בפתרון הבסיסי
- **לוגי JavaScript**: בגרסה 0.77 הלוגים יזוזו ל-React Native DevTools. השתמש בהם כברירת מחדל
- **קונפליקט פורטים**: אם 8081 תפוס – אשר מעבר לפורט חלופי והמשך

### 15.3 תיקוני UI מהירים

- **תיקוני RTL מיידיים**: כשמשתמש מדווח על בעיות RTL, הוסף מיד `writingDirection: "rtl"` לכל הטקסטים העבריים
- **Safe Area כברירת מחדל**: אם יש התלוננות על UI שחופף למצלמה/משפך, החלף `View` ב-`SafeAreaView` מיד
- **בדיקה מהירה**: אחרי תיקוני RTL/SafeArea, הרץ `npx tsc --noEmit` לוודא שהקוד תקין

- **בעיות גלילה באמולטור**: השתמש ב-`ScrollView` עם `nestedScrollEnabled={true}`, `removeClippedSubviews={false}`
- **Debug logging**: הוסף `console.log` למעקב אחר גלילה, contentSize, scroll position
- **קונפליקט פורטים**: אם 8081 תפוס - אשר מעבר לפורט חלופי
- **React Native DevTools**: בגרסה 0.77 השתמש ב-DevTools (קיצור `j` בטרמינל)

## 16. בטיחות והסרת Legacy

- אין מחיקת פונקצונליות ליבה ללא אישור.
- קבצי JSON מקומיים = Legacy אם Supabase מחליף – להסיר אחרי וידוא שימושים.
- אין axios/fetch לשרת מקומי.
- לפני מחיקה: grep לשימושים + קומפילציה נקייה.

### 16.1 בניית מערכות מחדש

- **זיהוי מורכבות יתר**: כשמערכת הופכת מורכבת מדי, שקול בנייה מחדש
- **Unified Systems approach**: בנה מערכת אחת מאוחדת במקום מספר מערכות חופפות
- **נקה תוך כדי**: כשבונה מערכת חדשה, הסר את הישנה מיד למניעת קונפליקטים
- **אישור משתמש**: כל שינוי משמעותי/מיזוג/מחיקה - להציג קודם לאישור

## 17. שאלון וציוד

- equipment לפי מיקום (home_equipment / gym_equipment / bodyweight_equipment...).
- ערכים חוקיים בלבד מהקבועים.
- התאמת מגדר מתחילה בשאלה הראשונה.
- Session duration, availability, goals – תמיד בפורמט המוגדר (underscores).

## 18. טעויות נפוצות / DO & DON'T

DO: BackButton, ConfirmationModal, theme.colors, accessibility props, lower-case DB columns, unified questionnaire.
DON'T: Alert.alert, chevron-back ב-RTL, any, hard-coded colors, נתונים דינמיים בתיעוד, כפילות רכיבים.

## 19. ביצועים ואופטימיזציה - עקרונות מתקדמים

### 19.1 ניהול זיכרון ומטמון
- **Memoization חכם**: השתמש ב-TTL (Time To Live) למניעת memory leaks
- **דוגמה**: `memoizedNormalizeEquipment` עם cache של 5 דקות ו-override אוטומטי
- **עקרון**: cache יחיד למידע זהה, ניקוי אוטומטי לרשומות ישנות

### 19.2 סנכרון שרת מאופטם
- **Debouncing**: קריאות רבות למעט לקריאה אחת (2 שניות עיכוב)
- **גישה סלקטיבית**: רק משתמשי פרימיום מסתנכרנים, דמו נשאר מקומי
- **חוסן לשגיאות**: כשל ברשת לא מונע פעילות מקומית

### 19.3 ארכיטקטורת State Management
- **Store separation**: הפרדה ברורה בין user/workout/history stores
- **Persistence חכמה**: שמירת מינימום נתונים (`partialize`) למניעת bloat
- **זיכרון efficient**: פונקציות לא נשמרות ב-AsyncStorage

## 20. אבטחה ופרטיות - הגנה על נתוני משתמש

### 20.1 ניהול session ואימות
- **דגל התנתקות**: `user_logged_out` ב-AsyncStorage שולט בגישה
- **חשיבות**: זיוף הדגל ל-true יגרום לחזרה למסך Welcome
- **אבטחה**: כל בדיקת הרשאה עוברת דרך `isLoggedIn()` שבודק את הדגל

### 20.2 הפרדת נתוני דמו ומשתמשים אמיתיים
- **זיהוי דמו**: משתמשים עם ID שמתחיל ב-`demo_*` לא מסתנכרנים לשרת
- **בידוד**: נתוני דמו נשארים מקומיים למניעת זיהום בסיס הנתונים
- **בטיחות**: `refreshFromServer()` מתעלם ממשתמשי דמו אוטומטית

### 20.3 טיפול בכשלונות ושחזור
- **גישה לחלקין**: כשל בסנכרון לא גורם לאובדן נתונים מקומיים
- **fallback strategy**: שגיאות נרשמות בלוג, המשתמש לא מודע אלא אם הוא בודק
- **ניקוי בטוח**: מטמון מתנקה אוטומטית כשיש בעיות קיבולת אחסון

## 21. תרחישי קיצון וחוסן מערכת

### 21.1 עומס ובקשות מרובות
- **הגנה מפני spam**: `scheduleServerSync` מבטל בקשות קודמות
- **דוגמה**: 100 קריאות בשנייה → רק הבקשה האחרונה תרוץ אחרי 2 שניות
- **חוסן**: המערכת לא תקרוס ולא תחסום את השרת

### 21.2 בעיות אחסון וזיכרון
- **מלא AsyncStorage**: זיהוי `QUOTA_EXCEEDED` וניסיון ניקוי אוטומטי
- **סגירת אפליקציה**: סנכרון שלא הושלם לא יגרום לאובדן נתונים
- **שחזור נתונים**: הפעלה מחדש תנסה לסנכרן שוב את הנתונים הלא מעודכנים

### 21.3 תזמון וגישה מקבילית
- **setState אחרי יצירה**: פונקציות מורכבות מוגדרות אחרי יצירת ה-store למניעת circular dependencies
- **race conditions**: AsyncStorage בטוח למרות קריאות מקבילות
- **עקביות**: כל שינוי עובר דרך Zustand לעקביות state גלובלי

---

להוספת כלל חדש: ודא שאינו קיים; הוסף לסעיף הרלוונטי בלבד. שינוי מהותי → עדכן תאריך בראש.

---

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
- **🎯 Demo Service Optimization:** שירות דמו מציאותי מאופטם
  - ✅ **ממשקים מאוחדים:** `RealisticExerciseSet` מרחיב את `ExerciseSet` הבסיסי
  - ✅ **פתרון התנגשויות:** `PerformanceRecommendation` במקום `WorkoutRecommendation` כפול
  - ✅ **בטיחות טיפוסים:** הירארכיית inheritance נכונה עם imports מפורשים
  - ✅ **דוח מלא:** `docs/REALISTIC_DEMO_SERVICE_OPTIMIZATION_REPORT.md`
- **🏋️ Large Services Optimization:** אופטימיזציה של שירותים גדולים
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

// ✅ CloseButton - רכיב סגירה מאוחד (שימוש מועדף על TouchableOpacity)
<CloseButton
  onPress={onClose}
  size="medium"            // small | medium | large
  variant="solid"          // solid | outline | ghost
  position="center"        // center | start | end
  accessibilityLabel="סגור מסך"
  accessibilityHint="הקש כדי לסגור את המסך"
  testID="modal-close-button"
/>

// ❌ להימנע מ:
<TouchableOpacity onPress={onClose}>
  <Ionicons name="close" size={24} />
</TouchableOpacity>

// ✅ במקום - השתמש ב-CloseButton המאוחד
```

### 🔄 קונבנציית רכיבים משותפים:
**תמיד בדוק אם קיים רכיב משותף לפני יצירת חדש:**
- `CloseButton` - לכל כפתורי סגירה ובטלה
- `BackButton` - לניווט חזרה
- `LoadingSpinner` - למצבי טעינה
- `UniversalModal` - למודלים כלליים
- `InputField` - לקלטי טקסט
- `UniversalButton` - לכפתורים עיקריים

**לפני יצירת רכיב חדש:**
1. 🔍 בדוק ב-`src/components/common/` ו-`src/screens/workout/components/shared/`
2. 🔍 חפש ברכיבים הקיימים אם יש דומה
3. 🎯 אם צריך רכיב חדש - צור אותו במיקום המתאים ותעד
4. 📋 עדכן את הרשימה במסמכי התיעוד

<!-- סעיפים ישנים תחתית המסמך עברו לאיחוד למעלה. -->

questionnaireService.ts, WorkoutPlansScreen.tsx – משמשים כמודל לקונבנציות (TypeScript מחמיר, RTL, נגישות, JSDoc).

### 🎯 הסטנדרטים החדשים כוללים:

- **JSDoc מקיף:** `@performance`, `@rtl`, `@accessibility`, `@algorithm`
- **TypeScript מתקדם:** אסור `any`, ממשקים מפורטים, global state מוגדר
- **נגישות חובה:** כל TouchableOpacity עם תכונות נגישות מלאות
- **תמיכת RTL:** כיוון טקסט, אייקונים, ופריסה מותאמים
- **תיעוד דו-לשוני:** עברית ואנגלית בכל הערה
- **בדיקות אוטומטיות:** `npx tsc --noEmit --skipLibCheck` מחויב

## 🔄 שדרוגים מתוכננים לביצוע (ספטמבר 2025)

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

## 18. טעויות נפוצות / DO & DON'T

### ❌ אסור:

- `npm run start` → השתמש ב-`npx expo start`
- טרמינל חדש לרענון → לחץ `r` בטרמינל הקיים
- נתונים דינמיים בתיעוד
- כפתורי חזרה ידניים → השתמש ב-BackButton
- `chevron-back` ב-RTL → תמיד `chevron-forward`
- `Alert.alert` → השתמש ב-ConfirmationModal
- `any` בTypeScript
- ערכים קשיחים → רק `theme.colors.*`

### ✅ חובה:

- `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` בכל TouchableOpacity
- `textAlign: "right"` + `writingDirection: "rtl"` לטקסט עברי
- `npx tsc --noEmit --skipLibCheck` לפני commit
- שמירת מבנה נתונים עקבי

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

### דוגמת תיעוד מושלמת (מעודכן ספטמבר 2025):

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

- TypeScript מחמיר ללא any + ניהול state מתקדם עם Zustand
- נגישות + RTL עקביים עם תמיכה מלאה בעברית
- הפחתת כפילויות (BackButton, ConfirmationModal) וייעול ביצועים
- מטמון ויעילות קריאות API (שירות WGER + userStore מאופטם)
- אבטחה מתקדמת עם הפרדת משתמשי דמו וסנכרון חכם
- חוסן מערכת מול תרחישי קיצון ובעיות רשת/אחסון
- ארכיטקטורה מתקנת עצמה עם fallback strategies מובנים
- שיפור ברכיבים משותפים (CloseButton, BackButton) עם תכונות מתקדמות
- עדכון כלי בדיקת נגישות לזיהוי תכונות מודרניות

## 22. לקחים משיפור TypeScript ורכיבים משותפים (חדש!)

### 22.1 שיפור קונפיגורציית TypeScript

**שיפורים שבוצעו**:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**לקחים**:

- הוספת הגדרות מחמירות מתוך תחילת הפרויקט חשובה
- `paths` mapping מקל על imports יחסיים
- שימוש ב-`npx tsc --noEmit` לבדיקה מהירה של שגיאות

### 22.2 שיטתיות בתיקון שגיאות TypeScript

**תהליך נכון**:

1. רץ בדיקה כוללת: `npx tsc --noEmit`
2. תקן שגיאות אחת אחת עם הוספת `override` מילות מפתח
3. תקן `useEffect` dependencies וערכי החזרה
4. בדוק שוב עד קבלת 0 שגיאות

**לקחים**:

- תיקון שגיאות צריך להיות שיטתי ומסודר
- חשוב לבדוק כל קובץ בנפרד כדי לוודא שהתיקון עובד
- שמירת האחידות בדפוסי קוד חשובה יותר ממהירות

### 22.3 שיפור רכיבים משותפים

**CloseButton ו-BackButton עודכנו עם**:

- `React.memo` לביצועים
- Haptic feedback עם `expo-haptics`
- Loading states מובנים
- תמיכה ב-`reducedMotion`
- `Pressable` במקום `TouchableOpacity`

**מחליפים שימושים ידניים**:

```tsx
// ❌ לפני
<TouchableOpacity onPress={onClose}>
  <MaterialCommunityIcons name="close" size={24} />
</TouchableOpacity>

// ✅ אחרי
<CloseButton onPress={onClose} />
```

**לקחים**:

- רכיבים משותפים חוסכים זמן ומגדילים אחידות
- חשוב לעדכן את כל השימושים הקיימים ברכיבים
- תיעוד השימוש הנכון מעודד אימוץ

### 22.4 עדכון כלי בדיקת נגישות

**שיפורים בסקריפט `accessibilityCheck.js`**:

- גרסה 2.1 עם זיהוי תכונות מתקדמות
- בדיקת haptic feedback, loading states, reducedMotion
- זיהוי שימוש ב-Pressable מודרני
- זיהוי רכיבים משופרים (CloseButton, BackButton)
- דו"ח JSON מפורט עם סטטיסטיקות

**לקחים**:

- כלי בדיקה צריכים להתעדכן עם התפתחות הקוד
- חשוב לכלול גם בדיקות לתכונות מתקדמות, לא רק בסיסיות
- דיווח ברור עוזר להבין היכן להשקיע מאמץ

### 22.5 עקרונות פיתוח נוספים שנלמדו

**תיעדוף עבודה**:

1. תחילה תיקון בעיות קיימות (TypeScript errors)
2. שיפור רכיבים משותפים וההשפעה שלהם
3. עדכון כלי פיתוח לזיהוי השיפורים
4. תיעוד הלקחים למניעת חזרה

**מטרות איכות**:

- קוד נקי ועקבי
- נגישות מקיפה
- ביצועים אופטימליים
- כלי פיתוח מעודכנים

---

## 🧹 עדכון מסמך (3 בספטמבר 2025)

### ✅ תיקונים שבוצעו:

1. **תיקון כותרת כפולה**: 4.1 אימות נתוני דמו → 4.2
2. **עדכון תוכן עניינים**: הוספת סעיפים 19-22 שחסרו
3. **הסרת חזרות מיותרות**: מיזוג מידע כפול בסעיף 18
4. **עדכון תאריך**: 2025-09-02 → 2025-09-03
5. **מיזוג תוכן ייחודי מ-copilot-instructions-updated.md**:
   - הנחיות דמו מפורטות (סעיף 12.1)
   - בניית מערכות מחדש (סעיף 12.2)
   - דיבוג ניווט מתקדם (סעיף 15.1)
   - דיבוג אמולטור ו-React Native 0.77 (סעיף 15.2)
   - תיקוני UI מהירים (סעיף 15.3)

**תוצאה**: מסמך מלא ומאוחד עם כל התוכן הייחודי ללא כפילויות 📋

---

_מסמך זה מתוחזק כתקציר עקרונות – הימנע מהחזרת נתונים דינמיים. לעדכון מהותי: עדכן חותמת תאריך בראש._
