/**
 * @file src/screens/workout/components/ExerciseCard/EditToolbar.tsx
 * @brief פס כלים למצב עריכה של תרגיל
 * @features React.memo, אנימציות, RTL support
 */

import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";

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
    const handleDelete = useCallback(() => {
      if (Platform.OS === "ios") {
        triggerVibration("medium");
      }

      Alert.alert("מחיקת תרגיל", "האם אתה בטוח שברצונך למחוק את התרגיל?", [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            if (Platform.OS === "ios") {
              triggerVibration("double");
            }
            onRemoveExercise();
            onExitEditMode();
          },
        },
      ]);
    }, [onRemoveExercise, onExitEditMode]);

    const handleDuplicate = useCallback(() => {
      if (Platform.OS === "ios") {
        triggerVibration("short");
      }
      onDuplicate?.();
    }, [onDuplicate]);

    const handleReplace = useCallback(() => {
      if (Platform.OS === "ios") {
        triggerVibration("short");
      }
      onReplace?.();
    }, [onReplace]);

    if (!isVisible) return null;

    return (
      <Animated.View
        style={[
          styles.editToolbar,
          {
            opacity: editModeAnimation,
            transform: [
              {
                translateY: editModeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
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
                size={20}
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
                size={20}
                color={
                  onReplace ? theme.colors.primary : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.editActionButton, styles.editActionButtonDanger]}
              onPress={handleDelete}
              accessibilityLabel="מחק תרגיל"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name="delete"
                size={20}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
