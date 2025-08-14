/**
 * @file src/components/WorkoutPlanManager.tsx
 * @description ניהול תוכניות אימון עם מנגנון שמירה והחלפה חכם - מותאם לכושר מובייל
 * English: Workout plan management with smart save and replace mechanism - fitness mobile optimized
 *
 * @features
 * - מגבלת 3 תוכניות מקסימום (basic, smart, additional)
 * - הודעות אישור לפני שמירה ודריסה עם haptic feedback
 * - אפשרות לבחור איזו תוכנית לדרוס במקרה של מלוי
 * - תמיכה עתידית בתכנית אין הגבלה (פרימיום)
 * - אופטימיזציות כושר מובייל: haptic feedback, performance tracking, enlarged hitSlop
 *
 * @usage Used from WorkoutPlansScreen for plan management
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
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

  // ✨ Performance tracking לרכיבי כושר
  const renderStartTime = useMemo(() => performance.now(), []);

  // ✨ Haptic feedback מותאם לפעולות ניהול תוכניות
  const triggerActionHaptic = useCallback(
    (intensity: "light" | "medium" | "heavy" = "medium") => {
      switch (intensity) {
        case "light":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "heavy":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    },
    []
  );

  // ✨ משוב ביצועים אוטומטי
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime;
    if (renderTime > 100) {
      console.warn(
        `⚠️ WorkoutPlanManager render time: ${renderTime.toFixed(2)}ms`
      );
    }
  }, [renderStartTime]);

  // removed unused selectedReplaceType state

  // בדיקת תוכניות קיימות
  const existingPlans: PlanSlot[] = useMemo(
    () => [
      {
        type: "basic",
        plan: user?.workoutplans?.basicPlan || null,
        name: "תוכנית בסיס",
        description: "תוכנית פשוטה ומהירה",
      },
      {
        type: "smart",
        plan: user?.workoutplans?.smartPlan || null,
        name: "תוכנית חכמה",
        description: "תוכנית מותאמת אישית מלאה",
      },
      {
        type: "additional",
        plan: user?.workoutplans?.additionalPlan || null,
        name: "תוכנית נוספת",
        description: "תוכנית גיבוי או מגוונת",
      },
    ],
    [user?.workoutplans]
  );

  const occupiedSlots = useMemo(
    () => existingPlans.filter((slot) => slot.plan !== null),
    [existingPlans]
  );

  const isFullCapacity = occupiedSlots.length >= 3;

  // בדיקה אם התוכנית החדשה תחליף תוכנית קיימת מאותו סוג
  const existingPlanOfSameType = useMemo(
    () =>
      existingPlans.find(
        (slot) => slot.type === planType && slot.plan !== null
      ),
    [existingPlans, planType]
  );

  // ✨ Enhanced showConfirmDialog עם haptic feedback
  const showConfirmDialog = useCallback(
    (
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
            onPress: () => {
              triggerActionHaptic("light"); // משוב קל לביטול
              onCancel?.();
            },
          },
          {
            text: "אישור",
            style: "default",
            onPress: () => {
              triggerActionHaptic("heavy"); // משוב חזק לאישור
              onConfirm();
            },
          },
        ],
        { cancelable: true }
      );
    },
    [triggerActionHaptic]
  );

  // ✨ Enhanced handleSaveAttempt עם haptic feedback
  const handleSaveAttempt = useCallback(() => {
    triggerActionHaptic("light"); // משוב קל לפתיחת דיאלוג

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
  }, [
    triggerActionHaptic,
    isFullCapacity,
    existingPlanOfSameType,
    newPlan.name,
    onSave,
    planType,
    showConfirmDialog,
  ]);

  // ✨ Enhanced handleReplaceSelection עם haptic feedback
  const handleReplaceSelection = useCallback(
    (replaceType: "basic" | "smart" | "additional") => {
      triggerActionHaptic("medium"); // משוב בינוני לבחירת החלפה

      const targetSlot = existingPlans.find(
        (slot) => slot.type === replaceType
      );

      showConfirmDialog(
        "דריסת תוכנית קיימת",
        `האם תרצה לדרוס את ${targetSlot?.name} ולהחליף אותה בתוכנית החדשה?`,
        () => {
          triggerActionHaptic("heavy"); // משוב חזק לאישור דריסה
          onSave(true, replaceType);
          setShowReplaceDialog(false);
        },
        () => {}
      );
    },
    [triggerActionHaptic, existingPlans, onSave, showConfirmDialog]
  );

  // ✨ Enhanced close handler עם haptic feedback
  const handleClose = useCallback(() => {
    triggerActionHaptic("light");
    onClose();
  }, [triggerActionHaptic, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
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
                onPress={() => {
                  triggerActionHaptic("medium");
                  setShowReplaceDialog(true);
                }}
                hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="בחר תוכנית לדריסה"
                accessibilityHint="הקש לבחירת תוכנית קיימת לדריסה - יופעל משוב מושגי"
              >
                <Text style={styles.replaceButtonText}>בחר תוכנית לדריסה</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAttempt}
                hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="שמור תוכנית"
                accessibilityHint="הקש לשמירת התוכנית החדשה - יופעל משוב מושגי"
              >
                <Text style={styles.saveButtonText}>שמור תוכנית</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              hitSlop={{
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="ביטול"
              accessibilityHint="הקש לביטול ויציאה - יופעל משוב מושגי"
            >
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
                hitSlop={{
                  top: 15,
                  bottom: 15,
                  left: 15,
                  right: 15,
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`החלף ${slot.name}`}
                accessibilityHint={`הקש להחלפת ${slot.name} בתוכנית החדשה - יופעל משוב מושגי`}
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
              onPress={() => {
                triggerActionHaptic("light");
                setShowReplaceDialog(false);
              }}
              hitSlop={{
                top: 15,
                bottom: 15,
                left: 15,
                right: 15,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="ביטול בחירת החלפה"
              accessibilityHint="הקש לביטול בחירת החלפה וחזרה למסך הקודם - יופעל משוב מושגי"
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
    minHeight: 44, // ✨ אימות גודל 44px לנגישות
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
    minHeight: 44, // ✨ אימות גודל 44px לנגישות
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
    minHeight: 44, // ✨ אימות גודל 44px לנגישות
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
    minHeight: 44, // ✨ אימות גודל 44px לנגישות
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
    minHeight: 44, // ✨ אימות גודל 44px לנגישות
  },
  cancelReplaceButtonText: {
    color: theme.colors.text,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
  },
});

export default WorkoutPlanManager;
