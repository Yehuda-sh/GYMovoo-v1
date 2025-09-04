/**
 * סקריפט להעלאה ועדכון מאסיבי של משתמשים בשרת
 * User Migration and Bulk Update Script
 */

const userApi = require("../src/services/api/userApi");

/**
 * עדכון כל המשתמשים הקיימים בשרת
 * Updates all existing users in the server
 */
async function updateAllUsers() {
  try {
    console.log("🔄 טוען רשימת משתמשים קיימים...");
    const allUsers = await userApi.list();

    if (!allUsers || allUsers.length === 0) {
      console.log("❌ לא נמצאו משתמשים בשרת");
      return;
    }

    console.log(`✅ נמצאו ${allUsers.length} משתמשים`);

    // עדכון כל משתמש
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      console.log(
        `\n📝 מעדכן משתמש ${i + 1}/${allUsers.length}: ${user.name || user.email}`
      );

      try {
        // כאן תוכל להוסיף את העדכונים הספציפיים שאתה צריך
        const updates = {
          // דוגמאות לעדכונים:
          // updated_at: new Date().toISOString(),
          // preferences: { ...user.preferences, language: 'he' },
          // subscription: { ...user.subscription, lastCheck: new Date().toISOString() }
        };

        // אם יש עדכונים לביצוע
        if (Object.keys(updates).length > 0) {
          await userApi.update(user.id, updates);
          console.log(`   ✅ עודכן בהצלחה`);
        } else {
          console.log(`   ⏭️  אין עדכונים לביצוע`);
        }
      } catch (updateError) {
        console.error(`   ❌ שגיאה בעדכון:`, updateError.message);
      }

      // השהיה קטנה למניעת עומס על השרת
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("\n🎉 סיום עדכון המשתמשים");
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

/**
 * בדיקת תקינות נתוני משתמשים
 * Validates user data integrity
 */
async function validateUsersData() {
  try {
    console.log("🔍 בודק תקינות נתוני משתמשים...");
    const allUsers = await userApi.list();

    const stats = {
      total: allUsers.length,
      withQuestionnaire: 0,
      withSmartQuestionnaire: 0,
      withWorkoutPlans: 0,
      withSubscription: 0,
      demoUsers: 0,
      missingFields: [],
    };

    allUsers.forEach((user, index) => {
      // ספירת נתונים
      if (user.questionnaire) stats.withQuestionnaire++;
      if (user.smartquestionnairedata) stats.withSmartQuestionnaire++;
      if (user.workoutplans) stats.withWorkoutPlans++;
      if (user.subscription) stats.withSubscription++;
      if (user.id?.startsWith("demo_")) stats.demoUsers++;

      // בדיקת שדות חסרים
      const requiredFields = ["id", "email"];
      requiredFields.forEach((field) => {
        if (!user[field]) {
          stats.missingFields.push({
            userIndex: index,
            userId: user.id,
            missingField: field,
          });
        }
      });
    });

    console.log("\n📊 סטטיסטיקות משתמשים:");
    console.log(`   סה"כ משתמשים: ${stats.total}`);
    console.log(`   עם שאלון רגיל: ${stats.withQuestionnaire}`);
    console.log(`   עם שאלון חכם: ${stats.withSmartQuestionnaire}`);
    console.log(`   עם תוכניות אימון: ${stats.withWorkoutPlans}`);
    console.log(`   עם מנוי: ${stats.withSubscription}`);
    console.log(`   משתמשי דמו: ${stats.demoUsers}`);

    if (stats.missingFields.length > 0) {
      console.log("\n⚠️  שדות חסרים:");
      stats.missingFields.forEach((item) => {
        console.log(
          `   משתמש ${item.userIndex}: חסר שדה '${item.missingField}'`
        );
      });
    } else {
      console.log("\n✅ כל השדות הנדרשים קיימים");
    }

    return stats;
  } catch (error) {
    console.error("❌ שגיאה בבדיקת נתונים:", error);
  }
}

/**
 * יצירת backup למשתמשים
 * Creates backup of all users
 */
async function backupUsers() {
  try {
    console.log("💾 יוצר backup למשתמשים...");
    const allUsers = await userApi.list();

    const backup = {
      timestamp: new Date().toISOString(),
      userCount: allUsers.length,
      users: allUsers,
    };

    const fs = require("fs");
    const backupPath = `./backup-users-${Date.now()}.json`;
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    console.log(`✅ Backup נשמר: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error("❌ שגיאה ביצירת backup:", error);
  }
}

// הרצת הסקריפט
async function main() {
  console.log("🚀 מתחיל סקריפט ניהול משתמשים\n");

  // 1. יצירת backup
  await backupUsers();

  // 2. בדיקת תקינות נתונים
  await validateUsersData();

  // 3. עדכון משתמשים (הסר הערה לביצוע)
  // await updateAllUsers();

  console.log("\n✨ סיום הסקריפט");
}

// הפעל רק אם זה הקובץ הראשי
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  updateAllUsers,
  validateUsersData,
  backupUsers,
};
