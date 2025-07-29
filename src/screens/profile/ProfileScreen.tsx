/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש משודרג - כולל בחירת אווטאר, הישגים, התקדמות ועוד
 * @dependencies userStore (Zustand), DefaultAvatar, ImagePicker
 * @notes עיצוב נקי ומינימליסטי בהתאם לשאר המסכים
 * @recurring_errors בעיות RTL בסידור אלמנטים, כיווניות לא נכונה ב-flexDirection
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";
import {
  hasCompletedTrainingStage,
  hasCompletedProfileStage,
} from "../../data/twoStageQuestionnaireData";
import { ALL_EQUIPMENT } from "../../data/equipmentData";
import * as ImagePicker from "expo-image-picker";
import type { ComponentProps } from "react";

// טיפוס לאייקון
type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

type Achievement = {
  id: number;
  title: string;
  icon: MaterialCommunityIconName;
  color: string;
  unlocked: boolean;
};

const { width: screenWidth } = Dimensions.get("window");

// פונקציה לחישוב הישגים מהנתונים המדעיים
const calculateAchievements = (user: any): Achievement[] => {
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "מתחיל נלהב",
      icon: "star",
      color: "#FFD700",
      unlocked: !!user?.scientificProfile, // אם יש פרופיל מדעי
    },
    {
      id: 2,
      title: "7 ימי רצף",
      icon: "fire",
      color: "#FF6347",
      unlocked: false,
    },
    {
      id: 3,
      title: "30 אימונים",
      icon: "medal",
      color: "#C0C0C0",
      unlocked: false,
    },
    {
      id: 4,
      title: "גיבור כושר",
      icon: "trophy",
      color: "#FFD700",
      unlocked: false,
    },
  ];

  // אם יש נתונים מדעיים, חשב הישגים אמיתיים
  if (user?.activityHistory?.workouts) {
    const workouts = user.activityHistory.workouts;
    const workoutCount = workouts.length;

    // 30 אימונים
    if (workoutCount >= 30) {
      achievements[2].unlocked = true;
    }

    // 7 ימי רצף - בדיקה פשוטה
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentWorkouts = workouts.filter(
      (w: any) => new Date(w.date || w.completedAt) >= oneWeekAgo
    );

    if (recentWorkouts.length >= 5) {
      // אם יש לפחות 5 אימונים בשבוע
      achievements[1].unlocked = true;
    }

    // גיבור כושר - אם יש יותר מ-50 אימונים עם דירוג גבוה
    const highRatedWorkouts = workouts.filter(
      (w: any) => (w.feedback?.rating || w.rating || 0) >= 4
    );

    if (workoutCount >= 50 && highRatedWorkouts.length >= workoutCount * 0.8) {
      achievements[3].unlocked = true;
    }
  }

  return achievements;
};

// דמו הישגים מקוריים (גיבוי)
const ORIGINAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "מתחיל נלהב",
    icon: "star",
    color: "#FFD700",
    unlocked: true,
  },
  { id: 2, title: "7 ימי רצף", icon: "fire", color: "#FF6347", unlocked: true },
  {
    id: 3,
    title: "30 אימונים",
    icon: "medal",
    color: "#C0C0C0",
    unlocked: false,
  },
  {
    id: 4,
    title: "גיבור כושר",
    icon: "trophy",
    color: "#FFD700",
    unlocked: false,
  },
];

// דמו אווטארים (אימוג'ים)
const PRESET_AVATARS = [
  "💪",
  "🏃‍♂️",
  "🏋️‍♀️",
  "🤸‍♂️",
  "🏃‍♀️",
  "🧘‍♂️",
  "🧘‍♀️",
  "🚴‍♂️",
  "🚴‍♀️",
  "⛹️‍♂️",
  "⛹️‍♀️",
  "🏊‍♂️",
  "🏊‍♀️",
  "🥊",
  "🤺",
  "🏄‍♂️",
];

export default function ProfileScreen() {
  // נביגציה ומשתמש
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, updateUser, logout: userLogout } = useUserStore();

  // מצב מקומי
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "💪");
  const [refreshing, setRefreshing] = useState(false);

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // בדיקת השלמת השאלון
  const hasTrainingStage = hasCompletedTrainingStage(user?.questionnaire);
  const hasProfileStage = hasCompletedProfileStage(user?.questionnaire);
  const isQuestionnaireComplete = hasTrainingStage && hasProfileStage;

  // חישוב הישגים מהנתונים המדעיים
  const achievements = useMemo(() => calculateAchievements(user), [user]);

  useEffect(() => {
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, pulseAnim]);

  // עדכון avatar כאשר user משתנה
  useEffect(() => {
    if (user?.avatar && user.avatar !== selectedAvatar) {
      setSelectedAvatar(user.avatar);
    }
  }, [user?.avatar, selectedAvatar]);

  // רענון הנתונים
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    // עדכון selectedAvatar מ-user
    if (user?.avatar) {
      setSelectedAvatar(user.avatar);
    }

    // סימולציה של רענון נתונים - במציאות כאן נקרא לAPI
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, [user?.avatar]);

  // חישוב מידע נוסף מהשאלון
  const getUserInfo = () => {
    const questionnaire = (user?.questionnaire || {}) as Record<
      string,
      unknown
    >;

    return {
      age: (questionnaire.age as string) || "לא צוין",
      goal: (questionnaire.goal as string) || "לא צוין",
      experience: (questionnaire.experience as string) || "לא צוין",
      location:
        questionnaire.location === "home"
          ? "אימונים בבית"
          : questionnaire.location === "gym"
            ? "אימונים בחדר כושר"
            : "לא צוין",
      height: questionnaire.height ? `${questionnaire.height} ס"מ` : "לא צוין",
      weight: questionnaire.weight ? `${questionnaire.weight} ק"ג` : "לא צוין",
      diet: (questionnaire.diet_type as string) || "לא צוין",
    };
  };

  const userInfo = getUserInfo();

  // חישוב סטטיסטיקות מהנתונים המדעיים
  const stats = useMemo(() => {
    if (user?.activityHistory?.workouts) {
      const workouts = user.activityHistory.workouts;

      // חישוב רצף
      const now = new Date();
      let streak = 0;
      let checkDate = new Date(now);
      const sortedWorkouts = [...workouts].sort(
        (a, b) =>
          new Date(b.date || b.completedAt).getTime() -
          new Date(a.date || a.completedAt).getTime()
      );

      for (const workout of sortedWorkouts) {
        const workoutDate = new Date(workout.date || workout.completedAt);
        const diffDays = Math.floor(
          (checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays <= 2) {
          streak++;
          checkDate = workoutDate;
        } else {
          break;
        }
      }

      // חישוב זמן כולל (בשעות)
      const totalMinutes = workouts.reduce(
        (sum: number, w: any) => sum + (w.duration || 45),
        0
      );
      const totalHours = Math.floor(totalMinutes / 60);

      // חישוב רמה (כל 20 אימונים = רמה)
      const level = Math.floor(workouts.length / 20) + 1;
      const xp = workouts.length * 50; // 50 XP לכל אימון
      const nextLevelXp = level * 20 * 50;

      return {
        workouts: workouts.length,
        streak,
        totalTime: `${totalHours}h`,
        level,
        xp,
        nextLevelXp,
      };
    }

    // נתונים ברירת מחדל
    return {
      workouts: user?.trainingStats?.totalWorkouts || 0,
      streak: 0,
      totalTime: "0h",
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
    };
  }, [user]);

  const handleLogout = () => {
    Alert.alert("התנתקות", "האם אתה בטוח שברצונך להתנתק?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "התנתק",
        style: "destructive",
        onPress: () => {
          userLogout();
          navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        },
      },
    ]);
  };

  // בחר מהגלריה
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const newAvatar = result.assets[0].uri;
      setSelectedAvatar(newAvatar);
      updateUser({ avatar: newAvatar });
      setShowAvatarModal(false);
    }
  };

  // בחר מהמצלמה
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const newAvatar = result.assets[0].uri;
      setSelectedAvatar(newAvatar);
      updateUser({ avatar: newAvatar });
      setShowAvatarModal(false);
    }
  };

  // בחר אימוג'י
  const selectPresetAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    updateUser({ avatar });
    setShowAvatarModal(false);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.gradient}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-forward"
                size={28}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>הפרופיל שלי</Text>
            <View style={styles.headerRight}>
              {/* כפתור השלמת שאלון אם לא הושלם */}
              {!isQuestionnaireComplete && (
                <TouchableOpacity
                  style={styles.headerQuestionnaireButton}
                  onPress={() =>
                    navigation.navigate("Questionnaire", { stage: "training" })
                  }
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="clipboard-list"
                    size={20}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* כרטיס שאלון אם לא הושלם */}
          {!isQuestionnaireComplete && (
            <TouchableOpacity
              style={styles.questionnaireCard}
              onPress={() =>
                navigation.navigate("Questionnaire", { stage: "training" })
              }
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  theme.colors.primaryGradientStart,
                  theme.colors.primaryGradientEnd,
                ]}
                style={styles.questionnaireGradient}
              >
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={24}
                  color={theme.colors.white}
                />
                <View style={styles.questionnaireTextContainer}>
                  <Text style={styles.questionnaireTitle}>השלם את השאלון</Text>
                  <Text style={styles.questionnaireSubtitle}>
                    {!hasTrainingStage
                      ? "קבל תוכנית אימונים מותאמת אישית"
                      : "השלם את הפרופיל האישי שלך"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={theme.colors.white}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* כרטיס פרופיל */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(true)}
                style={styles.avatarContainer}
              >
                {typeof selectedAvatar === "string" &&
                selectedAvatar.startsWith("http") ? (
                  <Image
                    source={{ uri: selectedAvatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : selectedAvatar && selectedAvatar.length === 2 ? (
                  <View style={styles.emojiAvatar}>
                    <Text style={styles.emojiText}>{selectedAvatar}</Text>
                  </View>
                ) : (
                  <View style={styles.avatar}>
                    <DefaultAvatar name={user?.name || "משתמש"} size={90} />
                  </View>
                )}
                <Animated.View
                  style={[
                    styles.editAvatarButton,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={20}
                    color={theme.colors.text}
                  />
                </Animated.View>
              </TouchableOpacity>
              {/* רמה ו-XP */}
              <View style={styles.levelContainer}>
                <Text style={styles.levelText}>רמה {stats.level}</Text>
                <View style={styles.xpBar}>
                  <View
                    style={[
                      styles.xpProgress,
                      { width: `${(stats.xp / stats.nextLevelXp) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.xpText}>
                  {stats.xp}/{stats.nextLevelXp} XP
                </Text>
              </View>
            </View>
            <Text style={styles.username}>{user?.name || "אלוף הכושר"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "user@gymovoo.com"}
            </Text>
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <MaterialCommunityIcons
                  name="crown"
                  size={16}
                  color="#FFD700"
                />
                <Text style={styles.badgeText}>פרימיום</Text>
              </View>
              <View style={styles.badge}>
                <MaterialCommunityIcons name="fire" size={16} color="#FF6347" />
                <Text style={styles.badgeText}>{stats.streak} ימי רצף</Text>
              </View>
            </View>
          </View>

          {/* מידע אישי מהשאלון */}
          {isQuestionnaireComplete && (
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>המידע שלי</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="target"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>מטרה</Text>
                  <Text style={styles.infoValue}>{userInfo.goal}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>גיל</Text>
                  <Text style={styles.infoValue}>{userInfo.age}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="arm-flex"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>ניסיון</Text>
                  <Text style={styles.infoValue}>{userInfo.experience}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoLabel}>מיקום</Text>
                  <Text style={styles.infoValue}>{userInfo.location}</Text>
                </View>
                {userInfo.height !== "לא צוין" && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="human-male-height"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoLabel}>גובה</Text>
                    <Text style={styles.infoValue}>{userInfo.height}</Text>
                  </View>
                )}
                {userInfo.weight !== "לא צוין" && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="weight"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.infoLabel}>משקל</Text>
                    <Text style={styles.infoValue}>{userInfo.weight}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* סטטיסטיקות */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>הסטטיסטיקות שלי</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#4e9eff", "#3a7bc8"]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.statNumber}>{stats.workouts}</Text>
                  <Text style={styles.statLabel}>אימונים</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#ff6b6b", "#d84848"]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons name="fire" size={24} color="#fff" />
                  <Text style={styles.statNumber}>{stats.streak}</Text>
                  <Text style={styles.statLabel}>ימי רצף</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#00d9ff", "#00b8d4"]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.statNumber}>{stats.totalTime}</Text>
                  <Text style={styles.statLabel}>זמן כולל</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* ציוד זמין */}
          {user?.questionnaire && (
            <View style={styles.equipmentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>הציוד שלי</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Questionnaire", { stage: "training" })
                  }
                >
                  <Text style={styles.seeAllText}>ערוך</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.equipmentScroll}
                contentContainerStyle={styles.equipmentScrollContent}
              >
                {(() => {
                  // חילוץ הציוד מהשאלון - תמיכה בפורמטים שונים
                  const questionnaire: Record<string, string[]> =
                    user.questionnaire as Record<string, string[]>;

                  // ניסיון לחלץ ציוד בשני הפורמטים
                  let homeEquipment: string[] = [];
                  let gymEquipment: string[] = [];

                  // פורמט חדש עם מפתחות string
                  if (questionnaire?.home_equipment) {
                    homeEquipment = Array.isArray(questionnaire.home_equipment)
                      ? questionnaire.home_equipment
                      : [];
                  }
                  if (questionnaire?.gym_equipment) {
                    gymEquipment = Array.isArray(questionnaire.gym_equipment)
                      ? questionnaire.gym_equipment
                      : [];
                  }

                  // פורמט ישן עם מפתחות מספריים (נסיון לחילוץ מהשדות 10 ו-11)
                  if (homeEquipment.length === 0 && questionnaire[10]) {
                    homeEquipment = Array.isArray(questionnaire[10])
                      ? questionnaire[10]
                      : [];
                  }
                  if (gymEquipment.length === 0 && questionnaire[11]) {
                    gymEquipment = Array.isArray(questionnaire[11])
                      ? questionnaire[11]
                      : [];
                  }

                  const allEquipment = [
                    ...new Set([...homeEquipment, ...gymEquipment]),
                  ];

                  // דיבוג ציוד
                  console.log("🔧 ProfileScreen - ציוד נמצא:", {
                    homeEquipment,
                    gymEquipment,
                    allEquipment,
                    questionnaire,
                  });

                  if (allEquipment.length === 0) {
                    return (
                      <View style={styles.noEquipmentContainer}>
                        <MaterialCommunityIcons
                          name="dumbbell"
                          size={40}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.noEquipmentText}>לא נבחר ציוד</Text>
                        <Text style={styles.noEquipmentSubtext}>
                          השלם את השאלון לקבלת המלצות
                        </Text>
                      </View>
                    );
                  }

                  return allEquipment
                    .map((equipmentId: string) => {
                      const equipment = ALL_EQUIPMENT.find(
                        (eq) => eq.id === equipmentId
                      );
                      if (!equipment) return null;

                      return (
                        <View key={equipmentId} style={styles.equipmentItem}>
                          <View style={styles.equipmentImageContainer}>
                            {equipment.image ? (
                              <Image
                                source={equipment.image}
                                style={styles.equipmentImage}
                                resizeMode="contain"
                              />
                            ) : (
                              <MaterialCommunityIcons
                                name="dumbbell"
                                size={28}
                                color={theme.colors.primary}
                              />
                            )}
                            {equipment.isPremium && (
                              <View style={styles.equipmentPremiumBadge}>
                                <MaterialCommunityIcons
                                  name="crown"
                                  size={12}
                                  color={theme.colors.warning}
                                />
                              </View>
                            )}
                          </View>
                          <Text style={styles.equipmentLabel} numberOfLines={2}>
                            {equipment.label}
                          </Text>
                          <View style={styles.equipmentCategoryBadge}>
                            <Text style={styles.equipmentCategoryText}>
                              {equipment.category === "home"
                                ? "בית"
                                : equipment.category === "gym"
                                  ? "חדר כושר"
                                  : "שניהם"}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                    .filter(Boolean);
                })()}
              </ScrollView>
            </View>
          )}

          {/* הישגים */}
          <View style={styles.achievementsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ההישגים שלי</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>הצג הכל</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement: Achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementBadge,
                    !achievement.unlocked && styles.lockedBadge,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={achievement.icon}
                    size={30}
                    color={
                      achievement.unlocked
                        ? achievement.color
                        : theme.colors.textTertiary
                    }
                  />
                  <Text
                    style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.lockedText,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* הגדרות בסיסיות */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>הגדרות</Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() =>
                navigation.navigate("Questionnaire", { stage: "training" })
              }
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.settingText}>ערוך שאלון</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                // TODO: הוסף הגדרות התראות
                Alert.alert("בקרוב", "הגדרות התראות יהיו זמינות בקרוב");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.settingText}>התראות</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* כפתור התנתקות */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={theme.colors.error}
            />
            <Text style={styles.logoutText}>התנתק</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* מודל בחירת אווטאר */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAvatarModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>בחר אווטאר</Text>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={pickImageFromGallery}
              >
                <MaterialCommunityIcons
                  name="image"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.uploadOptionText}>מהגלריה</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                <MaterialCommunityIcons
                  name="camera"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.uploadOptionText}>צלם תמונה</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.presetsTitle}>או בחר אימוג&apos;י:</Text>
            <FlatList
              data={PRESET_AVATARS}
              numColumns={4}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.avatarGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.presetAvatar,
                    selectedAvatar === item && styles.selectedPreset,
                  ]}
                  onPress={() => selectPresetAvatar(item)}
                >
                  <Text style={styles.presetAvatarText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

// שים את ה־styles שלך כאן (אותו דבר כמו הדוגמה שלך)

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerQuestionnaireButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight + "20",
    borderRadius: 8,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  profileCard: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: 20,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  emojiAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryGradientStart + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  emojiText: {
    fontSize: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  levelContainer: {
    width: "100%",
    alignItems: "center",
  },
  levelText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  xpBar: {
    width: 200,
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  xpProgress: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  xpText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  username: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  badgesContainer: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
  },
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "500",
  },

  // שאלון
  questionnaireCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  questionnaireButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
  },
  questionnaireGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  questionnaireTextContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  questionnaireTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "right",
  },
  questionnaireSubtitle: {
    color: theme.colors.white,
    fontSize: 14,
    opacity: 0.9,
    textAlign: "right",
  },
  questionnaireButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // מידע אישי
  infoContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  infoGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  infoItem: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },

  // סטטיסטיקות
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  statGradient: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
  },

  // הישגים
  achievementsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  achievementsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  achievementBadge: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4,
    aspectRatio: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  lockedBadge: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 10,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 4,
  },
  lockedText: {
    color: theme.colors.textTertiary,
  },

  // הגדרות
  settingsContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  settingItem: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  settingLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  settingText: {
    fontSize: 16,
    color: theme.colors.text,
  },

  // התנתקות
  logoutButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.error + "15",
    marginHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: "600",
  },

  // סגנונות מודל
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xl + 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  uploadOptions: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: theme.spacing.xl,
  },
  uploadOption: {
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 16,
    width: "45%",
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  uploadOptionText: {
    color: theme.colors.text,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  presetsTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  avatarGrid: {
    alignItems: "center",
  },
  presetAvatar: {
    width: 70,
    height: 70,
    margin: 8,
    borderRadius: 35,
    backgroundColor: theme.colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPreset: {
    borderColor: theme.colors.primary,
  },
  presetAvatarText: {
    fontSize: 35,
  },

  // סגנונות ציוד
  equipmentContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: theme.spacing.md,
  },
  equipmentScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  equipmentScrollContent: {
    paddingRight: theme.spacing.lg,
  },
  noEquipmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  noEquipmentText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  noEquipmentSubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  equipmentItem: {
    alignItems: "center",
    marginLeft: theme.spacing.md,
    width: 80,
  },
  equipmentImageContainer: {
    position: "relative",
    width: 60,
    height: 60,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  equipmentImage: {
    width: 40,
    height: 40,
  },
  equipmentPremiumBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.warning,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  equipmentLabel: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: theme.spacing.xs,
    lineHeight: 16,
  },
  equipmentCategoryBadge: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  equipmentCategoryText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: "500",
    textAlign: "center",
  },
});
