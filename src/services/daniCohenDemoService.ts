import AsyncStorage from "@react-native-async-storage/async-storage";
import daniCohenData from "../data/daniCohenDemo.json";

/**
 * טוען נתוני דמו של דני כהן מקובץ JSON ושומר ב-AsyncStorage
 * פתרון פשוט ונקי ללא סקריפטים מורכבים
 */
export const loadDaniCohenDemo = async (): Promise<void> => {
  try {
    console.warn("🎭 טוען נתוני דמו של דני כהן...");

    // לוג לבדיקת הנתונים שנטענו מהקובץ
    console.warn("🔍 בודק נתונים מקובץ JSON:", {
      age: daniCohenData.smartQuestionnaireData.answers.personalInfo.age,
      goals: daniCohenData.smartQuestionnaireData.answers.goals,
      equipment: daniCohenData.smartQuestionnaireData.answers.equipment,
    });

    // יצירת אובייקט משתמש מלא עם כל הנתונים המשולבים
    const completeUser = {
      ...daniCohenData.user,
      smartQuestionnaireData: daniCohenData.smartQuestionnaireData,
      // 🆕 הוספת היסטוריית פעילות לתמיכה בסטטיסטיקות ורצף במסך הפרופיל
      activityHistory: {
        workouts: daniCohenData.workoutHistory,
      },
      // 🆕 סטטיסטיקות בסיסיות למקרי נפילה במסך הפרופיל
      trainingStats: {
        totalWorkouts: Array.isArray(daniCohenData.workoutHistory)
          ? daniCohenData.workoutHistory.length
          : 0,
      },
      // הוספת השדות הישנים לתאימות לאחור
      questionnaire: {
        age: daniCohenData.smartQuestionnaireData.answers.personalInfo.age, // "26_35" מהקובץ המרכזי
        gender:
          daniCohenData.smartQuestionnaireData.answers.personalInfo.gender,
        height:
          daniCohenData.smartQuestionnaireData.answers.personalInfo.height,
        weight:
          daniCohenData.smartQuestionnaireData.answers.personalInfo.weight,
        goals: daniCohenData.smartQuestionnaireData.answers.goals,
        goal: daniCohenData.smartQuestionnaireData.answers.goals[0], // שדה יחיד
        experienceLevel:
          daniCohenData.smartQuestionnaireData.answers.experienceLevel,
        experience:
          daniCohenData.smartQuestionnaireData.answers.experienceLevel,
        availability: daniCohenData.smartQuestionnaireData.answers.availability,
        sessionDuration:
          daniCohenData.smartQuestionnaireData.answers.sessionDuration,
        duration: daniCohenData.smartQuestionnaireData.answers.sessionDuration,
        equipment: daniCohenData.smartQuestionnaireData.answers.equipment,
        completedAt: daniCohenData.smartQuestionnaireData.completedAt,
        // שדות נוספים שProfileScreen מחפש
        frequency:
          daniCohenData.smartQuestionnaireData.answers.availability.length, // מספר ימים
        location: "home", // ברירת מחדל
        // 🔧 תיקון ערך דיאטה לא חוקי ל- none_diet לפי unifiedQuestionnaire
        diet_type: "none_diet",
      },
    };

    // שמירת נתוני המשתמש המלאים
    await AsyncStorage.setItem("user", JSON.stringify(completeUser));
    console.warn("✅ נתוני משתמש נשמרו");

    // שמירת נתוני השאלון החכם (נפרד)
    await AsyncStorage.setItem(
      "smartQuestionnaireData",
      JSON.stringify(daniCohenData.smartQuestionnaireData)
    );
    console.warn("✅ נתוני שאלון חכם נשמרו");

    // שמירת היסטוריית אימונים
    await AsyncStorage.setItem(
      "workoutHistory",
      JSON.stringify(daniCohenData.workoutHistory)
    );
    console.warn("✅ היסטוריית אימונים נשמרה");

    // שמירת תוכניות אימון
    await AsyncStorage.setItem(
      "workoutPlans",
      JSON.stringify(daniCohenData.workoutPlans)
    );
    console.warn("✅ תוכניות אימון נשמרו");

    // שמירת סטטיסטיקות
    await AsyncStorage.setItem(
      "userStatistics",
      JSON.stringify(daniCohenData.statistics)
    );
    console.warn("✅ סטטיסטיקות נשמרו");

    console.warn("🎉 דני כהן נטען בהצלחה עם כל הנתונים!");
    console.warn(
      `📊 סיכום: ${daniCohenData.statistics.totalWorkouts} אימונים, ${daniCohenData.statistics.personalRecords} שיאים אישיים`
    );
  } catch (error) {
    console.error("❌ שגיאה בטעינת נתוני דני כהן:", error);
    throw error;
  }
};

/**
 * מנקה את כל נתוני הדמו מ-AsyncStorage
 */
export const clearDaniCohenDemo = async (): Promise<void> => {
  try {
    console.warn("🧹 מנקה נתוני דמו של דני כהן...");

    await AsyncStorage.multiRemove([
      "user",
      "smartQuestionnaireData",
      "workoutHistory",
      "workoutPlans",
      "userStatistics",
    ]);

    console.warn("✅ נתוני דמו נוקו בהצלחה");
  } catch (error) {
    console.error("❌ שגיאה בניקוי נתוני דמו:", error);
    throw error;
  }
};
