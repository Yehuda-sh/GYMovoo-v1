/**
 * @file src/screens/workout/components/ExercisePickerModal.tsx
 * @description מודל בחירת תרגילים - חיפוש, סינון לפי קטגוריות, תרגילים אחרונים
 * English: Exercise picker modal - search, filter by categories, recent exercises
 */

import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import { Exercise } from "../types/workout.types";

interface ExercisePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseOption) => void;
  currentExercises: Exercise[];
}

// קטגוריות תרגילים
// Exercise categories
const categories = [
  { id: "chest", name: "חזה", icon: "arm-flex" },
  { id: "back", name: "גב", icon: "human" },
  { id: "shoulders", name: "כתפיים", icon: "weight-lifter" },
  { id: "biceps", name: "יד קדמית", icon: "arm-flex-outline" },
  { id: "triceps", name: "יד אחורית", icon: "arm-flex" },
  { id: "legs", name: "רגליים", icon: "human" },
  { id: "abs", name: "בטן", icon: "ab-testing" },
  { id: "cardio", name: "אירובי", icon: "run" },
];

// ממשק תרגיל לבחירה (ללא סטים)
// Exercise for selection interface (without sets)
interface ExerciseOption {
  id: string;
  name: string;
  category: string;
  image?: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment?: string;
}

// רשימת תרגילים לדוגמה
// Sample exercises list
const sampleExercises: ExerciseOption[] = [
  {
    id: "1",
    name: "לחיצת חזה עם מוט",
    category: "chest",
    image: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
    primaryMuscles: ["חזה"],
    secondaryMuscles: ["כתפיים", "טריספס"],
    equipment: "מוט",
  },
  {
    id: "2",
    name: "סקוואט עם מוט",
    category: "legs",
    image: "https://wger.de/media/exercise-images/84/Squats-1.png",
    primaryMuscles: ["ארבע ראשי"],
    secondaryMuscles: ["ישבן", "המסטרינג"],
    equipment: "מוט",
  },
  {
    id: "3",
    name: "חתירה בכבל",
    category: "back",
    image: "https://wger.de/media/exercise-images/45/Seated-cable-rows-1.png",
    primaryMuscles: ["גב עליון"],
    secondaryMuscles: ["ביספס", "גב תחתון"],
    equipment: "כבל",
  },
  {
    id: "4",
    name: "לחיצת כתפיים עם משקולות",
    category: "shoulders",
    image:
      "https://wger.de/media/exercise-images/119/Dumbbell-shoulder-press-1.png",
    primaryMuscles: ["כתפיים"],
    secondaryMuscles: ["טריספס"],
    equipment: "משקולות",
  },
  {
    id: "5",
    name: "כפיפת מרפק עם משקולות",
    category: "biceps",
    image: "https://wger.de/media/exercise-images/81/Biceps-curl-1.png",
    primaryMuscles: ["ביספס"],
    secondaryMuscles: [],
    equipment: "משקולות",
  },
];

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  visible,
  onClose,
  onSelectExercise,
  currentExercises,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentExercises] = useState<ExerciseOption[]>(
    sampleExercises.slice(0, 3)
  );
  const [isLoading] = useState(false);

  // סינון תרגילים לפי קטגוריה וחיפוש
  // Filter exercises by category and search
  const filteredExercises = useMemo(() => {
    let exercises = sampleExercises;

    if (selectedCategory) {
      exercises = exercises.filter((e) => e.category === selectedCategory);
    }

    if (searchQuery) {
      exercises = exercises.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // הסרת תרגילים שכבר נבחרו
    // Remove already selected exercises
    return exercises.filter(
      (e) => !currentExercises.find((ce) => ce.id === e.id)
    );
  }, [selectedCategory, searchQuery, currentExercises]);

  const renderCategory = ({ item }: { item: (typeof categories)[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === item.id && styles.categoryCardActive,
      ]}
      onPress={() =>
        setSelectedCategory(selectedCategory === item.id ? null : item.id)
      }
    >
      <MaterialCommunityIcons
        name={item.icon as any}
        size={24}
        color={
          selectedCategory === item.id
            ? theme.colors.primary
            : theme.colors.textSecondary
        }
      />
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.id && styles.categoryNameActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderExercise = ({ item }: { item: ExerciseOption }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => {
        onSelectExercise(item);
        onClose();
      }}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.exerciseImage} />
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={styles.musclesRow}>
          {item.primaryMuscles.map((muscle: string, index: number) => (
            <View key={index} style={styles.muscleTag}>
              <Text style={styles.muscleText}>{muscle}</Text>
            </View>
          ))}
        </View>
        {item.equipment && (
          <View style={styles.equipmentRow}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.equipmentText}>{item.equipment}</Text>
          </View>
        )}
      </View>
      <MaterialCommunityIcons
        name="plus-circle"
        size={28}
        color={theme.colors.primary}
      />
    </TouchableOpacity>
  );

  const renderRecentExercise = (exercise: ExerciseOption) => (
    <TouchableOpacity
      key={exercise.id}
      style={styles.recentCard}
      onPress={() => {
        onSelectExercise(exercise);
        onClose();
      }}
    >
      <Image source={{ uri: exercise.image }} style={styles.recentImage} />
      <Text style={styles.recentName} numberOfLines={1}>
        {exercise.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* כותרת */}
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>בחר תרגיל</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* שורת חיפוש */}
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={theme.colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="חפש תרגיל..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* תרגילים אחרונים */}
        {/* Recent exercises */}
        {!searchQuery && !selectedCategory && recentExercises.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>תרגילים אחרונים</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
            >
              {recentExercises.map(renderRecentExercise)}
            </ScrollView>
          </View>
        )}

        {/* קטגוריות */}
        {/* Categories */}
        {!searchQuery && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>קטגוריות</Text>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              numColumns={4}
              columnWrapperStyle={styles.categoriesGrid}
            />
          </View>
        )}

        {/* רשימת תרגילים */}
        {/* Exercise list */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : searchQuery
              ? "תוצאות חיפוש"
              : "כל התרגילים"}
            {` (${filteredExercises.length})`}
          </Text>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={filteredExercises}
              renderItem={renderExercise}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.exercisesList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={48}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.emptyText}>לא נמצאו תרגילים</Text>
                </View>
              }
            />
          )}
        </View>

        {/* כפתור הוספת תרגיל חדש */}
        {/* Add new exercise button */}
        <TouchableOpacity style={styles.addNewButton}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.addNewGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={theme.colors.text}
            />
            <Text style={styles.addNewText}>צור תרגיל חדש</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Modal>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
  recentSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  recentList: {
    paddingHorizontal: 16,
  },
  recentCard: {
    alignItems: "center",
    marginRight: 12,
    width: 80,
  },
  recentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.card,
    marginBottom: 4,
  },
  recentName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoriesGrid: {
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  categoryCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  categoryName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  categoryNameActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  exercisesSection: {
    flex: 1,
  },
  exercisesList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  exerciseInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  musclesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  muscleTag: {
    backgroundColor: theme.colors.primaryGradientStart + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  muscleText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  equipmentText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  loader: {
    marginTop: 50,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  addNewButton: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
  },
  addNewGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  addNewText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginLeft: 8,
  },
});
