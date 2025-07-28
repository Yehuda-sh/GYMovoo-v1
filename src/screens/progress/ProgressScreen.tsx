/**
 * @file src/screens/progress/ProgressScreen.tsx
 * @brief מסך התקדמות - מעקב אחר התקדמות המשתמש
 * @dependencies React Native, MaterialCommunityIcons, Charts
 * @notes מסך לעתיד - כרגע מציג נתונים בסיסיים
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

const { width: screenWidth } = Dimensions.get("window");

// נתונים דמה לדוגמה
const mockProgressData = {
  workoutsThisWeek: 3,
  workoutsLastWeek: 2,
  totalWorkouts: 24,
  currentStreak: 5,
  bestStreak: 12,
  weeklyGoal: 4,
  totalMinutes: 720,
  avgWorkoutDuration: 45,
  strengthProgress: 15, // אחוזי שיפור
  enduranceProgress: 20,
  flexibilityProgress: 8,
};

export default function ProgressScreen() {
  const weeklyProgress =
    (mockProgressData.workoutsThisWeek / mockProgressData.weeklyGoal) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="trending-up"
            size={80}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>התקדמות</Text>
          <Text style={styles.subtitle}>
            עקוב אחר השיפור שלך ושמור על המוטיבציה
          </Text>
        </View>

        {/* סטטיסטיקות השבוע */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>השבוע הנוכחי</Text>

          <View style={styles.weeklyCard}>
            <LinearGradient
              colors={[
                theme.colors.primary + "20",
                theme.colors.primary + "10",
              ]}
              style={styles.weeklyGradient}
            >
              <View style={styles.weeklyHeader}>
                <Text style={styles.weeklyTitle}>מטרה שבועית</Text>
                <Text style={styles.weeklyStats}>
                  {mockProgressData.workoutsThisWeek}/
                  {mockProgressData.weeklyGoal} אימונים
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(weeklyProgress, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(weeklyProgress)}%
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* סטטיסטיקות כלליות */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>נתונים כלליים</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="fire"
                size={32}
                color={theme.colors.error}
              />
              <Text style={styles.statValue}>
                {mockProgressData.currentStreak}
              </Text>
              <Text style={styles.statLabel}>רצף נוכחי</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>
                {mockProgressData.totalWorkouts}
              </Text>
              <Text style={styles.statLabel}>סה&quot;כ אימונים</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="clock"
                size={32}
                color={theme.colors.success}
              />
              <Text style={styles.statValue}>
                {mockProgressData.totalMinutes}
              </Text>
              <Text style={styles.statLabel}>דקות אימון</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="trophy"
                size={32}
                color={theme.colors.warning}
              />
              <Text style={styles.statValue}>
                {mockProgressData.bestStreak}
              </Text>
              <Text style={styles.statLabel}>רצף הטוב</Text>
            </View>
          </View>
        </View>

        {/* התקדמות כושר */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>התקדמות כושר</Text>

          <View style={styles.fitnessCard}>
            <View style={styles.fitnessItem}>
              <View style={styles.fitnessLeft}>
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.fitnessLabel}>כוח</Text>
              </View>
              <View style={styles.fitnessRight}>
                <Text style={styles.fitnessValue}>
                  +{mockProgressData.strengthProgress}%
                </Text>
                <View style={styles.fitnessBar}>
                  <View
                    style={[
                      styles.fitnessBarFill,
                      { width: `${mockProgressData.strengthProgress * 4}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.fitnessItem}>
              <View style={styles.fitnessLeft}>
                <MaterialCommunityIcons
                  name="heart"
                  size={24}
                  color={theme.colors.error}
                />
                <Text style={styles.fitnessLabel}>סיבולת</Text>
              </View>
              <View style={styles.fitnessRight}>
                <Text style={styles.fitnessValue}>
                  +{mockProgressData.enduranceProgress}%
                </Text>
                <View style={styles.fitnessBar}>
                  <View
                    style={[
                      styles.fitnessBarFill,
                      { width: `${mockProgressData.enduranceProgress * 4}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.fitnessItem}>
              <View style={styles.fitnessLeft}>
                <MaterialCommunityIcons
                  name="yoga"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={styles.fitnessLabel}>גמישות</Text>
              </View>
              <View style={styles.fitnessRight}>
                <Text style={styles.fitnessValue}>
                  +{mockProgressData.flexibilityProgress}%
                </Text>
                <View style={styles.fitnessBar}>
                  <View
                    style={[
                      styles.fitnessBarFill,
                      { width: `${mockProgressData.flexibilityProgress * 4}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* הודעה זמנית */}
        <View style={styles.comingSoonSection}>
          <MaterialCommunityIcons
            name="chart-line"
            size={48}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.comingSoonTitle}>בקרוב</Text>
          <Text style={styles.comingSoonText}>
            גרפים מתקדמים, השוואות חודשיות ויעדים אישיים
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
  statsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  weeklyCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  weeklyGradient: {
    padding: theme.spacing.lg,
  },
  weeklyHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  weeklyStats: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.primary,
  },
  progressContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    minWidth: 35,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  statCard: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  fitnessCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  fitnessItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
  },
  fitnessLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  fitnessLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
  },
  fitnessRight: {
    alignItems: "center",
    flex: 1,
    marginStart: theme.spacing.md, // שינוי RTL: marginStart במקום marginLeft
  },
  fitnessValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  fitnessBar: {
    width: "100%",
    height: 6,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 3,
    overflow: "hidden",
  },
  fitnessBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  comingSoonSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  comingSoonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
});
