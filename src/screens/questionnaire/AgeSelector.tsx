/**
 * @file src/components/questionnaire/AgeSelector.tsx
 * @brief קומפוננטת בחירת גיל היברידית - משלבת בחירה מהירה עם אפשרות לדיוק
 * @brief Hybrid age selection component - combines quick selection with precise option
 * @dependencies React Native, theme
 * @notes תומך RTL מלא, אנימציות חלקות, נגישות מלאה
 * @notes Full RTL support, smooth animations, full accessibility
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
  Platform,
  Dimensions,
  Vibration,
  AccessibilityInfo,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
// import * as Haptics from 'expo-haptics'; // אם מותקן
// If expo-haptics is not installed, we'll use Vibration API

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// טווחי גיל עם אמוג'י
// Age ranges with emojis
const AGE_RANGES = [
  { id: "16-25", label: "16-25", emoji: "🎓", description: "צעיר ומלא אנרגיה" },
  { id: "26-35", label: "26-35", emoji: "💼", description: "בשיא הכושר" },
  { id: "36-45", label: "36-45", emoji: "🏃", description: "פעיל ומנוסה" },
  { id: "46-55", label: "46-55", emoji: "💪", description: "חזק ויציב" },
  { id: "56+", label: "56+", emoji: "🌟", description: "ניסיון וחוכמה" },
];

interface AgeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  onAutoNext?: (value: string) => void; // שינוי: מעביר את הערך
  // Changed: passes the value
}

export default function AgeSelector({
  value,
  onChange,
  error,
  onAutoNext,
}: AgeSelectorProps) {
  // מצב הקומפוננטה
  // Component state
  const [selectedRange, setSelectedRange] = useState<string | null>(
    value || null
  );
  const [showPreciseModal, setShowPreciseModal] = useState(false);
  const [preciseAge, setPreciseAge] = useState("");
  const [showPreciseOption, setShowPreciseOption] = useState(false);

  // אנימציות
  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const preciseButtonOpacity = useRef(new Animated.Value(0)).current;
  const rangeAnimations = useRef(
    AGE_RANGES.map(() => new Animated.Value(0))
  ).current;

  // אנימציית כניסה
  // Entry animation
  useEffect(() => {
    // אנימציה מדורגת של הכפתורים
    // Staggered animation of buttons
    const animations = rangeAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      })
    );

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      ...animations,
    ]).start(() => {
      // הצגת כפתור הדיוק אחרי האנימציה
      // Show precise button after animation
      setTimeout(() => {
        setShowPreciseOption(true);
        Animated.timing(preciseButtonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 200);
    });
  }, []);

  // אנימציית שגיאה
  // Error animation
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorShake, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShake, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShake, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShake, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  // בחירת טווח גיל
  // Select age range
  const handleRangeSelect = (range: string) => {
    // הפעלת haptic feedback
    // Trigger haptic feedback
    // משתמשים ב-Vibration API שתמיד זמין
    // Using Vibration API which is always available
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Vibration.vibrate(50);
    }

    // אנימציית לחיצה
    // Press animation
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

    setSelectedRange(range);
    onChange(range);

    // הודעה לקורא מסך
    // Screen reader announcement
    const selectedRangeData = AGE_RANGES.find((r) => r.id === range);
    if (selectedRangeData) {
      AccessibilityInfo.announceForAccessibility(
        `נבחר טווח גילאים ${selectedRangeData.label}, ${selectedRangeData.description}`
      );
    }

    // מעבר אוטומטי לשאלה הבאה אחרי השהיה קצרה
    // Auto-navigate to next question after short delay
    if (onAutoNext) {
      setTimeout(() => {
        onAutoNext(range); // מעביר את הערך ישירות
      }, 300); // חזרנו ל-300ms כי עכשיו לא צריך לחכות ל-state
    }
  };

  // טיפול בגיל מדויק
  // Handle precise age
  const handlePreciseAge = () => {
    const age = parseInt(preciseAge);
    if (isNaN(age) || age < 16 || age > 120) {
      Animated.sequence([
        Animated.timing(errorShake, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShake, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(errorShake, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    onChange(`${age}`);
    setShowPreciseModal(false);
    setPreciseAge("");

    // הודעה לקורא מסך
    // Screen reader announcement
    AccessibilityInfo.announceForAccessibility(`נבחר גיל ${age}`);

    // מעבר אוטומטי גם כשבוחרים גיל מדויק
    // Auto-navigate also when selecting precise age
    if (onAutoNext) {
      setTimeout(() => {
        onAutoNext(`${age}`); // מעביר את הערך ישירות
      }, 300); // חזרנו ל-300ms
    }
  };

  // רנדור כפתור טווח גיל
  // Render age range button
  const renderAgeButton = (range: (typeof AGE_RANGES)[0], index: number) => {
    const isSelected = selectedRange === range.id;

    return (
      <Animated.View
        key={range.id}
        style={[
          styles.ageButtonWrapper,
          {
            opacity: rangeAnimations[index],
            transform: [
              {
                translateY: rangeAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              { scale: isSelected ? scaleAnim : 1 },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.ageButton, isSelected && styles.ageButtonSelected]}
          onPress={() => handleRangeSelect(range.id)}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`טווח גילאים ${range.label}`}
          accessibilityHint={range.description}
          accessibilityState={{ selected: isSelected }}
        >
          <Text style={styles.ageEmoji}>{range.emoji}</Text>
          <Text
            style={[styles.ageLabel, isSelected && styles.ageLabelSelected]}
          >
            {range.label}
          </Text>
          <Text
            style={[
              styles.ageDescription,
              isSelected && styles.ageDescriptionSelected,
            ]}
          >
            {range.description}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateX: errorShake }],
        },
      ]}
    >
      {/* רשת כפתורי גיל */}
      {/* Age buttons grid */}
      <View style={styles.ageGrid}>
        {AGE_RANGES.map((range, index) => renderAgeButton(range, index))}
      </View>

      {/* כפתור גיל מדויק */}
      {/* Precise age button */}
      {showPreciseOption && (
        <Animated.View
          style={[
            styles.preciseButtonContainer,
            { opacity: preciseButtonOpacity },
          ]}
        >
          <TouchableOpacity
            style={styles.preciseButton}
            onPress={() => setShowPreciseModal(true)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="ציין גיל מדויק"
            accessibilityHint="לחץ כדי להזין את הגיל המדויק שלך"
          >
            <MaterialCommunityIcons
              name="numeric"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.preciseButtonText}>רוצה לציין גיל מדויק?</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* הודעת שגיאה */}
      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color={theme.colors.error}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* מודל גיל מדויק */}
      {/* Precise age modal */}
      <Modal
        visible={showPreciseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreciseModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPreciseModal(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateX: errorShake }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.modalTitle}>הזן את הגיל שלך</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.ageInput}
                  value={preciseAge}
                  onChangeText={setPreciseAge}
                  keyboardType="numeric"
                  placeholder="18"
                  placeholderTextColor={theme.colors.textSecondary}
                  maxLength={3}
                  autoFocus
                  accessible={true}
                  accessibilityLabel="שדה הזנת גיל"
                  accessibilityHint="הזן את הגיל שלך בספרות"
                />
                <Text style={styles.yearLabel}>שנים</Text>
              </View>

              <Text style={styles.modalHint}>
                גיל מינימלי: 16 | גיל מקסימלי: 120
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowPreciseModal(false);
                    setPreciseAge("");
                  }}
                >
                  <Text style={styles.cancelButtonText}>ביטול</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handlePreciseAge}
                >
                  <Text style={styles.confirmButtonText}>אישור</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  ageGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  ageButtonWrapper: {
    width: "48%",
  },
  ageButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    ...theme.shadows.small,
  },
  ageButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + "15",
  },
  ageEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  ageLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  ageLabelSelected: {
    color: theme.colors.primary,
  },
  ageDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  ageDescriptionSelected: {
    color: theme.colors.primary + "CC",
  },
  preciseButtonContainer: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  preciseButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  preciseButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  errorContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginRight: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 350,
    ...theme.shadows.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  ageInput: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    minWidth: 100,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: theme.spacing.sm,
  },
  yearLabel: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
  },
  modalHint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  modalButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
