/**
 * @file src/data/newSmartQuestionnaire.ts
 * @brief שאלון חכם מתקדם עם AI ואלגוריתם התאמה | Advanced smart questionnaire with AI and matching algorithm
 * @author GYMovoo Development Team
 * @description מערכת שאלון דינמית המתאימה שאלות בהתאם לציוד זמין ומטרות אישיות עם משוב AI חכם
 * @description Dynamic questionnaire system that adapts questions based on available equipment and personal goals with smart AI feedback
 * @version 2.0 - Enhanced with unified interfaces and smart algorithm
 * @date 2025-01-28
 * @notes משלב AI מתקדם עם אלגוריתם התאמה אישית לפי ציוד זמין ומטרות
 * @notes Integrates advanced AI with personalized matching algorithm based on available equipment and goals
 */

import { ImageSourcePropType } from "react-native";
import {
  SmartOption,
  AIFeedback,
  SmartQuestionType,
  QuestionMetadata,
} from "./questionnaireData";

// ================== SMART QUESTION INTERFACE | ממשק שאלה חכמה ==================

// ממשק לשאלה עם אלגוריתם חכם מתקדם
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

// פונקציות עזר למשוב AI
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

// השאלות החדשות
export const NEW_SMART_QUESTIONNAIRE: SmartQuestion[] = [
  // שאלה ראשית - איזה ציוד זמין
  {
    id: "equipment_availability",
    title: "איזה ציוד זמין לך לאימונים?",
    subtitle: "בחר את המצב שהכי מתאים לך",
    question: "איזה ציוד יש לך לאימונים?",
    type: "single",
    icon: "🏋️",
    category: "essential",
    required: true,
    algorithmWeight: 10,
    impactArea: ["equipment_selection", "workout_type", "exercise_variety"],
    priority: "critical",
    customIcon: "questionnaire/equipment.png",

    options: [
      {
        id: "no_equipment",
        label: "ללא ציוד (בבית עם חפצים בסיסיים)",
        description: "משקל גוף + מזרון + כיסא + חפצים ביתיים",
        aiInsight:
          "אימונים עם משקל גוף וחפצים ביתיים יכולים להיות סופר יעילים!",
      },
      {
        id: "home_equipment",
        label: "יש לי ציוד בבית",
        description: "דמבלים, גומיות, או ציוד ביתי אחר",
        aiInsight: "ציוד ביתי פותח הרבה אפשרויות לאימונים מגוונים!",
      },
      {
        id: "gym_access",
        label: "יש לי גישה לחדר כושר",
        description: "מנוי בחדר כושר עם ציוד מקצועי",
        aiInsight: "חדר כושר נותן גישה לציוד מקצועי ואפשרויות אינסופיות!",
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
          case "home_equipment":
            return ["home_equipment_options"];
          case "gym_access":
            return ["gym_equipment_options"];
          default:
            return [];
        }
      },
    },

    helpText: "זה יקבע איזה שאלות תקבל הבא",
  },

  // ========== אימונים ללא ציוד (עם חפצים ביתיים) ==========
  {
    id: "bodyweight_equipment_options",
    title: "איזה חפצים יש לך בבית?",
    subtitle: "בחר את מה שזמין לך לאימונים עם משקל גוף",
    question: "איזה חפצים בסיסיים יש לك בבית?",
    type: "multiple",
    icon: "🏠",
    category: "essential",
    required: true,

    options: [
      {
        id: "bodyweight_only",
        label: "רק משקל גוף",
        description: "אין חפצים נוספים",
        image: require("../../assets/bodyweight.png"),
        metadata: { equipment: ["bodyweight"] },
        aiInsight: "הבסיס הכי טבעי!",
      },
      {
        id: "mat_available",
        label: "מזרון/שטיח",
        description: "לתרגילי רצפה נוחים",
        image: require("../../assets/yoga_mat.png"),
        metadata: { equipment: ["mat"] },
        aiInsight: "נוחות לתרגילי ליבה!",
      },
      {
        id: "chair_available",
        label: "כיסא יציב",
        description: "לתרגילי דחיפה וכוח",
        metadata: { equipment: ["chair"] },
        aiInsight: "כיסא פותח הרבה אפשרויות!",
      },
      {
        id: "wall_space",
        label: "קיר פנוי",
        description: "לתרגילי קיר ומתיחות",
        metadata: { equipment: ["wall"] },
        aiInsight: "הקיר הוא הכלי הכי יציב!",
      },
      {
        id: "stairs_available",
        label: "מדרגות",
        description: "לאימוני קרדיו וכוח רגליים",
        metadata: { equipment: ["stairs"] },
        aiInsight: "מדרגות = חדר כושר טבעי!",
      },
      {
        id: "towel_available",
        label: "מגבת",
        description: "להתנגדות ומתיחות",
        metadata: { equipment: ["towel"] },
        aiInsight: "מגבת יכולה להיות גומית התנגדות!",
      },
      {
        id: "water_bottles",
        label: "בקבוקי מים מלאים",
        description: "כמשקולות קלות",
        metadata: { equipment: ["water_bottles"] },
        aiInsight: "משקולות ביתיות מושלמות!",
      },
      {
        id: "pillow_available",
        label: "כרית",
        description: "לתמיכה ותרגילי יציבות",
        metadata: { equipment: ["pillow"] },
        aiInsight: "תמיכה נוחה לתרגילים!",
      },
      {
        id: "table_sturdy",
        label: "שולחן חזק",
        description: "לתרגילי שכיבה תמיכה",
        metadata: { equipment: ["table"] },
        aiInsight: "פלטפורמה מעולה לתרגילים!",
      },
      {
        id: "backpack_heavy",
        label: "תיק עם ספרים",
        description: "להוספת משקל לתרגילים",
        metadata: { equipment: ["weighted_backpack"] },
        aiInsight: "משקל נוסף לאתגר גדול יותר!",
      },
    ],

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

  // ========== ציוד ביתי ==========
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

    options: [
      {
        id: "dumbbells_home",
        label: "דמבלים",
        description: "משקולות יד - קבועות או מתכווננות",
        image: require("../../assets/dumbbells.png"),
        metadata: { equipment: ["dumbbells"] },
        aiInsight: "הציוד הכי גמיש לכוח!",
      },
      {
        id: "resistance_bands",
        label: "גומיות התנגדות",
        description: "רצועות אלסטיות להתנגדות משתנה",
        image: require("../../assets/resistance_bands.png"),
        metadata: { equipment: ["resistance_bands"] },
        aiInsight: "קלות ויעילות מדהימה!",
      },
      {
        id: "kettlebell_home",
        label: "קטלבל",
        description: "משקולת עם ידית לתרגילים דינמיים",
        image: require("../../assets/kettlebell.png"),
        metadata: { equipment: ["kettlebell"] },
        aiInsight: "כוח + קרדיו בכלי אחד!",
      },
      {
        id: "yoga_mat_home",
        label: "מזרן יוגה",
        description: "בסיס נוח לתרגילי רצפה",
        image: require("../../assets/yoga_mat.png"),
        metadata: { equipment: ["yoga_mat"] },
        aiInsight: "בסיס חיוני לתרגילי ליבה!",
      },
      {
        id: "pullup_bar",
        label: "מוט מתח",
        description: "מוט מתכוונן לדלת",
        image: require("../../assets/pullup_bar.png"),
        metadata: { equipment: ["pullup_bar"] },
        aiInsight: "פותח עולם של תרגילי גב!",
      },
      {
        id: "foam_roller",
        label: "גלגל מסאז'",
        description: "לשחרור שרירים והתאוששות",
        image: require("../../assets/foam_roller.png"),
        metadata: { equipment: ["foam_roller"] },
        aiInsight: "התאוששות חכמה!",
      },
      {
        id: "exercise_ball",
        label: "כדור פיזיותרפיה",
        description: "לתרגילי יציבות וליבה",
        metadata: { equipment: ["exercise_ball"] },
        aiInsight: "יציבות ואיזון מושלמים!",
      },
      {
        id: "jump_rope",
        label: "חבל קפיצה",
        description: "לאימוני קרדיו מהירים",
        metadata: { equipment: ["jump_rope"] },
        aiInsight: "קרדיו יעיל בזמן קצר!",
      },
      {
        id: "home_bench",
        label: "ספסל אימונים",
        description: "ספסל מתכוונן לבית",
        image: require("../../assets/bench.png"),
        metadata: { equipment: ["bench"] },
        aiInsight: "פותח אפשרויות אינסופיות!",
      },
      {
        id: "barbell_home",
        label: "ברבל ביתי",
        description: "מוט עם משקולות לבית",
        image: require("../../assets/barbell.png"),
        metadata: { equipment: ["barbell"] },
        aiInsight: "רמה מקצועית בבית!",
      },
    ],

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

  // ========== ציוד חדר כושר ==========
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

    options: [
      {
        id: "free_weights_gym",
        label: "משקולות חופשיות",
        description: "דמבלים וברבלים עם צלחות משקל",
        image: require("../../assets/free_weights.png"),
        metadata: { equipment: ["dumbbells", "barbell"] },
        aiInsight: "הבסיס של אימוני כוח אמיתיים!",
      },
      {
        id: "squat_rack_gym",
        label: "מתקן סקוואט",
        description: "מדף ברבל עם מגני בטיחות",
        image: require("../../assets/squat_rack.png"),
        metadata: { equipment: ["squat_rack"] },
        aiInsight: "המלך של תרגילי הרגליים!",
      },
      {
        id: "bench_press_gym",
        label: "ספסל לחיצה",
        description: "ספסל מתכוונן עם מדף ברבל",
        image: require("../../assets/bench.png"),
        metadata: { equipment: ["bench_press"] },
        aiInsight: "חיוני לאימוני חזה מקצועיים!",
      },
      {
        id: "cable_machine_gym",
        label: "מכונת כבלים",
        description: "מערכת פולי רב-תכליתית",
        image: require("../../assets/cable_machine.png"),
        metadata: { equipment: ["cable_machine"] },
        aiInsight: "גמישות אינסופית לכל השרירים!",
      },
      {
        id: "leg_press_gym",
        label: "מכונת לג פרס",
        description: "מכונה ללחיצת רגליים בישיבה",
        image: require("../../assets/leg_press.png"),
        metadata: { equipment: ["leg_press"] },
        aiInsight: "כוח רגליים מקסימלי בבטיחות!",
      },
      {
        id: "lat_pulldown_gym",
        label: "מכונת לט פולדאון",
        description: "משיכה למטה לשרירי הגב",
        image: require("../../assets/lat_pulldown.png"),
        metadata: { equipment: ["lat_pulldown"] },
        aiInsight: "מושלמת לפיתוח גב רחב!",
      },
      {
        id: "smith_machine_gym",
        label: "מכונת סמית'",
        description: "ברבל מונחה על מסילות בטוחות",
        image: require("../../assets/smith_machine.png"),
        metadata: { equipment: ["smith_machine"] },
        aiInsight: "בטיחות מקסימלית עם עומסים כבדים!",
      },
      {
        id: "cardio_machines_gym",
        label: "מכונות קרדיו",
        description: "הליכון, אליפטיקל, אופני כושר",
        image: require("../../assets/treadmill.png"),
        metadata: { equipment: ["treadmill", "elliptical"] },
        aiInsight: "חיוני לחימום וקרדיו איכותי!",
      },
      {
        id: "chest_press_gym",
        label: "מכונת חזה",
        description: "לחיצת חזה במכונה מונחית",
        image: require("../../assets/chest_press.png"),
        metadata: { equipment: ["chest_press"] },
        aiInsight: "בטוחה ויעילה לפיתוח החזה!",
      },
      {
        id: "rowing_machine_gym",
        label: "מכונת חתירה",
        description: "אימון גב וקרדיו משולב",
        image: require("../../assets/rowing_machine.png"),
        metadata: { equipment: ["rowing_machine"] },
        aiInsight: "אימון מלא לכל הגוף בתנועה אחת!",
      },
    ],

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

// פונקציות לניהול השאלון
export class NewQuestionnaireManager {
  private answers: Map<string, any> = new Map();
  private currentQuestionIndex = 0;
  private questionsToShow: string[] = ["equipment_availability"];

  getCurrentQuestion(): SmartQuestion | null {
    if (this.currentQuestionIndex >= this.questionsToShow.length) {
      return null;
    }

    const questionId = this.questionsToShow[this.currentQuestionIndex];
    return NEW_SMART_QUESTIONNAIRE.find((q) => q.id === questionId) || null;
  }

  answerQuestion(questionId: string, answer: any): AIFeedback | null {
    this.answers.set(questionId, answer);

    const question = NEW_SMART_QUESTIONNAIRE.find((q) => q.id === questionId);
    if (!question) return null;

    // יצור משוב AI
    const feedback = question.aiLogic.generateFeedback(
      answer,
      Object.fromEntries(this.answers)
    );

    // עדכן רשימת שאלות עתידיות
    if (question.aiLogic.influenceNextQuestions) {
      const newQuestions = question.aiLogic.influenceNextQuestions(answer);
      if (newQuestions && newQuestions.length > 0) {
        // הסר שאלות קיימות דומות והוסף החדשות
        this.questionsToShow = this.questionsToShow.filter(
          (q) =>
            ![
              "bodyweight_equipment_options",
              "home_equipment_options",
              "gym_equipment_options",
            ].includes(q)
        );
        this.questionsToShow.push(...newQuestions);
      }
    }

    return feedback;
  }

  nextQuestion(): boolean {
    this.currentQuestionIndex++;
    return this.currentQuestionIndex < this.questionsToShow.length;
  }

  getAllAnswers(): Record<string, any> {
    const answers = Object.fromEntries(this.answers);

    // חילוץ ציוד מהתשובות
    const extractedEquipment: string[] = [];

    // בדיקת כל התשובות לחילוץ ציוד
    Object.values(answers).forEach((answer: any) => {
      if (Array.isArray(answer)) {
        answer.forEach((option: any) => {
          if (option?.metadata?.equipment) {
            extractedEquipment.push(...option.metadata.equipment);
          }
        });
      } else if (answer?.metadata?.equipment) {
        extractedEquipment.push(...answer.metadata.equipment);
      }
    });

    // הוספת הציוד החולץ
    answers.available_equipment = [...new Set(extractedEquipment)];

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

// ==================== Smart Analysis Functions ====================

/**
 * Calculate smart questionnaire completion score based on algorithm weights
 * Returns score from 0-100 based on importance of answered questions
 */
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
      // Check if it's an array with at least one item or a valid single answer
      if (Array.isArray(answer) ? answer.length > 0 : true) {
        answeredWeight += weight;
      }
    }
  });

  return totalWeight > 0 ? Math.round((answeredWeight / totalWeight) * 100) : 0;
}

/**
 * Calculate equipment readiness level based on available equipment
 * Returns level from 1-5 based on equipment variety and quality
 */
export function calculateEquipmentReadinessLevel(
  availableEquipment: string[]
): number {
  if (!availableEquipment || availableEquipment.length === 0) {
    return 1; // Basic bodyweight only
  }

  const equipmentCount = availableEquipment.length;
  const hasAdvancedEquipment = availableEquipment.some((eq) =>
    ["barbell", "squat_rack", "bench_press", "cable_machine"].includes(eq)
  );
  const hasCardioEquipment = availableEquipment.some((eq) =>
    ["treadmill", "rowing_machine", "elliptical"].includes(eq)
  );

  // Level calculation based on equipment variety and quality
  if (hasAdvancedEquipment && hasCardioEquipment && equipmentCount >= 8)
    return 5; // Professional gym
  if (hasAdvancedEquipment && equipmentCount >= 6) return 4; // Advanced home gym
  if (equipmentCount >= 4) return 3; // Good home setup
  if (equipmentCount >= 2) return 2; // Basic equipment
  return 1; // Minimal equipment
}

/**
 * Get workout variety score based on available equipment
 * Returns score from 1-10 based on exercise possibilities
 */
export function calculateWorkoutVarietyScore(
  availableEquipment: string[]
): number {
  if (!availableEquipment || availableEquipment.length === 0) {
    return 3; // Bodyweight exercises only
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

/**
 * Get smart equipment recommendations based on current setup
 * Returns array of equipment suggestions for improvement
 */
export function getSmartEquipmentRecommendations(
  availableEquipment: string[],
  maxRecommendations: number = 3
): Array<{
  equipment: string;
  reason: string;
  priority: "high" | "medium" | "low";
  hebrewName: string;
}> {
  const recommendations = [];
  const hasEquipment = (eq: string) => availableEquipment.includes(eq);

  // High priority recommendations
  if (!hasEquipment("yoga_mat") && !hasEquipment("mat")) {
    recommendations.push({
      equipment: "yoga_mat",
      reason: "חיוני לתרגילי רצפה ומתיחות",
      priority: "high" as const,
      hebrewName: "מזרן יוגה",
    });
  }

  if (!hasEquipment("dumbbells") && !hasEquipment("resistance_bands")) {
    recommendations.push({
      equipment: "resistance_bands",
      reason: "זול ומגוון לאימוני כוח",
      priority: "high" as const,
      hebrewName: "גומיות התנגדות",
    });
  }

  // Medium priority recommendations
  if (hasEquipment("dumbbells") && !hasEquipment("bench")) {
    recommendations.push({
      equipment: "bench",
      reason: "יפתח אפשרויות אימון חדשות",
      priority: "medium" as const,
      hebrewName: "ספסל אימונים",
    });
  }

  if (!hasEquipment("kettlebell") && hasEquipment("dumbbells")) {
    recommendations.push({
      equipment: "kettlebell",
      reason: "משלב כוח וקרדיו בתרגיל אחד",
      priority: "medium" as const,
      hebrewName: "קטלבל",
    });
  }

  // Low priority recommendations
  if (!hasEquipment("foam_roller")) {
    recommendations.push({
      equipment: "foam_roller",
      reason: "חשוב להתאוששות ומניעת פציעות",
      priority: "low" as const,
      hebrewName: "גלגל מסאז׳",
    });
  }

  if (!hasEquipment("pullup_bar") && hasEquipment("dumbbells")) {
    recommendations.push({
      equipment: "pullup_bar",
      reason: "פותח עולם של תרגילי גב",
      priority: "low" as const,
      hebrewName: "מוט מתח",
    });
  }

  // Sort by priority and return limited results
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return recommendations
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    .slice(0, maxRecommendations);
}

/**
 * Get comprehensive smart questionnaire insights
 * Returns detailed analysis with recommendations and next steps
 */
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
  const equipmentRecommendations =
    getSmartEquipmentRecommendations(availableEquipment);

  const insights: string[] = [];
  const nextSteps: string[] = [];
  const trainingCapabilities: string[] = [];

  // Generate insights based on equipment setup
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

  // Generate variety insights
  if (workoutVarietyScore >= 8) {
    insights.push("מגוון אימונים עצום זמין לך - לא תשתעמם!");
  } else if (workoutVarietyScore >= 6) {
    insights.push("מגוון אימונים טוב - יש מספיק אפשרויות להתקדמות");
  } else if (workoutVarietyScore >= 4) {
    insights.push("מגוון בסיסי - אפשר להרחיב עם ציוד נוסף");
  }

  // Generate next steps
  if (completionScore >= 80) {
    nextSteps.push("השאלון הושלם! מוכן להתחיל באימונים מותאמים");
  } else {
    nextSteps.push("השלם את השאלון למידע מותאם יותר");
  }

  if (equipmentRecommendations.length > 0) {
    nextSteps.push(
      `שקול להוסיף ${equipmentRecommendations[0].hebrewName} לשיפור האימונים`
    );
  }

  if (equipmentReadinessLevel < 3) {
    nextSteps.push("התחל עם אימוני משקל גוף ושקול הוספת ציוד בסיסי");
  }

  return {
    completionScore,
    equipmentReadinessLevel,
    workoutVarietyScore,
    availableEquipment,
    equipmentRecommendations,
    insights,
    nextSteps,
    trainingCapabilities,
  };
}

export default NEW_SMART_QUESTIONNAIRE;
