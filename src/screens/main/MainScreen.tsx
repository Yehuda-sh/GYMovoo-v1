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

  console.log("🔥 MainScreen נטען עם כפתור דמו חדש!");

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // שם המשתמש
  const displayName = user?.name || user?.email?.split("@")[0] || "משתמש";

  // נתונים מדעיים חדשים
  const scientificProfile = user?.scientificProfile;
  const activityHistory = user?.activityHistory;
  const currentStats = user?.currentStats;
  const aiRecommendations = user?.aiRecommendations;

  // Debug log להבנת מבנה הנתונים
  console.log("🔍 MainScreen - activityHistory debug:", {
    hasActivityHistory: !!activityHistory,
    workoutsLength: activityHistory?.workouts?.length || 0,
    firstWorkout: activityHistory?.workouts?.[0],
    user: user?.email,
    fullUser: user ? Object.keys(user) : null,
  });

  // נתוני סטטיסטיקה לתצוגה
  const stats = {
    totalWorkouts: currentStats?.totalWorkouts || 0,
    currentStreak: currentStats?.currentStreak || 0,
    totalVolume: currentStats?.totalVolume || 0,
    averageRating: currentStats?.averageRating || 0,
    fitnessLevel: scientificProfile?.fitnessTests?.overallLevel || "beginner",
  };

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

  // פונקציה ליצירת נתוני דמו רנדומליים
  const handleDemoRandomize = () => {
    console.log("🎲 יצירת נתוני דמו רנדומליים...");
    console.log("🎲 הפונקציה handleDemoRandomize נקראה!");

    try {
      // מערכי אפשרויות לבחירה רנדומלית
      const ages = ["18-25", "26-35", "36-45", "46-55", "55-plus"];
      const goals = [
        "weight_loss",
        "muscle_gain",
        "strength_improvement",
        "endurance_improvement",
        "general_health",
        "fitness_maintenance",
      ];
      const experiences = [
        "beginner",
        "intermediate",
        "advanced",
        "expert",
        "competitive",
      ];
      const frequencies = [
        "2-times",
        "3-times",
        "4-times",
        "5-times",
        "6-plus-times",
      ];
      const durations = [
        "20-30-min",
        "30-45-min",
        "45-60-min",
        "60-90-min",
        "90-plus-min",
      ];

      console.log("🎲 מערכי נתונים נוצרו");

      // ציוד אפשרי
      const bodyweightOptions = [
        { id: "bodyweight_only", metadata: { equipment: ["bodyweight"] } },
        { id: "mat_available", metadata: { equipment: ["mat"] } },
        { id: "chair_available", metadata: { equipment: ["chair"] } },
        { id: "wall_space", metadata: { equipment: ["wall"] } },
        { id: "stairs_available", metadata: { equipment: ["stairs"] } },
      ];

      const homeOptions = [
        { id: "dumbbells_home", metadata: { equipment: ["dumbbells"] } },
        {
          id: "resistance_bands",
          metadata: { equipment: ["resistance_bands"] },
        },
        { id: "kettlebell_home", metadata: { equipment: ["kettlebell"] } },
        { id: "pullup_bar", metadata: { equipment: ["pullup_bar"] } },
        { id: "exercise_ball", metadata: { equipment: ["exercise_ball"] } },
      ];

      const gymOptions = [
        {
          id: "free_weights_gym",
          metadata: { equipment: ["dumbbells", "barbell"] },
        },
        { id: "squat_rack_gym", metadata: { equipment: ["squat_rack"] } },
        { id: "bench_press_gym", metadata: { equipment: ["bench_press"] } },
        { id: "cable_machine_gym", metadata: { equipment: ["cable_machine"] } },
        {
          id: "cardio_machines_gym",
          metadata: { equipment: ["treadmill", "elliptical"] },
        },
      ];

      console.log("🎲 ציוד נוצר");

      // בחירה רנדומלית
      const randomAge = ages[Math.floor(Math.random() * ages.length)];
      const randomGoal = goals[Math.floor(Math.random() * goals.length)];
      const randomExperience =
        experiences[Math.floor(Math.random() * experiences.length)];
      const randomFrequency =
        frequencies[Math.floor(Math.random() * frequencies.length)];
      const randomDuration =
        durations[Math.floor(Math.random() * durations.length)];

      console.log("🎲 נתונים רנדומליים נבחרו:", {
        randomAge,
        randomGoal,
        randomExperience,
      });

      // בחירה רנדומלית של ציוד (1-3 פריטים מכל קטגוריה)
      const selectedBodyweight = bodyweightOptions.slice(
        0,
        Math.floor(Math.random() * 3) + 1
      );
      const selectedHome = homeOptions.slice(
        0,
        Math.floor(Math.random() * 3) + 1
      );
      const selectedGym = gymOptions.slice(
        0,
        Math.floor(Math.random() * 3) + 1
      );

      console.log("🎲 ציוד נבחר:", {
        selectedBodyweight,
        selectedHome,
        selectedGym,
      });

      // יצירת נתוני שאלון חדשים
      const newQuestionnaireData = {
        age: { id: randomAge, label: randomAge },
        goal: { id: randomGoal, label: randomGoal },
        experience: { id: randomExperience, label: randomExperience },
        frequency: { id: randomFrequency, label: randomFrequency },
        duration: { id: randomDuration, label: randomDuration },
        bodyweight_equipment_options: selectedBodyweight,
        home_equipment_options: selectedHome,
        gym_equipment_options: selectedGym,
        available_equipment: [
          ...selectedBodyweight.flatMap((item) => item.metadata.equipment),
          ...selectedHome.flatMap((item) => item.metadata.equipment),
          ...selectedGym.flatMap((item) => item.metadata.equipment),
        ],
      };

      console.log("🎲 נתוני דמו חדשים:", newQuestionnaireData);

      // עדכון ה-store
      console.log("🎲 מעדכן את ה-store...");
      useUserStore.getState().setQuestionnaire(newQuestionnaireData);
      console.log("✅ נתוני השאלון עודכנו באופן רנדומלי!");
    } catch (error) {
      console.error("❌ שגיאה בפונקציית הדמו:", error);
    }
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

              {/* כפתור דמו לשינוי תוצאות השאלון */}
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleDemoRandomize}
              >
                <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
                <Text style={styles.demoText}>דמו</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.motivationText}>מוכן לאימון?</Text>
        </Animated.View>

        {/* סטטיסטיקות מדעיות חדשות */}
        {(stats.totalWorkouts > 0 || scientificProfile) && (
          <Animated.View
            style={[
              styles.scientificStatsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>הנתונים המדעיים שלך</Text>

            <View style={styles.scientificStatsGrid}>
              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.scientificStatNumber}>
                  {stats.totalWorkouts}
                </Text>
                <Text style={styles.scientificStatLabel}>אימונים הושלמו</Text>
              </View>

              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={theme.colors.warning}
                />
                <Text style={styles.scientificStatNumber}>
                  {stats.currentStreak}
                </Text>
                <Text style={styles.scientificStatLabel}>ימי רצף</Text>
              </View>

              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={styles.scientificStatNumber}>
                  {Math.round(stats.totalVolume / 1000)}K
                </Text>
                <Text style={styles.scientificStatLabel}>נפח כולל</Text>
              </View>

              <View style={styles.scientificStatCard}>
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={theme.colors.warning}
                />
                <Text style={styles.scientificStatNumber}>
                  {stats.averageRating.toFixed(1)}
                </Text>
                <Text style={styles.scientificStatLabel}>דירוג ממוצע</Text>
              </View>
            </View>

            {/* פרופיל מדעי - תשובות שאלון */}
            {scientificProfile && (
              <View style={styles.questionnaireAnswersCard}>
                <Text style={styles.questionnaireTitle}>
                  הפרטים שלך מהשאלון המדעי
                </Text>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>גיל:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)?.age_range ||
                      "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מין:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)?.gender ===
                    "male"
                      ? "גבר"
                      : (user?.questionnaireData?.answers as any)?.gender ===
                          "female"
                        ? "אישה"
                        : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מטרה עיקרית:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)?.primary_goal ===
                    "lose_weight"
                      ? "הורדת משקל"
                      : (user?.questionnaireData?.answers as any)
                            ?.primary_goal === "build_muscle"
                        ? "בניית שריר"
                        : (user?.questionnaireData?.answers as any)
                              ?.primary_goal === "improve_health"
                          ? "שיפור בריאות"
                          : (user?.questionnaireData?.answers as any)
                                ?.primary_goal === "feel_stronger"
                            ? "הרגשה חזקה יותר"
                            : (user?.questionnaireData?.answers as any)
                                  ?.primary_goal === "improve_fitness"
                              ? "שיפור כושר"
                              : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>ניסיון באימונים:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)
                      ?.fitness_experience === "complete_beginner"
                      ? "מתחיל לחלוטין"
                      : (user?.questionnaireData?.answers as any)
                            ?.fitness_experience === "some_experience"
                        ? "קצת ניסיון"
                        : (user?.questionnaireData?.answers as any)
                              ?.fitness_experience === "intermediate"
                          ? "בינוני"
                          : (user?.questionnaireData?.answers as any)
                                ?.fitness_experience === "advanced"
                            ? "מתקדם"
                            : (user?.questionnaireData?.answers as any)
                                  ?.fitness_experience === "athlete"
                              ? "ספורטאי"
                              : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מיקום אימון:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)
                      ?.workout_location === "home_only"
                      ? "בית בלבד"
                      : (user?.questionnaireData?.answers as any)
                            ?.workout_location === "gym_only"
                        ? "חדר כושר בלבד"
                        : (user?.questionnaireData?.answers as any)
                              ?.workout_location === "both"
                          ? "שניהם"
                          : (user?.questionnaireData?.answers as any)
                                ?.workout_location === "outdoor"
                            ? "חוץ"
                            : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>זמן לאימון:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)?.session_duration
                      ? `${(user?.questionnaireData?.answers as any)?.session_duration} דקות`
                      : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>תדירות:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)?.available_days
                      ? `${(user?.questionnaireData?.answers as any)?.available_days} ימים בשבוע`
                      : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>ציוד זמין:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)
                      ?.available_equipment?.length > 0
                      ? (
                          user?.questionnaireData?.answers as any
                        ).available_equipment
                          .map((eq: string) =>
                            eq === "full_gym"
                              ? "חדר כושר מלא"
                              : eq === "dumbbells"
                                ? "דמבלים"
                                : eq === "barbell"
                                  ? "מוט ומשקולות"
                                  : eq === "bodyweight"
                                    ? "משקל גוף"
                                    : eq === "resistance_bands"
                                      ? "גומיות"
                                      : eq
                          )
                          .join(", ")
                      : "לא צוין"}
                  </Text>
                </View>

                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>מצב בריאותי:</Text>
                  <Text style={styles.answerValue}>
                    {(user?.questionnaireData?.answers as any)
                      ?.health_status === "excellent"
                      ? "מעולה"
                      : (user?.questionnaireData?.answers as any)
                            ?.health_status === "good"
                        ? "טוב"
                        : (user?.questionnaireData?.answers as any)
                              ?.health_status === "some_issues"
                          ? "יש כמה בעיות"
                          : (user?.questionnaireData?.answers as any)
                                ?.health_status === "serious_issues"
                            ? "בעיות רציניות"
                            : "לא צוין"}
                  </Text>
                </View>

                {/* הערה על השם */}
                <View style={styles.noteContainer}>
                  <MaterialCommunityIcons
                    name="information"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.noteText}>
                    השם נוצר אוטומטית למשתמש הדמו. בשאלון האמיתי לא שואלים שם
                    אישי.
                  </Text>
                </View>
              </View>
            )}

            {/* רמת כושר ו-AI recommendations */}
            <View style={styles.aiInsightCard}>
              <View style={styles.fitnessLevelBadge}>
                <Text style={styles.fitnessLevelText}>
                  רמת כושר:{" "}
                  {stats.fitnessLevel === "beginner"
                    ? "מתחיל"
                    : stats.fitnessLevel === "intermediate"
                      ? "בינוני"
                      : "מתקדם"}
                </Text>
              </View>

              {aiRecommendations?.quickTip && (
                <View style={styles.aiTipContainer}>
                  <MaterialCommunityIcons
                    name="lightbulb"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.aiTipText}>
                    {aiRecommendations.quickTip}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

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
                <Text style={styles.statPercentage}>
                  {activityHistory?.weeklyProgress
                    ? `${Math.round((activityHistory.weeklyProgress / (scientificProfile?.available_days || 3)) * 100)}%`
                    : "0%"}
                </Text>
              </View>
              <Text style={styles.statSubtitle}>
                {activityHistory?.weeklyProgress || 0}/
                {scientificProfile?.available_days || 3} אימונים
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: activityHistory?.weeklyProgress
                        ? `${Math.min(100, Math.round((activityHistory.weeklyProgress / (scientificProfile?.available_days || 3)) * 100))}%`
                        : "0%",
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconWrapper}>
                <MaterialCommunityIcons name="fire" size={20} color="#007AFF" />
              </View>
              <Text style={styles.statTitle}>רצף נוכחי</Text>
              <Text style={styles.statValue}>
                {currentStats?.streak || activityHistory?.streak || 0} ימים
              </Text>
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
              <Text style={styles.statValue}>
                {activityHistory?.workouts?.length ||
                  currentStats?.totalWorkouts ||
                  0}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* אימונים אחרונים */}
        <Animated.View
          style={[
            styles.recentWorkoutsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>אימונים אחרונים</Text>

          <View style={styles.recentWorkoutsList}>
            {/* אימונים אמיתיים מההיסטוריה */}
            {activityHistory?.workouts && activityHistory.workouts.length > 0
              ? activityHistory.workouts
                  .slice(0, 3)
                  .map((workout: any, index: number) => (
                    <View
                      key={workout.id || `workout-${index}`}
                      style={styles.recentWorkoutItem}
                    >
                      <View style={styles.workoutIcon}>
                        <MaterialCommunityIcons
                          name={
                            workout.type === "strength" ||
                            workout.workoutName?.includes("חזה")
                              ? "dumbbell"
                              : workout.workoutName?.includes("רגל") ||
                                  workout.type === "cardio"
                                ? "run"
                                : workout.workoutName?.includes("גב")
                                  ? "arm-flex"
                                  : "weight-lifter"
                          }
                          size={24}
                          color="#007AFF"
                        />
                      </View>
                      <View style={styles.workoutInfo}>
                        <Text style={styles.workoutTitle}>
                          {workout.workoutName || workout.type === "strength"
                            ? "אימון כח"
                            : "אימון כללי"}
                        </Text>
                        <Text style={styles.workoutDate}>
                          {workout.date
                            ? new Date(workout.date).toLocaleDateString("he-IL")
                            : new Date(
                                workout.completedAt || Date.now()
                              ).toLocaleDateString("he-IL")}
                          {(workout.completedAt || workout.startTime) && (
                            <Text style={styles.workoutTime}>
                              {" • "}
                              {new Date(
                                workout.completedAt || workout.startTime
                              ).toLocaleTimeString("he-IL", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          )}
                          {" • "}
                          {workout.duration || 45} דקות
                        </Text>
                      </View>
                      <View style={styles.workoutRating}>
                        <MaterialCommunityIcons
                          name="star"
                          size={16}
                          color="#FFD700"
                        />
                        <Text style={styles.ratingText}>
                          {workout.feedback?.rating?.toFixed(1) ||
                            workout.rating?.toFixed(1) ||
                            "4.5"}
                        </Text>
                      </View>
                    </View>
                  ))
              : // אם אין היסטוריה אמיתית - הצג אימונים דמו
                [
                  {
                    name: "אימון חזה וכתפיים",
                    date: "אתמול • 45 דקות",
                    rating: "4.8",
                    icon: "dumbbell",
                  },
                  {
                    name: "רגליים וישבן",
                    date: "לפני 3 ימים • 50 דקות",
                    rating: "4.5",
                    icon: "run",
                  },
                  {
                    name: "גב וביצפס",
                    date: "לפני 5 ימים • 40 דקות",
                    rating: "4.7",
                    icon: "arm-flex",
                  },
                ].map((workout, index) => (
                  <View key={`demo-${index}`} style={styles.recentWorkoutItem}>
                    <View style={styles.workoutIcon}>
                      <MaterialCommunityIcons
                        name={workout.icon as any}
                        size={24}
                        color="#007AFF"
                      />
                    </View>
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutTitle}>{workout.name}</Text>
                      <Text style={styles.workoutDate}>{workout.date}</Text>
                    </View>
                    <View style={styles.workoutRating}>
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#FFD700"
                      />
                      <Text style={styles.ratingText}>{workout.rating}</Text>
                    </View>
                  </View>
                ))}
          </View>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => (navigation as any).navigate("History")}
          >
            <Text style={styles.viewAllText}>צפה בכל ההיסטוריה</Text>
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color="#007AFF"
            />
          </TouchableOpacity>
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
  recentWorkoutsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  recentWorkoutsList: {
    gap: theme.spacing.sm,
  },
  recentWorkoutItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#333333",
  },
  workoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.md,
  },
  workoutInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 12,
    color: "#AAAAAA",
    textAlign: "right",
  },
  workoutTime: {
    color: "#007AFF",
    fontWeight: "500",
  },
  workoutRating: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 4,
  },
  viewAllButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginRight: theme.spacing.xs,
  },

  // סטיילים חדשים לסטטיסטיקות מדעיות
  scientificStatsSection: {
    marginBottom: 20,
    paddingHorizontal: theme.spacing.lg,
  },

  scientificStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  scientificStatCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    ...theme.shadows.small,
  },

  scientificStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 4,
  },

  scientificStatLabel: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },

  aiInsightCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginTop: 8,
    ...theme.shadows.small,
  },

  fitnessLevelBadge: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  fitnessLevelText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
    writingDirection: "rtl",
  },

  aiTipContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: 12,
  },

  aiTipText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    lineHeight: 20,
    marginEnd: 8,
    flex: 1,
    writingDirection: "rtl",
  },

  // סטיילים לתשובות השאלון
  questionnaireAnswersCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    ...theme.shadows.small,
  },

  questionnaireTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "right",
    writingDirection: "rtl",
  },

  answerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "30",
  },

  answerLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    writingDirection: "rtl",
  },

  answerValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "600",
    writingDirection: "rtl",
  },

  // סטיילים להערה על השם
  noteContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.md,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },

  noteText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginEnd: 8,
    flex: 1,
    writingDirection: "rtl",
    lineHeight: 16,
  },

  // סטיילים לכפתור הדמו
  demoButton: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  demoText: {
    fontSize: 10,
    color: theme.colors.surface,
    fontFamily: "Heebo-Bold",
    marginTop: 2,
  },
});
