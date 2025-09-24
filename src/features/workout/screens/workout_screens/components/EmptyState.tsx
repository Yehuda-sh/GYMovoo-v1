/**
 * @file src/features/workout/screens/workout_screens/components/EmptyState.tsx
 * @brief Empty state component when no workout data is available
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppButton from "../../../../../components/common/AppButton";
import { theme } from "../../../../../core/theme";

interface EmptyStateProps {
  onGoBack: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onGoBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>לא התקבלו נתוני אימון לסיכום.</Text>
      <AppButton
        title="חזרה"
        variant="secondary"
        size="medium"
        onPress={onGoBack}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing.lg,
  },
});
