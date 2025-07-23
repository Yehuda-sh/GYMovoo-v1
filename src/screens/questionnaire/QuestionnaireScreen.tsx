/**
 * @file src/screens/questionnaire/QuestionnaireScreen.tsx
 * @brief מסך שאלון התאמה אישית לאיסוף מידע על המשתמש
 * @dependencies userStore (Zustand), React Navigation
 * @notes כולל אנימציות מעבר בין שאלות ותמיכה בסוגי שאלות שונים
 * @recurring_errors בעיות RTL באייקוני חצים וכיווניות
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// שאלות מורחבות ומשופרות // Enhanced questions
const QUESTIONS = [
  {
    id: 0,
    question: "מה הגיל שלך?",
    icon: "calendar",
    type: "single",
    options: ["מתחת ל-16", "16-25", "26-35", "36-45", "46-55", "56+"],
  },
  {
    id: 1,
    question: "מה המין שלך?",
    icon: "gender-male-female",
    type: "single",
    options: ["זכר", "נקבה", "אחר/מעדיף לא לענות"],
  },
  {
    id: 2,
    question: "מה מטרת האימון העיקרית שלך?",
    icon: "target",
    type: "single",
    options: [
      "ירידה במשקל",
      "עליה במסת שריר",
      "שיפור כוח",
      "שיפור סיבולת",
      "בריאות כללית",
      "שיקום מפציעה",
    ],
  },
  {
    id: 3,
    question: "מה רמת הניסיון שלך באימונים?",
    icon: "arm-flex",
    type: "single",
    options: [
      "מתחיל (0-6 חודשים)",
      "בינוני (6-24 חודשים)",
      "מתקדם (2+ שנים)",
      "מקצועי",
    ],
  },
  {
    id: 4,
    question: "כמה פעמים בשבוע אתה יכול להתאמן?",
    icon: "calendar-week",
    type: "single",
    options: ["1-2", "3-4", "5-6", "כל יום"],
  },
  {
    id: 5,
    question: "כמה זמן יש לך לכל אימון?",
    icon: "clock-outline",
    type: "single",
    options: ["30 דקות או פחות", "30-45 דקות", "45-60 דקות", "60+ דקות"],
  },
  {
    id: 6,
    question: "איפה אתה מתכנן להתאמן?",
    icon: "dumbbell",
    type: "multiple",
    options: ["חדר כושר", "בית", "פארק/חוץ", "סטודיו"],
  },
  {
    id: 7,
    question: "אילו פציעות או מגבלות יש לך?",
    icon: "medical-bag",
    type: "text",
    placeholder: "לדוגמה: כאבי גב, ברכיים רגישות... (לא חובה)",
  },
  {
    id: 8,
    question: "מה הציוד הזמין לך?",
    icon: "weight",
    type: "multiple",
    options: [
      "משקולות חופשיות",
      "מכונות",
      "גומיות התנגדות",
      "מוט מתח",
      "כדור פיזיו",
      "ללא ציוד",
    ],
  },
];

export default function QuestionnaireScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  const setQuestionnaire = useUserStore((s) => s.setQuestionnaire);

  useEffect(() => {
    // אנימציית progress bar // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / QUESTIONS.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  // אנימציית שגיאה // Error animation
  const showError = (message: string) => {
    setError(message);
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
  };

  // בחירת אפשרות בודדת // Single option selection
  const handleSingleOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
    setError(null);
  };

  // בחירת אפשרויות מרובות // Multiple options selection
  const handleMultipleOption = (option: string) => {
    const current = answers[currentIndex] || [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, [currentIndex]: updated }));
    setError(null);
  };

  // מעבר לשאלה הבאה // Move to next question
  const handleNext = () => {
    const question = QUESTIONS[currentIndex];

    // בדיקות תקינות // Validation
    if (currentIndex === 0 && answers[0] === "מתחת ל-16") {
      showError("ההרשמה מותרת רק מגיל 16 ומעלה");
      return;
    }

    if (question.type === "text") {
      // שאלת טקסט לא חובה // Text question is optional
      if (textInput.trim()) {
        setAnswers((prev) => ({ ...prev, [currentIndex]: textInput.trim() }));
      }
    } else if (
      question.type === "multiple" &&
      (!answers[currentIndex] || answers[currentIndex].length === 0)
    ) {
      showError("נא לבחור לפחות אפשרות אחת");
      return;
    } else if (question.type === "single" && !answers[currentIndex]) {
      showError("נא לבחור אפשרות");
      return;
    }

    // אנימציית מעבר // Transition animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setTextInput("");
        setError(null);

        // איפוס ואנימציית כניסה // Reset and entry animation
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // סיום השאלון // Questionnaire completion
        console.log("📝 Questionnaire completed:", answers);
        setQuestionnaire(answers);
        navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
      }
    });
  };

  // חזרה לשאלה הקודמת // Go back to previous question
  const handleBack = () => {
    if (currentIndex > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(currentIndex - 1);
        setError(null);
        slideAnim.setValue(-50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const question = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with progress */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={[
                styles.backButton,
                currentIndex === 0 && { opacity: 0.3 },
              ]}
              disabled={currentIndex === 0}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={32}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {currentIndex + 1} מתוך {QUESTIONS.length}
              </Text>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={28}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Question content */}
          <Animated.View
            style={[
              styles.questionContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateX: slideAnim },
                  { translateX: errorShake },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons
              name={question.icon as any}
              size={80} // הגדלת האייקון
              color={theme.colors.primary} // שינוי לצבע ראשי
              style={styles.questionIcon}
            />

            <Text style={styles.questionText}>{question.question}</Text>

            {/* Options */}
            {question.type === "single" && (
              <View style={styles.optionsContainer}>
                {question.options?.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      answers[currentIndex] === option && styles.selectedOption,
                    ]}
                    onPress={() => handleSingleOption(option)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        answers[currentIndex] === option &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {answers[currentIndex] === option && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color={theme.colors.text}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {question.type === "multiple" && (
              <View style={styles.optionsContainer}>
                {question.options?.map((option) => {
                  const isSelected = answers[currentIndex]?.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => handleMultipleOption(option)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                      <MaterialCommunityIcons
                        name={
                          isSelected
                            ? "checkbox-marked"
                            : "checkbox-blank-outline"
                        }
                        size={24}
                        color={
                          isSelected
                            ? theme.colors.text
                            : theme.colors.textSecondary
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
                <Text style={styles.multipleHint}>
                  ניתן לבחור יותר מאפשרות אחת
                </Text>
              </View>
            )}

            {question.type === "text" && (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={textInput}
                  onChangeText={setTextInput}
                  placeholder={question.placeholder}
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  maxLength={200}
                  textAlign="right"
                />
                <Text style={styles.textCounter}>{textInput.length}/200</Text>
              </View>
            )}

            {/* Error message */}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </Animated.View>

          {/* Bottom buttons */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                !answers[currentIndex] &&
                  question.type !== "text" &&
                  styles.disabledButton,
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  !answers[currentIndex] && question.type !== "text"
                    ? [theme.colors.divider, theme.colors.divider]
                    : [
                        theme.colors.primaryGradientStart,
                        theme.colors.primaryGradientEnd,
                      ]
                }
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {isLastQuestion ? "סיים שאלון" : "המשך"}
                </Text>
                <MaterialCommunityIcons
                  name={isLastQuestion ? "check" : "chevron-right"}
                  size={24}
                  color={theme.colors.text}
                />
              </LinearGradient>
            </TouchableOpacity>

            {question.type === "text" && (
              <TouchableOpacity
                onPress={() => {
                  setTextInput("");
                  handleNext();
                }}
                style={styles.skipButton}
              >
                <Text style={styles.skipText}>דלג</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background + "F0", // רקע חצי שקוף
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  progressText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 6, // גובה מוגדל
    backgroundColor: theme.colors.divider,
    borderRadius: 3,
    overflow: "hidden",
    ...theme.shadows.small, // הוספת צל עדין
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary, // שינוי לצבע ראשי
    borderRadius: 3,
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  questionIcon: {
    marginBottom: theme.spacing.lg,
  },
  questionText: {
    fontSize: 26, // הגדלת הפונט
    fontWeight: "600", // משקל פונט מודרני
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    writingDirection: "rtl",
    lineHeight: 36,
  },
  optionsContainer: {
    width: "100%",
    maxWidth: 400,
  },
  optionButton: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 16, // עיצוב מודרני
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium, // הוספת צללים
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryGradientStart + "15", // רקע עדין לבחירה
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: "right", // RTL
  },
  selectedOptionText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  multipleHint: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  textInputContainer: {
    width: "100%",
    maxWidth: 400,
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: 16, // עיצוב מודרני
    padding: theme.spacing.lg,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    writingDirection: "rtl",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small, // הוספת צללים עדינים
  },
  textCounter: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: "left", // נשאר left כי זה מונה באנגלית
    marginTop: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  bottomContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: "auto",
    paddingTop: theme.spacing.xl,
  },
  nextButton: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonGradient: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16, // עיצוב מודרני
    gap: theme.spacing.sm,
    ...theme.shadows.medium, // הוספת צללים
  },
  nextButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    alignSelf: "center",
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  skipText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
});

