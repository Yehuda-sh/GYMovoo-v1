/**
 * 📘 WorkoutHistoryService Usage Examples
 *
 * דוגמאות לשימוש ב-WorkoutHistoryService המשופר עם תמיכה בהתאמת מגדר
 * Enhanced WorkoutHistoryService usage examples with gender adaptation support
 *
 * Created: 2025-07-30
 * Updated: 2025-07-30
 */

import {
  workoutHistoryService,
  WorkoutWithFeedback,
  PersonalRecord,
} from "./workoutHistoryService";
import { WorkoutData } from "../screens/workout/types/workout.types";

// =======================================
// 📊 Basic Usage Examples
// דוגמאות שימוש בסיסיות
// =======================================

/**
 * Example 1: Saving Workout with Gender Adaptation (Conceptual)
 * דוגמה 1: שמירת אימון עם התאמת מגדר (רעיונית)
 */
export const saveWorkoutWithGenderExample = async () => {
  console.log("💾 Saving workout with gender adaptation...");

  // הדוגמה הזו מראה את העקרונות, לא את הטיפוסים המלאים
  console.log(
    "📋 Conceptual example - real usage requires full WorkoutData types"
  );

  try {
    // בחיים האמיתיים, תקבל WorkoutData מלא מהמסך
    // const workout = getCompletedWorkoutFromScreen();

    // דוגמה לשמירה עם מגדר
    console.log("🔄 Process:");
    console.log("1. Get completed workout data from workout screen");
    console.log("2. Get user gender from userStore or questionnaire");
    console.log(
      "3. Call: await workoutHistoryService.saveWorkoutWithFeedback(workout, userGender)"
    );

    console.log("\n✨ What happens automatically:");
    console.log(
      "📝 Exercise names adapted to gender (Push-ups → שכיבות סמיכה מותאמות for female)"
    );
    console.log(
      "🎉 Congratulation message generated based on gender and achievements"
    );
    console.log("💭 Personal notes created with gender-appropriate language");
    console.log("📱 Device metadata collected automatically");
    console.log("💾 All data saved to AsyncStorage with full validation");
  } catch (error) {
    console.error("❌ Failed to save workout:", error);
  }
};

/**
 * Example 2: Getting Gender-Adapted Messages
 * דוגמה 2: קבלת הודעות מותאמות מגדר
 */
export const getGenderAdaptedMessagesExample = async () => {
  console.log("📬 Getting gender-adapted messages...");

  try {
    // קבלת הודעת ברכה אחרונה
    const congratsMessage =
      await workoutHistoryService.getLatestCongratulationMessage();
    console.log("🎉 Latest congratulation:", congratsMessage);

    // קבלת הערות מותאמות אחרונות
    const adaptedNotes =
      await workoutHistoryService.getLatestGenderAdaptedNotes();
    console.log("📝 Latest adapted notes:", adaptedNotes);
  } catch (error) {
    console.error("❌ Failed to get messages:", error);
  }
};

// =======================================
// 📈 Statistics & Analytics Examples
// דוגמאות סטטיסטיקה וניתוח
// =======================================

/**
 * Example 3: Gender-Grouped Statistics
 * דוגמה 3: סטטיסטיקות מקובצות לפי מגדר
 */
export const getGenderStatisticsExample = async () => {
  console.log("📊 Getting gender-grouped statistics...");

  try {
    const stats = await workoutHistoryService.getGenderGroupedStatistics();

    console.log("\n👥 Statistics by Gender:");
    console.log(
      `👨 Male workouts: ${stats.byGender.male.count} (avg difficulty: ${stats.byGender.male.averageDifficulty.toFixed(1)})`
    );
    console.log(
      `👩 Female workouts: ${stats.byGender.female.count} (avg difficulty: ${stats.byGender.female.averageDifficulty.toFixed(1)})`
    );
    console.log(
      `⚡ Other workouts: ${stats.byGender.other.count} (avg difficulty: ${stats.byGender.other.averageDifficulty.toFixed(1)})`
    );

    console.log(`\n📈 Total Statistics:`);
    console.log(`🏋️ Total workouts: ${stats.total.totalWorkouts}`);
    console.log(`⏱️ Total duration: ${stats.total.totalDuration} minutes`);
    console.log(`🔥 Workout streak: ${stats.total.workoutStreak} days`);
  } catch (error) {
    console.error("❌ Failed to get statistics:", error);
  }
};

/**
 * Example 4: Personal Records Detection (Conceptual)
 * דוגמה 4: זיהוי שיאים אישיים (רעיוני)
 */
export const detectPersonalRecordsExample = async () => {
  console.log("🏆 Detecting personal records...");

  console.log(
    "📋 Conceptual example - real usage requires full WorkoutData types"
  );

  try {
    console.log("🔄 How personal records detection works:");
    console.log("1. Service receives completed workout data");
    console.log("2. Compares current performance with previous records");
    console.log("3. Identifies improvements in weight, reps, or volume");
    console.log("4. Returns array of PersonalRecord objects");

    console.log("\n🎯 Example detection results:");
    console.log("🏋️ Bench Press:");
    console.log("   Type: weight");
    console.log("   New value: 85kg (previous: 80kg)");
    console.log("   Improvement: +5kg");
    console.log("🏋️ Bench Press:");
    console.log("   Type: reps");
    console.log("   New value: 10 reps (previous: 8 reps)");
    console.log("   Improvement: +2 reps");

    // בחיים האמיתיים:
    // const records = await workoutHistoryService.detectPersonalRecords(completedWorkout);
  } catch (error) {
    console.error("❌ Failed to detect personal records:", error);
  }
};

// =======================================
// 🔧 Data Management Examples
// דוגמאות ניהול נתונים
// =======================================

/**
 * Example 5: Data Validation
 * דוגמה 5: בדיקת תקינות נתונים
 */
export const validateHistoryDataExample = async () => {
  console.log("🔍 Validating workout history data...");

  try {
    const validation = await workoutHistoryService.validateHistoryData();

    console.log(`📊 Validation Results:`);
    console.log(`✅ Data is valid: ${validation.isValid}`);
    console.log(`📁 Total records: ${validation.totalRecords}`);
    console.log(`❌ Corrupted records: ${validation.corruptedRecords}`);

    if (validation.issues.length > 0) {
      console.log(`⚠️ Issues found:`);
      validation.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to validate data:", error);
  }
};

/**
 * Example 6: Previous Performance Lookup
 * דוגמה 6: חיפוש ביצועים קודמים
 */
export const getPreviousPerformanceExample = async () => {
  console.log("📊 Getting previous performance data...");

  try {
    // חיפוש ביצועים קודמים לתרגיל ספציפי
    const performance =
      await workoutHistoryService.getPreviousPerformanceForExercise("Push-ups");

    if (performance) {
      console.log(`📈 Previous performance for ${performance.exerciseName}:`);
      console.log(
        `📅 Last performed: ${new Date(performance.date).toLocaleDateString()}`
      );
      console.log(`🏋️ Sets performed: ${performance.sets.length}`);

      performance.sets.forEach((set, index) => {
        console.log(`  Set ${index + 1}: ${set.reps} reps @ ${set.weight}kg`);
      });

      console.log(`🏆 Personal Records:`);
      console.log(`  Max Weight: ${performance.personalRecords.maxWeight}kg`);
      console.log(`  Max Reps: ${performance.personalRecords.maxReps}`);
      console.log(`  Max Volume: ${performance.personalRecords.maxVolume}`);
      console.log(`  Total Volume: ${performance.personalRecords.totalVolume}`);
    } else {
      console.log("📝 No previous performance found for this exercise");
    }
  } catch (error) {
    console.error("❌ Failed to get previous performance:", error);
  }
};

// =======================================
// ⏰ Time Management Examples
// דוגמאות ניהול זמן
// =======================================

/**
 * Example 7: Workout Time Tracking
 * דוגמה 7: מעקב זמני אימון
 */
export const workoutTimeTrackingExample = async () => {
  console.log("⏰ Managing workout time tracking...");

  const workoutId = "workout_789";

  try {
    // תיעוד התחלת אימון
    await workoutHistoryService.recordWorkoutStart(workoutId);
    console.log("🚀 Workout start time recorded");

    // סימולציה של אימון (5 שניות)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // קבלת זמן התחלה
    const startTime =
      await workoutHistoryService.getWorkoutStartTime(workoutId);
    console.log(`⏱️ Workout started at: ${startTime}`);

    // חישוב משך זמן
    if (startTime) {
      const duration = Math.round(
        (Date.now() - new Date(startTime).getTime()) / 1000
      );
      console.log(`📊 Workout duration: ${duration} seconds`);
    }

    // ניקוי זמן התחלה
    await workoutHistoryService.clearWorkoutStartTime(workoutId);
    console.log("🧹 Start time cleared");
  } catch (error) {
    console.error("❌ Failed to manage workout time:", error);
  }
};

// =======================================
// 🏆 Advanced Features Examples
// דוגמאות תכונות מתקדמות
// =======================================

/**
 * Example 8: Complete Workout History Analysis
 * דוגמה 8: ניתוח מלא של היסטוריית אימונים
 */
export const completeHistoryAnalysisExample = async () => {
  console.log("🔬 Performing complete workout history analysis...");

  try {
    // קבלת כל ההיסטוריה
    const history = await workoutHistoryService.getWorkoutHistory();
    console.log(`📚 Total workouts in history: ${history.length}`);

    if (history.length > 0) {
      // ניתוח האימון האחרון
      const latestWorkout = history[0];
      console.log(`\n📊 Latest Workout Analysis:`);
      console.log(
        `🏋️ Name: ${latestWorkout.workout.name || "Unnamed Workout"}`
      );
      console.log(
        `📅 Completed: ${new Date(latestWorkout.feedback.completedAt).toLocaleDateString()}`
      );
      console.log(`⭐ Difficulty: ${latestWorkout.feedback.difficulty}/5`);
      console.log(`😊 Feeling: ${latestWorkout.feedback.feeling}`);
      console.log(`⏱️ Duration: ${latestWorkout.stats.duration} minutes`);
      console.log(
        `🏆 Personal Records: ${latestWorkout.stats.personalRecords}`
      );

      // הודעות מותאמות למגדר
      if (latestWorkout.feedback.congratulationMessage) {
        console.log(
          `🎉 Congratulation: ${latestWorkout.feedback.congratulationMessage}`
        );
      }

      if (latestWorkout.feedback.genderAdaptedNotes) {
        console.log(`📝 Notes: ${latestWorkout.feedback.genderAdaptedNotes}`);
      }

      // מטא-דאטה
      if (latestWorkout.metadata) {
        console.log(`\n🔧 Metadata:`);
        console.log(
          `  Platform: ${latestWorkout.metadata.deviceInfo.platform}`
        );
        console.log(
          `  Gender: ${latestWorkout.metadata.userGender || "Not specified"}`
        );
        console.log(`  Version: ${latestWorkout.metadata.version}`);
        console.log(`  Source: ${latestWorkout.metadata.workoutSource}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to analyze history:", error);
  }
};

/**
 * Example 9: Gender-Specific Message Examples
 * דוגמה 9: דוגמאות הודעות ספציפיות למגדר
 */
export const genderSpecificMessagesExample = () => {
  console.log("👥 Gender-specific message examples:");

  // הודעות ברכה לפי מגדר
  console.log("\n🎉 Congratulation Messages:");
  console.log("👨 Male (with 2 PRs): 'אלוף! השגת 2 שיאים - אתה בדרך הנכונה!'");
  console.log("👩 Female (with 1 PR): 'מלכה! השגת 1 שיאים - המשיכי לכבוש!'");
  console.log("⚡ Other (no PRs): 'אימון מעולה! המשך בדרך הנכונה!'");

  // הערות מותאמות לקושי
  console.log("\n📝 Difficulty-Based Notes:");
  console.log("👨 Male (hard): 'אימון קשה אבל הרגשתי כמו אריה!'");
  console.log("👩 Female (hard): 'אימון מאתגר אבל הרגשתי כמו לוחמת!'");
  console.log("👨 Male (easy): 'אימון נעים, הרגשתי חזק ובשליטה'");
  console.log("👩 Female (easy): 'אימון נעים, הרגשתי חזקה ובטוחה'");

  // התאמות שמות תרגילים
  console.log("\n🏋️ Exercise Name Adaptations:");
  console.log("👩 Female: Push-ups → שכיבות סמיכה מותאמות");
  console.log("👨 Male: Push-ups → שכיבות סמיכה חזקות");
  console.log("👩 Female: Squats → כפיפות ברכיים נשיות");
  console.log("👨 Male: Deadlift → הרמת משקל כבד");
};

/**
 * Example 10: Integration with User Store
 * דוגמה 10: אינטגרציה עם חנות המשתמש
 */
export const userStoreIntegrationExample = async () => {
  console.log("🔗 Integration with user store (conceptual):");

  // זהו מדמה איך השירות יכול להתחבר ל-userStore
  console.log("\n💡 Conceptual integration patterns:");

  console.log("1. 📥 Get user gender from userStore:");
  console.log("   const { user } = useUserStore();");
  console.log("   const gender = user?.questionnaire?.gender;");

  console.log("\n2. 💾 Save workout with user gender:");
  console.log(
    "   await workoutHistoryService.saveWorkoutWithFeedback(workout, gender);"
  );

  console.log("\n3. 🔄 Update user stats in userStore:");
  console.log(
    "   const stats = await workoutHistoryService.getWorkoutStatistics();"
  );
  console.log("   updateUserStats(stats);");

  console.log("\n4. 🏆 Sync personal records:");
  console.log(
    "   const records = await workoutHistoryService.detectPersonalRecords(workout);"
  );
  console.log("   updatePersonalRecords(records);");
};

// =======================================
// 🚀 Export All Examples
// ייצוא כל הדוגמאות
// =======================================

export const allWorkoutHistoryExamples = {
  // Basic Usage
  saveWorkoutWithGenderExample,
  getGenderAdaptedMessagesExample,

  // Statistics & Analytics
  getGenderStatisticsExample,
  detectPersonalRecordsExample,

  // Data Management
  validateHistoryDataExample,
  getPreviousPerformanceExample,

  // Time Management
  workoutTimeTrackingExample,

  // Advanced Features
  completeHistoryAnalysisExample,
  genderSpecificMessagesExample,
  userStoreIntegrationExample,
};

console.log("📘 WorkoutHistoryService Examples loaded successfully!");

/**
 * 🎯 Quick Reference Guide
 *
 * Key Features:
 * 🏋️ Enhanced workout saving with gender adaptation
 * 👥 Gender-specific congratulation messages and notes
 * 📊 Comprehensive statistics grouped by gender
 * 🏆 Automatic personal records detection
 * 🔍 Data validation and integrity checks
 * ⏰ Workout time tracking and management
 * 📱 Device metadata collection
 * 🔄 Integration-ready for userStore
 *
 * New Functions Added:
 * - saveWorkoutWithFeedback() - Enhanced with gender parameter
 * - getLatestCongratulationMessage() - Get gender-adapted messages
 * - getLatestGenderAdaptedNotes() - Get personalized notes
 * - getGenderGroupedStatistics() - Statistics by gender
 * - validateHistoryData() - Data integrity validation
 * - generateGenderAdaptedCongratulation() - Private gender message generator
 * - generateGenderAdaptedNotes() - Private gender notes generator
 * - adaptExerciseNameToGender() - Private exercise name adapter
 */
