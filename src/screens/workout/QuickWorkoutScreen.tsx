/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @brief מסך אימון מהיר - עם אינטגרציה למחולל האימונים
 * @dependencies quickWorkoutGenerator, questionnaireService, ActiveWorkoutScreen
 * @notes מסך זמני שיתפתח לאימון מהיר מלא במסגרת השדרוגים הבאים
 */

import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../styles/theme";
import { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useModalManager } from "./hooks/useModalManager";
import { UniversalModal } from "../../components/common/UniversalModal";

interface QuickWorkoutScreenProps {
  route?: {
    params?: {
      exercises?: unknown[];
      workoutName?: string;
      workoutId?: string;
      source?: string;
      requestedDay?: number;
      planData?: unknown;
    };
  };
}

export default function QuickWorkoutScreen({ route }: QuickWorkoutScreenProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const params = route?.params;

  // States - מוכן לפיתוח עתידי
  const [loading, setLoading] = useState(false);
  const [canGenerateWorkout, setCanGenerateWorkout] = useState(false);

  // Modal management - אחיד במקום Alert.alert מפוזר
  const { activeModal, modalConfig, hideModal, showComingSoon } =
    useModalManager();

  // בדיקה אם ניתן ליצור אימון מהיר
  useEffect(() => {
    // זמנית נשאיר false עד שנוסיף פונקציונליות מלאה
    setCanGenerateWorkout(false);
  }, []);

  // פונקציה זמנית ליצירת אימון - משתמשת במודל אחיד במקום Alert.alert
  const handleGenerateQuickWorkout = useCallback(async () => {
    try {
      setLoading(true);

      // שימוש במערכת מודלים אחידה במקום Alert.alert מפוזר
      showComingSoon("יצירת אימון מהיר באמצעות AI");

      // אופציה נוספת לניווט לתכנון אימונים
      setTimeout(() => {
        Alert.alert(
          "עבור לתכנון אימונים?",
          "האם תרצה לעבור למסך תכנון האימונים הקיים?",
          [
            { text: "לא, תודה", style: "cancel" },
            {
              text: "כן, עבור",
              onPress: () => navigation.navigate("WorkoutPlans", {}),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      console.error("Error in quick workout generation:", error);
      Alert.alert("שגיאה", "לא הצלחנו ליצור אימון מהיר. נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  }, [navigation, showComingSoon]);

  // פונקציה לניווט לתכנון אימונים
  const navigateToWorkoutPlans = () => {
    navigation.navigate("WorkoutPlans", {});
  };

  return (
    <View style={styles.container}>
      <BackButton />

      <View style={styles.content}>
        <MaterialCommunityIcons
          name="flash"
          size={64}
          color={theme.colors.primary}
          style={styles.icon}
        />

        <Text style={styles.title}>אימון מהיר</Text>
        <Text style={styles.subtitle}>
          {params?.workoutName || "אימון חדש"}
        </Text>

        <Text style={styles.description}>
          יצירת אימון מהיר עם AI בהתאמה אישית
          {"\n"}
          בהתבסס על השאלון שלך והציוד הזמין
        </Text>

        {loading ? (
          <LoadingSpinner
            size="large"
            text="יוצר אימון מותאם אישית..."
            variant="pulse"
          />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !canGenerateWorkout && styles.disabledButton,
              ]}
              onPress={handleGenerateQuickWorkout}
              disabled={!canGenerateWorkout && !loading}
            >
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={20}
                color={theme.colors.surface}
              />
              <Text style={styles.primaryButtonText}>צור אימון מהיר</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={navigateToWorkoutPlans}
            >
              <MaterialCommunityIcons
                name="calendar-week"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>תכנון אימונים</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.developmentNote}>
          🚧 המסך בפיתוח - בקרוב: יצירת אימונים מהירים עם AI
        </Text>
      </View>

      {/* מודל אחיד למקום Alert.alert מפוזר */}
      <UniversalModal
        visible={activeModal !== null}
        type={activeModal || "comingSoon"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonContainer: {
    width: "100%",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.surface,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  developmentNote: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: theme.spacing.lg,
  },
});
