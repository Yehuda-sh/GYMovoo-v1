/**
 * @file src/screens/workout/components/ExerciseCard/EditToolbar.tsx
 * @brief פס כלים מתקדם למצב עריכה של תרגיל עם תמיכה מלאה ב-RTL ונגישות
 * @features React.memo, אנימציות, RTL support, haptic feedback, accessibility, TypeScript strict
 * @version 1.2.0
 * @updated 2025-09-02 הוסף טיפוסי TypeScript מתקדמים ושיפורי ביצועים
 * @dependencies MaterialCommunityIcons, theme, workoutHelpers, ConfirmationModal, sharedConstants
 * @accessibility מותאם לנגישות עם תוויות ברורות ותמיכה בקוראי מסך
 * @performance ממוטב עם React.memo, useCallback, וקבועים מוגדרים מראש
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
  ANIMATION_OUTPUT_RANGE: [-50, 0] as const,
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
  // הוספת קבועי נגישות מהשירותים המשותפים
  ACCESSIBILITY: {
    DUPLICATE_LABEL: "שכפל תרגיל - יוצר עותק זהה של התרגיל הנוכחי",
    REPLACE_LABEL: "החלף תרגיל - בחר תרגיל אחר במקום הנוכחי",
    DELETE_LABEL: "מחק תרגיל - הסר את התרגיל מהאימון לצמיתות",
    EXIT_EDIT_LABEL: "יציאה ממצב עריכה",
    EDIT_MODE_HINT: "מצב עריכה פעיל - ניתן לשכפל, להחליף או למחוק תרגיל",
  },
} as const;

// 🔧 INTERFACES - הגדרות טיפוסים מתקדמות לבטיחות סוג מוגברת
interface EditToolbarProps {
  /** האם הכלי נראה למשתמש */
  isVisible: boolean;
  /** ערך האנימציה למצב עריכה */
  editModeAnimation: Animated.Value;
  /** פונקציה לשכפול תרגיל (אופציונלי) */
  onDuplicate?: () => void;
  /** פונקציה להחלפת תרגיל (אופציונלי) */
  onReplace?: () => void;
  /** פונקציה להסרת תרגיל (חובה) */
  onRemoveExercise: () => void;
  /** פונקציה ליציאה ממצב עריכה (חובה) */
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
    // 🎯 STATE MANAGEMENT - ניהול מצב פשוט ויעיל
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    // 🎮 EVENT HANDLERS - מטפלי אירועים ממוטבים עם haptic feedback
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

    // 🚪 EARLY RETURN - יציאה מהירה אם לא נראה
    if (!isVisible) return null;

    return (
      <>
        {/* 🎨 MAIN TOOLBAR - כלי העריכה הראשי עם אנימציה */}
        <Animated.View
          style={[
            styles.editToolbar,
            {
              opacity: editModeAnimation,
              transform: [
                {
                  translateY: editModeAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0], // Fix TypeScript error by using direct array
                  }),
                },
              ],
            },
          ]}
          accessibilityRole="toolbar"
          accessibilityLabel={CONSTANTS.ACCESSIBILITY.EDIT_MODE_HINT}
        >
          <View style={styles.editToolbarContent}>
            {/* 🏷️ TITLE SECTION - כותרת עם אייקון */}
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="pencil-circle"
                size={18}
                color={theme.colors.primary}
                style={styles.titleIcon}
                accessibilityRole="image"
                accessibilityLabel="אייקון מצב עריכה"
              />
              <Text style={styles.editToolbarTitle}>מצב עריכה פעיל</Text>
            </View>

            {/* 🔧 ACTIONS SECTION - כפתורי פעולה */}
            {/* 🔧 ACTIONS SECTION - כפתורי פעולה */}
            <View style={styles.editToolbarActions}>
              {/* 📋 DUPLICATE BUTTON - כפתור שכפול */}
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleDuplicate}
                disabled={!onDuplicate}
                accessibilityLabel={CONSTANTS.ACCESSIBILITY.DUPLICATE_LABEL}
                accessibilityRole="button"
                accessibilityHint="לחץ כדי לשכפל את התרגיל"
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

              {/* 🔄 REPLACE BUTTON - כפתור החלפה */}
              <TouchableOpacity
                style={styles.editActionButton}
                onPress={handleReplace}
                disabled={!onReplace}
                accessibilityLabel={CONSTANTS.ACCESSIBILITY.REPLACE_LABEL}
                accessibilityRole="button"
                accessibilityHint="לחץ כדי להחליף את התרגיל"
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

              {/* 🗑️ DELETE BUTTON - כפתור מחיקה */}
              <TouchableOpacity
                style={[styles.editActionButton, styles.editActionButtonDanger]}
                onPress={handleDeletePress}
                accessibilityLabel={CONSTANTS.ACCESSIBILITY.DELETE_LABEL}
                accessibilityRole="button"
                accessibilityHint="לחץ כדי למחוק את התרגיל לצמיתות"
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

        {/* 🚨 CONFIRMATION MODAL - מודל אישור מחיקה */}
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

// 🏷️ COMPONENT DISPLAY NAME - שם רכיב לדיבוג
EditToolbar.displayName = "EditToolbar";

// 🎨 STYLES - עיצוב מתקדם עם shadows, RTL ונגישות
const styles = StyleSheet.create({
  // 🏠 Main container with enhanced design
  editToolbar: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    // שיפורי עיצוב מתקדמים עם shadows מותאמות
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
    // RTL support improvements
    direction: "rtl",
  },

  // 📐 Content layout with RTL
  editToolbarContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // 🏷️ Title section with enhanced typography
  titleContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  titleIcon: {
    marginLeft: theme.spacing.xs,
  },

  // ✨ Enhanced title styling
  editToolbarTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: 0.4,
    textShadowColor: `${theme.colors.primary}20`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    // Enhanced readability
    lineHeight: 20,
  },

  // 🔧 Actions container
  editToolbarActions: {
    flexDirection: "row-reverse",
    gap: theme.spacing.md,
    alignItems: "center",
  },

  // 🎯 Enhanced action buttons with premium design
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
    // שיפורי עיצוב מתקדמים עם shadows מותאמות
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    // Enhanced accessibility
    overflow: "hidden",
  },

  // 🚨 Danger button with enhanced visual feedback
  editActionButtonDanger: {
    backgroundColor: `${theme.colors.error}08`,
    borderColor: `${theme.colors.error}30`,
    // צל אדום עדין ומתקדם למשוב ויזואלי מובהק
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default EditToolbar;
