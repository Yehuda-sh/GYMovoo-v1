/**
 * @file src/screens/workout/components/ExerciseTipsModal.tsx
 * @description מודל טיפים לביצוע תרגיל עם אנימציות ועיצוב משופר
 * English: Exercise tips modal with animations and improved design
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
  Platform,
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

  // פונקציה לשיתוף טיפים
  // Share tips function
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
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header עם גרדיאנט */}
          {/* Header with gradient */}
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryGradientEnd]}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={onClose}
                accessibilityLabel="סגור מודל טיפים"
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close-circle"
                  size={32}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.title}>{exerciseName}</Text>
                <Text style={styles.subtitle}>מדריך ביצוע מקצועי</Text>
              </View>
              <View style={{ width: 32 }} />
            </View>
          </LinearGradient>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* מידע על התרגיל */}
            {/* Exercise info */}
            {(tips.muscleGroups || tips.difficulty) && (
              <View style={styles.infoSection}>
                {tips.muscleGroups && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="arm-flex"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoText}>
                      שרירים: {tips.muscleGroups.join(", ")}
                    </Text>
                  </View>
                )}
                {tips.difficulty && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="speedometer"
                      size={20}
                      color={theme.colors.warning}
                    />
                    <Text style={styles.infoText}>
                      רמת קושי: {tips.difficulty}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* טיפים לביצוע */}
            {/* Execution tips */}
            <View style={[styles.section, styles.tipsSection]}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={28}
                  color={theme.colors.success}
                />
                <Text style={styles.sectionTitle}>טיפים לביצוע נכון</Text>
              </View>
              {tips.tips.map((tip, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.tipItem,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.tipBullet}>
                    <Text style={styles.tipNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.tipText}>{tip}</Text>
                </Animated.View>
              ))}
            </View>

            {/* טעויות נפוצות */}
            {/* Common mistakes */}
            <View style={[styles.section, styles.mistakesSection]}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={28}
                  color={theme.colors.error}
                />
                <Text style={styles.sectionTitle}>
                  טעויות נפוצות להימנע מהן
                </Text>
              </View>
              {tips.commonMistakes.map((mistake, index) => (
                <View key={index} style={styles.mistakeItem}>
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color={theme.colors.error}
                  />
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </View>

            {/* טיפ בונוס עם אייקון מונפש */}
            {/* Bonus tip with animated icon */}
            <TouchableOpacity style={styles.bonusTip} activeOpacity={0.8}>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={24}
                  color={theme.colors.warning}
                />
              </Animated.View>
              <Text style={styles.bonusTipText}>
                💡 טיפ מקצועי: צלם את עצמך מהצד כדי לבדוק את הטכניקה שלך!
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* כפתורי פעולה */}
          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareTips}
              accessibilityLabel="שתף טיפים"
              activeOpacity={0.7}
            >
              <Ionicons
                name="share-social"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.shareButtonText}>שתף</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="הבנתי"
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryGradientEnd]}
                style={styles.closeButtonGradient}
              >
                <Text style={styles.closeButtonText}>הבנתי, בואו נתחיל!</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 999,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    width: "92%",
    maxHeight: "85%",
    ...theme.shadows.large,
    zIndex: 10000,
    elevation: 1000,
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
    paddingBottom: theme.spacing.sm,
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
    textAlign: "right",
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
    textAlign: "right",
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
    textAlign: "right",
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
    textAlign: "right",
  },
  actions: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  shareButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  closeButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  closeButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
