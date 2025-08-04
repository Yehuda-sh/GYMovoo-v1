/**
 * @file src/components/ui/UniversalCard.tsx
 * @brief כרטיס אוניברסלי עם אפשרויות עיצוב מגוונות משופר
 * @dependencies theme, LinearGradient, React.memo
 * @notes תומך בכותרת, תת-כותרת, תוכן, פעולות, גרדיאנט
 * @recurring_errors וודא שימוש נכון ב-renderContent או children
 * @version 2.0 - Enhanced with React.memo, useMemo, accessibility, compact variant
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface UniversalCardProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  children?: React.ReactNode;
  renderContent?: () => React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "gradient" | "outlined" | "elevated" | "compact";
  footer?: React.ReactNode;
  style?: ViewStyle;
  gradientColors?: readonly [string, string, ...string[]];
  disabled?: boolean;

  // 🆕 נגישות ובדיקות // Accessibility & Testing
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}

export const UniversalCard: React.FC<UniversalCardProps> = React.memo(
  ({
    title,
    subtitle,
    icon,
    iconColor = theme.colors.primary,
    children,
    renderContent,
    onPress,
    variant = "default",
    footer,
    style,
    gradientColors = [
      theme.colors.workoutCardStart,
      theme.colors.workoutCardEnd,
    ] as const,
    disabled = false,
    accessibilityLabel,
    accessibilityHint,
    testID = "universal-card",
    hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
  }) => {
    // סגנונות לפי וריאנט // Variant styles
    const variantStyles = useMemo((): ViewStyle => {
      switch (variant) {
        case "outlined":
          return {
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: theme.colors.primary,
          };
        case "elevated":
          return {
            ...theme.components.card,
            ...theme.shadows.large,
          };
        case "gradient":
          return {
            borderRadius: theme.radius.lg,
            overflow: "hidden",
          };
        case "compact":
          return {
            ...theme.components.card,
            padding: theme.spacing.sm,
          };
        default:
          return theme.components.card;
      }
    }, [variant]);

    // נגישות מתקדמת // Advanced accessibility
    const accessibilityProps = useMemo(() => {
      if (!onPress) return {};

      return {
        accessible: true,
        accessibilityRole: "button" as const,
        accessibilityLabel: accessibilityLabel || title || "כרטיס לחיץ",
        accessibilityHint: accessibilityHint || "הקש פעמיים להפעלה",
        accessibilityState: {
          disabled: disabled,
        },
      };
    }, [onPress, accessibilityLabel, accessibilityHint, title, disabled]);

    // תוכן הכרטיס // Card content
    const CardContent = useMemo(
      () => (
        <>
          {/* כותרת // Header */}
          {(title || subtitle || icon) && (
            <View
              style={
                variant === "compact" ? styles.headerCompact : styles.header
              }
            >
              <View style={styles.titleContainer}>
                {title && (
                  <Text
                    style={
                      variant === "compact" ? styles.titleCompact : styles.title
                    }
                  >
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text
                    style={
                      variant === "compact"
                        ? styles.subtitleCompact
                        : styles.subtitle
                    }
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
              {icon && (
                <View
                  style={
                    variant === "compact"
                      ? styles.iconContainerCompact
                      : styles.iconContainer
                  }
                >
                  <Ionicons
                    name={icon}
                    size={variant === "compact" ? 20 : 24}
                    color={iconColor}
                    accessible={false}
                  />
                </View>
              )}
            </View>
          )}

          {/* תוכן // Content */}
          <View style={styles.content}>
            {renderContent ? renderContent() : children}
          </View>

          {/* פוטר // Footer */}
          {footer && (
            <View
              style={
                variant === "compact" ? styles.footerCompact : styles.footer
              }
            >
              {footer}
            </View>
          )}
        </>
      ),
      [
        title,
        subtitle,
        icon,
        iconColor,
        variant,
        renderContent,
        children,
        footer,
      ]
    );

    // כרטיס עם גרדיאנט // Gradient card
    if (variant === "gradient") {
      const GradientCard = onPress ? TouchableOpacity : View;
      return (
        <GradientCard
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
          style={[variantStyles, style]}
          testID={testID}
          hitSlop={onPress ? hitSlop : undefined}
          {...accessibilityProps}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {CardContent}
          </LinearGradient>
        </GradientCard>
      );
    }

    // כרטיס רגיל // Regular card
    const CardComponent = onPress ? TouchableOpacity : View;
    return (
      <CardComponent
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[variantStyles, disabled && styles.disabled, style]}
        testID={testID}
        hitSlop={onPress ? hitSlop : undefined}
        {...accessibilityProps}
      >
        {CardContent}
      </CardComponent>
    );
  }
);

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
UniversalCard.displayName = "UniversalCard";

const styles = StyleSheet.create({
  header: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  headerCompact: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.isRTL ? 0 : theme.spacing.md,
    marginLeft: theme.isRTL ? theme.spacing.md : 0,
  },
  title: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  titleCompact: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  subtitleCompact: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  iconContainer: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  iconContainerCompact: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
  },
  content: {
    // תוכן גמיש // Flexible content
  },
  footer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  footerCompact: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  gradient: {
    padding: theme.spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default UniversalCard;
