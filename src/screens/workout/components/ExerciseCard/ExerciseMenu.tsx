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
  Vibration,
  ActivityIndicator, // 🎯 הוספת ספינר
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { theme } from "../../../../styles/theme";
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
    const [isPressed, setIsPressed] = useState(false); // 🎯 מצב לחיצה
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
          isPressed && styles.menuItemPressed, // 🎯 סגנון לחיצה
        ]}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)} // 🎯 התחלת לחיצה
        onPressOut={() => setIsPressed(false)} // 🎯 סיום לחיצה
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
    const [showAdvancedMenu, setShowAdvancedMenu] = useState(false); // 🎯 מצב תפריט מתקדם
    const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Reset advanced menu when visibility changes
    useEffect(() => {
      if (!visible) {
        setShowAdvancedMenu(false);
      }
    }, [visible]);

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
        Vibration.vibrate([0, 50]);
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
                Vibration.vibrate([0, 100, 50, 100]);
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
            Vibration.vibrate(50);
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

    // 🎯 טיפול במעבר לתפריט מתקדם
    const handleShowAdvanced = useCallback(() => {
      setShowAdvancedMenu(true);

      // הודעת נגישות
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility(
          "תפריט אפשרויות נוספות נפתח"
        );
      }

      // רטט קל
      if (Platform.OS === "ios") {
        Vibration.vibrate(30);
      }
    }, [isScreenReaderEnabled]);

    const handleBackToMain = useCallback(() => {
      setShowAdvancedMenu(false);

      // הודעת נגישות
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility("חזרה לתפריט הראשי");
      }
    }, [isScreenReaderEnabled]);

    // 🎯 חישוב גובה דינמי בהתאם לתוכן
    const calculateMenuHeight = useMemo(() => {
      let itemCount = 0;

      if (isBatchMode) {
        itemCount = 4; // 3 פריטים + ביטול
      } else if (!showAdvancedMenu) {
        itemCount = isEditMode ? 5 : 4; // פריטים בסיסיים + כותרת + ביטול
      } else {
        itemCount = isEditMode ? 8 : 10; // כל הפריטים + כותרות + ביטול
      }

      const itemHeight = 48; // גובה פריט קומפקטי
      const headerHeight = 50; // כותרת קומפקטית
      const handleHeight = 30; // handle קטן
      const padding = 32; // פדינג כללי

      const calculatedHeight =
        itemCount * itemHeight + headerHeight + handleHeight + padding;
      return Math.min(calculatedHeight, screenHeight * 0.65); // מקסימום 65%
    }, [isBatchMode, showAdvancedMenu, isEditMode]);

    // Memoized title עם תמיכה במצב עריכה
    const title = useMemo(() => {
      if (isBatchMode) {
        return `${selectedExercises.length} תרגילים נבחרו`;
      }
      if (isEditMode) {
        return showAdvancedMenu ? "אפשרויות נוספות" : "עריכת תרגיל"; // 🎯 כותרת דינמית
      }
      return showAdvancedMenu ? "אפשרויות נוספות" : "אפשרויות תרגיל"; // 🎯 כותרת דינמית
    }, [isBatchMode, selectedExercises.length, isEditMode, showAdvancedMenu]);

    // Enhanced accessibility for disabled items
    const getAccessibilityHint = useCallback(
      (disabled: boolean, label: string) => {
        if (disabled) {
          return `${label} - לא זמין כרגע`;
        }
        return `הקש פעמיים לביצוע ${label}`;
      },
      []
    );

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        <GestureHandlerRootView style={styles.modalContainer}>
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
                  height: calculateMenuHeight, // 🎯 גובה דינמי
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
              {/* Handle עם שיפורים */}
              <View style={styles.handleContainer}>
                <MaterialCommunityIcons
                  name="drag-horizontal"
                  size={16}
                  color={theme.colors.textSecondary + "60"}
                  style={styles.dragIcon}
                />
                <View style={styles.handle} />
              </View>

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
                {/* 🎯 ספינר במצב עיבוד */}
                {isProcessing && (
                  <View style={styles.processingOverlay}>
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primary}
                    />
                    <Text style={styles.processingText}>מבצע פעולה...</Text>
                  </View>
                )}
                {isBatchMode ? (
                  // Batch mode actions
                  <>
                    <MenuItem
                      icon="arrow-up"
                      label="הזז למעלה"
                      onPress={handleBatchMoveUp}
                    />
                    <MenuItem
                      icon="arrow-down"
                      label="הזז למטה"
                      onPress={handleBatchMoveDown}
                    />
                    <View style={styles.separator} />
                    <MenuItem
                      icon="trash"
                      label={`מחק ${selectedExercises.length} תרגילים`}
                      onPress={confirmDelete}
                      danger
                    />
                  </>
                ) : !showAdvancedMenu ? (
                  // 🎯 תפריט ראשי חכם - פעולות עיקריות בלבד
                  <>
                    {isEditMode ? (
                      // מצב עריכה - פעולות עדיפות
                      <>
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionHeaderText}>
                            פעולות מהירות
                          </Text>
                        </View>
                        <MenuItem
                          icon="keyboard-arrow-up"
                          iconFamily="material"
                          label="הזז למעלה"
                          onPress={handleMoveUp}
                          disabled={!canMoveUp}
                        />
                        <MenuItem
                          icon="keyboard-arrow-down"
                          iconFamily="material"
                          label="הזז למטה"
                          onPress={handleMoveDown}
                          disabled={!canMoveDown}
                        />
                        <MenuItem
                          icon="content-copy"
                          iconFamily="material"
                          label="שכפל תרגיל"
                          onPress={handleDuplicate}
                        />
                      </>
                    ) : (
                      // מצב רגיל - פעולות נפוצות
                      <>
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionHeaderText}>
                            פעולות נפוצות
                          </Text>
                        </View>
                        <MenuItem
                          icon="add-circle"
                          label="הוסף סט"
                          onPress={handleAddSet}
                          disabled={!onAddSet}
                        />
                        <MenuItem
                          icon="swap-horizontal"
                          iconFamily="material"
                          label="החלף תרגיל"
                          onPress={handleReplace}
                          disabled={!onReplace}
                        />
                      </>
                    )}

                    <View style={styles.separator} />

                    {/* כפתור אפשרויות נוספות */}
                    <MenuItem
                      icon="ellipsis-horizontal"
                      label="אפשרויות נוספות..."
                      onPress={handleShowAdvanced}
                    />
                  </>
                ) : (
                  // 🎯 תפריט מתקדם - כל שאר האפשרויות
                  <>
                    {/* כפתור חזרה */}
                    <MenuItem
                      icon="arrow-back"
                      label="חזרה לתפריט הראשי"
                      onPress={handleBackToMain}
                    />

                    <View style={styles.separator} />

                    {isEditMode ? (
                      // אפשרויות נוספות למצב עריכה
                      <>
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionHeaderText}>
                            ניהול סטים
                          </Text>
                        </View>
                        <MenuItem
                          icon="add-circle"
                          label="הוסף סט"
                          onPress={handleAddSet}
                          disabled={!onAddSet}
                        />
                        <MenuItem
                          icon="remove-circle"
                          label="מחק סט אחרון"
                          onPress={handleDeleteLastSet}
                          disabled={!onDeleteLastSet || !hasLastSet}
                        />

                        <View style={styles.separator} />

                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionHeaderText}>
                            אזור סכנה
                          </Text>
                        </View>
                        <MenuItem
                          icon="trash"
                          label="מחק תרגיל"
                          onPress={confirmDelete}
                          danger
                        />
                      </>
                    ) : (
                      // אפשרויות נוספות למצב רגיל
                      <>
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionHeaderText}>
                            ניהול סטים
                          </Text>
                        </View>
                        <MenuItem
                          icon="remove-circle"
                          label="מחק סט אחרון"
                          onPress={handleDeleteLastSet}
                          disabled={!onDeleteLastSet || !hasLastSet}
                        />

                        <View style={styles.separator} />

                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionHeaderText}>
                            מיקום וסדר
                          </Text>
                        </View>
                        <MenuItem
                          icon="arrow-up"
                          label="הזז למעלה"
                          onPress={handleMoveUp}
                          disabled={!canMoveUp}
                        />
                        <MenuItem
                          icon="arrow-down"
                          label="הזז למטה"
                          onPress={handleMoveDown}
                          disabled={!canMoveDown}
                        />
                        <MenuItem
                          icon="content-copy"
                          iconFamily="material"
                          label="שכפל תרגיל"
                          onPress={handleDuplicate}
                        />

                        <View style={styles.separator} />

                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionHeaderText}>
                            אזור סכנה
                          </Text>
                        </View>
                        <MenuItem
                          icon="trash"
                          label="מחק תרגיל"
                          onPress={confirmDelete}
                          danger
                        />
                      </>
                    )}
                  </>
                )}

                {/* ביטול - כפריט אחרון בתפריט עם עיצוב מיוחד */}
                <View style={styles.separator} />
                <View style={styles.cancelSection}>
                  <TouchableOpacity
                    style={styles.cancelMenuItem}
                    onPress={onClose}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="ביטול"
                    accessibilityHint="סגור את התפריט"
                  >
                    <View style={styles.cancelItemContent}>
                      <MaterialCommunityIcons
                        name="close"
                        size={22}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.cancelItemText}>ביטול</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </PanGestureHandler>
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
    bottom: 0, // בדיוק בתחתית - ללא מרווח
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20, // פחות עגול
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 16, // התחשבות ב-safe area
    // הסרת maxHeight - נשתמש בגובה דינמי
    ...theme.shadows.medium, // צל פחות דרמטי
  },
  handle: {
    width: 40, // קצת יותר קטן
    height: 4, // נשאר באותו גובה
    backgroundColor: theme.colors.textSecondary + "50",
    borderRadius: 2,
    alignSelf: "center",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10, // פחות פדינג
    paddingHorizontal: 20,
    marginTop: 2,
    marginBottom: 2,
  },
  dragIcon: {
    marginBottom: 4,
    opacity: 0.6,
  },
  header: {
    paddingVertical: 8, // פחות פדינג
    paddingHorizontal: 20, // פחות פדינג אופקי
    borderBottomWidth: 0, // ללא גבול - נקי יותר
  },
  title: {
    fontSize: 16, // קטן יותר
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  menuContent: {
    paddingVertical: 4, // פחות פדינג
  },
  menuContentProcessing: {
    opacity: 0.6,
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background + "E0", // רקע שקוף קל
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    gap: 12,
  },
  processingText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.primary,
    textAlign: "center",
  },
  section: {
    paddingVertical: 4,
  },
  sectionHeader: {
    paddingHorizontal: 20, // פחות פדינג
    paddingVertical: 6, // פחות פדינג
    paddingTop: 8, // פחות פדינג עליון
  },
  sectionHeaderText: {
    fontSize: 12, // קטן יותר
    fontWeight: "600",
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.cardBorder + "60", // יותר עדין
    marginVertical: 6, // פחות מרווח
    marginHorizontal: 20, // פחות מרווח אופקי
  },
  menuItem: {
    paddingVertical: 12, // פחות פדינג אנכי
    paddingHorizontal: 20, // פחות פדינג אופקי
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48, // גובה מינימלי קבוע
  },
  menuItemPressed: {
    backgroundColor: theme.colors.primary + "08", // רקע עדין בלחיצה
    transform: [{ scale: 0.98 }], // קצת קטן יותר
  },
  menuItemContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    gap: 12, // פחות רווח בין אייקון לטקסט
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
  // סגנונות כפתור ביטול מיוחד
  cancelSection: {
    marginTop: 6, // פחות מרווח
    paddingHorizontal: 12, // פחות פדינג
  },
  cancelMenuItem: {
    paddingVertical: 12, // פחות פדינג
    paddingHorizontal: 20,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.error + "06", // רקע עדין יותר
    borderRadius: 10, // פחות עגול
    borderWidth: 0.5, // גבול דק יותר
    borderColor: theme.colors.error + "15", // מסגרת עדינה יותר
    marginVertical: 2, // פחות מרווח
    minHeight: 44, // גובה מינימלי
  },
  cancelItemContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10, // פחות רווח
  },
  cancelItemText: {
    fontSize: 15, // קטן יותר
    color: theme.colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ExerciseMenu;
