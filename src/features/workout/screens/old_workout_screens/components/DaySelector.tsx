/**
 * @file Day Selector Component
 * @description רכיב לבחירת יום אימון
 * @version 1.0.0
 */

import React, { memo, useCallback } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../../styles/theme";
import { DAY_ICONS } from "../utils/workoutConstants";

interface DaySelectorProps {
  workoutDays: string[];
  selectedDay: number;
  onDaySelect: (index: number) => void;
  isEnabled?: boolean;
}

const DaySelector: React.FC<DaySelectorProps> = memo(
  ({ workoutDays, selectedDay, onDaySelect, isEnabled = true }) => {
    const handleDayPress = useCallback(
      (index: number) => {
        if (!isEnabled) return;

        Haptics.selectionAsync();
        onDaySelect(index);
      },
      [isEnabled, onDaySelect]
    );

    const getDayAccessibilityLabel = useCallback(
      (index: number) => {
        const dayName = workoutDays[index];
        const isSelected = index === selectedDay;
        return `יום ${dayName}${isSelected ? ", נבחר" : ""}. יום ${index + 1} מתוך ${workoutDays.length}`;
      },
      [workoutDays, selectedDay]
    );

    if (!workoutDays || workoutDays.length === 0) {
      return null;
    }

    return (
      <View style={styles.daysContainer}>
        {workoutDays.map((dayName, index) => {
          const isSelected = selectedDay === index;
          const iconName = DAY_ICONS[dayName] || "dumbbell";

          return (
            <TouchableOpacity
              key={`${dayName}-${index}`}
              style={[
                styles.dayButton,
                isSelected && styles.selectedDayButton,
                !isEnabled && styles.disabledDayButton,
              ]}
              onPress={() => handleDayPress(index)}
              activeOpacity={isEnabled ? 0.6 : 1}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={getDayAccessibilityLabel(index)}
              accessibilityState={{
                selected: isSelected,
                disabled: !isEnabled,
              }}
              disabled={!isEnabled}
            >
              <MaterialCommunityIcons
                name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
                size={28}
                color={
                  !isEnabled
                    ? theme.colors.textSecondary
                    : isSelected
                      ? theme.colors.white
                      : theme.colors.primary
                }
              />
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  !isEnabled && styles.disabledText,
                ]}
                numberOfLines={2}
              >
                {dayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
);

DaySelector.displayName = "DaySelector";

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}40`,
  },
  dayButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginHorizontal: 3,
    minHeight: 52,
    backgroundColor: `${theme.colors.background}60`,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}30`,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDayButton: {
    backgroundColor: theme.colors.primary,
    borderColor: `${theme.colors.primary}80`,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  disabledDayButton: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 6,
    letterSpacing: 0.2,
  },
  selectedDayText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  disabledText: {
    color: theme.colors.textSecondary,
    opacity: 0.6,
  },
});

export default DaySelector;
