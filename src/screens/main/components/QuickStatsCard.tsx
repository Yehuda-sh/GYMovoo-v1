/**
 * @file src/screens/main/components/QuickStatsCard.tsx
 * @description כרטיס סטטיסטיקות מהיר של האימון האחרון
 */

import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface QuickStatsCardProps {
  totalExercises: number;
  totalReps: number;
  totalVolume: number;
  personalRecords: number;
  workoutName?: string;
  onPress?: () => void;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  totalExercises,
  totalReps,
  totalVolume,
  personalRecords,
  workoutName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>האימון האחרון</Text>
          {workoutName && <Text style={styles.workoutName}>{workoutName}</Text>}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="dumbbell" size={20} color="#fff" />
            <Text style={styles.statValue}>{totalExercises}</Text>
            <Text style={styles.statLabel}>תרגילים</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="repeat" size={20} color="#fff" />
            <Text style={styles.statValue}>{totalReps}</Text>
            <Text style={styles.statLabel}>חזרות</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={20}
              color="#fff"
            />
            <Text style={styles.statValue}>{totalVolume.toFixed(0)}</Text>
            <Text style={styles.statLabel}>ק"ג כולל</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="trophy" size={20} color="#fff" />
            <Text style={styles.statValue}>{personalRecords}</Text>
            <Text style={styles.statLabel}>שיאים</Text>
          </View>
        </View>

        {onPress && (
          <View style={styles.footer}>
            <Text style={styles.viewMore}>לחץ לפרטים נוספים</Text>
            <MaterialCommunityIcons name="arrow-left" size={16} color="#fff" />
          </View>
        )}
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
  header: {
    marginBottom: 16,
    alignItems: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  workoutName: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "right",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  viewMore: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginEnd: 8,
  },
});
