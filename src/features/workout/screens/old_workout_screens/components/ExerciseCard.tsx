/**
 * @file Exercise Card Component
 * @description רכיב תרגיל
 * @version 1.0.0
 */

import { memo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../../styles/theme";
import {
  getEquipmentHebrewName,
  getEquipmentIcon,
} from "../../../utils/equipmentIconMapping";

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    equipment: string;
    muscleGroups?: string[];
    sets?: number;
    reps?: string;
    duration?: number;
    rest?: number;
    category?: string;
  };
  isExpanded: boolean;
  onPress: (exerciseId: string) => void;
  showDetails?: boolean;
  disabled?: boolean;
}

const ExerciseCard = memo(
  ({
    exercise,
    isExpanded,
    onPress,
    showDetails = true,
    disabled = false,
  }: ExerciseCardProps) => {
    const handlePress = useCallback(() => {
      if (disabled) return;

      Haptics.selectionAsync();
      onPress(exercise.id);
    }, [disabled, onPress, exercise.id]);

    const equipmentIcon = getEquipmentIcon(exercise.equipment);
    const equipmentName = getEquipmentHebrewName(exercise.equipment);

    const exerciseStats = [];
    if (exercise.sets) exerciseStats.push(`${exercise.sets} סטים`);
    if (exercise.reps) exerciseStats.push(exercise.reps);
    if (exercise.duration) exerciseStats.push(`${exercise.duration}״`);

    return (
      <TouchableOpacity
        style={[
          styles.exerciseCard,
          isExpanded && styles.expandedCard,
          disabled && styles.disabledCard,
        ]}
        onPress={handlePress}
        activeOpacity={disabled ? 1 : 0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`תרגיל ${exercise.name}, דורש ${equipmentName}`}
        accessibilityState={{
          disabled,
          expanded: isExpanded,
        }}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text
              style={[styles.exerciseName, disabled && styles.disabledText]}
              numberOfLines={2}
            >
              {exercise.name}
            </Text>
            <View style={styles.equipmentRow}>
              <MaterialCommunityIcons
                name={
                  equipmentIcon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={18}
                color={
                  disabled ? theme.colors.textSecondary : theme.colors.primary
                }
              />
              <Text
                style={[styles.equipmentText, disabled && styles.disabledText]}
              >
                {equipmentName}
              </Text>
            </View>
          </View>

          {showDetails && exerciseStats.length > 0 && (
            <View style={styles.exerciseDetails}>
              {exerciseStats.map((stat, index) => (
                <Text
                  key={index}
                  style={[styles.detailText, disabled && styles.disabledText]}
                >
                  {stat}
                </Text>
              ))}
            </View>
          )}

          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={28}
            color={
              disabled
                ? theme.colors.textSecondary
                : isExpanded
                  ? theme.colors.primary
                  : theme.colors.textSecondary
            }
          />
        </View>

        {isExpanded &&
          exercise.muscleGroups &&
          exercise.muscleGroups.length > 0 && (
            <View style={styles.expandedContent}>
              <Text style={styles.muscleGroupsLabel}>קבוצות שריר:</Text>
              <View style={styles.muscleGroupsContainer}>
                {exercise.muscleGroups.map((muscle, index) => (
                  <View key={`${muscle}-${index}`} style={styles.muscleTag}>
                    <Text style={styles.muscleText}>{muscle}</Text>
                  </View>
                ))}
              </View>
              {exercise.rest && (
                <Text style={styles.restText}>
                  מנוחה: {exercise.rest} שניות
                </Text>
              )}
            </View>
          )}
      </TouchableOpacity>
    );
  }
);

ExerciseCard.displayName = "ExerciseCard";

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}40`,
  },
  expandedCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    transform: [{ scale: 1.02 }],
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.textSecondary,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
    lineHeight: 24,
  },
  disabledText: {
    color: theme.colors.textSecondary,
    opacity: 0.7,
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${theme.colors.primary}08`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  equipmentText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 6,
    fontWeight: "600",
  },
  exerciseDetails: {
    alignItems: "flex-end",
    marginRight: 8,
    backgroundColor: `${theme.colors.background}80`,
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 3,
    fontWeight: "600",
    textAlign: "center",
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.border}60`,
    backgroundColor: `${theme.colors.surface}40`,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: -4,
  },
  muscleGroupsLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  muscleGroupsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  muscleTag: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  muscleText: {
    fontSize: 13,
    color: theme.colors.white,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  restText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "center",
    backgroundColor: `${theme.colors.background}60`,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ExerciseCard;
