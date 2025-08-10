/**
 * @file src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx
 * @brief מסך שאלון אחוד חדש - פשוט, יעיל ועובד
 * @description New unified questionnaire screen - simple, efficient and working
 *
 * 🎯 החלפת SmartQuestionnaireScreen הישן
 * ✅ גלילה מושלמת עם ScrollView
 * ✅ רשימת אפשרויות מלאה וזמינה
 * ✅ ממשק פשוט וברור
 * ✅ תמיכה מלאה ב-RTL ועברית
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// המערכת החדשה האחודה
import {
  UnifiedQuestionnaireManager,
  Question,
  QuestionOption,
  QuestionnaireResults,
} from "../../data/unifiedQuestionnaire";

import { useUserStore } from "../../stores/userStore";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { realisticDemoService } from "../../services/realisticDemoService";

// =====================================
// 🎯 המסך החדש - פשוט ויעיל
// =====================================

const UnifiedQuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setCustomDemoUser, logout } = useUserStore();

  // State management
  const [manager] = useState(() => new UnifiedQuestionnaireManager());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<QuestionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debug עבור אמולטור
  const scrollViewRef = useRef<ScrollView>(null);

  // Load initial question and check for saved progress
  useEffect(() => {
    loadCurrentQuestionWithProgress();
  }, []);

  const loadCurrentQuestionWithProgress = async () => {
    try {
      // 🔍 בדוק אם יש התקדמות שמורה
      const savedProgress = await AsyncStorage.getItem("questionnaire_draft");

      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        console.log("📋 Found saved questionnaire progress:", {
          totalAnswered: progressData.totalAnswered,
          progress: progressData.progress,
          savedAt: progressData.savedAt,
        });

        // שאל את המשתמש אם לחזור להתקדמות השמורה
        Alert.alert(
          "התקדמות שמורה נמצאה",
          `נמצאה התקדמות שמורה עם ${progressData.totalAnswered || 0} תשובות.\nהאם לחזור למקום שבו עצרת?`,
          [
            {
              text: "התחל מחדש",
              style: "destructive",
              onPress: () => {
                // מחק את ההתקדמות השמורה והתחל מחדש
                AsyncStorage.removeItem("questionnaire_draft");
                loadCurrentQuestion();
              },
            },
            {
              text: "המשך מהמקום שעצרתי",
              style: "default",
              onPress: () => {
                // טען את ההתקדמות השמורה
                restoreProgress(progressData);
              },
            },
          ]
        );
      } else {
        loadCurrentQuestion();
      }
    } catch (error) {
      console.error("❌ Error checking saved progress:", error);
      loadCurrentQuestion();
    }
  };

  const restoreProgress = (progressData: any) => {
    try {
      // שחזר את התשובות
      if (progressData.answers && Array.isArray(progressData.answers)) {
        progressData.answers.forEach((answer: any) => {
          manager.answerQuestion(answer.questionId, answer.answer);
        });

        console.log(
          `✅ Restored ${progressData.answers.length} answers from saved progress`
        );
      }

      // טען את השאלה הנוכחית
      loadCurrentQuestion();

      // מחק את ההתקדמות השמורה כי היא נטענה
      AsyncStorage.removeItem("questionnaire_draft");
    } catch (error) {
      console.error("❌ Error restoring progress:", error);
      loadCurrentQuestion();
    }
  };

  // הגנה מפני יציאה בטעות עם Back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // קבל את התשובות הנוכחיות
        const currentAnswers = manager.getResults().answers;

        if (currentAnswers.length === 0) {
          // 🚪 אם אין תשובות - יציאה מהירה ללא שמירה
          Alert.alert("יציאה מהשאלון", "האם אתה בטוח שברצונך לצאת מהשאלון?", [
            { text: "ביטול", style: "cancel" },
            {
              text: "יציאה",
              style: "destructive",
              onPress: async () => {
                console.log(
                  "🚪 User exited questionnaire with no progress - full logout and reset"
                );
                try {
                  // התנתק מהמשתמש הנוכחי
                  await logout();

                  console.log(
                    "✅ Full logout completed - navigating to clean Welcome"
                  );

                  // חזור למסך Welcome נקי לגמרי
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Welcome" }],
                  });
                } catch (error) {
                  console.error("❌ Error during full logout:", error);
                  // גם אם יש שגיאה, נווט למסך Welcome
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Welcome" }],
                  });
                }
              },
            },
          ]);
        } else {
          // 💾 אם יש תשובות - הצע שמירה
          Alert.alert(
            "יציאה מהשאלון",
            `יש לך ${currentAnswers.length} תשובות שנשמרו.\nההתקדמות תישמר ותוכל להמשיך בפעם הבאה.`,
            [
              { text: "ביטול", style: "cancel" },
              {
                text: "יציאה עם שמירה",
                style: "default",
                onPress: () => {
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
              },
              {
                text: "יציאה ללא שמירה",
                style: "destructive",
                onPress: async () => {
                  console.log(
                    "🗑️ User chose to exit without saving progress - full logout and reset"
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

                    console.log(
                      "✅ Full logout completed - navigating to clean Welcome"
                    );

                    // חזור למסך Welcome נקי לגמרי
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Welcome" }],
                    });
                  } catch (error) {
                    console.error("❌ Error during full logout:", error);
                    // גם אם יש שגיאה, נווט למסך Welcome
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Welcome" }],
                    });
                  }
                },
              },
            ]
          );
        }
        return true; // מונע יציאה אוטומטית
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const loadCurrentQuestion = () => {
    const question = manager.getCurrentQuestion();
    setCurrentQuestion(question);
    setSelectedOptions([]);
    console.log("📋 Loaded question:", question?.id);
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
      console.log("🎯 Starting questionnaire completion...");
      const results = manager.getResults();
      console.log("📊 Questionnaire results:", {
        answersCount: results.answers.length,
        answers: results.answers.map((a) => ({
          id: a.questionId,
          hasAnswer: !!a.answer,
        })),
      });

      // Create demo user from answers
      const answersMap: Record<string, any> = {};
      results.answers.forEach((answer) => {
        answersMap[answer.questionId] = answer.answer;
      });

      const customDemoUser =
        realisticDemoService.generateDemoUserFromQuestionnaire(answersMap);

      console.log("👤 Generated demo user:", {
        name: customDemoUser.name,
        equipment: customDemoUser.equipment,
        goals: customDemoUser.fitnessGoals,
      });

      // פונקציה עזר לקבלת ערך תשובה
      const getAnswerValue = (
        answersMap: Record<string, any>,
        questionId: string
      ) => {
        const answer = answersMap[questionId];
        if (!answer) return null;

        // אם זה תשובה יחידה - החזר את ה-ID שלה
        if (answer.id) return answer.id;

        // אם זה מערך תשובות - החזר את ה-ID של הראשון
        if (Array.isArray(answer) && answer.length > 0 && answer[0].id) {
          return answer[0].id;
        }

        return null;
      };

      console.log("🔍 Raw answers from questionnaire:", {
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
        if (Array.isArray(value)) {
          value.forEach((opt: any) => {
            if (opt && typeof opt === "object") {
              // direct id/value
              if (opt.id || opt.value) {
                extractedEquipmentIds.push(opt.id || opt.value);
              }
              // nested metadata.equipment array
              if (
                opt.metadata &&
                typeof opt.metadata === "object" &&
                Array.isArray(opt.metadata.equipment)
              ) {
                opt.metadata.equipment.forEach((e: any) => {
                  if (typeof e === "string") extractedEquipmentIds.push(e);
                });
              }
            } else if (typeof opt === "string") {
              extractedEquipmentIds.push(opt);
            }
          });
        } else if (value && typeof value === "object") {
          if ((value as any).id) extractedEquipmentIds.push((value as any).id);
        }
      });
      const dedup = Array.from(new Set(extractedEquipmentIds));
      const realEquipment = dedup.filter(
        (id) => id && !["none", "no_equipment"].includes(id)
      );
      const finalEquipment =
        realEquipment.length > 0 ? realEquipment : ["none"];
      console.log("🛠️ Equipment extraction (unified):", {
        keysScanned: Object.keys(answersMap).filter((k) =>
          k.includes("equipment")
        ),
        extractedEquipmentIds,
        dedup,
        realEquipment,
        finalEquipment,
      });

      // Save to store AND AsyncStorage
      const userProfileData = {
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
        equipment: finalEquipment, // override demo equipment with actual questionnaire selection
        preferredTime: customDemoUser.preferredTime,
        createdFromQuestionnaire: true,
        questionnaireTimestamp: new Date().toISOString(),

        // 🎯 Add questionnaire data in the format WorkoutPlansScreen expects
        questionnaireData: {
          // נתונים ישירים מהתשובות בפועל (לא מהדמו!)
          goal:
            getAnswerValue(answersMap, "fitness_goal") ||
            customDemoUser.fitnessGoals?.[0] ||
            "בריאות כללית",
          gender: customDemoUser.gender, // מהדמו כי אין שאלה על מגדר
          age: customDemoUser.age, // מהדמו כי אין שאלה על גיל
          experience:
            getAnswerValue(answersMap, "experience_level") ||
            customDemoUser.experience,
          equipment: finalEquipment, // normalized
          frequency:
            getAnswerValue(answersMap, "availability") ||
            (Array.isArray(customDemoUser.availableDays)
              ? customDemoUser.availableDays[0]
              : customDemoUser.availableDays) ||
            "3_times_week",
          duration:
            getAnswerValue(answersMap, "session_duration") ||
            customDemoUser.sessionDuration ||
            "30_45_min",
          location: getAnswerValue(answersMap, "workout_location") || "home",
          diet: getAnswerValue(answersMap, "diet_preferences") || "balanced",
          answers: results.answers,
          metadata: {
            completedAt: new Date().toISOString(),
            source: "UnifiedQuestionnaireScreen",
          },
        },
      };

      // Save to Zustand store
      setCustomDemoUser(userProfileData);

      console.log("💾 Saving user profile data:", {
        hasQuestionnaireData: !!userProfileData.questionnaireData,
        questionnaireKeys: userProfileData.questionnaireData
          ? Object.keys(userProfileData.questionnaireData)
          : [],
        actualValues: {
          goal: userProfileData.questionnaireData?.goal,
          equipment: userProfileData.questionnaireData?.equipment,
          experience: userProfileData.questionnaireData?.experience,
          frequency: userProfileData.questionnaireData?.frequency,
          duration: userProfileData.questionnaireData?.duration,
          location: userProfileData.questionnaireData?.location,
          diet: userProfileData.questionnaireData?.diet,
        },
      });

      // 💾 Save to AsyncStorage for WorkoutPlansScreen
      try {
        // פורמט תואם ל-QuestionnaireService
        const questionnaireMetadata = {
          // נתונים ישירים שהשירות מחפש
          goal: customDemoUser.fitnessGoals?.[0] || "בריאות כללית",
          gender: customDemoUser.gender,
          age: customDemoUser.age,
          experience: customDemoUser.experience,
          height: customDemoUser.height,
          weight: customDemoUser.weight,
          equipment: finalEquipment,
          available_equipment: finalEquipment,
          sessionDuration: customDemoUser.sessionDuration,
          availableDays: customDemoUser.availableDays,
          preferredTime: customDemoUser.preferredTime,
          diet: getAnswerValue(answersMap, "diet_preferences") || "balanced",

          // מטא-דאטה נוספת
          completedAt: new Date().toISOString(),
          source: "UnifiedQuestionnaireScreen",
          userProfile: userProfileData,
          answers: results.answers,
        };

        await AsyncStorage.setItem(
          "questionnaire_metadata",
          JSON.stringify(questionnaireMetadata)
        );
        console.log(
          "✅ Questionnaire metadata saved to AsyncStorage for WorkoutPlansScreen"
        );
      } catch (storageError) {
        console.error(
          "❌ Error saving questionnaire data to AsyncStorage:",
          storageError
        );
      }

      // יצירת סיכום תשובות פשוט
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

      // Show completion message with summary and options
      Alert.alert(
        "🎉 השאלון הושלם!",
        `התוכנית האישית שלך מוכנה!\n\n📋 סיכום התשובות:\n${answersSummary}\n\n👤 פרופיל שנוצר: ${customDemoUser.name}\n💪 רמה: ${customDemoUser.experience}\n🎯 מטרות: ${customDemoUser.fitnessGoals.join(", ")}`,
        [
          {
            text: "עריכת שאלון",
            style: "default",
            onPress: () => {
              // איפוס השאלון והתחלה מחדש
              manager.reset();
              loadCurrentQuestion();
            },
          },
          {
            text: "בואו נתחיל!",
            style: "default",
            onPress: () => navigation.navigate("MainApp"),
          },
        ]
      );
    } catch (error) {
      console.error("Error completing questionnaire:", error);
      Alert.alert("שגיאה", "בעיה בשמירת השאלון. אנא נסה שוב.");
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
                Alert.alert(
                  "יציאה מהשאלון",
                  "האם אתה בטוח שברצונך לצאת מהשאלון?",
                  [
                    { text: "ביטול", style: "cancel" },
                    {
                      text: "יציאה",
                      style: "destructive",
                      onPress: async () => {
                        console.log(
                          "🚪 User exited questionnaire with no progress - full logout and reset"
                        );
                        try {
                          // התנתק מהמשתמש הנוכחי
                          await logout();

                          console.log(
                            "✅ Full logout completed - navigating to clean Welcome"
                          );

                          // חזור למסך Welcome נקי לגמרי
                          navigation.reset({
                            index: 0,
                            routes: [{ name: "Welcome" }],
                          });
                        } catch (error) {
                          console.error("❌ Error during full logout:", error);
                          // גם אם יש שגיאה, נווט למסך Welcome
                          navigation.reset({
                            index: 0,
                            routes: [{ name: "Welcome" }],
                          });
                        }
                      },
                    },
                  ]
                );
              } else {
                // 💾 אם יש תשובות - הצע שמירה
                Alert.alert(
                  "יציאה מהשאלון",
                  `יש לך ${currentAnswers.length} תשובות שנשמרו.\nההתקדמות תישמר ותוכל להמשיך בפעם הבאה.`,
                  [
                    { text: "ביטול", style: "cancel" },
                    {
                      text: "יציאה עם שמירה",
                      style: "default",
                      onPress: () => {
                        // 💾 שמור את ההתקדמות הנוכחית
                        console.log(
                          "💾 Saving questionnaire progress before exit"
                        );

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
                            console.log(
                              "✅ Questionnaire progress saved successfully on exit"
                            );
                          })
                          .catch((error) => {
                            console.error(
                              "❌ Failed to save questionnaire progress:",
                              error
                            );
                          });

                        // חזור למסך Welcome עם ההתקדמות השמורה
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "Welcome" }],
                        });
                      },
                    },
                    {
                      text: "יציאה ללא שמירה",
                      style: "destructive",
                      onPress: async () => {
                        console.log(
                          "🗑️ User chose to exit without saving progress - full logout and reset"
                        );
                        try {
                          // מחק התקדמות קודמת אם יש
                          await AsyncStorage.removeItem("questionnaire_draft");

                          // התנתק מהמשתמש הנוכחי
                          await logout();

                          console.log(
                            "✅ Full logout completed - navigating to clean Welcome"
                          );

                          // חזור למסך Welcome נקי לגמרי
                          navigation.reset({
                            index: 0,
                            routes: [{ name: "Welcome" }],
                          });
                        } catch (error) {
                          console.error("❌ Error during full logout:", error);
                          // גם אם יש שגיאה, נווט למסך Welcome
                          navigation.reset({
                            index: 0,
                            routes: [{ name: "Welcome" }],
                          });
                        }
                      },
                    },
                  ]
                );
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
          onContentSizeChange={() => {
            // Removed emulator logging
          }}
          onScroll={() => {
            // Removed emulator logging
          }}
          onScrollEndDrag={() => {
            // Removed emulator logging
          }}
        >
          {/* Back Button (in question) */}
          {manager.canGoBack() && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePrevious}
              disabled={isLoading}
            >
              <Ionicons
                name="chevron-back"
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
      </LinearGradient>
    </SafeAreaView>
  );
};

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
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    writingDirection: "rtl",
  },

  // Question
  questionHeader: {
    alignItems: "center",
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
    writingDirection: "rtl",
  },
  questionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },

  questionContainer: {
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    ...theme.typography.title3,
    color: theme.colors.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  helpText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    textAlign: "right",
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
    writingDirection: "rtl",
  },

  // Options
  optionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  optionButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
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
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionLabelSelected: {
    color: theme.colors.primary,
  },
  optionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionDescriptionSelected: {
    color: theme.colors.primary,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionIndicatorSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  // Next Button
  nextButtonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  nextButton: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    paddingVertical: theme.spacing.lg + 2,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
  },
  nextButtonText: {
    color: theme.colors.white,
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
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

  // Bottom Spacer
  bottomSpacer: {
    height: theme.spacing.xxl + 60, // רווח מותאם לכפתור הצף
    backgroundColor: "transparent",
  },
});

export default UnifiedQuestionnaireScreen;
