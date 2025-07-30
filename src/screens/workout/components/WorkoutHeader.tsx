/**
 * @file src/screens/workout/components/WorkoutHeader.tsx
 * @brief הדר אימון קומפקטי ומשופר עם אפשרויות עיצוב
 * @dependencies Ionicons, useNavigation, theme
 * @notes תומך במספר סגנונות ושילוב עם WorkoutDashboard
 */
// cspell:ignore אימון, עריכת, תפריט, חזרה

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import BackButton from "../../../components/common/BackButton";

interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: string;
  onTimerPress: () => void;
  onNamePress: () => void;
  onMenuPress?: () => void;
  variant?: "default" | "minimal" | "gradient" | "integrated";
  // Props לסגנון integrated
  // Props for integrated style
  completedSets?: number;
  totalSets?: number;
  totalVolume?: number;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutName,
  elapsedTime,
  onTimerPress,
  onNamePress,
  onMenuPress,
  variant = "default",
  completedSets = 0,
  totalSets = 0,
  totalVolume = 0,
}) => {
  const navigation = useNavigation();
  const backIconName = I18nManager.isRTL ? "chevron-forward" : "chevron-back";
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // אנימציית דופק לטיימר
  // Pulse animation for timer
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  // סגנון מינימלי
  // Minimal style
  if (variant === "minimal") {
    return (
      <View style={styles.minimalContainer}>
        <BackButton absolute={false} variant="minimal" />

        <View style={styles.minimalCenter}>
          <TouchableOpacity onPress={onNamePress} activeOpacity={0.7}>
            <Text style={styles.minimalTitle}>{workoutName}</Text>
          </TouchableOpacity>
          <Text style={styles.minimalTimer}>{elapsedTime}</Text>
        </View>

        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.minimalButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // סגנון גרדיאנט
  // Gradient style
  if (variant === "gradient") {
    return (
      <LinearGradient
        colors={[theme.colors.primary + "15", theme.colors.background]}
        style={styles.gradientContainer}
      >
        <View style={styles.gradientContent}>
          <BackButton absolute={false} variant="large" />

          <View style={styles.gradientCenter}>
            <TouchableOpacity
              onPress={onNamePress}
              style={styles.gradientNameContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.gradientName}>{workoutName}</Text>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.gradientTimerContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <MaterialCommunityIcons
                name="timer"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.gradientTimer}>{elapsedTime}</Text>
            </Animated.View>
          </View>

          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.gradientButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // סגנון משולב עם סטטיסטיקות
  // Integrated style with stats
  if (variant === "integrated") {
    const completionPercentage =
      totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return (
      <View style={styles.integratedContainer}>
        {/* שורה עליונה */}
        {/* Top row */}
        <View style={styles.integratedTop}>
          <BackButton absolute={false} variant="large" />

          <TouchableOpacity
            onPress={onNamePress}
            style={styles.integratedNameContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.integratedName}>{workoutName}</Text>
            <Ionicons
              name="create-outline"
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={26}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* שורת סטטיסטיקות */}
        {/* Stats row */}
        <TouchableOpacity
          onPress={onTimerPress}
          style={styles.integratedStats}
          activeOpacity={0.7}
        >
          <View style={styles.integratedStatItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.integratedStatText}>{elapsedTime}</Text>
          </View>

          <View style={styles.integratedDivider} />

          <View style={styles.integratedStatItem}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={16}
              color={theme.colors.success}
            />
            <Text style={styles.integratedStatText}>
              {completedSets}/{totalSets}
            </Text>
          </View>

          <View style={styles.integratedDivider} />

          <View style={styles.integratedStatItem}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={16}
              color={theme.colors.warning}
            />
            <Text style={styles.integratedStatText}>
              {Math.round(totalVolume)} ק"ג
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={theme.colors.textSecondary}
            style={{ marginStart: theme.spacing.xs }} // שינוי RTL: marginStart במקום marginLeft
          />
        </TouchableOpacity>

        {/* Progress bar */}
        <View style={styles.integratedProgress}>
          <View
            style={[
              styles.integratedProgressFill,
              { width: `${completionPercentage}%` },
            ]}
          />
        </View>
      </View>
    );
  }

  // ברירת מחדל - הסגנון המקורי משופר
  // Default - improved original style
  return (
    <View style={styles.container}>
      {/* כפתור תפריט - בצד ימין */}
      {/* Menu button - right side */}
      <TouchableOpacity
        onPress={onMenuPress || (() => {})}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={28}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {/* תוכן מרכזי */}
      {/* Center content */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={onNamePress}
          style={styles.nameContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.workoutName} numberOfLines={1}>
            {workoutName}
          </Text>
          <Ionicons
            name="pencil"
            size={14}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTimerPress}
          style={styles.timerContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.timerText}>{elapsedTime}</Text>
          <Ionicons
            name="timer-outline"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* כפתור חזרה - בצד שמאל */}
      {/* Back button - left side */}
      <BackButton absolute={false} variant="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  // סגנון מקורי
  // Original style
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  centerContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  nameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  workoutName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
  },
  timerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
  },
  timerText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },

  // סגנון מינימלי
  // Minimal style
  minimalContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  minimalButton: {
    padding: theme.spacing.xs,
  },
  minimalCenter: {
    flex: 1,
    alignItems: "center",
  },
  minimalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  minimalTimer: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },

  // סגנון גרדיאנט
  // Gradient style
  gradientContainer: {
    paddingTop: 50,
    paddingBottom: theme.spacing.md,
  },
  gradientContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  gradientButton: {
    padding: theme.spacing.xs,
  },
  gradientCenter: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  gradientNameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  gradientName: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  gradientTimerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    ...theme.shadows.small,
  },
  gradientTimer: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
    fontVariant: ["tabular-nums"],
  },

  // סגנון משולב
  // Integrated style
  integratedContainer: {
    backgroundColor: theme.colors.background,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  integratedTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  integratedNameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    flex: 1,
    justifyContent: "center",
  },
  integratedName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  integratedStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  integratedStatItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  integratedStatText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  integratedDivider: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.border,
  },
  integratedProgress: {
    height: 3,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  integratedProgressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
});
