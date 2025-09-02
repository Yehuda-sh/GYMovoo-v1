/**
 * @file src/screens/workout/components/PlateCalculatorModal.tsx
 * @description מודל מחשבון פלטות משופר - רכיב מתמחה מתקדם למשקולות
 * @description English: Improved plate calculator modal - Advanced specialized component for weightlifting
 *
 * ✅ ACTIVE & SPECIALIZED: רכיב מתמחה מתקדם עם אלגוריתם חישוב פלטות
 * - Specialized weightlifting tool with plate calculation algorithm
 * - Interactive bar visualization with dynamic plate rendering
 * - Performance optimized with useCallback and useMemo patterns
 * - Complete accessibility support and RTL compliance
 * - Advanced user interactions with haptic feedback
 * - Reduced motion support for accessibility preferences
 *
 * @features
 * - ✅ אלגוריתם חישוב פלטות אוטומטי ומדויק
 * - ✅ ויזואליזציה אינטראקטיבית של מוט ופלטות
 * - ✅ כפתורי התאמה מהירה (+/-2.5, 5, 10)
 * - ✅ קלט טקסט דינמי עם validation
 * - ✅ אנימציות חלקות עם תמיכה ב-reduced motion
 * - ✅ Haptic feedback על פעולות משתמש
 * - ✅ תמיכה מלאה ב-RTL ונגישות
 * - ✅ חישוב פער משקל ואזהרות משתמש
 * - ✅ תצוגת צבעי פלטות סטנדרטיים
 * - ✅ Callback functions לעדכונים חיים
 *
 * @algorithm
 * - משקל בר: 20 ק"ג (BAR_WEIGHT)
 * - גידול מינימלי: 2.5 ק"ג (WEIGHT_INCREMENT)
 * - חישוב פלטות: (משקל יעד - משקל בר) / 2 = משקל לכל צד
 * - התאמה לפלטות זמינות מ-PLATE_WEIGHTS constants
 * - תצוגת פער אם לא ניתן להשיג משקל מדויק
 *
 * @performance
 * - useCallback למניעת re-renders של handlers
 * - useMemo לחישובי פלטות ומערכי כפתורים
 * - אנימציות מותנות לפי העדפות נגישות
 * - Dynamic styling functions מחוץ ל-JSX
 * - Optimized plate calculation algorithm
 *
 * @accessibility
 * - תמיכה מלאה ב-screen readers
 * - AccessibilityRole מדויק לכל אלמנט
 * - Accessibility hints מפורטים
 * - תמיכה ב-reduced motion
 * - RTL support מלא עם writingDirection
 *
 * @integrations
 * - PLATE_WEIGHTS: קבועי משקלי פלטות וצבעים
 * - triggerVibration: משוב הפטי על פעולות
 * - theme system: שילוב מושלם עם מערכת העיצוב
 * - Modal patterns: שימוש בתבניות modal סטנדרטיות
 *
 * @updated 2025-08-25 Enhanced documentation and status for audit completion
 */
// cspell:ignore פלטות

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { PLATE_WEIGHTS } from "../utils/workoutConstants";
import { triggerVibration } from "../../../utils/workoutHelpers";
import { CloseButton } from "./shared/CloseButton";

interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight?: number;
  reducedMotion?: boolean;
  testID?: string;
  haptic?: boolean;
  quickIncrements?: number[]; // e.g. [2.5,5,10]
  onWeightChange?: (weight: number) => void; // live update callback
}

// הגדרות המחשבון - קבועים למניעת magic numbers
// Calculator settings - constants to prevent magic numbers
const BAR_WEIGHT = 20;
const WEIGHT_INCREMENT = 2.5;

// פונקציית עזר לקבלת צבע הפלטה מ-PLATE_WEIGHTS
// Helper function to get plate color from PLATE_WEIGHTS constants
const getPlateColor = (weight: number): string => {
  const plateInfo = PLATE_WEIGHTS.find((plate) => plate.weight === weight);
  return plateInfo?.color || theme.colors.primary;
};

// Dynamic plate style generator למניעת inline style objects ב-JSX
const getPlateDynamicStyle = (weight: number) => ({
  backgroundColor: getPlateColor(weight),
  height: 40 + weight * 2.5,
  borderWidth: weight === 5 ? 1 : 0,
});

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  visible,
  onClose,
  currentWeight = 60,
  reducedMotion = false,
  testID = "PlateCalculatorModal",
  haptic = true,
  quickIncrements = [2.5, 5, 10],
  onWeightChange,
}) => {
  const [targetWeight, setTargetWeight] = useState(currentWeight);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Optimized weight change handler עם callback memoization
  const handleWeightChange = useCallback(
    (increment: number) => {
      setTargetWeight((prev) => {
        const next = Math.max(0, prev + increment);
        onWeightChange?.(next);
        if (haptic) triggerVibration(10);
        return next;
      });
    },
    [onWeightChange, haptic]
  );

  // Optimized text input handler עם validation
  const handleTextChange = useCallback(
    (text: string) => {
      const numericValue = parseFloat(text) || 0;
      setTargetWeight(numericValue);
      onWeightChange?.(numericValue);
    },
    [onWeightChange]
  );

  useEffect(() => {
    if (visible) {
      setTargetWeight(currentWeight);
      if (reducedMotion) {
        slideAnim.setValue(0);
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (reducedMotion) {
        slideAnim.setValue(300);
      } else {
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, currentWeight, slideAnim, reducedMotion]);

  const plateCalculation = useMemo(() => {
    const weight = targetWeight || 0;
    if (weight < BAR_WEIGHT)
      return {
        plates: [],
        totalWeight: BAR_WEIGHT,
        remaining: weight - BAR_WEIGHT,
      };

    const weightPerSide = (weight - BAR_WEIGHT) / 2;
    const plates: number[] = [];
    let remaining = weightPerSide;

    // אלגוריתם חישוב פלטות: מפלטות כבדות לקלות
    for (const plate of PLATE_WEIGHTS) {
      const count = Math.floor(remaining / plate.weight);
      for (let i = 0; i < count; i++) {
        plates.push(plate.weight);
      }
      remaining %= plate.weight;
    }
    const calculatedWeight = BAR_WEIGHT + plates.reduce((a, b) => a + b, 0) * 2;
    return {
      plates,
      totalWeight: calculatedWeight,
      remaining: weight - calculatedWeight,
    };
  }, [targetWeight]);

  // Quick adjustment buttons אופטימיזציה (positive then negative)
  const quickButtons = useMemo(() => {
    const positives = quickIncrements;
    const negatives = quickIncrements.map((v) => -v).reverse();
    return { positives, negatives };
  }, [quickIncrements]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel="מחשבון פלטות למשקולות"
      testID={testID}
    >
      <TouchableOpacity
        style={theme.getModalOverlayStyle("bottom")}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            theme.getModalContentStyle("bottom"),
            styles.modalContentBase,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header} accessibilityRole="header">
              <CloseButton
                onPress={onClose}
                size="medium"
                variant="ghost"
                accessibilityLabel="סגור מחשבון פלטות"
                accessibilityHint="הקש כדי לסגור את מחשבון הפלטות"
                testID="plate-calculator-close-button"
              />
              <Text style={styles.title}>מחשבון פלטות</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>משקל יעד</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => handleWeightChange(WEIGHT_INCREMENT)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="הוסף משקל"
                  testID={testID + "-inc"}
                >
                  <Ionicons name="add" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.kgLabel}>ק"ג</Text>
                <TextInput
                  style={styles.input}
                  value={targetWeight.toString()}
                  onChangeText={handleTextChange}
                  keyboardType="numeric"
                  selectTextOnFocus
                  accessibilityLabel="משקל יעד בקילוגרמים"
                  accessibilityHint="הקלד או השתמש בכפתורים לשינוי המשקל"
                  testID={testID + "-input"}
                />
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => handleWeightChange(-WEIGHT_INCREMENT)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="הפחת משקל"
                  testID={testID + "-dec"}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* Quick increments */}
              <View
                style={styles.quickAdjustRow}
                accessibilityRole="adjustable"
                accessibilityLabel="התאמות מהירות למשקל"
              >
                {quickButtons.positives.map((v) => (
                  <TouchableOpacity
                    key={"q+" + v}
                    style={styles.quickAdjustButton}
                    onPress={() => handleWeightChange(v)}
                    accessibilityRole="button"
                    accessibilityLabel={`הוסף ${v} קילוגרם`}
                    testID={`${testID}-qplus-${v}`}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickAdjustText}>+{v}</Text>
                  </TouchableOpacity>
                ))}
                {quickButtons.negatives.map((v) => (
                  <TouchableOpacity
                    key={"q" + v}
                    style={styles.quickAdjustButton}
                    onPress={() => handleWeightChange(v)}
                    accessibilityRole="button"
                    accessibilityLabel={`הפחת ${Math.abs(v)} קילוגרם`}
                    testID={`${testID}-qminus-${Math.abs(v)}`}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickAdjustText}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View
                style={styles.barVisualization}
                accessibilityLabel="הדמיית מוט ופלטות"
                accessibilityRole="image"
              >
                <View style={styles.barEnd} />
                {plateCalculation.plates.map((p, i) => (
                  <View
                    key={`l-${i}`}
                    style={[styles.plate, getPlateDynamicStyle(p)]}
                  />
                ))}
                <View style={styles.bar} />
                {[...plateCalculation.plates].reverse().map((p, i) => (
                  <View
                    key={`r-${i}`}
                    style={[styles.plate, getPlateDynamicStyle(p)]}
                  />
                ))}
                <View style={styles.barEnd} />
              </View>

              <View
                style={styles.summary}
                accessibilityRole="summary"
                accessibilityLabel="סיכום חישוב פלטות"
              >
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>פלטות לכל צד:</Text>
                  <Text style={styles.summaryValue}>
                    {plateCalculation.plates.join(", ") || "ללא"}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>סה"כ משקל מחושב:</Text>
                  <Text style={styles.totalValue}>
                    {plateCalculation.totalWeight.toFixed(2)} ק"ג
                  </Text>
                </View>
                {plateCalculation.remaining !== 0 && (
                  <Text style={styles.warningText} accessibilityRole="alert">
                    {plateCalculation.remaining > 0 ? `* חסר: ` : `* עודף: `}
                    {Math.abs(plateCalculation.remaining).toFixed(2)} ק"ג
                  </Text>
                )}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

PlateCalculatorModal.displayName = "PlateCalculatorModal";

const styles = StyleSheet.create({
  modalContentBase: {
    backgroundColor: theme.colors.background,
    maxHeight: "90%",
  },
  headerSpacer: {
    width: 28,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  inputLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: "row-reverse", // תיקון RTL
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: theme.spacing.sm,
    ...theme.shadows.small,
  },
  incrementButton: {
    padding: theme.spacing.md,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + "10",
    // Enhanced interaction feedback
    transform: [{ scale: 1 }],
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    minWidth: 100,
    writingDirection: "ltr", // Numbers should be LTR
  },
  kgLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.sm,
    writingDirection: "rtl",
  },
  barVisualization: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl,
    minHeight: 150,
  },
  bar: {
    height: 12,
    width: 120,
    backgroundColor: theme.colors.divider,
    zIndex: 1,
  },
  barEnd: {
    height: 22,
    width: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#B8B8B8",
  },
  plate: {
    width: 12,
    borderRadius: 4,
    marginHorizontal: 1,
    borderColor: "#B8B8B8",
    ...theme.shadows.small,
  },
  summary: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  summaryValue: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: "500",
    textAlign: "left",
    writingDirection: "ltr", // Numbers should be LTR
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.xs,
  },
  totalLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.text,
    fontWeight: "bold",
    textAlign: "right",
    writingDirection: "rtl",
  },
  totalValue: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.primary,
    fontWeight: "bold",
    textAlign: "left",
    writingDirection: "ltr", // Numbers should be LTR
  },
  warningText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.warning,
    textAlign: "center",
    writingDirection: "rtl",
    marginTop: theme.spacing.sm,
    fontWeight: "500",
  },
  quickAdjustRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  quickAdjustButton: {
    backgroundColor: theme.colors.primary + "10",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    minWidth: 48,
    alignItems: "center",
  },
  quickAdjustText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
