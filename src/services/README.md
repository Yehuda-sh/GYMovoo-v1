# 🔧 Services Directory - GYMovoo

מדריך שירותי האפליקציה השונים

## 📋 סקירה כללית

תיקייה זו מכילה את כל השירותים הראשיים של האפליקציה, כולל שירותי API, לוגיקה עסקית, וניהול נתונים.

---

## 🗂️ קבצי שירותים

### 🔐 שירותי אימות

- **`authService.ts`** - שירות אימות משתמשים עם תמיכה בGoogle Sign-In ומצבי פיתוח
  - `fakeGoogleSignIn()` - התחברות רגילה ללא שאלון
  - `fakeGoogleRegister()` - הרשמה חדשה ללא שאלון
  - `fakeGoogleSignInWithQuestionnaire()` - התחברות עם שאלון מלא (מצב פיתוח בלבד)

### 🏋️ שירותי תרגילים ואימונים

- **`exerciseService.ts`** - ניהול מאגר התרגילים
- **`nextWorkoutLogicService.ts`** - לוגיקה לקביעת האימון הבא
- **`quickWorkoutGenerator.ts`** - יצירת אימונים מהירים
- **`workoutDataService.ts`** - ניהול נתוני אימונים
- **`workoutHistoryService.ts`** - ניהול היסטוריית אימונים עם התאמת מגדר

### 📊 שירותי סימולציה ודמו

- **`realisticDemoService.ts`** - יצירת נתוני דמו מציאותיים עם התאמת מגדר וניתוח ביצועים
- **`workoutSimulationService.ts`** - סימולציה מציאותית של אימונים עם התאמות חכמות

### 📝 שירותי שאלונים

- **`questionnaireService.ts`** - ניהול שאלונים ותמיכה בהתאמה אישית מתקדמת

### 🤖 שירותי AI ומדעיים

- **`scientificAIService.ts`** - שירות AI מבוסס מחקר מדעי עם אלגוריתמים מתקדמים

### 🌐 שירותי API חיצוניים

- **`wgerApiService.ts`** - שירות API של Wger עם מיפוי חכם ומטמון מקומי

---

## 🆕 תכונות חדשות

### 🎯 שיפורי שירות הסימולציה WorkoutSimulationService

**עודכן לאחרונה: 2025-07-30**

#### ✨ יכולות חדשות:

- **🏃‍♂️ התאמת מגדר** - התאמת שמות תרגילים והודעות פידבק למגדר
- **📊 פרמטרים מורחבים** - פרמטרים מורחבים עם תמיכה במגדר ומטרות אישיות
- **🔄 התנהגות מציאותית** - סימולציה מציאותית של התנהגות משתמש
- **📈 היסטוריה של 6 חודשים** - יצירה אוטומטית של 6 חודשי היסטוריית אימונים
- **⏰ תזמון חכם** - התאמת זמני אימון לפי מגדר ורמת ניסיון
- **🎯 לוגיקה מתקדמת** - מוטיבציה דינמית ומתקדמת לפי ביצועים
- **💪 אימון מבוסס ניסיון** - התאמת משך ועצימות לפי רמת המשתמש

#### 🛠️ פונקציות מרכזיות:

- `simulateRealisticWorkoutHistory()` - סימולציה מלאה של היסטוריית אימונים
- `generateRealisticStartTime()` - זמני אימון מותאמים אישית לפי מגדר
- `updateSimulationParameters()` - התקדמות דינמית במוטיבציה וביצועים
- `calculateActualDuration()` - חישוב משך אימון לפי רמת ניסיון
- ~~`adaptExerciseNameToGender()` - **הועבר ל-genderAdaptation.ts**~~
- ~~`generateGenderAdaptedNotes()` - **הועבר ל-genderAdaptation.ts**~~

#### 📚 דוגמאות שימוש:

- ~~See **`workoutSimulationService.example.ts`**~~ - **קובץ הדוגמאות הוסר**
- השירות משתמש כעת בכלים מרכזיים מ-`src/utils/genderAdaptation.ts`

### 📊 שיפורי שירות הדמו RealisticDemoService

**עודכן לאחרונה: 2025-07-31**

#### ✨ יכולות חדשות:

- **🎭 פרופילי דמו מרובי מגדר** - 3 פרופילי גברים, 3 פרופילי נשים ופרופיל נייטרלי
- **🏋️ התאמת תרגילים חכמה** - התאמת שמות תרגילים אוטומטית לפי מגדר
- **📝 פידבק אדפטיבי** - הודעות פידבק מותאמות למגדר
- **🔧 בטיחות טיפוסים משופרת** - טיפוסי TypeScript מוגדרים במקום any
- **📊 ניתוח ביצועים** - ניתוח ביצועים חכם עם זיהוי מגמות
- **🎯 המלצות חכמות** - המלצות מבוססות נתונים לשיפור

#### 🛠️ פונקציות מרכזיות:

- `createRealisticDemoUser(gender?: UserGender)` - יצירת משתמש דמו עם אפשרות בחירת מגדר
- `adaptWorkoutToGender()` - התאמת אימון למגדר המשתמש
- `generateGenderBasedDemoData()` - יצירת נתוני דמו מבוססי מגדר
- `analyzePerformance()` - ניתוח ביצועים מתקדם עם אלגוריתמים חכמים
- `calculateConsistencyScore()` - חישוב ציון עקביות אימונים

#### 📚 דוגמאות שימוש:

```typescript
// יצירת משתמש דמו ספציפי למגדר
await realisticDemoService.createRealisticDemoUser("female");

// הוספת אימון עם התאמת מגדר אוטומטית
await realisticDemoService.addWorkoutSession(workoutData);
```

---

#### ✨ יכולות חדשות:

- **👥 הודעות מותאמות למגדר** - הודעות ברכה והערות מותאמות למגדר המשתמש
- **📱 מטאדאטה מורחבת** - מידע מורחב על מכשיר, גרסה ומקור האימון
- **🏋️ התאמת שמות תרגילים** - התאמת שמות תרגילים למגדר בהיסטוריה
- **📊 סטטיסטיקות לפי מגדר** - סטטיסטיקות מקובצות לפי מגדר
- **🔍 בדיקת תקינות נתונים** - בדיקות תקינות מקיפות לנתוני היסטוריה

#### 🛠️ פונקציות מרכזיות:

- `saveWorkoutWithFeedback()` - שמירת אימון עם התאמת מגדר
- `getLatestCongratulationMessage()` - קבלת הודעות ברכה מותאמות
- `getGenderGroupedStatistics()` - סטטיסטיקות לפי מגדר
- `validateHistoryData()` - בדיקת תקינות נתונים

#### 📚 דוגמאות שימוש:

- ~~See **`workoutHistoryService.example.ts`**~~ - **קובץ הדוגמאות הוסר**
- השירות משתמש כעת בכלים מרכזיים מ-`src/utils/genderAdaptation.ts`

---

## 🔄 אינטגרציה בין שירותים

### 📊 זרימת נתונים

```
Questionnaire → UserStore → Simulation → Demo → History
שאלון → חנות משתמש → סימולציה → דמו → היסטוריה
```

### 🤝 תלויות בין שירותים

- **QuestionnaireService** → **UserStore** (user preferences)
- **WorkoutSimulationService** → **RealisticDemoService** (data storage)
- **ExerciseService** → **WgerApiService** (exercise database)
- **WorkoutHistoryService** → **WorkoutDataService** (data management)

---

## 🏗️ דפוסי ארכיטקטורה

### 🎯 עקרונות שכבת השירותים

1. **Single Responsibility** - כל שירות אחראי על תחום אחד
2. **Dependency Injection** - הזרקת תלויות באמצעות hooks
3. **Type Safety** - שימוש ב-TypeScript לבטיחות טיפוסים
4. **Error Handling** - טיפול מקיף בשגיאות
5. **RTL Support** - תמיכה מלאה בעברית וכיוון מימין לשמאל

### 📋 תקני איכות קוד

- ✅ TypeScript strict mode enabled
- ✅ Comprehensive error handling
- ✅ Gender adaptation support
- ✅ RTL text support
- ✅ Scientific data validation
- ✅ Performance optimization
- ✅ Documentation in Hebrew & English

---

## 🚀 הנחיות שימוש

### 💡 שיטות עבודה מומלצות

1. **ייבוא שירותים נכון**:

```typescript
import { workoutSimulationService } from "@/services/workoutSimulationService";
import { questionnaireService } from "@/services/questionnaireService";
```

2. **Handle Errors Gracefully** / טיפול חכם בשגיאות:

```typescript
try {
  await workoutSimulationService.simulateRealisticWorkoutHistory();
} catch (error) {
  console.error("Simulation failed:", error);
}
```

3. **Use TypeScript Types** / שימוש בטיפוסי TypeScript:

```typescript
import type { SimulationParameters } from "@/services/workoutSimulationService";
```

### 🔧 Configuration / הגדרות

- All services are configured to work with the enhanced UserStore
- כל השירותים מוגדרים לעבוד עם ה-UserStore המשופר
- Services support both Hebrew RTL and English text
- השירותים תומכים בעברית RTL ובאנגלית

---

## 📈 Performance Notes / הערות ביצועים

### ⚡ Optimization Tips / טיפים לאופטימיזציה

- Services use lazy loading where possible
- השירותים משתמשים בטעינה איטית כשניתן
- Caching implemented for frequently accessed data
- מטמון מיושם לנתונים בגישה תכופה
- Batch operations for multiple API calls
- פעולות קבוצתיות למספר קריאות API

### 🎯 Memory Management / ניהול זיכרון

- Services properly clean up resources
- השירותים מנקים משאבים כראוי
- Event listeners are removed when not needed
- מאזיני אירועים מוסרים כשלא נדרשים

---

## 🔍 Debugging / איתור באגים

### 🛠️ Debug Tools / כלי איתור באגים

- Use browser dev tools to inspect service calls
- השתמש בכלי המפתח של הדפדפן לבדיקת קריאות השירות
- Check console for service error messages
- בדוק בקונסול הודעות שגיאה של השירותים
- Monitor network tab for API calls
- עקוב אחר הלשונית network לקריאות API

### 📊 Logging / רישום לוגים

- Services include comprehensive logging
- השירותים כוללים רישום מקיף
- Use different log levels (info, warn, error)
- השתמש ברמות לוג שונות (מידע, אזהרה, שגיאה)

---

## 📚 Additional Resources / משאבים נוספים

### 📖 Related Documentation / תיעוד קשור

- See `/docs/TECHNICAL_IMPLEMENTATION_GUIDE.md` for technical details
- See `/docs/PROGRESS_LOG.md` for development history
- See `workoutSimulationService.example.ts` for usage examples

### 🔗 External APIs

- **Wger Exercise Database**: https://wger.de/api/v2/
- **Exercise Data**: Comprehensive exercise database with categories

---

_Last Updated: 2025-07-30_
_עודכן לאחרונה: 30 יולי 2025_
