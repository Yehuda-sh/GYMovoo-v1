/**
 * @file src/components/common/DayButton.tsx
 * @description רכיב כפתור יום פשוט עבור בחירת יום אימון
 * English: Simple day button component for workout day selection
 */

import React, { useCallback } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { theme } from "../../core/theme";
import { getDayWorkoutType } from "../../constants/mainScreenTexts";

interface DayButtonProps {
  dayNumber: number;
  selected?: boolean;
  onPress: (day: number) => void;
}

const DayButton: React.FC<DayButtonProps> = ({
  dayNumber,
  selected = false,
  onPress,
}) => {
  const handlePress = useCallback(() => {
    onPress(dayNumber);
  }, [dayNumber, onPress]);

  // המרה לאותיות A-E
  const getDayLetter = (num: number): string => {
    const letters = ["A", "B", "C", "D", "E", "F", "G"];
    return letters[num - 1] || `יום ${num}`;
  };

  const workoutType = getDayWorkoutType(dayNumber);
  const dayLetter = getDayLetter(dayNumber);

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={`יום ${dayLetter} - ${workoutType}${selected ? " - נבחר" : ""}`}
      accessibilityRole="button"
      testID={`day-button-${dayNumber}`}
    >
      <Text style={[styles.dayText, selected && styles.selectedText]}>
        {dayLetter}
      </Text>

      {workoutType && (
        <Text
          style={[styles.workoutText, selected && styles.selectedWorkoutText]}
        >
          {workoutType}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const DayButtonGrid: React.FC<{
  days: number[];
  selectedDay?: number;
  onDayPress: (day: number) => void;
  testID?: string;
}> = ({ days, selectedDay, onDayPress, testID }) => {
  return (
    <View style={styles.grid} testID={testID}>
      {days.map((dayNum) => (
        <DayButton
          key={dayNum}
          dayNumber={dayNum}
          selected={selectedDay === dayNum}
          onPress={onDayPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border + "40",
    flex: 1,
    minHeight: 80,
    ...theme.shadows.small,
  },

  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },

  dayText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },

  selectedText: {
    color: theme.colors.surface,
  },

  workoutText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },

  selectedWorkoutText: {
    color: theme.colors.surface + "CC",
  },
});

DayButton.displayName = "DayButton";
DayButtonGrid.displayName = "DayButtonGrid";

export default DayButton;
