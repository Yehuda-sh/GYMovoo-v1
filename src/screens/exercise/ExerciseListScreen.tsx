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
  fetchRandomExercises,
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
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [muscles, data] = await Promise.all([
          fetchMuscles(),
          fetchRandomExercises(20),
        ]);
        setAllMuscles(muscles);
        setExercises(data);
      } catch {
        setError("Can't load exercises. Check your internet connection.");
      }
      setLoading(false);
    })();
  }, []);

  function getMuscleName(muscles?: Muscle[]): string {
    if (!muscles || !muscles.length) return "N/A";
    return muscles.map((m) => m.name).join(", ");
  }

  // פילטר לפי השריר שנבחר
  const filteredExercises =
    selectedMuscle === "all"
      ? exercises
      : exercises.filter(
          (ex) =>
            (ex.muscles && ex.muscles.some((m) => m.id === selectedMuscle)) ||
            (ex.muscles_secondary &&
              ex.muscles_secondary.some((m) => m.id === selectedMuscle))
        );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* שורת השרירים לסינון */}
      <MuscleBar
        muscles={allMuscles}
        selected={selectedMuscle}
        onSelect={setSelectedMuscle}
      />
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelected(item)}
            activeOpacity={0.85}
          >
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : require("../../../assets/exercise-default.png")
              }
              style={styles.img}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.muscle}>
                Muscle: {getMuscleName(item.muscles)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
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
    padding: theme.spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#ff4747",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
  },
  item: {
    flexDirection: "row-reverse",
    backgroundColor: theme.colors.card,
    borderRadius: 15,
    padding: 13,
    marginBottom: 13,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#0004",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    gap: 13,
  },
  img: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: "#e5e8f1",
    marginLeft: 9,
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    writingDirection: "ltr",
    textAlign: "left",
  },
  muscle: {
    color: theme.colors.accent,
    fontSize: 15,
    fontWeight: "600",
    writingDirection: "ltr",
    textAlign: "left",
  },
});
