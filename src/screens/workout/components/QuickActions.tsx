/**
 * @file src/screens/workout/components/QuickActions.            <MaterialCommunityIcons
              name="refresh"
              size={28}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>תוכנית בסיסית</Text>* @brief Quick Action Buttons Component for Workout Plans
 * @updated August 2025 - Optimized with haptic feedback and accessibility
 */

import React, { memo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../../styles/theme";

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
    const handleRegenerateBasic = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onRegenerateBasic();
    }, [onRegenerateBasic]);

    const handleRegenerateAI = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onRegenerateAI();
    }, [onRegenerateAI]);

    const handleStartWorkout = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onStartWorkout();
    }, [onStartWorkout]);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>פעולות מהירות</Text>

        <View style={styles.actionsGrid}>
          {/* Regenerate Basic Plan */}
          <TouchableOpacity
            style={[styles.actionButton, styles.basicButton]}
            onPress={handleRegenerateBasic}
            disabled={loading}
            accessibilityLabel="יצירת תוכנית בסיסית חדשה"
            accessibilityHint="ליצור תוכנית אימון בסיסית מותאמת"
          >
            <MaterialCommunityIcons
              name="refresh"
              size={24}
              color={theme.colors.text}
            />
            <Text style={styles.actionText}>תוכנית בסיסית</Text>
          </TouchableOpacity>

          {/* Regenerate AI Plan */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.aiButton,
              !canAccessAI && styles.disabledButton,
            ]}
            onPress={handleRegenerateAI}
            disabled={loading || !canAccessAI}
            accessibilityLabel="יצירת תוכנית AI חדשה"
            accessibilityHint={
              canAccessAI ? "ליצור תוכנית מותאמת עם AI" : "נדרש מנוי פעיל"
            }
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
          </TouchableOpacity>

          {/* Start Workout */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.startButton,
              !hasWorkoutPlan && styles.disabledButton,
            ]}
            onPress={handleStartWorkout}
            disabled={loading || !hasWorkoutPlan}
            accessibilityLabel="התחלת אימון"
            accessibilityHint={
              hasWorkoutPlan ? "להתחיל אימון עכשיו" : "צריך תוכנית אימון תחילה"
            }
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
          </TouchableOpacity>
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
