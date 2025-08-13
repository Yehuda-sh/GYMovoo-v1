/**
 * @file src/components/common/UniversalModal.tsx
 * @brief רכיב מודל משותף שמחליף 4 מודלים נפרדים
 * @description מודל אחיד לכל סוגי ההודעות: שגיאה, הצלחה, אישור, ובקרוב
 */

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export type ModalType = "error" | "success" | "confirm" | "comingSoon";

interface UniversalModalProps {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const { width } = Dimensions.get("window");

export const UniversalModal: React.FC<UniversalModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  onCancel,
  onConfirm,
  confirmText = "אישור",
  cancelText = "ביטול",
  destructive = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const getModalConfig = () => {
    switch (type) {
      case "success":
        return {
          iconName: "check-circle" as const,
          iconColor: theme.colors.success,
          titleColor: theme.colors.success,
        };
      case "error":
        return {
          iconName: "alert-circle" as const,
          iconColor: theme.colors.error,
          titleColor: theme.colors.error,
        };
      case "confirm":
        return {
          iconName: "help-circle" as const,
          iconColor: destructive ? theme.colors.error : theme.colors.primary,
          titleColor: destructive ? theme.colors.error : theme.colors.primary,
        };
      case "comingSoon":
        return {
          iconName: "clock-outline" as const,
          iconColor: theme.colors.warning,
          titleColor: theme.colors.warning,
        };
      default:
        return {
          iconName: "information" as const,
          iconColor: theme.colors.primary,
          titleColor: theme.colors.primary,
        };
    }
  };

  const config = getModalConfig();
  const showConfirmButton = type === "confirm" && onConfirm;

  /**
   * יצירת תווית נגישות דינמית
   * Generate dynamic accessibility label
   */
  const generateAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;

    let label = `${
      type === "error"
        ? "שגיאה"
        : type === "success"
          ? "הצלחה"
          : type === "confirm"
            ? "אישור"
            : type === "comingSoon"
              ? "בקרוב"
              : "הודעה"
    }`;

    label += `, ${title}`;
    return label;
  };

  /**
   * יצירת רמז נגישות דינמי
   * Generate dynamic accessibility hint
   */
  const generateAccessibilityHint = (): string => {
    if (accessibilityHint) return accessibilityHint;

    if (showConfirmButton) {
      return "בחר אישור או ביטול";
    }

    return "לחץ סגור כדי לסגור את ההודעה";
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <View
        style={styles.modalContainer}
        accessible={true}
        accessibilityLabel={generateAccessibilityLabel()}
        accessibilityHint={generateAccessibilityHint()}
        accessibilityRole="alert"
        testID={testID || `universal-modal-${type}`}
      >
        <View style={styles.modalContent}>
          {/* אייקון */}
          <MaterialCommunityIcons
            name={config.iconName}
            size={64}
            color={config.iconColor}
            style={styles.icon}
            accessible={false}
            importantForAccessibility="no"
          />

          {/* כותרת */}
          <Text
            style={[styles.title, { color: config.titleColor }]}
            accessible={false}
            importantForAccessibility="no"
          >
            {title}
          </Text>

          {/* הודעה */}
          <Text
            style={styles.message}
            accessible={false}
            importantForAccessibility="no"
          >
            {message}
          </Text>

          {/* כפתורים */}
          <View style={styles.buttonContainer}>
            {showConfirmButton ? (
              // מצב אישור - שני כפתורים
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    onCancel?.();
                    onClose();
                  }}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={cancelText}
                  accessibilityHint="לחץ כדי לבטל את הפעולה"
                  testID={`${testID || "universal-modal"}-cancel-button`}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    destructive
                      ? styles.destructiveButton
                      : styles.confirmButton,
                  ]}
                  onPress={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={confirmText}
                  accessibilityHint={
                    destructive
                      ? "פעולה זו אינה ניתנת לביטול"
                      : "לחץ כדי לאשר את הפעולה"
                  }
                  testID={`${testID || "universal-modal"}-confirm-button`}
                >
                  <Text
                    style={
                      destructive
                        ? styles.destructiveButtonText
                        : styles.confirmButtonText
                    }
                  >
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // מצב רגיל - כפתור אחד
              <TouchableOpacity
                style={[styles.button, styles.singleButton]}
                onPress={onClose}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="סגור"
                accessibilityHint="לחץ כדי לסגור את ההודעה"
                testID={`${testID || "universal-modal"}-close-button`}
              >
                <Text style={styles.singleButtonText}>סגור</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    alignItems: "center",
    maxWidth: width * 0.9,
    width: "100%",
    ...theme.shadows.large,
  },
  icon: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.title2.fontSize,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    gap: theme.spacing.md,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  singleButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  destructiveButton: {
    backgroundColor: theme.colors.error,
  },
  cancelButton: {
    backgroundColor: theme.colors.border,
  },
  singleButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  destructiveButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
});
