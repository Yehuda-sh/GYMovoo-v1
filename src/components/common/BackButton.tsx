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
}

export default function BackButton({
  absolute = true,
  onPress,
}: BackButtonProps) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, absolute && styles.absolute]}
      activeOpacity={0.7}
      accessibilityLabel="חזור"
      accessibilityRole="button"
      accessibilityHint="לחץ כדי לחזור למסך הקודם"
    >
      <Ionicons
        name="chevron-forward" // RTL: שימוש בחץ ימינה במקום שמאלה
        size={24}
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
  absolute: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40, // התאמה לפלטפורמה
    left: theme.spacing.md, // RTL: מיקום בצד שמאל במקום ימין
  },
});
