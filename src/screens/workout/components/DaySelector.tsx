/**
 * @file Optimized Day Selector Component
 * @description רכיב מותאם לבחירת יום אימון עם React.memo
 */

import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../../styles/theme";
import { DAY_ICONS } from "../utils/workoutConstants";

interface DaySelectorProps {
  workoutDays: string[];
  selectedDay: number;
  onDaySelect: (index: number) => void;
}

const DaySelector = memo(
  ({ workoutDays, selectedDay, onDaySelect }: DaySelectorProps) => {
    const handleDayPress = (index: number) => {
      Haptics.selectionAsync();
      onDaySelect(index);
    };

    return (
      <View style={styles.daysContainer}>
        {workoutDays.map((dayName, index) => {
          const isSelected = selectedDay === index;
          const iconName = DAY_ICONS[dayName] || "dumbbell";

          return (
            <TouchableOpacity
              key={`${dayName}-${index}`}
              style={[styles.dayButton, isSelected && styles.selectedDayButton]}
              onPress={() => handleDayPress(index)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons
                name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
                size={24}
                color={isSelected ? theme.colors.white : theme.colors.text}
              />
              <Text
                style={[styles.dayText, isSelected && styles.selectedDayText]}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    minHeight: 44, // Accessibility requirement
  },
  selectedDayButton: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 4,
  },
  selectedDayText: {
    color: theme.colors.white,
    fontWeight: "600",
  },
});

export default DaySelector;
