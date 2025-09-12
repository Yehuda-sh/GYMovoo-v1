/**
 * @file src/components/common/LoadingSpinner.tsx
 * @brief רכיב טעינה אוניברסלי עם תמיכה מתקדמת ב-variants ואנימציות
 * @brief Universal loading spinner with advanced variants support and animations
 * @dependencies ActivityIndicator, Animated, theme, useEffect
 * @notes מחליף את כל ה-ActivityIndicator החוזרים באפליקציה עם מערכת variants
 * @notes Replaces all repeated ActivityIndicators in app with variants system
 * @updated 2025-08-04 React.memo optimization, variants, animation enhancements
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Animated,
} from "react-native";
import { theme } from "../../core/theme";

interface LoadingSpinnerProps {
  // 🎨 מאפיינים בסיסיים // Basic properties
  size?: "small" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  // 🆕 מאפיינים חדשים // New properties
  variant?: "default" | "fade" | "pulse" | "dots" | "bounce";
  duration?: number;
  testID?: string;
  hideAfter?: number; // מסתיר אחרי זמן מסוים (במילישניות)
  loading?: boolean; // שליטה חיצונית על מצב הטעינה
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  ({
    size = "large",
    color = theme.colors.primary,
    text,
    fullScreen = false,
    style,
    variant = "default",
    duration = 1500,
    testID = "loading-spinner",
    hideAfter,
    loading = true,
  }) => {
    // 🎭 אנימציות // Animations
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // 🎯 אפקט אנימציה // Animation effect
    useEffect(() => {
      let animation: Animated.CompositeAnimation | null = null;

      switch (variant) {
        case "fade":
          animation = Animated.loop(
            Animated.sequence([
              Animated.timing(fadeAnim, {
                toValue: 0.3,
                duration: duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration / 2,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case "pulse":
          animation = Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.2,
                duration: duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: duration / 2,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case "bounce":
          animation = Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 0.8,
                duration: duration / 4,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: duration / 4,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: duration / 2,
                useNativeDriver: true,
              }),
            ])
          );
          break;
      }

      if (animation) {
        animation.start();
      }

      return () => {
        animation?.stop();
      };
    }, [variant, duration, fadeAnim, pulseAnim, rotateAnim]);

    // 🕐 הסתרה אוטומטית אחרי זמן // Auto-hide after time
    useEffect(() => {
      if (hideAfter) {
        const timer = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, hideAfter);

        return () => clearTimeout(timer);
      }
      return undefined;
    }, [hideAfter, fadeAnim]);

    // 🎨 חישוב סגנונות דינמיים // Dynamic styles calculation
    const { containerStyle, spinnerTransform, spinnerOpacity, textStyle } =
      React.useMemo(() => {
        const baseContainerStyle: ViewStyle[] = [styles.container];

        if (fullScreen) baseContainerStyle.push(styles.fullScreen);
        if (style) baseContainerStyle.push(style);

        // Transform animations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transforms: any[] = [];

        if (variant === "pulse") {
          transforms.push({ scale: pulseAnim });
        } else if (variant === "dots") {
          const rotation = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
          });
          transforms.push({ rotate: rotation });
        }

        return {
          containerStyle: baseContainerStyle,
          spinnerTransform: transforms.length > 0 ? transforms : undefined,
          spinnerOpacity: variant === "fade" ? fadeAnim : 1,
          textStyle: [
            styles.loadingText,
            variant === "fade" && { opacity: fadeAnim },
          ] as ViewStyle[],
        };
      }, [fullScreen, style, variant, fadeAnim, pulseAnim, rotateAnim]);

    // אם לא בטעינה, לא מציג כלום
    if (!loading) {
      return null;
    }

    return (
      <View
        style={containerStyle}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel={text || "טוען"}
        accessibilityHint="האפליקציה טוענת, אנא המתן"
        testID={testID}
      >
        {variant === "dots" ? (
          // 🔴 מצב נקודות מסתובבות // Rotating dots mode
          <Animated.View
            style={[
              styles.dotsContainer,
              spinnerTransform && { transform: spinnerTransform },
            ]}
          >
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: color },
                  {
                    opacity: 0.4 + index * 0.3,
                    transform: [
                      {
                        rotate: `${index * 120}deg`,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        ) : (
          // 🌀 מצב ActivityIndicator רגיל // Regular ActivityIndicator mode
          <Animated.View
            style={[
              spinnerTransform && { transform: spinnerTransform },
              variant === "fade" && { opacity: spinnerOpacity },
            ]}
          >
            <ActivityIndicator
              size={size}
              color={color}
              accessible={false} // האב כבר נגיש
            />
          </Animated.View>
        )}

        {text && (
          <Animated.Text
            style={textStyle}
            accessible={false} // האב כבר נגיש
            testID={`${testID}-text`}
          >
            {text}
          </Animated.Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  // 🎨 סגנונות נקודות // Dots styles
  dotsContainer: {
    width: 60,
    height: 60,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 4,
  },
});

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
