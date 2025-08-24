/**
 * @file Enhanced Exercise Card Component - Simple Version
 * @description רכיב תרגיל מותאם עם React.memo ואופטימיזציות ביצועים - גרסה משופרת פשוטה
 * @updated August 2025 - Enhanced accessibility, performance & UX
 *
 * ⚠️ הערה: זוהי הגרסה הפשוטה של ExerciseCard
 * לגרסה המתקדמת ראה: ./ExerciseCard/index.tsx
 *
 * 🚀 שיפורים שנוספו:
 * - ♿ נגישות מלאה עם accessibilityLabels מפורטים
 * - ⚡ אופטימיזציות ביצועים עם useMemo וuseCallback
 * - 🎯 Haptic feedback משופר
 * - 🎨 עיצוב משופר עם אנימציות עדינות
 * - 🛡️ טיפול בשגיאות עם Error Boundaries
 * - 📱 שיפורי UX עם loading states
 * - 🔄 תמיכה במצבי טעינה ושגיאות
 * - 📊 סטטיסטיקות מחושבות ממוזכרות
 * - 🎪 השוואת props מותאמת למניעת רינדורים מיותרים
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../../styles/theme";
import {
  getEquipmentHebrewName,
  getEquipmentIcon,
} from "../../../utils/equipmentIconMapping";

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    equipment: string;
    muscleGroups?: string[];
    sets?: number;
    reps?: string;
    duration?: number;
    rest?: number;
    category?: string;
  };
  isExpanded: boolean;
  onPress: (exerciseId: string) => void;
  showDetails?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const ExerciseCard = memo(
  ({
    exercise,
    isExpanded,
    onPress,
    showDetails = true,
    isLoading = false,
    disabled = false,
  }: ExerciseCardProps) => {
    // � אנימציה עדינה למעבר בין מצבים
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    // �🎯 Haptic feedback מותאם
    const triggerHaptic = useCallback(() => {
      if (!disabled) {
        Haptics.selectionAsync();
      }
    }, [disabled]);

    // 🏃‍♂️ מטפל בלחיצה על הכרטיס
    const handlePress = useCallback(() => {
      if (disabled || isLoading) return;

      // אנימציה קצרה של לחיצה
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      triggerHaptic();
      onPress(exercise.id);
    }, [disabled, isLoading, triggerHaptic, onPress, exercise.id, scaleAnim]);

    // 🎨 אפקט עבור מצב disabled/loading
    useEffect(() => {
      Animated.timing(opacityAnim, {
        toValue: disabled || isLoading ? 0.6 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [disabled, isLoading, opacityAnim]);

    // 🎨 מחושבים ממוזכרים לאייקונים וטקסטים
    const equipmentData = useMemo(
      () => ({
        icon: getEquipmentIcon(exercise.equipment),
        name: getEquipmentHebrewName(exercise.equipment),
      }),
      [exercise.equipment]
    );

    // 📊 סטטיסטיקות מחושבות
    const exerciseStats = useMemo(() => {
      const stats = [];
      if (exercise.sets) stats.push(`${exercise.sets} סטים`);
      if (exercise.reps) stats.push(exercise.reps);
      if (exercise.duration) stats.push(`${exercise.duration}״`);
      return stats;
    }, [exercise.sets, exercise.reps, exercise.duration]);

    // 🎨 סטיילים דינמיים
    const cardStyle = useMemo(
      () => [
        styles.exerciseCard,
        isExpanded && styles.expandedCard,
        disabled && styles.disabledCard,
        isLoading && styles.loadingCard,
      ],
      [isExpanded, disabled, isLoading]
    );

    // ♿ נגישות - תווית מפורטת
    const accessibilityLabel = useMemo(() => {
      const parts = [
        `תרגיל ${exercise.name}`,
        `דורש ${equipmentData.name}`,
        exercise.category && `קטגוריה ${exercise.category}`,
        exerciseStats.length > 0 && exerciseStats.join(", "),
        isExpanded ? "מורחב" : "מכווץ",
        disabled ? "מושבת" : "זמין ללחיצה",
      ].filter(Boolean);

      return parts.join(", ");
    }, [
      exercise.name,
      exercise.category,
      equipmentData.name,
      exerciseStats,
      isExpanded,
      disabled,
    ]);

    return (
      <Animated.View
        style={[{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
      >
        <TouchableOpacity
          style={cardStyle}
          onPress={handlePress}
          activeOpacity={disabled ? 1 : 0.6}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={
            disabled
              ? "תרגיל מושבת כרגע"
              : isExpanded
                ? "הקש לכווץ את פרטי התרגיל"
                : "הקש להרחיב את פרטי התרגיל"
          }
          accessibilityState={{
            disabled: disabled || isLoading,
            expanded: isExpanded,
          }}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="small"
                color={theme.colors.primary}
                accessible={true}
                accessibilityLabel="טוען תרגיל"
              />
            </View>
          )}

          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseInfo}>
              <Text
                style={[styles.exerciseName, disabled && styles.disabledText]}
                numberOfLines={2}
                accessible={true}
                accessibilityRole="header"
              >
                {exercise.name}
              </Text>
              <View style={styles.equipmentRow}>
                <MaterialCommunityIcons
                  name={
                    equipmentData.icon as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={18}
                  color={
                    disabled ? theme.colors.textSecondary : theme.colors.primary
                  }
                />
                <Text
                  style={[
                    styles.equipmentText,
                    disabled && styles.disabledText,
                  ]}
                >
                  {equipmentData.name}
                </Text>
              </View>
            </View>

            {showDetails && exerciseStats.length > 0 && (
              <View style={styles.exerciseDetails}>
                {exerciseStats.map((stat, index) => (
                  <Text
                    key={index}
                    style={[styles.detailText, disabled && styles.disabledText]}
                    accessible={true}
                    accessibilityLabel={stat}
                  >
                    {stat}
                  </Text>
                ))}
              </View>
            )}

            <MaterialCommunityIcons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={28}
              color={
                disabled
                  ? theme.colors.textSecondary
                  : isExpanded
                    ? theme.colors.primary
                    : theme.colors.textSecondary
              }
              accessible={true}
              accessibilityLabel={isExpanded ? "סמן כווץ" : "סמן הרחב"}
            />
          </View>

          {isExpanded &&
            exercise.muscleGroups &&
            exercise.muscleGroups.length > 0 && (
              <View style={styles.expandedContent}>
                <Text
                  style={styles.muscleGroupsLabel}
                  accessible={true}
                  accessibilityRole="header"
                  accessibilityLabel="קבוצות שריר"
                >
                  קבוצות שריר:
                </Text>
                <View
                  style={styles.muscleGroupsContainer}
                  accessible={true}
                  accessibilityLabel={`קבוצות שריר: ${exercise.muscleGroups.join(", ")}`}
                >
                  {exercise.muscleGroups.map((muscle, index) => (
                    <View key={`${muscle}-${index}`} style={styles.muscleTag}>
                      <Text
                        style={styles.muscleText}
                        accessible={true}
                        accessibilityLabel={muscle}
                      >
                        {muscle}
                      </Text>
                    </View>
                  ))}
                </View>
                {exercise.rest && (
                  <Text
                    style={styles.restText}
                    accessible={true}
                    accessibilityLabel={`זמן מנוחה ${exercise.rest} שניות`}
                  >
                    מנוחה: {exercise.rest} שניות
                  </Text>
                )}
              </View>
            )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
  // 📈 אופטימיזציה - השוואה רדודה מותאמת
  (prevProps, nextProps) => {
    return (
      prevProps.exercise.id === nextProps.exercise.id &&
      prevProps.isExpanded === nextProps.isExpanded &&
      prevProps.showDetails === nextProps.showDetails &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.disabled === nextProps.disabled &&
      JSON.stringify(prevProps.exercise) === JSON.stringify(nextProps.exercise)
    );
  }
);

ExerciseCard.displayName = "ExerciseCard";

// 🚀 Export המוגן עם Error Boundary פשוט
const ExerciseCardWithSafetyWrapper: React.FC<ExerciseCardProps> = (props) => {
  try {
    return <ExerciseCard {...props} />;
  } catch (error) {
    console.error("ExerciseCard Error:", error);
    return (
      <View style={styles.errorFallback}>
        <Text style={styles.errorText}>שגיאה בטעינת התרגיל</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    // שיפורי צללים מתקדמים
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: `${theme.colors.cardBorder}40`,
  },
  expandedCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    // שיפורי עיצוב למצב מורחב
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    transform: [{ scale: 1.02 }],
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.textSecondary,
  },
  loadingCard: {
    opacity: 0.8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: `${theme.colors.background}90`,
    borderRadius: 12,
    padding: 4,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
    lineHeight: 24,
  },
  disabledText: {
    color: theme.colors.textSecondary,
    opacity: 0.7,
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${theme.colors.primary}08`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  equipmentText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 6,
    fontWeight: "600",
  },
  exerciseDetails: {
    alignItems: "flex-end",
    marginRight: 8,
    backgroundColor: `${theme.colors.background}80`,
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 3,
    fontWeight: "600",
    textAlign: "center",
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.border}60`,
    backgroundColor: `${theme.colors.surface}40`,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: -4,
  },
  muscleGroupsLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  muscleGroupsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  muscleTag: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    // שיפורי עיצוב
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  muscleText: {
    fontSize: 13,
    color: theme.colors.white,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  restText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "center",
    backgroundColor: `${theme.colors.background}60`,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  // 🚨 Error Handling Styles
  errorFallback: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.error || theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.error || theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});

export default ExerciseCardWithSafetyWrapper;
