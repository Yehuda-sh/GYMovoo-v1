/**
 * @file src/features/workout/screens/workout_screens/components/PersonalRecords.tsx
 * @brief Personal records section for WorkoutSummaryScreen
 */

import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL, wrapTextWithEmoji } from "../../../../../utils/rtlHelpers";

interface PersonalRecordsProps {
  personalRecords: string[];
  fadeAnim: Animated.Value;
}

export const PersonalRecords: React.FC<PersonalRecordsProps> = ({
  personalRecords,
  fadeAnim,
}) => {
  if (personalRecords.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.recordsContainer, { opacity: fadeAnim }]}>
      <Text style={styles.recordsTitle}>
        {wrapTextWithEmoji("שיאים אישיים חדשים!", "🏆")}
      </Text>

      {personalRecords.map((record, index) => (
        <View key={`${record}_${index}`} style={styles.recordItem}>
          <MaterialCommunityIcons
            name="trophy"
            size={16}
            color={theme.colors.warning}
          />
          <Text style={styles.recordText}>{record}</Text>
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  recordsContainer: {
    backgroundColor: "white",
    marginHorizontal: theme.spacing.lg,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  recordItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  recordText: {
    fontSize: 16,
    color: theme.colors.text,
    marginStart: isRTL() ? 0 : theme.spacing.sm,
    marginEnd: isRTL() ? theme.spacing.sm : 0,
    flex: 1,
    textAlign: isRTL() ? "right" : "left",
  },
});
