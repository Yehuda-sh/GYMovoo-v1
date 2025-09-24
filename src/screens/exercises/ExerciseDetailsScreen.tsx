// src/screens/exercises/ExerciseDetailsScreen.tsx
/**
 * ExerciseDetailsScreen - מסך פרטי תרגיל פשוט ופונקציונלי
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../../core/theme";
import BackButton from "../../components/common/BackButton";
import type { RootStackParamList } from "../../navigation/types";
import { formatEquipmentList } from "../../utils/formatters";

interface ExerciseDetailsScreenParams {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  exerciseData?: {
    equipment?: string | string[]; // ← תוקן: אפשר גם מערך
    difficulty?: string;
    instructions?: string[];
    benefits?: string[];
    tips?: string[];
  };
}

type ExerciseDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExerciseDetails"
>;
type ExerciseDetailsRouteProp = RouteProp<
  RootStackParamList,
  "ExerciseDetails"
>;

const ExerciseDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ExerciseDetailsNavigationProp>();
  const route = useRoute<ExerciseDetailsRouteProp>();

  const { exerciseId, exerciseName, muscleGroup, exerciseData } =
    route.params as ExerciseDetailsScreenParams;

  // פרטי התרגיל (memoized)
  const exerciseDetails = useMemo(() => {
    const equipmentRaw = exerciseData?.equipment ?? "bodyweight";
    const equipmentDisplay = Array.isArray(equipmentRaw)
      ? formatEquipmentList(equipmentRaw)
      : formatEquipmentList([String(equipmentRaw)]);

    return {
      id: exerciseId,
      name: exerciseName,
      muscleGroup,
      equipment: equipmentDisplay,
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
  }, [exerciseData, exerciseId, exerciseName, muscleGroup]);

  // ניווט לתרגילים דומים
  const handleSimilarExercises = useCallback(() => {
    navigation.navigate("ExercisesScreen", {
      selectedMuscleGroup: muscleGroup,
      filterTitle: `תרגילים עבור ${muscleGroup}`,
      returnScreen: "ExerciseDetails",
    });
  }, [muscleGroup, navigation]);

  // הוספה לאימון פעיל
  const handleAddToWorkout = useCallback(() => {
    navigation.navigate("ActiveWorkout", {
      workoutData: {
        name: "אימון מותאם",
        dayName: muscleGroup || "כללי",
        startTime: new Date().toISOString(),
        exercises: [],
      },
      pendingExercise: {
        id: exerciseId,
        name: exerciseName,
        muscleGroup,
        equipment:
          (Array.isArray(exerciseData?.equipment)
            ? exerciseData?.equipment[0]
            : exerciseData?.equipment) ?? "bodyweight",
      },
    });
  }, [navigation, exerciseId, exerciseName, muscleGroup, exerciseData]);

  // בדיקה אם יש מידע בסיסי
  if (!exerciseId || !exerciseName) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton />
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerInfo}>
          <Text style={styles.exerciseTitle}>{exerciseDetails.name}</Text>
          <Text style={styles.muscleGroupText}>
            {exerciseDetails.muscleGroup}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToWorkout}
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* תמונת התרגיל */}
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

        {/* מידע על התרגיל */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="weight-lifter"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.infoLabel}>ציוד נדרש</Text>
              <Text style={styles.infoValue}>{exerciseDetails.equipment}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.infoLabel}>רמת קושי</Text>
              <Text style={styles.infoValue}>{exerciseDetails.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* הוראות ביצוע */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>הוראות ביצוע</Text>
          {exerciseDetails.instructions.map((instruction, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listNumber}>{index + 1}</Text>
              <Text style={styles.listText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* יתרונות התרגיל */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>יתרונות התרגיל</Text>
          {exerciseDetails.benefits.map((benefit, index) => (
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

        {/* טיפים */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>טיפים חשובים</Text>
          {exerciseDetails.tips.map((tip, index) => (
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

      {/* כפתור תרגילים דומים */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.similarExercisesButton}
          onPress={handleSimilarExercises}
          accessibilityRole="button"
          accessibilityLabel="תרגילים דומים"
        >
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={24}
            color={theme.colors.white}
          />
          <Text style={styles.similarExercisesText}>
            תרגילים דומים ל{exerciseDetails.muscleGroup}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  addButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  content: { flex: 1, paddingHorizontal: theme.spacing.md },
  imageContainer: { alignItems: "center", paddingVertical: theme.spacing.lg },
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
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: { flexDirection: "row-reverse", justifyContent: "space-around" },
  infoItem: { alignItems: "center", flex: 1 },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginStart: theme.spacing.sm,
    minWidth: 20,
    textAlign: "center",
  },
  listText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
    lineHeight: 20,
    marginStart: theme.spacing.sm,
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
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
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
});

export default ExerciseDetailsScreen;
