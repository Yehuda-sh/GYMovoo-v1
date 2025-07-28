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

        {/* כפתור התחלה מהירה */}
        {hasTrainingData && (
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
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.lg,
  },
  profileButton: {
    padding: theme.spacing.xs,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  notificationButton: {
    padding: theme.spacing.xs,
  },
  setupCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + "20",
  },
  setupCardContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  setupCardText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    textAlign: "right",
    lineHeight: 20,
  },
  quickStartSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  quickStartButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickStartGradient: {
    padding: theme.spacing.xl,
  },
  quickStartContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  quickStartTextContainer: {
    flex: 1,
    marginStart: theme.spacing.lg, // שינוי RTL: marginStart במקום marginLeft
    alignItems: "flex-end", // יישור לימין
  },
  quickStartTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    textAlign: "right", // יישור טקסט לימין
  },
  quickStartSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "right", // יישור טקסט לימין
  },
  statsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    maxHeight: 300, // הגבלת גובה כולל לסקציה
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  statRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    minHeight: 60, // הגבלת גובה
    maxHeight: 70, // הגבלת גובה מקסימלית
  },
  progressStatRow: {
    minHeight: 70, // מעט יותר גבוה עבור progress bar
    maxHeight: 80,
  },
  statInfo: {
    flex: 1,
    alignItems: "flex-end", // יישור לימין
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: "right", // יישור טקסט לימין
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right", // יישור טקסט לימין
  },
  statIcon: {
    marginStart: theme.spacing.md, // שינוי RTL: marginStart במקום marginLeft
  },
  progressContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    maxWidth: 120, // הגבלת רוחב
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.divider,
    borderRadius: 3,
    marginStart: theme.spacing.sm, // שינוי RTL: marginStart במקום marginLeft
    overflow: "hidden",
    maxWidth: 80, // הגבלת רוחב ה-progress bar
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
    minWidth: 35,
    textAlign: "right", // שינוי מ-left ל-right
    marginStart: theme.spacing.sm, // שינוי RTL: marginStart במקום marginLeft - הוספת מרווח משמאל
  },
  quickMenu: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  menuGrid: {
    flexDirection: "row-reverse", // הוספת RTL
    flexWrap: "wrap",
    marginHorizontal: -theme.spacing.xs,
  },
  menuItem: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.xs * 2) / 2,
    alignItems: "center",
    padding: theme.spacing.md,
    margin: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  menuItemText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  profilePrompt: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight + "10",
    borderRadius: 12,
  },
  profilePromptIcon: {
    marginEnd: theme.spacing.sm, // שינוי RTL: marginEnd במקום marginRight
  },
  profilePromptText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.sm,
    textAlign: "right",
  },
});
