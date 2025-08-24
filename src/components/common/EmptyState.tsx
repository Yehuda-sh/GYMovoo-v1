/**
 * @file src/components/common/EmptyState.tsx
 * @brief קומפוננטת מצב ריק אוניברסלית עם variants ונגישות מתקדמת
 * @brief Universal empty state component with variants and advanced accessibility
 * @dependencies Ionicons, theme, React.memo
 * @notes תמיכה מלאה ב-RTL, 3 variants (default/compact/minimal), אופטימיזציה לביצועים
 * @notes Full RTL support, 3 variants (default/compact/minimal), performance optimized
 * @updated 2025-08-04 שיפור משמעותי עם variants, React.memo ואינטגרציה עם theme
 */

// src/components/common/EmptyState.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  iconSize?: number;
  iconColor?: string;
  children?: React.ReactNode;
  // שיפורים חדשים // New enhancements
  variant?: "default" | "compact" | "minimal";
  style?: ViewStyle;
  testID?: string;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({
    icon = "folder-open-outline",
    title,
    description,
    iconSize,
    iconColor,
    children,
    variant = "default",
    style,
    testID = "empty-state",
  }) => {
    // 🎨 חישוב סגנונות דינמיים לפי variant
    // Dynamic styling calculation based on variant
    const containerStyle = React.useMemo(() => {
      const baseStyle = [styles.container] as any[];

      switch (variant) {
        case "compact":
          baseStyle.push(styles.containerCompact);
          break;
        case "minimal":
          baseStyle.push(styles.containerMinimal);
          break;
        default:
          // ברירת מחדל - ללא שינוי נוסף
          break;
      }

      if (style) baseStyle.push(style);
      return baseStyle;
    }, [variant, style]);

    // 🎯 אייקון דינמי עם גדלים מותאמים לvariant
    // Dynamic icon with sizes adapted to variant
    const getIconSize = () => {
      if (iconSize) return iconSize;

      switch (variant) {
        case "compact":
          return 48;
        case "minimal":
          return 32;
        default:
          return 64;
      }
    };

    const getIconColor = () => {
      return iconColor || theme.colors.textSecondary;
    };

    return (
      <View
        style={containerStyle}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`${title}${description ? `. ${description}` : ""}`}
        accessibilityHint="מסך ריק - אין תוכן להצגה"
        testID={testID}
      >
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={getIconColor()}
          style={[styles.icon, variant === "minimal" && styles.iconMinimal]}
          accessible={false} // האב כבר נגיש
        />
        <Text
          style={[
            styles.title,
            variant === "compact" && styles.titleCompact,
            variant === "minimal" && styles.titleMinimal,
          ]}
          accessible={false} // האב כבר נגיש
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              variant === "compact" && styles.descriptionCompact,
              variant === "minimal" && styles.descriptionMinimal,
            ]}
            accessible={false} // האב כבר נגיש
          >
            {description}
          </Text>
        )}
        {children && (
          <View
            style={[
              styles.actions,
              variant === "compact" && styles.actionsCompact,
            ]}
          >
            {children}
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  // 🎨 Container variants משופר - וariants של קונטיינר מעודכן
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xxl,
    backgroundColor: `${theme.colors.background}FB`,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.md,
    // שיפורי עיצוב מתקדמים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}30`,
  },
  containerCompact: {
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.md,
    elevation: 4,
    shadowOpacity: 0.06,
  },
  containerMinimal: {
    padding: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
  },

  // 🎯 Icon variants משופר - variants של אייקון מעודכן
  icon: {
    marginBottom: theme.spacing.xl,
    opacity: 0.8,
    // שיפור אייקון
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconMinimal: {
    marginBottom: theme.spacing.md,
    opacity: 0.6,
    shadowOpacity: 0,
  },

  // 📝 Title variants משופר - variants של כותרת מעודכן
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    letterSpacing: 0.4,
    // שיפור טיפוגרפי
    textShadowColor: `${theme.colors.text}12`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleCompact: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.3,
  },
  titleMinimal: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.2,
  },

  // 📄 Description variants משופר - variants של תיאור מעודכן
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    letterSpacing: 0.2,
    paddingHorizontal: theme.spacing.md,
  },
  descriptionCompact: {
    fontSize: 15,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  descriptionMinimal: {
    fontSize: 14,
    marginBottom: theme.spacing.md,
    opacity: 0.85,
    lineHeight: 20,
  },

  // 🎬 Actions variants - variants של פעולות
  actions: {
    marginTop: theme.spacing.md,
  },
  actionsCompact: {
    marginTop: theme.spacing.sm,
  },
});

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
EmptyState.displayName = "EmptyState";

export default EmptyState;
