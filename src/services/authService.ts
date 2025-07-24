/**
 * @file src/services/authService.ts
 * @brief שירותי אימות דמה עבור האפליקציה
 *        Mock authentication services for the app
 * @dependencies none
 * @notes כולל יצירת משתמשים רנדומליים לבדיקות
 */

// רשימות לגנרטור הרנדומלי
// Lists for random generator
const firstNamesEnglish = [
  "yossi",
  "michal",
  "danny",
  "shira",
  "omer",
  "noa",
  "itay",
  "ronit",
  "guy",
  "liat",
  "alon",
  "maya",
  "ido",
  "tal",
  "roy",
  "inbal",
  "uri",
  "dana",
  "nir",
  "shani",
  "tomer",
  "yael",
  "asaf",
  "hila",
];

const lastNamesEnglish = [
  "cohen",
  "levi",
  "mizrachi",
  "peretz",
  "biton",
  "avraham",
  "friedman",
  "dahan",
  "amar",
  "bendavid",
  "haim",
  "malka",
  "azoulay",
  "shimon",
  "gabay",
  "nissim",
];

const domains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "walla.co.il",
];

/**
 * יוצר משתמש רנדומלי עם נתונים אקראיים
 * Creates a random user with random data
 */
const generateRandomUser = () => {
  const firstName =
    firstNamesEnglish[Math.floor(Math.random() * firstNamesEnglish.length)];
  const lastName =
    lastNamesEnglish[Math.floor(Math.random() * lastNamesEnglish.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 9999);

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
  const fullName = `${firstName} ${lastName}`;
  const userId = `google_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // יצירת צבע רנדומלי לאווטאר
  // Generate random color for avatar
  const colors = ["4285F4", "DB4437", "F4B400", "0F9D58", "AB47BC", "FF7043"];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  return {
    id: userId,
    email: email,
    name: fullName,
    provider: "google",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=${bgColor}&color=fff&size=200&font-size=0.45`,
    // אפשר להוסיף עוד נתונים רנדומליים
    metadata: {
      createdAt: new Date().toISOString(),
      isRandom: true,
      sessionId: `session_${Date.now()}`,
    },
  };
};

/**
 * מדמה התחברות עם Google - יוצר משתמש רנדומלי חדש בכל פעם
 * Simulates Google Sign In - creates new random user each time
 */
export const fakeGoogleSignIn = async () => {
  // תמיד מחזיר משתמש רנדומלי חדש ללא שאלון
  // Always returns new random user without questionnaire
  console.log("🎲 Generating new random user for Google Sign In");

  // דימוי השהייה של שרת
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomUser = generateRandomUser();
  console.log("🎲 New random user created:", randomUser.email);

  // משתמש חדש תמיד ללא שאלון
  // New user always without questionnaire
  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

/**
 * מדמה הרשמה עם Google - יוצר משתמש רנדומלי חדש
 * Simulates Google Registration - creates new random user
 */
export const fakeGoogleRegister = async () => {
  console.log("🎲 Generating new random user for Google Registration");

  // דימוי השהייה של שרת
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomUser = generateRandomUser();
  console.log("🎲 New random user registered:", randomUser.email);

  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

// ייצוא פונקציית הגנרטור לשימוש חיצוני אם נדרש
// Export generator function for external use if needed
export { generateRandomUser };
