/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @brief מסך אימון מהיר - עם אינטגרציה למחולל האימונים
 * @dependencies quickWorkoutGenerator, questionnaireService, ActiveWorkoutScreen
 * @notes מסך זמני שיתפתח לאימון מהיר מלא במסגרת השדרוגים הבאים
 */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../styles/theme";
import { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { generateQuickWorkout } from "../../services/quickWorkoutGenerator";

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

  // בדיקה אם ניתן ליצור אימון מהיר
  useEffect(() => {
    // זמנית נשאיר false עד שנוסיף פונקציונליות מלאה
    setCanGenerateWorkout(false);
  }, []);

  // פונקציה זמנית ליצירת אימון - מוכן לשדרוג עתידי
  const handleGenerateQuickWorkout = async () => {
    try {
      setLoading(true);

      // זמנית נציג alert עם האפשרות לפיתוח
      Alert.alert(
        "פיתוח בתהליך",
        "יצירת אימון מהיר באמצעות AI בפיתוח.\nהאם תרצה לעבור לתכנון אימונים?",
        [
          { text: "ביטול", style: "cancel" },
          {
            text: "תכנון אימונים",
            onPress: () => navigation.navigate("WorkoutPlans", {}),
          },
        ]
      );
    } catch (error) {
      console.error("Error in quick workout generation:", error);
      Alert.alert("שגיאה", "לא הצלחנו ליצור אימון מהיר. נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

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
  // Legacy styles - keeping for backward compatibility
  message: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
});
