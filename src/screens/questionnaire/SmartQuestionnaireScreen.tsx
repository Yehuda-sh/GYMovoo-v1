/**
 * @file src/screens/questionnaire/SmartQuestionnaireScreen.tsx
 * @brief מסך שאלון חכם עם משוב AI בזמן אמת - אופטימליזציה 2025
 * @description חוויית שאלון אינטראקטיבית עם בינה מלאכותית ומערכת קומפוננטות מרכזית
 *
 * ✅ אופטימיזציה מקיפה - הסרת כפילויות קוד
 * ✅ קומפוננטות מפורקות ומרכזיות
 * ✅ תמיכה מלאה ב-RTL ועברית
 * ✅ DRY Principle - שימוש חוזר בקומפוננטות
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  NewQuestionnaireManager,
  SmartQuestion,
  getSmartQuestionnaireInsights,
  SmartOption,
  AIFeedback,
} from "../../data/newSmartQuestionnaire";
import { useUserStore } from "../../stores/userStore";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { realisticDemoService } from "../../services/realisticDemoService";

// קומפוננטות מרכזיות מאופטימליזציה
import {
  AIFeedbackComponent as AIFeedbackCentralized,
  SmartOptionComponent as SmartOptionCentralized,
  SmartProgressBar as SmartProgressBarCentralized,
} from "../../components/questionnaire";

// =====================================
// 🔧 קבועים מרכזיים
// Central Constants
// =====================================

const ANIMATION_CONSTANTS = {
  BUTTON_FADE_DURATION: 300,
  BUTTON_HIDE_DURATION: 200,
  ANSWER_PROCESSING_DELAY: 300, // הקטנה מ-500ms ל-300ms
  FEEDBACK_DISPLAY_DURATION: 1500, // 1.5 שניות - מהיר וחלק
} as const;

// =====================================
// 🎯 המסך הראשי - ללא קומפוננטות כפולות
// Main Screen - Without Duplicate Components
// =====================================
const SmartQuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setSmartQuestionnaireData, user, setCustomDemoUser } = useUserStore();

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
    console.log("🔍 DEBUG: loadCurrentQuestion נקרא");
    const question = manager.getCurrentQuestion();
    console.log("🔍 DEBUG: שאלה נוכחית:", {
      questionId: question?.id,
      questionTitle: question?.title,
      questionType: question?.type,
      hasOptions: !!question?.options,
      optionsCount: question?.options?.length,
    });

    setCurrentQuestion(question);
    setSelectedOption(null);
    setSelectedOptions([]); // נקה בחירות מרובות

    // הסתר כפתור
    Animated.timing(buttonAnimation, {
      toValue: 0,
      duration: ANIMATION_CONSTANTS.BUTTON_HIDE_DURATION,
      useNativeDriver: true,
    }).start();

    console.log("🔍 DEBUG: loadCurrentQuestion הושלם");
  };

  const handleOptionSelect = async (option: SmartOption) => {
    console.log("🔍 DEBUG: handleOptionSelect נקרא", {
      optionId: option.id,
      optionLabel: option.label,
      questionType: currentQuestion?.type,
      isAnswering: isAnswering,
    });

    if (isAnswering) {
      console.log("🔍 DEBUG: עדיין עונה, מתעלם מהבחירה");
      return;
    }

    let newSelections: SmartOption[] = [];

    // עבור כל סוגי השאלות - פשוט הוסף/הסר מהבחירה
    if (currentQuestion?.type === "single") {
      console.log("🔍 DEBUG: שאלה עם בחירה יחידה");
      // בשאלה עם בחירה אחת - החלף את הבחירה
      setSelectedOption(option);
      newSelections = [option];
      setSelectedOptions(newSelections);
      console.log("🔍 DEBUG: נבחר:", option.label);
    } else if (currentQuestion?.type === "multiple") {
      console.log("🔍 DEBUG: שאלה עם בחירה מרובה");
      const isAlreadySelected = selectedOptions.some(
        (opt) => opt.id === option.id
      );

      if (isAlreadySelected) {
        console.log("🔍 DEBUG: מסיר אפשרות קיימת");
        // הסר מהבחירה
        newSelections = selectedOptions.filter((opt) => opt.id !== option.id);
        setSelectedOptions(newSelections);
        // עדכן גם לבחירה יחידה
        if (newSelections.length === 0) {
          setSelectedOption(null);
        }
      } else {
        console.log("🔍 DEBUG: מוסיף אפשרות חדשה");
        // הוסף לבחירה
        newSelections = [...selectedOptions, option];
        setSelectedOptions(newSelections);
      }
    }

    console.log(
      "🔍 DEBUG: בחירות חדשות:",
      newSelections.map((opt) => opt.label)
    );

    // הצג/הסתר כפתור עם אנימציה
    const hasSelections = newSelections.length > 0;

    Animated.timing(buttonAnimation, {
      toValue: hasSelections ? 1 : 0,
      duration: ANIMATION_CONSTANTS.BUTTON_FADE_DURATION,
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
        console.log("🔍 DEBUG: מנסה לעבור לשאלה הבאה");
        const hasNextQuestion = manager.nextQuestion();
        console.log("🔍 DEBUG: יש שאלה הבאה:", hasNextQuestion);

        if (hasNextQuestion) {
          console.log("🔍 DEBUG: טוען שאלה הבאה");
          loadCurrentQuestion();
        } else {
          console.log("🔍 DEBUG: מסיים שאלון - כל השאלות נענו");
          completeQuestionnaire();
        }

        setIsAnswering(false);
        console.log("🔍 DEBUG: סיים לענות, isAnswering = false");
      }, ANIMATION_CONSTANTS.FEEDBACK_DISPLAY_DURATION); // 2 שניות להצגת המשוב
    }, ANIMATION_CONSTANTS.ANSWER_PROCESSING_DELAY);
  };

  const completeQuestionnaire = async () => {
    const answers = manager.getAllAnswers();

    try {
      // קבל אינסייטים חכמים מהמערכת החדשה
      const insights = getSmartQuestionnaireInsights(answers);

      // יצור נתוני שאלון חכם מלאים
      const smartQuestionnaireData = {
        answers: answers,
        completedAt: new Date().toISOString(),
        metadata: {
          completedAt: new Date().toISOString(),
          version: "1.0",
          sessionId: `smart_${Date.now()}`,
          completionTime: 300, // זמן ממוצע
          questionsAnswered: Object.keys(answers).length,
          totalQuestions: Object.keys(answers).length,
          deviceInfo: {
            platform: "mobile" as const,
            screenWidth: 375,
            screenHeight: 812,
          },
        },
        insights: insights,
      };

      // שמור את נתוני השאלון החכם
      setSmartQuestionnaireData(smartQuestionnaireData);

      // 🎯 חידוש: יצור משתמש דמו מותאם לתשובות השאלון
      const customDemoUser =
        realisticDemoService.generateDemoUserFromQuestionnaire(answers);
      console.log("Generated custom demo user:", customDemoUser);

      // שמור את משתמש הדמו המותאם ב-store (עם השדות הנדרשים)
      setCustomDemoUser({
        id: customDemoUser.id,
        name: customDemoUser.name,
        gender: customDemoUser.gender,
        age: customDemoUser.age,
        experience: customDemoUser.experience,
        height: customDemoUser.height,
        weight: customDemoUser.weight,
        fitnessGoals: customDemoUser.fitnessGoals,
        availableDays: customDemoUser.availableDays,
        sessionDuration: customDemoUser.sessionDuration,
        equipment: customDemoUser.equipment,
        preferredTime: customDemoUser.preferredTime,
        createdFromQuestionnaire: true,
        questionnaireTimestamp: new Date().toISOString(),
      });

      // קבל את המגדר מהתשובות אם קיים (במערכת החדשה אין שאלת מגדר)
      const inviteText = "תוכנית האימונים האישית שלך מוכנה! בואו נתחיל להתאמן";
      const buttonText = "בואו נתחיל!";

      // הצג הודעת הצלחה עם סיכום AI מתקדם
      Alert.alert(
        "🎉 השאלון הושלם!",
        `${inviteText}\n\n📊 ניתוח חכם:\n• ציון השלמה: ${insights.completionScore}%\n• רמת מוכנות: ${insights.equipmentReadinessLevel}/5\n• ${insights.insights[0] || "מוכן לאימונים!"}\n\n💪 ${insights.trainingCapabilities.slice(0, 2).join(", ")}\n\n👤 פרופיל מותאם: ${customDemoUser.name} (${customDemoUser.experience})`,
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

  // 🔙 פונקציה חדשה לחזרה אחורה
  const handlePrevious = () => {
    if (!manager.canGoBack() || isAnswering) return;

    const didGoBack = manager.previousQuestion();
    if (didGoBack) {
      loadCurrentQuestion();
    }
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
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
          onContentSizeChange={(width, height) => {
            console.log(`📐 ScrollView content size: ${width}x${height}`);
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            console.log(`📱 ScrollView layout height: ${height}`);
          }}
        >
          {/* התקדמות */}
          <SmartProgressBarCentralized progress={progress} />

          {/* כפתור חזרה בתוך השאלון */}
          {manager.canGoBack() && (
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                style={styles.previousButton}
                onPress={handlePrevious}
                disabled={isAnswering}
              >
                <View style={styles.previousButtonContent}>
                  <Ionicons
                    name="chevron-back"
                    size={16}
                    color={theme.colors.textSecondary}
                    style={styles.previousButtonIcon}
                  />
                  <Text style={styles.previousButtonText}>שאלה קודמת</Text>
                </View>
              </TouchableOpacity>
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
          <View
            style={styles.optionsContainer}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              console.log(`📋 Options container height: ${height}`);
              console.log(
                `🔢 Number of options: ${currentQuestion.options?.length || 0}`
              );
            }}
          >
            <FlatList
              data={currentQuestion.options || []}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // כי אנחנו כבר בתוך ScrollView
              showsVerticalScrollIndicator={false}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                console.log(`📝 FlatList height: ${height}`);
              }}
              renderItem={({ item: option, index }) => {
                const isSelected =
                  currentQuestion.type === "single"
                    ? selectedOption?.id === option.id
                    : selectedOptions.some((opt) => opt.id === option.id);

                return (
                  <SmartOptionCentralized
                    key={option.id}
                    option={option}
                    isSelected={isSelected}
                    onSelect={() => handleOptionSelect(option)}
                  />
                );
              }}
            />
          </View>

          {/* כפתור הבא - בתוך ScrollView במקום צף */}
          {selectedOptions.length > 0 && (
            <Animated.View
              style={[
                styles.inlineButtonContainer,
                {
                  opacity: buttonAnimation,
                  transform: [
                    {
                      scale: buttonAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.inlineButton,
                  isAnswering && styles.inlineButtonDisabled,
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
                  style={styles.inlineButtonGradient}
                >
                  <Text style={styles.inlineButtonText}>
                    {isAnswering
                      ? "מעבד..."
                      : currentQuestion?.type === "single"
                        ? "הבא"
                        : `הבא (${selectedOptions.length} נבחרו)`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* רווח תחתון */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* כפתור הבא צף - מושבת זמנית לפתרון בעיית גלילה */}
        {false && (
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
            // שיפור pointerEvents - מאפשר גלילה כשהכפתור לא זמין
            pointerEvents={selectedOptions.length > 0 ? "auto" : "box-none"}
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
        )}

        {/* משוב AI */}
        {showFeedback && aiFeedback && (
          <AIFeedbackCentralized
            feedback={aiFeedback}
            onClose={handleCloseFeedback}
            autoCloseDelay={ANIMATION_CONSTANTS.FEEDBACK_DISPLAY_DURATION}
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

// =====================================
// 🎨 סטיילים מופחתים - ללא כפילויות
// Reduced Styling - Without Duplicates
// =====================================

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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 250, // עוד יותר רווח תחתון
    minHeight: "100%", // ודא שהתוכן תופס לפחות את כל המסך
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

  // סטיילים לאפשרויות - מרכז לקומפוננטות
  optionsContainer: {
    marginHorizontal: theme.spacing.lg,
  },

  // סטיילים לכפתור בתוך ScrollView (במקום צף)
  inlineButtonContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  inlineButton: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inlineButtonGradient: {
    paddingVertical: theme.spacing.lg + 2,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.primary + "F5",
    borderWidth: 1,
    borderColor: theme.colors.primary + "40",
  },
  inlineButtonDisabled: {
    opacity: 0.6,
  },
  inlineButtonText: {
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

  bottomSpacer: {
    height: 200, // הגדלה ל-200px - הרבה יותר מקום
  },

  // סטיילים לכפתור צף
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20, // הקטנה מ-30 ל-20 - יותר מקום לגלילה
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: "transparent",
    // הוספת pointerEvents ברירת מחדל - מאפשר גלילה כשהכפתור לא פעיל
    pointerEvents: "box-none", // מאפשר לאירועים לעבור דרך הקונטיינר
    zIndex: 1000, // וודא שהכפתור מעל הכל אבל לא חוסם גלילה
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

  // סטיילים לכפתור חזרה בתוך השאלון
  backButtonContainer: {
    marginBottom: theme.spacing.md,
    alignItems: "flex-start",
  },
  previousButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previousButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  previousButtonIcon: {
    marginLeft: theme.spacing.xs,
  },
  previousButtonText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
});

export default SmartQuestionnaireScreen;
