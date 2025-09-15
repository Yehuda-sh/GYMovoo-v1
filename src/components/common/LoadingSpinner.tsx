/**
 * @file src/components/common/LoadingSpinner.tsx
 * @brief רכיב טעינה פשוט עם variants בסיסיים
 * @brief Simple loading spinner with basic variants
 * @dependencies ActivityIndicator, Animated, theme
 */

import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Animated } from "react-native";
import { theme } from "../../core/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  variant?: "default" | "fade" | "pulse";
  testID?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = theme.colors.primary,
  text,
  variant = "default",
  testID = "loading-spinner",
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    switch (variant) {
      case "fade":
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.3,
              duration: 750,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 750,
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
              duration: 750,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 750,
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
  }, [variant, fadeAnim, pulseAnim]);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={text || "טוען"}
      testID={testID}
    >
      <Animated.View
        style={[
          variant === "pulse" && { transform: [{ scale: pulseAnim }] },
          variant === "fade" && { opacity: fadeAnim },
        ]}
      >
        <ActivityIndicator size={size} color={color} accessible={false} />
      </Animated.View>

      {text && (
        <Animated.Text
          style={[
            styles.loadingText,
            variant === "fade" && { opacity: fadeAnim },
          ]}
          accessible={false}
          testID={`${testID}-text`}
        >
          {text}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default LoadingSpinner;
