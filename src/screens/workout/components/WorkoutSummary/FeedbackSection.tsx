/**
 * @file src/screens/workout/components/WorkoutSummary/FeedbackSection.tsx
 * @brief רכיב משוב אימון מפולח
 * @description מנהל את כל אלמנטי המשוב - קושי, הרגשה, לוח שנה
 * @updated September 2025 - Refactored to use enhanced TouchableButton with haptic feedback
 * @dependencies TouchableButton (enhanced), UniversalModal, useModalManager, MaterialCommunityIcons
 * @features Enhanced haptic feedback, accessibility, cross-platform support, interactive feedback elements
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../styles/theme";
import { useModalManager } from "../../hooks/useModalManager";
import { UniversalModal } from "../../../../components/common/UniversalModal";
import TouchableButton from "../../../../components/ui/TouchableButton";

interface FeedbackSectionProps {
  difficulty: number;
  feeling: string;
  onDifficultyChange: (star: number) => void;
  onFeelingChange: (emotion: string) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = React.memo(
  ({ difficulty, feeling, onDifficultyChange, onFeelingChange }) => {
    const { activeModal, modalConfig, hideModal, showSuccess } =
      useModalManager();

    const emotions = [
      { emoji: "😤", value: "challenging", label: "מאתגר" },
      { emoji: "💪", value: "strong", label: "חזק" },
      { emoji: "😊", value: "enjoyable", label: "נהנה" },
      { emoji: "😴", value: "easy", label: "קל" },
    ];

    const getDifficultyHint = (level: number) => {
      const hints = [
        "בחר מ1-5 ⭐",
        "קל מאוד 😊",
        "קל 🙂",
        "בינוני 😐",
        "קשה 😤",
        "קשה מאוד 🔥",
      ];
      return hints[level] || hints[0];
    };

    return (
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>איך היה האימון? 💪</Text>

        {/* דירוג קושי */}
        <View
          style={styles.compactFeedbackRow}
          testID="feedback-difficulty-row"
        >
          <Text style={styles.compactLabel}>קושי:</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableButton
                key={star}
                onPress={() => onDifficultyChange(star)}
                style={styles.starButton}
                enableHapticFeedback={true}
                hapticType="light"
                accessibilityLabel={`דרג קושי ${star} מתוך 5 כוכבים`}
                accessibilityHint="הקש לשינוי דירוג הקושי"
                testID={`feedback-star-${star}`}
              >
                <MaterialCommunityIcons
                  name={star <= difficulty ? "star" : "star-outline"}
                  size={18}
                  color={
                    star <= difficulty
                      ? theme.colors.warning
                      : theme.colors.textSecondary
                  }
                />
              </TouchableButton>
            ))}
          </View>
          <Text
            style={styles.difficultyHint}
            accessibilityLiveRegion="polite"
            testID="feedback-difficulty-hint"
          >
            {getDifficultyHint(difficulty)}
          </Text>
        </View>

        {/* הרגשה */}
        <View style={styles.compactFeedbackRow} testID="feedback-feeling-row">
          <Text style={styles.compactLabel}>הרגשה:</Text>
          <View style={styles.emotionsContainerCompact}>
            {emotions.map((emotion) => (
              <TouchableButton
                key={emotion.value}
                onPress={() => onFeelingChange(emotion.value)}
                style={[
                  styles.emotionButtonCompact,
                  feeling === emotion.value && styles.emotionButtonSelected,
                ]}
                enableHapticFeedback={true}
                hapticType="light"
                accessibilityLabel={`הרגשה: ${emotion.label}`}
                accessibilityHint="בחר את ההרגשה הכללית מאימון זה"
                testID={`feedback-emotion-${emotion.value}`}
              >
                <Text style={styles.emotionEmojiSmall}>{emotion.emoji}</Text>
                <Text style={styles.emotionLabelSmall}>{emotion.label}</Text>
              </TouchableButton>
            ))}
          </View>
        </View>

        {/* שבוע קומפקטי */}
        <View style={styles.compactFeedbackRow} testID="feedback-week-row">
          <Text style={styles.compactLabel}>השבוע:</Text>
          <View style={styles.weekContainerCompact}>
            {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((day, index) => {
              const isToday = index === new Date().getDay();
              const hasWorkout = index <= 2;
              const isNextPlanned = index === 3;

              return (
                <TouchableButton
                  key={index}
                  style={[
                    styles.dayCircleSmall,
                    hasWorkout && styles.dayCircleWithWorkout,
                    isToday && styles.dayCircleToday,
                    isNextPlanned && styles.dayCirclePlanned,
                  ]}
                  onPress={() => {
                    if (isNextPlanned) {
                      showSuccess(
                        "תזכורת נוספה! 🔔",
                        "תקבל התראה ביום רביעי לאימון הבא"
                      );
                    }
                  }}
                  enableHapticFeedback={true}
                  hapticType={isNextPlanned ? "medium" : "light"}
                  accessibilityLabel={
                    hasWorkout
                      ? `יום ${day} - אימון הושלם`
                      : isNextPlanned
                        ? `יום ${day} - אימון מתוכנן, לחץ להוספת תזכורת`
                        : `יום ${day}`
                  }
                  accessibilityHint={
                    isNextPlanned ? "הוסף תזכורת לאימון הבא" : undefined
                  }
                  testID={`feedback-day-${index}`}
                >
                  {hasWorkout ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={12}
                      color={theme.colors.success}
                    />
                  ) : isNextPlanned ? (
                    <MaterialCommunityIcons
                      name="plus"
                      size={12}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <Text style={styles.dayTextSmall}>{day}</Text>
                  )}
                </TouchableButton>
              );
            })}
            <View style={styles.streakContainer}>
              <Text style={styles.streakTextSmall}>🔥3</Text>
              <Text style={styles.streakHint}>שמור על הלהבה!</Text>
            </View>
          </View>
        </View>

        {/* מודל אחיד למשובים קלים */}
        <UniversalModal
          visible={activeModal !== null}
          type={activeModal || "success"}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={hideModal}
          onConfirm={modalConfig.onConfirm}
          confirmText={modalConfig.confirmText}
          destructive={modalConfig.destructive}
        />
      </View>
    );
  }
);

FeedbackSection.displayName = "FeedbackSection";

const styles = StyleSheet.create({
  feedbackSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.body.fontSize + 1,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  compactFeedbackRow: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  compactLabel: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 0.3,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  starsContainer: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "center",
  },
  starButton: {
    padding: theme.spacing.xs,
    marginHorizontal: theme.spacing.xs,
  },
  difficultyHint: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    flex: 0.4,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
    fontStyle: "italic",
  },
  emotionsContainerCompact: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    flex: 0.7,
    justifyContent: "space-around",
  },
  emotionButtonCompact: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
    borderWidth: 2,
    borderColor: "transparent",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  emotionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
  },
  emotionEmojiSmall: {
    fontSize: 16,
  },
  emotionLabelSmall: {
    fontSize: theme.typography.caption.fontSize - 1,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  weekContainerCompact: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    flex: 0.7,
    alignItems: "center",
    justifyContent: "space-around",
  },
  dayCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.textSecondary + "40",
  },
  dayCircleWithWorkout: {
    backgroundColor: theme.colors.success + "20",
    borderColor: theme.colors.success,
  },
  dayCircleToday: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  dayCirclePlanned: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + "20",
  },
  dayTextSmall: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  streakContainer: {
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  streakTextSmall: {
    fontSize: 14,
    color: theme.colors.warning,
    fontWeight: "600",
  },
  streakHint: {
    fontSize: theme.typography.caption.fontSize - 2,
    color: theme.colors.warning,
    fontWeight: "500",
    textAlign: "center",
  },
});
