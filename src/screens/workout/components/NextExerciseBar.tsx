// cspell:ignore גרדיאנט, מינימליסטי, כדורים, דמבל, מוטיבציה/**
/* @file src/screens/workout/components/NextExerciseBar.tsx
 * @description רכיב קומפקטי המציג את התרגיל הבא - גרסאות עיצוב שונות
 * English: Compact component displaying the next exercise - different design versions
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
  variant?: "default" | "gradient" | "minimal" | "floating" | "pills";
}

export const NextExerciseBar: React.FC<NextExerciseBarProps> = ({
  nextExercise,
  onSkipToNext,
  variant = "gradient", // שנה את זה לסגנון הרצוי
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: nextExercise ? 0 : 100,
      friction: 10,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // אנימציית פעימה לכפתור
    if (nextExercise) {
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
    }
  }, [nextExercise]);

  if (!nextExercise) {
    return null;
  }

  // סגנון 1: גרדיאנט מודרני
  // Style 1: Modern gradient
  if (variant === "gradient") {
    return (
      <Animated.View
        style={[
          styles.containerGradient,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LinearGradient
          colors={[
            theme.colors.primary + "15",
            theme.colors.primaryGradientEnd + "15",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.contentGradient}>
            <View style={styles.labelContainerGradient}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.labelGradient}>הבא בתור</Text>
            </View>

            <Text style={styles.exerciseNameGradient} numberOfLines={1}>
              {nextExercise.name}
            </Text>

            {onSkipToNext && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={styles.skipButtonGradient}
                  onPress={onSkipToNext}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[
                      theme.colors.primary,
                      theme.colors.primaryGradientEnd,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.skipButtonGradientInner}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left-bold"
                      size={20}
                      color="white"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }

  // סגנון 2: מינימליסטי
  // Style 2: Minimalist
  if (variant === "minimal") {
    return (
      <Animated.View
        style={[
          styles.containerMinimal,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.contentMinimal}>
          <Text style={styles.exerciseNameMinimal}>{nextExercise.name} ←</Text>
          {onSkipToNext && (
            <TouchableOpacity
              style={styles.skipButtonMinimal}
              onPress={onSkipToNext}
              activeOpacity={0.7}
            >
              <Text style={styles.skipTextMinimal}>דלג</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  }

  // סגנון 3: צף במרכז
  // Style 3: Floating center
  if (variant === "floating") {
    return (
      <Animated.View
        style={[
          styles.containerFloating,
          {
            transform: [{ translateY: slideAnim }],
            opacity: slideAnim.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <View style={styles.floatingCard}>
          <View style={styles.floatingHeader}>
            <MaterialCommunityIcons
              name="target"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.floatingLabel}>התרגיל הבא</Text>
          </View>
          <Text style={styles.floatingExerciseName}>{nextExercise.name}</Text>
          {onSkipToNext && (
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={onSkipToNext}
              activeOpacity={0.7}
            >
              <Text style={styles.floatingButtonText}>← עבור לתרגיל</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  }

  // סגנון 4: כדורים (Pills)
  // Style 4: Pills
  if (variant === "pills") {
    return (
      <Animated.View
        style={[
          styles.containerPills,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.contentPills}>
          <View style={styles.pillsLeft}>
            <View style={styles.pill}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.pillText}>{nextExercise.name}</Text>
            </View>
          </View>

          {onSkipToNext && (
            <TouchableOpacity
              style={styles.pillButton}
              onPress={onSkipToNext}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="skip-next"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  }

  // ברירת מחדל - הסגנון המקורי
  // Default - original style
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
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkipToNext}
            activeOpacity={0.7}
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

const styles = StyleSheet.create({
  // סגנון מקורי
  // Original style
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
    marginLeft: 8,
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

  // סגנון גרדיאנט
  // Gradient style
  containerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  gradientBackground: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
    borderBottomWidth: 0,
    ...theme.shadows.large,
  },
  contentGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  labelContainerGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  labelGradient: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  exerciseNameGradient: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginHorizontal: 16,
  },
  skipButtonGradient: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  skipButtonGradientInner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },

  // סגנון מינימליסטי
  // Minimalist style
  containerMinimal: {
    position: "absolute",
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  contentMinimal: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
  },
  exerciseNameMinimal: {
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
  },
  skipButtonMinimal: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  skipTextMinimal: {
    fontSize: 14,
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },

  // סגנון צף
  // Floating style
  containerFloating: {
    position: "absolute",
    bottom: 80,
    left: 40,
    right: 40,
  },
  floatingCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  floatingHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  floatingLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  floatingExerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  floatingButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  floatingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // סגנון Pills
  // Pills style
  containerPills: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  contentPills: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pillsLeft: {
    flex: 1,
  },
  pill: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  pillText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  pillButton: {
    backgroundColor: theme.colors.card,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
});
