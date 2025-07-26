/**
 * @file src/screens/workout/components/WorkoutDashboard.tsx
 * @brief דשבורד קומפקטי ואופקי עם סטטיסטיקות חיות של האימון
 * @dependencies MaterialCommunityIcons, FontAwesome5, theme
 * @notes משולב עם טיימר אימון וסגנונות שונים
 */
// cspell:ignore נפח, סטים, קצב, שיאים

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";

interface DashboardStatProps {
  label: string;
  value: string | number;
  icon:
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof FontAwesome5>["name"];
  iconFamily: "material" | "font5";
  color?: string;
  animate?: boolean;
}

interface WorkoutDashboardProps {
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  pace: number;
  personalRecords: number;
  elapsedTime?: string; // הוספת זמן אימון
  // English: Added workout time
  variant?: "default" | "compact" | "bar" | "floating";
}

// קומפוננטת סטטיסטיקה בודדת
// Single stat component
const StatItem: React.FC<DashboardStatProps> = ({
  label,
  value,
  icon,
  iconFamily,
  color = theme.colors.primary,
  animate = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [value, animate]);

  return (
    <Animated.View
      style={[
        styles.statItem,
        animate && { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {iconFamily === "material" ? (
        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
      ) : (
        <FontAwesome5 name={icon as any} size={20} color={color} />
      )}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

export const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({
  totalVolume,
  completedSets,
  totalSets,
  pace,
  personalRecords,
  elapsedTime,
  variant = "default",
}) => {
  // חישוב אחוז השלמה
  // Calculate completion percentage
  const completionPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const stats: DashboardStatProps[] = [
    {
      label: "נפח",
      value: `${Math.round(totalVolume)} ק"ג`,
      icon: "weight-hanging",
      iconFamily: "font5",
      color: theme.colors.primary,
    },
    {
      label: "סטים",
      value: `${completedSets}/${totalSets}`,
      icon: "format-list-checks",
      iconFamily: "material",
      color: theme.colors.success,
      animate: true,
    },
    {
      label: "קצב",
      value: pace.toFixed(1),
      icon: "speedometer",
      iconFamily: "material",
      color: theme.colors.warning,
    },
    {
      label: "שיאים",
      value: personalRecords,
      icon: "trophy",
      iconFamily: "material",
      color: theme.colors.secondary,
      animate: personalRecords > 0,
    },
  ];

  // אם יש זמן אימון, הוסף אותו
  // If there's elapsed time, add it
  if (elapsedTime) {
    stats.unshift({
      label: "זמן",
      value: elapsedTime,
      icon: "clock-outline",
      iconFamily: "material",
      color: theme.colors.text,
    });
  }

  // סגנון בר דק (כמו NextExerciseBar)
  // Thin bar style (like NextExerciseBar)
  if (variant === "bar") {
    return (
      <View style={styles.barContainer}>
        <LinearGradient
          colors={[theme.colors.card, theme.colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.barGradient}
        >
          <View style={styles.barContent}>
            {elapsedTime && (
              <View style={styles.barTimer}>
                <MaterialCommunityIcons
                  name="timer"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.barTimerText}>{elapsedTime}</Text>
              </View>
            )}

            <View style={styles.barStats}>
              <Text style={styles.barStatText}>
                {completedSets}/{totalSets} סטים
              </Text>
              <Text style={styles.barSeparator}>•</Text>
              <Text style={styles.barStatText}>
                {Math.round(totalVolume)} ק"ג
              </Text>
              {personalRecords > 0 && (
                <>
                  <Text style={styles.barSeparator}>•</Text>
                  <MaterialCommunityIcons
                    name="trophy"
                    size={14}
                    color={theme.colors.warning}
                  />
                  <Text
                    style={[
                      styles.barStatText,
                      { color: theme.colors.warning },
                    ]}
                  >
                    {personalRecords}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.barProgress}>
              <View
                style={[
                  styles.barProgressFill,
                  { width: `${completionPercentage}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // סגנון קומפקטי
  // Compact style
  if (variant === "compact") {
    return (
      <View style={styles.compactContainer}>
        {stats.slice(0, 3).map((stat, index) => (
          <React.Fragment key={stat.label}>
            {index > 0 && <View style={styles.compactDivider} />}
            <View style={styles.compactStat}>
              {stat.iconFamily === "material" ? (
                <MaterialCommunityIcons
                  name={stat.icon as any}
                  size={16}
                  color={stat.color}
                />
              ) : (
                <FontAwesome5
                  name={stat.icon as any}
                  size={14}
                  color={stat.color}
                />
              )}
              <Text style={styles.compactValue}>{stat.value}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    );
  }

  // סגנון צף
  // Floating style
  if (variant === "floating") {
    return (
      <View style={styles.floatingContainer}>
        <LinearGradient
          colors={[
            theme.colors.primary + "20",
            theme.colors.primaryGradientEnd + "10",
          ]}
          style={styles.floatingGradient}
        >
          <View style={styles.floatingContent}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={styles.floatingStat}>
                {stat.iconFamily === "material" ? (
                  <MaterialCommunityIcons
                    name={stat.icon as any}
                    size={20}
                    color={stat.color}
                  />
                ) : (
                  <FontAwesome5
                    name={stat.icon as any}
                    size={16}
                    color={stat.color}
                  />
                )}
                <View>
                  <Text style={styles.floatingValue}>{stat.value}</Text>
                  <Text style={styles.floatingLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  }

  // ברירת מחדל - סגנון מקורי משופר
  // Default - improved original style
  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // סגנון מקורי
  // Original style
  container: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statItem: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  // סגנון בר
  // Bar style
  barContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  barGradient: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  barContent: {
    gap: theme.spacing.xs,
  },
  barTimer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  barTimerText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  barStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  barStatText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  barSeparator: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  barProgress: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginTop: theme.spacing.xs,
    overflow: "hidden",
  },
  barProgressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },

  // סגנון קומפקטי
  // Compact style
  compactContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.small,
  },
  compactStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  compactValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  compactDivider: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.border,
  },

  // סגנון צף
  // Floating style
  floatingContainer: {
    position: "absolute",
    top: 100,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 10,
  },
  floatingGradient: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.large,
  },
  floatingContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  floatingStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  floatingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  floatingLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
