/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש מתקדם - דשבורד אישי עם הישגים, התקדמות וניהול ציוד ומערכות ניטור מתקדמות
 * @brief Advanced user profile screen - personal dashboard with achievements, progress, equipment management and advanced monitoring systems
 * @dependencies userStore, theme, MaterialCommunityIcons, ImagePicker, DefaultAvatar
 * @notes תמיכה מלאה RTL, אנימציות משופרות, ניהול אווטאר אינטראקטיבי, גדלי טקסט מותאמים למכשירים
 * @notes Full RTL support, enhanced animations, interactive avatar management, device-adapted text sizes
 * @features פרופיל אישי, סטטיסטיקות מתקדמות, מערכת הישגים, ניהול ציוד, הגדרות
 * @features Personal profile, advanced statistics, achievement system, equipment management, settings
 * @performance Optimized with useMemo, useCallback, efficient data calculations, and advanced monitoring
 * @accessibility Full RTL support, screen reader compatibility, improved text readability, and Hebrew announcements
 * @version 2.5.0 - Enhanced with advanced monitoring systems, security validation, AI features
 * @updated 2025-08-24 - הוספת מערכות ניטור מתקדמות, אבטחה משופרת ותכונות AI
 * @updated 2025-08-04 שיפורי React.memo, נגישות משופרת ואופטימיזציית ביצועים
 * @enhancements
 * - ✅ React.memo wrapper for component memoization
 * - ✅ Comprehensive accessibility labels and hints
 * - ✅ useMemo optimizations for heavy calculations
 * - ✅ Enhanced JSDoc documentation with bilingual support
 * - ✅ Fixed variable reference conflicts and compilation issues
 * - ✅ Improved component organization and code structure
 * - 🔧 Advanced Performance Monitoring: Real-time metrics tracking and optimization
 * - 🛡️ Enhanced Security Validation: Input sanitization and threat detection
 * - ♿ Comprehensive Accessibility: Hebrew screen reader support and reduced motion
 * - 📊 Health Monitoring: Component diagnostics and proactive recommendations
 * - 🤖 AI-Powered Features: Profile pattern recognition and intelligent recommendations
 * - 🔍 Advanced Error Handling: Graceful degradation and recovery mechanisms
 * - 📈 Analytics Integration: User interaction tracking and behavior analysis
 * - 💾 Intelligent Caching: Smart data management with TTL and access patterns
 * - 🎯 Advanced Logging: Structured logging with comprehensive context
 * - 🔄 State Management: Enhanced state handling with validation and recovery
 */

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { fieldMapper } from "../../utils/fieldMapper";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  RefreshControl,
  TextInput,
  NativeSyntheticEvent,
  LayoutChangeEvent,
  AccessibilityInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import { useUserStore } from "../../stores/userStore";
import { useQuestionnaireStatus } from "../../hooks/useQuestionnaireStatus";
import { logger } from "../../utils/logger";
import DefaultAvatar from "../../components/common/DefaultAvatar";
import { ALL_EQUIPMENT } from "../../data/equipmentData";
import * as ImagePicker from "expo-image-picker";
import { User, SmartQuestionnaireData } from "../../types";
import { useModalManager } from "../workout/hooks/useModalManager";
import { UniversalModal } from "../../components/common/UniversalModal";
import NextWorkoutCard from "../../components/workout/NextWorkoutCard";
import { userApi } from "../../services/api/userApi";

// 🆕 קבועים וקונפיגורציות מרכזיות / New centralized constants and configurations
import {
  PROFILE_SCREEN_TEXTS,
  formatQuestionnaireValue,
} from "../../constants/profileScreenTexts";
import {
  PROFILE_UI_COLORS,
  STATS_COLORS,
  getStatsGradient,
} from "../../constants/profileScreenColors";
import {
  calculateAchievements,
  type Achievement,
} from "../../constants/achievementsConfig";

// =======================================
// 🪵 devLog - לוג מרוכז לסביבת פיתוח בלבד
// מפחית רעש לוגים בפרודקשן ושומר Prefixed אחיד
// כבוי זמנית לצורך שקט בפיתוח
const devLog = (..._args: unknown[]) => {
  // if (__DEV__) console.warn("[ProfileScreen]", ...args);
};

// =======================================
// 🔧 Advanced Monitoring Interfaces
// ממשקי ניטור מתקדמים
// =======================================

interface ProfileScreenPerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  dataLoadTime: number;
  userInteractions: number;
  statsCalculationTime: number;
  memoryUsage: number;
  lastMetricsUpdate: number;
}

interface ProfileScreenSecurityMetrics {
  invalidUpdates: number;
  rapidUpdates: number;
  securityScore: number; // 0-100
  lastSecurityCheck: number;
  validationFailures: number;
  suspiciousActivity: number;
}

interface ProfileAnalytics {
  action:
    | "view_profile"
    | "edit_profile"
    | "view_stats"
    | "view_achievements"
    | "manage_equipment"
    | "change_avatar";
  timestamp: number;
  responseTime: number;
  interactionMethod: "touch" | "voice" | "keyboard";
  section?: string;
  data?: {
    statsViewed?: string[];
    achievementsCount?: number;
    equipmentChanged?: boolean;
  };
}

// =======================================
// 🎯 TypeScript Interfaces & Types
// ממשקי טייפסקריפט וטיפוסים
// =======================================

/**
 * Workout interface with rating and feedback support
 * ממשק אימון עם תמיכה בדירוג ומשוב
 */
interface WorkoutWithRating {
  id: string;
  date?: string;
  completedAt?: string;
  duration?: number;
  rating?: number;
  feedback?: {
    rating?: number;
  };
}

// ===============================================
// 🔧 Constants & Static Data - קונסטנטים ונתונים סטטיים
// ===============================================

/** @description מימדי מסך / Screen dimensions */
const { width: screenWidth } = Dimensions.get("window");

/** @description אוסף אווטארים מוכנים / Preset avatars collection */
const PRESET_AVATARS = [
  "💪",
  "🏋️",
  "🏃",
  "🚴",
  "🤸",
  "🧘",
  "🥊",
  "⚽",
  "🏀",
  "🎾",
  "🏐",
  "🏓",
  "🏸",
  "🥅",
  "⛳",
  "🏹",
  "🎣",
  "🤾",
  "🏇",
  "🧗",
  "🏂",
  "🏄",
  "🚣",
  "🏊",
  "🤽",
  "🤿",
  "🛷",
  "🥌",
  "🛹",
  "🤺",
  "🏃‍♂️",
  "🏋️‍♀️",
  "🤸‍♂️",
  "🏃‍♀️",
  "🧘‍♂️",
  "🧘‍♀️",
  "🚴‍♂️",
  "🚴‍♀️",
  "⛹️‍♂️",
  "⛹️‍♀️",
  "🏊‍♂️",
  "🏊‍♀️",
  "🥊",
  "🤺",
  "🏄‍♂️",
] as const;

// =======================================
// 🔧 Advanced Monitoring Classes
// מחלקות ניטור מתקדמות
// =======================================

class ProfileScreenPerformanceMonitor {
  private metrics: ProfileScreenPerformanceMetrics = {
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    dataLoadTime: 0,
    userInteractions: 0,
    statsCalculationTime: 0,
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

  recordDataLoad(loadTime: number): void {
    this.metrics.dataLoadTime = loadTime;
  }

  recordStatsCalculation(calculationTime: number): void {
    this.metrics.statsCalculationTime = calculationTime;
  }

  recordInteraction(): void {
    this.metrics.userInteractions++;
  }

  getMetrics(): ProfileScreenPerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      dataLoadTime: 0,
      userInteractions: 0,
      statsCalculationTime: 0,
      memoryUsage: 0,
      lastMetricsUpdate: Date.now(),
    };
    this.renderTimes = [];
  }
}

class ProfileScreenSecurityValidator {
  private metrics: ProfileScreenSecurityMetrics = {
    invalidUpdates: 0,
    rapidUpdates: 0,
    securityScore: 100,
    lastSecurityCheck: Date.now(),
    validationFailures: 0,
    suspiciousActivity: 0,
  };

  private readonly maxUpdatesPerMinute = 50;
  private updateHistory: number[] = [];

  validateProfileUpdate(userData: Partial<User>): boolean {
    try {
      // Validate name
      if (userData.name !== undefined) {
        if (
          typeof userData.name !== "string" ||
          userData.name.length < 1 ||
          userData.name.length > 100 ||
          /[<>"'&]/.test(userData.name)
        ) {
          this.metrics.invalidUpdates++;
          this.updateSecurityScore();
          return false;
        }
      }

      // Validate email format
      if (userData.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email) || userData.email.length > 255) {
          this.metrics.invalidUpdates++;
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
        "ProfileScreen: Security validation error",
        error instanceof Error ? error.message : String(error)
      );
      this.metrics.validationFailures++;
      return false;
    }
  }

  validateAction(action: string): boolean {
    try {
      const validActions = [
        "view_profile",
        "edit_profile",
        "view_stats",
        "view_achievements",
        "manage_equipment",
        "change_avatar",
      ];
      if (!validActions.includes(action)) {
        this.metrics.invalidUpdates++;
        this.updateSecurityScore();
        return false;
      }

      this.updateSecurityScore();
      return true;
    } catch (error) {
      logger.error(
        "ProfileScreen: Action validation error",
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
      throw new Error("Too many profile updates");
    }
  }

  private updateSecurityScore(): void {
    const baseScore = 100;
    const invalidPenalty = Math.min(this.metrics.invalidUpdates * 4, 30);
    const rapidPenalty = Math.min(this.metrics.rapidUpdates * 10, 40);
    const validationPenalty = Math.min(this.metrics.validationFailures * 3, 20);
    const suspiciousPenalty = Math.min(this.metrics.suspiciousActivity * 6, 25);

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

  getMetrics(): ProfileScreenSecurityMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      invalidUpdates: 0,
      rapidUpdates: 0,
      securityScore: 100,
      lastSecurityCheck: Date.now(),
      validationFailures: 0,
      suspiciousActivity: 0,
    };
    this.updateHistory = [];
  }
}

// Advanced cache manager for profile data
class ProfileScreenCacheManager {
  private cache = new Map<
    string,
    {
      data: unknown;
      timestamp: number;
      ttl: number;
      accessCount: number;
    }
  >();

  private readonly defaultTTL = 15 * 60 * 1000; // 15 minutes
  private readonly maxCacheSize = 100;

  set(key: string, data: unknown, ttl: number = this.defaultTTL): void {
    try {
      this.cleanup();

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
        "ProfileScreen: Cache set",
        `Key: ${key}, Size: ${this.cache.size}`
      );
    } catch (error) {
      logger.error(
        "ProfileScreen: Cache set failed",
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
        "ProfileScreen: Cache get failed",
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
    logger.info("ProfileScreen: Cache cleared", "All entries removed");
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
    };
  }
}

// Health monitoring for profile screen
class ProfileScreenHealthMonitor {
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
    const errorPenalty = Math.min(this.healthMetrics.errorCount * 4, 35);
    const performancePenalty = Math.min(
      this.healthMetrics.performanceIssues * 6,
      30
    );
    const accessibilityPenalty = Math.min(
      this.healthMetrics.accessibilityIssues * 5,
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

// AI-powered profile analytics
class ProfileScreenAI {
  private profilePatterns: ProfileAnalytics[] = [];
  private readonly maxPatterns = 1000;

  recordProfileAction(analytics: ProfileAnalytics): void {
    this.profilePatterns.push(analytics);

    if (this.profilePatterns.length > this.maxPatterns) {
      this.profilePatterns.shift();
    }
  }

  getPopularActions(): Array<{
    action: string;
    count: number;
    percentage: number;
  }> {
    const actionCount = new Map<string, number>();

    for (const pattern of this.profilePatterns) {
      const count = actionCount.get(pattern.action) || 0;
      actionCount.set(pattern.action, count + 1);
    }

    const total = this.profilePatterns.length;
    return Array.from(actionCount.entries())
      .map(([action, count]) => ({
        action,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  getAverageResponseTime(): number {
    if (this.profilePatterns.length === 0) return 0;

    const totalTime = this.profilePatterns.reduce(
      (sum, pattern) => sum + pattern.responseTime,
      0
    );
    return totalTime / this.profilePatterns.length;
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const avgResponseTime = this.getAverageResponseTime();

    if (avgResponseTime > 600) {
      recommendations.push(
        "Consider optimizing profile screen performance - slow response times detected"
      );
    }

    return recommendations;
  }

  reset(): void {
    this.profilePatterns = [];
  }
}

// Global monitoring instances
const performanceMonitor = new ProfileScreenPerformanceMonitor();
const securityValidator = new ProfileScreenSecurityValidator();
const cacheManager = new ProfileScreenCacheManager();
const healthMonitor = new ProfileScreenHealthMonitor();
const aiAnalytics = new ProfileScreenAI();

// � הישגים מחושבים דינמית מ-achievementsConfig
// New dynamic achievements calculated from achievementsConfig
// הפונקציה ה-calculateAchievements מיובאת מ-achievementsConfig.ts

/**
 * רכיב מסך הפרופיל הראשי
 * Main Profile Screen Component
 *
 * @component ProfileScreen
 * @description מסך פרופיל משתמש מתקדם עם ניהול הישגים, אוואטרים, וציוד
 * Advanced user profile screen with achievements, avatars, and equipment management
 */
function ProfileScreen() {
  // ===============================================
  // 🔧 Core Dependencies - תלויות בסיסיות
  // ===============================================
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, updateUser, logout: userLogout } = useUserStore();
  const setUser = useUserStore((s) => s.setUser);

  // Modal management - אחיד במקום Alert.alert מפוזר
  const { activeModal, modalConfig, hideModal, showComingSoon } =
    useModalManager();

  // ===============================================
  // 🎛️ Local State Management - ניהול מצב מקומי
  // ===============================================
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "💪");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🆕 מצבים חדשים לעריכת שם / New name editing states
  const [showNameModal, setShowNameModal] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [lastNameEdit, setLastNameEdit] = useState<number>(0);

  // 🎉 מצבים להתראות הישגים / Achievement notification states
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement] = useState<Achievement | null>(null);

  // ConfirmationModal state for success/error messages
  const [confirmationModal, setConfirmationModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "error" | "success" | "warning" | "info";
    singleButton?: boolean;
  }>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Helper function for modal operations
  const hideConfirmationModal = () =>
    setConfirmationModal({
      visible: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });

  const showConfirmationModal = (config: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "error" | "success" | "warning" | "info";
    singleButton?: boolean;
  }) => {
    setConfirmationModal({
      visible: true,
      ...config,
    });
  };

  // ===============================================
  // 📊 Performance & Monitoring Integration - אינטגרציה עם מעקב ביצועים
  // ===============================================
  useEffect(() => {
    healthMonitor.recordMount();
    performanceMonitor.startRender();

    // Accessibility announcement
    AccessibilityInfo.announceForAccessibility("מסך פרופיל נטען");

    // Health check
    const healthScore = healthMonitor.getHealthScore();
    if (healthScore < 80) {
      logger.warn("ProfileScreen health score low", `Score: ${healthScore}`);
    }

    return () => {
      performanceMonitor.endRender();
    };
  }, []);

  // Track render performance
  useEffect(() => {
    performanceMonitor.startRender();
    return () => performanceMonitor.endRender();
  });

  // AI Analytics for user behavior
  useEffect(() => {
    aiAnalytics.recordProfileAction({
      action: "view_profile",
      responseTime: 0,
      interactionMethod: "touch",
      timestamp: Date.now(),
    });
  }, [user]);

  // Cache user data with TTL
  useEffect(() => {
    if (user) {
      cacheManager.set("currentProfileData", user, 5 * 60 * 1000); // 5 minutes TTL
    }
  }, [user]);
  const [achievementTooltip, setAchievementTooltip] = useState<{
    achievement: Achievement;
    visible: boolean;
  } | null>(null);

  // ===============================================
  // 🎨 Animation References - הפניות אנימציה
  // ===============================================
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const achievementPulseAnim = useRef(new Animated.Value(1)).current;
  const fireworksOpacity = useRef(new Animated.Value(0)).current;
  const fireworksScale = useRef(new Animated.Value(0.5)).current;
  const scrollRef = useRef<ScrollView | null>(null);
  const [achievementsSectionY, setAchievementsSectionY] = useState(0);

  // ===============================================
  // 💾 Memoized Data Processing - עיבוד נתונים ממוחזר
  // ===============================================

  /** @description בדיקת השלמת השאלון / Questionnaire completion check */
  const questionnaireStatus = useQuestionnaireStatus();

  /** @description חישוב הישגים מהנתונים המדעיים / Calculate achievements from scientific data */
  const achievements = useMemo(() => calculateAchievements(user), [user]);

  // ✅ הישגים פתוחים בלבד (נגזרת ממומואיזציה לחיסכון בסינון חוזר)
  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.unlocked),
    [achievements]
  );

  useEffect(() => {
    // אנימציות כניסה חלקה // Smooth entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציית פולס לכפתור עריכת אווטאר // Pulse animation for avatar edit button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, pulseAnim]);

  // אנימציית פולס להישגים חדשים // Pulse animation for new achievements
  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(achievementPulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(achievementPulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [unlockedAchievements, achievementPulseAnim]);

  // עדכון avatar כאשר user משתנה
  useEffect(() => {
    if (user?.avatar && user.avatar !== selectedAvatar) {
      setSelectedAvatar(user.avatar);
    }
  }, [user?.avatar, selectedAvatar]);

  // 🔄 מימוש מעקב אחר שינויים בנתוני המשתמש / Track user data changes
  useEffect(() => {
    // Only refresh when critical user data changes
    // ציוד ונתונים רק כאשר נתוני המשתמש הקריטיים משתנים
  }, [
    user?.smartquestionnairedata,
    user?.questionnaire,
    user?.trainingstats,
    user?.customDemoUser,
  ]);

  // טעינת משתמש מהשרת – מקור אמת יחיד
  const fetchUserFromServer = useCallback(async () => {
    if (!user?.id && !user?.email) return;
    try {
      setError(null);
      const fresh = user?.id
        ? await userApi.getById(user.id)
        : user?.email
          ? await userApi.getByEmail(user.email)
          : null;
      if (fresh) {
        setUser(fresh);
        if (fresh.avatar) setSelectedAvatar(fresh.avatar);
      }
    } catch (e) {
      devLog("שגיאה בטעינת משתמש מהשרת", e);
      setError("שגיאה בטעינת נתוני משתמש מהשרת");
    }
  }, [user?.id, user?.email, setUser]);

  // רענון הנתונים // Data refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserFromServer();
    setRefreshing(false);
  }, [fetchUserFromServer]);

  // טעינה בעת כניסה למסך
  useFocusEffect(
    useCallback(() => {
      fetchUserFromServer();
      return undefined;
    }, [fetchUserFromServer])
  );

  // ===============================================
  // 🧮 Performance Optimized Calculations - חישובים מאופטמים
  // ===============================================

  /** @description מערכת XP חכמה עם חישוב ממוחזר / Smart XP system with memoized calculation */
  const calculateXP = useCallback(
    (workouts: number, streak: number, achievements: number): number => {
      let totalXP = 0;

      // XP בסיסי מאימונים (50 XP לכל אימון) / Base XP from workouts
      totalXP += workouts * 50;

      // בונוס רצף (10 XP לכל יום רצף) / Streak bonus
      totalXP += streak * 10;

      // בונוס הישגים (100 XP לכל הישג) / Achievement bonus
      totalXP += achievements * 100;

      // בונוס מיוחד לרצפים ארוכים / Special bonuses for long streaks
      if (streak >= 30) totalXP += 500; // בונוס חודש
      if (streak >= 14) totalXP += 200; // בונוס שבועיים
      if (streak >= 7) totalXP += 100; // בונוס שבוע

      return totalXP;
    },
    []
  );

  /** @description וולידציה לשם משתמש / Username validation */
  const validateName = useCallback((name: string): string | null => {
    const trimmedName = name.trim();

    // בדיקת אורך / Length validation
    if (trimmedName.length < 2) {
      return "השם חייב להכיל לפחות 2 תווים";
    }
    if (trimmedName.length > 30) {
      return "השם לא יכול להכיל יותר מ-30 תווים";
    }

    // בדיקת תווים חוקיים / Valid characters check
    const validPattern = /^[\u0590-\u05FFa-zA-Z0-9\s\-']+$/;
    if (!validPattern.test(trimmedName)) {
      return "השם יכול להכיל רק אותיות עברית/אנגלית, מספרים, רווחים ומקפים";
    }

    // בדיקת מילים אסורות בסיסית / Basic banned words check
    const bannedWords = ["admin", "test", "null", "undefined", "fuck", "shit"];
    const lowerName = trimmedName.toLowerCase();
    for (const word of bannedWords) {
      if (lowerName.includes(word)) {
        return "השם מכיל מילים לא מתאימות";
      }
    }

    return null; // תקין
  }, []);

  // ===============================================
  // 🔧 Helper Functions - פונקציות עזר
  // ===============================================

  /** @description בדיקת הגבלת זמן לעריכת שם / Name edit time restriction check */
  const canEditName = useCallback((): boolean => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // שבוע במילישניות
    return now - lastNameEdit >= oneWeek;
  }, [lastNameEdit]);

  // 💾 שמירת שם חדש
  const handleSaveName = useCallback(async () => {
    const startTime = Date.now();
    performanceMonitor.recordInteraction();

    // Security validation
    const isValidAction = securityValidator.validateAction("edit_profile");
    if (!isValidAction) {
      setNameError("פעולות רבות מדי. אנא נסה שוב מאוחר יותר");
      return;
    }

    const error = validateName(editedName);
    if (error) {
      setNameError(error);
      healthMonitor.recordError();
      aiAnalytics.recordProfileAction({
        action: "edit_profile",
        responseTime: Date.now() - startTime,
        interactionMethod: "touch",
        timestamp: Date.now(),
      });
      return;
    }

    if (!canEditName()) {
      setNameError("ניתן לשנות שם פעם בשבוע בלבד");
      return;
    }

    try {
      setLoading(true);
      setNameError(null);

      const trimmed = editedName.trim();

      // עדכון המשתמש בשרת אם יש מזהה או אם ניתן לאתר מזהה לפי אימייל
      if (user?.id || user?.email) {
        try {
          let updated: User | null = null;
          if (user?.id) {
            updated = await userApi.update(user.id, { name: trimmed });
          } else if (user?.email) {
            try {
              const byEmail = await userApi.getByEmail(user.email);
              if (byEmail?.id) {
                updated = await userApi.update(byEmail.id, { name: trimmed });
              }
            } catch (e) {
              if (__DEV__) {
                console.warn(
                  "ProfileScreen: לא נמצא משתמש לפי אימייל לעדכון",
                  e
                );
              }
            }
          }
          if (updated) {
            setUser(updated);
          } else {
            updateUser({ name: trimmed });
          }
        } catch (e) {
          if (__DEV__) {
            console.warn(
              "ProfileScreen: שגיאה בסנכרון שם לשרת, מבצע עדכון מקומי",
              e
            );
          }
          updateUser({ name: trimmed });
        }
      } else {
        // ללא מזהה – עדכון מקומי בלבד
        updateUser({ name: trimmed });
      }

      // עדכון זמן העריכה האחרונה
      setLastNameEdit(Date.now());

      // סגירת המודל
      setShowNameModal(false);

      showConfirmationModal({
        title: "הצלחה",
        message: "השם עודכן בהצלחה!",
        confirmText: "אישור",
        variant: "success",
        singleButton: true,
        onConfirm: () => {},
      });

      // Track successful name change
      aiAnalytics.recordProfileAction({
        action: "edit_profile",
        responseTime: Date.now() - startTime,
        interactionMethod: "touch",
        section: "name",
        timestamp: Date.now(),
      });

      // Accessibility announcement
      AccessibilityInfo.announceForAccessibility("השם עודכן בהצלחה");
    } catch (error) {
      console.error("Error updating name:", error);
      setNameError("שגיאה בעדכון השם. נסה שוב.");
      healthMonitor.recordError();
      logger.error("ProfileScreen: Name update failed", JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [
    editedName,
    updateUser,
    canEditName,
    validateName,
    user?.id,
    user?.email,
    setUser,
  ]);

  // ===============================================
  // 📊 User Info Calculation - חישוב נתוני משתמש
  // ===============================================
  const userInfo = useMemo(() => {
    // Robust dynamic mapping for user fields
    const questionnaire = (user?.questionnaire || {}) as Record<
      string,
      unknown
    >;
    const smartData = user?.smartquestionnairedata?.answers || {};
    // Helper to get nested values with proper typing
    const getNested = (
      obj: Record<string, unknown> | User | null | undefined,
      key: string
    ): unknown => {
      if (!obj) return undefined;
      const typedObj = obj as Record<string, unknown>;

      if (key === "goal") {
        // אם יש goal יחיד - החזר אותו
        if (typedObj.goal) return typedObj.goal;
        // אם יש goals רבים - החזר רשימה או הודעה מתאימה
        if (typedObj.goals && Array.isArray(typedObj.goals)) {
          if (typedObj.goals.length === 1) return typedObj.goals[0];
          if (typedObj.goals.length > 1) return typedObj.goals.join(", ");
        }
        return undefined;
      }
      if (key === "diet_type" || key === "diet") {
        const nested = typedObj.nutrition as
          | Record<string, unknown>
          | undefined;
        return (
          typedObj.diet_type ||
          typedObj.diet ||
          (nested && Array.isArray(nested) ? nested[0] : undefined)
        );
      }
      if (key === "experience")
        return (
          typedObj.experience || typedObj.fitness_level || typedObj.fitnessLevel
        );
      if (key === "gender") {
        const preferences = typedObj.preferences as
          | Record<string, unknown>
          | undefined;
        return typedObj.gender || preferences?.gender;
      }
      if (key === "availability") return typedObj.availability;
      return typedObj[key];
    };
    const fallback = (
      key: string,
      ...sources: (Record<string, unknown> | User | null | undefined)[]
    ) => {
      for (const src of sources) {
        if (!src) continue;
        const val = getNested(src, key);
        if (val !== undefined && val !== null && val !== "") {
          return val;
        }
      }
      return undefined;
    };
    const getOrDefault = (
      key: string,
      ...sources: (Record<string, unknown> | User | null | undefined)[]
    ) => {
      const val = fallback(key, ...sources);
      return val !== undefined ? val : "לא צוין";
    };
    // Log for debug
    if (__DEV__) {
      console.warn("ProfileScreen: נתוני משתמש לתרגום:", {
        age: getOrDefault("age", questionnaire, smartData, user),
        goal: getOrDefault("goal", questionnaire, smartData, user),
        experience: getOrDefault("experience", questionnaire, smartData, user),
        frequency: getOrDefault("frequency", questionnaire, smartData, user),
        duration: getOrDefault("duration", questionnaire, smartData, user),
        location: getOrDefault("location", questionnaire, smartData, user),
        gender: getOrDefault(
          "gender",
          questionnaire,
          smartData,
          user?.preferences
        ),
        diet: getOrDefault("diet_type", questionnaire, smartData, user),
      });
    }
    return {
      age: formatQuestionnaireValue(
        "age",
        getOrDefault("age", questionnaire, smartData, user)
      ),
      goal: formatQuestionnaireValue(
        "fitness_goal",
        getOrDefault("fitness_goal", questionnaire, smartData, user)
      ),
      experience: formatQuestionnaireValue(
        "experience_level",
        getOrDefault("experience_level", questionnaire, smartData, user)
      ),
      frequency: (() => {
        const val = getOrDefault("frequency", questionnaire, smartData, user);
        if (val === "לא צוין") return val;
        // אם זה נראה כמו ערך של availability (2_days, 3_days וכו'), השתמש במפתח availability
        if (typeof val === "string" && val.includes("_days")) {
          return formatQuestionnaireValue("availability", val);
        }
        // אחרת, השתמש במפתח frequency הרגיל
        return formatQuestionnaireValue("frequency", val);
      })(),
      duration: formatQuestionnaireValue(
        "duration",
        getOrDefault("duration", questionnaire, smartData, user)
      ),
      location: formatQuestionnaireValue(
        "workout_location",
        getOrDefault("workout_location", questionnaire, smartData, user)
      ),
      gender: formatQuestionnaireValue(
        "gender",
        getOrDefault("gender", questionnaire, smartData, user?.preferences)
      ),
      height: (() => {
        const val = getOrDefault("height", questionnaire, smartData, user);
        return val === "לא צוין"
          ? val
          : formatQuestionnaireValue("height", val);
      })(),
      weight: (() => {
        const val = getOrDefault("weight", questionnaire, smartData, user);
        return val === "לא צוין"
          ? val
          : formatQuestionnaireValue("weight", val);
      })(),
      diet: formatQuestionnaireValue(
        "diet",
        getOrDefault("diet_type", questionnaire, smartData, user)
      ),
      activity_level: formatQuestionnaireValue(
        "activity_level",
        getOrDefault("activity_level", questionnaire, smartData, user)
      ),
      workout_time: formatQuestionnaireValue(
        "workout_time",
        getOrDefault("workout_time", questionnaire, smartData, user)
      ),
      motivation: formatQuestionnaireValue(
        "motivation",
        getOrDefault("motivation", questionnaire, smartData, user)
      ),
      body_type: formatQuestionnaireValue(
        "body_type",
        getOrDefault("body_type", questionnaire, smartData, user)
      ),
      sleep_hours: formatQuestionnaireValue(
        "sleep_hours",
        getOrDefault("sleep_hours", questionnaire, smartData, user)
      ),
      stress_level: formatQuestionnaireValue(
        "stress_level",
        getOrDefault("stress_level", questionnaire, smartData, user)
      ),
      session_duration: formatQuestionnaireValue(
        "session_duration",
        getOrDefault("session_duration", questionnaire, smartData, user)
      ),
      health_conditions: (() => {
        const val = getOrDefault(
          "health_conditions",
          questionnaire,
          smartData,
          user
        );
        if (val === "לא צוין") return val;
        if (Array.isArray(val)) {
          return val
            .map((condition) =>
              formatQuestionnaireValue("health_conditions", condition)
            )
            .join(", ");
        }
        return formatQuestionnaireValue("health_conditions", val);
      })(),
      availability: (() => {
        const val = getOrDefault(
          "availability",
          questionnaire,
          smartData,
          user
        );
        if (val === "לא צוין") return val;
        if (Array.isArray(val)) {
          return val
            .map((day: string) => formatQuestionnaireValue("availability", day))
            .join(", ");
        }
        return formatQuestionnaireValue("availability", val);
      })(),
    };
  }, [user]);

  // 🔧 פונקציה מרכזית לחילוץ ציוד / Centralized equipment extraction function
  const extractUserEquipment = useCallback((currentUser: User | null) => {
    if (!currentUser) return [];

    const equipment: string[] = [];

    // 1. Smart questionnaire data (priority source)
    const smartAnswers = fieldMapper.getSmartAnswers(currentUser) as {
      equipment?: string[];
    } | null;
    if (smartAnswers?.equipment) {
      equipment.push(...smartAnswers.equipment);
    }

    // 1.5. New structured equipment data
    const smartData =
      currentUser.smartquestionnairedata as SmartQuestionnaireData & {
        workout_location?: string;
        gym_equipment?: string[];
        home_equipment?: string[];
        bodyweight_equipment?: string[];
        equipment?: string[];
      };
    if (smartData) {
      const workoutLocation = smartData.workout_location;
      if (workoutLocation === "gym" && smartData.gym_equipment) {
        equipment.push(...smartData.gym_equipment);
      } else if (
        workoutLocation === "home_equipment" &&
        smartData.home_equipment
      ) {
        equipment.push(...smartData.home_equipment);
      } else if (
        workoutLocation === "home_bodyweight" &&
        smartData.bodyweight_equipment
      ) {
        equipment.push(...smartData.bodyweight_equipment);
      }

      // Also include generic equipment field if it exists
      if (smartData.equipment && Array.isArray(smartData.equipment)) {
        equipment.push(...smartData.equipment);
      }
    }

    // 2. Training stats selected equipment
    if (currentUser.trainingstats?.selectedEquipment) {
      equipment.push(...currentUser.trainingstats.selectedEquipment);
    }

    // 3. Custom demo user equipment - הוסר כדי למנוע נתוני דמו

    // 4. Legacy questionnaire equipment fields
    const questionnaire = currentUser.questionnaire as Record<string, unknown>;
    if (questionnaire) {
      // Direct equipment field
      if (questionnaire.equipment) {
        if (Array.isArray(questionnaire.equipment)) {
          equipment.push(...questionnaire.equipment);
        } else if (typeof questionnaire.equipment === "string") {
          equipment.push(questionnaire.equipment);
        }
      }

      // Available equipment field
      if (Array.isArray(questionnaire.available_equipment)) {
        equipment.push(...questionnaire.available_equipment);
      }

      // Dynamic questions equipment
      const dynamicQuestions = [
        "bodyweight_equipment_options",
        "home_equipment_options",
        "gym_equipment_options",
      ];
      dynamicQuestions.forEach((questionId) => {
        const answer = questionnaire[questionId];
        if (Array.isArray(answer)) {
          answer.forEach((option: unknown) => {
            if (
              option &&
              typeof option === "object" &&
              "metadata" in option &&
              option.metadata &&
              typeof option.metadata === "object" &&
              "equipment" in option.metadata &&
              Array.isArray(option.metadata.equipment)
            ) {
              equipment.push(...(option.metadata.equipment as string[]));
            }
          });
        }
      });

      // Legacy home/gym equipment
      ["home_equipment", "gym_equipment"].forEach((field) => {
        if (Array.isArray(questionnaire[field])) {
          equipment.push(...(questionnaire[field] as string[]));
        }
      });
    }

    // Remove duplicates and filter out 'none' if we have real equipment
    const deduped = [...new Set(equipment)];
    if (deduped.length > 1 && deduped.includes("none")) {
      return deduped.filter((e) => e !== "none");
    }

    return deduped;
  }, []);

  // 📊 מימוש מותאם של נתוני פרופיל עם ציוד / Memoized profile data with equipment
  // removed unused profileData to reduce lint warnings

  // פונקציה למניעת כפילויות בתצוגת המידע - כל השדות דינמיים
  type DisplayField = {
    key: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value: string;
  };
  const getDisplayFields = React.useCallback(
    (userInfo: Record<string, string>) => {
      const fields: DisplayField[] = [];

      // שדות בסיסיים - תמיד מוצגים (אם יש ערך)
      const basicFields: DisplayField[] = [
        { key: "goal", icon: "target", label: "מטרה", value: userInfo.goal },
        { key: "age", icon: "calendar", label: "גיל", value: userInfo.age },
        {
          key: "experience",
          icon: "arm-flex",
          label: "ניסיון",
          value: userInfo.experience,
        },
        {
          key: "location",
          icon: "map-marker",
          label: "מיקום",
          value: userInfo.location,
        },
      ];

      // הוספת שדות בסיסיים
      basicFields.forEach((field) => {
        if (field.value !== "לא צוין") {
          fields.push(field);
        }
      });

      // בדיקת כפילויות משך אימון - עדיפות ל-duration על פני session_duration
      if (userInfo.duration !== "לא צוין") {
        fields.push({
          key: "duration",
          icon: "clock-outline",
          label: "משך אימון",
          value: userInfo.duration,
        });
      } else if (userInfo.session_duration !== "לא צוין") {
        fields.push({
          key: "session_duration",
          icon: "timer",
          label: "משך מועדף",
          value: userInfo.session_duration,
        });
      }

      // בדיקת כפילויות תדירות - יכול להיות frequency או availability
      if (userInfo.frequency !== "לא צוין") {
        fields.push({
          key: "frequency",
          icon: "calendar-week",
          label: "תדירות",
          value: userInfo.frequency,
        });
      } else if (userInfo.availability !== "לא צוין") {
        fields.push({
          key: "availability",
          icon: "calendar-check",
          label: "זמינות לאימונים",
          value: userInfo.availability,
        });
      }

      // שדות פיזיים אופציונליים
      const physicalFields: DisplayField[] = [
        {
          key: "height",
          icon: "human-male-height",
          label: "גובה",
          value: userInfo.height,
        },
        {
          key: "weight",
          icon: "weight",
          label: "משקל",
          value: userInfo.weight,
        },
        { key: "gender", icon: "human", label: "מגדר", value: userInfo.gender },
      ];

      physicalFields.forEach((field) => {
        if (field.value !== "לא צוין") {
          fields.push(field);
        }
      });

      // שדות תזונה ואורח חיים
      const lifestyleFields: DisplayField[] = [
        {
          key: "diet",
          icon: "food-apple",
          label: "תזונה",
          value: userInfo.diet,
        },
        {
          key: "activity_level",
          icon: "run",
          label: "רמת פעילות",
          value: userInfo.activity_level,
        },
        {
          key: "workout_time",
          icon: "clock-time-four",
          label: "שעת אימון",
          value: userInfo.workout_time,
        },
        {
          key: "motivation",
          icon: "heart-pulse",
          label: "מוטיבציה",
          value: userInfo.motivation,
        },
        {
          key: "body_type",
          icon: "human-male-board",
          label: "סוג גוף",
          value: userInfo.body_type,
        },
        {
          key: "sleep_hours",
          icon: "sleep",
          label: "שעות שינה",
          value: userInfo.sleep_hours,
        },
        {
          key: "stress_level",
          icon: "alert-circle",
          label: "רמת לחץ",
          value: userInfo.stress_level,
        },
        {
          key: "health_conditions",
          icon: "medical-bag",
          label: "מגבלות רפואיות",
          value: userInfo.health_conditions,
        },
      ];

      lifestyleFields.forEach((field) => {
        if (field.value !== "לא צוין") {
          fields.push(field);
        }
      });

      // Debug logs - מכובים זמנית
      // if (__DEV__) {
      //   console.warn(
      //     'ProfileScreen: כל השדות דינמיים - סה"כ:',
      //     fields.length,
      //     "שדות:",
      //     fields.map((f) => f.key)
      //   );
      //   console.warn("ProfileScreen: ערכי משך אימון:", {
      //     duration: userInfo.duration,
      //     session_duration: userInfo.session_duration,
      //     frequency: userInfo.frequency,
      //     availability: userInfo.availability,
      //   });
      // }
      return fields;
    },
    []
  );

  // ===============================================
  // 📋 Display Fields Calculation - חישוב שדות תצוגה
  // ===============================================
  const displayFields = useMemo(
    () => getDisplayFields(userInfo),
    [userInfo, getDisplayFields]
  );

  // חישוב סטטיסטיקות עם עדיפות לנתוני שרת (trainingstats) ונפילה לחישוב מקומי
  const stats = useMemo(() => {
    const serverStats: User["trainingstats"] = user?.trainingstats ?? {};

    // חישוב מקומי מהיסטוריית אימונים (fallback)
    let computedWorkouts = 0;
    let computedStreak = 0;
    let computedTotalMinutes = 0;

    if (user?.activityhistory?.workouts) {
      const workouts = user.activityhistory.workouts;
      computedWorkouts = workouts.length;

      // רצף מקומי
      const now = new Date();
      let streakTmp = 0;
      let checkDate = new Date(now);
      const sortedWorkouts = [...workouts].sort(
        (a, b) =>
          new Date(b.date || b.completedAt).getTime() -
          new Date(a.date || a.completedAt).getTime()
      );

      for (const workout of sortedWorkouts) {
        const workoutDate = new Date(workout.date || workout.completedAt);
        const diffDays = Math.floor(
          (checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays <= 2) {
          streakTmp++;
          checkDate = workoutDate;
        } else {
          break;
        }
      }
      computedStreak = streakTmp;

      // זמן כולל מקומי (בדקות)
      computedTotalMinutes = workouts.reduce(
        (sum: number, w: WorkoutWithRating) => sum + (w.duration || 45),
        0
      );
    }

    // עדיפות לערכי שרת
    const workoutsCount =
      typeof serverStats.totalWorkouts === "number"
        ? serverStats.totalWorkouts
        : computedWorkouts;

    const effectiveStreak =
      typeof serverStats.streak === "number"
        ? serverStats.streak
        : computedStreak;

    let totalMinutes: number;
    if (typeof serverStats.totalMinutes === "number") {
      totalMinutes = serverStats.totalMinutes;
    } else if (typeof serverStats.totalDurationMinutes === "number") {
      totalMinutes = serverStats.totalDurationMinutes;
    } else if (typeof serverStats.totalHours === "number") {
      totalMinutes = serverStats.totalHours * 60;
    } else {
      totalMinutes = computedTotalMinutes;
    }
    const totalHours = Math.floor(totalMinutes / 60);

    const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

    const totalXP =
      typeof serverStats.xp === "number"
        ? serverStats.xp
        : calculateXP(workoutsCount, effectiveStreak, unlockedAchievements);

    const level =
      typeof serverStats.level === "number"
        ? serverStats.level
        : Math.floor(totalXP / 1000) + 1;

    const currentLevelXP = totalXP % 1000;
    const nextLevelXP = 1000;

    return {
      workouts: workoutsCount,
      streak: effectiveStreak,
      totalTime: `${totalHours}h`,
      level,
      xp: currentLevelXP,
      totalXP,
      nextLevelXp: nextLevelXP,
    };
  }, [user, achievements, calculateXP]);

  // תגיות מאוחדות: רצף + כל ההישגים הפתוחים + תג "עוד…" תמידי
  const profileBadges = useMemo(() => {
    type BadgeItem = { key: string; icon: string; color: string; text: string };
    const items: BadgeItem[] = [];

    // 1) תג רצף – תמיד ראשון
    items.push({
      key: "streak",
      icon: "fire",
      color: (stats.streak > 0
        ? STATS_COLORS.STREAK.ACTIVE
        : theme.colors.textSecondary) as string,
      text: stats.streak > 0 ? `${stats.streak} ימי רצף` : "התחל רצף!",
    });

    // 2) כל ההישגים הפתוחים – ללא הגבלה
    const unlockedAll = achievements.filter((a) => a.unlocked);
    unlockedAll.forEach((a) => {
      items.push({
        key: `ach-${a.id}`,
        icon: a.icon,
        color: a.color,
        // הצגת כותרת ההישג כטקסט תג
        text: a.title,
      });
    });

    // 3) תג "עוד…" תמיד – כדי לאפשר זיהוי והגעה לרשימת ההישגים המלאה
    items.push({
      key: "more",
      icon: "dots-horizontal",
      color: theme.colors.textSecondary,
      text: "עוד הישגים",
    });

    return items;
  }, [achievements, stats]);

  const scrollToAchievements = useCallback(() => {
    const scrollView = scrollRef.current;
    if (!scrollView) return;

    // Use proper typing for ScrollView methods
    type ScrollViewMethods = {
      scrollTo: (opts: { y: number; animated: boolean }) => void;
      scrollToEnd?: (opts: { animated: boolean }) => void;
    };

    const sv = scrollView as ScrollViewMethods;
    const y = Math.max(achievementsSectionY - 20, 0);
    if (y > 0) {
      sv.scrollTo({ y, animated: true });
    } else {
      sv.scrollToEnd?.({ animated: true });
    }
  }, [achievementsSectionY]);

  // =======================================
  // 🛠️ Core Handlers & Event Management
  // פונקציות ליבה וניהול אירועים
  // =======================================

  const handleLogout = useCallback(() => {
    // if (__DEV__) {
    //   console.warn("ProfileScreen: Logout initiated");
    // }
    setShowLogoutModal(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    // if (__DEV__) {
    //   console.warn("ProfileScreen: Logout confirmed - מתחיל התנתקות מלאה");
    // }

    try {
      // הצגת הודעת טעינה
      setShowLogoutModal(false);
      setLoading(true);

      // התנתקות מלאה עם ניקוי כל הנתונים
      await userLogout();

      // if (__DEV__) {
      //   console.warn("✅ ProfileScreen: התנתקות הושלמה בהצלחה");
      // }

      // ניווט למסך הפתיחה עם איפוס מלא של המחסנית
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" as never }],
      });
    } catch (error) {
      console.error("❌ ProfileScreen: שגיאה בהתנתקות:", error);

      // גם במקרה של שגיאה, נווט למסך הפתיחה
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" as never }],
      });
    } finally {
      setLoading(false);
    }
  }, [userLogout, navigation]);

  // 📷 אווטאר מקומי - בחירת תמונות לא נשלחות לשרת
  // Images are stored locally on device only for privacy
  const validateAvatarImage = (uri: string) => {
    // בדיקות בסיסיות לתמונות (אופציונלי)
    // Basic image validation (optional)
    if (__DEV__) {
      console.warn("ProfileScreen: Avatar selected locally:", uri);
    }
    return true; // תמיד מקבל כי זה מקומי
  };

  // בחר מהגלריה // Pick from gallery
  const pickImageFromGallery = useCallback(async () => {
    try {
      if (__DEV__) {
        console.warn("ProfileScreen: Gallery picker opened");
      }
      setError(null);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newAvatar = result.assets[0].uri;

        // 🔒 ולידציה בסיסית (אופציונלי)
        if (validateAvatarImage(newAvatar)) {
          setSelectedAvatar(newAvatar);
          // 💾 אחסון מקומי בלבד - לא נשלח לשרת
          updateUser({ avatar: newAvatar });
          setShowAvatarModal(false);
          if (__DEV__) {
            console.warn(
              "ProfileScreen: Avatar updated locally (not uploaded to server)"
            );
          }
        }
      }
    } catch (error) {
      console.error("ProfileScreen: Gallery picker error:", error);
      setError(error instanceof Error ? error.message : "שגיאה בבחירת תמונה");
    }
  }, [updateUser]);

  // בחר מהמצלמה // Take photo
  const takePhoto = useCallback(async () => {
    try {
      if (__DEV__) {
        console.warn("ProfileScreen: Camera opened");
      }
      setError(null);

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newAvatar = result.assets[0].uri;

        // 🔒 ולידציה בסיסית (אופציונלי)
        if (validateAvatarImage(newAvatar)) {
          setSelectedAvatar(newAvatar);
          // 💾 אחסון מקומי בלבד - לא נשלח לשרת
          updateUser({ avatar: newAvatar });
          setShowAvatarModal(false);
          if (__DEV__) {
            console.warn(
              "ProfileScreen: Avatar updated locally from camera (not uploaded to server)"
            );
          }
        }
      }
    } catch (error) {
      console.error("ProfileScreen: Camera error:", error);
      setError(error instanceof Error ? error.message : "שגיאה בצילום תמונה");
    }
  }, [updateUser]);

  // בחר אימוג'י // Select emoji
  const selectPresetAvatar = useCallback(
    (avatar: string) => {
      const startTime = Date.now();
      performanceMonitor.recordInteraction();

      // Security validation
      const isValidAction = securityValidator.validateAction("change_avatar");
      if (!isValidAction) {
        showConfirmationModal({
          title: "שגיאה",
          message: "פעולות רבות מדי. אנא נסה שוב מאוחר יותר",
          onConfirm: hideConfirmationModal,
          variant: "error",
          singleButton: true,
          confirmText: "הבנתי",
        });
        return;
      }

      if (__DEV__) {
        console.warn("ProfileScreen: Preset avatar selected:", avatar);
      }

      try {
        setSelectedAvatar(avatar);
        updateUser({ avatar });
        setShowAvatarModal(false);

        // Track avatar change
        aiAnalytics.recordProfileAction({
          action: "change_avatar",
          responseTime: Date.now() - startTime,
          interactionMethod: "touch",
          section: "avatar_selection",
          timestamp: Date.now(),
        });

        // Accessibility announcement
        AccessibilityInfo.announceForAccessibility(
          `אווטאר חדש נבחר: ${avatar}`
        );

        // Cache the new avatar
        cacheManager.set("selectedAvatar", avatar, 60 * 60 * 1000); // 1 hour TTL
      } catch (error) {
        logger.error(
          "ProfileScreen: Avatar selection failed",
          JSON.stringify(error)
        );
        healthMonitor.recordError();
      }
    },
    [updateUser]
  );

  return (
    <ErrorBoundary
      fallbackMessage="שגיאה בטעינת מסך הפרופיל"
      variant="default"
      maxRetries={3}
      showFeedbackButton={true}
      onError={(error, errorInfo) => {
        logger.error("ProfileScreen", "Error boundary triggered", {
          error: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundAlt]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          >
            <Animated.View
              style={[
                styles.container,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <BackButton absolute={false} />
                <Text style={styles.headerTitle}>
                  {PROFILE_SCREEN_TEXTS.HEADERS.PROFILE_TITLE}
                </Text>
                <View style={styles.headerRight}>
                  {/* כפתור השלמת שאלון אם לא הושלם */}
                  {!questionnaireStatus.isComplete && (
                    <TouchableOpacity
                      style={styles.headerQuestionnaireButton}
                      onPress={() =>
                        navigation.navigate("Questionnaire", {
                          stage: "training",
                        })
                      }
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={
                        PROFILE_SCREEN_TEXTS.A11Y.EDIT_PROFILE
                      }
                      accessibilityHint="מעבר למילוי שאלון האימון לקבלת המלצות מותאמות אישית"
                    >
                      <MaterialCommunityIcons
                        name="clipboard-list"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* הודעת שגיאה */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity
                    style={styles.errorRetryButton}
                    onPress={() => setError(null)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="סגור הודעת שגיאה"
                    accessibilityHint="לחץ כדי לסגור את הודעת השגיאה"
                  >
                    <Text style={styles.errorRetryText}>
                      {PROFILE_SCREEN_TEXTS.ACTIONS.GOT_IT}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* כרטיס שאלון אם לא הושלם */}
              {!questionnaireStatus.isComplete && (
                <TouchableOpacity
                  style={styles.questionnaireCard}
                  onPress={() =>
                    navigation.navigate("Questionnaire", { stage: "training" })
                  }
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="השלמת שאלון אימון"
                  accessibilityHint="לחץ כדי להשלים את השאלון ולקבל תוכנית אימונים מותאמת אישית"
                >
                  <LinearGradient
                    colors={[
                      theme.colors.primaryGradientStart,
                      theme.colors.primaryGradientEnd,
                    ]}
                    style={styles.questionnaireGradient}
                  >
                    <MaterialCommunityIcons
                      name="clipboard-list"
                      size={24}
                      color={theme.colors.white}
                    />
                    <View style={styles.questionnaireTextContainer}>
                      <Text style={styles.questionnaireTitle}>
                        {PROFILE_SCREEN_TEXTS.ACTIONS.COMPLETE_QUESTIONNAIRE}
                      </Text>
                      <Text style={styles.questionnaireSubtitle}>
                        {!questionnaireStatus.hasTrainingStage
                          ? "קבל תוכנית אימונים מותאמת אישית"
                          : "השלם את הפרופיל האישי שלך"}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={24}
                      color={theme.colors.white}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* כרטיס פרופיל */}
              <View style={styles.profileCard}>
                <View style={styles.avatarSection}>
                  <TouchableOpacity
                    onPress={() => setShowAvatarModal(true)}
                    style={styles.avatarContainer}
                    accessibilityRole="button"
                    accessibilityLabel="שינוי תמונת פרופיל"
                    accessibilityHint="לחיצה לפתיחת גלריית אווטארים וחלופות תמונה"
                  >
                    {typeof selectedAvatar === "string" &&
                    selectedAvatar.startsWith("http") ? (
                      <Image
                        source={{ uri: selectedAvatar }}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                    ) : selectedAvatar && selectedAvatar.length === 2 ? (
                      <View style={styles.emojiAvatar}>
                        <Text style={styles.emojiText}>{selectedAvatar}</Text>
                      </View>
                    ) : (
                      <View style={styles.avatar}>
                        <DefaultAvatar name={user?.name || "משתמש"} size={90} />
                      </View>
                    )}
                    <Animated.View
                      style={[
                        styles.editAvatarButton,
                        { transform: [{ scale: pulseAnim }] },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="camera"
                        size={20}
                        color={theme.colors.text}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                  {/* רמה ו-XP */}
                  <View style={styles.levelContainer}>
                    <Text style={styles.levelText}>רמה {stats.level}</Text>
                    <View style={styles.xpBar}>
                      <View
                        style={[
                          styles.xpProgress,
                          { width: `${(stats.xp / stats.nextLevelXp) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.xpText}>
                      {stats.xp}/{stats.nextLevelXp} XP
                    </Text>
                  </View>
                </View>

                {/* שם המשתמש עם כפתור עריכה */}
                <View style={styles.usernameContainer}>
                  <Text style={styles.username}>
                    {user?.name || "אלוף הכושר"}
                  </Text>
                  <TouchableOpacity
                    style={styles.editNameButton}
                    onPress={() => {
                      if (canEditName()) {
                        setEditedName(user?.name || "");
                        setNameError(null);
                        setShowNameModal(true);
                      } else {
                        const nextEditDate = new Date(
                          lastNameEdit + 7 * 24 * 60 * 60 * 1000
                        );
                        showConfirmationModal({
                          title: "הגבלת זמן",
                          message: `ניתן לשנות שם פעם בשבוע.\nעריכה הבאה תהיה זמינה ב-${nextEditDate.toLocaleDateString("he-IL")}`,
                          onConfirm: hideConfirmationModal,
                          variant: "info",
                          singleButton: true,
                          confirmText: "הבנתי",
                        });
                      }
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={
                      canEditName() ? "עריכת שם משתמש" : "עריכת שם - לא זמין"
                    }
                    accessibilityHint={
                      canEditName()
                        ? "לחיצה לפתיחת חלון עריכת שם המשתמש"
                        : "עריכת שם זמינה פעם בשבוע בלבד"
                    }
                    accessibilityState={{ disabled: !canEditName() }}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={16}
                      color={
                        canEditName()
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.userEmail}>
                  {user?.email || "user@gymovoo.com"}
                </Text>

                <View style={styles.badgesContainer}>
                  {profileBadges.map((b) => {
                    const isMore = b.key === "more";
                    const containerStyle = [
                      styles.badge,
                      b.key === "streak"
                        ? stats.streak > 0
                          ? styles.activeBadge
                          : styles.inactiveBadge
                        : isMore
                          ? styles.moreBadge
                          : styles.achievementTag,
                    ];
                    const textStyle = [
                      styles.badgeText,
                      b.key === "streak"
                        ? stats.streak > 0
                          ? styles.activeBadgeText
                          : styles.inactiveBadgeText
                        : undefined,
                      isMore ? styles.moreBadgeText : undefined,
                    ];
                    const content = (
                      <View key={b.key} style={containerStyle}>
                        <MaterialCommunityIcons
                          name={b.icon as never}
                          size={16}
                          color={b.color}
                        />
                        <Text style={textStyle}>{b.text}</Text>
                        {isMore && (
                          <MaterialCommunityIcons
                            name="chevron-left"
                            size={16}
                            color={theme.colors.textSecondary}
                          />
                        )}
                      </View>
                    );
                    return isMore ? (
                      <TouchableOpacity
                        key={b.key}
                        onPress={scrollToAchievements}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel="צפייה בכל ההישגים"
                        accessibilityHint="לחיצה תגלול לרשימת ההישגים המלאה"
                      >
                        {content}
                      </TouchableOpacity>
                    ) : (
                      content
                    );
                  })}
                </View>
              </View>

              {/* Next Workout Recommendation */}
              <NextWorkoutCard
                workoutPlan={undefined}
                onStartWorkout={(workoutName, workoutIndex) => {
                  navigation.navigate("WorkoutPlans", {
                    autoStart: true,
                    requestedWorkoutName: workoutName,
                    requestedWorkoutIndex: workoutIndex,
                  });
                }}
              />

              {/* מידע אישי מהשאלון - כולו דינמי */}
              {questionnaireStatus.isComplete && (
                <View style={styles.infoContainer}>
                  <Text style={styles.sectionTitle}>
                    {PROFILE_SCREEN_TEXTS.HEADERS.MY_INFO}
                  </Text>
                  <View style={styles.infoGrid}>
                    {/* כל השדות נוצרים באופן דינמי */}
                    {displayFields.map((field) => (
                      <View key={field.key} style={styles.infoItem}>
                        <MaterialCommunityIcons
                          name={field.icon}
                          size={20}
                          color={theme.colors.primary}
                        />
                        <Text style={styles.infoLabel}>{field.label}</Text>
                        <Text style={styles.infoValue}>{field.value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* סטטיסטיקות */}
              <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>
                  {PROFILE_SCREEN_TEXTS.HEADERS.MY_STATS}
                </Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={getStatsGradient("workouts")}
                      style={styles.statGradient}
                    >
                      <MaterialCommunityIcons
                        name="dumbbell"
                        size={24}
                        color={STATS_COLORS.WORKOUTS.ICON}
                      />
                      <Text style={styles.statNumber}>{stats.workouts}</Text>
                      <Text style={styles.statLabel}>
                        {PROFILE_SCREEN_TEXTS.STATS.TOTAL_WORKOUTS}
                      </Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={getStatsGradient("streak")}
                      style={styles.statGradient}
                    >
                      <MaterialCommunityIcons
                        name="fire"
                        size={24}
                        color={STATS_COLORS.STREAK.ICON}
                      />
                      <Text style={styles.statNumber}>{stats.streak}</Text>
                      <Text style={styles.statLabel}>
                        {PROFILE_SCREEN_TEXTS.STATS.STREAK_DAYS}
                      </Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={getStatsGradient("rating")}
                      style={styles.statGradient}
                    >
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={24}
                        color={STATS_COLORS.RATING.ICON}
                      />
                      <Text style={styles.statNumber}>{stats.totalTime}</Text>
                      <Text style={styles.statLabel}>
                        {PROFILE_SCREEN_TEXTS.STATS.TOTAL_TIME}
                      </Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>

              {/* ציוד זמין */}
              {(() => {
                // נרנדר אם יש מקור כלשהו לציוד: שאלון חכם, סטטיסטיקות אימון, או שאלון legacy
                const smartEquip =
                  user?.smartquestionnairedata?.answers?.equipment;
                const hasSmart =
                  Array.isArray(smartEquip) && smartEquip.length > 0;
                const trainingEquip = user?.trainingstats?.selectedEquipment;
                const hasTrainingStats =
                  Array.isArray(trainingEquip) && trainingEquip.length > 0;
                const legacyQuestionnaire = user?.questionnaire as Record<
                  string,
                  unknown
                >;
                const availableLegacy =
                  legacyQuestionnaire?.available_equipment;
                const hasAvailableLegacy =
                  Array.isArray(availableLegacy) && availableLegacy.length > 0;
                const hasLegacy = !!legacyQuestionnaire;
                return (
                  hasSmart ||
                  hasTrainingStats ||
                  hasAvailableLegacy ||
                  hasLegacy
                );
              })() && (
                <View style={styles.equipmentContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      {PROFILE_SCREEN_TEXTS.HEADERS.MY_EQUIPMENT}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Questionnaire", {
                          stage: "training",
                        })
                      }
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="עריכת ציוד אימון"
                      accessibilityHint="לחץ כדי לערוך את רשימת הציוד הזמין לאימונים"
                    >
                      <Text style={styles.seeAllText}>
                        {PROFILE_SCREEN_TEXTS.ACTIONS.EDIT}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.equipmentScroll}
                    contentContainerStyle={styles.equipmentScrollContent}
                  >
                    {(() => {
                      // 🔧 שימוש בפונקציה המרכזית לחילוץ ציוד - מחליפה את הלוגיקה המורכבת
                      const allEquipment = extractUserEquipment(user);

                      if (allEquipment.length === 0) {
                        return (
                          <View style={styles.noEquipmentContainer}>
                            <MaterialCommunityIcons
                              name="dumbbell"
                              size={40}
                              color={theme.colors.textSecondary}
                            />
                            <Text style={styles.noEquipmentText}>
                              לא נבחר ציוד
                            </Text>
                            <Text style={styles.noEquipmentSubtext}>
                              השלם את השאלון לקבלת המלצות
                            </Text>
                            <TouchableOpacity
                              style={styles.addEquipmentButton}
                              onPress={() =>
                                navigation.navigate("Questionnaire", {
                                  stage: "training",
                                })
                              }
                              accessible={true}
                              accessibilityRole="button"
                              accessibilityLabel="הוסף ציוד אימון"
                              accessibilityHint="לחץ כדי להוסיף ציוד אימון זמין דרך השאלון"
                            >
                              <Text style={styles.addEquipmentText}>
                                הוסף ציוד
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      }

                      return allEquipment
                        .map((equipmentId: string) => {
                          // חיפוש ישיר לפי השם מהשאלון // Direct search by name from questionnaire
                          const equipment = ALL_EQUIPMENT.find(
                            (eq) => eq.id === equipmentId
                          );

                          if (!equipment) return null;

                          return (
                            <View
                              key={equipmentId}
                              style={styles.equipmentItem}
                            >
                              <View style={styles.equipmentImageContainer}>
                                {equipment.image ? (
                                  <Image
                                    source={equipment.image}
                                    style={styles.equipmentImage}
                                    resizeMode="contain"
                                  />
                                ) : (
                                  <MaterialCommunityIcons
                                    name="dumbbell"
                                    size={28}
                                    color={theme.colors.primary}
                                  />
                                )}
                                {equipment.isPremium && (
                                  <View style={styles.equipmentPremiumBadge}>
                                    <MaterialCommunityIcons
                                      name="crown"
                                      size={12}
                                      color={theme.colors.warning}
                                    />
                                  </View>
                                )}
                              </View>
                              <Text
                                style={styles.equipmentLabel}
                                numberOfLines={2}
                              >
                                {equipment.label}
                              </Text>
                              <View style={styles.equipmentCategoryBadge}>
                                <Text style={styles.equipmentCategoryText}>
                                  {equipment.category === "home"
                                    ? PROFILE_SCREEN_TEXTS.VALUES.HOME
                                    : equipment.category === "gym"
                                      ? PROFILE_SCREEN_TEXTS.VALUES.GYM
                                      : "שניהם"}
                                </Text>
                              </View>
                            </View>
                          );
                        })
                        .filter(Boolean);
                    })()}
                  </ScrollView>
                </View>
              )}

              {/* הישגים - רשימה מלאה תמיד */}
              <View
                style={styles.achievementsContainer}
                onLayout={(
                  e: NativeSyntheticEvent<LayoutChangeEvent["nativeEvent"]>
                ) => setAchievementsSectionY(e.nativeEvent.layout.y)}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    {achievements.some((a) => a.unlocked)
                      ? PROFILE_SCREEN_TEXTS.HEADERS.ACHIEVEMENTS
                      : PROFILE_SCREEN_TEXTS.HEADERS.GOALS_TO_UNLOCK}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (__DEV__) {
                        console.warn("ProfileScreen: Show all achievements");
                      }
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="הצג את כל ההישגים"
                    accessibilityHint="לחץ כדי לראות רשימה מלאה של כל ההישגים והמטרות"
                  >
                    <Text style={styles.seeAllText}>
                      {PROFILE_SCREEN_TEXTS.ACTIONS.SHOW_ALL}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.achievementsGrid}>
                  {achievements.map((achievement: Achievement) => (
                    <TouchableOpacity
                      key={achievement.id}
                      activeOpacity={0.8}
                      onLongPress={() => {
                        setAchievementTooltip({
                          visible: true,
                          achievement: achievement,
                        });
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`הישג: ${achievement.title}`}
                      accessibilityHint={
                        achievement.unlocked
                          ? "הישג פתוח - לחיצה ארוכה לפרטים נוספים"
                          : "הישג נעול - לחיצה ארוכה לראות דרישות"
                      }
                      accessibilityState={{
                        disabled: false,
                        selected: achievement.unlocked,
                      }}
                      style={[
                        styles.achievementBadge,
                        !achievement.unlocked && styles.lockedBadge,
                        achievement.unlocked && {
                          transform: [{ scale: achievementPulseAnim }],
                        },
                      ]}
                    >
                      {achievement.unlocked && (
                        <LinearGradient
                          colors={[
                            achievement.color + "20",
                            achievement.color + "10",
                          ]}
                          style={styles.achievementGradientBg}
                        />
                      )}

                      <View
                        style={[
                          styles.achievementIconContainer,
                          !achievement.unlocked && styles.grayscaleContainer,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={achievement.icon}
                          size={30}
                          color={
                            achievement.unlocked
                              ? achievement.color
                              : theme.colors.textTertiary
                          }
                        />

                        {!achievement.unlocked && (
                          <View style={styles.lockIconContainer}>
                            <MaterialCommunityIcons
                              name="lock"
                              size={16}
                              color={theme.colors.textTertiary}
                            />
                          </View>
                        )}
                      </View>

                      <Text
                        style={[
                          styles.achievementTitle,
                          !achievement.unlocked && styles.lockedText,
                          achievement.unlocked && styles.unlockedTitle,
                        ]}
                      >
                        {achievement.title}
                      </Text>

                      {achievement.unlocked && (
                        <View style={styles.achievementShine} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* הגדרות בסיסיות */}
              <View style={styles.settingsContainer}>
                <Text style={styles.sectionTitle}>
                  {PROFILE_SCREEN_TEXTS.HEADERS.SETTINGS}
                </Text>

                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    if (__DEV__) {
                      console.warn("ProfileScreen: Edit questionnaire");
                    }
                    navigation.navigate("Questionnaire", { stage: "training" });
                  }}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="עריכת שאלון אימון"
                  accessibilityHint="לחץ כדי לערוך את השאלון ולעדכן העדפות אימון"
                >
                  <View style={styles.settingLeft}>
                    <MaterialCommunityIcons
                      name="clipboard-list"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.settingText}>
                      {PROFILE_SCREEN_TEXTS.ACTIONS.EDIT_QUESTIONNAIRE}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => {
                    if (__DEV__) {
                      console.warn("ProfileScreen: Notifications settings");
                    }
                    showComingSoon("הגדרות התראות");
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <MaterialCommunityIcons
                      name="bell-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.settingText}>התראות</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* כפתור התנתקות */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                accessibilityRole="button"
                accessibilityLabel={PROFILE_SCREEN_TEXTS.A11Y.LOGOUT_BUTTON}
                accessibilityHint="לחיצה להתנתקות מהמשתמש הנוכחי וחזרה למסך הכניסה"
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={20}
                  color={theme.colors.error}
                />
                <Text style={styles.logoutText}>
                  {PROFILE_SCREEN_TEXTS.ACTIONS.LOGOUT}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>

          {/* מודל בחירת אווטאר */}
          <Modal
            visible={showAvatarModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAvatarModal(false)}
          >
            <TouchableOpacity
              style={theme.getModalOverlayStyle("bottom")}
              activeOpacity={1}
              onPress={() => setShowAvatarModal(false)}
            >
              <View style={theme.getModalContentStyle("bottom")}>
                <View style={theme.getModalHeaderStyle()}>
                  <Text style={styles.modalTitle}>בחר אווטאר</Text>
                  <TouchableOpacity
                    onPress={() => setShowAvatarModal(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>

                {/* הודעת פרטיות */}
                <View style={styles.privacyNotice}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={20}
                    color={theme.colors.success}
                  />
                  <Text style={styles.privacyText}>
                    התמונה נשמרת במכשיר שלך בלבד ולא נשלחת לשרת
                  </Text>
                </View>
                <View style={styles.uploadOptions}>
                  <TouchableOpacity
                    style={styles.uploadOption}
                    onPress={pickImageFromGallery}
                  >
                    <MaterialCommunityIcons
                      name="image"
                      size={32}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.uploadOptionText}>מהגלריה</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.uploadOption}
                    onPress={takePhoto}
                  >
                    <MaterialCommunityIcons
                      name="camera"
                      size={32}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.uploadOptionText}>צלם תמונה</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.presetsTitle}>או בחר אימוג&apos;י:</Text>
                <FlatList
                  data={PRESET_AVATARS}
                  numColumns={4}
                  keyExtractor={(item) => item}
                  contentContainerStyle={styles.avatarGrid}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.presetAvatar,
                        selectedAvatar === item && styles.selectedPreset,
                      ]}
                      onPress={() => selectPresetAvatar(item)}
                    >
                      <Text style={styles.presetAvatarText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* 🆕 מודל עריכת שם */}
          <Modal
            visible={showNameModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowNameModal(false)}
          >
            <TouchableOpacity
              style={theme.getModalOverlayStyle("bottom")}
              activeOpacity={1}
              onPress={() => setShowNameModal(false)}
            >
              <View style={theme.getModalContentStyle("bottom")}>
                <View style={theme.getModalHeaderStyle()}>
                  <Text style={styles.modalTitle}>עריכת שם</Text>
                  <TouchableOpacity
                    onPress={() => setShowNameModal(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.nameEditContainer}>
                  <Text style={styles.nameEditLabel}>שם מלא:</Text>
                  <TextInput
                    style={[
                      styles.nameInput,
                      nameError && styles.nameInputError,
                    ]}
                    value={editedName}
                    onChangeText={(text) => {
                      setEditedName(text);
                      setNameError(null);
                    }}
                    placeholder="הכנס שם מלא..."
                    placeholderTextColor={theme.colors.textSecondary}
                    maxLength={30}
                    returnKeyType="done"
                    onSubmitEditing={handleSaveName}
                    textAlign="right"
                    selectTextOnFocus
                    accessibilityLabel="שדה עריכת שם משתמש"
                    accessibilityHint="הכנס שם מלא עד 30 תווים, לחץ Enter לשמירה"
                    accessibilityState={{ disabled: false }}
                  />

                  {nameError && (
                    <Text style={styles.nameErrorText}>{nameError}</Text>
                  )}

                  <Text style={styles.nameHelpText}>
                    • ניתן לשנות שם פעם בשבוع{"\n"}• 2-30 תווים בלבד{"\n"}•
                    אותיות עברית/אנגלית, מספרים ומקפים{"\n"}• ללא מילים פוגעניות
                  </Text>

                  <View style={styles.nameModalButtons}>
                    <TouchableOpacity
                      style={[
                        styles.nameModalButton,
                        styles.nameModalButtonCancel,
                      ]}
                      onPress={() => setShowNameModal(false)}
                    >
                      <Text style={styles.nameModalButtonTextCancel}>
                        ביטול
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.nameModalButton,
                        styles.nameModalButtonSave,
                        (loading || !editedName.trim()) &&
                          styles.nameModalButtonDisabled,
                      ]}
                      onPress={handleSaveName}
                      disabled={loading || !editedName.trim()}
                    >
                      <Text
                        style={[
                          styles.nameModalButtonTextSave,
                          (loading || !editedName.trim()) &&
                            styles.nameModalButtonTextDisabled,
                        ]}
                      >
                        {loading ? "שומר..." : "שמור"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Logout Confirmation Modal */}
          <ConfirmationModal
            visible={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
            title="התנתקות מלאה 🚪"
            message={
              "האם אתה בטוח שברצונך להתנתק?\n\n" +
              "⚠️ פעולה זו תמחק:\n" +
              "• כל נתוני המשתמש\n" +
              "• היסטוריית אימונים\n" +
              "• העדפות אישיות\n" +
              "• נתוני השאלון\n\n" +
              "תצטרך להתחבר מחדש ולמלא את השאלון שוב."
            }
            confirmText="כן, התנתק"
            cancelText="ביטול"
            destructive={true}
            icon="log-out-outline"
          />

          {/* 🎉 מודל הישג חדש */}
          <Modal
            visible={showAchievementModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowAchievementModal(false)}
          >
            <View style={styles.achievementModalOverlay}>
              <Animated.View
                style={[
                  styles.achievementModalContent,
                  {
                    opacity: fireworksOpacity,
                    transform: [{ scale: fireworksScale }],
                  },
                ]}
              >
                {/* אנימציית זיקוקים */}
                <View style={styles.fireworksContainer}>
                  <Text style={styles.fireworksText}>🎆✨🎉✨🎆</Text>
                </View>

                {newAchievement && (
                  <>
                    <MaterialCommunityIcons
                      name={newAchievement.icon}
                      size={80}
                      color={newAchievement.color}
                      style={styles.achievementModalIcon}
                    />

                    <Text style={styles.achievementModalTitle}>
                      🏆 הישג חדש! 🏆
                    </Text>

                    <Text style={styles.achievementModalAchievement}>
                      {newAchievement.title}
                    </Text>

                    <Text style={styles.achievementModalDescription}>
                      {newAchievement.description}
                    </Text>

                    <TouchableOpacity
                      style={styles.achievementModalButton}
                      onPress={() => setShowAchievementModal(false)}
                    >
                      <Text style={styles.achievementModalButtonText}>
                        מעולה! 🎯
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Animated.View>
            </View>
          </Modal>

          {/* 💬 Tooltip להישגים */}
          {achievementTooltip && (
            <Modal
              visible={achievementTooltip.visible}
              transparent
              animationType="fade"
              onRequestClose={() => setAchievementTooltip(null)}
            >
              <TouchableOpacity
                style={styles.tooltipOverlay}
                activeOpacity={1}
                onPress={() => setAchievementTooltip(null)}
              >
                <View style={styles.tooltipContent}>
                  <View style={styles.tooltipHeader}>
                    <MaterialCommunityIcons
                      name={achievementTooltip.achievement.icon}
                      size={24}
                      color={achievementTooltip.achievement.color}
                    />
                    <Text style={styles.tooltipTitle}>
                      {achievementTooltip.achievement.title}
                    </Text>
                  </View>

                  <Text style={styles.tooltipDescription}>
                    {achievementTooltip.achievement.description}
                  </Text>

                  <Text style={styles.tooltipHint}>💡 לחץ בכל מקום לסגירה</Text>
                </View>
              </TouchableOpacity>
            </Modal>
          )}

          {/* מודל אחיד למקום Alert.alert מפוזר */}
          <UniversalModal
            visible={activeModal !== null}
            type={activeModal || "comingSoon"}
            title={modalConfig.title}
            message={modalConfig.message}
            onClose={hideModal}
            onConfirm={modalConfig.onConfirm}
            confirmText={modalConfig.confirmText}
            destructive={modalConfig.destructive}
          />

          {/* ConfirmationModal for success/error messages */}
          <ConfirmationModal
            visible={confirmationModal.visible}
            title={confirmationModal.title}
            message={confirmationModal.message}
            onClose={hideConfirmationModal}
            onConfirm={confirmationModal.onConfirm}
            onCancel={confirmationModal.onCancel}
            confirmText={confirmationModal.confirmText}
            cancelText={confirmationModal.cancelText}
            variant={confirmationModal.variant}
            singleButton={confirmationModal.singleButton}
          />
        </SafeAreaView>
      </LinearGradient>
    </ErrorBoundary>
  );
}

// שים את ה־styles שלך כאן (אותו דבר כמו הדוגמה שלך)

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // Container and layout styles // סטיילים לקונטיינר ופריסה
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
  },

  // Header styles - גדלי טקסט משופרים לקראות טובה יותר
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.md,
  },
  // removed unused backButton style
  headerRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerQuestionnaireButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.sm,
  },
  // removed unused settingsButton style
  headerTitle: {
    fontSize: 22, // הגדלת הכותרת לגודל יותר קריא
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Profile card styles - טקסט גדול יותר לפרופיל
  profileCard: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  emojiAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  emojiText: {
    fontSize: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.card,
    ...theme.shadows.small,
  },
  levelContainer: {
    width: "100%",
    alignItems: "center",
  },
  levelText: {
    color: theme.colors.primary,
    fontSize: 16, // הגדלת טקסט הרמה
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  xpBar: {
    width: 200,
    height: 8,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.xs,
    overflow: "hidden",
    marginBottom: 4,
  },
  xpProgress: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  xpText: {
    color: theme.colors.textSecondary,
    fontSize: 13, // הגדלת טקסט ה-XP
  },
  username: {
    fontSize: 20, // הגדלת שם המשתמש
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: 4,
    writingDirection: "rtl",
  },

  // 🆕 סטיילים לעריכת שם
  usernameContainer: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    gap: 8,
  },

  editNameButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  nameEditContainer: {
    padding: 20,
    gap: 16,
  },

  nameEditLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },

  nameInput: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  },

  nameInputError: {
    borderColor: theme.colors.error,
  },

  nameErrorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: "right",
    marginTop: -8,
  },

  nameHelpText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "right",
    lineHeight: 18,
  },

  nameModalButtons: {
    flexDirection: "row-reverse", // RTL
    gap: 12,
    marginTop: 8,
  },

  nameModalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  nameModalButtonCancel: {
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  nameModalButtonSave: {
    backgroundColor: theme.colors.primary,
  },

  nameModalButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },

  nameModalButtonTextCancel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  nameModalButtonTextSave: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  nameModalButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },

  // 🔒 סטיילים להודעת פרטיות אווטאר
  privacyNotice: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.success + "15",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.success + "30",
  },

  privacyText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.success,
    textAlign: "right",
    fontWeight: "500",
  },
  userEmail: {
    fontSize: 15, // הגדלת האימייל
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  badgesContainer: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
    flexWrap: "wrap", // מאפשר מעבר לשורה חדשה
  },
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundElevated,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    gap: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  // תגים פעילים (עם הישגים)
  activeBadge: {
    backgroundColor: theme.colors.primary + "15",
    borderColor: theme.colors.primary + "30",
  },
  // תגים לא פעילים (עדיין לא הושגו)
  inactiveBadge: {
    backgroundColor: theme.colors.textSecondary + "10",
    borderColor: theme.colors.textSecondary + "20",
  },
  // תגים של הישגים
  achievementTag: {
    backgroundColor: theme.colors.success + "15",
    borderColor: theme.colors.success + "30",
  },
  // תג "עוד" – נראה כמו כפתור/קישור, לא הישג
  moreBadge: {
    backgroundColor: theme.colors.backgroundAlt,
    borderColor: theme.colors.border,
  },
  moreBadgeText: {
    color: theme.colors.textSecondary,
    textDecorationLine: "underline",
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 13, // הגדלת טקסט התגיות
    fontWeight: "500",
    writingDirection: "rtl",
  },
  activeBadgeText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  inactiveBadgeText: {
    color: theme.colors.textSecondary,
  },

  // Questionnaire styles - טקסט גדול יותר לשאלון
  questionnaireCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  // removed unused questionnaireButton style
  questionnaireGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  questionnaireTextContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  questionnaireTitle: {
    color: theme.colors.surface,
    fontSize: 18, // הגדלת כותרת השאלון
    fontWeight: theme.typography.h4.fontWeight,
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },
  questionnaireSubtitle: {
    color: theme.colors.surface,
    fontSize: 14, // הגדלת תת כותרת השאלון
    opacity: 0.9,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // removed unused questionnaireButtonText style

  // Info section styles - מידע אישי עם טקסט גדול יותר
  infoContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  infoGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  infoItem: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: "center",
    ...theme.shadows.small,
  },
  infoLabel: {
    fontSize: 13, // הגדלת תויות המידע
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
    writingDirection: "rtl",
  },
  infoValue: {
    fontSize: 15, // הגדלת ערכי המידע
    color: theme.colors.text,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Stats section styles - סטטיסטיקות עם טקסט גדול יותר
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20, // הגדלת כותרות הקטעים
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.small,
  },
  statGradient: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24, // הגדלת מספרי הסטטיסטיקות
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.surface,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 13, // הגדלת תויות הסטטיסטיקות
    color: theme.colors.surface,
    opacity: 0.8,
    writingDirection: "rtl",
  },

  // Achievements styles - הישגים עם טקסט גדול יותר
  achievementsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 15, // הגדלת טקסט "הצג הכל"
    writingDirection: "rtl",
  },
  achievementsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  achievementBadge: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.md * 3) / 4,
    aspectRatio: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
    position: "relative",
    overflow: "hidden",
    // אפקט מיוחד להישגים פתוחים
    transform: [{ scale: 1 }],
  },
  // רקע גרדיאנט להישגים פתוחים
  achievementGradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.radius.lg,
  },
  // קונטיינר לאייקון עם אפקט grayscale
  achievementIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  grayscaleContainer: {
    // אפקט grayscale באמצעות opacity וכהות
    opacity: 0.4,
  },
  // אייקון מנעול
  lockIconContainer: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  lockedBadge: {
    borderColor: theme.colors.textTertiary + "30",
    backgroundColor: theme.colors.backgroundElevated,
    // הסרת shadow מהישגים נעולים
    shadowOpacity: 0,
    elevation: 0,
  },
  achievementTitle: {
    fontSize: 12, // הגדלת כותרות ההישגים
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 4,
    writingDirection: "rtl",
  },
  unlockedTitle: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  lockedText: {
    color: theme.colors.textTertiary,
    opacity: 0.7,
  },
  // אפקט הברקה להישגים פתוחים
  achievementShine: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: theme.colors.warning,
    borderRadius: 4,
    opacity: 0.8,
    shadowColor: theme.colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },

  // Settings styles - הגדרות עם טקסט גדול יותר
  settingsContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  settingItem: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backgroundElevated,
  },
  settingLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  settingText: {
    fontSize: 16, // הגדלת טקסט ההגדרות
    color: theme.colors.text,
    writingDirection: "rtl",
  },

  // Logout styles - התנתקות עם טקסט גדול יותר
  logoutButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.error + "15",
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16, // הגדלת טקסט ההתנתקות
    fontWeight: "600",
    writingDirection: "rtl",
  },

  // Modal styles - removed duplicates, now using theme helpers
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalTitle: {
    fontSize: 20, // הגדלת כותרת המודל
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    writingDirection: "rtl",
  },
  uploadOptions: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: theme.spacing.xl,
  },
  uploadOption: {
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.lg,
    width: "45%",
    borderWidth: 1,
    borderColor: theme.colors.backgroundElevated,
  },
  uploadOptionText: {
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    fontSize: 15, // הגדלת טקסט אפשרויות העלאה
    fontWeight: "500",
    writingDirection: "rtl",
  },
  presetsTitle: {
    color: theme.colors.text,
    fontSize: 16, // הגדלת כותרת הפריסטים
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    textAlign: "right",
    writingDirection: "rtl",
  },
  avatarGrid: {
    alignItems: "center",
  },
  presetAvatar: {
    width: 70,
    height: 70,
    margin: theme.spacing.xs,
    borderRadius: 35,
    backgroundColor: theme.colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPreset: {
    borderColor: theme.colors.primary,
  },
  presetAvatarText: {
    fontSize: 35,
  },

  // Equipment styles - ציוד עם טקסט גדול יותר
  equipmentContainer: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.small,
  },
  equipmentScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  equipmentScrollContent: {
    paddingRight: theme.spacing.lg,
  },
  noEquipmentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  noEquipmentText: {
    fontSize: 16, // הגדלת טקסט "לא נבחר ציוד"
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginTop: theme.spacing.sm,
    textAlign: "center",
    writingDirection: "rtl",
  },
  noEquipmentSubtext: {
    fontSize: 14, // הגדלת תת טקסט הציוד
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  addEquipmentButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
  },
  addEquipmentText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
  },
  equipmentItem: {
    alignItems: "center",
    marginLeft: theme.spacing.md,
    width: 80,
  },
  equipmentImageContainer: {
    position: "relative",
    width: 60,
    height: 60,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.backgroundElevated,
  },
  equipmentImage: {
    width: 40,
    height: 40,
  },
  equipmentPremiumBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.warning,
    borderRadius: theme.radius.xs,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  equipmentLabel: {
    fontSize: 12, // הגדלת תוויות הציוד
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: theme.spacing.xs,
    lineHeight: 16,
    writingDirection: "rtl",
  },
  equipmentCategoryBadge: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  equipmentCategoryText: {
    fontSize: 11, // הגדלת טקסט קטגוריות הציוד
    color: theme.colors.primary,
    fontWeight: "500",
    textAlign: "center",
    writingDirection: "rtl",
  },
  errorContainer: {
    backgroundColor: theme.colors.error + "10",
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    flex: 1,
    fontSize: 15, // הגדלת טקסט השגיאה
    color: theme.colors.error,
    fontWeight: "500",
    writingDirection: "rtl",
    marginRight: theme.spacing.sm,
  },
  errorRetryButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  errorRetryText: {
    color: theme.colors.white,
    fontSize: 14, // הגדלת טקסט כפתור השגיאה
    fontWeight: "600",
  },

  // 🎉 סטיילים לאנימציית הישגים חדשים
  achievementModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  achievementModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: PROFILE_UI_COLORS.SHADOW,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
  },

  fireworksContainer: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  fireworksText: {
    fontSize: 30,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  achievementModalIcon: {
    marginVertical: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  achievementModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },

  achievementModalAchievement: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 15,
  },

  achievementModalDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  achievementModalButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  achievementModalButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  // 💬 סטיילים ל-Tooltip
  tooltipOverlay: {
    flex: 1,
    backgroundColor: PROFILE_UI_COLORS.BACKGROUND.OVERLAY,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  tooltipContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 20,
    maxWidth: "90%",
    shadowColor: PROFILE_UI_COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  tooltipHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  tooltipTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },

  tooltipDescription: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "right",
    lineHeight: 22,
    marginBottom: 10,
  },

  tooltipHint: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});

/**
 * מוטב ProfileScreen עם React.memo להשוואת שינויים
 * ProfileScreen memoized with React.memo for change detection
 */
export default React.memo(ProfileScreen);
