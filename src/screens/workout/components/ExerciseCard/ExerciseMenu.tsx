/**
 * @file src/screens/workout/components/ExerciseCard/ExerciseMenu.tsx
 * @description תפריט אפשרויות לתרגיל עם עיצוב נקי ומקצועי
 * English: Exercise options menu with clean and professional design
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
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { theme } from "../../../../styles/theme";

const { height: screenHeight } = Dimensions.get("window");

// --- Types ---
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
  // Batch mode props
  isBatchMode?: boolean;
  selectedExercises?: string[];
  onBatchDelete?: () => void;
  onBatchMove?: (direction: "up" | "down") => void;
}

interface MenuItemProps {
  icon: string;
  iconFamily?: "ionicons" | "material";
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}

// --- MenuItem Component ---
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
    ? theme.colors.textSecondary + "60"
    : theme.colors.text;

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
    >
      <View style={styles.menuItemContent}>
        <IconComponent name={icon as any} size={22} color={iconColor} />
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
};

// --- Main Component ---
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
  isBatchMode = false,
  selectedExercises = [],
  onBatchDelete,
  onBatchMove,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Animation effect
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
  }, [visible]);

  // Swipe gesture handlers
  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleStateChange = ({ nativeEvent }: any) => {
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
  };

  // Delete confirmation
  const confirmDelete = () => {
    const title = isBatchMode ? "מחיקת תרגילים" : "מחיקת תרגיל";
    const message = isBatchMode
      ? `למחוק ${selectedExercises.length} תרגילים?`
      : "למחוק את התרגיל?";

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
  };

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
      onClose();
    }
  };

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
              <Text style={styles.title}>
                {isBatchMode
                  ? `${selectedExercises.length} תרגילים נבחרו`
                  : "אפשרויות תרגיל"}
              </Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContent}>
              {isBatchMode ? (
                // Batch mode actions
                <>
                  <MenuItem
                    icon="arrow-up"
                    label="הזז למעלה"
                    onPress={() => handleAction(() => onBatchMove?.("up"))}
                  />
                  <MenuItem
                    icon="arrow-down"
                    label="הזז למטה"
                    onPress={() => handleAction(() => onBatchMove?.("down"))}
                  />
                  <View style={styles.separator} />
                  <MenuItem
                    icon="trash"
                    label={`מחק ${selectedExercises.length} תרגילים`}
                    onPress={confirmDelete}
                    danger
                  />
                </>
              ) : (
                // Regular mode actions
                <>
                  <View style={styles.section}>
                    <MenuItem
                      icon="arrow-up"
                      label="הזז למעלה"
                      onPress={() => handleAction(onMoveUp)}
                      disabled={!canMoveUp}
                    />
                    <MenuItem
                      icon="arrow-down"
                      label="הזז למטה"
                      onPress={() => handleAction(onMoveDown)}
                      disabled={!canMoveDown}
                    />
                  </View>

                  <View style={styles.separator} />

                  <View style={styles.section}>
                    <MenuItem
                      icon="content-copy"
                      iconFamily="material"
                      label="שכפל תרגיל"
                      onPress={() => handleAction(onDuplicate)}
                    />
                    <MenuItem
                      icon="swap-horizontal"
                      iconFamily="material"
                      label="החלף תרגיל"
                      onPress={() => handleAction(onReplace)}
                      disabled={!onReplace}
                    />
                  </View>

                  <View style={styles.separator} />

                  <View style={styles.section}>
                    <MenuItem
                      icon="trash"
                      label="מחק תרגיל"
                      onPress={confirmDelete}
                      danger
                    />
                  </View>
                </>
              )}
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>ביטול</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  );
};

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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: screenHeight * 0.75,
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
  },
  menuContent: {
    paddingVertical: 8,
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
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
});

export default ExerciseMenu;
