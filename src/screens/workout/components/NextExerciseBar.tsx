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
import { triggerVibration } from "../../../utils/workoutHelpers";
import type { NextExerciseBarProps } from "./types";

interface ExtraProps {
  reducedMotion?: boolean;
  testID?: string;
  haptic?: boolean; // enable/disable vibration
}

export const NextExerciseBar: React.FC<NextExerciseBarProps & ExtraProps> = ({
  nextExercise,
  onSkipToNext,
  variant = "gradient", // ברירת מחדל מהתכונות הפופולריות ביותר | Most popular variant as default
  reducedMotion = false,
  testID = "NextExerciseBar",
  haptic = true,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // אנימציית כניסה/יציאה | Entry/exit animation
    Animated.spring(slideAnim, {
      toValue: nextExercise ? 0 : 100,
      friction: 10,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // אנימציית פעימה (מכובה ב-reducedMotion) | Pulse animation (disabled when reducedMotion)
    if (nextExercise && onSkipToNext && !reducedMotion) {
      pulseAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 950,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 950,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimationRef.current.start();
    } else {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
      pulseAnim.setValue(1);
    }

    return () => {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
    };
  }, [nextExercise, onSkipToNext, slideAnim, pulseAnim, reducedMotion]);

  // בדיקת תקינות נתונים | Data validation
  if (!nextExercise || !nextExercise.name) {
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
        testID={testID + "-gradient"}
        accessibilityRole="summary"
        accessibilityLabel={`התרגיל הבא: ${nextExercise.name}`}
      >
        <LinearGradient
          colors={[
            theme.colors.primary + "25", // שקיפות יותר בולטת | More prominent transparency
            theme.colors.primaryGradientEnd + "25",
            theme.colors.card + "F0", // רקע כמעט אטום | Almost opaque background
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} // זווית אלכסונית | Diagonal angle
          style={styles.gradientBackground}
        >
          <View style={styles.contentGradient}>
            <View style={styles.labelContainerGradient}>
              <MaterialCommunityIcons
                name="flash" // אייקון יותר בולט | More prominent icon
                size={22} // גדול יותר | Larger
                color={theme.colors.warning}
              />
              <Text style={styles.labelGradient}>הבא בתור</Text>
            </View>

            <Text style={styles.exerciseNameGradient} numberOfLines={2}>
              {nextExercise.name}
            </Text>

            {onSkipToNext && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={styles.skipButtonGradient}
                  onPress={() => {
                    if (haptic) triggerVibration(50); // רטט קצר | Short vibration
                    onSkipToNext?.();
                  }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="עבור לתרגיל הבא"
                >
                  <LinearGradient
                    colors={[
                      theme.colors.primary,
                      theme.colors.primaryGradientEnd,
                      theme.colors.primaryDark || theme.colors.primary, // צבע שלישי | Third color
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} // זווית אלכסונית | Diagonal angle
                    style={styles.skipButtonGradientInner}
                  >
                    <MaterialCommunityIcons
                      name="play-circle" // אייקון יותר ברור | Clearer icon
                      size={24} // גדול יותר | Larger
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
        testID={testID + "-minimal"}
        accessibilityRole="summary"
        accessibilityLabel={`התרגיל הבא: ${nextExercise.name}`}
      >
        <View style={styles.contentMinimal}>
          <Text style={styles.exerciseNameMinimal}>{nextExercise.name} ←</Text>
          {onSkipToNext && (
            <TouchableOpacity
              style={styles.skipButtonMinimal}
              onPress={onSkipToNext}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="דלג לתרגיל הבא"
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
        testID={testID + "-floating"}
        accessibilityRole="summary"
        accessibilityLabel={`התרגיל הבא: ${nextExercise.name}`}
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
              accessibilityRole="button"
              accessibilityLabel="עבור לתרגיל הבא"
            >
              <Text style={styles.floatingButtonText}>עבור לתרגיל ←</Text>
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
        testID={testID + "-pills"}
        accessibilityRole="summary"
        accessibilityLabel={`התרגיל הבא: ${nextExercise.name}`}
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
              accessibilityRole="button"
              accessibilityLabel="דלג לתרגיל הבא"
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
      testID={testID + "-default"}
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
    marginStart: 8, // שינוי RTL: marginStart במקום marginLeft
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
    zIndex: 100, // וודא שמעל רכיבים אחרים | Ensure above other components
  },
  gradientBackground: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 2, // גבול עבה יותר | Thicker border
    borderColor: theme.colors.primary + "50", // שקוף יותר | More transparent
    borderBottomWidth: 0,
    ...theme.shadows.large,
    elevation: 8, // צל בולט יותר באנדרואיד | More prominent shadow on Android
  },
  contentGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18, // ריווח גדול יותר | More padding
    paddingHorizontal: 24,
  },
  labelContainerGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8, // רווח גדול יותר | More gap
  },
  labelGradient: {
    fontSize: 14, // גודל גדול יותר | Larger font
    color: theme.colors.primary, // צבע בולט יותר | More prominent color
    fontWeight: "600", // משקל גדול יותר | Heavier weight
  },
  exerciseNameGradient: {
    flex: 1,
    fontSize: 17, // קצת קטן יותר לאיזון | Slightly smaller for balance
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginHorizontal: 12,
  },
  skipButtonGradient: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderWidth: 2, // גבול לכפתור | Border for button
    borderColor: theme.colors.primary + "30",
    ...theme.shadows.medium, // צל לכפתור | Shadow for button
  },
  skipButtonGradientInner: {
    paddingHorizontal: 20, // רחב יותר | Wider
    paddingVertical: 12, // גבוה יותר | Taller
    alignItems: "center",
    minWidth: 60, // רוחב מינימלי | Minimum width
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
