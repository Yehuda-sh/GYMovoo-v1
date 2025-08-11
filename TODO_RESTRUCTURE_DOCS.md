# TODO – רה-ארגון תיעוד ומבנה (Docs / Types / Services)

עודכן: 2025-08-11 (סטטוס מעודכן)

## 🎯 מטרות על

- הפחתת כפילות במסמכי שאלון / דמו / אופטימיזציה
- יצירת היררכיית תיעוד ברורה (Index יחיד + מדריכים תחומיים)
- הקשחת טיפוסים (Variants) ללא שבירת API
- סימון/הסרת קוד לא בשימוש (ציוד ישן, שירותי דמו כפולים)

---

## 1. Questionnaire System

- [x] למזג: ✅ **הושלם חלקית** - קבצים קיימים אך מפוזרים:
  - FINAL_QUESTIONNAIRE_SOLUTION.md
  - QUESTIONNAIRE_DYNAMIC_FLOW_ANALYSIS.md (docs/)
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

- [x] ✅ **הושלם** - Demo Services הופרדו ל-`src/services/demo/`:
  - demoUserService.ts
  - demoWorkoutService.ts
  - demoHistoryService.ts
  - demoWorkoutDurationService.ts
- [x] ✅ **הושלם** - קבצים ישנים הוסרו:
  - ~~realisticDemoService.ts~~ → demoUserService.ts
  - ~~advancedDemoService.ts~~ → הוסר/מוזג
- [ ] ליצור: `docs/DEMO_SYSTEM_GUIDE.md`
  - מטרות דמו
  - שדות חובה (isDemo: true)
  - מחזור חיים (יצירה → שימוש → ניקוי)
  - שכבת התאמה ל-user/questionnaire

## 3. Reports ריכוז

- [x] ✅ **בתהליך** - ליצור: `docs/reports/` (קיים חלקית)
- [x] ✅ **חלקית** - הועברו כמה קבצים:
  - BUG_FIXES_HistoryScreen_2025-08-06.md ✅
  - BUG_FIXES_OPTIMIZATION_SUMMARY.md ✅
  - OPTIMIZATION_REPORT_SetRow_2025-08-05.md ✅
  - OPTIMIZATION_REPORT_HistoryScreen_2025-08-06.md ✅
- [ ] **נותרו בשורש**: להעביר עוד ~40 קבצי REPORT/FIX
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

- [ ] **גבוהה עדיפות**: להעביר כל קבצי _\_REPORT / _\_FIX / \*\_ANALYSIS ל-`docs/reports/`
  - כ-40 קבצים נותרו בשורש הפרויקט
- [ ] להשאיר README_ROOT נקי + הפניה לאינדקס דוחות
- [x] ✅ validateProductionDemoSeparation.js - עודכן ונשמר (כלי חיוני)

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

## סדר ביצוע מוצע (גלים) - עדכון עדיפויות

1. **🔥 דחוף**: Reports Migration (40+ קבצים בשורש) + README הפניה
2. Questionnaire Merge (5+ קבצים)
3. ✅ ~~Demo Merge~~ (הושלם) + Services Audit
4. Variants הקשחה + TypeScript check
5. ✅ ~~Equipment החלטה~~ (הושלם)
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

---

## 📊 סטטוס הישגים (נוסף ב-2025-08-11)

### ✅ הושלם:

- Demo Services הפרדה ל-`src/services/demo/`
- Equipment cleanup (הסרת קבצים מיותרים)
- חלק מ-Reports הועברו ל-`docs/reports/`
- Validation tool (validateProductionDemoSeparation.js)

### 🔄 בתהליך:

- Reports migration (נותרו ~40 קבצים בשורש)
- Questionnaire documentation merge

### ⏳ ממתין:

- Types variants הקשחה
- Services orchestrator
- אוטומציה
