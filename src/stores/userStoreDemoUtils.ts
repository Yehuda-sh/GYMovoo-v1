// =======================================
// 🎯 Demo User Creation Utilities
// כלי עזר ליצירת משתמש דמו
// =======================================

/**
 * Updates existing user with demo data
 */
export const updateUserWithDemoData = (
  currentUser: Record<string, unknown> | null,
  demoUser: Record<string, unknown>,
  questionnaireData: Record<string, unknown> | undefined
) => {
  if (!currentUser) return null;

  return {
    ...currentUser,
    customDemoUser: {
      id: demoUser.id || `demo_${Date.now()}`,
      name: demoUser.name || "Demo User",
      gender: demoUser.gender || "male",
      age: demoUser.age || 25,
      experience: demoUser.experience || "beginner",
      height: demoUser.height || 175,
      weight: demoUser.weight || 70,
      fitnessGoals: demoUser.fitnessGoals || [],
      availableDays: demoUser.availableDays || 3,
      sessionDuration: String(demoUser.sessionDuration || "30"),
      equipment: demoUser.equipment || [],
      preferredTime: demoUser.preferredTime || "morning",
      createdFromQuestionnaire: true,
      questionnaireTimestamp: new Date().toISOString(),
    },
    questionnaire: questionnaireData || currentUser.questionnaire,
    smartquestionnairedata: questionnaireData
      ? {
          answers: {
            goal: questionnaireData.goal,
            gender: questionnaireData.gender,
            experience: questionnaireData.experience,
            availability: questionnaireData.frequency
              ? [questionnaireData.frequency]
              : [],
            duration: questionnaireData.duration,
            location: questionnaireData.location,
            diet: questionnaireData.diet,
            equipment: questionnaireData.equipment || [],
          },
          metadata: { source: "customDemo" },
        }
      : currentUser.smartquestionnairedata,
    trainingstats: {
      totalWorkouts: 0,
      preferredWorkoutDays: 3,
      selectedEquipment: Array.isArray(questionnaireData?.equipment)
        ? questionnaireData.equipment
        : [],
      fitnessGoals: questionnaireData?.goal ? [questionnaireData.goal] : [],
      currentFitnessLevel: demoUser.experience || "beginner",
    },
  };
};

/**
 * Creates a complete new user with demo data
 */
export const createNewUserWithDemoData = (
  demoUser: Record<string, unknown>,
  questionnaireData: Record<string, unknown> | undefined
) => {
  const customDemoUser = {
    id: demoUser.id || `demo_${Date.now()}`,
    name: demoUser.name || "Demo User",
    gender: demoUser.gender || "male",
    age: demoUser.age || 25,
    experience: demoUser.experience || "beginner",
    height: demoUser.height || 175,
    weight: demoUser.weight || 70,
    fitnessGoals: demoUser.fitnessGoals || [],
    availableDays: demoUser.availableDays || 3,
    sessionDuration: String(demoUser.sessionDuration || "30"),
    equipment: demoUser.equipment || [],
    preferredTime: demoUser.preferredTime || "morning",
    createdFromQuestionnaire: true,
    questionnaireTimestamp: new Date().toISOString(),
  };

  return {
    id: customDemoUser.id,
    email: "",
    name: customDemoUser.name,
    customDemoUser,
    questionnaire: questionnaireData,
    smartquestionnairedata: questionnaireData
      ? {
          answers: {
            goal: questionnaireData.goal,
            gender: questionnaireData.gender,
            experience: questionnaireData.experience,
            availability: questionnaireData.frequency
              ? [questionnaireData.frequency]
              : [],
            duration: questionnaireData.duration,
            location: questionnaireData.location,
            diet: questionnaireData.diet,
            equipment: questionnaireData.equipment || [],
          },
          metadata: { source: "customDemo" },
        }
      : undefined,
    trainingstats: {
      totalWorkouts: 0,
      preferredWorkoutDays: 3,
      selectedEquipment: Array.isArray(questionnaireData?.equipment)
        ? questionnaireData.equipment
        : [],
      fitnessGoals: questionnaireData?.goal ? [questionnaireData.goal] : [],
      currentFitnessLevel: demoUser.experience || "beginner",
    },
  };
};
