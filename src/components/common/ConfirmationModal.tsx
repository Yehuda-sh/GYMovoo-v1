/**
 * @file src/components/common/ConfirmationModal.tsx
 * @brief מודל אישור פעולות עם תמיכה מלאה ב-RTL ונגישות
 * @dependencies React Native Modal, Ionicons, theme
 * @notes תומך במצב destructive, אייקונים מותאמים אישית, ונגישות מלאה
 * @recurring_errors וודא accessibility labels, RTL בכפתורים, theme colors
 */

import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

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

  const defaultConfirmColor = destructive
    ? theme.colors.error
    : theme.colors.primary;
  const defaultIconColor = destructive
    ? theme.colors.error
    : theme.colors.primary;

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
          {icon && (
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Ionicons
                name={icon}
                size={48}
                color={iconColor || defaultIconColor}
              />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: cancelButtonColor || theme.colors.surface },
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

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: confirmButtonColor || defaultConfirmColor },
              ]}
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={`כפתור ${confirmText}`}
              accessibilityHint={
                destructive
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
