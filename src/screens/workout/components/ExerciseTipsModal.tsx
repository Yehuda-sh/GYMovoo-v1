/**
 * @file src/screens/workout/components/ExerciseTipsModal.tsx
 * @description מודל טיפים לביצוע תרגיל - הדרכה, טכניקה ובטיחות
 * English: Exercise tips modal - guidance, technique and safety
 */

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import { Exercise } from "../types/workout.types";

interface ExerciseTipsModalProps {
  visible: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

interface TipSection {
  title: string;
  icon: string;
  tips: string[];
}

// טיפים לדוגמה לפי תרגיל
// Sample tips by exercise
const exerciseTips: Record<string, TipSection[]> = {
  "לחיצת חזה עם מוט": [
    {
      title: "תנוחת התחלה",
      icon: "human",
      tips: [
        "שכב על הספסל עם כפות הרגליים יציבות על הרצפה",
        "עיניים מתחת למוט ישירות",
        "הידק את השכמות יחד ומשוך אותן למטה",
        "צור קשת קלה בגב התחתון",
      ],
    },
    {
      title: "אחיזה נכונה",
      icon: "hand-back-right",
      tips: [
        "אחיזה רחבה מעט מרוחב הכתפיים",
        "אגודלים עוטפים את המוט מלמטה",
        "פרקי כף היד ישרים וחזקים",
        "המוט נח על בסיס כף היד, לא על האצבעות",
      ],
    },
    {
      title: "ביצוע התרגיל",
      icon: "arrow-up-down",
      tips: [
        "הורד את המוט לאט עד נגיעה קלה בחזה",
        "דחוף חזרה תוך שמירה על מסלול ישר",
        "נשום פנימה בירידה, החוצה בדחיפה",
        "שמור על מתח בחזה לאורך כל התנועה",
      ],
    },
    {
      title: "טעויות נפוצות",
      icon: "alert-circle",
      tips: [
        "הימנע מקפיצת המוט מהחזה",
        "אל תישר את המרפקים עד הסוף",
        "אל תרים את הישבן מהספסל",
        "אל תפתח את האחיזה יותר מדי",
      ],
    },
  ],
  default: [
    {
      title: "עקרונות כלליים",
      icon: "lightbulb",
      tips: [
        "התחל עם משקל קל לחימום",
        "שמור על טכניקה נכונה לפני הוספת משקל",
        "בצע את התנועה בשליטה מלאה",
        "התמקד בשריר העובד",
      ],
    },
    {
      title: "נשימה",
      icon: "weather-windy",
      tips: [
        "נשום פנימה בחלק האקסצנטרי",
        "נשוף החוצה בחלק הקונצנטרי",
        "אל תעצור את הנשימה",
        "שמור על קצב נשימה קבוע",
      ],
    },
    {
      title: "בטיחות",
      icon: "shield-check",
      tips: [
        "השתמש בספוטר במשקלים כבדים",
        "וודא שהמשקולות מאובטחות",
        "אל תעבוד עם כאב",
        "דאג למנוחה מספקת בין סטים",
      ],
    },
  ],
};

export const ExerciseTipsModal: React.FC<ExerciseTipsModalProps> = ({
  visible,
  onClose,
  exercise,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!exercise) return null;

  const tips = exerciseTips[exercise.name] || exerciseTips.default;

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const renderTipSection = (section: TipSection) => {
    const isExpanded = expandedSection === section.title;

    return (
      <View key={section.title} style={styles.tipSection}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.title)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionTitleRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={section.icon as any}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.tipsContent}>
            {section.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

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
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.title}>טיפים לביצוע</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* פרטי תרגיל */}
          {/* Exercise details */}
          <View style={styles.exerciseHeader}>
            {exercise.image && (
              <Image
                source={{ uri: exercise.image }}
                style={styles.exerciseImage}
              />
            )}
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.primaryMuscles && (
                <View style={styles.musclesRow}>
                  {exercise.primaryMuscles.map((muscle, index) => (
                    <View key={index} style={styles.muscleTag}>
                      <Text style={styles.muscleText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* סעיפי טיפים */}
            {/* Tips sections */}
            {tips.map(renderTipSection)}

            {/* קישור לוידאו */}
            {/* Video link */}
            <TouchableOpacity style={styles.videoButton}>
              <LinearGradient
                colors={[
                  theme.colors.primaryGradientStart,
                  theme.colors.primaryGradientEnd,
                ]}
                style={styles.videoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons
                  name="youtube"
                  size={24}
                  color={theme.colors.text}
                />
                <Text style={styles.videoText}>צפה בהדרכת וידאו</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* הערת בטיחות */}
            {/* Safety note */}
            <View style={styles.safetyNote}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.safetyText}>
                אם אתה חש כאב או אי נוחות, הפסק מיד והתייעץ עם מאמן מוסמך
              </Text>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    width: "90%",
    maxHeight: "85%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.card,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  musclesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  muscleTag: {
    backgroundColor: theme.colors.primaryGradientStart + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  muscleText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tipSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGradientStart + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  tipsContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingLeft: 20,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 8,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  videoButton: {
    margin: 16,
  },
  videoGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  videoText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginLeft: 8,
  },
  safetyNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.warning + "20",
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
  },
  safetyText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.warning,
    marginLeft: 8,
    lineHeight: 18,
  },
});
