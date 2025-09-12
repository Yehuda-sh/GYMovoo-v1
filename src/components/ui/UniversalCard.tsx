/**
 * @file src/components/ui/UniversalCard.tsx
 * @brief כרטיס אוניברסלי עם אפשרויות עיצוב מגוונות משופר + אופטימיזציה לכושר מובייל
 * @dependencies theme, React.memo
 * @notes תומך ב-workout variant בלבד
 * @version 5.0 - Simplified version with only used features
 */

import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../core/theme";

interface UniversalCardProps {
  title?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const UniversalCard: React.FC<UniversalCardProps> = React.memo(
  ({ title, children, style }) => {
    return (
      <View style={[styles.card, style]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.content}>{children}</View>
      </View>
    );
  }
);

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
UniversalCard.displayName = "UniversalCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  content: {
    // Content container
  },
});

export default UniversalCard;
