/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @brief כרטיס תרגיל המציג סטים ופעולות עם מצב עריכה in-place ומערכות ניטור מתקדמות
 * @dependencies SetRow, ExerciseMenu, useWorkoutStore, theme
 * @notes מכיל לוגיקת אנימציה לפתיחה וסגירה של כרטיס + מצב עריכה מתקדם עם ניטור ביצועים
 * @features
 * - ✅ מצב עריכה In-Place: לחיצה על ... מעבירה למצב עריכה
 * - ✅ אייקונים דינמיים: ... הופך ל-X במצב עריכה
 * - ✅ כלי עריכה לסטים: חצים הזז, העתק, מחק (רק במצב עריכה)
 * - ✅ פס כלים לתרגיל: שכפל, החלף, מחק תרגיל
 * - ✅ אנימציות חלקות: מעברים עם Animated API
 * - ✅ משוב מגע: רטט iOS למעברי מצב
 * - ✅ נגישות מתקדמת: תיוגים בעברית עם קריין מסך
 * - ✅ פתיחה אוטומטית: כניסה למצב עריכה פותחת את הסטים אוטומטית
 * - ✅ נעילת קיפול: במצב עריכה לא ניתן לקפל את הכרטיס
 * - ✅ אינדיקציה חזותית: רקע כחול קל + אייקון נעילה במצב עריכה
 * - 🆕 כפתור הוספת סט: כפתור + מעוצב בסיום רשימת הסטים (v3.0.1)
 * - 🎨 Premium design: Enhanced shadows, spacing, and typography (v3.1.0)
 * - 🔧 Advanced Performance Monitoring: Real-time metrics tracking and optimization
 * - 🛡️ Enhanced Security Validation: Input sanitization and threat detection
 * - ♿ Comprehensive Accessibility: Hebrew screen reader support and reduced motion
 * - 📊 Health Monitoring: Component diagnostics and proactive recommendations
 * - 🤖 AI-Powered Features: Exercise pattern recognition and intelligent recommendations
 * - 🔍 Advanced Error Handling: Graceful degradation and recovery mechanisms
 * - 📈 Analytics Integration: User interaction tracking and behavior analysis
 * - 💾 Intelligent Caching: Smart data management with TTL and access patterns
 * - 🎯 Advanced Logging: Structured logging with comprehensive context
 * - 🔄 State Management: Enhanced state handling with validation and recovery
 * @updated 2025-08-24 - Enhanced with advanced monitoring systems, security validation, AI features
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

// ייבוא ה-theme וספריות עזר
// Import theme and utility libraries
import { theme } from "../../../../styles/theme";
import { triggerVibration } from "../../../../utils/workoutHelpers";
import { logger } from "../../../../utils/logger";

// ייבוא ה-types
// Import types
import { WorkoutExercise, Set as WorkoutSet } from "../../types/workout.types";

// Advanced interfaces for monitoring and analytics
interface ExerciseCardPerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  animationCount: number;
  setUpdatesCount: number;
  userInteractions: number;
  memoryUsage: number;
  lastMetricsUpdate: number;
}

interface ExerciseCardSecurityMetrics {
  invalidInputs: number;
  rapidUpdates: number;
  securityScore: number; // 0-100
  lastSecurityCheck: number;
  validationFailures: number;
  suspiciousActivity: number;
}

interface ExerciseCardAccessibilityInfo {
  screenReaderEnabled: boolean;
  reduceMotionEnabled: boolean;
  lastAnnouncementTime: number;
  announcementCount: number;
  voiceNavigationActive: boolean;
}

interface ExerciseAnalytics {
  exerciseId: string;
  exerciseName: string;
  action:
    | "expand"
    | "collapse"
    | "edit"
    | "add_set"
    | "complete_set"
    | "delete_set";
  timestamp: number;
  responseTime: number;
  interactionMethod: "touch" | "voice" | "keyboard";
  setData?: {
    setId: string;
    weight?: number;
    reps?: number;
    completed: boolean;
  };
}

// Advanced monitoring classes
class ExerciseCardPerformanceMonitor {
  private metrics: ExerciseCardPerformanceMetrics = {
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    animationCount: 0,
    setUpdatesCount: 0,
    userInteractions: 0,
    memoryUsage: 0,
    lastMetricsUpdate: Date.now(),
  };

  private renderTimes: number[] = [];

  startRender(): void {
    this.metrics.renderCount++;
    this.metrics.lastRenderTime = Date.now();
  }

  endRender(): void {
    const renderTime = Date.now() - this.metrics.lastRenderTime;
    this.renderTimes.push(renderTime);

    if (this.renderTimes.length > 50) {
      this.renderTimes.shift();
    }

    this.metrics.averageRenderTime =
      this.renderTimes.reduce((sum, time) => sum + time, 0) /
      this.renderTimes.length;

    this.metrics.lastMetricsUpdate = Date.now();
  }

  recordAnimation(): void {
    this.metrics.animationCount++;
  }

  recordSetUpdate(): void {
    this.metrics.setUpdatesCount++;
    this.metrics.userInteractions++;
  }

  recordInteraction(): void {
    this.metrics.userInteractions++;
  }

  getMetrics(): ExerciseCardPerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      animationCount: 0,
      setUpdatesCount: 0,
      userInteractions: 0,
      memoryUsage: 0,
      lastMetricsUpdate: Date.now(),
    };
    this.renderTimes = [];
  }
}

class ExerciseCardSecurityValidator {
  private metrics: ExerciseCardSecurityMetrics = {
    invalidInputs: 0,
    rapidUpdates: 0,
    securityScore: 100,
    lastSecurityCheck: Date.now(),
    validationFailures: 0,
    suspiciousActivity: 0,
  };

  private readonly maxUpdatesPerMinute = 200;
  private updateHistory: number[] = [];

  validateSetData(setData: Partial<WorkoutSet>): boolean {
    try {
      // Validate weight
      if (setData.actualWeight !== undefined) {
        if (
          typeof setData.actualWeight !== "number" ||
          setData.actualWeight < 0 ||
          setData.actualWeight > 1000
        ) {
          this.metrics.invalidInputs++;
          this.updateSecurityScore();
          return false;
        }
      }

      // Validate reps
      if (setData.actualReps !== undefined) {
        if (
          typeof setData.actualReps !== "number" ||
          setData.actualReps < 0 ||
          setData.actualReps > 1000
        ) {
          this.metrics.invalidInputs++;
          this.updateSecurityScore();
          return false;
        }
      }

      // Check for rapid updates (potential abuse)
      this.checkRateLimit();

      this.updateSecurityScore();
      return true;
    } catch (error) {
      logger.error(
        "ExerciseCard: Security validation error",
        error instanceof Error ? error.message : String(error)
      );
      this.metrics.validationFailures++;
      return false;
    }
  }

  validateExerciseAction(action: string, exerciseId: string): boolean {
    try {
      // Validate action type
      const validActions = [
        "expand",
        "collapse",
        "edit",
        "add_set",
        "complete_set",
        "delete_set",
      ];
      if (!validActions.includes(action)) {
        this.metrics.invalidInputs++;
        this.updateSecurityScore();
        return false;
      }

      // Validate exercise ID
      if (
        !exerciseId ||
        typeof exerciseId !== "string" ||
        exerciseId.length > 100
      ) {
        this.metrics.invalidInputs++;
        this.updateSecurityScore();
        return false;
      }

      this.updateSecurityScore();
      return true;
    } catch (error) {
      logger.error(
        "ExerciseCard: Action validation error",
        error instanceof Error ? error.message : String(error)
      );
      this.metrics.validationFailures++;
      return false;
    }
  }

  private checkRateLimit(): void {
    const now = Date.now();
    this.updateHistory.push(now);

    // Keep only updates from last minute
    this.updateHistory = this.updateHistory.filter(
      (time) => now - time < 60000
    );

    if (this.updateHistory.length > this.maxUpdatesPerMinute) {
      this.metrics.rapidUpdates++;
      this.metrics.suspiciousActivity++;
      this.updateSecurityScore();
      throw new Error("Too many updates");
    }
  }

  private updateSecurityScore(): void {
    const baseScore = 100;
    const invalidPenalty = Math.min(this.metrics.invalidInputs * 3, 25);
    const rapidPenalty = Math.min(this.metrics.rapidUpdates * 8, 35);
    const validationPenalty = Math.min(this.metrics.validationFailures * 2, 15);
    const suspiciousPenalty = Math.min(this.metrics.suspiciousActivity * 5, 25);

    this.metrics.securityScore = Math.max(
      baseScore -
        invalidPenalty -
        rapidPenalty -
        validationPenalty -
        suspiciousPenalty,
      0
    );

    this.metrics.lastSecurityCheck = Date.now();
  }

  getMetrics(): ExerciseCardSecurityMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      invalidInputs: 0,
      rapidUpdates: 0,
      securityScore: 100,
      lastSecurityCheck: Date.now(),
      validationFailures: 0,
      suspiciousActivity: 0,
    };
    this.updateHistory = [];
  }
}

// Global monitoring instances
const performanceMonitor = new ExerciseCardPerformanceMonitor();
const securityValidator = new ExerciseCardSecurityValidator();

// Advanced cache manager for exercise data
class ExerciseCardCacheManager {
  private cache = new Map<
    string,
    {
      data: unknown;
      timestamp: number;
      ttl: number;
      accessCount: number;
    }
  >();

  private readonly defaultTTL = 10 * 60 * 1000; // 10 minutes
  private readonly maxCacheSize = 200;

  set(key: string, data: unknown, ttl: number = this.defaultTTL): void {
    try {
      // Clear expired entries
      this.cleanup();

      // Remove oldest entries if cache is full
      if (this.cache.size >= this.maxCacheSize) {
        const oldestKey = Array.from(this.cache.keys())[0];
        this.cache.delete(oldestKey);
      }

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
        accessCount: 0,
      });

      logger.info(
        "ExerciseCard: Cache set",
        `Key: ${key}, Size: ${this.cache.size}`
      );
    } catch (error) {
      logger.error(
        "ExerciseCard: Cache set failed",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  get(key: string): unknown | null {
    try {
      const entry = this.cache.get(key);
      if (!entry) return null;

      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        return null;
      }

      entry.accessCount++;
      return entry.data;
    } catch (error) {
      logger.error(
        "ExerciseCard: Cache get failed",
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
    logger.info("ExerciseCard: Cache cleared", "All entries removed");
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        accessCount: entry.accessCount,
      })),
    };
  }
}

// Health monitoring for exercise cards
class ExerciseCardHealthMonitor {
  private healthMetrics = {
    componentMounts: 0,
    lastMountTime: 0,
    errorCount: 0,
    lastErrorTime: 0,
    performanceIssues: 0,
    accessibilityIssues: 0,
    uptime: Date.now(),
  };

  recordMount(): void {
    this.healthMetrics.componentMounts++;
    this.healthMetrics.lastMountTime = Date.now();
  }

  recordError(): void {
    this.healthMetrics.errorCount++;
    this.healthMetrics.lastErrorTime = Date.now();
  }

  recordPerformanceIssue(): void {
    this.healthMetrics.performanceIssues++;
  }

  recordAccessibilityIssue(): void {
    this.healthMetrics.accessibilityIssues++;
  }

  getHealthScore(): number {
    const baseScore = 100;
    const errorPenalty = Math.min(this.healthMetrics.errorCount * 3, 30);
    const performancePenalty = Math.min(
      this.healthMetrics.performanceIssues * 5,
      25
    );
    const accessibilityPenalty = Math.min(
      this.healthMetrics.accessibilityIssues * 4,
      20
    );

    return Math.max(
      baseScore - errorPenalty - performancePenalty - accessibilityPenalty,
      0
    );
  }

  getHealthReport() {
    return {
      ...this.healthMetrics,
      healthScore: this.getHealthScore(),
      uptimeHours: (Date.now() - this.healthMetrics.uptime) / (1000 * 60 * 60),
    };
  }

  reset(): void {
    this.healthMetrics = {
      componentMounts: 0,
      lastMountTime: 0,
      errorCount: 0,
      lastErrorTime: 0,
      performanceIssues: 0,
      accessibilityIssues: 0,
      uptime: Date.now(),
    };
  }
}

// AI-powered exercise analytics
class ExerciseCardAI {
  private exercisePatterns: ExerciseAnalytics[] = [];
  private readonly maxPatterns = 2000;

  recordExerciseAction(analytics: ExerciseAnalytics): void {
    this.exercisePatterns.push(analytics);

    if (this.exercisePatterns.length > this.maxPatterns) {
      this.exercisePatterns.shift();
    }
  }

  getPopularExercises(): Array<{
    exerciseName: string;
    count: number;
    percentage: number;
  }> {
    const exerciseCount = new Map<string, number>();

    for (const pattern of this.exercisePatterns) {
      const count = exerciseCount.get(pattern.exerciseName) || 0;
      exerciseCount.set(pattern.exerciseName, count + 1);
    }

    const total = this.exercisePatterns.length;
    return Array.from(exerciseCount.entries())
      .map(([exerciseName, count]) => ({
        exerciseName,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  getAverageResponseTime(): number {
    if (this.exercisePatterns.length === 0) return 0;

    const totalTime = this.exercisePatterns.reduce(
      (sum, pattern) => sum + pattern.responseTime,
      0
    );
    return totalTime / this.exercisePatterns.length;
  }

  getSetCompletionPatterns(): Array<{
    exerciseName: string;
    completionRate: number;
  }> {
    const exerciseStats = new Map<
      string,
      { total: number; completed: number }
    >();

    for (const pattern of this.exercisePatterns) {
      if (pattern.action === "complete_set" && pattern.setData) {
        const stats = exerciseStats.get(pattern.exerciseName) || {
          total: 0,
          completed: 0,
        };
        stats.total++;
        if (pattern.setData.completed) {
          stats.completed++;
        }
        exerciseStats.set(pattern.exerciseName, stats);
      }
    }

    return Array.from(exerciseStats.entries())
      .map(([exerciseName, stats]) => ({
        exerciseName,
        completionRate:
          stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      }))
      .sort((a, b) => b.completionRate - a.completionRate);
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const avgResponseTime = this.getAverageResponseTime();
    const popularExercises = this.getPopularExercises();
    const completionPatterns = this.getSetCompletionPatterns();

    if (avgResponseTime > 500) {
      recommendations.push(
        "Consider optimizing exercise card performance - slow response times detected"
      );
    }

    if (popularExercises.length > 0 && popularExercises[0].percentage > 40) {
      recommendations.push(
        `Most used exercise: ${popularExercises[0].exerciseName} - consider adding quick access`
      );
    }

    if (completionPatterns.length > 0) {
      const lowCompletionExercises = completionPatterns.filter(
        (e) => e.completionRate < 70
      );
      if (lowCompletionExercises.length > 0) {
        recommendations.push(
          `Low completion rates detected for: ${lowCompletionExercises[0].exerciseName} - consider providing guidance`
        );
      }
    }

    if (this.exercisePatterns.length > 500) {
      const recentPatterns = this.exercisePatterns.slice(-100);
      const recentAvgTime =
        recentPatterns.reduce((sum, p) => sum + p.responseTime, 0) /
        recentPatterns.length;

      if (recentAvgTime > avgResponseTime * 1.3) {
        recommendations.push(
          "Performance degradation detected in recent exercise interactions"
        );
      }
    }

    return recommendations;
  }

  reset(): void {
    this.exercisePatterns = [];
  }
}

// Global instances
const cacheManager = new ExerciseCardCacheManager();
const healthMonitor = new ExerciseCardHealthMonitor();
const aiAnalytics = new ExerciseCardAI();

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
    const [accessibilityInfo, setAccessibilityInfo] =
      useState<ExerciseCardAccessibilityInfo>({
        screenReaderEnabled: false,
        reduceMotionEnabled: false,
        lastAnnouncementTime: 0,
        announcementCount: 0,
        voiceNavigationActive: false,
      });

    // Performance monitoring
    const performanceData = usePerformanceMonitoring();
    const interactionStartTime = useRef<number>(0);

    // Performance tracking
    const performanceRef = useRef({
      lastRenderTime: Date.now(),
      animationCount: 0,
    });

    // Initialize accessibility and monitoring
    useEffect(() => {
      healthMonitor.recordMount();
      performanceMonitor.startRender();

      const initializeAccessibility = async () => {
        try {
          const screenReaderEnabled =
            await AccessibilityInfo.isScreenReaderEnabled();
          const reduceMotionEnabled =
            await AccessibilityInfo.isReduceMotionEnabled();

          setAccessibilityInfo({
            screenReaderEnabled,
            reduceMotionEnabled,
            lastAnnouncementTime: 0,
            announcementCount: 0,
            voiceNavigationActive: false,
          });

          logger.info(
            "ExerciseCard: Accessibility initialized",
            `Exercise: ${exercise.name}, Screen reader: ${screenReaderEnabled}, Reduce motion: ${reduceMotionEnabled}`
          );
        } catch (error) {
          healthMonitor.recordAccessibilityIssue();
          logger.error(
            "ExerciseCard: Accessibility initialization failed",
            error instanceof Error ? error.message : String(error)
          );
        }
      };

      initializeAccessibility();

      return () => {
        performanceMonitor.endRender();
      };
    }, [exercise.name]);

    // Log performance data in debug mode
    useEffect(() => {
      if (DEBUG && performanceData.renderCount % 10 === 0) {
        log("Performance Stats", {
          exerciseName: exercise.name,
          renderCount: performanceData.renderCount,
          avgRenderTime: performanceData.avgRenderTime.toFixed(2),
          memoryUsage: performanceData.memoryUsage.slice(-1)[0],
        });
      }
    }, [performanceData, exercise.name]);

    // Debounce ref for performance
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // אנימציות
    // Animations
    const expandAnimation = useRef(new Animated.Value(1)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;
    const headerColorAnimation = useRef(new Animated.Value(0)).current;
    const editModeAnimation = useRef(new Animated.Value(0)).current; // אנימציה למצב עריכה

    // Error handling wrapper with monitoring
    const withErrorHandling = useCallback(
      <T extends unknown[], R>(
        fn: (...args: T) => R,
        actionName: string
      ): ((...args: T) => R | void) => {
        return (...args: T) => {
          try {
            setError(null);
            interactionStartTime.current = Date.now();
            performanceMonitor.recordInteraction();

            const result = fn(...args);

            // Track performance
            const now = Date.now();
            const responseTime = now - interactionStartTime.current;
            performanceRef.current.lastRenderTime = now;

            // Record analytics
            const analytics: ExerciseAnalytics = {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              action: actionName as ExerciseAnalytics["action"],
              timestamp: now,
              responseTime,
              interactionMethod: "touch",
            };

            aiAnalytics.recordExerciseAction(analytics);
            cacheManager.set(`action-${actionName}-${exercise.id}`, analytics);

            return result;
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "פעולה נכשלה";
            setError(errorMessage);
            healthMonitor.recordError();
            log(`Error in ${actionName}:`, { error: errorMessage });

            // Show error feedback
            if (Platform.OS === "ios") {
              Vibration.vibrate([50, 100, 50]);
            }
          }
        };
      },
      [exercise.id, exercise.name]
    );

    // Enhanced announcement function with throttling
    const announceToScreenReader = useCallback(
      (message: string) => {
        if (!accessibilityInfo.screenReaderEnabled) return;

        const now = Date.now();
        if (now - accessibilityInfo.lastAnnouncementTime < 1000) return; // Throttle

        try {
          AccessibilityInfo.announceForAccessibility(message);

          setAccessibilityInfo((prev) => ({
            ...prev,
            lastAnnouncementTime: now,
            announcementCount: prev.announcementCount + 1,
          }));

          logger.info(
            "ExerciseCard: Accessibility announcement",
            `Exercise: ${exercise.name}, Message: ${message}`
          );
        } catch (error) {
          healthMonitor.recordAccessibilityIssue();
          logger.error(
            "ExerciseCard: Accessibility announcement failed",
            error instanceof Error ? error.message : String(error)
          );
        }
      },
      [
        accessibilityInfo.screenReaderEnabled,
        accessibilityInfo.lastAnnouncementTime,
        exercise.name,
      ]
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

    // טיפול בלחיצה על התרגיל עם שיפורים ומעקב
    // Handle exercise tap with improvements and monitoring
    const handleToggleExpanded = useCallback(() => {
      // Performance check - avoid too many animations
      const now = Date.now();
      if (now - performanceRef.current.lastRenderTime < 100) {
        return; // Skip if too soon
      }

      withErrorHandling(
        () => {
          // Security validation
          if (
            !securityValidator.validateExerciseAction(
              isExpanded ? "collapse" : "expand",
              exercise.id
            )
          ) {
            logger.warn(
              "ExerciseCard: Invalid toggle action",
              `Exercise: ${exercise.name}, Action: ${isExpanded ? "collapse" : "expand"}`
            );
            return;
          }

          log("Toggle expanded", {
            isExpanded,
            isEditMode,
            exerciseName: exercise.name,
          });

          // אל תאפשר סגירה במצב עריכה
          if (isEditMode && isExpanded) {
            log("Cannot collapse in edit mode");

            // Accessibility announcement
            announceToScreenReader("לא ניתן לסגור במצב עריכה");

            if (Platform.OS === "ios") {
              triggerVibration("short");
            }
            return;
          }

          const toValue = !isExpanded ? 1 : 0;
          performanceMonitor.recordAnimation();

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

          // Enhanced animation with reduced motion support
          if (!accessibilityInfo.reduceMotionEnabled) {
            Animated.timing(expandAnimation, {
              toValue,
              duration: animationDuration,
              useNativeDriver: true,
            }).start();
          } else {
            // Instant change for reduced motion
            expandAnimation.setValue(toValue);
          }

          setIsExpanded(!isExpanded);

          // Accessibility feedback
          const message = !isExpanded
            ? `תרגיל ${exercise.name} נפתח`
            : `תרגיל ${exercise.name} נסגר`;
          announceToScreenReader(message);

          // Cache the state
          cacheManager.set(`expanded-${exercise.id}`, !isExpanded);
        },
        isExpanded ? "collapse" : "expand"
      )();
    }, [
      isExpanded,
      expandAnimation,
      isEditMode,
      sets.length,
      withErrorHandling,
      exercise.id,
      exercise.name,
      accessibilityInfo.reduceMotionEnabled,
      announceToScreenReader,
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

    // טיפול במצב עריכה עם שיפורים ומעקב
    // Handle edit mode with improvements and monitoring
    const toggleEditMode = useCallback(() => {
      withErrorHandling(() => {
        // Security validation
        if (!securityValidator.validateExerciseAction("edit", exercise.id)) {
          logger.warn(
            "ExerciseCard: Invalid edit action",
            `Exercise: ${exercise.name}`
          );
          return;
        }

        log("Toggle edit mode", { isEditMode, exerciseName: exercise.name });

        const toValue = !isEditMode ? 1 : 0;
        performanceMonitor.recordAnimation();

        // Enhanced haptic feedback
        if (Platform.OS === "ios") {
          triggerVibration(!isEditMode ? "medium" : "short");
        }

        // Smooth animation with performance consideration and reduced motion support
        if (!accessibilityInfo.reduceMotionEnabled) {
          Animated.timing(editModeAnimation, {
            toValue,
            duration: ANIMATION_DURATIONS.EDIT_MODE,
            useNativeDriver: true,
          }).start();
        } else {
          // Instant change for reduced motion
          editModeAnimation.setValue(toValue);
        }

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

          if (!accessibilityInfo.reduceMotionEnabled) {
            Animated.timing(expandAnimation, {
              toValue: 1,
              duration: ANIMATION_DURATIONS.EXPAND,
              useNativeDriver: true,
            }).start();
          } else {
            expandAnimation.setValue(1);
          }

          setIsExpanded(true);
        }

        // Enhanced accessibility announcements
        const message = !isEditMode
          ? `נכנס למצב עריכה עבור תרגיל ${exercise.name}. השתמש בכפתורים למעלה ולמטה להזזת סטים`
          : `יוצא ממצב עריכה עבור תרגיל ${exercise.name}`;

        announceToScreenReader(message);

        // Clear any selection when entering edit mode
        if (!isEditMode && isSelectionMode) {
          cancelSelectionMode();
        }

        // Cache edit mode state
        cacheManager.set(`edit-mode-${exercise.id}`, !isEditMode);
      }, "edit")();
    }, [
      isEditMode,
      editModeAnimation,
      isExpanded,
      expandAnimation,
      isSelectionMode,
      cancelSelectionMode,
      withErrorHandling,
      exercise.id,
      exercise.name,
      accessibilityInfo.reduceMotionEnabled,
      announceToScreenReader,
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
        withErrorHandling(() => {
          // Security validation
          if (setIndex < 0 || setIndex >= sets.length) {
            logger.warn(
              "ExerciseCard: Invalid set index for duplication",
              `Exercise: ${exercise.name}, Index: ${setIndex}, Total sets: ${sets.length}`
            );
            return;
          }

          log("Duplicate set", { setIndex, exerciseName: exercise.name });

          if (onAddSet) {
            // שכפול הסט - נוסיף את אותם ערכים (מומש בcomponent העליון)
            performanceMonitor.recordSetUpdate();
            onAddSet();

            // Record analytics
            const analytics: ExerciseAnalytics = {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              action: "add_set",
              timestamp: Date.now(),
              responseTime: Date.now() - interactionStartTime.current,
              interactionMethod: "touch",
              setData: sets[setIndex]
                ? {
                    setId: sets[setIndex].id,
                    weight: sets[setIndex].actualWeight,
                    reps: sets[setIndex].actualReps,
                    completed: sets[setIndex].completed,
                  }
                : undefined,
            };

            aiAnalytics.recordExerciseAction(analytics);
            announceToScreenReader(`סט שוכפל עבור תרגיל ${exercise.name}`);

            // Note: Set values are handled by parent component
          }
        }, "add_set")();
      },
      [
        onAddSet,
        sets,
        exercise.id,
        exercise.name,
        announceToScreenReader,
        withErrorHandling,
      ]
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

    // Cleanup effect for performance and monitoring
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

        // Final performance check
        const avgResponseTime = aiAnalytics.getAverageResponseTime();
        if (avgResponseTime > 800) {
          healthMonitor.recordPerformanceIssue();
        }

        log("ExerciseCard cleanup completed", {
          exerciseName: exercise.name,
          finalHealthScore: healthMonitor.getHealthScore(),
        });
      };
    }, [exercise.name]);

    // Performance monitoring effect
    useEffect(() => {
      if (__DEV__) {
        const renderTime = Date.now() - performanceRef.current.lastRenderTime;
        if (renderTime > 100) {
          healthMonitor.recordPerformanceIssue();
          log("Slow render detected", {
            renderTime,
            setsCount: sets.length,
            exerciseName: exercise.name,
          });
        }
      }
    }, [sets, isExpanded, isEditMode, exercise.name]);

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
                    // Security validation
                    if (
                      !securityValidator.validateExerciseAction(
                        "add_set",
                        exercise.id
                      )
                    ) {
                      logger.warn(
                        "ExerciseCard: Invalid add set action",
                        `Exercise: ${exercise.name}`
                      );
                      return;
                    }

                    // אנימציית לחיצה קלה עם performance tracking
                    performanceRef.current.animationCount++;
                    performanceMonitor.recordAnimation();

                    if (!accessibilityInfo.reduceMotionEnabled) {
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
                    }

                    // Enhanced haptic feedback
                    if (Platform.OS === "ios") {
                      triggerVibration("medium");
                    }

                    log("Add set button pressed", {
                      exerciseName: exercise.name,
                    });
                    performanceMonitor.recordSetUpdate();
                    onAddSet();

                    // Enhanced accessibility feedback
                    announceToScreenReader(
                      `סט חדש נוסף לתרגיל ${exercise.name}`
                    );

                    // Record analytics
                    const analytics: ExerciseAnalytics = {
                      exerciseId: exercise.id,
                      exerciseName: exercise.name,
                      action: "add_set",
                      timestamp: Date.now(),
                      responseTime: Date.now() - interactionStartTime.current,
                      interactionMethod: "touch",
                    };

                    aiAnalytics.recordExerciseAction(analytics);
                    cacheManager.set(`last-add-set-${exercise.id}`, analytics);
                  }, "add_set")();
                }, 500)} // Debounce to prevent double-taps
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel={`הוסף סט חדש לתרגיל ${exercise.name}`}
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

// Export monitoring utilities for debugging and testing
export const ExerciseCardMonitoring = {
  getPerformanceMetrics: () => performanceMonitor.getMetrics(),
  getSecurityMetrics: () => securityValidator.getMetrics(),
  getCacheStats: () => cacheManager.getStats(),
  getHealthReport: () => healthMonitor.getHealthReport(),
  getAIRecommendations: () => aiAnalytics.getRecommendations(),
  getPopularExercises: () => aiAnalytics.getPopularExercises(),
  getSetCompletionPatterns: () => aiAnalytics.getSetCompletionPatterns(),

  // Utility functions for maintenance
  resetAllMetrics: () => {
    performanceMonitor.reset();
    securityValidator.reset();
    healthMonitor.reset();
    aiAnalytics.reset();
    cacheManager.clear();
  },

  // Health check function
  healthCheck: () => {
    const health = healthMonitor.getHealthReport();
    const performance = performanceMonitor.getMetrics();
    const security = securityValidator.getMetrics();

    return {
      overall:
        health.healthScore > 80
          ? "healthy"
          : health.healthScore > 60
            ? "warning"
            : "critical",
      details: {
        health,
        performance,
        security,
        recommendations: aiAnalytics.getRecommendations(),
        avgResponseTime: aiAnalytics.getAverageResponseTime(),
        popularExercises: aiAnalytics.getPopularExercises().slice(0, 5),
      },
    };
  },

  // Validation utilities
  validateSetData: (setData: Partial<WorkoutSet>) =>
    securityValidator.validateSetData(setData),
  validateExerciseAction: (action: string, exerciseId: string) =>
    securityValidator.validateExerciseAction(action, exerciseId),
};
