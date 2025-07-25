/**
 * @file src/screens/questionnaire/HeightSlider.tsx
 * @brief רכיב סרגל גובה מתוקן - תצוגה נכונה ושליטה מדויקת
 * @brief Fixed height slider - correct display and precise control
 * @dependencies React Native, PanResponder, Animated
 * @notes תיקון מיקום סליידר, סימוני סרגל, וכפתורים
 * @notes Fixed slider position, ruler marks, and buttons
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
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const [isEditing, setIsEditing] = useState(false);
  const [tempHeight, setTempHeight] = useState(String(value || 170));
  const sliderHeight = 200; // גובה מוקטן לסרגל
  const range = maxHeight - minHeight;

  // אנימציות
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // חישוב מיקום - הפוך כי אנחנו רוצים שהערכים הגבוהים יהיו למעלה
  const calculatePosition = (height: number) => {
    const percentage = (height - minHeight) / range;
    return sliderHeight * (1 - percentage); // הפוך את הכיוון
  };

  const positionY = useRef(
    new Animated.Value(calculatePosition(value))
  ).current;
  const currentPositionRef = useRef(calculatePosition(value));

  // אנימציית פעימה
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const newPosition = calculatePosition(value);
    currentPositionRef.current = newPosition;
    Animated.spring(positionY, {
      toValue: newPosition,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
    setCurrentHeight(value);
    setTempHeight(String(value));
  }, [value]);

  // PanResponder לגרירה
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        positionY.stopAnimation((value) => {
          currentPositionRef.current = value;
        });

        Animated.spring(scaleAnim, {
          toValue: 1.15,
          useNativeDriver: true,
        }).start();

        if (Platform.OS === "ios") {
          Vibration.vibrate(10);
        }
      },

      onPanResponderMove: (_, gestureState) => {
        const sensitivity = 0.8;
        const adjustedDy = gestureState.dy * sensitivity;

        const newY = Math.max(
          0,
          Math.min(sliderHeight, adjustedDy + currentPositionRef.current)
        );

        positionY.setValue(newY);

        // חישוב הגובה - הפוך כי ערכים גבוהים למעלה
        const percentage = 1 - newY / sliderHeight;
        const rawHeight = minHeight + percentage * range;
        const newHeight = Math.round(rawHeight);

        if (newHeight % 5 === 0 && newHeight !== currentHeight) {
          if (Platform.OS === "ios") {
            Vibration.vibrate(3);
          }
        }

        setCurrentHeight(newHeight);
        setTempHeight(String(newHeight));
      },

      onPanResponderRelease: () => {
        const finalHeight = Math.round(currentHeight / 5) * 5;
        const newPosition = calculatePosition(finalHeight);
        currentPositionRef.current = newPosition;

        Animated.parallel([
          Animated.spring(positionY, {
            toValue: newPosition,
            useNativeDriver: true,
            tension: 40,
            friction: 8,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();

        setCurrentHeight(finalHeight);
        setTempHeight(String(finalHeight));
        onChange(finalHeight);

        if (Platform.OS === "ios") {
          Vibration.vibrate(5);
        }
      },
    })
  ).current;

  // שינוי גובה בכפתורים
  const adjustHeight = (delta: number) => {
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, currentHeight + delta)
    );

    if (Platform.OS === "ios") {
      Vibration.vibrate(3);
    }

    setCurrentHeight(newHeight);
    setTempHeight(String(newHeight));
    onChange(newHeight);

    const newPosition = calculatePosition(newHeight);
    currentPositionRef.current = newPosition;
    Animated.spring(positionY, {
      toValue: newPosition,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  };

  // הקלדה ישירה
  const handleDirectInput = () => {
    const inputHeight = parseInt(tempHeight);
    if (
      !isNaN(inputHeight) &&
      inputHeight >= minHeight &&
      inputHeight <= maxHeight
    ) {
      setCurrentHeight(inputHeight);
      onChange(inputHeight);

      const newPosition = calculatePosition(inputHeight);
      currentPositionRef.current = newPosition;
      Animated.spring(positionY, {
        toValue: newPosition,
        useNativeDriver: true,
      }).start();
    } else {
      setTempHeight(String(currentHeight));
    }
    setIsEditing(false);
    Keyboard.dismiss();
  };

  // סימוני סרגל
  const renderRulerMarks = () => {
    const marks = [];
    // הולכים מלמעלה למטה - ערכים גבוהים למעלה
    for (let i = maxHeight; i >= minHeight; i -= 10) {
      const position = ((maxHeight - i) / range) * sliderHeight;

      marks.push(
        <View
          key={i}
          style={[
            styles.markContainer,
            { top: position - 10 }, // התאמה למרכז הטקסט
          ]}
        >
          <View style={styles.mark} />
          <Text style={styles.markLabel}>{i}</Text>
        </View>
      );
    }
    return marks;
  };

  return (
    <View style={styles.container}>
      {/* כותרת וערך */}
      <View style={styles.header}>
        <Text style={styles.title}>גובה</Text>

        {isEditing ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.heightInput}
              value={tempHeight}
              onChangeText={setTempHeight}
              keyboardType="numeric"
              maxLength={3}
              autoFocus
              selectTextOnFocus
              onBlur={handleDirectInput}
              onSubmitEditing={handleDirectInput}
            />
            <Text style={styles.heightUnit}>ס״מ</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
            style={styles.heightDisplayButton}
          >
            <Animated.View
              style={[
                styles.heightDisplay,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.heightValue}>{currentHeight}</Text>
              <Text style={styles.heightUnit}>ס״מ</Text>
              <MaterialCommunityIcons
                name="pencil"
                size={14}
                color={theme.colors.textSecondary}
                style={styles.editIcon}
              />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      {/* אזור הסליידר המרכזי */}
      <View style={styles.sliderSection}>
        {/* כפתור + משמאל */}
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => adjustHeight(5)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.adjustButtonGradient}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20} // הקטנה מ-22
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* הסרגל במרכז */}
        <View style={styles.rulerContainer}>
          {/* רקע הסרגל */}
          <View style={styles.rulerBackground} />

          {/* סימוני הסרגל */}
          <View style={styles.rulerMarks}>{renderRulerMarks()}</View>

          {/* הסליידר */}
          <Animated.View
            style={[
              styles.slider,
              {
                transform: [{ translateY: positionY }, { scale: scaleAnim }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart,
                theme.colors.primaryGradientEnd,
              ]}
              style={styles.sliderButton}
            >
              <MaterialCommunityIcons
                name="drag-horizontal"
                size={20} // הקטנה מ-24
                color="white"
              />
            </LinearGradient>

            {/* קו מחוון */}
            <View style={styles.indicatorLine} />
          </Animated.View>
        </View>

        {/* כפתור - מימין */}
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => adjustHeight(-5)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.adjustButtonGradient}
          >
            <MaterialCommunityIcons
              name="minus"
              size={20} // הקטנה מ-22
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* כפתורי קיצור */}
      <View style={styles.quickButtons}>
        {[160, 170, 180].map((height) => (
          <TouchableOpacity
            key={height}
            style={[
              styles.quickButton,
              currentHeight === height && styles.quickButtonActive,
            ]}
            onPress={() => {
              setCurrentHeight(height);
              setTempHeight(String(height));
              onChange(height);

              const newPosition = calculatePosition(height);
              currentPositionRef.current = newPosition;
              Animated.spring(positionY, {
                toValue: newPosition,
                useNativeDriver: true,
              }).start();
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.quickButtonText,
                currentHeight === height && styles.quickButtonTextActive,
              ]}
            >
              {height}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* טיפ */}
      <View style={styles.tipContainer}>
        <MaterialCommunityIcons
          name="lightbulb-outline"
          size={16}
          color={theme.colors.warning}
        />
        <Text style={styles.tipText}>
          גרור למעלה/למטה או השתמש בכפתורים לכיוונון מדויק
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.md, // הקטנה מ-lg
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.lg, // הקטנה מ-xl
  },
  title: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  heightDisplayButton: {
    marginBottom: theme.spacing.sm,
  },
  heightDisplay: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
  },
  heightValue: {
    fontSize: 48, // הקטנה מ-56
    fontWeight: "300",
    color: theme.colors.primary,
    letterSpacing: -2,
  },
  heightUnit: {
    fontSize: 20,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
    opacity: 0.8,
  },
  editIcon: {
    marginRight: theme.spacing.sm,
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    marginBottom: theme.spacing.sm,
  },
  heightInput: {
    fontSize: 48, // הקטנה מ-56
    fontWeight: "300",
    color: theme.colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    minWidth: 120,
    textAlign: "center",
    letterSpacing: -2,
  },
  sliderSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg, // הקטנה מ-xl
    height: 220, // הקטנה מ-260
  },
  adjustButton: {
    marginHorizontal: theme.spacing.sm,
  },
  adjustButtonGradient: {
    width: 36, // הקטנה מ-40
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.small,
  },
  rulerContainer: {
    height: 200, // הקטנה מ-240
    width: 160, // הקטנה מ-180
    position: "relative",
    alignItems: "center",
  },
  rulerBackground: {
    position: "absolute",
    left: 50, // הקטנה מ-60
    right: 50,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.card,
    borderRadius: 25, // הקטנה מ-30
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  rulerMarks: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
  },
  markContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    right: 0,
    width: "100%",
    height: 20,
  },
  mark: {
    width: 30,
    height: 2,
    backgroundColor: theme.colors.textSecondary + "40",
    marginLeft: 60,
  },
  markLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginLeft: 8,
    minWidth: 30,
  },
  slider: {
    position: "absolute",
    width: 50, // הקטנה מ-60
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  sliderButton: {
    width: 46, // הקטנה מ-54
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  indicatorLine: {
    position: "absolute",
    left: 46, // הקטנה מ-54
    right: -50, // הקטנה מ-60
    height: 2, // הקטנה מ-3
    backgroundColor: theme.colors.primary,
    borderRadius: 1,
  },
  quickButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  quickButton: {
    paddingHorizontal: theme.spacing.lg, // הקטנה מ-xl
    paddingVertical: theme.spacing.sm, // הקטנה מ-md
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    minWidth: 70, // הקטנה מ-80
    alignItems: "center",
  },
  quickButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  quickButtonText: {
    fontSize: 15, // הקטנה מ-16
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  quickButtonTextActive: {
    color: "white",
  },
  tipContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.warning + "10",
    paddingHorizontal: theme.spacing.md, // הקטנה מ-lg
    paddingVertical: theme.spacing.sm, // הקטנה מ-md
    borderRadius: theme.borderRadius.md, // הקטנה מ-lg
    maxWidth: SCREEN_WIDTH - theme.spacing.xl * 2,
  },
  tipText: {
    fontSize: 12, // הקטנה מ-13
    color: theme.colors.text,
    marginRight: theme.spacing.xs, // הקטנה מ-sm
    flex: 1,
    textAlign: "center",
  },
});
