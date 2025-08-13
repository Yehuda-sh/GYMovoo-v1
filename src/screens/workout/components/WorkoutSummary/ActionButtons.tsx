/**
 * @file src/screens/workout/components/WorkoutSummary/ActionButtons.tsx
 * @brief רכיב כפתורי פעולה מפולח
 * @description מנהל את כפתורי השיתוף, שמירה וניהול האימון
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { workoutLogger } from "../../../../utils";
import { useModalManager } from "../../hooks/useModalManager";
import { UniversalModal } from "../../../../components/common/UniversalModal";

interface ActionButtonsProps {
  onShareWorkout: () => void;
  onSaveAsTemplate: () => void;
  onEditWorkout: () => void;
  onDeleteWorkout: () => void;
  onFinishWorkout: () => void;
  isWorkoutSaved: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = React.memo(
  ({
    onShareWorkout,
    onSaveAsTemplate,
    onEditWorkout,
    onDeleteWorkout,
    onFinishWorkout,
    isWorkoutSaved,
  }) => {
    const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 } as const;
    // Modal management - אחיד במקום Alert.alert מפוזר
    const { activeModal, modalConfig, hideModal, showConfirm, showComingSoon } =
      useModalManager();
    const handleShareWorkout = () => {
      workoutLogger.info("ActionButtons", "שיתוף אימון התחיל");
      onShareWorkout();
    };

    const handleSaveAsTemplate = () => {
      workoutLogger.info("ActionButtons", "שמירה כתבנית התחילה");
      showConfirm(
        "שמירה כתבנית",
        "האם תרצה לשמור את האימון הזה כתבנית לשימוש עתידי?",
        () => {
          onSaveAsTemplate();
          workoutLogger.info("ActionButtons", "אימון נשמר כתבנית בהצלחה");
        }
      );
    };

    const handleEditWorkout = () => {
      workoutLogger.info("ActionButtons", "עריכת אימון התחילה");
      onEditWorkout();
    };

    const handleDeleteWorkout = () => {
      showConfirm(
        "מחיקת אימון",
        "האם אתה בטוח שתרצה למחוק את האימון? פעולה זו לא ניתנת לביטול.",
        () => {
          onDeleteWorkout();
          workoutLogger.warn("ActionButtons", "אימון נמחק על ידי המשתמש");
        },
        true // destructive
      );
    };

    const handleFinishWorkout = () => {
      workoutLogger.info("ActionButtons", "סיום אימון התחיל");
      if (!isWorkoutSaved) {
        showConfirm(
          "סיום אימון",
          "האימון טרם נשמר. לסיים בכל זאת?",
          onFinishWorkout,
          false
        );
        return;
      }
      onFinishWorkout();
    };

    return (
      <View style={styles.actionButtonsContainer}>
        <Text style={styles.sectionTitle}>פעולות 🎯</Text>

        {/* כפתורים ראשיים */}
        <View style={styles.primaryActionsRow}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.shareButton]}
            onPress={handleShareWorkout}
            accessibilityRole="button"
            accessibilityLabel="שתף את האימון"
            accessibilityHint="שיתוף האימון עם אפליקציות ורשתות חברתיות"
            hitSlop={HIT_SLOP}
            testID="action-share"
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={theme.colors.card}
            />
            <Text style={styles.primaryButtonText}>שתף</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, styles.templateButton]}
            onPress={handleSaveAsTemplate}
            accessibilityRole="button"
            accessibilityLabel="שמור כתבנית"
            accessibilityHint="שמירת האימון כתבנית לשימוש עתידי"
            hitSlop={HIT_SLOP}
            testID="action-save-template"
          >
            <MaterialCommunityIcons
              name="content-save"
              size={20}
              color={theme.colors.card}
            />
            <Text style={styles.primaryButtonText}>שמור כתבנית</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, styles.finishButton]}
            onPress={handleFinishWorkout}
            accessibilityRole="button"
            accessibilityLabel="סיים אימון"
            accessibilityHint={
              isWorkoutSaved
                ? "סיים את האימון"
                : "האימון טרם נשמר, יוצג אישור לפני הסיום"
            }
            accessibilityState={{ busy: false }}
            hitSlop={HIT_SLOP}
            testID="action-finish"
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={theme.colors.card}
            />
            <Text style={styles.primaryButtonText}>סיים</Text>
          </TouchableOpacity>
        </View>

        {/* כפתורים משניים */}
        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleEditWorkout}
            accessibilityRole="button"
            accessibilityLabel="ערוך אימון"
            accessibilityHint="עריכת פרטי האימון"
            hitSlop={HIT_SLOP}
            testID="action-edit"
          >
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.secondaryButtonText}>ערוך</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, styles.deleteButton]}
            onPress={handleDeleteWorkout}
            accessibilityRole="button"
            accessibilityLabel="מחק אימון"
            accessibilityHint="פעולה הרסנית: מחיקת האימון לצמיתות"
            hitSlop={HIT_SLOP}
            testID="action-delete"
          >
            <MaterialCommunityIcons
              name="delete"
              size={18}
              color={theme.colors.error}
            />
            <Text style={[styles.secondaryButtonText, styles.deleteButtonText]}>
              מחק
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              workoutLogger.info("ActionButtons", "הפתיחה של אימונים קודמים");
              showComingSoon("היסטוריית אימונים קודמים");
            }}
            accessibilityRole="button"
            accessibilityLabel="הצג אימונים קודמים"
            accessibilityHint="הצגת היסטוריית אימונים (בקרוב)"
            hitSlop={HIT_SLOP}
            testID="action-history"
          >
            <MaterialCommunityIcons
              name="history"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.secondaryButtonText}>היסטוריה</Text>
          </TouchableOpacity>
        </View>

        {/* סטטוס שמירה */}
        <View style={styles.statusRow} testID="workout-status-row">
          <MaterialCommunityIcons
            name={isWorkoutSaved ? "cloud-check" : "cloud-sync"}
            size={16}
            color={isWorkoutSaved ? theme.colors.success : theme.colors.warning}
          />
          <Text
            style={styles.statusText}
            accessibilityRole="text"
            accessibilityLiveRegion="polite"
            testID="workout-status-text"
          >
            {isWorkoutSaved ? "נשמר בענן" : "שומר..."}
          </Text>
        </View>

        {/* מודל אחיד למקום Alert.alert מפוזר */}
        <UniversalModal
          visible={activeModal !== null}
          type={activeModal || "comingSoon"}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={hideModal}
          onConfirm={modalConfig.onConfirm}
          confirmText={modalConfig.confirmText}
          destructive={modalConfig.destructive}
        />
      </View>
    );
  }
);

ActionButtons.displayName = "ActionButtons";

const styles = StyleSheet.create({
  actionButtonsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.body.fontSize + 1,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  primaryActionsRow: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.xs,
    minHeight: 70,
    ...theme.shadows.small,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
  },
  templateButton: {
    backgroundColor: theme.colors.success,
  },
  finishButton: {
    backgroundColor: theme.colors.warning,
  },
  primaryButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.card,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  secondaryActionsRow: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-around",
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
    minWidth: 60,
  },
  deleteButton: {
    backgroundColor: theme.colors.error + "10",
  },
  secondaryButtonText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  deleteButtonText: {
    color: theme.colors.error,
  },
  statusRow: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + "50",
  },
  statusText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.isRTL ? 0 : theme.spacing.xs,
    marginRight: theme.isRTL ? theme.spacing.xs : 0,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
});
