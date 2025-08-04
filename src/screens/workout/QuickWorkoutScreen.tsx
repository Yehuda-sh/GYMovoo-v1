/**
 * @file src/screens/workout/QuickWorkoutScreen.tsx
 * @brief מסך אימון מהיר - גרסה מינימלית תקינה
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

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
  const navigation = useNavigation();
  const params = route?.params;

  return (
    <View style={styles.container}>
      <BackButton />

      <View style={styles.content}>
        <Text style={styles.title}>אימון מהיר</Text>
        <Text style={styles.subtitle}>
          {params?.workoutName || "אימון חדש"}
        </Text>

        <Text style={styles.message}>
          מסך האימון המהיר זמני לא זמין כרגע.
          {"\n"}
          נחזור למסך הקודם.
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 32,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
});
