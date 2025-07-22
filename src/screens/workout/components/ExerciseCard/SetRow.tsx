/**
 * @file src/screens/workout/components/ExerciseCard/SetRow.tsx
 * @description שורת סט בודדת עם התאמה מלאה ל-RTL
 */

// DEBUG FLAG - הסר בסוף הפרויקט
const DEBUG = true;
const log = (message: string, data?: any) => {
  if (DEBUG) {
    const timestamp = new Date().toLocaleTimeString("he-IL");
    console.log(`💪 [SetRow ${timestamp}] ${message}`, data || "");
  }
};

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Vibration,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { Set, Exercise } from "../../types/workout.types";

interface SetRowProps {
  set: Set;
  setNumber: number;
  onUpdate: (updates: Partial<Set>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  exercise: Exercise;
}

const SetRow: React.FC<SetRowProps> = ({
  set,
  setNumber,
  onUpdate,
  onDelete,
  onComplete,
  onLongPress,
  isActive,
  exercise,
}) => {
  const checkAnim = useRef(new Animated.Value(set.completed ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prBounceAnim = useRef(new Animated.Value(0)).current;

  // States for enhanced features
  const [showTargetHint, setShowTargetHint] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);
  const [repsFocused, setRepsFocused] = useState(false);

  // Calculate if this is a personal record
  const isPR = React.useMemo(() => {
    if (!set.weight || !set.reps || !set.completed) return false;

    const currentVolume = set.weight * set.reps;
    const previousVolume = (set.previousWeight || 0) * (set.previousReps || 0);

    return currentVolume > previousVolume && previousVolume > 0;
  }, [
    set.weight,
    set.reps,
    set.completed,
    set.previousWeight,
    set.previousReps,
  ]);

  // Personal record animation
  useEffect(() => {
    if (isPR) {
      log("🏆 New personal record detected!", {
        weight: set.weight,
        reps: set.reps,
        volume: set.weight! * set.reps!,
      });

      Animated.sequence([
        Animated.timing(prBounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(prBounceAnim, {
          toValue: 0,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      // Vibrate on PR
      if (Platform.OS !== "web") {
        Vibration.vibrate(100);
      }
    }
  }, [isPR]);

  useEffect(() => {
    Animated.timing(checkAnim, {
      toValue: set.completed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (set.completed) {
      log("✅ Set completed", {
        setNumber,
        weight: set.weight,
        reps: set.reps,
        volume: set.weight && set.reps ? set.weight * set.reps : 0,
      });
    }
  }, [set.completed]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 0.97 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const handleWeightChange = (text: string) => {
    log("⚖️ Weight input changed", {
      setNumber,
      oldValue: set.weight,
      newValue: text,
    });
    onUpdate({ weight: parseFloat(text) || undefined });
  };

  const handleRepsChange = (text: string) => {
    log("🔢 Reps input changed", {
      setNumber,
      oldValue: set.reps,
      newValue: text,
    });
    onUpdate({ reps: parseInt(text, 10) || undefined });
  };

  const handleComplete = () => {
    log("🎯 Complete button clicked", {
      setNumber,
      wasCompleted: set.completed,
      weight: set.weight,
      reps: set.reps,
    });

    // Vibrate on complete
    if (!set.completed && Platform.OS !== "web") {
      Vibration.vibrate(50);
    }

    onComplete();
  };

  const handleDelete = () => {
    log("🗑️ Delete button clicked", { setNumber });
    onDelete();
  };

  const handleLongPress = () => {
    log("👆 Long press detected", { setNumber });
    if (Platform.OS !== "web") {
      Vibration.vibrate(50);
    }
    onLongPress();
  };

  // Calculate performance indicators
  const performanceIndicator = React.useMemo(() => {
    if (!set.weight || !set.previousWeight) return null;

    const percentChange =
      ((set.weight - set.previousWeight) / set.previousWeight) * 100;

    if (percentChange > 5)
      return { icon: "trending-up", color: theme.colors.success };
    if (percentChange < -5)
      return { icon: "trending-down", color: theme.colors.error };
    return null;
  }, [set.weight, set.previousWeight]);

  // Show target hint
  const showHint = () => {
    if (set.targetWeight || set.targetReps) {
      setShowTargetHint(true);
      setTimeout(() => setShowTargetHint(false), 3000);
    }
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={1}
      disabled={isActive}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { scale: scaleAnim },
              {
                translateY: prBounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -5],
                }),
              },
            ],
          },
          set.completed && styles.completedContainer,
          isActive && styles.activeContainer,
          isPR && styles.prContainer,
        ]}
      >
        {/* שינוי RTL: מספר הסט עבר להתחלה (צד ימין) */}
        <View style={styles.setNumberWrapper}>
          <Text
            style={[
              styles.setNumberText,
              set.type === "warmup" && styles.warmupText,
            ]}
          >
            {setNumber}
          </Text>
          {set.type && set.type !== "normal" && (
            <Text style={styles.setTypeLabel}>
              {set.type === "warmup" ? "חימום" : set.type}
            </Text>
          )}
        </View>

        {/* שינוי RTL: נתוני הביצוע הקודם */}
        <TouchableOpacity
          style={styles.previousContainer}
          onPress={showHint}
          activeOpacity={0.7}
        >
          <Text style={styles.previousText}>
            {set.previousWeight && set.previousReps
              ? `${set.previousWeight}×${set.previousReps}`
              : "-"}
          </Text>
          {performanceIndicator && (
            <MaterialCommunityIcons
              name={performanceIndicator.icon as any}
              size={12}
              color={performanceIndicator.color}
              style={styles.trendIcon}
            />
          )}
        </TouchableOpacity>

        {/* שינוי RTL: שדות הקלט */}
        <View
          style={[
            styles.inputContainer,
            weightFocused && styles.focusedContainer,
          ]}
        >
          <TextInput
            style={[styles.input, set.completed && styles.completedInput]}
            value={set.weight?.toString() || ""}
            onChangeText={handleWeightChange}
            onFocus={() => {
              log("⚖️ Weight input focused", { setNumber });
              setWeightFocused(true);
            }}
            onBlur={() => setWeightFocused(false)}
            keyboardType="numeric"
            placeholder={set.targetWeight?.toString() || "-"}
            placeholderTextColor={theme.colors.textSecondary}
            selectTextOnFocus
            editable={!set.completed}
          />
          {showTargetHint && set.targetWeight && (
            <Text style={styles.targetHint}>יעד: {set.targetWeight}</Text>
          )}
        </View>

        <View
          style={[
            styles.inputContainer,
            repsFocused && styles.focusedContainer,
          ]}
        >
          <TextInput
            style={[styles.input, set.completed && styles.completedInput]}
            value={set.reps?.toString() || ""}
            onChangeText={handleRepsChange}
            onFocus={() => {
              log("🔢 Reps input focused", { setNumber });
              setRepsFocused(true);
            }}
            onBlur={() => setRepsFocused(false)}
            keyboardType="numeric"
            placeholder={set.targetReps?.toString() || "-"}
            placeholderTextColor={theme.colors.textSecondary}
            selectTextOnFocus
            editable={!set.completed}
          />
          {showTargetHint && set.targetReps && (
            <Text style={styles.targetHint}>יעד: {set.targetReps}</Text>
          )}
        </View>

        {/* שינוי RTL: כפתורי הפעולה עברו לסוף (צד שמאל) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleComplete}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              style={[
                styles.checkCircle,
                set.completed && styles.checkCircleCompleted,
              ]}
            >
              <Animated.View style={{ opacity: checkAnim }}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={theme.colors.white}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        </View>

        {/* PR Badge */}
        {isPR && (
          <Animated.View
            style={[
              styles.prBadge,
              {
                opacity: prBounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.8],
                }),
                transform: [
                  {
                    scale: prBounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="trophy"
              size={16}
              color={theme.colors.warning}
            />
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse", // שינוי RTL: הפך את כיוון הפריסה
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    position: "relative",
  },
  completedContainer: {
    backgroundColor: `${theme.colors.success}1A`,
  },
  activeContainer: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  prContainer: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning,
  },
  setNumberWrapper: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  setNumberText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  warmupText: {
    color: theme.colors.warning,
  },
  setTypeLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  previousContainer: {
    flex: 1.2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  previousText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  trendIcon: {
    marginTop: 2,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
    position: "relative",
  },
  focusedContainer: {
    transform: [{ scale: 1.02 }],
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  completedInput: {
    backgroundColor: theme.colors.background + "80",
    color: theme.colors.textSecondary,
  },
  targetHint: {
    position: "absolute",
    bottom: -16,
    alignSelf: "center",
    fontSize: 10,
    color: theme.colors.primary,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: "row-reverse", // שינוי RTL: הפך את כיוון הכפתורים
    alignItems: "center",
    justifyContent: "flex-end",
    width: 80,
  },
  actionButton: {
    padding: 8,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkCircleCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  prBadge: {
    position: "absolute",
    top: 4,
    left: 4,
  },
});

export default SetRow;
