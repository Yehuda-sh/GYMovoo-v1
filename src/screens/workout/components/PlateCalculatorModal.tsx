/**
 * @file src/screens/workout/components/PlateCalculatorModal.tsx
 * @description מחשבון פלטות ויזואלי - חישוב וייצוג גרפי של הפלטות הנדרשות
 * English: Visual plate calculator - calculate and visualize required plates
 */

import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";

interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  initialWeight?: number;
  onApplyWeight?: (weight: number) => void;
}

interface PlateConfig {
  weight: number;
  count: number;
  color: string;
}

// משקלי פלטות סטנדרטיים
// Standard plate weights
const STANDARD_PLATES = [
  { weight: 20, color: "#FF0000" },
  { weight: 15, color: "#FFD700" },
  { weight: 10, color: "#00FF00" },
  { weight: 5, color: "#0000FF" },
  { weight: 2.5, color: "#FF1493" },
  { weight: 1.25, color: "#C0C0C0" },
];

const BARBELL_WEIGHT = 20; // משקל מוט אולימפי
const EMPTY_BARBELL_WEIGHT = 20;

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  visible,
  onClose,
  initialWeight = 60,
  onApplyWeight,
}) => {
  const [targetWeight, setTargetWeight] = useState(initialWeight.toString());
  const [barbellWeight, setBarbellWeight] = useState(BARBELL_WEIGHT.toString());
  const [showCustomBarbell, setShowCustomBarbell] = useState(false);

  // חישוב הפלטות הנדרשות
  // Calculate required plates
  const plateConfiguration = useMemo(() => {
    const weight = parseFloat(targetWeight) || 0;
    const barWeight = parseFloat(barbellWeight) || EMPTY_BARBELL_WEIGHT;

    if (weight <= barWeight) {
      return [];
    }

    const plateWeight = (weight - barWeight) / 2; // משקל לכל צד
    const plates: PlateConfig[] = [];
    let remainingWeight = plateWeight;

    // אלגוריתם חמדן למציאת הפלטות
    // Greedy algorithm to find plates
    for (const plate of STANDARD_PLATES) {
      const count = Math.floor(remainingWeight / plate.weight);
      if (count > 0) {
        plates.push({
          weight: plate.weight,
          count,
          color: plate.color,
        });
        remainingWeight -= count * plate.weight;
      }
    }

    // בדיקה אם נשאר משקל שלא ניתן להשיג
    if (remainingWeight > 0.1) {
      plates.push({
        weight: remainingWeight,
        count: 1,
        color: "#808080",
      });
    }

    return plates;
  }, [targetWeight, barbellWeight]);

  // חישוב משקל בפועל
  // Calculate actual weight
  const actualWeight = useMemo(() => {
    const barWeight = parseFloat(barbellWeight) || EMPTY_BARBELL_WEIGHT;
    const platesWeight = plateConfiguration.reduce(
      (sum, plate) => sum + plate.weight * plate.count * 2, // כפול 2 לשני הצדדים
      0
    );
    return barWeight + platesWeight;
  }, [barbellWeight, plateConfiguration]);

  const handleQuickAdd = (amount: number) => {
    const current = parseFloat(targetWeight) || 0;
    setTargetWeight((current + amount).toString());
  };

  const renderPlate = (plate: PlateConfig, index: number) => (
    <View key={index} style={styles.plateRow}>
      <View style={styles.plateInfo}>
        <View style={[styles.plateColor, { backgroundColor: plate.color }]} />
        <Text style={styles.plateWeight}>{plate.weight} ק"ג</Text>
      </View>
      <View style={styles.plateCount}>
        <Text style={styles.countText}>x{plate.count}</Text>
        <Text style={styles.sideText}>לכל צד</Text>
      </View>
    </View>
  );

  const renderBarbellVisualization = () => (
    <View style={styles.barbellContainer}>
      {/* צד שמאל */}
      {/* Left side */}
      <View style={styles.platesVisualization}>
        {plateConfiguration.map((plate, index) => (
          <View key={`left-${index}`} style={styles.plateVisualGroup}>
            {Array.from({ length: plate.count }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.plateVisual,
                  {
                    backgroundColor: plate.color,
                    height: 40 + plate.weight * 2,
                    marginRight: 2,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* המוט */}
      {/* The bar */}
      <View style={styles.barbell}>
        <Text style={styles.barbellText}>{barbellWeight} ק"ג</Text>
      </View>

      {/* צד ימין */}
      {/* Right side */}
      <View style={[styles.platesVisualization, styles.rightSide]}>
        {plateConfiguration.map((plate, index) => (
          <View key={`right-${index}`} style={styles.plateVisualGroup}>
            {Array.from({ length: plate.count }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.plateVisual,
                  {
                    backgroundColor: plate.color,
                    height: 40 + plate.weight * 2,
                    marginLeft: 2,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* כותרת */}
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>מחשבון פלטות</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* קלט משקל */}
            {/* Weight input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>משקל יעד</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.weightInput}
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <Text style={styles.unitText}>ק"ג</Text>
              </View>

              {/* כפתורי הוספה מהירה */}
              {/* Quick add buttons */}
              <View style={styles.quickButtons}>
                {[2.5, 5, 10, 20].map((weight) => (
                  <TouchableOpacity
                    key={weight}
                    style={styles.quickButton}
                    onPress={() => handleQuickAdd(weight)}
                  >
                    <Text style={styles.quickButtonText}>+{weight}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* משקל מוט */}
            {/* Barbell weight */}
            <TouchableOpacity
              style={styles.barbellSection}
              onPress={() => setShowCustomBarbell(!showCustomBarbell)}
            >
              <Text style={styles.barbellLabel}>משקל מוט</Text>
              <View style={styles.barbellValue}>
                <Text style={styles.barbellWeightText}>
                  {barbellWeight} ק"ג
                </Text>
                <MaterialCommunityIcons
                  name={showCustomBarbell ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {showCustomBarbell && (
              <View style={styles.customBarbellInput}>
                <TextInput
                  style={styles.barbellInput}
                  value={barbellWeight}
                  onChangeText={setBarbellWeight}
                  keyboardType="numeric"
                  placeholder="משקל מוט"
                  placeholderTextColor={theme.colors.textSecondary}
                />
                <View style={styles.barbellPresets}>
                  {[15, 20].map((weight) => (
                    <TouchableOpacity
                      key={weight}
                      style={styles.presetButton}
                      onPress={() => setBarbellWeight(weight.toString())}
                    >
                      <Text style={styles.presetText}>{weight} ק"ג</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ויזואליזציה של המוט */}
            {/* Barbell visualization */}
            {renderBarbellVisualization()}

            {/* רשימת פלטות */}
            {/* Plates list */}
            <View style={styles.platesSection}>
              <Text style={styles.sectionTitle}>פלטות נדרשות</Text>
              {plateConfiguration.length > 0 ? (
                plateConfiguration.map((plate, index) =>
                  renderPlate(plate, index)
                )
              ) : (
                <Text style={styles.emptyText}>משקל המוט בלבד</Text>
              )}
            </View>

            {/* סיכום */}
            {/* Summary */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>משקל בפועל:</Text>
                <Text style={styles.summaryValue}>
                  {actualWeight.toFixed(1)} ק"ג
                </Text>
              </View>
              {Math.abs(actualWeight - parseFloat(targetWeight)) > 0.1 && (
                <View style={styles.differenceRow}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={16}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.differenceText}>
                    הפרש של{" "}
                    {Math.abs(actualWeight - parseFloat(targetWeight)).toFixed(
                      1
                    )}{" "}
                    ק"ג מהיעד
                  </Text>
                </View>
              )}
            </View>

            {/* כפתור החלה */}
            {/* Apply button */}
            {onApplyWeight && (
              <TouchableOpacity
                onPress={() => {
                  onApplyWeight(actualWeight);
                  onClose();
                }}
              >
                <LinearGradient
                  colors={[
                    theme.colors.primaryGradientStart,
                    theme.colors.primaryGradientEnd,
                  ]}
                  style={styles.applyButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.applyButtonText}>
                    החל משקל ({actualWeight.toFixed(1)} ק"ג)
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  closeButton: {
    padding: 8,
  },
  inputSection: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    textAlign: "center",
  },
  unitText: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginLeft: 12,
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  quickButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  quickButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  barbellSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  barbellLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  barbellValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  barbellWeightText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: 8,
  },
  customBarbellInput: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  barbellInput: {
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  barbellPresets: {
    flexDirection: "row",
    gap: 8,
  },
  presetButton: {
    backgroundColor: theme.colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  presetText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  barbellContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  platesVisualization: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSide: {
    flexDirection: "row-reverse",
  },
  plateVisualGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  plateVisual: {
    width: 8,
    borderRadius: 2,
  },
  barbell: {
    height: 20,
    width: 100,
    backgroundColor: theme.colors.textSecondary,
    borderRadius: 10,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  barbellText: {
    fontSize: 10,
    color: theme.colors.background,
    fontWeight: "bold",
  },
  platesSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
  },
  plateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  plateInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  plateColor: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  plateWeight: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  plateCount: {
    alignItems: "flex-end",
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  sideText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingVertical: 20,
  },
  summarySection: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  differenceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  differenceText: {
    fontSize: 14,
    color: theme.colors.warning,
    marginLeft: 4,
  },
  applyButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
});
