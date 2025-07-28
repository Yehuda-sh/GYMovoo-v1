/**
 * @file src/screens/workout/components/ExerciseCard/SetRow.tsx
 * @description שורת סט בודדת עם התאמה מלאה ל-RTL
 */

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

// Extended Set interface עם שדות נוספים לממשק המשתמש
interface ExtendedSet extends Set {
  previousWeight?: number;
  previousReps?: number;
}

interface SetRowProps {
  set: ExtendedSet;
  setNumber: number;
  onUpdate: (updates: Partial<ExtendedSet>) => void;
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
  // exercise, // לא בשימוש כרגע
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
    if (!set.actualWeight || !set.actualReps || !set.completed) return false;

    const currentVolume = set.actualWeight * set.actualReps;
    const previousVolume = (set.previousWeight || 0) * (set.previousReps || 0);

    return currentVolume > previousVolume && previousVolume > 0;
  }, [
    set.actualWeight,
    set.actualReps,
    set.completed,
    set.previousWeight,
    set.previousReps,
  ]);

  // Personal record animation
  useEffect(() => {
    if (isPR) {
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
  }, [isPR, set.actualWeight, set.actualReps, prBounceAnim]);

  useEffect(() => {
    Animated.timing(checkAnim, {
      toValue: set.completed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [set.completed, setNumber, set.actualWeight, set.actualReps, checkAnim]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.05 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [isActive, scaleAnim]);

  const handleWeightChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === "") {
      onUpdate({ actualWeight: value === "" ? undefined : numValue });
    }
  };

  const handleRepsChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) || value === "") {
      onUpdate({ actualReps: value === "" ? undefined : numValue });
    }
  };

  const handleComplete = () => {
    // אם אין ערכים ממשיים, השתמש בערכי המטרה
    if (!set.actualWeight && set.targetWeight) {
      onUpdate({ actualWeight: set.targetWeight });
    }
    if (!set.actualReps && set.targetReps) {
      onUpdate({ actualReps: set.targetReps });
    }

    // השלם את הסט בכל מקרה
    onComplete();
  };

  const handleDelete = () => {
    if (Platform.OS !== "web") {
      Vibration.vibrate(10);
    }
    onDelete();
  };

  const showHint = () => {
    setShowTargetHint(true);
    setTimeout(() => setShowTargetHint(false), 2000);
  };

  // Calculate performance indicator
  const performanceIndicator = React.useMemo(() => {
    if (!set.actualWeight || !set.previousWeight) return null;

    const diff =
      ((set.actualWeight - set.previousWeight) / set.previousWeight) * 100;

    if (diff > 5) {
      return { icon: "trending-up", color: theme.colors.success };
    } else if (diff < -5) {
      return { icon: "trending-down", color: theme.colors.error };
    } else {
      return { icon: "trending-neutral", color: theme.colors.textSecondary };
    }
  }, [set.actualWeight, set.previousWeight]);

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={{ marginBottom: 8 }}
    >
      <Animated.View
        style={[
          styles.container,
          set.completed && styles.completedContainer,
          set.completed && styles.greenBorderContainer, // גבול ירוק לסט מושלם
          isActive && styles.activeContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* PR Badge */}
        {isPR && (
          <Animated.View
            style={[
              styles.prBadge,
              {
                transform: [
                  {
                    scale: prBounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
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

        {/* שינוי RTL: מספר הסט בצד ימין */}
        <View style={styles.setNumber}>
          <Text style={styles.setNumberText}>{setNumber}</Text>
          {set.type !== "working" && (
            <Text style={styles.setTypeText}>
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
              name={
                performanceIndicator.icon as "trending-up" | "trending-down"
              }
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
            style={[
              styles.input,
              set.completed && styles.completedInput,
              weightFocused && styles.focusedInput,
            ]}
            value={set.actualWeight?.toString() || ""}
            onChangeText={handleWeightChange}
            onFocus={() => {
              setWeightFocused(true);
            }}
            onBlur={() => setWeightFocused(false)}
            keyboardType="numeric"
            placeholder={set.targetWeight?.toString() || "-"}
            placeholderTextColor={theme.colors.textSecondary + "60"}
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
            style={[
              styles.input,
              set.completed && styles.completedInput,
              repsFocused && styles.focusedInput,
            ]}
            value={set.actualReps?.toString() || ""}
            onChangeText={handleRepsChange}
            onFocus={() => {
              setRepsFocused(true);
            }}
            onBlur={() => setRepsFocused(false)}
            keyboardType="numeric"
            placeholder={set.targetReps?.toString() || "-"}
            placeholderTextColor={theme.colors.textSecondary + "60"}
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
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse", // שינוי RTL חשוב
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  completedContainer: {
    backgroundColor: theme.colors.success + "10",
    borderColor: theme.colors.success + "30",
  },
  activeContainer: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "05",
  },
  setNumber: {
    width: 50,
    alignItems: "center",
    marginStart: 8, // שינוי RTL: marginStart במקום marginLeft (תוקן)
  },
  setNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  setTypeText: {
    fontSize: 10,
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
  focusedInput: {
    color: theme.colors.text,
    fontWeight: "600",
    borderColor: theme.colors.primary + "40",
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "400", // פחות בולט מ-600
    color: theme.colors.textSecondary + "80", // פחות בולט - כמו placeholder
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
  greenBorderContainer: {
    borderColor: theme.colors.success,
    borderWidth: 2,
  },
});

export default SetRow;
