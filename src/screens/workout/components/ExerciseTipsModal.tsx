/**
 * @file src/screens/workout/components/ExerciseTipsModal.tsx
 * @description מודל טיפים לביצוע תרגיל
 * English: Exercise tips modal
 */

import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface ExerciseTipsModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
}

// טיפים לפי תרגיל
const EXERCISE_TIPS: {
  [key: string]: { tips: string[]; commonMistakes: string[] };
} = {
  "לחיצת חזה": {
    tips: [
      "שמור על גב ישר עם קשת טבעית",
      "הורד את המשקולת באיטיות (2-3 שניות)",
      "נשום פנימה בירידה, החוצה בדחיפה",
      "שמור על מרפקים בזווית של 45 מעלות",
      "דחוף מהחזה ולא מהכתפיים",
    ],
    commonMistakes: [
      "קפיצת המשקולת מהחזה",
      "ירידה מהירה מדי",
      "מרפקים פתוחים ב-90 מעלות",
      "קשת גב מוגזמת",
    ],
  },
  סקוואט: {
    tips: [
      "רגליים ברוחב כתפיים",
      "שמור על גב ישר לאורך כל התנועה",
      "רד עד לזווית של 90 מעלות או נמוך יותר",
      "דחוף מהעקבים, לא מהבהונות",
      "ברכיים בכיוון הבהונות",
    ],
    commonMistakes: [
      "ברכיים נכנסות פנימה",
      "עקבים מתרוממים",
      "גב מתעגל",
      "ירידה לא מספיק עמוקה",
    ],
  },
  // ברירת מחדל
  default: {
    tips: [
      "התחמם היטב לפני התרגיל",
      "שמור על טכניקה נכונה לאורך כל הסט",
      "בחר משקל שמאתגר אבל מאפשר ביצוע נכון",
      "רכז את השריר הפועל",
      "נשום בצורה סדירה",
    ],
    commonMistakes: [
      "משקל כבד מדי על חשבון טכניקה",
      "ביצוע מהיר מדי",
      "חוסר ריכוז בשריר היעד",
      "אי שמירה על טווח תנועה מלא",
    ],
  },
};

export const ExerciseTipsModal: React.FC<ExerciseTipsModalProps> = ({
  visible,
  onClose,
  exerciseName,
}) => {
  const tips = EXERCISE_TIPS[exerciseName] || EXERCISE_TIPS.default;

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
            <Text style={styles.title}>טיפים - {exerciseName}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* טיפים לביצוע */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={styles.sectionTitle}>טיפים לביצוע נכון</Text>
              </View>
              {tips.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipBullet}>
                    <Text style={styles.tipNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* טעויות נפוצות */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color={theme.colors.error}
                />
                <Text style={styles.sectionTitle}>טעויות נפוצות</Text>
              </View>
              {tips.commonMistakes.map((mistake, index) => (
                <View key={index} style={styles.mistakeItem}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.colors.error}
                  />
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </View>

            {/* טיפ בונוס */}
            <View style={styles.bonusTip}>
              <MaterialCommunityIcons
                name="lightbulb"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.bonusTipText}>
                💡 טיפ מקצועי: צלם את עצמך מהצד כדי לבדוק את הטכניקה שלך!
              </Text>
            </View>
          </ScrollView>

          {/* כפתור סגירה */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>הבנתי</Text>
          </TouchableOpacity>
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
    maxHeight: "80%",
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  tipItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.md,
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  tipNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  mistakeItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  mistakeText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  bonusTip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  bonusTipText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
});
