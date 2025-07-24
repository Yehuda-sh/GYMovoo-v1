/**
 * @file src/screens/questionnaire/DynamicQuestionnaireScreen.tsx
 * @brief מסך שאלון דינמי וחכם - מתאים שאלות לפי תשובות קודמות
 * @brief Dynamic smart questionnaire screen - adapts questions based on previous answers
 * @dependencies userStore (Zustand), React Navigation, AsyncStorage
 * @notes שאלות מותאמות אישית, לוגיקה דינמית, אנימציות חלקות, שמירת מצב
 * @notes Personalized questions, dynamic logic, smooth animations, state persistence
 * @recurring_errors וודא RTL מלא וזרימת נתונים נכונה
 * @recurring_errors Ensure full RTL and correct data flow
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
  Vibration,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import HeightSlider from "./HeightSlider";
import WeightSlider from "./WeightSlider";
import EquipmentSelector from "./EquipmentSelector";
import {
  getRelevantQuestions,
  Question,
  OptionWithImage,
  QuestionType,
} from "../../data/questionnaireData";
import { questionnaireService } from "../../services/questionnaireService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// מילון טיפים לכל שאלה
// Tips dictionary for each question
const COACH_TIPS: { [key: string]: string } = {
  age: "הגיל שלך עוזר לנו להתאים את עצימות האימונים והתאוששות",
  gender: "ההתאמה לפי מגדר מאפשרת לנו לקחת בחשבון הבדלים פיזיולוגיים",
  height: "הגובה שלך חשוב לחישוב BMI ולהתאמת תרגילים",
  weight: "המשקל עוזר לנו לחשב צריכה קלורית ועומסי אימון",
  goal: "המטרה שלך קובעת את סוג האימונים והתזונה המומלצת",
  experience: "רמת הניסיון קובעת את מורכבות התרגילים והתקדמות",
  frequency: "תדירות האימונים משפיעה על חלוקת האימונים והתאוששות",
  duration: "משך האימון קובע את מבנה האימון וכמות התרגילים",
  location: "מיקום האימון משפיע על סוג התרגילים והציוד הזמין",
  home_equipment: "הציוד הביתי שלך יקבע את מגוון התרגילים האפשריים",
  gym_equipment: "ציוד חדר הכושר מאפשר לנו לגוון את התוכנית",
  health_conditions: "מידע בריאותי חיוני לבטיחות ולהתאמה אישית",
  fitness_assessment: "הערכת כושר עוזרת לנו לקבוע נקודת התחלה מדויקת",
};

// הודעות גיימיפיקציה
// Gamification messages
const ACHIEVEMENT_MESSAGES = [
  { at: 3, message: "מעולה! אתה מתקדם יפה 💪", icon: "star" },
  { at: 6, message: "חצי דרך! המשך כך 🎯", icon: "trophy" },
  { at: 9, message: "כמעט שם! עוד קצת 🚀", icon: "medal" },
];

// אנליטיקס בסיסית
// Basic analytics
interface QuestionnaireAnalytics {
  timePerQuestion: { [questionId: string]: number };
  totalTime: number;
  abandonedAt?: string;
  completionRate: number;
}

export default function DynamicQuestionnaireScreen({ navigation, route }: any) {
  const { setQuestionnaire } = useUserStore();

  // ניהול מצב
  // State management
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<QuestionnaireAnalytics>({
    timePerQuestion: {},
    totalTime: 0,
    completionRate: 0,
  });
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(
    Date.now()
  );

  // קבלת שאלות רלוונטיות
  // Get relevant questions
  const questions = useMemo(() => getRelevantQuestions(answers), [answers]);
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // אנימציות
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const achievementScale = useRef(new Animated.Value(0)).current;

  // אנימציה של מעבר
  // Transition animation
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

  // עדכון התקדמות
  // Update progress
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / totalQuestions,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // בדיקת הודעת הישג
    // Check achievement message
    const achievement = ACHIEVEMENT_MESSAGES.find(
      (msg) => msg.at === currentQuestionIndex + 1
    );
    if (achievement) {
      showAchievement(achievement.message);
    }
  }, [currentQuestionIndex, totalQuestions]);

  // הצגת הודעת הישג
  // Show achievement message
  const showAchievement = (message: string) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "top",
      visibilityTime: 2000,
    });
    Animated.sequence([
      Animated.spring(achievementScale, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(achievementScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    if (Platform.OS === "ios") {
      Vibration.vibrate([0, 50, 50, 50]);
    }
  };

  // שמירת טיוטה
  // Save draft
  const saveDraft = async () => {
    try {
      await AsyncStorage.setItem(
        "questionnaire_draft",
        JSON.stringify({
          answers,
          currentIndex: currentQuestionIndex,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.error("Error saving draft:", e);
    }
  };

  // טעינת טיוטה
  // Load draft
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem("questionnaire_draft");
        if (draft) {
          const { answers: savedAnswers, currentIndex } = JSON.parse(draft);
          Alert.alert(
            "המשך מהמקום שהפסקת?",
            "מצאנו טיוטה שמורה. האם להמשיך ממנה?",
            [
              {
                text: "התחל מחדש",
                style: "cancel",
                onPress: () => AsyncStorage.removeItem("questionnaire_draft"),
              },
              {
                text: "המשך",
                onPress: () => {
                  setAnswers(savedAnswers);
                  setCurrentQuestionIndex(currentIndex);
                },
              },
            ]
          );
        }
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    };
    loadDraft();
  }, []);

  // שמירה אוטומטית
  // Auto-save
  useEffect(() => {
    const timer = setTimeout(saveDraft, 5000);
    return () => clearTimeout(timer);
  }, [answers, currentQuestionIndex]);

  // טיפול בתשובה
  // Handle answer
  const handleAnswer = (answer: any) => {
    const questionId = currentQuestion.id;

    // עדכון אנליטיקס
    // Update analytics
    const timeSpent = Date.now() - currentQuestionStartTime;
    setAnalytics((prev) => ({
      ...prev,
      timePerQuestion: {
        ...prev.timePerQuestion,
        [questionId]: timeSpent,
      },
    }));

    // עדכון תשובות
    // Update answers
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // ניקוי שגיאה
    // Clear error
    setError("");
  };

  // מעבר לשאלה הבאה
  // Go to next question
  const handleNext = () => {
    // וידוא תשובה
    // Validate answer
    if (!answers[currentQuestion.id] && currentQuestion.required !== false) {
      setError("נא לענות על השאלה לפני המעבר הלאה");
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

    if (currentQuestionIndex < questions.length - 1) {
      animateTransition(true, () => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setCurrentQuestionStartTime(Date.now());
        // איפוס ערכי קלט
        // Reset input values
        setTextInput("");
        setNumberInput("");
        setSelectedMultiple([]);
      });
    } else {
      handleComplete();
    }
  };

  // חזרה לשאלה הקודמת
  // Go to previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      animateTransition(false, () => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setCurrentQuestionStartTime(Date.now());
      });
    }
  };

  // יציאה
  // Exit
  const handleExit = () => {
    Alert.alert("לצאת מהשאלון?", "הנתונים שלך יישמרו כטיוטה", [
      { text: "ביטול", style: "cancel" },
      {
        text: "יציאה",
        style: "destructive",
        onPress: () => {
          saveDraft();
          navigation.goBack();
        },
      },
    ]);
  };

  // השלמת השאלון
  // Complete questionnaire
  const handleComplete = async () => {
    // חישוב אנליטיקס סופית
    // Calculate final analytics
    const totalTime = Object.values(analytics.timePerQuestion).reduce(
      (sum, time) => sum + time,
      0
    );
    const finalAnalytics = {
      ...analytics,
      totalTime,
      completionRate: 1,
      completedAt: new Date().toISOString(),
    };

    // הצגת הודעה
    // Show toast
    Toast.show({
      type: "success",
      text1: "🎉",
      text2: "סיימת את השאלון בהצלחה",
      position: "top",
      visibilityTime: 3000,
    });

    // המרת התשובות לפורמט הישן לתאימות
    // Convert answers to old format for compatibility
    const formattedAnswers: { [key: number]: any } = {};
    let index = 0;

    // מיפוי התשובות החדשות לפורמט הישן
    // Map new answers to old format
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

    // שמירת כל הנתונים המורחבים
    // Save all extended data
    const metadata = {
      ...answers,
      completedAt: new Date().toISOString(),
      version: "2.0",
      analytics,
    };

    // שמירה ב-store - פורמט ישן וחדש
    // Save in store - both old and new format
    setQuestionnaire(formattedAnswers);
    useUserStore.getState().setQuestionnaireData({
      answers: formattedAnswers,
      metadata: answers,
      completedAt: new Date().toISOString(),
      version: "2.0",
    });

    // שמירה ב-service המרכזי
    // Save in central service
    await questionnaireService.saveQuestionnaireData(metadata);

    // מחיקת הטיוטה
    // Remove draft
    await AsyncStorage.removeItem("questionnaire_draft");

    // הצגת המלצות חכמות אם יש
    // Show smart recommendations if available
    setTimeout(() => {
      Alert.alert(
        "השאלון הושלם! 🎯",
        "כעת נבנה עבורך תוכנית אימון מותאמת אישית",
        [
          {
            text: "בוא נתחיל",
            onPress: () => navigation.navigate("MainApp"),
          },
        ]
      );
    }, 1000);
  };

  // רנדור שאלה
  // Render question
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <Animated.View
        style={[
          styles.questionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* כותרת שאלה */}
        {/* Question title */}
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* תת כותרת אם יש */}
        {/* Subtitle if exists */}
        {currentQuestion.subtitle && (
          <Text style={styles.subtitleText}>{currentQuestion.subtitle}</Text>
        )}

        {/* רנדור תשובות לפי סוג */}
        {/* Render answers by type */}
        <View style={styles.answerContainer}>{renderAnswerInput()}</View>

        {/* טיפ אם יש */}
        {/* Tip if exists */}
        {COACH_TIPS[currentQuestion.id] && (
          <View style={styles.coachTip}>
            <View style={styles.coachTipHeader}>
              <MaterialCommunityIcons
                name="lightbulb"
                size={16}
                color={theme.colors.warning}
              />
              <Text style={styles.coachTipTitle}>טיפ:</Text>
            </View>
            <Text style={styles.coachTipText}>
              {COACH_TIPS[currentQuestion.id]}
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  // רנדור קלט תשובה
  // Render answer input
  const renderAnswerInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "single":
        return (
          <View style={styles.optionsContainer}>
            {(currentQuestion.options || []).map((option) => {
              const optionValue =
                typeof option === "string"
                  ? option
                  : (option as OptionWithImage).id;
              const optionText =
                typeof option === "string"
                  ? option
                  : (option as OptionWithImage).label;
              const isSelected = answers[currentQuestion.id] === optionValue;

              return (
                <TouchableOpacity
                  key={optionValue}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleAnswer(optionValue)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {optionText}
                  </Text>
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
            {(currentQuestion.options || []).map((option) => {
              const optionValue =
                typeof option === "string"
                  ? option
                  : (option as OptionWithImage).id;
              const optionText =
                typeof option === "string"
                  ? option
                  : (option as OptionWithImage).label;
              const isSelected = selectedMultiple.includes(optionValue);

              return (
                <TouchableOpacity
                  key={optionValue}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    const newSelection = isSelected
                      ? selectedMultiple.filter((item) => item !== optionValue)
                      : [...selectedMultiple, optionValue];
                    setSelectedMultiple(newSelection);
                    handleAnswer(newSelection);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {optionText}
                  </Text>
                  <MaterialCommunityIcons
                    name={
                      isSelected ? "checkbox-marked" : "checkbox-blank-outline"
                    }
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

      case "text":
        return (
          <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={(text) => {
              setTextInput(text);
              handleAnswer(text);
            }}
            placeholder={currentQuestion.placeholder || "הקלד את התשובה שלך..."}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        );

      case "number":
        return (
          <View style={styles.numberInputContainer}>
            <TextInput
              style={styles.numberInput}
              value={numberInput}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, "");
                setNumberInput(num);
                handleAnswer(num ? parseInt(num) : null);
              }}
              placeholder={currentQuestion.placeholder || "0"}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              maxLength={3}
            />
            {currentQuestion.unit && (
              <Text style={styles.unitText}>{currentQuestion.unit}</Text>
            )}
          </View>
        );

      case "height":
        return (
          <HeightSlider
            value={answers[currentQuestion.id] || 170}
            onChange={(value: number) => handleAnswer(value)}
          />
        );

      case "weight":
        return (
          <WeightSlider
            value={answers[currentQuestion.id] || 70}
            onChange={(value: number) => handleAnswer(value)}
          />
        );

      case "multiple_with_search":
        const options = currentQuestion.dynamicOptions
          ? currentQuestion.dynamicOptions(answers)
          : (currentQuestion.options as OptionWithImage[]) || [];

        return (
          <EquipmentSelector
            options={options}
            selectedItems={answers[currentQuestion.id] || []}
            onChange={(items: string[]) => handleAnswer(items)}
            helpText={currentQuestion.helpText}
            subtitle={currentQuestion.subtitle}
          />
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.card]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>

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
        </View>

        {/* Progress Stepper */}
        <View style={styles.stepperContainer}>
          {Array.from({ length: Math.min(totalQuestions, 10) }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i < currentQuestionIndex && styles.stepDotCompleted,
                i === currentQuestionIndex && styles.stepDotActive,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {renderQuestion()}

          {/* Error message */}
          {error && (
            <Animated.View
              style={[
                styles.errorContainer,
                {
                  transform: [{ translateX: errorShake }],
                },
              ]}
            >
              <MaterialCommunityIcons
                name="alert-circle"
                size={20}
                color={theme.colors.error}
              />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Navigation buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={
                currentQuestionIndex === 0
                  ? theme.colors.textSecondary + "50"
                  : theme.colors.text
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentQuestionIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              חזור
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
              {currentQuestionIndex === questions.length - 1 ? "סיום" : "הבא"}
            </Text>
            <MaterialCommunityIcons
              name={
                currentQuestionIndex === questions.length - 1
                  ? "check"
                  : "chevron-left"
              }
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  exitButton: {
    alignSelf: "flex-end",
    padding: theme.spacing.sm,
  },
  progressContainer: {
    marginTop: theme.spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.card,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  stepperContainer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.card,
  },
  stepDotCompleted: {
    backgroundColor: theme.colors.primary,
  },
  stepDotActive: {
    backgroundColor: theme.colors.accent,
    transform: [{ scale: 1.5 }],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    flexGrow: 1,
  },
  questionContainer: {
    alignItems: "center",
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitleText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  answerContainer: {
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  optionsContainer: {
    width: "100%",
  },
  optionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
    ...theme.shadows.small,
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + "10",
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  optionTextSelected: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 120,
    textAlign: "right",
    ...theme.shadows.small,
  },
  numberInputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  numberInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    minWidth: 120,
    textAlign: "center",
    ...theme.shadows.small,
  },
  unitText: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  coachTip: {
    backgroundColor: theme.colors.warning + "10",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    width: "100%",
  },
  coachTipHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  coachTipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.warning,
    marginRight: theme.spacing.sm,
    flex: 1,
  },
  coachTipText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.error + "10",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginRight: theme.spacing.sm,
    flex: 1,
  },
  navigationContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  navButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minWidth: 100,
  },
  navButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginHorizontal: theme.spacing.sm,
  },
  navButtonTextPrimary: {
    color: "white",
  },
  navButtonTextDisabled: {
    color: theme.colors.textSecondary + "50",
  },
  integrationContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    alignItems: "center",
  },
  integrationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  integrationButtons: {
    flexDirection: "row-reverse",
    gap: theme.spacing.md,
  },
  integrationButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  integrationButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
});
