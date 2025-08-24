/**
 * @file scripts/inspectNoaProfile.js
 * @description בדיקה מפורטת של נתוני נועה שפירא לזיהוי מקור הנתונים
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function inspectNoaProfile() {
  console.log("🔍 בדיקה מפורטת של נתוני נועה שפירא\n");

  try {
    // שליפת נתוני נועה שפירא
    const { data: noaData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", "realistic_1755276001521_ifig7z")
      .single();

    if (error) {
      console.error("❌ שגיאה בשליפת נתונים:", error.message);
      return;
    }

    if (!noaData) {
      console.log("❌ נועה שפירא לא נמצאה במסד הנתונים");
      return;
    }

    console.log("✅ נועה שפירא נמצאה במסד הנתונים");
    console.log("🆔 ID:", noaData.id);
    console.log("👤 שם:", noaData.name);
    console.log("📧 אימייל:", noaData.email);
    console.log("\n" + "=".repeat(80));

    // ניתוח questionnaire
    console.log("\n📋 ניתוח שדה QUESTIONNAIRE:");
    console.log("=".repeat(50));
    if (noaData.questionnaire) {
      console.log("📊 תוכן מלא:");
      console.log(JSON.stringify(noaData.questionnaire, null, 2));
      
      console.log("\n🎯 נתונים ספציפיים:");
      console.log(`👶 גיל: ${noaData.questionnaire.age || 'לא מוגדר'}`);
      console.log(`⚡ רמת פעילות: ${noaData.questionnaire.activity_level || 'לא מוגדר'}`);
      console.log(`💭 מוטיבציה: ${JSON.stringify(noaData.questionnaire.motivation_factors || [])}`);
      console.log(`📍 מיקום אימונים: ${noaData.questionnaire.workout_location || 'לא מוגדר'}`);
      console.log(`😴 שעות שינה: ${noaData.questionnaire.sleep_hours || 'לא מוגדר'}`);
      console.log(`⏰ זמן מועדף: ${noaData.questionnaire.workout_time_preference || 'לא מוגדר'}`);
      console.log(`🥗 סוג תזונה: ${noaData.questionnaire.diet_type || 'לא מוגדר'}`);
    } else {
      console.log("❌ אין נתוני questionnaire");
    }

    // ניתוח smartquestionnairedata
    console.log("\n🧠 ניתוח שדה SMARTQUESTIONNAIREDATA:");
    console.log("=".repeat(50));
    if (noaData.smartquestionnairedata) {
      console.log("📊 metadata:");
      console.log(JSON.stringify(noaData.smartquestionnairedata.metadata, null, 2));
      
      console.log("\n🎯 answers:");
      console.log(JSON.stringify(noaData.smartquestionnairedata.answers, null, 2));
      
      console.log("\n📈 נתוני השלמה:");
      const completion = noaData.smartquestionnairedata.metadata?.completionRate || 0;
      const questions = noaData.smartquestionnairedata.metadata?.questionsAnswered || 0;
      console.log(`✅ השלמה: ${completion}%`);
      console.log(`📝 שאלות: ${questions}/13`);
    } else {
      console.log("❌ אין נתוני smartquestionnairedata");
    }

    // ניתוח preferences
    console.log("\n⚙️ ניתוח שדה PREFERENCES:");
    console.log("=".repeat(50));
    if (noaData.preferences) {
      console.log("📊 תוכן מלא:");
      console.log(JSON.stringify(noaData.preferences, null, 2));
    } else {
      console.log("❌ אין העדפות");
    }

    // ניתוח מקור הנתונים
    console.log("\n🔍 ניתוח מקור הנתונים:");
    console.log("=".repeat(50));
    
    const createdDate = new Date(noaData.created_at);
    const updatedDate = new Date(noaData.updated_at);
    
    console.log(`📅 נוצר: ${createdDate.toLocaleString('he-IL')}`);
    console.log(`🔄 עודכן: ${updatedDate.toLocaleString('he-IL')}`);
    
    // בדיקה אם הנתונים נוצרו על ידי הסקריפטים שלנו
    const isFromScript = noaData.questionnaire?.completed_at && 
                        new Date(noaData.questionnaire.completed_at) > new Date('2025-08-24');
    
    console.log(`🤖 נוצר על ידי סקריפט דמו: ${isFromScript ? 'כן' : 'לא'}`);
    
    if (isFromScript) {
      console.log("⚠️ הנתונים נוצרו על ידי סקריפט תיקון הדמו ולא על ידי המשתמש!");
      console.log("💡 זה מסביר מאיפה הגיעו הנתונים המפורטים.");
    }

    // השוואה לנתונים מקוריים
    console.log("\n📋 השוואה לנתונים מקוריים (אם קיימים):");
    console.log("=".repeat(50));
    
    // בדיקה אם יש נתונים מקוריים ב-smartquestionnairedata שלא שונו
    const originalAnswers = noaData.smartquestionnairedata?.answers;
    if (originalAnswers) {
      console.log("🔍 תשובות מקוריות שנמצאו:");
      
      // בדיקת הגיל
      if (originalAnswers.age !== noaData.questionnaire?.age) {
        console.log(`⚠️ גיל שונה: questionnaire=${noaData.questionnaire?.age}, smart=${originalAnswers.age}`);
      }
      
      // בדיקת מטרות
      console.log(`🎯 מטרות מקוריות: ${JSON.stringify(originalAnswers.goals || [])}`);
      console.log(`🎯 מטרות בשאלון: ${JSON.stringify(noaData.questionnaire?.specific_goals || [])}`);
      
      // בדיקת ציוד
      console.log(`🏋️ ציוד מקורי: ${JSON.stringify(originalAnswers.equipment || [])}`);
      console.log(`🏋️ ציוד בשאלון: ${JSON.stringify(noaData.questionnaire?.available_equipment || [])}`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ בדיקה הושלמה!");

  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

// הרצה
inspectNoaProfile()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ שגיאה:", error);
    process.exit(1);
  });
