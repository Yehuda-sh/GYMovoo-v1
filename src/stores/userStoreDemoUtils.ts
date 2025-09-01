import { logger } from "../utils/logger";
import { USER_STORE_CONSTANTS } from "./userStoreConstants";
import { normalizeEquipment } from "../utils/equipmentCatalog";

// =======================================
// 🎯 Demo User Creation Utilities
// כלי עזר ליצירת משתמש דמו
// =======================================

/**
 * Creates a custom demo user from questionnaire data
 */
export const createCustomDemoUser = (demoUser: Record<string, unknown>) => {
  const baseUser = {
    id:
      (demoUser.id as string) ||
      `${USER_STORE_CONSTANTS.DEMO_USER.ID_PREFIX}${Date.now()}`,
    name:
      (demoUser.name as string) || USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_NAME,
    gender:
      (demoUser.gender as string) ||
      USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_GENDER,
    age: (demoUser.age as number) || USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_AGE,
    experience:
      (demoUser.experience as string) ||
      USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_EXPERIENCE,
    height:
      (demoUser.height as number) ||
      USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_HEIGHT,
    weight:
      (demoUser.weight as number) ||
      USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_WEIGHT,
    fitnessGoals: (demoUser.fitnessGoals as string[]) || [],
    availableDays:
      (demoUser.availableDays as number) ||
      USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_AVAILABLE_DAYS,
    sessionDuration:
      typeof demoUser.sessionDuration === "string"
        ? demoUser.sessionDuration
        : String(
            demoUser.sessionDuration ||
              USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_SESSION_DURATION
          ),
    equipment: (demoUser.equipment as string[]) || [],
    preferredTime:
      (demoUser.preferredTime as string) ||
      USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_PREFERRED_TIME,
    createdFromQuestionnaire: true,
    questionnaireTimestamp: new Date().toISOString(),
  };

  logger.debug("DemoUser", "Created custom demo user base", {
    id: baseUser.id,
  });
  return baseUser;
};

/**
 * Creates smart questionnaire data from questionnaire input
 */
export const createSmartQuestionnaireData = (
  questionnaireData: Record<string, unknown> | undefined,
  existingData?: Record<string, unknown>
) => {
  if (!questionnaireData) return existingData;

  const realEquip = Array.isArray(questionnaireData.equipment)
    ? normalizeEquipment(questionnaireData.equipment)
    : [];

  if (existingData && realEquip.length > 0) {
    return {
      ...existingData,
      answers: {
        ...((existingData.answers as Record<string, unknown>) || {}),
        equipment: realEquip,
      },
    };
  }

  return {
    answers: {
      goal: questionnaireData.goal,
      gender: questionnaireData.gender,
      experience: questionnaireData.experience,
      availability: [questionnaireData.frequency].filter(Boolean),
      duration: questionnaireData.duration,
      location: questionnaireData.location,
      diet: questionnaireData.diet,
      equipment: realEquip.length > 0 ? realEquip : questionnaireData.equipment,
    },
    metadata: (questionnaireData.metadata as Record<string, unknown>) || {
      source: "customDemo",
    },
  };
};

/**
 * Creates training stats from questionnaire data
 */
export const createTrainingStats = (
  questionnaireData: Record<string, unknown> | undefined,
  demoUser: Record<string, unknown>
) => {
  if (!questionnaireData) return { totalWorkouts: 0 };

  const freq = questionnaireData.frequency as string;
  let preferredDays: number =
    USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_AVAILABLE_DAYS;

  if (typeof freq === "string") {
    // Simple frequency parsing - convert to workout days
    const match = freq.match(/^(\d+)_days?$/);
    if (match) {
      const days = parseInt(match[1], 10);
      if (days >= 1 && days <= 7) {
        preferredDays = days;
      }
    }
  }

  return {
    totalWorkouts: 0,
    preferredWorkoutDays: preferredDays,
    selectedEquipment: (() => {
      if (
        questionnaireData.equipment &&
        Array.isArray(questionnaireData.equipment)
      ) {
        const real = normalizeEquipment(questionnaireData.equipment);
        return real.length > 0 ? real : [];
      }
      return [];
    })(),
    fitnessGoals: questionnaireData.goal
      ? [questionnaireData.goal as string]
      : [],
    currentFitnessLevel:
      (demoUser.experience as string) ||
      USER_STORE_CONSTANTS.DEMO_USER.DEFAULT_EXPERIENCE,
  };
};

/**
 * Updates existing user with custom demo data
 */
export const updateUserWithDemoData = (
  currentUser: Record<string, unknown> | null,
  demoUser: Record<string, unknown>,
  questionnaireData: Record<string, unknown> | undefined
) => {
  if (!currentUser) return null;

  const customDemoUser = createCustomDemoUser(demoUser);
  const smartQuestionnaireData = createSmartQuestionnaireData(
    questionnaireData,
    currentUser.smartquestionnairedata as Record<string, unknown>
  );
  const trainingStats = createTrainingStats(questionnaireData, demoUser);

  return {
    ...currentUser,
    customDemoUser,
    questionnaire: questionnaireData || currentUser.questionnaire,
    smartquestionnairedata: smartQuestionnaireData,
    trainingstats: trainingStats,
  };
};

/**
 * Creates a complete new user with demo data
 */
export const createNewUserWithDemoData = (
  demoUser: Record<string, unknown>,
  questionnaireData: Record<string, unknown> | undefined
) => {
  const customDemoUser = createCustomDemoUser(demoUser);
  const smartQuestionnaireData =
    createSmartQuestionnaireData(questionnaireData);
  const trainingStats = createTrainingStats(questionnaireData, demoUser);

  return {
    id: customDemoUser.id,
    email: "",
    name: customDemoUser.name,
    customDemoUser,
    questionnaire: questionnaireData,
    smartquestionnairedata: smartQuestionnaireData,
    trainingstats: trainingStats,
  };
};
