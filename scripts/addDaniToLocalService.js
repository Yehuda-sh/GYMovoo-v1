/**
 * @file scripts/addDaniToLocalService.js
 * @description הוספת דני כהן ל-localDataService למטרת בדיקה מהירה
 * English: Add Dani Cohen to localDataService for quick testing
 */

console.log("📱 הוספת דני כהן ל-localDataService...");

// צריך להריץ את זה בסביבת React Native, לא ב-Node.js
// המטרה: ליצור קובץ שיריץ בתוך האפליקציה

const addDaniToLocalService = `
// הרץ את זה ב-console של האפליקציה או הוסף לקובץ זמני

import { localDataService } from './src/services/localDataService';

const daniCohen = {
  id: "user_dani_cohen_real",
  name: "דני כהן", 
  email: "dani.cohen.gym@gmail.com",
  password: "123456", // סיסמה פשוטה לבדיקה
  age: 28,
  gender: "male",
  avatar: undefined,
  provider: "manual",
  metadata: {
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // לפני 6 חודשים
    isRandom: false,
    sessionId: "dani_cohen_session"
  }
};

localDataService.addUser(daniCohen);
console.log("✅ דני כהן נוסף ל-localDataService!");
console.log("👤 משתמשים זמינים:", localDataService.getUsers().length);
`;

console.log("📝 קוד להרצה באפליקציה:");
console.log(addDaniToLocalService);

console.log("\n🎯 המלצה: נרשום דני כהן ידנית באפליקציה");
console.log("📧 אימייל: dani.cohen.gym@gmail.com");
console.log("🔑 סיסמה: 123456");

module.exports = { addDaniToLocalService };
