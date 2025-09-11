/**
 * @file src/screens/main/components/AnimatedStatCard.tsx
 * @description כרטיס סטטיסטיקות מונפש למסך הראשי
 */

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AnimatedStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  delay?: number;
}

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  delay = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animationSequence = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: delay + 200,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();
  }, [fadeAnim, slideAnim, scaleAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.card, { borderLeftColor: color }]}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={color}
            style={styles.icon}
          />
          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={[styles.value, { color }]}>{value}</Text>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
});
