/**
 * טיפוסים מרכזיים למשתמש
 * @file src/core/types/user.types.ts
 * @description הגדרות טיפוס מרכזיות למשתמש וכל המידע הקשור אליו
 */

/**
 * ספקי אימות נתמכים
 */
export type AuthProvider = "google" | "manual";

/**
 * מטרות אימון אפשריות
 */
export type TrainingGoal =
  | "muscle"
  | "strength"
  | "weight_loss"
  | "endurance"
  | "health";

/**
 * רמות ניסיון
 */
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

/**
 * סוגי דיאטה
 */
export type DietType = "none" | "vegetarian" | "vegan" | "keto" | "paleo";

/**
 * סוגי מנוי
 */
export type SubscriptionType = "free" | "premium" | "trial";

/**
 * תכונות מנוי
 */
export type SubscriptionFeature =
  | "customWorkouts"
  | "cloudSync"
  | "advancedStats"
  | "videoGuides";

/**
 * מדידת משקל או מידות גוף עם תאריך
 */
export interface BodyMeasurementRecord {
  /** ערך המדידה */
  value: number;
  /** תאריך המדידה */
  date: Date;
  /** הערות נוספות */
  notes?: string;
}

/**
 * מידע על מנוי
 */
export interface Subscription {
  /** סוג המנוי */
  type: SubscriptionType;
  /** תאריך התחלה */
  startDate: Date;
  /** תאריך סיום (אם יש) */
  endDate?: Date;
  /** האם המנוי פעיל */
  active: boolean;
  /** תכונות הזמינות במנוי */
  features: SubscriptionFeature[];
}

/**
 * מידע מטא-דאטה על המשתמש
 */
export interface UserMetadata {
  /** תאריך הרשמה */
  registrationDate: Date;
  /** תאריך התחברות אחרון */
  lastLoginDate: Date;
  /** גרסת האפליקציה האחרונה שנוצרה */
  appVersion?: string;
}

/**
 * מדידות גוף של המשתמש
 */
export interface BodyMeasurements {
  /** היסטוריית מדידות משקל */
  weight: BodyMeasurementRecord[];
  /** גובה המשתמש */
  height?: number;
  /** מדידות חזה */
  chest?: BodyMeasurementRecord[];
  /** מדידות מותן */
  waist?: BodyMeasurementRecord[];
  /** מדידות זרועות */
  arms?: BodyMeasurementRecord[];
  /** מדידות רגליים */
  legs?: BodyMeasurementRecord[];
}

/**
 * הישג אימון
 */
export interface Achievement {
  /** מזהה ההישג */
  id: string;
  /** שם ההישג */
  name: string;
  /** תיאור ההישג */
  description: string;
  /** תאריך השגה */
  achievedDate: Date;
  /** אייקון ההישג */
  icon?: string;
}

/**
 * ממשק משתמש מרכזי
 * @interface User
 */
export interface User {
  /** מזהה ייחודי למשתמש */
  id: string;
  /** כתובת אימייל */
  email: string;
  /** שם המשתמש */
  name: string;
  /** ספק האימות - כרגע תמיכה בגוגל ואימות ידני */
  provider: AuthProvider;
  /** URL לתמונת פרופיל */
  avatar?: string;

  /** האם המשתמש השלים שאלון */
  hasQuestionnaire: boolean;
  /** נתוני השאלון של המשתמש - כל התשובות המלאות */
  questionnaireData?: QuestionnaireData;

  /** סטטיסטיקות אימון מצטברות */
  trainingStats: TrainingStats;
  /** היסטוריית אימונים מלאה עם פרטים */
  activityHistory: WorkoutHistory[];

  /** פרטי מנוי - קובע אילו תכונות זמינות */
  subscription: Subscription;

  /** מטא-דאטה - תאריכי הרשמה וכניסה אחרונה */
  metadata: UserMetadata;

  /** מדידות גוף כולל היסטוריה */
  bodyMeasurements: BodyMeasurements;

  /** מטרות אימון - מבוססות על נתוני השאלון */
  trainingGoals: TrainingGoal[];

  /** הישגים שהושגו */
  achievements: Achievement[];
}

// הייבוא מותנה בכך שהקבצים האחרים כבר קיימים - צריך לפצל את התלויות
import { QuestionnaireData } from "./questionnaire.types";
import { TrainingStats, WorkoutHistory } from "./workout.types";
