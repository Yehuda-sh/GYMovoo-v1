/**
 * @file src/features/questionnaire/types/questionnaire.types.ts
 * @description Types for the questionnaire feature
 */

import { ImageSourcePropType } from "react-native";

export const QUESTIONNAIRE_VERSION = "2.3" as const;

// ===== Basic UI types =====

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  image?: ImageSourcePropType | string;
  isDefault?: boolean;
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  question: string;
  helpText?: string;
  icon: string;
  type: "single" | "multiple";
  options: QuestionOption[];
  required?: boolean;
}

export interface QuestionnaireAnswer {
  questionId: string;
  answer: QuestionOption | QuestionOption[];
  timestamp: string;
}

export interface QuestionnaireResults {
  answers: QuestionnaireAnswer[];
  completedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
}

// ===== Data layer types =====
// שימו לב: יש תמיכה בשמות שדות היסטוריים וחדשים במקביל כדי לשמור תאימות.
// הימנעות מהצבה מפורשת של undefined – אם שדה לא קיים פשוט לא שולחים אותו.

export interface QuestionnaireAnswers {
  // Personal Info
  gender?: string; // e.g. "male" | "female" | "prefer_not_to_say"
  age?: string | number; // טווח/מספר מומר בהמשך
  weight?: string | number;
  height?: string | number;

  // Fitness Profile
  fitness_goal?: string | string[]; // legacy or single id
  experience_level?: string; // "beginner" | "intermediate" | "advanced"
  fitnessLevel?: string; // new camelCase
  goals?: string[]; // new: list of goals

  // Workout Preferences
  workout_location?: string; // legacy snake_case
  workoutLocation?: string; // new camelCase
  availability?: number | string | string[]; // תומך גם במספר (ימים לשבוע) וגם במזהי אפשרויות
  workout_duration?: string; // legacy: minutes string, e.g. "45"
  session_duration?: string; // legacy duplicate (לא בשימוש חדש)
  sessionDuration?: string; // new camelCase (e.g. "30_45_min")
  equipment?: string[]; // normalized equipment list
  equipment_available?: string[]; // legacy alt name used by generator fallback

  // Equipment specific fields
  bodyweight_equipment?: string[];
  home_equipment?: string[];
  gym_equipment?: string[];

  // Additional
  diet_preferences?: string | string[];
  health_conditions?: string[];
  nutrition?: string[];

  // Allow additional future fields safely
  [key: string]: unknown;
}

export interface QuestionnaireData {
  answers?: QuestionnaireAnswers;
  metadata?: {
    completedAt?: string;
    version?: string;
    sessionId?: string;
    completionTime?: number;
    questionsAnswered?: number;
    totalQuestions?: number;
    deviceInfo?: {
      platform?: string;
      screenWidth?: number;
      screenHeight?: number;
    };
  };
}

// ===== Navigation types =====

// ===== Status type (derived) =====

export interface QuestionnaireStatus {
  /** האם יש נתוני שאלון בכלל */
  hasData: boolean;
  /** האם השאלון הושלם במלואו */
  isComplete: boolean;
  /** האם השאלון הותחל */
  isStarted: boolean;
  /** האם השאלון חלקי */
  isPartial: boolean;
  /** מקור הנתונים (smart/legacy/basic) */
  dataSource?: "smart" | "legacy" | "basic" | "none";
  /** תאריך השלמה */
  completedAt?: string | undefined;
}
