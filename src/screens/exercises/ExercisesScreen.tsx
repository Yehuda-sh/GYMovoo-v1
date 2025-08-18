/**
 * @file src/screens/exercises/ExercisesScreen.tsx
 * @brief מסך תרגילים - סקירה כללית של כל התרגילים במערכת
 * @dependencies React Native, MaterialCommunityIcons, ExerciseListScreen
 * @notes מסך ראשי לגישה לכל התרגילים עם סינון לפי קבוצות שרירים
 * @updated 2025-08-17 החלפת console.error בלוגים מותנים, הוספת React.memo, מניעת כפילויות ב-CONSTANTS
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../../styles/theme";
import type { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";
// יבוא מקומי של שרירים
interface Muscle {
  id: number;
  name: string;
  is_front: boolean;
}
import {
  EXERCISES_SCREEN_TEXTS,
  EXERCISES_MUSCLE_GROUPS,
  getMuscleGroupColor,
  // generateExerciseStats,
} from "../../constants/exercisesScreenTexts";

// Debug logging
const DEBUG = __DEV__;
const dlog = (message: string, ...args: unknown[]) => {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug(`[ExercisesScreen] ${message}`, ...args);
  }
};

const { width: screenWidth } = Dimensions.get("window");

// Type definition for muscle groups with enhanced typing
interface MuscleGroup {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
  color: string;
}

type ExercisesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExercisesScreen"
>;

const ExercisesScreen: React.FC = React.memo(() => {
  const navigation = useNavigation<ExercisesScreenNavigationProp>();
  const route = useRoute();
  const [muscles, setMuscles] = useState<Muscle[]>([]);

  // קבלת פרמטרים מהניווט
  const { selectedMuscleGroup, filterTitle, returnScreen } =
    (route.params as RootStackParamList["ExercisesScreen"]) || {};

  // שימוש בקבוצות השרירים מה-constants עם הוספת צבעים
  const mainMuscleGroups = useMemo(
    () =>
      EXERCISES_MUSCLE_GROUPS.map((group) => ({
        ...group,
        color: getMuscleGroupColor(theme, group.id),
      })),
    []
  );

  useEffect(() => {
    loadMuscles();
  }, []);

  // אם יש סינון, נעבור ישירות לרשימת התרגילים המסוננת
  useEffect(() => {
    if (selectedMuscleGroup) {
      const typedNavigation = navigation as ExercisesScreenNavigationProp;
      typedNavigation.navigate("ExerciseList", {
        fromScreen: returnScreen || "ExercisesScreen",
        mode: "view",
        selectedMuscleGroup: selectedMuscleGroup,
      });
    }
  }, [selectedMuscleGroup, navigation, returnScreen]);

  const loadMuscles = async () => {
    try {
      // שימוש ברשימת שרירים מקומית במקום API
      const musclesData: Muscle[] = [
        { id: 1, name: "חזה", is_front: true },
        { id: 2, name: "גב", is_front: false },
        { id: 3, name: "כתפיים", is_front: true },
        { id: 4, name: "ידיים", is_front: true },
        { id: 5, name: "רגליים", is_front: true },
        { id: 6, name: "ליבה", is_front: true },
      ];
      setMuscles(musclesData);
      dlog("Muscles loaded successfully", { count: musclesData.length });
    } catch (error) {
      dlog("Error loading muscles", { error });
    }
  };

  const handleMuscleGroupPress = useCallback(
    (muscleGroup: MuscleGroup) => {
      // ניווט למסך רשימת התרגילים עם סינון לפי קבוצת שרירים
      const typedNavigation = navigation as ExercisesScreenNavigationProp;
      typedNavigation.navigate("ExerciseList", {
        fromScreen: "ExercisesScreen",
        mode: "view",
        selectedMuscleGroup: muscleGroup.id,
      });
    },
    [navigation]
  );

  const handleViewAllExercises = useCallback(() => {
    const typedNavigation = navigation as ExercisesScreenNavigationProp;
    typedNavigation.navigate("ExerciseList", {
      fromScreen: "ExercisesScreen",
      mode: "view",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={CONSTANTS.ICON_SIZES.large}
            color={theme.colors.primary}
            accessible={false}
            importantForAccessibility="no"
          />
          <Text style={styles.title}>
            {filterTitle || EXERCISES_SCREEN_TEXTS.HEADERS.MAIN_TITLE}
          </Text>
          <Text style={styles.subtitle}>
            {selectedMuscleGroup
              ? `תרגילים מותאמים לקבוצת השרירים ${selectedMuscleGroup}`
              : EXERCISES_SCREEN_TEXTS.HEADERS.SUBTITLE}
          </Text>
        </View>

        {/* כפתור צפייה בכל התרגילים */}
        <View style={styles.quickAccessSection}>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewAllExercises}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="צפה בכל התרגילים"
            accessibilityHint="לחץ כדי לעבור לרשימה המלאה של התרגילים"
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary + "DD"]}
              style={styles.viewAllGradient}
            >
              <MaterialCommunityIcons
                name="view-list"
                size={CONSTANTS.ICON_SIZES.small}
                color="#FFFFFF"
                accessible={false}
                importantForAccessibility="no"
              />
              <Text style={styles.viewAllText}>צפה בכל התרגילים</Text>
              <MaterialCommunityIcons
                name="chevron-left"
                size={CONSTANTS.ICON_SIZES.tiny}
                color="#FFFFFF"
                accessible={false}
                importantForAccessibility="no"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* קבוצות שרירים */}
        <View style={styles.muscleGroupsSection}>
          <Text style={styles.sectionTitle}>קבוצות שרירים</Text>
          <Text style={styles.sectionDescription}>
            בחר קבוצת שרירים לצפייה בתרגילים ספציפיים
          </Text>

          <View style={styles.muscleGrid}>
            {mainMuscleGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.muscleCard}
                onPress={() => handleMuscleGroupPress(group)}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`קבוצת שרירי ${group.name}`}
                accessibilityHint={`לחץ כדי לצפות בתרגילים עבור ${group.name} - ${group.description}`}
              >
                <View
                  style={[
                    styles.muscleIconContainer,
                    { backgroundColor: group.color + "20" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={group.icon}
                    size={32}
                    color={group.color}
                  />
                </View>
                <Text style={styles.muscleTitle}>{group.name}</Text>
                <Text style={styles.muscleDescription}>
                  {group.description}
                </Text>

                <View style={styles.muscleArrow}>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* סטטיסטיקות */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>סטטיסטיקות</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>תרגילים</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="human"
                size={28}
                color={theme.colors.success}
              />
              <Text style={styles.statNumber}>{muscles.length}</Text>
              <Text style={styles.statLabel}>קבוצות שרירים</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="star"
                size={28}
                color={theme.colors.warning}
              />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>דירוג ממוצע</Text>
            </View>
          </View>
        </View>

        {/* טיפים */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>טיפים</Text>

          <View style={styles.tipCard}>
            <MaterialCommunityIcons
              name="lightbulb"
              size={24}
              color={theme.colors.warning}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>התחל בתרגילים בסיסיים</Text>
              <Text style={styles.tipText}>
                למתחילים מומלץ להתחיל בתרגילי משקל גוף ולהתקדם בהדרגה
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <MaterialCommunityIcons
              name="heart"
              size={24}
              color={theme.colors.error}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>שימו לב לטכניקה</Text>
              <Text style={styles.tipText}>
                ביצוע נכון חשוב יותר ממשקל כבד - התמקדו בטכניקה נכונה
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

ExercisesScreen.displayName = "ExercisesScreen";

export default ExercisesScreen;

// Constants to prevent duplications
const CONSTANTS = {
  FONT_SIZES: {
    large: 28,
    title: 20,
    subtitle: 16,
    body: 14,
    small: 12,
    icon: 24,
  },
  BORDER_RADIUS: {
    small: 12,
    circle: 30,
  },
  TEXT_ALIGN: {
    center: "center" as const,
    right: "right" as const,
  },
  ICON_SIZES: {
    large: 80,
    medium: 32,
    small: 24,
    tiny: 16,
    stat: 28,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: CONSTANTS.FONT_SIZES.large,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: CONSTANTS.TEXT_ALIGN.center,
  },
  subtitle: {
    fontSize: CONSTANTS.FONT_SIZES.subtitle,
    color: theme.colors.textSecondary,
    textAlign: CONSTANTS.TEXT_ALIGN.center,
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
  quickAccessSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  viewAllButton: {
    borderRadius: CONSTANTS.BORDER_RADIUS.small,
    overflow: "hidden",
  },
  viewAllGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: CONSTANTS.FONT_SIZES.subtitle,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: CONSTANTS.TEXT_ALIGN.center,
  },
  muscleGroupsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: CONSTANTS.FONT_SIZES.title,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: CONSTANTS.TEXT_ALIGN.right,
  },
  sectionDescription: {
    fontSize: CONSTANTS.FONT_SIZES.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: CONSTANTS.TEXT_ALIGN.right,
    lineHeight: 20,
  },
  muscleGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  muscleCard: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: CONSTANTS.BORDER_RADIUS.small,
    padding: theme.spacing.md,
    alignItems: "center",
    position: "relative",
  },
  muscleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: CONSTANTS.BORDER_RADIUS.circle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  muscleTitle: {
    fontSize: CONSTANTS.FONT_SIZES.subtitle,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: CONSTANTS.TEXT_ALIGN.center,
    marginBottom: theme.spacing.xs,
  },
  muscleDescription: {
    fontSize: CONSTANTS.FONT_SIZES.small,
    color: theme.colors.textSecondary,
    textAlign: CONSTANTS.TEXT_ALIGN.center,
    lineHeight: 16,
  },
  muscleArrow: {
    position: "absolute",
    top: theme.spacing.sm,
    left: theme.spacing.sm,
  },
  statsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: CONSTANTS.BORDER_RADIUS.small,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: CONSTANTS.FONT_SIZES.icon,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: CONSTANTS.FONT_SIZES.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: CONSTANTS.TEXT_ALIGN.center,
  },
  tipsSection: {
    marginHorizontal: theme.spacing.lg,
  },
  tipCard: {
    flexDirection: "row-reverse",
    backgroundColor: theme.colors.surface,
    borderRadius: CONSTANTS.BORDER_RADIUS.small,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: "flex-start",
  },
  tipContent: {
    flex: 1,
    marginEnd: theme.spacing.md, // שינוי RTL: marginEnd במקום marginRight
  },
  tipTitle: {
    fontSize: CONSTANTS.FONT_SIZES.body,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: CONSTANTS.TEXT_ALIGN.right,
  },
  tipText: {
    fontSize: CONSTANTS.FONT_SIZES.small,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    textAlign: CONSTANTS.TEXT_ALIGN.right,
  },
});
