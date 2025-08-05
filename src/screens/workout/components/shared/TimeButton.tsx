/**
 * @file src/screens/workout/components/shared/TimeButton.tsx
 * @brief רכיב כפתור זמן משותף
 * @description מונע כפילויות בין WorkoutStatusBar ו-RestTimer
 */

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";

interface TimeButtonProps {
  onPress: () => void;
  text: string;
  color: string;
  accessibilityLabel: string;
  style?: any;
}

export const TimeButton: React.FC<TimeButtonProps> = React.memo(
  ({ onPress, text, color, accessibilityLabel, style }) => {
    return (
      <TouchableOpacity
        style={[
          styles.timeButton,
          {
            backgroundColor: color + "20",
            borderColor: color + "40",
          },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <Text style={[styles.timeButtonText, { color }]}>{text}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  timeButton: {
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
