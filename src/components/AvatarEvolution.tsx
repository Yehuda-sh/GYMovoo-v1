/**
 * @file src/components/AvatarEvolution.tsx
 * @description מערכת אווטאר מתפתח גיימיפיקציה באפליקציית GYMovoo
 *
 * @features
 * - אווטאר שמתפתח לפי כמות אימונים וביצועים
 * - שלבי התפתחות: Seedling → Sprout → Tree → Mighty Tree → Ancient Oak
 * - מערכת נקודות ורמות עם הישגים
 * - אנימציות חלקות וחוויה מקסימה
 * - נגישות מלאה ותמיכה ב-RTL
 * - אפקטים חזותיים לעליית רמה
 *
 * @gamification_logic
 * Level 1 (0-4 workouts): 🌱 Seedling - זרע קטן
 * Level 2 (5-14 workouts): 🌿 Sprout - נביטה
 * Level 3 (15-29 workouts): 🌳 Tree - עץ
 * Level 4 (30-59 workouts): 🌲 Mighty Tree - עץ חזק
 * Level 5 (60+ workouts): 🌳🏆 Ancient Oak - אלון עתיק
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../styles/theme";
import { logger } from "../utils/logger";

// Constants for point calculation
const POINTS_CALCULATION = {
  PER_WORKOUT: 10,
  PER_STREAK_DAY: 5,
} as const;

// Avatar evolution thresholds
const LEVEL_THRESHOLDS = {
  SPROUT: 5,
  YOUNG_TREE: 15,
  MIGHTY_TREE: 30,
  ANCIENT_OAK: 60,
} as const;

const { width: screenWidth } = Dimensions.get("window");

// Interfaces
interface AvatarLevel {
  level: number;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  gradientColors: [string, string];
  minWorkouts: number;
  maxWorkouts: number | null;
  description: string;
}

interface AvatarEvolutionProps {
  /** מספר אימונים שהושלמו */
  workoutCount: number;
  /** מספר ימים רצופים */
  streakDays: number;
  /** האם להציג מידע מפורט */
  showDetails?: boolean;
  /** גודל האוואטר */
  size?: "small" | "medium" | "large";
  /** פונקציה שנקראת בלחיצה על האוואטר */
  onPress?: () => void;
  /** האם להציג אנימציית עלייה ברמה */
  showLevelUpAnimation?: boolean;
  /** פונקציה שנקראת בסיום אנימציית עלייה ברמה */
  onLevelUpAnimationComplete?: () => void;
}

interface UserStats {
  level: number;
  progress: number; // 0-100 אחוז לרמה הבאה
  pointsEarned: number;
  pointsToNext: number;
  totalPoints: number;
}

// Avatar levels configuration
const AVATAR_LEVELS: AvatarLevel[] = [
  {
    level: 1,
    name: "זרע קטן",
    nameEn: "Seedling",
    icon: "seed-outline",
    color: "#8B4513",
    gradientColors: ["#DEB887", "#8B4513"] as [string, string],
    minWorkouts: 0,
    maxWorkouts: 4,
    description: "התחלת המסע הבריאותי שלך! כל זרע הופך לעץ גדול",
  },
  {
    level: 2,
    name: "נביטה",
    nameEn: "Sprout",
    icon: "sprout-outline",
    color: "#9ACD32",
    gradientColors: ["#98FB98", "#9ACD32"] as [string, string],
    minWorkouts: LEVEL_THRESHOLDS.SPROUT,
    maxWorkouts: LEVEL_THRESHOLDS.YOUNG_TREE - 1,
    description: "נביטה ראשונה! אתה מתחיל לראות התקדמות",
  },
  {
    level: 3,
    name: "עץ צעיר",
    nameEn: "Young Tree",
    icon: "tree-outline",
    color: "#228B22",
    gradientColors: ["#90EE90", "#228B22"] as [string, string],
    minWorkouts: LEVEL_THRESHOLDS.YOUNG_TREE,
    maxWorkouts: LEVEL_THRESHOLDS.MIGHTY_TREE - 1,
    description: "עץ צעיר וחזק! אתה בונה הרגלים בריאים",
  },
  {
    level: 4,
    name: "עץ חזק",
    nameEn: "Mighty Tree",
    icon: "pine-tree",
    color: "#006400",
    gradientColors: ["#32CD32", "#006400"] as [string, string],
    minWorkouts: LEVEL_THRESHOLDS.MIGHTY_TREE,
    maxWorkouts: LEVEL_THRESHOLDS.ANCIENT_OAK - 1,
    description: "עץ חזק ויציב! אתה מתמיד במצוינות",
  },
  {
    level: 5,
    name: "אלון עתיק",
    nameEn: "Ancient Oak",
    icon: "pine-tree",
    color: "#FFD700",
    gradientColors: ["#FFA500", "#FFD700"] as [string, string],
    minWorkouts: LEVEL_THRESHOLDS.ANCIENT_OAK,
    maxWorkouts: null,
    description: "אלון עתיק ומפואר! אתה אלוף האימונים שלנו! 🏆",
  },
];

const AvatarEvolution: React.FC<AvatarEvolutionProps> = ({
  workoutCount,
  streakDays,
  showDetails = false,
  size = "medium",
  onPress,
  showLevelUpAnimation = false,
  onLevelUpAnimationComplete,
}) => {
  // Animation values
  const scaleValue = useMemo(() => new Animated.Value(1), []);
  const rotateValue = useMemo(() => new Animated.Value(0), []);
  const glowValue = useMemo(() => new Animated.Value(0), []);

  // State
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate current level and stats
  // מחושב מחדש רק כאשר workoutCount או streakDays משתנים
  const { currentLevel, userStats } = useMemo(() => {
    let level: AvatarLevel = AVATAR_LEVELS[0]!; // ביטוח שהמערך לא ריק

    // מצא את הרמה הנוכחית
    for (const levelConfig of AVATAR_LEVELS) {
      if (
        workoutCount >= levelConfig.minWorkouts &&
        (levelConfig.maxWorkouts === null ||
          workoutCount <= levelConfig.maxWorkouts)
      ) {
        level = levelConfig;
        break;
      }
    }

    // חישוב התקדמות לרמה הבאה
    const nextLevel = AVATAR_LEVELS.find((l) => l.level === level.level + 1);
    let progress = 100; // אם זו הרמה הגבוהה ביותר
    let pointsToNext = 0;

    if (nextLevel && level) {
      const workoutsInCurrentLevel = workoutCount - level.minWorkouts;
      const workoutsNeededForNextLevel =
        nextLevel.minWorkouts - level.minWorkouts;
      progress = Math.min(
        100,
        (workoutsInCurrentLevel / workoutsNeededForNextLevel) * 100
      );
      pointsToNext = nextLevel.minWorkouts - workoutCount;
    }

    const totalPoints =
      workoutCount * POINTS_CALCULATION.PER_WORKOUT +
      streakDays * POINTS_CALCULATION.PER_STREAK_DAY;

    const stats: UserStats = {
      level: level.level,
      progress,
      pointsEarned: totalPoints,
      pointsToNext,
      totalPoints,
    };

    return { currentLevel: level, userStats: stats };
  }, [workoutCount, streakDays]);

  // Level up animation
  useEffect(() => {
    if (showLevelUpAnimation && !isAnimating) {
      setIsAnimating(true);

      // Animation sequence
      Animated.sequence([
        // Scale up
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        // Rotate and glow
        Animated.parallel([
          Animated.timing(rotateValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
        // Scale back
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset animation values
        scaleValue.setValue(1);
        rotateValue.setValue(0);
        glowValue.setValue(0);
        setIsAnimating(false);
        onLevelUpAnimationComplete?.();
      });
    }
  }, [
    showLevelUpAnimation,
    isAnimating,
    scaleValue,
    rotateValue,
    glowValue,
    onLevelUpAnimationComplete,
  ]);

  // Size configurations
  const sizeConfig = useMemo(() => {
    switch (size) {
      case "small":
        return { containerSize: 60, iconSize: 30, textSize: 12 };
      case "large":
        return { containerSize: 120, iconSize: 60, textSize: 18 };
      default:
        return { containerSize: 80, iconSize: 40, textSize: 14 };
    }
  }, [size]);

  // Handle press
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else if (showDetails) {
      setShowModal(true);
    }
  }, [onPress, showDetails]);

  // Animated rotation
  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Glow effect
  const glowInterpolation = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  logger.debug("AvatarEvolution", "Rendered avatar", {
    workoutCount,
    currentLevel: currentLevel.level,
    progress: userStats.progress,
  });

  return (
    <>
      <Pressable
        style={[
          styles.container,
          { width: sizeConfig.containerSize, height: sizeConfig.containerSize },
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`אווטאר רמה ${currentLevel.level}: ${currentLevel.name}`}
        accessibilityHint={showDetails ? "לחץ לפרטים נוספים" : undefined}
      >
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              transform: [
                { scale: scaleValue },
                { rotate: rotateInterpolation },
              ],
              shadowRadius: glowInterpolation,
              shadowColor: currentLevel.color,
            },
          ]}
        >
          <LinearGradient
            colors={currentLevel.gradientColors}
            style={[
              styles.avatarBackground,
              {
                width: sizeConfig.containerSize,
                height: sizeConfig.containerSize,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons
              name={
                currentLevel.icon as keyof typeof MaterialCommunityIcons.glyphMap
              }
              size={sizeConfig.iconSize}
              color={theme.colors.white}
            />
          </LinearGradient>
        </Animated.View>

        {size !== "small" && (
          <View style={styles.levelBadge}>
            <Text style={[styles.levelText, { fontSize: sizeConfig.textSize }]}>
              {currentLevel.level}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Details Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>האוואטר שלך</Text>

            {/* Large Avatar */}
            <View style={styles.modalAvatar}>
              <LinearGradient
                colors={currentLevel.gradientColors}
                style={styles.modalAvatarBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons
                  name={
                    currentLevel.icon as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={80}
                  color={theme.colors.white}
                />
              </LinearGradient>
            </View>

            {/* Level Info */}
            <Text style={styles.modalLevelTitle}>
              רמה {currentLevel.level}: {currentLevel.name}
            </Text>
            <Text style={styles.modalDescription}>
              {currentLevel.description}
            </Text>

            {/* Progress */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>התקדמות לרמה הבאה</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${userStats.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {userStats.progress.toFixed(0)}%
              </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>{workoutCount}</Text>
                <Text style={styles.statLabel}>אימונים</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="fire"
                  size={20}
                  color={theme.colors.warning}
                />
                <Text style={styles.statValue}>{streakDays}</Text>
                <Text style={styles.statLabel}>ימים רצופים</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="star"
                  size={20}
                  color={theme.colors.success}
                />
                <Text style={styles.statValue}>{userStats.totalPoints}</Text>
                <Text style={styles.statLabel}>נקודות</Text>
              </View>
            </View>

            {/* Close Button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
              accessibilityRole="button"
              accessibilityLabel="סגור"
            >
              <Text style={styles.closeButtonText}>סגור</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarContainer: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  avatarBackground: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  levelBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  levelText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    maxWidth: screenWidth * 0.9,
    width: "100%",
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  modalAvatar: {
    marginBottom: theme.spacing.lg,
  },
  modalAvatarBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: theme.colors.white,
  },
  modalLevelTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  modalDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    writingDirection: "rtl",
  },
  progressContainer: {
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  progressLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
    minWidth: 120,
  },
  closeButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
    textAlign: "center",
  },
});

export default AvatarEvolution;
