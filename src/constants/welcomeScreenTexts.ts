/**
 * @file src/constants/wel    REALISTIC_DEMO_CREATING: "יוצר משתמש דמו חדש עם אלגוריתם חכם...",
    REALISTIC_DEMO_READY: "🎲 משתמש דמו חדש + אלגוריתם חכם",meScreenTexts.ts
 * @brief קבועי טקסט למסך ברוכים הבאים - ריכוז כל המחרוזות והתרגומים
 * @brief Welcome screen text constants - centralizing all strings and translations
 * @notes תמיכה מלאה RTL, תרגומים מדויקים, נגישות משופרת
 * @notes Full RTL support, accurate translations, enhanced accessibility
 * @version 1.0.0
 * @created 2025-08-06
 */

export const WELCOME_SCREEN_TEXTS = {
  // כותרות ראשיות / Main headers
  HEADERS: {
    APP_NAME: "GYMovoo",
    TAGLINE: "האימון המושלם שלך מתחיל כאן",
    LOADING_CHECK: "בודק מצב התחברות...",
  },

  // תכונות מרכזיות / Key features
  FEATURES: {
    PERSONAL_PLANS: "תוכניות מותאמות אישית",
    PROGRESS_TRACKING: "מעקב התקדמות",
    QUICK_WORKOUTS: "אימונים מהירים",
    SUPPORTIVE_COMMUNITY: "קהילה תומכת",
  },

  // כפתורי פעולה / Action buttons
  ACTIONS: {
    START_NOW: "התחל עכשיו",
    CONTINUE_WITH_GOOGLE: "המשך עם Google",
    HAVE_ACCOUNT: "כבר יש לי חשבון",
    REALISTIC_DEMO_CREATING: "יוצר משתמש דמו חדש...",
    REALISTIC_DEMO_READY: "� משתמש דמו חדש + היסטוריה",
  },

  // הודעות קידום / Promotional messages
  PROMOTION: {
    FREE_TRIAL: "7 ימי ניסיון חינם • ללא כרטיס אשראי",
    DIVIDER_TEXT: "או",
  },

  // נתוני משתמשים חיים / Live user data
  USERS: {
    ACTIVE_USERS_TEMPLATE: "{count} משתמשים פעילים כרגע",
  },

  // הודעות משפטיות / Legal messages
  LEGAL: {
    TERMS_AGREEMENT: "בהמשך אתה מסכים ל",
    TERMS_OF_USE: " תנאי השימוש",
    AND_CONJUNCTION: " ו",
    PRIVACY_POLICY: "מדיניות הפרטיות",
  },

  // תוויות נגישות / Accessibility labels
  A11Y: {
    START_JOURNEY: "התחל את המסע שלך לכושר מושלם",
    START_JOURNEY_HINT: "לחץ כדי להתחיל בתהליך ההרשמה",
    GOOGLE_SIGNIN: "התחבר עם חשבון Google",
    GOOGLE_SIGNIN_HINT: "לחץ כדי להתחבר באמצעות חשבון Google שלך",
    EXISTING_USER: "כניסה למשתמשים קיימים",
    EXISTING_USER_HINT: "לחץ אם כבר יש לך חשבון",
    REALISTIC_DEMO:
      "יצירת משתמש דמו חדש עם שאלון והיסטוריה מתקדמת באלגוריתם חכם",
    REALISTIC_DEMO_HINT:
      "לחץ ליצירת משתמש דמו חדש עם שאלון רנדומלי והיסטוריית אימונים חכמה עם מוטיבציה דינמית - למפתחים בלבד",
  },

  // הודעות קונסול / Console messages
  CONSOLE: {
    AUTH_CHECK_START: "🔍 WelcomeScreen - בדיקת מצב התחברות:",
    USER_FOUND: "✅ WelcomeScreen - משתמש מחובר נמצא! מנווט למסך הבית:",
    NO_USER: "ℹ️ WelcomeScreen - משתמש לא מחובר, מציג מסך ברוכים הבאים",
    AUTH_ERROR: "❌ WelcomeScreen - שגיאה בבדיקת מצב התחברות:",
    DEMO_START: "🚀 WelcomeScreen: Starting realistic demo creation process",
    DEMO_USER_CREATE:
      "👤 WelcomeScreen: Creating realistic demo user with complete history",
    DEMO_SUCCESS: "✅ WelcomeScreen: Demo user created successfully with",
    DEMO_SAVE: "💾 WelcomeScreen: Saving demo user to global store",
    DEMO_NAVIGATE: "🎯 WelcomeScreen: Navigating to main application",
    DEMO_COMPLETE:
      "✅ WelcomeScreen: Demo creation process completed successfully",
    DEMO_ERROR: "❌ WelcomeScreen: Demo creation failed:",
  },
} as const;

/**
 * Generate realistic active users count based on time of day
 * יצירת מספר משתמשים פעילים מציאותי לפי שעות היום
 */
export const generateActiveUsersCount = (): number => {
  const currentHour = new Date().getHours();
  const baseUsers = 6000;
  const peakHoursBonus =
    currentHour >= 17 && currentHour <= 21
      ? 3000
      : currentHour >= 6 && currentHour <= 9
        ? 2000
        : currentHour >= 12 && currentHour <= 14
          ? 1500
          : 800;
  const randomVariation = Math.floor(Math.random() * 500);
  return baseUsers + peakHoursBonus + randomVariation;
};

/**
 * Format active users count text
 * פורמט טקסט מספר משתמשים פעילים
 */
export const formatActiveUsersText = (count: number): string => {
  return WELCOME_SCREEN_TEXTS.USERS.ACTIVE_USERS_TEMPLATE.replace(
    "{count}",
    count.toLocaleString()
  );
};

export default WELCOME_SCREEN_TEXTS;
