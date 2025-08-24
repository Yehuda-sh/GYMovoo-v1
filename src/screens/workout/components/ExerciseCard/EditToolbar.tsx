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
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="pencil-circle"
                size={18}
                color={theme.colors.primary}
                style={styles.titleIcon}
              />
              <Text style={styles.editToolbarTitle}>מצב עריכה פעיל</Text>
            </View>
            <View style={styles.editToolbarActions}>
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleDuplicate}
                disabled={!onDuplicate}
                accessibilityLabel="שכפל תרגיל"
                accessibilityRole="button"
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={22}
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
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name="swap-horizontal"
                  size={22}
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
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={22}
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
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    // שיפורי עיצוב מתקדמים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}15`,
  },
  editToolbarContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  titleIcon: {
    marginLeft: theme.spacing.xs,
  },
  editToolbarTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: 0.4,
    textShadowColor: `${theme.colors.primary}20`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  editToolbarActions: {
    flexDirection: "row-reverse",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  editActionButton: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    borderWidth: 1.5,
    borderColor: `${theme.colors.cardBorder}40`,
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    // שיפורי עיצוב מתקדמים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  editActionButtonDanger: {
    backgroundColor: `${theme.colors.error}08`,
    borderColor: `${theme.colors.error}30`,
    // צל אדום עדין ומתקדם
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default EditToolbar;
