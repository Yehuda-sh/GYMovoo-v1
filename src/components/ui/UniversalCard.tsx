/**
 * @file src/components/ui/UniversalCard.tsx
 * @brief כרטיס אוניברסלי פשוט עם title ו-children
 * @dependencies theme, React.memo
 */

import React from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { theme } from "../../core/theme";
import { getTextDirection } from "../../utils/rtlHelpers";

interface UniversalCardProps {
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export const UniversalCard: React.FC<UniversalCardProps> = React.memo(
  ({ title, children, style, contentStyle, accessibilityLabel, testID }) => {
    return (
      <View
        style={[styles.card, style]}
        accessibilityRole="summary"
        accessibilityLabel={accessibilityLabel || title || "כרטיס"}
        testID={testID || "universal-card"}
      >
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    );
  }
);

UniversalCard.displayName = "UniversalCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card, // עקבי עם כל הכרטיסים באפליקציה
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    writingDirection: getTextDirection(),
    textAlign: theme.isRTL() ? "right" : "left",
  },
  content: {
    // ריק בכוונה: מאפשר התאמה דרך contentStyle
  },
});

export default UniversalCard;
