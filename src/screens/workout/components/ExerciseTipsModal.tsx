/**
 * @file src/screens/workout/components/ExerciseTipsModal.tsx
 * @description מודל טיפים לביצוע תרגיל עם עיצוב נקי ומקצועי
 * English: Exercise tips modal with clean and professional design
 */
// cspell:ignore באיטיות, טרייספס, סקוואט, דדליפט, אקסטנשן

import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Share,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";

const { width: screenWidth } = Dimensions.get("window");

interface ExerciseTipsModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
}

// טיפים לפי תרגיל
const EXERCISE_TIPS: {
  [key: string]: {
    tips: string[];
    commonMistakes: string[];
    muscleGroups?: string[];
    difficulty?: string;
  };
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
    muscleGroups: ["חזה", "כתפיים קדמיות", "טרייספס"],
    difficulty: "בינוני",
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
    muscleGroups: ["רגליים", "ישבן", "Core"],
    difficulty: "קשה",
  },
  דדליפט: {
    tips: [
      "התחל עם המוט קרוב לגוף",
      "שמור על גב ישר וחזה גבוה",
      "דחוף מהרצפה עם הרגליים",
      "נעל את הירכיים והברכיים יחד בסוף",
      "הורד באיטיות תוך שמירה על המוט קרוב לגוף",
    ],
    commonMistakes: [
      "עיגול הגב התחתון",
      "משיכה עם הגב במקום הרגליים",
      "המוט רחוק מדי מהגוף",
      "היפר-אקסטנשן בסוף התנועה",
    ],
    muscleGroups: ["גב תחתון", "ישבן", "רגליים אחוריות"],
    difficulty: "קשה מאוד",
  },
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 75,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const shareTips = async () => {
    try {
      const message = `טיפים לביצוע ${exerciseName}:\n\n${tips.tips.join(
        "\n• "
      )}\n\nמ-GYMovoo 💪`;
      await Share.share({
        message,
        title: `טיפים ל${exerciseName}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "קל":
        return theme.colors.success;
      case "בינוני":
        return theme.colors.warning;
      case "קשה":
        return theme.colors.error;
      case "קשה מאוד":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Header נקי */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.title}>{exerciseName}</Text>
              <Text style={styles.subtitle}>מדריך ביצוע</Text>
            </View>

            <TouchableOpacity
              onPress={shareTips}
              style={styles.shareButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="share-social-outline"
                size={22}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* מידע על התרגיל */}
          {(tips.muscleGroups || tips.difficulty) && (
            <View style={styles.infoSection}>
              {tips.muscleGroups && (
                <View style={styles.infoChip}>
                  <MaterialCommunityIcons
                    name="arm-flex"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoText}>
                    {tips.muscleGroups.join(" • ")}
                  </Text>
                </View>
              )}

              {tips.difficulty && (
                <View
                  style={[
                    styles.infoChip,
                    {
                      backgroundColor:
                        getDifficultyColor(tips.difficulty) + "15",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="speedometer"
                    size={16}
                    color={getDifficultyColor(tips.difficulty)}
                  />
                  <Text
                    style={[
                      styles.infoText,
                      { color: getDifficultyColor(tips.difficulty) },
                    ]}
                  >
                    {tips.difficulty}
                  </Text>
                </View>
              )}
            </View>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
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
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>{index + 1}</Text>
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

            {/* רווח לכפתור */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* כפתור סגירה */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryGradientEnd]}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>הבנתי</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    width: screenWidth * 0.92,
    maxHeight: "80%",
    ...theme.shadows.large,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoSection: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  tipItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.white,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    textAlign: "right",
  },
  mistakeItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: theme.colors.error + "10",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.error + "20",
  },
  mistakeText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    textAlign: "right",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  startButton: {
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
