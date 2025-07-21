/**
 * @file src/screens/workout/components/ExerciseCard/SetRow.tsx
 * @description שורת סט בודדת עם התאמה מלאה ל-RTL
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { Set, Exercise } from "../../types/workout.types";

interface SetRowProps {
  set: Set;
  setNumber: number;
  onUpdate: (updates: Partial<Set>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  exercise: Exercise;
}

const SetRow: React.FC<SetRowProps> = ({
  set,
  setNumber,
  onUpdate,
  onDelete,
  onComplete,
  onLongPress,
  isActive,
  exercise,
}) => {
  const checkAnim = useRef(new Animated.Value(set.completed ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(checkAnim, {
      toValue: set.completed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [set.completed]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 0.97 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={1}
      disabled={isActive}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          set.completed && styles.completedContainer,
          isActive && styles.activeContainer,
        ]}
      >
        {/* שינוי RTL: מספר הסט עבר להתחלה (צד ימין) */}
        <View style={styles.setNumberWrapper}>
          <Text style={styles.setNumberText}>{setNumber}</Text>
        </View>

        {/* שינוי RTL: נתוני הביצוע הקודם */}
        <View style={styles.previousContainer}>
          <Text style={styles.previousText}>
            {set.previousWeight && set.previousReps
              ? `${set.previousWeight}×${set.previousReps}`
              : "-"}
          </Text>
        </View>

        {/* שינוי RTL: שדות הקלט */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={set.weight?.toString() || ""}
            onChangeText={(text) =>
              onUpdate({ weight: parseFloat(text) || undefined })
            }
            keyboardType="numeric"
            placeholder="-"
            placeholderTextColor={theme.colors.textSecondary}
            selectTextOnFocus
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={set.reps?.toString() || ""}
            onChangeText={(text) =>
              onUpdate({ reps: parseInt(text, 10) || undefined })
            }
            keyboardType="numeric"
            placeholder="-"
            placeholderTextColor={theme.colors.textSecondary}
            selectTextOnFocus
          />
        </View>

        {/* שינוי RTL: כפתורי הפעולה עברו לסוף (צד שמאל) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={onComplete} style={styles.actionButton}>
            <View style={styles.checkCircle}>
              <Animated.View style={{ opacity: checkAnim }}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={theme.colors.white}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Ionicons
              name="trash-outline"
              size={22}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse", // שינוי RTL: הפך את כיוון הפריסה
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  completedContainer: {
    backgroundColor: `${theme.colors.success}1A`,
  },
  activeContainer: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  setNumberWrapper: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  setNumberText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  previousContainer: {
    flex: 1.2,
    alignItems: "center",
  },
  previousText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row-reverse", // שינוי RTL: הפך את כיוון הכפתורים
    alignItems: "center",
    justifyContent: "flex-end",
    width: 80,
  },
  actionButton: {
    padding: 8,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.success + "33",
  },
});

export default SetRow;
