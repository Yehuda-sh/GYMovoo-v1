/**
 * @file src/screens/main/MainScreen.tsx
 * @brief מסך ראשי - דשבורד מינימליסטי עם סטטיסטיקות ופעולות מהירות
 * @dependencies userStore (Zustand), DefaultAvatar, React Navigation
 * @notes עיצוב נקי ומינימליסטי בהתאם לשאר המסכים
 * @recurring_errors בעיות RTL בסידור אלמנטים, כיווניות לא נכונה ב-flexDirection
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  RefreshControl,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";
import { NextWorkoutCard } from "../../components/workout/NextWorkoutCard";
import {
  hasCompletedTrainingStage,
  hasCompletedProfileStage,
} from "../../data/twoStageQuestionnaireData";

const { width: screenWidth } = Dimensions.get("window");

// הגדרת interface לשדות השאלון
interface QuestionnaireFields {
  gender?: string;
  height?: number;
  weight?: number;
}

// סטטיסטיקות דמה
const mockStats = {
  workoutsThisWeek: 3,
  totalWorkouts: 24,
  currentStreak: 5,
  weeklyGoal: 4,
  lastWorkout: "אתמול",
  nextWorkout: "היום",
};

export default function MainScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const { user } = useUserStore();
  const displayName = user?.name || "משתמש";

  // תיקון: יצירת type assertion מתאים לגישה לשדות השאלון
  const questionnaire = user?.questionnaire;
  const questionnaireData = user?.questionnaireData?.answers;

  // גישה בטוחה לשדה gender
  const isFemale =
    (questionnaire as QuestionnaireFields)?.gender === "נקבה" ||
    (questionnaireData as QuestionnaireFields)?.gender === "נקבה";

  // בדיקת השלמת שלבי השאלון
  const hasTrainingData = hasCompletedTrainingStage(user?.questionnaire);
  const hasProfileData = hasCompletedProfileStage(user?.questionnaire);

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = "";

    if (hour < 5) {
      greetingText = "לילה טוב";
    } else if (hour < 12) {
      greetingText = "בוקר טוב";
    } else if (hour < 17) {
      greetingText = "צהריים טובים";
    } else if (hour < 21) {
      greetingText = "ערב טוב";
    } else {
      greetingText = "לילה טוב";
    }

    setGreeting(`${greetingText}, ${displayName}`);

    // אנימציות כניסה פשוטות
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [displayName]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleQuickStart = () => {
    navigation.navigate("QuickWorkout");
  };

  const handleStartWorkout = (workoutName: string, workoutIndex: number) => {
    console.log(`🚀 Starting workout: ${workoutName} (index: ${workoutIndex})`);

    // נווט לתוכניות אימון עם הבקשה להתחיל את האימון הספציפי
    navigation.navigate("WorkoutPlans", {
      autoStart: true,
      requestedWorkoutIndex: workoutIndex,
      requestedWorkoutName: workoutName,
    });
  };

  // חישוב אחוז השלמת המטרה השבועית
  const weeklyProgress =
    (mockStats.workoutsThisWeek / mockStats.weeklyGoal) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header מינימליסטי */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <DefaultAvatar name={displayName} size={40} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subGreeting}>
              {hasTrainingData ? "מוכן לאימון?" : "בוא נתחיל"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* תזכורת להשלמת שאלון - מינימליסטית */}
        {!hasTrainingData && (
          <TouchableOpacity
            style={styles.setupCard}
            onPress={() =>
              navigation.navigate("Questionnaire", { stage: "training" })
            }
          >
            <View style={styles.setupCardContent}>
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.setupCardText}>
                השלם את השאלון כדי לקבל תוכנית אימונים מותאמת אישית
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* האימון הבא - רכיב חכם */}
        {hasTrainingData && (
          <Animated.View
            style={[
              styles.nextWorkoutSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <NextWorkoutCard onStartWorkout={handleStartWorkout} />
          </Animated.View>
        )}

        {/* התחלה מהירה למשתמשים חדשים */}
        {!hasTrainingData && (
          <Animated.View
            style={[
              styles.quickStartSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.quickStartButton}
              onPress={handleQuickStart}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  theme.colors.primaryGradientStart,
                  theme.colors.primaryGradientEnd,
                ]}
                style={styles.quickStartGradient}
              >
                <View style={styles.quickStartContent}>
                  <Ionicons name="play-circle" size={48} color="#FFF" />
                  <View style={styles.quickStartTextContainer}>
                    <Text style={styles.quickStartTitle}>
                      {isFemale ? "התחילי אימון" : "התחל אימון"}
                    </Text>
                    <Text style={styles.quickStartSubtitle}>
                      {mockStats.lastWorkout === "אתמול"
                        ? "המשך את הרצף שלך"
                        : "הגיע הזמן להתאמן"}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* סטטיסטיקות מינימליסטיות */}
        {hasTrainingData && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>הסטטוס שלך</Text>

            {/* מטרה שבועית - קומפקטית */}
            <View style={[styles.statRow, styles.progressStatRow]}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>מטרה שבועית</Text>
                <Text style={styles.statValue}>
                  {mockStats.workoutsThisWeek}/{mockStats.weeklyGoal} אימונים
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
            </View>

            {/* רצף נוכחי */}
            <View style={styles.statRow}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>רצף נוכחי</Text>
                <Text style={styles.statValue}>
                  {mockStats.currentStreak} ימים
                </Text>
              </View>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
            </View>

            {/* סה&quot;כ אימונים */}
            <View style={styles.statRow}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>סה&quot;כ אימונים</Text>
                <Text style={styles.statValue}>{mockStats.totalWorkouts}</Text>
              </View>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
            </View>
          </View>
        )}

        {/* תפריט ניווט מהיר */}
        <View style={styles.quickMenu}>
          <Text style={styles.sectionTitle}>ניווט מהיר</Text>

          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("WorkoutPlans")}
            >
              <View style={styles.menuIconContainer}>
                <MaterialCommunityIcons
                  name="notebook-outline"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemText}>תוכניות</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Exercises")}
            >
              <View style={styles.menuIconContainer}>
                <MaterialCommunityIcons
                  name="arm-flex-outline"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemText}>תרגילים</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Progress")}
            >
              <View style={styles.menuIconContainer}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemText}>התקדמות</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("History")}
            >
              <View style={styles.menuIconContainer}>
                <MaterialCommunityIcons
                  name="history"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemText}>היסטוריה</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* הצעה להשלמת פרופיל */}
        {hasTrainingData && !hasProfileData && (
          <TouchableOpacity
            style={styles.profilePrompt}
            onPress={() =>
              navigation.navigate("Questionnaire", { stage: "profile" })
            }
          >
            <FontAwesome5
              name="user-circle"
              size={20}
              color={theme.colors.primary}
              style={styles.profilePromptIcon}
            />
            <Text style={styles.profilePromptText}>
              השלם את הפרופיל האישי: נשארו רק גובה ומשקל לקבלת המלצות מדויקות
              יותר
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F', // רקע כהה כמו בתמונה
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // סטיילים חדשים לעיצוב המודרני
  welcomeSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.lg,
  },
  welcomeHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  welcomeText: {
    alignItems: "flex-end",
  },
  greetingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: "right",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: '#FFFFFF',
    textAlign: "right",
  },
  motivationText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: "right",
    marginTop: theme.spacing.sm,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF4444',
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: '#FFFFFF',
  },
  nextWorkoutSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: '#FFFFFF',
    textAlign: "right",
    marginBottom: theme.spacing.md,
  },
  workoutCard: {
    backgroundColor: '#1A3B3A', // צבע ירוק כהה כמו בתמונה
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "700",
    color: '#FFFFFF',
    textAlign: "right",
    marginBottom: theme.spacing.sm,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: "right",
    marginBottom: theme.spacing.lg,
  },
  workoutProgress: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    backgroundColor: '#2A4B4A',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  progressItem: {
    alignItems: "center",
    flex: 1,
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  startWorkoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  startWorkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: '#FFFFFF',
    marginStart: theme.spacing.sm,
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    gap: theme.spacing.md,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  statHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statTitle: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: "right",
  },
  statPercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: '#007AFF',
  },
  statSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: '#FFFFFF',
    textAlign: "right",
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  statIconWrapper: {
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: '#FFFFFF',
    textAlign: "right",
  },
  quickNavSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  quickNavGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  navItem: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.md * 2) / 5,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  navItemText: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
});
