/**
 * @file src/screens/workout/components/NextExerciseBar.tsx
 * @description Compact component displaying the next exercise in workout flow
 *
 * Features:
 * - Clean next exercise display with skip functionality
 * - RTL support and accessibility compliance
 * - Simple slide animation for smooth transitions
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
import { theme } from "../../../styles/theme";
import type { NextExerciseBarProps } from "./types";

export const NextExerciseBar: React.FC<NextExerciseBarProps> = ({
  nextExercise,
  onSkipToNext,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: nextExercise ? 0 : 100,
      friction: 10,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [nextExercise, slideAnim]);

  if (!nextExercise?.name) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      accessibilityRole="summary"
      accessibilityLabel={`התרגיל הבא: ${nextExercise.name}`}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>הבא בתור:</Text>
          <Text style={styles.exerciseName} numberOfLines={2}>
            {nextExercise.name}
          </Text>
        </View>
        {onSkipToNext && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkipToNext}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="דלג לתרגיל הבא"
          >
            <MaterialCommunityIcons
              name="play-speed"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.skipText}>דלג</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

NextExerciseBar.displayName = "NextExerciseBar";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    ...theme.shadows.medium,
    paddingBottom: 20,
  },
  content: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginStart: 8,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  skipButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 16,
    gap: 6,
  },
  skipText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
