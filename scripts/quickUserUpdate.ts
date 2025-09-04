/**
 * כלי מהיר לעדכון משתמשים ב-GYMovoo
 * Quick User Update Tool for GYMovoo
 */

import { userApi } from "../src/services/api/userApi";
import type { User } from "../src/types";

/**
 * עדכון שדה ספציפי לכל המשתמשים
 * Update specific field for all users
 */
export async function updateAllUsersField(
  fieldName: keyof User,
  getValue: (user: User) => unknown
) {
  try {
    // eslint-disable-next-line no-console
    console.log(`🔄 מעדכן שדה '${fieldName}' לכל המשתמשים...`);

    const allUsers = await userApi.list();
    if (!allUsers?.length) {
      // eslint-disable-next-line no-console
      console.log("❌ לא נמצאו משתמשים");
      return;
    }

    let updatedCount = 0;
    for (const user of allUsers) {
      if (!user.id || user.id.startsWith("demo_")) continue;

      try {
        const newValue = getValue(user);
        if (newValue !== undefined) {
          await userApi.update(user.id, { [fieldName]: newValue });
          updatedCount++;
          // eslint-disable-next-line no-console
          console.log(`   ✅ עודכן: ${user.name || user.email}`);
        }
      } catch (error) {
        console.error(`   ❌ שגיאה ב-${user.id}:`, error);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`\n🎉 עודכנו ${updatedCount} משתמשים`);
    return updatedCount;
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
    throw error;
  }
}

/**
 * דוגמאות לשימוש
 * Usage examples
 */

// עדכון העדפת שפה לכל המשתמשים
export const setLanguageForAllUsers = () => {
  return updateAllUsersField("preferences", (user) => ({
    ...user.preferences,
    language: "he" as const,
  }));
};

// הוספת timestamp של עדכון אחרון
export const addLastUpdateTimestamp = () => {
  return updateAllUsersField("updated_at" as keyof User, () =>
    new Date().toISOString()
  );
};

// עדכון מבנה subscription לתואמות
export const updateSubscriptionStructure = () => {
  return updateAllUsersField("subscription", (user) => ({
    ...user.subscription,
    lastTrialCheck: new Date().toISOString(),
    status: user.subscription?.status || "free",
  }));
};

// מיגרציה של נתוני questionnaire ישנים
export const migrateQuestionnaireData = () => {
  return updateAllUsersField("smartquestionnairedata", (user) => {
    if (!user.smartquestionnairedata) return undefined;

    return {
      ...user.smartquestionnairedata,
      metadata: {
        ...user.smartquestionnairedata.metadata,
        migrated: true,
        migrationDate: new Date().toISOString(),
      },
    };
  });
};

/**
 * עדכונים מותאמים אישית
 * Custom updates
 */
export const customUserUpdates = {
  // תיקון נתוני training stats
  fixTrainingStats: () =>
    updateAllUsersField("trainingstats", (user) => ({
      totalWorkouts: user.trainingstats?.totalWorkouts || 0,
      currentFitnessLevel:
        user.trainingstats?.currentFitnessLevel || "beginner",
      totalMinutes: user.trainingstats?.totalMinutes || 0,
    })),

  // וידוא מבנה העדפות
  ensurePreferencesStructure: () =>
    updateAllUsersField("preferences", (user) => ({
      theme: user.preferences?.theme || "light",
      notifications: user.preferences?.notifications ?? true,
      language: user.preferences?.language || "he",
    })),

  // ניקוי נתונים מיותרים
  cleanupObsoleteData: () =>
    updateAllUsersField("questionnaire", (user) => {
      if (!user.questionnaire) return undefined;

      // הסרת שדות ישנים שכבר לא בשימוש
      const cleaned = { ...user.questionnaire };
      const cleanedRecord = cleaned as Record<string, unknown>;
      delete cleanedRecord.obsoleteField1;
      delete cleanedRecord.oldData;

      return cleaned;
    }),
};

/**
 * הרצת migration כללי
 * Run general migration
 */
export async function runFullMigration() {
  // eslint-disable-next-line no-console
  console.log("🚀 מתחיל migration מלא למשתמשים...\n");

  try {
    // 1. עדכון מבנה העדפות
    // eslint-disable-next-line no-console
    console.log("1️⃣ מעדכן מבנה העדפות...");
    await customUserUpdates.ensurePreferencesStructure();

    // 2. תיקון נתוני אימון
    // eslint-disable-next-line no-console
    console.log("\n2️⃣ מתקן נתוני אימון...");
    await customUserUpdates.fixTrainingStats();

    // 3. עדכון נתוני שאלון חכם
    // eslint-disable-next-line no-console
    console.log("\n3️⃣ מעדכן נתוני שאלון חכם...");
    await migrateQuestionnaireData();

    // 4. הוספת timestamp
    // eslint-disable-next-line no-console
    console.log("\n4️⃣ מוסיף timestamp עדכון...");
    await addLastUpdateTimestamp();

    // eslint-disable-next-line no-console
    console.log("\n✨ Migration הושלם בהצלחה!");
  } catch (error) {
    console.error("❌ שגיאה ב-migration:", error);
    throw error;
  }
}

// אם זה הקובץ הראשי - הרץ את המיגריציה
if (require.main === module) {
  runFullMigration().catch(console.error);
}
