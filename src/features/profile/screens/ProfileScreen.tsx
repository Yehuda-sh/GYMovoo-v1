/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../../../core/theme";
import { RootStackParamList } from "../../../navigation/types";
import BackButton from "../../../shared/components/common/BackButton";
import ConfirmationModal from "../../../shared/components/common/ConfirmationModal";
import AppButton from "../../../shared/components/common/AppButton";
import { useUserStore } from "../../../stores/userStore";
import { useQuestionnaireStatus } from "../../questionnaire/hooks";
import DefaultAvatar from "../../../shared/components/common/DefaultAvatar";
import { ALL_EQUIPMENT } from "../../../data/equipmentData";
import { User } from "../../../types";
import { userApi } from "../../../services/api/userApi";
import { PROFILE_SCREEN_TEXTS } from "../../../constants/profileScreenTexts";
import {
  calculateAchievements,
  type Achievement,
} from "../../../constants/achievementsConfig";

const PRESET_AVATARS = [
  "💪",
  "🏋️",
  "🏃",
  "🚴",
  "🤸",
  "🧘",
  "🥊",
  "⚽",
  "🏀",
  "🎾",
  "🏐",
  "🏓",
  "🏸",
  "🥅",
  "⛳",
  "🏹",
  "🎣",
  "🤾",
  "🏇",
  "🧗",
  "🏂",
  "🏄",
  "🚣",
  "🏊",
  "🤽",
  "🤿",
  "🛷",
  "🥌",
  "🛹",
  "🤺",
];

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout, updateUser } = useUserStore();
  const questionnaireStatus = useQuestionnaireStatus();
  const scrollRef = useRef<ScrollView>(null);

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    user?.avatar || null
  );
  const [editedName, setEditedName] = useState(user?.name || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Stats calculation - simplified
  const stats = {
    level: 5,
    workouts: 12,
    streak: Math.floor(Math.random() * 30) + 1,
    rating: 4.5,
    xp: 750,
    nextLevelXp: 1000,
  };

  // Achievements
  const achievements = calculateAchievements(user);

  // Equipment extraction - simplified
  const extractUserEquipment = (user: User | null) => {
    if (!user?.questionnaireData) return [];

    // Simplified equipment extraction
    return ALL_EQUIPMENT.slice(0, 3); // Show first 3 equipment items as example
  };

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigation.navigate("Welcome");
  };

  const selectPresetAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    updateUser({ avatar });
    setShowAvatarModal(false);
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedAvatar(result.assets[0].uri);
      updateUser({ avatar: result.assets[0].uri });
      setShowAvatarModal(false);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedAvatar(result.assets[0].uri);
      updateUser({ avatar: result.assets[0].uri });
      setShowAvatarModal(false);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setNameError("שם חובה");
      return;
    }

    if (editedName.length < 2) {
      setNameError("שם קצר מדי");
      return;
    }

    setLoading(true);
    try {
      await userApi.update(user?.id || "", { name: editedName.trim() });
      updateUser({ name: editedName.trim() });
      setShowNameModal(false);
      setNameError(null);
    } catch {
      setNameError("שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  };

  const canEditName = () => {
    return user?.name && user.name !== "אלוף הכושר";
  };

  const showComingSoon = (_feature: string) => {
    // Simple placeholder for coming soon features
  };

  // Profile badges
  const profileBadges = [
    {
      key: "level",
      text: `רמה ${stats.level}`,
      color: theme.colors.primary,
    },
    {
      key: "workouts",
      text: `${stats.workouts} אימונים`,
      color: theme.colors.success,
    },
    {
      key: "streak",
      text: `${stats.streak} ימי רצף`,
      color: theme.colors.warning,
    },
  ];

  const allEquipment = extractUserEquipment(user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <BackButton />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {PROFILE_SCREEN_TEXTS.HEADERS.PROFILE_TITLE}
          </Text>
          {!questionnaireStatus.isComplete && (
            <TouchableOpacity
              style={styles.headerQuestionnaireButton}
              onPress={() => showComingSoon("שאלון")}
            >
              <MaterialCommunityIcons
                name="clipboard-list"
                size={24}
                color={theme.colors.white}
              />
              <Text style={styles.questionnaireTitle}>
                {PROFILE_SCREEN_TEXTS.ACTIONS.COMPLETE_QUESTIONNAIRE}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setShowAvatarModal(true)}
          >
            {selectedAvatar && selectedAvatar.startsWith("http") ? (
              <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
            ) : selectedAvatar && selectedAvatar.length === 2 ? (
              <View style={styles.emojiAvatar}>
                <Text style={styles.emojiText}>{selectedAvatar}</Text>
              </View>
            ) : (
              <View style={styles.avatar}>
                <DefaultAvatar name={user?.name || "משתמש"} size={90} />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <MaterialCommunityIcons
                name="camera"
                size={20}
                color={theme.colors.text}
              />
            </View>
          </TouchableOpacity>

          {/* User Info */}
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{user?.name || "אלוף הכושר"}</Text>
            <TouchableOpacity
              style={styles.editNameButton}
              onPress={() => {
                if (canEditName()) {
                  setEditedName(user?.name || "");
                  setShowNameModal(true);
                }
              }}
              disabled={!canEditName()}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color={
                  canEditName()
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.userEmail}>
            {user?.email || "user@gymovoo.com"}
          </Text>

          {/* Level and XP */}
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

          {/* Badges */}
          <View style={styles.badgesContainer}>
            {profileBadges.map((badge) => (
              <View
                key={badge.key}
                style={[styles.badge, { backgroundColor: badge.color + "20" }]}
              >
                <Text style={[styles.badgeText, { color: badge.color }]}>
                  {badge.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            {PROFILE_SCREEN_TEXTS.HEADERS.MY_STATS}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.statNumber}>{stats.workouts}</Text>
              <Text style={styles.statLabel}>
                {PROFILE_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS}
              </Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="fire"
                size={24}
                color={theme.colors.warning}
              />
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>
                {PROFILE_SCREEN_TEXTS.STATS.STREAK_DAYS}
              </Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color={theme.colors.success}
              />
              <Text style={styles.statNumber}>{stats.rating}</Text>
              <Text style={styles.statLabel}>דירוג</Text>
            </View>
          </View>
        </View>

        {/* Equipment */}
        <View style={styles.equipmentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>הציוד שלי</Text>
            <TouchableOpacity onPress={() => showComingSoon("עריכת ציוד")}>
              <Text style={styles.editEquipmentText}>ערוך</Text>
            </TouchableOpacity>
          </View>
          {allEquipment.length === 0 ? (
            <View style={styles.noEquipmentContainer}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={40}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.noEquipmentText}>לא נבחר ציוד</Text>
              <Text style={styles.noEquipmentSubtext}>
                לחץ על 'ערוך' כדי לבחור ציוד
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {allEquipment.map((equipment) => (
                <View key={equipment?.id} style={styles.equipmentItem}>
                  <View style={styles.equipmentImageContainer}>
                    {equipment?.image ? (
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
                  </View>
                  <Text style={styles.equipmentLabel}>{equipment?.label}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>הישגים</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {achievements.slice(0, 6).map((achievement: Achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIconContainer}>
                  <MaterialCommunityIcons
                    name={achievement.icon}
                    size={24}
                    color={
                      achievement.unlocked
                        ? achievement.color
                        : theme.colors.textTertiary
                    }
                  />
                  {!achievement.unlocked && (
                    <View style={styles.lockIconContainer}>
                      <MaterialCommunityIcons
                        name="lock"
                        size={16}
                        color={theme.colors.textTertiary}
                      />
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => showComingSoon("הגדרות התראות")}
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

        {/* Logout */}
        <AppButton
          title={PROFILE_SCREEN_TEXTS.ACTIONS.LOGOUT}
          variant="danger"
          size="medium"
          icon="logout"
          iconPosition="left"
          onPress={handleLogout}
          style={styles.logoutButton}
          accessibilityLabel="התנתק מהמערכת"
          accessibilityHint="לחץ כדי להתנתק מהחשבון שלך"
        />
      </ScrollView>

      {/* Avatar Modal */}
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
          <View style={styles.avatarModalContent}>
            <Text style={styles.modalTitle}>בחר אווטאר</Text>
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

      {/* Name Edit Modal */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNameModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNameModal(false)}
        >
          <View style={styles.nameModalContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.modalTitle}>עריכת שם</Text>
              <TouchableOpacity
                onPress={() => setShowNameModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.nameEditContainer}>
              <Text style={styles.nameEditLabel}>שם מלא:</Text>
              <TextInput
                style={[styles.nameInput, nameError && styles.nameInputError]}
                value={editedName}
                onChangeText={(text) => {
                  setEditedName(text);
                  setNameError(null);
                }}
                placeholder="הכנס שם מלא..."
                placeholderTextColor={theme.colors.textSecondary}
                autoFocus
              />
              {nameError && (
                <Text style={styles.nameErrorText}>{nameError}</Text>
              )}
            </View>
            <View style={styles.nameModalButtons}>
              <TouchableOpacity
                style={[styles.nameModalButton, styles.nameModalButtonCancel]}
                onPress={() => setShowNameModal(false)}
              >
                <Text style={styles.nameModalButtonTextCancel}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.nameModalButton,
                  styles.nameModalButtonSave,
                  (loading || !editedName.trim()) &&
                    styles.nameModalButtonDisabled,
                ]}
                onPress={handleSaveName}
                disabled={loading || !editedName.trim()}
              >
                <Text style={styles.nameModalButtonTextSave}>
                  {loading ? "שומר..." : "שמור"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout Confirmation */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="התנתקות"
        message="האם אתה בטוח שברצונך להתנתק?"
        confirmText="התנתק"
        cancelText="ביטול"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        onClose={() => setShowLogoutModal(false)}
        variant="error"
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  headerQuestionnaireButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  questionnaireTitle: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  emojiAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 40,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  editNameButton: {
    padding: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  levelContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  xpBar: {
    width: "100%",
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  xpProgress: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  xpText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  equipmentSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  editEquipmentText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  noEquipmentContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  noEquipmentText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontWeight: "600",
  },
  noEquipmentSubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  equipmentItem: {
    alignItems: "center",
    marginRight: theme.spacing.md,
    width: 80,
  },
  equipmentImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  equipmentImage: {
    width: 40,
    height: 40,
  },
  equipmentLabel: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
  },
  achievementsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  achievementCard: {
    width: "30%",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    position: "relative",
  },
  achievementIconContainer: {
    position: "relative",
    marginBottom: theme.spacing.sm,
  },
  lockIconContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 2,
  },
  achievementTitle: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "600",
  },
  achievementTitleLocked: {
    color: theme.colors.textTertiary,
  },
  settingsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  settingText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  logoutButton: {
    marginHorizontal: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    maxHeight: "80%",
  },
  nameModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  uploadOptions: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    justifyContent: "center",
  },
  uploadOption: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  uploadOptionText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  avatarGrid: {
    gap: theme.spacing.sm,
  },
  presetAvatar: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing.xs,
  },
  selectedPreset: {
    backgroundColor: theme.colors.primary + "20",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  presetAvatarText: {
    fontSize: 24,
  },
  nameEditContainer: {
    marginBottom: theme.spacing.lg,
  },
  nameEditLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  nameInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "right",
  },
  nameInputError: {
    borderColor: theme.colors.error,
  },
  nameErrorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
    textAlign: "right",
  },
  nameModalButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  nameModalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  nameModalButtonCancel: {
    backgroundColor: theme.colors.surface,
  },
  nameModalButtonSave: {
    backgroundColor: theme.colors.primary,
  },
  nameModalButtonDisabled: {
    opacity: 0.5,
  },
  nameModalButtonTextCancel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  nameModalButtonTextSave: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
