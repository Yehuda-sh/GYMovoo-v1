// src/components/common/EmptyState.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  iconSize?: number;
  iconColor?: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "folder-open-outline",
  title,
  description,
  iconSize = 64,
  iconColor = theme.colors.textSecondary,
  children,
}) => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${title}${description ? `. ${description}` : ""}`}
      accessibilityHint="מסך ריק - אין תוכן להצגה"
    >
      <Ionicons
        name={icon}
        size={iconSize}
        color={iconColor}
        style={styles.icon}
        accessible={false} // האב כבר נגיש
      />
      <Text
        style={styles.title}
        accessible={false} // האב כבר נגיש
      >
        {title}
      </Text>
      {description && (
        <Text
          style={styles.description}
          accessible={false} // האב כבר נגיש
        >
          {description}
        </Text>
      )}
      {children && <View style={styles.actions}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
});

export default EmptyState;
