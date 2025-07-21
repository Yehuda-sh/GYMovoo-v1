/**
 * @file src/screens/exercise/ExerciseDetailsModal.tsx
 * @description מודל להצגת פרטי תרגיל מלאים - תמונה, שרירים, ותיאור
 * English: Modal for displaying full exercise details - image, muscles, and description
 * @dependencies Exercise type, theme
 * @notes כולל ניקוי HTML מתיאורים, RTL מלא, עיצוב מותאם למסכי Workout
 * @recurring_errors וודא שכל הטקסטים מיושרים לימין, שמות שרירים באנגלית
 */

import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Exercise } from "../../services/exerciseService";
import { theme } from "../../styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  exercise: Exercise;
  onClose: () => void;
};

export default function ExerciseDetailsModal({ exercise, onClose }: Props) {
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // אנימציית כניסה // Entry animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /**
   * מנקה תגי HTML מהתיאור
   * Removes HTML tags from description
   */
  const cleanDescription = exercise.description
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();

  const handleClose = () => {
    // אנימציית יציאה // Exit animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible animationType="none" transparent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>פרטי תרגיל</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* תמונת תרגיל // Exercise Image */}
            {exercise.image ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: exercise.image }}
                  style={styles.exerciseImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View
                style={[styles.imageContainer, styles.placeholderContainer]}
              >
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={48}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.placeholderText}>אין תמונה זמינה</Text>
              </View>
            )}

            {/* שם התרגיל // Exercise Name */}
            <Text style={styles.exerciseName}>{exercise.name}</Text>

            {/* שרירים ראשיים // Primary Muscles */}
            <View style={styles.muscleSection}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.sectionTitle}>שרירים ראשיים</Text>
              </View>
              <View style={styles.muscleTagsContainer}>
                {exercise.muscles.length > 0 ? (
                  exercise.muscles.map((muscle, index) => (
                    <View key={index} style={styles.muscleTag}>
                      <Text style={styles.muscleTagText}>{muscle.name}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>לא צוין</Text>
                )}
              </View>
            </View>

            {/* שרירים משניים // Secondary Muscles */}
            {exercise.muscles_secondary.length > 0 && (
              <View style={styles.muscleSection}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="arm-flex-outline"
                    size={20}
                    color={theme.colors.accent}
                  />
                  <Text style={styles.sectionTitle}>שרירים משניים</Text>
                </View>
                <View style={styles.muscleTagsContainer}>
                  {exercise.muscles_secondary.map((muscle, index) => (
                    <View
                      key={index}
                      style={[styles.muscleTag, styles.secondaryMuscleTag]}
                    >
                      <Text style={styles.muscleTagText}>{muscle.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* קטגוריה // Category */}
            {exercise.category && (
              <View style={styles.categorySection}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="grid-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.sectionTitle}>קטגוריה</Text>
                </View>
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryText}>
                    קטגוריה #{exercise.category}
                  </Text>
                </View>
              </View>
            )}

            {/* תיאור // Description */}
            {cleanDescription && (
              <View style={styles.descriptionSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.sectionTitle}>תיאור התרגיל</Text>
                </View>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText}>{cleanDescription}</Text>
                </View>
              </View>
            )}

            {/* כפתור סגירה תחתון // Bottom close button */}
            <TouchableOpacity
              style={styles.bottomCloseButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.bottomCloseText}>סגור</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "92%",
    maxHeight: "85%",
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    ...theme.shadows.large,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    backgroundColor: theme.colors.card,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: theme.colors.card,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  exerciseImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderStyle: "dashed",
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  muscleSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  muscleTagsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  muscleTag: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary + "40",
  },
  secondaryMuscleTag: {
    backgroundColor: theme.colors.accent + "15",
    borderColor: theme.colors.accent + "30",
  },
  muscleTagText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    textAlign: "right",
  },
  bottomCloseButton: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  bottomCloseText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
});
