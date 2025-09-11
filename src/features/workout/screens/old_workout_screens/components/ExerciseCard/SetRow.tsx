/**
 * @file src/screens/workout/components/ExerciseCard/SetRow.tsx
 * @description שורת סט בודדת עם ממשק עריכה מתקדם והתאמה מלאה ל-RTL
 * @version 3.2.0 - Enhanced with premium design patterns
 * @updated 2025-08-24 Premium UI enhancements with advanced design patterns
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
  Vibration,
  AccessibilityInfo,
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
  DEBOUNCE_DELAY: 500,
  GLOW_PULSE: 2000,
  MICRO_BOUNCE: 150,
  SHIMMER: 1500,
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

// Validation rules for inputs
const VALIDATION_RULES = {
  WEIGHT: {
    MIN: 0.1,
    MAX: 1000,
    DECIMAL_PLACES: 2,
  },
  REPS: {
    MIN: 1,
    MAX: 999,
  },
} as const;

// Quick action increments
const QUICK_INCREMENTS = {
  WEIGHT: [1.25, 2.5, 5, 10],
  REPS: [1, 2, 5],
} as const;

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const ELEVATOR_HIT_SLOP = { top: 5, bottom: 5, left: 5, right: 5 };

// Common shadow styles to reduce duplication
const COMMON_SHADOWS = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
  },
  minimal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0.5,
  },
} as const;

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
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // רפרנסים לשדות הקלט
  const weightInputRef = useRef<TextInput>(null);
  const repsInputRef = useRef<TextInput>(null);

  // States for enhanced features
  const [showTargetHint, setShowTargetHint] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);
  const [repsFocused, setRepsFocused] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Glow animation for active state
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: ANIMATION_DURATIONS.GLOW_PULSE,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: ANIMATION_DURATIONS.GLOW_PULSE,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isActive, glowAnim]);

  // Shimmer effect for completed sets
  useEffect(() => {
    if (set.completed) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: ANIMATION_DURATIONS.SHIMMER,
          useNativeDriver: true,
        })
      ).start();
    } else {
      shimmerAnim.setValue(0);
    }
  }, [set.completed, shimmerAnim]);

  useEffect(() => {
    Animated.timing(checkAnim, {
      toValue: set.completed ? 1 : 0,
      duration: ANIMATION_DURATIONS.CHECK,
      useNativeDriver: true,
    }).start();
  }, [set.completed, setNumber, set.actualWeight, set.actualReps, checkAnim]);

  // Enhanced input validation
  const validateInput = useCallback(
    (value: string, type: "weight" | "reps"): boolean => {
      if (value === "") return true; // Allow empty values

      const numValue =
        type === "weight" ? parseFloat(value) : parseInt(value, 10);

      if (isNaN(numValue)) {
        setInputError(
          `${type === "weight" ? "משקל" : "חזרות"} חייב להיות מספר`
        );
        return false;
      }

      if (type === "weight") {
        const { MIN, MAX } = VALIDATION_RULES.WEIGHT;
        if (numValue < MIN || numValue > MAX) {
          setInputError(`משקל חייב להיות בין ${MIN} ל-${MAX} ק״ג`);
          return false;
        }
      } else {
        const { MIN, MAX } = VALIDATION_RULES.REPS;
        if (numValue < MIN || numValue > MAX) {
          setInputError(`חזרות חייבות להיות בין ${MIN} ל-${MAX}`);
          return false;
        }
      }

      setInputError(null);
      return true;
    },
    []
  );

  // Debounced update function
  const debouncedUpdate = useCallback(
    (updates: Partial<ExtendedSet>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        wrappedOnUpdate(updates);
        debounceTimerRef.current = null;
      }, ANIMATION_DURATIONS.DEBOUNCE_DELAY);
    },
    [wrappedOnUpdate]
  );

  // Quick increment/decrement functions
  const adjustWeight = useCallback(
    (increment: number) => {
      const currentWeight = set.actualWeight || set.targetWeight || 0;
      const newWeight = Math.max(0, currentWeight + increment);

      if (validateInput(newWeight.toString(), "weight")) {
        debouncedUpdate({ actualWeight: newWeight });

        // Micro animation for feedback
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: ANIMATION_DURATIONS.MICRO_BOUNCE,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: isActive ? 1.05 : 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();

        // Haptic feedback
        if (Platform.OS === "ios") {
          triggerVibration("short");
        }

        // Accessibility announcement
        AccessibilityInfo.announceForAccessibility(
          `משקל עודכן ל-${newWeight} קילוגרם`
        );
      }
    },
    [
      set.actualWeight,
      set.targetWeight,
      validateInput,
      debouncedUpdate,
      scaleAnim,
      isActive,
    ]
  );

  const adjustReps = useCallback(
    (increment: number) => {
      const currentReps = set.actualReps || set.targetReps || 0;
      const newReps = Math.max(0, currentReps + increment);

      if (validateInput(newReps.toString(), "reps")) {
        debouncedUpdate({ actualReps: newReps });

        // Micro animation for feedback
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: ANIMATION_DURATIONS.MICRO_BOUNCE,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: isActive ? 1.05 : 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();

        // Haptic feedback
        if (Platform.OS === "ios") {
          triggerVibration("short");
        }

        // Accessibility announcement
        AccessibilityInfo.announceForAccessibility(`חזרות עודכנו ל-${newReps}`);
      }
    },
    [
      set.actualReps,
      set.targetReps,
      validateInput,
      debouncedUpdate,
      scaleAnim,
      isActive,
    ]
  );

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

  // Input change handlers with validation
  const handleWeightChange = useCallback(
    (value: string) => {
      if (validateInput(value, "weight")) {
        const parsed = parseNumeric(value, false);
        if (parsed !== undefined) {
          debouncedUpdate({ actualWeight: parsed });
        }
      }
      dlog("weightChange", { value, valid: validateInput(value, "weight") });
    },
    [validateInput, debouncedUpdate]
  );

  const handleRepsChange = useCallback(
    (value: string) => {
      if (validateInput(value, "reps")) {
        const parsed = parseNumeric(value, true);
        if (parsed !== undefined) {
          debouncedUpdate({ actualReps: parsed });
        }
      }
      dlog("repsChange", { value, valid: validateInput(value, "reps") });
    },
    [validateInput, debouncedUpdate]
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

  const handleComplete = useCallback(() => {
    // אנימציית לחיצה עם משוב מגע
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // ויברציה קלה למשוב
    if (Platform.OS !== "web") {
      Vibration.vibrate(10);
    }

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
  }, [
    set.completed,
    set.actualWeight,
    set.targetWeight,
    set.actualReps,
    set.targetReps,
    setNumber,
    wrappedOnUpdate,
    onComplete,
    scaleAnim,
  ]);

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
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // Clear error messages after a delay
  useEffect(() => {
    if (inputError) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setInputError(null);
      }, 3000);
    }
  }, [inputError]);

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
      <View style={[styles.inputContainer, focused && styles.focusedContainer]}>
        {/* אייקון לשדה */}
        <MaterialCommunityIcons
          name={type === "weight" ? "weight-kilogram" : "repeat"}
          size={16}
          color={theme.colors.textSecondary}
          style={styles.inputIcon}
        />

        <TouchableOpacity
          style={styles.inputTouchable}
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
        </TouchableOpacity>

        {/* יחידת מידה */}
        <Text style={styles.inputUnit}>
          {type === "weight" ? "ק״ג" : "חזרות"}
        </Text>

        {showTargetHint && typeof targetValue === "number" && (
          <Text style={styles.targetHint}>יעד: {targetValue}</Text>
        )}
      </View>
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
          {
            transform: [{ scale: scaleAnim }],
          },
          // Dynamic glow effect for active state
          isActive && {
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
      >
        {/* Shimmer overlay for completed sets */}
        {set.completed && (
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.1, 0],
                }),
                transform: [
                  {
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-200, 200],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        {/* Glass effect overlay for premium look */}
        <View style={styles.glassOverlay} />

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
                  {
                    rotate: prBounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "10deg"],
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
            <Text style={styles.prText}>PR!</Text>
          </Animated.View>
        )}

        {/* שינוי RTL: מספר הסט בצד ימין עם עיצוב מעגלי */}
        <View style={styles.setNumber}>
          <View
            style={[
              styles.setNumberBadge,
              set.type === "warmup" && styles.warmupBadge,
              set.completed && styles.completedBadge,
            ]}
          >
            <Text
              style={[
                styles.setNumberText,
                set.completed && styles.completedNumberText,
              ]}
            >
              {setNumber}
            </Text>
          </View>
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

        {/* שדות קלט עם כפתורי +/- */}
        <View style={styles.inputSection}>
          {/* Weight input with quick adjustments */}
          <View style={styles.inputWithControls}>
            <View style={styles.quickButtons}>
              {QUICK_INCREMENTS.WEIGHT.map((increment) => (
                <TouchableOpacity
                  key={`weight-minus-${increment}`}
                  onPress={() => adjustWeight(-increment)}
                  style={[styles.quickButton, styles.quickButtonMinus]}
                  accessibilityLabel={`הפחת ${increment} ק״ג`}
                >
                  <Text style={styles.quickButtonText}>-{increment}</Text>
                </TouchableOpacity>
              ))}
            </View>

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

            <View style={styles.quickButtons}>
              {QUICK_INCREMENTS.WEIGHT.map((increment) => (
                <TouchableOpacity
                  key={`weight-plus-${increment}`}
                  onPress={() => adjustWeight(increment)}
                  style={[styles.quickButton, styles.quickButtonPlus]}
                  accessibilityLabel={`הוסף ${increment} ק״ג`}
                >
                  <Text style={styles.quickButtonText}>+{increment}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reps input with quick adjustments */}
          <View style={styles.inputWithControls}>
            <View style={styles.quickButtons}>
              {QUICK_INCREMENTS.REPS.map((increment) => (
                <TouchableOpacity
                  key={`reps-minus-${increment}`}
                  onPress={() => adjustReps(-increment)}
                  style={[styles.quickButton, styles.quickButtonMinus]}
                  accessibilityLabel={`הפחת ${increment} חזרות`}
                >
                  <Text style={styles.quickButtonText}>-{increment}</Text>
                </TouchableOpacity>
              ))}
            </View>

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

            <View style={styles.quickButtons}>
              {QUICK_INCREMENTS.REPS.map((increment) => (
                <TouchableOpacity
                  key={`reps-plus-${increment}`}
                  onPress={() => adjustReps(increment)}
                  style={[styles.quickButton, styles.quickButtonPlus]}
                  accessibilityLabel={`הוסף ${increment} חזרות`}
                >
                  <Text style={styles.quickButtonText}>+{increment}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Error display */}
          {inputError && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color={theme.colors.error}
              />
              <Text style={styles.errorText}>{inputError}</Text>
            </View>
          )}
        </View>

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
              <Animated.View
                style={[
                  styles.checkCircle,
                  set.completed && styles.checkCircleCompleted,
                  {
                    transform: [
                      {
                        scale: checkAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Animated.View style={{ opacity: checkAnim }}>
                  <MaterialCommunityIcons
                    name={set.completed ? "check-circle" : "circle-outline"}
                    size={24}
                    color={
                      set.completed ? theme.colors.white : theme.colors.success
                    }
                  />
                </Animated.View>
              </Animated.View>
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
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    // Premium shadows with multiple layers
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 4,
    // Subtle gradient-like border effect
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.cardBorder + "60",
    // Overflow for shimmer effect
    overflow: "hidden",
    position: "relative",
  },
  completedContainer: {
    backgroundColor: theme.colors.success + "12",
    borderColor: theme.colors.success + "40",
    // Enhanced completed state with subtle gradient
    shadowColor: theme.colors.success,
    shadowOpacity: 0.15,
    // Subtle inner glow effect
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.success + "80",
  },
  activeContainer: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "08",
    // Premium active state with enhanced glow
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.2,
    elevation: 6,
    // Glass-like border effect
    borderWidth: 1.5,
    borderRightWidth: 3,
    borderRightColor: theme.colors.primary + "60",
  },
  // New glass effect overlay
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  // Shimmer effect for completed sets
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: -100,
    right: -100,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    transform: [{ rotate: "15deg" }],
    width: 50,
  },
  setNumber: {
    alignItems: "center",
    marginStart: 10,
  },
  setNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary + "50",
    // Enhanced badge shadows with gradient effect
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    // Subtle inner shadow effect
    position: "relative",
  },
  warmupBadge: {
    backgroundColor: theme.colors.warning + "15",
    borderColor: theme.colors.warning + "50",
    shadowColor: theme.colors.warning,
  },
  completedBadge: {
    backgroundColor: theme.colors.success + "25",
    borderColor: theme.colors.success + "70",
    shadowColor: theme.colors.success,
    // Enhanced completed badge with glow
    borderWidth: 2.5,
    shadowOpacity: 0.3,
  },
  setNumberText: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.primary,
    lineHeight: 20,
  },
  completedNumberText: {
    color: theme.colors.success,
  },
  setTypeText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 3,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  previousContainer: {
    flex: 1.2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    // Enhanced with subtle background
    backgroundColor: theme.colors.background + "30",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder + "40",
  },
  previousText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  trendIcon: {
    marginTop: 1,
    ...COMMON_SHADOWS.light,
    shadowRadius: 1,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
    position: "relative",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  inputIcon: {
    marginLeft: 6,
  },
  inputTouchable: {
    flex: 1,
  },
  inputUnit: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    marginRight: 6,
    lineHeight: 16,
  },
  focusedContainer: {
    transform: [{ scale: 1.03 }],
  },
  focusedInput: {
    color: theme.colors.text,
    fontWeight: "700",
    borderColor: theme.colors.primary + "60",
    backgroundColor: theme.colors.background,
    // Enhanced focus state
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: theme.colors.background + "90",
    borderRadius: 12,
    paddingVertical: 14,
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.textSecondary + "90",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "transparent",
    flex: 1,
    minHeight: 48,
    lineHeight: 20,
    // Enhanced input styling with glass effect
    ...COMMON_SHADOWS.light,
    // Subtle inner border effect
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  completedInput: {
    backgroundColor: theme.colors.background + "70",
    color: theme.colors.textSecondary + "80",
  },
  targetHint: {
    position: "absolute",
    bottom: -18,
    alignSelf: "center",
    fontSize: 11,
    color: theme.colors.primary,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: "600",
    // Enhanced hint styling
    ...COMMON_SHADOWS.light,
  },
  actionsContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 88,
    gap: 4,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    // Enhanced button styling with glass effect
    backgroundColor: theme.colors.background + "40",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder + "30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  wrapper: {
    marginBottom: 14,
    paddingHorizontal: 3,
    // Enhanced wrapper with subtle shadow
    ...COMMON_SHADOWS.subtle,
  },
  actionButtonDanger: {
    backgroundColor: theme.colors.error + "12",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    // Enhanced danger button
    shadowColor: theme.colors.error,
    shadowOpacity: 0.1,
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    // Enhanced check circle
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkCircleCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
    // Enhanced completed state
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  prBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    // Enhanced PR badge with premium styling
    backgroundColor: theme.colors.warning + "20",
    borderRadius: 12,
    padding: 6,
    paddingHorizontal: 8,
    shadowColor: theme.colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.warning + "40",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  prText: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.warning,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: 3,
    marginHorizontal: 4,
    // Enhanced elevator container with glass effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    // Subtle gradient background
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  elevatorButton: {
    width: 22,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    marginVertical: 1,
    // Enhanced elevator buttons
    ...COMMON_SHADOWS.minimal,
  },
  elevatorButtonUp: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  elevatorButtonDown: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  // New styles for enhanced functionality
  inputSection: {
    flex: 2,
    gap: theme.spacing.sm,
  },
  inputWithControls: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  quickButtons: {
    flexDirection: "column",
    gap: 2,
  },
  quickButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    minWidth: 24,
    alignItems: "center",
    backgroundColor: theme.colors.background,
    // Enhanced quick buttons with micro shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  quickButtonPlus: {
    borderColor: theme.colors.success + "40",
    backgroundColor: theme.colors.success + "10",
    // Enhanced plus button
    shadowColor: theme.colors.success,
    shadowOpacity: 0.1,
  },
  quickButtonMinus: {
    borderColor: theme.colors.error + "40",
    backgroundColor: theme.colors.error + "10",
    // Enhanced minus button
    shadowColor: theme.colors.error,
    shadowOpacity: 0.1,
  },
  quickButtonText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    letterSpacing: 0.2,
  },
  errorContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.error + "10",
    borderRadius: 6,
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: theme.colors.error,
    fontWeight: "500",
  },
});

export default React.memo(SetRow);
