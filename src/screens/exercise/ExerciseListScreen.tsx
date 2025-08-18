/**
 * @file ExerciseListScreen.tsx (Simplified Version)
 * @description מסך רשימת תרגילים מפושט שמשתמש במערכת החדשה
 * @dependencies React Native, Exercise data from /data/exercises, BackButton, ExerciseDetailsModal
 * @notes כולל חיפוש וסינון, pull-to-refresh, RTL מלא, נגישות מלאה
 * @recurring_errors וודא accessibility labels, RTL בכפתורים, theme colors
 * @updated 2025-08-17 הסרת navigation לא בשימוש, החלפת console.error בלוגים מותנים, מניעת כפילויות
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { theme } from "../../styles/theme";
import { Exercise, fetchRandomExercises } from "../../data/exercises";
import ExerciseDetailsModal from "./ExerciseDetailsModal";
import BackButton from "../../components/common/BackButton";

const DEBUG = process.env.EXPO_PUBLIC_DEBUG_EXERCISES === "1";
const dlog = (m: string, data?: unknown) => {
  if (DEBUG) console.warn(`🏋️ ExerciseListScreen: ${m}`, data || "");
};

const ExerciseListScreen: React.FC = () => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]); // filtered
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
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
      const data = fetchRandomExercises(15);
      setAllExercises(data);
      dlog("Exercises loaded successfully", { count: data.length });
    } catch (error) {
      dlog("Error loading exercises", error);
    } finally {
      setLoading(false);
    }
  };

  // רענון (Pull to refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      const data = fetchRandomExercises(15);
      setAllExercises(data);
      dlog("Exercises refreshed successfully", { count: data.length });
    } catch (e) {
      dlog("Error refreshing exercises", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // סינון + חיפוש
  useEffect(() => {
    let filtered = allExercises;
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((e) => e.difficulty === difficultyFilter);
    }
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

  const handleReloadPress = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const difficultyLabel = useCallback((d: Exercise["difficulty"]) => {
    switch (d) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return d;
    }
  }, []);

  const DifficultyBadge: React.FC<{ value: Exercise["difficulty"] }> = ({
    value,
  }) => {
    const badgeStyles = useMemo(
      () => [
        styles.difficultyBadge,
        value === "beginner" && styles.beginnerBg,
        value === "intermediate" && styles.intermediateBg,
        value === "advanced" && styles.advancedBg,
      ],
      [value]
    );

    return (
      <View
        style={badgeStyles}
        accessibilityLabel={`רמת קושי: ${difficultyLabel(value)}`}
      >
        <Text style={styles.difficultyBadgeText}>{difficultyLabel(value)}</Text>
      </View>
    );
  };

  const ExerciseCard: React.FC<{ item: Exercise; onPress: () => void }> =
    React.memo(({ item, onPress }) => (
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={onPress}
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
          <View style={styles.rowSpace}>
            <Text style={styles.exerciseCategory}>{item.category}</Text>
            <DifficultyBadge value={item.difficulty} />
          </View>
          {item.primaryMuscles.length > 0 && (
            <View style={styles.musclesContainer}>
              <Text style={styles.musclesLabel}>שרירים: </Text>
              <Text style={styles.musclesText} numberOfLines={1}>
                {item.primaryMuscles.slice(0, 3).join(", ")}
                {item.primaryMuscles.length > 3 && " ועוד"}
              </Text>
            </View>
          )}
          <Text style={styles.equipmentText} numberOfLines={1}>
            ציוד: {item.equipment === "none" ? "ללא" : item.equipment}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  ExerciseCard.displayName = "ExerciseCard";

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <ExerciseCard item={item} onPress={() => setSelectedExercise(item)} />
  );

  const DifficultyFilterBar = () => {
    const filterOptions = useMemo(
      () => [
        { v: "all", label: "הכל" },
        { v: "beginner", label: "מתחיל" },
        { v: "intermediate", label: "בינוני" },
        { v: "advanced", label: "מתקדם" },
      ],
      []
    );

    return (
      <View style={styles.filterBar}>
        {filterOptions.map((d) => (
          <TouchableOpacity
            key={d.v}
            accessibilityRole="button"
            accessibilityLabel={`סינון ${d.label}`}
            style={[
              styles.filterChip,
              difficultyFilter === d.v && styles.filterChipActive,
            ]}
            onPress={() => setDifficultyFilter(d.v as typeof difficultyFilter)}
          >
            <Text
              style={[
                styles.filterChipText,
                difficultyFilter === d.v && styles.filterChipTextActive,
              ]}
            >
              {d.label}
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
          <ActivityIndicator size="large" color={theme.colors.primary} />
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

      <DifficultyFilterBar />

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
                onPress={handleReloadPress}
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
  equipmentText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    writingDirection: "rtl",
  },
  // New styles
  rowSpace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceVariant,
  },
  beginnerBg: { backgroundColor: theme.colors.success + "22" },
  intermediateBg: { backgroundColor: theme.colors.warning + "22" },
  advancedBg: { backgroundColor: theme.colors.error + "22" },
  difficultyBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: "600",
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
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: theme.colors.white,
    fontWeight: "600",
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
    color: theme.colors.text,
    ...theme.typography.body,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  reloadButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  reloadButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.white,
    fontWeight: "600",
  },
});

/**
 * ExerciseListScreen optimized with React.memo for better performance
 * ExerciseListScreen מאופטם עם React.memo לביצועים טובים יותר
 */
const ExerciseListScreenMemo = React.memo(ExerciseListScreen);
ExerciseListScreenMemo.displayName = "ExerciseListScreen";

export default ExerciseListScreenMemo;
