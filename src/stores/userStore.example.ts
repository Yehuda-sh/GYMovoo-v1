/**
 * 📘 UserStore Usage Examples
 *
 * דוגמאות לשימוש ב-UserStore המורחב עם תמיכה בשאלון החכם והתאמת מגדר
 * Extended UserStore usage examples with Smart Questionnaire and Gender Adaptation support
 *
 * Created: 2025-01-28
 * Updated: 2025-01-28
 */

import {
  useUserStore,
  useUser,
  useIsLoggedIn,
  useUserPreferences,
  useQuestionnaireCompleted,
} from "./userStore";
import type { SmartQuestionnaireData } from "./userStore";

// =======================================
// 📊 Smart Questionnaire Examples
// דוגמאות השאלון החכם
// =======================================

/**
 * Example 1: Complete Smart Questionnaire Flow
 * דוגמה 1: תהליך שלם של שאלון חכם
 */
export const completeSmartQuestionnaireExample = () => {
  const { setSmartQuestionnaireData, user } = useUserStore();

  // נתוני שאלון חכם לדוגמה
  // Example smart questionnaire data
  const smartQuestionnaireData: SmartQuestionnaireData = {
    answers: {
      // 1. מגדר (gender)
      gender: "female",

      // 2. רמת כושר (fitness level)
      fitnessLevel: "intermediate",

      // 3. יעדי כושר (fitness goals)
      goals: ["weight_loss", "muscle_tone"],

      // 4. ציוד זמין (available equipment)
      equipment: ["dumbbells", "yoga_mat", "resistance_bands"],

      // 5. זמינות (availability)
      availability: ["monday", "wednesday", "friday"],

      // 6. העדפות נוספות (additional preferences)
      preferences: ["morning_workouts", "moderate_intensity"],
    },
    metadata: {
      completedAt: new Date().toISOString(),
      version: "smart-questionnaire-v1",
      deviceInfo: {
        platform: "ios",
        screenWidth: 375,
        screenHeight: 812,
      },
      completionTime: 15 * 60 * 1000, // 15 minutes in milliseconds
    },
  };

  // שמירת נתוני השאלון החכם
  // Save smart questionnaire data
  setSmartQuestionnaireData(smartQuestionnaireData);

  console.log(
    "✅ Smart questionnaire completed:",
    user?.smartQuestionnaireData
  );
};

/**
 * Example 2: Quick Gender Selection
 * דוגמה 2: בחירת מגדר מהירה
 */
export const quickGenderSelectionExample = () => {
  const { updateGenderProfile } = useUserStore();

  // עדכון פרופיל מגדר בלבד
  // Update gender profile only
  updateGenderProfile({
    selectedGender: "male",
    adaptedWorkoutNames: {
      "Push-ups": "שכיבות סמיכה",
      Squats: "כפיפות ברכיים",
      Planks: "פלאנק",
    },
  });

  console.log("✅ Gender profile updated");
};

// =======================================
// 🔄 Backward Compatibility Examples
// דוגמאות תאימות לאחור
// =======================================

/**
 * Example 3: Old Questionnaire Support
 * דוגמה 3: תמיכה בשאלון הישן
 */
export const oldQuestionnaireExample = () => {
  const { setQuestionnaire, user } = useUserStore();

  // תשובות שאלון בפורמט הישן
  // Old format questionnaire answers
  const oldAnswers = {
    1: "female", // gender
    2: "25", // age
    3: "65", // weight
    4: "165", // height
    5: "beginner", // fitness level
    6: ["weight_loss"], // goals
    7: ["none"], // equipment
    8: ["monday", "wednesday", "friday"], // workout days
    9: "30", // workout duration
    10: [], // injuries
    11: "none", // previous experience
  };

  // שמירה בפורמט הישן (יתורגם אוטומטית לפורמט החדש)
  // Save in old format (will be automatically translated to new format)
  setQuestionnaire(oldAnswers);

  console.log("✅ Old questionnaire saved:", user?.questionnaire);
  console.log("🔄 Auto-converted data:", user?.questionnaireData);
};

// =======================================
// 🎯 Training Preferences Examples
// דוגמאות העדפות אימון
// =======================================

/**
 * Example 4: Update Training Preferences
 * דוגמה 4: עדכון העדפות אימון
 */
export const updateTrainingPreferencesExample = () => {
  const { updateTrainingPreferences } = useUserStore();

  updateTrainingPreferences({
    workoutDays: 3, // number of days per week
    equipment: ["dumbbells", "barbell", "bench"],
    goals: ["muscle_gain", "strength"],
    fitnessLevel: "advanced",
  });

  console.log("✅ Training preferences updated");
};

/**
 * Example 5: Update Training Statistics
 * דוגמה 5: עדכון סטטיסטיקות אימון
 */
export const updateTrainingStatsExample = () => {
  const { updateTrainingStats } = useUserStore();

  updateTrainingStats({
    totalWorkouts: 50,
    totalVolume: 2500, // total weight lifted
    favoriteExercises: ["bench_press", "squats", "deadlifts"],
    lastWorkoutDate: "2025-01-28",
    preferredWorkoutDays: 3,
    selectedEquipment: ["barbell", "dumbbells"],
    fitnessGoals: ["strength", "muscle_gain"],
    currentFitnessLevel: "advanced",
  });

  console.log("✅ Training statistics updated");
};

// =======================================
// 🌐 Gender Adaptation Examples
// דוגמאות התאמת מגדר
// =======================================

/**
 * Example 6: Gender-Adapted Workout Names
 * דוגמה 6: שמות אימונים מותאמי מגדר
 */
export const genderAdaptedWorkoutExample = () => {
  const { getAdaptedWorkoutName, updateGenderProfile } = useUserStore();

  // הגדרת שמות אימונים מותאמים
  // Set gender-adapted workout names
  updateGenderProfile({
    selectedGender: "female",
    adaptedWorkoutNames: {
      "Push-ups": "שכיבות סמיכה נשיות",
      Squats: "כפיפות ברכיים מותאמות",
      Planks: "פלאנק מחזק",
      Lunges: "צעדי נשים",
      Burpees: "תרגיל בורפי מותאם",
    },
  });

  // שימוש בשמות מותאמים
  // Use adapted names
  console.log("Original: Push-ups");
  console.log("Adapted:", getAdaptedWorkoutName("Push-ups"));

  console.log("Original: Unknown Exercise");
  console.log("Adapted:", getAdaptedWorkoutName("Unknown Exercise")); // יחזיר את השם המקורי
};

// =======================================
// 📊 Validation and Status Examples
// דוגמאות בדיקה וסטטוס
// =======================================

/**
 * Example 7: Validate User Data
 * דוגמה 7: בדיקת תקינות נתוני משתמש
 */
export const validateUserDataExample = () => {
  const { validateUserData, getCompletionStatus } = useUserStore();

  // בדיקת תקינות נתונים
  // Validate user data
  const isValid = validateUserData();
  console.log("User data is valid:", isValid);

  // קבלת סטטוס השלמה מפורט
  // Get detailed completion status
  const status = getCompletionStatus();
  console.log("Completion status:", status);
  /*
  Output example:
  {
    hasBasicInfo: true,
    hasSmartQuestionnaire: true,
    hasOldQuestionnaire: false,
    isFullySetup: true
  }
  */
};

/**
 * Example 8: Save to Storage Manually
 * דוגמה 8: שמירה ידנית לאחסון
 */
export const manualSaveExample = async () => {
  const { saveToStorage } = useUserStore();

  try {
    await saveToStorage();
    console.log("✅ User data saved to storage manually");
  } catch (error) {
    console.error("❌ Error saving to storage:", error);
  }
};

// =======================================
// 🧹 Cleanup and Reset Examples
// דוגמאות ניקוי ואיפוס
// =======================================

/**
 * Example 9: Reset Questionnaire Data
 * דוגמה 9: איפוס נתוני שאלון
 */
export const resetQuestionnaireExample = () => {
  const { resetQuestionnaire, resetSmartQuestionnaire } = useUserStore();

  // איפוס שאלון ישן
  // Reset old questionnaire
  resetQuestionnaire();
  console.log("✅ Old questionnaire reset");

  // איפוס שאלון חכם
  // Reset smart questionnaire
  resetSmartQuestionnaire();
  console.log("✅ Smart questionnaire reset");
};

/**
 * Example 10: Complete User Logout
 * דוגמה 10: יציאה מלאה של משתמש
 */
export const completeLogoutExample = () => {
  const { logout } = useUserStore();

  // יציאה מלאה - מנקה את כל הנתונים
  // Complete logout - clears all data
  logout();
  console.log("✅ User logged out, all data cleared");
};

// =======================================
// 🎯 Real-World Usage Patterns
// דפוסי שימוש בעולם האמיתי
// =======================================

/**
 * Example 11: Complete User Onboarding Flow
 * דוגמה 11: תהליך הצטרפות מלא של משתמש
 */
export const completeOnboardingFlowExample = async () => {
  const {
    setUser,
    setSmartQuestionnaireData,
    updateGenderProfile,
    saveToStorage,
    validateUserData,
  } = useUserStore();

  // שלב 1: יצירת משתמש בסיסי
  // Step 1: Create basic user
  setUser({
    id: "user123",
    email: "user@example.com",
    name: "דנה כהן",
  });

  // שלב 2: השלמת שאלון חכם
  // Step 2: Complete smart questionnaire
  const smartData: SmartQuestionnaireData = {
    answers: {
      gender: "female",
      fitnessLevel: "beginner",
      goals: ["weight_loss", "general_fitness"],
      equipment: ["yoga_mat", "resistance_bands"],
      availability: ["sunday", "tuesday", "thursday"],
      preferences: ["evening_workouts", "light_intensity"],
    },
    metadata: {
      completedAt: new Date().toISOString(),
      version: "smart-questionnaire-v1",
    },
  };

  setSmartQuestionnaireData(smartData);

  // שלב 3: הגדרת התאמות מגדר
  // Step 3: Set gender adaptations
  updateGenderProfile({
    selectedGender: "female",
    adaptedWorkoutNames: {
      "Push-ups": "שכיבות סמיכה מותאמות",
      Squats: "כפיפות ברכיים נשיות",
    },
  });

  // שלב 4: שמירה ובדיקה
  // Step 4: Save and validate
  await saveToStorage();
  const isValid = validateUserData();

  console.log("✅ Complete onboarding flow completed");
  console.log("User data is valid:", isValid);
};

/**
 * Example 12: Custom Hooks Usage
 * דוגמה 12: שימוש ב-Hooks מותאמים
 */
export const customHooksExample = () => {
  // שימוש ב-hooks הנוספים
  // Use additional hooks
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const preferences = useUserPreferences();
  const questionnaireCompleted = useQuestionnaireCompleted();

  console.log("Current user:", user?.name);
  console.log("Is logged in:", isLoggedIn);
  console.log("User preferences:", preferences);
  console.log("Questionnaire completed:", questionnaireCompleted);

  return {
    user,
    isLoggedIn,
    preferences,
    questionnaireCompleted,
  };
};

// =======================================
// 📝 TypeScript Usage Examples
// דוגמאות שימוש ב-TypeScript
// =======================================

/**
 * Example 13: Type-Safe Usage
 * דוגמה 13: שימוש בטיחותי בטיפוסים
 */
export const typeSafeUsageExample = () => {
  const { user } = useUserStore();

  // בדיקות טיפוס בטוחות
  // Type-safe checks
  if (user?.smartQuestionnaireData?.answers) {
    const answers = user.smartQuestionnaireData.answers;

    // TypeScript ידע שהאובייקט קיים
    // TypeScript knows the object exists
    console.log("Gender:", answers.gender);
    console.log("Fitness Level:", answers.fitnessLevel);
    console.log("Goals:", answers.goals);
  }

  if (user?.genderProfile?.selectedGender) {
    const gender = user.genderProfile.selectedGender;

    // TypeScript מבטיח שהמגדר הוא אחד מהערכים התקינים
    // TypeScript ensures gender is one of the valid values
    switch (gender) {
      case "male":
        console.log("User is male");
        break;
      case "female":
        console.log("User is female");
        break;
      case "other":
        console.log("User chose other");
        break;
    }
  }
};

// =======================================
// 🎭 Component Integration Examples
// דוגמאות אינטגרציה עם קומפוננטים
// =======================================

/**
 * Example 14: React Component Integration
 * דוגמה 14: אינטגרציה עם קומפוננט React
 */
export const ReactComponentExample = () => {
  const {
    user,
    setSmartQuestionnaireData,
    getAdaptedWorkoutName,
    validateUserData,
  } = useUserStore();

  const handleCompleteQuestionnaire = (
    answers: SmartQuestionnaireData["answers"]
  ) => {
    const smartData: SmartQuestionnaireData = {
      answers,
      metadata: {
        completedAt: new Date().toISOString(),
        version: "smart-questionnaire-v1",
      },
    };

    setSmartQuestionnaireData(smartData);
  };

  const isDataValid = validateUserData();

  return {
    user,
    isDataValid,
    handleCompleteQuestionnaire,
    getAdaptedWorkoutName,
  };
};

// =======================================
// 🚀 Export All Examples
// ייצוא כל הדוגמאות
// =======================================

export const allExamples = {
  // Basic Operations
  completeSmartQuestionnaireExample,
  quickGenderSelectionExample,
  oldQuestionnaireExample,

  // Training Management
  updateTrainingPreferencesExample,
  updateTrainingStatsExample,

  // Gender Adaptation
  genderAdaptedWorkoutExample,

  // Validation & Status
  validateUserDataExample,
  manualSaveExample,

  // Cleanup
  resetQuestionnaireExample,
  completeLogoutExample,

  // Real-World Patterns
  completeOnboardingFlowExample,
  customHooksExample,
  typeSafeUsageExample,

  // Component Integration
  ReactComponentExample,
};

console.log("📘 UserStore Examples loaded successfully!");
