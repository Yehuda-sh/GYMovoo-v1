import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";

interface DefaultAvatarProps {
  name?: string;
  size?: number | "small" | "medium" | "large" | "xl";
  showBorder?: boolean;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";

  const firstPart = parts[0];
  if (parts.length === 1 && firstPart && firstPart[0]) {
    return firstPart[0].toUpperCase();
  }

  const lastPart = parts[parts.length - 1];
  if (firstPart && lastPart && firstPart[0] && lastPart[0]) {
    return (firstPart[0] + lastPart[0]).toUpperCase();
  }

  return "";
};

const getSizeValue = (
  size: number | "small" | "medium" | "large" | "xl"
): number => {
  if (typeof size === "number") return size;

  const sizeMap = { small: 40, medium: 60, large: 80, xl: 100 };
  return sizeMap[size] || 60;
};

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({
  name = "",
  size = "medium",
  showBorder = true,
}) => {
  const sizeValue = getSizeValue(size);
  const initials = getInitials(name);
  const borderWidth = showBorder ? 2 : 0;

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: theme.colors.primary,
          borderWidth,
          borderColor: theme.colors.primaryLight,
        },
      ]}
    >
      {initials ? (
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeValue * 0.35,
              lineHeight: sizeValue * 0.35,
            },
          ]}
        >
          {initials}
        </Text>
      ) : (
        <MaterialIcons
          name="person"
          size={sizeValue * 0.6}
          color={theme.colors.white}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default React.memo(DefaultAvatar);
