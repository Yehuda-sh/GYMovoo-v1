/**
 * @file src/components/profile/BMIBMRCalculator/components/BMIResultsCard.tsx
 * @description קומפוננט להצגת תוצאות BMI/BMR
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../core/theme";

interface BMIResults {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  idealWeight: { min: number; max: number };
}

interface BMIResultsCardProps {
  results: BMIResults;
}

export const BMIResultsCard: React.FC<BMIResultsCardProps> = ({ results }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>תוצאות החישוב</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="scale-bathroom"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.number}>{results.bmi}</Text>
          <Text style={styles.label}>BMI</Text>
          <Text style={styles.category}>{results.bmiCategory}</Text>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons
            name="fire"
            size={24}
            color={theme.colors.warning}
          />
          <Text style={styles.number}>{results.bmr}</Text>
          <Text style={styles.label}>BMR</Text>
          <Text style={styles.subtitle}>קלוריות בסיס</Text>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons
            name="nutrition"
            size={24}
            color={theme.colors.success}
          />
          <Text style={styles.number}>{results.tdee}</Text>
          <Text style={styles.label}>TDEE</Text>
          <Text style={styles.subtitle}>קלוריות יומיות</Text>
        </View>
      </View>

      <View style={styles.idealWeight}>
        <Text style={styles.idealTitle}>משקל אידיאלי</Text>
        <Text style={styles.idealRange}>
          {results.idealWeight.min}-{results.idealWeight.max} ק"ג
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  grid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: theme.spacing.sm,
    alignItems: "center",
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  category: {
    fontSize: 10,
    color: theme.colors.primary,
    marginTop: 2,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  idealWeight: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: theme.spacing.sm,
    alignItems: "center",
  },
  idealTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  idealRange: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
