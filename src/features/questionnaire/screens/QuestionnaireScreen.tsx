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
import ConfirmationModal from "../../../components/common/ConfirmationModal";

const QuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Use the questionnaire hook
  const {
    currentQuestion,
    selectedOptions,
    isLoading,
    progress,
    canGoBack,
    isCompleted,
    handleSelectOption,
    handleNext,
    handlePrevious,
    completeQuestionnaire,
  } = useQuestionnaire();

  // State for the confirmation modal
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

  // State for showing completion card
  const [showCompletionCard, setShowCompletionCard] = useState(false);

  // Handle back button
  useEffect(() => {
    const handleBackPress = () => {
      if (canGoBack) {
        handlePrevious();
        return true;
      }

      // Ask if user wants to exit
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

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [canGoBack, handlePrevious, navigation]);

  // Handle completion
  const handleCompletion = async () => {
    setShowCompletionCard(true);
    const result = await completeQuestionnaire();

    if (result) {
      // Check user status to determine next screen
      const { user } = useUserStore.getState();
      const hasUser = !!(user?.id || user?.email || user?.name);

      logger.info(
        "QuestionnaireScreen",
        `Questionnaire completed successfully, navigating to ${hasUser ? "MainApp" : "Register screen"}`
      );

      // Navigate after short delay
      setTimeout(() => {
        try {
          if (hasUser) {
            // If user is logged in, go to MainApp
            navigation.reset({
              index: 0,
              routes: [{ name: "MainApp" }],
            });
          } else {
            // ניווט למסך רישום דרך navigator האימות
            logger.info(
              "QuestionnaireScreen",
              "Navigating to Register via Auth navigator with fromQuestionnaire=true"
            );
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
        } catch (error) {
          console.error("Navigation error:", error);
          // Fallback navigation if the reset fails
          if (hasUser) {
            navigation.navigate("MainApp");
          } else {
            navigation.navigate("Auth", {
              screen: "Register",
              params: { fromQuestionnaire: true },
            });
          }
        }
      }, 2000);
    } else {
      // Handle error
      setShowCompletionCard(false);
      setConfirmationModal({
        visible: true,
        title: "שגיאה",
        message: "אירעה שגיאה בשמירת השאלון. נסה שנית.",
        confirmText: "נסה שוב",
        onConfirm: () => {
          setConfirmationModal((prev) => ({ ...prev, visible: false }));
          handleCompletion();
        },
      });
    }
  };

  // Render option
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

  // Render completion card
  const renderCompletionCard = () => (
    <View style={styles.completionCard}>
      <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
      <Text style={styles.completionTitle}>השאלון הושלם בהצלחה!</Text>
      <Text style={styles.completionSubtitle}>התוכנית שלך נבנית כעת...</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  // Render content
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
                // Ask if user wants to exit
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
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(progress, 100)}%` },
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
                if (isCompleted) {
                  logger.info(
                    "QuestionnaireScreen",
                    "Button pressed - Starting completion flow"
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
          >
            <Text style={styles.nextButtonText}>
              {isLoading ? "טוען..." : isCompleted ? "סיים שאלון" : "המשך"}
            </Text>
            {!isLoading && (
              <Ionicons
                name={isCompleted ? "checkmark-circle" : "arrow-forward"}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginRight: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    color: "#fff",
    position: "absolute",
    right: -30,
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
    textAlign: "right",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "right",
  },
  questionContainer: {
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "right",
  },
  helpText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "right",
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
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
    marginRight: 8,
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
  },
  completionSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 24,
  },
});

export default QuestionnaireScreen;
