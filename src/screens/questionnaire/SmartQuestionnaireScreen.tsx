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
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  NewQuestionnaireManager,
  SmartQuestion,
  SmartOption,
  AIFeedback,
  getSmartQuestionnaireInsights,
} from "../../data/newSmartQuestionnaire";
import { useUserStore } from "../../stores/userStore";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

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
        return theme.colors.success;
      case "suggestion":
        return theme.colors.warning;
      case "warning":
        return theme.colors.error;
      case "insight":
        return theme.colors.info;
      default:
        return theme.colors.success;
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
          {/* תמונת ציוד אם קיימת */}
          {option.image && (
            <View style={styles.optionImageContainer}>
              <Image source={option.image} style={styles.optionImage} />
            </View>
          )}

          <View style={styles.optionTextContainer}>
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
      `🔍 DEBUG: Creating new NewQuestionnaireManager in React component`
    );
    return new NewQuestionnaireManager();
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

  // אנימציה לכפתור הצף
  const buttonAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadCurrentQuestion();
  }, []);

  const loadCurrentQuestion = () => {
    const question = manager.getCurrentQuestion();
    setCurrentQuestion(question);
    setSelectedOption(null);
    setSelectedOptions([]); // נקה בחירות מרובות

    // הסתר כפתור
    Animated.timing(buttonAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleOptionSelect = async (option: SmartOption) => {
    if (isAnswering) return;

    let newSelections: SmartOption[] = [];

    // עבור כל סוגי השאלות - פשוט הוסף/הסר מהבחירה
    if (currentQuestion?.type === "single") {
      // בשאלה עם בחירה אחת - החלף את הבחירה
      setSelectedOption(option);
      newSelections = [option];
      setSelectedOptions(newSelections);
    } else if (currentQuestion?.type === "multiple") {
      const isAlreadySelected = selectedOptions.some(
        (opt) => opt.id === option.id
      );

      if (isAlreadySelected) {
        // הסר מהבחירה
        newSelections = selectedOptions.filter((opt) => opt.id !== option.id);
        setSelectedOptions(newSelections);
        // עדכן גם לבחירה יחידה
        if (newSelections.length === 0) {
          setSelectedOption(null);
        }
      } else {
        // הוסף לבחירה
        newSelections = [...selectedOptions, option];
        setSelectedOptions(newSelections);
      }
    }

    // הצג/הסתר כפתור עם אנימציה
    const hasSelections = newSelections.length > 0;

    Animated.timing(buttonAnimation, {
      toValue: hasSelections ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // פונקציה אחידה לכפתור "הבא"
  const handleNext = async () => {
    if (selectedOptions.length === 0 || isAnswering) return;

    setIsAnswering(true);

    // המתן קצר לאנימציה
    setTimeout(() => {
      const feedback = manager.answerQuestion(
        currentQuestion!.id,
        currentQuestion?.type === "single"
          ? selectedOptions[0]
          : selectedOptions
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

      // קבל אינסייטים חכמים מהמערכת החדשה
      const insights = getSmartQuestionnaireInsights(answers);

      // קבל את המגדר מהתשובות אם קיים (במערכת החדשה אין שאלת מגדר)
      const inviteText = "תוכנית האימונים האישית שלך מוכנה! בואו נתחיל להתאמן";
      const buttonText = "בואו נתחיל!";

      // הצג הודעת הצלחה עם סיכום AI מתקדם
      Alert.alert(
        "🎉 השאלון הושלם!",
        `${inviteText}\n\n📊 ניתוח חכם:\n• ציון השלמה: ${insights.completionScore}%\n• רמת מוכנות: ${insights.equipmentReadinessLevel}/5\n• ${insights.insights[0] || "מוכן לאימונים!"}\n\n💪 ${insights.trainingCapabilities.slice(0, 2).join(", ")}`,
        [
          {
            text: buttonText,
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
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundElevated]}
        style={styles.gradient}
      >
        {/* Header מעוצב */}
        <View style={styles.header}>
          <BackButton absolute={false} variant="minimal" />
          <Text style={styles.headerTitle}>שאלון חכם</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* התקדמות עם טיפים חכמים */}
          <SmartProgressBar progress={progress} />
          {/* טיפ חכם בהתאם להתקדמות */}
          {progress.percentage > 0 && progress.percentage < 100 && (
            <View style={styles.smartTipContainer}>
              <Text style={styles.smartTipIcon}>💡</Text>
              <Text style={styles.smartTipText}>
                {progress.percentage < 50
                  ? "ככל שתענה יותר, כך נוכל ליצור תוכנית מותאמת יותר עבורך"
                  : "כמעט סיימנו! התשובות שלך עוזרות לנו ליצור את האימון המושלם"}
              </Text>
            </View>
          )}
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
          {/* אפשרויות עם תמונות חכמות */}
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

            {/* הצגת מידע נוסף על הבחירות */}
            {selectedOptions.length > 0 && (
              <View style={styles.selectionSummary}>
                <Text style={styles.selectionSummaryTitle}>
                  ✨ הבחירות שלך ({selectedOptions.length}):
                </Text>
                <View style={styles.selectedItemsContainer}>
                  {selectedOptions.map((option, index) => (
                    <View key={option.id} style={styles.selectedItem}>
                      <Text style={styles.selectedItemText}>
                        {option.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>{" "}
          {/* רווח תחתון */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* כפתור הבא צף */}
        <Animated.View
          style={[
            styles.floatingButtonContainer,
            {
              opacity: buttonAnimation,
              transform: [
                {
                  translateY: buttonAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
                {
                  scale: buttonAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={selectedOptions.length > 0 ? "auto" : "none"}
        >
          <TouchableOpacity
            style={[
              styles.floatingButton,
              isAnswering && styles.floatingButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={isAnswering}
          >
            <LinearGradient
              colors={
                isAnswering
                  ? [theme.colors.textTertiary, theme.colors.textTertiary]
                  : [theme.colors.primary, theme.colors.primaryDark]
              }
              style={styles.floatingButtonGradient}
            >
              <Text style={styles.floatingButtonText}>
                {isAnswering
                  ? "מעבד..."
                  : currentQuestion?.type === "single"
                    ? "הבא"
                    : `הבא (${selectedOptions.length} נבחרו)`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

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
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },

  // Header מעוצב
  header: {
    flexDirection: "row", // תמיד row בעברית
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 40,
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
    ...theme.typography.bodyLarge,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // סטיילים לבר התקדמות
  progressContainer: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "right", // תמיד ימין בעברית
  },
  progressPercentage: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "bold",
    textAlign: "left", // אחוזים משמאל
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xs,
  },

  // סטיילים לכותרת השאלה
  questionHeader: {
    alignItems: "center",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  questionIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  questionTitle: {
    ...theme.typography.title1,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  questionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },

  // סטיילים לשאלה
  questionContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    ...theme.typography.title3,
    color: theme.colors.text,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
  },
  helpText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    textAlign: "right", // תמיד ימין בעברית
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
    writingDirection: "rtl",
  },

  // סטיילים לאפשרויות
  optionsContainer: {
    marginHorizontal: theme.spacing.lg,
  },
  optionContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingRight: theme.spacing.lg + 30, // מקום לסמן הבחירה מימין
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceVariant,
  },
  optionContent: {
    flex: 1,
    flexDirection: "row-reverse", // תמונה משמאל, טקסט מימין ב-RTL
    alignItems: "center",
  },
  optionImageContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md, // תמיד marginLeft בעברית
    overflow: "hidden",
  },
  optionImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  optionTextContainer: {
    flex: 1,
    alignItems: "flex-end", // מיישר טקסט לימין ב-RTL
  },
  optionLabel: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
    width: "100%", // תופס את כל הרוחב
  },
  optionLabelSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  optionDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
    width: "100%", // תופס את כל הרוחב
  },
  optionDescriptionSelected: {
    color: theme.colors.textSecondary,
  },
  selectedIndicator: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md, // משמאל לימין בעברית - V מימין
    width: 24,
    height: 24,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicatorText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },

  // סטיילים לתובנת AI
  aiInsightContainer: {
    flexDirection: "row-reverse", // תמיד row-reverse בעברית
    alignItems: "flex-start",
    backgroundColor: theme.colors.info + "20", // שקיפות 20%
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    borderRightWidth: 3, // תמיד בצד ימין בעברית
    borderRightColor: theme.colors.info,
  },
  aiInsightIcon: {
    fontSize: 16,
    marginLeft: theme.spacing.sm, // תמיד marginLeft בעברית
  },
  aiInsightText: {
    flex: 1,
    ...theme.typography.bodySmall,
    color: theme.colors.info,
    fontStyle: "italic",
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
  },

  // סטיילים למשוב AI
  aiFeedbackContainer: {
    position: "absolute",
    top: 100,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    ...theme.shadows.large,
    zIndex: 1000,
  },
  aiFeedbackContent: {
    flexDirection: "row-reverse", // תמיד row-reverse בעברית
    alignItems: "flex-start",
    padding: theme.spacing.lg,
  },
  aiFeedbackIcon: {
    fontSize: 24,
    marginLeft: theme.spacing.md, // תמיד marginLeft בעברית
  },
  aiFeedbackText: {
    flex: 1,
  },
  aiFeedbackMessage: {
    color: theme.colors.white,
    ...theme.typography.bodyLarge,
    lineHeight: 22,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
  },
  aiFeedbackAction: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  aiFeedbackActionText: {
    color: theme.colors.white,
    ...theme.typography.body,
    textDecorationLine: "underline",
  },
  aiFeedbackClose: {
    padding: theme.spacing.xs,
  },
  aiFeedbackCloseText: {
    color: theme.colors.white,
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
    backgroundColor: theme.colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingIndicator: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
    ...theme.shadows.large,
  },
  loadingEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  loadingMessage: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // סטיילים לטיפים חכמים
  smartTipContainer: {
    backgroundColor: theme.colors.info + "15",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: "row-reverse", // אייקון מימין בעברית
    alignItems: "center",
    borderRightWidth: 3,
    borderRightColor: theme.colors.info,
  },
  smartTipIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.sm, // רווח מימין בעברית
  },
  smartTipText: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.info,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 20,
  },

  // סטיילים לסיכום בחירות
  selectionSummary: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  selectionSummaryTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.primary,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "flex-end", // מיישר לימין ב-RTL
  },
  selectedItem: {
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary + "40",
  },
  selectedItemText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: "500",
    textAlign: "center",
    writingDirection: "rtl",
  },

  bottomSpacer: {
    height: 100, // יותר מקום לכפתור הצף
  },

  // סטיילים לכפתור צף
  floatingButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: "transparent",
  },
  floatingButton: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  floatingButtonGradient: {
    paddingVertical: theme.spacing.lg + 2,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.primary + "F5", // 96% שקיפות
    borderWidth: 1,
    borderColor: theme.colors.primary + "40", // גבול עדין
  },
  floatingButtonDisabled: {
    opacity: 0.6,
  },
  floatingButtonText: {
    color: theme.colors.white,
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },

  // סטיילים ישנים לכפתור הבא (נשמרים לתאימות)
  nextButtonContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  nextButton: {
    borderRadius: theme.radius.md,
    ...theme.shadows.medium,
    overflow: "hidden",
  },
  nextButtonGradient: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    borderRadius: theme.radius.md,
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.textTertiary,
  },
  nextButtonText: {
    color: theme.colors.white,
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    textAlign: "center", // כיוון של טקסט בכפתור תמיד במרכז
    writingDirection: "rtl",
  },
});

export default SmartQuestionnaireScreen;
