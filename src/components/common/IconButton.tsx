// src/components/common/IconButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  disabled?: boolean;
  style?: ViewStyle;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color = theme.colors.text,
  backgroundColor = "transparent",
  borderRadius = theme.radius.md,
  padding = theme.spacing.sm,
  disabled = false,
  style,
  hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={[
        styles.button,
        {
          backgroundColor,
          borderRadius,
          padding,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={size}
        color={disabled ? theme.colors.textSecondary : color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default IconButton;
