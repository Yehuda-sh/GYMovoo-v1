/**
 * @file src/screens/workout/components/PlateCalculatorModal.tsx
 * @description מודל מחשבון פלטות
 * English: Plate calculator modal
 */

import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight?: number;
}

// משקלי פלטות סטנדרטיים
const PLATE_WEIGHTS = [20, 15, 10, 5, 2.5, 1.25, 0.5];
const BAR_WEIGHT = 20;

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  visible,
  onClose,
  currentWeight = 60,
}) => {
  const [targetWeight, setTargetWeight] = useState(currentWeight.toString());

  // חישוב פלטות נדרשות
  const plateCalculation = useMemo(() => {
    const weight = parseFloat(targetWeight) || 0;
    if (weight <= BAR_WEIGHT) return { plates: [], totalWeight: BAR_WEIGHT };

    const weightPerSide = (weight - BAR_WEIGHT) / 2;
    const plates: number[] = [];
    let remaining = weightPerSide;

    for (const plate of PLATE_WEIGHTS) {
      while (remaining >= plate) {
        plates.push(plate);
        remaining -= plate;
      }
    }

    return {
      plates,
      totalWeight: BAR_WEIGHT + plates.reduce((a, b) => a + b, 0) * 2,
      remaining: remaining > 0 ? remaining * 2 : 0,
    };
  }, [targetWeight]);

  // צבע לפי משקל הפלטה
  const getPlateColor = (weight: number): string => {
    const colors: { [key: number]: string } = {
      20: "#FF3B30",
      15: "#FFD60A",
      10: "#34C759",
      5: "#007AFF",
      2.5: "#FF9500",
      1.25: "#AF52DE",
      0.5: "#5856D6",
    };
    return colors[weight] || theme.colors.primary;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>מחשבון פלטות</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* משקל יעד */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>משקל יעד (ק"ג)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="numeric"
                placeholder="60"
                placeholderTextColor={theme.colors.textSecondary}
              />
              <Text style={styles.kgLabel}>ק"ג</Text>
            </View>
          </View>

          {/* תצוגה ויזואלית של המוט */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.barVisualization}
          >
            {/* פלטות צד ימין */}
            {plateCalculation.plates.map((weight, index) => (
              <View
                key={`right-${index}`}
                style={[
                  styles.plate,
                  {
                    backgroundColor: getPlateColor(weight),
                    height: 60 + weight * 2,
                  },
                ]}
              >
                <Text style={styles.plateText}>{weight}</Text>
              </View>
            ))}

            {/* המוט */}
            <View style={styles.bar}>
              <Text style={styles.barText}>20 ק"ג</Text>
            </View>

            {/* פלטות צד שמאל */}
            {[...plateCalculation.plates].reverse().map((weight, index) => (
              <View
                key={`left-${index}`}
                style={[
                  styles.plate,
                  {
                    backgroundColor: getPlateColor(weight),
                    height: 60 + weight * 2,
                  },
                ]}
              >
                <Text style={styles.plateText}>{weight}</Text>
              </View>
            ))}
          </ScrollView>

          {/* סיכום */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>משקל מוט:</Text>
              <Text style={styles.summaryValue}>{BAR_WEIGHT} ק"ג</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>פלטות לכל צד:</Text>
              <Text style={styles.summaryValue}>
                {plateCalculation.plates.length > 0
                  ? plateCalculation.plates.join(" + ")
                  : "ללא"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>סה"כ משקל:</Text>
              <Text style={styles.totalValue}>
                {plateCalculation.totalWeight} ק"ג
              </Text>
            </View>
            {plateCalculation.remaining && plateCalculation.remaining > 0 && (
              <Text style={styles.warningText}>
                * חסרים {plateCalculation.remaining.toFixed(1)} ק"ג להשלמת המשקל
                המבוקש
              </Text>
            )}
          </View>

          {/* רשימת פלטות לפי צבע */}
          <View style={styles.plateLegend}>
            <Text style={styles.legendTitle}>מקרא צבעים:</Text>
            <View style={styles.legendGrid}>
              {PLATE_WEIGHTS.map((weight) => (
                <View key={weight} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: getPlateColor(weight) },
                    ]}
                  />
                  <Text style={styles.legendText}>{weight} ק"ג</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    width: "90%",
    maxHeight: "85%",
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  inputSection: {
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  kgLabel: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  barVisualization: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  plate: {
    width: 12,
    borderRadius: 2,
    marginHorizontal: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  plateText: {
    fontSize: 10,
    color: theme.colors.text,
    fontWeight: "bold",
    transform: [{ rotate: "-90deg" }],
  },
  bar: {
    width: 150,
    height: 20,
    backgroundColor: theme.colors.divider,
    borderRadius: 10,
    marginHorizontal: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  barText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "500",
  },
  summary: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
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
    marginVertical: theme.spacing.sm,
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
    fontStyle: "italic",
    marginTop: theme.spacing.sm,
  },
  plateLegend: {
    marginTop: theme.spacing.md,
  },
  legendTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  legendGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
