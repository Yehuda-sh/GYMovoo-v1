/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseMenu.tsx
 * @description תפריט אפשרויות לתרגיל עם עיצוב נקי ומקצועי - מותאם לנגישות ואופטימיזציות
 * English: Exercise options menu with clean and professional design - Accessibility optimized
 * @version 2.2.0
 * @author GYMovoo Development Team
 * @created 2024-12-15
 * @modified 2025-01-02
 *
 * @features
 * - ✅ React.memo optimization for performance
 * - ✅ useCallback/useMemo for all handlers and computed values
 * - ✅ Screen reader support with Hebrew announcements
 * - ✅ Haptic feedback for iOS (light/strong vibrations)
 * - ✅ Processing state to prevent double-taps
 * - ✅ Enhanced accessibility labels and hints
 * - ✅ Gesture handling with swipe-to-close
 * - ✅ Animation cleanup on unmount
 * - ✅ Centralized type system integration
 * - ✅ Edit mode awareness for workout sessions
 * - ✅ Set management actions (add/remove sets)
 * - ✅ Exercise reordering with elevator-style controls
 * - 🆕 Edit mode specialized layout with prioritized actions (v2.2.0)
 * - 🆕 Context-aware accessibility announcements for edit mode (v2.2.0)
 *
 * @updates
 * 2025-01-02 - Comprehensive edit mode integration with specialized menu layout and accessibility
 * 2025-08-02 - Enhanced integration with SetRow edit mode and elevator buttons
 * 2025-01-31 - Major performance and accessibility improvements
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  Dimensions,
  AccessibilityInfo,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";
import { ExerciseMenuProps } from "../types";

const { height: screenHeight } = Dimensions.get("window");

// --- Types ---

interface MenuItemProps {
  icon: string;
  iconFamily?: "ionicons" | "material";
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}

// --- MenuItem Component ---
const MenuItem: React.FC<MenuItemProps> = React.memo(
  ({
    icon,
    iconFamily = "ionicons",
    label,
    onPress,
    disabled = false,
    danger = false,
  }) => {
    const IconComponent =
      iconFamily === "ionicons" ? Ionicons : MaterialCommunityIcons;

    const iconColor = useMemo(
      () =>
        danger
          ? theme.colors.error
          : disabled
            ? theme.colors.textSecondary + "60"
            : theme.colors.text,
      [danger, disabled]
    );

    const accessibilityHint = useMemo(() => {
      if (disabled) {
        return `${label} - לא זמין כרגע`;
      }
      return `הקש פעמיים לביצוע ${label}`;
    }, [disabled, label]);

    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          disabled && styles.menuItemDisabled,
          danger && styles.menuItemDanger,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      >
        <View style={styles.menuItemContent}>
          <IconComponent name={icon as never} size={22} color={iconColor} />
          <Text
            style={[
              styles.menuItemText,
              disabled && styles.menuItemTextDisabled,
              danger && styles.menuItemTextDanger,
            ]}
          >
            {label}
          </Text>
        </View>
        {!disabled && (
          <Ionicons
            name="chevron-back"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.chevron}
          />
        )}
      </TouchableOpacity>
    );
  }
);

// --- Main Component ---
const ExerciseMenu: React.FC<ExerciseMenuProps> = React.memo(
  ({
    visible,
    onClose,
    onMoveUp,
    onMoveDown,
    onDelete,
    onDuplicate,
    onReplace,
    onAddSet,
    onDeleteLastSet,
    canMoveUp = true,
    canMoveDown = true,
    hasLastSet = false,
    isEditMode = false, // 🎯 תמיכה חדשה במצב עריכה
    isBatchMode = false,
    selectedExercises = [],
    onBatchDelete,
    onBatchMove,
  }) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

    // Check for screen reader
    useEffect(() => {
      const checkScreenReader = async () => {
        const screenReaderEnabled =
          await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(screenReaderEnabled);
      };

      checkScreenReader();

      const subscription = AccessibilityInfo.addEventListener(
        "screenReaderChanged",
        setIsScreenReaderEnabled
      );

      return () => {
        subscription?.remove();
      };
    }, []);

    // Announce menu opening for screen readers עם תמיכה במצב עריכה
    useEffect(() => {
      if (visible && isScreenReaderEnabled) {
        let announcement;
        if (isBatchMode) {
          announcement = `תפריט עריכה קבוצתית נפתח, ${selectedExercises.length} תרגילים נבחרו`;
        } else if (isEditMode) {
          announcement = "תפריט עריכת תרגיל נפתח - מצב עריכה פעיל"; // 🎯 הודעה למצב עריכה
        } else {
          announcement = "תפריט אפשרויות תרגיל נפתח";
        }

        AccessibilityInfo.announceForAccessibility(announcement);
      }
    }, [
      visible,
      isBatchMode,
      isEditMode,
      selectedExercises.length,
      isScreenReaderEnabled,
    ]);

    // Animation effect with cleanup
    useEffect(() => {
      if (visible) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 85,
            friction: 12,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      }

      // Cleanup on unmount
      return () => {
        slideAnim.stopAnimation();
        fadeAnim.stopAnimation();
        translateY.stopAnimation();
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }
      };
    }, [visible, slideAnim, fadeAnim, translateY]); // Optimized gesture handlers
    const handleGestureEvent = useMemo(
      () =>
        Animated.event([{ nativeEvent: { translationY: translateY } }], {
          useNativeDriver: true,
        }),
      [translateY]
    );

    const handleStateChange = useCallback(
      ({
        nativeEvent,
      }: {
        nativeEvent: { state: number; translationY: number };
      }) => {
        if (nativeEvent.state === State.END) {
          if (nativeEvent.translationY > 100) {
            onClose();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }
      },
      [onClose, translateY]
    );

    // Delete confirmation with optimization
    const confirmDelete = useCallback(() => {
      const title = isBatchMode ? "מחיקת תרגילים" : "מחיקת תרגיל";
      const message = isBatchMode
        ? `למחוק ${selectedExercises.length} תרגילים?`
        : "למחוק את התרגיל?";

      // Provide haptic feedback on confirmation dialogs
      if (Platform.OS === "ios") {
        // Light haptic feedback for confirmation
        triggerVibration("medium");
      }

      Alert.alert(
        title,
        message,
        [
          {
            text: "ביטול",
            style: "cancel",
          },
          {
            text: "מחק",
            style: "destructive",
            onPress: () => {
              // Strong haptic feedback for destructive action
              if (Platform.OS === "ios") {
                triggerVibration("double");
              }

              if (isBatchMode && onBatchDelete) {
                onBatchDelete();
              } else {
                onDelete();
              }
              onClose();
            },
          },
        ],
        { cancelable: true }
      );
    }, [
      isBatchMode,
      selectedExercises.length,
      onBatchDelete,
      onDelete,
      onClose,
    ]);

    const handleAction = useCallback(
      (action?: () => void) => {
        if (action && !isProcessing) {
          setIsProcessing(true);

          // Light haptic feedback for actions
          if (Platform.OS === "ios") {
            triggerVibration("medium");
          }

          // Execute action with small delay to show processing state
          processingTimeoutRef.current = setTimeout(() => {
            action();
            onClose();
            setIsProcessing(false);
          }, 100);
        }
      },
      [onClose, isProcessing]
    );

    // Optimized handlers
    const handleMoveUp = useCallback(
      () => handleAction(onMoveUp),
      [handleAction, onMoveUp]
    );
    const handleMoveDown = useCallback(
      () => handleAction(onMoveDown),
      [handleAction, onMoveDown]
    );
    const handleDuplicate = useCallback(
      () => handleAction(onDuplicate),
      [handleAction, onDuplicate]
    );
    const handleReplace = useCallback(
      () => handleAction(onReplace),
      [handleAction, onReplace]
    );
    const handleAddSet = useCallback(
      () => handleAction(onAddSet),
      [handleAction, onAddSet]
    );
    const handleDeleteLastSet = useCallback(
      () => handleAction(onDeleteLastSet),
      [handleAction, onDeleteLastSet]
    );
    const handleBatchMoveUp = useCallback(
      () => handleAction(() => onBatchMove?.("up")),
      [handleAction, onBatchMove]
    );
    const handleBatchMoveDown = useCallback(
      () => handleAction(() => onBatchMove?.("down")),
      [handleAction, onBatchMove]
    );

    // Memoized title עם תמיכה במצב עריכה
    const title = useMemo(() => {
      if (isBatchMode) {
        return `${selectedExercises.length} תרגילים נבחרו`;
      }
      if (isEditMode) {
        return "עריכת תרגיל"; // 🎯 כותרת מיוחדת למצב עריכה
      }
      return "אפשרויות תרגיל";
    }, [isBatchMode, selectedExercises.length, isEditMode]);

    // Config-driven menu sections to reduce duplication
    interface ConfigItem {
      key: string;
      icon: string;
      label: string;
      action?: () => void;
      disabled?: boolean;
      danger?: boolean;
      iconFamily?: "ionicons" | "material";
      dynamic?: boolean; // indicates label may change per render (e.g., batch count)
    }
    type MenuSection = ConfigItem[];

    const menuSections: MenuSection[] = useMemo(() => {
      if (isBatchMode) {
        return [
          [
            {
              key: "batch_up",
              icon: "arrow-up",
              label: "הזז למעלה",
              action: handleBatchMoveUp,
            },
            {
              key: "batch_down",
              icon: "arrow-down",
              label: "הזז למטה",
              action: handleBatchMoveDown,
            },
          ],
          [
            {
              key: "batch_delete",
              icon: "trash",
              label: `מחק ${selectedExercises.length} תרגילים`,
              action: confirmDelete,
              danger: true,
              dynamic: true,
            },
          ],
        ];
      }
      if (isEditMode) {
        return [
          [
            {
              key: "add_set",
              icon: "add-circle",
              label: "הוסף סט",
              action: handleAddSet,
              disabled: !onAddSet,
            },
            {
              key: "delete_last_set",
              icon: "remove-circle",
              label: "מחק סט אחרון",
              action: handleDeleteLastSet,
              disabled: !onDeleteLastSet || !hasLastSet,
            },
          ],
          [
            {
              key: "move_up",
              icon: "keyboard-arrow-up",
              iconFamily: "material",
              label: "הזז תרגיל למעלה",
              action: handleMoveUp,
              disabled: !canMoveUp,
            },
            {
              key: "move_down",
              icon: "keyboard-arrow-down",
              iconFamily: "material",
              label: "הזז תרגיל למטה",
              action: handleMoveDown,
              disabled: !canMoveDown,
            },
          ],
          [
            {
              key: "duplicate",
              icon: "content-copy",
              iconFamily: "material",
              label: "שכפל תרגיל",
              action: handleDuplicate,
            },
            {
              key: "delete",
              icon: "trash",
              label: "מחק תרגיל",
              action: confirmDelete,
              danger: true,
            },
          ],
        ];
      }
      // Regular mode
      return [
        [
          {
            key: "add_set",
            icon: "add-circle",
            label: "הוסף סט",
            action: handleAddSet,
            disabled: !onAddSet,
          },
          {
            key: "delete_last_set",
            icon: "remove-circle",
            label: "מחק סט אחרון",
            action: handleDeleteLastSet,
            disabled: !onDeleteLastSet || !hasLastSet,
          },
        ],
        [
          {
            key: "duplicate",
            icon: "content-copy",
            iconFamily: "material",
            label: "שכפל תרגיל",
            action: handleDuplicate,
          },
          {
            key: "replace",
            icon: "swap-horizontal",
            iconFamily: "material",
            label: "החלף תרגיל",
            action: handleReplace,
            disabled: !onReplace,
          },
        ],
        [
          {
            key: "move_up",
            icon: "arrow-up",
            label: "הזז למעלה",
            action: handleMoveUp,
            disabled: !canMoveUp,
          },
          {
            key: "move_down",
            icon: "arrow-down",
            label: "הזז למטה",
            action: handleMoveDown,
            disabled: !canMoveDown,
          },
        ],
        [
          {
            key: "delete",
            icon: "trash",
            label: "מחק תרגיל",
            action: confirmDelete,
            danger: true,
          },
        ],
      ];
    }, [
      isBatchMode,
      isEditMode,
      selectedExercises.length,
      handleBatchMoveUp,
      handleBatchMoveDown,
      confirmDelete,
      handleAddSet,
      handleDeleteLastSet,
      onAddSet,
      onDeleteLastSet,
      hasLastSet,
      handleMoveUp,
      handleMoveDown,
      canMoveUp,
      canMoveDown,
      handleDuplicate,
      handleReplace,
      onReplace,
    ]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        <GestureHandlerRootView
          style={styles.modalContainer}
          accessibilityViewIsModal
        >
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="סגור תפריט"
            />
          </Animated.View>

          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
          >
            <Animated.View
              style={[
                styles.menuSheet,
                {
                  transform: [
                    {
                      translateY: Animated.add(
                        slideAnim,
                        translateY.interpolate({
                          inputRange: [0, 1000],
                          outputRange: [0, 1000],
                          extrapolate: "clamp",
                        })
                      ),
                    },
                  ],
                },
              ]}
            >
              {/* Handle */}
              <View style={styles.handle} />

              {/* Title */}
              <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">
                  {title}
                </Text>
              </View>

              {/* Menu Items */}
              <View
                style={[
                  styles.menuContent,
                  isProcessing && styles.menuContentProcessing,
                ]}
                accessibilityRole="menu"
              >
                {menuSections.map((section, sIdx) => (
                  <React.Fragment key={`section_${sIdx}`}>
                    <View style={styles.section}>
                      {section.map(
                        ({
                          key,
                          icon,
                          label,
                          action,
                          disabled,
                          danger,
                          iconFamily,
                        }) => (
                          <MenuItem
                            key={key}
                            icon={icon}
                            iconFamily={iconFamily}
                            label={label}
                            onPress={action || (() => {})}
                            disabled={!!disabled || isProcessing}
                            danger={danger}
                          />
                        )
                      )}
                    </View>
                    {sIdx < menuSections.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </Animated.View>
          </PanGestureHandler>

          {/* Cancel Button - מחוץ ל-PanGestureHandler */}
          <SafeAreaView
            edges={["bottom", "left", "right"]}
            style={styles.cancelButtonContainer}
          >
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="ביטול"
            >
              <Text style={styles.cancelText}>ביטול</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    );
  }
);

MenuItem.displayName = "MenuItem";
ExerciseMenu.displayName = "ExerciseMenu";

// --- Styles ---
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuSheet: {
    position: "absolute",
    bottom: 80, // נותן מקום לכפתור הביטול
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: screenHeight * 0.75 - 80, // נגרע את מקום הכפתור
    ...theme.shadows.large,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: theme.colors.textSecondary + "40",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuContentProcessing: {
    opacity: 0.6,
  },
  section: {
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: 8,
    marginHorizontal: 24,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  menuItemDanger: {
    // לא צריך רקע - נשאיר נקי
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "right",
    flex: 1,
    writingDirection: "rtl",
  },
  menuItemTextDisabled: {
    color: theme.colors.textSecondary,
  },
  menuItemTextDanger: {
    color: theme.colors.error,
    fontWeight: "500",
  },
  chevron: {
    opacity: 0.5,
  },
  cancelButton: {
    marginTop: 12,
    marginHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  cancelButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    backgroundColor: theme.colors.background,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
});

export default ExerciseMenu;
