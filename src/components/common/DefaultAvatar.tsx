import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

type Props = {
  name?: string;
  size?: number;
};

export default function DefaultAvatar({ name = "משתמש", size = 74 }: Props) {
  // פונקציה לחילוץ ראשי תיבות (אפשר להרחיב לשמות באנגלית)
  const getInitials = (name: string) => {
    if (!name) return "GM";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.backgroundAlt,
        },
      ]}
    >
      {name ? (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {getInitials(name)}
        </Text>
      ) : (
        <MaterialIcons name="person" size={size * 0.7} color="#fff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.accent,
    overflow: "hidden",
  },
  initials: {
    color: "#fff",
    fontWeight: "700",
  },
});
