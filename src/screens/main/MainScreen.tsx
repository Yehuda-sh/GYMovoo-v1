/**
 * @file src/screens/main/MainScreen.tsx
 * @description דף בית ראשי - Welcome, פרופיל, התחלת אימון (דמו), RTL, Theme, עיצוב.
 * English: Main Home Screen - Welcome, Profile, Start Workout (demo), RTL, theme.
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";

export default function MainScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);

  return (
    <View style={styles.container}>
      {/* Welcome + שם המשתמש */}
      <Text style={styles.title}>
        שלום{user?.name ? `, ${user.name}` : ""} 👋
      </Text>
      <Text style={styles.subtitle}>ברוך/ה הבא/ה ל־GYMovoo</Text>

      {/* כפתור "התחל אימון" דמו */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // דמו: תוכל לשנות לניווט לאימון
          navigation.navigate("ActiveWorkout");
        }}
      >
        <Ionicons
          name="barbell-outline"
          size={20}
          color="#fff"
          style={{ marginLeft: 6 }}
        />
        <Text style={styles.buttonText}>התחל אימון</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("ExerciseList")}
      >
        <Ionicons
          name="fitness-outline"
          size={18}
          color={theme.colors.primary}
          style={{ marginLeft: 4 }}
        />
        <Text style={styles.secondaryButtonText}>עיין בתרגילים</Text>
      </TouchableOpacity>
      {/* כפתור מעבר לפרופיל */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons
          name="person-outline"
          size={18}
          color={theme.colors.primary}
          style={{ marginLeft: 4 }}
        />
        <Text style={styles.secondaryButtonText}>פרופיל משתמש</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    writingDirection: "rtl",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
    writingDirection: "rtl",
  },
  button: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 15,
    paddingHorizontal: 52,
    marginBottom: 16,
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 19,
    letterSpacing: 1,
  },
  secondaryButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 44,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: 4,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 17,
  },
});
