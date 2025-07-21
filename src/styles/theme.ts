// src/styles/theme.ts

export const theme = {
  colors: {
    // רקעים ראשיים // Main backgrounds
    background: "#181E41", // רקע כהה ראשי
    backgroundAlt: "#1F2C4C", // רקע משני לגרדיאנטים

    // כרטיסים ומשטחים // Cards and surfaces
    card: "#242a47", // רקע כרטיסים
    cardBorder: "rgba(107, 181, 255, 0.2)", // גבול כרטיסים

    // צבעים ראשיים // Primary colors
    primary: "#007AFF", // כחול ראשי
    primaryGradientStart: "#4e9eff", // התחלת גרדיאנט
    primaryGradientEnd: "#007AFF", // סוף גרדיאנט

    // צבעים משניים // Secondary colors
    secondary: "#5856D6", // סגול
    accent: "#4e9eff", // כחול בהיר
    success: "#34C759", // ירוק הצלחה
    error: "#FF3B30", // אדום שגיאה
    warning: "#FF9500", // כתום אזהרה

    white: "#FFFFFF",
    // טקסט // Text
    text: "#fff", // טקסט ראשי
    textSecondary: "#8CA8FF", // טקסט משני

    // גבולות וקווים // Borders and lines
    border: "#6bb5ff", // גבול כחול
    divider: "#4b5a7a", // קו מפריד

    // כפתורי כניסה // Auth buttons
    google: "#4285F4", // כפתור Google
    googleText: "#fff", // טקסט Google

    // אחרים // Others
    overlay: "rgba(0, 0, 0, 0.5)", // רקע שקוף
    shadow: "#000", // צל
    indicator: "rgba(255, 255, 255, 0.3)", // אינדיקטור לא פעיל
    indicatorActive: "#4e9eff", // אינדיקטור פעיל
    userCounterBg: "rgba(78, 158, 255, 0.1)", // רקע מונה משתמשים
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  typography: {
    // כותרות // Headings
    h1: {
      fontSize: 32,
      fontWeight: "bold" as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold" as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "bold" as const,
      lineHeight: 28,
    },

    // טקסט רגיל // Body text
    body: {
      fontSize: 16,
      fontWeight: "normal" as const,
      lineHeight: 22,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "normal" as const,
      lineHeight: 20,
    },

    // כיתובים // Captions
    caption: {
      fontSize: 13,
      fontWeight: "normal" as const,
      lineHeight: 18,
    },

    // כפתורים // Buttons
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
      letterSpacing: 0.5,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: "bold" as const,
      letterSpacing: 1,
    },
  },

  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    glow: {
      shadowColor: "#4e9eff",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};
