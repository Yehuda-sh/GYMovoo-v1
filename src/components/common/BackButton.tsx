/**
 * @file src/components/common/BackButton.tsx
 * @brief ✨ כפתור חזרה אוניברסלי משופר עם אינטגרציה מלאה ל-theme
 * @dependencies React Navigation, Ionicons, theme
 * @notes כולל תמיכה במיקום מוחלט ויחסי, נגישות מלאה, ללא כפילויות
 * @version 2.0 - Unified with theme.ts, removed all duplications
 */

import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface BackButtonProps {
  absolute?: boolean;
  onPress?: () => void;
  size?: number;
  variant?: "default" | "minimal" | "large";
  style?: ViewStyle;
}

export default function BackButton({
  absolute = true,
  onPress,
  size,
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

  // ✨ שימוש בקונפיגורציית theme מאוחדת - Using unified theme configuration
  const buttonStyle = theme.components.getBackButtonStyle({
    absolute,
    variant,
    customStyle: style,
  });

  const iconSize = theme.components.getBackButtonIconSize(variant, size);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={buttonStyle}
      activeOpacity={0.7}
      accessibilityLabel="חזור"
      accessibilityRole="button"
      accessibilityHint="לחץ כדי לחזור למסך הקודם"
    >
      <Ionicons
        name="chevron-forward" // RTL: שימוש בחץ ימינה במקום שמאלה
        size={iconSize}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
}
