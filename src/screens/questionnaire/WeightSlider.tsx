/**
 * @file src/components/questionnaire/WeightSlider.tsx
 * @brief רכיב סרגל משקל אופקי אינטראקטיבי - מאפשר בחירת משקל בצורה ויזואלית
 * @dependencies React Native, PanResponder, Animated
 * @notes כולל אנימציות חלקות, רטט, וסימון ק"ג
 */

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Vibration,
  Platform,
} from "react-native";
import { theme } from "../../styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface WeightSliderProps {
  value: number;
  onChange: (weight: number) => void;
  minWeight?: number;
  maxWeight?: number;
}

export default function WeightSlider({
  value,
  onChange,
  minWeight = 40,
  maxWeight = 150,
}: WeightSliderProps) {
  const [currentWeight, setCurrentWeight] = useState(value || 70);
  const sliderWidth = SCREEN_WIDTH * 0.8; // רוחב הסרגל
  const range = maxWeight - minWeight;

  // אנימציות
  const positionX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const currentPositionRef = useRef(0);

  // חישוב מיקום התחלתי
  useEffect(() => {
    const initialPosition = ((value - minWeight) / range) * sliderWidth;
    currentPositionRef.current = initialPosition;
    Animated.spring(positionX, {
      toValue: initialPosition,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
    setCurrentWeight(value);
  }, [value]);

  // יצירת PanResponder לגרירה
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // התחלת גרירה
        positionX.stopAnimation((value) => {
          currentPositionRef.current = value;
        });

        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1.1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
        ]).start();

        if (Platform.OS === "ios") {
          Vibration.vibrate(10);
        }
      },

      onPanResponderMove: (_, gestureState) => {
        // גרירה
        const newX = Math.max(
          0,
          Math.min(sliderWidth, gestureState.dx + currentPositionRef.current)
        );

        positionX.setValue(newX);

        // חישוב המשקל החדש
        const percentage = newX / sliderWidth;
        const newWeight = Math.round(minWeight + percentage * range);

        // רטט קל כל 5 ק"ג
        if (newWeight % 5 === 0 && newWeight !== currentWeight) {
          if (Platform.OS === "ios") {
            Vibration.vibrate(5);
          }
        }

        setCurrentWeight(newWeight);
      },

      onPanResponderRelease: () => {
        // סיום גרירה
        // שמור את המיקום הנוכחי
        positionX.stopAnimation((value) => {
          currentPositionRef.current = value;
        });

        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        onChange(currentWeight);
      },
    })
  ).current;

  // יצירת סימוני הסרגל
  const renderRulerMarks = () => {
    const marks = [];
    for (let i = minWeight; i <= maxWeight; i += 1) {
      const isMajor = i % 10 === 0;
      const is5kg = i % 5 === 0;
      const position = ((i - minWeight) / range) * sliderWidth;

      // הצג רק סימונים מרכזיים
      if (!isMajor && !is5kg) {
        continue;
      }

      marks.push(
        <View
          key={i}
          style={[
            styles.mark,
            {
              left: position,
              height: isMajor ? 30 : 20,
              backgroundColor: isMajor
                ? theme.colors.text
                : theme.colors.textSecondary,
              opacity: isMajor ? 1 : 0.5,
            },
          ]}
        >
          {isMajor && <Text style={styles.markLabel}>{i}</Text>}
        </View>
      );
    }
    return marks;
  };

  // חישוב BMI משוער (נצטרך את הגובה בפועל)
  const getBMICategory = () => {
    // BMI משוער לגובה ממוצע של 170 ס"מ
    const bmi = currentWeight / (1.7 * 1.7);
    if (bmi < 18.5) return { text: "תת משקל", color: theme.colors.warning };
    if (bmi < 25) return { text: "משקל תקין", color: theme.colors.success };
    if (bmi < 30) return { text: "עודף משקל", color: theme.colors.warning };
    return { text: "השמנה", color: theme.colors.error };
  };

  const bmiCategory = getBMICategory();

  return (
    <View style={styles.container}>
      {/* כותרת */}
      <View style={styles.header}>
        <Text style={styles.title}>גרור כדי לבחור את המשקל שלך</Text>
        <View style={styles.weightDisplay}>
          <Animated.Text
            style={[
              styles.weightValue,
              {
                transform: [{ scale: bounceAnim }],
              },
            ]}
          >
            {currentWeight}
          </Animated.Text>
          <Text style={styles.weightUnit}>ק״ג</Text>
        </View>
        <Text style={[styles.category, { color: bmiCategory.color }]}>
          {bmiCategory.text}
        </Text>
      </View>

      {/* הסרגל */}
      <View style={styles.sliderContainer}>
        {/* רקע גרדיאנט */}
        <LinearGradient
          colors={[
            theme.colors.warning + "20",
            theme.colors.success + "20",
            theme.colors.warning + "20",
            theme.colors.error + "20",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.gradientBackground}
        />

        {/* הסרגל */}
        <View style={styles.ruler}>{renderRulerMarks()}</View>

        {/* הסמן הנגרר */}
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [{ translateX: positionX }, { scale: scaleAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.sliderInner}>
            <MaterialCommunityIcons
              name="scale-bathroom"
              size={24}
              color={theme.colors.primary}
            />
          </View>

          {/* חץ מצביע */}
          <View style={styles.arrow} />
        </Animated.View>

        {/* קו מרכזי */}
        <View style={styles.centerLine} />
      </View>

      {/* אייקונים חזותיים */}
      <View style={styles.visualIcons}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="feather"
            size={24}
            color={theme.colors.textSecondary}
            style={{ opacity: 0.3 }}
          />
          <Text style={styles.iconLabel}>קל</Text>
        </View>

        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="human"
            size={24}
            color={theme.colors.textSecondary}
            style={{ opacity: 0.5 }}
          />
          <Text style={styles.iconLabel}>ממוצע</Text>
        </View>

        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="weight-lifter"
            size={24}
            color={theme.colors.textSecondary}
            style={{ opacity: 0.3 }}
          />
          <Text style={styles.iconLabel}>כבד</Text>
        </View>
      </View>

      {/* טיפים */}
      <View style={styles.tips}>
        <Text style={styles.tipText}>
          💡 גרור את הסמן ימינה ושמאלה לבחירת המשקל
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  weightDisplay: {
    flexDirection: "row-reverse", // RTL
    alignItems: "baseline",
    marginBottom: theme.spacing.xs,
  },
  weightValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  weightUnit: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs, // RTL
  },
  category: {
    fontSize: 13,
    fontWeight: "600",
  },
  sliderContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: 80,
    position: "relative",
    marginBottom: theme.spacing.lg,
    justifyContent: "center",
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
  },
  ruler: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "center",
  },
  mark: {
    position: "absolute",
    width: 2,
    borderRadius: 1,
  },
  markLabel: {
    position: "absolute",
    bottom: -20,
    left: -10,
    width: 20,
    textAlign: "center",
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  slider: {
    position: "absolute",
    left: -30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
    ...theme.shadows.large,
  },
  arrow: {
    position: "absolute",
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: theme.colors.primary,
  },
  centerLine: {
    position: "absolute",
    left: "50%",
    marginLeft: -1,
    width: 2,
    height: 40,
    backgroundColor: theme.colors.primary,
    opacity: 0.2,
  },
  visualIcons: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "space-between",
    width: SCREEN_WIDTH * 0.7,
    marginBottom: theme.spacing.md,
  },
  iconWrapper: {
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  tips: {
    backgroundColor: theme.colors.primaryGradientStart + "10",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 12,
    maxWidth: 280,
  },
  tipText: {
    fontSize: 13,
    color: theme.colors.text,
    textAlign: "center",
  },
});
