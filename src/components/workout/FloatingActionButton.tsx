/**
 * @file src/components/workout/FloatingActionButton.tsx
 * @brief כפתור פעולה צף - קומפקטי ולא פולשני למסך האימון
 * @dependencies React Native, Animated, Ionicons
 * @notes מיקום שמאלי תחתון (RTL), אנימציות חלקות, גודל מינימלי
 */

import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  visible?: boolean;
  bottom?: number;
  size?: "small" | "medium" | "large";
  color?: string;
}

export default function FloatingActionButton({
  onPress,
  icon = "add",
  label,
  visible = true,
  bottom = 80, // מעל ה-Bottom Navigation
  size = "medium",
  color = theme.colors.primary,
}: FloatingActionButtonProps) {
  // אנימציות // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // גדלים לפי סוג // Sizes by type
  const sizes = {
    small: { button: 48, icon: 20 },
    medium: { button: 56, icon: 24 },
    large: { button: 64, icon: 28 },
  };

  const currentSize = sizes[size];

  useEffect(() => {
    if (visible) {
      // אנימציית כניסה // Entry animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // אנימציית יציאה // Exit animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* תווית אופציונלית // Optional label */}
      {label && (
        <Animated.View
          style={[
            styles.labelContainer,
            {
              opacity: scaleAnim,
              transform: [
                {
                  translateX: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.labelText}>{label}</Text>
        </Animated.View>
      )}

      {/* הכפתור עצמו // The button itself */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: color,
            width: currentSize.button,
            height: currentSize.button,
            borderRadius: currentSize.button / 2,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name={icon} size={currentSize.icon} color="#fff" />
        </Animated.View>

        {/* אפקט לחיצה // Press effect */}
        <View style={styles.ripple} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: theme.spacing.lg, // RTL - צד שמאל
    flexDirection: "row-reverse",
    alignItems: "center",
    zIndex: 999,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    // אפקט לחיצה // Press effect
    overflow: "hidden",
  },
  ripple: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  labelContainer: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
});
