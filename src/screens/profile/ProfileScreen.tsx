/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש משודרג - כולל בחירת אווטאר, הישגים, התקדמות ועוד
 * @dependencies userStore (Zustand), DefaultAvatar, ImagePicker
 * @notes כולל אנימציות, מודלים ותכונות מתקדמות
 */

import React, { useRef, useEffect, useState } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";
import * as ImagePicker from "expo-image-picker";
// ייבוא הפונקציות החסרות
import {
  hasCompletedTrainingStage,
  hasCompletedProfileStage,
} from "../../data/twoStageQuestionnaireData";

const { width: screenWidth } = Dimensions.get("window");

// אווטארים מוכנים לבחירה
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

// הישגים לדוגמה
const ACHIEVEMENTS = [
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

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "💪");

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // אנימציית כניסה
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

    // אנימציית פעימה לכפתור העלאת תמונה
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
  }, []);

  const handleLogout = () => {
    Alert.alert("התנתקות", "האם אתה בטוח שברצונך להתנתק?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "התנתק",
        style: "destructive",
        onPress: () => {
          useUserStore.getState().logout();
          navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        },
      },
    ]);
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      // שמירת התמונה
      console.log("תמונה נבחרה:", result.assets[0].uri);
      setShowAvatarModal(false);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      // שמירת התמונה
      console.log("תמונה צולמה:", result.assets[0].uri);
      setShowAvatarModal(false);
    }
  };

  const selectPresetAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    // שמירה ב-store
    setShowAvatarModal(false);
  };

  // סטטיסטיקות משתמש
  const stats = {
    workouts: 48,
    streak: 12,
    totalTime: "36h",
    level: 5,
    xp: 2450,
    nextLevelXp: 3000,
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
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
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

            <TouchableOpacity
              style={styles.settingsButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* כרטיס פרופיל משודרג */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(true)}
                style={styles.avatarContainer}
              >
                {typeof selectedAvatar === "string" &&
                selectedAvatar.length <= 2 ? (
                  <View style={styles.emojiAvatar}>
                    <Text style={styles.emojiText}>{selectedAvatar}</Text>
                  </View>
                ) : user?.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <DefaultAvatar name={user?.name ?? "משתמש"} size={100} />
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
            <Text style={styles.userEmail}>{user?.email}</Text>

            {/* תגי סטטוס */}
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

          {/* כפתור השלמת/עריכת שאלון */}
          <TouchableOpacity
            style={styles.questionnaireButton}
            onPress={() => {
              const stage = hasCompletedTrainingStage(user?.questionnaire)
                ? hasCompletedProfileStage(user?.questionnaire)
                  ? null
                  : "profile"
                : "training";
              if (stage) {
                navigation.navigate("Questionnaire", { stage });
              }
            }}
          >
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart,
                theme.colors.primaryGradientEnd,
              ]}
              style={styles.questionnaireGradient}
            >
              <MaterialCommunityIcons
                name="clipboard-text"
                size={20}
                color={theme.colors.white}
              />
              <Text style={styles.questionnaireButtonText}>
                {hasCompletedTrainingStage(user?.questionnaire)
                  ? hasCompletedProfileStage(user?.questionnaire)
                    ? "עדכן פרטים אישיים"
                    : "השלם פרופיל אישי"
                  : "השלם שאלון אימונים"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

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

          {/* הישגים */}
          <View style={styles.achievementsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ההישגים שלי</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>הצג הכל</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.achievementsGrid}>
              {ACHIEVEMENTS.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementBadge,
                    !achievement.unlocked && styles.lockedBadge,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={achievement.icon as any}
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

          {/* הגדרות נוספות */}
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text style={styles.settingText}>התראות</Text>
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text style={styles.settingText}>פרטיות ואבטחה</Text>
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text style={styles.settingText}>עזרה ותמיכה</Text>
              </View>
              <Ionicons
                name="chevron-back"
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

            <Text style={styles.presetsTitle}>או בחר אימוג'י:</Text>
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
  questionnaireButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
  },
  questionnaireGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  questionnaireButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
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
});
