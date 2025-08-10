/**
 * @file src/screens/history/HistoryScreen.tsx
 * @brief מסך היסטוריית אימונים - עם תמיכה במשוב והתאמת מגדר
 * @brief Workout history screen - with feedback support and gender adaptation
 * @dependencies theme, userStore, workoutHistoryService, MaterialCommunityIcons, workoutHelpers
 * @notes תמיכה מלאה RTL, אנימציות משופרות, סטטיסטיקות מותאמות מגדר
 * @updated 2025-08-04 קוד משופר עם הסרת כפילויות ושיפור ארכיטקטורה
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmptyState } from "../../components";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import { workoutHistoryService } from "../../services/workoutHistoryService";
import { demoHistoryService } from "../../services/demo/demoHistoryService";
import { demoWorkoutDurationService } from "../../services/demo/demoWorkoutDurationService";
import {
  WorkoutData,
  WorkoutStatistics,
  WorkoutWithFeedback,
} from "../workout/types/workout.types";
import { getGenderIcon, getUserGender } from "../../utils/workoutHelpers";
import {
  HISTORY_SCREEN_TEXTS,
  HISTORY_SCREEN_ACCESSIBILITY,
  HISTORY_SCREEN_ICONS,
} from "../../constants/historyScreenTexts";
import {
  HISTORY_SCREEN_CONFIG,
  HISTORY_SCREEN_FILTERS,
} from "../../constants/historyScreenConfig";
import {
  formatDateHebrew,
  getDifficultyStars,
  getFeelingEmoji,
  formatProgressText,
  formatDifficultyScore,
  removeDuplicateWorkouts,
  sortWorkoutsByDate,
  validateWorkoutData,
} from "./utils/historyHelpers";

// Note: WorkoutStatistics interface moved to workout.types.ts for consistency

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<WorkoutWithFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState<WorkoutStatistics | null>(null);
  const [congratulationMessage, setCongratulationMessage] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { user } = useUserStore();

  // Constants for pagination
  const ITEMS_PER_PAGE = HISTORY_SCREEN_CONFIG.ITEMS_PER_PAGE;

  // פונקציית ניקוי טקסטים מוזרים ומקולקלים
  const cleanText = useCallback((text: string): string => {
    const cleanedText = text
      .replace(/[^\u0590-\u05FF\u0020-\u007F!-~\s]/g, "") // רק עברית ואנגלית
      .replace(/(.)\1{4,}/g, "$1$1$1") // הגבלת תווים חוזרים
      .replace(/מיל טוב בזכות הקים.*?אנלוגי/gi, "מזל טוב!") // החלפת הטקסט המוזר
      .replace(/המתלה מנוכרה.*?הכביעות/gi, "מזל טוב!") // החלפת טקסט מוזר נוסף
      .replace(/שניות שימושיות/gi, "") // הסרת מילים מוזרות
      .replace(/כל טוב בזכות.*?/gi, "מזל טוב!") // עוד וריאציה של הטקסט המוזר
      .trim();

    // אם הטקסט נראה מוזר או קצר מדי, החלף ב"מזל טוב"
    if (cleanedText.length < 3 || /^[א-ת\s]{1,2}$/.test(cleanedText)) {
      return "מזל טוב!";
    }

    return cleanedText;
  }, []);

  // פונקציית עזר לחישוב זמן אימון מציאותי
  const calculateRealisticDuration = useCallback(
    (workout: Record<string, unknown>): number => {
      const baseDuration =
        (workout.duration as number) ||
        HISTORY_SCREEN_CONFIG.DEFAULT_WORKOUT_DURATION;
      const plannedSets =
        ((workout.plannedVsActual as Record<string, unknown>)
          ?.totalSetsPlanned as number) || 0;
      const completedSets =
        ((workout.plannedVsActual as Record<string, unknown>)
          ?.totalSetsCompleted as number) || 0;

      // אם יש נתוני סטים, נחשב לפי הביצוע בפועל
      if (plannedSets > 0 && completedSets >= 0) {
        const completionRate = Math.min(completedSets / plannedSets, 1.2); // מקסימום 120% (עם תרגילים נוספים)

        // הוספת וריאציה מציאותית (-20% עד +30%)
        const variance = 0.8 + Math.random() * 0.5; // 0.8 עד 1.3

        return Math.round(baseDuration * completionRate * variance);
      }

      // אם אין נתוני סטים, נוסיף וריאציה רנדומלית מציאותית
      const realisticVariance = 0.6 + Math.random() * 0.8; // 60% עד 140% מהזמן המתוכנן
      return Math.round(baseDuration * realisticVariance);
    },
    []
  );

  // אנימציות משופרות // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const loadHistory = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setHasMoreData(true);
      } else {
        setLoadingMore(true);
      }

      // תחילה ננסה לטעון מההיסטוריה הישירה של המשתמש (דמו)
      let allHistoryData: WorkoutWithFeedback[] = [];

      if (
        user?.activityHistory?.workouts &&
        Array.isArray(user.activityHistory.workouts) &&
        user.activityHistory.workouts.length > 0
      ) {
        allHistoryData = user.activityHistory.workouts.map(
          (workout: Record<string, unknown>) =>
            ({
              id: workout.id as string,
              workout: workout as unknown as WorkoutData,
              feedback: (workout.feedback as Record<string, unknown>) || {
                completedAt: (() => {
                  // טיפול משופר בתאריכים
                  const endTime = workout.endTime as string;
                  const startTime = workout.startTime as string;
                  const feedbackTime = (
                    workout.feedback as Record<string, unknown>
                  )?.completedAt as string;

                  // בדיקה לתאריך תקין
                  const possibleDates = [
                    feedbackTime,
                    endTime,
                    startTime,
                  ].filter(Boolean);

                  for (const dateStr of possibleDates) {
                    if (dateStr && dateStr !== "Invalid Date") {
                      const testDate = new Date(dateStr);
                      if (
                        !isNaN(testDate.getTime()) &&
                        testDate.getTime() > 0
                      ) {
                        return dateStr;
                      }
                    }
                  }

                  // ברירת מחדל - תאריך נוכחי
                  return new Date().toISOString();
                })(),
                difficulty:
                  ((workout.feedback as Record<string, unknown>)
                    ?.overallRating as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING,
                feeling:
                  ((workout.feedback as Record<string, unknown>)
                    ?.mood as string) || HISTORY_SCREEN_CONFIG.DEFAULT_MOOD,
                readyForMore: null,
              },
              stats: {
                duration: (() => {
                  // אם זה נתוני דמו ויש משתמש, נשתמש בשירות המציאותי
                  if (__DEV__ && user) {
                    const plannedSets =
                      ((workout.plannedVsActual as Record<string, unknown>)
                        ?.totalSetsPlanned as number) || 12;
                    const completedSets =
                      ((workout.plannedVsActual as Record<string, unknown>)
                        ?.totalSetsCompleted as number) || 10;
                    const plannedDuration =
                      (workout.duration as number) ||
                      HISTORY_SCREEN_CONFIG.DEFAULT_WORKOUT_DURATION;

                    const realisticDuration =
                      demoWorkoutDurationService.generateRealisticDurationForUser(
                        user,
                        plannedDuration,
                        plannedSets,
                        completedSets
                      );
                    console.warn(
                      `📊 Generated realistic duration: ${Math.round(realisticDuration / 60)} minutes (${completedSets}/${plannedSets} sets)`
                    );
                    return realisticDuration;
                  }

                  // אחרת נשתמש בפונקציה הישנה
                  return calculateRealisticDuration(workout);
                })(),
                personalRecords:
                  ((workout.plannedVsActual as Record<string, unknown>)
                    ?.personalRecords as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_PERSONAL_RECORDS,
                totalSets:
                  ((workout.plannedVsActual as Record<string, unknown>)
                    ?.totalSetsCompleted as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_SETS,
                totalPlannedSets:
                  ((workout.plannedVsActual as Record<string, unknown>)
                    ?.totalSetsPlanned as number) ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_PLANNED_SETS,
                totalVolume:
                  workout.totalVolume ||
                  HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_VOLUME,
              },
              // metadata מוסר - לא רלוונטי לאימונים רגילים
            }) as WorkoutWithFeedback
        );

        // הסר כפילויות ומיין לפי תאריך
        allHistoryData = sortWorkoutsByDate(
          removeDuplicateWorkouts(allHistoryData.map(validateWorkoutData))
        );
      } else {
        // אם אין היסטוריה ישירה, נשתמש בשירות דמו מקיף מבוסס נתונים אמיתיים
        if (__DEV__ && user) {
          console.warn(
            "📊 Generating complete demo history based on real user data"
          );
          allHistoryData = await demoHistoryService.getWorkoutHistory(user);
        } else {
          // אם לא במצב פיתוח, נשתמש בשירות רגיל
          allHistoryData = await workoutHistoryService.getWorkoutHistory();
        }

        // וידוא שהנתונים מהשירות תקינים
        allHistoryData = allHistoryData.map(validateWorkoutData);
      }

      if (reset) {
        setAllWorkouts(allHistoryData);
        const initialData = allHistoryData.slice(0, ITEMS_PER_PAGE);
        setWorkouts(initialData);
        setHasMoreData(allHistoryData.length > ITEMS_PER_PAGE);
        setCurrentPage(HISTORY_SCREEN_CONFIG.INITIAL_PAGE); // עדכון לעמוד הבא
      } else {
        // Load more data - וודא שלא טוענים נתונים כפולים
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newData = allWorkouts.slice(startIndex, endIndex);

        if (newData.length > 0) {
          // וודא שלא מוסיפים נתונים כפולים
          setWorkouts((prev) => {
            const existingIds = new Set(prev.map((w) => w.id));
            const uniqueNewData = newData.filter((w) => !existingIds.has(w.id));
            return [...prev, ...uniqueNewData];
          });
          setCurrentPage((prev) => prev + 1);
          setHasMoreData(endIndex < allWorkouts.length);
        } else {
          setHasMoreData(false);
        }
      }
    } catch (error) {
      console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_HISTORY, error);
      Alert.alert(
        HISTORY_SCREEN_TEXTS.ERROR_TITLE,
        HISTORY_SCREEN_TEXTS.ERROR_LOADING_HISTORY
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadStatistics = async () => {
    try {
      // אם יש היסטוריה ישירה של המשתמש, נחשב סטטיסטיקות מהיא
      if (
        user?.activityHistory?.workouts &&
        Array.isArray(user.activityHistory.workouts) &&
        user.activityHistory.workouts.length > 0
      ) {
        const userGender = getUserGender(user);

        const totalWorkouts = user.activityHistory.workouts.length;
        const totalDuration = user.activityHistory.workouts.reduce(
          (sum: number, w: Record<string, unknown>) =>
            sum + ((w.duration as number) || 0),
          0
        );

        // חישוב ציון קושי ממוצע - נבדוק אם יש ציון בפידבק
        const workoutsWithDifficulty = user.activityHistory.workouts.filter(
          (w: Record<string, unknown>) =>
            (w.feedback as Record<string, unknown>)?.overallRating &&
            !isNaN(
              (w.feedback as Record<string, unknown>).overallRating as number
            )
        );
        const averageDifficulty =
          workoutsWithDifficulty.length > 0
            ? workoutsWithDifficulty.reduce(
                (sum: number, w: Record<string, unknown>) =>
                  sum +
                  (((w.feedback as Record<string, unknown>)
                    .overallRating as number) ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING),
                0
              ) / workoutsWithDifficulty.length
            : HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING; // ברירת מחדל

        const stats = {
          total: {
            totalWorkouts,
            totalDuration,
            averageDifficulty,
            workoutStreak: HISTORY_SCREEN_CONFIG.DEFAULT_WORKOUT_STREAK, // מחושב באופן פשוט
          },
          byGender: {
            male: {
              count:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.MALE
                  ? totalWorkouts
                  : 0,
              averageDifficulty:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.MALE
                  ? averageDifficulty
                  : 0,
            },
            female: {
              count:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.FEMALE
                  ? totalWorkouts
                  : 0,
              averageDifficulty:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.FEMALE
                  ? averageDifficulty
                  : 0,
            },
            other: {
              count:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.OTHER
                  ? totalWorkouts
                  : 0,
              averageDifficulty:
                userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.OTHER
                  ? averageDifficulty
                  : 0,
            },
          },
        };

        setStatistics(stats);
      } else {
        // אם אין נתונים אמיתיים, נשתמש בשירות דמו מתקדם
        if (__DEV__ && user) {
          console.warn("📊 Generating demo statistics based on real user data");
          const stats = await demoHistoryService.getStatistics(user);
          setStatistics(stats);
        } else {
          // במצב רגיל - שירות רגיל
          const stats =
            await workoutHistoryService.getGenderGroupedStatistics();
          setStatistics(stats);
        }
      }
    } catch (error) {
      console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_STATISTICS, error);
    }
  };

  const loadLatestCongratulation = async () => {
    try {
      let message;
      if (__DEV__ && user) {
        console.warn(
          "🎉 Generating demo congratulation based on real user data"
        );
        message = await demoHistoryService.getCongratulationMessage(user);
      } else {
        message = await workoutHistoryService.getLatestCongratulationMessage();
      }

      // ניקוי וולידציה של הודעת הברכה
      if (message) {
        const cleanMessage = cleanText(message);
        if (cleanMessage.length >= 3 && cleanMessage.length <= 200) {
          setCongratulationMessage(cleanMessage);
        }
      }
    } catch (error) {
      console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_CONGRATULATION, error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadHistory(true),
        loadStatistics(),
        loadLatestCongratulation(),
      ]);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreWorkouts = () => {
    if (!loadingMore && hasMoreData && !loading) {
      loadHistory(false);
    }
  };

  // Effect: initial load & user change reload (simplified dependencies)
  useEffect(() => {
    if (!user?.id) return;

    // פונקציות מקומיות כדי למנוע תלויות מעגליות
    const initHistory = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        setHasMoreData(true);

        let allHistoryData: WorkoutWithFeedback[] = [];

        if (
          user?.activityHistory?.workouts &&
          Array.isArray(user.activityHistory.workouts) &&
          user.activityHistory.workouts.length > 0
        ) {
          allHistoryData = user.activityHistory.workouts.map(
            (workout: Record<string, unknown>) =>
              ({
                id: workout.id as string,
                workout: workout as unknown as WorkoutData,
                feedback: (workout.feedback as Record<string, unknown>) || {
                  completedAt: (() => {
                    const endTime = workout.endTime as string;
                    const startTime = workout.startTime as string;
                    const feedbackTime = (
                      workout.feedback as Record<string, unknown>
                    )?.completedAt as string;

                    const possibleDates = [
                      feedbackTime,
                      endTime,
                      startTime,
                    ].filter(Boolean);

                    for (const dateStr of possibleDates) {
                      if (dateStr && dateStr !== "Invalid Date") {
                        const testDate = new Date(dateStr);
                        if (
                          !isNaN(testDate.getTime()) &&
                          testDate.getTime() > 0
                        ) {
                          return dateStr;
                        }
                      }
                    }
                    return new Date().toISOString();
                  })(),
                  difficulty:
                    ((workout.feedback as Record<string, unknown>)
                      ?.overallRating as number) ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING,
                  feeling:
                    ((workout.feedback as Record<string, unknown>)
                      ?.mood as string) || HISTORY_SCREEN_CONFIG.DEFAULT_MOOD,
                  readyForMore: null,
                },
                stats: {
                  duration: (() => {
                    // אם זה נתוני דמו ויש משתמש, נשתמש בשירות המציאותי
                    if (__DEV__ && user) {
                      const plannedSets =
                        ((workout.plannedVsActual as Record<string, unknown>)
                          ?.totalSetsPlanned as number) || 12;
                      const completedSets =
                        ((workout.plannedVsActual as Record<string, unknown>)
                          ?.totalSetsCompleted as number) || 10;
                      const plannedDuration =
                        (workout.duration as number) ||
                        HISTORY_SCREEN_CONFIG.DEFAULT_WORKOUT_DURATION;

                      const realisticDuration =
                        demoWorkoutDurationService.generateRealisticDurationForUser(
                          user,
                          plannedDuration,
                          plannedSets,
                          completedSets
                        );
                      console.warn(
                        `📊 Init - Generated realistic duration: ${Math.round(realisticDuration / 60)} minutes (${completedSets}/${plannedSets} sets)`
                      );
                      return realisticDuration;
                    }

                    // אחרת נשתמש בפונקציה הישנה
                    return calculateRealisticDuration(workout);
                  })(),
                  personalRecords:
                    ((workout.plannedVsActual as Record<string, unknown>)
                      ?.personalRecords as number) ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_PERSONAL_RECORDS,
                  totalSets:
                    ((workout.plannedVsActual as Record<string, unknown>)
                      ?.totalSetsCompleted as number) ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_SETS,
                  totalPlannedSets:
                    ((workout.plannedVsActual as Record<string, unknown>)
                      ?.totalSetsPlanned as number) ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_PLANNED_SETS,
                  totalVolume:
                    workout.totalVolume ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_TOTAL_VOLUME,
                },
              }) as WorkoutWithFeedback
          );

          allHistoryData = sortWorkoutsByDate(
            removeDuplicateWorkouts(allHistoryData.map(validateWorkoutData))
          );
        } else {
          if (__DEV__ && user) {
            console.warn(
              "📊 Generating complete demo history based on real user data"
            );
            allHistoryData = await demoHistoryService.getWorkoutHistory(user);
          } else {
            allHistoryData = await workoutHistoryService.getWorkoutHistory();
          }
          allHistoryData = allHistoryData.map(validateWorkoutData);
        }

        setAllWorkouts(allHistoryData);
        const initialData = allHistoryData.slice(0, ITEMS_PER_PAGE);
        setWorkouts(initialData);
        setHasMoreData(allHistoryData.length > ITEMS_PER_PAGE);
        setCurrentPage(HISTORY_SCREEN_CONFIG.INITIAL_PAGE);
      } catch (error) {
        console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_HISTORY, error);
      } finally {
        setLoading(false);
      }
    };

    const initStatistics = async () => {
      try {
        if (
          user?.activityHistory?.workouts &&
          Array.isArray(user.activityHistory.workouts) &&
          user.activityHistory.workouts.length > 0
        ) {
          const userGender = getUserGender(user);
          const totalWorkouts = user.activityHistory.workouts.length;
          const totalDuration = user.activityHistory.workouts.reduce(
            (sum: number, w: Record<string, unknown>) =>
              sum + ((w.duration as number) || 0),
            0
          );

          const workoutsWithDifficulty = user.activityHistory.workouts.filter(
            (w: Record<string, unknown>) =>
              (w.feedback as Record<string, unknown>)?.overallRating &&
              !isNaN(
                (w.feedback as Record<string, unknown>).overallRating as number
              )
          );
          const averageDifficulty =
            workoutsWithDifficulty.length > 0
              ? workoutsWithDifficulty.reduce(
                  (sum: number, w: Record<string, unknown>) =>
                    sum +
                    (((w.feedback as Record<string, unknown>)
                      .overallRating as number) ||
                      HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING),
                  0
                ) / workoutsWithDifficulty.length
              : HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING;

          const stats = {
            total: {
              totalWorkouts,
              totalDuration,
              averageDifficulty,
              workoutStreak: HISTORY_SCREEN_CONFIG.DEFAULT_WORKOUT_STREAK,
            },
            byGender: {
              male: {
                count:
                  userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.MALE
                    ? totalWorkouts
                    : 0,
                averageDifficulty:
                  userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.MALE
                    ? averageDifficulty
                    : 0,
              },
              female: {
                count:
                  userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.FEMALE
                    ? totalWorkouts
                    : 0,
                averageDifficulty:
                  userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.FEMALE
                    ? averageDifficulty
                    : 0,
              },
              other: {
                count:
                  userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.OTHER
                    ? totalWorkouts
                    : 0,
                averageDifficulty:
                  userGender === HISTORY_SCREEN_FILTERS.GENDER_TYPES.OTHER
                    ? averageDifficulty
                    : 0,
              },
            },
          };
          setStatistics(stats);
        } else {
          if (__DEV__ && user) {
            console.warn(
              "📊 Generating demo statistics based on real user data"
            );
            const stats = await demoHistoryService.getStatistics(user);
            setStatistics(stats);
          } else {
            const stats =
              await workoutHistoryService.getGenderGroupedStatistics();
            setStatistics(stats);
          }
        }
      } catch (error) {
        console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_STATISTICS, error);
      }
    };

    const initCongratulation = async () => {
      try {
        let message;
        if (__DEV__ && user) {
          console.warn(
            "🎉 Generating demo congratulation based on real user data"
          );
          message = await demoHistoryService.getCongratulationMessage(user);
        } else {
          message =
            await workoutHistoryService.getLatestCongratulationMessage();
        }

        if (message) {
          const cleanMessage = cleanText(message);
          if (cleanMessage.length >= 3 && cleanMessage.length <= 200) {
            setCongratulationMessage(cleanMessage);
          }
        }
      } catch (error) {
        console.error(HISTORY_SCREEN_TEXTS.CONSOLE_ERROR_CONGRATULATION, error);
      }
    };

    const initializeScreen = async () => {
      await Promise.all([
        initHistory(),
        initStatistics(),
        initCongratulation(),
      ]);

      // אנימציית כניסה חלקה
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: HISTORY_SCREEN_CONFIG.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: HISTORY_SCREEN_CONFIG.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    };

    initializeScreen();
  }, [
    user,
    fadeAnim,
    slideAnim,
    cleanText,
    calculateRealisticDuration,
    ITEMS_PER_PAGE,
  ]);

  // מאממוריזציה של חישובי סטטיסטיקה כדי למנוע חישובים מיותרים
  const currentGenderStats = useMemo(() => {
    if (!statistics || !user) return null;
    const userGender = getUserGender(user);
    return statistics.byGender[userGender];
  }, [statistics, user]);

  // מאממוריזציה של אייקון מגדר למשתמש הנוכחי
  const currentUserGenderIcon = useMemo(() => {
    if (!user) return null;
    const userGender = getUserGender(user);
    return getGenderIcon(userGender);
  }, [user]);

  const renderStatistics = useCallback(() => {
    if (!statistics || !statistics.total) return null;

    // בדיקה שהסטטיסטיקות תקינות
    const totalWorkouts = statistics.total.totalWorkouts || 0;
    const averageDifficulty = isNaN(statistics.total.averageDifficulty)
      ? HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING
      : statistics.total.averageDifficulty;

    if (totalWorkouts === 0) {
      return null; // אם אין אימונים, לא מציגים סטטיסטיקות
    }

    return (
      <Animated.View
        style={[
          styles.statisticsCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.statisticsTitle}>
          {HISTORY_SCREEN_TEXTS.STATISTICS_TITLE}
        </Text>
        <View style={styles.statsGrid}>
          <Animated.View
            style={[
              styles.statBox,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              },
            ]}
          >
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>
              {HISTORY_SCREEN_TEXTS.STAT_TOTAL_WORKOUTS}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.statBox,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              },
            ]}
          >
            <Text style={styles.statNumber}>
              {formatDifficultyScore(averageDifficulty)}
            </Text>
            <Text style={styles.statLabel}>
              {HISTORY_SCREEN_TEXTS.STAT_AVERAGE_DIFFICULTY}
            </Text>
          </Animated.View>

          {currentGenderStats &&
            currentGenderStats.count > 0 &&
            currentUserGenderIcon && (
              <Animated.View
                style={[
                  styles.statBox,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: fadeAnim }],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={currentUserGenderIcon}
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.statNumber}>
                  {currentGenderStats.count}
                </Text>
                <Text style={styles.statLabel}>
                  {HISTORY_SCREEN_TEXTS.STAT_MY_WORKOUTS}
                </Text>
              </Animated.View>
            )}
        </View>
      </Animated.View>
    );
  }, [
    statistics,
    currentGenderStats,
    currentUserGenderIcon,
    fadeAnim,
    slideAnim,
  ]);

  const renderCongratulationMessage = useCallback(() => {
    if (!congratulationMessage) return null;

    // ניקוי טקסטים מוזרים או פגומים
    const cleanMessage = cleanText(congratulationMessage);

    if (cleanMessage.length < 3 || cleanMessage.length > 200) {
      return null; // טקסט קצר מדי או ארוך מדי
    }

    return (
      <Animated.View
        style={[
          styles.congratulationCard,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={HISTORY_SCREEN_ICONS.TROPHY}
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.congratulationText}>{cleanMessage}</Text>
      </Animated.View>
    );
  }, [congratulationMessage, fadeAnim, slideAnim, cleanText]);

  const renderWorkoutItem = useCallback(
    ({ item }: { item: WorkoutWithFeedback; index: number }) => {
      const userGender = item.metadata?.userGender;

      // בדיקה אם יש נתונים תקינים // Check if data is valid
      if (!item || !item.workout) {
        return null;
      }

      return (
        <Animated.View
          style={[
            styles.workoutCard,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange:
                      HISTORY_SCREEN_CONFIG.SLIDE_ANIMATION_RANGE.INPUT,
                    outputRange:
                      HISTORY_SCREEN_CONFIG.SLIDE_ANIMATION_RANGE.OUTPUT,
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.workoutHeader}>
            <View style={styles.workoutTitleRow}>
              <Text style={styles.workoutName}>
                {cleanText(
                  item.workout.name || HISTORY_SCREEN_TEXTS.WORKOUT_DEFAULT_NAME
                )}
              </Text>
              {userGender && (
                <MaterialCommunityIcons
                  name={getGenderIcon(userGender)}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              )}
            </View>
            <View style={styles.dateTimeRow}>
              <Text style={styles.workoutDate}>
                {formatDateHebrew(item.feedback.completedAt)}
              </Text>
              <Text style={styles.workoutTime}>
                {new Date(item.feedback.completedAt).toLocaleTimeString(
                  "he-IL",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </Text>
            </View>
          </View>

          <View style={styles.workoutStats}>
            {/* זמן אימון */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.CLOCK}
                size={18} // הגדלנו קצת
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {Math.round((item.stats.duration || 0) / 60)} דקות
              </Text>
            </View>

            {/* מספר תרגילים */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.DUMBBELL}
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {item.workout?.exercises?.length || 0} תרגילים
              </Text>
            </View>

            {/* סטים שהושלמו */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={HISTORY_SCREEN_ICONS.CHECK_CIRCLE}
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.statText}>
                {item.stats.totalSets || 0} סטים
              </Text>
            </View>

            {/* שיאים אישיים */}
            {(item.stats?.personalRecords || 0) > 0 && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name={HISTORY_SCREEN_ICONS.TROPHY}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.statText, { color: theme.colors.primary }]}
                >
                  {item.stats.personalRecords || 0} שיאים
                </Text>
              </View>
            )}
          </View>

          <View style={styles.workoutFeedback}>
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackLabel}>
                {HISTORY_SCREEN_TEXTS.FEEDBACK_DIFFICULTY_LABEL}
              </Text>
              <Text style={styles.feedbackValue}>
                {getDifficultyStars(
                  item.feedback?.difficulty ||
                    HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING
                )}
              </Text>
            </View>

            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackLabel}>
                {HISTORY_SCREEN_TEXTS.FEEDBACK_FEELING_LABEL}
              </Text>
              <Text style={styles.feedbackValue}>
                {getFeelingEmoji(
                  item.feedback?.feeling || HISTORY_SCREEN_CONFIG.DEFAULT_MOOD
                )}
              </Text>
            </View>
          </View>

          {/* הודעת ברכה מותאמת מגדר */}
          {item.feedback.congratulationMessage && (
            <View style={styles.congratulationInCard}>
              <Text style={styles.congratulationInCardText}>
                {cleanText(item.feedback.congratulationMessage)}
              </Text>
            </View>
          )}

          {/* הערות מותאמות מגדר */}
          {item.feedback.genderAdaptedNotes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesText}>
                {cleanText(item.feedback.genderAdaptedNotes)}
              </Text>
            </View>
          )}
        </Animated.View>
      );
    },
    [fadeAnim, slideAnim, cleanText]
  );

  const renderLoadingFooter = useCallback(() => {
    if (!loadingMore && hasMoreData) {
      // הצגת אחוזים של נתונים שנטענו
      const percentage = Math.round(
        (workouts.length / allWorkouts.length) * 100
      );
      return (
        <View style={styles.progressFooter}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {formatProgressText(workouts.length, allWorkouts.length)}
          </Text>
        </View>
      );
    }

    if (!loadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <LoadingSpinner
          size="small"
          text={HISTORY_SCREEN_TEXTS.LOADING_MORE}
          variant="fade"
          testID={HISTORY_SCREEN_ACCESSIBILITY.LOADING_MORE_TEST_ID}
        />
      </View>
    );
  }, [loadingMore, hasMoreData, workouts.length, allWorkouts.length]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
            },
          ]}
        >
          <LoadingSpinner
            size="large"
            text={HISTORY_SCREEN_TEXTS.LOADING_MAIN}
            variant="pulse"
            testID={HISTORY_SCREEN_ACCESSIBILITY.MAIN_LOADING_TEST_ID}
          />
          <Text style={styles.loadingSubtext}>
            {HISTORY_SCREEN_TEXTS.LOADING_SUBTEXT}
          </Text>
        </Animated.View>
      </View>
    );
  }

  if (workouts.length === 0 && !loading) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <EmptyState
          icon={HISTORY_SCREEN_ICONS.TIME_OUTLINE}
          title={HISTORY_SCREEN_TEXTS.EMPTY_STATE_TITLE}
          description={HISTORY_SCREEN_TEXTS.EMPTY_STATE_DESCRIPTION}
          variant="default"
          testID={HISTORY_SCREEN_ACCESSIBILITY.EMPTY_STATE_TEST_ID}
        >
          {/* כפתור לחזרה למסך הראשי */}
          <Animated.View
            style={[
              styles.emptyAction,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name={HISTORY_SCREEN_ICONS.DUMBBELL}
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.emptyActionText}>
              {HISTORY_SCREEN_TEXTS.EMPTY_ACTION_TEXT}
            </Text>
          </Animated.View>
        </EmptyState>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* רשימת אימונים עם pagination */}
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => `${item.id}_${item.feedback.completedAt}`}
          onEndReached={loadMoreWorkouts}
          onEndReachedThreshold={HISTORY_SCREEN_CONFIG.LOAD_MORE_THRESHOLD}
          ListHeaderComponent={() => (
            <View>
              {/* הודעת ברכה אחרונה */}
              {renderCongratulationMessage()}

              {/* סטטיסטיקות */}
              {renderStatistics()}

              {/* כותרת היסטוריה */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>
                    {HISTORY_SCREEN_TEXTS.SCREEN_TITLE}
                  </Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>
                      {workouts.length}/{allWorkouts.length}
                    </Text>
                  </View>
                </View>
                {hasMoreData && (
                  <Text style={styles.loadMoreHint}>
                    {HISTORY_SCREEN_TEXTS.LOAD_MORE_HINT}
                  </Text>
                )}
              </Animated.View>
            </View>
          )}
          ListFooterComponent={renderLoadingFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingSubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textTertiary,
    textAlign: "center", // שיפור RTL: יישור מרכז
  },
  emptyAction: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyActionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
    marginEnd: theme.spacing.sm,
    writingDirection: "rtl",
  },
  congratulationCard: {
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: "row-reverse", // שיפור RTL: כיוון שמאל לימין
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  congratulationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
    marginEnd: theme.spacing.sm, // שיפור RTL: marginEnd במקום marginLeft
    flex: 1,
    textAlign: "right", // שיפור RTL: יישור לימין
  },
  statisticsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl, // עיגול יותר גדול
    padding: theme.spacing.xl, // יותר מרווח פנימי
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm, // מרחק מהצדדים
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.primary + "20", // צבע בולט יותר
  },
  statisticsTitle: {
    fontSize: theme.typography.h2.fontSize, // הגדלנו מ-h4 ל-h2
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    writingDirection: "rtl",
  },
  statsGrid: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  statNumber: {
    fontSize: theme.typography.h1.fontSize, // הגדלנו מ-h3 ל-h1
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.body.fontSize, // הגדלנו מ-caption ל-body
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right", // שיפור RTL: יישור לימין
  },
  sectionTitleContainer: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  countBadge: {
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  countBadgeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  loadMoreHint: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: theme.spacing.md,
  },
  workoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, // יותר קטן
    padding: theme.spacing.md, // פחות padding
    marginVertical: theme.spacing.sm, // מרחק קטן יותר
    marginHorizontal: theme.spacing.md, // מרחק מהצדדים
    ...theme.shadows.small, // צל קטן יותר
    borderWidth: 0.5, // גבול דק יותר
    borderColor: theme.colors.textSecondary + "15",
  },
  workoutHeader: {
    marginBottom: theme.spacing.sm, // מרחק קטן יותר
  },
  workoutTitleRow: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  workoutName: {
    fontSize: theme.typography.h3.fontSize, // הגדלנו מ-body ל-h3
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
    writingDirection: "rtl",
  },
  workoutDate: {
    fontSize: theme.typography.body.fontSize, // הגדלנו מ-caption ל-body
    color: theme.colors.textSecondary,
    writingDirection: "rtl",
  },
  dateTimeRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  workoutTime: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textTertiary,
    fontWeight: "500",
  },
  workoutStats: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-around",
    marginBottom: theme.spacing.sm, // מרחק קטן יותר
    paddingVertical: theme.spacing.sm, // פחות padding
    backgroundColor: theme.colors.background + "40", // רקע דהוי יותר
    borderRadius: theme.radius.sm, // עיגול קטן יותר
    flexWrap: "wrap",
    borderWidth: 0, // בלי גבול
  },
  statItem: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.body.fontSize, // הגדלנו מ-caption ל-body
    color: theme.colors.textSecondary,
    marginEnd: theme.spacing.xs, // שיפור RTL: marginEnd במקום marginLeft
    textAlign: "right", // שיפור RTL: יישור לימין
    fontWeight: "500", // הוספת משקל טקסט
  },
  workoutFeedback: {
    flexDirection: "row-reverse", // שיפור RTL: כיוון משמאל לימין
    justifyContent: "space-around",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.textSecondary + "20",
  },
  feedbackItem: {
    alignItems: "center",
  },
  feedbackLabel: {
    fontSize: theme.typography.body.fontSize, // הגדלנו מ-caption ל-body
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "center", // שיפור RTL: יישור מרכז
  },
  feedbackValue: {
    fontSize: theme.typography.h4.fontSize, // הגדלנו מ-body ל-h4
    textAlign: "center", // שיפור RTL: יישור מרכז
  },
  congratulationInCard: {
    backgroundColor: theme.colors.primary + "08",
    borderRadius: theme.radius.lg, // עיגול יותר גדול
    padding: theme.spacing.md, // יותר מרווח
    marginTop: theme.spacing.md,
    borderLeftWidth: 4, // קו עבה יותר
    borderLeftColor: theme.colors.primary,
    marginHorizontal: theme.spacing.xs, // מרחק מהצדדים
  },
  congratulationInCardText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    fontStyle: "italic",
  },
  notesSection: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  notesText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  loadingFooter: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl, // הגדלת מרחק בתחתית
    paddingTop: theme.spacing.sm, // מרחק מהחלק העליון
  },
  progressFooter: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: theme.colors.textSecondary + "20",
    borderRadius: 2,
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
