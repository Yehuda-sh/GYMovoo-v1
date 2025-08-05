/**
 * @file src/screens/workout/components/shared/CloseButton.tsx
 * @brief כפתור סגירה מאוחד עם ווריאנטים שונים
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-05
 *
 * @description
 * רכיב כפתור סגירה מאוחד המשמש בכל רכיבי האימון
 * תומך בגדלים ועיצובים שונים לפי ה-variant
 *
 * @features
 * - ✅ 3 גדלים: small, medium, large
 * - ✅ אנימציית מגע
 * - ✅ נגישות מלאה
 * - ✅ התאמה לתמה
 * - ✅ התמקמות דינמית
 *
 * @accessibility
 * תמיכה מלאה ב-Screen Readers עם accessibilityLabel מותאם
 */

import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

interface CloseButtonProps {
  onPress: () => void;
  size?: "small" | "medium" | "large";
  position?: "center" | "start" | "end";
  marginTop?: number;
  accessibilityLabel?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  size = "medium",
  position = "center",
  marginTop = theme.spacing.sm,
  accessibilityLabel = "סגור דשבורד",
}) => {
  const sizeConfig = {
    small: { width: 28, height: 28, borderRadius: 14, iconSize: 14 },
    medium: { width: 32, height: 32, borderRadius: 16, iconSize: 16 },
    large: { width: 36, height: 36, borderRadius: 18, iconSize: 18 },
  };

  const alignmentConfig = {
    center: "center",
    start: "flex-start",
    end: "flex-end",
  } as const;

  const config = sizeConfig[size];

  return (
    <TouchableOpacity
      style={[
        styles.closeButton,
        {
          width: config.width,
          height: config.height,
          borderRadius: config.borderRadius,
          marginTop,
          alignSelf: alignmentConfig[position],
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="הקש כדי להסתיר"
    >
      <MaterialCommunityIcons
        name="close"
        size={config.iconSize}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
