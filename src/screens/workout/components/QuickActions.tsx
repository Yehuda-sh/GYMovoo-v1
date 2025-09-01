/**
 * @file src/screens/workout/components/QuickActions.tsx
 * @brief Quick Action Buttons Component for Workout Plans
 * @updated September 2025 - Refactored to use enhanced TouchableButton with haptic feedback
 * @dependencies TouchableButton (enhanced), MaterialCommunityIcons, theme
 * @features Enhanced haptic feedback, loading states, accessibility, cross-platform support
 */

import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import TouchableButton from "../../../components/ui/TouchableButton";

interface QuickActionsProps {
  onRegenerateBasic: () => void;
  onRegenerateAI: () => void;
  onStartWorkout: () => void;
  canAccessAI: boolean;
  hasWorkoutPlan: boolean;
  loading: boolean;
}

const QuickActions = memo(
  ({
    onRegenerateBasic,
    onRegenerateAI,
    onStartWorkout,
    canAccessAI,
    hasWorkoutPlan,
    loading,
  }: QuickActionsProps) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>פעולות מהירות</Text>

        <View style={styles.actionsGrid}>
          {/* Regenerate Basic Plan */}
          <TouchableButton
            style={[styles.actionButton, styles.basicButton]}
            onPress={onRegenerateBasic}
            disabled={loading}
            loading={loading}
            enableHapticFeedback={true}
            hapticType="medium"
            accessibilityLabel="יצירת תוכנית בסיסית חדשה"
            accessibilityHint="ליצור תוכנית אימון בסיסית מותאמת"
            testID="regenerate-basic-button"
          >
            <MaterialCommunityIcons
              name="refresh"
              size={24}
              color={theme.colors.text}
            />
            <Text style={styles.actionText}>תוכנית בסיסית</Text>
          </TouchableButton>

          {/* Regenerate AI Plan */}
          <TouchableButton
            style={[
              styles.actionButton,
              styles.aiButton,
              !canAccessAI && styles.disabledButton,
            ]}
            onPress={onRegenerateAI}
            disabled={loading || !canAccessAI}
            loading={loading}
            enableHapticFeedback={true}
            hapticType="heavy"
            accessibilityLabel="יצירת תוכנית AI חדשה"
            accessibilityHint={
              canAccessAI ? "ליצור תוכנית מותאמת עם AI" : "נדרש מנוי פעיל"
            }
            testID="regenerate-ai-button"
          >
            <MaterialCommunityIcons
              name="brain"
              size={28}
              color={
                canAccessAI ? theme.colors.primary : theme.colors.textSecondary
              }
            />
            <Text
              style={[styles.actionText, !canAccessAI && styles.disabledText]}
            >
              תוכנית AI
            </Text>
            {!canAccessAI && (
              <MaterialCommunityIcons
                name="lock"
                size={18}
                color={theme.colors.textSecondary}
                style={styles.lockIcon}
              />
            )}
          </TouchableButton>

          {/* Start Workout */}
          <TouchableButton
            style={[
              styles.actionButton,
              styles.startButton,
              !hasWorkoutPlan && styles.disabledButton,
            ]}
            onPress={onStartWorkout}
            disabled={loading || !hasWorkoutPlan}
            loading={loading}
            enableHapticFeedback={true}
            hapticType="heavy"
            accessibilityLabel="התחלת אימון"
            accessibilityHint={
              hasWorkoutPlan ? "להתחיל אימון עכשיו" : "צריך תוכנית אימון תחילה"
            }
            testID="start-workout-button"
          >
            <MaterialCommunityIcons
              name="play-circle"
              size={32}
              color={
                hasWorkoutPlan
                  ? theme.colors.success
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.actionText,
                hasWorkoutPlan ? styles.startText : styles.disabledText,
              ]}
            >
              התחל אימון
            </Text>
          </TouchableButton>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
    // שיפור טיפוגרפי
    textShadowColor: `${theme.colors.text}10`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 96,
    borderWidth: 1.5,
    borderColor: `${theme.colors.border}80`,
    // שיפורי עיצוב מתקדמים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  basicButton: {
    backgroundColor: `${theme.colors.surface}F5`,
    borderColor: `${theme.colors.primary}30`,
    // גרדיאנט עדין
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.08,
  },
  aiButton: {
    backgroundColor: `${theme.colors.primaryLight}20`,
    borderColor: `${theme.colors.primary}50`,
    // הדגשת AI
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  startButton: {
    backgroundColor: `${theme.colors.success}15`,
    borderColor: `${theme.colors.success}40`,
    // הדגשת כפתור התחלה
    shadowColor: theme.colors.success,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: `${theme.colors.border}40`,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  startText: {
    color: theme.colors.success,
    fontWeight: "800",
    textShadowColor: `${theme.colors.success}20`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  disabledText: {
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  lockIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    opacity: 0.7,
  },
});

QuickActions.displayName = "QuickActions";

export default QuickActions;
