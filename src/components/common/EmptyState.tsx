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
  // 🎨 Container variants - וariants של קונטיינר
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  containerCompact: {
    padding: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  containerMinimal: {
    padding: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  // 🎯 Icon variants - variants של אייקון
  icon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.6,
  },
  iconMinimal: {
    marginBottom: theme.spacing.sm,
    opacity: 0.5,
  },

  // 📝 Title variants - variants של כותרת
  title: {
    ...theme.typography.title3,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  titleCompact: {
    fontSize: 16,
    marginBottom: theme.spacing.xs,
  },
  titleMinimal: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: theme.spacing.xs,
  },

  // 📄 Description variants - variants של תיאור
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  descriptionCompact: {
    fontSize: 13,
    marginBottom: theme.spacing.md,
  },
  descriptionMinimal: {
    fontSize: 12,
    marginBottom: theme.spacing.sm,
    opacity: 0.8,
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
