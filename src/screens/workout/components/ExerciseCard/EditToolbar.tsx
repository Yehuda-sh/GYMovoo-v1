/**
 * @file src/screens/workout/components/ExerciseCard/EditToolbar.tsx
 * @brief פס כלים למצב עריכה של תרגיל
 * @features React.memo, אנימציות, RTL support
 */

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import {
  SHARED_ICON_SIZES,
  SHARED_VIBRATION_TYPES,
  SHARED_MODAL_STRINGS,
} from "../../../../constants/sharedConstants";

// 🎨 CONSTANTS - ריכוז קבועים למניעת מספרי קסם ושיפור תחזוקתיות
const CONSTANTS = {
  ICON_SIZE: SHARED_ICON_SIZES.MEDIUM,
  ANIMATION_OUTPUT_RANGE: [-50, 0],
  VIBRATION: {
    MEDIUM: SHARED_VIBRATION_TYPES.MEDIUM,
    DOUBLE: SHARED_VIBRATION_TYPES.DOUBLE,
    SHORT: SHARED_VIBRATION_TYPES.SHORT,
  },
  MODAL_STRINGS: {
    TITLE: "מחיקת תרגיל",
    MESSAGE: "האם אתה בטוח שברצונך למחוק את התרגיל?",
    CONFIRM_TEXT: SHARED_MODAL_STRINGS.DELETE.CONFIRM_TEXT,
    CANCEL_TEXT: SHARED_MODAL_STRINGS.DELETE.CANCEL_TEXT,
  },
};

interface EditToolbarProps {
  isVisible: boolean;
  editModeAnimation: Animated.Value;
  onDuplicate?: () => void;
  onReplace?: () => void;
  onRemoveExercise: () => void;
  onExitEditMode: () => void;
}

const EditToolbar: React.FC<EditToolbarProps> = React.memo(
  ({
    isVisible,
    editModeAnimation,
    onDuplicate,
    onReplace,
    onRemoveExercise,
    onExitEditMode,
  }) => {
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleDeletePress = useCallback(() => {
      if (Platform.OS === "ios") {
        triggerVibration(CONSTANTS.VIBRATION.MEDIUM);
      }
      setDeleteModalVisible(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      if (Platform.OS === "ios") {
        triggerVibration(CONSTANTS.VIBRATION.DOUBLE);
      }
      onRemoveExercise();
      onExitEditMode();
      setDeleteModalVisible(false); // נסגר אוטומטית, אבל טוב להיות בטוחים
    }, [onRemoveExercise, onExitEditMode]);

    const handleDuplicate = useCallback(() => {
      if (Platform.OS === "ios") {
        triggerVibration(CONSTANTS.VIBRATION.SHORT);
      }
      onDuplicate?.();
    }, [onDuplicate]);

    const handleReplace = useCallback(() => {
      if (Platform.OS === "ios") {
        triggerVibration(CONSTANTS.VIBRATION.SHORT);
      }
      onReplace?.();
    }, [onReplace]);

    if (!isVisible) return null;

    return (
      <>
        <Animated.View
          style={[
            styles.editToolbar,
            {
              opacity: editModeAnimation,
              transform: [
                {
                  translateY: editModeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: CONSTANTS.ANIMATION_OUTPUT_RANGE,
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.editToolbarContent}>
            <Text style={styles.editToolbarTitle}>מצב עריכה פעיל</Text>
            <View style={styles.editToolbarActions}>
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleDuplicate}
                disabled={!onDuplicate}
                accessibilityLabel="שכפל תרגיל"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={CONSTANTS.ICON_SIZE}
                  color={
                    onDuplicate
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleReplace}
                disabled={!onReplace}
                accessibilityLabel="החלף תרגיל"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="swap-horizontal"
                  size={CONSTANTS.ICON_SIZE}
                  color={
                    onReplace
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.editActionButton, styles.editActionButtonDanger]}
                onPress={handleDeletePress}
                accessibilityLabel="מחק תרגיל"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={CONSTANTS.ICON_SIZE}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <ConfirmationModal
          visible={isDeleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={handleConfirmDelete}
          title={CONSTANTS.MODAL_STRINGS.TITLE}
          message={CONSTANTS.MODAL_STRINGS.MESSAGE}
          confirmText={CONSTANTS.MODAL_STRINGS.CONFIRM_TEXT}
          cancelText={CONSTANTS.MODAL_STRINGS.CANCEL_TEXT}
          variant="error"
        />
      </>
    );
  }
);

EditToolbar.displayName = "EditToolbar";

const styles = StyleSheet.create({
  editToolbar: {
    backgroundColor: theme.colors.primary + "15",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary + "30",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  editToolbarContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editToolbarTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  editToolbarActions: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
  },
  editActionButton: {
    padding: theme.spacing.xs,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  editActionButtonDanger: {
    backgroundColor: theme.colors.error + "10",
    borderColor: theme.colors.error + "30",
  },
});

export default EditToolbar;
