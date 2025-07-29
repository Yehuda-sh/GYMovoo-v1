/**
 * @file src/screens/questionnaire/SmartQuestionnaireScreen.tsx
 * @brief מסך שאלון חכם עם משוב AI בזמן אמת
 * @description חוויית שאלון אינטראקטיבית עם בינה מלאכותית
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  SmartQuestionnaireManager,
  SmartQuestion,
  SmartOption,
  AIFeedback,
} from "../../data/smartQuestionnaireData";
import { useUserStore } from "../../stores/userStore";

// קומפוננטת משוב AI מנימה
const AIFeedbackComponent: React.FC<{
  feedback: AIFeedback;
  onClose: () => void;
}> = ({ feedback, onClose }) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // סגירה אוטומטית אחרי 4 שניות
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, []);

  const getBackgroundColor = () => {
    switch (feedback.type) {
      case "positive":
        return "#4CAF50";
      case "suggestion":
        return "#FF9800";
      case "warning":
        return "#F44336";
      case "insight":
        return "#2196F3";
      default:
        return "#4CAF50";
    }
  };

  return (
    <Animated.View
      style={[
        styles.aiFeedbackContainer,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.aiFeedbackContent}>
        <Text style={styles.aiFeedbackIcon}>{feedback.icon}</Text>
        <View style={styles.aiFeedbackText}>
          <Text style={styles.aiFeedbackMessage}>{feedback.message}</Text>
          {feedback.actionable && (
            <TouchableOpacity
              style={styles.aiFeedbackAction}
              onPress={feedback.actionable.action}
            >
              <Text style={styles.aiFeedbackActionText}>
                {feedback.actionable.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.aiFeedbackClose}>
          <Text style={styles.aiFeedbackCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// קומפוננטת אפשרות חכמה
const SmartOptionComponent: React.FC<{
  option: SmartOption;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ option, isSelected, onSelect }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePress = () => {
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

    onSelect();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.optionContainer, isSelected && styles.optionSelected]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionLabel,
              isSelected && styles.optionLabelSelected,
            ]}
          >
            {option.label}
          </Text>
          {option.description && (
            <Text
              style={[
                styles.optionDescription,
                isSelected && styles.optionDescriptionSelected,
              ]}
            >
              {option.description}
            </Text>
          )}
          {option.aiInsight && isSelected && (
            <View style={styles.aiInsightContainer}>
              <Text style={styles.aiInsightIcon}>🤖</Text>
              <Text style={styles.aiInsightText}>{option.aiInsight}</Text>
            </View>
          )}
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIndicatorText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// קומפוננטת התקדמות חכמה
const SmartProgressBar: React.FC<{
  progress: { current: number; total: number; percentage: number };
}> = ({ progress }) => {
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress.percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress.percentage]);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          שאלה {progress.current} מתוך {progress.total}
        </Text>
        <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
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
  );
};

// המסך הראשי
const SmartQuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setQuestionnaire, user } = useUserStore();

  const [manager] = useState(() => {
    console.log(
      `🔍 DEBUG: Creating new SmartQuestionnaireManager in React component`
    );
    return new SmartQuestionnaireManager();
  });
  const [currentQuestion, setCurrentQuestion] = useState<SmartQuestion | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<SmartOption | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<SmartOption[]>([]); // לבחירות מרובות
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    loadCurrentQuestion();
  }, []);

  const loadCurrentQuestion = () => {
    const question = manager.getCurrentQuestion();
    setCurrentQuestion(question);
    setSelectedOption(null);
    setSelectedOptions([]); // נקה בחירות מרובות
  };

  const handleOptionSelect = async (option: SmartOption) => {
    if (isAnswering) return;

    // אם זה שאלה עם בחירה אחת - עבור ישירות
    if (currentQuestion?.type === "single") {
      setSelectedOption(option);
      setIsAnswering(true);

      // המתן קצר לאנימציה
      setTimeout(() => {
        const feedback = manager.answerQuestion(currentQuestion!.id, option);

        if (feedback) {
          setAiFeedback(feedback);
          setShowFeedback(true);
        }

        // המשך לשאלה הבאה אחרי המשוב
        setTimeout(() => {
          const hasNextQuestion = manager.nextQuestion();

          if (hasNextQuestion) {
            loadCurrentQuestion();
          } else {
            completeQuestionnaire();
          }

          setIsAnswering(false);
        }, 3000); // 3 שניות להצגת המשוב
      }, 500);
    }
    // אם זה שאלה עם בחירות מרובות - הוסף/הסר מהרשימה
    else if (currentQuestion?.type === "multiple") {
      const isAlreadySelected = selectedOptions.some(
        (opt) => opt.id === option.id
      );

      if (isAlreadySelected) {
        // הסר מהבחירה
        setSelectedOptions((prev) =>
          prev.filter((opt) => opt.id !== option.id)
        );
      } else {
        // הוסף לבחירה
        setSelectedOptions((prev) => [...prev, option]);
      }
    }
  };

  // פונקציה חדשה לטיפול בכפתור "הבא" בשאלות מרובות
  const handleMultipleNext = async () => {
    if (selectedOptions.length === 0 || isAnswering) return;

    setIsAnswering(true);

    // המתן קצר לאנימציה
    setTimeout(() => {
      const feedback = manager.answerQuestion(
        currentQuestion!.id,
        selectedOptions
      );

      if (feedback) {
        setAiFeedback(feedback);
        setShowFeedback(true);
      }

      // המשך לשאלה הבאה אחרי המשוב
      setTimeout(() => {
        const hasNextQuestion = manager.nextQuestion();

        if (hasNextQuestion) {
          loadCurrentQuestion();
        } else {
          completeQuestionnaire();
        }

        setIsAnswering(false);
      }, 3000); // 3 שניות להצגת המשוב
    }, 500);
  };

  const completeQuestionnaire = async () => {
    const answers = manager.getAllAnswers();

    try {
      // שמור את התשובות
      await setQuestionnaire(answers);

      // הצג הודעת הצלחה עם סיכום AI
      Alert.alert(
        "🎉 השאלון הושלם!",
        "תוכנית האימונים האישית שלך מוכנה! בואי נתחיל להתאמן",
        [
          {
            text: "בואי נתחיל!",
            onPress: () => navigation.navigate("MainApp"),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      Alert.alert("שגיאה", "בעיה בשמירת השאלון. אנא נסה שוב.");
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setAiFeedback(null);
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>טוען שאלון חכם...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = manager.getProgress();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* התקדמות */}
        <SmartProgressBar progress={progress} />

        {/* כותרת השאלה */}
        <View style={styles.questionHeader}>
          <Text style={styles.questionIcon}>{currentQuestion.icon}</Text>
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          {currentQuestion.subtitle && (
            <Text style={styles.questionSubtitle}>
              {currentQuestion.subtitle}
            </Text>
          )}
        </View>

        {/* השאלה עצמה */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.helpText && (
            <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
          )}
        </View>

        {/* אפשרויות */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options?.map((option, index) => {
            const isSelected =
              currentQuestion.type === "single"
                ? selectedOption?.id === option.id
                : selectedOptions.some((opt) => opt.id === option.id);

            return (
              <SmartOptionComponent
                key={option.id}
                option={option}
                isSelected={isSelected}
                onSelect={() => handleOptionSelect(option)}
              />
            );
          })}
        </View>

        {/* כפתור הבא לשאלות מרובות */}
        {currentQuestion.type === "multiple" && selectedOptions.length > 0 && (
          <View style={styles.nextButtonContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                isAnswering && styles.nextButtonDisabled,
              ]}
              onPress={handleMultipleNext}
              disabled={isAnswering}
            >
              <Text style={styles.nextButtonText}>
                {isAnswering
                  ? "מעבד..."
                  : `הבא (${selectedOptions.length} נבחרו)`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* רווח תחתון */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* משוב AI */}
      {showFeedback && aiFeedback && (
        <AIFeedbackComponent
          feedback={aiFeedback}
          onClose={handleCloseFeedback}
        />
      )}

      {/* אינדיקטור טעינה */}
      {isAnswering && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingIndicator}>
            <Text style={styles.loadingEmoji}>🤖</Text>
            <Text style={styles.loadingMessage}>AI מעבד את התשובה...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },

  // סטיילים לבר התקדמות
  progressContainer: {
    margin: 20,
    marginBottom: 30,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "system",
  },
  progressPercentage: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 4,
  },

  // סטיילים לכותרת השאלה
  questionHeader: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  questionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  // סטיילים לשאלה
  questionContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  questionText: {
    fontSize: 22,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },

  // סטיילים לאפשרויות
  optionsContainer: {
    marginHorizontal: 20,
  },
  optionContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionSelected: {
    borderColor: "#2196F3",
    backgroundColor: "#f3f8ff",
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: "#2196F3",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: "#555",
  },
  selectedIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicatorText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // סטיילים לתובנת AI
  aiInsightContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#e8f4fd",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  aiInsightIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 13,
    color: "#1976d2",
    fontStyle: "italic",
  },

  // סטיילים למשוב AI
  aiFeedbackContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  aiFeedbackContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  aiFeedbackIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  aiFeedbackText: {
    flex: 1,
  },
  aiFeedbackMessage: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  aiFeedbackAction: {
    marginTop: 8,
    paddingVertical: 4,
  },
  aiFeedbackActionText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  aiFeedbackClose: {
    padding: 4,
  },
  aiFeedbackCloseText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // סטיילים לטעינה
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingIndicator: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  loadingMessage: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },

  bottomSpacer: {
    height: 50,
  },

  // סטיילים לכפתור הבא
  nextButtonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 16,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: "#9E9E9E",
    shadowColor: "#9E9E9E",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
  },
});

export default SmartQuestionnaireScreen;
