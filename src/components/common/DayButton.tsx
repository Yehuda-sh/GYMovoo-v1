/**
 * @file src/components/common/DayButton.tsx
 * @brief רכיב כפתור יום משותף עם תמיכה בעיצובים שונים
 * @brief Shared day button component with support for different designs
 * @features תמיכה RTL, נגישות, אנימציות, מצבי בחירה, טקסט מותאם אישית
 * @features RTL support, accessibility, animations, selection states, custom text
 * @version 2.0.0 - Added customText support and workout-plan variant
 * @created 2025-08-06
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { getDayWorkoutType } from "../../constants/mainScreenTexts";

// ===============================================
// 🔧 Type Definitions - הגדרות טיפוסים
// ===============================================

/** @description ממשק עבור כפתור יום / Interface for day button */
interface DayButtonProps {
  /** @description מספר היום (1-7) / Day number (1-7) */
  dayNumber: number;

  /** @description האם היום נבחר / Whether day is selected */
  selected?: boolean;

  /** @description פונקציית לחיצה / Press function */
  onPress: (day: number) => void;

  /** @description תיאור משני אופציונלי / Optional secondary description */
  subtitle?: string;

  /** @description אייקון אופציונלי / Optional icon */
  icon?: string;

  /** @description טקסט מותאם אישית במקום "יום X" / Custom text instead of "Day X" */
  customText?: string;

  /** @description האם הכפתור מושבת / Whether button is disabled */
  disabled?: boolean;

  /** @description סטיילים נוספים / Additional styles */
  style?: ViewStyle;

  /** @description סטיילים נוספים לטקסט / Additional text styles */
  textStyle?: TextStyle;

  /** @description גודל הכפתור / Button size */
  size?: "small" | "medium" | "large";

  /** @description סוג הכפתור / Button variant */
  variant?: "default" | "compact" | "grid" | "workout-plan";

  // נגישות / Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ===============================================
// 🎨 DayButton Component - רכיב כפתור יום
// ===============================================

const DayButton: React.FC<DayButtonProps> = React.memo(
  ({
    dayNumber,
    selected = false,
    onPress,
    subtitle,
    icon = "dumbbell",
    customText,
    disabled = false,
    style,
    textStyle,
    size = "medium",
    variant = "default",
    accessibilityLabel,
    accessibilityHint,
    testID,
  }) => {
    // ===============================================
    // 🎯 Dynamic Styles - סטיילים דינמיים
    // ===============================================

    const containerStyle: ViewStyle = StyleSheet.flatten([
      styles.container,
      styles[variant],
      styles[`${size}Size`],
      selected && styles.selected,
      disabled && styles.disabled,
      style,
    ]);

    const dayTextStyle: TextStyle = StyleSheet.flatten([
      styles.dayText,
      styles[`${size}Text`],
      selected && styles.selectedText,
      disabled && styles.disabledText,
      textStyle,
    ]);

    const subtitleTextStyle: TextStyle = StyleSheet.flatten([
      styles.subtitle,
      styles[`${size}Subtitle`],
      selected && styles.selectedSubtitle,
      disabled && styles.disabledText,
    ]);

    // ===============================================
    // 🎯 Content Generation - יצירת תוכן
    // ===============================================

    const workoutType = subtitle || getDayWorkoutType(dayNumber);
    const displayText = customText || `יום ${dayNumber}`;

    // ===============================================
    // 🎯 Accessibility Enhancement - שיפור נגישות
    // ===============================================

    const generateAccessibilityLabel = (): string => {
      if (accessibilityLabel) return accessibilityLabel;

      let label = displayText;
      if (workoutType) {
        label += `, ${workoutType}`;
      }

      if (selected) {
        label += ", נבחר";
      }

      if (disabled) {
        label += ", לא זמין";
      }

      return label;
    };

    const generateAccessibilityHint = (): string => {
      if (accessibilityHint) return accessibilityHint;

      if (disabled) {
        return "כפתור זה אינו זמין כרגע";
      }

      if (selected) {
        return `${displayText} נבחר כרגע. לחץ כדי לבטל בחירה`;
      }

      return `לחץ כדי לבחור ${displayText}${workoutType ? ` - ${workoutType}` : ""}`;
    };

    const defaultAccessibilityLabel = generateAccessibilityLabel();
    const defaultAccessibilityHint = generateAccessibilityHint();

    // ===============================================
    // 🎯 Event Handlers - טיפול באירועים
    // ===============================================

    const handlePress = () => {
      if (!disabled) {
        onPress(dayNumber);
      }
    };

    // ===============================================
    // 🎯 Render - רינדור
    // ===============================================

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.7}
        accessibilityLabel={defaultAccessibilityLabel}
        accessibilityHint={defaultAccessibilityHint}
        accessibilityRole="button"
        accessibilityState={{
          selected,
          disabled,
          checked: selected,
        }}
        accessible={true}
        importantForAccessibility="yes"
        testID={testID || `day-button-${dayNumber}`}
      >
        {/* אייקון אופציונלי / Optional icon */}
        {icon && (
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={variant === "compact" ? 20 : 24}
            color={
              disabled
                ? theme.colors.textTertiary
                : selected
                  ? theme.colors.surface
                  : theme.colors.primary
            }
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        )}

        {/* טקסט יום / Day text */}
        <Text
          style={dayTextStyle}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          {displayText}
        </Text>

        {/* תיאור משני / Subtitle */}
        {workoutType && (
          <Text
            style={subtitleTextStyle}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          >
            {workoutType}
          </Text>
        )}
      </TouchableOpacity>
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
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border + "40",
    ...theme.shadows.small,
  },

  // Variant styles // סטיילי וריאנטים
  default: {
    flex: 1,
    minHeight: 80,
  },

  compact: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 60,
  },

  grid: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: "48%",
    marginBottom: theme.spacing.sm,
  },

  "workout-plan": {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minWidth: 80,
    alignItems: "center",
  },

  // Size styles // סטיילי גדלים
  smallSize: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },

  mediumSize: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },

  largeSize: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
  },

  // State styles // סטיילי מצבים
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    backgroundColor: theme.colors.backgroundElevated,
    borderColor: theme.colors.border + "20",
    opacity: 0.6,
  },

  // Day text styles // סטיילי טקסט יום
  dayText: {
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
    marginTop: theme.spacing.xs,
    marginBottom: 4,
  },

  smallText: {
    fontSize: 14,
    lineHeight: 18,
  },

  mediumText: {
    fontSize: 18,
    lineHeight: 24,
  },

  largeText: {
    fontSize: 22,
    lineHeight: 28,
  },

  selectedText: {
    color: theme.colors.surface,
  },

  disabledText: {
    color: theme.colors.textTertiary,
  },

  // Subtitle styles // סטיילי כתובית
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 16,
  },

  smallSubtitle: {
    fontSize: 10,
    lineHeight: 14,
  },

  mediumSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },

  largeSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },

  selectedSubtitle: {
    color: theme.colors.surface + "CC",
  },
});

// ===============================================
// 🔧 Helper Components - רכיבי עזר
// ===============================================

/** @description רכיב גריד לכפתורי ימים / Day buttons grid component */
export const DayButtonGrid: React.FC<{
  days: number[];
  selectedDay?: number;
  onDayPress: (day: number) => void;
  variant?: "default" | "compact" | "grid";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}> = React.memo(
  ({
    days,
    selectedDay,
    onDayPress,
    variant = "default",
    size = "medium",
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
  }) => {
    const gridStyle: ViewStyle = StyleSheet.flatten([
      {
        flexDirection: theme.isRTL ? "row-reverse" : "row",
        justifyContent: "space-between",
        gap: theme.spacing.sm,
      },
      variant === "grid" && {
        flexWrap: "wrap",
      },
      style,
    ]);

    // Accessibility for grid container
    const defaultAccessibilityLabel =
      accessibilityLabel || `בחירת יום אימון, ${days.length} אפשרויות זמינות`;
    const defaultAccessibilityHint =
      accessibilityHint || "גלול או בחר יום לתכנון האימון";

    return (
      <View
        style={gridStyle}
        testID={testID}
        accessibilityLabel={defaultAccessibilityLabel}
        accessibilityHint={defaultAccessibilityHint}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        {days.map((dayNum) => (
          <DayButton
            key={dayNum}
            dayNumber={dayNum}
            selected={selectedDay === dayNum}
            onPress={onDayPress}
            variant={variant}
            size={size}
            testID={`${testID}-day-${dayNum}`}
          />
        ))}
      </View>
    );
  }
);

// ===============================================
// 🎯 Display Name & Export
// ===============================================

DayButton.displayName = "DayButton";
DayButtonGrid.displayName = "DayButtonGrid";

export default DayButton;
