/**
 * @file src/screens/workout/components/WorkoutHeader.tsx
 * @description הדר האימון עם שם, טיימר וכפתורי פעולה
 * English: Workout header with name, timer and action buttons
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../styles/theme";
// import { BlurView } from 'expo-blur'; // הוסר - נשתמש בעיצוב חלופי

interface WorkoutHeaderProps {
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
  elapsedTime: string;
  onFinish: () => void;
  onPause?: () => void;
  isPaused?: boolean;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutName,
  onWorkoutNameChange,
  elapsedTime,
  onFinish,
  onPause,
  isPaused = false,
}) => {
  const navigation = useNavigation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // אנימציית לחיצה
  // Press animation
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // טיפול בסיום אימון
  // Handle finish workout
  const handleFinish = () => {
    Alert.alert("🏁 סיום אימון", "האם אתה בטוח שברצונך לסיים את האימון?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "סיים אימון",
        style: "destructive",
        onPress: () => {
          animatePress();
          onFinish();
        },
      },
    ]);
  };

  // תפריט אפשרויות
  // Options menu
  const WorkoutMenu = () => (
    <Modal
      visible={showMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMenu(false)}
    >
      <TouchableOpacity
        style={styles.menuOverlay}
        activeOpacity={1}
        onPress={() => setShowMenu(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onPause?.();
              }}
            >
              <Ionicons
                name={isPaused ? "play" : "pause"}
                size={24}
                color={theme.colors.text}
              />
              <Text style={styles.menuItemText}>
                {isPaused ? "המשך אימון" : "השהה אימון"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // TODO: הוסף לוגיקה לשמירה
              }}
            >
              <Ionicons name="save" size={24} color={theme.colors.text} />
              <Text style={styles.menuItemText}>שמור כתבנית</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                setShowMenu(false);
                navigation.goBack();
              }}
            >
              <Ionicons name="exit" size={24} color={theme.colors.error} />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                צא ללא שמירה
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* כפתור חזור */}
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons
            name="chevron-forward"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        {/* טיימר */}
        {/* Timer */}
        <View style={styles.timerContainer}>
          <MaterialCommunityIcons
            name="timer"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.timerText}>{elapsedTime}</Text>
        </View>

        {/* תפריט */}
        {/* Menu */}
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          style={styles.iconButton}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.centerRow}>
        {/* שם האימון */}
        {/* Workout name */}
        {isEditingName ? (
          <TextInput
            style={styles.workoutNameInput}
            value={workoutName}
            onChangeText={onWorkoutNameChange}
            onBlur={() => setIsEditingName(false)}
            autoFocus
            selectTextOnFocus
            maxLength={30}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <Text style={styles.workoutName}>{workoutName}</Text>
            <View style={styles.editHint}>
              <Ionicons
                name="pencil"
                size={12}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.editHintText}>לחץ לעריכה</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* כפתור סיום */}
      {/* Finish button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>סיים אימון</Text>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <WorkoutMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  timerText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "600",
    fontVariant: ["tabular-nums" as const],
  },
  centerRow: {
    alignItems: "center",
    marginBottom: 20,
  },
  workoutName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  workoutNameInput: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingVertical: 4,
    minWidth: 200,
  },
  editHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 4,
  },
  editHintText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.success,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    marginHorizontal: 20,
    ...theme.shadows.medium,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: "80%",
    maxWidth: 300,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: theme.colors.card,
    ...theme.shadows.large,
  },
  menuContent: {
    backgroundColor: "rgba(36, 42, 71, 0.98)",
    padding: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuItemText: {
    color: theme.colors.text,
    fontSize: 16,
    flex: 1,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  menuItemTextDanger: {
    color: theme.colors.error,
  },
});
