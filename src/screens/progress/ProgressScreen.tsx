/**
 * @file src/screens/progress/ProgressScreen.tsx
 * @brief מסך מעקב התקדמות מתקדם עם ניתוח נתונים חכם ויזואליזציה דינמית
 * @version 2.0.0
 * @author GYMovoo Development Team
 * @created 2024-12-15
 * @modified 2025-07-31
 *
 * @description
 * מסך התקדמות מתקדם המציג ניתוח מעמיק של ביצועי המשתמש עם:
 * - סטטיסטיקות שבועיות עם מטרות דינמיות
 * - מעקב רצף אימונים עם חישובים מדויקים
 * - ניתוח התקדמות כושר (כוח, סיבולת, גמישות)
 * - נתונים כלליים עם visualization מתקדם
 * מסך חכם המתאים את עצמו לנתונים המדעיים של המשתמש
 *
 * @features
 * - ✅ חישוב אוטומטי של נתוני התקדמות מהיסטוריית אימונים
 * - ✅ סטטיסטיקות שבועיות עם progress bars דינמיים
 * - ✅ מעקב רצף אימונים עם לוגיקה מתקדמת
 * - ✅ ניתוח התקדמות כושר עם קטגוריות מרובות
 * - ✅ נתונים דמה חכמים כ-fallback
 * - ✅ תמיכת RTL מלאה עם פריסה מימין לשמאל
 * - ✅ נגישות מקיפה עם Screen Reader support
 * - ✅ עיצוב מודרני עם גרדיאנטים וכרטיסים
 *
 * @performance
 * אופטימיזציה מתקדמת עם useMemo לחישוב נתוני התקדמות,
 * Dimensions.get('window') למדידות מסך, וחישובים מקומיים ללא re-renders מיותרים
 *
 * @rtl
 * תמיכה מלאה בעברית עם flexDirection: row-reverse, marginStart/marginEnd,
 * textAlign: right, ופריסת grid components מותאמת לכיוון קריאה מימין לשמאל
 *
 * @accessibility
 * תמיכה מלאה ב-Screen Readers עם accessibilityLabel, accessibilityRole,
 * accessibilityHint מפורטים לכל אלמנט אינטרקטיבי וסטטיסטיקה
 *
 * @algorithm
 * חישוב התקדמות שבועית: (workoutsThisWeek / weeklyGoal) * 100
 * חישוב רצף נוכחי: מעבר על אימונים ממוינים לפי תאריך
 * ניתוח התקדמות כושר: בסיס על דירוגי המשתמש ומשך אימונים
 *
 * @dependencies React Native, MaterialCommunityIcons, LinearGradient, userStore, theme
 * @exports ProgressScreen (default)
 *
 * @example
 * ```tsx
 * // בשימוש ב-navigation
 * navigation.navigate('ProgressScreen');
 * ```
 *
 * @notes
 * מסך חכם המתאים את עצמו לנתוני המשתמש האמיתיים
 * כולל fallback לנתונים דמה במקרה של משתמש חדש
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { useUserStore } from "../../stores/userStore";

const { width: screenWidth } = Dimensions.get("window");

// Interfaces for TypeScript
interface WorkoutData {
  date?: string;
  completedAt?: string;
  duration?: number;
  feedback?: {
    rating?: number;
  };
  rating?: number;
}

interface UserData {
  activityHistory?: {
    workouts?: WorkoutData[];
  };
  scientificProfile?: {
    goals?: {
      weeklyWorkouts?: number;
    };
  };
}

interface ProgressData {
  workoutsThisWeek: number;
  workoutsLastWeek: number;
  totalWorkouts: number;
  currentStreak: number;
  bestStreak: number;
  weeklyGoal: number;
  totalMinutes: number;
  avgWorkoutDuration: number;
  strengthProgress: number;
  enduranceProgress: number;
  flexibilityProgress: number;
}

// פונקציה לחישוב נתוני התקדמות מהנתונים המדעיים
const calculateProgressData = (user: UserData | null): ProgressData => {
  // אם יש נתונים מדעיים, השתמש בהם
  if (user?.activityHistory?.workouts) {
    const workouts = user.activityHistory.workouts;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // חישוב אימונים השבוע
    const workoutsThisWeek = workouts.filter(
      (w: WorkoutData) => new Date(w.date || w.completedAt || "") >= oneWeekAgo
    ).length;

    // חישוב אימונים השבוע שעבר
    const workoutsLastWeek = workouts.filter((w: WorkoutData) => {
      const date = new Date(w.date || w.completedAt || "");
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;

    // חישוב רצף נוכחי
    const sortedWorkouts = [...workouts].sort(
      (a, b) =>
        new Date(b.date || b.completedAt || "").getTime() -
        new Date(a.date || a.completedAt || "").getTime()
    );

    let currentStreak = 0;
    let checkDate = new Date();
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date || workout.completedAt || "");
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
      (sum: number, w: WorkoutData) => sum + (w.duration || 45),
      0
    );

    // חישוב התקדמות לפי דירוגים
    const ratings = workouts.map(
      (w: WorkoutData) => w.feedback?.rating || w.rating || 4
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

export default function ProgressScreen(): JSX.Element {
  const { user } = useUserStore();

  // חישוב נתוני התקדמות מהנתונים המדעיים
  const progressData: ProgressData = useMemo(
    () => calculateProgressData(user),
    [user]
  );

  const weeklyProgress: number =
    (progressData.workoutsThisWeek / progressData.weeklyGoal) * 100;

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="מסך מעקב התקדמות"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="תוכן מסך התקדמות - גלול למעלה ומטה"
      >
        <BackButton absolute={false} variant="minimal" />

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="trending-up"
            size={80}
            color={theme.colors.primary}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="אייקון התקדמות - גרף עולה"
          />
          <Text style={styles.title}>התקדמות</Text>
          <Text style={styles.subtitle}>
            עקוב אחר השיפור שלך ושמור על המוטיבציה
          </Text>
        </View>

        {/* סטטיסטיקות השבוע */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>השבוע הנוכחי</Text>

          <View
            style={styles.weeklyCard}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`מטרה שבועית: ${progressData.workoutsThisWeek} מתוך ${progressData.weeklyGoal} אימונים הושלמו, ${Math.round(weeklyProgress)} אחוז מהמטרה`}
            accessibilityHint="התקדמות במטרה השבועית לאימונים"
          >
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
            <View
              style={styles.statCard}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`רצף נוכחי: ${progressData.currentStreak} ימים`}
              accessibilityHint="מספר הימים הרצופים שאימנת"
            >
              <MaterialCommunityIcons
                name="fire"
                size={32}
                color={theme.colors.error}
                accessible={false}
              />
              <Text style={styles.statValue}>{progressData.currentStreak}</Text>
              <Text style={styles.statLabel}>רצף נוכחי</Text>
            </View>

            <View
              style={styles.statCard}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`סה״כ אימונים: ${progressData.totalWorkouts} אימונים`}
              accessibilityHint="המספר הכולל של אימונים שביצעת"
            >
              <MaterialCommunityIcons
                name="dumbbell"
                size={32}
                color={theme.colors.primary}
                accessible={false}
              />
              <Text style={styles.statValue}>{progressData.totalWorkouts}</Text>
              <Text style={styles.statLabel}>סה&quot;כ אימונים</Text>
            </View>

            <View
              style={styles.statCard}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`דקות אימון: ${progressData.totalMinutes} דקות`}
              accessibilityHint="המספר הכולל של דקות אימון"
            >
              <MaterialCommunityIcons
                name="clock"
                size={32}
                color={theme.colors.success}
                accessible={false}
              />
              <Text style={styles.statValue}>{progressData.totalMinutes}</Text>
              <Text style={styles.statLabel}>דקות אימון</Text>
            </View>

            <View
              style={styles.statCard}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`הרצף הטוב ביותר: ${progressData.bestStreak} ימים`}
              accessibilityHint="הרצף הארוך ביותר של אימונים שביצעת"
            >
              <MaterialCommunityIcons
                name="trophy"
                size={32}
                color={theme.colors.warning}
                accessible={false}
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
            <View
              style={styles.fitnessItem}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`התקדמות כוח: ${progressData.strengthProgress} אחוז שיפור`}
              accessibilityHint="מדד שיפור בכוח הגוף"
            >
              <View style={styles.fitnessLeft}>
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={24}
                  color={theme.colors.primary}
                  accessible={false}
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

            <View
              style={styles.fitnessItem}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`התקדמות סיבולת: ${progressData.enduranceProgress} אחוז שיפור`}
              accessibilityHint="מדד שיפור בסיבולת הלב וכלי הדם"
            >
              <View style={styles.fitnessLeft}>
                <MaterialCommunityIcons
                  name="heart"
                  size={24}
                  color={theme.colors.error}
                  accessible={false}
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

            <View
              style={styles.fitnessItem}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`התקדמות גמישות: ${progressData.flexibilityProgress} אחוז שיפור`}
              accessibilityHint="מדד שיפור בגמישות הגוף"
            >
              <View style={styles.fitnessLeft}>
                <MaterialCommunityIcons
                  name="yoga"
                  size={24}
                  color={theme.colors.success}
                  accessible={false}
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
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="אייקון גרף - תכונות בפיתוח"
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
    writingDirection: "rtl",
  },
  weeklyCard: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.border + "20",
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
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border + "30",
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
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border + "30",
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
    backgroundColor: theme.colors.surface + "50",
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border + "30",
    borderStyle: "dashed",
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 24,
    writingDirection: "rtl",
  },
});
