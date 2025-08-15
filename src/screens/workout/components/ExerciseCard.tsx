/**
 * @file Optimized Exercise Card Component
 * @description רכיב תרגיל מותאם עם React.memo ואופטימיזציות ביצועים
 */

import React, { memo } from "react";
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
    muscleGroups?: string[]; // Make optional to handle cases where it might be missing
    sets?: number;
    reps?: string;
    duration?: number;
    rest?: number;
  };
  isExpanded: boolean;
  onPress: (exerciseId: string) => void;
  showDetails?: boolean;
}

const ExerciseCard = memo(
  ({
    exercise,
    isExpanded,
    onPress,
    showDetails = true,
  }: ExerciseCardProps) => {
    const handlePress = () => {
      Haptics.selectionAsync();
      onPress(exercise.id);
    };

    const equipmentIcon = getEquipmentIcon(exercise.equipment);
    const equipmentName = getEquipmentHebrewName(exercise.equipment);

    return (
      <TouchableOpacity
        style={[styles.exerciseCard, isExpanded && styles.expandedCard]}
        onPress={handlePress}
        activeOpacity={0.7}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName} numberOfLines={2}>
              {exercise.name}
            </Text>
            <View style={styles.equipmentRow}>
              <MaterialCommunityIcons
                name={
                  equipmentIcon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.equipmentText}>{equipmentName}</Text>
            </View>
          </View>

          {showDetails && (
            <View style={styles.exerciseDetails}>
              {exercise.sets && (
                <Text style={styles.detailText}>{exercise.sets} סטים</Text>
              )}
              {exercise.reps && (
                <Text style={styles.detailText}>{exercise.reps}</Text>
              )}
              {exercise.duration && (
                <Text style={styles.detailText}>{exercise.duration}״</Text>
              )}
            </View>
          )}

          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>

        {isExpanded && exercise.muscleGroups && (
          <View style={styles.expandedContent}>
            <Text style={styles.muscleGroupsLabel}>קבוצות שריר:</Text>
            <View style={styles.muscleGroupsContainer}>
              {exercise.muscleGroups.map((muscle) => (
                <View key={muscle} style={styles.muscleTag}>
                  <Text style={styles.muscleText}>{muscle}</Text>
                </View>
              ))}
            </View>
            {exercise.rest && (
              <Text style={styles.restText}>מנוחה: {exercise.rest} שניות</Text>
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
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandedCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
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
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  equipmentText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  exerciseDetails: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  muscleGroupsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  muscleGroupsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  muscleTag: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  muscleText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  restText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
});

export default ExerciseCard;
