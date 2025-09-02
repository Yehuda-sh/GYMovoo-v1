/**
 * @file src/constants/welcomeScreenTexts.ts
 * @brief קבועי טקסט למסך ברוכים הבאים - ריכוז כל המחרוזות והתרגומים
 * @brief Welcome screen text constants - centralizing all strings and translations
 * @description Enhanced welcome screen constants with RTL support, accessibility, and performance optimizations
 * @date 2025-09-02
 * @enhanced מערכת טקסטים מתקדמת עם אופטימיזציות ביצועים ונגישות משופרת
 * @updated 2025-09-02 שיפור איכות קוד ותיעוד מקיף
 *
 * @notes תמיכה מלאה RTL, תרגומים מדויקים, נגישות משופרת
 * @notes Full RTL support, accurate translations, enhanced accessibility
 * @version 1.1.0
 * @created 2025-08-06
 */

// ===============================================
// 🎯 TypeScript Types & Interfaces
// טיפוסים וממשקים
// ===============================================

/**
 * Welcome screen text categories
 * קטגוריות טקסט למסך ברוכים הבאים
 */
export interface WelcomeTextCategories {
  HEADERS: Record<string, string>;
  FEATURES: Record<string, string>;
  ACTIONS: Record<string, string>;
  PROMOTION: Record<string, string>;
  USERS: Record<string, string>;
  MOTIVATION: Record<string, string>;
  LEGAL: Record<string, string>;
  A11Y: Record<string, string>;
  CONSOLE: Record<string, string>;
}

/**
 * User statistics interface
 * ממשק סטטיסטיקות משתמש
 */
export interface UserStatistics {
  activeUsers: string;
  newMembers: string;
  successStories: string;
}

/**
 * Text validation result interface
 * ממשק תוצאות אימות טקסט
 */
export interface TextValidationResult {
  isValid: boolean;
  sanitized: string;
  warnings: string[];
}

/**
 * Cache statistics interface
 * ממשק סטטיסטיקות Cache
 */
export interface WelcomeCacheStats {
  userCountCacheSize: number;
  lastUpdate: string;
  cacheAge: number;
}

export const WELCOME_SCREEN_TEXTS: WelcomeTextCategories = {
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
    REALISTIC_DEMO_CREATING: "יוצר משתמש דמו חדש עם אלגוריתם חכם...",
    REALISTIC_DEMO_READY: "🎲 משתמש דמו חדש + אלגוריתם חכם",
  },

  // הודעות קידום מתקדמות / Advanced promotional messages
  PROMOTION: {
    FREE_TRIAL: "7 ימי ניסיון חינם • ללא כרטיס אשראי",
    DIVIDER_TEXT: "או",
    LIMITED_OFFER: "הצעה מוגבלת לזמן קצר!",
    JOIN_THOUSANDS: "הצטרף לאלפי משתמשים מרוצים",
    NO_COMMITMENT: "ללא התחייבות • ביטול בכל עת",
  },

  // נתוני משתמשים חיים מורחב / Enhanced live user data
  USERS: {
    ACTIVE_USERS_TEMPLATE: "{count} משתמשים פעילים כרגע",
    NEW_MEMBERS_TODAY: "הצטרפו היום {count} חברים חדשים",
    SUCCESS_STORIES: "יותר מ-{count} סיפורי הצלחה השבוע",
  },

  // הודעות מוטיבציה / Motivational messages
  MOTIVATION: {
    TODAY_IS_THE_DAY: "היום הוא היום המושלם להתחיל!",
    YOUR_JOURNEY_STARTS: "המסע שלך לכושר מושלם מתחיל כאן",
    TRANSFORM_YOUR_LIFE: "שנה את החיים שלך - צעד אחד בכל פעם",
    BELIEVE_IN_YOURSELF: "האמן בעצמך - אתה חזק יותר ממה שאתה חושב",
  },

  // הודעות משפטיות מורחבות / Enhanced legal messages
  LEGAL: {
    TERMS_AGREEMENT: "בהמשך אתה מסכים ל",
    TERMS_OF_USE: " תנאי השימוש",
    AND_CONJUNCTION: " ו",
    PRIVACY_POLICY: "מדיניות הפרטיות",
    DATA_SECURITY: "הנתונים שלך מוגנים ומאובטחים",
    AGE_REQUIREMENT: "מיועד למשתמשים מעל גיל 16",
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

// ===============================================
// 🔧 Performance Optimizations & Cache System
// מערכת אופטימיזציות ביצועים ו-Cache
// ===============================================

/**
 * Cache for formatted text results to improve performance
 * Cache לתוצאות טקסט מפורמט לשיפור ביצועים
 */
const TextCache = {
  usersCounts: new Map<number, string>(),
  lastUsersCountTime: 0,
  cachedUsersCount: 0,

  // Cache TTL settings (2 minutes for users count)
  USERS_COUNT_TTL: 2 * 60 * 1000,

  clear() {
    this.usersCounts.clear();
    this.lastUsersCountTime = 0;
    this.cachedUsersCount = 0;
  },

  getCachedUsersCount(): number | null {
    const now = Date.now();
    if (now - this.lastUsersCountTime < this.USERS_COUNT_TTL) {
      return this.cachedUsersCount;
    }
    return null;
  },

  setCachedUsersCount(count: number): void {
    this.cachedUsersCount = count;
    this.lastUsersCountTime = Date.now();
  },

  getStats(): {
    userCountCacheSize: number;
    lastUpdate: string;
    cacheAge: number;
  } {
    return {
      userCountCacheSize: this.usersCounts.size,
      lastUpdate: new Date(this.lastUsersCountTime).toLocaleString("he-IL"),
      cacheAge: Date.now() - this.lastUsersCountTime,
    };
  },
};

/**
 * Enhanced generate realistic active users count with caching
 * יצירת מספר משתמשים פעילים מציאותי עם cache משופר
 */
export const generateActiveUsersCount = (): number => {
  // Check cache first
  const cached = TextCache.getCachedUsersCount();
  if (cached !== null) {
    return cached;
  }

  // Generate new count
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

  const count = baseUsers + peakHoursBonus + randomVariation;

  // Cache the result
  TextCache.setCachedUsersCount(count);

  return count;
};

/**
 * Enhanced format active users count text with caching
 * פורמט טקסט מספר משתמשים פעילים עם cache משופר
 */
export const formatActiveUsersText = (count: number): string => {
  // Check cache first
  const cached = TextCache.usersCounts.get(count);
  if (cached) {
    return cached;
  }

  // Format and cache
  const formatted = WELCOME_SCREEN_TEXTS.USERS.ACTIVE_USERS_TEMPLATE.replace(
    "{count}",
    count.toLocaleString("he-IL")
  );

  TextCache.usersCounts.set(count, formatted);

  // Limit cache size to prevent memory issues
  if (TextCache.usersCounts.size > 100) {
    const firstKey = TextCache.usersCounts.keys().next().value;
    if (firstKey !== undefined) {
      TextCache.usersCounts.delete(firstKey);
    }
  }

  return formatted;
};

// ===============================================
// 🌟 Advanced Text Utilities - כלים מתקדמים לטקסט
// ===============================================

/**
 * Get welcome text cache statistics for debugging
 * קבלת סטטיסטיקות cache טקסט לדיבוג
 */
export const getWelcomeTextCacheStats = (): WelcomeCacheStats => {
  return TextCache.getStats();
};

/**
 * Clear welcome text cache for performance optimization
 * ניקוי cache טקסט לאופטימיזציה
 */
export const clearWelcomeTextCache = (): void => {
  TextCache.clear();
  console.warn("🧹 WelcomeText cache cleared successfully");
};

/**
 * Get time-based greeting message
 * קבלת הודעת ברכה מבוססת זמן
 */
export const getTimeBasedGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "בוקר טוב! מוכן להתחיל את היום עם אימון?";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "צהריים טובים! זמן מושלם לאימון קצר!";
  } else if (currentHour >= 17 && currentHour < 22) {
    return "ערב טוב! בואו נסיים את היום עם אימון מעולה!";
  } else {
    return "לילה טוב! גם באמצע הלילה אפשר להתאמן 💪";
  }
};

/**
 * Get motivational message based on user activity
 * קבלת הודעת מוטיבציה מבוססת פעילות משתמש
 */
export const getMotivationalMessage = (isReturningUser = false): string => {
  const motivationalMessages = [
    "כל מסע מתחיל בצעד אחד 🚀",
    "הגוף שלך יכול לעשות הכל - המוח שלך צריך להשתכנע 💪",
    "התקדמות קטנה כל יום = תוצאות גדולות בעתיד ⭐",
    "היום הוא היום המושלם להתחיל! 🎯",
    "כושר זה לא יעד, זה אורח חיים 🌟",
  ];

  const returningUserMessages = [
    "שמח לראות שחזרת! בואו נמשיך מאיפה שעצרנו 🔥",
    "ברוך השב! המסע שלך ממשיך היום 💫",
    "כל פעם שחוזרים - מתחזקים יותר! 💪",
    "המוטיבציה שלך מעוררת השראה! 🌟",
    "עוד יום, עוד הזדמנות להיות גרסה טובה יותר של עצמך 🚀",
  ];

  const messages = isReturningUser
    ? returningUserMessages
    : motivationalMessages;
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Get random motivational message
 * קבלת הודעת מוטיבציה רנדומלית
 */
export const getRandomMotivationalMessage = (): string => {
  const messages = Object.values(WELCOME_SCREEN_TEXTS.MOTIVATION);
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Get promotional text based on time sensitivity
 * קבלת טקסט פרסומי מבוסס רגישות זמן
 */
export const getTimeSensitivePromotion = (): string => {
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 9 && currentHour <= 17;

  if (isBusinessHours) {
    return WELCOME_SCREEN_TEXTS.PROMOTION.JOIN_THOUSANDS;
  } else {
    return WELCOME_SCREEN_TEXTS.PROMOTION.LIMITED_OFFER;
  }
};

/**
 * Format enhanced user statistics
 * פורמט סטטיסטיקות משתמש משופרות
 */
export const formatEnhancedUserStats = (): UserStatistics => {
  const activeCount = generateActiveUsersCount();
  const newMembersCount = Math.floor(activeCount * 0.05); // 5% of active users
  const successStoriesCount = Math.floor(activeCount * 0.12); // 12% success rate

  return {
    activeUsers: formatActiveUsersText(activeCount),
    newMembers: WELCOME_SCREEN_TEXTS.USERS.NEW_MEMBERS_TODAY.replace(
      "{count}",
      newMembersCount.toString()
    ),
    successStories: WELCOME_SCREEN_TEXTS.USERS.SUCCESS_STORIES.replace(
      "{count}",
      successStoriesCount.toString()
    ),
  };
};

/**
 * Validate and sanitize text input
 * אימות וניקוי טקסט קלט
 */
export const validateWelcomeText = (text: string): TextValidationResult => {
  const warnings: string[] = [];
  let sanitized = text.trim();

  // Basic validation
  if (!text || text.length === 0) {
    return { isValid: false, sanitized: "", warnings: ["טקסט ריק"] };
  }

  // Length validation
  if (text.length > 200) {
    sanitized = text.substring(0, 200);
    warnings.push("טקסט קוצר ל-200 תווים");
  }

  // RTL validation for Hebrew text
  const hebrewRegex = /[\u0590-\u05FF]/;
  const hasHebrew = hebrewRegex.test(text);

  if (hasHebrew) {
    // Ensure proper RTL handling
    sanitized = sanitized.replace(/^\u202D|\u202C$/g, ""); // Remove existing RTL marks
    warnings.push("טקסט עברי זוהה");
  }

  return {
    isValid: true,
    sanitized,
    warnings,
  };
};

/**
 * Get comprehensive welcome screen content package
 * קבלת חבילת תוכן מקיפה למסך ברוכים הבאים
 */
export const getWelcomeContentPackage = (
  isReturningUser = false
): {
  greeting: string;
  motivation: string;
  promotion: string;
  userStats: UserStatistics;
  cacheStats: WelcomeCacheStats;
} => {
  return {
    greeting: getTimeBasedGreeting(),
    motivation: getMotivationalMessage(isReturningUser),
    promotion: getTimeSensitivePromotion(),
    userStats: formatEnhancedUserStats(),
    cacheStats: getWelcomeTextCacheStats(),
  };
};

export default WELCOME_SCREEN_TEXTS;
