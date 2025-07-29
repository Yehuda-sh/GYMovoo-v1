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
import { useUserStore } from "../../stores/userStore";

/**
 * מסך שמחליט איזה אימון להציג כשהמשתמש לוחץ על "אימון" בניווט
 * Screen that decides which workout to show when user taps "Workout" in navigation
 */
export default function WorkoutRouterScreen() {
  const navigation = useNavigation();
  const { user } = useUserStore();

  useEffect(() => {
    console.log("📍 WorkoutRouter - navigating to WorkoutPlans");
    (navigation as any).navigate("WorkoutPlans");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <MaterialCommunityIcons
          name="dumbbell"
          size={48}
          color={theme.colors.primary}
          style={styles.icon}
        />
        <Text style={styles.loadingText}>טוען אימונים...</Text>
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
    padding: 20,
  },
  icon: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
});
