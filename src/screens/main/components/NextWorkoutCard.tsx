/**
 * @file src/screens/main/components/NextWorkoutCard.tsx
 * @description כרטיס האימון הבא עם פרטי האימון המומלץ
 */

import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface NextWorkoutCardProps {
  dayNumber: number;
  workoutName: string;
  estimatedDuration: number;
  exerciseCount: number;
  onPress: () => void;
  isLoading?: boolean;
}

export const NextWorkoutCard: React.FC<NextWorkoutCardProps> = ({
  dayNumber,
  workoutName,
  estimatedDuration,
  exerciseCount,
  onPress,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["#4CAF50", "#45a049"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayText}>יום {dayNumber}</Text>
            </View>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#fff"
              style={styles.arrow}
            />
          </View>

          <Text style={styles.workoutName} numberOfLines={2}>
            {workoutName}
          </Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#fff"
              />
              <Text style={styles.statText}>{estimatedDuration} דק'</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="dumbbell" size={16} color="#fff" />
              <Text style={styles.statText}>{exerciseCount} תרגילים</Text>
            </View>
          </View>

          <Text style={styles.startText}>
            {isLoading ? "טוען..." : "התחל אימון"}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    padding: 20,
  },
  content: {
    alignItems: "flex-end",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  arrow: {
    opacity: 0.8,
  },
  workoutName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 16,
    lineHeight: 28,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  statText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.9,
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    overflow: "hidden",
  },
});
