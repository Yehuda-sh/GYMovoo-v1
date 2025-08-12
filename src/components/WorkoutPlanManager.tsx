/**
 * @file src/components/WorkoutPlanManager.tsx
 * @description ניהול תוכניות אימון עם מנגנון שמירה והחלפה חכם
 * English: Workout plan management with smart save and replace mechanism
 *
 * @features
 * - מגבלת 3 תוכניות מקסימום (basic, smart, additional)
 * - הודעות אישור לפני שמירה ודריסה
 * - אפשרות לבחור איזו תוכנית לדרוס במקרה של מלוי
 * - תמיכה עתידית בתכנית אין הגבלה (פרימיום)
 *
 * @usage Used from WorkoutPlansScreen for plan management
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { theme } from "../styles/theme";
import { WorkoutPlan } from "../types";
import { useUserStore } from "../stores/userStore";

interface WorkoutPlanManagerProps {
  newPlan: WorkoutPlan;
  planType: "basic" | "smart";
  visible: boolean;
  onClose: () => void;
  onSave: (
    shouldSave: boolean,
    replaceType?: "basic" | "smart" | "additional"
  ) => void;
}

interface PlanSlot {
  type: "basic" | "smart" | "additional";
  plan: WorkoutPlan | null;
  name: string;
  description: string;
}

export const WorkoutPlanManager: React.FC<WorkoutPlanManagerProps> = ({
  newPlan,
  planType,
  visible,
  onClose,
  onSave,
}) => {
  const { user } = useUserStore();
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [selectedReplaceType, setSelectedReplaceType] = useState<
    "basic" | "smart" | "additional" | null
  >(null);

  // בדיקת תוכניות קיימות
  const existingPlans: PlanSlot[] = [
    {
      type: "basic",
      plan: user?.workoutPlans?.basicPlan || null,
      name: "תוכנית בסיס",
      description: "תוכנית פשוטה ומהירה",
    },
    {
      type: "smart",
      plan: user?.workoutPlans?.smartPlan || null,
      name: "תוכנית חכמה",
      description: "תוכנית מותאמת אישית מלאה",
    },
    {
      type: "additional",
      plan: user?.workoutPlans?.additionalPlan || null,
      name: "תוכנית נוספת",
      description: "תוכנית גיבוי או מגוונת",
    },
  ];

  const occupiedSlots = existingPlans.filter((slot) => slot.plan !== null);
  const isFullCapacity = occupiedSlots.length >= 3;

  // בדיקה אם התוכנית החדשה תחליף תוכנית קיימת מאותו סוג
  const existingPlanOfSameType = existingPlans.find(
    (slot) => slot.type === planType && slot.plan !== null
  );

  const handleSaveAttempt = () => {
    // אם יש מקום פנוי - שמור ישירות
    if (!isFullCapacity) {
      if (existingPlanOfSameType) {
        // החלף תוכנית מאותו סוג
        showConfirmDialog(
          "החלפת תוכנית קיימת",
          `האם תרצה להחליף את ${existingPlanOfSameType.name} הקיימת?`,
          () => onSave(true, planType)
        );
      } else {
        // שמור במקום פנוי
        showConfirmDialog(
          "שמירת תוכנית חדשה",
          `האם תרצה לשמור את התוכנית "${newPlan.name}"?`,
          () => onSave(true, planType)
        );
      }
      return;
    }

    // אם אין מקום - הצג אפשרויות החלפה
    setShowReplaceDialog(true);
  };

  const handleReplaceSelection = (
    replaceType: "basic" | "smart" | "additional"
  ) => {
    setSelectedReplaceType(replaceType);
    const targetSlot = existingPlans.find((slot) => slot.type === replaceType);

    showConfirmDialog(
      "דריסת תוכנית קיימת",
      `האם תרצה לדרוס את ${targetSlot?.name} ולהחליף אותה בתוכנית החדשה?`,
      () => {
        onSave(true, replaceType);
        setShowReplaceDialog(false);
        setSelectedReplaceType(null);
      },
      () => {
        setSelectedReplaceType(null);
      }
    );
  };

  const showConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "ביטול",
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: "אישור",
          style: "default",
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>ניהול תוכניות אימון</Text>

          {/* פרטי התוכנית החדשה */}
          <View style={styles.newPlanSection}>
            <Text style={styles.sectionTitle}>תוכנית חדשה:</Text>
            <View style={styles.planCard}>
              <Text style={styles.planName}>{newPlan.name}</Text>
              <Text style={styles.planDescription}>{newPlan.description}</Text>
              <Text style={styles.planDetails}>
                {newPlan.frequency} ימים בשבוע • {newPlan.duration} דקות
              </Text>
            </View>
          </View>

          {/* תוכניות קיימות */}
          <View style={styles.existingPlansSection}>
            <Text style={styles.sectionTitle}>
              תוכניות קיימות ({occupiedSlots.length}/3):
            </Text>
            <ScrollView style={styles.plansList}>
              {existingPlans.map((slot) => (
                <View
                  key={slot.type}
                  style={[
                    styles.planSlot,
                    slot.plan ? styles.occupiedSlot : styles.emptySlot,
                  ]}
                >
                  <Text style={styles.slotName}>{slot.name}</Text>
                  {slot.plan ? (
                    <>
                      <Text style={styles.slotPlanName}>{slot.plan.name}</Text>
                      <Text style={styles.slotDescription}>
                        {slot.plan.frequency} ימים • {slot.plan.duration} דקות
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.emptySlotText}>מקום פנוי</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* כפתורי פעולה */}
          <View style={styles.actions}>
            {isFullCapacity ? (
              <TouchableOpacity
                style={styles.replaceButton}
                onPress={() => setShowReplaceDialog(true)}
              >
                <Text style={styles.replaceButtonText}>בחר תוכנית לדריסה</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAttempt}
              >
                <Text style={styles.saveButtonText}>שמור תוכנית</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>ביטול</Text>
            </TouchableOpacity>
          </View>

          {/* מידע נוסף */}
          <Text style={styles.infoText}>
            💡 ניתן לשמור עד 3 תוכניות במקביל.{"\n"}
            לאין הגבלה - שדרג לפרימיום! 🚀
          </Text>
        </View>
      </View>

      {/* דיאלוג בחירת תוכנית לדריסה */}
      <Modal
        visible={showReplaceDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReplaceDialog(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.replaceDialog}>
            <Text style={styles.replaceTitle}>בחר תוכנית לדריסה</Text>

            {occupiedSlots.map((slot) => (
              <TouchableOpacity
                key={slot.type}
                style={styles.replaceOption}
                onPress={() => handleReplaceSelection(slot.type)}
              >
                <Text style={styles.replaceOptionName}>{slot.name}</Text>
                <Text style={styles.replaceOptionPlan}>{slot.plan?.name}</Text>
                <Text style={styles.replaceOptionDetails}>
                  {slot.plan?.frequency} ימים • {slot.plan?.duration} דקות
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelReplaceButton}
              onPress={() => setShowReplaceDialog(false)}
            >
              <Text style={styles.cancelReplaceButtonText}>ביטול</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
    writingDirection: "rtl",
  },
  newPlanSection: {
    marginBottom: 20,
  },
  existingPlansSection: {
    marginBottom: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 10,
    writingDirection: "rtl",
  },
  planCard: {
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    writingDirection: "rtl",
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 5,
    writingDirection: "rtl",
  },
  planDetails: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 5,
    writingDirection: "rtl",
  },
  plansList: {
    maxHeight: 200,
  },
  planSlot: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  occupiedSlot: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  emptySlot: {
    backgroundColor: theme.colors.backgroundAlt,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  slotName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    writingDirection: "rtl",
  },
  slotPlanName: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 5,
    writingDirection: "rtl",
  },
  slotDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    writingDirection: "rtl",
  },
  emptySlotText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    marginTop: 5,
    writingDirection: "rtl",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
  },
  replaceButton: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  replaceButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
  },
  cancelButton: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 15,
    writingDirection: "rtl",
  },
  replaceDialog: {
    backgroundColor: theme.colors.background,
    borderRadius: 15,
    padding: 20,
    width: "90%",
  },
  replaceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
    writingDirection: "rtl",
  },
  replaceOption: {
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  replaceOptionName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    writingDirection: "rtl",
  },
  replaceOptionPlan: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 5,
    writingDirection: "rtl",
  },
  replaceOptionDetails: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    writingDirection: "rtl",
  },
  cancelReplaceButton: {
    backgroundColor: theme.colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelReplaceButtonText: {
    color: theme.colors.text,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
  },
});

export default WorkoutPlanManager;
