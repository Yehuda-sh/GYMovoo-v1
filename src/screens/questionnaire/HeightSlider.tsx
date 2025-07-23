/**
 * @file src/components/questionnaire/HeightSlider.tsx
 * @brief רכיב סרגל גובה אינטראקטיבי - מאפשר בחירת גובה בצורה ויזואלית
 * @dependencies React Native, PanResponder, Animated
 * @notes כולל אנימציות חלקות, feedback הפטי, וסימון ס"מ
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface HeightSliderProps {
  value: number;
  onChange: (height: number) => void;
  minHeight?: number;
  maxHeight?: number;
}

export default function HeightSlider({
  value,
  onChange,
  minHeight = 140,
  maxHeight = 220,
}: HeightSliderProps) {
  const [currentHeight, setCurrentHeight] = useState(value || 170);
  const sliderHeight = Math.min(SCREEN_HEIGHT * 0.35, 300); // גובה הסרגל - מקסימום 35% מהמסך או 300
  const range = maxHeight - minHeight;

  // אנימציות
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  // חישוב מיקום התחלתי
  const initialPosition = ((currentHeight - minHeight) / range) * sliderHeight;
  const positionY = useRef(new Animated.Value(-initialPosition)).current;
  const currentPositionRef = useRef(-initialPosition);

  useEffect(() => {
    // עדכון מיקום אם הערך השתנה מבחוץ
    const newPosition = ((value - minHeight) / range) * sliderHeight;
    currentPositionRef.current = -newPosition;
    Animated.spring(positionY, {
      toValue: -newPosition,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
    setCurrentHeight(value);
  }, [value]);

  // יצירת PanResponder לגרירה
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // התחלת גרירה
        // עדכן את הרפרנס למיקום הנוכחי
        positionY.stopAnimation((value) => {
          currentPositionRef.current = value;
        });

        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        if (Platform.OS === "ios") {
          Vibration.vibrate(10);
        }
      },

      onPanResponderMove: (_, gestureState) => {
        // גרירה
        const newY = Math.max(
          -sliderHeight,
          Math.min(0, gestureState.dy + currentPositionRef.current)
        );

        positionY.setValue(newY);

        // חישוב הגובה החדש
        const percentage = Math.abs(newY) / sliderHeight;
        const newHeight = Math.round(minHeight + percentage * range);

        // רטט קל כל 5 ס"מ
        if (newHeight % 5 === 0 && newHeight !== currentHeight) {
          if (Platform.OS === "ios") {
            Vibration.vibrate(5);
          }
        }

        setCurrentHeight(newHeight);
      },

      onPanResponderRelease: () => {
        // סיום גרירה
        const finalY = Math.max(
          -sliderHeight,
          Math.min(0, currentPositionRef.current)
        );

        // עדכן את הרפרנס למיקום הסופי
        currentPositionRef.current = finalY;

        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        onChange(currentHeight);
      },
    })
  ).current;

  // יצירת סימוני הסרגל
  const renderRulerMarks = () => {
    const marks = [];
    for (let i = minHeight; i <= maxHeight; i += 1) {
      const isMajor = i % 10 === 0;
      const is5cm = i % 5 === 0;
      const position = ((i - minHeight) / range) * sliderHeight;

      // הצג רק סימונים מרכזיים אם הסרגל קטן
      if (sliderHeight < 250 && !isMajor && !is5cm) {
        continue;
      }

      marks.push(
        <View
          key={i}
          style={[
            styles.mark,
            {
              bottom: position,
              width: isMajor ? 40 : is5cm ? 25 : 15,
              backgroundColor: isMajor
                ? theme.colors.text
                : is5cm
                ? theme.colors.textSecondary
                : theme.colors.divider,
              opacity: isMajor ? 1 : is5cm ? 0.7 : 0.4,
            },
          ]}
        >
          {isMajor && (
            <Text
              style={[
                styles.markLabel,
                { fontSize: sliderHeight < 250 ? 10 : 12 },
              ]}
            >
              {i}
            </Text>
          )}
        </View>
      );
    }
    return marks;
  };

  // חישוב אחוזון גובה (לפי ממוצע ישראלי)
  const getHeightPercentile = () => {
    // ממוצעים משוערים
    const avgMale = 175;
    const avgFemale = 162;
    const avg = 168; // ממוצע כללי

    if (currentHeight < avg - 10) return "נמוך";
    if (currentHeight > avg + 10) return "גבוה";
    return "ממוצע";
  };

  return (
    <View style={styles.container}>
      {/* כותרת */}
      <View style={styles.header}>
        <Text style={styles.title}>גרור כדי לבחור את הגובה שלך</Text>
        <View style={styles.heightDisplay}>
          <Text style={styles.heightValue}>{currentHeight}</Text>
          <Text style={styles.heightUnit}>ס״מ</Text>
        </View>
        <Text style={styles.percentile}>{getHeightPercentile()}</Text>
      </View>

      {/* הסרגל */}
      <View style={styles.rulerContainer}>
        <View style={styles.ruler}>{renderRulerMarks()}</View>

        {/* הסמן הנגרר */}
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [{ translateY: positionY }, { scale: scaleAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.View style={[styles.sliderInner, { opacity: fadeAnim }]}>
            <MaterialCommunityIcons
              name="human-male-height"
              size={32}
              color={theme.colors.primary}
            />
          </Animated.View>

          {/* קו מחוון */}
          <View style={styles.indicatorLine} />
        </Animated.View>

        {/* דמות אדם לרפרנס */}
        <View style={styles.humanFigure}>
          <MaterialCommunityIcons
            name="human"
            size={sliderHeight < 250 ? 60 : 100}
            color={theme.colors.textSecondary}
            style={{ opacity: 0.1 }}
          />
        </View>
      </View>

      {/* טיפים */}
      <View style={styles.tips}>
        <Text style={styles.tipText}>
          💡 גרור את הסמן למעלה ולמטה לבחירת הגובה
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.md, // הקטנתי מ-lg
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.lg, // הקטנתי מ-xl
  },
  title: {
    fontSize: 14, // הקטנתי מ-16
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs, // הקטנתי מ-sm
  },
  heightDisplay: {
    flexDirection: "row-reverse", // RTL
    alignItems: "baseline",
    marginBottom: theme.spacing.xs,
  },
  heightValue: {
    fontSize: 40, // הקטנתי מ-48
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  heightUnit: {
    fontSize: 18, // הקטנתי מ-20
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs, // RTL
  },
  percentile: {
    fontSize: 13, // הקטנתי מ-14
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  rulerContainer: {
    height: Math.min(SCREEN_HEIGHT * 0.35, 300), // תואם לגובה הסרגל
    width: 120,
    position: "relative",
    marginBottom: theme.spacing.lg, // הקטנתי מ-xl
  },
  ruler: {
    position: "absolute",
    right: 0, // RTL
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  mark: {
    position: "absolute",
    right: 0, // RTL
    height: 2,
  },
  markLabel: {
    position: "absolute",
    left: 50, // מימין לסימון
    top: -8,
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  slider: {
    position: "absolute",
    left: 20, // משמאל לסרגל
    bottom: 0,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryGradientStart + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.large,
  },
  indicatorLine: {
    position: "absolute",
    right: -20, // מתחבר לסרגל
    width: 100,
    height: 2,
    backgroundColor: theme.colors.primary,
  },
  humanFigure: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tips: {
    backgroundColor: theme.colors.primaryGradientStart + "10",
    paddingHorizontal: theme.spacing.md, // הקטנתי מ-lg
    paddingVertical: theme.spacing.sm, // הקטנתי מ-md
    borderRadius: 12,
    maxWidth: 280, // הקטנתי מ-300
  },
  tipText: {
    fontSize: 13, // הקטנתי מ-14
    color: theme.colors.text,
    textAlign: "center",
  },
});
