/**
 * @file src/screens/main/MainScreen.tsx
 * @brief מסך ראשי חדש - עיצוב מודרני כהה
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";

const { width: screenWidth } = Dimensions.get("window");

export default function MainScreen() {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // שם המשתמש
  const displayName = user?.email?.split("@")[0] || "משתמש";

  useEffect(() => {
    // אנימציות כניסה
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
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleStartWorkout = () => {
    (navigation as any).navigate("WorkoutPlans");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={["#007AFF"]}
          />
        }
      >
        {/* כותרת עם ברוכים הבאים */}
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeText}>
              <Text style={styles.greetingText}>צהריים טובים,</Text>
              <Text style={styles.userName}>{displayName}</Text>
            </View>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <Text style={styles.profileInitials}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.motivationText}>מוכן לאימון?</Text>
        </Animated.View>

        {/* האימון הבא */}
        <Animated.View
          style={[
            styles.nextWorkoutSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>האימון הבא שלך</Text>
          <View style={styles.workoutCard}>
            <Text style={styles.workoutName}>חזה</Text>
            <Text style={styles.workoutDescription}>
              ברוכים הבאים! התחלת תוכנית האימונים
            </Text>

            <View style={styles.workoutProgress}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>1</Text>
                <Text style={styles.progressLabel}>שבוע</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>0</Text>
                <Text style={styles.progressLabel}>אימונים</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>100%</Text>
                <Text style={styles.progressLabel}>הישג</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.startWorkoutButton}
              onPress={handleStartWorkout}
            >
              <MaterialCommunityIcons name="play" size={16} color="white" />
              <Text style={styles.startWorkoutText}>התחל אימון</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* סטטוס שלך */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>הסטטוס שלך</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>מטרת שבועית</Text>
                <Text style={styles.statPercentage}>75%</Text>
              </View>
              <Text style={styles.statSubtitle}>3/4 אימונים</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "75%" }]} />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconWrapper}>
                <MaterialCommunityIcons name="fire" size={20} color="#007AFF" />
              </View>
              <Text style={styles.statTitle}>רצף נוכחי</Text>
              <Text style={styles.statValue}>5 ימים</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconWrapper}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={20}
                  color="#007AFF"
                />
              </View>
              <Text style={styles.statTitle}>סה"כ אימונים</Text>
              <Text style={styles.statValue}>24</Text>
            </View>
          </View>
        </Animated.View>

        {/* ניווט מהיר */}
        <Animated.View
          style={[
            styles.quickNavSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>ניווט מהיר</Text>

          <View style={styles.quickNavGrid}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => (navigation as any).navigate("Main")}
            >
              <MaterialCommunityIcons name="home" size={24} color="#007AFF" />
              <Text style={styles.navItemText}>בית</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => (navigation as any).navigate("WorkoutPlans")}
            >
              <MaterialCommunityIcons name="robot" size={24} color="#007AFF" />
              <Text style={styles.navItemText}>AI מאמן</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => (navigation as any).navigate("WorkoutPlans")}
            >
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.navItemText}>אימון</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => (navigation as any).navigate("History")}
            >
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.navItemText}>היסטוריה</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => (navigation as any).navigate("Profile")}
            >
              <MaterialCommunityIcons
                name="account"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.navItemText}>פרופיל</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F", // רקע כהה כמו בתמונה
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
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "right",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "right",
  },
  motivationText: {
    fontSize: 14,
    color: "#AAAAAA",
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
    backgroundColor: "#FF4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  nextWorkoutSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: theme.spacing.md,
  },
  workoutCard: {
    backgroundColor: "#1A3B3A", // צבע ירוק כהה כמו בתמונה
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: theme.spacing.sm,
  },
  workoutDescription: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "right",
    marginBottom: theme.spacing.lg,
  },
  workoutProgress: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    backgroundColor: "#2A4B4A",
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
    color: "#FFFFFF",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  startWorkoutButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  startWorkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
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
    backgroundColor: "#1A1A1A",
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
    color: "#AAAAAA",
    textAlign: "right",
  },
  statPercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
  },
  statSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#333333",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  statIconWrapper: {
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
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
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
});
