/**
 * @file src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx
 * @brief מסך שאלון אחוד פשוט
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import {
  UnifiedQuestionnaireManager,
  Question,
  QuestionOption,
} from "../../data/unifiedQuestionnaire";
import { useUserStore } from "../../stores/userStore";
import { userApi } from "../../services/api/userApi";
import { theme } from "../../styles/theme";
import type { QuestionnaireData } from "../../types";
import type { RootStackParamList } from "../../navigation/types";

const UnifiedQuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout, setSmartQuestionnaireData } = useUserStore();

  // State
  const [manager] = useState(() => new UnifiedQuestionnaireManager());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletionCard, setShowCompletionCard] = useState(false);
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

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Server sync with debouncing
  const scheduleServerSync = useCallback(
    (data: QuestionnaireData) => {
      if (!user?.id) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          if (user?.id) {
            await userApi.update(user.id, { questionnaireData: data });
          }
        } catch (e) {
          console.warn("Server sync failed", e);
        }
      }, 1200);
    },
    [user]
  );

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, []);

  // Guard - redirect if questionnaire already completed
  useEffect(() => {
    if (user?.id && user?.hasQuestionnaire && user?.questionnaireData) {
      navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
    }
  }, [user, navigation]);

  // Timeout בטיחות - מניעת תקיעות בשאלון
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (currentQuestion && selectedOptions.length > 0 && !isLoading) {
      // אם יש תשובה אבל השאלון לא מתקדם במשך 60 שניות
      timeoutId = setTimeout(() => {
        console.warn("⚠️ Questionnaire timeout - auto advancing");
        // נקרא לפונקציה ישירות במקום להשתמש ב-handleNext
        if (manager.isCompleted()) {
          completeQuestionnaire();
        } else {
          manager.nextQuestion();
          loadCurrentQuestion();
        }
      }, 60000); // 60 שניות
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  // Load current question
  const loadCurrentQuestion = useCallback(() => {
    try {
      const question = manager.getCurrentQuestion();
      setCurrentQuestion(question);
      if (question) {
        // Get current answers for this question
        const allAnswers = manager.getAllAnswers();
        const currentAnswers = allAnswers.find(
          (a) => a.questionId === question.id
        );
        if (currentAnswers) {
          const answers = Array.isArray(currentAnswers.answer)
            ? currentAnswers.answer
            : [currentAnswers.answer];
          setSelectedOptions(answers);
        } else {
          setSelectedOptions([]);
        }
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    } catch (error) {
      console.warn("Error loading question", error);
    }
  }, [manager]);

  // Restore progress
  const restoreProgress = useCallback(
    (progressData: {
      answers: Array<{ questionId: string; answer: unknown }>;
    }) => {
      try {
        // Simple restoration - just answer each question again
        progressData.answers.forEach(
          (answer: { questionId: string; answer: unknown }) => {
            if (answer.questionId && answer.answer) {
              manager.answerQuestion(
                answer.questionId,
                answer.answer as QuestionOption | QuestionOption[]
              );
            }
          }
        );
      } catch (error) {
        console.warn("Error restoring progress", error);
      }
    },
    [manager]
  );

  // Check for saved progress
  const checkSavedProgress = useCallback(async () => {
    try {
      const savedProgress = await AsyncStorage.getItem("questionnaire_draft");
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        setConfirmationModal({
          visible: true,
          title: "המשך שאלון",
          message: `נמצא שאלון שהתחלת (${progressData.totalAnswered} תשובות). רוצה להמשיך או להתחיל מחדש?`,
          confirmText: "המשך",
          cancelText: "התחל מחדש",
          onConfirm: () => {
            restoreProgress(progressData);
            // Move to next unanswered question
            while (
              manager.getCurrentQuestion() &&
              manager
                .getAllAnswers()
                .some((a) => a.questionId === manager.getCurrentQuestion()?.id)
            ) {
              if (!manager.nextQuestion()) break;
            }
            loadCurrentQuestion();
            setConfirmationModal((prev) => ({ ...prev, visible: false }));
          },
          onCancel: async () => {
            await AsyncStorage.removeItem("questionnaire_draft");
            manager.reset();
            loadCurrentQuestion();
            setConfirmationModal((prev) => ({ ...prev, visible: false }));
          },
        });
      } else {
        loadCurrentQuestion();
      }
    } catch (error) {
      console.warn("Error checking saved progress", error);
      loadCurrentQuestion();
    }
  }, [manager, loadCurrentQuestion, restoreProgress]);

  // Initial load
  useEffect(() => {
    checkSavedProgress();
  }, [checkSavedProgress]);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const currentAnswers = manager.getResults().answers;

        if (currentAnswers.length === 0) {
          setConfirmationModal({
            visible: true,
            title: "יציאה מהשאלון",
            message: "האם אתה בטוח שברצונך לצאת מהשאלון?",
            confirmText: "יציאה",
            cancelText: "ביטול",
            onConfirm: async () => {
              await logout();
              navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
            },
            onCancel: () => {
              setConfirmationModal((prev) => ({ ...prev, visible: false }));
            },
          });
        } else {
          setConfirmationModal({
            visible: true,
            title: "שמירת התקדמות",
            message: `יש לך ${currentAnswers.length} תשובות שנשמרו. האם לשמור את ההתקדמות?`,
            confirmText: "שמור וצא",
            cancelText: "צא בלי שמירה",
            onConfirm: () => {
              const progress = manager.getProgress();
              AsyncStorage.setItem(
                "questionnaire_draft",
                JSON.stringify({
                  answers: currentAnswers,
                  progress: progress,
                  totalAnswered: currentAnswers.length,
                  savedAt: new Date().toISOString(),
                })
              );
              navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
            },
            onCancel: async () => {
              await AsyncStorage.multiRemove([
                "questionnaire_draft",
                "questionnaire_metadata",
                "user_profile",
              ]);
              await logout();
              navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
            },
          });
        }
        return true;
      }
    );

    return () => backHandler.remove();
  }, [manager, navigation, logout]);

  // Handle option selection
  const handleOptionPress = (option: QuestionOption) => {
    if (!currentQuestion) return;

    let newSelectedOptions: QuestionOption[] = [];

    if (currentQuestion.type === "single") {
      newSelectedOptions = [option];
    } else {
      const isSelected = selectedOptions.some(
        (selected) => selected.id === option.id
      );
      if (isSelected) {
        newSelectedOptions = selectedOptions.filter(
          (selected) => selected.id !== option.id
        );
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
    }

    setSelectedOptions(newSelectedOptions);
    const answer =
      newSelectedOptions.length === 1
        ? newSelectedOptions[0]
        : newSelectedOptions;
    if (answer) {
      manager.answerQuestion(currentQuestion.id, answer);
    }

    // Auto-advance for single selection
    if (currentQuestion.type === "single" && newSelectedOptions.length > 0) {
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  // Handle next question
  const handleNext = async () => {
    console.log(`📋 handleNext called`);
    console.log(`📝 Selected options:`, selectedOptions);

    if (!currentQuestion || selectedOptions.length === 0) {
      console.warn("❌ No question or no selected options");
      alert("אנא בחר תשובה לפני המשך");
      return;
    }

    setIsLoading(true);
    try {
      const answer =
        selectedOptions.length === 1 ? selectedOptions[0] : selectedOptions;
      if (answer) {
        manager.answerQuestion(currentQuestion.id, answer);
        console.log(
          `✅ Answer saved for question ${currentQuestion.id}:`,
          answer
        );
      }

      // Sync to server
      const smartData = manager.toSmartQuestionnaireData();
      scheduleServerSync(smartData);

      const isCompleted = manager.isCompleted();
      console.log("🎯 Checking completion:", {
        isCompleted,
        currentIndex: manager.getCurrentQuestion()?.id,
        answersCount: manager.getAllAnswers().length,
      });

      if (isCompleted) {
        console.log(
          "🎯 Questionnaire completed - calling completeQuestionnaire"
        );
        await completeQuestionnaire();
      } else {
        console.log("➡️ Moving to next question");
        console.log(
          "📊 Before nextQuestion - current question:",
          manager.getCurrentQuestion()?.id
        );
        manager.nextQuestion();
        console.log(
          "📊 After nextQuestion - current question:",
          manager.getCurrentQuestion()?.id
        );
        loadCurrentQuestion();
        console.log(
          "📊 After loadCurrentQuestion - selected options:",
          selectedOptions.length
        );
      }
    } catch (error) {
      console.error("❌ Error handling next", error);
      alert("אירעה שגיאה. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  // Complete questionnaire
  const completeQuestionnaire = async () => {
    console.log("🎯 completeQuestionnaire started");
    try {
      const smartData = manager.toSmartQuestionnaireData();
      console.log(
        "📊 Smart data generated:",
        Object.keys(smartData.answers || {}).length,
        "answers"
      );

      setSmartQuestionnaireData(smartData);
      console.log("✅ Data saved to store");

      // Save to AsyncStorage for Register screen
      await AsyncStorage.setItem(
        "smart_questionnaire_results",
        JSON.stringify(smartData)
      );
      console.log("✅ Data saved to AsyncStorage");

      setShowCompletionCard(true);
      console.log("✅ Completion card shown");
    } catch (error) {
      console.error("❌ Error completing questionnaire", error);
      setConfirmationModal({
        visible: true,
        title: "שגיאה",
        message: "בעיה בשמירת השאלון. אנא נסה שוב.",
        confirmText: "אישור",
        onConfirm: () => {
          setConfirmationModal((prev) => ({ ...prev, visible: false }));
        },
      });
    }
  };

  // Render loading state
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>טוען שאלון...</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadCurrentQuestion()}
          >
            <Text style={styles.retryButtonText}>נסה שוב</Text>
          </TouchableOpacity>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              const currentAnswers = manager.getResults().answers;
              if (currentAnswers.length === 0) {
                setConfirmationModal({
                  visible: true,
                  title: "יציאה מהשאלון",
                  message: "האם אתה בטוח שברצונך לצאת מהשאלון?",
                  confirmText: "יציאה",
                  cancelText: "ביטול",
                  onConfirm: async () => {
                    await logout();
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Welcome" }],
                    });
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
            style={styles.backButton}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>שאלון אישי</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.round(progress)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Main Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <Text style={styles.questionIcon}>{currentQuestion.icon}</Text>
            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
            {currentQuestion.subtitle && (
              <Text style={styles.questionSubtitle}>
                {currentQuestion.subtitle}
              </Text>
            )}
          </View>

          {/* Question Text */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.helpText && (
              <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
            )}
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptions.some(
                (selected) => selected.id === option.id
              );
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleOptionPress(option)}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionIcon}>📋</Text>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text style={styles.optionSubtitle}>
                          {option.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.colors.white}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Next Button */}
        {selectedOptions.length > 0 && (
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
              style={[
                styles.floatingButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleNext}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.floatingButtonGradient}
              >
                <Text style={styles.floatingButtonText}>
                  {isLoading
                    ? "שומר..."
                    : currentQuestion.type === "single"
                      ? "הבא"
                      : `הבא (${selectedOptions.length} נבחרו)`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Completion Card */}
        {showCompletionCard && (
          <View style={styles.completionOverlay}>
            <View style={styles.completionCard}>
              <Text style={styles.completionTitle}>🎉 השאלון הושלם!</Text>
              <Text style={styles.completionSubtitle}>
                התוכנית האישית שלך מוכנה לפי הבחירות שלך.
              </Text>
              <TouchableOpacity
                style={styles.completionButton}
                onPress={async () => {
                  console.log("🎯 Completion button pressed");
                  try {
                    const smartData = manager.toSmartQuestionnaireData();
                    await AsyncStorage.setItem(
                      "smart_questionnaire_results",
                      JSON.stringify(smartData)
                    );
                    console.log("✅ Final save completed");

                    // בדיקה אם יש משתמש מחובר
                    if (user?.id) {
                      console.log("👤 User logged in - going to Main");
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Main" }],
                      });
                    } else {
                      console.log("👤 No user - going to Register");
                      // Be more explicit about which Register screen to use
                      // Use the old RegisterScreen which handles fromQuestionnaire correctly
                      console.log(
                        "🔍 DEBUG - Before navigation from UnifiedQuestionnaireScreen"
                      );
                      console.log("🔍 User in store:", user);

                      // First, make sure the questionnaire data is saved in AsyncStorage
                      const smartData = manager.toSmartQuestionnaireData();
                      await AsyncStorage.setItem(
                        "smart_questionnaire_results",
                        JSON.stringify(smartData)
                      );

                      // Force navigation directly to the NEW RegisterScreen in the Auth module
                      setTimeout(() => {
                        navigation.reset({
                          index: 0,
                          routes: [
                            {
                              name: "Auth", // Navigate to the Auth navigator
                              params: {
                                screen: "Register",
                                params: { fromQuestionnaire: true },
                              },
                            },
                          ],
                        });
                        console.log(
                          "✅ Navigation reset called to Auth/Register with fromQuestionnaire=true"
                        );
                      }, 300);
                    }
                  } catch (error) {
                    console.error("❌ Error saving results", error);
                    alert("שגיאה בשמירה. אנא נסה שוב.");
                  }
                }}
              >
                <Text style={styles.completionButtonText}>סיים שאלון</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Confirmation Modal */}
      {confirmationModal.onCancel &&
        confirmationModal.confirmText &&
        confirmationModal.cancelText && (
          <ConfirmationModal
            visible={confirmationModal.visible}
            title={confirmationModal.title}
            message={confirmationModal.message}
            onConfirm={confirmationModal.onConfirm}
            onCancel={confirmationModal.onCancel}
            confirmText={confirmationModal.confirmText}
            cancelText={confirmationModal.cancelText}
            onClose={() =>
              setConfirmationModal((prev) => ({ ...prev, visible: false }))
            }
          />
        )}
    </SafeAreaView>
  );
};

export default UnifiedQuestionnaireScreen;

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
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginRight: theme.spacing.md,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  questionHeader: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  questionIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  questionSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: theme.spacing.md,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  optionButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  optionButtonSelected: {
    backgroundColor: theme.colors.primary + "20",
    borderColor: theme.colors.primary,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
    marginBottom: theme.spacing.xs,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSpacer: {
    height: 100,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  floatingButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  floatingButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  floatingButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  completionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  completionCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  completionSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  completionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
  },
  completionButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
