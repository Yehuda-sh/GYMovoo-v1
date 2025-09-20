import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";
import { isRTL } from "../../utils/rtlHelpers";

// Achievement categories and data
const ACHIEVEMENT_CATEGORIES = [
  { id: "workout", name: "אימונים", icon: "dumbbell" },
  { id: "consistency", name: "עקביות", icon: "calendar-check" },
  { id: "strength", name: "כוח", icon: "arm-flex" },
  { id: "endurance", name: "סיבולת", icon: "heart-pulse" },
  { id: "milestone", name: "אבני דרך", icon: "trophy" },
];

interface Achievement {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  progress: number;
  target: number;
}

// Mock achievements data with Hebrew content
const ACHIEVEMENTS_DATA: Achievement[] = [
  // Workout achievements
  {
    id: "first_workout",
    category: "workout",
    title: "האימון הראשון",
    description: "השלם את האימון הראשון שלך",
    icon: "play-circle",
    points: 10,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
    requirement: "השלם אימון אחד",
    progress: 1,
    target: 1,
  },
  {
    id: "workout_streak_3",
    category: "consistency",
    title: "רצף של 3",
    description: "השלם 3 אימונים ברצף",
    icon: "fire",
    points: 25,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 3),
    requirement: "3 אימונים ברצף",
    progress: 3,
    target: 3,
  },
  {
    id: "workout_10",
    category: "workout",
    title: "מתאמן מנוסה",
    description: "השלם 10 אימונים",
    icon: "medal",
    points: 50,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 1),
    requirement: "10 אימונים",
    progress: 10,
    target: 10,
  },
  {
    id: "strength_master",
    category: "strength",
    title: "מאסטר כוח",
    description: "הרם משקל כבד במיוחד",
    icon: "weight-lifter",
    points: 100,
    unlocked: false,
    requirement: 'הרמה של 100 ק"ג',
    progress: 75,
    target: 100,
  },
  {
    id: "endurance_hero",
    category: "endurance",
    title: "גיבור סיבולת",
    description: "רוץ 10 קילומטר ברצף",
    icon: "run",
    points: 75,
    unlocked: false,
    requirement: 'ריצה של 10 ק"מ',
    progress: 6.5,
    target: 10,
  },
  {
    id: "month_warrior",
    category: "milestone",
    title: "לוחם החודש",
    description: "התאמן כל יום במשך חודש",
    icon: "crown",
    points: 200,
    unlocked: false,
    requirement: "30 אימונים ברצף",
    progress: 18,
    target: 30,
  },
  {
    id: "early_bird",
    category: "consistency",
    title: "הציפור המוקדמת",
    description: "התאמן 5 פעמים לפני 7:00",
    icon: "weather-sunset-up",
    points: 30,
    unlocked: false,
    requirement: "5 אימונים לפני 7:00",
    progress: 2,
    target: 5,
  },
  {
    id: "weekend_warrior",
    category: "consistency",
    title: "לוחם סוף השבוע",
    description: "התאמן בכל סוף שבוע למשך חודש",
    icon: "calendar-weekend",
    points: 40,
    unlocked: false,
    requirement: "8 אימוני סוף שבוע",
    progress: 5,
    target: 8,
  },
] as const;

interface AchievementSystemProps {
  visible: boolean;
  onClose: () => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  visible,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      animatedValue.setValue(0);
    }
  }, [visible, animatedValue]);

  const filteredAchievements =
    selectedCategory === "all"
      ? ACHIEVEMENTS_DATA
      : ACHIEVEMENTS_DATA.filter(
          (achievement) => achievement.category === selectedCategory
        );

  const unlockedCount = ACHIEVEMENTS_DATA.filter((a) => a.unlocked).length;
  const totalPoints = ACHIEVEMENTS_DATA.filter((a) => a.unlocked).reduce(
    (sum, a) => sum + a.points,
    0
  );

  const renderCategoryButton = (category: {
    id: string;
    name: string;
    icon: string;
  }) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <MaterialCommunityIcons
        name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={20}
        color={
          selectedCategory === category.id
            ? theme.colors.primary
            : theme.colors.textSecondary
        }
      />
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category.id && styles.categoryButtonTextActive,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderAchievementCard = (achievement: Achievement) => {
    const progressPercentage = Math.min(
      (achievement.progress / achievement.target) * 100,
      100
    );

    return (
      <TouchableOpacity
        key={achievement.id}
        style={[
          styles.achievementCard,
          achievement.unlocked && styles.achievementCardUnlocked,
        ]}
        onPress={() => setSelectedAchievement(achievement)}
      >
        <View style={styles.achievementHeader}>
          <View
            style={[
              styles.achievementIcon,
              achievement.unlocked && styles.achievementIconUnlocked,
            ]}
          >
            <MaterialCommunityIcons
              name={
                achievement.icon as keyof typeof MaterialCommunityIcons.glyphMap
              }
              size={24}
              color={
                achievement.unlocked
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
          </View>

          <View style={styles.achievementInfo}>
            <Text
              style={[
                styles.achievementTitle,
                achievement.unlocked && styles.achievementTitleUnlocked,
              ]}
            >
              {achievement.title}
            </Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
          </View>

          <View style={styles.achievementReward}>
            <Text style={styles.pointsText}>{achievement.points}</Text>
            <MaterialCommunityIcons
              name="star"
              size={16}
              color={theme.colors.warning}
            />
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress}/{achievement.target}
          </Text>
        </View>

        {achievement.unlocked && achievement.unlockedAt && (
          <Text style={styles.unlockedDate}>
            נפתח ב-{achievement.unlockedAt.toLocaleDateString("he-IL")}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderAchievementDetail = () => {
    if (!selectedAchievement) return null;

    return (
      <Modal
        visible={!!selectedAchievement}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAchievement(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.achievementDetailModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedAchievement(null)}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.detailIcon,
                selectedAchievement.unlocked && styles.detailIconUnlocked,
              ]}
            >
              <MaterialCommunityIcons
                name={
                  selectedAchievement.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={48}
                color={
                  selectedAchievement.unlocked
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </View>

            <Text style={styles.detailTitle}>{selectedAchievement.title}</Text>

            <Text style={styles.detailDescription}>
              {selectedAchievement.description}
            </Text>

            <View style={styles.detailRequirement}>
              <Text style={styles.requirementLabel}>דרישה:</Text>
              <Text style={styles.requirementText}>
                {selectedAchievement.requirement}
              </Text>
            </View>

            <View style={styles.detailProgress}>
              <Text style={styles.progressLabel}>התקדמות:</Text>
              <View style={styles.progressBarLarge}>
                <View
                  style={[
                    styles.progressFillLarge,
                    {
                      width: `${Math.min(
                        (selectedAchievement.progress /
                          selectedAchievement.target) *
                          100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressTextLarge}>
                {selectedAchievement.progress}/{selectedAchievement.target}
              </Text>
            </View>

            <View style={styles.detailReward}>
              <MaterialCommunityIcons
                name="star"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.rewardText}>
                {selectedAchievement.points} נקודות
              </Text>
            </View>

            {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
              <Text style={styles.detailUnlockedDate}>
                הושג ב-
                {selectedAchievement.unlockedAt.toLocaleDateString("he-IL")}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <MaterialCommunityIcons
              name={isRTL() ? "arrow-left" : "arrow-right"}
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>הישגים</Text>

          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{unlockedCount}</Text>
              <Text style={styles.statLabel}>הושגו</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalPoints}</Text>
              <Text style={styles.statLabel}>נקודות</Text>
            </View>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === "all" && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory("all")}
          >
            <MaterialCommunityIcons
              name="view-grid"
              size={20}
              color={
                selectedCategory === "all"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === "all" && styles.categoryButtonTextActive,
              ]}
            >
              הכל
            </Text>
          </TouchableOpacity>

          {ACHIEVEMENT_CATEGORIES.map(renderCategoryButton)}
        </ScrollView>

        {/* Achievements List */}
        <ScrollView
          style={styles.achievementsList}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: animatedValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
          >
            {filteredAchievements.map(renderAchievementCard)}
          </Animated.View>
        </ScrollView>

        {renderAchievementDetail()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  headerStats: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: theme.spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  categoriesContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoriesContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    gap: theme.spacing.xs,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary + "20",
  },
  categoryButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: theme.colors.primary,
  },
  achievementsList: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  achievementCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    opacity: 0.7,
  },
  achievementCardUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: theme.colors.primary + "20",
  },
  achievementHeader: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: isRTL() ? 0 : theme.spacing.md,
    marginRight: isRTL() ? theme.spacing.md : 0,
  },
  achievementIconUnlocked: {
    backgroundColor: theme.colors.primary + "20",
  },
  achievementInfo: {
    flex: 1,
    alignItems: isRTL() ? "flex-end" : "flex-start",
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: isRTL() ? "right" : "left",
  },
  achievementTitleUnlocked: {
    color: theme.colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: isRTL() ? "right" : "left",
  },
  achievementReward: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.warning,
  },
  progressContainer: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    minWidth: 40,
    textAlign: "center",
  },
  unlockedDate: {
    fontSize: 12,
    color: theme.colors.success,
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  achievementDetailModal: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing.lg,
    right: isRTL() ? undefined : theme.spacing.lg,
    left: isRTL() ? theme.spacing.lg : undefined,
    zIndex: 1,
  },
  detailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  detailIconUnlocked: {
    backgroundColor: theme.colors.primary + "20",
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  detailDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  detailRequirement: {
    alignSelf: "stretch",
    marginBottom: theme.spacing.lg,
    alignItems: isRTL() ? "flex-end" : "flex-start",
  },
  requirementLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: isRTL() ? "right" : "left",
  },
  requirementText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: isRTL() ? "right" : "left",
  },
  detailProgress: {
    alignSelf: "stretch",
    marginBottom: theme.spacing.lg,
    alignItems: isRTL() ? "flex-end" : "flex-start",
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: isRTL() ? "right" : "left",
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: theme.spacing.sm,
  },
  progressFillLarge: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
  progressTextLarge: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  detailReward: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.warning,
  },
  detailUnlockedDate: {
    fontSize: 14,
    color: theme.colors.success,
    fontStyle: "italic",
  },
});

export default AchievementSystem;
