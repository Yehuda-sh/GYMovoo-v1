/**
 * @file src/screens/workout/components/WorkoutSummary/ActionButtons.tsx
 * @brief רכיב כפתורי פעולה מפולח
 * @description מנהל את כפתורי השיתוף, שמירה וניהול האימון
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
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
        Alert.alert(
          "סיום אימון",
          "האימון טרם נשמר. האם תרצה לשמור לפני הסיום?",
          [
            { text: "ביטול", style: "cancel" },
            {
              text: "סיום בלי שמירה",
              style: "destructive",
              onPress: onFinishWorkout,
            },
            { text: "שמור וסיים", onPress: onFinishWorkout },
          ]
        );
      } else {
        onFinishWorkout();
      }
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
        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name={isWorkoutSaved ? "cloud-check" : "cloud-sync"}
            size={16}
            color={isWorkoutSaved ? theme.colors.success : theme.colors.warning}
          />
          <Text style={styles.statusText}>
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
