/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @brief כרטיס תרגיל המציג סטים ופעולות עם מצב עריכה in-place
 * @dependencies SetRow, ExerciseMenu, useWorkoutStore, theme
 * @notes מכיל לוגיקת אנימציה לפתיחה וסגירה של כרטיס + מצב עריכה מתקדם
 * @features
 * - ✅ מצב עריכה In-Place: לחיצה על ... מעבירה למצב עריכה
 * - ✅ אייקונים דינמיים: ... הופך ל-X במצב עריכה
 * - ✅ כלי עריכה לסטים: חצים הזז, העתק, מחק (רק במצב עריכה)
 * - ✅ פס כלים לתרגיל: שכפל, החלף, מחק תרגיל
 * - ✅ אנימציות חלקות: מעברים עם Animated API
 * - ✅ משוב מגע: רטט iOS למעברי מצב
 * - ✅ נגישות מתקדמת: תיוגים בעברית
 * - ✅ פתיחה אוטומטית: כניסה למצב עריכה פותחת את הסטים אוטומטית
 * - ✅ נעילת קיפול: במצב עריכה לא ניתן לקפל את הכרטיס
 * - ✅ אינדיקציה חזותית: רקע כחול קל + אייקון נעילה במצב עריכה
 * - 🆕 כפתור הוספת סט: כפתור + מעוצב בסיום רשימת הסטים (v3.0.1)
 * - 🎨 Premium design: Enhanced shadows, spacing, and typography (v3.1.0)
 * @updated 2025-08-24 - Enhanced with premium design patterns and advanced UI
 * @updated 2025-08-02 - הוספת כפתור הוספת סט מעוצב עם משוב חזותי ומגע
 * @updated 2025-01-31 - הוספת מצב עריכה In-Place מתקדם עם נעילת קיפול
 */

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  Component,
  ReactNode,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  AccessibilityInfo,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// קומפוננטות פנימיות
// Internal components
import ExerciseHeader from "./ExerciseHeader";
import EditToolbar from "./EditToolbar";
import SetsList from "./SetsList";

// ייבוא ה-theme
// Import theme
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";

// ייבוא ה-types
// Import types
import { WorkoutExercise, Set as WorkoutSet } from "../../types/workout.types";

// אפשור LayoutAnimation באנדרואיד
// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// קבועים לביצועים ונגישות
// Performance and accessibility constants
const ANIMATION_DURATIONS = {
  EXPAND: 300,
  EDIT_MODE: 250,
  BUTTON_PRESS: 100,
  COMPLETION: 200,
} as const;

const ACCESSIBILITY_HINTS = {
  TOGGLE_EXPAND: "הקש פעמיים לפתיחה או סגירה של פרטי התרגיל",
  EDIT_MODE: "הקש פעמיים לכניסה למצב עריכה",
  ADD_SET: "הקש פעמיים להוספת סט נוסף לתרגיל",
  LONG_PRESS_SET: "לחץ ארוך לבחירת מספר סטים",
} as const;

const PERFORMANCE_THRESHOLDS = {
  MAX_SETS_FOR_SMOOTH_ANIMATION: 10,
  DEBOUNCE_DELAY: 300,
  SLOW_RENDER_TIME: 16, // 16ms for 60fps
  MAX_MEMORY_USAGE: 50 * 1024 * 1024, // 50MB
} as const;

// Debug mode (enable via EXPO_PUBLIC_DEBUG_EXERCISECARD=1)
const DEBUG = process.env.EXPO_PUBLIC_DEBUG_EXERCISECARD === "1";
const log = (message: string, data?: object) => {
  if (DEBUG) {
    console.warn(
      `🏋️ ExerciseCard: ${message}` +
        (data ? ` -> ${JSON.stringify(data)}` : "")
    );
  }
};

// Performance monitoring hook
const usePerformanceMonitoring = () => {
  const renderCountRef = useRef(0);
  const renderTimeRef = useRef<number[]>([]);
  const memoryUsageRef = useRef<number[]>([]);

  useEffect(() => {
    renderCountRef.current += 1;
    const renderStart = performance.now();

    return () => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;

      // Keep only last 10 render times
      renderTimeRef.current = [...renderTimeRef.current.slice(-9), renderTime];

      // Memory usage tracking (if available in browser environments)
      interface PerformanceWithMemory extends Performance {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }

      const performanceWithMemory = performance as PerformanceWithMemory;
      if (performanceWithMemory.memory) {
        const memUsage = performanceWithMemory.memory.usedJSHeapSize;
        memoryUsageRef.current = [
          ...memoryUsageRef.current.slice(-9),
          memUsage,
        ];
      }

      // Alert if performance degrades
      if (renderTime > PERFORMANCE_THRESHOLDS.SLOW_RENDER_TIME) {
        console.warn(`ExerciseCard slow render: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return {
    renderCount: renderCountRef.current,
    avgRenderTime:
      renderTimeRef.current.length > 0
        ? renderTimeRef.current.reduce((a, b) => a + b, 0) /
          renderTimeRef.current.length
        : 0,
    lastRenderTimes: renderTimeRef.current,
    memoryUsage: memoryUsageRef.current,
  };
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
  exerciseName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ExerciseCardErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log error for debugging
    console.error("ExerciseCard Error:", {
      exerciseName: this.props.exerciseName,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Track error in analytics (if available)
    // Analytics.trackError('ExerciseCard', error, this.props.exerciseName);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorBoundaryStyles.container}>
          <View style={errorBoundaryStyles.errorCard}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={48}
              color="#FF6B6B"
              style={errorBoundaryStyles.errorIcon}
            />
            <Text style={errorBoundaryStyles.errorTitle}>שגיאה בתרגיל</Text>
            <Text style={errorBoundaryStyles.errorSubtitle}>
              {this.props.exerciseName || "תרגיל לא ידוע"}
            </Text>
            <Text style={errorBoundaryStyles.errorMessage}>
              {this.state.error?.message || "שגיאה לא צפויה"}
            </Text>

            <View style={errorBoundaryStyles.buttonContainer}>
              <TouchableOpacity
                style={errorBoundaryStyles.retryButton}
                onPress={this.handleRetry}
                accessibilityLabel="נסה שוב"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name="refresh" size={20} color="#FFF" />
                <Text style={errorBoundaryStyles.retryButtonText}>נסה שוב</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Error boundary styles
const errorBoundaryStyles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorCard: {
    padding: 24,
    alignItems: "center",
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B6B",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  sets: WorkoutSet[];
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onAddSet: () => void;
  onDeleteSet?: (setId: string) => void;
  onCompleteSet: (setId: string, isCompleting?: boolean) => void; // הוספת פרמטר אופציונלי
  onRemoveExercise: () => void;
  onStartRest?: (duration: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  // onShowTips?: () => void; // מוסר - הפונקציה לא משמשת עוד
  onTitlePress?: () => void; // עבור מעבר לתרגיל יחיד
  isFirst?: boolean;
  isLast?: boolean;
  isPaused?: boolean;
  showHistory?: boolean;
  showNotes?: boolean;
  personalRecord?: { weight: number; reps: number };
  lastWorkout?: {
    date: string;
    bestSet: { weight: number; reps: number };
  };
  onDuplicate?: () => void;
  onReplace?: () => void;
  // פונקציה להזזת סטים - אופציונלי לעתיד
  onReorderSets?: (fromIndex: number, toIndex: number) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(
  ({
    exercise,
    sets,
    onUpdateSet,
    onAddSet,
    onDeleteSet,
    onCompleteSet,
    onRemoveExercise,
    // onStartRest, // לא בשימוש כרגע
    onMoveUp: _onMoveUp,
    onMoveDown: _onMoveDown,
    // onShowTips, // מוסר - הפונקציה לא משמשת עוד
    onTitlePress, // עבור מעבר לתרגיל יחיד
    isFirst: _isFirst = false,
    isLast: _isLast = false,
    // isPaused = false, // לא בשימוש כרגע
    showHistory = false,
    showNotes = false,
    // personalRecord, // לא בשימוש כרגע
    lastWorkout,
    onDuplicate,
    onReplace,
    onReorderSets, // פונקציה להזזת סטים
  }) => {
    // Debug logging
    if (__DEV__) {
      console.warn("🃏 ExerciseCard rendering:", {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setsCount: sets.length,
        sets: sets.map((s) => ({
          id: s.id,
          completed: s.completed,
          targetReps: s.targetReps,
        })),
      });
    }

    // מצבים מקומיים
    // Local states
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSets, setSelectedSets] = useState<globalThis.Set<string>>(
      new globalThis.Set()
    );
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Performance monitoring
    const performanceData = usePerformanceMonitoring();

    // Performance tracking
    const performanceRef = useRef({
      lastRenderTime: Date.now(),
      animationCount: 0,
    });

    // Log performance data in debug mode
    useEffect(() => {
      if (DEBUG && performanceData.renderCount % 10 === 0) {
        log("Performance Stats", {
          renderCount: performanceData.renderCount,
          avgRenderTime: performanceData.avgRenderTime.toFixed(2),
          memoryUsage: performanceData.memoryUsage.slice(-1)[0],
        });
      }
    }, [performanceData]);

    // Debounce ref for performance
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // אנימציות
    // Animations
    const expandAnimation = useRef(new Animated.Value(1)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;
    const headerColorAnimation = useRef(new Animated.Value(0)).current;
    const editModeAnimation = useRef(new Animated.Value(0)).current; // אנימציה למצב עריכה

    // Error handling wrapper
    const withErrorHandling = useCallback(
      <T extends unknown[], R>(
        fn: (...args: T) => R,
        actionName: string
      ): ((...args: T) => R | void) => {
        return (...args: T) => {
          try {
            setError(null);
            const result = fn(...args);

            // Track performance
            const now = Date.now();
            performanceRef.current.lastRenderTime = now;

            return result;
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "פעולה נכשלה";
            setError(errorMessage);
            log(`Error in ${actionName}:`, { error: errorMessage });

            // Show error feedback
            if (Platform.OS === "ios") {
              Vibration.vibrate([50, 100, 50]);
            }
          }
        };
      },
      []
    );

    // Debounced function wrapper for performance
    const withDebounce = useCallback(
      <T extends unknown[]>(
        fn: (...args: T) => void,
        delay: number = PERFORMANCE_THRESHOLDS.DEBOUNCE_DELAY
      ) => {
        return (...args: T) => {
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
          }

          debounceRef.current = setTimeout(() => {
            fn(...args);
            debounceRef.current = null;
          }, delay);
        };
      },
      []
    );
    const isCompleted = useMemo(() => {
      return sets.length > 0 && sets.every((set) => set.completed);
    }, [sets]);

    // חישוב נפח כולל
    // Calculate total volume
    const totalVolume = useMemo(() => {
      return sets.reduce((total, set) => {
        if (set.actualWeight && set.actualReps) {
          return total + set.actualWeight * set.actualReps;
        }
        return total;
      }, 0);
    }, [sets]);

    // חישוב סטים שהושלמו + אחוז התקדמות ממורכז (memo)
    const completedSets = useMemo(
      () => sets.filter((set) => set.completed).length,
      [sets]
    );

    const progressPercentage = useMemo(() => {
      if (sets.length === 0) return 0;
      return (completedSets / sets.length) * 100;
    }, [completedSets, sets.length]);

    // חישוב חזרות כוללות
    // Calculate total reps
    const totalReps = useMemo(() => {
      return sets.reduce((total, set) => {
        return total + (set.actualReps || 0);
      }, 0);
    }, [sets]);

    // טיפול בלחיצה על התרגיל עם שיפורים
    // Handle exercise tap with improvements
    const handleToggleExpanded = useCallback(() => {
      // Performance check - avoid too many animations
      const now = Date.now();
      if (now - performanceRef.current.lastRenderTime < 100) {
        return; // Skip if too soon
      }

      withErrorHandling(() => {
        log("Toggle expanded", { isExpanded, isEditMode });

        // אל תאפשר סגירה במצב עריכה
        if (isEditMode && isExpanded) {
          log("Cannot collapse in edit mode");

          // Accessibility announcement
          if (Platform.OS === "ios") {
            triggerVibration("short");
            AccessibilityInfo.announceForAccessibility(
              "לא ניתן לסגור במצב עריכה"
            );
          }
          return;
        }

        const toValue = !isExpanded ? 1 : 0;

        // Smooth animation with performance consideration
        const animationDuration =
          sets.length > PERFORMANCE_THRESHOLDS.MAX_SETS_FOR_SMOOTH_ANIMATION
            ? ANIMATION_DURATIONS.EXPAND / 2
            : ANIMATION_DURATIONS.EXPAND;

        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            animationDuration,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.scaleY
          )
        );

        Animated.timing(expandAnimation, {
          toValue,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();

        setIsExpanded(!isExpanded);

        // Accessibility feedback
        if (Platform.OS === "ios") {
          AccessibilityInfo.announceForAccessibility(
            !isExpanded ? "התרגיל נפתח" : "התרגיל נסגר"
          );
        }
      }, "toggleExpanded")();
    }, [
      isExpanded,
      expandAnimation,
      isEditMode,
      sets.length,
      withErrorHandling,
    ]);

    // טיפול בלחיצה ארוכה על סט
    // Handle long press on set
    const handleSetLongPress = useCallback((setId: string) => {
      log("Set long press", { setId });

      if (Platform.OS === "ios") {
        triggerVibration("short");
      }

      setIsSelectionMode(true);
      setSelectedSets(new Set([setId]));
    }, []);

    // ביטול מצב בחירה
    // Cancel selection mode
    const cancelSelectionMode = useCallback(() => {
      log("Cancel selection mode");
      setIsSelectionMode(false);
      setSelectedSets(new Set());
    }, []);

    // מחיקת סטים נבחרים עם confirmation משופר
    // Delete selected sets with enhanced confirmation
    const deleteSelectedSets = useCallback(() => {
      withErrorHandling(() => {
        log("Delete selected sets", { count: selectedSets.size });

        const setsCount = selectedSets.size;
        const setsText = setsCount === 1 ? "סט אחד" : `${setsCount} סטים`;

        Alert.alert(
          "מחיקת סטים",
          `האם אתה בטוח שברצונך למחוק ${setsText}?\nפעולה זו אינה ניתנת לביטול.`,
          [
            {
              text: "ביטול",
              style: "cancel",
              onPress: () => {
                AccessibilityInfo.announceForAccessibility("המחיקה בוטלה");
              },
            },
            {
              text: "מחק",
              style: "destructive",
              onPress: () => {
                setIsLoading(true);

                try {
                  selectedSets.forEach((setId) => {
                    onDeleteSet?.(setId);
                  });

                  cancelSelectionMode();

                  // Success feedback
                  if (Platform.OS === "ios") {
                    triggerVibration("medium");
                    AccessibilityInfo.announceForAccessibility(
                      `${setsText} נמחקו בהצלחה`
                    );
                  }
                } catch (error) {
                  setError("שגיאה במחיקת הסטים");
                  log("Error deleting sets:", { error });
                } finally {
                  setIsLoading(false);
                }
              },
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              AccessibilityInfo.announceForAccessibility("התיבה נסגרה");
            },
          }
        );
      }, "deleteSelectedSets")();
    }, [selectedSets, onDeleteSet, cancelSelectionMode, withErrorHandling]);

    // טיפול במצב עריכה עם שיפורים
    // Handle edit mode with improvements
    const toggleEditMode = useCallback(() => {
      withErrorHandling(() => {
        log("Toggle edit mode", { isEditMode });

        const toValue = !isEditMode ? 1 : 0;

        // Enhanced haptic feedback
        if (Platform.OS === "ios") {
          triggerVibration(!isEditMode ? "medium" : "short");
        }

        // Smooth animation with performance consideration
        Animated.timing(editModeAnimation, {
          toValue,
          duration: ANIMATION_DURATIONS.EDIT_MODE,
          useNativeDriver: true,
        }).start();

        setIsEditMode(!isEditMode);

        // וודא שהסטים גלויים במצב עריכה
        if (!isEditMode && !isExpanded) {
          log("Expanding card for edit mode");

          LayoutAnimation.configureNext(
            LayoutAnimation.create(
              ANIMATION_DURATIONS.EXPAND,
              LayoutAnimation.Types.easeInEaseOut,
              LayoutAnimation.Properties.scaleY
            )
          );

          Animated.timing(expandAnimation, {
            toValue: 1,
            duration: ANIMATION_DURATIONS.EXPAND,
            useNativeDriver: true,
          }).start();

          setIsExpanded(true);
        }

        // Accessibility announcements
        if (Platform.OS === "ios") {
          const message = !isEditMode
            ? "נכנס למצב עריכה. השתמש בכפתורים למעלה ולמטה להזזת סטים"
            : "יוצא ממצב עריכה";

          AccessibilityInfo.announceForAccessibility(message);
        }

        // Clear any selection when entering edit mode
        if (!isEditMode && isSelectionMode) {
          cancelSelectionMode();
        }
      }, "toggleEditMode")();
    }, [
      isEditMode,
      editModeAnimation,
      isExpanded,
      expandAnimation,
      isSelectionMode,
      cancelSelectionMode,
      withErrorHandling,
    ]);

    // פונקציות עזר למצב עריכה
    // Edit mode helper functions
    const handleMoveSetUp = useCallback(
      (setIndex: number) => {
        if (setIndex > 0) {
          log("Move set up", { setIndex });

          // משוב מגע חזק יותר למעבר
          if (Platform.OS === "ios") {
            triggerVibration("medium");
          }

          // החלף בין הסט הנוכחי לסט שמעליו
          const currentSet = sets[setIndex];
          const previousSet = sets[setIndex - 1];

          // עדכן את הסדר - כאן צריכה להיות לוגיקה של החלפת מיקומים
          // בינתיים נוסיף רק לוג
          log("Swapping sets", {
            current: currentSet.id,
            previous: previousSet.id,
            fromIndex: setIndex,
            toIndex: setIndex - 1,
          });

          // Update set order in parent component if function is available
          if (onReorderSets) {
            onReorderSets(setIndex, setIndex - 1);
          } else {
            log("onReorderSets not provided - cannot move sets");
          }
        }
      },
      [sets, onReorderSets]
    );

    const handleMoveSetDown = useCallback(
      (setIndex: number) => {
        if (setIndex < sets.length - 1) {
          log("Move set down", { setIndex });

          // משוב מגע חזק יותר למעבר
          if (Platform.OS === "ios") {
            triggerVibration("medium");
          }

          // החלף בין הסט הנוכחי לסט שמתחתיו
          const currentSet = sets[setIndex];
          const nextSet = sets[setIndex + 1];

          // עדכן את הסדר
          log("Swapping sets", {
            current: currentSet.id,
            next: nextSet.id,
            fromIndex: setIndex,
            toIndex: setIndex + 1,
          });

          // Update set order in parent component if function is available
          if (onReorderSets) {
            onReorderSets(setIndex, setIndex + 1);
          } else {
            log("onReorderSets not provided - cannot move sets");
          }
        }
      },
      [sets, onReorderSets]
    );

    const handleDuplicateSet = useCallback(
      (setIndex: number) => {
        log("Duplicate set", { setIndex });
        if (onAddSet) {
          // שכפול הסט - נוסיף את אותם ערכים (מומש בcomponent העליון)
          onAddSet();
          // Note: Set values are handled by parent component
        }
      },
      [onAddSet]
    );

    // טיפול בבחירת סט
    // Handle set selection
    // const handleSetSelect = useCallback((setId: string) => {
    //   log("Set select", { setId });

    //   setSelectedSets((prev: globalThis.Set<string>) => {
    //     const newSet = new globalThis.Set(prev);
    //     if (newSet.has(setId)) {
    //       newSet.delete(setId);
    //     } else {
    //       newSet.add(setId);
    //     }
    //     return newSet;
    //   });
    // }, []);

    // Cleanup effect for performance
    useEffect(() => {
      const currentDebounceRef = debounceRef.current;
      const currentPerformanceRef = performanceRef.current;

      return () => {
        // Clear any pending timeouts
        if (currentDebounceRef) {
          clearTimeout(currentDebounceRef);
        }

        // Reset performance tracking
        currentPerformanceRef.animationCount = 0;

        log("ExerciseCard cleanup completed");
      };
    }, []);

    // Performance monitoring effect
    useEffect(() => {
      if (__DEV__) {
        const renderTime = Date.now() - performanceRef.current.lastRenderTime;
        if (renderTime > 100) {
          log("Slow render detected", { renderTime, setsCount: sets.length });
        }
      }
    }, [sets, isExpanded, isEditMode]);

    // Error recovery effect
    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError(null);
        }, 5000); // Clear error after 5 seconds

        return () => clearTimeout(timer);
      }
    }, [error]);
    useEffect(() => {
      if (isCompleted) {
        log("Exercise completed animation");

        Animated.sequence([
          Animated.timing(headerColorAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [isCompleted, headerColorAnimation, cardOpacity]);

    return (
      <View style={styles.container}>
        {/* פס בחירה */}
        {/* Selection bar */}
        {isSelectionMode && (
          <View style={styles.selectionBar}>
            <View style={styles.selectionButtonsRow}>
              <TouchableOpacity
                onPress={cancelSelectionMode}
                style={styles.selectionButton}
                accessibilityRole="button"
                accessibilityLabel="בטל בחירה"
                accessibilityHint="יציאה ממצב בחירה"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={deleteSelectedSets}
                style={styles.selectionButton}
                accessibilityRole="button"
                accessibilityLabel="מחק סטים נבחרים"
                accessibilityHint={`מחק ${selectedSets.size} סטים`}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.selectionText}>
              {selectedSets.size} סטים נבחרו
            </Text>
          </View>
        )}

        {/* כותרת התרגיל */}
        <ExerciseHeader
          exercise={exercise}
          sets={sets}
          isCompleted={isCompleted}
          isExpanded={isExpanded}
          isEditMode={isEditMode}
          completedSets={completedSets}
          progressPercentage={progressPercentage}
          totalVolume={totalVolume}
          totalReps={totalReps}
          onToggleExpanded={handleToggleExpanded}
          onToggleEditMode={toggleEditMode}
          onTitlePress={onTitlePress}
          editModeAnimation={editModeAnimation}
        />

        {/* פס כלים למצב עריכה */}
        <EditToolbar
          isVisible={isEditMode}
          editModeAnimation={editModeAnimation}
          onDuplicate={onDuplicate}
          onReplace={onReplace}
          onRemoveExercise={onRemoveExercise}
          onExitEditMode={() => setIsEditMode(false)}
        />

        {/* תוכן התרגיל */}
        {/* Exercise content */}
        {isExpanded && (
          <Animated.View
            style={[
              styles.content,
              {
                opacity: expandAnimation,
                transform: [{ scaleY: expandAnimation }],
              },
            ]}
          >
            {/* מידע נוסף */}
            {/* Additional info */}
            <View style={styles.infoSection}>
              {exercise.notes && showNotes && (
                <View style={styles.notesContainer}>
                  <MaterialCommunityIcons
                    name="note-text"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.notesText}>{exercise.notes}</Text>
                </View>
              )}

              {lastWorkout && showHistory && (
                <View style={styles.historyContainer}>
                  <MaterialCommunityIcons
                    name="history"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.historyText}>
                    אימון קודם: {lastWorkout.bestSet.weight} ק״ג x{" "}
                    {lastWorkout.bestSet.reps} חזרות
                  </Text>
                </View>
              )}
            </View>

            {/* רשימת סטים */}
            <SetsList
              sets={sets}
              isEditMode={isEditMode}
              onUpdateSet={onUpdateSet}
              onDeleteSet={onDeleteSet}
              onCompleteSet={onCompleteSet}
              onSetLongPress={handleSetLongPress}
              onMoveSetUp={handleMoveSetUp}
              onMoveSetDown={handleMoveSetDown}
              onDuplicateSet={handleDuplicateSet}
            />

            {/* כפתור הוספת סט - נוסף אחרי רשימת הסטים, רק אם יש סטים ולא במצב עריכה */}
            {/* Add Set Button - Added after sets list, only if there are sets and not in edit mode */}
            {sets.length > 0 && !isEditMode && (
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={withDebounce(() => {
                  withErrorHandling(() => {
                    // אנימציית לחיצה קלה עם performance tracking
                    performanceRef.current.animationCount++;

                    Animated.sequence([
                      Animated.timing(expandAnimation, {
                        toValue: 0.95,
                        duration: ANIMATION_DURATIONS.BUTTON_PRESS,
                        useNativeDriver: true,
                      }),
                      Animated.spring(expandAnimation, {
                        toValue: 1,
                        friction: 3,
                        tension: 40,
                        useNativeDriver: true,
                      }),
                    ]).start();

                    // Enhanced haptic feedback
                    if (Platform.OS === "ios") {
                      triggerVibration("medium");
                    }

                    log("Add set button pressed");
                    onAddSet();

                    // Accessibility feedback
                    AccessibilityInfo.announceForAccessibility("סט חדש נוסף");
                  }, "addSetButton")();
                }, 500)} // Debounce to prevent double-taps
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel="הוסף סט חדש"
                accessibilityHint={ACCESSIBILITY_HINTS.ADD_SET}
                disabled={isLoading}
              >
                <View style={styles.addSetContent}>
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={26}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.addSetText}>הוסף סט</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {/* ExerciseMenu הוסר זמנית כדי להפחית מורכבות – אם נדרש נחזיר בגרסה עתידית */}
      </View>
    );
  }
);

// Set display name for debugging
ExerciseCard.displayName = "ExerciseCard";

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    marginBottom: theme.spacing.xl,
    marginHorizontal: 3,
    // Premium gradient-like border effect
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.cardBorder + "80",
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  infoSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  notesContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    // Enhanced notes styling
    borderWidth: 1,
    borderColor: theme.colors.border + "40",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
    lineHeight: 20,
    fontWeight: "500",
  },
  historyContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border + "40",
    // Enhanced history styling
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
    lineHeight: 18,
    fontWeight: "500",
  },
  selectionBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary + "18",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Enhanced selection bar
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary + "30",
  },
  selectionButton: {
    padding: theme.spacing.sm,
    borderRadius: 8,
    backgroundColor: theme.colors.background + "60",
  },
  selectionText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  selectionButtonsRow: {
    flexDirection: "row-reverse",
    gap: 16,
  },
  // כפתור הוספת סט משופר
  addSetButton: {
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary + "50",
    borderStyle: "dashed",
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    // Premium shadow effects
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 60,
    // Subtle inner glow effect
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary + "30",
  },
  addSetContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  addSetText: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: 0.8,
    lineHeight: 22,
  },
});

// Enhanced ExerciseCard with Error Boundary
const ExerciseCardWithErrorBoundary: React.FC<ExerciseCardProps> = (props) => {
  return (
    <ExerciseCardErrorBoundary exerciseName={props.exercise.name}>
      <ExerciseCard {...props} />
    </ExerciseCardErrorBoundary>
  );
};

export default ExerciseCardWithErrorBoundary;
export { ExerciseCard, ExerciseCardErrorBoundary };
