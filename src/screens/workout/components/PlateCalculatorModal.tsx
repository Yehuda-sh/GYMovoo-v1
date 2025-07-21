/**
 * @file src/screens/workout/components/PlateCalculatorModal.tsx
 * @description מודל מחשבון פלטות משופר
 * English: Improved plate calculator modal
 */
// cspell:ignore פלטות

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight?: number;
}

// הגדרות המחשבון
const PLATE_WEIGHTS = [25, 20, 15, 10, 5, 2.5, 1.25];
const BAR_WEIGHT = 20;
const WEIGHT_INCREMENT = 2.5;

// פונקציית עזר לקבלת צבע הפלטה
const getPlateColor = (weight: number): string => {
  const colors: { [key: number]: string } = {
    25: "#D92D20", // אדום
    20: "#0A70D6", // כחול
    15: "#FDB022", // צהוב
    10: "#12B76A", // ירוק
    5: theme.colors.text, // לבן/שחור
    2.5: "#53389E", // סגול
    1.25: "#667085", // אפור
  };
  return colors[weight] || theme.colors.primary;
};

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  visible,
  onClose,
  currentWeight = 60,
}) => {
  const [targetWeight, setTargetWeight] = useState(currentWeight);
  const slideAnim = useRef(new Animated.Value(300)).current;

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
  }, [visible, currentWeight]);

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
      const count = Math.floor(remaining / plate);
      for (let i = 0; i < count; i++) {
        plates.push(plate);
      }
      remaining %= plate;
    }
    const calculatedWeight = BAR_WEIGHT + plates.reduce((a, b) => a + b, 0) * 2;
    return {
      plates,
      totalWeight: calculatedWeight,
      remaining: weight - calculatedWeight,
    };
  }, [targetWeight]);

  const handleWeightChange = (increment: number) => {
    setTargetWeight((prev) => Math.max(0, prev + increment));
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
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
              <View style={{ width: 28 }} />
              <Text style={styles.title}>מחשבון פלטות</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.inputLabel}>משקל יעד</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => handleWeightChange(-WEIGHT_INCREMENT)}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  value={targetWeight.toString()}
                  onChangeText={(text) =>
                    setTargetWeight(parseFloat(text) || 0)
                  }
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <Text style={styles.kgLabel}>ק"ג</Text>
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => handleWeightChange(WEIGHT_INCREMENT)}
                >
                  <Ionicons name="add" size={24} color={theme.colors.primary} />
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
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
  },
  incrementButton: {
    padding: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    minWidth: 100,
  },
  kgLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
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
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.xs,
  },
  totalLabel: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  warningText: {
    fontSize: 12,
    color: theme.colors.warning,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
});
