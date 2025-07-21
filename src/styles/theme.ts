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

  // סגנונות רכיבים // Component styles
  components: {
    // כרטיסים // Cards
    card: {
      backgroundColor: "#242a47",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "rgba(107, 181, 255, 0.2)",
      // צל בינוני כברירת מחדל
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },

    // כרטיס תרגיל // Exercise card
    exerciseCard: {
      flexDirection: "row-reverse" as const,
      backgroundColor: "#242a47",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      alignItems: "center" as const,
      borderWidth: 1,
      borderColor: "rgba(107, 181, 255, 0.2)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },

    // כפתורים ראשיים // Primary buttons
    primaryButton: {
      backgroundColor: "#007AFF",
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 16,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },

    // כפתורים משניים // Secondary buttons
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: "rgba(107, 181, 255, 0.2)",
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 16,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    // כפתורי פעולה קטנים // Small action buttons
    actionButton: {
      flexDirection: "row-reverse" as const,
      alignItems: "center" as const,
      backgroundColor: "#242a47",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(107, 181, 255, 0.2)",
      gap: 6,
    },

    // תגיות // Badges
    badge: {
      backgroundColor: "rgba(78, 158, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },

    // שדות קלט // Input fields
    input: {
      backgroundColor: "#242a47",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "rgba(107, 181, 255, 0.2)",
      color: "#fff",
      fontSize: 16,
      textAlign: "right" as const,
    },

    // מכלי מודלים // Modal containers
    modalContainer: {
      backgroundColor: "#242a47",
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: "rgba(107, 181, 255, 0.2)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },

    // כותרות מסך // Screen headers
    screenHeader: {
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 16,
      flexDirection: "row-reverse" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },

    // רשימות // Lists
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },

    // מצבים ריקים // Empty states
    emptyState: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      padding: 40,
    },

    // טקסט בעברית - תמיד מיושר לימין // Hebrew text - always right aligned
    rtlText: {
      textAlign: "right" as const,
      writingDirection: "rtl" as const,
    },
  },
};
