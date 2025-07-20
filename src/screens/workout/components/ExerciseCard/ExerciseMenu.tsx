/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseMenu.tsx
 * @description תפריט אפשרויות לתרגיל - מחיקה, שכפול, סידור
 * English: Exercise options menu - delete, duplicate, reorder
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

interface ExerciseMenuProps {
  visible: boolean;
  onClose: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const ExerciseMenu: React.FC<ExerciseMenuProps> = ({
  visible,
  onClose,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  canMoveUp = true,
  canMoveDown = true,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // אנימציית פתיחה/סגירה
  // Open/close animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // אישור מחיקה
  // Confirm delete
  const confirmDelete = () => {
    Alert.alert(
      "🗑️ מחיקת תרגיל",
      "האם אתה בטוח שברצונך למחוק את התרגיל? פעולה זו לא ניתנת לביטול.",
      [
        {
          text: "ביטול",
          style: "cancel",
        },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            onClose();
            onDelete();
          },
        },
      ]
    );
  };

  // פריט תפריט
  // Menu item
  const MenuItem = ({
    icon,
    iconFamily = "ionicons",
    label,
    onPress,
    disabled = false,
    danger = false,
  }: {
    icon: string;
    iconFamily?: "ionicons" | "material";
    label: string;
    onPress: () => void;
    disabled?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.menuItem, disabled && styles.menuItemDisabled]}
      onPress={() => {
        if (!disabled) {
          onPress();
          if (!danger) onClose(); // אל תסגור אם זו פעולה מסוכנת
        }
      }}
      disabled={disabled}
    >
      {iconFamily === "ionicons" ? (
        <Ionicons
          name={icon as any}
          size={24}
          color={
            danger
              ? theme.colors.error
              : disabled
              ? theme.colors.textSecondary
              : theme.colors.text
          }
        />
      ) : (
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={
            danger
              ? theme.colors.error
              : disabled
              ? theme.colors.textSecondary
              : theme.colors.text
          }
        />
      )}
      <Text
        style={[
          styles.menuItemText,
          disabled && styles.menuItemTextDisabled,
          danger && styles.menuItemTextDanger,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.overlayBackground} />
        </Animated.View>

        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* ידית גרירה */}
          {/* Drag handle */}
          <View style={styles.dragHandle} />

          {/* כותרת */}
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>אפשרויות תרגיל</Text>
          </View>

          {/* פעולות סידור */}
          {/* Reorder actions */}
          <View style={styles.section}>
            <MenuItem
              icon="arrow-up"
              label="הזז למעלה"
              onPress={onMoveUp!}
              disabled={!canMoveUp}
            />
            <MenuItem
              icon="arrow-down"
              label="הזז למטה"
              onPress={onMoveDown!}
              disabled={!canMoveDown}
            />
          </View>

          {/* פעולות עריכה */}
          {/* Edit actions */}
          <View style={styles.section}>
            <MenuItem
              icon="content-duplicate"
              iconFamily="material"
              label="שכפל תרגיל"
              onPress={onDuplicate}
            />
            <MenuItem
              icon="swap-horizontal"
              label="החלף תרגיל"
              onPress={() => {
                /* TODO: implement */
              }}
            />
          </View>

          {/* פעולות מסוכנות */}
          {/* Dangerous actions */}
          <View style={styles.section}>
            <MenuItem
              icon="trash"
              label="מחק תרגיל"
              onPress={confirmDelete}
              danger
            />
          </View>

          {/* כפתור ביטול */}
          {/* Cancel button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>ביטול</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    ...theme.shadows.large,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.divider,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  section: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  menuItemTextDisabled: {
    color: theme.colors.textSecondary,
  },
  menuItemTextDanger: {
    color: theme.colors.error,
  },
  cancelButton: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
});

export default ExerciseMenu;
