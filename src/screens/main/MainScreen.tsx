/**
 * @file src/screens/main/MainScreen.tsx
 * @brief מסך ראשי - דשבורד אינטראקטיבי עם סטטיסטיקות ופעולות מהירות
 * @dependencies userStore (Zustand), DefaultAvatar, React Navigation
 * @notes כולל אנימציות מורכבות, pull-to-refresh, וקרוסלת תוכניות
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

const { width: screenWidth } = Dimensions.get("window");

// סטטיסטיקות דמה // Mock statistics
const mockStats = {
  workoutsThisWeek: 3,
  totalWorkouts: 24,
  currentStreak: 5,
  favoriteExercise: "לחיצת חזה",
  weeklyGoal: 4,
  caloriesBurned: 1250,
  totalMinutes: 420,
  personalRecords: 8,
};

// תוכניות מומלצות // Recommended plans
const recommendedPlans = [
  { id: 1, name: "תוכנית למתחילים", duration: "8 שבועות", difficulty: "קל" },
  { id: 2, name: "בניית מסה", duration: "12 שבועות", difficulty: "בינוני" },
  { id: 3, name: "חיטוב וחיזוק", duration: "6 שבועות", difficulty: "קשה" },
];

export default function MainScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useUserStore();
  const displayName = user?.name || "משתמש";
  const isFemale = user?.gender === "female"; // נניח שיש לנו מידע על המגדר במשתמש

  console.log("🏠 MainScreen - Component mounted");
  console.log("🏠 MainScreen - Current user:", user);
  console.log("🏠 MainScreen - Display name:", displayName);

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [workoutPrompt, setWorkoutPrompt] = useState("");
  const [workoutEmoji, setWorkoutEmoji] = useState("");

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("🏠 MainScreen - useEffect triggered");

    // קביעת ברכה לפי שעה // Set greeting by time
    const hour = new Date().getHours();
    console.log("🏠 MainScreen - Current hour:", hour);

    if (hour < 12) {
      setGreeting("בוקר טוב");
      setTimeOfDay("morning");
      const morningQuotes = [
        "יום חדש, הזדמנות חדשה להיות גרסה טובה יותר 💪",
        "הבוקר הוא הזמן הטוב ביותר לבנות הרגלים חדשים 🌅",
        "קפה ואימון - השילוב המושלם לבוקר ☕",
        "העתיד שייך למי שמתעורר מוקדם ומתאמן 🏃‍♂️",
      ];
      setMotivationalQuote(
        morningQuotes[Math.floor(Math.random() * morningQuotes.length)]
      );
    } else if (hour < 17) {
      setGreeting("צהריים טובים");
      setTimeOfDay("afternoon");
      const afternoonQuotes = [
        "הפסקת צהריים מושלמת לאימון קצר 🔥",
        "אל תיתן ליום לחמוק בלי להזיע 💦",
        "אנרגיית אחר הצהריים? בוא נשרוף אותה! ⚡",
        "הזמן הטוב ביותר לאימון הוא עכשיו 🎯",
      ];
      setMotivationalQuote(
        afternoonQuotes[Math.floor(Math.random() * afternoonQuotes.length)]
      );
    } else if (hour < 21) {
      setGreeting("ערב טוב");
      setTimeOfDay("evening");
      const eveningQuotes = [
        "אימון ערב - הדרך המושלמת לסיים את היום 🌆",
        "שחרר את הלחץ של היום באימון טוב 🧘‍♂️",
        "הגוף שלך יודה לך מחר בבוקר 🙏",
        "סיום יום עם אימון = שינה טובה יותר 😴",
      ];
      setMotivationalQuote(
        eveningQuotes[Math.floor(Math.random() * eveningQuotes.length)]
      );
    } else {
      setGreeting("לילה טוב");
      setTimeOfDay("night");
      const nightQuotes = [
        "אימוני לילה - לאלופים האמיתיים 🌙",
        "כשכולם ישנים, אתה בונה את העתיד שלך 🌟",
        "המוטיבציה שלך לא מכירה שעות ⏰",
        "לילה שקט, אימון מושלם 🌃",
      ];
      setMotivationalQuote(
        nightQuotes[Math.floor(Math.random() * nightQuotes.length)]
      );
    }

    console.log("🏠 MainScreen - Greeting set to:", greeting);
    console.log("🏠 MainScreen - Time of day:", timeOfDay);

    // יצירת הודעות אימון מותאמות מגדר // Create gender-adapted workout prompts
    const workoutPrompts = {
      ready: {
        male: [
          "מוכן לכבוש את היום?",
          "בוא נתחיל להזיע!",
          "מוכן לאתגר הבא?",
          "בוא נפוצץ את זה!",
        ],
        female: [
          "מוכנה לכבוש את היום?",
          "בואי נתחיל להזיע!",
          "מוכנה לאתגר הבא?",
          "בואי נפוצץ את זה!",
        ],
      },
      morning: {
        male: [
          "בוקר של אלופים מתחיל באימון",
          "קום ותזהר! הגיע הזמן",
          "התחל את היום בצעד ימין",
        ],
        female: [
          "בוקר של אלופות מתחיל באימון",
          "קומי ותזהרי! הגיע הזמן",
          "התחילי את היום בצעד ימין",
        ],
      },
      evening: {
        male: [
          "סיים את היום בסטייל",
          "עוד אימון לפני השינה?",
          "הזמן המושלם להתאמן",
        ],
        female: [
          "סיימי את היום בסטייל",
          "עוד אימון לפני השינה?",
          "הזמן המושלם להתאמן",
        ],
      },
    };

    // בחירת הודעה אקראית מותאמת מגדר // Select random gender-adapted message
    const gender = isFemale ? "female" : "male";
    const promptCategory =
      hour < 12 ? "morning" : hour < 21 ? "ready" : "evening";
    const prompts = workoutPrompts[promptCategory][gender];
    setWorkoutPrompt(prompts[Math.floor(Math.random() * prompts.length)]);

    // בחירת אימוג'י אקראי לאימון // Select random workout emoji
    const workoutEmojis = ["💪", "🏋️‍♂️", "🤸‍♂️", "🏃‍♂️", "⚡", "🔥", "🎯", "🚀"];
    setWorkoutEmoji(
      workoutEmojis[Math.floor(Math.random() * workoutEmojis.length)]
    );

    // אנימציות כניסה // Entry animations
    console.log("🏠 MainScreen - Starting entry animations");
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(statsOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log("🏠 MainScreen - All animations completed");
      // אנימציית progress bars
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 1500,
        delay: 200,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const onRefresh = React.useCallback(() => {
    console.log("🏠 MainScreen - Pull to refresh triggered");
    setRefreshing(true);
    // סימולציית רענון // Simulate refresh
    setTimeout(() => {
      console.log("🏠 MainScreen - Refresh completed");
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleQuickStart = () => {
    console.log("🏠 MainScreen - Quick start button clicked");
    navigation.navigate("QuickWorkout");
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.gradient}
    >
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
        {/* Header - גרסה משודרגת עם אנימציה ומוטיבציה */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={[
              timeOfDay === "morning"
                ? "rgba(255, 179, 0, 0.1)"
                : timeOfDay === "afternoon"
                ? "rgba(0, 122, 255, 0.1)"
                : timeOfDay === "evening"
                ? "rgba(88, 86, 214, 0.1)"
                : "rgba(78, 158, 255, 0.1)",
              "transparent",
            ]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerRight}>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greetingText}>{greeting},</Text>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{displayName}</Text>
                    <MaterialCommunityIcons
                      name={
                        timeOfDay === "morning"
                          ? "weather-sunny"
                          : timeOfDay === "afternoon"
                          ? "white-balance-sunny"
                          : timeOfDay === "evening"
                          ? "weather-sunset"
                          : "moon-waning-crescent"
                      }
                      size={24}
                      color={
                        timeOfDay === "morning"
                          ? theme.colors.warning
                          : timeOfDay === "afternoon"
                          ? theme.colors.primary
                          : timeOfDay === "evening"
                          ? theme.colors.secondary
                          : theme.colors.accent
                      }
                      style={styles.timeIcon}
                    />
                  </View>
                </View>
                <Animated.Text
                  style={[
                    styles.motivationalText,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {motivationalQuote}
                </Animated.Text>
              </View>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  style={styles.notificationBtn}
                  onPress={() => {
                    console.log("🏠 MainScreen - Notifications button clicked");
                    alert("התראות - בקרוב!");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color={theme.colors.text}
                  />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileBtn}
                  onPress={() => {
                    console.log("🏠 MainScreen - Profile button clicked");
                    navigation.navigate("Profile");
                  }}
                  activeOpacity={0.7}
                >
                  <DefaultAvatar size={44} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Start Card */}
        <Animated.View
          style={[
            styles.quickStartCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.quickStartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.quickStartContent}>
              <View style={styles.quickStartTextContainer}>
                <View style={styles.quickStartHeader}>
                  <Text style={styles.quickStartTitle}>{workoutPrompt}</Text>
                  <Animated.Text
                    style={[
                      styles.quickStartEmoji,
                      {
                        transform: [
                          {
                            scale: scaleAnim.interpolate({
                              inputRange: [0.9, 1],
                              outputRange: [0.8, 1.2],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    {workoutEmoji}
                  </Animated.Text>
                </View>
                <Text style={styles.quickStartSubtitle}>
                  {mockStats.totalWorkouts > 0
                    ? `${isFemale ? "את" : "אתה"} כבר ${
                        isFemale ? "השלמת" : "השלמת"
                      } ${mockStats.totalWorkouts} אימונים!`
                    : `הגיע הזמן להתחיל את המסע ${isFemale ? "שלך" : "שלך"}`}
                </Text>
                <View style={styles.quickStartStats}>
                  <View style={styles.quickStartStatItem}>
                    <Text style={styles.quickStartStatText}>
                      {mockStats.currentStreak} ימי רצף
                    </Text>
                    <MaterialCommunityIcons
                      name="fire"
                      size={16}
                      color="rgba(255,255,255,0.8)"
                    />
                  </View>
                  <View style={styles.quickStartStatDivider} />
                  <View style={styles.quickStartStatItem}>
                    <Text style={styles.quickStartStatText}>20-30 דק׳</Text>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color="rgba(255,255,255,0.8)"
                    />
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.quickStartButton}
                onPress={handleQuickStart}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#fff", "#f0f0f0"]}
                  style={styles.quickStartButtonGradient}
                >
                  <Text style={styles.quickStartButtonText}>התחל</Text>
                  <FontAwesome5
                    name="play"
                    size={18}
                    color={theme.colors.primary}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Statistics Cards */}
        <Animated.View
          style={[styles.statsCardsContainer, { opacity: statsOpacity }]}
        >
          {/* כרטיס מטרה שבועית // Weekly goal card */}
          <TouchableOpacity
            style={styles.goalCard}
            activeOpacity={0.8}
            onPress={() => console.log("Weekly goal card pressed")}
          >
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart + "20",
                theme.colors.primaryGradientEnd + "10",
              ]}
              style={styles.goalGradient}
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>מטרה שבועית</Text>
                <MaterialCommunityIcons
                  name="target"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.goalProgress}>
                <Text style={styles.goalNumbers}>
                  <Text style={styles.goalCurrent}>
                    {mockStats.workoutsThisWeek}
                  </Text>
                  <Text style={styles.goalDivider}> / </Text>
                  <Text style={styles.goalTarget}>{mockStats.weeklyGoal}</Text>
                </Text>
                <View style={styles.progressBarContainer}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: progressAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            "0%",
                            `${
                              (mockStats.workoutsThisWeek /
                                mockStats.weeklyGoal) *
                              100
                            }%`,
                          ],
                        }),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.goalSubtext}>
                  {mockStats.weeklyGoal - mockStats.workoutsThisWeek > 0
                    ? `נותרו ${
                        mockStats.weeklyGoal - mockStats.workoutsThisWeek
                      } אימונים השבוע`
                    : "השלמת את המטרה! 🎉"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* כרטיס סטטיסטיקה אישית // Personal stats card */}
          <View style={styles.personalStatsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconBg,
                    { backgroundColor: theme.colors.success + "20" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="fire"
                    size={20}
                    color={theme.colors.success}
                  />
                </View>
                <Text style={styles.statItemValue}>
                  {mockStats.currentStreak}
                </Text>
                <Text style={styles.statItemLabel}>ימי רצף</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconBg,
                    { backgroundColor: theme.colors.warning + "20" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="lightning-bolt"
                    size={20}
                    color={theme.colors.warning}
                  />
                </View>
                <Text style={styles.statItemValue}>
                  {mockStats.caloriesBurned}
                </Text>
                <Text style={styles.statItemLabel}>קלוריות</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconBg,
                    { backgroundColor: theme.colors.accent + "20" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="timer"
                    size={20}
                    color={theme.colors.accent}
                  />
                </View>
                <Text style={styles.statItemValue}>
                  {Math.floor(mockStats.totalMinutes / 60)}
                </Text>
                <Text style={styles.statItemLabel}>שעות</Text>
              </View>
            </View>
          </View>

          {/* כרטיס הישגים // Achievements card */}
          <TouchableOpacity
            style={styles.achievementsCard}
            activeOpacity={0.8}
            onPress={() => console.log("Achievements pressed")}
          >
            <View style={styles.achievementsHeader}>
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.achievementsTitle}>הישגים אחרונים</Text>
              <MaterialCommunityIcons
                name="trophy"
                size={24}
                color={theme.colors.warning}
              />
            </View>
            <View style={styles.achievementsList}>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementText}>
                  {mockStats.personalRecords} שיאים אישיים
                </Text>
                <MaterialCommunityIcons
                  name="medal"
                  size={16}
                  color={theme.colors.warning}
                />
              </View>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementText}>
                  {mockStats.totalWorkouts} אימונים הושלמו
                </Text>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={16}
                  color={theme.colors.success}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.quickActionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>פעולות מהירות</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                console.log("🏠 MainScreen - Exercise list button clicked");
                navigation.navigate("ExerciseList");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons
                  name="barbell"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.actionButtonText}>רשימת תרגילים</Text>
              <Text style={styles.actionButtonSubtext}>חפש וגלה תרגילים</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                console.log("🏠 MainScreen - Workout plans button clicked");
                alert("תוכניות אימון - בקרוב!");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons
                  name="calendar"
                  size={28}
                  color={theme.colors.secondary}
                />
              </View>
              <Text style={styles.actionButtonText}>תוכניות אימון</Text>
              <Text style={styles.actionButtonSubtext}>
                תוכניות מותאמות אישית
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                console.log("🏠 MainScreen - History button clicked");
                alert("היסטוריה - בקרוב!");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="time" size={28} color={theme.colors.success} />
              </View>
              <Text style={styles.actionButtonText}>היסטוריה</Text>
              <Text style={styles.actionButtonSubtext}>
                צפה באימונים קודמים
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                console.log("🏠 MainScreen - Progress button clicked");
                alert("התקדמות - בקרוב!");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons
                  name="trending-up"
                  size={28}
                  color={theme.colors.accent}
                />
              </View>
              <Text style={styles.actionButtonText}>התקדמות</Text>
              <Text style={styles.actionButtonSubtext}>גרפים וסטטיסטיקות</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recommended Plans */}
        <Animated.View style={[styles.plansContainer, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>תוכניות מומלצות</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansScroll}
          >
            {recommendedPlans.map((plan, index) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, index === 0 && styles.firstPlanCard]}
                activeOpacity={0.8}
                onPress={() => {
                  console.log("🏠 MainScreen - Plan clicked:", plan.name);
                  alert(`${plan.name} - בקרוב!`);
                }}
              >
                <LinearGradient
                  colors={[
                    "rgba(78, 158, 255, 0.1)",
                    "rgba(78, 158, 255, 0.05)",
                  ]}
                  style={styles.planGradient}
                >
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planInfo}>
                    <View style={styles.planDetail}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.planDetailText}>{plan.duration}</Text>
                    </View>
                    <View style={styles.planDetail}>
                      <MaterialCommunityIcons
                        name="gauge"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.planDetailText}>
                        {plan.difficulty}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Motivational Quote */}
        <Animated.View style={[styles.quoteCard, { opacity: fadeAnim }]}>
          <Text style={styles.quoteText}>"הכאב של היום הוא הכוח של מחר"</Text>
          <Ionicons name="bulb" size={24} color={theme.colors.warning} />
        </Animated.View>
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
    paddingBottom: 30,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerGradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    flex: 1,
    marginLeft: 16,
  },
  greetingContainer: {
    marginBottom: 8,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
  },
  notificationBtn: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
  greetingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  nameText: {
    fontSize: 26,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "right",
  },
  timeIcon: {
    marginTop: 2,
  },
  motivationalText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "right",
    lineHeight: 20,
    marginTop: 8,
    fontStyle: "italic",
  },
  quickStartCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.large,
  },
  quickStartGradient: {
    padding: 20,
  },
  quickStartContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickStartTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  quickStartHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  quickStartTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "right",
  },
  quickStartEmoji: {
    fontSize: 24,
  },
  quickStartSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "right",
    marginBottom: 12,
  },
  quickStartStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  quickStartStatItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  quickStartStatText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  quickStartStatDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  quickStartButton: {
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  quickStartButtonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  quickStartButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },

  // תצוגת כרטיסים // Cards view
  statsCardsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: 16,
  },
  goalCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  goalGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 16,
  },
  goalHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  goalProgress: {
    gap: 12,
  },
  goalNumbers: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
  },
  goalCurrent: {
    color: theme.colors.primary,
  },
  goalDivider: {
    color: theme.colors.textSecondary,
    fontSize: 24,
  },
  goalTarget: {
    color: theme.colors.text,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  goalSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  personalStatsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  statsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statItemValue: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  statItemLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: theme.colors.divider,
  },
  achievementsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  achievementsHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementsTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: 8,
    textAlign: "right",
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  achievementText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  buttonsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    alignSelf: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  plansContainer: {
    marginBottom: theme.spacing.lg,
  },
  plansScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  planCard: {
    width: 200,
    marginLeft: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  firstPlanCard: {
    marginRight: 0,
    marginLeft: theme.spacing.md,
  },
  planGradient: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  planInfo: {
    gap: 8,
  },
  planDetail: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  planDetailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  quoteCard: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    ...theme.shadows.small,
  },
  quoteText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
  },
});
