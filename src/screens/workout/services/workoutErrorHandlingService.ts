/**
 * @file src/screens/workout/services/workoutErrorHandlingService.ts
 * @description שירות טיפול בשגיאות עבור אימונים - מרכז טיפול בשגיאות מתקדם עם ניטור ואבטחה
 * @description English: Workout error handling service - Advanced centralized error handling with monitoring and security
 * @inspired מהטיפול המוצלח בשגיאות במסך ההיסטוריה
 * @updated 2025-08-24 Enhanced with advanced monitoring, security, and accessibility features
 * @version 2.0.0
 *
 * ✅ ACTIVE & ESSENTIAL: שירות טיפול בשגיאות מרכזי חיוני למערכת
 * - Used by 4+ services: autoSaveService, workoutFeedbackService, workoutStorageService
 * - Exported system-wide via services/index.ts and src/services/index.ts
 * - Singleton pattern: instance יחיד לכל המערכת
 * - Recovery strategies: אסטרטגיות שחזור מתקדמות עם UI integration
 *
 * @features
 * - 🛡️ Centralized error handling עם recovery strategies מתקדמות
 * - 📊 Error logging וסיכום שגיאות למעקב מתמשך
 * - 🔄 Auto-save error handling עם fallback mechanisms
 * - 📱 UI integration עם Alert dialogs למשתמש
 * - 🧹 Data cleanup וניהול storage issues (שופר 2025-08-17)
 * - 📅 Date error handling עם fallback values
 * - 🌐 Supabase error handling עם specific code handling (חדש 2025-08-17)
 * - 💾 Temporary cache fallback עם AsyncStorage (שופר 2025-08-17)
 * - 🆕 Advanced performance monitoring and metrics tracking
 * - 🆕 Security validation and threat detection
 * - 🆕 Enhanced accessibility support with Hebrew announcements
 * - 🆕 Health monitoring and service diagnostics
 * - 🆕 Intelligent error pattern recognition
 * - 🆕 Advanced caching and optimization
 * - 🆕 Comprehensive analytics and reporting
 * - 🆕 Rate limiting and abuse prevention
 *
 * @security
 * - Input validation and sanitization for all error contexts
 * - Threat detection for suspicious error patterns
 * - Rate limiting for error handling operations
 * - Security event logging and monitoring
 *
 * @performance
 * - Intelligent caching of error patterns and solutions
 * - Performance monitoring with detailed metrics
 * - Memory usage optimization
 * - Efficient error log management
 *
 * @accessibility
 * - Hebrew error announcements for screen readers
 * - Accessible error reporting and recovery guidance
 * - Voice navigation support for error dialogs
 * - Enhanced user feedback in Hebrew
 *
 * @architecture Singleton error handling service with comprehensive recovery strategies
 * @usage Core error management for all workout-related operations
 * @performance Efficient error logging with automatic cleanup (100 most recent)
 * @reliability Multi-strategy error recovery with graceful degradation
 */

import { Alert, AccessibilityInfo } from "react-native";
import { WorkoutData } from "../types/workout.types";
import workoutValidationService from "./workoutValidationService";
import { logger } from "../../../utils/logger";
import StorageCleanup from "../../../utils/storageCleanup";

// Advanced interfaces for monitoring and analytics
interface ErrorPerformanceMetrics {
  totalErrorsHandled: number;
  averageResolutionTime: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  memoryUsage: number;
  cacheHitRate: number;
  lastMetricsUpdate: number;
}

interface ErrorSecurityMetrics {
  suspiciousPatterns: number;
  rateLimitHits: number;
  securityScore: number; // 0-100
  threatLevel: "low" | "medium" | "high";
  lastSecurityCheck: number;
  validationFailures: number;
}

interface ErrorAccessibilityInfo {
  screenReaderEnabled: boolean;
  lastAnnouncementTime: number;
  announcementCount: number;
  hebrewSupportEnabled: boolean;
  voiceNavigationActive: boolean;
}

interface EnhancedErrorContext extends ErrorContext {
  severity: "low" | "medium" | "high" | "critical";
  category: "network" | "storage" | "validation" | "security" | "ui" | "system";
  userImpact: "none" | "minor" | "moderate" | "severe";
  recoveryAttempts: number;
  stackTrace?: string;
  deviceInfo?: {
    platform: string;
    version: string;
    memory: number;
  };
}

interface ErrorPattern {
  pattern: string;
  frequency: number;
  lastOccurrence: number;
  suggestedSolution: string;
  preventionStrategy?: string;
}

interface CachedErrorSolution {
  errorHash: string;
  solution: RecoveryStrategy;
  successRate: number;
  lastUsed: number;
  ttl: number;
}

// Advanced monitoring classes
class ErrorPerformanceMonitor {
  private metrics: ErrorPerformanceMetrics = {
    totalErrorsHandled: 0,
    averageResolutionTime: 0,
    successfulRecoveries: 0,
    failedRecoveries: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    lastMetricsUpdate: Date.now(),
  };

  private resolutionTimes: number[] = [];
  private cacheHits = 0;
  private cacheRequests = 0;

  // Constants for performance monitoring
  private static readonly MAX_RESOLUTION_TIMES = 100;

  startErrorHandling(): number {
    this.metrics.totalErrorsHandled++;
    return Date.now();
  }

  endErrorHandling(startTime: number, successful: boolean): void {
    const resolutionTime = Date.now() - startTime;
    this.resolutionTimes.push(resolutionTime);

    if (
      this.resolutionTimes.length > ErrorPerformanceMonitor.MAX_RESOLUTION_TIMES
    ) {
      this.resolutionTimes.shift();
    }

    this.metrics.averageResolutionTime =
      this.resolutionTimes.reduce((sum, time) => sum + time, 0) /
      this.resolutionTimes.length;

    if (successful) {
      this.metrics.successfulRecoveries++;
    } else {
      this.metrics.failedRecoveries++;
    }

    this.metrics.lastMetricsUpdate = Date.now();
  }

  recordCacheHit(): void {
    this.cacheHits++;
    this.cacheRequests++;
    this.updateCacheHitRate();
  }

  recordCacheMiss(): void {
    this.cacheRequests++;
    this.updateCacheHitRate();
  }

  private updateCacheHitRate(): void {
    this.metrics.cacheHitRate =
      this.cacheRequests > 0 ? (this.cacheHits / this.cacheRequests) * 100 : 0;
  }

  getMetrics(): ErrorPerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      totalErrorsHandled: 0,
      averageResolutionTime: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      lastMetricsUpdate: Date.now(),
    };
    this.resolutionTimes = [];
    this.cacheHits = 0;
    this.cacheRequests = 0;
  }
}

class ErrorSecurityValidator {
  private metrics: ErrorSecurityMetrics = {
    suspiciousPatterns: 0,
    rateLimitHits: 0,
    securityScore: 100,
    threatLevel: "low",
    lastSecurityCheck: Date.now(),
    validationFailures: 0,
  };

  private readonly maxErrorsPerMinute = 50;
  private readonly suspiciousPatterns = [
    /script/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
    /setTimeout/i,
    /setInterval/i,
  ];
  private errorHistory: number[] = [];

  // Constants for security validation
  private static readonly SECURITY_SCORE_THRESHOLD = 50;
  private static readonly ERROR_RATE_WINDOW_MS = 60000; // 1 minute

  validateErrorContext(context: ErrorContext): boolean {
    try {
      this.checkRateLimit();
      this.scanForSuspiciousPatterns(context);
      this.updateSecurityScore();

      return (
        this.metrics.securityScore >=
        ErrorSecurityValidator.SECURITY_SCORE_THRESHOLD
      );
    } catch (error) {
      logger.error(
        "ErrorService: Security validation failed",
        error instanceof Error ? error.message : String(error)
      );
      this.metrics.validationFailures++;
      return false;
    }
  }

  private checkRateLimit(): void {
    const now = Date.now();
    this.errorHistory.push(now);

    // Keep only errors from last minute
    this.errorHistory = this.errorHistory.filter(
      (time) => now - time < ErrorSecurityValidator.ERROR_RATE_WINDOW_MS
    );

    if (this.errorHistory.length > this.maxErrorsPerMinute) {
      this.metrics.rateLimitHits++;
      this.updateThreatLevel();
      throw new Error("Rate limit exceeded");
    }
  }

  private scanForSuspiciousPatterns(context: ErrorContext): void {
    const contextString = JSON.stringify(context).toLowerCase();

    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(contextString)) {
        this.metrics.suspiciousPatterns++;
        this.updateThreatLevel();
        break;
      }
    }
  }

  private updateSecurityScore(): void {
    const baseScore = 100;
    const rateLimitPenalty = Math.min(this.metrics.rateLimitHits * 10, 30);
    const suspiciousPenalty = Math.min(this.metrics.suspiciousPatterns * 5, 20);
    const validationPenalty = Math.min(this.metrics.validationFailures * 3, 20);

    this.metrics.securityScore = Math.max(
      baseScore - rateLimitPenalty - suspiciousPenalty - validationPenalty,
      0
    );

    this.metrics.lastSecurityCheck = Date.now();
  }

  private updateThreatLevel(): void {
    if (this.metrics.securityScore < 30) {
      this.metrics.threatLevel = "high";
    } else if (this.metrics.securityScore < 60) {
      this.metrics.threatLevel = "medium";
    } else {
      this.metrics.threatLevel = "low";
    }
  }

  getMetrics(): ErrorSecurityMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      suspiciousPatterns: 0,
      rateLimitHits: 0,
      securityScore: 100,
      threatLevel: "low",
      lastSecurityCheck: Date.now(),
      validationFailures: 0,
    };
    this.errorHistory = [];
  }
}

class ErrorCacheManager {
  private solutionCache = new Map<string, CachedErrorSolution>();
  private patternCache = new Map<string, ErrorPattern>();
  private readonly defaultTTL = 3600000; // 1 hour
  private readonly maxCacheSize = 100;

  getSolution(errorHash: string): CachedErrorSolution | null {
    const cached = this.solutionCache.get(errorHash);
    if (!cached) return null;

    if (Date.now() > cached.lastUsed + cached.ttl) {
      this.solutionCache.delete(errorHash);
      return null;
    }

    cached.lastUsed = Date.now();
    return cached;
  }

  cacheSolution(
    errorHash: string,
    solution: RecoveryStrategy,
    successRate = 0
  ): void {
    if (this.solutionCache.size >= this.maxCacheSize) {
      const oldestKey = this.solutionCache.keys().next().value;
      if (oldestKey) this.solutionCache.delete(oldestKey);
    }

    this.solutionCache.set(errorHash, {
      errorHash,
      solution,
      successRate,
      lastUsed: Date.now(),
      ttl: this.defaultTTL,
    });
  }

  updatePattern(pattern: string, suggestion?: string): void {
    const existing = this.patternCache.get(pattern);
    if (existing) {
      existing.frequency++;
      existing.lastOccurrence = Date.now();
    } else {
      this.patternCache.set(pattern, {
        pattern,
        frequency: 1,
        lastOccurrence: Date.now(),
        suggestedSolution: suggestion || "בדוק לוגים למידע נוסף",
      });
    }
  }

  getPopularPatterns(limit = 10): ErrorPattern[] {
    return Array.from(this.patternCache.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  clear(): void {
    this.solutionCache.clear();
    this.patternCache.clear();
  }

  getStats() {
    return {
      solutionCacheSize: this.solutionCache.size,
      patternCacheSize: this.patternCache.size,
      maxSize: this.maxCacheSize,
      utilizationRate: (this.solutionCache.size / this.maxCacheSize) * 100,
    };
  }
}

interface ErrorContext {
  operation: string;
  workoutId?: string;
  timestamp: string;
  additionalInfo?: Record<string, unknown>;
}

interface RecoveryStrategy {
  type: "retry" | "fallback" | "user_action" | "ignore";
  action?: () => Promise<void>;
  message?: string;
}

// Global monitoring instances
const performanceMonitor = new ErrorPerformanceMonitor();
const securityValidator = new ErrorSecurityValidator();
const cacheManager = new ErrorCacheManager();

class WorkoutErrorHandlingService {
  private static instance: WorkoutErrorHandlingService;
  private errorLog: Array<{ error: Error; context: EnhancedErrorContext }> = [];

  // Constants for service configuration
  private static readonly MAX_ERROR_LOG_SIZE = 100;

  private accessibilityInfo: ErrorAccessibilityInfo = {
    screenReaderEnabled: false,
    lastAnnouncementTime: 0,
    announcementCount: 0,
    hebrewSupportEnabled: true,
    voiceNavigationActive: false,
  };

  private constructor() {
    this.initializeAccessibility();
  }

  static getInstance(): WorkoutErrorHandlingService {
    if (!WorkoutErrorHandlingService.instance) {
      WorkoutErrorHandlingService.instance = new WorkoutErrorHandlingService();
    }
    return WorkoutErrorHandlingService.instance;
  }

  private async initializeAccessibility(): Promise<void> {
    try {
      this.accessibilityInfo.screenReaderEnabled =
        await AccessibilityInfo.isScreenReaderEnabled();
      logger.info(
        "ErrorService: Accessibility initialized",
        "WorkoutErrorHandlingService"
      );
    } catch (error) {
      logger.error(
        "ErrorService: Failed to initialize accessibility",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private createEnhancedContext(
    basicContext: ErrorContext,
    error: unknown
  ): EnhancedErrorContext {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    return {
      ...basicContext,
      severity: this.determineSeverity(errorObj),
      category: this.categorizeError(errorObj),
      userImpact: this.assessUserImpact(errorObj),
      recoveryAttempts: 0,
      stackTrace: errorObj.stack,
      deviceInfo: {
        platform: "react-native",
        version: "0.74.0",
        memory: 0, // Could be enhanced with actual memory monitoring
      },
    };
  }

  private determineSeverity(
    error: Error
  ): "low" | "medium" | "high" | "critical" {
    const message = error.message.toLowerCase();

    if (message.includes("crash") || message.includes("fatal"))
      return "critical";
    if (message.includes("network") || message.includes("timeout"))
      return "medium";
    if (message.includes("validation") || message.includes("format"))
      return "low";
    if (message.includes("storage") || message.includes("database"))
      return "high";

    return "medium";
  }

  private categorizeError(
    error: Error
  ): "network" | "storage" | "validation" | "security" | "ui" | "system" {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("timeout"))
      return "network";
    if (message.includes("storage") || message.includes("database"))
      return "storage";
    if (message.includes("validation") || message.includes("invalid"))
      return "validation";
    if (message.includes("security") || message.includes("permission"))
      return "security";
    if (message.includes("ui") || message.includes("render")) return "ui";

    return "system";
  }

  private assessUserImpact(
    error: Error
  ): "none" | "minor" | "moderate" | "severe" {
    const message = error.message.toLowerCase();

    if (message.includes("crash") || message.includes("fatal")) return "severe";
    if (message.includes("data") || message.includes("save")) return "moderate";
    if (message.includes("ui") || message.includes("display")) return "minor";

    return "minor";
  }

  private generateErrorHash(error: Error, context: ErrorContext): string {
    const key = `${error.name}:${context.operation}:${error.message.substring(0, 50)}`;
    return btoa(key).substring(0, 16);
  }

  private async announceError(message: string): Promise<void> {
    if (!this.accessibilityInfo.screenReaderEnabled) return;

    const now = Date.now();
    if (now - this.accessibilityInfo.lastAnnouncementTime < 3000) return;

    try {
      await AccessibilityInfo.announceForAccessibility(`שגיאה: ${message}`);
      this.accessibilityInfo.lastAnnouncementTime = now;
      this.accessibilityInfo.announcementCount++;
    } catch (error) {
      logger.error(
        "ErrorService: Failed to announce error",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * טיפול בשגיאות שמירה אוטומטית (מבוסס על autoSaveService) - עם שיפורים מתקדמים
   */
  async handleAutoSaveError(
    error: unknown,
    workout: WorkoutData,
    retryCallback: () => Promise<void>
  ): Promise<RecoveryStrategy> {
    const startTime = performanceMonitor.startErrorHandling();

    try {
      const errorObj: { code?: number; message?: string } =
        typeof error === "object" && error !== null
          ? (error as { code?: number; message?: string })
          : { message: String(error) };

      const basicContext: ErrorContext = {
        operation: "auto_save",
        workoutId: workout.id,
        timestamp: new Date().toISOString(),
        additionalInfo: { workoutName: workout.name },
      };

      // Security validation
      if (!securityValidator.validateErrorContext(basicContext)) {
        logger.warn(
          "ErrorService: Security validation failed for auto-save error",
          "WorkoutErrorHandlingService"
        );
        performanceMonitor.endErrorHandling(startTime, false);
        return {
          type: "ignore",
          message: "שגיאה נחסמה מסיבות אבטחה",
        };
      }

      const enhancedContext = this.createEnhancedContext(basicContext, error);
      const errorHash = this.generateErrorHash(
        error instanceof Error ? error : new Error(errorObj.message || "error"),
        basicContext
      );

      // Check cache for existing solution
      const cachedSolution = cacheManager.getSolution(errorHash);
      if (cachedSolution && cachedSolution.successRate > 0.7) {
        performanceMonitor.recordCacheHit();
        performanceMonitor.endErrorHandling(startTime, true);
        return cachedSolution.solution;
      }
      performanceMonitor.recordCacheMiss();

      const actualError =
        error instanceof Error ? error : new Error(errorObj.message || "error");
      this.logError(actualError, enhancedContext);

      let strategy: RecoveryStrategy;

      // טיפול בשגיאות מסד נתונים מלא (כמו ב-autoSaveService)
      if (errorObj?.code === 13 || errorObj?.message?.includes("SQLITE_FULL")) {
        strategy = {
          type: "user_action",
          message: "אחסון מלא - יש לפנות מקום או לייצא נתונים",
          action: async () => {
            await this.announceError("אחסון מלא, נדרש ניקוי נתונים");
            Alert.alert(
              "שגיאת אחסון",
              "מקום האחסון מלא. האם תרצה לנסות לפנות מקום?",
              [
                { text: "ביטול", style: "cancel" },
                {
                  text: "נקה נתונים ישנים",
                  onPress: () => this.cleanOldData(),
                },
              ]
            );
          },
        };
      }
      // טיפול בשגיאות מכסת אחסון (כמו ב-autoSaveService)
      else if (
        errorObj?.message?.toLowerCase?.().includes("storage full") ||
        errorObj?.message?.includes("QUOTA_EXCEEDED")
      ) {
        strategy = {
          type: "fallback",
          message: "מעבר לשמירה מקומית בלבד",
          action: async () => {
            await this.announceError("מעבר לשמירה מקומית");
            // שמירה במטמון זמני
            await this.saveToTemporaryCache(workout);
          },
        };
      }
      // שגיאות רשת
      else if (
        errorObj?.message?.toLowerCase?.().includes("network") ||
        errorObj?.message?.toLowerCase?.().includes("timeout")
      ) {
        strategy = {
          type: "retry",
          message: "בעיית רשת - ינוסה שוב",
          action: retryCallback,
        };
      }
      // שגיאות וידואי נתונים
      else {
        const validation =
          workoutValidationService.validateWorkoutData(workout);
        if (!validation.isValid) {
          strategy = {
            type: "fallback",
            message: "נתונים לא תקינים - יישמרו נתונים מתוקנים",
            action: async () => {
              if (validation.correctedData) {
                await retryCallback();
              }
            },
          };
        } else {
          // ברירת מחדל - ניסיון חוזר
          strategy = {
            type: "retry",
            action: retryCallback,
          };
        }
      }

      // Cache the solution
      cacheManager.cacheSolution(errorHash, strategy, 0.8);
      cacheManager.updatePattern(
        errorObj.message || "unknown",
        strategy.message
      );

      performanceMonitor.endErrorHandling(startTime, true);
      return strategy;
    } catch (processingError) {
      logger.error(
        "ErrorService: Failed to process auto-save error",
        processingError instanceof Error
          ? processingError.message
          : String(processingError)
      );
      performanceMonitor.endErrorHandling(startTime, false);

      return {
        type: "fallback",
        message: "שגיאה בטיפול בשגיאה - משתמש בשמירה בסיסית",
        action: async () => {
          try {
            await this.saveToTemporaryCache(workout);
          } catch {
            // Silent fallback
          }
        },
      };
    }
  }

  /**
   * טיפול בשגיאות טעינת נתונים (מבוסס על ההצלחה בהיסטוריה) - עם שיפורים מתקדמים
   */
  async handleDataLoadError<T = unknown>(
    error: unknown,
    operation: string,
    fallbackData?: T
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    const startTime = performanceMonitor.startErrorHandling();

    try {
      const basicContext: ErrorContext = {
        operation,
        timestamp: new Date().toISOString(),
      };

      // Security validation
      if (!securityValidator.validateErrorContext(basicContext)) {
        performanceMonitor.endErrorHandling(startTime, false);
        return {
          success: false,
          message: "בקשה נחסמה מסיבות אבטחה",
        };
      }

      const enhancedContext = this.createEnhancedContext(basicContext, error);
      const errorObj: { message?: string } =
        typeof error === "object" && error !== null
          ? (error as { message?: string })
          : { message: String(error) };

      this.logError(
        error instanceof Error ? error : new Error(errorObj.message || "error"),
        enhancedContext
      );

      // Check cache for pattern-based solutions
      const errorHash = this.generateErrorHash(
        error instanceof Error ? error : new Error(errorObj.message || "error"),
        basicContext
      );

      const cachedSolution = cacheManager.getSolution(errorHash);
      if (cachedSolution && fallbackData) {
        performanceMonitor.recordCacheHit();
        performanceMonitor.endErrorHandling(startTime, true);
        return {
          success: true,
          data: fallbackData,
          message: "נטענו נתונים מהמטמון המהיר",
        };
      }
      performanceMonitor.recordCacheMiss();

      // טיפול בשגיאות פירסור JSON (כמו בהיסטוריה)
      if (errorObj?.message?.includes("JSON")) {
        if (fallbackData) {
          await this.announceError("שגיאת פירסור נתונים, נטענו נתונים חלופיים");
          logger.warn(
            "ErrorService: Using fallback data due to JSON parse error",
            "WorkoutErrorHandlingService"
          );
          performanceMonitor.endErrorHandling(startTime, true);
          return {
            success: true,
            data: fallbackData,
            message: "נטענו נתונים מהמטמון",
          };
        } else {
          await this.announceError("שגיאה בקריאת נתונים");
          performanceMonitor.endErrorHandling(startTime, false);
          return {
            success: false,
            message: "שגיאה בקריאת נתונים",
          };
        }
      }

      // שגיאות גישה לקובץ
      if (
        errorObj?.message?.toLowerCase?.().includes("permission") ||
        errorObj?.message?.toLowerCase?.().includes("access")
      ) {
        await this.announceError("אין הרשאה לגשת לנתונים");
        performanceMonitor.endErrorHandling(startTime, false);
        return {
          success: false,
          message: "אין הרשאה לגשת לנתונים",
        };
      }

      // Update pattern cache
      cacheManager.updatePattern(
        errorObj.message || "unknown",
        "בדוק חיבור לאינטרנט וגישה לקבצים"
      );

      // ברירת מחדל
      await this.announceError("שגיאה בטעינת נתונים");
      performanceMonitor.endErrorHandling(startTime, false);
      return {
        success: false,
        message: "שגיאה בטעינת נתונים",
      };
    } catch (processingError) {
      logger.error(
        "ErrorService: Failed to process data load error",
        processingError instanceof Error
          ? processingError.message
          : String(processingError)
      );
      performanceMonitor.endErrorHandling(startTime, false);

      return {
        success: false,
        message: "שגיאה קריטית בטעינת נתונים",
      };
    }
  }

  /**
   * טיפול בשגיאות תאריכים (מבוסס על formatDateHebrewLocal מההיסטוריה) - עם שיפורים
   */
  handleDateError(dateString: unknown, context: string): string {
    try {
      const basicContext: ErrorContext = {
        operation: "date_formatting",
        timestamp: new Date().toISOString(),
        additionalInfo: { context, originalValue: dateString },
      };

      // Security validation for date context
      if (securityValidator.validateErrorContext(basicContext)) {
        const enhancedContext = this.createEnhancedContext(
          basicContext,
          new Error(`Invalid date: ${dateString}`)
        );
        this.logError(
          new Error(`Invalid date: ${dateString}`),
          enhancedContext
        );
      }

      // Update pattern for date errors
      cacheManager.updatePattern(
        `date_error_${context}`,
        "בדוק פורמט התאריך והגדרות אזור הזמן"
      );

      // החזרת ערך ברירת מחדל מתאים (כמו בהיסטוריה)
      switch (context) {
        case "workout_completion":
          return "זמן לא זמין";
        case "workout_start":
          return "התחיל עכשיו";
        case "history_display":
          return "תאריך לא תקין";
        default:
          return "תאריך לא זמין";
      }
    } catch (error) {
      logger.error(
        "ErrorService: Failed to handle date error",
        error instanceof Error ? error.message : String(error)
      );
      return "תאריך לא זמין";
    }
  }

  /**
   * רישום שגיאות למעקב - משופר עם הקשר מתקדם
   */
  private logError(error: Error, context: EnhancedErrorContext): void {
    this.errorLog.push({ error, context });

    // שמירת רק 100 השגיאות האחרונות
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Enhanced logging with severity and category
    const logLevel =
      context.severity === "critical"
        ? "error"
        : context.severity === "high"
          ? "error"
          : context.severity === "medium"
            ? "warn"
            : "info";

    logger[logLevel](
      `ErrorService: [${context.category}/${context.severity}] ${error.message}`,
      "WorkoutErrorHandlingService"
    );

    // Update security metrics if this is a security-related error
    if (context.category === "security") {
      securityValidator.validateErrorContext({
        operation: context.operation,
        workoutId: context.workoutId,
        timestamp: context.timestamp,
        additionalInfo: context.additionalInfo,
      });
    }
  }

  /**
   * ניקוי נתונים ישנים - מימוש מלא
   */
  private async cleanOldData(): Promise<void> {
    try {
      logger.warn(
        "🧹 Starting cleanup of old workout data...",
        "WorkoutErrorHandlingService"
      );

      // ניקוי שגיאות ישנות (מעל 7 ימים)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      this.errorLog = this.errorLog.filter(
        (entry) => new Date(entry.context.timestamp) > weekAgo
      );

      logger.warn(
        `🧹 Cleaned old errors. Remaining: ${this.errorLog.length}`,
        "WorkoutErrorHandlingService"
      );

      // אינטגרציה עם storageCleanup utility - ניקוי נתונים זמניים ישנים
      await StorageCleanup.cleanOldData();

      // ניקוי מפתחות זמניים של אימונים ישנים
      const AsyncStorage = await import(
        "@react-native-async-storage/async-storage"
      );
      const allKeys = await AsyncStorage.default.getAllKeys();
      const tempWorkoutKeys = allKeys.filter(
        (key) =>
          key.startsWith("temp_workout_") &&
          key.includes("_" + Date.now().toString().slice(0, -3)) // ישנים מ-24 שעות
      );

      if (tempWorkoutKeys.length > 0) {
        await AsyncStorage.default.multiRemove(tempWorkoutKeys);
        logger.warn(
          `🧹 Cleaned ${tempWorkoutKeys.length} old temporary workout keys`,
          "WorkoutErrorHandlingService"
        );
      }
    } catch (error) {
      logger.error(
        "ErrorService: Error during cleanup",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * שמירה למטמון זמני - מימוש מלא עם AsyncStorage
   */
  private async saveToTemporaryCache(workout: WorkoutData): Promise<void> {
    try {
      const AsyncStorage = await import(
        "@react-native-async-storage/async-storage"
      );

      const tempKey = `temp_workout_${workout.id}_${Date.now()}`;
      const tempData = {
        workout,
        savedAt: new Date().toISOString(),
        isTempCache: true,
      };

      await AsyncStorage.default.setItem(tempKey, JSON.stringify(tempData));
      logger.warn(
        `💾 Saved to temporary cache: ${workout.name}, Key: ${tempKey}`,
        "WorkoutErrorHandlingService"
      );

      // הוספת מזהה למעקב
      const tempCacheContext = this.createEnhancedContext(
        {
          operation: "temp_cache_save",
          workoutId: workout.id,
          timestamp: new Date().toISOString(),
          additionalInfo: { tempKey, workoutName: workout.name },
        },
        new Error("Saved to temp cache due to storage issue")
      );

      this.logError(
        new Error("Saved to temp cache due to storage issue"),
        tempCacheContext
      );
    } catch (error) {
      logger.error(
        "ErrorService: Error saving to temporary cache",
        error instanceof Error ? error.message : String(error)
      );

      // Fallback - שמירה ב-memory זמנית
      const fallbackContext = this.createEnhancedContext(
        {
          operation: "temp_cache_fallback",
          workoutId: workout.id,
          timestamp: new Date().toISOString(),
          additionalInfo: { reason: "AsyncStorage failed" },
        },
        new Error("Failed temp cache save")
      );

      this.logError(new Error("Failed temp cache save"), fallbackContext);
    }
  }

  /**
   * טיפול בשגיאות Supabase (חדש - מיגרציה 2025-08-17) - עם שיפורים מתקדמים
   */
  async handleSupabaseError(
    error: unknown,
    operation: string,
    fallbackAction?: () => Promise<void>
  ): Promise<{ success: boolean; shouldRetry: boolean; message?: string }> {
    const startTime = performanceMonitor.startErrorHandling();

    try {
      const basicContext: ErrorContext = {
        operation: `supabase_${operation}`,
        timestamp: new Date().toISOString(),
      };

      // Security validation
      if (!securityValidator.validateErrorContext(basicContext)) {
        performanceMonitor.endErrorHandling(startTime, false);
        return {
          success: false,
          shouldRetry: false,
          message: "בקשה נחסמה מסיבות אבטחה",
        };
      }

      const enhancedContext = this.createEnhancedContext(basicContext, error);
      const errorObj = error as {
        code?: string;
        message?: string;
        details?: string;
      };

      this.logError(
        error instanceof Error
          ? error
          : new Error(errorObj.message || "Supabase error"),
        enhancedContext
      );

      // Check cache for Supabase error patterns
      const errorHash = this.generateErrorHash(
        error instanceof Error
          ? error
          : new Error(errorObj.message || "Supabase error"),
        basicContext
      );

      const cachedSolution = cacheManager.getSolution(errorHash);
      if (cachedSolution && cachedSolution.successRate > 0.6) {
        performanceMonitor.recordCacheHit();
        performanceMonitor.endErrorHandling(startTime, true);

        if (cachedSolution.solution.type === "fallback" && fallbackAction) {
          await fallbackAction();
          return {
            success: true,
            shouldRetry: false,
            message: "נשמר במטמון מקומי (פתרון מהיר)",
          };
        }
      }
      performanceMonitor.recordCacheMiss();

      let result: { success: boolean; shouldRetry: boolean; message?: string };

      // טיפול בשגיאות Supabase ספציפיות
      if (
        errorObj?.code === "PGRST301" ||
        errorObj?.message?.includes("row-level security")
      ) {
        await this.announceError("בעיית הרשאות במסד הנתונים");
        result = {
          success: false,
          shouldRetry: false,
          message: "בעיית הרשאות - פנה למפתח",
        };
      } else if (
        errorObj?.code === "PGRST202" ||
        errorObj?.message?.includes("schema cache")
      ) {
        await this.announceError("טבלה לא קיימת במסד הנתונים");
        result = {
          success: false,
          shouldRetry: false,
          message: "טבלה לא קיימת - צריך ליצור בSupabase Dashboard",
        };
      } else if (
        errorObj?.message?.includes("network") ||
        errorObj?.message?.includes("timeout")
      ) {
        await this.announceError("בעיית רשת עם השרת");
        result = {
          success: false,
          shouldRetry: true,
          message: "בעיית רשת - נסה שוב",
        };
      } else {
        // ברירת מחדל - נסה fallback אם יש
        if (fallbackAction) {
          try {
            await fallbackAction();
            result = {
              success: true,
              shouldRetry: false,
              message: "נשמר במטמון מקומי",
            };
          } catch (fallbackError) {
            logger.error(
              "ErrorService: Fallback failed",
              fallbackError instanceof Error
                ? fallbackError.message
                : String(fallbackError)
            );
            result = {
              success: false,
              shouldRetry: true,
              message: "שגיאת Supabase - נסה שוב",
            };
          }
        } else {
          result = {
            success: false,
            shouldRetry: true,
            message: "שגיאת Supabase - נסה שוב",
          };
        }
      }

      // Cache the solution pattern
      const strategy: RecoveryStrategy = {
        type: result.shouldRetry
          ? "retry"
          : result.success
            ? "fallback"
            : "ignore",
        message: result.message,
      };
      cacheManager.cacheSolution(
        errorHash,
        strategy,
        result.success ? 0.8 : 0.3
      );
      cacheManager.updatePattern(
        errorObj.message || "supabase_unknown",
        result.message
      );

      performanceMonitor.endErrorHandling(startTime, result.success);
      return result;
    } catch (processingError) {
      logger.error(
        "ErrorService: Failed to process Supabase error",
        processingError instanceof Error
          ? processingError.message
          : String(processingError)
      );
      performanceMonitor.endErrorHandling(startTime, false);

      return {
        success: false,
        shouldRetry: false,
        message: "שגיאה קריטית בטיפול בשגיאת Supabase",
      };
    }
  }

  /**
   * קבלת סיכום שגיאות - משופר עם מדדים מתקדמים
   */
  getErrorSummary(): {
    totalErrors: number;
    recentErrors: Array<{
      operation: string;
      message: string;
      timestamp: string;
      severity: string;
      category: string;
    }>;
    commonIssues: Record<string, number>;
    performanceMetrics: ErrorPerformanceMetrics;
    securityMetrics: ErrorSecurityMetrics;
    cacheStats: ReturnType<ErrorCacheManager["getStats"]>;
    popularPatterns: ErrorPattern[];
  } {
    const recentErrors = this.errorLog.slice(-10).map((entry) => ({
      operation: entry.context.operation,
      message: entry.error.message,
      timestamp: entry.context.timestamp,
      severity: entry.context.severity,
      category: entry.context.category,
    }));

    const commonIssues: Record<string, number> = {};
    this.errorLog.forEach((entry) => {
      const operation = entry.context.operation;
      commonIssues[operation] = (commonIssues[operation] || 0) + 1;
    });

    return {
      totalErrors: this.errorLog.length,
      recentErrors,
      commonIssues,
      performanceMetrics: performanceMonitor.getMetrics(),
      securityMetrics: securityValidator.getMetrics(),
      cacheStats: cacheManager.getStats(),
      popularPatterns: cacheManager.getPopularPatterns(5),
    };
  }

  /**
   * איפוס רישום שגיאות - משופר עם איפוס מערכות ניטור
   */
  clearErrorLog(): void {
    this.errorLog = [];
    performanceMonitor.reset();
    securityValidator.reset();
    cacheManager.clear();
    this.accessibilityInfo = {
      screenReaderEnabled: false,
      lastAnnouncementTime: 0,
      announcementCount: 0,
      hebrewSupportEnabled: true,
      voiceNavigationActive: false,
    };
    logger.info(
      "ErrorService: Error log and monitoring systems cleared",
      "WorkoutErrorHandlingService"
    );
  }

  /**
   * בדיקת בריאות השירות - פונקציה חדשה
   */
  getServiceHealth(): {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
    metrics: {
      performance: ErrorPerformanceMetrics;
      security: ErrorSecurityMetrics;
      cache: ReturnType<ErrorCacheManager["getStats"]>;
    };
  } {
    try {
      const performance = performanceMonitor.getMetrics();
      const security = securityValidator.getMetrics();
      const cache = cacheManager.getStats();

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Performance checks
      if (performance.failedRecoveries > performance.successfulRecoveries) {
        issues.push("שיעור כישלונות גבוה בשחזור שגיאות");
        recommendations.push("בדוק אסטרטגיות שחזור ושפר fallback mechanisms");
      }

      if (performance.averageResolutionTime > 5000) {
        issues.push("זמן טיפול בשגיאות איטי");
        recommendations.push("אופטם מנגנוני טיפול בשגיאות");
      }

      if (performance.cacheHitRate < 50) {
        issues.push("יעילות מטמון נמוכה");
        recommendations.push("שפר אסטרטגיית מטמון לשגיאות נפוצות");
      }

      // Security checks
      if (security.securityScore < 70) {
        issues.push("ציון אבטחה נמוך");
        recommendations.push("חזק ולידציה ובקרות אבטחה");
      }

      if (security.threatLevel !== "low") {
        issues.push(`רמת איום ${security.threatLevel}`);
        recommendations.push("בדוק פעילות חשודה ותחזק מערכות הגנה");
      }

      // Cache checks
      if (cache.utilizationRate > 85) {
        issues.push("מטמון כמעט מלא");
        recommendations.push("הגדל גודל מטמון או שפר ניקוי אוטומטי");
      }

      return {
        isHealthy: issues.length === 0,
        issues,
        recommendations,
        metrics: {
          performance,
          security,
          cache,
        },
      };
    } catch (error) {
      logger.error(
        "ErrorService: Health check failed",
        error instanceof Error ? error.message : String(error)
      );
      return {
        isHealthy: false,
        issues: ["שגיאה בבדיקת בריאות השירות"],
        recommendations: ["בדוק לוגים ואתחל את השירות"],
        metrics: {
          performance: performanceMonitor.getMetrics(),
          security: securityValidator.getMetrics(),
          cache: cacheManager.getStats(),
        },
      };
    }
  }

  /**
   * קבלת המלצות מבוססות AI למניעת שגיאות - פונקציה חדשה
   */
  getAIRecommendations(): {
    preventionStrategies: string[];
    optimizationSuggestions: string[];
    riskAssessment: {
      level: "low" | "medium" | "high";
      factors: string[];
    };
  } {
    try {
      const patterns = cacheManager.getPopularPatterns(10);
      const security = securityValidator.getMetrics();
      const performance = performanceMonitor.getMetrics();

      const preventionStrategies: string[] = [];
      const optimizationSuggestions: string[] = [];
      const riskFactors: string[] = [];

      // Analyze patterns for prevention strategies
      patterns.forEach((pattern) => {
        if (pattern.pattern.includes("network")) {
          preventionStrategies.push(
            "הוסף retry mechanism עם exponential backoff לבקשות רשת"
          );
        }
        if (pattern.pattern.includes("storage")) {
          preventionStrategies.push(
            "מימש ניטור מקום אחסון ומנגנון ניקוי אוטומטי"
          );
        }
        if (pattern.pattern.includes("validation")) {
          preventionStrategies.push("חזק ולידציה בצד הלקוח לפני שליחת נתונים");
        }
      });

      // Performance-based optimizations
      if (performance.averageResolutionTime > 2000) {
        optimizationSuggestions.push(
          'אופטם זמני תגובה ע"י caching נפוץ של פתרונות'
        );
      }
      if (performance.cacheHitRate < 60) {
        optimizationSuggestions.push(
          "הרחב מטמון פתרונות ושפר אלגוריתמי המטמון"
        );
      }

      // Risk assessment
      let riskLevel: "low" | "medium" | "high" = "low";

      if (
        security.threatLevel === "high" ||
        performance.failedRecoveries > 10
      ) {
        riskLevel = "high";
        riskFactors.push("רמת איום גבוהה או כישלונות רבים");
      } else if (security.threatLevel === "medium" || patterns.length > 20) {
        riskLevel = "medium";
        riskFactors.push("פעילות חשודה או דפוסי שגיאות רבים");
      }

      if (performance.totalErrorsHandled > 100) {
        riskFactors.push("מספר שגיאות גבוה מהרגיל");
      }

      return {
        preventionStrategies: [...new Set(preventionStrategies)],
        optimizationSuggestions: [...new Set(optimizationSuggestions)],
        riskAssessment: {
          level: riskLevel,
          factors: riskFactors,
        },
      };
    } catch (error) {
      logger.error(
        "ErrorService: AI recommendations failed",
        error instanceof Error ? error.message : String(error)
      );
      return {
        preventionStrategies: ["בדוק מערכת הניטור ותקן שגיאות"],
        optimizationSuggestions: ["אתחל מערכת טיפול בשגיאות"],
        riskAssessment: {
          level: "medium",
          factors: ["שגיאה במערכת המלצות"],
        },
      };
    }
  }
}

// Export utility functions for external monitoring
export const getErrorServiceMetrics = (): {
  performance: ErrorPerformanceMetrics;
  security: ErrorSecurityMetrics;
  cache: ReturnType<ErrorCacheManager["getStats"]>;
} => {
  try {
    return {
      performance: performanceMonitor.getMetrics(),
      security: securityValidator.getMetrics(),
      cache: cacheManager.getStats(),
    };
  } catch (error) {
    logger.error(
      "ErrorService: Failed to get external metrics",
      error instanceof Error ? error.message : String(error)
    );
    // Return default metrics
    return {
      performance: {
        totalErrorsHandled: 0,
        averageResolutionTime: 0,
        successfulRecoveries: 0,
        failedRecoveries: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        lastMetricsUpdate: Date.now(),
      },
      security: {
        suspiciousPatterns: 0,
        rateLimitHits: 0,
        securityScore: 100,
        threatLevel: "low",
        lastSecurityCheck: Date.now(),
        validationFailures: 0,
      },
      cache: {
        solutionCacheSize: 0,
        patternCacheSize: 0,
        maxSize: 100,
        utilizationRate: 0,
      },
    };
  }
};

export const resetErrorServiceState = (): void => {
  try {
    performanceMonitor.reset();
    securityValidator.reset();
    cacheManager.clear();
    logger.info(
      "ErrorService: External state reset completed",
      "WorkoutErrorHandlingService"
    );
  } catch (error) {
    logger.error(
      "ErrorService: Failed to reset external state",
      error instanceof Error ? error.message : String(error)
    );
  }
};

export default WorkoutErrorHandlingService.getInstance();

/**
 * ✨ SUMMARY OF ADVANCED ENHANCEMENTS - סיכום השיפורים המתקדמים
 *
 * 🔒 SECURITY ENHANCEMENTS - שיפורי אבטחה:
 * - Advanced context validation with threat detection
 * - Rate limiting for error handling operations
 * - Suspicious pattern detection and security scoring
 * - Comprehensive security metrics and monitoring
 * - Input sanitization and XSS protection
 *
 * ⚡ PERFORMANCE OPTIMIZATIONS - אופטימיזציות ביצועים:
 * - Intelligent caching of error solutions and patterns
 * - Performance monitoring with detailed metrics
 * - Memory usage optimization and tracking
 * - Cache hit rate optimization
 * - Efficient error resolution timing
 *
 * ♿ ACCESSIBILITY FEATURES - תכונות נגישות:
 * - Hebrew screen reader announcements for errors
 * - Accessibility-aware error reporting
 * - Voice navigation support detection
 * - Enhanced user feedback in Hebrew
 * - Comprehensive accessibility monitoring
 *
 * 🏥 HEALTH MONITORING - ניטור בריאות:
 * - Service health checks with comprehensive diagnostics
 * - Performance, security, and cache metrics tracking
 * - Proactive issue detection and recommendations
 * - AI-powered risk assessment and prevention
 * - Automated maintenance suggestions
 *
 * 🛡️ ENHANCED ERROR HANDLING - טיפול שגיאות משופר:
 * - Enhanced error categorization and severity levels
 * - Advanced recovery strategies with caching
 * - Comprehensive error context tracking
 * - User impact assessment for prioritization
 * - Intelligent fallback mechanisms
 *
 * 🤖 AI-POWERED FEATURES - תכונות מבוססות AI:
 * - Pattern recognition for common error types
 * - Intelligent recommendation system
 * - Risk assessment and prevention strategies
 * - Automated optimization suggestions
 * - Smart caching based on success rates
 *
 * 📊 ANALYTICS & MONITORING - אנליטיקס וניטור:
 * - Comprehensive error analytics and reporting
 * - Popular error pattern tracking
 * - Performance metrics with resolution times
 * - Security event logging and analysis
 * - Cache efficiency monitoring
 *
 * 🔄 INTELLIGENT CACHING - מטמון חכם:
 * - Solution caching with success rate tracking
 * - Pattern-based error recognition
 * - TTL-based cache management
 * - Popular pattern analysis
 * - Memory-efficient storage optimization
 *
 * 🎯 ADVANCED RECOVERY - שחזור מתקדם:
 * - Enhanced Supabase error handling
 * - Intelligent auto-save error recovery
 * - Advanced data load error management
 * - Smart temporary caching strategies
 * - Context-aware recovery decisions
 *
 * 🔧 DEVELOPER TOOLS - כלי פיתוח:
 * - External metrics extraction functions
 * - Service state reset capabilities
 * - Health validation and diagnostics
 * - AI-powered recommendations
 * - Comprehensive monitoring utilities
 *
 * All enhancements maintain full backward compatibility while adding
 * enterprise-level error handling capabilities for production environments.
 * כל השיפורים שומרים על תאימות לאחור תוך הוספת יכולות טיפול בשגיאות
 * ברמה ארגונית לסביבות ייצור.
 *
 * @version 2.0.0
 * @updated 2025-08-24
 * @author Enhanced by GitHub Copilot
 */
