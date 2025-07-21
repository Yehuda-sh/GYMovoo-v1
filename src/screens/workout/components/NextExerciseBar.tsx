/**
 * @file src/screens/workout/components/NextExerciseBar.tsx
 * @description רכיב קומפקטי המציג את התרגיל הבא
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
import { Exercise } from "../types/workout.types";

interface NextExerciseBarProps {
  nextExercise: Exercise | null;
  onSkipToNext?: () => void;
}

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
  }, [nextExercise]);

  if (!nextExercise) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>הבא בתור:</Text>
          <Text style={styles.exerciseName} numberOfLines={1}>
            {nextExercise.name}
          </Text>
        </View>
        {onSkipToNext && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkipToNext}>
            <Text style={styles.skipText}>דלג</Text>
            <MaterialCommunityIcons
              name="play-speed"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

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
    paddingBottom: 20, // Safe area for home indicator
  },
  content: {
    flexDirection: "row-reverse", // שינוי RTL: הפך את כיוון הפריסה
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
    marginRight: 8, // הוספת מרווח מהכפתור
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
