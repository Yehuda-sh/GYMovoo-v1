/**
 * @file src/components/common/LoadingSpinner.tsx
 * @brief רכיב טעינה אוניברסלי עם טקסט אופציונלי
 * @dependencies ActivityIndicator, theme
 * @notes מחליף את כל ה-ActivityIndicator החוזרים באפליקציה
 */

import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: any;
}

export default function LoadingSpinner({
  size = "large",
  color = theme.colors.primary,
  text,
  fullScreen = false,
  style,
}: LoadingSpinnerProps) {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.loadingText}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
});
