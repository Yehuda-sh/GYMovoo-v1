/**
 * @file src/screens/workout/components/shared/StatItem.tsx
 * @brief רכיב סטטיסטיקה מאוחד עם אנימציות ונגישות
 * @version 1.0.0
 * @description
 * רכיב סטטיסטיקה מאוחד התומך בשני משפחות אייקונים ואנימציות
 * @features
 * - תמיכה ב-MaterialCommunityIcons וב-FontAwesome5
 * - אנימציות spring
 * - נגישות מקיפה
 * - תמיכת RTL מלאה
 */

import React, { useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

// Size configuration
const SIZE_CONFIG = {
  small: { iconSize: 18, valueSize: 16, labelSize: 11, gap: theme.spacing.xs },
  medium: { iconSize: 26, valueSize: 20, labelSize: 13, gap: theme.spacing.sm },
  large: { iconSize: 32, valueSize: 24, labelSize: 15, gap: theme.spacing.md },
} as const;

export interface StatItemProps {
  label: string;
  value: string | number;
  icon: string;
  iconFamily: "material" | "font5";
  color?: string;
  iconColor?: string;
  valueColor?: string;
  animate?: boolean;
  animateMode?: "mount" | "change";
  reducedMotion?: boolean;
  size?: keyof typeof SIZE_CONFIG;
  unit?: string;
  variant?: "vertical" | "horizontal";
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const StatItem: React.FC<StatItemProps> = React.memo(
  ({
    label,
    value,
    icon,
    iconFamily,
    color = theme.colors.primary,
    iconColor,
    valueColor,
    animate = false,
    animateMode = "change",
    reducedMotion = false,
    size = "medium",
    unit,
    variant = "vertical",
    testID,
    containerStyle: containerStyleOverride,
    valueStyle,
    labelStyle,
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const prevValueRef = useRef<string | number | undefined>(undefined);
    const mountedRef = useRef(false);

    const config = SIZE_CONFIG[size] || SIZE_CONFIG.medium;

    const valueWithUnit = unit
      ? `${value}${unit.startsWith(" ") ? unit : " " + unit}`
      : value;

    useEffect(() => {
      if (!animate || reducedMotion) return;
      const shouldAnimate =
        (animateMode === "mount" && !mountedRef.current) ||
        (animateMode === "change" &&
          mountedRef.current &&
          prevValueRef.current !== value);
      if (shouldAnimate) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();
      }
      if (!mountedRef.current) mountedRef.current = true;
      prevValueRef.current = value;
    }, [value, animate, animateMode, reducedMotion, scaleAnim]);

    const containerStyle = [
      styles.statItem,
      variant === "horizontal" && styles.horizontal,
      { gap: config.gap },
      animate && !reducedMotion && { transform: [{ scale: scaleAnim }] },
      containerStyleOverride,
    ];

    const finalIconColor = iconColor || color;
    const finalValueColor = valueColor || color;

    return (
      <Animated.View
        style={containerStyle}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${label}: ${valueWithUnit}`}
        testID={testID || "StatItem"}
      >
        {iconFamily === "material" ? (
          <MaterialCommunityIcons
            name={
              icon as React.ComponentProps<
                typeof MaterialCommunityIcons
              >["name"]
            }
            size={config.iconSize}
            color={finalIconColor}
          />
        ) : (
          <FontAwesome5
            name={icon as React.ComponentProps<typeof FontAwesome5>["name"]}
            size={
              iconFamily === "font5" ? config.iconSize - 4 : config.iconSize
            }
            color={finalIconColor}
          />
        )}
        <Text
          style={[
            styles.statValue,
            { fontSize: config.valueSize, color: finalValueColor },
            valueStyle,
          ]}
        >
          {valueWithUnit}
        </Text>
        <Text
          style={[styles.statLabel, { fontSize: config.labelSize }, labelStyle]}
        >
          {label}
        </Text>
      </Animated.View>
    );
  }
);

StatItem.displayName = "StatItem";

const styles = StyleSheet.create({
  statItem: {
    alignItems: "center",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: `${theme.colors.surface}30`,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontal: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  statValue: {
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
