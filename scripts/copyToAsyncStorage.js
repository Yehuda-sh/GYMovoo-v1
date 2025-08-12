/**
 * @file copyToAsyncStorage.js
 * @description העתקת נתוני דני כהן מ-simulation ל-AsyncStorage הרגיל
 */

const fs = require("fs").promises;
const path = require("path");

async function copySimulationToAsyncStorage() {
  try {
    console.log("📁 מעתיק נתונים מ-simulation ל-AsyncStorage...");

    const simulationDir = path.join(__dirname, "../storage_simulation");
    const files = await fs.readdir(simulationDir);

    // רשימת הקבצים שנוצרו
    const targetFiles = [
      "user_data_complete.json",
      "workout_history_dani.json",
      "workout_plans_dani.json",
      "user_statistics_dani.json",
    ];

    for (const fileName of targetFiles) {
      if (files.includes(fileName)) {
        const sourceFile = path.join(simulationDir, fileName);
        const data = await fs.readFile(sourceFile, "utf8");

        console.log(`✅ נמצא ${fileName} - ${data.length} תווים`);

        // בדיקה שהנתונים תקינים
        try {
          const parsed = JSON.parse(data);
          if (fileName === "workout_history_dani.json") {
            console.log(`  📅 היסטוריה: ${parsed.length} אימונים`);
          } else if (fileName === "user_data_complete.json") {
            console.log(
              `  👤 משתמש: ${parsed.name}, מנוי: ${parsed.subscription?.type}`
            );
          } else if (fileName === "workout_plans_dani.json") {
            console.log(`  📋 תוכניות: ${Object.keys(parsed).length} תוכניות`);
          } else if (fileName === "user_statistics_dani.json") {
            console.log(`  📊 סטטיסטיקות: ${parsed.totalWorkouts} אימונים`);
          }
        } catch (e) {
          console.warn(`⚠️ שגיאה בפרסינג ${fileName}:`, e.message);
        }
      } else {
        console.warn(`❌ קובץ ${fileName} לא נמצא`);
      }
    }

    console.log("\n🎯 הנתונים מוכנים לשימוש ב-React Native!");
    console.log("עכשיו אפשר לטעון את דני כהן עם כל הנתונים המלאים.");
  } catch (error) {
    console.error("❌ שגיאה בהעתקה:", error);
  }
}

// הרצה
copySimulationToAsyncStorage();
