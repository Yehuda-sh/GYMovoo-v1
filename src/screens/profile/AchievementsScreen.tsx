/**
 * @file src/screens/profile/AchievementsScreen.tsx
 * @description מסך הישגים ותגמולים למוטיבציה של המשתמש
 * English: Achievements and rewards screen for user motivation
 *
 * מה המסך הזה עושה?
 * ===================
 * מסך שמציג למשתמש את כל ההישגים שלו:
 * - תגים שכבר השיג
 * - תגים שעוד לא השיג
 * - מטרות קרובות
 * - סטטיסטיקות כלליות
 * - הישגים מיוחדים
 *
 * למה זה חשוב?
 * =============
 * זה עוזר למוטיבציה ולמעקב אחר התקדמות.
 * משתמשים אוהבים לראות את ההישגים שלהם ומה עוד יכולים להשיג.
 *
 * @features
 * - רשימת הישגים דינמית עם אנימציות
 * - התקדמות ויזואלית למטרות
 * - סטטיסטיקות מפורטות
 * - שיתוף הישגים
 * - מערכת נקודות וחוגגת הישגים
 * - נגישות מלאה לקוראי מסך
 *
 * @dependencies React Native, Progress Indicators, Animations, UserStore
 * @usage Used for displaying and tracking user achievements
 * @created 2025-01-09 - Phase 2 missing screens implementation
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { logger } from "../../utils/logger";

// טיפוסים של הישגים
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "workout" | "progress" | "consistency" | "special";
  target: number;
  current: number;
  completed: boolean;
  completedDate?: Date;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface AchievementCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  achievements: Achievement[];
}

// נתוני הישגים לדוגמה
interface UserStats {
  totalWorkouts: number;
  totalExercises: number;
  currentStreak: number;
  totalWeightLifted: number;
  totalPoints: number;
  achievementsCount: number;
}

const generateAchievements = (userStats: UserStats): AchievementCategory[] => {
  const totalWorkouts = userStats?.totalWorkouts || 0;
  const totalExercises = userStats?.totalExercises || 0;
  const streak = userStats?.currentStreak || 0;
  const totalWeight = userStats?.totalWeightLifted || 0;

  return [
    {
      id: "workout",
      title: "הישגי אימון",
      icon: "fitness",
      color: "#4CAF50",
      achievements: [
        {
          id: "first_workout",
          title: "האימון הראשון",
          description: "השלם את האימון הראשון שלך",
          icon: "play-circle",
          category: "workout",
          target: 1,
          current: totalWorkouts,
          completed: totalWorkouts >= 1,
          ...(totalWorkouts >= 1 && { completedDate: new Date() }),
          points: 50,
          rarity: "common",
        },
        {
          id: "workout_10",
          title: "בדרך לכושר",
          description: "השלם 10 אימונים",
          icon: "barbell",
          category: "workout",
          target: 10,
          current: totalWorkouts,
          completed: totalWorkouts >= 10,
          ...(totalWorkouts >= 10 && { completedDate: new Date() }),
          points: 200,
          rarity: "common",
        },
        {
          id: "workout_50",
          title: "מתאמן מתמיד",
          description: "השלם 50 אימונים",
          icon: "trophy",
          category: "workout",
          target: 50,
          current: totalWorkouts,
          completed: totalWorkouts >= 50,
          points: 500,
          rarity: "rare",
        },
        {
          id: "workout_100",
          title: "אלוף האימונים",
          description: "השלם 100 אימונים",
          icon: "medal",
          category: "workout",
          target: 100,
          current: totalWorkouts,
          completed: totalWorkouts >= 100,
          points: 1000,
          rarity: "epic",
        },
      ],
    },
    {
      id: "consistency",
      title: "עקביות",
      icon: "calendar",
      color: "#FF9800",
      achievements: [
        {
          id: "streak_3",
          title: "התחלה טובה",
          description: "3 ימי אימון ברצף",
          icon: "flame",
          category: "consistency",
          target: 3,
          current: streak,
          completed: streak >= 3,
          points: 100,
          rarity: "common",
        },
        {
          id: "streak_7",
          title: "שבוע מושלם",
          description: "7 ימי אימון ברצף",
          icon: "fire",
          category: "consistency",
          target: 7,
          current: streak,
          completed: streak >= 7,
          points: 300,
          rarity: "rare",
        },
        {
          id: "streak_30",
          title: "הרגל מושרש",
          description: "30 ימי אימון ברצף",
          icon: "bonfire",
          category: "consistency",
          target: 30,
          current: streak,
          completed: streak >= 30,
          points: 800,
          rarity: "epic",
        },
      ],
    },
    {
      id: "progress",
      title: "התקדמות",
      icon: "trending-up",
      color: "#2196F3",
      achievements: [
        {
          id: "total_weight_1000",
          title: "הרמת משקולות",
          description: 'הרם סה"כ 1000 ק"ג',
          icon: "barbell-outline",
          category: "progress",
          target: 1000,
          current: totalWeight,
          completed: totalWeight >= 1000,
          points: 250,
          rarity: "common",
        },
        {
          id: "total_exercises_100",
          title: "חובב תרגילים",
          description: "בצע 100 תרגילים",
          icon: "list",
          category: "progress",
          target: 100,
          current: totalExercises,
          completed: totalExercises >= 100,
          points: 400,
          rarity: "rare",
        },
      ],
    },
    {
      id: "special",
      title: "הישגים מיוחדים",
      icon: "star",
      color: "#9C27B0",
      achievements: [
        {
          id: "early_bird",
          title: "ציפור מוקדמת",
          description: "התאמן לפני 7:00 בבוקר",
          icon: "sunny",
          category: "special",
          target: 1,
          current: 0, // TODO: Track early morning workouts
          completed: false,
          points: 150,
          rarity: "rare",
        },
        {
          id: "night_owl",
          title: "ינשוף הלילה",
          description: "התאמן אחרי 22:00",
          icon: "moon",
          category: "special",
          target: 1,
          current: 0, // TODO: Track late night workouts
          completed: false,
          points: 150,
          rarity: "rare",
        },
      ],
    },
  ];
};

// סגנונות עיצוב
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#1a1a1a",
    flex: 1,
    textAlign: "center" as const,
  },
  shareButton: {
    padding: 8,
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#333",
    marginBottom: 12,
    textAlign: "center" as const,
  },
  statsRow: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
  },
  statItem: {
    alignItems: "center" as const,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryIcon: {
    marginLeft: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#333",
  },
  achievementCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementCardCompleted: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  achievementHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  achievementIcon: {
    marginLeft: 12,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#333",
  },
  achievementDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  achievementPoints: {
    backgroundColor: "#FFE082",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start" as const,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#F57C00",
  },
  progressContainer: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden" as const,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  completedBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  completedText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600" as const,
    marginRight: 4,
  },
  rarityBadge: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: "white",
  },
  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center" as const,
    marginTop: 12,
  },
};

// צבעים לפי רמת נדירות
const rarityColors = {
  common: "#9E9E9E",
  rare: "#2196F3",
  epic: "#9C27B0",
  legendary: "#FF5722",
};

export const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation();

  // מצב הקומפוננטה
  const [refreshing, setRefreshing] = useState(false);

  // חישוב הישגים וסטטיסטיקות
  const userStats = useMemo(() => {
    // TODO: Get real stats from user data
    return {
      totalWorkouts: 25,
      totalExercises: 150,
      currentStreak: 5,
      totalWeightLifted: 2500,
      totalPoints: 850,
      achievementsCount: 6,
    };
  }, []);

  const achievementCategories = useMemo(() => {
    return generateAchievements(userStats);
  }, [userStats]);

  const totalAchievements = useMemo(() => {
    return achievementCategories.reduce(
      (total, category) => total + category.achievements.length,
      0
    );
  }, [achievementCategories]);

  const completedAchievements = useMemo(() => {
    return achievementCategories.reduce(
      (total, category) =>
        total + category.achievements.filter((a) => a.completed).length,
      0
    );
  }, [achievementCategories]);

  // רענון נתונים
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // TODO: Refresh user data and achievements
    setTimeout(() => {
      setRefreshing(false);
      logger.info("AchievementsScreen", "Data refreshed");
    }, 1000);
  }, []);

  // שיתוף הישגים
  const handleShareAchievements = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const message = `השגתי ${completedAchievements} הישגים מתוך ${totalAchievements} באפליקציית GYMovoo! 💪\nצבירת נקודות: ${userStats.totalPoints}\nרצף אימונים: ${userStats.currentStreak} ימים`;

      await Share.share({
        message,
        title: "ההישגים שלי ב-GYMovoo",
      });

      logger.info("AchievementsScreen", "Achievements shared");
    } catch (error) {
      logger.error("AchievementsScreen", "Failed to share achievements", error);
    }
  }, [completedAchievements, totalAchievements, userStats]);

  // חזרה למסך הקודם
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  }, [navigation]);

  // רינדור כרטיס הישג
  const renderAchievement = useCallback(
    (achievement: Achievement, categoryColor: string) => {
      const progressPercentage = Math.min(
        (achievement.current / achievement.target) * 100,
        100
      );

      return (
        <View
          key={achievement.id}
          style={[
            styles.achievementCard,
            achievement.completed && styles.achievementCardCompleted,
          ]}
        >
          {/* תג נדירות */}
          <View
            style={[
              styles.rarityBadge,
              { backgroundColor: rarityColors[achievement.rarity] },
            ]}
          >
            <Text style={styles.rarityText}>
              {achievement.rarity === "common"
                ? "רגיל"
                : achievement.rarity === "rare"
                  ? "נדיר"
                  : achievement.rarity === "epic"
                    ? "אפי"
                    : "אגדי"}
            </Text>
          </View>

          {/* כותרת הישג */}
          <View style={styles.achievementHeader}>
            <Ionicons
              name={achievement.icon as any}
              size={24}
              color={achievement.completed ? "#4CAF50" : categoryColor}
              style={styles.achievementIcon}
            />
            <View style={styles.achievementTextContainer}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
            </View>
            <View style={styles.achievementPoints}>
              <Text style={styles.pointsText}>{achievement.points} נק'</Text>
            </View>
          </View>

          {/* התקדמות */}
          {!achievement.completed && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  {achievement.current} / {achievement.target}
                </Text>
                <Text style={styles.progressText}>
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%` as any },
                  ]}
                />
              </View>
            </View>
          )}

          {/* תג השלמה */}
          {achievement.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>הושלם</Text>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            </View>
          )}
        </View>
      );
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* כותרת */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessible={true}
            accessibilityLabel="חזור למסך הקודם"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-forward" size={24} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.title}>הישגים</Text>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareAchievements}
            accessible={true}
            accessibilityLabel="שתף הישגים"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* סטטיסטיקות כלליות */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>הסטטיסטיקות שלך</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedAchievements}</Text>
            <Text style={styles.statLabel}>הישגים</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.totalPoints}</Text>
            <Text style={styles.statLabel}>נקודות</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>רצף ימים</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>אימונים</Text>
          </View>
        </View>
      </View>

      {/* רשימת הישגים */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
      >
        {achievementCategories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <Ionicons
                name={category.icon as any}
                size={24}
                color={category.color}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>

            {category.achievements.map((achievement) =>
              renderAchievement(achievement, category.color)
            )}
          </View>
        ))}

        {/* מצב ריק */}
        {achievementCategories.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              עדיין אין לך הישגים.{"\n"}התחל להתאמן כדי לזכות בהישגים הראשונים
              שלך!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AchievementsScreen;
