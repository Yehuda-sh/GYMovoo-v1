/**
 * @file src/screens/workout/components/WorkoutPlanSelector.tsx
 * @brief Workout Plan Type Selector Component - רכיב בחירת סוג תוכנית אימון
 * @updated September 2025 - Refactored to use enhanced TouchableButton with haptic feedback
 * @dependencies TouchableButton (enhanced), MaterialCommunityIcons, theme
 * @features Enhanced haptic feedback, accessibility, cross-platform support, selection states
 */

import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import TouchableButton from "../../../components/ui/TouchableButton";

interface WorkoutPlanSelectorProps {
  selectedType: "basic" | "smart";
  onSelectType: (type: "basic" | "smart") => void;
  canAccessAI: boolean;
}

const WorkoutPlanSelector = memo(
  ({ selectedType, onSelectType, canAccessAI }: WorkoutPlanSelectorProps) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>בחר סוג תוכנית</Text>

        <View style={styles.optionsContainer}>
          {/* Basic Plan Option */}
          <TouchableButton
            style={[
              styles.option,
              selectedType === "basic" && styles.selectedOption,
            ]}
            onPress={() => onSelectType("basic")}
            enableHapticFeedback={true}
            hapticType="light"
            accessibilityLabel="תוכנית בסיסית"
            accessibilityHint="תוכנית אימון פשוטה ומהירה"
            testID="basic-plan-option"
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
          </TouchableButton>

          {/* Smart Plan Option */}
          <TouchableButton
            style={[
              styles.option,
              selectedType === "smart" && styles.selectedOption,
              !canAccessAI && styles.disabledOption,
            ]}
            onPress={() => canAccessAI && onSelectType("smart")}
            disabled={!canAccessAI}
            enableHapticFeedback={true}
            hapticType="medium"
            accessibilityLabel="תוכנית חכמה"
            accessibilityHint={
              canAccessAI ? "תוכנית אימון מותאמת עם AI" : "נדרש מנוי פעיל"
            }
            testID="smart-plan-option"
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
          </TouchableButton>
        </View>
      </View>
    );
  }
);

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

WorkoutPlanSelector.displayName = "WorkoutPlanSelector";

export default WorkoutPlanSelector;
