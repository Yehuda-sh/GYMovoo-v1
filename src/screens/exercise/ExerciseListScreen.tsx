/**
 * @file src/screens/exercise/ExerciseListScreen.tsx
 * @brief מסך רשימת תרגילים עם אפשרות סינון לפי שרירים ומצב בחירה
 * @dependencies MuscleBar, ExerciseDetailsModal, exerciseService
 * @notes מסך זה מציג רשימת תרגילים מ-API עם אפשרות סינון דינמי ומצב בחירה לאימון
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import {
  fetchExercisesSimple,
  fetchMuscles,
  Exercise,
  Muscle,
} from "../../services/exerciseService";
import ExerciseDetailsModal from "./ExerciseDetailsModal";
import MuscleBar from "./MuscleBar";
import BackButton from "../../components/common/BackButton";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/types";

/**
 * טיפוס params של המסך הזה, לפי ה-AppNavigator
 */
type ExerciseListScreenRouteProp = RouteProp<
  RootStackParamList,
  "ExerciseList"
>;

export default function ExerciseListScreen() {
  const navigation = useNavigation();
  const route = useRoute<ExerciseListScreenRouteProp>();

  // בדיקה אם אנחנו במצב בחירה
  const params = route.params ?? {};
  const isSelectionMode = params.mode === "selection";
  const onSelectExercise = params.onSelectExercise;

  // States
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allMuscles, setAllMuscles] = useState<Muscle[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<number | "all">("all");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // טעינת נתונים
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const muscles = await fetchMuscles();
      setAllMuscles(muscles);
      const data = await fetchExercisesSimple(30);
      if (data.length === 0) {
        setError("לא נמצאו תרגילים. אנא בדוק את חיבור האינטרנט שלך.");
      } else {
        setExercises(data);
      }
    } catch {
      setError(
        "נכשלה טעינת התרגילים. אנא בדוק את חיבור האינטרנט שלך ונסה שנית."
      );
    } finally {
      setLoading(false);
    }
  };

  // סינון תרגילים לפי שריר
  const filteredExercises = React.useMemo(() => {
    if (selectedMuscle === "all") return exercises;
    return exercises.filter(
      (ex) =>
        ex.muscles.some((m) => m.id === selectedMuscle) ||
        ex.muscles_secondary.some((m) => m.id === selectedMuscle)
    );
  }, [exercises, selectedMuscle]);

  // עוזר להצגת שמות שרירים
  const getMuscleName = (muscles?: Muscle[]): string =>
    !muscles || !muscles.length
      ? "לא זמין"
      : muscles.map((m) => m.name).join(", ");

  // Toast הצגת
  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  // בעת לחיצה על תרגיל
  const handleExercisePress = (item: Exercise) => {
    if (isSelectionMode && onSelectExercise) {
      const exerciseId = item.id.toString();
      if (selectedExercises.includes(exerciseId)) {
        setSelectedExercises((prev) => prev.filter((id) => id !== exerciseId));
        showToastMessage(`${item.name} הוסר מהרשימה`);
      } else {
        setSelectedExercises((prev) => [...prev, exerciseId]);
        showToastMessage(`${item.name} נוסף לאימון! 💪`);
        // הוספה לאימון דרך הפונקציה מה-params
        onSelectExercise(item);
      }
    } else {
      setSelected(item);
    }
  };

  // סיום בחירת תרגילים
  const handleFinishSelection = () => {
    if (selectedExercises.length === 0) {
      setShowNoSelectionModal(true);
      return;
    }
    navigation.goBack();
  };

  // רכיב כרטיס תרגיל
  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => handleExercisePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.exerciseContent}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.muscles?.length > 0 && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.muscles[0].name}</Text>
            </View>
          )}
        </View>
        <View style={styles.muscleInfo}>
          <View style={styles.muscleRow}>
            <MaterialCommunityIcons
              name="arm-flex"
              size={16}
              color={theme.colors.accent}
            />
            <Text style={styles.muscleText}>{getMuscleName(item.muscles)}</Text>
          </View>
          {item.muscles_secondary.length > 0 && (
            <View style={styles.muscleRow}>
              <MaterialCommunityIcons
                name="arm-flex-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.muscleSecondaryText}>
                {getMuscleName(item.muscles_secondary)}
              </Text>
            </View>
          )}
        </View>
      </View>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.exerciseImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.exerciseImage, styles.placeholderImage]}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>
      )}
      <MaterialCommunityIcons
        name={
          isSelectionMode
            ? selectedExercises.includes(item.id.toString())
              ? "check-circle"
              : "plus-circle"
            : "chevron-left"
        }
        size={24}
        color={
          isSelectionMode
            ? selectedExercises.includes(item.id.toString())
              ? theme.colors.success
              : theme.colors.primary
            : theme.colors.textSecondary
        }
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  // Loading/Error
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text style={styles.loadingText}>טוען תרגילים...</Text>
        <Text style={styles.loadingSubtext}>זה עשוי לקחת רגע</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={48}
          color={theme.colors.error}
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>נסה שנית</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main Render
  return (
    <View style={styles.container}>
      {/* כותרת */}
      <View style={styles.header}>
        {isSelectionMode && <BackButton absolute={false} variant="minimal" />}
        <Text style={styles.headerTitle}>
          {isSelectionMode ? "בחר תרגילים להוספה" : "ספריית תרגילים"}
        </Text>
        {isSelectionMode ? (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedText}>
              {selectedExercises.length} נבחרו
            </Text>
          </View>
        ) : (
          <Text style={styles.exerciseCount}>
            {filteredExercises.length} תרגילים
          </Text>
        )}
      </View>

      {/* Muscle selection bar */}
      {allMuscles.length > 0 && (
        <MuscleBar
          muscles={allMuscles}
          selected={selectedMuscle}
          onSelect={setSelectedMuscle}
        />
      )}

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={48}
              color={theme.colors.textSecondary}
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.emptyText}>
              לא נמצאו תרגילים לקבוצת השרירים הזו
            </Text>
          </View>
        }
        contentInset={{ bottom: isSelectionMode ? 100 : 0 }}
      />

      {/* כפתור סיום בחירה */}
      {isSelectionMode && (
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishSelection}
        >
          <Text style={styles.finishButtonText}>סיים בחירה</Text>
        </TouchableOpacity>
      )}

      {/* הצגת Toast */}
      {showToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* דיאלוג פרטי תרגיל */}
      {!isSelectionMode && selected && (
        <ExerciseDetailsModal
          exercise={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* No Selection Confirmation Modal */}
      <ConfirmationModal
        visible={showNoSelectionModal}
        onClose={() => setShowNoSelectionModal(false)}
        onConfirm={() => setShowNoSelectionModal(false)}
        title="לא נבחרו תרגילים"
        message="בחר לפחות תרגיל אחד להוספה לאימון"
        confirmText="בסדר"
        icon="alert-circle-outline"
        iconColor={theme.colors.warning}
      />
    </View>
  );
}

// --- styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  exerciseCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
  loadingSubtext: {
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    ...theme.shadows.medium,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyState: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  exerciseCard: {
    flexDirection: "row-reverse",
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  exerciseContent: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primaryGradientStart + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: "500",
  },
  muscleInfo: {
    gap: 4,
  },
  muscleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  muscleText: {
    fontSize: 14,
    color: theme.colors.accent,
    textAlign: "right",
  },
  muscleSecondaryText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: theme.colors.backgroundAlt,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {
    marginRight: 8,
  },
  selectedBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  finishButton: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    ...theme.shadows.large,
  },
  finishButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  toast: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  toastText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
