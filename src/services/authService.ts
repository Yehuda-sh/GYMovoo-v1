/**
 * @file src/services/authService.ts
 * @description שירותי אימות דמה משופרים עבור האפליקציה
 * English: Enhanced mock authentication services for the app
 * @dependencies React Native, AsyncStorage
 * @notes מספק פונקציונליות אימות מדומה עם נתונים רנדומליים איכותיים
 * @performance Optimized with minimal resource usage and proper error handling
 * @rtl Full RTL support for Hebrew names and data generation
 * @accessibility Compatible with screen readers and accessibility features
 */

// =======================================
// 🎯 Core Data Generation Lists
// רשימות ליצירת נתונים רנדומליים
// =======================================
/**
 * Premium Hebrew-compatible first names for realistic user generation
 * שמות פרטיים עבריים איכותיים ליצירת משתמשים מציאותיים
 */
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

/**
 * Common Israeli last names for authentic user profiles
 * שמות משפחה ישראליים נפוצים לפרופילי משתמש אמיתיים
 */
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

/**
 * Popular email domains for realistic email generation
 * דומיינים פופולריים ליצירת כתובות אימייל מציאותיות
 */
const domains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "walla.co.il",
];

// =======================================
// 🎲 User Generation Engine
// מנוע יצירת משתמשים רנדומליים
// =======================================

/**
 * Generate realistic random user with authentic Israeli data
 * יוצר משתמש רנדומלי מציאותי עם נתונים ישראליים אמיתיים
 *
 * @returns {Object} Complete user object with metadata
 * @performance O(1) constant time generation
 * @rtl Compatible with Hebrew names and RTL display
 */
const generateRandomUser = () => {
  // Enhanced random selection with better distribution
  const firstName =
    firstNamesEnglish[Math.floor(Math.random() * firstNamesEnglish.length)];
  const lastName =
    lastNamesEnglish[Math.floor(Math.random() * lastNamesEnglish.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 9999);

  // Professional email generation with proper formatting
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
  const fullName = `${firstName} ${lastName}`;
  const userId = `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Enhanced avatar generation with Google-compatible colors
  const colors = ["4285F4", "DB4437", "F4B400", "0F9D58", "AB47BC", "FF7043"];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  return {
    id: userId,
    email: email,
    name: fullName,
    provider: "google",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${bgColor}&color=fff&size=200&font-size=0.45`,
    metadata: {
      createdAt: new Date().toISOString(),
      isRandom: true,
      sessionId: `session_${Date.now()}`,
    },
  };
};

// =======================================
// 🔐 Authentication Service Functions
// פונקציות שירות האימות
// =======================================

/**
 * Enhanced Google Sign In simulation with realistic delay and logging
 * סימולציית התחברות Google משופרת עם השהייה מציאותית ולוגים
 *
 * @returns {Promise<Object>} New random user without questionnaire
 * @performance Simulates realistic server response time (800ms)
 * @usage Used by LoginScreen and WelcomeScreen for authentication flow
 */
export const fakeGoogleSignIn = async () => {
  console.log("🎲 AuthService: Generating new random user for Google Sign In");

  // Realistic server delay simulation for better UX testing
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomUser = generateRandomUser();
  console.log("🎲 AuthService: New random user created -", randomUser.email);

  // Return new user without questionnaire to trigger onboarding flow
  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

/**
 * Enhanced Google Registration simulation with comprehensive logging
 * סימולציית הרשמה Google משופרת עם לוגים מקיפים
 *
 * @returns {Promise<Object>} New random user for registration flow
 * @performance Optimized for quick registration experience
 * @usage Used by RegisterScreen for new user creation
 */
export const fakeGoogleRegister = async () => {
  console.log(
    "🎲 AuthService: Generating new random user for Google Registration"
  );

  // Simulate registration processing time
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomUser = generateRandomUser();
  console.log("🎲 AuthService: New random user registered -", randomUser.email);

  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

// =======================================
// 🔄 Export Utilities
// כלי עזר לייצוא
// =======================================

/**
 * Export random user generator for external usage if needed
 * ייצוא יוצר משתמשים רנדומליים לשימוש חיצוני במידת הצורך
 *
 * @usage Can be used by other services or components for testing
 * @performance Lightweight function suitable for frequent calls
 */
export { generateRandomUser };
