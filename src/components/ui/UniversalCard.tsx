/**
 * @file src/components/ui/UniversalCard.tsx
 * @brief כרטיס אוניברסלי עם אפשרויות עיצוב מגוונות משופר + אופטימיזציה לכושר מובייל
 * @dependencies theme, LinearGradient, React.memo, expo-haptics, Animated
 * @notes תומך בכותרת, תת-כותרת, תוכן, פעולות, גרדיאנט, workout mode, haptic feedback, loading, animations
 * @recurring_errors וודא שימוש נכון ב-renderContent או children, workout למסכי אימון
 * @version 4.0 - Enhanced with loading states, press animations, improved RTL, performance optimizations
 */

import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../styles/theme";

interface UniversalCardProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  children?: React.ReactNode;
  renderContent?: () => React.ReactNode;
  onPress?: () => void;
  variant?:
    | "default"
    | "gradient"
    | "outlined"
    | "elevated"
    | "compact"
    | "workout";
  footer?: React.ReactNode;
  style?: ViewStyle;
  gradientColors?: readonly [string, string, ...string[]];
  disabled?: boolean;

  // 🆕 נגישות ובדיקות // Accessibility & Testing
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  hitSlop?: { top: number; bottom: number; left: number; right: number };

  // 🏋️ Fitness Mobile Optimization (2025-08-14)
  enableHapticFeedback?: boolean; // משוב מושגי לכל לחיצה
  enablePerformanceTracking?: boolean; // מדידת ביצועים אוטומטית
  trackingName?: string; // שם למעקב ביצועים

  // 🆕 תכונות נוספות // Additional features
  loading?: boolean; // מצב טעינה
  loadingText?: string; // טקסט בזמן טעינה
  animateOnPress?: boolean; // אנימציה בלחיצה
  pressAnimationScale?: number; // גודל אנימציה (ברירת מחדל 0.95)
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
    hitSlop = { top: 20, bottom: 20, left: 20, right: 20 }, // 🏋️ הגדלת hitSlop לכושר
    // Fitness Mobile Optimization
    enableHapticFeedback = false,
    enablePerformanceTracking = false,
    trackingName,
    // Additional features
    loading = false,
    loadingText,
    animateOnPress = false,
    pressAnimationScale = 0.95,
  }) => {
    // 🚀 מדידת ביצועים לאפליקציית כושר
    // Performance tracking for fitness app
    const startTime = useMemo(() => Date.now(), []);

    // 🆕 אנימציה ללחיצה
    const [scaleAnim] = useState(() => new Animated.Value(1));

    useEffect(() => {
      if (enablePerformanceTracking) {
        const renderTime = Date.now() - startTime;
        if (renderTime > 100) {
          console.warn(
            `⚠️ UniversalCard ${trackingName || title || "Unnamed"} איטי: ${renderTime.toFixed(1)}ms`
          );
        }
      }
    }, [enablePerformanceTracking, trackingName, title, startTime]);

    // 🎯 פונקציית haptic feedback לאפליקציות כושר
    // Haptic feedback function for fitness apps
    const handlePress = useCallback(() => {
      if (enableHapticFeedback && !disabled && onPress) {
        // משוב מושגי בהתאם variant
        const feedbackIntensity =
          variant === "workout"
            ? Haptics.ImpactFeedbackStyle.Heavy
            : Haptics.ImpactFeedbackStyle.Light;
        Haptics.impactAsync(feedbackIntensity);
      }

      // 🆕 אנימציה בלחיצה
      if (animateOnPress && !disabled) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: pressAnimationScale,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }

      onPress?.();
    }, [
      enableHapticFeedback,
      disabled,
      onPress,
      variant,
      animateOnPress,
      pressAnimationScale,
      scaleAnim,
    ]);
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
        case "workout":
          // 🏋️ מצב אימון - כרטיסים גדולים במיוחד
          return {
            ...theme.components.card,
            padding: theme.spacing.xl,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            minHeight: 120, // גובה מינימלי גדול לנגישות
            ...theme.shadows.medium,
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
        accessibilityLabel: accessibilityLabel || title || "כרטיס ללחיצה",
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
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                  {loadingText || "טוען..."}
                </Text>
              </View>
            ) : renderContent ? (
              renderContent()
            ) : (
              children
            )}
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
        loading,
        loadingText,
      ]
    );

    // כרטיס עם גרדיאנט // Gradient card
    if (variant === "gradient") {
      const GradientCard = onPress ? TouchableOpacity : View;
      const AnimatedCard = animateOnPress
        ? Animated.createAnimatedComponent(GradientCard)
        : GradientCard;

      return (
        <AnimatedCard
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={0.8}
          style={[
            variantStyles,
            style,
            animateOnPress && { transform: [{ scale: scaleAnim }] },
          ]}
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
        </AnimatedCard>
      );
    }

    // כרטיס רגיל // Regular card
    const CardComponent = onPress ? TouchableOpacity : View;
    const AnimatedCard = animateOnPress
      ? Animated.createAnimatedComponent(CardComponent)
      : CardComponent;

    return (
      <AnimatedCard
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[
          variantStyles,
          disabled && styles.disabled,
          style,
          animateOnPress && { transform: [{ scale: scaleAnim }] },
        ]}
        testID={testID}
        hitSlop={onPress ? hitSlop : undefined}
        {...accessibilityProps}
      >
        {CardContent}
      </AnimatedCard>
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
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl", // 🔴 תיקון RTL חובה לטקסטים עבריים
  },
  titleCompact: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl", // 🔴 תיקון RTL חובה לטקסטים עבריים
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    writingDirection: "rtl", // 🔴 תיקון RTL חובה לטקסטים עבריים
  },
  subtitleCompact: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    writingDirection: "rtl", // 🔴 תיקון RTL חובה לטקסטים עבריים
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    writingDirection: "rtl",
  },
});

export default UniversalCard;
