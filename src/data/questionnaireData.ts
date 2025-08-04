/**
 * @file src/data/questionnaireData.ts
 * @brief ממשקים ונתונים משותפים למחלקות השאלון | Common interfaces and data for questionnaire components
 * @description הגדרות ממשקים משותפים לקומפוננטים שונים בשאלון | Shared interface definitions for various questionnaire components
 */

import { ImageSourcePropType } from "react-native";

// ================== BASE INTERFACES | ממשקים בסיסיים ==================

// Base option interface for all questionnaire components
// ממשק אפשרות בסיסי לכל קומפוננטי השאלון
export interface BaseOption {
  id: string;
  label: string;
  description?: string;
}

// Extended option with visual and metadata support
// אפשרות מורחבת עם תמיכה ויזואלית ומטא-דאטה
export interface OptionWithImage extends BaseOption {
  image?: ImageSourcePropType | string;
  isDefault?: boolean;
  isPremium?: boolean;
  category?: string;
  tags?: string[];
}

// Smart option with AI insights and equipment metadata
// אפשרות חכמה עם תובנות AI ומטא-דאטה של ציוד
export interface SmartOption extends OptionWithImage {
  metadata?: {
    equipment?: string[];
    [key: string]: unknown;
  };
  aiInsight?: string;
}

// ================== QUESTION TYPES | טיפוסי שאלות ==================

export type QuestionType =
  | "single"
  | "multiple"
  | "text"
  | "number"
  | "slider"
  | "height"
  | "weight";

export type SmartQuestionType = "single" | "multiple";

// ================== AI FEEDBACK | משוב חכם ==================

export interface AIFeedback {
  message: string;
  type: "positive" | "suggestion" | "warning" | "insight";
  icon: string;
}

// ================== SHARED METADATA | מטא-דאטה משותפת ==================

export interface QuestionMetadata {
  algorithmWeight?: number; // משקל בחישוב האלגוריתם (1-10)
  impactArea?: string[]; // תחומים שהשאלה משפיעה עליהם
  priority?: "critical" | "high" | "medium" | "low"; // עדיפות השאלה
  customIcon?: string; // אייקון מותאם עתידי
}
