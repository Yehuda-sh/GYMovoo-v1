/**
 * ExerciseListScreen - מסך רשימת תרגילים פשוט ופונקציונלי
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  RefreshControl,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { theme } from "../../styles/theme";
import { Exercise, getRandomExercises } from "../../data/exercises";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import type { RootStackParamList } from "../../navigation/types";
import ExerciseDetailsModal from "./ExerciseDetailsModal";

const ExerciseListScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ExerciseList">>();

  const { mode, onSelectExercise } = route.params || {};

  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = () => {
    try {
      setLoading(true);
      const data = getRandomExercises(15);
      setAllExercises(data);
    } catch (error) {
      console.error("Error loading exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      const data = getRandomExercises(15);
      setAllExercises(data);
    } catch (e) {
      console.error("Error refreshing exercises:", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // סינון וחיפוש
  useEffect(() => {
    let filtered = allExercises;

    // סינון לפי רמת קושי
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((e) => e.difficulty === difficultyFilter);
    }

    // סינון לפי חיפוש
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.nameLocalized.he.toLowerCase().includes(q) ||
          e.nameLocalized.en.toLowerCase().includes(q) ||
          e.primaryMuscles.some((m) => m.toLowerCase().includes(q))
      );
    }

    setExercises(filtered);
  }, [allExercises, search, difficultyFilter]);

  const handleExerciseSelect = useCallback(
    (exercise: Exercise) => {
      if (mode === "selection" && onSelectExercise) {
        // המרה לפורמט WorkoutExercise
        const workoutExercise = {
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
          primaryMuscles: exercise.primaryMuscles,
          secondaryMuscles: exercise.secondaryMuscles || [],
          equipment: exercise.equipment,
          instructions: exercise.instructions?.he || [],
          tips: exercise.tips?.he || [],
          videoUrl: exercise.media?.video || "",
          imageUrl: exercise.media?.image || "",
        };
        onSelectExercise(workoutExercise);
        navigation.goBack();
      } else {
        setSelectedExercise(exercise);
      }
    },
    [mode, onSelectExercise, navigation]
  );

  const getDifficultyLabel = (difficulty: Exercise["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: Exercise["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return theme.colors.success;
      case "intermediate":
        return theme.colors.warning;
      case "advanced":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => handleExerciseSelect(item)}
      accessibilityRole="button"
      accessibilityLabel={`פרטי תרגיל ${item.nameLocalized.he}`}
    >
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
      
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>{item.nameLocalized.he}</Text>
        
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseCategory}>{item.category}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + "22" }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
              {getDifficultyLabel(item.difficulty)}
            </Text>
          </View>
        </View>
        
        {item.primaryMuscles.length > 0 && (
          <Text style={styles.musclesText} numberOfLines={1}>
            שרירים: {item.primaryMuscles.slice(0, 3).join(", ")}
            {item.primaryMuscles.length > 3 && " ועוד"}
          </Text>
        )}
        
        <Text style={styles.equipmentText} numberOfLines={1}>
          ציוד: {item.equipment === "none" ? "ללא" : item.equipment}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderDifficultyFilter = () => {
    const filterOptions = [
      { value: "all", label: "הכל" },
      { value: "beginner", label: "מתחיל" },
      { value: "intermediate", label: "בינוני" },
      { value: "advanced", label: "מתקדם" },
    ];

    return (
      <View style={styles.filterBar}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              difficultyFilter === option.value && styles.filterChipActive,
            ]}
            onPress={() => setDifficultyFilter(option.value as typeof difficultyFilter)}
            accessibilityRole="button"
            accessibilityLabel={`סינון ${option.label}`}
          >
            <Text
              style={[
                styles.filterChipText,
                difficultyFilter === option.value && styles.filterChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>רשימת תרגילים</Text>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>טוען תרגילים...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>רשימת תרגילים</Text>
      </View>

      {/* חיפוש */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="חיפוש תרגיל / שריר..."
          placeholderTextColor={theme.colors.textTertiary}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          accessibilityLabel="שדה חיפוש תרגילים"
        />
      </View>

      {/* סינון לפי קושי */}
      {renderDifficultyFilter()}

      {/* רשימת תרגילים */}
      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>לא נמצאו תרגילים תואמים</Text>
              <TouchableOpacity
                style={styles.reloadButton}
                onPress={onRefresh}
                accessibilityRole="button"
                accessibilityLabel="רענון רשימת תרגילים"
              >
                <Text style={styles.reloadButtonText}>רענן</Text>
              </TouchableOpacity>
            </View>
          )
        }
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
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "right",
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceVariant,
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: theme.colors.white,
    fontWeight: "600",
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
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  exerciseCategory: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: "right",
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  musclesText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  equipmentText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: "right",
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  reloadButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  reloadButtonText: {
    fontSize: 14,
    color: theme.colors.white,
    fontWeight: "600",
  },
});

export default ExerciseListScreen;
