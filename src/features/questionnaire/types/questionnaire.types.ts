/**
 * @file src/features/questionnaire/types/questionnaire.types.ts
 * @description Types for the questionnaire feature
 */

import { ImageSourcePropType } from "react-native";

export const QUESTIONNAIRE_VERSION = "2.3" as const;

// Basic types
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

// Interfaces for questionnaire data
export interface QuestionnaireAnswers {
  // Personal Info
  gender?: string;
  age?: string | number;
  weight?: string | number;
  height?: string | number;

  // Fitness Profile
  fitness_goal?: string | string[];
  experience_level?: string;
  fitnessLevel?: string;
  goals?: string[];

  // Workout Preferences
  workout_location?: string;
  availability?: string | string[];
  workout_duration?: string;
  equipment?: string[];
  sessionDuration?: string;
  workoutLocation?: string;

  // Equipment specific fields
  bodyweight_equipment?: string[];
  home_equipment?: string[];
  gym_equipment?: string[];

  // Additional
  diet_preferences?: string | string[];
  health_conditions?: string[];
  nutrition?: string[];

  // Allow additional fields
  [key: string]: unknown;
}

export interface QuestionnaireData {
  answers?: QuestionnaireAnswers;
  metadata?: {
    completedAt: string;
    version: string;
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

// Navigation types
export type QuestionnaireStackParamList = {
  QuestionnaireScreen: {
    stage?: "profile" | "training";
  };
};

// Status interface
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
