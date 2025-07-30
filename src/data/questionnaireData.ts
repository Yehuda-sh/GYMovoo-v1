/**
 * @file src/data/questionnaireData.ts
 * @brief ממשקים ונתונים משותפים למחלקות השאלון | Common interfaces and data for questionnaire components
 * @description הגדרות ממשקים משותפים לקומפוננטים שונים בשאלון | Shared interface definitions for various questionnaire components
 */

import { ImageSourcePropType } from "react-native";

// Shared interface for options with images used across questionnaire components
// ממשק משותף לאפשרויות עם תמונות המשמש בקומפוננטים שונים בשאלון
export interface OptionWithImage {
  id: string;
  label: string;
  image?: ImageSourcePropType | string;
  description?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  category?: string;
  tags?: string[];
}
