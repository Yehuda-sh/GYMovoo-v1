/**
 * @file src/screens/workout/components/ExerciseTipsModal.tsx
 * @description מודל טיפים לביצוע תרגיל עם אנימציות ועיצוב משופר
 * English: Exercise tips modal with animations and improved design
 */

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
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";

interface ExerciseTipsModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
}

// טיפים לפי תרגיל - מורחב
// Exercise tips - expanded
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
  "לחיצת חזה במוט": {
    tips: [
      "שמור על גב ישר עם קשת טבעית",
      "הורד את המוט באיטיות (2-3 שניות)",
      "נשום פנימה בירידה, החוצה בדחיפה",
      "שמור על מרפקים בזווית של 45 מעלות",
      "דחוף מהחזה ולא מהכתפיים",
    ],
    commonMistakes: [
      "קפיצת המוט מהחזה",
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 10,
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

  if (!visible) {
    return null;
  }

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header */}
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.headerGradient}
              >
                <View style={styles.header}>
                  <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.white}
                    />
                  </TouchableOpacity>
                  <View style={styles.headerCenter}>
                    <Text style={styles.title}>טיפים לביצוע</Text>
                    <Text style={styles.subtitle}>{exerciseName}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={shareTips}
                    style={styles.shareIcon}
                  >
                    <Ionicons
                      name="share-outline"
                      size={24}
                      color={theme.colors.white}
                    />
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              {/* Content */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                <View style={styles.scrollContent}>
                  {/* Info Section */}
                  {tips.muscleGroups && (
                    <View style={styles.infoSection}>
                      <View style={styles.infoItem}>
                        <Ionicons
                          name="fitness"
                          size={16}
                          color={theme.colors.primary}
                        />
                        <Text style={styles.infoText}>
                          {tips.muscleGroups.join(", ")}
                        </Text>
                      </View>
                      {tips.difficulty && (
                        <View style={styles.infoItem}>
                          <MaterialCommunityIcons
                            name="speedometer"
                            size={16}
                            color={theme.colors.primary}
                          />
                          <Text style={styles.infoText}>{tips.difficulty}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Tips Section */}
                  <View style={[styles.section, styles.tipsSection]}>
                    <View style={styles.sectionHeader}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#34C759"
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

                  {/* Mistakes Section */}
                  <View style={[styles.section, styles.mistakesSection]}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="warning" size={24} color="#FF3B30" />
                      <Text style={styles.sectionTitle}>שגיאות נפוצות</Text>
                    </View>
                    {tips.commonMistakes.map((mistake, index) => (
                      <View key={index} style={styles.mistakeItem}>
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#FF3B30"
                        />
                        <Text style={styles.mistakeText}>{mistake}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Bonus Tip */}
                  <View style={styles.bonusTip}>
                    <Ionicons
                      name="bulb"
                      size={24}
                      color={theme.colors.warning}
                    />
                    <Text style={styles.bonusTipText}>
                      💡 זכור: איכות התנועה חשובה יותר מכמות המשקל!
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 100,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  headerGradient: {
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  closeIcon: {
    padding: theme.spacing.xs,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  shareIcon: {
    padding: theme.spacing.xs,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.white,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    textAlign: "center",
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    minHeight: "100%",
  },
  infoSection: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
  },
  infoItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  section: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  tipsSection: {
    backgroundColor: "rgba(52, 199, 89, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.2)",
  },
  mistakesSection: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.2)",
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
    ...theme.shadows.small,
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  mistakeItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  mistakeText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  bonusTip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    ...theme.shadows.medium,
  },
  bonusTipText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    fontWeight: "500",
  },
});
