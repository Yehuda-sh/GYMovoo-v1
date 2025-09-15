/**
 * @file src/components/common/StatCard.tsx
 * @brief רכיב כרטיס סטטיסטיקה פשוט
 * @brief Simple statistics card component
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";

type StatCardVariant = "default" | "scientific" | "progress";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  iconColor?: string;
  variant?: StatCardVariant;
  subtitle?: string;
  showProgress?: boolean;
  progressValue?: number;
  testID?: string;
}

// ===============================================
// 🎨 StatCard Component - רכיב כרטיס סטטיסטיקה
// ===============================================

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  iconColor = theme.colors.primary,
  variant = "default",
  subtitle,
  showProgress = false,
  progressValue = 0,
  testID,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case "scientific":
        return [styles.container, styles.scientific];
      case "progress":
        return [styles.container, styles.progress];
      default:
        return styles.container;
    }
  };

  return (
    <View
      style={getContainerStyle()}
      accessibilityLabel={`${label}: ${value}`}
      testID={testID}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={24}
            color={iconColor}
            accessibilityElementsHidden={true}
          />
        </View>
      )}

      <Text style={styles.value} testID={`${testID}-value`}>
        {value}
      </Text>

      <Text style={styles.label} testID={`${testID}-label`}>
        {label}
      </Text>

      {subtitle && (
        <Text style={styles.subtitle} testID={`${testID}-subtitle`}>
          {subtitle}
        </Text>
      )}

      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, Math.max(0, progressValue))}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

// ===============================================
// 🎨 Styles - סטיילים
// ===============================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },

  scientific: {
    width: "48%",
    marginBottom: theme.spacing.sm,
  },

  progress: {
    paddingVertical: theme.spacing.lg,
  },

  iconContainer: {
    marginBottom: theme.spacing.xs,
  },

  value: {
    fontSize: 24,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },

  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },

  subtitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: "center",
    marginTop: 4,
    writingDirection: "rtl",
  },

  progressContainer: {
    marginTop: theme.spacing.sm,
    width: "100%",
  },

  progressBar: {
    height: 4,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.xs,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: theme.radius.xs,
  },
});

export const StatCardGrid: React.FC<{
  children: React.ReactNode;
  testID?: string;
}> = ({ children, testID }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: theme.spacing.sm,
      }}
      testID={testID}
    >
      {children}
    </View>
  );
};

export default StatCard;
