/**
 * @file src/screens/progress/ProgressScreen.tsx
 * @brief מסך התקדמות - מעקב אחר התקדמות המשתמש
 * @dependencies React Native, MaterialCommunityIcons, Charts
 * @notes מסך לעתיד - כרגע מציג נתונים בסיסיים
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { useUserStore } from "../../stores/userStore";

const { width: screenWidth } = Dimensions.get("window");

// פונקציה לחישוב נתוני התקדמות מהנתונים המדעיים
const calculateProgressData = (user: any) => {
  // אם יש נתונים מדעיים, השתמש בהם
  if (user?.activityHistory?.workouts) {
    const workouts = user.activityHistory.workouts;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // חישוב אימונים השבוע
    const workoutsThisWeek = workouts.filter(
      (w: any) => new Date(w.date || w.completedAt) >= oneWeekAgo
    ).length;

    // חישוב אימונים השבוע שעבר
    const workoutsLastWeek = workouts.filter((w: any) => {
      const date = new Date(w.date || w.completedAt);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;

    // חישוב רצף נוכחי
    const sortedWorkouts = [...workouts].sort(
      (a, b) =>
        new Date(b.date || b.completedAt).getTime() -
        new Date(a.date || a.completedAt).getTime()
    );

    let currentStreak = 0;
    let checkDate = new Date();
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date || workout.completedAt);
      const diffDays = Math.floor(
        (checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 2) {
        // אם האימון היה תוך יומיים
        currentStreak++;
        checkDate = workoutDate;
      } else {
        break;
      }
    }

    // חישוב דקות כוללות
    const totalMinutes = workouts.reduce(
      (sum: number, w: any) => sum + (w.duration || 45),
      0
    );

    // חישוב התקדמות לפי דירוגים
    const ratings = workouts.map(
      (w: any) => w.feedback?.rating || w.rating || 4
    );
    const avgRating =
      ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
    const strengthProgress = Math.min(Math.round((avgRating - 3) * 10), 25);

    return {
      workoutsThisWeek,
      workoutsLastWeek,
      totalWorkouts: workouts.length,
      currentStreak,
      bestStreak: Math.max(currentStreak, Math.floor(workouts.length / 3)), // הערכה
      weeklyGoal: user.scientificProfile?.goals?.weeklyWorkouts || 4,
      totalMinutes,
      avgWorkoutDuration: Math.round(totalMinutes / workouts.length) || 45,
      strengthProgress,
      enduranceProgress: Math.min(strengthProgress + 5, 30),
      flexibilityProgress: Math.max(strengthProgress - 7, 5),
    };
  }

  // נתונים דמה כגיבוי
  return {
    workoutsThisWeek: 3,
    workoutsLastWeek: 2,
    totalWorkouts: 24,
    currentStreak: 5,
    bestStreak: 12,
    weeklyGoal: 4,
    totalMinutes: 720,
    avgWorkoutDuration: 45,
    strengthProgress: 15,
    enduranceProgress: 20,
    flexibilityProgress: 8,
  };
};

export default function ProgressScreen() {
  const { user } = useUserStore();

  // חישוב נתוני התקדמות מהנתונים המדעיים
  const progressData = useMemo(() => calculateProgressData(user), [user]);

  const weeklyProgress =
    (progressData.workoutsThisWeek / progressData.weeklyGoal) * 100;

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
                  {progressData.workoutsThisWeek}/{progressData.weeklyGoal}{" "}
                  אימונים
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
              <Text style={styles.statValue}>{progressData.currentStreak}</Text>
              <Text style={styles.statLabel}>רצף נוכחי</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>{progressData.totalWorkouts}</Text>
              <Text style={styles.statLabel}>סה&quot;כ אימונים</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="clock"
                size={32}
                color={theme.colors.success}
              />
              <Text style={styles.statValue}>{progressData.totalMinutes}</Text>
              <Text style={styles.statLabel}>דקות אימון</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="trophy"
                size={32}
                color={theme.colors.warning}
              />
              <Text style={styles.statValue}>{progressData.bestStreak}</Text>
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
                  +{progressData.strengthProgress}%
                </Text>
                <View style={styles.fitnessBar}>
                  <View
                    style={[
                      styles.fitnessBarFill,
                      { width: `${progressData.strengthProgress * 4}%` },
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
                  +{progressData.enduranceProgress}%
                </Text>
                <View style={styles.fitnessBar}>
                  <View
                    style={[
                      styles.fitnessBarFill,
                      { width: `${progressData.enduranceProgress * 4}%` },
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
                  +{progressData.flexibilityProgress}%
                </Text>
                <View style={styles.fitnessBar}>
                  <View
                    style={[
                      styles.fitnessBarFill,
                      { width: `${progressData.flexibilityProgress * 4}%` },
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
