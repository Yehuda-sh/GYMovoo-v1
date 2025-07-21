/**
 * @file src/screens/workout/components/WorkoutDashboard.tsx
 * @description דשבורד קומפקטי ואופקי עם סטטיסטיקות חיות של האימון
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface DashboardStatProps {
  label: string;
  value: string | number;
  icon:
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof FontAwesome5>["name"];
  iconFamily: "material" | "font5";
}

interface WorkoutDashboardProps {
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  pace: number;
  personalRecords: number;
}

const StatItem: React.FC<DashboardStatProps> = ({
  label,
  value,
  icon,
  iconFamily,
}) => (
  <View style={styles.statItem}>
    {iconFamily === "material" ? (
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={theme.colors.primary}
      />
    ) : (
      <FontAwesome5 name={icon} size={20} color={theme.colors.primary} />
    )}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({
  totalVolume,
  completedSets,
  totalSets,
  pace,
  personalRecords,
}) => {
  const stats: DashboardStatProps[] = [
    {
      label: "נפח",
      value: `${Math.round(totalVolume)} ק"ג`,
      icon: "weight-hanging",
      iconFamily: "font5",
    },
    {
      label: "סטים",
      value: `${completedSets}/${totalSets}`,
      icon: "format-list-checks",
      iconFamily: "material",
    },
    {
      label: "קצב",
      value: pace.toFixed(1),
      icon: "speedometer",
      iconFamily: "material",
    },
    {
      label: "שיאים",
      value: personalRecords,
      icon: "trophy-award",
      iconFamily: "material",
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    backgroundColor: theme.colors.card,
    paddingVertical: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statItem: {
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
