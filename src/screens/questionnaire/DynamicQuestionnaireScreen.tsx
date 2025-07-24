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

export default function DynamicQuestionnaireScreen({ navigation }: any) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [showCoachTip, setShowCoachTip] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [analytics, setAnalytics] = useState<QuestionnaireAnalytics>({
    timePerQuestion: {},
    totalTime: 0,
    completionRate: 0,
  });

  // אנימציות
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const tipOpacity = useRef(new Animated.Value(0)).current;

  const setQuestionnaire = useUserStore((s) => s.setQuestionnaire);

  // חישוב השאלות הרלוונטיות
  // Calculate relevant questions
  const relevantQuestions = useMemo(() => {
    const questions = getRelevantQuestions(answers);

    // הוספת שאלות הערכת כושר אם בחר ציוד ביתי
    // Add fitness assessment questions if home equipment selected
    if (
      (answers.location === "בית" || answers.location === "גם וגם") &&
      currentQuestionIndex > 7 &&
      !questions.find((q) => q.id === "fitness_assessment")
    ) {
      const fitnessQuestions: Question[] = [
        {
          id: "fitness_assessment",
          question: "בואו נעשה הערכת כושר קצרה",
          subtitle: "זה יעזור לנו להתאים את התוכנית בצורה מדויקת יותר",
          icon: "run-fast",
          type: "single",
          options: ["בטח! בוא נתחיל", "אולי אחר כך"],
          required: false,
        },
        {
          id: "pushups_count",
          question: "כמה שכיבות סמיכה אתה יכול לעשות ברצף?",
          icon: "arm-flex",
          type: "single",
          options: ["0-5", "6-15", "16-30", "31-50", "50+"],
          condition: (ans) => ans.fitness_assessment === "בטח! בוא נתחיל",
          required: false,
          helpText: "ללא הפסקה, בטכניקה נכונה",
        },
        {
          id: "plank_duration",
          question: "כמה זמן אתה יכול להחזיק פלאנק?",
          icon: "timer",
          type: "single",
          options: [
            "פחות מ-30 שניות",
            "30-60 שניות",
            "1-2 דקות",
            "2-3 דקות",
            "3+ דקות",
          ],
          condition: (ans) => ans.fitness_assessment === "בטח! בוא נתחיל",
          required: false,
          helpText: "במנח פלאנק סטנדרטי על המרפקים",
        },
        {
          id: "pullups_count",
          question: "כמה מתח אתה יכול לעשות?",
          icon: "weight-lifter",
          type: "single",
          options: ["0 (עדיין לא)", "1-3", "4-8", "9-15", "15+"],
          condition: (ans) =>
            ans.fitness_assessment === "בטח! בוא נתחיל" &&
            (ans.home_equipment?.includes("pull_up_bar") ||
              ans.gym_equipment?.includes("pull_up_bar")),
          required: false,
          helpText: "אחיזה רגילה, טווח תנועה מלא",
        },
      ];

      // הוסף את השאלות אחרי השאלה הנוכחית
      // Add questions after current question
      const insertIndex = currentQuestionIndex + 1;
      questions.splice(insertIndex, 0, ...fitnessQuestions);
    }

    return questions;
  }, [answers, currentQuestionIndex]);

  // השאלה הנוכחית
  // Current question
  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const totalQuestions = relevantQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // טעינת מצב שמור בהתחלה
  // Load saved state on mount
  useEffect(() => {
    loadSavedProgress();
    return () => {
      // שמירה אוטומטית ביציאה
      // Auto-save on exit
      if (
        currentQuestionIndex > 0 &&
        currentQuestionIndex < totalQuestions - 1
      ) {
        saveProgress();
      }
    };
  }, []);

  // עדכון progress bar ו-analytics
  // Update progress bar and analytics
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentQuestionIndex / totalQuestions,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // מדידת זמן לשאלה
    // Measure time per question
    if (currentQuestion) {
      const timeSpent = Date.now() - questionStartTime;
      setAnalytics((prev) => ({
        ...prev,
        timePerQuestion: {
          ...prev.timePerQuestion,
          [currentQuestion.id]: timeSpent,
        },
        completionRate: (currentQuestionIndex / totalQuestions) * 100,
      }));
      setQuestionStartTime(Date.now());
    }

    // הצגת טיפ למאמן
    // Show coach tip
    if (currentQuestion && COACH_TIPS[currentQuestion.id]) {
      setShowCoachTip(true);
      Animated.timing(tipOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    // בדיקת אצ'יבמנטס
    // Check achievements
    checkAchievements();
  }, [currentQuestionIndex]);

  // טעינת התקדמות שמורה
  // Load saved progress
  const loadSavedProgress = async () => {
    try {
      const savedData = await AsyncStorage.getItem("questionnaire_draft");
      if (savedData) {
        const draft = JSON.parse(savedData);
        const timeSince = Date.now() - draft.timestamp;

        // אם עברו פחות מ-24 שעות
        // If less than 24 hours passed
        if (timeSince < 24 * 60 * 60 * 1000) {
          Alert.alert(
            "המשך מאיפה שהפסקת?",
            `נמצאה התקדמות שמורה משאלה ${draft.currentIndex + 1}`,
            [
              {
                text: "התחל מחדש",
                onPress: () => AsyncStorage.removeItem("questionnaire_draft"),
                style: "cancel",
              },
              {
                text: "המשך",
                onPress: () => {
                  setAnswers(draft.answers);
                  setCurrentQuestionIndex(draft.currentIndex);
                },
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error loading saved progress:", error);
    }
  };

  // שמירת התקדמות
  // Save progress
  const saveProgress = async () => {
    try {
      const draft = {
        answers,
        currentIndex: currentQuestionIndex,
        timestamp: Date.now(),
        analytics,
      };
      await AsyncStorage.setItem("questionnaire_draft", JSON.stringify(draft));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // בדיקת אצ'יבמנטס
  // Check achievements
  const checkAchievements = () => {
    const achievement = ACHIEVEMENT_MESSAGES.find(
      (a) => a.at === currentQuestionIndex
    );
    if (achievement) {
      Vibration.vibrate(100);
      Toast.show({
        type: "success",
        text1: achievement.message,
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  // קבלת המלצות חכמות
  // Get smart recommendations
  const getSmartRecommendations = () => {
    const recommendations: string[] = [];

    if (
      answers.goal === "ירידה במשקל" &&
      answers.health_conditions?.includes("כאבי ברכיים")
    ) {
      recommendations.push("⚠️ מומלץ להתמקד באימונים עם עומס נמוך על הברכיים");
      recommendations.push("💡 שחייה ואופניים יכולים להיות אופציות מצוינות");
    }

    if (
      answers.experience === "מתחיל (0-6 חודשים)" &&
      answers.frequency === "כל יום"
    ) {
      recommendations.push("⚠️ למתחילים מומלץ להתחיל עם 3-4 אימונים בשבוע");
      recommendations.push("💡 ימי מנוחה חשובים להתאוששות ומניעת פציעות");
    }

    if (
      answers.sleep_hours === "פחות מ-5 שעות" &&
      answers.goal === "עליה במסת שריר"
    ) {
      recommendations.push("⚠️ שינה מספקת (7-9 שעות) קריטית לבניית שריר");
      recommendations.push("💡 שקול לשפר את איכות השינה לתוצאות טובות יותר");
    }

    return recommendations;
  };

  // הצגת שגיאה עם אנימציה
  // Show error with animation
  const showError = (message: string) => {
    setError(message);
    Vibration.vibrate(200);
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

  // טיפול באפשרות בודדת
  // Handle single option
  const handleSingleOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setError(null);
    Vibration.vibrate(50);
  };

  // טיפול באפשרויות מרובות
  // Handle multiple options
  const handleMultipleOption = (option: string) => {
    const current = answers[currentQuestion.id] || [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: updated }));
    setError(null);
    Vibration.vibrate(50);
  };

  // טיפול בקלט טקסט
  // Handle text input
  const handleTextInput = (text: string) => {
    setTextInput(text);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }));
    setError(null);
  };

  // טיפול בקלט מספרי
  // Handle number input
  const handleNumberInput = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setNumberInput(value);
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: num }));
      setError(null);
    }
  };

  // מעבר לשאלה הבאה
  // Move to next question
  const handleNext = () => {
    // בדיקת גיל בתחילה
    // Check age at the beginning
    if (currentQuestion.id === "age" && answers.age === "מתחת ל-16") {
      Alert.alert("הגבלת גיל", "ההרשמה מותרת רק מגיל 16 ומעלה", [
        { text: "הבנתי", onPress: () => navigation.goBack() },
      ]);
      return;
    }

    // בדיקות תקינות
    // Validation checks
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

    // שמירת התקדמות
    // Save progress
    saveProgress();

    // אנימציית מעבר
    // Transition animation
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
        // Reset and entry animation
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
        finishQuestionnaire();
      }
    });
  };

  // סיום השאלון
  // Finish questionnaire
  const finishQuestionnaire = async () => {
    console.log("📝 Questionnaire completed:", answers);

    // אצ'יבמנט סיום
    // Completion achievement
    Vibration.vibrate([100, 100, 100]);
    Toast.show({
      type: "success",
      text1: "כל הכבוד! 🎉",
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

    // שמירת כל הנתונים המורחבים גם ב-metadata
    // Save all extended data in metadata
    const metadata = {
      ...answers,
      completedAt: new Date().toISOString(),
      version: "2.0",
      analytics,
    };

    // שמירה ב-store
    // Save in store
    setQuestionnaire(formattedAnswers);

    // שמירת metadata נוסף
    // Save additional metadata
    await AsyncStorage.setItem(
      "questionnaire_metadata",
      JSON.stringify(metadata)
    );

    // מחיקת הטיוטה
    // Remove draft
    await AsyncStorage.removeItem("questionnaire_draft");

    // הצגת המלצות חכמות אם יש
    // Show smart recommendations if any
    const recommendations = getSmartRecommendations();
    if (recommendations.length > 0) {
      setTimeout(() => {
        Alert.alert("המלצות מותאמות אישית", recommendations.join("\n\n"), [
          {
            text: "הבנתי",
            onPress: () =>
              navigation.reset({ index: 0, routes: [{ name: "MainApp" }] }),
          },
        ]);
      }, 500);
    } else {
      navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
    }
  };

  // חזרה לשאלה הקודמת
  // Go back to previous question
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
        // Restore previous values
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

  // קבלת אפשרויות דינמיות
  // Get dynamic options
  const getOptions = () => {
    if (currentQuestion.dynamicOptions) {
      return currentQuestion.dynamicOptions(answers);
    }
    return currentQuestion.options || [];
  };

  // בדיקה אם השאלה הנוכחית היא עם רכיב מיוחד
  // Check if current question has special component
  const isEquipmentQuestion =
    currentQuestion.id === "home_equipment" ||
    currentQuestion.id === "gym_equipment";

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>טוען...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.container}
    >
      <Toast />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              disabled={currentQuestionIndex === 0}
              style={[
                styles.backButton,
                currentQuestionIndex === 0 && styles.backButtonDisabled,
              ]}
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color={
                  currentQuestionIndex === 0
                    ? theme.colors.textSecondary
                    : theme.colors.text
                }
              />
            </TouchableOpacity>

            {/* Progress Stepper */}
            <View style={styles.progressContainer}>
              <View style={styles.progressSteps}>
                {Array.from({ length: Math.min(totalQuestions, 10) }).map(
                  (_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.progressStep,
                        i <= currentQuestionIndex && styles.progressStepActive,
                        i === currentQuestionIndex &&
                          styles.progressStepCurrent,
                      ]}
                    />
                  )
                )}
              </View>
              <Text style={styles.progressText}>
                {currentQuestionIndex + 1} / {totalQuestions}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Alert.alert("לצאת מהשאלון?", "ההתקדמות שלך תישמר", [
                  { text: "ביטול", style: "cancel" },
                  {
                    text: "יציאה",
                    onPress: () => {
                      saveProgress();
                      navigation.goBack();
                    },
                  },
                ]);
              }}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Coach Tip */}
          {showCoachTip && COACH_TIPS[currentQuestion.id] && (
            <Animated.View
              style={[styles.coachTipContainer, { opacity: tipOpacity }]}
            >
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={20}
                color={theme.colors.primary}
                style={styles.coachTipIcon}
              />
              <Text style={styles.coachTipText}>
                {COACH_TIPS[currentQuestion.id]}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Animated.timing(tipOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }).start(() => setShowCoachTip(false));
                }}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Question Content */}
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.questionHeader}>
              <MaterialCommunityIcons
                name={currentQuestion.icon as any}
                size={48}
                color={theme.colors.primary}
              />
              <Text style={styles.questionText}>
                {currentQuestion.question}
              </Text>
              {currentQuestion.subtitle && (
                <Text style={styles.questionSubtitle}>
                  {currentQuestion.subtitle}
                </Text>
              )}
            </View>

            {/* Question Type Components */}
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
                {/* Check if there are options with images */}
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
                  onChangeText={handleTextInput}
                  placeholder={currentQuestion.placeholder}
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  maxLength={500}
                  textAlign="right"
                  textAlignVertical="top"
                />
                <Text style={styles.textCounter}>{textInput.length}/500</Text>
              </View>
            )}

            {currentQuestion.type === "number" && (
              <View style={styles.numberInputContainer}>
                <TextInput
                  style={styles.numberInput}
                  value={numberInput}
                  onChangeText={handleNumberInput}
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
                onChange={(value) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: value,
                  }));
                  setError(null);
                }}
              />
            )}

            {currentQuestion.type === "weight" && (
              <WeightSlider
                value={answers[currentQuestion.id] || 70}
                onChange={(value) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: value,
                  }));
                  setError(null);
                }}
              />
            )}

            {/* Help Text */}
            {currentQuestion.helpText && !isEquipmentQuestion && (
              <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
            )}
          </Animated.View>

          {/* Error Message */}
          {error && (
            <Animated.View
              style={[
                styles.errorContainer,
                { transform: [{ translateX: errorShake }] },
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

          {/* Integration Buttons */}
          {currentQuestion.id === "additional_notes" && (
            <View style={styles.integrationContainer}>
              <Text style={styles.integrationTitle}>חבר אפליקציות כושר</Text>
              <Text style={styles.integrationSubtitle}>
                (אופציונלי - ניתן לחבר מאוחר יותר)
              </Text>
              <View style={styles.integrationButtons}>
                <TouchableOpacity style={styles.integrationButton}>
                  <FontAwesome5 name="apple" size={20} color="#fff" />
                  <Text style={styles.integrationButtonText}>Apple Health</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.integrationButton}>
                  <FontAwesome5 name="google" size={20} color="#fff" />
                  <Text style={styles.integrationButtonText}>Google Fit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.nextButton, styles.primaryButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? "סיים" : "הבא"}
              </Text>
              <MaterialCommunityIcons
                name={isLastQuestion ? "check" : "arrow-left"}
                size={20}
                color={theme.colors.background}
              />
            </TouchableOpacity>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonDisabled: {
    opacity: 0.3,
  },
  closeButton: {
    padding: 10,
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
  },
  progressSteps: {
    flexDirection: "row-reverse",
    gap: 6,
    marginBottom: 8,
  },
  progressStep: {
    width: 24,
    height: 4,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: theme.colors.primary,
  },
  progressStepCurrent: {
    backgroundColor: theme.colors.primary,
    transform: [{ scaleY: 1.5 }],
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  coachTipContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  coachTipIcon: {
    marginLeft: 8,
  },
  coachTipText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    textAlign: "right",
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "15",
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedOptionText: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  multipleHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  textInputContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 120,
    borderWidth: 2,
    borderColor: "transparent",
  },
  textCounter: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "left",
    marginTop: 8,
  },
  numberInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  numberInput: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: theme.colors.text,
    width: 100,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    fontWeight: "bold",
  },
  unitText: {
    fontSize: 20,
    color: theme.colors.text,
    marginLeft: 12,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
  },
  errorContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginRight: 8,
  },
  integrationContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  integrationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  integrationSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  integrationButtons: {
    flexDirection: "row",
    gap: 12,
  },
  integrationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  integrationButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  navigationContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    paddingTop: 20,
  },
  nextButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.background,
  },
});
