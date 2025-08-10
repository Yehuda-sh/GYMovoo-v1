# TODO – רה-ארגון תיעוד ומבנה (Docs / Types / Services)

עודכן: 2025-08-10

## 🎯 מטרות על

- הפחתת כפילות במסמכי שאלון / דמו / אופטימיזציה
- יצירת היררכיית תיעוד ברורה (Index יחיד + מדריכים תחומיים)
- הקשחת טיפוסים (Variants) ללא שבירת API
- סימון/הסרת קוד לא בשימוש (ציוד ישן, שירותי דמו כפולים)

---

## 1. Questionnaire System

- [ ] למזג:
  - FINAL_QUESTIONNAIRE_SOLUTION.md
  - QUESTIONNAIRE_DYNAMIC_FLOW_ANALYSIS.md
  - QUESTIONNAIRE_DETECTION_FIX.md
  - QUESTIONNAIRE_SERVICE_OPTIMIZATION_REPORT.md
  - REALISTIC_USER_QUESTIONNAIRE_FIX.md
- [ ] ליצור תיקייה: `docs/questionnaire/`
- [ ] קובץ ראשי: `QUESTIONNAIRE_SYSTEM.md`
  - סקירה + זרימת החלטות
  - מבנה unifiedQuestionnaire.ts
  - Data contracts: equipment, goals, availability, sessionDuration
  - מנגנון gender adaptation
- [ ] קובץ משני: `FLOW_REFERENCE.md` (דיאגרמה / שלבי החלטה)

## 2. Demo & Simulation

- [ ] לאסוף מידע מ:
  - REALISTIC_DEMO_FLOW_ANALYSIS.md
  - REALISTIC_USER_FIXES_REPORT.md
  - advancedDemoService.ts
  - realisticDemoService.ts
  - workoutSimulationService.ts
  - scientificAIService.ts
- [ ] ליצור: `docs/DEMO_SYSTEM_GUIDE.md`
  - מטרות דמו
  - שדות חובה (isDemo: true)
  - מחזור חיים (יצירה → שימוש → ניקוי)
  - שכבת התאמה ל-user/questionnaire
- [ ] החלטה: האם לאחד realistic + advanced לשירות אחד עם strategy

## 3. Reports ריכוז

- [ ] ליצור: `docs/reports/`
- [ ] להעביר קבצים:
  - BUG*FIXES*\*
  - OPTIMIZATION*REPORT*\*
  - WORKOUTDASHBOARD_OPTIMIZATION_REPORT.md
  - QUESTIONNAIRE_FILES_OPTIMIZATION_REPORT.md
  - UTILS_OPTIMIZATION_REPORT.md
- [ ] ליצור אינדקס: `docs/reports/INDEX.md`
  - טבלה: שם, תאריך, תחום (Questionnaire / Workout / Performance / UI)

## 4. Variants & Types

- [ ] types.ts – להוסיף JSDoc לכל Variant (איפה בשימוש בפועל)
- [ ] ליצור טיפוסים נגזרים:
  - WorkoutHeaderVariant
  - WorkoutDashboardVariant
  - NextExerciseBarVariant
  - WorkoutStatusBarVariant
- [ ] לסמן `pills` כ-Experimental / לשקול הסרה אם לא יתווסף שימוש נוסף
- [ ] בדיקת בנייה לאחר ההקשחה

## 5. Equipment Data

- [x] grep לשימושים ב-`equipmentData_new` (אין שימוש)
- [x] מחיקה: הקובץ היה ריק והוסר (`equipmentData_new.ts`)
- [ ] אם יש הבדלי מבנה עתידיים – לתעד ב-`docs/EQUIPMENT_TOOLS_GUIDE.md`

## 6. Services Audit

- [ ] טבלה (services → אחריות / תלות / נק' שיפור)
- [ ] לבדוק חפיפה בין simulationService ו-scientificAIService
- [ ] אפשרות: יצירת orchestrator יחיד (WorkoutLogicOrchestrator)

## 7. Cleanup Root

- [ ] להעביר כל קבצי _\_REPORT / _\_FIX / \*\_ANALYSIS ל-`docs/reports/`
- [ ] להשאיר README_ROOT נקי + הפניה לאינדקס דוחות

## 8. README.md תחזוקה

- [ ] הוספת סקריפט אוטומטי לעדכון סטטיסטיקות (optional)
- [ ] הוספת תג "(dynamic)" לצד מספרים משתנים

## 9. Accessibility & RTL Pass

- [ ] להריץ `npm run check:accessibility`
- [ ] לבדוק שהוספת רכיבים חדשים לא פגעה בכיסוי
- [ ] לוודא שאין טקסטים ללא `writingDirection: 'rtl'` בממשקים עבריים

## 10. Automation (Optional Later)

- [ ] ליצור סקריפט Node: `scripts/generateDocIndex.js` לעדכון INDEX אוטומטי
- [ ] ליצור סקריפט בדיקה: וידוא שאין קובץ MD > 500 שורות בלי חלוקה

---

## סדר ביצוע מוצע (גלים)

1. Reports Migration + README הפניה
2. Questionnaire Merge
3. Demo Merge + Services Audit
4. Variants הקשחה + TypeScript check
5. Equipment החלטה
6. Orchestrator (אם מאושר)
7. אוטומציית דוחות

## KPI הצלחה

- 0 קבצי MD כפולים
- < 1 קובץ שירות > 1200 שורות (אחרי פיצול הגיוני)
- זמן ריצת `npm run type-check` לא עולה משמעותית
- README קריא < 600 שורות (כעת: ~500+) לאחר דילול דוחות

---

## הערות פתוחות

- האם להוסיף בדיקת Snapshot Docs (CI) למניעת סטייה?
- האם לעבור ל-monorepo בטווח עתידי? (כרגע אין צורך)
