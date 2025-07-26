/**
 * @file src/screens/questionnaire/HeightSlider.tsx
 * @brief רכיב סרגל גובה מתוקן - תצוגה נכונה ושליטה מדויקת (אין עיגול ערך)
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const [currentHeight, setCurrentHeight] = useState<number>(value || 170);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempHeight, setTempHeight] = useState<string>(String(value || 170));
  const sliderHeight = 200;
  const range = maxHeight - minHeight;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const currentHeightRef = useRef(currentHeight);

  const calculatePosition = (height: number) => {
    const percentage = (height - minHeight) / range;
    return sliderHeight * (1 - percentage);
  };

  const positionY = useRef(
    new Animated.Value(calculatePosition(value))
  ).current;
  const currentPositionRef = useRef(calculatePosition(value));

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
    currentHeightRef.current = value;
    setTempHeight(String(Math.round(value)));
  }, [value]);

  // PAN RESPONDER
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        positionY.stopAnimation((val) => {
          currentPositionRef.current = val;
        });
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          useNativeDriver: true,
        }).start();
        if (Platform.OS === "ios") Vibration.vibrate(10);
      },
      onPanResponderMove: (_, gestureState) => {
        const sensitivity = 0.8;
        const adjustedDy = gestureState.dy * sensitivity;
        const newY = Math.max(
          0,
          Math.min(sliderHeight, adjustedDy + currentPositionRef.current)
        );
        positionY.setValue(newY);
        const percentage = 1 - newY / sliderHeight;
        const rawHeight = minHeight + percentage * range;
        const newHeight = Math.max(minHeight, Math.min(maxHeight, rawHeight));
        setCurrentHeight(newHeight);
        currentHeightRef.current = newHeight;
        setTempHeight(newHeight.toFixed(0)); // הצגה כמספר שלם
      },
      onPanResponderRelease: () => {
        const finalHeight = Math.max(
          minHeight,
          Math.min(maxHeight, currentHeightRef.current)
        );
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
        setTempHeight(finalHeight.toFixed(0));
        onChange(finalHeight);

        if (Platform.OS === "ios") Vibration.vibrate(5);
      },
    })
  ).current;

  // ADJUST BUTTONS
  const adjustHeight = (delta: number) => {
    let newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, currentHeightRef.current + delta)
    );
    setCurrentHeight(newHeight);
    currentHeightRef.current = newHeight;
    setTempHeight(newHeight.toFixed(0));
    onChange(newHeight);

    const newPosition = calculatePosition(newHeight);
    currentPositionRef.current = newPosition;
    Animated.spring(positionY, {
      toValue: newPosition,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
    if (Platform.OS === "ios") Vibration.vibrate(3);
  };

  // DIRECT INPUT
  const handleDirectInput = () => {
    const inputHeight = parseFloat(tempHeight);
    if (
      !isNaN(inputHeight) &&
      inputHeight >= minHeight &&
      inputHeight <= maxHeight
    ) {
      setCurrentHeight(inputHeight);
      currentHeightRef.current = inputHeight;
      onChange(inputHeight);

      const newPosition = calculatePosition(inputHeight);
      currentPositionRef.current = newPosition;
      Animated.spring(positionY, {
        toValue: newPosition,
        useNativeDriver: true,
      }).start();
    } else {
      setTempHeight(String(Math.round(currentHeightRef.current)));
    }
    setIsEditing(false);
    Keyboard.dismiss();
  };

  // MARKS
  const renderRulerMarks = () => {
    const marks = [];
    for (let i = maxHeight; i >= minHeight; i -= 10) {
      const position = ((maxHeight - i) / range) * sliderHeight;
      marks.push(
        <View key={i} style={[styles.markContainer, { top: position - 10 }]}>
          <View style={styles.mark} />
          <Text style={styles.markLabel}>{i}</Text>
        </View>
      );
    }
    return marks;
  };

  return (
    <View style={styles.container}>
      {/* ערך הגובה */}
      <View style={styles.header}>
        {isEditing ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.heightInput}
              value={tempHeight}
              onChangeText={setTempHeight}
              keyboardType="numeric"
              maxLength={5}
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
              <Text style={styles.heightValue}>
                {Math.round(currentHeight)}
              </Text>
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

      {/* סליידר */}
      <View style={styles.sliderSection}>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => adjustHeight(1)}
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
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.rulerContainer}>
          <View style={styles.rulerBackground} />
          <View style={styles.rulerMarks}>{renderRulerMarks()}</View>
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
                size={20}
                color="white"
              />
            </LinearGradient>
            <View style={styles.indicatorLine} />
          </Animated.View>
        </View>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => adjustHeight(-1)}
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
            <MaterialCommunityIcons name="minus" size={20} color="white" />
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
              Math.round(currentHeight) === height && styles.quickButtonActive,
            ]}
            onPress={() => {
              setCurrentHeight(height);
              currentHeightRef.current = height;
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
                Math.round(currentHeight) === height &&
                  styles.quickButtonTextActive,
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
    paddingVertical: theme.spacing.xs,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  heightDisplayButton: {
    marginBottom: theme.spacing.sm,
  },
  heightDisplay: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
  },
  heightValue: {
    fontSize: 50,
    fontWeight: "500",
    color: theme.colors.primary,
    letterSpacing: -1.5,
  },
  heightUnit: {
    fontSize: 20,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    opacity: 0.8,
  },
  editIcon: {
    marginRight: theme.spacing.xs,
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    marginBottom: theme.spacing.sm,
  },
  heightInput: {
    fontSize: 48,
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
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    height: 225,
  },
  adjustButton: {
    marginHorizontal: theme.spacing.sm,
  },
  adjustButtonGradient: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.small,
  },
  rulerContainer: {
    height: 225,
    width: 150,
    position: "relative",
    alignItems: "center",
  },
  rulerBackground: {
    position: "absolute",
    left: 60,
    right: 60,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: theme.colors.primary + "50",
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
    height: 30,
  },
  mark: {
    width: 45,
    height: 1.2,
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
    marginLeft: 55,
  },
  markLabel: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginLeft: 8,
    minWidth: 26,
    opacity: 0.8,
  },
  slider: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  indicatorLine: {
    height: 1,
    borderRadius: 0.5,
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  quickButton: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    minWidth: 70,
    alignItems: "center",
  },
  quickButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  quickButtonText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  quickButtonTextActive: {
    color: "white",
  },
  tipContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.warning + "10",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    maxWidth: SCREEN_WIDTH - theme.spacing.xl * 2,
  },
  tipText: {
    fontSize: 12,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
    flex: 1,
    textAlign: "center",
  },
});
