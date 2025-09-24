/**
 * @file src/screens/main/components/AnimatedStatCard.tsx
 * @description כרטיס סטטיסטיקות מונפש למסך הראשי – מותאם RTL, נגישות ו-Theme
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Pressable,
  AccessibilityInfo,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../core/theme";
import {
  getFlexDirection,
  getTextAlign,
  getTextDirection,
} from "../../../utils/rtlHelpers";

type MCIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface AnimatedStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: MCIconName;
  color?: string; // default: theme.colors.primary
  delay?: number;
  // Optional interactions
  onPress?: () => void;
  disabled?: boolean;
  // Style overrides
  containerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  // A11y
  accessibilityLabel?: string;
  testID?: string;
}

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = theme.colors.primary,
  delay = 0,
  onPress,
  disabled = false,
  containerStyle,
  cardStyle,
  titleStyle,
  valueStyle,
  subtitleStyle,
  accessibilityLabel,
  testID,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  // Detect reduced motion once (mobile-only app – safe to query once)
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(!!enabled);
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      scaleAnim.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: Math.max(0, delay - 50),
        useNativeDriver: true,
        speed: 18,
        bounciness: 8,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, delay, reduceMotion]);

  const pressable = Boolean(onPress) && !disabled;

  const cardShadow = useMemo(() => {
    // עדין יותר באנדרואיד
    return Platform.select({
      ios: theme.shadows.medium,
      android: {
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      default: theme.shadows.small,
    });
  }, []);

  const announcedValue = useMemo(() => {
    // שיפור קריינות – אם זה מספר, נקרא אותו בפורמט עברי
    if (typeof value === "number") return value.toLocaleString("he-IL");
    return value;
  }, [value]);

  const content = (
    <View
      style={[
        styles.card,
        { borderStartColor: color },
        cardShadow,
        cardStyle,
        disabled && { opacity: 0.6 },
      ]}
      pointerEvents={pressable ? "auto" : "none"}
    >
      <View style={[styles.header, { flexDirection: getFlexDirection() }]}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={color}
          style={styles.icon}
        />
        <Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      <Text
        style={[styles.value, { color }, valueStyle]}
        numberOfLines={1}
        accessibilityRole="text"
      >
        {announcedValue}
      </Text>

      {subtitle ? (
        <Text
          style={[styles.subtitle, subtitleStyle]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
        containerStyle,
      ]}
      testID={testID || "animated-stat-card"}
    >
      {pressable ? (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          android_ripple={{ color: theme.colors.ripple }}
          style={({ pressed }) => [
            { borderRadius: theme.radius.lg },
            pressed && !disabled && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            accessibilityLabel ||
            `${title}: ${announcedValue}${subtitle ? `, ${subtitle}` : ""}`
          }
          accessibilityState={{ disabled }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {content}
        </Pressable>
      ) : (
        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel={
            accessibilityLabel ||
            `${title}: ${announcedValue}${subtitle ? `, ${subtitle}` : ""}`
          }
        >
          {content}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderStartWidth: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  icon: {
    marginEnd: theme.spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    textAlign: getTextAlign(),
    writingDirection: getTextDirection(),
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: getTextAlign(),
    writingDirection: getTextDirection(),
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: getTextAlign(),
    writingDirection: getTextDirection(),
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.992 }],
  },
});

export default AnimatedStatCard;
