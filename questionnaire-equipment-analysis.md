# 📋 ניתוח מבנה השאלון ורשימת הציוד ב-GYMovoo

## 🧩 מבנה השאלון

בהתבסס על השאלות והתשובות, להלן ניתוח מפורט של מבנה השאלון:

### 📊 מאפייני השאלון

1. **מבנה כללי**:
   - עד 20 שאלות
   - כל השאלות מופיעות ברצף אחד (ללא חלוקה לעמודים)
   - כל השאלות הן חובה
   - השאלון דינמי לגמרי ומשתנה לפי התשובות

2. **סוגי שאלות**:
   - שילוב של שאלות בחירה יחידה ומרובה (רדיו וצ'קבוקס)
   - שילוב של טקסט ותמונות/אייקונים בשאלות

3. **שמירת נתונים**:
   - נשמר ב-AsyncStorage מקומי
   - ניתן להמשיך את השאלון אם עוצרים באמצע
   - מסתנכרן עם השרת בעת הרשמה

4. **עדכון לאחר השלמה**:
   - במצבים מיוחדים בלבד (שינוי ציוד זמין או מצב רפואי)
   - רק למשתמשי פרימיום
   - טאב מיוחד לשינוי במסך הפרופיל

### 📝 נושאי השאלון

1. **נושאים עיקריים**:
   - מטרות אימון
   - ציוד זמין
   - לוח זמנים והעדפות אישיות
   - סוג דיאטה כללי (צמחוני, קטו וכו')
   - מגבלות רפואיות בסיסיות

2. **לוח זמנים**:
   - שאלות על מספר ימים בשבוע
   - אין שאלות על שעות ספציפיות

3. **מגבלות ואזורי כאב**:
   - שאלה כללית על קיום מגבלות
   - למשתמשים שמציינים כאבים - רשימת אזורי כאב בגוף לבחירה

4. **רמת ניסיון**:
   - רמת ניסיון כללית בלבד

5. **מעקב תקופתי**:
   - שאלון ראשוני ושאלות מעקב תקופתיות

## 🏋️ רשימת הציוד במערכת

בהתבסס על הקוד, מערכת GYMovoo מכילה רשימת ציוד מקיפה המחולקת לקטגוריות:

### 🏠 ציוד ביתי (HOME_EQUIPMENT)

```typescript
// 20 פריטים הכי נפוצים לאימון ביתי
export const HOME_EQUIPMENT: Equipment[] = [
  {
    id: "none",
    label: "ללא ציוד",
    image: require("../../assets/bodyweight.png"),
    description: "אימונים עם משקל גוף בלבד",
    isDefault: true,
    category: "home",
    tags: ["bodyweight", "no equipment", "ללא ציוד", "משקל גוף"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "dumbbells",
    label: "דמבלים",
    image: require("../../assets/dumbbells.png"),
    description: "משקולות יד במשקלים שונים",
    category: "home",
    tags: ["dumbbells", "weights", "דמבלים", "משקולות"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "resistance_bands",
    label: "רצועות התנגדות",
    image: require("../../assets/resistance_bands.png"),
    description: "רצועות גומי להתנגדות",
    category: "home",
    tags: ["resistance bands", "elastic", "רצועות", "גומי"],
    algorithmWeight: 9,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  // ... פריטים נוספים
];
```

### 💪 ציוד חדר כושר (GYM_EQUIPMENT)

```typescript
// 20 פריטים הכי נפוצים בחדר כושר
export const GYM_EQUIPMENT: Equipment[] = [
  {
    id: "squat_rack",
    label: "מתקן סקוואט",
    image: require("../../assets/squat_rack.png"),
    description: "מתקן לתרגילי סקוואט ובר",
    category: "gym",
    tags: ["squat rack", "power rack", "סקוואט", "מתקן"],
    algorithmWeight: 10,
    recommendedFor: ["intermediate", "advanced"],
  },
  {
    id: "bench_press",
    label: "מכונת חזה",
    image: require("../../assets/bench.png"),
    description: "ספסל ומתקן ללחיצת חזה",
    category: "gym",
    tags: ["bench press", "chest", "חזה", "לחיצה"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  // ... פריטים נוספים
];
```

### 🏃‍♂️ ציוד קרדיו (CARDIO_EQUIPMENT)

```typescript
// 20 פריטים הכי נפוצים לאימוני קרדיו
export const CARDIO_EQUIPMENT: Equipment[] = [
  {
    id: "treadmill",
    label: "הליכון",
    image: require("../../assets/treadmill.png"),
    description: "מכונת הליכה וריצה",
    category: "cardio",
    tags: ["treadmill", "running", "הליכון", "ריצה"],
    algorithmWeight: 10,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "stationary_bike",
    label: "אופניים נייחים",
    image: require("../../assets/bike.png"),
    description: "אופניים לאימון קרדיו",
    category: "cardio",
    tags: ["bike", "cycling", "אופניים", "רכיבה"],
    algorithmWeight: 9,
    recommendedFor: ["beginner", "intermediate", "advanced"],
  },
  // ... פריטים נוספים
];
```

### 📊 מבנה הטיפוס של ציוד

```typescript
export interface Equipment {
  id: string; // מזהה ייחודי
  label: string; // שם לתצוגה
  image: any; // תמונה/אייקון
  description: string; // תיאור קצר
  category: "home" | "gym" | "cardio"; // קטגוריה
  tags: string[]; // תגיות לחיפוש
  algorithmWeight: number; // משקל אלגוריתמי להמלצות (1-10)
  recommendedFor: ("beginner" | "intermediate" | "advanced")[]; // רמות המלצה
  isDefault?: boolean; // האם זה ברירת מחדל
  isPremium?: boolean; // האם זה ציוד פרימיום
}
```

### 🔄 חלוקה לקטגוריות

הציוד מחולק לקטגוריות שונות לפי סוג אימון:

```typescript
export const EQUIPMENT_TYPES = {
  STRENGTH: [
    "dumbbells",
    "barbell",
    "kettlebell",
    "squat_rack",
    "bench_press",
    "free_weights",
  ],
  CARDIO: [
    "treadmill",
    "stationary_bike",
    "rowing_machine",
    "jump_rope",
    "battle_ropes",
  ],
  FLEXIBILITY: ["yoga_mat", "foam_roller", "resistance_bands"],
  FUNCTIONAL: [
    "kettlebell",
    "suspension_trainer",
    "medicine_ball",
    "battle_ropes",
  ],
};
```

### 🏠 דרישות מקום

הציוד מחולק גם לפי דרישות מקום:

```typescript
export const SPACE_REQUIREMENTS = {
  MINIMAL: ["none", "resistance_bands", "jump_rope", "foam_roller"],
  SMALL: ["dumbbells", "kettlebell", "yoga_mat", "exercise_ball"],
  MEDIUM: ["pull_up_bar", "bench", "suspension_trainer"],
  LARGE: ["barbell", "squat_rack", "treadmill", "rowing_machine"],
};
```

## 🔄 שירות השאלון והמלצות ציוד

### 📊 QuestionnaireService

שירות השאלון מספק פונקציונליות לניהול נתוני השאלון והמלצות ציוד:

```typescript
class QuestionnaireService {
  /**
   * קבלת רשימת הציוד הזמין
   */
  async getAvailableEquipment(): Promise<string[]> {
    const prefs = await this.getUserPreferences();

    // בדיקת שדות ציוד ראשיים
    const primaryEquipment = prefs?.equipment || [];
    const homeEquipment = prefs?.home_equipment || [];

    // עיבוד מתקדם של נתוני השאלון
    const dynamicEquipment = prefs
      ? QuestionnaireService.extractEquipmentFromQuestionnaire(prefs)
      : [];

    // איחוד כל מקורות הציוד
    const allEquipment = [
      ...primaryEquipment,
      ...homeEquipment,
      ...dynamicEquipment,
    ];

    // נרמול ועיבוד שמות ציוד לפי המערכת הפנימית
    // ...

    return finalEquipment;
  }

  /**
   * חילוץ ציוד מנתוני השאלון
   */
  private static extractEquipmentFromQuestionnaire(
    prefs: QuestionnaireMetadata
  ): string[] {
    const extracted: string[] = [];

    // חילוץ לפי מיקום אימון
    if (
      prefs.workout_location === "בבית" ||
      prefs.workout_location === "home"
    ) {
      extracted.push("bodyweight", "yoga_mat");
    } else if (
      prefs.workout_location === "חדר כושר" ||
      prefs.workout_location === "gym"
    ) {
      extracted.push("dumbbells", "barbell", "cable_machine", "treadmill");
    }

    // חילוץ לפי מטרות אימון
    if (
      prefs.fitness_goal?.includes("בניית שריר") ||
      prefs.fitness_goal?.includes("muscle")
    ) {
      extracted.push("dumbbells", "barbell");
    }

    // ... חילוץ נוסף לפי העדפות אחרות

    return extracted;
  }
}
```

### 🧠 אלגוריתם המלצות ציוד חכם

המערכת כוללת אלגוריתם מתקדם להמלצת ציוד:

```typescript
export function getSmartEquipmentRecommendations(userProfile: {
  experience: "beginner" | "intermediate" | "advanced";
  environment: "home" | "gym" | "both";
  budget: "low" | "medium" | "high";
  space: "minimal" | "small" | "medium" | "large";
  workoutTypes: ("strength" | "cardio" | "flexibility" | "functional")[];
}): Equipment[] {
  // סינון לפי רמת ניסיון
  let candidates = ALL_EQUIPMENT.filter((eq) =>
    eq.recommendedFor?.includes(userProfile.experience)
  );

  // סינון לפי סביבת אימון
  if (userProfile.environment !== "both") {
    candidates = candidates.filter(
      (eq) =>
        eq.category === userProfile.environment || eq.category === "cardio"
    );
  }

  // סינון לפי תקציב
  if (userProfile.budget === "low") {
    candidates = candidates.filter((eq) => !eq.isPremium);
  }

  // סינון לפי דרישות מקום
  const spaceBasedIds = {
    minimal: ["none", "resistance_bands", "jump_rope", "foam_roller"],
    small: ["dumbbells", "yoga_mat", "kettlebell", "pull_up_bar"],
    medium: ["exercise_ball", "suspension_trainer", "barbell", "bench"],
    large: ["squat_rack", "treadmill", "rowing_machine", "smith_machine"],
  };

  // ... סינון נוסף וחישוב ציון תאימות

  // מיון לפי משקל אלגוריתמי
  return candidates
    .sort((a, b) => (b.algorithmWeight || 0) - (a.algorithmWeight || 0))
    .slice(0, 8); // 8 ההמלצות המובילות
}
```

## 📝 מבנה נתונים מוצע לטיפוס QuestionnaireData

בהתבסס על הניתוח, להלן מבנה מומלץ לטיפוס `QuestionnaireData`:

```typescript
export interface QuestionnaireData {
  // מטרות ורמת ניסיון
  goals: TrainingGoal[]; // מטרות אימון
  experience: ExperienceLevel; // רמת ניסיון

  // לוח זמנים
  schedule: {
    daysPerWeek: number; // מספר ימים בשבוע
    timePerWorkout: number; // זמן לאימון (בדקות)
  };

  // ציוד זמין
  location: "home" | "gym" | "both"; // מיקום אימון
  equipment: string[]; // רשימת מזהי ציוד זמין

  // העדפות תזונה
  diet?: DietType; // סוג דיאטה כללי

  // מגבלות רפואיות
  healthLimitations: boolean; // האם יש מגבלות
  painAreas?: BodyArea[]; // אזורי כאב (אם יש)

  // נתונים נוספים
  completionDate: Date; // תאריך השלמת השאלון
  version: string; // גרסת השאלון

  // נתוני המשך מעקב
  followUpResponses?: {
    date: Date;
    responses: Record<string, any>; // תשובות מעקב תקופתיות
  }[];
}

export type TrainingGoal =
  | "muscle"
  | "strength"
  | "weight_loss"
  | "endurance"
  | "health";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type DietType = "none" | "vegetarian" | "vegan" | "keto" | "paleo";
export type BodyArea =
  | "shoulder"
  | "back"
  | "knee"
  | "elbow"
  | "wrist"
  | "ankle"
  | "hip"
  | "neck";
```

## 🔄 טיפול באיזורי כאב והמלצות התאמה

בהתאם לבקשתך, להלן מבנה מוצע לטיפול באזורי כאב והתאמת תרגילים:

```typescript
export interface BodyPainArea {
  id: string; // מזהה אזור כאב
  label: string; // שם לתצוגה
  affectedMuscles: string[]; // שרירים מושפעים
  avoidExercises: string[]; // תרגילים שיש להימנע מהם
  alternativeExercises: {
    exerciseId: string; // תרגיל חלופי
    intensity: "low" | "medium" | "high"; // עצימות מומלצת
  }[];
}

export const BODY_PAIN_AREAS: BodyPainArea[] = [
  {
    id: "lower_back",
    label: "גב תחתון",
    affectedMuscles: ["erector_spinae", "quadratus_lumborum"],
    avoidExercises: ["deadlift", "barbell_row", "sit_up"],
    alternativeExercises: [
      { exerciseId: "bird_dog", intensity: "low" },
      { exerciseId: "plank", intensity: "medium" },
      { exerciseId: "cat_cow", intensity: "low" },
    ],
  },
  {
    id: "knee",
    label: "ברכיים",
    affectedMuscles: ["quadriceps", "hamstrings"],
    avoidExercises: ["squat", "lunge", "jump"],
    alternativeExercises: [
      { exerciseId: "leg_extension", intensity: "low" },
      { exerciseId: "seated_leg_curl", intensity: "low" },
      { exerciseId: "hip_thrust", intensity: "medium" },
    ],
  },
  // ... אזורי כאב נוספים
];
```

זה יאפשר למערכת להמליץ על תרגילים חלופיים או לדלג על תרגילים מסוימים בהתאם לאזורי הכאב שהמשתמש ציין בשאלון.
