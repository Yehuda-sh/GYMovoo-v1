# 🔧 Services Directory - GYMovoo

מדריך שירותי האפליקציה השונים / Application Services Guide

## 📋 Overview / סקירה כללית

תיקייה זו מכילה את כל השירותים הראשיים של האפליקציה, כולל שירותי API, לוגיקה עסקית, וניהול נתונים.

This directory contains all main application services, including API services, business logic, and data management.

---

## 🗂️ Service Files / קבצי שירותים

### 🔐 Authentication Services / שירותי אימות

- **`authService.ts`** - שירות אימות משתמשים / User authentication service

### 🏋️ Exercise & Workout Services / שירותי תרגילים ואימונים

- **`exerciseService.ts`** - ניהול מאגר התרגילים / Exercise database management
- **`nextWorkoutLogicService.ts`** - לוגיקה לקביעת האימון הבא / Next workout determination logic
- **`quickWorkoutGenerator.ts`** - יצירת אימונים מהירים / Quick workout generation
- **`workoutDataService.ts`** - ניהול נתוני אימונים / Workout data management
- **`workoutHistoryService.ts`** - ניהול היסטוריית אימונים עם התאמת מגדר / Workout history management with gender adaptation
- **`workoutHistoryService.example.ts`** - 📘 **דוגמאות שימוש בשירות היסטוריה** / History service usage examples

### 📊 Simulation & Demo Services / שירותי סימולציה ודמו

- **`realisticDemoService.ts`** - יצירת נתוני דמו מציאותיים / Realistic demo data generation
- **`workoutSimulationService.ts`** - סימולציה מציאותית של אימונים / Realistic workout simulation
- **`workoutSimulationService.example.ts`** - 📘 **דוגמאות שימוש בשירות הסימולציה** / Simulation service usage examples

### 📝 Questionnaire Services / שירותי שאלונים

- **`questionnaireService.ts`** - ניהול שאלונים / Questionnaire management
- **`scientificUserGenerator.ts`** - יצירת משתמשים לפי נתונים מדעיים / Scientific user data generation

### 🤖 AI & Scientific Services / שירותי AI ומדעיים

- **`scientificAIService.ts`** - שירות AI מבוסס מחקר מדעי / Scientific research-based AI service

### 🌐 External API Services / שירותי API חיצוניים

- **`wgerApiService.ts`** - שירות API של Wger / Wger API service
- **`wgerService.ts`** - שירות משופר ל-Wger / Enhanced Wger service

---

## 🆕 New Features / תכונות חדשות

### 🎯 WorkoutSimulationService Enhancements / שיפורי שירות הסימולציה

**Last Updated: 2025-07-30**

#### ✨ New Capabilities / יכולות חדשות:

- **🏃‍♂️ Gender Adaptation** - התאמת שמות תרגילים והודעות פידבק למגדר
- **📊 Enhanced Parameters** - פרמטרים מורחבים עם תמיכה במגדר ומטרות אישיות
- **🔄 Realistic Behavior** - סימולציה מציאותית של התנהגות משתמש
- **📈 6-Month History** - יצירה אוטומטית של 6 חודשי היסטוריית אימונים

#### 🛠️ Key Functions / פונקציות מרכזיות:

- `simulateRealisticWorkoutHistory()` - סימולציה מלאה של היסטוריית אימונים
- `adaptExerciseNameToGender()` - התאמת שמות תרגילים למגדר
- `generateGenderAdaptedNotes()` - יצירת הודעות פידבק מותאמות למגדר

#### 📚 Usage Examples / דוגמאות שימוש:

- See **`workoutSimulationService.example.ts`** for comprehensive usage examples
- עיין ב-**`workoutSimulationService.example.ts`** לדוגמאות שימוש מקיפות

### 🏆 WorkoutHistoryService Enhancements / שיפורי שירות ההיסטוריה

**Last Updated: 2025-07-30**

#### ✨ New Capabilities / יכולות חדשות:

- **👥 Gender-Adapted Messages** - הודעות ברכה והערות מותאמות למגדר המשתמש
- **📱 Enhanced Metadata** - מידע מורחב על מכשיר, גרסה ומקור האימון
- **🏋️ Exercise Name Adaptation** - התאמת שמות תרגילים למגדר בהיסטוריה
- **📊 Gender-Grouped Statistics** - סטטיסטיקות מקובצות לפי מגדר
- **🔍 Data Validation** - בדיקות תקינות מקיפות לנתוני היסטוריה

#### 🛠️ Key Functions / פונקציות מרכזיות:

- `saveWorkoutWithFeedback()` - שמירת אימון עם התאמת מגדר
- `getLatestCongratulationMessage()` - קבלת הודעות ברכה מותאמות
- `getGenderGroupedStatistics()` - סטטיסטיקות לפי מגדר
- `validateHistoryData()` - בדיקת תקינות נתונים

#### 📚 Usage Examples / דוגמאות שימוש:

- See **`workoutHistoryService.example.ts`** for comprehensive usage examples
- עיין ב-**`workoutHistoryService.example.ts`** לדוגמאות שימוש מקיפות

---

## 🔄 Service Integration / אינטגרציה בין שירותים

### 📊 Data Flow / זרימת נתונים

```
Questionnaire → UserStore → Simulation → Demo → History
שאלון → חנות משתמש → סימולציה → דמו → היסטוריה
```

### 🤝 Service Dependencies / תלויות בין שירותים

- **QuestionnaireService** → **UserStore** (user preferences)
- **WorkoutSimulationService** → **RealisticDemoService** (data storage)
- **ExerciseService** → **WgerApiService** (exercise database)
- **WorkoutHistoryService** → **WorkoutDataService** (data management)

---

## 🏗️ Architecture Patterns / דפוסי ארכיטקטורה

### 🎯 Service Layer Principles / עקרונות שכבת השירותים

1. **Single Responsibility** - כל שירות אחראי על תחום אחד
2. **Dependency Injection** - הזרקת תלויות באמצעות hooks
3. **Type Safety** - שימוש ב-TypeScript לבטיחות טיפוסים
4. **Error Handling** - טיפול מקיף בשגיאות
5. **RTL Support** - תמיכה מלאה בעברית וכיוון מימין לשמאל

### 📋 Code Quality Standards / תקני איכות קוד

- ✅ TypeScript strict mode enabled
- ✅ Comprehensive error handling
- ✅ Gender adaptation support
- ✅ RTL text support
- ✅ Scientific data validation
- ✅ Performance optimization
- ✅ Documentation in Hebrew & English

---

## 🚀 Usage Guidelines / הנחיות שימוש

### 💡 Best Practices / שיטות עבודה מומלצות

1. **Import Services Properly** / ייבוא שירותים נכון:

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

### 🔗 External APIs / APIs חיצוניים

- **Wger Exercise Database**: https://wger.de/api/v2/
- **Exercise Data**: Comprehensive exercise database with categories

---

_Last Updated: 2025-07-30_
_עודכן לאחרונה: 30 יולי 2025_
