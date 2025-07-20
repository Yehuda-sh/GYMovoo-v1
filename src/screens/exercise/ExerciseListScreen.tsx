import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../styles/theme";
import {
  fetchExercisesSimple,
  fetchMuscles,
  Exercise,
  Muscle,
} from "../../services/exerciseService";
import ExerciseDetailsModal from "./ExerciseDetailsModal";
import MuscleBar from "./MuscleBar";

export default function ExerciseListScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allMuscles, setAllMuscles] = useState<Muscle[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<number | "all">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load muscles first
      console.log("[SCREEN] Fetching muscles...");
      const muscles = await fetchMuscles();
      console.log("[SCREEN] Muscles loaded:", muscles.length);
      setAllMuscles(muscles);

      // Then load exercises
      console.log("[SCREEN] Fetching exercises...");
      const data = await fetchExercisesSimple(30); // Start with 30 for faster loading
      console.log("[SCREEN] Exercises loaded:", data.length);

      if (data.length === 0) {
        setError("No exercises found. Please check your internet connection.");
      } else {
        setExercises(data);
      }
    } catch (e) {
      console.error("[SCREEN] ERROR:", e);
      setError(
        "Failed to load exercises. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // סינון תרגילים לפי שריר נבחר
  const filteredExercises = React.useMemo(() => {
    if (selectedMuscle === "all") {
      return exercises;
    }

    return exercises.filter(
      (ex) =>
        ex.muscles.some((m) => m.id === selectedMuscle) ||
        ex.muscles_secondary.some((m) => m.id === selectedMuscle)
    );
  }, [exercises, selectedMuscle]);

  const getMuscleName = (muscles?: Muscle[]): string => {
    if (!muscles || !muscles.length) return "N/A";
    return muscles.map((m) => m.name).join(", ");
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setSelected(item)}
      activeOpacity={0.85}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.img}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.img, styles.placeholderImg]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.itemContent}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.muscle} numberOfLines={1}>
          Primary: {getMuscleName(item.muscles)}
        </Text>
        {item.muscles_secondary.length > 0 && (
          <Text style={styles.muscleSecondary} numberOfLines={1}>
            Secondary: {getMuscleName(item.muscles_secondary)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
        <Text style={styles.loadingSubtext}>This may take a moment</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Exercise Library</Text>

      {/* בר בחירת שריר */}
      {allMuscles.length > 0 && (
        <MuscleBar
          muscles={allMuscles}
          selected={selectedMuscle}
          onSelect={setSelectedMuscle}
        />
      )}

      {/* Exercise count */}
      <Text style={styles.countText}>
        {filteredExercises.length} exercises found
      </Text>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No exercises found for this muscle group.
          </Text>
        }
      />

      {selected && (
        <ExerciseDetailsModal
          exercise={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </View>
  );
}

// --- styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50, // For status bar
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 12,
    fontSize: 16,
  },
  loadingSubtext: {
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  errorText: {
    color: "#ff4747",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  countText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 24,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    padding: 40,
  },
  item: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: theme.colors.backgroundAlt,
    marginRight: 12,
  },
  placeholderImg: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    opacity: 0.5,
  },
  itemContent: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  muscle: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  muscleSecondary: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "400",
  },
});
