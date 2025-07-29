/**
 * @file src/screens/workout/WorkoutRouterScreen.tsx
 * @description מסך router שמחליט איזה אימון להציג
 * English: Router screen that decides which workout to show
 */

import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useNextWorkout } from "../../hooks/useNextWorkout";
import { useUserStore } from "../../stores/userStore";

/**
 * מסך שמחליט איזה אימון להציג כשהמשתמש לוחץ על "אימון" בניווט
 * Screen that decides which workout to show when user taps "Workout" in navigation
 */
export default function WorkoutRouterScreen() {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const { nextWorkout, isLoading } = useNextWorkout();

  useEffect(() => {
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const decideWorkout = async () => {
      try {
        // הגדר timeout של 3 שניות
        timeoutRef.current = setTimeout(() => {
          console.log("⏰ Navigation timeout - going to QuickWorkout");
          (navigation as any).navigate("QuickWorkout");
        }, 3000);

        // אם עדיין טוען, חכה
        if (isLoading) {
          return;
        }

        // בטל timeout אם הגענו לכאן
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // אם אין נתוני משתמש או שלא השלים שאלון - לך לאימון מהיר
        if (!user || !user.questionnaireData?.answers) {
          console.log(
            "📍 No user data or questionnaire - navigating to QuickWorkout"
          );
          (navigation as any).navigate("QuickWorkout");
          return;
        }

        // אם יש המלצה לאימון הבא - לך לתוכניות אימון
        if (nextWorkout) {
          console.log(
            `📍 Next workout found: ${nextWorkout.workoutName} - navigating to WorkoutPlans`
          );
          (navigation as any).navigate("WorkoutPlans", {
            autoStart: true,
            requestedWorkoutIndex: nextWorkout.workoutIndex,
            requestedWorkoutName: nextWorkout.workoutName,
          });
        } else {
          // אין המלצה - לך לתוכניות אימון רגילות
          console.log(
            "📍 No workout recommendation - navigating to WorkoutPlans"
          );
          (navigation as any).navigate("WorkoutPlans");
        }
      } catch (error) {
        console.error("❌ Error in WorkoutRouter:", error);
        // בטל timeout במקרה של שגיאה
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        // במקרה של שגיאה - לך לאימון מהיר
        (navigation as any).navigate("QuickWorkout");
      }
    };

    decideWorkout();

    // נקה timeout כשהקומפוננט נהרס
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, nextWorkout, user, navigation]);

  // מסך טעינה זמני
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={48}
          color={theme.colors.primary}
        />
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>מכין את האימון שלך...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginVertical: theme.spacing.lg,
  },
  loadingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
});
