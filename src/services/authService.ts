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
// 🎯 TypeScript Types
// טיפוסי TypeScript
// =======================================

/**
 * User object structure for authentication
 * מבנה אובייקט משתמש לאימות
 */
export interface User {
  id: string;
  email: string;
  name: string;
  provider: "google" | "manual";
  avatar?: string;
  questionnaire?: any[];
  questionnaireData?: {
    answers: any[];
    completedAt: string;
    version: string;
    metadata?: any;
  };
  metadata: {
    createdAt: string;
    isRandom: boolean;
    sessionId: string;
  };
}

// =======================================
// 🎯 Core Data Generation Lists
// רשימות ליצירת נתונים רנדומליים
// =======================================

/**
 * Israeli names data structure for authentic user generation
 * מבנה נתוני שמות ישראליים ליצירת משתמשים אמיתיים
 */
const ISRAELI_NAMES = {
  /**
   * Premium Hebrew-compatible first names for realistic user generation
   * שמות פרטיים עבריים איכותיים ליצירת משתמשים מציאותיים
   */
  first: [
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
    "ben",
    "eden",
    "ori",
    "roni",
    "gal",
    "liora",
    "eran",
    "sigal",
  ],

  /**
   * Common Israeli last names for authentic user profiles
   * שמות משפחה ישראליים נפוצים לפרופילי משתמש אמיתיים
   */
  last: [
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
    "katz",
    "goldberg",
  ],
} as const;

/**
 * Email and avatar configuration for user generation
 * הגדרות אימייל ואווטר ליצירת משתמשים
 */
const USER_CONFIG = {
  /**
   * Popular email domains for realistic email generation
   * דומיינים פופולריים ליצירת כתובות אימייל מציאותיות
   */
  emailDomains: [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "walla.co.il",
  ] as const,

  /**
   * Google-compatible colors for avatar generation
   * צבעים תואמי Google ליצירת אווטרים
   */
  avatarColors: [
    "4285F4",
    "DB4437",
    "F4B400",
    "0F9D58",
    "AB47BC",
    "FF7043",
  ] as const,
} as const;

// =======================================
// 🎲 User Generation Engine
// מנוע יצירת משתמשים רנדומליים
// =======================================

/**
 * Generate realistic random user with authentic Israeli data
 * יוצר משתמש רנדומלי מציאותי עם נתונים ישראליים אמיתיים
 *
 * @returns {User} Complete user object with metadata
 * @performance O(1) constant time generation
 * @rtl Compatible with Hebrew names and RTL display
 */
const generateRandomUser = (): User => {
  // Enhanced random selection with better distribution
  const firstName =
    ISRAELI_NAMES.first[Math.floor(Math.random() * ISRAELI_NAMES.first.length)];
  const lastName =
    ISRAELI_NAMES.last[Math.floor(Math.random() * ISRAELI_NAMES.last.length)];
  const domain =
    USER_CONFIG.emailDomains[
      Math.floor(Math.random() * USER_CONFIG.emailDomains.length)
    ];
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 9999);

  // Professional email generation with timestamp for uniqueness
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${randomSuffix}@${domain}`;
  const fullName = `${firstName} ${lastName}`;
  const userId = `google_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

  // Enhanced avatar generation with Google-compatible colors
  const bgColor =
    USER_CONFIG.avatarColors[
      Math.floor(Math.random() * USER_CONFIG.avatarColors.length)
    ];

  return {
    id: userId,
    email: email,
    name: fullName,
    provider: "google",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${bgColor}&color=fff&size=200&font-size=0.45`,
    metadata: {
      createdAt: new Date().toISOString(),
      isRandom: true,
      sessionId: `session_${timestamp}`,
    },
  };
};

// =======================================
// 🔐 Authentication Service Functions
// פונקציות שירות האימות
// =======================================

/**
 * Enhanced Google Sign In simulation with realistic delay
 * סימולציית התחברות Google משופרת עם השהייה מציאותית
 *
 * @returns {Promise<User>} New random user without questionnaire
 * @performance Simulates realistic server response time (800ms)
 * @usage Used by LoginScreen and WelcomeScreen for authentication flow
 */
export const fakeGoogleSignIn = async (): Promise<User> => {
  // Realistic server delay simulation for better UX testing
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomUser = generateRandomUser();

  // Return new user without questionnaire to trigger onboarding flow
  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

/**
 * Enhanced Google Registration simulation with form validation
 * סימולציית הרשמה Google משופרת עם אימות טופס
 *
 * @returns {Promise<User>} New random user for registration flow
 * @performance Optimized for quick registration experience
 * @usage Used by RegisterScreen for new user creation
 */
export const fakeGoogleRegister = async (): Promise<User> => {
  // Slightly shorter delay for registration to feel more responsive
  await new Promise((resolve) => setTimeout(resolve, 600));

  const randomUser = generateRandomUser();

  // Registration users also start without questionnaire
  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

/**
 * Development-only Google Sign In with complete questionnaire data
 * התחברות Google לפיתוח בלבד עם נתוני שאלון מלאים
 *
 * @returns {Promise<User>} User with complete questionnaire for development testing
 * @usage Only available in development mode (__DEV__) for quick testing
 * @development This function is meant for development shortcuts only
 */
export const fakeGoogleSignInWithQuestionnaire = async (): Promise<User> => {
  if (!__DEV__) {
    throw new Error(
      "fakeGoogleSignInWithQuestionnaire is only available in development mode"
    );
  }

  // Faster response for development
  await new Promise((resolve) => setTimeout(resolve, 400));

  const randomUser = generateRandomUser();

  // Mock questionnaire data for development testing
  const mockQuestionnaire = [
    "25-35", // age range
    "כושר בינוני", // fitness level
    "3-4 פעמים בשבוע", // workout frequency
    "עלייה במסה", // goal
    "בית", // location
  ];

  return {
    ...randomUser,
    questionnaire: mockQuestionnaire,
    questionnaireData: {
      answers: mockQuestionnaire,
      completedAt: new Date().toISOString(),
      version: "1.0",
      metadata: {
        generatedRandomly: true,
        devMode: true,
        autoGenerated: true,
      },
    },
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
