/**
 * @file src/features/questionnaire/screens/QuestionnaireScreen.tsx
 * @brief מסך שאלון אחוד פשוט
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useQuestionnaire } from "../hooks";
import { RootStackParamList } from "../../../navigation/types";
import { theme } from "../../../core/theme";
import { QuestionOption } from "../types";
import { useUserStore } from "../../../stores/userStore";
import { logger } from "../../../utils/logger";
import { isRTL } from "../../../utils/rtlHelpers";
import ConfirmationModal from "../../../components/common/ConfirmationModal";

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

const QuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Use the questionnaire hook
  const {
    currentQuestion,
    selectedOptions,
    isLoading,
    progress, // 0..100
    canGoBack,
    isCompleted,
    handleSelectOption,
    handleNext,
    handlePrevious,
    completeQuestionnaire,
  } = useQuestionnaire();

  // אחרון: או לפי מזהה השאלה, או כשאחוזי התקדמות ~100
  const isLastQuestion =
    currentQuestion?.id === "diet_preferences" ||
    (typeof progress === "number" && progress >= 99);

  // מודל אישור יציאה
  const [confirmationModal, setConfirmationModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // כרטיס סיום
  const [showCompletionCard, setShowCompletionCard] = useState(false);

  // BackHandler
  useEffect(() => {
    const handleBackPress = () => {
      if (canGoBack) {
        handlePrevious();
        return true;
      }

      setConfirmationModal({
        visible: true,
        title: "יציאה מהשאלון?",
        message: "האם אתה בטוח שברצונך לצאת מהשאלון? התקדמותך תישמר.",
        confirmText: "צא",
        cancelText: "המשך",
        onConfirm: () => {
          setConfirmationModal((prev) => ({ ...prev, visible: false }));
          navigation.goBack();
        },
        onCancel: () => {
          setConfirmationModal((prev) => ({ ...prev, visible: false }));
        },
      });
      return true;
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => sub.remove();
  }, [canGoBack, handlePrevious, navigation]);

  // גלילה לראש העמוד בעת החלפת שאלה
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [currentQuestion?.id]);

  // השלמת השאלון
  const handleCompletion = async () => {
    logger.info("QuestionnaireScreen", "🎯 Starting handleCompletion");
    setShowCompletionCard(true);

    // בדיקת משתמש מחובר לפני הניווט
    const { user } = useUserStore.getState();
    const hasUser = !!(user?.id || user?.email || user?.name);

    logger.info("QuestionnaireScreen", "🎯 Navigation decision:", {
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        hasUser,
      },
    });

    try {
      // נווט קודם (מונע קונפליקטים עם עדכון ה־store)
      if (hasUser) {
        navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Auth",
              params: {
                screen: "Register",
                params: { fromQuestionnaire: true },
              },
            },
          ],
        });
      }

      // ואז שמור נתוני שאלון
      await completeQuestionnaire();
      logger.info(
        "QuestionnaireScreen",
        "🎯 Questionnaire data saved after navigation"
      );
    } catch (error) {
      logger.error("QuestionnaireScreen", "Navigation error:", error);
      // נפילה רכה
      if (hasUser) {
        navigation.navigate("MainApp");
      } else {
        navigation.navigate("Auth", {
          screen: "Register",
          params: { fromQuestionnaire: true },
        });
      }
    }
  };

  // רנדר אופציה
  const renderOption = (option: QuestionOption) => {
    const isSelected = selectedOptions.some((o) => o.id === option.id);

    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.optionCard, isSelected && styles.selectedOption]}
        onPress={() => handleSelectOption(option)}
        activeOpacity={0.7}
      >
        <View style={styles.optionHeader}>
          <Text style={styles.optionLabel}>{option.label}</Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          )}
        </View>
        {option.description && (
          <Text style={styles.optionDescription}>{option.description}</Text>
        )}
      </TouchableOpacity>
    );
  };

  // כרטיס סיום
  const renderCompletionCard = () => (
    <View style={styles.completionCard}>
      <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
      <Text style={styles.completionTitle}>השאלון הושלם בהצלחה!</Text>
      <Text style={styles.completionSubtitle}>התוכנית שלך נבנית כעת...</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  if (showCompletionCard) {
    return (
      <SafeAreaView style={styles.container}>
        {renderCompletionCard()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundAlt]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (canGoBack) {
                handlePrevious();
              } else {
                setConfirmationModal({
                  visible: true,
                  title: "יציאה מהשאלון?",
                  message: "האם אתה בטוח שברצונך לצאת מהשאלון? התקדמותך תישמר.",
                  confirmText: "צא",
                  cancelText: "המשך",
                  onConfirm: () => {
                    setConfirmationModal((prev) => ({
                      ...prev,
                      visible: false,
                    }));
                    navigation.goBack();
                  },
                  onCancel: () => {
                    setConfirmationModal((prev) => ({
                      ...prev,
                      visible: false,
                    }));
                  },
                });
              }
            }}
          >
            <Ionicons
              name={isRTL() ? "arrow-forward" : "arrow-back"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${clamp(progress ?? 0, 0, 100)}%` },
              ]}
            />
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* Question content */}
        {currentQuestion ? (
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Question header */}
            <View style={styles.questionHeader}>
              <Text style={styles.title}>{currentQuestion.title}</Text>
              {currentQuestion.subtitle && (
                <Text style={styles.subtitle}>{currentQuestion.subtitle}</Text>
              )}
            </View>

            {/* Question */}
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{currentQuestion.question}</Text>
              {currentQuestion.helpText && (
                <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
              )}
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map(renderOption)}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>טוען שאלון...</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (!currentQuestion || selectedOptions.length === 0) &&
                styles.disabledButton,
            ]}
            onPress={() => {
              if (currentQuestion && selectedOptions.length > 0) {
                logger.info("QuestionnaireScreen", "🎯 Button click debug:", {
                  isCompleted,
                  isLastQuestion,
                  progress,
                  currentQuestion: currentQuestion?.id,
                  selectedOptionsCount: selectedOptions.length,
                });

                if (isLastQuestion) {
                  logger.info(
                    "QuestionnaireScreen",
                    "🎯 Button pressed - Starting completion flow (last question)"
                  );
                  handleCompletion();
                } else {
                  logger.info(
                    "QuestionnaireScreen",
                    "Button pressed - Moving to next question"
                  );
                  handleNext();
                }
              }
            }}
            disabled={
              !currentQuestion || selectedOptions.length === 0 || isLoading
            }
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLoading ? "טוען..." : isLastQuestion ? "סיים שאלון" : "המשך"}
            </Text>
            {!isLoading && (
              <Ionicons
                name={
                  isLastQuestion
                    ? "checkmark-circle"
                    : isRTL()
                      ? "arrow-back"
                      : "arrow-forward"
                }
                size={24}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Confirmation Modal */}
        <ConfirmationModal
          {...confirmationModal}
          onClose={() =>
            setConfirmationModal((prev) => ({ ...prev, visible: false }))
          }
        />
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
  header: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginEnd: isRTL() ? 0 : 16,
    marginStart: isRTL() ? 16 : 0,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginEnd: isRTL() ? 8 : 0,
    marginStart: isRTL() ? 0 : 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    color: "#fff",
    position: "absolute",
    end: isRTL() ? undefined : -30,
    start: isRTL() ? -30 : undefined,
    top: -5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  questionHeader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  questionContainer: {
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  helpText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  selectedOption: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderColor: "#4CAF50",
  },
  optionHeader: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    start: 0,
    end: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(76, 175, 80, 0.5)",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginEnd: isRTL() ? 0 : 8,
    marginStart: isRTL() ? 8 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  completionCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
  completionSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 24,
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
});

export default QuestionnaireScreen;
