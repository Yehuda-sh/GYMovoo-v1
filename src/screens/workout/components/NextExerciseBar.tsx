/**
 * @file src/screens/workout/components/NextExerciseBar.tsx
 * @description רכיב המציג את התרגיל הבא בתור עם אנימציות והמלצות
 * English: Component showing next exercise with animations and recommendations
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import { Exercise } from "../types/workout.types";

interface NextExerciseBarProps {
  nextExercise: Exercise | null;
  onSkipToNext?: () => void;
  onPrepare?: () => void;
}

export const NextExerciseBar: React.FC<NextExerciseBarProps> = ({
  nextExercise,
  onSkipToNext,
  onPrepare,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (nextExercise) {
      // אנימציית כניסה
      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // אנימציית דופק
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
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
    } else {
      // אנימציית יציאה
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [nextExercise]);

  if (!nextExercise) return null;

  // חישוב המלצת משקל לתרגיל הבא
  // Calculate weight recommendation for next exercise
  const getWeightRecommendation = () => {
    // לוגיקה פשוטה לדוגמה
    const lastWeight = 50; // בפועל יילקח מההיסטוריה
    return `${lastWeight} ק"ג (פעם קודמת)`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[theme.colors.card, theme.colors.background]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.content}>
          {/* כותרת */}
          {/* Title */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons
                name="arrow-down-bold"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.title}>הבא בתור</Text>
            </View>
            {onSkipToNext && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={onSkipToNext}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.skipText}>דלג</Text>
                <MaterialCommunityIcons
                  name="chevron-double-down"
                  size={16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* פרטי תרגיל */}
          {/* Exercise details */}
          <View style={styles.exerciseInfo}>
            <Animated.View
              style={[
                styles.exerciseNameContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.exerciseName}>{nextExercise.name}</Text>
            </Animated.View>

            <View style={styles.detailsRow}>
              {/* סטים */}
              {/* Sets */}
              <View style={styles.detail}>
                <MaterialCommunityIcons
                  name="format-list-checks"
                  size={16}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {nextExercise.sets.length} סטים
                </Text>
              </View>

              {/* המלצת משקל */}
              {/* Weight recommendation */}
              <View style={styles.detail}>
                <MaterialCommunityIcons
                  name="weight-kilogram"
                  size={16}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {getWeightRecommendation()}
                </Text>
              </View>
            </View>

            {/* שרירים */}
            {/* Muscles */}
            {nextExercise.primaryMuscles && (
              <View style={styles.musclesRow}>
                {nextExercise.primaryMuscles.map((muscle, index) => (
                  <View key={index} style={styles.muscleTag}>
                    <Text style={styles.muscleText}>{muscle}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* כפתור הכנה */}
          {/* Prepare button */}
          {onPrepare && (
            <TouchableOpacity
              style={styles.prepareButton}
              onPress={onPrepare}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  theme.colors.primaryGradientStart,
                  theme.colors.primaryGradientEnd,
                ]}
                style={styles.prepareGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={20}
                  color={theme.colors.text}
                />
                <Text style={styles.prepareText}>התכונן לתרגיל</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* אינדיקטור זמן מנוחה מומלץ */}
        {/* Recommended rest time indicator */}
        <View style={styles.restRecommendation}>
          <MaterialCommunityIcons
            name="timer-sand"
            size={14}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.restText}>מנוחה מומלצת: 90 שניות</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    ...theme.shadows.large,
  },
  gradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
  },
  skipText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    marginRight: 4,
  },
  exerciseInfo: {
    marginBottom: 12,
  },
  exerciseNameContainer: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  musclesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  muscleTag: {
    backgroundColor: theme.colors.primaryGradientStart + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  muscleText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  prepareButton: {
    marginBottom: 8,
  },
  prepareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  prepareText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginLeft: 8,
  },
  restRecommendation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    marginTop: 8,
  },
  restText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});
