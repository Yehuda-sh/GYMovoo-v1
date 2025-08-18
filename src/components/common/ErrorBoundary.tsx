/**
 * @file src/components/common/ErrorBoundary.tsx
 * @brief Error Boundary גלובלי עם Fallback UI ידידותי ותמיכת RTL
 * @dependencies React, React Native, theme, errorHandler, logger
 * @notes תומך RTL, SafeAreaView, accessibility, כפתור נסה שוב
 */

import React, { Component, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { errorHandler } from "../../utils/errorHandler";
import { logger } from "../../utils/logger";

interface ErrorBoundaryState {
  hasError: boolean;
  details?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

/**
 * Error Boundary גלובלי עם UI fallback מותאם RTL
 * Global Error Boundary with RTL-adapted UI fallback
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // עדכון המצב כדי להציג fallback UI
    return {
      hasError: true,
      details: __DEV__ ? error.message : undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // דיווח שגיאה למערכת מרכזית
    errorHandler.reportError(error, {
      componentStack: errorInfo.componentStack,
      source: "ErrorBoundary",
    });

    // לוג מפורט למצב פיתוח
    logger.error("ErrorBoundary", "Component error caught", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, details: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {/* אייקון שגיאה */}
            <View style={styles.iconContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={64}
                color={theme.colors.error}
              />
            </View>

            {/* כותרת */}
            <Text style={styles.title}>
              {this.props.fallbackMessage || "משהו השתבש"}
            </Text>

            {/* הודעת משנה */}
            <Text style={styles.subtitle}>
              אנחנו עובדים על פתרון הבעיה. אנא נסה שוב.
            </Text>

            {/* פרטי שגיאה במצב פיתוח בלבד */}
            {__DEV__ && this.state.details && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>פרטי שגיאה (פיתוח):</Text>
                <Text style={styles.detailsText}>{this.state.details}</Text>
              </View>
            )}

            {/* כפתור נסה שוב */}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              accessibilityRole="button"
              accessibilityLabel="נסה שוב"
              accessibilityHint="מנסה לטעון מחדש את האפליקציה"
            >
              <Ionicons
                name="refresh-outline"
                size={20}
                color={theme.colors.background}
                style={styles.retryIcon}
              />
              <Text style={styles.retryText}>נסה שוב</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  detailsContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
    width: "100%",
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.warning,
    marginBottom: theme.spacing.sm,
  },
  detailsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // נגישות - מינימום 44px לגודל מגע
    minWidth: 120,
    ...theme.shadows.medium,
  },
  retryIcon: {
    marginRight: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
});
