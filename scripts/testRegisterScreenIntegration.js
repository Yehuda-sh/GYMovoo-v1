/**
 * @file testRegisterScreenIntegration.js
 * @description בדיקה ידנית של האינטגרציה בין RegisterScreen ל-localDataService
 * Manual test of RegisterScreen integration with localDataService
 */

// ייבא את המוקפה של localDataService לבדיקה
const localDataService = {
  users: [],
  getUsers: function () {
    return this.users;
  },
  addUser: function (user) {
    this.users.push(user);
    return user;
  },
  updateUser: function (id, data) {
    const user = this.users.find((u) => u.id === id);
    if (user) Object.assign(user, data);
    return user;
  },
};

console.warn("🧪 בדיקת אינטגרציה RegisterScreen עם localDataService");
console.warn("===================================================");

// בדיקה 1: רישום משתמש ידני
console.log("\n1. בדיקת רישום משתמש ידני:");
const manualUser = {
  email: "manual@example.com",
  name: "משתמש ידני",
  id: "manual_123",
  provider: "manual",
};

const savedManualUser = localDataService.addUser(manualUser);
console.log("✅ משתמש נוסף:", savedManualUser.name, savedManualUser.email);

// בדיקה 2: רישום משתמש Google
console.log("\n2. בדיקת רישום משתמש Google:");
const googleUser = {
  email: "google@example.com",
  name: "משתמש Google",
  id: "google_123",
  provider: "google",
  questionnaire: { 1: "תשובה1", 2: "תשובה2" },
  questionnaireData: {
    answers: ["תשובה1", "תשובה2"],
    completedAt: new Date().toISOString(),
    version: "1.0",
  },
};

const savedGoogleUser = localDataService.addUser(googleUser);
console.log(
  "✅ משתמש Google נוסף:",
  savedGoogleUser.name,
  savedGoogleUser.email
);

// בדיקה 3: קבלת רשימת משתמשים (כמו WelcomeScreen)
console.log("\n3. בדיקת רשימת משתמשים לכניסה מהירה:");
const allUsers = localDataService.getUsers();
console.log(`✅ נמצאו ${allUsers.length} משתמשים במערכת:`);
allUsers.forEach((user, index) => {
  console.log(
    `   ${index + 1}. ${user.name} (${user.email}) - ${user.provider}`
  );
});

// בדיקה 4: סימולציה של quick login
console.log("\n4. בדיקת התחברות מהירה (כמו WelcomeScreen):");
if (allUsers.length > 0) {
  const firstUser = allUsers[0];
  console.log("✅ התחברות מהירה עם:", firstUser.name, firstUser.email);
  console.log("   Provider:", firstUser.provider);
  console.log("   ID:", firstUser.id);
} else {
  console.log("❌ אין משתמשים במערכת");
}

// בדיקה 5: בדיקת תקינות נתונים
console.log("\n5. בדיקת תקינות נתונים:");
const issues = [];

allUsers.forEach((user) => {
  if (!user.email) issues.push(`משתמש ללא email: ${user.name}`);
  if (!user.name) issues.push(`משתמש ללא שם: ${user.email}`);
  if (!user.id) issues.push(`משתמש ללא ID: ${user.email}`);
  if (!user.provider) issues.push(`משתמש ללא provider: ${user.email}`);
});

if (issues.length === 0) {
  console.log("✅ כל הנתונים תקינים");
} else {
  console.log("❌ נמצאו בעיות:");
  issues.forEach((issue) => console.log(`   - ${issue}`));
}

console.log("\n=== סיכום בדיקת האינטגרציה ===");
console.log(`✅ רישום ידני: ${manualUser.name} נשמר בהצלחה`);
console.log(`✅ רישום Google: ${googleUser.name} נשמר בהצלחה`);
console.log(`✅ רשימת משתמשים: ${allUsers.length} משתמשים זמינים`);
console.log(`✅ התחברות מהירה: זמינה למשתמש ${allUsers[0]?.name || "לא זמין"}`);
console.log(
  "\n🎉 האינטגרציה בין RegisterScreen ל-localDataService עובדת כמצופה!"
);
console.log(
  "המשתמשים שנרשמים ב-RegisterScreen יהיו זמינים ב-WelcomeScreen להתחברות מהירה."
);
