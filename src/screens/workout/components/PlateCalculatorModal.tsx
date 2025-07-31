/**
 * @file src/screens/workout/components/PlateCalculatorModal.tsx
 * @description מודל מחשבון פלטות משופר
 * English: Improved plate calculator modal
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

interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight?: number;
}

// הגדרות המחשבון
// Calculator settings
const BAR_WEIGHT = 20;
const WEIGHT_INCREMENT = 2.5;

// פונקציית עזר לקבלת צבע הפלטה
// Helper function to get plate color
const getPlateColor = (weight: number): string => {
  const plateInfo = PLATE_WEIGHTS.find((plate) => plate.weight === weight);
  return plateInfo?.color || theme.colors.primary;
};

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  visible,
  onClose,
  currentWeight = 60,
}) => {
  const [targetWeight, setTargetWeight] = useState(currentWeight);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Optimized weight change handler
  const handleWeightChange = useCallback((increment: number) => {
    setTargetWeight((prev) => Math.max(0, prev + increment));
  }, []);

  // Optimized text input handler
  const handleTextChange = useCallback((text: string) => {
    const numericValue = parseFloat(text) || 0;
    setTargetWeight(numericValue);
  }, []);

  useEffect(() => {
    if (visible) {
      setTargetWeight(currentWeight);
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, currentWeight, slideAnim]);

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

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel="מחשבון פלטות למשקולות"
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="סגור מחשבון פלטות"
              >
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
              <Text style={styles.title}>מחשבון פלטות</Text>
              <View style={{ width: 28 }} />
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
                />
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => handleWeightChange(-WEIGHT_INCREMENT)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="הפחת משקל"
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.barVisualization}>
                <View style={styles.barEnd} />
                {plateCalculation.plates.map((p, i) => (
                  <View
                    key={`l-${i}`}
                    style={[
                      styles.plate,
                      {
                        backgroundColor: getPlateColor(p),
                        height: 40 + p * 2.5,
                        borderWidth: p === 5 ? 1 : 0,
                      },
                    ]}
                  />
                ))}
                <View style={styles.bar} />
                {[...plateCalculation.plates].reverse().map((p, i) => (
                  <View
                    key={`r-${i}`}
                    style={[
                      styles.plate,
                      {
                        backgroundColor: getPlateColor(p),
                        height: 40 + p * 2.5,
                        borderWidth: p === 5 ? 1 : 0,
                      },
                    ]}
                  />
                ))}
                <View style={styles.barEnd} />
              </View>

              <View style={styles.summary}>
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
                  <Text style={styles.warningText}>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    ...theme.shadows.large,
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
});
