/**
 * @file src/screens/exercises/ExercisesScreen.tsx
 * @brief מסך תרגילים - סקירה כללית של כל התרגילים במערכת
 * @dependencies React Native, MaterialCommunityIcons, ExerciseListScreen
 * @notes מסך ראשי לגישה לכל התרגילים עם סינון לפי קבוצות שרירים
 * @updated 2025-08-06 אופטימיזציה: הסרת ערכים קשיחים, שימוש במערכת theme, ריכוז constants
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
  generateExerciseStats,
} from "../../constants/exercisesScreenTexts";

const { width: screenWidth } = Dimensions.get("window");

// Type definition for muscle groups with enhanced typing
interface MuscleGroup {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
  color: string;
}

type ExercisesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface ExercisesScreenParams {
  selectedMuscleGroup?: string;
  filterTitle?: string;
  returnScreen?: string;
}

export default function ExercisesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [muscles, setMuscles] = useState<Muscle[]>([]);

  // קבלת פרמטרים מהניווט
  const { selectedMuscleGroup, filterTitle, returnScreen } =
    (route.params as ExercisesScreenParams) || {};

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
    } catch (error) {
      console.error("Error loading muscles:", error);
    }
  };

  const handleMuscleGroupPress = (muscleGroup: MuscleGroup) => {
    // ניווט למסך רשימת התרגילים עם סינון לפי קבוצת שרירים
    const typedNavigation = navigation as ExercisesScreenNavigationProp;
    typedNavigation.navigate("ExerciseList", {
      fromScreen: "Exercises",
      mode: "view",
      selectedMuscleGroup: muscleGroup.id,
    });
  };

  const handleViewAllExercises = () => {
    const typedNavigation = navigation as ExercisesScreenNavigationProp;
    typedNavigation.navigate("ExerciseList", {
      fromScreen: "Exercises",
      mode: "view",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={80}
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
                size={24}
                color="#FFFFFF"
                accessible={false}
                importantForAccessibility="no"
              />
              <Text style={styles.viewAllText}>צפה בכל התרגילים</Text>
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
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
    </View>
  );
}

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
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
  quickAccessSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  viewAllButton: {
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  muscleGroupsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "right",
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
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    position: "relative",
  },
  muscleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  muscleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  muscleDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
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
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
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
  tipsSection: {
    marginHorizontal: theme.spacing.lg,
  },
  tipCard: {
    flexDirection: "row-reverse",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: "flex-start",
  },
  tipContent: {
    flex: 1,
    marginEnd: theme.spacing.md, // שינוי RTL: marginEnd במקום marginRight
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  tipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    textAlign: "right",
  },
});
