/**
 * @file WorkoutPlanSelector.tsx
 * @description רכיב בחירת סוג תוכנית אימון
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface WorkoutPlanSelectorProps {
  selectedType: "basic" | "smart";
  onSelectType: (type: "basic" | "smart") => void;
  canAccessAI: boolean;
}

const WorkoutPlanSelector: React.FC<WorkoutPlanSelectorProps> = ({
  selectedType,
  onSelectType,
  canAccessAI,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>בחר סוג תוכנית</Text>

      <View style={styles.optionsContainer}>
        {/* Basic Plan Option */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === "basic" && styles.selectedOption,
          ]}
          onPress={() => onSelectType("basic")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="dumbbell"
            size={24}
            color={
              selectedType === "basic"
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.optionText,
              selectedType === "basic" && styles.selectedOptionText,
            ]}
          >
            תוכנית בסיסית
          </Text>
          <Text style={styles.optionDescription}>פשוטה ומהירה</Text>
        </TouchableOpacity>

        {/* Smart Plan Option */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === "smart" && styles.selectedOption,
            !canAccessAI && styles.disabledOption,
          ]}
          onPress={() => canAccessAI && onSelectType("smart")}
          disabled={!canAccessAI}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="brain"
            size={24}
            color={
              !canAccessAI
                ? theme.colors.textSecondary
                : selectedType === "smart"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.optionText,
              selectedType === "smart" && styles.selectedOptionText,
              !canAccessAI && styles.disabledText,
            ]}
          >
            תוכנית חכמה
          </Text>
          <Text
            style={[
              styles.optionDescription,
              !canAccessAI && styles.disabledText,
            ]}
          >
            {canAccessAI ? "מותאמת עם AI" : "דרוש מנוי"}
          </Text>
          {!canAccessAI && (
            <MaterialCommunityIcons
              name="lock"
              size={16}
              color={theme.colors.textSecondary}
              style={styles.lockIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
  },

  optionsContainer: {
    flexDirection: "row",
    gap: 12,
  },

  option: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 100,
  },

  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  disabledOption: {
    opacity: 0.6,
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 8,
    textAlign: "center",
  },

  selectedOptionText: {
    color: theme.colors.primary,
  },

  disabledText: {
    color: theme.colors.textSecondary,
  },

  optionDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },

  lockIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

export default WorkoutPlanSelector;
