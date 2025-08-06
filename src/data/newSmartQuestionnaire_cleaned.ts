/**
 * @file src/data/newSmartQuestionnaire.ts
 * @brief שאלון חכם מותאם עם AI ובחירה דינמית עם ייבוא ציוד נפרד
 * @description Dynamic questionnaire system with imported equipment data
 */

import { ImageSourcePropType } from "react-native";
import {
  BODYWEIGHT_EQUIPMENT_OPTIONS,
  HOME_EQUIPMENT_OPTIONS,
  GYM_EQUIPMENT_OPTIONS,
  extractEquipmentFromAnswers,
} from "./smartQuestionnaireEquipment";

// ================== INTERFACES | ממשקים ==================

export interface BaseOption {
  id: string;
  label: string;
  description?: string;
}

export interface OptionWithImage extends BaseOption {
  image?: ImageSourcePropType | string;
  isDefault?: boolean;
  isPremium?: boolean;
  category?: string;
  tags?: string[];
}

export interface SmartOption extends OptionWithImage {
  metadata?: {
    equipment?: string[];
    [key: string]: unknown;
  };
  aiInsight?: string;
}

export type SmartQuestionType = "single" | "multiple";

export interface AIFeedback {
  message: string;
  type: "positive" | "suggestion" | "warning" | "insight";
  icon: string;
}

export interface QuestionMetadata {
  algorithmWeight?: number;
  impactArea?: string[];
  priority?: "critical" | "high" | "medium" | "low";
  customIcon?: string;
}

export interface SmartQuestion extends QuestionMetadata {
  id: string;
  title: string;
  subtitle?: string;
  question: string;
  type: SmartQuestionType;
  icon: string;
  category: "essential";
  options?: SmartOption[];
  required: boolean;
  helpText?: string;

  aiLogic: {
    generateFeedback: (answer: any, previousAnswers?: any) => AIFeedback;
    influenceNextQuestions?: (answer: any) => string[];
  };
}

// ================== AI FEEDBACK GENERATOR | מחולל משוב AI ==================

const AIFeedbackGenerator = {
  positive: (message: string): AIFeedback => ({
    message,
    type: "positive",
    icon: "✨",
  }),

  suggestion: (message: string): AIFeedback => ({
    message,
    type: "suggestion",
    icon: "💡",
  }),

  insight: (message: string): AIFeedback => ({
    message,
    type: "insight",
    icon: "🎯",
  }),
};

// ================== QUESTIONNAIRE INTRO | הקדמת השאלון ==================

export const SMART_QUESTIONNAIRE_INTRO = {
  title: "שאלון התאמה חכם",
  description:
    "השאלון הבא יעזור לנו להתאים לך תוכנית אימונים אישית לפי המקום, הציוד והמטרות שלך. ענה בכנות ובפשטות!",
};

// ================== SMART QUESTIONNAIRE | השאלון החכם ==================

export const NEW_SMART_QUESTIONNAIRE: SmartQuestion[] = [
  // שאלה ראשונה - איפה תתאמן
  {
    id: "training_location",
    title: "איפה תתאמן?",
    subtitle: "בחר את המקום המרכזי לאימונים שלך",
    question: "היכן תתבצע רוב האימונים שלך?",
    type: "single",
    icon: "📍",
    category: "essential",
    required: true,
    algorithmWeight: 10,
    impactArea: ["location", "equipment_selection", "workout_type"],
    priority: "critical",
    customIcon: "questionnaire/location.png",
    options: [
      {
        id: "home",
        label: "בבית",
        description: "אימונים בבית או בחצר",
        aiInsight: "אימונים בבית מאפשרים גמישות ונוחות!",
      },
      {
        id: "gym",
        label: "חדר כושר",
        description: "אימונים בחדר כושר מקצועי",
        aiInsight: "גישה לציוד מקצועי ומגוון!",
      },
      {
        id: "outdoor",
        label: "בחוץ (פארק/טבע)",
        description: "אימונים בפארק, חוף, או שטח פתוח",
        aiInsight: "אימונים בטבע משפרים מצב רוח ובריאות!",
      },
    ],
    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "בחירה מעולה!");
      },
      influenceNextQuestions: (answer) => {
        const option = answer as SmartOption;
        switch (option?.id) {
          case "home":
            return ["home_equipment_availability"];
          case "gym":
            return ["gym_equipment_availability"];
          case "outdoor":
            return ["outdoor_equipment_availability"];
          default:
            return ["home_equipment_availability"];
        }
      },
    },
    helpText: "המיקום משפיע על סוגי האימונים והציוד שתוכל להשתמש בו",
  },

  // שאלה שנייה A - ציוד לאימונים בבית
  {
    id: "home_equipment_availability",
    title: "איזה ציוד יש לך בבית?",
    subtitle: "בחר את הציוד הזמין לך לאימונים בבית",
    question: "איזה ציוד אימונים יש לך בבית?",
    type: "single",
    icon: "🏠",
    category: "essential",
    required: true,
    algorithmWeight: 9,
    impactArea: ["equipment_selection", "workout_type", "exercise_variety"],
    priority: "critical",
    customIcon: "questionnaire/home.png",
    options: [
      {
        id: "no_equipment",
        label: "ללא ציוד (רק משקל גוף)",
        description: "אימונים עם משקל גוף + חפצים בסיסיים מהבית",
        aiInsight: "אימונים עם משקל גוף יכולים להיות סופר יעילים!",
      },
      {
        id: "basic_home_equipment",
        label: "ציוד בסיסי בבית",
        description: "דמבלים, גומיות, מזרון אימונים",
        aiInsight: "ציוד בסיסי פותח הרבה אפשרויות לאימונים מגוונים!",
      },
      {
        id: "advanced_home_gym",
        label: "חדר כושר ביתי מתקדם",
        description: "ספסל, ברבל, מכונות - חדר כושר מלא בבית",
        aiInsight: "חדר כושר ביתי מלא - האפשרויות אינסופיות!",
      },
    ],
    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "בחירה מעולה!");
      },
      influenceNextQuestions: (answer) => {
        const option = answer as SmartOption;
        switch (option?.id) {
          case "no_equipment":
            return ["bodyweight_equipment_options"];
          case "basic_home_equipment":
            return ["home_equipment_options"];
          case "advanced_home_gym":
            return ["home_equipment_options"];
          default:
            return [];
        }
      },
    },
    helpText: "הציוד בבית יקבע את סוגי האימונים שנכין לך",
  },

  // שאלה שנייה B - ציוד בחדר כושר
  {
    id: "gym_equipment_availability",
    title: "איזה ציוד יש בחדר הכושר שלך?",
    subtitle: "בחר את סוג חדר הכושר או הציוד הזמין",
    question: "איזה סוג חדר כושר יש לך?",
    type: "single",
    icon: "🏋️",
    category: "essential",
    required: true,
    algorithmWeight: 9,
    impactArea: ["equipment_selection", "workout_type", "exercise_variety"],
    priority: "critical",
    customIcon: "questionnaire/gym.png",
    options: [
      {
        id: "basic_gym",
        label: "חדר כושר בסיסי",
        description: "דמבלים, ברבלים, מכונות בסיסיות",
        aiInsight: "חדר כושר בסיסי מספק כל מה שצריך לאימון יעיל!",
      },
      {
        id: "full_gym",
        label: "חדר כושר מלא",
        description: "ציוד מקצועי, מכונות מתקדמות, מגוון רחב",
        aiInsight: "חדר כושר מלא פותח אפשרויות אינסופיות!",
      },
      {
        id: "boutique_gym",
        label: "חדר כושר בוטיק",
        description: "התמחות בסוג אימון מסוים (קרוספיט, פילאטיס וכו')",
        aiInsight: "חדר כושר מתמחה יאפשר להתמקד בסגנון האימון שלך!",
      },
    ],
    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "בחירה מעולה!");
      },
      influenceNextQuestions: (answer) => {
        const option = answer as SmartOption;
        switch (option?.id) {
          case "basic_gym":
            return ["gym_equipment_options"];
          case "full_gym":
            return ["gym_equipment_options"];
          case "boutique_gym":
            return ["gym_equipment_options"];
          default:
            return [];
        }
      },
    },
    helpText: "סוג חדר הכושר יקבע את האימונים שנתאים לך",
  },

  // שאלה שנייה C - ציוד לאימונים בחוץ
  {
    id: "outdoor_equipment_availability",
    title: "איזה ציוד יש לך לאימונים בחוץ?",
    subtitle: "בחר את הציוד הזמין לך לאימונים בטבע",
    question: "איזה ציוד אתה יכול להביא לאימונים בחוץ?",
    type: "single",
    icon: "🌳",
    category: "essential",
    required: true,
    algorithmWeight: 9,
    impactArea: ["equipment_selection", "workout_type", "exercise_variety"],
    priority: "critical",
    customIcon: "questionnaire/outdoor.png",
    options: [
      {
        id: "no_equipment_outdoor",
        label: "ללא ציוד (רק משקל גוף)",
        description: "אימונים בטבע עם משקל גוף ומה שיש בסביבה",
        aiInsight: "הטבע הוא המכון הכושר הטוב ביותר!",
      },
      {
        id: "portable_equipment",
        label: "ציוד נייד",
        description: "גומיות, TRX, דמבלים קטנים, מזרון נייד",
        aiInsight: "ציוד נייד מאפשר אימון איכותי בכל מקום!",
      },
      {
        id: "outdoor_facilities",
        label: "מתקני ספורט ציבוריים",
        description: "פארק כושר, מתקני קליסטניקס, מגרש ספורט",
        aiInsight: "מתקנים ציבוריים מושלמים לאימונים חינמיים ומגוונים!",
      },
    ],
    aiLogic: {
      generateFeedback: (answer) => {
        const option = answer as SmartOption;
        return AIFeedbackGenerator.positive(option.aiInsight || "בחירה מעולה!");
      },
      influenceNextQuestions: (answer) => {
        const option = answer as SmartOption;
        switch (option?.id) {
          case "no_equipment_outdoor":
            return ["bodyweight_equipment_options"];
          case "portable_equipment":
            return ["home_equipment_options"];
          case "outdoor_facilities":
            return ["bodyweight_equipment_options"];
          default:
            return [];
        }
      },
    },
    helpText: "הציוד הזמין יקבע את סוגי האימונים שנכין לך בחוץ",
  },

  // ========== שאלות ציוד (מיובאות מקובץ נפרד) ==========

  {
    id: "bodyweight_equipment_options",
    title: "איזה חפצים יש לך בבית?",
    subtitle: "בחר את מה שזמין לך לאימונים עם משקל גוף",
    question: "איזה חפצים בסיסיים יש לך בבית?",
    type: "multiple",
    icon: "🏠",
    category: "essential",
    required: true,
    options: BODYWEIGHT_EQUIPMENT_OPTIONS,
    aiLogic: {
      generateFeedback: (answer) => {
        const options = answer as SmartOption[];
        const count = Array.isArray(options) ? options.length : 0;
        if (count === 0) {
          return AIFeedbackGenerator.suggestion("בחר לפחות אפשרות אחת");
        } else if (count >= 5) {
          return AIFeedbackGenerator.insight(
            "מעולה! יש לך הרבה אפשרויות לאימונים מגוונים"
          );
        } else {
          return AIFeedbackGenerator.positive(
            "נהדר! נכין אימונים יצירתיים עם מה שיש לך"
          );
        }
      },
    },
    helpText: "חפצים ביתיים יכולים להפוך אימון רגיל לאימון מעניין ויעיל",
  },

  {
    id: "home_equipment_options",
    title: "איזה ציוד יש לך בבית?",
    subtitle: "בחר את הציוד הזמין לך לאימונים בבית",
    question: "איזה ציוד אימונים יש לך בבית?",
    type: "multiple",
    icon: "🏠",
    category: "essential",
    required: true,
    algorithmWeight: 9,
    impactArea: ["home_workouts", "equipment_variety", "strength_training"],
    priority: "critical",
    customIcon: "questionnaire/home_gym.png",
    options: HOME_EQUIPMENT_OPTIONS,
    aiLogic: {
      generateFeedback: (answer) => {
        const options = answer as SmartOption[];
        const count = Array.isArray(options) ? options.length : 0;
        if (count === 0) {
          return AIFeedbackGenerator.suggestion("בחר את הציוד הזמין לך");
        } else if (count >= 6) {
          return AIFeedbackGenerator.insight(
            "חדר כושר ביתי מלא! נוכל ליצור תוכניות מקצועיות"
          );
        } else {
          return AIFeedbackGenerator.positive(
            "מעולה! יש לך ציוד טוב לאימונים מגוונים"
          );
        }
      },
    },
    helpText: "בחר רק את הציוד שבאמת יש לך או שאתה מתכנן לקנות",
  },

  {
    id: "gym_equipment_options",
    title: "איזה ציוד יש בחדר הכושר שלך?",
    subtitle: "בחר את הציוד הזמין או שאתה הכי אוהב להשתמש בו",
    question: "איזה ציוד זמין לך בחדר הכושר?",
    type: "multiple",
    icon: "🏋️‍♂️",
    category: "essential",
    required: true,
    algorithmWeight: 10,
    impactArea: [
      "professional_workouts",
      "advanced_training",
      "equipment_mastery",
    ],
    priority: "critical",
    customIcon: "questionnaire/gym_equipment.png",
    options: GYM_EQUIPMENT_OPTIONS,
    aiLogic: {
      generateFeedback: (answer) => {
        const options = answer as SmartOption[];
        const count = Array.isArray(options) ? options.length : 0;
        if (count === 0) {
          return AIFeedbackGenerator.suggestion(
            "בחר את הציוד הזמין בחדר הכושר"
          );
        } else if (count >= 7) {
          return AIFeedbackGenerator.insight(
            "חדר כושר מדהים! נוכל ליצור תוכניות ברמה מקצועית גבוהה"
          );
        } else {
          return AIFeedbackGenerator.positive("מעולה! יש לך גישה לציוד איכותי");
        }
      },
    },
    helpText: "בחר את הציוד שאתה הכי נוח להשתמש בו או שזמין ברוב הזמן",
  },
];

// ==================== QUESTIONNAIRE MANAGER | מנהל השאלון ====================

export class NewQuestionnaireManager {
  private answers: Map<string, any> = new Map();
  private currentQuestionIndex = 0;
  private questionsToShow: string[] = ["training_location"];

  getCurrentQuestion(): SmartQuestion | null {
    console.log("🔍 DEBUG: NewQuestionnaireManager.getCurrentQuestion נקרא", {
      currentIndex: this.currentQuestionIndex,
      questionsToShow: this.questionsToShow,
      totalQuestions: this.questionsToShow.length,
    });

    if (this.currentQuestionIndex >= this.questionsToShow.length) {
      console.log("🔍 DEBUG: אין עוד שאלות - מחזיר null");
      return null;
    }

    const questionId = this.questionsToShow[this.currentQuestionIndex];
    console.log("🔍 DEBUG: מחפש שאלה עם ID:", questionId);

    const question = NEW_SMART_QUESTIONNAIRE.find((q) => q.id === questionId);

    console.log("🔍 DEBUG: מחזיר שאלה:", {
      questionId,
      questionFound: !!question,
      questionTitle: question?.title,
      allQuestionIds: NEW_SMART_QUESTIONNAIRE.map((q) => q.id),
    });

    return question || null;
  }

  answerQuestion(questionId: string, answer: any): AIFeedback | null {
    console.log("🔍 DEBUG: NewQuestionnaireManager.answerQuestion נקרא", {
      questionId,
      answerType: Array.isArray(answer) ? "array" : typeof answer,
      answerLength: Array.isArray(answer) ? answer.length : 1,
      answerPreview: Array.isArray(answer)
        ? answer.map((a) => a.label).join(", ")
        : answer?.label || "לא ידוע",
      answerDetails: answer,
    });

    this.answers.set(questionId, answer);

    const question = NEW_SMART_QUESTIONNAIRE.find((q) => q.id === questionId);
    if (!question) {
      console.log("🔍 DEBUG: שאלה לא נמצאה עבור ID:", questionId);
      return null;
    }

    const feedback = question.aiLogic.generateFeedback(
      answer,
      Object.fromEntries(this.answers)
    );

    console.log("🔍 DEBUG: משוב AI נוצר:", feedback);

    if (question.aiLogic.influenceNextQuestions) {
      const newQuestions = question.aiLogic.influenceNextQuestions(answer);
      console.log("🔍 DEBUG: שאלות חדשות הוספו:", newQuestions);

      if (newQuestions && newQuestions.length > 0) {
        const beforeQuestions = [...this.questionsToShow];

        // נקה את כל השאלות מאחרי השאלה הנוכחית
        this.questionsToShow = this.questionsToShow.slice(
          0,
          this.currentQuestionIndex + 1
        );

        // הוסף את השאלות החדשות
        this.questionsToShow.push(...newQuestions);

        console.log("🔍 DEBUG: עדכון רשימת שאלות:", {
          לפני: beforeQuestions,
          אחרי: this.questionsToShow,
          שאלותחדשות: newQuestions,
          currentIndex: this.currentQuestionIndex,
          nextQuestionWillBe:
            this.questionsToShow[this.currentQuestionIndex + 1],
        });
      }
    }

    return feedback;
  }

  nextQuestion(): boolean {
    console.log("🔍 DEBUG: NewQuestionnaireManager.nextQuestion נקרא", {
      currentIndex: this.currentQuestionIndex,
      nextIndex: this.currentQuestionIndex + 1,
      totalQuestions: this.questionsToShow.length,
    });

    this.currentQuestionIndex++;
    const hasNext = this.currentQuestionIndex < this.questionsToShow.length;

    console.log("🔍 DEBUG: nextQuestion תוצאה:", {
      newIndex: this.currentQuestionIndex,
      hasNext,
      nextQuestionId: hasNext
        ? this.questionsToShow[this.currentQuestionIndex]
        : "אין שאלה הבאה",
    });

    return hasNext;
  }

  previousQuestion(): boolean {
    console.log("🔍 DEBUG: NewQuestionnaireManager.previousQuestion נקרא", {
      currentIndex: this.currentQuestionIndex,
      previousIndex: this.currentQuestionIndex - 1,
    });

    if (this.currentQuestionIndex > 0) {
      const currentQuestionId = this.questionsToShow[this.currentQuestionIndex];
      if (currentQuestionId) {
        this.answers.delete(currentQuestionId);
        console.log("🔍 DEBUG: מחק תשובה עבור שאלה:", currentQuestionId);
      }

      this.currentQuestionIndex--;

      console.log("🔍 DEBUG: חזר לשאלה:", {
        newIndex: this.currentQuestionIndex,
        questionId: this.questionsToShow[this.currentQuestionIndex],
      });

      return true;
    }

    console.log("🔍 DEBUG: לא ניתן לחזור - זו השאלה הראשונה");
    return false;
  }

  canGoBack(): boolean {
    return this.currentQuestionIndex > 0;
  }

  getAllAnswers(): Record<string, any> {
    const answers = Object.fromEntries(this.answers);
    answers.available_equipment = extractEquipmentFromAnswers(answers);
    return answers;
  }

  isComplete(): boolean {
    return this.currentQuestionIndex >= this.questionsToShow.length;
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questionsToShow.length,
      percentage: Math.round(
        ((this.currentQuestionIndex + 1) / this.questionsToShow.length) * 100
      ),
    };
  }
}

// ==================== ANALYSIS FUNCTIONS | פונקציות ניתוח ====================

export function calculateSmartCompletionScore(
  answers: Record<string, any>
): number {
  let totalWeight = 0;
  let answeredWeight = 0;

  NEW_SMART_QUESTIONNAIRE.forEach((question) => {
    const weight = question.algorithmWeight ?? 1;
    totalWeight += weight;

    const answer = answers[question.id];
    if (answer && answer !== "" && answer !== null && answer !== undefined) {
      if (Array.isArray(answer) ? answer.length > 0 : true) {
        answeredWeight += weight;
      }
    }
  });

  return totalWeight > 0 ? Math.round((answeredWeight / totalWeight) * 100) : 0;
}

export function calculateEquipmentReadinessLevel(
  availableEquipment: string[]
): number {
  if (!availableEquipment || availableEquipment.length === 0) {
    return 1;
  }

  const equipmentCount = availableEquipment.length;
  const hasAdvancedEquipment = availableEquipment.some((eq) =>
    ["barbell", "squat_rack", "bench_press", "cable_machine"].includes(eq)
  );
  const hasCardioEquipment = availableEquipment.some((eq) =>
    ["treadmill", "rowing_machine", "elliptical"].includes(eq)
  );

  if (hasAdvancedEquipment && hasCardioEquipment && equipmentCount >= 8)
    return 5;
  if (hasAdvancedEquipment && equipmentCount >= 6) return 4;
  if (equipmentCount >= 4) return 3;
  if (equipmentCount >= 2) return 2;
  return 1;
}

export function calculateWorkoutVarietyScore(
  availableEquipment: string[]
): number {
  if (!availableEquipment || availableEquipment.length === 0) {
    return 3;
  }

  const varietyFactors = {
    strength: availableEquipment.filter((eq) =>
      ["dumbbells", "barbell", "kettlebell", "resistance_bands"].includes(eq)
    ).length,
    cardio: availableEquipment.filter((eq) =>
      ["treadmill", "rowing_machine", "jump_rope", "stairs"].includes(eq)
    ).length,
    functional: availableEquipment.filter((eq) =>
      ["cable_machine", "pullup_bar", "exercise_ball", "trx"].includes(eq)
    ).length,
    support: availableEquipment.filter((eq) =>
      ["bench", "yoga_mat", "foam_roller"].includes(eq)
    ).length,
  };

  const totalFactors = Object.values(varietyFactors).reduce(
    (sum, count) => sum + Math.min(count, 3),
    0
  );
  return Math.min(Math.max(Math.round(totalFactors * 0.8) + 2, 3), 10);
}

export function getSmartQuestionnaireInsights(answers: Record<string, any>): {
  completionScore: number;
  equipmentReadinessLevel: number;
  workoutVarietyScore: number;
  availableEquipment: string[];
  equipmentRecommendations: any[];
  insights: string[];
  nextSteps: string[];
  trainingCapabilities: string[];
} {
  const availableEquipment = answers.available_equipment || [];
  const completionScore = calculateSmartCompletionScore(answers);
  const equipmentReadinessLevel =
    calculateEquipmentReadinessLevel(availableEquipment);
  const workoutVarietyScore = calculateWorkoutVarietyScore(availableEquipment);

  const insights: string[] = [];
  const nextSteps: string[] = [];
  const trainingCapabilities: string[] = [];

  if (equipmentReadinessLevel >= 4) {
    insights.push("מערך ציוד מקצועי! יש לך כל מה שצריך לאימונים ברמה גבוהה");
    trainingCapabilities.push(
      "אימוני כוח מתקדמים",
      "תוכניות מקצועיות",
      "עבודה עם עומסים כבדים"
    );
  } else if (equipmentReadinessLevel >= 3) {
    insights.push("מערך ציוד טוב! מתאים לאימונים מגוונים ויעילים");
    trainingCapabilities.push(
      "אימוני כוח",
      "אימונים פונקציונליים",
      "אימוני יציבות"
    );
  } else if (equipmentReadinessLevel >= 2) {
    insights.push("מערך ציוד בסיסי אבל יעיל לתחילת המסע");
    trainingCapabilities.push(
      "אימוני משקל גוף",
      "אימונים עם ציוד קל",
      "פיתוח כוח בסיסי"
    );
  } else {
    insights.push(
      "מתחילים עם הבסיס - אימוני משקל גוף יכולים להיות סופר יעילים!"
    );
    trainingCapabilities.push(
      "אימוני משקל גוף",
      "תרגילי יציבות",
      "פיתוח כוח פונקציונלי"
    );
  }

  if (workoutVarietyScore >= 8) {
    insights.push("מגוון אימונים עצום זמין לך - לא תשתעמם!");
  } else if (workoutVarietyScore >= 6) {
    insights.push("מגוון אימונים טוב - יש מספיק אפשרויות להתקדמות");
  } else if (workoutVarietyScore >= 4) {
    insights.push("מגוון בסיסי - אפשר להרחיב עם ציוד נוסף");
  }

  if (completionScore >= 80) {
    nextSteps.push("השאלון הושלם! מוכן להתחיל באימונים מותאמים");
  } else {
    nextSteps.push("השלם את השאלון למידע מותאם יותר");
  }

  if (equipmentReadinessLevel < 3) {
    nextSteps.push("התחל עם אימוני משקל גוף ושקול הוספת ציוד בסיסי");
  }

  return {
    completionScore,
    equipmentReadinessLevel,
    workoutVarietyScore,
    availableEquipment,
    equipmentRecommendations: [],
    insights,
    nextSteps,
    trainingCapabilities,
  };
}

export default NEW_SMART_QUESTIONNAIRE;
