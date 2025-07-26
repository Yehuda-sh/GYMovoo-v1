/**
 * @file src/screens/questionnaire/TwoStageQuestionnaireScreen.tsx
 * @brief מסך שאלון דו-שלבי - אימונים ופרופיל אישי
 * @brief Two-stage questionnaire - training and personal profile
 * @dependencies userStore, twoStageQuestionnaireData, React Navigation
 * @notes שלב 1 חובה, שלב 2 אופציונלי
 * @recurring_errors וודא RTL וטיפול נכון במעברים בין שלבים
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
  Alert,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import Toast from "react-native-toast-message";
import {
  getTrainingQuestions,
  getProfileQuestions,
  QUESTIONNAIRE_STAGES,
  hasCompletedTrainingStage,
  hasCompletedProfileStage,
} from "../../data/twoStageQuestionnaireData";
import { Question, OptionWithImage } from "../../data/questionnaireData";
import HeightSlider from "./HeightSlider";
import WeightSlider from "./WeightSlider";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  navigation: any;
  route: {
    params?: {
      stage?: "training" | "profile";
      fromSettings?: boolean;
    };
  };
}

export default function TwoStageQuestionnaireScreen({
  navigation,
  route,
}: Props) {
  const { setQuestionnaire, user } = useUserStore();

  // קביעת השלב הנוכחי
  const initialStage = route.params?.stage || "training";
  const fromSettings = route.params?.fromSettings || false;

  // ניהול מצב
  const [currentStage, setCurrentStage] = useState<"training" | "profile">(
    initialStage
  );
  const [answers, setAnswers] = useState<{ [key: string]: any }>(
    user?.questionnaire || {}
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // קבלת שאלות לפי השלב
  const questions =
    currentStage === "training"
      ? getTrainingQuestions(answers)
      : getProfileQuestions();

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stageTransitionAnim = useRef(new Animated.Value(0)).current;

  // עדכון progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // טעינת תשובות קיימות לשאלה הנוכחית
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers[currentQuestion.id];
      if (existingAnswer) {
        if (currentQuestion.type === "multiple") {
          setSelectedMultiple(
            Array.isArray(existingAnswer) ? existingAnswer : []
          );
        } else if (currentQuestion.type === "text") {
          setTextInput(existingAnswer || "");
        }
      }
    }
  }, [currentQuestionIndex, currentQuestion]);

  // פונקציות עזר
  const animateTransition = (isForward: boolean, callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isForward ? -50 : 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(isForward ? 50 : -50);
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
  };

  const handleAnswer = (answer: any) => {
    setError("");
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    // אם זו שאלת בחירה יחידה, עבור אוטומטית
    if (currentQuestion.type === "single") {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleNext = () => {
    // וידוא שיש תשובה אם השאלה חובה
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setError("אנא בחר תשובה כדי להמשיך");
      return;
    }

    // שמירת תשובות לשאלות מיוחדות
    if (currentQuestion.type === "multiple") {
      if (selectedMultiple.length === 0 && currentQuestion.required) {
        setError("אנא בחר לפחות אפשרות אחת");
        return;
      }
      answers[currentQuestion.id] = selectedMultiple;
    } else if (currentQuestion.type === "text") {
      answers[currentQuestion.id] = textInput;
    }

    // בדיקה אם סיימנו את השלב
    if (currentQuestionIndex < totalQuestions - 1) {
      animateTransition(true, () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedMultiple([]);
        setTextInput("");
      });
    } else {
      // סיום השלב הנוכחי
      handleStageComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      animateTransition(false, () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      });
    }
  };

  const handleStageComplete = async () => {
    // שמירת התשובות
    await setQuestionnaire(answers);

    if (currentStage === "training") {
      // סיום שלב האימונים
      Alert.alert(
        "🎉 מעולה!",
        "סיימת את שלב האימונים. האם תרצה להמשיך לשלב הפרופיל האישי?",
        [
          {
            text: "המשך לפרופיל",
            onPress: () => transitionToProfileStage(),
          },
          {
            text: "סיים כאן",
            style: "cancel",
            onPress: () => navigateToHome(),
          },
        ]
      );
    } else {
      // סיום שלב הפרופיל
      Toast.show({
        type: "success",
        text1: "הפרופיל שלך הושלם! 🎊",
        text2: "כל הנתונים נשמרו בהצלחה",
      });
      navigateToHome();
    }
  };

  const transitionToProfileStage = () => {
    setIsTransitioning(true);

    Animated.timing(stageTransitionAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStage("profile");
      setCurrentQuestionIndex(0);
      setIsTransitioning(false);
      stageTransitionAnim.setValue(0);
    });
  };

  const navigateToHome = () => {
    if (fromSettings) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    }
  };

  const handleSkipProfile = () => {
    Alert.alert(
      "דילוג על פרופיל אישי",
      "תמיד תוכל להשלים את הפרופיל שלך מההגדרות",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "דלג",
          onPress: navigateToHome,
          style: "destructive",
        },
      ]
    );
  };

  // רינדור כפתורי אפשרויות
  const renderOptions = () => {
    if (!currentQuestion) return null;

    const options = currentQuestion.options || [];

    switch (currentQuestion.type) {
      case "single":
        return (
          <View style={styles.optionsContainer}>
            {options.map((option: string | OptionWithImage) => {
              const isOptionObject = typeof option === "object";
              const optionId = isOptionObject ? option.id : option;
              const optionLabel = isOptionObject ? option.label : option;
              const optionDescription = isOptionObject
                ? option.description
                : undefined;
              const optionIcon = isOptionObject
                ? (option as any).icon
                : undefined;
              const isSelected = answers[currentQuestion.id] === optionId;

              return (
                <TouchableOpacity
                  key={optionId}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswer(optionId)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    {optionIcon && (
                      <MaterialCommunityIcons
                        name={optionIcon}
                        size={28}
                        color={
                          isSelected ? theme.colors.text : theme.colors.primary
                        }
                        style={styles.optionIcon}
                      />
                    )}
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {optionLabel}
                      </Text>
                      {optionDescription && (
                        <Text style={styles.optionDescription}>
                          {optionDescription}
                        </Text>
                      )}
                    </View>
                  </View>
                  <MaterialCommunityIcons
                    name={
                      isSelected ? "checkbox-marked-circle" : "circle-outline"
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
          </View>
        );

      case "multiple":
        return (
          <View style={styles.optionsContainer}>
            {options.map((option: string | OptionWithImage) => {
              const isOptionObject = typeof option === "object";
              const optionId = isOptionObject ? option.id : option;
              const optionLabel = isOptionObject ? option.label : option;
              const optionDescription = isOptionObject
                ? option.description
                : undefined;
              const isSelected = selectedMultiple.includes(optionId);

              return (
                <TouchableOpacity
                  key={optionId}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedMultiple(
                        selectedMultiple.filter((id) => id !== optionId)
                      );
                    } else {
                      setSelectedMultiple([...selectedMultiple, optionId]);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {optionLabel}
                      </Text>
                      {optionDescription && (
                        <Text style={styles.optionDescription}>
                          {optionDescription}
                        </Text>
                      )}
                    </View>
                  </View>
                  <MaterialCommunityIcons
                    name={
                      isSelected ? "checkbox-marked" : "checkbox-blank-outline"
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
            <Text style={styles.multipleHint}>ניתן לבחור יותר מאפשרות אחת</Text>
          </View>
        );

      case "text":
        return (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder={currentQuestion.placeholder}
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={200}
              textAlign="right"
            />
            <Text style={styles.textCounter}>{textInput.length}/200</Text>
          </View>
        );

      case "height":
        return (
          <HeightSlider
            value={answers[currentQuestion.id] || 170}
            onChange={(value: number) => handleAnswer(value)}
            minHeight={currentQuestion.min || 140}
            maxHeight={currentQuestion.max || 220}
          />
        );

      case "weight":
        return (
          <WeightSlider
            value={answers[currentQuestion.id] || 70}
            onChange={(value: number) => handleAnswer(value)}
            minWeight={currentQuestion.min || 40}
            maxWeight={currentQuestion.max || 150}
          />
        );

      case "height":
        return (
          <HeightSlider
            value={answers[currentQuestion.id] || 170}
            onChange={(value: number) => handleAnswer(value)}
            minHeight={currentQuestion.min || 140}
            maxHeight={currentQuestion.max || 220}
          />
        );

      default:
        return null;
    }
  };

  // בדיקה אם זו השאלה האחרונה
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const stageInfo = QUESTIONNAIRE_STAGES[currentStage];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handlePrevious}
                style={styles.backButton}
                disabled={currentQuestionIndex === 0}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={28}
                  color={
                    currentQuestionIndex === 0
                      ? theme.colors.divider
                      : theme.colors.text
                  }
                />
              </TouchableOpacity>

              <View style={styles.stageInfo}>
                <Text style={styles.stageTitle}>{stageInfo.title}</Text>
                <Text style={styles.questionNumber}>
                  שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
                </Text>
              </View>

              {currentStage === "profile" && (
                <TouchableOpacity
                  onPress={handleSkipProfile}
                  style={styles.skipButton}
                >
                  <Text style={styles.skipText}>דלג</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Main Content */}
            {currentQuestion && (
              <Animated.View
                style={[
                  styles.mainContent,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                {/* Question */}
                <View style={styles.questionContainer}>
                  <MaterialCommunityIcons
                    name={(currentQuestion.icon as any) || "help-circle"}
                    size={48}
                    color={theme.colors.primary}
                    style={styles.questionIcon}
                  />
                  <Text style={styles.questionText}>
                    {currentQuestion.question}
                  </Text>
                  {currentQuestion.subtitle && (
                    <Text style={styles.questionSubtitle}>
                      {currentQuestion.subtitle}
                    </Text>
                  )}
                  {currentQuestion.helpText && (
                    <Text style={styles.helpText}>
                      {currentQuestion.helpText}
                    </Text>
                  )}
                </View>

                {/* Options */}
                {renderOptions()}

                {/* Error message */}
                {error && <Text style={styles.errorText}>{error}</Text>}
              </Animated.View>
            )}

            {/* Bottom buttons */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !answers[currentQuestion?.id] &&
                    currentQuestion?.required &&
                    currentQuestion?.type !== "text" &&
                    styles.disabledButton,
                ]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    !answers[currentQuestion?.id] &&
                    currentQuestion?.required &&
                    currentQuestion?.type !== "text"
                      ? [theme.colors.divider, theme.colors.divider]
                      : [
                          theme.colors.primaryGradientStart,
                          theme.colors.primaryGradientEnd,
                        ]
                  }
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {isLastQuestion
                      ? currentStage === "training"
                        ? "סיים שלב זה"
                        : "סיים"
                      : "המשך"}
                  </Text>
                  <MaterialCommunityIcons
                    name={isLastQuestion ? "check" : "chevron-left"}
                    size={24}
                    color={theme.colors.text}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  stageInfo: {
    flex: 1,
    alignItems: "center",
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  questionNumber: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  questionIcon: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  questionSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: "center",
    fontStyle: "italic",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionContent: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  optionIcon: {
    marginLeft: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    textAlign: "right",
  },
  selectedOptionText: {
    color: theme.colors.text,
  },
  optionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "right",
  },
  multipleHint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  textInputContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 100,
    textAlignVertical: "top",
  },
  textCounter: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "left",
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: 8,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nextButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  nextButtonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
