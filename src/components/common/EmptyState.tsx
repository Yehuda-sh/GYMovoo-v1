/**
 * @file src/components/common/EmptyState.tsx
 * @brief קומפוננטת מצב ריק פשוטה
 * @brief Simple empty state component
 * @dependencies Ionicons, theme
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../core/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  variant?: "default" | "compact";
  testID?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "folder-open-outline",
  title,
  description,
  variant = "default",
  testID = "empty-state",
}) => {
  const iconSize = variant === "compact" ? 48 : 64;

  return (
    <View
      style={[
        styles.container,
        variant === "compact" && styles.containerCompact,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${title}${description ? `. ${description}` : ""}`}
      testID={testID}
    >
      <Ionicons
        name={icon}
        size={iconSize}
        color={theme.colors.textSecondary}
        style={styles.icon}
        accessible={false}
      />
      <Text
        style={[styles.title, variant === "compact" && styles.titleCompact]}
        accessible={false}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={[
            styles.description,
            variant === "compact" && styles.descriptionCompact,
          ]}
          accessible={false}
        >
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.md,
  },
  containerCompact: {
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },

  icon: {
    marginBottom: theme.spacing.xl,
    opacity: 0.8,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    letterSpacing: 0.4,
  },
  titleCompact: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.3,
  },

  description: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    letterSpacing: 0.2,
    paddingHorizontal: theme.spacing.md,
  },
  descriptionCompact: {
    fontSize: 15,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
});

export default EmptyState;
