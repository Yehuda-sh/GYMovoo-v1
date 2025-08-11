/**
 * @file src/components/common/ConfirmationModal.tsx
 * @brief מודל אישור פעולות עם תמיכה מלאה ב-RTL ונגישות
 * @dependencies React Native Modal, Ionicons, theme
 * @notes תומך במצב destructive, variants, כפתור יחיד, אייקונים אוטומטיים ונגישות מלאה
 * @version 2.0 - Added variants, single button mode, auto icons
 * @recurring_errors וודא accessibility labels, RTL בכפתורים, theme colors
 */

import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

type ConfirmationModalVariant =
  | "default"
  | "error"
  | "success"
  | "warning"
  | "info";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  destructive?: boolean;
  /** סוג המודל - משפיע על אייקון וצבעים ברירת מחדל */
  variant?: ConfirmationModalVariant;
  /** האם להציג רק כפתור אישור (עבור הודעות מידע/שגיאה) */
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
  icon,
  iconColor,
  confirmButtonColor,
  cancelButtonColor,
  destructive = false,
  variant = "default",
  singleButton = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // אייקונים ברירת מחדל לפי variant
  const getDefaultIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (variant) {
      case "error":
        return "alert-circle";
      case "success":
        return "checkmark-circle";
      case "warning":
        return "warning";
      case "info":
        return "information-circle";
      default:
        return "help-circle";
    }
  };

  // צבעים ברירת מחדל לפי variant
  const getDefaultColors = () => {
    switch (variant) {
      case "error":
        return {
          icon: theme.colors.error,
          confirm: theme.colors.error,
        };
      case "success":
        return {
          icon: theme.colors.success,
          confirm: theme.colors.success,
        };
      case "warning":
        return {
          icon: theme.colors.warning,
          confirm: theme.colors.warning,
        };
      case "info":
        return {
          icon: theme.colors.info,
          confirm: theme.colors.info,
        };
      default:
        return {
          icon: destructive ? theme.colors.error : theme.colors.primary,
          confirm: destructive ? theme.colors.error : theme.colors.primary,
        };
    }
  };

  const defaultColors = getDefaultColors();
  const displayIcon = icon || getDefaultIcon();
  const displayIconColor = iconColor || defaultColors.icon;
  const displayConfirmColor = confirmButtonColor || defaultColors.confirm;

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
          style={[
            theme.getModalContentStyle("center"),
            {
              width: "100%",
              maxWidth: 300,
              alignItems: "center",
            },
          ]}
          accessibilityRole="alert"
          accessibilityLabel={`דיאלוג אישור: ${title}`}
        >
          {(icon || variant !== "default") && (
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Ionicons name={displayIcon} size={48} color={displayIconColor} />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {!singleButton && (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: cancelButtonColor || theme.colors.surface,
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
                { backgroundColor: displayConfirmColor },
              ]}
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={`כפתור ${confirmText}`}
              accessibilityHint={
                destructive || variant === "error"
                  ? "זהירות! פעולה זו אינה הפיכה"
                  : variant === "warning"
                    ? "אישור פעולה עם אזהרה"
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

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    width: "100%",
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  singleButton: {
    flex: 0,
    minWidth: 120,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textInverse,
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
});

export default ConfirmationModal;
