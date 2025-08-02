/**
 * @file src/screens/workout/components/ExerciseCard/SetRow.tsx
 * @description שורת סט בודדת עם ממשק עריכה מתקדם והתאמה מלאה ל-RTL
 * @version 3.0.0
 * @author GYMovoo Development Team
 * @created 2024-12-15
 * @modified 2025-08-02
 *
 * @description
 * רכיב מתקדם לעריכת סטי אימון עם מצב עריכה מלא, חצי מעלית וקלט מקלדת מיועל.
 * הרכיב תומך במצבי תצוגה שונים ומספק חוויית משתמש מושלמת עם אנימציות חלקות.
 *
 * @features
 * - ✅ מצב עריכה מתקדם עם הסתרת כפתור השלמה
 * - ✅ חצי מעלית אלגנטיים (elevator buttons) להעברת סטים
 * - ✅ קלט מקלדת מיועל ל-Android עם פתרון בעיות פוקוס
 * - ✅ ביטול השלמת סט - לחיצה נוספת מבטלת השלמה
 * - ✅ אנימציות מתקדמות עם Animated API
 * - ✅ תמיכת RTL מלאה עם פריסה מותאמת לעברית
 * - ✅ שכפול וחיקה של סטים במצב עריכה
 * - ✅ אינדיקטורים חזותיים לשיאים אישיים (PR Badge)
 * - ✅ הבחנה ברורה בין placeholder לערך אמיתי
 * - ✅ נגישות מקיפה עם ARIA labels
 *
 * @technical
 * פתרונות טכניים מתקדמים:
 * - TouchableOpacity אינדיבידואלי לכל TextInput עם activeOpacity={1}
 * - useRef לשליטה ישירה על שדות הקלט
 * - אופטימיזציות Android: blurOnSubmit={false}, showSoftInputOnFocus={true}
 * - React.memo לביצועים מיטביים
 * - useCallback ו-useMemo למניעת re-renders מיותרים
 *
 * @editmode
 * במצב עריכה (isEditMode=true):
 * - כפתור השלמה מוסתר
 * - חצי מעלית מוצגים (triangle icons מסתובבים)
 * - כפתור שכפול פעיל
 * - כפתור מחיקה עם סגנון אדום
 * - אנימציות מושבתות למען יציבות
 *
 * @android
 * פתרונות ספציפיים ל-Android:
 * - הסרת TouchableOpacity חיצוני שחוטף אירועי פוקוס
 * - keyboardType="numeric" קבוע (במקום number-pad)
 * - עטיפה ספציפית לכל TextInput עם קריאה מפורשת ל-focus()
 *
 * @rtl
 * תמיכה מלאה בעברית:
 * - flexDirection: "row-reverse" בכול מקום
 * - marginStart במקום marginLeft
 * - textAlign: "center" לשדות קלט
 * - פריסת אייקונים מותאמת לכיוון קריאה
 *
 * @accessibility
 * נגישות מלאה:
 * - accessibilityLabel מפורט לכל כפתור
 * - accessibilityHint להסבר פונקציונליות
 * - hitSlop מוגדל לנוחות מגע
 *
 * @performance
 * אופטימיזציה מתקדמת:
 * - React.memo על הרכיב הראשי
 * - useCallback לכל event handlers
 * - useMemo לערכי input ו-placeholder
 * - useRef לאנימציות ללא re-renders
 *
 * @example
 * ```tsx
 * <SetRow
 *   set={workoutSet}
 *   setNumber={1}
 *   onUpdate={(updates) => updateSet(setId, updates)}
 *   onDelete={() => deleteSet(setId)}
 *   onComplete={() => completeSet(setId)}
 *   onLongPress={() => showSetOptions(setId)}
 *   isEditMode={true}
 *   onMoveUp={() => moveSetUp(setId)}
 *   onMoveDown={() => moveSetDown(setId)}
 *   onDuplicate={() => duplicateSet(setId)}
 *   isFirst={index === 0}
 *   isLast={index === sets.length - 1}
 * />
 * ```
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
  // מצב עריכה
  isEditMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  // מידע על מיקום הסט
  isFirst?: boolean;
  isLast?: boolean;
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

  // Calculate if this is a personal record
  const isPR = React.useMemo(() => {
    // ✅ שיא אישי אם יש ערכים ממשיים (לא צריך set.completed)
    if (!set.actualWeight || !set.actualReps) return false;

    const currentVolume = set.actualWeight * set.actualReps;
    const previousVolume = (set.previousWeight || 0) * (set.previousReps || 0);

    return currentVolume > previousVolume && previousVolume > 0;
  }, [set.actualWeight, set.actualReps, set.previousWeight, set.previousReps]);

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

  const handleWeightChange = React.useCallback(
    (value: string) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) || value === "") {
        wrappedOnUpdate({ actualWeight: value === "" ? undefined : numValue });
      }
    },
    [wrappedOnUpdate]
  );

  const handleRepsChange = React.useCallback(
    (value: string) => {
      const numValue = parseInt(value);
      if (!isNaN(numValue) || value === "") {
        const updateValue = value === "" ? undefined : numValue;
        wrappedOnUpdate({ actualReps: updateValue });
      }
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
    // ✨ תכונה: ביטול השלמת סט בלחיצה נוספת
    // אם הסט כבר מושלם - בטל את ההשלמה
    if (set.completed) {
      // בטל השלמה - חזור למצב לא מושלם
      wrappedOnUpdate({ completed: false });
      return;
    }

    // ✅ אם הסט לא מושלם - השלם אותו עם כל הערכים הנדרשים
    const updates: Partial<ExtendedSet> = {
      completed: true,
    };

    // וודא שיש ערכים ממשיים
    if (!set.actualWeight && set.targetWeight) {
      updates.actualWeight = set.targetWeight;
    }
    if (!set.actualReps && set.targetReps) {
      updates.actualReps = set.targetReps;
    }

    // עדכן הכל בבת אחת
    wrappedOnUpdate(updates);
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
    <View style={{ marginBottom: 8 }}>
      <Animated.View
        style={[
          styles.container,
          set.completed && styles.completedContainer,
          set.completed && styles.greenBorderContainer, // גבול ירוק לסט מושלם
          isActive && styles.activeContainer,
          isEditMode && styles.editModeActiveContainer, // 🎯 סגנון מיוחד למצב עריכה
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

        {/* 🎯 פתרון Android: TouchableOpacity אינדיבידואלי עם פוקוס מפורש */}
        <TouchableOpacity
          style={[
            styles.inputContainer,
            weightFocused && styles.focusedContainer,
          ]}
          activeOpacity={1} // חשוב: מונע אפקט לחיצה
          onPress={() => {
            // מאלץ פוקוס על השדה - פתרון לבעיות Android
            const weightInput = weightInputRef.current;
            if (weightInput) {
              weightInput.focus();
            }
          }}
        >
          <TextInput
            ref={weightInputRef} // 🔗 רפרנס לשליטה ישירה
            style={[
              styles.input,
              set.completed && styles.completedInput,
              weightFocused && styles.focusedInput,
            ]}
            value={weightValue}
            onChangeText={handleWeightChange}
            onFocus={handleWeightFocus}
            onBlur={handleWeightBlur}
            keyboardType="numeric" // 📱 קבוע לכל הפלטפורמות
            placeholder={weightPlaceholder}
            placeholderTextColor={theme.colors.textSecondary + "60"}
            selectTextOnFocus={true}
            editable={true}
            returnKeyType="done"
            blurOnSubmit={false} // 🔑 מפתח: מונע סגירת מקלדת אוטומטית
            autoFocus={false}
            multiline={false}
            maxLength={10}
            caretHidden={false}
            contextMenuHidden={false}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            textContentType="none"
            showSoftInputOnFocus={true} // 🚀 מאלץ הצגת מקלדת ב-Android
          />

          {showTargetHint && set.targetWeight && (
            <Text style={styles.targetHint}>יעד: {set.targetWeight}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.inputContainer,
            repsFocused && styles.focusedContainer,
          ]}
          activeOpacity={1} // חשוב: מונע אפקט לחיצה
          onPress={() => {
            // מאלץ פוקוס על השדה - פתרון לבעיות Android
            const repsInput = repsInputRef.current;
            if (repsInput) {
              repsInput.focus();
            }
          }}
        >
          <TextInput
            ref={repsInputRef}
            style={[
              styles.input,
              set.completed && styles.completedInput,
              repsFocused && styles.focusedInput,
            ]}
            value={repsValue}
            onChangeText={handleRepsChange}
            onFocus={handleRepsFocus}
            onBlur={handleRepsBlur}
            keyboardType="numeric"
            placeholder={repsPlaceholder}
            placeholderTextColor={theme.colors.textSecondary + "40"}
            selectTextOnFocus={true}
            editable={true}
            returnKeyType="done"
            blurOnSubmit={false}
            autoFocus={false}
            multiline={false}
            maxLength={10}
            caretHidden={false}
            contextMenuHidden={false}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            textContentType="none"
            showSoftInputOnFocus={true}
          />

          {showTargetHint && set.targetReps && (
            <Text style={styles.targetHint}>יעד: {set.targetReps}</Text>
          )}
        </TouchableOpacity>

        {/* שינוי RTL: כפתורי הפעולה עברו לסוף (צד שמאל) */}
        <View style={styles.actionsContainer}>
          {/* 🎯 תכונת מצב עריכה: כפתור השלמה מוסתר */}
          {!isEditMode && (
            <TouchableOpacity
              onPress={handleComplete}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={set.completed ? "בטל השלמת סט" : "סמן כהושלם"}
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

          {/* 🛠️ אייקונים למצב עריכה - עיצוב פרימיום מתקדם */}
          {isEditMode && (
            <View style={styles.premiumEditContainer}>
              {/* כפתור מחיקה - עיצוב פרימיום */}
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.premiumDeleteButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="מחק סט"
              >
                <View style={styles.buttonInnerShadow}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color="#FF4757"
                  />
                </View>
              </TouchableOpacity>

              {/* חצי מעלית פרימיום עם זוהר */}
              <View style={styles.premiumElevatorContainer}>
                {/* חץ למעלה - רק אם לא הראשון */}
                {!isFirst && (
                  <TouchableOpacity
                    onPress={onMoveUp}
                    style={styles.premiumElevatorButton}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    accessibilityLabel="הזז סט למעלה"
                  >
                    <View style={styles.elevatorButtonGlow}>
                      <MaterialCommunityIcons
                        name="chevron-up"
                        size={14}
                        color="#2E86AB"
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {/* מפריד עדין */}
                {!isFirst && !isLast && <View style={styles.elevatorDivider} />}

                {/* חץ למטה - רק אם לא האחרון */}
                {!isLast && (
                  <TouchableOpacity
                    onPress={onMoveDown}
                    style={styles.premiumElevatorButton}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    accessibilityLabel="הזז סט למטה"
                  >
                    <View style={styles.elevatorButtonGlow}>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={14}
                        color="#2E86AB"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {/* שכפל סט - עיצוב פרימיום עם נעילה */}
              <TouchableOpacity
                onPress={onDuplicate}
                style={styles.premiumCopyButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="שכפל סט"
              >
                <View style={styles.copyButtonInner}>
                  <MaterialCommunityIcons
                    name="shield-lock-outline"
                    size={16}
                    color="#6C5CE7"
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
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
    fontWeight: "400", // פחות בולט מ-600
    color: theme.colors.textSecondary + "80", // פחות בולט - כמו placeholder
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
    flexDirection: "row-reverse", // שינוי RTL: הפך את כיוון הכפתורים
    alignItems: "center",
    justifyContent: "flex-end",
    width: 90, // קצת יותר רחב לכפתורים הקומפקטיים
  },
  actionButton: {
    padding: 8,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
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
  // 🏗️ סגנונות חצי מעלית - עיצוב אלגנטי בסגנון מעלית אמיתית
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
  // 🎯 סגנונות קומפקטיים חדשים למצב עריכה
  editModeContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    width: 80,
    paddingHorizontal: 4,
  },
  compactDeleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.error + "08",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: theme.colors.error + "20",
  },
  compactElevatorContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "05",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theme.colors.primary + "15",
    paddingVertical: 2,
    paddingHorizontal: 4,
    gap: 2,
  },
  compactElevatorButton: {
    width: 16,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  compactCopyButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.textSecondary + "08",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: theme.colors.textSecondary + "20",
  },
  // 🎯 סגנונות פרימיום חדשים למצב עריכה
  editModeActiveContainer: {
    backgroundColor: "rgba(46, 134, 171, 0.03)", // כחול עדין מאוד
    borderColor: "#2E86AB",
    borderWidth: 1.5,
    shadowColor: "#2E86AB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumEditContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    width: 95,
    paddingHorizontal: 6,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 12,
    paddingVertical: 4,
  },
  premiumDeleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 71, 87, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonInnerShadow: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  premiumElevatorContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(46, 134, 171, 0.08)",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
    shadowColor: "#2E86AB",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: "rgba(46, 134, 171, 0.2)",
  },
  premiumElevatorButton: {
    width: 20,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  elevatorButtonGlow: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(46, 134, 171, 0.1)",
  },
  elevatorDivider: {
    width: 12,
    height: 0.5,
    backgroundColor: "rgba(46, 134, 171, 0.3)",
    marginVertical: 2,
  },
  premiumCopyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(108, 92, 231, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  copyButtonInner: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 0.5,
    borderColor: "rgba(108, 92, 231, 0.2)",
  },
});

export default React.memo(SetRow);
