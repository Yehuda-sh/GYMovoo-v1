/**
 * @file src/components/common/StatCard.tsx
 * @brief רכיב כרטיס סטטיסטיקה משותף עם תמיכה במגוון רכיבים
 * @brief Shared statistics card component with support for various components
 * @features תמיכה RTL, נגישות, אנימציות, סוגי כרטיסים שונים
 * @features RTL support, accessibility, animations, different card types
 * @version 1.0.0
 * @created 2025-08-06
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

// ===============================================
// 🔧 Type Definitions - הגדרות טיפוסים
// ===============================================

/** @description סוגי כרטיסי סטטיסטיקה / Types of statistics cards */
type StatCardVariant = "default" | "scientific" | "progress" | "compact";

/** @description גדלי כרטיסים / Card sizes */
type StatCardSize = "small" | "medium" | "large";

/** @description ממשק עבור כרטיס סטטיסטיקה / Interface for statistics card */
interface StatCardProps {
  /** @description ערך מספרי או טקסט ראשי / Main numeric value or text */
  value: string | number;

  /** @description תווית/כותרת הכרטיס / Card label/title */
  label: string;

  /** @description אייקון אופציונלי / Optional icon */
  icon?: string;

  /** @description צבע האייקון / Icon color */
  iconColor?: string;

  /** @description סוג הכרטיס / Card variant */
  variant?: StatCardVariant;

  /** @description גודל הכרטיס / Card size */
  size?: StatCardSize;

  /** @description האם הכרטיס לחיץ / Whether card is pressable */
  onPress?: () => void;

  /** @description סטיילים נוספים לקונטיינר / Additional container styles */
  style?: ViewStyle;

  /** @description סטיילים נוספים לטקסט הערך / Additional value text styles */
  valueStyle?: TextStyle;

  /** @description סטיילים נוספים לטקסט התווית / Additional label text styles */
  labelStyle?: TextStyle;

  /** @description תוכן נוסף מתחת לערך / Additional content below value */
  subtitle?: string;

  /** @description האם להציג פס התקדמות / Whether to show progress bar */
  showProgress?: boolean;

  /** @description ערך התקדמות (0-100) / Progress value (0-100) */
  progressValue?: number;

  /** @description צבע פס ההתקדמות / Progress bar color */
  progressColor?: string;

  // נגישות / Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ===============================================
// 🎨 StatCard Component - רכיב כרטיס סטטיסטיקה
// ===============================================

const StatCard: React.FC<StatCardProps> = React.memo(
  ({
    value,
    label,
    icon,
    iconColor = theme.colors.primary,
    variant = "default",
    size = "medium",
    onPress,
    style,
    valueStyle,
    labelStyle,
    subtitle,
    showProgress = false,
    progressValue = 0,
    progressColor = theme.colors.primary,
    accessibilityLabel,
    accessibilityHint,
    testID,
  }) => {
    // ===============================================
    // 🎯 Dynamic Styles - סטיילים דינמיים
    // ===============================================

    const containerStyle: ViewStyle = StyleSheet.flatten([
      styles.container,
      variant === "scientific"
        ? styles.scientific
        : variant === "progress"
          ? styles.progress
          : variant === "compact"
            ? styles.compact
            : styles.default,
      size === "small"
        ? styles.smallSize
        : size === "large"
          ? styles.largeSize
          : styles.mediumSize,
      style,
    ]);

    const valueTextStyle: TextStyle = StyleSheet.flatten([
      styles.value,
      size === "small"
        ? styles.smallValue
        : size === "large"
          ? styles.largeValue
          : styles.mediumValue,
      valueStyle,
    ]);

    const labelTextStyle: TextStyle = StyleSheet.flatten([
      styles.label,
      size === "small"
        ? styles.smallLabel
        : size === "large"
          ? styles.largeLabel
          : styles.mediumLabel,
      labelStyle,
    ]);

    // ===============================================
    // 🎯 Card Content - תוכן הכרטיס
    // ===============================================

    const CardContent = () => (
      <>
        {/* אייקון אופציונלי / Optional icon */}
        {icon && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={icon as any}
              size={variant === "compact" ? 20 : 24}
              color={iconColor}
              accessibilityElementsHidden={true}
            />
          </View>
        )}

        {/* ערך ראשי / Main value */}
        <Text style={valueTextStyle} testID={`${testID}-value`}>
          {value}
        </Text>

        {/* תווית / Label */}
        <Text style={labelTextStyle} testID={`${testID}-label`}>
          {label}
        </Text>

        {/* כתובית אופציונלית / Optional subtitle */}
        {subtitle && (
          <Text style={styles.subtitle} testID={`${testID}-subtitle`}>
            {subtitle}
          </Text>
        )}

        {/* פס התקדמות אופציונלי / Optional progress bar */}
        {showProgress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, Math.max(0, progressValue))}%`,
                    backgroundColor: progressColor,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </>
    );

    // ===============================================
    // 🎯 Render - רינדור
    // ===============================================

    if (onPress) {
      return (
        <TouchableOpacity
          style={containerStyle}
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityLabel={accessibilityLabel || `${label}: ${value}`}
          accessibilityHint={accessibilityHint}
          accessibilityRole="button"
          testID={testID}
        >
          <CardContent />
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={containerStyle}
        accessibilityLabel={accessibilityLabel || `${label}: ${value}`}
        testID={testID}
      >
        <CardContent />
      </View>
    );
  }
);

// ===============================================
// 🎨 Styles - סטיילים
// ===============================================

const styles = StyleSheet.create({
  // Base container styles // סטיילים בסיסיים לקונטיינר
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },

  // Variant styles // סטיילי וריאנטים
  default: {
    backgroundColor: theme.colors.card,
  },

  scientific: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    width: "48%",
    marginBottom: theme.spacing.sm,
  },

  progress: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.lg,
  },

  compact: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },

  // Size styles // סטיילי גדלים
  smallSize: {
    padding: theme.spacing.sm,
    minHeight: 80,
  },

  mediumSize: {
    padding: theme.spacing.md,
    minHeight: 100,
  },

  largeSize: {
    padding: theme.spacing.lg,
    minHeight: 120,
  },

  // Icon container // קונטיינר אייקון
  iconContainer: {
    marginBottom: theme.spacing.xs,
  },

  // Value text styles // סטיילי טקסט ערך
  value: {
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },

  smallValue: {
    fontSize: 18,
  },

  mediumValue: {
    fontSize: 24,
  },

  largeValue: {
    fontSize: 32,
  },

  // Label text styles // סטיילי טקסט תווית
  label: {
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },

  smallLabel: {
    fontSize: 11,
  },

  mediumLabel: {
    fontSize: 13,
  },

  largeLabel: {
    fontSize: 15,
  },

  // Subtitle style // סטייל כתובית
  subtitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: "center",
    marginTop: 4,
    writingDirection: "rtl",
  },

  // Progress styles // סטיילי התקדמות
  progressContainer: {
    marginTop: theme.spacing.sm,
    width: "100%",
  },

  progressBar: {
    height: 4,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.xs,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: theme.radius.xs,
  },
});

// ===============================================
// 🔧 Helper Components - רכיבי עזר
// ===============================================

/** @description רכיב גריד לכרטיסי סטטיסטיקות / Statistics cards grid component */
export const StatCardGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  style?: ViewStyle;
  testID?: string;
}> = React.memo(({ children, columns: _columns = 2, style, testID }) => {
  const gridStyle: ViewStyle = StyleSheet.flatten([
    {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      justifyContent: "space-between" as const,
      gap: theme.spacing.sm,
    },
    style,
  ]);

  return (
    <View style={gridStyle} testID={testID}>
      {children}
    </View>
  );
});

// ===============================================
// 🎯 Display Name & Export
// ===============================================

StatCard.displayName = "StatCard";
StatCardGrid.displayName = "StatCardGrid";

export default StatCard;
