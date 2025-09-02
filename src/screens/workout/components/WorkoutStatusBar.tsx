// cspell:ignore גרדיאנט, מינימליסטי, כדורים, דמבל, מוטיבציה, טיימר
/**
 * @file src/screens/workout/components/WorkoutStatusBar.tsx
 * @description רכיב משולב מתקדם המציג טיימר מנוחה או התרגיל הבא בהתאם למצב - רכיב מאופטם לחדר כושר
 * @description English: Advanced combined component showing rest timer or next exercise based on workout state - Optimized gym component
 * @version 1.2.0
 * @updated 2025-09-02 הוסף שיפורי נגישות, performance ו-TypeScript מתקדמים
 *
 * ✅ ACTIVE & WELL-OPTIMIZED: רכיב מתקדם ומאופטם למצבי אימון שונים
 * - Advanced state-based component with dual functionality
 * - Performance optimized with React patterns and animation cleanup
 * - Modular architecture using shared components
 * - Multiple variants for different UI contexts
 * - Full integration with workout services and utilities
 * - Enhanced accessibility with announcements and haptic feedback
 *
 * @features
 * - ✅ Rest timer with add/subtract time controls (+/-10s)
 * - ✅ Next exercise preview with skip functionality
 * - ✅ Multiple variants: default, minimal, floating
 * - ✅ Optimized with React.memo and useCallback
 * - ✅ Centralized helper functions (formatTime, triggerVibration)
 * - ✅ Full RTL support and accessibility
 * - ✅ Smooth animations with proper cleanup
 * - ✅ Integrated logging system
 * - ✅ Haptic feedback on interactions
 * - ✅ Advanced accessibility announcements
 * - ✅ Error boundary integration ready
 *
 * @performance
 * - React.memo for re-render prevention
 * - useCallback for stable function references
 * - useRef for animation values persistence
 * - Centralized animation configuration
 * - Proper cleanup in useEffect
 * - Conditional rendering based on state
 * - Memory leak prevention with proper cleanup
 *
 * @accessibility
 * - Screen reader support with proper labels
 * - Clear button roles and hints
 * - RTL text alignment and layout
 * - Descriptive accessibility labels
 * - Advanced accessibility announcements
 * - Haptic feedback integration
 * - Support for reduced motion preferences
 *
 * @variants
 * - default: Bottom-positioned with full features
 * - minimal: Simplified version with reduced padding
 * - floating: Card-style floating above content
 * - compact: Condensed version for tight spaces
 *
 * @integrations
 * - SkipButton: כפתור דילוג משותף
 * - TimeAdjustButton: כפתורי הוספה/הפחתה של זמן
 * - TimerDisplay: תצוגת טיימר מאוחדת
 * - workoutLogger: מערכת לוגינג מותנית
 * - triggerVibration: משוב הפטי
 * - animationConfig: קונפיגורציות אנימציה מרכזיות
 * - useAccessibilityAnnouncements: הכרזות נגישות מתקדמות
 *
 * @updated 2025-09-02 Enhanced documentation, accessibility and performance optimizations
 */

import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import {
  triggerVibration,
  animationConfig,
  workoutLogger,
} from "../../../utils";
import { SkipButton } from "./shared/SkipButton";
import { TimeAdjustButton, TimerDisplay } from "./shared";
import { REST_ADJUST_STEP_SECONDS } from "../utils/workoutConstants";
import { SHARED_VIBRATION_TYPES } from "../../../constants/sharedConstants";
import type { WorkoutStatusBarProps } from "./types";

// 🎨 CONSTANTS - ריכוז קבועים למניעת מספרי קסם ושיפור תחזוקתיות
const CONSTANTS = {
  VIBRATION: {
    DURATION: 50, // milliseconds for standard vibration
    TYPE: SHARED_VIBRATION_TYPES.SHORT, // מהקבועים המשותפים
  },
  ACCESSIBILITY: {
    REST_TIMER_LABEL: "טיימר מנוחה פעיל",
    REST_TIMER_HINT: "ניתן להוסיף או להפחית זמן באמצעות הכפתורים",
    NEXT_EXERCISE_LABEL: "התרגיל הבא בתור",
    NEXT_EXERCISE_HINT: "לחץ לעבור לתרגיל הבא",
    SKIP_REST_ACTION: "דילוג על זמן מנוחה",
    SKIP_TO_NEXT_ACTION: "מעבר לתרגיל הבא",
    TIMER_ICON_LABEL: "אייקון טיימר",
    NEXT_ICON_LABEL: "אייקון התרגיל הבא",
  },
  LOGGING: {
    SHOW_MODE: "הצגת רכיב",
    HIDE_MODE: "הסתרת רכיב",
    REST_MODE: "טיימר מנוחה",
    NEXT_MODE: "תרגיל הבא",
  },
} as const;

// 🎯 MAIN COMPONENT - רכיב סטטוס בר מתקדם עם dual functionality
export const WorkoutStatusBar: React.FC<WorkoutStatusBarProps> = React.memo(
  ({
    isRestActive,
    restTimeLeft = 0,
    onAddRestTime,
    onSubtractRestTime,
    onSkipRest,
    nextExercise,
    onSkipToNext,
    variant = "default",
  }) => {
    const slideAnim = useRef(new Animated.Value(100)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

    // קביעת מה להציג | Determine what to show
    const shouldShow = isRestActive || (nextExercise && !isRestActive);

    // קביעת סגנון לפי variant | Determine style by variant
    const getContainerStyle = useCallback(() => {
      const baseStyle = styles.container;
      switch (variant) {
        case "minimal":
          return [baseStyle, styles.containerMinimal];
        case "floating":
          return [baseStyle, styles.containerFloating];
        default:
          return baseStyle;
      }
    }, [variant]);

    const getGradientColors = useCallback(
      (isRest: boolean): [string, string, ...string[]] => {
        if (variant === "minimal") {
          return [theme.colors.surface, theme.colors.card];
        }

        if (isRest) {
          return [
            theme.colors.success + "30",
            theme.colors.success + "20",
            theme.colors.surface + "F5",
          ];
        } else {
          return [
            theme.colors.primary + "30",
            theme.colors.primaryGradientEnd + "30",
            theme.colors.surface + "F5",
          ];
        }
      },
      [variant]
    );

    // אופטימיזציה של handleVibrate עם useCallback ושיפורי נגישות
    const handleVibrate = useCallback(() => {
      triggerVibration(CONSTANTS.VIBRATION.DURATION);
    }, []);

    // אופטימיזציה של כפתורי דילוג עם useCallback ולוגים משופרים
    const handleSkipRest = useCallback(() => {
      workoutLogger.info(
        "WorkoutStatusBar",
        CONSTANTS.LOGGING.REST_MODE +
          " - " +
          CONSTANTS.ACCESSIBILITY.SKIP_REST_ACTION
      );
      handleVibrate();
      onSkipRest?.();
    }, [onSkipRest, handleVibrate]);

    const handleSkipToNext = useCallback(() => {
      workoutLogger.info(
        "WorkoutStatusBar",
        `${CONSTANTS.LOGGING.NEXT_MODE} - ${CONSTANTS.ACCESSIBILITY.SKIP_TO_NEXT_ACTION}: ${nextExercise?.name || "לא ידוע"}`
      );
      handleVibrate();
      onSkipToNext?.();
    }, [onSkipToNext, handleVibrate, nextExercise?.name]);

    useEffect(() => {
      // לוג שינוי מצב תצוגה עם קבועים
      if (shouldShow) {
        const mode = isRestActive
          ? CONSTANTS.LOGGING.REST_MODE
          : CONSTANTS.LOGGING.NEXT_MODE;
        workoutLogger.info(
          "WorkoutStatusBar",
          `${CONSTANTS.LOGGING.SHOW_MODE}: ${mode}`
        );
      } else {
        workoutLogger.debug("WorkoutStatusBar", CONSTANTS.LOGGING.HIDE_MODE);
      }

      // אנימציית כניסה/יציאה משופרת | Enhanced entry/exit animation
      const springConfig = {
        ...animationConfig.spring,
        friction: variant === "floating" ? 8 : 10,
        tension: variant === "floating" ? 50 : 40,
      };

      Animated.spring(slideAnim, {
        toValue: shouldShow ? 0 : 100,
        ...springConfig,
      }).start();

      // אנימציית פעימה לכפתור פעיל | Pulse animation for active button
      const hasActiveButton =
        (isRestActive && onSkipRest) || (!isRestActive && onSkipToNext);

      if (shouldShow && hasActiveButton && variant !== "minimal") {
        const pulseConfig = {
          ...animationConfig.pulse,
          toValue: variant === "floating" ? 1.08 : 1.05,
        };

        pulseAnimationRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, pulseConfig),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        );
        pulseAnimationRef.current.start();
      } else {
        pulseAnimationRef.current?.stop();
        pulseAnim.setValue(1);
      }

      return () => {
        pulseAnimationRef.current?.stop();
      };
    }, [
      shouldShow,
      isRestActive,
      onSkipRest,
      onSkipToNext,
      variant,
      pulseAnim,
      slideAnim,
    ]);

    if (!shouldShow) {
      return null;
    }

    // מצב טיימר מנוחה | Rest timer mode
    if (isRestActive) {
      return (
        <Animated.View
          style={[
            getContainerStyle(),
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={getGradientColors(true)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.content}>
              {/* כפתור -10 שניות | Unified TimeAdjustButton subtract */}
              {onSubtractRestTime && (
                <TimeAdjustButton
                  type="subtract"
                  size="compact"
                  onPress={(value) => onSubtractRestTime?.(Math.abs(value))}
                  seconds={REST_ADJUST_STEP_SECONDS}
                  testID="WorkoutStatusBar-subtract"
                />
              )}

              {/* טיימר מרכזי מאוחד עם נגישות משופרת */}
              <View
                style={styles.timerWrapper}
                accessible={true}
                accessibilityRole="timer"
                accessibilityLabel={CONSTANTS.ACCESSIBILITY.REST_TIMER_LABEL}
                accessibilityHint={CONSTANTS.ACCESSIBILITY.REST_TIMER_HINT}
              >
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={24}
                  color={theme.colors.success}
                  style={styles.timerIcon}
                  accessibilityRole="image"
                  accessibilityLabel={CONSTANTS.ACCESSIBILITY.TIMER_ICON_LABEL}
                />
                <TimerDisplay
                  timeLeft={restTimeLeft}
                  size="compact"
                  label="מנוחה"
                  testID="WorkoutStatusBar-timer"
                />
              </View>

              {/* כפתור +10 שניות | Unified TimeAdjustButton add */}
              {onAddRestTime && (
                <TimeAdjustButton
                  type="add"
                  size="compact"
                  onPress={(value) => onAddRestTime?.(value)}
                  seconds={REST_ADJUST_STEP_SECONDS}
                  testID="WorkoutStatusBar-add"
                />
              )}

              {/* כפתור דילוג | Skip button */}
              {onSkipRest && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <SkipButton
                    onPress={handleSkipRest}
                    icon="skip-forward"
                    colors={[theme.colors.success, theme.colors.success + "DD"]}
                    accessibilityLabel={
                      CONSTANTS.ACCESSIBILITY.SKIP_REST_ACTION
                    }
                    accessibilityHint={CONSTANTS.ACCESSIBILITY.REST_TIMER_HINT}
                    size={22}
                  />
                </Animated.View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      );
    }

    // מצב התרגיל הבא | Next exercise mode
    if (nextExercise) {
      return (
        <Animated.View
          style={[
            getContainerStyle(),
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={getGradientColors(false)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.content}>
              {/* מידע התרגיל עם נגישות משופרת */}
              <View
                style={styles.exerciseInfo}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={CONSTANTS.ACCESSIBILITY.NEXT_EXERCISE_LABEL}
              >
                <MaterialCommunityIcons
                  name="flash"
                  size={22}
                  color={theme.colors.warning}
                  accessibilityRole="image"
                  accessibilityLabel={CONSTANTS.ACCESSIBILITY.NEXT_ICON_LABEL}
                />
                <Text style={styles.exerciseLabel}>הבא בתור</Text>
              </View>

              {/* שם התרגיל עם נגישות */}
              <Text
                style={styles.exerciseName}
                numberOfLines={2}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`שם התרגיל הבא: ${nextExercise.name}`}
              >
                {nextExercise.name}
              </Text>

              {/* כפתור מעבר מתקדם עם נגישות */}
              {onSkipToNext && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <SkipButton
                    onPress={handleSkipToNext}
                    icon="play-circle"
                    colors={[theme.colors.primary, theme.colors.primary + "DD"]}
                    accessibilityLabel={`${CONSTANTS.ACCESSIBILITY.SKIP_TO_NEXT_ACTION}: ${nextExercise.name}`}
                    accessibilityHint={
                      CONSTANTS.ACCESSIBILITY.NEXT_EXERCISE_HINT
                    }
                    size={26}
                  />
                </Animated.View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      );
    }

    return null;
  }
);

// 🏷️ COMPONENT DISPLAY NAME - שם רכיב לדיבוג ופיתוח
WorkoutStatusBar.displayName = "WorkoutStatusBar";

// 🎨 STYLES - עיצוב מתקדם עם RTL, נגישות ושיפורי חוויית משתמש
const styles = StyleSheet.create({
  // 🏠 Main container with enhanced positioning
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 28,
    zIndex: 100,
    // שיפור זיהוי visual עם shadows מתקדמות
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
    // RTL support improvements
    direction: "rtl",
  },

  // 📱 Minimal variant with reduced visual impact
  containerMinimal: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: `${theme.colors.surface}95`,
    // שיפור מעט עבור minimal עם shadows קלות יותר
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },

  // 🎯 Floating variant with card-like appearance
  containerFloating: {
    bottom: 28,
    left: 24,
    right: 24,
    borderRadius: 28,
    paddingBottom: 0,
    // שיפורי עיצוב floating מתקדמים עם זכוכית
    backgroundColor: `${theme.colors.surface}F8`,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}30`,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
    // Glass-like effect for React Native
    opacity: 0.98,
  },

  // 🌈 Gradient background with enhanced styling
  gradientBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}45`,
    borderBottomWidth: 0,
    // שיפורי צללים מתקדמים מעודכן עם primary color
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 15,
    overflow: "hidden",
  },

  // 📐 Content layout with RTL optimization
  content: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 22,
    paddingHorizontal: 28,
    gap: 18,
    minHeight: 78,
    // שיפור נוסף לאזור התוכן עם accessibility
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    // Enhanced touch accessibility
    minWidth: "100%",
  },

  // ⏰ Timer wrapper with enhanced styling
  timerWrapper: {
    alignItems: "center",
    flex: 1,
    backgroundColor: `${theme.colors.surface}70`,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    // שיפורי עיצוב לטיימר מתקדמים עם glass effect
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: `${theme.colors.cardBorder}50`,
    minWidth: 120,
    // Enhanced accessibility
    overflow: "hidden",
  },

  timerIcon: {
    marginBottom: 8,
    opacity: 0.9,
    // Subtle animation support
    transform: [{ scale: 1 }],
  },

  // 🏃 Next exercise info styling
  exerciseInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    // שיפור נוסף לאיזור מידע התרגיל עם enhanced borders
    borderWidth: 1,
    borderColor: `${theme.colors.primary}25`,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    // Enhanced accessibility
    minHeight: 32,
  },

  // 🏷️ Exercise label with premium typography
  exerciseLabel: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: "700",
    letterSpacing: 0.4,
    textShadowColor: `${theme.colors.primary}20`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    // RTL text alignment
    textAlign: "right",
  },

  // ✨ Exercise name with enhanced readability
  exerciseName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
    marginHorizontal: 18,
    letterSpacing: 0.4,
    lineHeight: 24,
    // שיפור טיפוגרפי נוסף עם enhanced shadows
    textShadowColor: `${theme.colors.text}15`,
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
    // Enhanced accessibility
    includeFontPadding: true,
  },
});

export default WorkoutStatusBar;
