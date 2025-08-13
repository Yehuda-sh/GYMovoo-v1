/**
 * @file src/screens/workout/components/ExerciseCard/SetRow.tsx
 * @description שורת סט בודדת עם ממשק עריכה מתקדם והתאמה מלאה ל-RTL
 * @version 3.1.0
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";
// ייבוא ממשק מרכזי במקום הגדרה מקומית
import { ExtendedSet } from "../types";

// קבועים למניעת magic numbers ושיפור קריאות
const ANIMATION_DURATIONS = {
  CHECK: 300,
  PR_BOUNCE: 300,
  SCALE_TRANSITION: 250,
} as const;

const PERFORMANCE_THRESHOLDS = {
  SIGNIFICANT_IMPROVEMENT: 5, // אחוז שיפור משמעותי
  SIGNIFICANT_DECLINE: -5, // אחוז ירידה משמעותית
} as const;

const INPUT_CONFIG = {
  MAX_LENGTH: 10,
  KEYBOARD_TYPE: "numeric" as const,
  RETURN_KEY_TYPE: "done" as const,
} as const;

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const ELEVATOR_HIT_SLOP = { top: 5, bottom: 5, left: 5, right: 5 };

// מאפיינים משותפים לשדות קלט לחיסכון בכפילויות
const SHARED_TEXT_INPUT_PROPS = {
  keyboardType: INPUT_CONFIG.KEYBOARD_TYPE,
  selectTextOnFocus: true,
  editable: true,
  returnKeyType: INPUT_CONFIG.RETURN_KEY_TYPE,
  blurOnSubmit: false, // מונע סגירת מקלדת אוטומטית
  autoFocus: false,
  multiline: false,
  maxLength: INPUT_CONFIG.MAX_LENGTH,
  caretHidden: false,
  contextMenuHidden: false,
  autoCorrect: false,
  autoCapitalize: "none" as const,
  spellCheck: false,
  textContentType: "none" as const,
  showSoftInputOnFocus: true, // מאלץ הצגת מקלדת ב-Android
} as const;

interface SetRowProps {
  set: ExtendedSet;
  setNumber: number;
  onUpdate: (updates: Partial<ExtendedSet>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  // מצב עריכה
  isEditMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  // מידע על מיקום הסט
  isFirst?: boolean;
  isLast?: boolean;
}

// Debug flag (enable with EXPO_PUBLIC_DEBUG_SETROW=1)
const DEBUG = process.env.EXPO_PUBLIC_DEBUG_SETROW === "1";
const dlog = (msg: string, data?: unknown) => {
  if (DEBUG) {
    console.warn(
      `🏷️ SetRow: ${msg}` + (data ? ` -> ${JSON.stringify(data)}` : "")
    );
  }
};

const SetRow: React.FC<SetRowProps> = ({
  set,
  setNumber,
  onUpdate,
  onDelete,
  onComplete,
  onLongPress,
  isActive,
  isEditMode = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  isFirst = false,
  isLast = false,
}) => {
  // Wrap onUpdate with logging
  const wrappedOnUpdate = React.useCallback(
    (updates: Partial<ExtendedSet>) => {
      onUpdate(updates);
    },
    [onUpdate]
  );
  const checkAnim = useRef(new Animated.Value(set.completed ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prBounceAnim = useRef(new Animated.Value(0)).current;

  // רפרנסים לשדות הקלט
  const weightInputRef = useRef<TextInput>(null);
  const repsInputRef = useRef<TextInput>(null);

  // States for enhanced features
  const [showTargetHint, setShowTargetHint] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);
  const [repsFocused, setRepsFocused] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          duration: ANIMATION_DURATIONS.PR_BOUNCE,
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
        triggerVibration("personalRecord");
      }
    }
  }, [isPR, set.actualWeight, set.actualReps, prBounceAnim]);

  useEffect(() => {
    Animated.timing(checkAnim, {
      toValue: set.completed ? 1 : 0,
      duration: ANIMATION_DURATIONS.CHECK,
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

  const parseNumeric = (raw: string, isInt = false): number | undefined => {
    if (raw === "") return undefined;
    const n: number = isInt ? parseInt(raw, 10) : parseFloat(raw);
    return Number.isNaN(n) ? undefined : n;
  };

  const handleWeightChange = React.useCallback(
    (value: string) => {
      const parsed = parseNumeric(value, false);
      wrappedOnUpdate({ actualWeight: parsed });
      dlog("weightChange", { value, parsed });
    },
    [wrappedOnUpdate]
  );

  const handleRepsChange = React.useCallback(
    (value: string) => {
      const parsed = parseNumeric(value, true);
      wrappedOnUpdate({ actualReps: parsed });
      dlog("repsChange", { value, parsed });
    },
    [wrappedOnUpdate]
  );

  // Memoize input values to prevent unnecessary re-renders
  const weightValue = React.useMemo(
    () => set.actualWeight?.toString() || "",
    [set.actualWeight]
  );
  const repsValue = React.useMemo(() => {
    const value = set.actualReps?.toString() || "";
    return value;
  }, [set.actualReps]);
  const weightPlaceholder = React.useMemo(
    () => set.targetWeight?.toString() || "-",
    [set.targetWeight]
  );
  const repsPlaceholder = React.useMemo(() => {
    const placeholder = set.targetReps ? `יעד: ${set.targetReps}` : "-";
    return placeholder;
  }, [set.targetReps]);

  // Callback functions for focus handling
  const handleWeightFocus = React.useCallback(() => {
    setWeightFocused(true);
  }, []);

  const handleWeightBlur = React.useCallback(() => {
    setWeightFocused(false);
  }, []);

  const handleRepsFocus = React.useCallback(() => {
    setRepsFocused(true);
  }, []);

  const handleRepsBlur = React.useCallback(() => {
    setRepsFocused(false);
  }, []);

  const handleComplete = () => {
    // תכונה: ביטול השלמת סט בלחיצה נוספת
    if (set.completed) {
      wrappedOnUpdate({ completed: false });
      dlog("uncompleteSet", { setNumber });
      return;
    }

    // אם אין ערכים ממשיים, השתמש בערכי המטרה
    if (!set.actualWeight && set.targetWeight) {
      wrappedOnUpdate({ actualWeight: set.targetWeight });
    }
    if (!set.actualReps && set.targetReps) {
      wrappedOnUpdate({ actualReps: set.targetReps });
    }

    dlog("completeSet", { setNumber });
    onComplete();
  };

  const handleDelete = () => {
    if (Platform.OS !== "web") {
      triggerVibration("short");
    }
    dlog("deleteSet", { setNumber });
    onDelete();
  };

  const showHint = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setShowTargetHint(true);
    hintTimerRef.current = setTimeout(() => setShowTargetHint(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  // רכיב עזר לשדות קלט כדי לחסוך בכפילויות
  const renderInputField = React.useCallback(
    (
      type: "weight" | "reps",
      value: string,
      placeholder: string,
      onChange: (value: string) => void,
      onFocus: () => void,
      onBlur: () => void,
      focused: boolean,
      inputRef: React.RefObject<TextInput>,
      targetValue?: number
    ) => (
      <TouchableOpacity
        style={[styles.inputContainer, focused && styles.focusedContainer]}
        activeOpacity={1}
        onPress={() => {
          const input = inputRef.current;
          if (input) {
            input.focus();
          }
        }}
      >
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            set.completed && styles.completedInput,
            focused && styles.focusedInput,
          ]}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={
            type === "weight"
              ? theme.colors.textSecondary + "60"
              : theme.colors.textSecondary + "40"
          }
          accessible={true}
          accessibilityLabel={type === "weight" ? "שדה משקל" : "שדה חזרות"}
          accessibilityHint={
            typeof targetValue === "number"
              ? `יעד מומלץ: ${targetValue}`
              : type === "weight"
                ? "הזן משקל בקילוגרמים"
                : "הזן מספר חזרות"
          }
          {...SHARED_TEXT_INPUT_PROPS}
        />

        {showTargetHint && typeof targetValue === "number" && (
          <Text style={styles.targetHint}>יעד: {targetValue}</Text>
        )}
      </TouchableOpacity>
    ),
    [set.completed, showTargetHint]
  );

  // Calculate performance indicator
  const performanceIndicator = React.useMemo(() => {
    if (!set.actualWeight || !set.previousWeight) return null;
    const diff =
      ((set.actualWeight - set.previousWeight) / set.previousWeight) * 100;
    if (diff > PERFORMANCE_THRESHOLDS.SIGNIFICANT_IMPROVEMENT) {
      return { icon: "trending-up", color: theme.colors.success } as const;
    }
    if (diff < PERFORMANCE_THRESHOLDS.SIGNIFICANT_DECLINE) {
      return { icon: "trending-down", color: theme.colors.error } as const;
    }
    return {
      icon: "trending-neutral",
      color: theme.colors.textSecondary,
    } as const;
  }, [set.actualWeight, set.previousWeight]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          set.completed && styles.completedContainer,
          set.completed && styles.greenBorderContainer,
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
          onLongPress={onLongPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="ביצוע קודם"
          accessibilityHint="הקש להצגת יעד הסט"
        >
          <Text style={styles.previousText}>
            {set.previousWeight && set.previousReps
              ? `${set.previousWeight}×${set.previousReps}`
              : "-"}
          </Text>
          {performanceIndicator && (
            <MaterialCommunityIcons
              name={performanceIndicator.icon}
              size={12}
              color={performanceIndicator.color}
              style={styles.trendIcon}
            />
          )}
        </TouchableOpacity>

        {/* שדות קלט מאוחדים עם רכיב עזר */}
        {renderInputField(
          "weight",
          weightValue,
          weightPlaceholder,
          handleWeightChange,
          handleWeightFocus,
          handleWeightBlur,
          weightFocused,
          weightInputRef,
          set.targetWeight
        )}

        {renderInputField(
          "reps",
          repsValue,
          repsPlaceholder,
          handleRepsChange,
          handleRepsFocus,
          handleRepsBlur,
          repsFocused,
          repsInputRef,
          set.targetReps
        )}

        {/* שינוי RTL: כפתורי הפעולה עברו לסוף (צד שמאל) */}
        <View style={styles.actionsContainer}>
          {/* 🎯 תכונת מצב עריכה: כפתור השלמה מוסתר */}
          {!isEditMode && (
            <TouchableOpacity
              onPress={handleComplete}
              style={styles.actionButton}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityState={{ selected: !!set.completed }}
              accessibilityLabel={
                set.completed ? "בטל השלמת סט" : "סמן סט כהושלם"
              }
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
          )}

          {/* 🛠️ אייקונים למצב עריכה - פעולות מאוחדות */}
          {isEditMode && (
            <>
              {/* שכפל סט */}
              <TouchableOpacity
                onPress={() => {
                  dlog("duplicateSet", { setNumber });
                  onDuplicate?.();
                }}
                style={styles.actionButton}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel="שכפל סט"
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={18}
                  color={theme.colors.success}
                />
              </TouchableOpacity>

              {/* 🏗️ חצי מעלית מאוחדים - עיצוב אלגנטי עם משולשים */}
              <View style={styles.elevatorButtonsContainer}>
                {/* רכיב עזר לכפתורי מעלית */}
                {!isFirst && (
                  <TouchableOpacity
                    onPress={() => {
                      dlog("moveUp", { setNumber });
                      onMoveUp?.();
                    }}
                    style={[styles.elevatorButton, styles.elevatorButtonUp]}
                    hitSlop={ELEVATOR_HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel="הזז סט למעלה"
                  >
                    <MaterialCommunityIcons
                      name="triangle"
                      size={12}
                      color={theme.colors.primary}
                      style={{ transform: [{ rotate: "0deg" }] }} // 🔺 למעלה
                    />
                  </TouchableOpacity>
                )}

                {!isLast && (
                  <TouchableOpacity
                    onPress={() => {
                      dlog("moveDown", { setNumber });
                      onMoveDown?.();
                    }}
                    style={[styles.elevatorButton, styles.elevatorButtonDown]}
                    hitSlop={ELEVATOR_HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel="הזז סט למטה"
                  >
                    <MaterialCommunityIcons
                      name="triangle"
                      size={12}
                      color={theme.colors.primary}
                      style={{ transform: [{ rotate: "180deg" }] }} // 🔻 למטה
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* כפתור מחיקה - רק במצב עריכה */}
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.actionButton, styles.actionButtonDanger]}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel="מחק סט"
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
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
    marginStart: 8,
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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "400",
    color: theme.colors.textSecondary + "80",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "transparent",
    flex: 1,
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
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 80,
  },
  actionButton: {
    padding: 8,
  },
  wrapper: { marginBottom: 8 },
  actionButtonDanger: {
    backgroundColor: theme.colors.error + "10",
    borderRadius: 6,
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
  elevatorButtonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 2,
    marginHorizontal: 4,
  },
  elevatorButton: {
    width: 20,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    marginVertical: 1,
  },
  elevatorButtonUp: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  elevatorButtonDown: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
});

export default React.memo(SetRow);
