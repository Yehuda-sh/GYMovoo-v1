/**
 * @file saveQuestionnaireToCloud.ts
 * @description פונקציה לשמירת נתוני השאלון בענן אחרי הרשמה מוצלחת
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../../utils/logger";
import { StorageKeys } from "../../../constants/StorageKeys";

/**
 * שמירת נתוני השאלון בענן אחרי הרשמה מוצלחת
 * @param userId מזהה המשתמש שנרשם
 * @returns Promise<boolean> האם השמירה הצליחה
 */
export const saveQuestionnaireToCloud = async (
  userId: string
): Promise<boolean> => {
  try {
    // קבלת נתוני השאלון מה-AsyncStorage
    const savedQuestionnaire = await AsyncStorage.getItem(
      StorageKeys.SMART_QUESTIONNAIRE_RESULTS
    );

    if (!savedQuestionnaire) {
      logger.info(
        "saveQuestionnaireToCloud",
        "No questionnaire data found to save"
      );
      return true; // לא שגיאה - פשוט אין מה לשמור
    }

    const questionnaireData = JSON.parse(savedQuestionnaire);

    // הכנת הנתונים לשמירה בענן
    const cloudData = {
      user_id: userId,
      questionnaire_data: questionnaireData,
      completed_at:
        questionnaireData.metadata?.completedAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_version: "1.0.0", // TODO: קבל מקובץ package.json
    };

    // TODO: כאן צריך להוסיף את הקריאה האמיתית לשרת
    // לעכשיו זה רק הדמיה
    logger.info("saveQuestionnaireToCloud", "Simulating cloud save", {
      userId,
      dataSize: JSON.stringify(cloudData).length,
    });

    // הדמיית זמן שמירה
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // הדמיית הצלחה/כשלון (95% הצלחה)
    const success = Math.random() > 0.05;

    if (success) {
      logger.info(
        "saveQuestionnaireToCloud",
        "Questionnaire saved to cloud successfully",
        {
          userId,
          timestamp: new Date().toISOString(),
        }
      );

      // שמירת חתמת זמן של גיבוי מוצלח
      await AsyncStorage.setItem(
        `questionnaire_backup_${userId}`,
        new Date().toISOString()
      );

      return true;
    } else {
      throw new Error("Simulated cloud save failure");
    }
  } catch (error) {
    logger.error(
      "saveQuestionnaireToCloud",
      "Failed to save questionnaire to cloud",
      {
        error,
        userId,
      }
    );

    // גם אם הגיבוי נכשל, לא נפסיק את תהליך ההרשמה
    return false;
  }
};

/**
 * בדיקה האם השאלון כבר נשמר בענן
 * @param userId מזהה המשתמש
 * @returns Promise<boolean> האם השאלון כבר נשמר
 */
export const isQuestionnaireSavedInCloud = async (
  userId: string
): Promise<boolean> => {
  try {
    const backupTimestamp = await AsyncStorage.getItem(
      `questionnaire_backup_${userId}`
    );
    return !!backupTimestamp;
  } catch (error) {
    logger.error(
      "isQuestionnaireSavedInCloud",
      "Error checking backup status",
      error
    );
    return false;
  }
};
