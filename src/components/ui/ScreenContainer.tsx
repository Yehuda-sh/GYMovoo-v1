/**
 * @file src/components/ui/ScreenContainer.tsx
 * @brief מיכל מסך אוניברסלי עם header, scroll, ו-safe area + אופטימיזציה לכושר מובייל
 * @brief Universal screen container with header, scroll, safe area + mobile fitness optimization
 * @dependencies theme, SafeAreaView, KeyboardAvoidingView, LoadingSpinner, EmptyState, expo-haptics
 * @notes תומך ב-scroll, keyboard avoiding, pull to refresh, מצב אימון פעיל, haptic feedback
 * @notes Supports scroll, keyboard avoiding, pull to refresh, workout mode, haptic feedback
 * @recurring_errors וודא העברת header נכון, שימוש ב-scroll רק כשצריך, workoutMode לאימון פעיל
 * @updated 2025-08-14 Fitness mobile optimization, workout mode, haptic feedback, RTL fix, performance tracking
 */

import React, { ReactNode, useMemo, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../styles/theme";
import BackButton from "../common/BackButton";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

interface ScreenContainerProps {
  children: ReactNode;

  // Header options
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: ReactNode;

  // Container options
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  safeArea?: boolean;

  // Scroll options
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollContentStyle?: ViewStyle;

  // Style options
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  backgroundColor?: string;

  // Loading/Empty states - משופרות עם רכיבים משותפים
  // Enhanced with shared components
  loading?: boolean;
  loadingText?: string;
  loadingVariant?: "default" | "fade" | "pulse" | "dots";

  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
  emptyVariant?: "default" | "compact" | "minimal";

  // Accessibility & Testing
  testID?: string;
  headerTestID?: string;

  // Fitness Mobile Optimization (2025-08-14)
  workoutMode?: boolean; // מצב אימון פעיל - ללא גלילה, מיטוב מהירות
  enableHapticFeedback?: boolean; // משוב מושגי לפעולות
  enablePerformanceTracking?: boolean; // מדידת ביצועים אוטומטית
  trackingName?: string; // שם למעקב ביצועים
  quickActions?: ReactNode; // פעולות מהירות בתחתית מסך
}

export const ScreenContainer: React.FC<ScreenContainerProps> = React.memo(
  ({
    children,
    title,
    showBackButton = false,
    onBackPress,
    headerRight,
    scroll = false,
    keyboardAvoiding = false,
    safeArea = true,
    refreshing,
    onRefresh,
    scrollContentStyle,
    style,
    headerStyle,
    backgroundColor = theme.colors.background,
    loading = false,
    loadingText = "טוען...",
    loadingVariant = "default",
    empty = false,
    emptyTitle = "אין נתונים להצגה",
    emptyDescription,
    emptyIcon = "folder-open-outline",
    emptyVariant = "default",
    testID = "screen-container",
    headerTestID = "screen-header",
    // Fitness Mobile Optimization
    workoutMode = false,
    enableHapticFeedback = false,
    enablePerformanceTracking = false,
    trackingName,
    quickActions,
  }) => {
    // 🚀 מדידת ביצועים לאפליקציית כושר
    // Performance tracking for fitness app
    const startTime = useMemo(() => performance.now(), []);

    useEffect(() => {
      if (enablePerformanceTracking) {
        const renderTime = performance.now() - startTime;
        if (renderTime > 100) {
          console.warn(
            `⚠️ ${trackingName || "ScreenContainer"} איטי מדי: ${renderTime.toFixed(1)}ms`
          );
        }
      }
    }, [enablePerformanceTracking, trackingName, startTime]);

    // 🎯 פונקציית haptic feedback מותאמת
    // Optimized haptic feedback function
    const triggerHapticFeedback = useCallback(
      (type: "light" | "medium" | "heavy" = "light") => {
        if (enableHapticFeedback) {
          const feedbackTypes = {
            light: Haptics.ImpactFeedbackStyle.Light,
            medium: Haptics.ImpactFeedbackStyle.Medium,
            heavy: Haptics.ImpactFeedbackStyle.Heavy,
          };
          Haptics.impactAsync(feedbackTypes[type]);
        }
      },
      [enableHapticFeedback]
    );

    // 🎯 פונקציית חזרה עם haptic feedback
    // Back function with haptic feedback
    const handleBackPress = useCallback(() => {
      triggerHapticFeedback("light");
      onBackPress?.();
    }, [triggerHapticFeedback, onBackPress]);
    // 🎨 רכיב Header מבוזר // Optimized Header component
    const Header = useMemo(() => {
      if (!title && !showBackButton && !headerRight) return null;

      return (
        <View style={[styles.header, headerStyle]} testID={headerTestID}>
          {showBackButton && (
            <View style={styles.headerLeft}>
              <BackButton absolute={false} onPress={handleBackPress} />
            </View>
          )}

          {title && (
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle} testID={`${testID}-title`}>
                {title}
              </Text>
            </View>
          )}

          {headerRight && (
            <View style={styles.headerRight} testID={`${testID}-header-right`}>
              {headerRight}
            </View>
          )}
        </View>
      );
    }, [
      title,
      showBackButton,
      headerRight,
      headerStyle,
      handleBackPress,
      headerTestID,
      testID,
    ]);

    // 🎯 תוכן ראשי מאופטמז // Optimized Main content
    const MainContent = useMemo(() => {
      // הצגת LoadingSpinner משותף במקום קוד חוזר
      // Show shared LoadingSpinner instead of duplicate code
      if (loading) {
        return (
          <LoadingSpinner
            size="large"
            text={loadingText}
            variant={loadingVariant}
            fullScreen
            testID={`${testID}-loading`}
          />
        );
      }

      // הצגת EmptyState משותף במקום קוד חוזר
      // Show shared EmptyState instead of duplicate code
      if (empty) {
        return (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            variant={emptyVariant}
            testID={`${testID}-empty`}
          />
        );
      }

      if (scroll) {
        return (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, scrollContentStyle]}
            showsVerticalScrollIndicator={false}
            testID={`${testID}-scroll-view`}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing || false}
                  onRefresh={onRefresh}
                  tintColor={theme.colors.primary}
                  colors={[theme.colors.primary]}
                />
              ) : undefined
            }
          >
            {children}
          </ScrollView>
        );
      }

      return (
        <View style={styles.content} testID={`${testID}-content`}>
          {children}
        </View>
      );
    }, [
      loading,
      loadingText,
      loadingVariant,
      empty,
      emptyIcon,
      emptyTitle,
      emptyDescription,
      emptyVariant,
      scroll,
      scrollContentStyle,
      onRefresh,
      refreshing,
      children,
      testID,
    ]);

    // Container wrapper with memoization
    const Container = useMemo(
      () => (safeArea ? SafeAreaView : View),
      [safeArea]
    );

    // 🏋️ מצב אימון פעיל - אופטימיזציה מיוחדת לאפליקציות כושר
    // Workout Mode - Special optimization for fitness apps
    if (workoutMode) {
      return (
        <Container
          style={[
            styles.container,
            styles.workoutContainer,
            { backgroundColor },
            style,
          ]}
          testID={`${testID}-workout-mode`}
        >
          {Header}
          <View
            style={styles.workoutContent}
            testID={`${testID}-workout-content`}
          >
            {loading ? (
              <LoadingSpinner
                size="large"
                text={loadingText}
                variant={loadingVariant}
                fullScreen
                testID={`${testID}-loading`}
              />
            ) : empty ? (
              <EmptyState
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
                variant={emptyVariant}
                testID={`${testID}-empty`}
              />
            ) : (
              children
            )}
          </View>
          {quickActions && (
            <View
              style={styles.quickActionsFooter}
              testID={`${testID}-quick-actions`}
            >
              {quickActions}
            </View>
          )}
        </Container>
      );
    }

    const content = (
      <Container
        style={[styles.container, { backgroundColor }, style]}
        testID={testID}
      >
        {Header}
        {MainContent}
        {quickActions && (
          <View
            style={styles.quickActionsFooter}
            testID={`${testID}-quick-actions`}
          >
            {quickActions}
          </View>
        )}
      </Container>
    );

    // Keyboard avoiding wrapper
    if (keyboardAvoiding) {
      return (
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          testID={`${testID}-keyboard-avoiding`}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    minHeight: 56,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.title3.fontSize,
    fontWeight: theme.typography.title3.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl", // 🔴 RTL חובה לטקסטים עבריים
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  // 🏋️ Fitness App Workout Mode Styles
  workoutContainer: {
    // מצב אימון - אופטימיזציה מיוחדת
    backgroundColor: theme.colors.background,
  },
  workoutContent: {
    flex: 1,
    // ללא גלילה במצב אימון - הכל גלוי
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  quickActionsFooter: {
    // פעולות מהירות בתחתית - עקרון הנגישות של 44px מינימום
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    backgroundColor: theme.colors.background,
    minHeight: 60, // מינימום לכפתורים נגישים
  },
  // הוסרו styles של emptyContainer, emptyText, loadingContainer, loadingText
  // Removed duplicate styles - now using shared components
});

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
ScreenContainer.displayName = "ScreenContainer";

export default ScreenContainer;
