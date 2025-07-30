/**
 * @file src/components/common/BackButton.tsx
 * @brief כפתור חזרה אוניברסלי עם תמיכה מלאה ב-RTL
 * @dependencies React Navigation, Ionicons, theme
 * @notes כולל תמיכה במיקום מוחלט ויחסי, נגישות מלאה
 * @recurring_errors שימוש באייקון לא נכון, מיקום לא נכון ב-RTL
 */

import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface BackButtonProps {
  absolute?: boolean;
  onPress?: () => void; // אפשרות לפונקציה מותאמת אישית
  size?: number; // גודל האייקון
  variant?: "default" | "minimal" | "large"; // סגנונות שונים
  style?: any; // סגנון מותאם אישית
}

export default function BackButton({
  absolute = true,
  onPress,
  size = 24,
  variant = "default",
  style,
}: BackButtonProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  // בחירת סגנון לפי variant
  const getButtonStyle = () => {
    switch (variant) {
      case "minimal":
        return [
          styles.button,
          styles.minimal,
          absolute && styles.absolute,
          style,
        ];
      case "large":
        return [
          styles.button,
          styles.large,
          absolute && styles.absolute,
          style,
        ];
      default:
        return [styles.button, absolute && styles.absolute, style];
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case "large":
        return size + 4;
      case "minimal":
        return size - 2;
      default:
        return size;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={getButtonStyle()}
      activeOpacity={0.7}
      accessibilityLabel="חזור"
      accessibilityRole="button"
      accessibilityHint="לחץ כדי לחזור למסך הקודם"
    >
      <Ionicons
        name="chevron-forward" // RTL: שימוש בחץ ימינה במקום שמאלה
        size={getIconSize()}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.card + "CC", // שימוש בצבע מה-theme עם שקיפות
    borderRadius: 24,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.medium,
    zIndex: 99,
  },
  minimal: {
    backgroundColor: "transparent",
    width: 36,
    height: 36,
    shadowOpacity: 0,
    elevation: 0,
  },
  large: {
    width: 48,
    height: 48,
    borderRadius: 28,
  },
  absolute: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40, // התאמה לפלטפורמה
    left: theme.spacing.md, // RTL: מיקום בצד שמאל במקום ימין
  },
});
