/**
 * @file src/components/ui/UniversalCard.tsx
 * @brief כרטיס אוניברסלי עם אפשרויות עיצוב מגוונות
 * @dependencies theme, LinearGradient
 * @notes תומך בכותרת, תת-כותרת, תוכן, פעולות, גרדיאנט
 * @recurring_errors וודא שימוש נכון ב-renderContent או children
 */

import React from "react";
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
  variant?: "default" | "gradient" | "outlined" | "elevated";
  footer?: React.ReactNode;
  style?: ViewStyle;
  gradientColors?: readonly [string, string, ...string[]];
  disabled?: boolean;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
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
}) => {
  // סגנונות לפי וריאנט // Variant styles
  const getVariantStyles = (): ViewStyle => {
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
      default:
        return theme.components.card;
    }
  };

  // תוכן הכרטיס // Card content
  const CardContent = () => (
    <>
      {/* כותרת // Header */}
      {(title || subtitle || icon) && (
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={24} color={iconColor} />
            </View>
          )}
        </View>
      )}

      {/* תוכן // Content */}
      <View style={styles.content}>
        {renderContent ? renderContent() : children}
      </View>

      {/* פוטר // Footer */}
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  // כרטיס עם גרדיאנט // Gradient card
  if (variant === "gradient") {
    const GradientCard = onPress ? TouchableOpacity : View;
    return (
      <GradientCard
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[getVariantStyles(), style]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <CardContent />
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
      style={[getVariantStyles(), disabled && styles.disabled, style]}
    >
      <CardContent />
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
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
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  iconContainer: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
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
  gradient: {
    padding: theme.spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default UniversalCard;
