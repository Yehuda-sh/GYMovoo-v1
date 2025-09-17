/\*\*

- @file src/services/workout/README.md
- @description תיעוד למערכת האימונים החדשה
  \*/

# מערכת יצירת תוכניות אימון - מבנה מאוחד

## סקירה

המערכת עברה שיפור כדי ליצור מבנה אחיד ומסודר לטיפול בשאלון ותוכניות אימון.

## מבנה הקבצים

```
src/services/workout/
├── WorkoutPlanGenerator.ts     # המחלקה הראשית ליצירת תוכניות אימון
├── types/
│   └── questionnaire.ts        # ממשקים אחידים לשאלון וציוד
└── README.md                   # התיעוד הזה
```

## השינויים העיקריים

### 1. ממשקים אחידים (`types/questionnaire.ts`)

- **`EquipmentType`** - טיפוסי ציוד מוגדרים היטב
- **`SelectedEquipment`** - מבנה לציוד שנבחר בשאלון
- **`UnifiedQuestionnaireAnswers`** - ממשק מאוחד לתשובות השאלון
- **`EQUIPMENT_MAPPING`** - מיפוי ברור מבחירות השאלון לטיפוסי ציוד

### 2. פונקציות מרכזיות

- **`mapSelectedEquipmentToTypes()`** - ממירה בחירות משתמש לטיפוסי ציוד
- **`isEquipmentAvailable()`** - בודקת זמינות ציוד
- **`getEquipmentDisplayNames()`** - מחזירה שמות תצוגה לציוד

### 3. עדכון WorkoutPlanGenerator

- פונקציית `extractEquipment()` משתמשת במערכת החדשה
- תמיכה הן בפורמט החדש והן בישן (לתאימות)
- הודעות debug ברורות יותר
- מיפוי ציוד מדויק יותר

## שימוש

### דוגמה לשימוש במערכת החדשה:

```typescript
import {
  mapSelectedEquipmentToTypes,
  getEquipmentDisplayNames,
} from "./types/questionnaire";

// נתוני הציוד מהשאלון
const selectedEquipment = {
  bodyweight_items: ["mat_available"],
  home_equipment: ["dumbbells", "resistance_bands"],
  gym_equipment: [],
};

// מיפוי לטיפוסי ציוד
const equipmentTypes = mapSelectedEquipmentToTypes(selectedEquipment);
console.log(equipmentTypes); // ["bodyweight", "yoga_mat", "dumbbells", "resistance_bands"]

// הצגת שמות לתצוגה
const displayNames = getEquipmentDisplayNames(equipmentTypes);
console.log(displayNames); // ["משקל גוף", "מזרון יוגה", "משקולות יד", "גומיות התנגדות"]
```

## יתרונות המבנה החדש

1. **אחידות** - מבנה קבוע וברור לכל הציוד
2. **בטיחות טיפוסים** - TypeScript מזהה שגיאות במידור
3. **קלות תחזוקה** - שינוי במקום אחד משפיע על כל המערכת
4. **הודעות דיבוג ברורות** - קל יותר לאתר בעיות
5. **תמיכה לאחור** - עובד עם קוד ישן

## פתרון בעיות נפוצות

### בעיה: "ציוד לא נמצא"

- ודא שהציוד מוגדר ב-`EQUIPMENT_MAPPING`
- בדוק שהשדות בשאלון מתאימים למבנה `SelectedEquipment`

### בעיה: "תוכנית ריקה"

- ודא שיש תרגילים עבור הציוד שנבחר
- בדוק שהמיפוי מ-UI לשאלון עובד תקין

### בעיה: "ציוד שגוי בתוכנית"

- ודא שפונקציית `extractEquipment()` מחזירה את הציוד הנכון
- בדוק את הלוגים לראות איך המיפוי עובד
