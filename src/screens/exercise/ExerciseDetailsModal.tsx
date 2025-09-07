/**
 * @file src/screens/exercise/ExerciseDetailsModal.tsx
 * @description מודל להצגת פרטי תרגיל מלאים - תמונה, שרירים, ותיאור משופר עם נגישות מתקדמת
 * English: Modal for displaying full exercise details - image, muscles, and description with enhanced accessibility
 * @dependencies Exercise type, theme, Animated, BackButton, AccessibilityInfo
 * @notes כולל ניקוי HTML מתיאורים, RTL מלא, עיצוב מותאם למסכי Workout, אנימציות עם תמיכת reducedMotion
 * @recurring_errors וודא שכל הטקסטים מיושרים לימין, שמות שרירים באנגלית, השתמש ב-theme בלבד
 * @updated 2025-09-02 הוספת React.memo, useCallback, תמיכת reducedMotion, שיפור נגישות
 */

import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  AccessibilityInfo,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Exercise } from "../../data/exercises";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

type Props = {
  exercise: Exercise;
  onClose: () => void;
};

const ExerciseDetailsModal = React.memo<Props>(({ exercise, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; // modal opacity
  const overlayAnim = useRef(new Animated.Value(0)).current; // backdrop opacity
  const imageOpacity = useRef(new Animated.Value(0)).current; // image fade-in
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // בדיקת תמיכה ב-reducedMotion לנגישות
  React.useEffect(() => {
    const checkReducedMotion = async () => {
      try {
        const isReducedMotionEnabled =
          await AccessibilityInfo.isReduceMotionEnabled();
        setReducedMotion(isReducedMotionEnabled);
      } catch {
        // fallback - אם יש שגיאה, נניח שאין תמיכה
        setReducedMotion(false);
      }
    };
    checkReducedMotion();
  }, []);

  React.useEffect(() => {
    // אנימציית כניסה משופרת עם תמיכת reducedMotion
    const animationDuration = reducedMotion ? 100 : 300;
    const overlayDuration = reducedMotion ? 80 : 280;

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: reducedMotion ? 20 : 10,
        tension: reducedMotion ? 200 : 90,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.6,
        duration: overlayDuration,
        useNativeDriver: true,
      }),
    ]).start();
    // reducedMotion is stable, scaleAnim, fadeAnim, overlayAnim are stable refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  /**
   * מנקה תגי HTML מהתיאור
   * Removes HTML tags from description
   */
  const cleanDescription = useMemo(() => {
    const raw =
      (exercise.instructions?.he?.length
        ? exercise.instructions.he
        : exercise.instructions.en) || [];
    const txt = raw
      .join(". ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return txt || "אין תיאור זמין";
  }, [exercise.instructions]);

  const capitalize = (s: string) =>
    s.length < 2 ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1);

  const difficultyColors = {
    beginner: {
      bg: theme.colors.primary + "20",
      border: theme.colors.primary + "40",
      text: theme.colors.primary,
    },
    intermediate: {
      bg: theme.colors.accent + "25",
      border: theme.colors.accent + "40",
      text: theme.colors.accent,
    },
    advanced: {
      bg: theme.colors.error + "20",
      border: theme.colors.error + "40",
      text: theme.colors.error,
    },
  } as const;

  const handleClose = useCallback(() => {
    // אנימציית יציאה משופרת עם תמיכת reducedMotion
    const animationDuration = reducedMotion ? 100 : 180;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [reducedMotion, scaleAnim, fadeAnim, overlayAnim, onClose]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
    const animationDuration = reducedMotion ? 100 : 250;

    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [reducedMotion, imageOpacity]);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  return (
    <Modal visible animationType="none" transparent>
      <Animated.View
        style={[
          theme.getModalOverlayStyle("center"),
          styles.overlayLayer,
          { opacity: overlayAnim },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityLabel="סגור מודל פרטי תרגיל"
          accessibilityRole="button"
          accessibilityHint="הקש כדי לסגור את המודל"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.modalContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
        accessibilityViewIsModal
        accessibilityLabel="Exercise Details Modal"
      >
        <Pressable
          onPress={undefined}
          style={styles.flexOne}
          accessibilityLabel="תוכן מודל פרטי תרגיל"
          accessibilityRole="none"
        >
          {/* Header */}
          <View style={styles.header}>
            <BackButton
              absolute={false}
              onPress={handleClose}
              variant="minimal"
              style={styles.backButton}
              haptic={true}
              hapticType="light"
            />
            <Text style={styles.headerTitle}>פרטי תרגיל</Text>
            <View style={styles.spacer40} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* תמונת תרגיל // Exercise Image */}
            {exercise.media?.image ? (
              <View style={styles.imageContainer}>
                {imageLoading && (
                  <View style={styles.imageLoadingContainer}>
                    <LoadingSpinner size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>טוען תמונה...</Text>
                  </View>
                )}
                <Animated.Image
                  source={{ uri: exercise.media.image }}
                  style={[
                    styles.exerciseImage,
                    imageLoading ? styles.imageHidden : null,
                    { opacity: imageOpacity },
                  ]}
                  resizeMode="contain"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {imageError && (
                  <View style={styles.imageErrorContainer}>
                    <MaterialCommunityIcons
                      name="image-broken-variant"
                      size={48}
                      color={theme.colors.error}
                    />
                    <Text style={styles.errorText}>שגיאה בטעינת התמונה</Text>
                  </View>
                )}
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
            <Text style={styles.exerciseName} accessibilityRole="header">
              {exercise.name}
            </Text>

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
                {exercise.primaryMuscles.length > 0 ? (
                  exercise.primaryMuscles.map(
                    (muscle: string, index: number) => (
                      <View key={index} style={styles.muscleTag}>
                        <Text style={styles.muscleTagText}>
                          {capitalize(muscle)}
                        </Text>
                      </View>
                    )
                  )
                ) : (
                  <Text style={styles.noDataText}>לא צוין</Text>
                )}
              </View>
            </View>

            {/* שרירים משניים // Secondary Muscles */}
            {exercise.secondaryMuscles &&
              exercise.secondaryMuscles.length > 0 && (
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
                    {exercise.secondaryMuscles.map(
                      (muscle: string, index: number) => (
                        <View
                          key={index}
                          style={[styles.muscleTag, styles.secondaryMuscleTag]}
                        >
                          <Text style={styles.muscleTagText}>
                            {capitalize(muscle)}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              )}

            {/* קטגוריה // Category */}
            {(exercise.category || exercise.difficulty) && (
              <View style={styles.categorySection}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="grid-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.sectionTitle}>קטגוריה וקושי</Text>
                </View>
                <View style={styles.categoryRow}>
                  {exercise.category && (
                    <View style={styles.categoryContainer}>
                      <Text style={styles.categoryText}>
                        {capitalize(exercise.category)}
                      </Text>
                    </View>
                  )}
                  {exercise.difficulty && (
                    <View
                      style={[
                        styles.difficultyChip,
                        {
                          backgroundColor:
                            difficultyColors[exercise.difficulty].bg,
                          borderColor:
                            difficultyColors[exercise.difficulty].border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyChipText,
                          { color: difficultyColors[exercise.difficulty].text },
                        ]}
                      >
                        {exercise.difficulty === "beginner"
                          ? "מתחיל"
                          : exercise.difficulty === "intermediate"
                            ? "בינוני"
                            : "מתקדם"}
                      </Text>
                    </View>
                  )}
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
          </ScrollView>
        </Pressable>
      </Animated.View>
    </Modal>
  );
});

ExerciseDetailsModal.displayName = "ExerciseDetailsModal";

export default ExerciseDetailsModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: "92%",
    maxHeight: "85%",
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    ...theme.shadows.large,
    overflow: "hidden",
    alignSelf: "center",
    position: "absolute",
    top: "8%",
  },
  overlayLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    writingDirection: "rtl",
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
    writingDirection: "rtl",
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
    writingDirection: "rtl",
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
    minWidth: 90,
  },
  categoryRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  difficultyChip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  difficultyChipText: {
    fontSize: 13,
    fontWeight: "600",
    writingDirection: "rtl",
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
    writingDirection: "rtl",
  },
  imageLoadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    zIndex: 2,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  imageErrorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    zIndex: 2,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: 8,
    textAlign: "center",
  },
  flexOne: { flex: 1 },
  spacer40: { width: 40 },
  imageHidden: { opacity: 0 },
});
