/**
 * @file src/screens/questionnaire/TwoStageQuestionnaireScreen.tsx
 * @brief מסך שאלון דו-שלבי - אימונים ופרופיל אישי עם תיקון מעבר אוטומטי
 * @brief Two-stage questionnaire - training and personal profile with auto-transition fix
 * @dependencies userStore, twoStageQuestionnaireData, React Navigation
 * @notes שלב 1 חובה, שלב 2 אופציונלי - תוקן מעבר אוטומטי בשאלות single choice
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
import { OptionWithImage } from "../../data/questionnaireData";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";

// הרחבת OptionWithImage לכלול icon
interface ExtendedOption extends OptionWithImage {
  icon?: string;
}

import HeightSlider from "./HeightSlider";
import WeightSlider from "./WeightSlider";

interface Props {
  navigation: NavigationProp<RootStackParamList>;
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
  const [answers, setAnswers] = useState<{
    [key: string]: string | string[] | number;
  }>(user?.questionnaire || {});
  console.log(`🔍 TwoStageQuestionnaireScreen - איתחול answers:`, answers);
  console.log(
    `🔍 TwoStageQuestionnaireScreen - user.questionnaire:`,
    user?.questionnaire
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);

  // קבלת שאלות לפי השלב
  const questions =
    currentStage === "training"
      ? getTrainingQuestions(answers)
      : getProfileQuestions();
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // דיבוג השאלות
  console.log(`🔍 TwoStageQuestionnaireScreen - שאלות נוכחיות:`, {
    stage: currentStage,
    totalQuestions,
    currentQuestionIndex,
    currentQuestionId: currentQuestion?.id,
    answers,
    allQuestionIds: questions.map((q) => q.id),
  });

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const stageTransitionAnim = useRef(new Animated.Value(0)).current;

  // עדכון progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / totalQuestions,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex, totalQuestions]);

  // אנימציה של מעבר
  const animateTransition = (isForward: boolean, callback: () => void) => {
    setIsTransitioning(true);
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
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handleAnswer = (answer: string | string[] | number) => {
    // מניעת לחיצות כפולות במהלך מעבר
    if (isTransitioning) {
      return;
    }

    // לוג מיוחד לשאלות גובה ומשקל
    if (currentQuestion.id === "height" || currentQuestion.id === "weight") {
      console.log(`📏 שומר ${currentQuestion.id}:`, {
        questionId: currentQuestion.id,
        answer,
        questionType: currentQuestion.type,
      });
    }

    // לוג מיוחד לשאלת מיקום
    if (currentQuestion.id === "location") {
      console.log(`🏠 שומר מיקום:`, {
        questionId: currentQuestion.id,
        answer,
        currentAnswers: answers,
      });
    }

    setError("");
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    // בדיקה אם התוספת של שאלות דינמיות צריכה לעדכן את הרשימה
    if (currentQuestion.id === "location") {
      console.log(`🔍 אחרי עדכון מיקום - בודק שאלות דינמיות:`, {
        newAnswers,
        currentStage,
      });

      // זמן קצר לעדכון הרשימה
      setTimeout(() => {
        const updatedQuestions =
          currentStage === "training"
            ? getTrainingQuestions(newAnswers)
            : getProfileQuestions();
        console.log(`🔍 שאלות מעודכנות אחרי בחירת מיקום:`, {
          totalQuestions: updatedQuestions.length,
          questionIds: updatedQuestions.map((q) => q.id),
        });
      }, 100);
    }

    // אם זו שאלת בחירה יחידה, עבור אוטומטית אבל רק אם המעבר האוטומטי מופעל
    if (currentQuestion.type === "single" && autoAdvanceEnabled) {
      setTimeout(() => {
        handleNext(newAnswers);
      }, 800); // הגדלת הזמן מ-300 ל-800 מילישניות
    }
  };

  const handleNext = (updatedAnswers?: {
    [key: string]: string | string[] | number;
  }) => {
    // מניעת לחיצות כפולות במהלך מעבר
    if (isTransitioning) {
      return;
    }

    // שימוש בתשובות המעודכנות או הקיימות
    const currentAnswers = updatedAnswers || answers;

    // וידוא שיש תשובה אם השאלה חובה
    if (currentQuestion.required && !currentAnswers[currentQuestion.id]) {
      setError("אנא בחר תשובה כדי להמשיך");
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
      return;
    }

    // שמירת תשובות לשאלות מיוחדות
    if (currentQuestion.type === "multiple") {
      if (selectedMultiple.length === 0 && currentQuestion.required) {
        setError("אנא בחר לפחות אפשרות אחת");
        return;
      }
      currentAnswers[currentQuestion.id] = selectedMultiple;
      console.log(
        `🔍 שומר תשובת multiple ${currentQuestion.id}:`,
        selectedMultiple
      );
    } else if (currentQuestion.type === "text") {
      currentAnswers[currentQuestion.id] = textInput;
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
    if (currentQuestionIndex > 0 && !isTransitioning) {
      animateTransition(false, () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      });
    }
  };

  const handleStageComplete = async () => {
    // המרת המפתחות לnumber אם צריך לתאימות עם QuestionnaireAnswers
    const formattedAnswers: { [key: number]: string | string[] } = {};

    Object.entries(answers).forEach(([key, value]) => {
      // אם הערך הוא number, נמיר אותו לstring
      const formattedValue =
        typeof value === "number" ? value.toString() : value;
      const numericKey = parseInt(key, 10);
      const finalKey = isNaN(numericKey) ? key : numericKey;
      formattedAnswers[finalKey as number] = formattedValue;
    });

    // שמירת התשובות
    console.log(
      "💾 TwoStageQuestionnaireScreen - שומר תשובות:",
      formattedAnswers
    );
    await setQuestionnaire(formattedAnswers);

    // בדיקה אחרי השמירה
    const updatedUser = useUserStore.getState().user;
    console.log("✅ TwoStageQuestionnaireScreen - אחרי שמירה:", {
      questionnaire: updatedUser?.questionnaire,
      hasTrainingStage: hasCompletedTrainingStage(updatedUser?.questionnaire),
      hasProfileStage: hasCompletedProfileStage(updatedUser?.questionnaire),
    });

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
        routes: [{ name: "MainApp" }],
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
            {options.map((option: string | ExtendedOption) => {
              const isOptionObject = typeof option === "object";
              const optionId = isOptionObject ? option.id : option;
              const optionLabel = isOptionObject ? option.label : option;
              const optionDescription = isOptionObject
                ? option.description
                : undefined;
              const optionIcon =
                isOptionObject && "icon" in option
                  ? (option as ExtendedOption).icon
                  : undefined;
              const isSelected = answers[currentQuestion.id] === optionId;

              return (
                <TouchableOpacity
                  key={optionId}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    isTransitioning && styles.disabledButton,
                  ]}
                  onPress={() => handleAnswer(optionId)}
                  activeOpacity={0.8}
                  disabled={isTransitioning}
                >
                  <View style={styles.optionContent}>
                    {optionIcon && (
                      <MaterialCommunityIcons
                        name={
                          optionIcon as keyof typeof MaterialCommunityIcons.glyphMap
                        }
                        size={28}
                        color={
                          isSelected
                            ? theme.colors.text
                            : theme.colors.textSecondary
                        }
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
                    name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                    size={24}
                    color={
                      isSelected
                        ? theme.colors.primary
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
            {options.map((option: string | ExtendedOption) => {
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
                    console.log(
                      `🔍 Multiple בחירה: ${optionId}, isSelected: ${isSelected}, selectedMultiple:`,
                      selectedMultiple
                    );
                    if (isSelected) {
                      const newSelected = selectedMultiple.filter(
                        (id) => id !== optionId
                      );
                      setSelectedMultiple(newSelected);
                      console.log(
                        `🔍 Multiple הוסר: ${optionId}, חדש:`,
                        newSelected
                      );
                    } else {
                      const newSelected = [...selectedMultiple, optionId];
                      setSelectedMultiple(newSelected);
                      console.log(
                        `🔍 Multiple נוסף: ${optionId}, חדש:`,
                        newSelected
                      );
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

      case "height": {
        const heightValue =
          typeof answers[currentQuestion.id] === "number"
            ? (answers[currentQuestion.id] as number)
            : parseInt(answers[currentQuestion.id] as string, 10) || 170;
        console.log(
          `🔍 TwoStageQuestionnaireScreen - HeightSlider יקבל value: ${heightValue}, currentQuestion.id: ${currentQuestion.id}`
        );
        return (
          <HeightSlider
            value={heightValue}
            onChange={(value: number) => {
              console.log(`🔍 HeightSlider onChange נקרא עם ערך: ${value}`);
              // שמירה ישירה לגובה ומשקל כי הם לא מתקדמים אוטומטית
              const newAnswers = { ...answers, [currentQuestion.id]: value };
              setAnswers(newAnswers);
              console.log(`🔍 HeightSlider - answers עודכן:`, newAnswers);
            }}
            minHeight={currentQuestion.min || 140}
            maxHeight={currentQuestion.max || 220}
          />
        );
      }

      case "weight": {
        const weightValue =
          typeof answers[currentQuestion.id] === "number"
            ? (answers[currentQuestion.id] as number)
            : parseInt(answers[currentQuestion.id] as string, 10) || 70;
        console.log(
          `🔍 TwoStageQuestionnaireScreen - WeightSlider יקבל value: ${weightValue}, currentQuestion.id: ${currentQuestion.id}`
        );
        return (
          <WeightSlider
            value={weightValue}
            onChange={(value: number) => {
              console.log(`🔍 WeightSlider onChange נקרא עם ערך: ${value}`);
              // שמירה ישירה לגובה ומשקל כי הם לא מתקדמים אוטומטית
              const newAnswers = { ...answers, [currentQuestion.id]: value };
              setAnswers(newAnswers);
              console.log(`🔍 WeightSlider - answers עודכן:`, newAnswers);
            }}
            minWeight={currentQuestion.min || 40}
            maxWeight={currentQuestion.max || 150}
          />
        );
      }

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
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              {currentQuestionIndex > 0 && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.backButton}
                  disabled={isTransitioning}
                >
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={28}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.progressContainer}>
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
                <Text style={styles.progressText}>
                  {currentQuestionIndex + 1} / {totalQuestions}
                </Text>
              </View>

              {currentStage === "profile" && (
                <TouchableOpacity onPress={handleSkipProfile}>
                  <Text style={styles.skipText}>דלג</Text>
                </TouchableOpacity>
              )}

              {/* כפתור להפעלה/כיבוי מעבר אוטומטי */}
              <TouchableOpacity
                onPress={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
                style={styles.autoAdvanceToggle}
              >
                <MaterialCommunityIcons
                  name={autoAdvanceEnabled ? "play-speed" : "pause"}
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.autoAdvanceText}>
                  {autoAdvanceEnabled ? "עצור מעבר" : "מעבר אוטו"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Stage info */}
            {currentQuestionIndex === 0 && (
              <View style={styles.stageInfoContainer}>
                <MaterialCommunityIcons
                  name={
                    stageInfo.icon as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={60}
                  color={theme.colors.primary}
                />
                <Text style={styles.stageTitle}>{stageInfo.title}</Text>
                <Text style={styles.stageSubtitle}>{stageInfo.subtitle}</Text>
                <Text style={styles.stageTime}>
                  זמן משוער: {stageInfo.estimatedTime}
                </Text>
              </View>
            )}

            {/* Question content */}
            {currentQuestion && (
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
                <View style={styles.questionHeader}>
                  <MaterialCommunityIcons
                    name={
                      currentQuestion.icon as keyof typeof MaterialCommunityIcons.glyphMap
                    }
                    size={40}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.questionText}>
                    {currentQuestion.question}
                  </Text>
                  {currentQuestion.helpText && (
                    <Text style={styles.helpText}>
                      {currentQuestion.helpText}
                    </Text>
                  )}
                </View>

                {/* Options */}
                {renderOptions()}

                {/* הודעה על מעבר אוטומטי */}
                {currentQuestion.type === "single" && autoAdvanceEnabled && (
                  <Text style={styles.autoAdvanceHint}>
                    ⏰ מעבר אוטומטי לשאלה הבאה תוך שנייה...
                  </Text>
                )}

                {/* Error message */}
                {error && <Text style={styles.errorText}>{error}</Text>}
              </Animated.View>
            )}

            {/* Bottom buttons - מוסתרים בשאלות single choice כשיש מעבר אוטומטי פעיל */}
            {(currentQuestion?.type !== "single" || !autoAdvanceEnabled) && (
              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={[
                    styles.nextButton,
                    !answers[currentQuestion?.id] &&
                      currentQuestion?.required &&
                      currentQuestion?.type !== "text" &&
                      styles.disabledButton,
                  ]}
                  onPress={() => handleNext()}
                  activeOpacity={0.8}
                  disabled={isTransitioning}
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
                      name={isLastQuestion ? "check" : "arrow-left"}
                      size={24}
                      color={theme.colors.text}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
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
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  skipText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  stageInfoContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 16,
    textAlign: "center",
  },
  stageSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  stageTime: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 8,
  },
  questionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  questionHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 28,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + "10",
  },
  optionContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
  },
  optionTextContainer: {
    flex: 1,
    marginHorizontal: 12,
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
    textAlign: "right",
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
    marginStart: 8, // שינוי RTL: marginStart במקום marginLeft
  },
  disabledButton: {
    opacity: 0.5,
  },
  autoAdvanceToggle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  autoAdvanceText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginEnd: 4, // שינוי RTL: marginEnd במקום marginRight
  },
  autoAdvanceHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
