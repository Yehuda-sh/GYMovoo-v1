/**
 * @file src/screens/workout/components/WorkoutDashboard.tsx
 * @description דשבורד עם סטטיסטיקות חיות של האימון
 * English: Dashboard with live workout statistics
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface DashboardStat {
  label: string;
  value: string | number;
  icon: string;
  iconFamily: "material" | "font5";
  color?: string;
  trend?: "up" | "down" | "neutral";
  isHighlight?: boolean;
}

interface WorkoutDashboardProps {
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  pace: number; // סטים לדקה
  personalRecords: number;
  onStatPress?: (stat: string) => void;
}

export const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({
  totalVolume,
  completedSets,
  totalSets,
  pace,
  personalRecords,
  onStatPress,
}) => {
  const scaleAnims = useRef<Animated.Value[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // אתחול אנימציות
  // Initialize animations
  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      scaleAnims.current[i] = new Animated.Value(0);
    }

    // אנימציית כניסה
    // Entry animation
    const animations = scaleAnims.current.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();

    // אנימציית פעימה לשיאים
    // Pulse animation for PRs
    if (personalRecords > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [personalRecords]);

  // הכנת נתוני הסטטיסטיקות
  // Prepare stats data
  const stats: DashboardStat[] = [
    {
      label: "נפח כולל",
      value: `${totalVolume.toLocaleString()} ק"ג`,
      icon: "weight",
      iconFamily: "font5",
      color: theme.colors.primary,
    },
    {
      label: "סטים",
      value: `${completedSets}/${totalSets}`,
      icon: "format-list-checks",
      iconFamily: "material",
      color: theme.colors.accent,
    },
    {
      label: "קצב",
      value: pace.toFixed(1),
      icon: "speedometer",
      iconFamily: "material",
      color: theme.colors.warning,
      trend: pace > 0.5 ? "up" : "down",
    },
    {
      label: "שיאים",
      value: personalRecords,
      icon: "trophy",
      iconFamily: "font5",
      color: theme.colors.success,
      isHighlight: personalRecords > 0,
    },
  ];

  // רכיב סטטיסטיקה בודדת
  // Single stat component
  const StatCard = ({
    stat,
    index,
  }: {
    stat: DashboardStat;
    index: number;
  }) => {
    const isHighlight = stat.isHighlight;
    const animatedScale = isHighlight
      ? pulseAnim
      : scaleAnims.current[index] || new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.statCard,
          { transform: [{ scale: animatedScale }] },
          isHighlight && styles.highlightCard,
        ]}
      >
        <TouchableOpacity
          onPress={() => onStatPress?.(stat.label)}
          activeOpacity={0.7}
        >
          {isHighlight ? (
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart,
                theme.colors.primaryGradientEnd,
              ]}
              style={styles.gradientCard}
            >
              <StatContent stat={stat} />
            </LinearGradient>
          ) : (
            <StatContent stat={stat} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // תוכן הסטטיסטיקה
  // Stat content
  const StatContent = ({ stat }: { stat: DashboardStat }) => (
    <>
      <View style={styles.iconContainer}>
        {stat.iconFamily === "material" ? (
          <MaterialCommunityIcons
            name={stat.icon as any}
            size={24}
            color={stat.isHighlight ? "#fff" : stat.color}
          />
        ) : (
          <FontAwesome5
            name={stat.icon}
            size={20}
            color={stat.isHighlight ? "#fff" : stat.color}
          />
        )}
        {stat.trend && (
          <View style={styles.trendIndicator}>
            <MaterialCommunityIcons
              name={stat.trend === "up" ? "trending-up" : "trending-down"}
              size={16}
              color={
                stat.trend === "up" ? theme.colors.success : theme.colors.error
              }
            />
          </View>
        )}
      </View>
      <Text
        style={[styles.statValue, stat.isHighlight && styles.highlightText]}
      >
        {stat.value}
      </Text>
      <Text
        style={[styles.statLabel, stat.isHighlight && styles.highlightText]}
      >
        {stat.label}
      </Text>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </View>

      {/* פס התקדמות כללי */}
      {/* Overall progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={[
              styles.progressFill,
              { width: `${(completedSets / totalSets) * 100}%` },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((completedSets / totalSets) * 100)}% הושלם
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  highlightCard: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  gradientCard: {
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 8,
  },
  trendIndicator: {
    position: "absolute",
    top: -4,
    right: -8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  highlightText: {
    color: "#fff",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
