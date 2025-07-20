/**
 * @file src/screens/main/MainScreen.tsx
 * @description מסך ראשי משודרג - דשבורד אינטראקטיבי, סטטיסטיקות, התחלה מהירה
 * English: Enhanced main screen - interactive dashboard, statistics, quick start
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

  console.log("🏠 MainScreen - Component mounted");
  console.log("🏠 MainScreen - Current user:", user);
  console.log("🏠 MainScreen - Display name:", displayName);

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("");

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("🏠 MainScreen - useEffect triggered");

    // קביעת ברכה לפי שעה // Set greeting by time
    const hour = new Date().getHours();
    console.log("🏠 MainScreen - Current hour:", hour);

    if (hour < 12) setGreeting("בוקר טוב");
    else if (hour < 17) setGreeting("צהריים טובים");
    else if (hour < 21) setGreeting("ערב טוב");
    else setGreeting("לילה טוב");

    console.log("🏠 MainScreen - Greeting set to:", greeting);

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

  const renderStatCard = (
    icon: string,
    value: string | number,
    label: string,
    color: string
  ) => (
    <Animated.View style={[styles.statCard, { opacity: statsOpacity }]}>
      <MaterialCommunityIcons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );

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
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => {
                console.log("🏠 MainScreen - Profile button clicked");
                navigation.navigate("Profile");
              }}
              activeOpacity={0.7}
            >
              <DefaultAvatar size={40} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => {
                console.log("🏠 MainScreen - Notifications button clicked");
                alert("התראות - בקרוב!");
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.colors.text}
              />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.greetingText}>{greeting},</Text>
            <Text style={styles.nameText}>{displayName}!</Text>
          </View>
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
              <View>
                <Text style={styles.quickStartTitle}>מוכן לאימון?</Text>
                <Text style={styles.quickStartSubtitle}>
                  התחל אימון מהיר עכשיו!
                </Text>
              </View>
              <TouchableOpacity
                style={styles.quickStartButton}
                onPress={handleQuickStart}
                activeOpacity={0.8}
              >
                <FontAwesome5
                  name="play"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Statistics */}
        <Animated.View
          style={[styles.statsContainer, { opacity: statsOpacity }]}
        >
          <Text style={styles.sectionTitle}>הסטטיסטיקות שלך</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              "calendar-check",
              mockStats.workoutsThisWeek,
              "השבוע",
              theme.colors.success
            )}
            {renderStatCard(
              "dumbbell",
              mockStats.totalWorkouts,
              "סה״כ אימונים",
              theme.colors.primary
            )}
            {renderStatCard(
              "fire",
              mockStats.currentStreak,
              "ימי רצף",
              theme.colors.warning
            )}
            {renderStatCard(
              "star",
              mockStats.favoriteExercise,
              "תרגיל מועדף",
              theme.colors.accent
            )}
          </View>
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
            {recommendedPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
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
          <Ionicons name="bulb" size={24} color={theme.colors.warning} />
          <Text style={styles.quoteText}>"הכאב של היום הוא הכוח של מחר"</Text>
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
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  notificationBtn: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
  greetingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  quickStartCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.large,
  },
  quickStartGradient: {
    padding: theme.spacing.lg,
  },
  quickStartContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickStartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  quickStartSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  quickStartButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  buttonsContainer: {
    flexDirection: "row",
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
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  plansContainer: {
    marginBottom: theme.spacing.lg,
  },
  plansScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  planCard: {
    width: 200,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
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
