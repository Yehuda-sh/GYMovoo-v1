/**
 * @file src/components/common/EmptyState.tsx
 * @brief קומפוננטת מצב ריק אוניברסלית עם variants ונגישות מתקדמת
 * @brief Universal empty state component with variants and advanced accessibility
 * @dependencies Ionicons, theme, React.memo
 * @notes תמיכה מלאה ב-RTL, 3 variants (default/compact/minimal), אופטימיזציה לביצועים
 * @notes Full RTL support, 3 variants (default/compact/minimal), performance optimized
 * @updated 2025-08-04 שיפור משמעותי עם variants, React.memo ואינטגרציה עם theme
 */

import React from "react";
import { View, Text, StyleSheet, ViewStyle, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../core/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  iconSize?: number;
  iconColor?: string;
  children?: React.ReactNode;
  // שיפורים חדשים // New enhancements
  variant?: "default" | "compact" | "minimal" | "error" | "loading";
  style?: ViewStyle;
  testID?: string;
  // אנימציה ואפקטים // Animation and effects
  animated?: boolean;
  animationDelay?: number;
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
    animated = false,
    animationDelay = 0,
  }) => {
    // 🎨 חישוב סגנונות דינמיים לפי variant
    // Dynamic styling calculation based on variant
    const containerStyle = React.useMemo(() => {
      const baseStyle: (ViewStyle | false | ViewStyle[] | undefined)[] = [
        styles.container,
      ];

      switch (variant) {
        case "compact":
          baseStyle.push(styles.containerCompact);
          break;
        case "minimal":
          baseStyle.push(styles.containerMinimal);
          break;
        case "error":
          baseStyle.push(styles.containerError);
          break;
        case "loading":
          baseStyle.push(styles.containerLoading);
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
        case "error":
          return 56;
        case "loading":
          return 52;
        default:
          return 64;
      }
    };

    const getIconColor = () => {
      if (iconColor) return iconColor;

      switch (variant) {
        case "error":
          return theme.colors.error;
        case "loading":
          return theme.colors.primary;
        default:
          return theme.colors.textSecondary;
      }
    };

    const getDefaultIcon = () => {
      switch (variant) {
        case "error":
          return "alert-circle-outline";
        case "loading":
          return "refresh-circle-outline";
        default:
          return "folder-open-outline";
      }
    };

    // אנימציית fade-in אם מבוקש
    const fadeAnim = React.useRef(new Animated.Value(animated ? 0 : 1)).current;

    React.useEffect(() => {
      if (animated) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          delay: animationDelay,
          useNativeDriver: true,
        }).start();
      }
    }, [animated, animationDelay, fadeAnim]);

    return (
      <Animated.View
        style={[containerStyle, animated && { opacity: fadeAnim }]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`${title}${description ? `. ${description}` : ""}`}
        accessibilityHint="מסך ריק - אין תוכן להצגה"
        testID={testID}
      >
        <Ionicons
          name={icon || getDefaultIcon()}
          size={getIconSize()}
          color={getIconColor()}
          style={[
            styles.icon,
            variant === "minimal" && styles.iconMinimal,
            variant === "error" && styles.iconError,
            variant === "loading" && styles.iconLoading,
          ]}
          accessible={false} // האב כבר נגיש
        />
        <Text
          style={[
            styles.title,
            variant === "compact" && styles.titleCompact,
            variant === "minimal" && styles.titleMinimal,
            variant === "error" && styles.titleError,
            variant === "loading" && styles.titleLoading,
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
              variant === "error" && styles.descriptionError,
              variant === "loading" && styles.descriptionLoading,
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
      </Animated.View>
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
  containerError: {
    backgroundColor: `${theme.colors.error}15`,
    borderColor: `${theme.colors.error}40`,
    borderWidth: 1,
  },
  containerLoading: {
    backgroundColor: `${theme.colors.primary}10`,
    borderColor: `${theme.colors.primary}30`,
    borderWidth: 1,
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
  iconError: {
    marginBottom: theme.spacing.xl,
    opacity: 0.9,
    shadowColor: theme.colors.error,
    shadowOpacity: 0.2,
  },
  iconLoading: {
    marginBottom: theme.spacing.xl,
    opacity: 0.9,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.2,
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
  titleError: {
    color: theme.colors.error,
    fontWeight: "700",
  },
  titleLoading: {
    color: theme.colors.primary,
    fontWeight: "700",
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
  descriptionError: {
    color: theme.colors.error,
    opacity: 0.9,
  },
  descriptionLoading: {
    color: theme.colors.primary,
    opacity: 0.9,
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
