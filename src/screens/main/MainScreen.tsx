/**
 * @file src/screens/main/MainScreen.tsx
 * @description מסך ראשי אחרי כניסה — Main screen after login
 * עברית: מסך ראשי לאחר התחברות או השלמת שאלון, מוצג כרטיס ברכה וניווט.
 * English: Main screen displayed after login/questionnaire, shows welcome card and navigation.
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";

export default function MainScreen() {
  const navigation = useNavigation<any>();
  const { user } = useUserStore();
  const displayName = user?.name || "משתמש";

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* כותרת ראשית */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons
              name="person-circle"
              size={32}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>שלום, {displayName}!</Text>
        </View>

        {/* כרטיס ברכה */}
        <View style={styles.card}>
          <DefaultAvatar size={80} />
          <Text style={styles.cardTitle}>ברוך הבא ל־GYMovoo! 💪</Text>
          <Text style={styles.cardSubtitle}>
            האפליקציה שלך לאימונים מותאמים אישית
          </Text>
        </View>

        {/* כפתורי ניווט */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("ExerciseList")}
          >
            <Ionicons name="barbell" size={28} color={theme.colors.text} />
            <Text style={styles.navButtonText}>רשימת תרגילים</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              // TODO: Navigate to WorkoutPlans
              alert("תוכניות אימון - בקרוב!");
            }}
          >
            <Ionicons name="calendar" size={28} color={theme.colors.text} />
            <Text style={styles.navButtonText}>תוכניות אימון</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              // TODO: Navigate to ActiveWorkout
              alert("אימון פעיל - בקרוב!");
            }}
          >
            <Ionicons name="play-circle" size={28} color={theme.colors.text} />
            <Text style={styles.navButtonText}>התחל אימון</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person" size={28} color={theme.colors.text} />
            <Text style={styles.navButtonText}>הפרופיל שלי</Text>
          </TouchableOpacity>
        </View>

        {/* מידע נוסף */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>🎯 הטיפ היומי</Text>
          <Text style={styles.infoText}>
            זכור לשתות מים לפני, במהלך ואחרי האימון!
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  profileBtn: {
    padding: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  navButton: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  navButtonText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
