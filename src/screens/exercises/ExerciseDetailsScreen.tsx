/**
 * @file src/screens/exercises/ExerciseDetailsScreen.tsx
 * @brief מסך פרטי התרגיל - הצגת מידע מפורט על תרגיל ספציפי
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-06
 *
 * @description
 * מסך מפורט להצגת כל הפרטים על תרגיל ספציפי:
 * - פרטי התרגיל (שם, קבוצת שרירים, ציוד נדרש)
 * - תמונה/אנימציה של התרגיל
 * - הוראות ביצוע מפורטות
 * - יתרונות וטיפים
 * - כפתור לניווט לתרגילים דומים (מאותה קבוצת שרירים)
 * - אפשרות להוספת התרגיל לאימון פעיל
 *
 * @features
 * - ✅ הצגת פרטי התרגיל המלאים
 * - ✅ ניווט לרשימת תרגילים דומים מסוננת
 * - ✅ אפשרות להוספה לאימון פעיל
 * - ✅ תמיכה בתרגילים מותאמים מגדר
 * - ✅ הצגת ציוד נדרש ורמת קושי
 *
 * @navigation
 * route.params: {
 *   exerciseId: string,
 *   exerciseName: string,
 *   muscleGroup: string,
 *   exerciseData?: any
 * }
 */

import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

// Types
import { Exercise } from "../workout/types/workout.types";
import { StackNavigationProp } from "@react-navigation/stack";

// Constants
import { EXERCISES_SCREEN_TEXTS } from "../../constants/exercisesScreenTexts";

interface ExerciseDetailsScreenParams {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  exerciseData?: {
    equipment?: string;
    difficulty?: string;
    instructions?: string[];
    benefits?: string[];
    tips?: string[];
  };
}

// Navigation types
type RootStackParamList = {
  ExercisesScreen: {
    selectedMuscleGroup?: string;
    filterTitle?: string;
    returnScreen?: string;
  };
  ExerciseDetails: ExerciseDetailsScreenParams;
};

type ExerciseDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExerciseDetails"
>;

const ExerciseDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ExerciseDetailsNavigationProp>();
  const route = useRoute();

  const { exerciseId, exerciseName, muscleGroup, exerciseData } =
    (route.params as ExerciseDetailsScreenParams) || {};

  // דיבוג לעזרה בפתרון בעיות
  console.log("🔍 ExerciseDetailsScreen Debug:", {
    exerciseId,
    exerciseName,
    muscleGroup,
    exerciseData,
    hasExerciseData: !!exerciseData,
    exerciseDataType: typeof exerciseData,
    instructionsType: typeof exerciseData?.instructions,
    isInstructionsArray: Array.isArray(exerciseData?.instructions),
  });

  // פרטי התרגיל - עם בדיקה אם יש נתונים מלאים ווידוא שהמערכים תמיד קיימים
  const exerciseDetails = useMemo(() => {
    return {
      id: exerciseId,
      name: exerciseName,
      muscleGroup: muscleGroup,
      equipment: exerciseData?.equipment || "ציוד חופשי",
      difficulty: exerciseData?.difficulty || "בינוני",
      instructions:
        Array.isArray(exerciseData?.instructions) &&
        exerciseData.instructions.length > 0
          ? exerciseData.instructions
          : [
              "עמוד בתנוחה יציבה",
              "בצע את התנועה באיטיות",
              "חזור למצב המוצא",
              "חזור על התנועה",
            ],
      benefits:
        Array.isArray(exerciseData?.benefits) &&
        exerciseData.benefits.length > 0
          ? exerciseData.benefits
          : [
              "חיזוק קבוצת השרירים הראשית",
              "שיפור כוח ויציבות",
              "פיתוח מסת שריר",
            ],
      tips:
        Array.isArray(exerciseData?.tips) && exerciseData.tips.length > 0
          ? exerciseData.tips
          : [
              "שמור על נשימה סדירה",
              "התמקד בטכניקה נכונה",
              "התקדם הדרגתית במשקל",
            ],
    };
  }, [exerciseId, exerciseName, muscleGroup, exerciseData]);

  // בדיקה אם יש נתונים מותאמים אישית או שמדובר בנתונים גנריים
  const isGenericData = useMemo(() => {
    // אם אין exerciseData בכלל, זה נתונים גנריים
    if (!exerciseData) {
      return true;
    }

    const hasCustomInstructions =
      exerciseData.instructions &&
      Array.isArray(exerciseData.instructions) &&
      exerciseData.instructions.length > 0;

    const hasCustomBenefits =
      exerciseData.benefits &&
      Array.isArray(exerciseData.benefits) &&
      exerciseData.benefits.length > 0;

    const hasCustomTips =
      exerciseData.tips &&
      Array.isArray(exerciseData.tips) &&
      exerciseData.tips.length > 0;

    const hasCustomEquipment =
      exerciseData.equipment &&
      exerciseData.equipment !== "ציוד חופשי" &&
      exerciseData.equipment.trim() !== "";

    const hasCustomDifficulty =
      exerciseData.difficulty &&
      exerciseData.difficulty !== "בינוני" &&
      exerciseData.difficulty.trim() !== "";

    // אם אף אחד מהנתונים המותאמים לא קיים, זה נתונים גנריים
    return (
      !hasCustomInstructions &&
      !hasCustomBenefits &&
      !hasCustomTips &&
      !hasCustomEquipment &&
      !hasCustomDifficulty
    );
  }, [exerciseData]);

  // ניווט לתרגילים דומים מסוננים
  const handleSimilarExercises = () => {
    navigation.navigate("ExercisesScreen", {
      selectedMuscleGroup: muscleGroup,
      filterTitle: `תרגילים עבור ${muscleGroup}`,
      returnScreen: "ExerciseDetails",
    });
  };

  // הוספה לאימון פעיל (אם קיים)
  const handleAddToWorkout = () => {
    // כאן נוכל להוסיף לוגיקה להוספת התרגיל לאימון פעיל
    // לעת עתה נציג הודעה
    alert("תכונה זו תהיה זמינה בקרוב");
  };

  // בדיקה אם יש מידע בסיסי לתצוגה
  if (!exerciseId || !exerciseName) {
    return (
      <View style={styles.container}>
        <BackButton absolute={false} variant="minimal" />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={80}
            color={theme.colors.error}
          />
          <Text style={styles.errorTitle}>שגיאה בטעינת התרגיל</Text>
          <Text style={styles.errorText}>
            לא נמצא מידע על התרגיל המבוקש. אנא נסה שוב מאוחר יותר.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton absolute={false} variant="minimal" />

        <View style={styles.headerInfo}>
          <Text style={styles.exerciseTitle}>{exerciseDetails.name}</Text>
          <Text style={styles.muscleGroupText}>
            {exerciseDetails.muscleGroup}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToWorkout}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="הוסף לאימון"
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* תצוגה מיוחדת עבור תרגילים שעדיין לא נבנו */}
      {isGenericData ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Under Construction Notice */}
          <View style={styles.constructionContainer}>
            <MaterialCommunityIcons
              name="hammer-wrench"
              size={80}
              color={theme.colors.warning}
            />
            <Text style={styles.constructionTitle}>תרגיל זה עדיין בבנייה</Text>
            <Text style={styles.constructionSubtitle}>
              אנחנו עובדים קשה להשלים את פרטי התרגיל
            </Text>

            <View style={styles.constructionInfo}>
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color={theme.colors.info}
              />
              <Text style={styles.constructionInfoText}>
                בינתיים, תוכל עדיין להוסיף את התרגיל לאימון שלך ולהתחיל להתאמן
              </Text>
            </View>
          </View>

          {/* Basic Exercise Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.basicInfoTitle}>מידע בסיסי זמין</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="target"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.infoLabel}>קבוצת שרירים</Text>
                <Text style={styles.infoValue}>
                  {exerciseDetails.muscleGroup}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.infoLabel}>שם התרגיל</Text>
                <Text style={styles.infoValue}>{exerciseDetails.name}</Text>
              </View>
            </View>
          </View>

          {/* Coming Soon Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>בקרוב יתווספו</Text>

            <View style={styles.comingSoonItem}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.comingSoonText}>תמונות והדרכה ויזואלית</Text>
            </View>

            <View style={styles.comingSoonItem}>
              <MaterialCommunityIcons
                name="list-status"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.comingSoonText}>הוראות ביצוע מפורטות</Text>
            </View>

            <View style={styles.comingSoonItem}>
              <MaterialCommunityIcons
                name="trophy-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.comingSoonText}>יתרונות ותועלות התרגיל</Text>
            </View>

            <View style={styles.comingSoonItem}>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.comingSoonText}>טיפים וביצוע מתקדם</Text>
            </View>
          </View>

          {/* Feedback Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>רוצה לעזור?</Text>

            <TouchableOpacity style={styles.feedbackButton}>
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.feedbackButtonText}>
                הצטרף לקהילה ועזור בפיתוח התרגיל
              </Text>
              <MaterialCommunityIcons
                name="chevron-left"
                size={16}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.reportButton}>
              <MaterialCommunityIcons
                name="flag-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.reportButtonText}>
                דווח על בעיה או הצע שיפור
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        // תצוגה רגילה עבור תרגילים עם נתונים מלאים
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Exercise Image/Animation Placeholder */}
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={80}
                color={theme.colors.primary}
              />
              <Text style={styles.imagePlaceholderText}>תמונת התרגיל</Text>
            </View>
          </View>

          {/* Exercise Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.infoLabel}>ציוד נדרש</Text>
                <Text style={styles.infoValue}>
                  {exerciseDetails.equipment}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.infoLabel}>רמת קושי</Text>
                <Text style={styles.infoValue}>
                  {exerciseDetails.difficulty}
                </Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>הוראות ביצוע</Text>
            {Array.isArray(exerciseDetails.instructions) &&
              exerciseDetails.instructions.map(
                (instruction: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listNumber}>{index + 1}</Text>
                    <Text style={styles.listText}>{instruction}</Text>
                  </View>
                )
              )}
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>יתרונות התרגיל</Text>
            {Array.isArray(exerciseDetails.benefits) &&
              exerciseDetails.benefits.map((benefit: string, index: number) => (
                <View key={index} style={styles.listItem}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color={theme.colors.success}
                  />
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
          </View>

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>טיפים ושימור</Text>
            {Array.isArray(exerciseDetails.tips) &&
              exerciseDetails.tips.map((tip: string, index: number) => (
                <View key={index} style={styles.listItem}>
                  <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={16}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.listText}>{tip}</Text>
                </View>
              ))}
          </View>
        </ScrollView>
      )}

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.similarExercisesButton}
          onPress={handleSimilarExercises}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="תרגילים דומים"
        >
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={24}
            color={theme.colors.card}
          />
          <Text style={styles.similarExercisesText}>
            תרגילים דומים ל{exerciseDetails.muscleGroup}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  muscleGroupText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  addButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  infoContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
    ...theme.shadows.small,
  },
  infoRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "600",
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  listItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  listNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    minWidth: 20,
    textAlign: "center",
  },
  listText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
    lineHeight: 20,
    marginLeft: theme.spacing.sm,
  },
  bottomActions: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  similarExercisesButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  similarExercisesText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: "600",
  },
  // סטיילים למסך "בבנייה"
  constructionContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    marginVertical: theme.spacing.md,
    ...theme.shadows.small,
  },
  constructionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.warning,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  constructionSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  constructionInfo: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    backgroundColor: theme.colors.info + "20",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.info + "30",
    gap: theme.spacing.sm,
  },
  constructionInfoText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "right",
    flex: 1,
    lineHeight: 20,
  },
  basicInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  comingSoonItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.sm,
  },
  comingSoonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
    flex: 1,
  },
  // סטיילים למסך שגיאה
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  // סטיילים לכפתורי משוב וקהילה
  feedbackButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
    marginBottom: theme.spacing.sm,
  },
  feedbackButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    marginHorizontal: theme.spacing.sm,
  },
  reportButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  reportButtonText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default ExerciseDetailsScreen;
