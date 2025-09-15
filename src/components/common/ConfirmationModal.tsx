/**
 * @file src/components/common/ConfirmationModal.tsx
 * @brief מודל אישור פעולות פשוט עם תמיכה ב-RTL ונגישות
 * @dependencies React Native Modal, Ionicons, theme, Haptics
 */

import React, { useCallback } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../core/theme";
import { logger } from "../../utils/logger";

type ConfirmationModalVariant = "default" | "error";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationModalVariant;
  singleButton?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "אישור",
  cancelText = "ביטול",
  variant = "default",
  singleButton = false,
}) => {
  const handleConfirm = useCallback(() => {
    logger.debug("ConfirmationModal", `Confirm button pressed: ${title}`, {
      variant,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
    onClose();
  }, [onConfirm, onClose, title, variant]);

  const handleCancel = useCallback(() => {
    logger.debug("ConfirmationModal", `Cancel button pressed: ${title}`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onCancel) {
      onCancel();
    }
    onClose();
  }, [onCancel, onClose, title]);

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (variant) {
      case "error":
        return "alert-circle";
      default:
        return "help-circle";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "error":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getConfirmButtonColor = () => {
    switch (variant) {
      case "error":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <View style={theme.getModalOverlayStyle("center")}>
        <View
          style={[theme.getModalContentStyle("center"), styles.modalContent]}
          accessibilityRole="alert"
          accessibilityLabel={`דיאלוג אישור: ${title}`}
        >
          <View style={{ marginBottom: theme.spacing.lg }}>
            <Ionicons name={getIcon()} size={48} color={getIconColor()} />
          </View>

          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {!singleButton && (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel={`כפתור ${cancelText}`}
                accessibilityHint="לחץ כדי לבטל את הפעולה"
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                singleButton && styles.singleButton,
                { backgroundColor: getConfirmButtonColor() },
              ]}
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={`כפתור ${confirmText}`}
              accessibilityHint={
                variant === "error"
                  ? "זהירות! פעולה זו אינה הפיכה"
                  : "לחץ כדי לאשר את הפעולה"
              }
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

ConfirmationModal.displayName = "ConfirmationModal";

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: theme.isRTL() ? "row-reverse" : "row",
    width: "100%",
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    // שיפורי עיצוב כפתורים
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  singleButton: {
    flex: 0,
    minWidth: 140,
    alignSelf: "center",
    paddingHorizontal: theme.spacing.xxl,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.textInverse,
    letterSpacing: 0.3,
    textAlign: "center",
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: theme.spacing.lg,
    letterSpacing: 0.4,
    // שיפור טיפוגרפי
    textShadowColor: `${theme.colors.text}12`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    letterSpacing: 0.2,
    paddingHorizontal: theme.spacing.md,
  },
});

export default ConfirmationModal;
