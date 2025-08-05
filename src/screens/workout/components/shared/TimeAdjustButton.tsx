/**
 * @file src/screens/workout/components/shared/TimeAdjustButton.tsx
 * @brief כפתור התאמת זמן מאוחד לטיימר מנוחה
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-05
 *
 * @description
 * רכיב כפתור מאוחד להוספה והפחתה של זמן מטיימר מנוחה
 * תומך בגדלים ועיצובים שונים עם גרדיאנטים
 *
 * @features
 * - ✅ 2 מצבים: compact, full
 * - ✅ תמיכה בהוספה והפחתה
 * - ✅ גרדיאנטים אוטומטיים
 * - ✅ נגישות מלאה
 * - ✅ אייקונים מותאמים
 */

import React, { useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../styles/theme";

type ButtonType = "add" | "subtract";
type ButtonSize = "compact" | "full";

interface TimeAdjustButtonProps {
  type: ButtonType;
  size?: ButtonSize;
  seconds?: number;
  onPress: (seconds: number) => void;
  disabled?: boolean;
}

const BUTTON_CONFIG = {
  add: {
    icon: "add-circle" as const,
    color: theme.colors.success,
    text: "+",
    accessibilityAction: "הוסף",
  },
  subtract: {
    icon: "remove-circle" as const,
    color: theme.colors.warning,
    text: "-",
    accessibilityAction: "הפחת",
  },
} as const;

const SIZE_CONFIG = {
  compact: {
    containerStyle: { marginHorizontal: 8 },
    buttonStyle: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 40,
    },
    textStyle: { fontSize: 14, fontWeight: "600" as const },
    iconSize: 0, // אין אייקון במצב compact
    useGradient: false,
  },
  full: {
    containerStyle: {},
    buttonStyle: {
      borderRadius: 24,
      overflow: "hidden" as const,
      minWidth: 80,
      minHeight: 80,
    },
    textStyle: { fontSize: 16, fontWeight: "700" as const, marginTop: 4 },
    iconSize: 32,
    useGradient: true,
  },
} as const;

export const TimeAdjustButton: React.FC<TimeAdjustButtonProps> = ({
  type,
  size = "full",
  seconds = 10,
  onPress,
  disabled = false,
}) => {
  const config = BUTTON_CONFIG[type];
  const sizeConfig = SIZE_CONFIG[size];

  const handlePress = useCallback(() => {
    const value = type === "add" ? seconds : -seconds;
    onPress(value);
  }, [type, seconds, onPress]);

  const accessibilityLabel = `${config.accessibilityAction} ${seconds} שניות ${type === "add" ? "לטיימר" : "מהטיימר"}`;

  if (size === "compact") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[sizeConfig.containerStyle]}
        activeOpacity={0.7}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <View
          style={[
            sizeConfig.buttonStyle,
            { backgroundColor: config.color + "20", alignItems: "center" },
            disabled && { opacity: 0.5 },
          ]}
        >
          <Text style={[sizeConfig.textStyle, { color: config.color }]}>
            {config.text}
            {seconds}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Full size with gradient
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        sizeConfig.buttonStyle,
        { ...theme.shadows.medium },
        disabled && { opacity: 0.5 },
      ]}
      activeOpacity={0.7}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <LinearGradient
        colors={[config.color + "30", config.color + "10"]}
        style={[
          sizeConfig.buttonStyle,
          {
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            padding: 16,
          },
        ]}
      >
        <Ionicons
          name={config.icon}
          size={sizeConfig.iconSize}
          color={config.color}
        />
        <Text style={[sizeConfig.textStyle, { color: config.color }]}>
          {config.text}
          {seconds}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ההגדרות נמצאות במרכז הקונפיגורציה למעלה
});
