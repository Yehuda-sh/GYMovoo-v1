# תיאור זרימת מערכת (Automation-Style)

מסמך זה מתאר את הזרימות העיקריות של האפליקציה בסגנון כלי אוטומציה: טריגרים → פעולות → נקודות החלטה → תוצרים, כולל חוזי נתונים, סנכרון בין שכבות, ונקודות כשל/התאוששות.

## הקשר ומטרות

- פלטפורמה: React Native/Expo עם TypeScript, Zustand לניהול state.
- יעדים:
  - זרימת התחלה יציבה (אחסון/אוטולוגין/דמו).
  - שאלון אחוד וייצוא נתונים חכמים.
  - יצירת/סנכרון תוכן אימונים ולוח ראשי.
  - סשן אימון מלא ועדכון היסטוריה/פרופיל.
  - שמירה על RTL, SafeArea, ונגישות.

## משתתפים (Swimlanes)

- משתמש
- אפליקציה (RN/Expo)
- Stores (Zustand): userStore, workoutStore, historyStore
- שירותים: Auth, DemoUserService, Workout services, StorageCleanup
- נתונים: AsyncStorage, constants, unifiedQuestionnaire

## טריגרים עיקריים (Triggers)

- App Launch
- Quick Demo Login (במסך הפתיחה)
- Login רגיל (טופס אימייל/סיסמה)
- Questionnaire Completed (שאלון אחוד)
- Start Workout / Finish Workout
- Profile Updated
- App Exit/Logout

## זרימה מרכזית E2E (High-level)

1. Launch → הכנה

- פעולה: StorageCleanup.logStorageStatus → cleanOldData.
- החלטה: Auto-login זמין? אם כן → טען משתמש; אם לא → ניווט למסך Welcome/Auth.

2. Welcome/Auth

- אפשרויות:
  - התחברות רגילה (אימייל/סיסמה).
  - התחברות מהירה לדמו (נדרש בפרויקט).
- אימות טופס: utils/authValidation.validateLoginForm.
- כשל אימות: הצג הודעות מה-AUTH_STRINGS.

3. Demo Quick Login (מסלול דמו)

- פעולה: demoUserService.generateDemoUser → יוצר משתמש עם isDemo: true.
- החלטה: יש שאלון מושלם? אם לא → מעבר לשאלון אחוד.
- כלל: מחיקת משתמש דמו/נתונים בסיום סשן/יציאה.

4. Post-Login Gate

- החלטה: smartQuestionnaireData.answers שלמים?
  - כן → המשך ליצירת תכנים.
  - לא → ניווט לשאלון אחוד (UnifiedQuestionnaireManager).

5. Unified Questionnaire

- ניהול: UnifiedQuestionnaireManager (דילוגים מותנים לפי workout_location).
- Normalize: normalizeEquipment() מבטיח string[] כולל "none" במקרה ללא בחירה.
- Export: toSmartQuestionnaireData() → answers עם מזהים מהמערכת (unified ids).
- Persist: שמירה ל-AsyncStorage ול-userStore.

6. יצירת תוכן/היסטוריה

- מיפוי ציוד: mapUnifiedEquipmentToInternal (שירותי דמו/סימולציה) — שימוש ב-unified ids בלבד.
- יצירת היסטוריה/תוכנית: demoWorkoutService.generateDemoWorkoutHistoryForUser או שירות אמיתי.
- סנכרון: עדכון workoutStore/historyStore.

7. Main Screen (דשבורד)

- "אימונים אחרונים": הצגה ממבני WorkoutWithFeedback.
- מיפוי שדות: name/duration/stats, feedback.completedAt, startTime, difficulty.
- פורמטרים: utils/formatters (formatWorkoutDate, formatRating, getWorkoutIcon, formatEquipmentList).
- UI: SafeAreaView חובה, RTL לטקסטים עבריים.

8. סשן אימון

- עבודה עם תרגילים וסטים.
- חישובים: utils/workoutStatsCalculator.calculateWorkoutStats.
- רטט/פידבק: utils/workoutHelpers.triggerVibration.
- סיום: עדכון historyStore, סימון completedAt, חישוב מדדים, לוגים.

9. פרופיל ועדכונים

- עדכון נתונים אישיים (gender/age/height/weight/fitnessLevel).
- סנכרון: userStore → משפיע על תכנון/הצגה; שמירה ל-AsyncStorage.

10. יציאה/סגירה

- אם isDemo: מחיקה אוטומטית של נתוני דמו.
- ניקוי זמני: StorageCleanup.cleanOldData.

## נקודות החלטה (Gateways)

- [Auth?] האם יש session תקף → כן: דילוג למסך ראשי; לא: Auth.
- [Demo?] האם נבחר demoLogin → כן: מסלול דמו; לא: Auth רגיל.
- [Questionnaire Complete?] האם answers מלאים → כן: המשך; לא: שאלון.
- [Equipment Empty?] אם לא נבחר ציוד → normalize מוסיף "none".

## חוזי נתונים (Data Contracts) תמצית

- SmartQuestionnaireData.answers (עיקריים):
  - gender: "male" | "female" | undefined
  - age: ids לפי unifiedQuestionnaire (למשל "26_35")
  - weight: ids (למשל "71_80")
  - height: ids (למשל "171_180")
  - fitnessLevel: "beginner" | "intermediate" | "advanced"
  - goals: string[] (למשל ["build_muscle"])
  - equipment: string[] עם unified ids; normalize מבטיח לפחות ["none"]
  - availability: string[] (למשל ["3_days"])
  - sessionDuration: "15_30_min" | "30_45_min" | "45_60_min" | "60_plus_min"
  - workoutLocation: "home_bodyweight" | "home_equipment" | "gym" | "mixed"
  - nutrition: string[] (למשל ["vegetarian"])

- Demo User:
  - isDemo: true
  - questionnaire/smartQuestionnaireData מסונכרנים.

הערה: אסור להמציא ערכים; להשתמש ב-unifiedQuestionnaire.ts בלבד.

## סנכרון בין שכבות

- userStore ←→ AsyncStorage: פרופיל, smartQuestionnaireData, העדפות.
- workoutStore/historyStore ← שירותים (דמו/אמיתיים) → מציגים ב-Main/History.
- עדכוני פרופיל גוררים רענון תוכן/תצוגה.

## טיפול בשגיאות/לוגים

- אימות Auth: utils/authValidation (שגיאות עברית ב-AUTH_STRINGS).
- לוגים: utils/logger – console.warn לשגרתי, error לקריטי.
- Recovery: דפדוף חסין בשאלון (skip/previous), normalize לציוד.

## RTL, נגישות ו-Safe Area

- RTL: rtlHelpers.getTextAlign / writingDirection: "rtl" לטקסטים בעברית.
- SafeAreaView חובה לכל מסך ליבה.
- אייקונים/שמות ציוד: utils/equipmentIconMapping + formatEquipmentList.

## בדיקות ואוטומציה

- TypeScript: npx tsc --noEmit לפני מיזוג.
- Jest: מוקים ל-Expo/RN (setupTests), מומלץ moduleNameMapper ל-expo-modules-core.
- בדיקות דמו: מיפוי unified→internal + צורת ציוד אחידה.

## תרחישי קצה (דוגמאות)

- אין ציוד נבחר: normalizeEquipment מוסיף "none"; האפליקציה מציגה תרגילי משקל גוף.
- דמו נכנס ויוצא: isDemo=true; מחיקה אוטומטית ב-logout/exit; אין זליגת נתונים.
- התנגשויות פורטים (Expo): אם 8081 תפוס → אשר מעבר לפורט חלופי.

## תרשים זרימה טקסטואלי מקוצר

- Start
  -→ StorageCleanup
  -→ [Auth?]
  - כן → [Questionnaire Complete?] → כן → Generate Content → Main
    → לא → Unified Questionnaire → Save → Generate Content → Main
  - לא → Welcome/Auth - [Demo?] כן → DemoUser → Questionnaire Gate (כמו מעלה)
    לא → Login → Questionnaire Gate (כמו מעלה)
  - Main → Start Workout → Stats/Save → History → Main
  - Profile Update → Sync → Affect Plans/UI
  - Exit → If Demo: Cleanup → End

## הערות יישום

- להשתמש ב-ids מהשאלון האחוד בלבד; אל תייצר מזהים חדשים (למשל "free_weights", לא "barbell" כ-id חיצוני).
- להעדיף utils/formatters ו-equipementIconMapping להצגות טקסט/אייקון אחידות.
- console.warn ללוגים שגרתיים בהתאם להנחיות.
