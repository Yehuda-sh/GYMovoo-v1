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
  const startTime = useRef(Date.now()).current;

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

  // אנימציית שגיאה
  // Error animation
  const showError = (message: string) => {
    setError(message);
    Vibration.vibrate(100);

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

    setTimeout(() => setError(null), 3000);
  };

  // אנימציית מעבר בין שאלות
  // Transition animation between questions
  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
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
    });
  };

  // טיפול בתשובות
  // Handle answers
  const handleAnswer = (value: any) => {
    if (!currentQuestion) return;

    Vibration.vibrate(50);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setError(null);

    // שמירה אוטומטית
    // Auto-save
    saveProgress();
  };

  // מעבר לשאלה הבאה
  // Move to next question
  const handleNext = () => {
    if (!currentQuestion) return;

    const currentAnswer = answers[currentQuestion.id];

    // בדיקת תשובה חובה
    // Check required answer
    if (currentQuestion.required && !currentAnswer) {
      showError("יש לענות על שאלה זו");
      return;
    }

    // בדיקת תשובת טקסט
    // Check text answer
    if (currentQuestion.type === "text" && currentAnswer === "") {
      if (currentQuestion.required) {
        showError("יש להזין תשובה");
        return;
      }
    }

    if (isLastQuestion) {
      handleComplete();
    } else {
      animateTransition(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTextInput("");
        setNumberInput("");
      });
    }
  };

  // סיום השאלון
  // Complete questionnaire
  const handleComplete = async () => {
    // בדיקה שכל השאלות החובה נענו
    // Check all required questions answered
    const unansweredRequired = relevantQuestions
      .filter((q) => q.required)
      .find((q) => !answers[q.id] || answers[q.id] === "");

    if (unansweredRequired) {
      showError("יש לענות על כל השאלות החובה");
      return;
    }

    // שמירת אנליטיקס סופית
    // Save final analytics
    setAnalytics((prev) => ({
      ...prev,
      totalTime: Date.now() - startTime,
      completionRate: 100,
    }));

    // הצגת טוסט הצלחה
    // Show success toast
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
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  // יציאה מהשאלון
  // Exit questionnaire
  const handleExit = () => {
    Alert.alert(
      "לצאת מהשאלון?",
      "ההתקדמות שלך תישמר ותוכל להמשיך מאיפה שהפסקת",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "יציאה",
          style: "destructive",
          onPress: () => {
            saveProgress();
            navigation.goBack();
          },
        },
      ]
    );
  };

  // רנדור השאלה הנוכחית
  // Render current question
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <Animated.View
        style={[
          styles.questionContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { translateX: errorShake },
            ],
          },
        ]}
      >
        {/* אייקון שאלה // Question icon */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={currentQuestion.icon as any}
            size={60}
            color={theme.colors.primary}
          />
        </View>

        {/* כותרת שאלה // Question title */}
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        {currentQuestion.subtitle && (
          <Text style={styles.subtitleText}>{currentQuestion.subtitle}</Text>
        )}

        {/* תוכן השאלה // Question content */}
        <View style={styles.answerContainer}>
          {renderQuestionContent()}
        </View>

        {/* טקסט עזרה // Help text */}
        {currentQuestion.helpText && (
          <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
        )}

        {/* טיפ למאמן // Coach tip */}
        {showCoachTip && COACH_TIPS[currentQuestion.id] && (
          <Animated.View style={[styles.coachTip, { opacity: tipOpacity }]}>
            <View style={styles.coachTipHeader}>
              <FontAwesome5
                name="lightbulb"
                size={16}
                color={theme.colors.warning}
              />
              <Text style={styles.coachTipTitle}>טיפ</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCoachTip(false);
                  Animated.timing(tipOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.coachTipText}>
              {COACH_TIPS[currentQuestion.id]}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  };

  // רנדור תוכן השאלה לפי סוג
  // Render question content by type
  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "single":
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[currentQuestion.id] === option &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswer(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    answers[currentQuestion.id] === option &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {answers[currentQuestion.id] === option && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case "multiple":
        const selectedMultiple = answers[currentQuestion.id] || [];
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedMultiple.includes(option) &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => {
                  const current = answers[currentQuestion.id] || [];
                  const updated = current.includes(option)
                    ? current.filter((o: string) => o !== option)
                    : [...current, option];
                  handleAnswer(updated);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedMultiple.includes(option) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                <MaterialCommunityIcons
                  name={
                    selectedMultiple.includes(option)
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={24}
                  color={
                    selectedMultiple.includes(option)
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
              </TouchableOpacity>
            ))}
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
            onValueChange={(value) => handleAnswer(value)}
          />
        );

      case "weight":
        return (
          <WeightSlider
            value={answers[currentQuestion.id] || 70}
            onValueChange={(value) => handleAnswer(value)}
          />
        );

      case "multiple_with_search":
        return (
          <EquipmentSelector
            selectedEquipment={answers[currentQuestion.id] || []}
            onSelectionChange={(selected) => handleAnswer(selected)}
            category={
              currentQuestion.id === "home_equipment" ? "home" : "gym"
            }
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
        colors={[theme.colors.background, theme.colors.surface]}
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
                  ? theme.colors.disabled
                  : theme.colors.text
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentQuestionIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              הקודם
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={handleNext}
          >
            <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
              {isLastQuestion ? "סיום" : "הבא"}
            </Text>
            <MaterialCommunityIcons
              name={isLastQuestion ? "check" : "chevron-left"}
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Integration buttons (UI only for now) */}
        {isLastQuestion && (
          <View style={styles.integrationContainer}>
            <Text style={styles.integrationTitle}>
              חבר את האפליקציות שלך (בקרוב)
            </Text>
            <View style={styles.integrationButtons}>
              <TouchableOpacity
                style={[styles.integrationButton, { opacity: 0.5 }]}
                disabled
              >
                <FontAwesome5 name="apple" size={20} color="#000" />
                <Text style={styles.integrationButtonText}>Apple Health</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.integrationButton, { opacity: 0.5 }]}
                disabled
              >
                <FontAwesome5 name="google" size={20} color="#4285F4" />
                <Text style={styles.integrationButtonText}>Google Fit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 50 : theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  exitButton: {
    padding: theme.spacing.sm,
  },
  progressContainer: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "left",
  },
  stepperContainer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  stepDotCompleted: {
    backgroundColor: theme.colors.success,
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  questionContainer: {
    alignItems: "center",
    paddingTop: theme.spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
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
    backgroundColor: theme.colors.surface,
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
    backgroundColor: theme.colors.surface,
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
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.disabled,
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
    backgroundColor: theme.colors.surface,
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