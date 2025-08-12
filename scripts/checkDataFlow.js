/**
 * בדיקת זרימת נתונים - Data Flow Validation
 * לוודא שהנתונים זורמים נכון מההרשמה עד ליצירת תוכניות
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 בדיקת זרימת נתונים נוכחית...\n");

// בדיקת קיום קבצים חיוניים
const criticalFiles = [
  "src/services/questionnaireService.ts",
  "src/services/workoutDataService.ts",
  "src/screens/auth/RegisterScreen.tsx",
  "src/screens/questionnaire/SmartQuestionnaireScreen.tsx",
  "src/screens/workout/WorkoutPlansScreen.tsx",
  "src/stores/userStore.ts",
];

console.log("📋 בודק קיום קבצים חיוניים:");
criticalFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? "✅" : "❌"} ${file}`);
});

// בדיקת מבנה נתונים במודלים
console.log("\n📊 בודק מבני נתונים:");

function checkUserStoreStructure() {
  try {
    const userStoreContent = fs.readFileSync("src/stores/userStore.ts", "utf8");

    const hasQuestionnaire = userStoreContent.includes("questionnaire");
    const hasSmartQuestionnaire = userStoreContent.includes(
      "smartQuestionnaireData"
    );
    const hasWorkoutPlans = userStoreContent.includes("workoutPlan");
    const hasSubscription =
      userStoreContent.includes("subscription") ||
      userStoreContent.includes("trial");

    console.log(
      `${hasQuestionnaire ? "✅" : "❌"} Questionnaire support in userStore`
    );
    console.log(
      `${hasSmartQuestionnaire ? "✅" : "❌"} SmartQuestionnaire support in userStore`
    );
    console.log(
      `${hasWorkoutPlans ? "✅" : "❌"} WorkoutPlan support in userStore`
    );
    console.log(
      `${hasSubscription ? "✅" : "❌"} Subscription/Trial support in userStore`
    );

    return {
      hasQuestionnaire,
      hasSmartQuestionnaire,
      hasWorkoutPlans,
      hasSubscription,
    };
  } catch (error) {
    console.log("❌ Error reading userStore:", error.message);
    return null;
  }
}

function checkQuestionnaireService() {
  try {
    const questionnaireContent = fs.readFileSync(
      "src/services/questionnaireService.ts",
      "utf8"
    );

    const hasWorkoutRecommendations = questionnaireContent.includes(
      "getWorkoutRecommendations"
    );
    const hasPersonalization = questionnaireContent.includes("personal");
    const hasTwoTierSystem =
      questionnaireContent.includes("generateBasicWorkoutPlan") &&
      questionnaireContent.includes("generateSmartWorkoutPlan") &&
      questionnaireContent.includes("basic") &&
      questionnaireContent.includes("smart");

    console.log(
      `${hasWorkoutRecommendations ? "✅" : "❌"} Workout recommendations in questionnaireService`
    );
    console.log(`${hasPersonalization ? "✅" : "❌"} Personalization features`);
    console.log(
      `${hasTwoTierSystem ? "✅" : "❌"} Two-tier workout system (basic/premium)`
    );

    return { hasWorkoutRecommendations, hasPersonalization, hasTwoTierSystem };
  } catch (error) {
    console.log("❌ Error reading questionnaireService:", error.message);
    return null;
  }
}

function checkWorkoutPlansScreen() {
  try {
    const workoutPlansContent = fs.readFileSync(
      "src/screens/workout/WorkoutPlansScreen.tsx",
      "utf8"
    );

    const hasBlurSupport =
      workoutPlansContent.includes("blur") ||
      workoutPlansContent.includes("Blur");
    const hasSubscriptionCheck =
      workoutPlansContent.includes("subscription") ||
      workoutPlansContent.includes("trial");
    const hasTwoPlans =
      workoutPlansContent.includes("basic") &&
      workoutPlansContent.includes("smart");

    console.log(
      `${hasBlurSupport ? "✅" : "❌"} Blur support for premium content`
    );
    console.log(`${hasSubscriptionCheck ? "✅" : "❌"} Subscription checks`);
    console.log(`${hasTwoPlans ? "✅" : "❌"} Two-plan system display`);

    return { hasBlurSupport, hasSubscriptionCheck, hasTwoPlans };
  } catch (error) {
    console.log("❌ Error reading WorkoutPlansScreen:", error.message);
    return null;
  }
}

function checkBlurComponents() {
  try {
    // בדיקת קיום BlurOverlay component
    const hasBlurOverlay = fs.existsSync("src/components/BlurOverlay.tsx");

    // בדיקת קיום usePremiumAccess hook
    const hasPremiumHook = fs.existsSync("src/hooks/usePremiumAccess.ts");

    // בדיקת דוגמה למסך עם Blur
    const hasExampleScreen = fs.existsSync(
      "src/screens/PremiumContentExample.tsx"
    );

    console.log(`${hasBlurOverlay ? "✅" : "❌"} BlurOverlay component exists`);
    console.log(`${hasPremiumHook ? "✅" : "❌"} usePremiumAccess hook exists`);
    console.log(
      `${hasExampleScreen ? "✅" : "❌"} Premium content example screen exists`
    );

    return { hasBlurOverlay, hasPremiumHook, hasExampleScreen };
  } catch (error) {
    console.log("❌ Error checking blur components:", error.message);
    return null;
  }
}

// ביצוע הבדיקות
const userStoreCheck = checkUserStoreStructure();
console.log("");
const questionnaireCheck = checkQuestionnaireService();
console.log("");
const workoutPlansCheck = checkWorkoutPlansScreen();
console.log("");
const blurComponentsCheck = checkBlurComponents();

console.log("\n📋 סיכום התוצאות:");
console.log("================");

// חישוב מה חסר
const missingFeatures = [];

if (!userStoreCheck?.hasSubscription) {
  missingFeatures.push("Subscription/Trial system in userStore");
}

if (!questionnaireCheck?.hasTwoTierSystem) {
  missingFeatures.push("Two-tier workout system (basic/premium)");
}

if (!blurComponentsCheck?.hasBlurOverlay) {
  missingFeatures.push("BlurOverlay component");
}

if (!blurComponentsCheck?.hasPremiumHook) {
  missingFeatures.push("usePremiumAccess hook");
}

if (!workoutPlansCheck?.hasSubscriptionCheck) {
  missingFeatures.push("Subscription validation in UI");
}

if (missingFeatures.length === 0) {
  console.log("🎉 כל הפיצ'רים הנדרשים קיימים!");
} else {
  console.log("⚠️  פיצ'רים חסרים:");
  missingFeatures.forEach((feature, index) => {
    console.log(`${index + 1}. ${feature}`);
  });
}

console.log("\n🎯 המלצות לשלב הבא:");
if (missingFeatures.length > 0) {
  console.log("1. הוסף את הפיצ'רים החסרים");
  console.log("2. בדוק זרימת נתונים מההרשמה עד התוכניות");
  console.log("3. הוסף מנגנון blur לתוכניות חכמות");
} else {
  console.log("1. בדוק התנהגות בפועל באפליקציה");
  console.log("2. בצע integration tests");
  console.log("3. וודא שמירת נתונים ב-AsyncStorage");
}
