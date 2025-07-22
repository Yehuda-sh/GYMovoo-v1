/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseMenu.tsx
 * @description תפריט אפשרויות לתרגיל - מחיקה, שכפול, סידור
 * English: Exercise options menu - delete, duplicate, reorder
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { theme } from "../../../../styles/theme";

// --- Types ---
interface Action {
  undo: () => void;
  timestamp: number;
  description: string;
}

interface BatchAction {
  label: string;
  icon: string;
  iconFamily?: "ionicons" | "material";
  action: () => void | Promise<void>;
  requiresConfirmation?: boolean;
  danger?: boolean;
}

type MenuItemProps = {
  icon: string;
  iconFamily?: "ionicons" | "material";
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
  isLoading?: boolean;
  index?: number;
  isPreview?: boolean;
};

// --- MenuItem Component ---
const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconFamily = "ionicons",
  label,
  onPress,
  disabled = false,
  danger = false,
  isLoading = false,
  index = 0,
  isPreview = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const IconComponent =
    iconFamily === "ionicons" ? Ionicons : MaterialCommunityIcons;
  const iconColor = danger
    ? theme.colors.error
    : disabled
    ? theme.colors.textSecondary
    : isPreview
    ? theme.colors.primary
    : isDark
    ? theme.colors.darkText
    : theme.colors.text;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.menuItem,
          disabled && styles.menuItemDisabled,
          isPreview && styles.menuItemPreview,
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <IconComponent name={icon as any} size={24} color={iconColor} />
        )}
        <Text
          style={[
            styles.menuItemText,
            disabled && styles.menuItemTextDisabled,
            danger && styles.menuItemTextDanger,
            isPreview && styles.menuItemTextPreview,
            isDark && styles.menuItemTextDark,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Main Component ---
interface ExerciseMenuProps {
  visible: boolean;
  onClose: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReplace?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isLoading?: boolean;
  loadingAction?: string;
  // Props for batch mode
  isBatchMode?: boolean;
  selectedExercises?: string[];
  onBatchDelete?: () => void;
  onBatchMove?: (direction: "up" | "down") => void;
  // Props for undo
  showUndo?: (action: Action) => void;
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
  isLoading = false,
  loadingAction = "",
  isBatchMode = false,
  selectedExercises = [],
  onBatchDelete,
  onBatchMove,
  showUndo,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const [currentAction, setCurrentAction] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<string | null>(null);
  const [actionHistory, setActionHistory] = useState<Action[]>([]);

  // הוספת state למעקב אחר ה-visible הקודם
  // Adding state to track previous visible value
  const [wasVisible, setWasVisible] = useState(visible);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // דיבוג חכם - הדפסה רק בשינוי ה-visibility
  // Smart debug - print only on visibility change
  useEffect(() => {
    if (visible !== wasVisible) {
      console.log(
        `🔷 ExerciseMenu visibility changed: ${wasVisible} → ${visible}`,
        {
          isBatchMode,
          selectedExercisesCount: selectedExercises.length,
          canMoveUp,
          canMoveDown,
        }
      );
      setWasVisible(visible);
    }
  }, [visible, wasVisible]);

  // Animation effect
  useEffect(() => {
    const toValue = visible ? 0 : 300;
    const fadeToValue = visible ? 1 : 0;
    const animationConfig = { duration: 300, useNativeDriver: true };

    Animated.parallel([
      Animated.timing(slideAnim, { toValue, ...animationConfig }),
      Animated.timing(fadeAnim, { toValue: fadeToValue, ...animationConfig }),
    ]).start();
  }, [visible]);

  // Swipe gesture handler
  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationY > 100) {
        console.log("📱 Swipe down detected - closing menu");
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Execute with undo support
  const executeWithUndo = async (
    action: () => void | Promise<void>,
    undoAction: () => void,
    description: string
  ) => {
    console.log(`🔄 Executing action with undo: ${description}`);
    try {
      await action();
      const newAction: Action = {
        undo: undoAction,
        timestamp: Date.now(),
        description,
      };
      setActionHistory((prev) => [...prev, newAction]);

      if (showUndo) {
        showUndo(newAction);
      }
    } catch (error) {
      console.error(`❌ Error executing action ${description}:`, error);
    }
  };

  // Create handler with loading state
  const createAndCloseHandler =
    (
      action: (() => void | Promise<void>) | undefined,
      actionName: string,
      undoAction?: () => void
    ) =>
    async () => {
      console.log(`🚀 Action triggered: ${actionName}`);
      if (action) {
        setCurrentAction(actionName);
        try {
          if (undoAction) {
            await executeWithUndo(action, undoAction, actionName);
          } else {
            await action();
          }
        } catch (error) {
          console.error(`❌ Error in action ${actionName}:`, error);
        } finally {
          setCurrentAction("");
          onClose();
        }
      }
    };

  // Preview handlers
  const handlePreview = (mode: string) => {
    console.log(`👁️ Preview mode: ${mode}`);
    setPreviewMode(mode);
  };

  const confirmPreview = () => {
    console.log(`✅ Preview confirmed: ${previewMode}`);
    if (previewMode === "moveUp" && onMoveUp) {
      createAndCloseHandler(onMoveUp, "moveUp")();
    } else if (previewMode === "moveDown" && onMoveDown) {
      createAndCloseHandler(onMoveDown, "moveDown")();
    }
    setPreviewMode(null);
  };

  const cancelPreview = () => {
    setPreviewMode(null);
  };

  // Delete confirmation
  const confirmDelete = () => {
    const message = isBatchMode
      ? `האם אתה בטוח שברצונך למחוק ${selectedExercises.length} תרגילים?`
      : "האם אתה בטוח שברצונך למחוק את התרגיל?";

    console.log(`🗑️ Delete confirmation - batch: ${isBatchMode}`);

    Alert.alert("🗑️ מחיקת תרגיל", message, [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          if (isBatchMode && onBatchDelete) {
            createAndCloseHandler(onBatchDelete, "batchDelete")();
          } else {
            createAndCloseHandler(onDelete, "delete")();
          }
        },
      },
    ]);
  };

  // Batch actions
  const batchActions: BatchAction[] = [
    {
      label: `מחק ${selectedExercises.length} תרגילים`,
      icon: "trash-outline",
      action: confirmDelete,
      danger: true,
    },
    {
      label: "הזז למעלה",
      icon: "arrow-up-circle-outline",
      action: () => onBatchMove?.("up"),
      requiresConfirmation: false,
    },
    {
      label: "הזז למטה",
      icon: "arrow-down-circle-outline",
      action: () => onBatchMove?.("down"),
      requiresConfirmation: false,
    },
  ];

  // Dynamic styles
  const dynamicStyles = {
    menuContainer: {
      backgroundColor: isDark ? theme.colors.darkCard : theme.colors.card,
    },
    title: {
      color: isDark ? theme.colors.darkText : theme.colors.text,
    },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.overlay}>
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

          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
          >
            <Animated.View
              style={[
                styles.menuContainer,
                dynamicStyles.menuContainer,
                {
                  transform: [
                    { translateY: Animated.add(slideAnim, translateY) },
                  ],
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.dragHandle} />
              <View style={styles.header}>
                <Text style={[styles.title, dynamicStyles.title]}>
                  {isBatchMode
                    ? `${selectedExercises.length} תרגילים נבחרו`
                    : previewMode
                    ? "תצוגה מקדימה"
                    : "אפשרויות תרגיל"}
                </Text>
              </View>

              <ScrollView style={styles.scrollContainer}>
                {previewMode ? (
                  // Preview mode UI
                  <View style={styles.previewContainer}>
                    <Text style={styles.previewText}>
                      {previewMode === "moveUp"
                        ? "התרגיל יוזז מעלה"
                        : "התרגיל יוזז מטה"}
                    </Text>
                    <View style={styles.previewActions}>
                      <TouchableOpacity
                        style={styles.previewButton}
                        onPress={cancelPreview}
                      >
                        <Text style={styles.previewButtonText}>ביטול</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.previewButton,
                          styles.previewButtonConfirm,
                        ]}
                        onPress={confirmPreview}
                      >
                        <Text style={styles.previewButtonTextConfirm}>אשר</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : isBatchMode ? (
                  // Batch mode actions
                  <View style={styles.section}>
                    {batchActions.map((action, index) => (
                      <MenuItem
                        key={action.label}
                        icon={action.icon as any}
                        iconFamily={action.iconFamily}
                        label={action.label}
                        onPress={() =>
                          createAndCloseHandler(action.action, action.label)()
                        }
                        danger={action.danger}
                        isLoading={currentAction === action.label}
                        index={index}
                      />
                    ))}
                  </View>
                ) : (
                  // Regular mode actions
                  <>
                    <View style={styles.section}>
                      <MenuItem
                        icon="arrow-up-circle-outline"
                        label="הזז למעלה"
                        onPress={() => handlePreview("moveUp")}
                        disabled={!canMoveUp}
                        isLoading={currentAction === "moveUp"}
                        index={0}
                      />
                      <MenuItem
                        icon="arrow-down-circle-outline"
                        label="הזז למטה"
                        onPress={() => handlePreview("moveDown")}
                        disabled={!canMoveDown}
                        isLoading={currentAction === "moveDown"}
                        index={1}
                      />
                    </View>

                    <View style={styles.section}>
                      <MenuItem
                        icon="content-duplicate"
                        iconFamily="material"
                        label="שכפל תרגיל"
                        onPress={createAndCloseHandler(
                          onDuplicate,
                          "duplicate"
                        )}
                        isLoading={currentAction === "duplicate"}
                        index={2}
                      />
                      <MenuItem
                        icon="swap-horizontal"
                        iconFamily="material"
                        label="החלף תרגיל"
                        onPress={createAndCloseHandler(onReplace, "replace")}
                        disabled={!onReplace}
                        isLoading={currentAction === "replace"}
                        index={3}
                      />
                    </View>

                    <View style={styles.section}>
                      <MenuItem
                        icon="trash-outline"
                        label="מחק תרגיל"
                        onPress={confirmDelete}
                        danger
                        isLoading={currentAction === "delete"}
                        index={4}
                      />
                    </View>
                  </>
                )}
              </ScrollView>

              <TouchableOpacity
                style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
                onPress={onClose}
              >
                <Text
                  style={[styles.cancelText, isDark && styles.cancelTextDark]}
                >
                  ביטול
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Modal>
  );
};

// --- Styles ---
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
    maxHeight: "80%",
    ...theme.shadows.large,
  },
  scrollContainer: {
    flexGrow: 0,
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
    flexDirection: "row-reverse", // RTL fix!
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemPreview: {
    backgroundColor: theme.colors.primaryLight + "20",
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right", // RTL fix!
  },
  menuItemTextDisabled: {
    color: theme.colors.textSecondary,
  },
  menuItemTextDanger: {
    color: theme.colors.error,
  },
  menuItemTextPreview: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
  menuItemTextDark: {
    color: theme.colors.darkText,
  },
  cancelButton: {
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonDark: {
    backgroundColor: theme.colors.darkBackground,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  cancelTextDark: {
    color: theme.colors.darkText,
  },
  // Preview styles
  previewContainer: {
    padding: 20,
    alignItems: "center",
  },
  previewText: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  previewActions: {
    flexDirection: "row-reverse", // RTL fix!
    gap: 12,
  },
  previewButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewButtonConfirm: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  previewButtonText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
  },
  previewButtonTextConfirm: {
    color: "#FFFFFF",
  },
});

export default ExerciseMenu;
