/**
 * @file src/screens/workout/components/WorkoutHeader.tsx
 * @description הדר אימון קומפקטי ומשופר
 * English: Compact and improved workout header
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../styles/theme";

interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: string;
  onTimerPress: () => void; // Prop חדש לפתיחת הדשבורד
  onNamePress: () => void; // Prop חדש לעריכת השם
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutName,
  elapsedTime,
  onTimerPress,
  onNamePress,
}) => {
  const navigation = useNavigation();
  const backIconName = I18nManager.isRTL ? "chevron-forward" : "chevron-back";

  return (
    <View style={styles.container}>
      {/* כפתור תפריט - בצד ימין */}
      <TouchableOpacity
        onPress={() => {
          /* TODO: Open Menu */
        }}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={28}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {/* תוכן מרכזי */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={onNamePress}
          style={styles.nameContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.workoutName} numberOfLines={1}>
            {workoutName}
          </Text>
          <Ionicons
            name="pencil"
            size={14}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTimerPress}
          style={styles.timerContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.timerText}>{elapsedTime}</Text>
          <Ionicons
            name="timer-outline"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* כפתור חזרה - בצד שמאל */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        <Ionicons name={backIconName} size={32} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse", // תיקון RTL
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  iconButton: {
    padding: 4,
  },
  centerContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  nameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  workoutName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right", // הוספת יישור לימין
  },
  timerContainer: {
    flexDirection: "row-reverse", // תיקון RTL
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  timerText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
