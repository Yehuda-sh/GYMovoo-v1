/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileInfoTab.tsx
 * @description כרטיסיית המידע האישי - הפרדת UI מהמסך הראשי
 *
 * השאלות שהובילו ליצירת הקומפוננט הזה:
 * - "למה הפונקציה הזאת כל כך מורכבת?" - כל ה-UI היה במסך אחד
 * - "אפשר לעשות את זה בשורה אחת?" - פישוט תצוגת המידע האישי
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL, wrapBidi } from "../../../../../utils/rtlHelpers";

import DefaultAvatar from "../../../../../components/common/DefaultAvatar";
import AppButton from "../../../../../components/common/AppButton";

import type { User } from "../../../../../core/types";
import type { ProfileStats, ProfileBadge } from "../hooks/useProfileData";

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
];

interface Props {
  user: User | null;
  stats: ProfileStats;
  profileBadges: ProfileBadge[];
  hasQuestionnaireData: boolean;
  canEditName: () => boolean;
  onUpdateUser: (updates: Partial<User>) => Promise<void>;
  onNavigateToPersonalInfo: () => void;
}

export const ProfileInfoTab: React.FC<Props> = ({
  user,
  stats,
  profileBadges,
  hasQuestionnaireData,
  canEditName,
  onUpdateUser,
  onNavigateToPersonalInfo,
}) => {
  // Modal states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    user?.avatar || null
  );
  const [editedName, setEditedName] = useState(user?.name || "");
  const [nameError, setNameError] = useState<string | null>(null);

  const handleAvatarSave = async () => {
    if (selectedAvatar) {
      await onUpdateUser({ avatar: selectedAvatar });
    }
    setShowAvatarModal(false);
  };

  const handleNameSave = async () => {
    if (!editedName.trim()) {
      setNameError("שם לא יכול להיות ריק");
      return;
    }

    if (editedName.length < 2) {
      setNameError("שם חייב להכיל לפחות 2 תווים");
      return;
    }

    await onUpdateUser({ name: editedName.trim() });
    setShowNameModal(false);
    setNameError(null);
  };

  const totalWorkouts = user?.trainingStats?.totalWorkouts || 0;
  const currentStreak = user?.trainingStats?.currentStreak || 0;

  return (
    <View>
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
            <DefaultAvatar size={90} />
          )}
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => setShowAvatarModal(true)}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Name */}
        <TouchableOpacity
          onPress={() => canEditName() && setShowNameModal(true)}
          disabled={!canEditName()}
        >
          <Text style={styles.userName}>
            {wrapBidi(user?.name || "אלוף הכושר")}
          </Text>
          {canEditName() && (
            <MaterialCommunityIcons
              name="pencil"
              size={16}
              color={theme.colors.primary}
              style={styles.editNameIcon}
            />
          )}
        </TouchableOpacity>

        {user?.email && (
          <Text style={styles.userEmail}>{wrapBidi(user.email)}</Text>
        )}

        {/* Level and XP */}
        {totalWorkouts > 0 && (
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>
              {wrapBidi(`רמה ${stats.level}`)}
            </Text>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpProgress,
                  { width: `${(stats.xp / stats.nextLevelXp) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {wrapBidi(`${stats.xp}/${stats.nextLevelXp} XP`)}
            </Text>
          </View>
        )}

        {/* Badges */}
        {(totalWorkouts > 0 || currentStreak > 0) && (
          <View style={styles.badgesContainer}>
            {profileBadges
              .filter((badge) => {
                if (badge.key === "workouts") return totalWorkouts > 0;
                if (badge.key === "streak") return currentStreak > 0;
                return true;
              })
              .map((badge) => (
                <View
                  key={badge.key}
                  style={[styles.badge, { borderColor: badge.color }]}
                >
                  <Text style={[styles.badgeText, { color: badge.color }]}>
                    {wrapBidi(badge.text)}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </View>

      {/* Personal Info Button */}
      {hasQuestionnaireData && (
        <View style={styles.personalInfoSection}>
          <TouchableOpacity
            style={styles.personalInfoButton}
            onPress={onNavigateToPersonalInfo}
          >
            <MaterialCommunityIcons
              name="account-details"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.personalInfoButtonText}>מידע אישי מתקדם</Text>
            <MaterialCommunityIcons
              name={isRTL() ? "chevron-left" : "chevron-right"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}

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
            <FlatList
              data={PRESET_AVATARS}
              numColumns={5}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.presetAvatar,
                    selectedAvatar === item && styles.selectedPresetAvatar,
                  ]}
                  onPress={() => setSelectedAvatar(item)}
                >
                  <Text style={styles.presetAvatarText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtons}>
              <AppButton
                title="ביטול"
                variant="secondary"
                onPress={() => setShowAvatarModal(false)}
                style={{ flex: 1 }}
              />
              <AppButton
                title="שמור"
                onPress={handleAvatarSave}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Name Modal */}
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
            <Text style={styles.modalTitle}>עריכת שם</Text>
            <TextInput
              style={[styles.nameInput, nameError && styles.nameInputError]}
              value={editedName}
              onChangeText={(text) => {
                setEditedName(text);
                setNameError(null);
              }}
              placeholder="הכנס שם חדש"
              textAlign={isRTL() ? "right" : "left"}
            />
            {nameError && <Text style={styles.errorText}>{nameError}</Text>}
            <View style={styles.modalButtons}>
              <AppButton
                title="ביטול"
                variant="secondary"
                onPress={() => setShowNameModal(false)}
                style={{ flex: 1 }}
              />
              <AppButton
                title="שמור"
                onPress={handleNameSave}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    end: isRTL() ? undefined : -5,
    start: isRTL() ? -5 : undefined,
    backgroundColor: theme.colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  editNameIcon: {
    alignSelf: "center",
    marginTop: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  levelContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  xpBar: {
    width: 200,
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
  },
  xpProgress: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  personalInfoSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  personalInfoButton: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  personalInfoButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    flex: 1,
    textAlign: isRTL() ? "right" : "left",
    marginHorizontal: theme.spacing.md,
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
    marginBottom: theme.spacing.lg,
  },
  presetAvatar: {
    width: 50,
    height: 50,
    margin: theme.spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
  },
  selectedPresetAvatar: {
    backgroundColor: theme.colors.primary + "20",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  presetAvatarText: {
    fontSize: 24,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
  },
  nameInputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  modalButtons: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
});
