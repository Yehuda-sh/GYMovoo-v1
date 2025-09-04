/**
 * @file src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx
 * @brief מסך שאלון אחוד - מסך שאלון מתקדם עם תמיכה מלאה ב-RTL
 * @description מסך שאלון מאוחד עם תמיכה מלאה ב-RTL, גלילה מושלמת ואנימציות
 *
 * Features:
 * - ממשק שאלון אינטראקטיבי עם התקדמות בזמן אמת
 * - גלילה מושלמת עם ScrollView מותאם
 * - רשימת אפשרויות מלאה וזמינה
 * - ממשק פשוט וברור עם עיצוב מודרני
 * - תמיכה מלאה ב-RTL ועברית
 * - שמירה אוטומטית של התקדמות עם דיבאונס
 * - מערכת לוגינג מתקדמת לניפוי שגיאות
 *
 * @created 2025-01-15
 * @updated 2025-08-17 החלפת Alert ב-ConfirmationModal, החלפת console בלוגינג מותני, הוספת React.memo, הוספת CONSTANTS
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import ConfirmationModal
import ConfirmationModal from "../../components/common/ConfirmationModal";

// המערכת החדשה האחודה
import {
  UnifiedQuestionnaireManager,
  Question,
  QuestionOption,
  QuestionnaireAnswer,
} from "../../data/unifiedQuestionnaire";

import { useUserStore } from "../../stores/userStore";
import { userApi } from "../../services/api/userApi";
import { theme } from "../../styles/theme";
import { logger } from "../../utils/logger";
import type { SmartQuestionnaireData } from "../../types";

// Debug logging system
const DEBUG = __DEV__;
const dlog = (message: string, ...args: unknown[]) => {
  if (DEBUG) {
    logger.debug(
      `[UnifiedQuestionnaireScreen] ${message}`,
      args.length > 0 ? JSON.stringify(args) : ""
    );
  }
};

// Constants to prevent duplications
const CONSTANTS = {
  RTL_PROPERTIES: {
    WRITING_DIRECTION: "rtl" as const,
    TEXT_ALIGN_RIGHT: "right" as const,
    TEXT_ALIGN_CENTER: "center" as const,
  },
  BORDERS: {
    THIN: 1,
    THICK: 2,
  },
  TIMINGS: {
    DEBOUNCE_SAVE: 1200,
    QUESTION_TRANSITION: 300,
  },
  SIZES: {
    ICON_SMALL: 16,
    ICON_MEDIUM: 24,
    ICON_LARGE: 48,
    INDICATOR_SIZE: 24,
    INDICATOR_RADIUS: 12,
  },
};

// =====================================
// 🎯 המסך החדש - פשוט ויעיל
// =====================================

const UnifiedQuestionnaireScreen: React.FC = React.memo(() => {
  const navigation = useNavigation();
  const { updateUser, logout, setSmartQuestionnaireData, user } =
    useUserStore();

  // State management
  const [manager] = useState(() => new UnifiedQuestionnaireManager());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<{
    experience: string;
    goals: string;
    answersBullets: string;
  } | null>(null);
  const [serverSaved, setServerSaved] = useState(false);

  // ConfirmationModal state
  const [confirmationModal, setConfirmationModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    variant?: "default" | "error" | "success" | "warning" | "info";
    singleButton?: boolean;
  }>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // ScrollView reference for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // Helper function for modal operations
  const hideModal = () =>
    setConfirmationModal({
      visible: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });

  const showModal = (config: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    variant?: "default" | "error" | "success" | "warning" | "info";
    singleButton?: boolean;
  }) => {
    setConfirmationModal({
      visible: true,
      ...config,
    });
  };

  // שמירה לשרת בדיבאונס כדי לא להציף קריאות בזמן מענה על שאלות
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleServerSync = useCallback(
    (data: SmartQuestionnaireData) => {
      if (!user?.id) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await userApi.update(user.id!, { smartquestionnairedata: data });
          dlog("Synced questionnaire snapshot to server");
        } catch (e) {
          dlog("Server sync (debounced) failed", { error: e });
        }
      }, 1200);
    },
    [user]
  );

  // ניקוי הטיימר בדמות unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, []);

  // טיפוסים פנימיים לשחזור ושדות אופציונליים בהעדפות
  type SavedProgress = {
    answers: QuestionnaireAnswer[];
    progress: number;
    totalAnswered: number;
    savedAt: string;
  };
  type OptionWithMeta = QuestionOption & {
    metadata?: { equipment?: string[] };
  };

  const loadCurrentQuestion = useCallback(() => {
    const question = manager.getCurrentQuestion();
    setCurrentQuestion(question);
    setSelectedOptions([]);
    // מצמצמים רעש: לא מדפיסים לוג טעינת שאלה בכל פעם
  }, [manager]);

  const restoreProgress = useCallback(
    (progressData: SavedProgress) => {
      try {
        // שחזר את התשובות
        if (progressData.answers && Array.isArray(progressData.answers)) {
          progressData.answers.forEach((answer: QuestionnaireAnswer) => {
            manager.answerQuestion(answer.questionId, answer.answer);
          });

          dlog(
            `Restored ${progressData.answers.length} answers from saved progress`
          );
        }

        // טען את השאלה הנוכחית
        loadCurrentQuestion();

        // מחק את ההתקדמות השמורה כי היא נטענה
        AsyncStorage.removeItem("questionnaire_draft");
      } catch (error) {
        dlog("Error restoring progress", { error });
        loadCurrentQuestion();
      }
    },
    [loadCurrentQuestion, manager]
  );

  const loadCurrentQuestionWithProgress = useCallback(async () => {
    try {
      // 🔍 בדוק אם יש התקדמות שמורה
      const savedProgress = await AsyncStorage.getItem("questionnaire_draft");

      if (savedProgress) {
        const progressData = JSON.parse(savedProgress) as SavedProgress;
        dlog("Found saved questionnaire progress", {
          totalAnswered: progressData.totalAnswered,
          progress: progressData.progress,
          savedAt: progressData.savedAt,
        });

        // שחזור אוטומטי ללא שאלה למשתמש
        restoreProgress(progressData);
        // מעבר לשאלה הבאה שלא נענתה לשמירה על רצף
        try {
          manager.goToNextUnanswered();
          loadCurrentQuestion();
        } catch (e) {
          dlog("auto-restore navigation failed", { error: e });
        }
      } else {
        loadCurrentQuestion();
      }
    } catch (error) {
      dlog("Error checking saved progress", { error });
      loadCurrentQuestion();
    }
  }, [loadCurrentQuestion, restoreProgress, manager]);

  // restoreProgress הוגדרה למעלה

  // Load initial question and check for saved progress
  useEffect(() => {
    loadCurrentQuestionWithProgress();
  }, [loadCurrentQuestionWithProgress]);

  // הגנה מפני יציאה בטעות עם Back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // קבל את התשובות הנוכחיות
        const currentAnswers = manager.getResults().answers;

        if (currentAnswers.length === 0) {
          // 🚪 אם אין תשובות - יציאה מהירה ללא שמירה
          setConfirmationModal({
            visible: true,
            title: "יציאה מהשאלון",
            message: "האם אתה בטוח שברצונך לצאת מהשאלון?",
            confirmText: "יציאה",
            cancelText: "ביטול",
            destructive: true,
            onConfirm: async () => {
              dlog(
                "User exited questionnaire with no progress - full logout and reset"
              );
              try {
                // התנתק מהמשתמש הנוכחי
                await logout();
                dlog("Full logout completed - navigating to clean Welcome");
                // חזור למסך Welcome נקי לגמרי
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Welcome" }],
                });
              } catch (error) {
                dlog("Error during full logout", { error });
                // גם אם יש שגיאה, נווט למסך Welcome
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Welcome" }],
                });
              }
            },
          });
        } else {
          // 💾 אם יש תשובות - הצע שמירה
          // Note: ConfirmationModal doesn't support 3 buttons, so we'll handle this differently
          showModal({
            title: "יציאה מהשאלון",
            message: `יש לך ${currentAnswers.length} תשובות שנשמרו.\nהאם לשמור את ההתקדמות?`,
            confirmText: "שמור וצא",
            cancelText: "צא בלי שמירה",
            destructive: false,
            onConfirm: () => {
              // שמור התקדמות
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
              // חזור למסך Welcome עם ההתקדמות השמורה
              navigation.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
              });
            },
            onCancel: async () => {
              dlog(
                "User chose to exit without saving progress - full logout and reset"
              );
              try {
                // מחק כל הנתונים הקשורים לשאלון
                await AsyncStorage.multiRemove([
                  "questionnaire_draft",
                  "questionnaire_metadata",
                  "user_profile",
                ]);
                // התנתק מהמשתמש הנוכחי
                await logout();
                dlog("Full logout completed - navigating to clean Welcome");
                // חזור למסך Welcome נקי לגמרי
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Welcome" }],
                });
              } catch (error) {
                dlog("Error during full logout", { error });
                // גם אם יש שגיאה, נווט למסך Welcome
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Welcome" }],
                });
              }
            },
          });
        }
        return true; // מונע יציאה אוטומטית
      }
    );

    return () => backHandler.remove();
  }, [navigation, manager, logout]);

  // loadCurrentQuestion מוגדר למעלה עם useCallback

  // פונקציה עזר: מחזירה מזהי תשובות (id או מערך id) ללא שימוש ב-any
  const extractIds = (
    answer: QuestionOption | QuestionOption[]
  ): string | string[] => {
    return Array.isArray(answer) ? answer.map((opt) => opt.id) : answer.id;
  };

  // Handle option selection
  const handleOptionSelect = (option: QuestionOption) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === "single") {
      // Single selection - replace
      setSelectedOptions([option]);
    } else {
      // Multiple selection - toggle
      const isSelected = selectedOptions.some((opt) => opt.id === option.id);
      if (isSelected) {
        setSelectedOptions((prev) =>
          prev.filter((opt) => opt.id !== option.id)
        );
      } else {
        setSelectedOptions((prev) => [...prev, option]);
      }
    }
  };

  // Handle next question
  const handleNext = () => {
    if (!currentQuestion || selectedOptions.length === 0) return;

    setIsLoading(true);

    // Save answer
    const answer =
      currentQuestion.type === "single" ? selectedOptions[0] : selectedOptions;

    manager.answerQuestion(currentQuestion.id, answer);

    // 💾 שמירת טיוטה מיידית אחרי כל תשובה
    try {
      const draft = manager.getResults();
      AsyncStorage.setItem(
        "questionnaire_draft",
        JSON.stringify({
          answers: draft.answers,
          progress: manager.getProgress(),
          totalAnswered: draft.answeredQuestions,
          savedAt: new Date().toISOString(),
        })
      ).catch(() => {});
    } catch (e) {
      dlog("draft save failed", { error: e });
    }

    // ⚡ עדכון בזמן אמת ל-store עם תמונת מצב חוקית (IDs מהשאלון בלבד)
    try {
      const snapshot = manager.toSmartQuestionnaireData();
      setSmartQuestionnaireData(snapshot);
      // סנכרון מדורג לשרת בכל תשובה
      scheduleServerSync(snapshot);
    } catch (e) {
      // שקט כברירת מחדל
      dlog("setSmartQuestionnaireData snapshot failed", { error: e });
    }

    // הדפסת מערך תשובות מסודר לאחר כל תשובה
    try {
      const all = manager.getResults().answers;
      const compact = all.map((a) => ({
        id: a.questionId,
        value: extractIds(a.answer),
      }));
      // לוג יחיד מרוכז
      dlog("Questionnaire answers (compact)", compact);
    } catch (e) {
      dlog("Failed to build compact answers log", { error: e });
    }

    // Move to next question
    setTimeout(() => {
      const hasNext = manager.nextQuestion();

      if (hasNext) {
        loadCurrentQuestion();
      } else {
        completeQuestionnaire();
      }

      setIsLoading(false);
    }, 300);
  };

  // Handle previous question
  const handlePrevious = () => {
    if (manager.canGoBack()) {
      manager.previousQuestion();
      loadCurrentQuestion();
    }
  };

  // Complete questionnaire
  const completeQuestionnaire = async () => {
    try {
      dlog("Starting questionnaire completion...");
      const results = manager.getResults();
      dlog("Questionnaire results", {
        answersCount: results.answers.length,
        answers: results.answers.map((a) => ({
          id: a.questionId,
          hasAnswer: !!a.answer,
        })),
      });

      // Create demo user from answers
      const answersMap: Record<string, QuestionOption | QuestionOption[]> = {};
      results.answers.forEach((answer) => {
        answersMap[answer.questionId] = answer.answer;
      });

      // מפה משנית של מזהים בלבד עבור שירות הדמו (תאימות לטיפוסים קיימים)
      const answersIdsMap: { [key: string]: string | string[] } = {};
      results.answers.forEach((a) => {
        answersIdsMap[a.questionId] = extractIds(a.answer);
      });

      // ביטול יצירת משתמש דמו – נמשיך עם המשתמש האמיתי מה-store

      // פונקציות עזר לקבלת מזהה/תווית תשובה
      const getAnswerValue = (
        map: Record<string, QuestionOption | QuestionOption[]>,
        questionId: string
      ): string | null => {
        const answer = map[questionId];
        if (!answer) return null;
        if (Array.isArray(answer)) return answer[0]?.id ?? null;
        return answer.id ?? null;
      };

      const getAnswerLabel = (
        map: Record<string, QuestionOption | QuestionOption[]>,
        questionId: string
      ): string | null => {
        const answer = map[questionId];
        if (!answer) return null;
        if (Array.isArray(answer))
          return (
            answer
              .map((o) => o.label)
              .filter(Boolean)
              .join(", ") || null
          );
        return answer.label ?? null;
      };

      dlog("Raw answers from questionnaire", {
        fitness_goal: getAnswerValue(answersMap, "fitness_goal"),
        experience_level: getAnswerValue(answersMap, "experience_level"),
        availability: getAnswerValue(answersMap, "availability"),
        session_duration: getAnswerValue(answersMap, "session_duration"),
        workout_location: getAnswerValue(answersMap, "workout_location"),
        diet_preferences: getAnswerValue(answersMap, "diet_preferences"),
      });

      // 🔍 Equipment extraction: scan all answer keys containing 'equipment'
      const extractedEquipmentIds: string[] = [];
      Object.entries(answersMap).forEach(([key, value]) => {
        if (!key.includes("equipment")) return;
        const val = value as QuestionOption | QuestionOption[];
        if (Array.isArray(val)) {
          val.forEach((opt) => {
            if (opt && typeof opt === "object") {
              // direct id
              if (opt.id) {
                extractedEquipmentIds.push(opt.id);
              }
              // nested metadata.equipment array (אופציונלי)
              const optWithMeta = opt as OptionWithMeta;
              const eq = optWithMeta.metadata?.equipment;
              if (Array.isArray(eq)) {
                eq.forEach((e) => {
                  if (typeof e === "string") extractedEquipmentIds.push(e);
                });
              }
            }
          });
        } else if (val && typeof val === "object") {
          if (val.id) extractedEquipmentIds.push(val.id);
        }
      });
      const dedup = Array.from(new Set(extractedEquipmentIds));
      const realEquipment = dedup.filter(
        (id) => id && !["none", "no_equipment"].includes(id)
      );
      const finalEquipment =
        realEquipment.length > 0 ? realEquipment : ["none"];
      dlog("Equipment extraction (unified)", {
        keysScanned: Object.keys(answersMap).filter((k) =>
          k.includes("equipment")
        ),
        extractedEquipmentIds,
        dedup,
        realEquipment,
        finalEquipment,
      });

      // יצירת תמונת מצב חוקית ע"פ unifiedQuestionnaire (IDs מוכרים בלבד)
      const smartData = manager.toSmartQuestionnaireData();

      // עדכון המשתמש האמיתי ב-Store עם נתוני השאלון שנבחרו בפועל
      const questionnairePayload = {
        goal: getAnswerValue(answersMap, "fitness_goal") || undefined,
        experience: getAnswerValue(answersMap, "experience_level") || undefined,
        equipment: finalEquipment,
        frequency: getAnswerValue(answersMap, "availability") || undefined,
        duration: getAnswerValue(answersMap, "session_duration") || undefined,
        location: getAnswerValue(answersMap, "workout_location") || undefined,
        diet: getAnswerValue(answersMap, "diet_preferences") || undefined,
        answers: results.answers,
      } as const;

      // עדכון מבוסס SmartQuestionnaireData (מפעיל מיפויים ב-userStore)
      try {
        setSmartQuestionnaireData(smartData);
      } catch (e) {
        dlog("setSmartQuestionnaireData failed on completion", { error: e });
      }

      // Helper function to safely convert goal to string array
      const goalToStringArray = (goal: unknown): string[] | undefined => {
        if (Array.isArray(goal)) {
          return goal.filter(
            (item): item is string => typeof item === "string"
          );
        }
        if (typeof goal === "string") {
          return [goal];
        }
        return undefined;
      };

      updateUser({
        // נעדכן נתוני אימון/העדפות בסיסיות לפי התשובות
        trainingstats: {
          selectedEquipment: finalEquipment,
          fitnessGoals: goalToStringArray(questionnairePayload.goal),
        },
        // שימור נתוני שאלון בפורמט תואם (metadata)
        questionnairedata: {
          answers: undefined,
          metadata: {
            ...questionnairePayload,
            completedAt: new Date().toISOString(),
            source: "UnifiedQuestionnaireScreen",
          },
          version: "unified-1",
        },
      });

      dlog("Saved questionnaire to real user (store)", {
        equipment: finalEquipment,
        goal: questionnairePayload.goal,
        experience: questionnairePayload.experience,
        frequency: questionnairePayload.frequency,
        duration: questionnairePayload.duration,
        location: questionnairePayload.location,
        diet: questionnairePayload.diet,
      });

      // 💾 Save to AsyncStorage for WorkoutPlansScreen
      try {
        // פורמט תואם ל-QuestionnaireService – רק ערכים אמיתיים מהשאלון, ללא פולבאקים
        const questionnaireMetadata = {
          goal: getAnswerValue(answersMap, "fitness_goal") || "",
          experience: getAnswerValue(answersMap, "experience_level") || "",
          equipment: finalEquipment,
          available_equipment: finalEquipment,
          sessionDuration: getAnswerValue(answersMap, "session_duration") || "",
          availableDays: getAnswerValue(answersMap, "availability") || "",
          location: getAnswerValue(answersMap, "workout_location") || "",
          diet: getAnswerValue(answersMap, "diet_preferences") || "",
          // מטא-דאטה נוספת
          completedAt: new Date().toISOString(),
          source: "UnifiedQuestionnaireScreen",
          answers: results.answers,
        };

        await AsyncStorage.setItem(
          "questionnaire_metadata",
          JSON.stringify(questionnaireMetadata)
        );
        dlog(
          "Questionnaire metadata saved to AsyncStorage for WorkoutPlansScreen"
        );
      } catch (storageError) {
        dlog("Error saving questionnaire data to AsyncStorage", {
          error: storageError,
        });
      }

      // 📡 שמירה לשרת (אם יש משתמש מחובר עם id)
      try {
        if (user?.id) {
          setServerSaved(false);
          // תוך שמירה על ערכים חוקיים בלבד מתוך smartData
          // הוספת timeout של 10 שניות למניעת תקיעה
          const savePromise = userApi.update(user.id, {
            smartquestionnairedata: smartData,
            // תמיכה לתאימות מסכים ישנים: נשמור גם metadata בפורמט הקיים
            questionnairedata: {
              answers: undefined,
              metadata: {
                equipment: finalEquipment,
                goal: getAnswerValue(answersMap, "fitness_goal") || undefined,
                experience:
                  getAnswerValue(answersMap, "experience_level") || undefined,
                sessionDuration:
                  getAnswerValue(answersMap, "session_duration") || undefined,
                availableDays:
                  getAnswerValue(answersMap, "availability") || undefined,
                location:
                  getAnswerValue(answersMap, "workout_location") || undefined,
                diet:
                  getAnswerValue(answersMap, "diet_preferences") || undefined,
                completedAt: new Date().toISOString(),
                source: "UnifiedQuestionnaireScreen",
              },
              version: "unified-1",
            },
          });

          // הוספת timeout למניעת תקיעה
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server timeout")), 10000)
          );

          await Promise.race([savePromise, timeoutPromise]);
          setServerSaved(true);
          dlog("Questionnaire saved to server for user", user.id);

          // 🚀 הפעלת שירות ה-onboarding האוטומטי לכל משתמש חדש
          try {
            const { completeUserOnboarding } = await import(
              "../../services/userOnboardingService"
            );
            const onboardingResult = await completeUserOnboarding(user.id);
            dlog("User onboarding completed successfully", onboardingResult);
          } catch (onboardingError) {
            dlog("Error in user onboarding", { error: onboardingError });
            // לא נעצור את התהליך אם יש שגיאה באונבורדינג - המשתמש יכול להמשיך
          }
        } else {
          // אין משתמש עם ID - מאפשר המשך בכל מקרה
          setServerSaved(true);
          dlog("No user ID - proceeding with local data only");
        }
      } catch (serverErr) {
        dlog("Failed to persist questionnaire to server", { error: serverErr });
        // במקום להשאיר את המשתמש תקוע, נאפשר המשך עם שמירה מקומית בלבד
        setServerSaved(true); // מאפשר למשתמש להמשיך
        showModal({
          title: "שמירה מקומית",
          message: "השאלון נשמר מקומית במכשיר. תוכל להמשיך ללא שמירה בשרת.",
          confirmText: "המשך",
          singleButton: true,
          variant: "error",
          onConfirm: () => {},
        });
      }

      // ניקוי טיוטה כדי למנוע הצעת שחזור אחרי השלמה
      try {
        await AsyncStorage.removeItem("questionnaire_draft");
      } catch (e) {
        dlog("draft cleanup failed", { error: e });
      }

      // יצירת סיכום תשובות פשוט (5 ראשונות בלבד)
      const answersSummary = results.answers
        .slice(0, 5) // רק 5 תשובות ראשונות
        .map((answer) => {
          if (Array.isArray(answer.answer)) {
            const labels = answer.answer
              .map((opt) => opt.label)
              .slice(0, 2)
              .join(", ");
            return `• ${labels}${answer.answer.length > 2 ? " ועוד..." : ""}`;
          } else {
            return `• ${answer.answer.label}`;
          }
        })
        .join("\n");

      // Build a local completion card based on current selections (not server)
      setCompletionSummary({
        experience: getAnswerLabel(answersMap, "experience_level") || "-",
        goals: getAnswerLabel(answersMap, "fitness_goal") || "-",
        answersBullets: answersSummary,
      });
      setShowCompletionCard(true);
    } catch (error) {
      dlog("Error completing questionnaire", { error });
      showModal({
        title: "שגיאה",
        message: "בעיה בשמירת השאלון. אנא נסה שוב.",
        confirmText: "אישור",
        singleButton: true,
        variant: "error",
        onConfirm: () => {},
      });
    }
  };

  // Render loading state
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>טוען שאלון...</Text>
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
              // קבל את התשובות הנוכחיות לפני ההודעה
              const currentAnswers = manager.getResults().answers;

              if (currentAnswers.length === 0) {
                // 🚪 אם אין תשובות בכלל - יציאה מהירה ללא שמירה
                showModal({
                  title: "יציאה מהשאלון",
                  message: "האם אתה בטוח שברצונך לצאת מהשאלון?",
                  confirmText: "יציאה",
                  cancelText: "ביטול",
                  destructive: true,
                  onConfirm: async () => {
                    dlog(
                      "User exited questionnaire with no progress - full logout and reset"
                    );
                    try {
                      // התנתק מהמשתמש הנוכחי
                      await logout();
                      dlog(
                        "Full logout completed - navigating to clean Welcome"
                      );
                      // חזור למסך Welcome נקי לגמרי
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Welcome" }],
                      });
                    } catch (error) {
                      dlog("Error during full logout", { error });
                      // גם אם יש שגיאה, נווט למסך Welcome
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Welcome" }],
                      });
                    }
                  },
                });
              } else {
                // 💾 אם יש תשובות - הצע שמירה
                showModal({
                  title: "יציאה מהשאלון",
                  message: `יש לך ${currentAnswers.length} תשובות שנשמרו.\nהאם לשמור את ההתקדמות?`,
                  confirmText: "שמור וצא",
                  cancelText: "צא בלי שמירה",
                  destructive: false,
                  onConfirm: () => {
                    // 💾 שמור את ההתקדמות הנוכחית
                    dlog("Saving questionnaire progress before exit");
                    const progress = manager.getProgress();
                    AsyncStorage.setItem(
                      "questionnaire_draft",
                      JSON.stringify({
                        answers: currentAnswers,
                        progress: progress,
                        totalAnswered: currentAnswers.length,
                        savedAt: new Date().toISOString(),
                      })
                    )
                      .then(() => {
                        dlog(
                          "Questionnaire progress saved successfully on exit"
                        );
                      })
                      .catch((error) => {
                        dlog("Failed to save questionnaire progress", {
                          error,
                        });
                      });

                    // חזור למסך Welcome עם ההתקדמות השמורה
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Welcome" }],
                    });
                  },
                  onCancel: async () => {
                    dlog(
                      "User chose to exit without saving progress - full logout and reset"
                    );
                    try {
                      // מחק התקדמות קודמת אם יש
                      await AsyncStorage.removeItem("questionnaire_draft");
                      // התנתק מהמשתמש הנוכחי
                      await logout();
                      dlog(
                        "Full logout completed - navigating to clean Welcome"
                      );
                      // חזור למסך Welcome נקי לגמרי
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Welcome" }],
                      });
                    } catch (error) {
                      dlog("Error during full logout", { error });
                      // גם אם יש שגיאה, נווט למסך Welcome
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Welcome" }],
                      });
                    }
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
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Main Content - ScrollView עם הגנה מפני gesture conflicts */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scrollEventThrottle={1} // מהיר יותר לאמולטור
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          overScrollMode="always" // Android specific
          alwaysBounceVertical={true} // iOS specific
          contentInset={{ bottom: 100 }} // iOS specific
          contentInsetAdjustmentBehavior="automatic"
          removeClippedSubviews={false} // חשוב לאמולטור
          directionalLockEnabled={true} // נעל לגלילה אנכית בלבד
          scrollsToTop={false} // מנע גלילה אוטומטית לראש
        >
          {/* Back Button (in question) */}
          {manager.canGoBack() && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePrevious}
              disabled={isLoading}
              accessibilityLabel="חזור לשאלה הקודמת"
              accessibilityRole="button"
            >
              <Ionicons
                name="chevron-forward" // RTL: שימוש בחץ ימינה במקום שמאלה
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.backButtonText}>השאלה הקודמת</Text>
            </TouchableOpacity>
          )}

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
                (opt) => opt.id === option.id
              );

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleOptionSelect(option)}
                  disabled={isLoading}
                >
                  <View style={styles.optionContent}>
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
                    </View>

                    {/* Selection Indicator */}
                    <View
                      style={[
                        styles.selectionIndicator,
                        isSelected && styles.selectionIndicatorSelected,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={theme.colors.white}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Floating Next Button - צף בתחתית המסך */}
        {selectedOptions.length > 0 && (
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
              style={[
                styles.floatingButton,
                isLoading && styles.floatingButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={isLoading}
            >
              <LinearGradient
                colors={
                  isLoading
                    ? [theme.colors.textTertiary, theme.colors.textTertiary]
                    : [theme.colors.primary, theme.colors.primaryDark]
                }
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

        {/* Completion Card Overlay */}
        {showCompletionCard && completionSummary && (
          <View style={styles.completionOverlay}>
            <View style={styles.completionCard}>
              <Text style={styles.completionTitle}>🎉 השאלון הושלם!</Text>
              <Text style={styles.completionSubtitle}>
                התוכנית האישית שלך מוכנה לפי הבחירות שלך.
              </Text>
              <View style={styles.completionSection}>
                <Text style={styles.completionSectionTitle}>סיכום מהיר</Text>
                <Text style={styles.completionBullets}>
                  {completionSummary.answersBullets}
                </Text>
                <Text style={styles.completionMeta}>
                  רמה: {completionSummary.experience} | מטרות:{" "}
                  {completionSummary.goals}
                </Text>
                <Text style={styles.completionNote}>
                  הערה: יש להמתין לשמירה מוצלחת לשרת לפני מעבר למסך הבית.
                </Text>
              </View>
              <View style={styles.completionButtonsRow}>
                <TouchableOpacity
                  style={[styles.completionButton, styles.secondaryButton]}
                  onPress={() => {
                    // חזרה לעריכה: עבור לשאלה האחרונה שנענתה
                    try {
                      manager.goToLastAnswered();
                    } catch (e) {
                      dlog("goToLastAnswered failed", { error: e });
                    }
                    loadCurrentQuestion();
                    setShowCompletionCard(false);
                  }}
                >
                  <Text style={styles.completionButtonTextSecondary}>
                    עריכת שאלון
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.completionButton,
                    styles.primaryButton,
                    (!manager.isCompleted() || !serverSaved) &&
                      styles.disabledButton,
                  ]}
                  disabled={!manager.isCompleted() || !serverSaved}
                  onPress={() => {
                    if (!manager.isCompleted()) {
                      showModal({
                        title: "שאלון לא הושלם",
                        message: "יש להשלים את כל השאלות לפני מעבר למסך הבית.",
                        confirmText: "אישור",
                        singleButton: true,
                        variant: "warning",
                        onConfirm: () => {},
                      });
                      return;
                    }
                    if (!serverSaved) {
                      showModal({
                        title: "שמירה לשרת נדרשת",
                        message: "לא ניתן להתקדם לפני שהנתונים נשמרו לשרת.",
                        confirmText: "אישור",
                        singleButton: true,
                        variant: "warning",
                        onConfirm: () => {},
                      });
                      return;
                    }
                    setShowCompletionCard(false);
                    navigation.navigate("MainApp");
                  }}
                >
                  <Text style={styles.completionButtonTextPrimary}>
                    {serverSaved ? "בואו נתחיל!" : "ממתין לשרת..."}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* ConfirmationModal */}
      <ConfirmationModal
        visible={confirmationModal.visible}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        destructive={confirmationModal.destructive}
        variant={confirmationModal.variant}
        singleButton={confirmationModal.singleButton}
        onClose={() => hideModal()}
      />
    </SafeAreaView>
  );
});

UnifiedQuestionnaireScreen.displayName = "UnifiedQuestionnaireScreen";

// =====================================
// 🎨 Styles - פשוט וברור
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: CONSTANTS.BORDERS.THIN,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
    fontWeight: "700",
    textAlign: CONSTANTS.RTL_PROPERTIES.TEXT_ALIGN_CENTER,
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },

  // Progress
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
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },

  // ScrollView - מותאם עם תמיכה באמולטורים
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl, // רווח נורמלי
  },

  // Loading
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

  // Back Button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: CONSTANTS.BORDERS.THIN,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    writingDirection: CONSTANTS.RTL_PROPERTIES.WRITING_DIRECTION,
  },

  // Question
  questionHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  questionIcon: {
    fontSize: CONSTANTS.SIZES.ICON_LARGE,
    marginBottom: theme.spacing.md,
  },
  questionTitle: {
    ...theme.typography.title1,
    color: theme.colors.text,
    textAlign: CONSTANTS.RTL_PROPERTIES.TEXT_ALIGN_CENTER,
    marginBottom: theme.spacing.sm,
    writingDirection: CONSTANTS.RTL_PROPERTIES.WRITING_DIRECTION,
  },
  questionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: CONSTANTS.RTL_PROPERTIES.TEXT_ALIGN_CENTER,
    writingDirection: CONSTANTS.RTL_PROPERTIES.WRITING_DIRECTION,
  },

  questionContainer: {
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    ...theme.typography.title3,
    color: theme.colors.text,
    textAlign: CONSTANTS.RTL_PROPERTIES.TEXT_ALIGN_RIGHT,
    writingDirection: CONSTANTS.RTL_PROPERTIES.WRITING_DIRECTION,
  },
  helpText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    textAlign: CONSTANTS.RTL_PROPERTIES.TEXT_ALIGN_RIGHT,
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
    writingDirection: CONSTANTS.RTL_PROPERTIES.WRITING_DIRECTION,
  },

  // Options
  optionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  optionButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: CONSTANTS.BORDERS.THICK,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: "600",
    textAlign: CONSTANTS.RTL_PROPERTIES.TEXT_ALIGN_RIGHT,
    writingDirection: CONSTANTS.RTL_PROPERTIES.WRITING_DIRECTION,
  },
  optionLabelSelected: {
    color: theme.colors.primary,
  },
  optionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: CONSTANTS.RTL_PROPERTIES.TEXT_ALIGN_RIGHT,
    writingDirection: CONSTANTS.RTL_PROPERTIES.WRITING_DIRECTION,
  },
  optionDescriptionSelected: {
    color: theme.colors.primary,
  },
  selectionIndicator: {
    width: CONSTANTS.SIZES.INDICATOR_SIZE,
    height: CONSTANTS.SIZES.INDICATOR_SIZE,
    borderRadius: CONSTANTS.SIZES.INDICATOR_RADIUS,
    borderWidth: CONSTANTS.BORDERS.THICK,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionIndicatorSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  // Floating Button Styles - עיצוב משופר
  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + "40",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  floatingButton: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  floatingButtonGradient: {
    paddingVertical: theme.spacing.lg + 2,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  floatingButtonText: {
    color: theme.colors.white,
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
    fontSize: 16,
  },

  // Completion Overlay Styles
  completionOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "#00000055",
    justifyContent: "flex-end",
    padding: theme.spacing.lg,
  },
  completionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  completionTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  completionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  completionSection: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  completionSectionTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  completionBullets: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  completionMeta: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  completionNote: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
    textAlign: "right",
  },
  completionButtonsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  completionButton: {
    flex: 1,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  completionButtonTextPrimary: {
    ...theme.typography.bodyLarge,
    color: theme.colors.white,
    fontWeight: "700",
  },
  completionButtonTextSecondary: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: "700",
  },

  // Bottom Spacer
  bottomSpacer: {
    height: theme.spacing.xxl + 60, // רווח מותאם לכפתור הצף
    backgroundColor: "transparent",
  },
});

export default UnifiedQuestionnaireScreen;
