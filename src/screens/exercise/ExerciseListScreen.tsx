/**
 * @file ExerciseListScreen.tsx (Simplified Version)
 * @description מסך רשימת תרגילים מפושט שמשתמש במערכת החדשה
 * @dependencies React Native, Exercise data from /data/exercises
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { Exercise, fetchRandomExercises } from "../../data/exercises";
import ExerciseDetailsModal from "./ExerciseDetailsModal";
import BackButton from "../../components/common/BackButton";

const ExerciseListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = () => {
    try {
      setLoading(true);
      const data = fetchRandomExercises(15);
      setExercises(data);
    } catch (error) {
      console.error("Error loading exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => setSelectedExercise(item)}
    >
      {/* תמונה */}
      <View style={styles.imageContainer}>
        {item.media?.image ? (
          <Image
            source={{ uri: item.media.image }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📸</Text>
          </View>
        )}
      </View>

      {/* פרטי התרגיל */}
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>{item.nameLocalized.he}</Text>
        <Text style={styles.exerciseCategory}>{item.category}</Text>

        {/* שרירים ראשיים */}
        {item.primaryMuscles.length > 0 && (
          <View style={styles.musclesContainer}>
            <Text style={styles.musclesLabel}>שרירים: </Text>
            <Text style={styles.musclesText}>
              {item.primaryMuscles.slice(0, 2).join(", ")}
              {item.primaryMuscles.length > 2 && " ועוד..."}
            </Text>
          </View>
        )}

        {/* קושי */}
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyLabel}>רמת קושי: </Text>
          <Text
            style={[
              styles.difficultyText,
              item.difficulty === "beginner" && styles.beginnerDifficulty,
              item.difficulty === "intermediate" &&
                styles.intermediateDifficulty,
              item.difficulty === "advanced" && styles.advancedDifficulty,
            ]}
          >
            {item.difficulty === "beginner" && "מתחיל"}
            {item.difficulty === "intermediate" && "בינוני"}
            {item.difficulty === "advanced" && "מתקדם"}
          </Text>
        </View>

        {/* ציוד */}
        <Text style={styles.equipmentText}>
          ציוד: {item.equipment === "none" ? "ללא ציוד" : item.equipment}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>רשימת תרגילים</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>טוען תרגילים...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>רשימת תרגילים</Text>
      </View>

      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal פרטי תרגיל */}
      {selectedExercise && (
        <ExerciseDetailsModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    writingDirection: "rtl",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    writingDirection: "rtl",
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  exerciseCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  exerciseImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.backgroundElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  exerciseDetails: {
    flex: 1,
    padding: theme.spacing.md,
  },
  exerciseName: {
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  exerciseCategory: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  musclesContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
  },
  musclesLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  musclesText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
    writingDirection: "rtl",
  },
  difficultyContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
  },
  difficultyLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  difficultyText: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
  },
  beginnerDifficulty: {
    color: theme.colors.success,
  },
  intermediateDifficulty: {
    color: theme.colors.warning,
  },
  advancedDifficulty: {
    color: theme.colors.error,
  },
  equipmentText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    writingDirection: "rtl",
  },
});

export default ExerciseListScreen;
