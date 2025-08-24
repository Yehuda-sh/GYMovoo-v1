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
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
                size={28}
                color={isSelected ? theme.colors.white : theme.colors.primary}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    // שיפורי צללים מתקדמים
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
    minHeight: 52, // Accessibility requirement משופר
    backgroundColor: `${theme.colors.background}60`,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}30`,
    // שיפורי עיצוב
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDayButton: {
    backgroundColor: theme.colors.primary,
    borderColor: `${theme.colors.primary}80`,
    // שיפורי עיצוב למצב נבחר
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
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
    textShadowColor: `${theme.colors.primary}80`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default DaySelector;
