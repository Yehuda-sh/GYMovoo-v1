/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseMenu.tsx
 * @description תפריט אפשרויות לתרגיל - מחיקה, שכפול, סידור
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
  findNodeHandle,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";

// --- שיפור #1: הוצאת MenuItem מחוץ לקומפוננטה הראשית ---
type MenuItemProps = {
  icon:
    | React.ComponentProps<typeof Ionicons>["name"]
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconFamily?: "ionicons" | "material";
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconFamily = "ionicons",
  label,
  onPress,
  disabled = false,
  danger = false,
}) => {
  const IconComponent =
    iconFamily === "ionicons" ? Ionicons : MaterialCommunityIcons;
  const iconColor = danger
    ? theme.colors.error
    : disabled
    ? theme.colors.textSecondary
    : theme.colors.text;

  return (
    <TouchableOpacity
      style={[styles.menuItem, disabled && styles.menuItemDisabled]}
      onPress={onPress}
      disabled={disabled}
      // --- שיפור #4: הוספת תווית נגישות ---
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <IconComponent name={icon as any} size={24} color={iconColor} />
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
};

// --- קומפוננטה ראשית ---
interface ExerciseMenuProps {
  visible: boolean;
  onClose: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReplace?: () => void; // Prop for the replace action
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
  onReplace,
  canMoveUp = true,
  canMoveDown = true,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // --- שיפור #3: צמצום חזרתיות בקוד האנימציה ---
    const toValue = visible ? 0 : 300;
    const fadeToValue = visible ? 1 : 0;
    const animationConfig = { duration: 300, useNativeDriver: true };

    Animated.parallel([
      Animated.timing(slideAnim, { toValue, ...animationConfig }),
      Animated.timing(fadeAnim, { toValue: fadeToValue, ...animationConfig }),
    ]).start();
  }, [visible]);

  const confirmDelete = () => {
    Alert.alert(
      "🗑️ מחיקת תרגיל",
      "האם אתה בטוח שברצונך למחוק את התרגיל? פעולה זו לא ניתנת לביטול.",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            onDelete();
            onClose(); // סוגר את המודאל לאחר המחיקה
          },
        },
      ]
    );
  };

  const createAndCloseHandler = (action?: () => void) => () => {
    if (action) {
      action();
    }
    onClose();
  };

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
        accessibilityLabel="סגור תפריט"
        accessibilityRole="button"
      >
        <Animated.View
          style={[styles.overlayBackground, { opacity: fadeAnim }]}
        />

        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
          // מונע מהלחיצה על המודאל עצמו לסגור אותו
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.title}>אפשרויות תרגיל</Text>
          </View>

          <View style={styles.section}>
            {/* --- שיפור #2: שימוש בקריאות בטוחות --- */}
            <MenuItem
              icon="arrow-up-circle-outline"
              label="הזז למעלה"
              onPress={createAndCloseHandler(onMoveUp)}
              disabled={!canMoveUp}
            />
            <MenuItem
              icon="arrow-down-circle-outline"
              label="הזז למטה"
              onPress={createAndCloseHandler(onMoveDown)}
              disabled={!canMoveDown}
            />
          </View>

          <View style={styles.section}>
            <MenuItem
              icon="content-duplicate"
              iconFamily="material"
              label="שכפל תרגיל"
              onPress={createAndCloseHandler(onDuplicate)}
            />
            <MenuItem
              icon="swap-horizontal"
              iconFamily="material"
              label="החלף תרגיל"
              onPress={createAndCloseHandler(onReplace)}
              disabled={!onReplace} // Disable if no handler is provided
            />
          </View>

          <View style={styles.section}>
            <MenuItem
              icon="trash-outline"
              label="מחק תרגיל"
              onPress={confirmDelete} // אינו סוגר מיד, ממתין לאישור המשתמש
              danger
            />
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>ביטול</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

// הסגנונות נשארים זהים ברובם...
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
