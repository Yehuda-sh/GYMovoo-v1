/**
 * @file src/screens/questionnaire/DynamicQuestionnaireScreen.tsx
 * @brief מסך שאלון דינמי וחכם - מתאים שאלות לפי תשובות קודמות
 * @dependencies userStore (Zustand), React Navigation
 * @notes שאלות מותאמות אישית, לוגיקה דינמית, אנימציות חלקות
 * @recurring_errors וודא RTL מלא וזרימת נתונים נכונה
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import HeightSlider from "./HeightSlider";
import WeightSlider from "./WeightSlider";
import EquipmentSelector from "./EquipmentSelector";
import {
  getRelevantQuestions,
  Question,
  OptionWithImage,
  QuestionType,
} from "../../data/questionnaireData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DynamicQuestionnaireScreen({ navigation }: any) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState("");

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  const setQuestionnaire = useUserStore((s) => s.setQuestionnaire);

  // חישוב השאלות הרלוונטיות // Calculate relevant questions
  const relevantQuestions = useMemo(() => {
    return getRelevantQuestions(answers);
  }, [answers]);

  // השאלה הנוכחית // Current question
  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const totalQuestions = relevantQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // עדכון progress bar // Update progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / totalQuestions,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex, totalQuestions]);

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
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setError(null);
  };

  // בחירת אפשרויות מרובות // Multiple options selection
  const handleMultipleOption = (option: string) => {
    const current = answers[currentQuestion.id] || [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: updated }));
    setError(null);
  };

  // טיפול בקלט מספרי // Handle number input
  const handleNumberInput = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: num }));
      setError(null);
    }
  };

  // מעבר לשאלה הבאה // Move to next question
  const handleNext = () => {
    // בדיקת גיל בתחילה
    if (currentQuestion.id === "age" && answers.age === "מתחת ל-16") {
      Alert.alert("הגבלת גיל", "ההרשמה מותרת רק מגיל 16 ומעלה", [
        { text: "הבנתי", onPress: () => navigation.goBack() },
      ]);
      return;
    }

    // בדיקות תקינות // Validation
    if (currentQuestion.required) {
      if (currentQuestion.type === "text" && !textInput.trim()) {
        showError("נא למלא את השדה");
        return;
      } else if (currentQuestion.type === "number" && !numberInput) {
        showError("נא להזין מספר");
        return;
      } else if (
        currentQuestion.type === "multiple" &&
        (!answers[currentQuestion.id] ||
          answers[currentQuestion.id].length === 0)
      ) {
        showError("נא לבחור לפחות אפשרות אחת");
        return;
      } else if (
        currentQuestion.type === "single" &&
        !answers[currentQuestion.id]
      ) {
        showError("נא לבחור אפשרות");
        return;
      } else if (
        currentQuestion.type === "height" &&
        !answers[currentQuestion.id]
      ) {
        showError("נא לבחור גובה");
        return;
      } else if (
        currentQuestion.type === "weight" &&
        !answers[currentQuestion.id]
      ) {
        showError("נא לבחור משקל");
        return;
      }
    }

    // שמירת תשובות טקסט/מספר
    if (currentQuestion.type === "text" && textInput.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: textInput.trim(),
      }));
    } else if (currentQuestion.type === "number" && numberInput) {
      const num = parseInt(numberInput);
      if (currentQuestion.min && num < currentQuestion.min) {
        showError(`הערך המינימלי הוא ${currentQuestion.min}`);
        return;
      }
      if (currentQuestion.max && num > currentQuestion.max) {
        showError(`הערך המקסימלי הוא ${currentQuestion.max}`);
        return;
      }
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: num }));
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
      if (!isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTextInput("");
        setNumberInput("");
        setError(null);

        // איפוס ואנימציית כניסה
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
        // סיום השאלון
        finishQuestionnaire();
      }
    });
  };

  // סיום השאלון // Finish questionnaire
  const finishQuestionnaire = () => {
    console.log("📝 Questionnaire completed:", answers);

    // המרת התשובות לפורמט הישן לתאימות
    const formattedAnswers: { [key: number]: any } = {};
    let index = 0;

    // מיפוי התשובות החדשות לפורמט הישן
    if (answers.age) formattedAnswers[index++] = answers.age;
    if (answers.gender) formattedAnswers[index++] = answers.gender;
    if (answers.goal) formattedAnswers[index++] = answers.goal;
    if (answers.experience) formattedAnswers[index++] = answers.experience;
    if (answers.frequency) formattedAnswers[index++] = answers.frequency;
    if (answers.duration) formattedAnswers[index++] = answers.duration;
    if (answers.location) formattedAnswers[index++] = answers.location;
    if (answers.health_conditions)
      formattedAnswers[index++] = answers.health_conditions.join(", ");
    if (answers.equipment) formattedAnswers[index++] = answers.equipment;

    // שמירת כל הנתונים המורחבים גם ב-metadata
    const metadata = {
      ...answers,
      completedAt: new Date().toISOString(),
      version: "2.0",
    };

    // שמירה ב-store
    setQuestionnaire(formattedAnswers);

    // שמירת metadata נוסף אם יש צורך
    // await AsyncStorage.setItem('questionnaire_metadata', JSON.stringify(metadata));

    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  // חזרה לשאלה הקודמת // Go back to previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
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
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setError(null);

        // שחזור ערכים קודמים
        const prevQuestion = relevantQuestions[currentQuestionIndex - 1];
        if (prevQuestion.type === "text") {
          setTextInput(answers[prevQuestion.id] || "");
        } else if (prevQuestion.type === "number") {
          setNumberInput(answers[prevQuestion.id]?.toString() || "");
        }

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

  // קבלת אפשרויות דינמיות // Get dynamic options
  const getOptions = () => {
    if (currentQuestion.dynamicOptions) {
      return currentQuestion.dynamicOptions(answers);
    }
    return currentQuestion.options || [];
  };

  // בדיקה אם השאלה הנוכחית היא עם רכיב מיוחד
  const isEquipmentQuestion =
    currentQuestion.id === "home_equipment" ||
    currentQuestion.id === "gym_equipment";

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
                currentQuestionIndex === 0 && { opacity: 0.3 },
              ]}
              disabled={currentQuestionIndex === 0}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={32}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {currentQuestionIndex + 1} מתוך {totalQuestions}
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
              onPress={() => {
                Alert.alert(
                  "יציאה מהשאלון",
                  "האם אתה בטוח שברצונך לצאת? התשובות לא יישמרו",
                  [
                    { text: "ביטול", style: "cancel" },
                    {
                      text: "יציאה",
                      style: "destructive",
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              }}
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
              name={currentQuestion.icon as any}
              size={80}
              color={theme.colors.primary}
              style={styles.questionIcon}
            />

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {currentQuestion.helpText && (
              <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
            )}

            {/* Options based on question type */}
            {currentQuestion.type === "single" && (
              <View style={styles.optionsContainer}>
                {getOptions().map((option) => {
                  const optionLabel =
                    typeof option === "string" ? option : option.label;
                  const optionKey =
                    typeof option === "string" ? option : option.id;

                  return (
                    <TouchableOpacity
                      key={optionKey}
                      style={[
                        styles.optionButton,
                        answers[currentQuestion.id] === optionKey &&
                          styles.selectedOption,
                      ]}
                      onPress={() => handleSingleOption(optionKey)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          answers[currentQuestion.id] === optionKey &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {optionLabel}
                      </Text>
                      {answers[currentQuestion.id] === optionKey && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color={theme.colors.text}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {currentQuestion.type === "multiple" && (
              <>
                {/* בדוק אם יש אופציות עם תמונות */}
                {currentQuestion.dynamicOptions &&
                typeof getOptions()[0] === "object" ? (
                  <EquipmentSelector
                    options={getOptions() as OptionWithImage[]}
                    selectedItems={answers[currentQuestion.id] || []}
                    onChange={(items) => {
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: items,
                      }));
                      setError(null);
                    }}
                    defaultItems={currentQuestion.defaultValue}
                    helpText={currentQuestion.helpText}
                    subtitle={currentQuestion.subtitle}
                  />
                ) : (
                  <View style={styles.optionsContainer}>
                    {getOptions().map((option) => {
                      const optionLabel =
                        typeof option === "string" ? option : option.label;
                      const optionKey =
                        typeof option === "string" ? option : option.id;
                      const isSelected =
                        answers[currentQuestion.id]?.includes(optionKey);

                      return (
                        <TouchableOpacity
                          key={optionKey}
                          style={[
                            styles.optionButton,
                            isSelected && styles.selectedOption,
                          ]}
                          onPress={() => handleMultipleOption(optionKey)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              isSelected && styles.selectedOptionText,
                            ]}
                          >
                            {optionLabel}
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
              </>
            )}

            {currentQuestion.type === "text" && (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={textInput}
                  onChangeText={setTextInput}
                  placeholder={currentQuestion.placeholder}
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  maxLength={500}
                  textAlign="right"
                />
                <Text style={styles.textCounter}>{textInput.length}/500</Text>
              </View>
            )}

            {currentQuestion.type === "number" && (
              <View style={styles.numberInputContainer}>
                <TextInput
                  style={styles.numberInput}
                  value={numberInput}
                  onChangeText={setNumberInput}
                  placeholder={currentQuestion.placeholder}
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={3}
                  textAlign="center"
                />
                {currentQuestion.unit && (
                  <Text style={styles.unitText}>{currentQuestion.unit}</Text>
                )}
              </View>
            )}

            {currentQuestion.type === "height" && (
              <HeightSlider
                value={answers[currentQuestion.id] || 170}
                onChange={(height) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: height,
                  }));
                  setError(null);
                }}
                minHeight={currentQuestion.min}
                maxHeight={currentQuestion.max}
              />
            )}

            {currentQuestion.type === "weight" && (
              <WeightSlider
                value={answers[currentQuestion.id] || 70}
                onChange={(weight) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: weight,
                  }));
                  setError(null);
                }}
                minWeight={currentQuestion.min}
                maxWeight={currentQuestion.max}
              />
            )}

            {/* Error message */}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </Animated.View>

          {/* Bottom buttons */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                !answers[currentQuestion.id] &&
                  currentQuestion.type !== "text" &&
                  currentQuestion.type !== "number" &&
                  currentQuestion.required &&
                  styles.disabledButton,
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  !answers[currentQuestion.id] &&
                  currentQuestion.type !== "text" &&
                  currentQuestion.type !== "number" &&
                  currentQuestion.required
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
                  name={isLastQuestion ? "check" : "arrow-left"}
                  size={24}
                  color={theme.colors.text}
                />
              </LinearGradient>
            </TouchableOpacity>

            {!currentQuestion.required &&
              currentQuestionIndex < totalQuestions - 1 && (
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleNext}
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
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
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
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.divider,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  questionIcon: {
    marginBottom: theme.spacing.lg,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  optionsContainer: {
    width: "100%",
    maxWidth: 400,
    marginTop: theme.spacing.lg,
  },
  optionButton: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 16,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryGradientStart + "15",
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
    marginTop: theme.spacing.lg,
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.lg,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    writingDirection: "rtl",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  textCounter: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: "left",
    marginTop: theme.spacing.xs,
  },
  numberInputContainer: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  numberInput: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.lg,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    minWidth: 120,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  unitText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    fontWeight: "600",
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
    borderRadius: 16,
    gap: theme.spacing.sm,
    ...theme.shadows.medium,
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
