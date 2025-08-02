/**
 * @file src/screens/workout/AutoStartWorkoutScreen.tsx
 * @brief Wrapper לטעינה אוטומטית של האימון הבא עבור הטאב "אימון"
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-02
 *
 * @description
 * Component זה מטפל בטעינה אוטומטית של האימון הבא כאשר המשתמש
 * לוחץ על הטאב "אימון" בניווט הראשי. הוא:
 * 1. טוען נתוני משתמש דמו אם צריך
 * 2. מוצא את האימון הבא בהתאם להיסטוריה
 * 3. מעביר את הנתונים ל-ActiveWorkoutScreen
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

// Services
import { realisticDemoService } from "../../services/realisticDemoService";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";

// Components
import ActiveWorkoutScreen from "./ActiveWorkoutScreen";

// Types
import { Exercise } from "./types/workout.types";

interface WorkoutData {
  name: string;
  dayName: string;
  exercises: Exercise[];
  startTime: string;
}

const AutoStartWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNextWorkout = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 AutoStartWorkoutScreen: Loading next workout...");

      // 1. וידוא שיש משתמש דמו
      let demoUser = await realisticDemoService.getDemoUser();
      if (!demoUser) {
        console.log("👤 Creating demo user...");
        await realisticDemoService.createRealisticDemoUser("male");
        demoUser = await realisticDemoService.getDemoUser();
      }

      if (!demoUser) {
        throw new Error("לא ניתן ליצור משתמש דמו");
      }

      // 2. קבלת המלצה לאימון הبא
      const defaultWeeklyPlan = ["דחיפה", "משיכה", "רגליים"];
      const recommendation =
        await nextWorkoutLogicService.getNextWorkoutRecommendation(
          defaultWeeklyPlan
        );

      if (!recommendation) {
        throw new Error("לא נמצא אימון מתאים");
      }

      console.log("📋 Next workout recommendation:", recommendation);

      // 3. קבלת אימון מהדמו
      const demoWorkouts = await realisticDemoService.getWorkoutHistory();

      if (!demoWorkouts || demoWorkouts.length === 0) {
        throw new Error("אין אימוני דמו זמינים");
      }

      // 4. בחירת אימון מתאים
      const selectedWorkout = demoWorkouts[0]; // פשוט נקח את הראשון לעת עתה

      // 5. יצירת נתוני אימון פשוטים
      const workout = {
        name: recommendation.workoutName,
        dayName: recommendation.workoutName,
        exercises: [], // נתחיל עם אימון ריק ונתן למשתמש להוסיף תרגילים
        startTime: new Date().toISOString(),
      };

      console.log("🏋️ Prepared workout data:", {
        name: workout.name,
        exerciseCount: workout.exercises.length,
      });

      // 6. נווט ל-ActiveWorkoutScreen עם הנתונים
      (navigation as any).navigate("ActiveWorkout", {
        workoutData: workout,
      });
    } catch (error) {
      console.error("❌ Error loading next workout:", error);
      const errorMessage =
        error instanceof Error ? error.message : "שגיאה לא ידועה";
      setError(errorMessage);

      // הצגת הודעת שגיאה למשתמש
      Alert.alert(
        "שגיאה בטעינת אימון",
        `לא ניתן לטעון את האימון הבא: ${errorMessage}`,
        [
          {
            text: "נסה שוב",
            onPress: () => loadNextWorkout(),
          },
          {
            text: "עבור לתוכניות",
            onPress: () => navigation.navigate("WorkoutPlans" as never),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // טעינה מחדש כשחוזרים למסך
  useFocusEffect(
    React.useCallback(() => {
      loadNextWorkout();
    }, [])
  );

  // מסך טעינה
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <MaterialCommunityIcons
          name="dumbbell"
          size={40}
          color={theme.colors.primary}
          style={styles.loadingIcon}
        />
        <Text style={styles.loadingText}>מכין את האימון הבא...</Text>
        <Text style={styles.loadingSubtext}>
          מוצא את האימון המתאים לך על פי ההיסטוריה שלך
        </Text>
      </View>
    );
  }

  // מסך שגיאה
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={60}
          color={theme.colors.error}
        />
        <Text style={styles.errorTitle}>שגיאה בטעינת אימון</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // אם הגענו לכאן, זה אומר שהניווט בוצע בהצלחה ואנחנו לא צריכים להציג כלום
  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  loadingIcon: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.error,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  noWorkoutContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  noWorkoutTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  noWorkoutText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default AutoStartWorkoutScreen;
